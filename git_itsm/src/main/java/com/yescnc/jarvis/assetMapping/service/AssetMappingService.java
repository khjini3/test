package com.yescnc.jarvis.assetMapping.service;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.LocationVO;

public interface AssetMappingService {
	
	public LocationVO getLocalList();
	
	public List<AssetInfoVO> assetList();
	
	public List<IdcCodeVO> codeList();
	
	public Integer updateLocationInfo(HashMap map);
	
	public Integer deleteComponent(HashMap map);
	
	public Integer updateServerInfo(HashMap map);
	
	public List<AssetInfoVO> getRoomAssetList(String id);
	
	public List<AssetInfoVO> getRackInList(String id);
	
	public List<AssetInfoVO> getServerList();
	
	public List<AssetInfoVO> getRackServerList(String id);
	
	public List<AssetInfoVO> getAvailabilityList();
	
}
