package com.yescnc.jarvis.modelMapping.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.modelMapping.ModelMappingDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

@Service
public class ModelMappingServiceImpl implements ModelMappingService {

	@Autowired
	ModelMappingDao modelMappingDao;
	
	@Override
	public List<IdcCodeVO> getAssetTypeList() {
		List<IdcCodeVO> result = modelMappingDao.getAssetTypeList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getAssetList(String id) {
		List<AssetInfoVO> result = modelMappingDao.getAssetList(id);
		return result;
	}
	
	@Override
	public List<AssetInfoVO> getModelList(String id) {
		List<AssetInfoVO> result = modelMappingDao.getModelList(id);
		return result;
	}

	@Override
	public Integer updateModelList(HashMap map) {
		return modelMappingDao.updateModelList(map);
	}


}
