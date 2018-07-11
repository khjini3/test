package com.yescnc.core.lib.fm.gen;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;
import java.util.Map.Entry;

import org.slf4j.Logger;

import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.alarm.MyServerType;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.util.common.LogUtil;




public class McLvl1TableMonitoringThread extends Thread {
	
	private int nLocalLvl1Id = 1;
	private Map<Integer, MsPollingThread> hmMsInfo;
	private Logger m_logger;
	
	public McLvl1TableMonitoringThread() {
		this.hmMsInfo = new HashMap<>();
		this.setName("mf.fm.ms.poll");
		this.m_logger = LogUtil.init("mf.fm.ms.poll");
	}
	
	@Override
	public void run() {
		
		boolean needtoStartMcPolling = true;
		
		this.m_logger.info("[McLvl1TableMonitoringThread] Thread Started.");
		
		while ( true ) {
			
			try {
				
				// 1. Read Local Level1_ID , 0 is initialize value
				this.nLocalLvl1Id = EmsInfoList.getMsIdMyself();
				if ( this.nLocalLvl1Id == 0 ) {
					this.m_logger.info("[WARNING] Local Level1 ID is " + nLocalLvl1Id);
					Thread.sleep(1000);
					continue;
				}
				
				// 2. Select from MC Database
				this.mngMsPollingThread();
				
				// 3. Determine Generate MC Polling Thread or not
				if ( needtoStartMcPolling ) {
					if ( MyServerType.MS_STANDALONE_SERVER ) {
						String strMcAddr = MyServerType.MC_IP;
						this.m_logger.info("Readed MC Address : " + strMcAddr);
						
						// Create MC Event Polling Thread
						MsPollingThread msPollingThread = new MsPollingThread(-1, strMcAddr);
						msPollingThread.setName( Thread.currentThread().getName() );
						msPollingThread.start();
						this.hmMsInfo.put(-1, msPollingThread);
						this.m_logger.info("[McPollingThread] MC Polling Thread Started, MC IP : " + strMcAddr);
					} else {
						this.m_logger.info("[McPollingThread] No need to generate MC Polling thread. My server type : " + MyServerType.SERVER_TYPE);
					}
					
					needtoStartMcPolling = false;
				}
				
			} catch (Exception e) {
				if ( e.getMessage() != null )
					this.m_logger.info( e.getMessage() );	
				this.m_logger.info( java.util.Arrays.toString(e.getStackTrace()) );
			} finally {
				try {
					Thread.sleep(10000);
				} catch (Exception e) {
					LogUtil.warning(e) ;
					//e.printStackTrace();
				}
			}
			
		}
		
	}
	
	private void mngMsPollingThread() {
		
		this.m_logger.info("[MsPollingThread] MS Polling Thread Started..");
		/*
		ArrayList<CmVLevel1> cmVlevel1List = EmsInfoList.getMs() ;
		Vector<Integer> vecLvl1Id = new Vector() ;
	
		for ( CmVLevel1 level1Id : cmVlevel1List) {			
			int nLvl1Id = level1Id.getLevel1_id();
			String strIpAddr = level1Id.getIp_addr();
			
			if ( this.hmMsInfo.containsKey(nLvl1Id) == false && nLvl1Id != EmsInfoList.getMsIdMyself() ) {
				FmEventCache.getInstance().createNewMsCache(nLvl1Id);
				MsPollingThread msPollingThread = new MsPollingThread(nLvl1Id, strIpAddr);
				msPollingThread.setName( Thread.currentThread().getName() );
				msPollingThread.start();
				this.hmMsInfo.put(nLvl1Id, msPollingThread);
				this.m_logger.info("[MsPollingThread] MS Polling Thread Started, MS IP : " + strIpAddr);
				vecLvl1Id.add(new Integer(nLvl1Id)) ;
			}
			
		}
		
		// Stop Eliminated MS
		for ( Entry<Integer, MsPollingThread> entry : this.hmMsInfo.entrySet() ) {
			if ( vecLvl1Id.contains( entry.getKey() ) == false ) {
				if ( entry.getValue().getMsInfoDto().getnLvl1Id() != -1 ) {
					entry.getValue().setIsRunnableStatus(false);
					FmEventCache.getInstance().removeMsInCache(entry.getKey());
				}
			}
		}
	
		*/
	}
	
}
