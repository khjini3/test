package com.yescnc.project.itsm.db.asset;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.db.assetManager.AssetManagerMapper;
import com.yescnc.project.itsm.db.estimate.EstimateMapper;
import com.yescnc.project.itsm.db.productmanager.ProductManagerMapper;
import com.yescnc.project.itsm.entity.db.AssetVO;

@Repository
public class AssetDaoImpl implements AssetDao {
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<AssetVO> getModelList(){
		List<AssetVO> result = sqlSession.getMapper(AssetMapper.class).getModelList();
		return result;
	}
	
	@Override
	public Map<String, Object> selectModelList(HashMap map){
		Map<String, Object> allData = new HashMap<String,Object>();
		List<AssetVO> result = new  ArrayList<AssetVO>();
		result = sqlSession.getMapper(AssetMapper.class).selectModelList(map);
		allData.put("modelList", result);
		return allData;
	}
	
	@Override
	public Integer csvAsset(HashMap map){
		int result = 400;
		
		try {
			sqlSession.getMapper(AssetMapper.class).csvAsset(map);
		} catch (Exception e) {
			result = -400;
		}
		
		return result;
	}
	
	@Override
	public Integer updateAsset(HashMap map) {
		int result = 300;
		
		try {
			sqlSession.getMapper(AssetMapper.class).updateAsset(map);
		} catch (Exception e) {
			result = -300;
		}
		
		return result;
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> searchAsset(Map<String, Object> param) {
		ArrayList<HashMap<String, Object>> result = sqlSession.getMapper(AssetMapper.class).searchAsset(param);
		return result;
	}
	
}