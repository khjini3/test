package com.yescnc.core.lib.fm.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.NavigableSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentNavigableMap;
import java.util.concurrent.ConcurrentSkipListMap;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.common.ServiceUtil;

public class FmEventCache 
{
	
	private static FmEventCache INSTANCE;
	public static int nLocalMsId = 0;
	
	private ConcurrentHashMap<Integer, ConcurrentSkipListMap<Long, FmEventVO>> hmEventCache;
	private FmMinSeqByMsIdCache fmMinSeqByMsIdCache = FmMinSeqByMsIdCache.getInstance();
	private ArrayList<Integer> alRemovedMsId = new ArrayList<>();
	
	private FmEventCache() {
		
		this.hmEventCache = new ConcurrentHashMap<>( FmFoo.BUFFER_OVER_FLOW_MAX_EVENT_CACHE_SIZE_LIMIT + (FmFoo.BUFFER_OVER_FLOW_MAX_EVENT_CACHE_SIZE_LIMIT /3), 0.75f, 80);
		
		// Load from Local Database
		this.initCache();
		
	}
	
	private void initCache() {
		
		// 1. Create CacheMap for MC Event and Alarms
		String strServerType = ServiceUtil.getServerType() == null ? "Default ms" : ServiceUtil.getServerType();
		//LogUtil.warning("[FmEventCache-Init] " + strServerType);
		this.createNewMsCache(-1);
		
		// 2. Create CacheMap for Local MS Event and Alarms
		nLocalMsId = EmsInfoList.getMsIdMyself();
		//LogUtil.info("[FmEventCache-nLocalMsId] " + nLocalMsId);
		if ( nLocalMsId == 0 ) {
			//LogUtil.warning("[FmEventCache-Init] [This MS is Before growed. There is no MS ID.]");
			return;
		} else {
			// First create own Cache 		
			this.createNewMsCache(nLocalMsId);
		}
		
		// 1. Compare Max Sequence and current client minimum sequence
		long nClientMinSeq = FmMinSeqByMsIdCache.getInstance().getMinSeqByMsId(nLocalMsId);
		long nCurMaxSeq = FmLocalSeqNoCache.getInstance().get();
		LogUtil.warning("[FmEventCache-Init] ( Local MS Min Seq = " + nClientMinSeq + " / nCurMaxSeq = " + nCurMaxSeq + " )");
		
		if ( nClientMinSeq >= nCurMaxSeq ) {
			LogUtil.warning("[FmEventCache-Init] Compelted. No need to select from DB.");
			return;
		}
		
		// 2. Read from database where upper sequence
		this.putEventToCacheFromDb(nLocalMsId, nClientMinSeq, nCurMaxSeq);
		
	}

	private void putEventToCacheFromDb(int nLocalMsId, long nClientMinSeq, long nCurMaxSeq) {
		
		// 1. Read from database where upper sequence & Insert to Cache
		HashMap<String, Object> hmSeqCond = new HashMap<>();
		hmSeqCond.put("strWhereCond", "seq_no");
		hmSeqCond.put("strOper", ">=");
		hmSeqCond.put("nSeq", nClientMinSeq);
		ArrayList<FmEventVO> alFmEventList = ContextWrapper.getInstance().getFmDaoFromContext().selectEventFmTableBySeq(hmSeqCond);
		
		// 2. Read cleared alarms from history table & Insert to Cache
		HashMap<String, Object> hmSeqClearCond = new HashMap<>();
		hmSeqClearCond.put("strWhereCond", "cleared_by_seq_no");
		hmSeqClearCond.put("strOper", ">=");
		hmSeqClearCond.put("nSeq", nClientMinSeq);
		ArrayList<FmEventVO> alFmClearAlarmList = ContextWrapper.getInstance().getFmDaoFromContext().selectEventFmTableBySeq(hmSeqClearCond);
		for ( FmEventVO fmEventDto : alFmClearAlarmList ) {
			fmEventDto.setSeqNo( fmEventDto.getClearSeq() );
			fmEventDto.setAlarmTime( fmEventDto.getClearTime() );
			fmEventDto.setSeverity( fmEventDto.getSeverity() + 10 );
			if ( fmEventDto.getClearType() == FmConstant.FM_CLEAR_TYPE_AUTO )
				fmEventDto.setDisplayType( FmConstant.DISPLAY_DBNOINSERT );
			else
				fmEventDto.setDisplayType( FmConstant.NODISPLAY_DBNOINSERT );
		}
		
		// 3. Merge Result
		alFmEventList.addAll(alFmClearAlarmList );
		
		// 4. Put to the Cache merged result
		for ( FmEventVO fmEventDto : alFmEventList )
			this.putEventToCache(nLocalMsId, fmEventDto);
		
		LogUtil.warning("[FmEventCache-Init] Compelted. Loaded Event cache ...\n" + alFmEventList);
		
	}

