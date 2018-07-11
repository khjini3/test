package com.yescnc.core.lib.fm.alarm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentNavigableMap;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.util.MessageConstant;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.lib.fm.util.MsgResult;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;



public abstract class AbstPollEvent
{

	protected abstract FmClientVO getLoginedFmClientDto(Map<String, Object> message) throws Exception;

	protected abstract FmClientVO processClientLogin(Map<String, Object> message) throws Exception;
	

	protected void manageClientLogin(Map<String, Object> message) throws Exception
	{

		@SuppressWarnings("unchecked")
		HashMap<String, Object> hmBody = (HashMap<String, Object>) message;
		FmClientVO fmClientDto = this.getLoginedFmClientDto(message);

		if (fmClientDto == null)
		{
			// 1. if first login Client
			fmClientDto = this.processClientLogin(message);
			hmBody.put(MsgKey.CLIENT_ID, fmClientDto.getClientId());
			hmBody.put(MsgKey.SEQ_NO, fmClientDto.getLastSeqWithMsId());
		}

		if (hmBody.containsKey(MsgKey.CLIENT_ID) == false)
			hmBody.put(MsgKey.CLIENT_ID, fmClientDto.getClientId());

		if (hmBody.containsKey(MsgKey.SEQ_NO) == false)
			hmBody.put(MsgKey.SEQ_NO, fmClientDto.getLastSeqWithMsId());

		// case of DAEMON process polling
		if (hmBody.containsKey(MsgKey.DAEMON_ID))
		{
			int nDaemonId = (int) hmBody.get(MsgKey.DAEMON_ID);
			int nClientId = (int) hmBody.get(MsgKey.CLIENT_ID);

			// After EMS restart... first polling, DAEMON's CLIENT.ID will come
			// -1.
			if (nClientId == -1)
			{
				hmBody.put(MsgKey.CLIENT_ID, fmClientDto.getClientId());
				hmBody.put(MsgKey.SEQ_NO, fmClientDto.getLastSeqWithMsId());

				LogUtil.warning("[ClientLogin][DAEMON."
						+ hmBody.get(MsgKey.DAEMON_ID) + "] CLIENT.ID="
						+ hmBody.get(MsgKey.CLIENT_ID) + ", SEQ.NO="
						+ hmBody.get(MsgKey.SEQ_NO));
			}

			// mf.oss DAEMON
			if (nDaemonId == FmConstant.CLIENT_DAEMON_MD)
			{
				String orgSeqNo = hmBody.get(MsgKey.SEQ_NO).toString();
				String newSeqNo = getStrLastSeqByMsIdForOss(orgSeqNo);

				if (!orgSeqNo.equals(newSeqNo))
				{
					LogUtil.warning("[ClientLogin][INFO] old SEQ.NO : "
							+ orgSeqNo);
					LogUtil.warning("[ClientLogin][INFO] new SEQ.NO : "
							+ newSeqNo);

					hmBody.put(MsgKey.SEQ_NO, newSeqNo);

					LogUtil.warning("[ClientLogin][DAEMON."
							+ hmBody.get(MsgKey.DAEMON_ID) + "] CLIENT.ID="
							+ hmBody.get(MsgKey.CLIENT_ID) + ", SEQ.NO="
							+ hmBody.get(MsgKey.SEQ_NO)
							+ " // SEQ.NO is changed.");
				}
			}
		}
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> getEventsFromCache( Map<String, Object> message) throws Exception
	{

		// Manage Client ID and Sequence Number by Client type which is defined
		// in subclass
		this.manageClientLogin(message);

		HashMap<String, Object> inputBody = (HashMap<String, Object>) message;
		//System.out.println("===========================>" + inputBody);
		int nClientId = (int) inputBody.get(MsgKey.CLIENT_ID);
		String strLastSeqByMsId = inputBody.get(MsgKey.SEQ_NO).toString();

		// find this request is MS Polling Request or Not
		boolean isNeedToReturnDtoInstance = isNeedToReturnDtoInstance(message);

		FmClientVO loginedFmClientDto = getLoginedFmClientDto(message);
		boolean isBufferOverFlow = false;//= loginedFmClientDto.isBufferOver();
		// 1. Update Client List Cache
		if (FmClientCache.getInstance().isExistClientIdInCache(nClientId))
			FmClientCache.getInstance().refreshClientInCache(nClientId, strLastSeqByMsId);
		else
		{
			// When Unknown Client ID is received then return client id -1
			LogUtil.warning("[Error] Unknown Client ID is delivered ****************************8 : "
					+ nClientId);
			return FmUtil.getRspnsMsgMap(message, MsgResult.NOK,
					"[Error] Unknown Client ID is delivered");
		}

		// 2. Get Event From Cache
		//ArrayList<ArrayList<Object>> alPollingResult = new ArrayList<>();
		ArrayList<Object> alPollingResult = new ArrayList<>();// <--
																			// Returned
																			// Data
		ArrayList<FmEventVO> alMsPollingResult = new ArrayList<>(); // <--
																		// Returned
																		// Data
																		// for
																		// MS
																		// Polling
		ArrayList<Long> alSeqNo = new ArrayList<>();

		// TreeMap<String, ArrayList<Object>> alPollingResult = new TreeMap<>();
		// // <-- Returned Data

		LogUtil.warning("[AbstPollEvent] getEventInCache start.. ");
		HashMap<Integer, Long> hmPollLastSeqByMsId = getEventInCache(
				strLastSeqByMsId, isNeedToReturnDtoInstance, alPollingResult,
				alMsPollingResult, alSeqNo);

		String strLasSeq = hmPollLastSeqByMsId.isEmpty() ? strLastSeqByMsId
				: FmUtil.convertSeqMapToJsonString(hmPollLastSeqByMsId);

		// Make Return Values
		HashMap<String, Object> rtnMap = new HashMap<>();
		HashMap<String, Object> bodyMap = new HashMap<>();
		bodyMap.put(MsgKey.SEQ_NO, strLasSeq); // example :
												// {"1":1,"2":2,"3":3,"4":4}
		bodyMap.put(MsgKey.CLIENT_ID, nClientId);
		bodyMap.put(MsgKey.OVER_FLOW_FLAG, isBufferOverFlow);
		
		alMsPollingResult = updateLocationAliasForEMSAlarms(alMsPollingResult);
		
		if (isNeedToReturnDtoInstance)
			bodyMap.put("EVENT.LIST", alMsPollingResult);
		else
			bodyMap.put("EVENT.LIST", alPollingResult.toArray());

		rtnMap.put(MsgKey.BODY, bodyMap);
		rtnMap.put(MsgKey.RESULT, MsgResult.OK);
		rtnMap.put(MsgKey.MSG_NAME, "PollEventInfo");

		// reset buffer over flow flag;
		if( isBufferOverFlow)
		{
			loginedFmClientDto.setBufferOver(false);
		}
		// Log polling result
		StringBuilder sb = new StringBuilder();
		Map body = message;
		
		if (body != null && isNeedToReturnDtoInstance)
		{
			sb.append("[PollingResult] CLIENT.ID=").append(nClientId)
					.append(", MS.ID=").append(body.get("REQUEST.MS_ID"))
					.append(", SRC.IP=").append(body.get(MsgKey.SRC_IP))
					.append(", EVENT.LIST.SIZE=").append(alSeqNo.size())
					.append(", EVENT.LIST.SEQ=").append(alSeqNo)
					.append(", OVER_FLOW_FLAG=").append(isBufferOverFlow);
		} else
		{
			String strLoginId = inputBody.get(MsgKey.SRC_ID) == null ? "NULL_ID"
					: inputBody.get(MsgKey.SRC_ID).toString();
			String strLoginIp = inputBody.get(MsgKey.SRC_IP) == null ? "NULL_IP"
					: inputBody.get(MsgKey.SRC_IP).toString();

			sb.append("[PollingResult] CLIENT.ID=").append(nClientId)
					.append(", SRC.ID=").append(strLoginId).append(", SRC.IP=")
					.append(strLoginIp).append(", EVENT.LIST.SIZE=")
					.append(alSeqNo.size()).append(",OVER_FLOW_FLAG=").append(isBufferOverFlow).append(", EVENT.LIST.SEQ=")
					.append(alSeqNo);
		}
		LogUtil.warning(sb.toString());

		message = rtnMap;
		return FmUtil.getRspnsMsgMap(message, MessageConstant.MSG_RESULT_OK, null);
	}

	/**
	 * Location alias needs to be changed for mf.svc flow for ems alarm only. This is only for domestic customers. It is not requried for other flow 
	 * such as client polling and ms polling, mf.oss polling. so only overwrite in mf.svc flow.
	 * 
	 * 
	 * @param alMsPollingResult
	 * @return 
	 */
	protected ArrayList<FmEventVO> updateLocationAliasForEMSAlarms(ArrayList <FmEventVO> alMsPollingResult)
	{
		return alMsPollingResult;
	}
	
	private boolean isNeedToReturnDtoInstance(Map<String, Object> message)
	{
		boolean isNeedToReturnDtoInstance = false;
		Map body = message;
		
		if (body != null && body.containsKey(MsgKey.DAEMON_ID))
		{
			int nClientType = (int) body.get(MsgKey.DAEMON_ID);
			if (nClientType == FmConstant.CLIENT_DAEMON_MS
					|| nClientType == FmConstant.CLIENT_DAEMON_SVC)
				isNeedToReturnDtoInstance = true;
		} else if (body.containsKey(MsgKey.RESULT_FORMAT)
				&& body.get(MsgKey.RESULT_FORMAT) == MsgKey.RESULT_FORMAT_OBJ)
		{
			isNeedToReturnDtoInstance = true;
		}
		return isNeedToReturnDtoInstance;
	}

	/**
	 * This method to take only bottom N alarms( Client polling limit,default is
	 * 100, for other is 10000). when alarm count is more than limit, then it will take only polling
	 * limit count alarms/events from event cache. Remaining alarms will be
	 * taken from next polling alarms.
	 * 
	 */
	
	protected HashMap<Integer, Long> getEventInCache(String strLastSeqByMsId,
			boolean isNeedToReturnDtoInstance,
			ArrayList<Object> alPollingResult,
			ArrayList<FmEventVO> alMsPollingResult, ArrayList<Long> alSeqNo)
			throws JsonParseException, JsonMappingException, IOException
	{
		HashMap<Integer, Long> hmPollLastSeqByMsId = new HashMap<>();
		HashMap<Integer, Long> hmSeqByMsId = FmUtil.convertJsonStringToSeqMap(strLastSeqByMsId);

		int remainingEventPollingSize = getPollingResponseMaxSize();
		// 3. Get Contents from Cache by MS ID.
		for (Map.Entry<Integer, Long> entry : hmSeqByMsId.entrySet())
		{

			int nMsId = entry.getKey();
			long nRqstLastSeq = entry.getValue();

			/**
			 * Buffer overflow may delete alarms or event at same time. but
			 * iterator's can not be synced. In case of exception is happened,it
			 * will be adjusted from next polling interval.
			 */
			try
			{

				if (FmEventCache.getInstance().isExistLvl1Id(nMsId) == false)
				{
					LogUtil.warning("[PollEventToWeb] Unknown MS ID Polling Request is received. (MS ID : " + nMsId + ")");
					hmPollLastSeqByMsId.put(nMsId, nRqstLastSeq);
					continue;
				}
				if (remainingEventPollingSize <= 0)
				{
					LogUtil.warning("[PollEventToWeb] Number of records Crossed Polling Limit,so ignore events from : " + nMsId + ")");
					hmPollLastSeqByMsId.put(nMsId, nRqstLastSeq);
					continue;
				}
				ConcurrentNavigableMap<Long, FmEventVO> hmMsEvents = FmEventCache.getInstance().getEventInCacheUpperSeq(nMsId,nRqstLastSeq,remainingEventPollingSize);

				if (hmMsEvents.isEmpty() == false)
				{
					ConcurrentNavigableMap<Long, FmEventVO> descendingMap = hmMsEvents.descendingMap();
					Collection<FmEventVO> col = descendingMap.values();

					int eventSize = col.size();
					// Skip alarms/Events which are more than Polling Limit
					remainingEventPollingSize = remainingEventPollingSize - eventSize;
					long nPollLastSeq = descendingMap.firstKey();

					for (FmEventVO fmEventDto : col)
					{

						alSeqNo.add(fmEventDto.getSeqNo());

						// Put Polling Result to Map
						if (isNeedToReturnDtoInstance)
							alMsPollingResult.add(fmEventDto);
						else
							alPollingResult.add(FmUtil.parsefmEventDtoToJsonString(fmEventDto));

					}

					hmPollLastSeqByMsId.put(nMsId, nPollLastSeq);

				}

				// if there is no events in cache case, then just put sequence
				// number
				if (hmPollLastSeqByMsId.containsKey(nMsId) == false)
				{
					hmPollLastSeqByMsId.put(nMsId, nRqstLastSeq);
				}
			} catch (Exception e)
			{

				LogUtil.warning("Exception in PollEvent" + e.getMessage());
				LogUtil.warning(e) ;
				if (hmPollLastSeqByMsId.containsKey(nMsId) == false)
				{
					hmPollLastSeqByMsId.put(nMsId, nRqstLastSeq);
				}
			}
		}
		return hmPollLastSeqByMsId;
	}

	abstract protected int getPollingResponseMaxSize();
	

	private String getStrLastSeqByMsIdForOss(String strLastSeqByMsId)
	{
		String newSeqNo = strLastSeqByMsId;

		try
		{
			HashMap<Integer, Long> hmPollSeqByMsId = FmUtil
					.convertJsonStringToSeqMap(strLastSeqByMsId);
			HashMap<Integer, Long> hmMaxSeqByMsId = FmEventCache.getInstance()
					.getMaxSeqByMsIdMap();

			ArrayList<Integer> alSeqLvl1Id = new ArrayList<>();
			for (Map.Entry<Integer, Long> entry : hmPollSeqByMsId.entrySet())
			{
				alSeqLvl1Id.add(entry.getKey());
			}
			// apply removed MS
			for (Integer id : alSeqLvl1Id)
			{
				if (!hmMaxSeqByMsId.containsKey(id)
						&& FmEventCache.getInstance().isRemovedMsId(id))
				{
					hmPollSeqByMsId.remove(id);
					LogUtil.warning("[ClientLogin][INFO] remove MS : " + id);
				}
			}

			// apply new MS
			int nLvl1Id = 0;
			for (Map.Entry<Integer, Long> entry : hmMaxSeqByMsId.entrySet())
			{
				nLvl1Id = entry.getKey();
				if (!hmPollSeqByMsId.containsKey(nLvl1Id))
				{
					hmPollSeqByMsId.put(nLvl1Id, new Long(0));
					LogUtil.warning("[ClientLogin][INFO] add new MS : " + nLvl1Id);
				}
			}

			newSeqNo = FmUtil.convertSeqMapToJsonString(hmPollSeqByMsId);

		} catch (Exception e)
		{
			e.printStackTrace();
		}

		return newSeqNo;
	}

}
