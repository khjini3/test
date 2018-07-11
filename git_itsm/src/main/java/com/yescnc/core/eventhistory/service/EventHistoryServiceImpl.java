package com.yescnc.core.eventhistory.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.eventhistory.EventHistoryDao;
import com.yescnc.core.entity.db.EventHistoryVO;
import com.yescnc.core.util.json.JsonPagingResult;

@Service
public class EventHistoryServiceImpl implements EventHistoryService {
	
	@Autowired
	EventHistoryDao eventHistoryDao;

	@Override
	public JsonPagingResult eventHistoryLimitList(EventHistoryVO vo) {
		// TODO Auto-generated method stub
    	//int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();
    	
    	List<EventHistoryVO> eventTypeList = eventHistoryDao.searchEventTypeList(vo);
    	//vo.setStartRow(startRow);

		List<EventHistoryVO> limitList = eventHistoryDao.eventHistoryLimitList(vo);
		
		for(int i = 0; i < limitList.size(); i++) {
			if(limitList.get(i).getAlarm_time() != null) {
				limitList.get(i).setAlarm_time(limitList.get(i).getAlarm_time().substring(0, limitList.get(i).getAlarm_time().indexOf('.')));
			}
			
			if(limitList.get(i).getClear_time() != null) {
				limitList.get(i).setClear_time(limitList.get(i).getClear_time().substring(0, limitList.get(i).getClear_time().indexOf('.')));
			}
		}
		
		int totalCount = eventHistoryDao.eventHistoryListTotalRecord();
		//logger.info("searchLoginHistoryListTotalRecord={}" , totalCount);
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("data", limitList);
		result.setData("eventTypeList", eventTypeList);
		return result;
	}
	
	@Override
	public int updateEventHistory(EventHistoryVO vo) {
		return eventHistoryDao.updateEventHistory(vo);
	}	
	
	@Override
	public Integer changeAckType(Map<String, Object> param){
		return eventHistoryDao.changeAckType(param);
	}
}