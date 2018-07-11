
package com.yescnc.core.lib.fm.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.CurAlarmCountCondVO;
import com.yescnc.core.entity.db.CurAlarmSearchCondVO;
import com.yescnc.core.entity.db.EventSearchCondDto;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.entity.db.FmSeqNoDto;
import com.yescnc.core.entity.db.FmSeqNoPageDto;
import com.yescnc.core.lib.fm.alarm.FmUtil;



@Repository
public class FmDaoImpl implements FmDao {
	@Autowired
	//@Qualifier("msSqlSessionTemplate")
	private SqlSession session;

	@Override
	public int insertFmClient(FmClientVO fmClientDto) {
		return session.getMapper(FmDao.class).insertFmClient(fmClientDto);
	}
	
	@Override
	public boolean updateFmClient(FmClientVO fmClientDto) {
		return session.getMapper(FmDao.class).updateFmClient(fmClientDto);
	}

	@Override
	public boolean deleteFmClient(int clientId) {
		return session.getMapper(FmDao.class).deleteFmClient(clientId);
	}

	@Override
	public FmClientVO selectFmClient(int clientId) {
		return session.getMapper(FmDao.class).selectFmClient(clientId);
	}

	@Override
	public ArrayList<FmClientVO> selectAllFmClient() {
		return session.getMapper(FmDao.class).selectAllFmClient();
	}
	
	@Override
	public long selectMaxSeqNo() {
		return session.getMapper(FmDao.class).selectMaxSeqNo();
	}
	
	@Override
	public boolean insertFmCurAlarms(FmEventVO fmEventDto) {
		return session.getMapper(FmDao.class).insertFmCurAlarms(fmEventDto);
	}
	
	@Override
	public boolean deleteFmCurAlarmsBySeq(long nSeq) {
		return session.getMapper(FmDao.class).deleteFmCurAlarmsBySeq(nSeq);
	}
	
	public boolean deleteFmHistBySeq(long nSeq) {
		return session.getMapper(FmDao.class).deleteFmHistBySeq(nSeq);
	}
	
	public boolean updateCurAlarmBySeq(FmEventVO fmEventDto) {
		return session.getMapper(FmDao.class).updateCurAlarmBySeq(fmEventDto);
	}
	
	@Override
	public FmEventVO selectFmCurAlarmsBySeq(long nSeq) {
		return FmUtil.fixTimeFormat(session.getMapper(FmDao.class).selectFmCurAlarmsBySeq(nSeq));
	}
	
	@Override
	public FmEventVO selectFmHistByClearedBySeq(HashMap<String, Integer> hmRqst) {
		return FmUtil.fixTimeFormat(session.getMapper(FmDao.class).selectFmHistByClearedBySeq(hmRqst));
	}
	
