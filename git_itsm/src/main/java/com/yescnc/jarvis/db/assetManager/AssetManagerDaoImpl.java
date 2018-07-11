package com.yescnc.jarvis.db.assetManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.jarvis.db.locationManager.LocationManagerDaoImpl;
import com.yescnc.jarvis.db.locationManager.LocationManagerMapper;
import com.yescnc.jarvis.entity.db.AssetInfoVO;

@Repository
public class AssetManagerDaoImpl implements AssetManagerDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	private Logger log = LoggerFactory.getLogger(AssetManagerDaoImpl.class);
	
	@Override
	public List<IdcCodeVO> getAssetList() {
		List<IdcCodeVO> result = sqlSession.getMapper(AssetManagerMapper.class).getAssetList();
		return result;
	}

	@Override
	public List<AssetInfoVO> selectItemList(HashMap map) {
		List<AssetInfoVO> result = sqlSession.getMapper(AssetManagerMapper.class).selectItemList(map);
		return result;
	}

	@Override
	public Integer createAsset(HashMap map) {
		int result = 100;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).createAsset(map);
		} catch (DuplicateKeyException e) {
			
			System.out.println(e.getMessage());
			result = -110;
			
		}catch (Exception e) {
			
			System.out.println(e.getMessage());
			result = -100;
		}
		
		return result;
	}
	
	@Override
	public Integer createServerInfo(HashMap map) {
		int result = 100;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).createServerInfo(map);
		} catch (Exception e) {
			result = -100;
		} 
		
		return result;
	}

	@Override
	public Integer deleteAsset(HashMap map) {
		int result = 200;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).deleteAsset(map);
		} catch (Exception e) {
			result = -200;
		}
		
		return result;
	}
	
	@Override
	public Integer updateAsset(HashMap map) {
		int result = 300;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).updateAsset(map);
		} catch (Exception e) {
			result = -300;
		}
		
		return result;
	}

	@Override
	public List dupleKeySearch(HashMap map) {
		return sqlSession.getMapper(AssetManagerMapper.class).dupleKeySearch(map);
	}

	@Override
	public Integer updateServer(HashMap map) {
		int result = 300;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).updateServer(map);
		} catch (Exception e) {
			result = -300;
		}
		
		return result;
	}
	
	@Override
	public Integer csvAsset(HashMap map){
		int result = 400;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).csvAsset(map);
		} catch (Exception e) {
			result = -400;
		}
		
		return result;
	}

	@Override
	public List getExportFileFormat() {
		return sqlSession.getMapper(AssetManagerMapper.class).getExportFileFormat();
	}

	@Override
	public List getLocationList() {
		return sqlSession.getMapper(AssetManagerMapper.class).getLocationList();
	}

	@Override
	public List<IdcCodeVO> getProductStatus() {
		return sqlSession.getMapper(AssetManagerMapper.class).getProductStatus();
	}

	@Override
	public Integer csvRackPlace(HashMap map) {
		int result = 500;
		
		try {
			sqlSession.getMapper(AssetManagerMapper.class).csvRackPlace(map);
		} catch (Exception e) {
			result = -500;
		}
		
		return result;
	}

	@Override
	public Integer getRowCount() {
		return sqlSession.getMapper(AssetManagerMapper.class).getRowCount();
	}

}
