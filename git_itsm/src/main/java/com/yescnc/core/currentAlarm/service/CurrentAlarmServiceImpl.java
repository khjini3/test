package com.yescnc.core.currentAlarm.service;

import java.util.ArrayList;
import java.util.HashMap;
//import java.util.ArrayList;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.currentalarm.CurrentAlarmDao;
import com.yescnc.core.entity.db.CurrentAlarmVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.gen.FmEventGenerator;
import com.yescnc.core.util.common.FmConstant;
//import com.yescnc.core.util.json.JSonUtil;
//import com.yescnc.core.entity.db.FmEventVO;
//import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

@Service
public class CurrentAlarmServiceImpl implements CurrentAlarmService {
	private org.slf4j.Logger logger = LoggerFactory.getLogger(CurrentAlarmServiceImpl.class);
	
	@Autowired
	CurrentAlarmDao currentAlarmDao;
	
//	@Autowired
//	FmDao fmDao;
	
//	@Override
//	public JsonPagingResult selectCurrentAlarm(CurrentAlarmVO vo) {
//		JsonPagingResult result = new JsonPagingResult();
//		CurAlarmSearchCondVO condition = new CurAlarmSearchCondVO();
//		condition.setnRowCntPerPage(2000);
//		ArrayList<FmEventVO> alCurAlarms = fmDao.selectAllUnclearedAlarms(condition);
//		logger.info("selectCurrentAlarm => " + alCurAlarms);
//		
//		result.setData("data", alCurAlarms);
//		//result.setNoOffsetRecord(currentAlarmDao.selectDetectionHistoryListTotalRecord());
//		result.setNoOffsetRecord(alCurAlarms.size());
//		
//		return result;
//	}
	
	@Override
	public JsonPagingResult selectCurrentAlarm(CurrentAlarmVO vo) {
		JsonPagingResult result = new JsonPagingResult();
		List<CurrentAlarmVO> alCurAlarms = currentAlarmDao.selectCurrentAlarm(vo);
		logger.info("selectCurrentAlarm => " + alCurAlarms);
		
		result.setData("data", alCurAlarms);
		//result.setNoOffsetRecord(currentAlarmDao.selectDetectionHistoryListTotalRecord());
		result.setNoOffsetRecord(alCurAlarms.size());
		
		return result;
	}

	@Override
	public JsonResult updateCurrentAlarmAck(HashMap<String, ?> param) {
		JsonResult result = new JsonResult();
		boolean ret = currentAlarmDao.updateCurrentAlarmAck(param);
		result.setResult(ret);
		return result;
	}

	@Override
	//public JsonResult deleteCurrentAlarm(HashMap<String, ?> param) {
	public JsonResult deleteCurrentAlarm(ArrayList<CurrentAlarmVO> param) {
		//String clear_user = (String) param.get("clear_user");
		String clear_user = "";
		
		//ArrayList<CurrentAlarmVO> voList = (ArrayList<CurrentAlarmVO>) param.get("alarmList");
		for (CurrentAlarmVO vo : param) {
			FmEventVO fmVo = new FmEventVO();
			fmVo.setSeqNo(vo.getSeq_no());
			fmVo.setSeverity(vo.getSeverity());
			fmVo.setAlarmId(vo.getAlarm_id());
			fmVo.setLloc(vo.getLloc());
			fmVo.setLvl1Id(vo.getLevel1_id());
			fmVo.setLvl2Id(vo.getLevel2_id());
			fmVo.setLvl3Id(vo.getLevel3_id());
			fmVo.setLvl4Id(vo.getLevel4_id());
			fmVo.setLvl5Id(vo.getLevel5_id());
			fmVo.setLvl6Id(vo.getLevel6_id());
			fmVo.setAlarmTime(vo.getAlarm_time());
			fmVo.setClearTime(vo.getClear_time());
			fmVo.setClearType(vo.getClear_type());
			fmVo.setLocationAlias(vo.getLocation_alias());
			fmVo.setEventType(vo.getEvent_type());
			fmVo.setDisplayType(vo.getDisplay_type());
			fmVo.setProbcauseInt(vo.getProbcause_int());
			fmVo.setProbcauseStr(vo.getProbcause_str());
			fmVo.setAdditionalText(vo.getAdditional_text());
			FmEventGenerator.getInstance().processManualClearAlarm(fmVo, clear_user, "1", FmConstant.CLEAR_TYPE_MANUAL);
		}
		
		JsonResult result = new JsonResult();
		result.setResult(true);
		
		return result;
	}
}
