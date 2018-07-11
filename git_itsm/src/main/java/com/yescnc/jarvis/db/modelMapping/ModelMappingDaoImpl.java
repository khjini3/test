package com.yescnc.jarvis.db.modelMapping;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

@Repository
public class ModelMappingDaoImpl implements ModelMappingDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<IdcCodeVO> getAssetTypeList() {
		List<IdcCodeVO> result = sqlSession.getMapper(ModelMappingMapper.class).getAssetTypeList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getAssetList(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(ModelMappingMapper.class).getAssetList(id);
		return result;
	}
	
	@Override
	public List<AssetInfoVO> getModelList(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(ModelMappingMapper.class).getModelList(id);
		return result;
	}

	@Override
	public Integer updateModelList(HashMap map) {
		Integer result = 100;
		try {
			sqlSession.getMapper(ModelMappingMapper.class).updateModelList(map);
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}

}
