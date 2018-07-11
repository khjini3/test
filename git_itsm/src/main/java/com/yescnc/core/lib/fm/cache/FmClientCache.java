package com.yescnc.core.lib.fm.cache;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;

public class FmClientCache {

	private static FmClientCache INSTANCE;
	private ConcurrentHashMap<Integer, FmClientVO> hmClientCache;
	private FmDao fmDao;

	private FmClientCache() {

		LogUtil.info("[FmClientCache-Init] fmDao.selectAllFmClient() start...SRKIM");

		this.fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
		ArrayList<FmClientVO> alClientList = this.fmDao.selectAllFmClient();
		this.hmClientCache = new ConcurrentHashMap<>(60, 0.75f, 64);
		Date currentDate = Calendar.getInstance().getTime();

		for (FmClientVO fmClientDto : alClientList) {
			Date updateTime = FmUtil.parseStringToDate(fmClientDto.getLastUpdateTime());
			long nDiff = currentDate.getTime() - updateTime.getTime();
			if (nDiff > FmConstant.CLIENT_RE_LOGIN_TIMEOUT)
				this.fmDao.deleteFmClient(fmClientDto.getClientId());
			else
				this.hmClientCache.put(fmClientDto.getClientId(), fmClientDto);
		}
		LogUtil.info("[FmClientCache-Init] " + hmClientCache.toString());

	}

	public synchronized static FmClientCache getInstance() {
		if (INSTANCE == null)
			INSTANCE = new FmClientCache();
		return INSTANCE;
	}

	public boolean isExistClientIdInCache(int nClientId) {
		return hmClientCache.containsKey(nClientId);
	}

	public FmClientVO getClientDtoById(int nClientId) {
		return hmClientCache.get(nClientId);
	}

	public FmClientVO getClientDtoByIpAddr(String strIpAddr) {

		for (FmClientVO fmClientDto : hmClientCache.values()) {
			if (fmClientDto.getStrIpAddr().contentEquals(strIpAddr))
				return fmClientDto;
		}
		return null;

	}

	public FmClientVO getClientDtoByClientType(int nClientType) {

		for (FmClientVO fmClientDto : hmClientCache.values()) {
			if (fmClientDto.getClientType() == nClientType)
				return fmClientDto;
		}
		return null;

	}

	public void refreshClientInCache(int nClientId, String strLastSeqByMsId) {

		// 1. Get Object from Cache
		FmClientVO fmClientDto = hmClientCache.get(nClientId);
		this.fmDao.updateFmClient(fmClientDto);

		// 2. Update Object in Cache
		fmClientDto.updateLastSeqAndTime(strLastSeqByMsId);

	}

	public void removeClinetInCache(int nClientId) {
		this.fmDao.deleteFmClient(nClientId);
		hmClientCache.remove(nClientId);
	}

	public FmClientVO putClientToCache(String strLastSeqWithMsId, int nClientType, String strIpAddr) {

		// 1. Create POJO Cache Object
		FmClientVO fmClientDto = new FmClientVO();
		fmClientDto.setLastSeqWithMsId(strLastSeqWithMsId);
		fmClientDto.setClientType(nClientType);
		fmClientDto.setLastUpdateTime(FmUtil.getCurTimeOfEventTimeFmt());
		fmClientDto.setStrIpAddr(strIpAddr);

		// 2. Insert Client into Database
		FmDao fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
		fmDao.insertFmClient(fmClientDto); // Automatically Set ClientID

		// 3. Keep Caching object in memory
		this.hmClientCache.put(fmClientDto.getClientId(), fmClientDto);

		return fmClientDto;

	}

	public Collection<FmClientVO> getCurClientList() {
		return this.hmClientCache.values();
	}

