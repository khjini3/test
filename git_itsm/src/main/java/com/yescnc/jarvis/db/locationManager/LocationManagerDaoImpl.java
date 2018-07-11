package com.yescnc.jarvis.db.locationManager;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.IdcLocationManagerCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

@Repository
public class LocationManagerDaoImpl implements LocationManagerDao {
	@Autowired
	private SqlSession sqlSession;
	
	private Logger logger = LoggerFactory.getLogger(LocationManagerDaoImpl.class);
	
	@Override
	public List<IdcLocationVO> selectLocationListAll() {
		List<IdcLocationVO> result = sqlSession.getMapper(LocationManagerMapper.class).selectLocationListAll();
		logger.error("### LocationManagerDaoImpl.selectLocationListAll() => " + result.toString());
		return result;
	}
	
	public boolean addLocation(IdcLocationVO location) {
		boolean result = sqlSession.getMapper(LocationManagerMapper.class).addLocation(location);
		logger.error("### LocationManagerDaoImpl.addLocation() => " + result);
		return result;
	}
	
	public boolean updateLocation(IdcLocationVO location) {
		boolean result = sqlSession.getMapper(LocationManagerMapper.class).updateLocation(location);
		logger.error("### LocationManagerDaoImpl.updateLocation() => " + result);
		return result;
	}
	
	public boolean deleteLocation(IdcLocationVO location) {
		boolean result = sqlSession.getMapper(LocationManagerMapper.class).deleteLocation(location);
		logger.error("### LocationManagerDaoImpl.deleteLocation() => " + result);
		return result;
	}
	
	public int selectCountChildLocation(Integer loc_id) {
		int result = sqlSession.getMapper(LocationManagerMapper.class).selectCountChildLocation(loc_id);
		logger.error("### LocationManagerDaoImpl.selectCountChildLocation() => " + result);
		return result;
	}
	
	public boolean updateIdcAssetLocID(IdcLocationVO location){
		boolean result = sqlSession.getMapper(LocationManagerMapper.class).updateIdcAssetLocID(location);
		logger.error("### LocationManagerDaoImpl.updateIdcAssetLocID() => " + result);
		return result;
	}
	
	@Override
	public List<IdcLocationManagerCodeVO> selectLocationTypeList() {
		List<IdcLocationManagerCodeVO> result = sqlSession.getMapper(LocationManagerMapper.class).selectLocationTypeList();
		logger.error("### LocationManagerDaoImpl.selectLocationTypeList() => " + result.toString());
		return result;
	}
}
