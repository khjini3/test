package com.yescnc.jarvis.db.idc;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.EventListVO;
import com.yescnc.jarvis.entity.db.IdcModelVO;

@Repository
public class IdcDaoImpl implements IdcDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<IdcModelVO> selectBuild(String locId) {
		return sqlSession.getMapper(IdcMapper.class).selectBuild(locId);
	}

	@Override
	public List<IdcModelVO> selectFloor(String id) {
		return sqlSession.getMapper(IdcMapper.class).selectFloor(id);
	}

	@Override
	public List<IdcModelVO> selectRoom(String id) {
		return sqlSession.getMapper(IdcMapper.class).selectRoom(id);
	}

	@Override
	public List<EventListVO> selectEventList() {
		return sqlSession.getMapper(IdcMapper.class).selectEventList();
	}

	@Override
	public List<AssetInfoVO> selectRackInfo(String rackId) {
		return sqlSession.getMapper(IdcMapper.class).selectRackInfo(rackId);
	}

	@Override
	public List selectRackInList(String rackId) {
		return sqlSession.getMapper(IdcMapper.class).selectRackInList(rackId);
	}

	@Override
	public List getPOPUPEventData(String rackId) {
		return sqlSession.getMapper(IdcMapper.class).getPOPUPEventData(rackId);
	}

	@Override
	public List getMainIconSeverityData() {
		return sqlSession.getMapper(IdcMapper.class).getMainIconSeverityData();
	}

	@Override
	public List getTemperData() {
		return sqlSession.getMapper(IdcMapper.class).getTemperData();
	}

	@Override
	public Integer dumyEventDataInsert() {
		Integer result = 100;
		try {
			sqlSession.getMapper(IdcMapper.class).dumyEventDataInsert();
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}

	@Override
	public Integer ackData(HashMap map) {
		Integer result = 100;
		
		try {
			sqlSession.getMapper(IdcMapper.class).ackData(map);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

}
