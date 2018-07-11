package com.yescnc.core.lib.fm.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Component;

import com.yescnc.core.entity.db.CurAlarmCountCondVO;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.cache.FmLocalSeqNoCache;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.common.ServiceUtil;

@Component
public class FmDbService {

	public static ArrayList<ArrayList<Object>> getUnAckAlarmCntFromLocalDB(long nSeqNo) {
		
		ArrayList<ArrayList<Object>> unAckAlarmCntByDnList = new ArrayList<>();
		FmDao fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
		
		ArrayList<HashMap<String,Object>> alLocalUnAckCnt = fmDao.selectUnAckAlarmCount(nSeqNo);
		for ( HashMap<String,Object> map : alLocalUnAckCnt ) {
			ArrayList<Object> alAlarmCnt = new ArrayList<>();
			alAlarmCnt.add( "SA_v1" );
			alAlarmCnt.add( Integer.valueOf(map.get("level1_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level2_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level3_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level4_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level5_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level6_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level7_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level8_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level9_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level10_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("unack_cnt").toString()) );
			unAckAlarmCntByDnList.add(alAlarmCnt);
		}
		
		return unAckAlarmCntByDnList;
		
	}
	
	public static Collection<ArrayList<Object>> getCurAlarmCntFromLocalDB(CurAlarmCountCondVO condition) {
		
		FmDao fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
		ArrayList<HashMap<String,Object>> alLocalAlarmCnt = fmDao.selectCurAlarmCount(condition);
		ArrayList<HashMap<String,Object>> alLocalUnackAlarmCnt = fmDao.selectUnAckAlarmCountFromCurAlarm(condition);
		HashMap<String, ArrayList<Object>> hmMergedAlarmCnt = new HashMap<>();
		
		for ( HashMap<String,Object> map : alLocalAlarmCnt ) {
			ArrayList<Object> alAlarmCnt = new ArrayList<>();
			alAlarmCnt.add( "SA_v1" );
			alAlarmCnt.add( Integer.valueOf(map.get("level1_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level2_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level3_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level4_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level5_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level6_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level7_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level8_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level9_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level10_id").toString()) );
			hmMergedAlarmCnt.put( Arrays.toString( alAlarmCnt.toArray() ) , alAlarmCnt);
			alAlarmCnt.add( Integer.valueOf(map.get("critical_cnt").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("major_cnt").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("minor_cnt").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("warning_cnt").toString()) );
			alAlarmCnt.add(0);		// critical_unack_cnt
			alAlarmCnt.add(0);		// major_unack_cnt
			alAlarmCnt.add(0);		// minor_unack_cnt
			alAlarmCnt.add(0);		// warning_unack_cnt
		}
		
		for ( HashMap<String,Object> map : alLocalUnackAlarmCnt ) {
			ArrayList<Object> alAlarmCnt = new ArrayList<>();
			alAlarmCnt.add( "SA_v1" );
			alAlarmCnt.add( Integer.valueOf(map.get("level1_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level2_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level3_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level4_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level5_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level6_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level7_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level8_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level9_id").toString()) );
			alAlarmCnt.add( Integer.valueOf(map.get("level10_id").toString()) );
			String strKey = Arrays.toString( alAlarmCnt.toArray() );
			if ( hmMergedAlarmCnt.containsKey(strKey) ) {
				alAlarmCnt = hmMergedAlarmCnt.get(strKey);
			} else {
				hmMergedAlarmCnt.put( strKey , alAlarmCnt);
				alAlarmCnt.add(0);		// critical_cnt
				alAlarmCnt.add(0);		// major_cnt
				alAlarmCnt.add(0);		// minor_cnt
				alAlarmCnt.add(0);		// warning_cnt
				alAlarmCnt.add(0);		// critical_unack_cnt
				alAlarmCnt.add(0);		// major_unack_cnt
				alAlarmCnt.add(0);		// minor_unack_cnt
				alAlarmCnt.add(0);		// warning_unack_cnt
			}
			
			int nUnackCnt = Integer.valueOf(map.get("unack_cnt").toString());
			int nSeverity = Integer.valueOf(map.get("severity").toString());
			
			if ( nSeverity == FmConstant.FM_SEVERITY_CRITICAL )
				alAlarmCnt.set(15, nUnackCnt);
			else if ( nSeverity == FmConstant.FM_SEVERITY_MAJOR )
				alAlarmCnt.set(16, nUnackCnt);
			else if ( nSeverity == FmConstant.FM_SEVERITY_MINOR )
				alAlarmCnt.set(17, nUnackCnt);
			else if ( nSeverity == FmConstant.FM_SEVERITY_WARNING )
				alAlarmCnt.set(18, nUnackCnt);
			
		}
		
		return hmMergedAlarmCnt.values();
	}
	
	public static int[] countAlarmCount(ArrayList<ArrayList<Object>> alMergedAlarmCnt) {
		
		int nSumCri = 0;
		int nSumMaj = 0;
		int nSumMin = 0;
		int nSumWarn = 0;
		int nSumCriUnack = 0;
		int nSumMajUnack = 0;
		int nSumMinUnack = 0;
		int nSumWarnUnack = 0;
		for ( ArrayList<Object> alAlarms : alMergedAlarmCnt ) {
			nSumCri += Integer.parseInt( alAlarms.get(11).toString() );
			nSumMaj += Integer.parseInt( alAlarms.get(12).toString() );
			nSumMin += Integer.parseInt( alAlarms.get(13).toString() );
			nSumWarn += Integer.parseInt( alAlarms.get(14).toString() );
			nSumCriUnack += Integer.parseInt( alAlarms.get(15).toString() );
			nSumMajUnack += Integer.parseInt( alAlarms.get(16).toString() );
			nSumMinUnack += Integer.parseInt( alAlarms.get(17).toString() );
			nSumWarnUnack += Integer.parseInt( alAlarms.get(18).toString() );
		}
		int[] arAlarmCnt = new int[8];
		arAlarmCnt[0] = nSumCri;
		arAlarmCnt[1] = nSumMaj;
		arAlarmCnt[2] = nSumMin;
		arAlarmCnt[3] = nSumWarn;
		arAlarmCnt[4] = nSumCriUnack;
		arAlarmCnt[5] = nSumMajUnack;
		arAlarmCnt[6] = nSumMinUnack;
		arAlarmCnt[7] = nSumWarnUnack;
		
		return arAlarmCnt;
		
	}
	
	public static FmClientVO processWebClientLogin(Map<String, Object> message) {
		
		// 1. Prepare Sequence number map by MS ID
		HashMap<Integer, Long> hmSeqByMsId = new HashMap<>();
		
		// 2. Get Current Alarm From Local DB & get Max Sequence Number
		long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
		int nLocalMsId = EmsInfoList.getMsIdMyself();
		hmSeqByMsId.put(nLocalMsId, nLocalMaxSeq);
		
		// 3. Gathering Max Sequence from another MS
		for ( Entry<Integer, Long> entry : FmEventCache.getInstance().getMaxSeqByMsIdMap().entrySet() ) {
			if ( entry.getKey() != nLocalMsId )
				hmSeqByMsId.put( entry.getKey(), entry.getValue() );
		}
		
		// 4. Merge Last Sequence
		String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(hmSeqByMsId);
		String strIpAddr = message.containsKey(MsgKey.SRC_IP) ? message.get(MsgKey.SRC_IP).toString() : "";
		
		// 5. Client Login Process
		FmClientVO fmClientDto = FmClientCache.getInstance().putClientToCache(strLastSeqWithMsId, FmConstant.CLIENT_WEB, strIpAddr);
		LogUtil.warning("[WebClientLogin] Client Id : " + fmClientDto.getClientId() + ", LastSeqString : " + strLastSeqWithMsId);
		
		return fmClientDto;
	}
	/*
	public static FmClientVO processWebClientLogin(Map<String, Object> message) {
		
		// 1. Prepare Sequence number map by MS ID
		HashMap<Integer, Long> hmSeqByMsId = new HashMap<>();
		
		// 2. Get Current Alarm From Local DB & get Max Sequence Number
		long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
		int nLocalMsId = EmsInfoList.getMsIdMyself();
		hmSeqByMsId.put(nLocalMsId, nLocalMaxSeq);
		
		// 3. Gathering Max Sequence from another MS
		for ( Entry<Integer, Long> entry : FmEventCache.getInstance().getMaxSeqByMsIdMap().entrySet() ) {
			if ( entry.getKey() != nLocalMsId )
				hmSeqByMsId.put( entry.getKey(), entry.getValue() );
		}
		
		// 4. Merge Last Sequence
		String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(hmSeqByMsId);
		String strIpAddr = (null != message.get("UserIp"))? message.get("UserIp").toString() : "";
		
		// 5. Client Login Process
		FmClientVO fmClientDto = FmClientCache.getInstance().putClientToCache(strLastSeqWithMsId, FmConstant.CLIENT_WEB, strIpAddr);
		LogUtil.warning("[WebClientLogin] Client Id : " + fmClientDto.getClientId() + ", LastSeqString : " + strLastSeqWithMsId);
		
		return fmClientDto;
	}
	*/
	public static FmClientVO processMsClientLogin(Map<String, Object> message) throws Exception {
		
		Map hmBody =  (Map) message;
		
		// 1. Prepare Sequence number map by MS ID
		HashMap<Integer, Long> hmSeqByMsId = FmUtil.convertJsonStringToSeqMap(hmBody.get(MsgKey.SEQ_NO).toString());
		LogUtil.info("processMsClientLogin() Map = " + hmSeqByMsId.toString());
		
		// 2. Get Current Alarm From Local DB & get Max Sequence Number
		if ( hmSeqByMsId.containsKey(-1) ) {
			long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
			hmSeqByMsId.put(-1, nLocalMaxSeq);
		} else {
			long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
			int nLocalMsId = EmsInfoList.getMsIdMyself();
			hmSeqByMsId.put(nLocalMsId, nLocalMaxSeq);
		}
		
		// 5. Merge Last Sequence
		String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(hmSeqByMsId);
		String strIpAddr = hmBody.containsKey(MsgKey.SRC_IP) ? hmBody.get(MsgKey.SRC_IP).toString() : "";
		
		// 6. Client Login Process
		FmClientVO fmClientDto = FmClientCache.getInstance().putClientToCache(strLastSeqWithMsId, FmConstant.CLIENT_DAEMON_MS, strIpAddr);
		LogUtil.warning("[MsClientLogin] Client Id : " + fmClientDto.getClientId() + ", LastSeqString : " + strLastSeqWithMsId);
		
		return fmClientDto;
	}
	
	public static FmClientVO processSvcClientLogin(Map<String, Object> message) throws Exception {
		
		// 1. Prepare Sequence number map by MS ID
		HashMap<Integer, Long> hmSeqByMsId = new HashMap<Integer, Long>();
		
		long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
		int nLocalMsId = EmsInfoList.getMsIdMyself();
		hmSeqByMsId.put(-1, 0l);
		hmSeqByMsId.put(nLocalMsId, nLocalMaxSeq);
		
		// 5. Merge Last Sequence
		String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(hmSeqByMsId);
		
		// 6. Client Login Process
		FmClientVO fmClientDto = FmClientCache.getInstance().putClientToCache(strLastSeqWithMsId, FmConstant.CLIENT_DAEMON_SVC, "localhost");
		LogUtil.warning("[SvcClientLogin] Client Id : " + fmClientDto.getClientId() + ", LastSeqString : " + strLastSeqWithMsId);
		
		return fmClientDto;
	}
	
	public static FmClientVO processOssClientLogin() throws Exception {
		
		// 1. Prepare Sequence number map by MS ID
		HashMap<Integer, Long> hmSeqByMsId = new HashMap<Integer, Long>();
		
		// 2. Get Current Alarm From Local DB & get Max Sequence Number
		String serverType = ServiceUtil.getServerType();
		String strServerType = (serverType == null) ? "ms" : serverType;
		if ( ServiceUtil.isProperty("service.fm.oss.alarm") == true && strServerType.contains("mc") ) {
			long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
			int nLocalMsId = EmsInfoList.getMsIdMyself();
			hmSeqByMsId.put(nLocalMsId, nLocalMaxSeq);
			
			// 3. Gathering Max Sequence from another MS
			for ( Entry<Integer, Long> entry : FmEventCache.getInstance().getMaxSeqByMsIdMap().entrySet() ) {
				if ( entry.getKey() != nLocalMsId )
					hmSeqByMsId.put( entry.getKey(), entry.getValue() );
			}
		} else {
			long nLocalMaxSeq = FmLocalSeqNoCache.getInstance().get();
			int nLocalMsId = EmsInfoList.getMsIdMyself();
			hmSeqByMsId.put(nLocalMsId, nLocalMaxSeq);
			hmSeqByMsId.put(-1, 0l);	
		}
		
		// 5. Merge Last Sequence
		String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(hmSeqByMsId);
		
		// 6. Client Login Process
		FmClientVO fmClientDto = FmClientCache.getInstance().putClientToCache(strLastSeqWithMsId, FmConstant.CLIENT_DAEMON_MD, "localhost");
		LogUtil.warning("[OssClientLogin] Client Id : " + fmClientDto.getClientId() + ", LastSeqString : " + strLastSeqWithMsId);
		
		return fmClientDto;
	}
	
}
