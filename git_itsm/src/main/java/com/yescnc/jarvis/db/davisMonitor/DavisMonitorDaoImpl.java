package com.yescnc.jarvis.db.davisMonitor;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.EventListVO;

@Repository
public class DavisMonitorDaoImpl implements DavisMonitorDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<EventListVO> getEventBrowerData() {
		List<EventListVO> result = sqlSession.getMapper(DavisMonitorMappper.class).getEventBrowerData();
		return result;
	}

	@Override
	public List getAssetInfo(String param) {
		return sqlSession.getMapper(DavisMonitorMappper.class).getAssetInfo(param);
	}

	@Override
	public List<EventListVO> getEventViewerList(String param) {
		return sqlSession.getMapper(DavisMonitorMappper.class).getEventViewerList(param);
	}

}
