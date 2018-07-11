package com.yescnc.core.lib.fm.gen;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.yescnc.core.fm.action.GenerateEmsRebuiltEvent;
import com.yescnc.core.lib.fm.alarm.MyServerType;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.cache.FmCurAlarmCache;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.cache.FmLocalSeqNoCache;
import com.yescnc.core.lib.fm.cache.FmMinSeqByMsIdCache;
import com.yescnc.core.lib.fm.cache.manager.FmCacheLoggerThread;
import com.yescnc.core.lib.fm.cache.manager.FmClientCacheManageThread;
import com.yescnc.core.lib.fm.cache.manager.FmEventCacheManageThread;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;

@Component
public class start_fm_svr {
	@Autowired
	private GenerateEmsRebuiltEvent gen;
	
	public static final CountDownLatch FM_INIT_CDL = new CountDownLatch(1);
	
	public synchronized void handleMessage() throws Exception  {
		
		/* ----------------- Starting Initialize Jobs ----------------- */
		// 1. Loading Max Sequence
		LogUtil.warning("Initializing... Local Sequence Cache");
		FmLocalSeqNoCache.getInstance();
		
		// 2. Read all from fm_t_client_list
		LogUtil.warning("Initializing... Client Cache");
		FmClientCache.getInstance();
		
		// 3. Parse minimum sequence by MS id from fm_t_client_list 
		LogUtil.warning("Initializing... Minimum Sequence Cache");
		FmMinSeqByMsIdCache.getInstance();
		
		// 4. Read all Declared Alarm Key String and Sequence from fm_t_cur_alarms
		LogUtil.warning("Initializing... Alarm Cache");
		FmCurAlarmCache.getInstance();
		
		// 5. Create MS Instance from FmClientMinSeqCache
		LogUtil.warning("Initializing... Event Cache");
		FmEventCache.getInstance();			// It should be initialized in last time.
		/* ------------------------------------------ ----------------- */
		
		/* ----------------- Starting Managing Thread ----------------- */
		LogUtil.warning(MyServerType.getInfo());
		LogUtil.warning(FmFoo.getInfo());
		
		//if (MyServerType.MS_ROLE || MyServerType.MC_ROLE) {
		if (true) {	
			/*
			LogUtil.warning("Starting... Minimum Sequence Manager");
			FmMinSeqByMsIdCacheManageThread minSeqCacheManager = new FmMinSeqByMsIdCacheManageThread();
			minSeqCacheManager.setName( Thread.currentThread().getName() );
			minSeqCacheManager.start();
			*/
			//LogUtil.warning("Starting... MC/MS Monitor");
			McLvl1TableMonitoringThread mcLvl1TableMonitoringThread = new McLvl1TableMonitoringThread();
			mcLvl1TableMonitoringThread.setName( Thread.currentThread().getName() );
			mcLvl1TableMonitoringThread.start();
			
			//LogUtil.warning("Starting... Event Cache Manager");
			FmEventCacheManageThread fmEventCacheManageThread = new FmEventCacheManageThread();
			fmEventCacheManageThread.setName( Thread.currentThread().getName() );
			fmEventCacheManageThread.start();
			
			//LogUtil.warning("Starting... Client Cache Manager");
			FmClientCacheManageThread fmClientCacheManageThread = new FmClientCacheManageThread();
			fmClientCacheManageThread.setName( Thread.currentThread().getName() );
			fmClientCacheManageThread.start();
			
			//LogUtil.warning("Starting... Cache Logger Manager");
			FmCacheLoggerThread fmCacheLoggerThread = new FmCacheLoggerThread();
			fmCacheLoggerThread.setName( Thread.currentThread().getName() );
			fmCacheLoggerThread.start();
			
		} else {
			//LogUtil.warning("No need to start FM Managers");
		}
		/* ------------------------------------------ ----------------- */
		
		// Start Pooled Event Process
		//LogUtil.warning("FM Initialization Completed.");
		FM_INIT_CDL.countDown();
		
		// Generate EMS_REBUILT event for mf.oss
		generateEmsRebuiltEvent();
		//return reqMap;
	}
	
	private void generateEmsRebuiltEvent() {
		
		Map requestMap = new HashMap();
		requestMap.put(MsgKey.NE_TYPE, "nms");
		requestMap.put(MsgKey.MSG_NAME, "generateEmsRebuiltEvent");
		requestMap.put(MsgKey.NE_VERSION, "v1");
		requestMap.put(MsgKey.MSG_TYPE, "HashMap");
		
		try {
			/*
			MyMessage myMessage = new MyMessage("app.fm", "generateEmsRebuiltEvent");
			myMessage.setBody(requestMap);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);
			*/
			
			gen.handleMessage(requestMap);
		} catch (Exception e) {
			LogUtil.warning(e);
		}
		
	}

}
