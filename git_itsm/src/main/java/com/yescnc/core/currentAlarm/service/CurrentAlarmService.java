package com.yescnc.core.currentAlarm.service;

import java.util.ArrayList;
import java.util.HashMap;

import com.yescnc.core.entity.db.CurrentAlarmVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

public interface CurrentAlarmService {
	JsonPagingResult selectCurrentAlarm(CurrentAlarmVO vo);
	
	JsonResult updateCurrentAlarmAck(HashMap<String, ?> param);
	
	JsonResult deleteCurrentAlarm(ArrayList<CurrentAlarmVO> param);
}
