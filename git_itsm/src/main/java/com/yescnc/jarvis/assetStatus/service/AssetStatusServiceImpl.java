package com.yescnc.jarvis.assetStatus.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.codeManager.controller.CodeManagerController;
import com.yescnc.jarvis.db.assetStatus.AssetStatusDao;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

@Service
public class AssetStatusServiceImpl implements AssetStatusService {
	private org.slf4j.Logger log = LoggerFactory.getLogger(CodeManagerController.class);
	
	@Autowired
	AssetStatusDao assetStatusDao;
	
	@Override
	public List<IdcLocationVO> getLocationList(){
		List<IdcLocationVO> result = assetStatusDao.getLocationList();
		return result;
	}
	
	@Override
	public List<IdcCodeVO> getProductList(){
		List<IdcCodeVO> result = assetStatusDao.getProductList();
		return result;
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> searchAssetStatus(Map<String, Object> param){
		ArrayList<HashMap<String, Object>> result = assetStatusDao.getAssetStatus(param);
		log.debug("AssetStatusServiceImpl - result = "+result.toString());
		return result;
	}

	@Override
	public Integer getRowCount() {
		return assetStatusDao.getRowCount();
	}

}
