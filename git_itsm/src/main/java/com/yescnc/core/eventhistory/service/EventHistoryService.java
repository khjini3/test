package com.yescnc.core.eventhistory.service;

import java.util.Map;

import com.yescnc.core.entity.db.EventHistoryVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface EventHistoryService {
	
	public JsonPagingResult eventHistoryLimitList(EventHistoryVO vo);
	
	public int updateEventHistory(EventHistoryVO vo);

	public Integer changeAckType(Map<String, Object> param);
	
}
