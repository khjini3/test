package com.yescnc.core.lib.fm.cache;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import com.yescnc.core.util.common.LogUtil;

public class FmMinSeqByMsIdCache {
	
	private static FmMinSeqByMsIdCache INSTANCE;
	private ConcurrentHashMap<Integer, Long> hmMinSeqCacheByMsId;
	
	private FmMinSeqByMsIdCache() {
		
		try {
			this.setHmMinSeqCacheByMsId( FmClientCache.getInstance().getMinSeqByMsId() );
		} catch (IOException e) {
			LogUtil.warning(e);
			//e.printStackTrace();
		}
		
	}
	
	public synchronized static FmMinSeqByMsIdCache getInstance() {
		if ( INSTANCE == null )
			INSTANCE = new FmMinSeqByMsIdCache();
		return INSTANCE;
	}
	
	public long getMinSeqByMsId(int nMsId) {
		LogUtil.info("hmMinSeqCacheByMsId: " + hmMinSeqCacheByMsId + ", nMsId = " + nMsId);
		return this.hmMinSeqCacheByMsId.get(nMsId) == null ? Long.MAX_VALUE : this.hmMinSeqCacheByMsId.get(nMsId);
	}
	
	public void setHmMinSeqCacheByMsId(ConcurrentHashMap<Integer, Long> hmMinSeqCacheByMsId) {
		this.hmMinSeqCacheByMsId = hmMinSeqCacheByMsId;
	}
	
	public Set<Integer> getMsIdSet() {
		return this.hmMinSeqCacheByMsId.keySet();
	}
	
	public boolean isEmpty() {
		return this.hmMinSeqCacheByMsId.isEmpty();
	}
	
	public boolean isExistMsId(int nMsId) {
		return this.hmMinSeqCacheByMsId.containsKey(nMsId);
	}
	
	@Override
	public String toString() {
		return this.hmMinSeqCacheByMsId.toString();
	}
	
}
