package com.yescnc.jarvis.db.assetMapping;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.LocationVO;

public interface AssetMappingDao {
	
	public LocationVO getLocalList();
	
	public List<AssetInfoVO> assetList();
	
	public List<AssetInfoVO> getRoomAssetList(String id);
	
	public List<IdcCodeVO> codeList();
	
	public Integer updateLocationInfo(HashMap map);
	
	public Integer deleteComponent(HashMap map);
	
	public Integer updateServerInfo(HashMap map);
	
	public List<AssetInfoVO> getRackInList(String id);
	
	public List<AssetInfoVO> getServerList();
	
	public List<AssetInfoVO> getAvailabilityList();
	
	public List<AssetInfoVO> getRackServerList(String id);
	
}
