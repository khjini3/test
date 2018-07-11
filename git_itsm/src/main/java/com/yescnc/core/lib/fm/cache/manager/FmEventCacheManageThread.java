package com.yescnc.core.lib.fm.cache.manager;

import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.cache.FmMinSeqByMsIdCache;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;

public class FmEventCacheManageThread extends Thread 
{
	
	private FmMinSeqByMsIdCache fmMinSeqByMsIdCache;
	private FmEventCache fmEventCache;
	private FmClientCache fmClientCache;
	private boolean isBOF= false;
	public FmEventCacheManageThread() 
	{
		
		this.fmEventCache = FmEventCache.getInstance();
		this.fmMinSeqByMsIdCache = FmMinSeqByMsIdCache.getInstance();
		this.fmClientCache=FmClientCache.getInstance();
	}

	@Override
	public void run() {
		
		while ( true ) {
			
			try {
				
				if( !isBOF )
				{
					// default value is 5 seconds
					Thread.sleep(FmFoo.THREAD_TIMER_INTERVAL_EVENT_CACHE_CHECK);
					// Step 1: update minimum seq no for each MS based on Client polling 
					this.fmMinSeqByMsIdCache.setHmMinSeqCacheByMsId( this.fmClientCache.getMinSeqByMsId() );
					
					if ( this.fmMinSeqByMsIdCache.isEmpty() ) 
					{
						this.fmEventCache.clearEventCache();
						continue;
					}
				}
				// Handle buffer over flow
				isBOF =fmEventCache.isOverFlow();
				if( isBOF )
				{
					fmEventCache.handleBufferOverFlow();
					// after buffer over flow Least performing seq no will be reset. so min seq cache needs to be updated to deleted
					// events/alarms
					this.fmMinSeqByMsIdCache.setHmMinSeqCacheByMsId( this.fmClientCache.getMinSeqByMsId() );
					if ( this.fmMinSeqByMsIdCache.isEmpty() ) 
					{
						this.fmEventCache.clearEventCache();
						continue;
					}
				}
				// End to handle buffer over flow
				
				// Deleted old events from event cache based on client min seq id
				for ( int nMsId : this.fmMinSeqByMsIdCache.getMsIdSet() ) 
				{
					long nMinSeqNo = this.fmMinSeqByMsIdCache.getMinSeqByMsId(nMsId);
					this.fmEventCache.removeEventInCacheBelowSeq(nMsId, nMinSeqNo);
				}
				
				// Drop useless event cache 
				this.fmEventCache.removeUslessMsCache( this.fmMinSeqByMsIdCache.getMsIdSet() );
				
				
			} catch (Exception e) 
			{
				LogUtil.warning(e); 
				//e.printStackTrace();
			} finally {
				
			}
			
		}
		
	}
	
}
