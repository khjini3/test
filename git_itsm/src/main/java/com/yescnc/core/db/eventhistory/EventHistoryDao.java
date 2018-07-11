package com.yescnc.core.db.eventhistory;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.EventHistoryVO;

public interface EventHistoryDao {
	
	public int eventHistoryListTotalRecord();	
	
	public List<EventHistoryVO> eventHistoryLimitList(EventHistoryVO vo);
	
	public List<EventHistoryVO> searchEventTypeList(EventHistoryVO vo);
	
	public int updateEventHistory(EventHistoryVO vo);

	public Integer changeAckType(Map<String, Object> param);
}