package com.yescnc.project.itsm.asset.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.project.itsm.db.asset.AssetDao;
import com.yescnc.project.itsm.entity.db.AssetVO;

@Service
public class AssetServiceImpl implements AssetService {
	
	@Autowired
	AssetDao assetDao;
	
	@Override
	public List<AssetVO> getModelList(){
		return assetDao.getModelList();
	}
	
	@Override
	public Map<String, Object> selectModelList(HashMap map){
		Map<String, Object> result = assetDao.selectModelList(map);
		return result;
	}
	
	@Override
	public Integer csvAsset(HashMap map){
		return assetDao.csvAsset(map);
	}
	
	@Override
	public Integer updateAsset(HashMap map) {
		return assetDao.updateAsset(map);
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> searchAsset(Map<String, Object> param) {
		ArrayList<HashMap<String, Object>> result = assetDao.searchAsset(param);
		return result;
	}
}