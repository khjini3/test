package com.yescnc.jarvis.editor.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.editor.RackEditorDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.LocationVO;

@Service
public class RackEditorServiceImpl implements RackEditorService {
	
	@Autowired
	RackEditorDao rackEditorDao;
	
	@Override
	public LocationVO getLocationList() {
		LocationVO result = rackEditorDao.getLocationList();
		return result;
	}

	@Override
	public LocationVO getSelectLocationList(String parentId) {
		LocationVO result = rackEditorDao.getSelectLocationList(parentId);
		return result;
	}

	@Override
	public List<AssetInfoVO> getRackInList(String id) {
		List<AssetInfoVO> result = rackEditorDao.getRackInList(id);
		return result;
	}

	@Override
	public List<AssetInfoVO> getAvailableAssetList() {
		List<AssetInfoVO> result = rackEditorDao.getAvailableAssetList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getRackInfo(String id) {
		List<AssetInfoVO> result = rackEditorDao.getRackInfo(id);
		return result;
	}

	@Override
	public Integer updateServerInList(HashMap map) {
		Integer status = rackEditorDao.updateServerInList(map);
		return status;
	}

	@Override
	public Integer updateServerOutList(HashMap map) {
		Integer status = rackEditorDao.updateServerOutList(map);
		return status;
	}

	@Override
	public Integer updateRackInfo(HashMap map) {
		Integer status = rackEditorDao.updateRackInfo(map);
		return status;
	}

	@Override
	public Integer updateServerInfo(HashMap map) {
		Integer status = rackEditorDao.updateServerInfo(map);
		return status;
	}

	@Override
	public Integer updateUnitSize(HashMap map) {
		Integer status = rackEditorDao.updateUnitSize(map);
		return status;
	}
	
}
