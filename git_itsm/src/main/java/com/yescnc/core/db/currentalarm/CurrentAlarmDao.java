package com.yescnc.core.db.currentalarm;

import java.util.HashMap;
import java.util.List;

import com.yescnc.core.entity.db.CurrentAlarmVO;

public interface CurrentAlarmDao {
	List<CurrentAlarmVO> selectCurrentAlarm(CurrentAlarmVO vo);
	
	boolean updateCurrentAlarmAck(HashMap<String, ?> param);
	
	boolean deleteCurrentAlarm(HashMap<String, ?> param);
}
