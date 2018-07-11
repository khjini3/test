package com.yescnc.core.lib.fm.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.yescnc.core.entity.db.CurAlarmCountCondVO;
import com.yescnc.core.entity.db.CurAlarmSearchCondVO;
import com.yescnc.core.entity.db.EventSearchCondDto;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.entity.db.FmSeqNoDto;
import com.yescnc.core.entity.db.FmSeqNoPageDto;

public interface FmDao {
	
	public int insertFmClient(FmClientVO fmClientDto);
	public boolean updateFmClient(FmClientVO fmClientDto);
	public boolean deleteFmClient(int nClientId);
	public FmClientVO selectFmClient(int nClientId);
	public ArrayList<FmClientVO> selectAllFmClient();
	
	public long selectMaxSeqNo();

	public boolean insertFmCurAlarms(FmEventVO fmEventDto);
	public boolean deleteFmCurAlarmsBySeq(long nSeq);
	public boolean deleteFmHistBySeq(long nSeq);
	public boolean updateCurAlarmBySeq(FmEventVO fmEventDto);
	public FmEventVO selectFmCurAlarmsBySeq(long nSeq);
	public FmEventVO selectFmHistByClearedBySeq(HashMap<String, Integer> hmRqst);
	public ArrayList<FmEventVO> selectHistByAlarmIdPosition(HashMap<String, Object> hmRqst);
	public ArrayList<HashMap<String, Object>> selectCurAlarmCount(CurAlarmCountCondVO condition);
	public ArrayList<HashMap<String, Object>> selectUnAckAlarmCount(long nSeq);
	public ArrayList<HashMap<String, Object>> selectUnAckAlarmCountFromCurAlarm(CurAlarmCountCondVO condition);
	
	public boolean insertFmHist(FmEventVO fmEventDto);
	public ArrayList<FmEventVO> selectEventFmTableBySeq(HashMap<String, Object> hmSeqCond);
	
	public ArrayList<FmEventVO> selectAllUnclearedAlarms(CurAlarmSearchCondVO curAlarmSearchCondDto);
	public ArrayList<FmEventVO> selectHistoryAlarms(CurAlarmSearchCondVO curAlarmSearchCondDto);
	public ArrayList<FmEventVO> selectCurAlarmsByCondition(CurAlarmSearchCondVO curAlarmSearchCondDto);
	public ArrayList<FmEventVO> selectFmCurAlarmsByDn(HashMap<String, Integer> hmRqst);
	public ArrayList<FmEventVO> selectFmCurAlarmsByDnForAudit(HashMap<String, Integer> hmRqst);
	public ArrayList<FmEventVO> selectFmCurAlarmsByMsgName(String strMsgName);
	public ArrayList<FmEventVO> selectFmCurAlarmsByDnAndAlarmId(HashMap<String, ArrayList<String>> hmRqst);
	
	
	// ---------------Event History Start-----------------------------
	public int selectHistCountFromNewTable(EventSearchCondDto eventSearchCondDto);
	public ArrayList<FmSeqNoDto> selectPagingSeqFromNewTable(EventSearchCondDto eventSearchCondDto);
	public ArrayList<FmEventVO> selectFmHistFromNewTable(HashMap<String, Object> hmSeqCond);

	
	// Paging related
	public ArrayList<FmSeqNoPageDto> selectPagingIndexFromNewTable(EventSearchCondDto eventSearchCondDto);

	// ---------------Event History End-----------------------------
	
	
	
	public boolean updateAckInfo(HashMap<String,Object> hmRqstMap);
	public ArrayList<HashMap<String, Object>> selectFmStat(HashMap<String, Object> hmRqst);
	public ArrayList<HashMap<String, Object>> selectFmTop10Codes(HashMap<String, Object> hmRqst);

	public ArrayList<HashMap<String, Object>> selectFmStatRank(HashMap<String, Object> hmRqst);

	public ArrayList<FmEventVO> selectEventsByDnAndAlarmIdTimeRange(HashMap<String, Object> hmRqst);
	
	public String 	getLevel123Alias ( int levle1_id,  int levle2_id, int levle3_id ) ;
	public String 	getLevel1Alias ( int levle1_id ) ;
	public String selectLevel3Alias(Map<String, Object> levelInfo);
}