	public synchronized static FmEventCache getInstance() {
		if ( INSTANCE == null )
			INSTANCE = new FmEventCache();
		return INSTANCE;
	}
	
	public boolean isExistLvl1Id(int nLvl1Id) {
		return this.hmEventCache.containsKey(nLvl1Id);
	}
	
	public void createNewMsCache(int nMsId) {
		this.hmEventCache.put(nMsId, new ConcurrentSkipListMap<Long, FmEventVO>());
		LogUtil.warning("[FmEventCache] Creating Lvl1 ConcurrentSkipListMap for MS ID = " + nMsId);
	}
	
	// case of Local Server
	public void putEventToLocalCache(FmEventVO fmEventDto) 
	{
		putEventToCache(nLocalMsId, fmEventDto);
	}
	
	public boolean isOverFlow()
	{
		return FmFoo.MAX_POLL_EVENT_CACHE_SIZE_LIMIT < getTotalSize();
	}
	
	public void putEventToCache(int nMsId, FmEventVO fmEventDto)
	{
		long nMinSeq = this.fmMinSeqByMsIdCache.getMinSeqByMsId(nMsId);
		if ( nMinSeq <= fmEventDto.getSeqNo() || nMinSeq == Long.MAX_VALUE ) 
		{
			this.hmEventCache.get(nMsId).put(fmEventDto.getSeqNo(), fmEventDto);
		} else 
		{
			if ( this.hmEventCache.containsKey(nMsId) == false )
				LogUtil.warning("[WrongCase] Event Insertion is Denied (MS ID is not exist in hmEventCache) (MS ID : " + nMsId + ")");
			else
				LogUtil.warning("[WrongCase] Event Insertion is Denied. No need to insert Event. (MS ID : " + nMsId + " , MS MinSeq : " 
				        		+ nMinSeq + ", EventSeq : "+ fmEventDto.getSeqNo() + ")" );
		}
		
	}

	/**
	 * 1. Delete events which are not important during buffer over flow(BOF).
	 * 2. check still BOF
	 *   a. Get Least Performing Client[LPC] [client is not active or which request less polling due to buffer is not deleted]
	 *   b. Update BOF Flag to Least Performing Client[LPC]
	 *   c. Update last seq to Current Max seq of all MS and update the same to LPC.
	 *   
	 *   Note: In case of Polling request from LPC, then return BOF Flag. Otherwise client will be removed after Max Polling Interval.
	 *   Delete Alarms or Event automatically once Step 2.c is done by FmEventCacheManageThread.
	 *      
	 */
	public void handleBufferOverFlow()
	{
		// 1. Delete events which are not important during buffer over flow(BOF).
		dropEvents();
		// 2. check still BOF
		if( isOverFlow() )
		{
			// 2 a. Get Least Performing Client[LPC] [client is not active or which request less polling due to buffer is not deleted]
			// 2 b. Update BOF Flag to Least Performing Client[LPC]
			// 2 c. Update last seq to Current Max seq of all MS and update the same to LPC. In case buffer over is crossed more than
			// extreme limit, then consider oss,ms client also to delete.otherwise consider only web client.
			boolean isAllClientInclude = FmFoo.BUFFER_OVER_FLOW_MAX_EVENT_CACHE_SIZE_LIMIT < getTotalSize(); 
			FmClientCache.getInstance().dropEventsForLPC( getMaxSeqByMsIdMap(),isAllClientInclude);
		}
	}
	

	/**
	 * Drop only Events which can be dropped when buffer over flow
	 */
	private void dropEvents()
	{
		Set<Integer> msIdSet = hmEventCache.keySet();
		for( int msId :msIdSet )
		{
			List<Long> eventTobeDropped = new ArrayList<>();
			ConcurrentSkipListMap<Long, FmEventVO> concurrentSkipListMap = hmEventCache.get(msId);
			if( null != concurrentSkipListMap )
			{
				NavigableSet<Long> keySet = concurrentSkipListMap.keySet();
				for( long seqNo: keySet)
				{
					FmEventVO fmEventDto = concurrentSkipListMap.get(seqNo);
					if( null != fmEventDto
							&& fmEventDto.getEventType() == FmConstant.FM_TYPE_EVENT
							&& fmEventDto.getDisplayType() == FmConstant.DISPLAY_DBINSERT )
					{
						if( !FmFoo.BUFFER_OVERFLOW_FILTER_EVENT_ID.contains(fmEventDto.getAlarmId()))
						{
							eventTobeDropped.add(fmEventDto.getSeqNo());
						}
					}
				}
				if( !eventTobeDropped.isEmpty())
				{
					ConcurrentSkipListMap<Long, FmEventVO> skipCache = this.hmEventCache.get(msId);
					if (skipCache != null) 
					{
						try
						{
						// Drop events
							for( Long seqId :eventTobeDropped )
							{
								skipCache.remove(seqId);
							}
						}
						catch(Exception e )
						{
							e.printStackTrace();
						}
					}
				}
				
			}
		}
		
	}

