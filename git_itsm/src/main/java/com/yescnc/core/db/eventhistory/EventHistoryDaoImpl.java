package com.yescnc.core.db.eventhistory;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.EventHistoryVO;

@Repository
public class EventHistoryDaoImpl implements EventHistoryDao {
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public int eventHistoryListTotalRecord() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(EventHistoryMapper.class).eventHistoryListTotalRecord();
	}
	
	@Override
	public List<EventHistoryVO> eventHistoryLimitList(EventHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(EventHistoryMapper.class).eventHistoryLimitList(vo);
	}
	
	@Override
	public List<EventHistoryVO> searchEventTypeList(EventHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(EventHistoryMapper.class).searchEventTypeList(vo);
	}
	
	@Override
	public int updateEventHistory(EventHistoryVO vo) {
		return sqlSession.getMapper(EventHistoryMapper.class).updateEventHistory(vo);
	}	
	
	@Override
	public Integer changeAckType(Map<String, Object> param){
		int result = 100;
		try {
			param.put("tableName", "fm_t_cur_alarms");
			sqlSession.getMapper(EventHistoryMapper.class).changeAckType(param);
			
			param.put("tableName", "fm_t_hist");
			sqlSession.getMapper(EventHistoryMapper.class).changeAckType(param);
		} catch (Exception e){
			e.printStackTrace();
			result = -100;
		}
		
		return result;
	}
}
