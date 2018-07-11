package com.yescnc.jarvis.db.ItamDashboard;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ItamDashboardDaoImpl implements ItamDashboardDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	private Logger log = LoggerFactory.getLogger(ItamDashboardDaoImpl.class);
	
	@Override
	public List getModel(String value) {
		Integer modelLimitValue = Integer.parseInt(value); 
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getModel(modelLimitValue);
		return result;
	}

	@Override
	public List getLocation(String value) {
		Integer locLimitValue = Integer.parseInt(value); 
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getLocation(locLimitValue);
		return result;
	}
	
	@Override
	public List getInstockWeekly() {
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getInstockWeekly();
		return result;
	}
	
	@Override
	public List getInstockMonthly() {
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getInstockMonthly();
		return result;
	}

	@Override
	public List getActiveWeekly() {
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getActiveWeekly();
		return result;
	}

	@Override
	public List getActiveMonthly() {
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getActiveMonthly();
		return result;
	}
	
	@Override
	public List getKeepWeekly() {
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getKeepWeekly();
		return result;
	}

	@Override
	public List getKeepMonthly() {
		List result = sqlSession.getMapper(ItamDashboardMapper.class).getKeepMonthly();
		return result;
	}

}