	public void removeMsInCache(int nMsId) {
		LogUtil.warning("[FmEventCache] Cache is Deleted. MS ID : " + nMsId);
		this.alRemovedMsId.add(nMsId);
		this.hmEventCache.remove(nMsId);
	}

	public void removeUslessMsCache( Set<Integer> setClientMsId) {
		
		for ( Integer nCachedMsId : this.hmEventCache.keySet() ) {
			if ( setClientMsId.contains(nCachedMsId) == false && this.hmEventCache.get(nCachedMsId).isEmpty() == false ) {
				LogUtil.warning("[FmEventCache] Clear MS ID Cache : " + nCachedMsId);
				this.hmEventCache.get(nCachedMsId).clear();
			}
		}
		
	}
	
	public ConcurrentNavigableMap<Long, FmEventVO> getEventInCacheUpperSeq(int nMsId, long nSeq) {
		return this.hmEventCache.get(nMsId).tailMap(nSeq, false);
	}

	public ConcurrentNavigableMap<Long, FmEventVO> getEventInCacheUpperSeq(int nMsId, long nFromSeq, int limit )
	{
		ConcurrentNavigableMap<Long, FmEventVO> eventCacheByCount = new ConcurrentSkipListMap<>();
		if( limit > 0 )
		{
			ConcurrentNavigableMap<Long, FmEventVO> concurrentSkipListMap = hmEventCache.get(nMsId).tailMap(nFromSeq, false);
			
			long size = concurrentSkipListMap.size();
			// In case of number of elements in cache is more than required client polling limit
			if( size > limit )
			{
				/**
				 * Will take all available alarms/events from cache. Even overflow case, FmEventDto may be null if it is deleted 
				 * from buffer over flow case.so null check is required.
				 */
				NavigableSet<Long> keySet = concurrentSkipListMap.keySet();
				int count = 0;
				for( Long seq: keySet)
				{
					FmEventVO fmEventDto = concurrentSkipListMap.get(seq);
					if( null != fmEventDto )
					{
						eventCacheByCount.put(seq, fmEventDto);
						count++;
					}
					// break when reached limit
					if( count == limit )
					{
						break;
					}
				}
			}
			else
				/** In case of queue size is lesser than client polling limit,then return all.
				 *  Event nFromSeq is removed, it will return all alarms from that id[nFromSeq] to end.
				 */
			{
				eventCacheByCount = hmEventCache.get(nMsId).tailMap(nFromSeq, false);
			}
		}
		return eventCacheByCount; 
	}

	public void removeEventInCacheBelowSeq(int nMsId, long nSeq)
	{
		ConcurrentSkipListMap<Long, FmEventVO> skipCache = this.hmEventCache.get(nMsId);
		if (skipCache != null) {
			ConcurrentNavigableMap<Long, FmEventVO> cvmDeleted = skipCache.headMap(nSeq);
			for ( Map.Entry<Long, FmEventVO> entry : cvmDeleted.entrySet() ) {
				skipCache.remove(entry.getKey());
			}
		}
	}

	public void clearEventCache() 
	{
		
		for ( ConcurrentSkipListMap<Long, FmEventVO> cache : this.hmEventCache.values() )
			cache.clear();
		
	}
	
	public int getTotalSize() {
		
		int nSum = 0;
		for ( Map.Entry<Integer, ConcurrentSkipListMap<Long, FmEventVO>> entry : this.hmEventCache.entrySet() ) {
			nSum += entry.getValue().size();
		}
		return nSum;
		
	}
	
	@Override
	public String toString() {
		return this.hmEventCache.toString();
	}
	
	public boolean isRemovedMsId(int nMsId) {
		return alRemovedMsId.contains(nMsId);
	}
	
	public HashMap<Integer, Long> getMaxSeqByMsIdMap() {
		
		HashMap<Integer, Long> hmMaxSeqByMsId = new HashMap<>();
		for ( Entry<Integer, ConcurrentSkipListMap<Long, FmEventVO>> entry : hmEventCache.entrySet() ) {
			if ( entry.getValue().isEmpty() ) {
				hmMaxSeqByMsId.put( entry.getKey(), 0l);
			} else if ( entry.getValue().lastEntry() != null ) 
				hmMaxSeqByMsId.put( entry.getKey(), entry.getValue().lastEntry().getValue().getSeqNo() );
		}
		
		return hmMaxSeqByMsId;
		
	}
	
	public static void main(String[] args) {
		
		ConcurrentSkipListMap<Integer, Long> testSkip = new ConcurrentSkipListMap<>();
		testSkip.put(1, 1l);
		testSkip.put(2, 2l);
		testSkip.put(4, 4l);
		testSkip.put(3, 3l);
		
		System.out.println( testSkip.tailMap(2, false) );
		System.out.println( testSkip.headMap(2) );
		
	}
	
}
