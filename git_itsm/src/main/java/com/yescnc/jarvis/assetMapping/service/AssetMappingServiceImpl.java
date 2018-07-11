package com.yescnc.jarvis.assetMapping.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.assetMapping.AssetMappingDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.LocationVO;

@Service
public class AssetMappingServiceImpl implements AssetMappingService {

	@Autowired
	AssetMappingDao assetMappingDao;
	
	@Override
	public LocationVO getLocalList() {
		LocationVO result = assetMappingDao.getLocalList();
		return result;
	}

	@Override
	public List<AssetInfoVO> assetList() {
		List<AssetInfoVO> result = assetMappingDao.assetList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getRoomAssetList(String id) {
		List<AssetInfoVO> result = assetMappingDao.getRoomAssetList(id);
		return result;
	}

	@Override
	public List<IdcCodeVO> codeList() {
		List<IdcCodeVO> result = assetMappingDao.codeList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getRackInList(String id) {
		List<AssetInfoVO> result = assetMappingDao.getRackInList(id);
		return result;
	}

	@Override
	public List<AssetInfoVO> getServerList() {
		List<AssetInfoVO> result = assetMappingDao.getServerList();
		return result;
	}
	
	@Override
	public List<AssetInfoVO> getRackServerList(String id) {
		List<AssetInfoVO> result = assetMappingDao.getRackServerList(id);
		return result;
	}

	@Override
	public Integer updateLocationInfo(HashMap map) {
		Integer result = assetMappingDao.updateLocationInfo(map);
		return result;
	}

	@Override
	public Integer updateServerInfo(HashMap map) {
		Integer result = assetMappingDao.updateServerInfo(map);
		return result;
	}

	@Override
	public List<AssetInfoVO> getAvailabilityList() {
		List<AssetInfoVO> result = assetMappingDao.getAvailabilityList();
		return result;
	}

	@Override
	public Integer deleteComponent(HashMap map) {
		Integer result = assetMappingDao.deleteComponent(map);
		return result;
	}

}