	public ArrayList<FmEventVO> selectHistByAlarmIdPosition(HashMap<String, Object> hmRqst) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectHistByAlarmIdPosition(hmRqst);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> selectCurAlarmCount(CurAlarmCountCondVO condition) {
		return session.getMapper(FmDao.class).selectCurAlarmCount(condition);
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> selectUnAckAlarmCount(long nSeq) {
		return session.getMapper(FmDao.class).selectUnAckAlarmCount(nSeq);
	}

	@Override
	public ArrayList<HashMap<String, Object>> selectUnAckAlarmCountFromCurAlarm(CurAlarmCountCondVO condition) {
		return session.getMapper(FmDao.class).selectUnAckAlarmCountFromCurAlarm(condition);
	}
	
	@Override
	public boolean insertFmHist(FmEventVO fmEventDto) {
		return session.getMapper(FmDao.class).insertFmHist(fmEventDto);
	}

	@Override
	public ArrayList<FmEventVO> selectEventFmTableBySeq(HashMap<String, Object> hmSeqCond) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectEventFmTableBySeq(hmSeqCond);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<FmEventVO> selectAllUnclearedAlarms(CurAlarmSearchCondVO curAlarmSearchCondDto ) {
		ArrayList<FmEventVO> fmEventDtos =  session.getMapper(FmDao.class).selectAllUnclearedAlarms(curAlarmSearchCondDto);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<FmEventVO> selectHistoryAlarms(CurAlarmSearchCondVO curAlarmSearchCondDto) {
		ArrayList<FmEventVO> fmEventDtos =  session.getMapper(FmDao.class).selectHistoryAlarms(curAlarmSearchCondDto);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	public ArrayList<FmEventVO> selectCurAlarmsByCondition(CurAlarmSearchCondVO curAlarmSearchCondDto) {
		ArrayList<FmEventVO> fmEventDtos =  session.getMapper(FmDao.class).selectCurAlarmsByCondition(curAlarmSearchCondDto);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<FmEventVO> selectFmCurAlarmsByDn(HashMap<String, Integer> hmRqst) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectFmCurAlarmsByDn(hmRqst);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<FmEventVO> selectFmCurAlarmsByDnForAudit(HashMap<String, Integer> hmRqst) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectFmCurAlarmsByDnForAudit(hmRqst);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<FmEventVO> selectFmCurAlarmsByMsgName(String strMsgName) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectFmCurAlarmsByMsgName(strMsgName);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public ArrayList<FmEventVO> selectFmCurAlarmsByDnAndAlarmId(HashMap<String, ArrayList<String>> hmRqst) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectFmCurAlarmsByDnAndAlarmId(hmRqst);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}

	@Override
	public int selectHistCountFromNewTable(EventSearchCondDto eventSearchCondDto) {
		return session.getMapper(FmDao.class).selectHistCountFromNewTable(eventSearchCondDto);
	}
	
	

	@Override
	public ArrayList<FmSeqNoDto> selectPagingSeqFromNewTable(EventSearchCondDto eventSearchCondDto) {
		return session.getMapper(FmDao.class).selectPagingSeqFromNewTable(eventSearchCondDto);
	}

	@Override
	public ArrayList<FmEventVO> selectFmHistFromNewTable(HashMap<String, Object> hmSeqCond) {
		ArrayList<FmEventVO> fmEventDtos = session.getMapper(FmDao.class).selectFmHistFromNewTable(hmSeqCond);
		for ( FmEventVO fmEventDto : fmEventDtos )
			FmUtil.fixTimeFormat(fmEventDto);
		return fmEventDtos;
	}
	
	@Override
	public boolean updateAckInfo(HashMap<String, Object> hmRqstMap) {
		return session.getMapper(FmDao.class).updateAckInfo(hmRqstMap);
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> selectFmStat(HashMap<String, Object> hmRqst) {
		return session.getMapper(FmDao.class).selectFmStat(hmRqst);
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> selectFmTop10Codes(HashMap<String, Object> hmRqst) {
		return session.getMapper(FmDao.class).selectFmTop10Codes(hmRqst);
	}

	@Override
	public ArrayList<FmSeqNoPageDto> selectPagingIndexFromNewTable(EventSearchCondDto eventSearchCondDto)
	{
		return session.getMapper(FmDao.class).selectPagingIndexFromNewTable(eventSearchCondDto);
	}

	@Override
	public ArrayList<FmEventVO> selectEventsByDnAndAlarmIdTimeRange(HashMap<String, Object> hmRqst)
	{
		return session.getMapper(FmDao.class).selectEventsByDnAndAlarmIdTimeRange(hmRqst);
	}

	@Override
	public ArrayList<HashMap<String, Object>> selectFmStatRank(HashMap<String, Object> hmRqst)
	{
		return session.getMapper(FmDao.class).selectFmStatRank(hmRqst);
	}
	
	@Override
	public 	String 	getLevel123Alias ( int levle1_id,  int levle2_id, int levle3_id )
	{
		return session.getMapper(FmDao.class).getLevel123Alias ( levle1_id,  levle2_id, levle3_id ) ;
	}
	
	@Override
	public 	String 	getLevel1Alias ( int levle1_id )
	{
		return session.getMapper(FmDao.class).getLevel1Alias ( levle1_id ) ;
	}

	@Override
	public String selectLevel3Alias(Map<String, Object> levelInfo) {
		return session.getMapper(FmDao.class).selectLevel3Alias ( levelInfo ) ;
	}

	
}
