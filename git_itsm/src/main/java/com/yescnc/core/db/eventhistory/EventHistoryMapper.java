package com.yescnc.core.db.eventhistory;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.EventHistoryVO;

public interface EventHistoryMapper {
	
	int eventHistoryListTotalRecord();
	
	List<EventHistoryVO> eventHistoryLimitList(EventHistoryVO vo);
	
	List<EventHistoryVO> searchEventTypeList(EventHistoryVO vo);
	
	int updateEventHistory(EventHistoryVO vo);

	void changeAckType(Map<String, Object> param);
}