	public ConcurrentHashMap<Integer, Long> getMinSeqByMsId()
			throws JsonParseException, JsonMappingException, IOException {

		ConcurrentHashMap<Integer, Long> hmMinSeqByMsId = new ConcurrentHashMap<>();

		/**
		 * JLM: Synchronization performed on Lock (JLM_JSR166_LOCK_MONITORENTER)
		 * 
		 * This method performs synchronization an object that implements
		 * java.util.concurrent.locks.Lock. Such an object is locked/unlocked
		 * using acquire()/release() rather than using the synchronized (...)
		 * construct.
		 */
		// synchronized (this.hmClientCache)
		{

			for (Map.Entry<Integer, FmClientVO> entry : this.hmClientCache.entrySet()) {

				//LogUtil.info("ConcurrentHashMap() SRKIM getLastSeqWithMsId() = " + entry.getValue().getLastSeqWithMsId());
				//LogUtil.info("ConcurrentHashMap() SRKIM DTO = " + entry.getValue().toString());
				HashMap<Integer, Long> hmLastSeqByMsId = FmUtil.convertJsonStringToSeqMap(entry.getValue().getLastSeqWithMsId());

				// synchronized (hmLastSeqByMsId)
				{
					for (Map.Entry<Integer, Long> innerEntry : hmLastSeqByMsId.entrySet()) {

						if (hmMinSeqByMsId.containsKey(innerEntry.getKey())) {

							if (hmMinSeqByMsId.get(innerEntry.getKey()) > innerEntry.getValue()) {
								hmMinSeqByMsId.put(innerEntry.getKey(), innerEntry.getValue());
							}

						} else {
							hmMinSeqByMsId.put(innerEntry.getKey(), innerEntry.getValue());
						}

					}
				}

			}

		}

		return hmMinSeqByMsId;

	}

	public boolean isEmpty() {
		return this.hmClientCache.isEmpty();
	}

	@Override
	public String toString() {
		return this.hmClientCache.toString();
	}

	/**
	 * To get Least Performing client which makes buffer full due to client may
	 * be in active or not polling continuously.
	 * 
	 * Each client objects stores each MS seq no which was sent to client.
	 * 
	 * @return
	 */
	public FmClientVO getLPClient(HashMap<Integer, Long> maxSeqByMs, boolean isAllClientInclude) {
		List<FmClientVO> clientList = new ArrayList<>(getCurClientList());

		int size = clientList.size();

		long seqGap = 0;
		long temp = Integer.MIN_VALUE;
		FmClientVO leastPerformingClient = null;
		for (int index = 0; index < size; index++) {
			FmClientVO fmClientDto = clientList.get(index);
			// if all client is not supported, take only web client. All clinet
			// will be enabled if buffer size is going more
			// than extreme limit
			if (isAllClientInclude || fmClientDto.getClientType() == FmConstant.CLIENT_WEB) {
				temp = FmUtil.getSeqGap(fmClientDto, maxSeqByMs);
				if (temp > seqGap) {
					leastPerformingClient = fmClientDto;
					seqGap = temp;
				}
			}
		}
		return leastPerformingClient;
	}

	/**
	 * a. Get Least Performing Client[LPC] [client is not active or which
	 * request less polling due to buffer is not deleted] b. Update BOF Flag to
	 * Least Performing Client[LPC] c. Update last seq to Current Max seq of all
	 * MS and update the same to LPC.
	 */
	public void dropEventsForLPC(HashMap<Integer, Long> maxSeqByMs, boolean isAllClientInclude) {
		LogUtil.warning("[FmClientCache-dropEventsForLPC] Max Seq by MS: " + maxSeqByMs.toString()
				+ ",isAllClientInclude=" + isAllClientInclude);
		FmClientVO lpClient = getLPClient(maxSeqByMs, isAllClientInclude);
		if (null != lpClient) {
			LogUtil.warning("[FmClientCache-dropEventsForLPC] Least Performing Client: " + lpClient.getClientId());
			lpClient.setBufferOver(true);
			String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(maxSeqByMs);
			lpClient.setLastSeqWithMsId(strLastSeqWithMsId);
			this.fmDao.updateFmClient(lpClient);
		}
	}

}
