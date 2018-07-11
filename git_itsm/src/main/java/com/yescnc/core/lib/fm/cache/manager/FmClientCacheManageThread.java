package com.yescnc.core.lib.fm.cache.manager;

import java.util.Calendar;
import java.util.Date;

import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;

public class FmClientCacheManageThread extends Thread {

	private FmClientCache fmClientCache;
	
	public FmClientCacheManageThread() {
		this.fmClientCache = FmClientCache.getInstance();
	}
	
	@Override
	public void run() {
		
		while ( true ) {
		
			try {
				
				Thread.sleep(FmFoo.THREAD_TIMER_INTERVAL_CLIENT_CACHE_CHECK);
				
				// Client Cache Delete when 10 Min later
				Date currentDate = Calendar.getInstance().getTime();
				
				for ( FmClientVO fmClientDto : this.fmClientCache.getCurClientList() ) {
					
					Date updateTime = FmUtil.parseStringToDate( fmClientDto.getLastUpdateTime() );
					long nDiff = currentDate.getTime() - updateTime.getTime();
					if ( nDiff > FmConstant.CLIENT_RE_LOGIN_TIMEOUT ) {
						LogUtil.warning("[FmClientCacheManageThread] Remove from cache & Delete from DB" + fmClientDto);
						this.fmClientCache.removeClinetInCache( fmClientDto.getClientId() );
					}
					
				}
				
			} catch (Exception e) {
				LogUtil.warning(e) ;
				//e.printStackTrace();
			} finally {
				
			}
			
		}
		
	}
	
}
