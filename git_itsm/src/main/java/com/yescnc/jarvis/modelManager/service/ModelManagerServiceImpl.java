package com.yescnc.jarvis.modelManager.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.modelManager.ModelManagerDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

@Service
public class ModelManagerServiceImpl implements ModelManagerService {
	
	@Autowired
	ModelManagerDao modelManagerDao;
	
	@Override
	public IdcCodeVO getAssetTypeList() {
		IdcCodeVO result = modelManagerDao.getAssetTypeList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getModelList(String id) {
		List<AssetInfoVO> result = modelManagerDao.getModelList(id);
		return result;
	}

	@Override
	public List<String> getModelDbList() {
		List<String> result = modelManagerDao.getModelDbList();
		return result;
	}

	@Override
	public Integer updateModelList(HashMap map) {
		Integer result = modelManagerDao.updateModelList(map);
		return result;
	}

	@Override
	public Integer removeModelList(HashMap map) {
		Integer result = modelManagerDao.removeModelList(map);
		return result;
	}

}
