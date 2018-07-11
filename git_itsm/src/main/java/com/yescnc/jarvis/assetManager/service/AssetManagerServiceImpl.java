package com.yescnc.jarvis.assetManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.db.assetManager.AssetManagerDao;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.jarvis.entity.db.AssetInfoVO;

@Service
public class AssetManagerServiceImpl implements AssetManagerService {
	
	@Autowired
	AssetManagerDao assetManagerDao;
	
	@Override
	public List<IdcCodeVO> getAssetList() {
		List<IdcCodeVO> result = assetManagerDao.getAssetList();
		return result;
	}

	@Override
	public List<AssetInfoVO> selectItemList(HashMap map) {
		List<AssetInfoVO> result = assetManagerDao.selectItemList(map);
		return result;
	}

	@Override
	public Integer createAsset(HashMap map) {
		return assetManagerDao.createAsset(map);
	}

	@Override
	public Integer updateAsset(HashMap map) {
		return assetManagerDao.updateAsset(map);
	}

	@Override
	public Integer deleteAsset(HashMap map) {
		return assetManagerDao.deleteAsset(map);
	}

	@Override
	public Integer createServerInfo(HashMap map) {
		return assetManagerDao.createServerInfo(map);
	}

	@Override
	public Integer updateServer(HashMap map) {
		return assetManagerDao.updateServer(map);
	}
	
	@Override
	public Integer csvAsset(HashMap map){
		return assetManagerDao.csvAsset(map);
	}

	@Override
	public List getExportFileFormat() {
		return assetManagerDao.getExportFileFormat();
	}

	@Override
	public List getLocationList() {
		return assetManagerDao.getLocationList();
	}

	@Override
	public List<IdcCodeVO> getProductStatus() {
		return assetManagerDao.getProductStatus();
	}

	@Override
	public Integer csvRackPlace(HashMap map) {
		return assetManagerDao.csvRackPlace(map);
	}

	@Override
	public Integer getRowCount() {
		return assetManagerDao.getRowCount();
	}

}
