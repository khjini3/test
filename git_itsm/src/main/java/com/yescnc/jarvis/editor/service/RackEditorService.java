package com.yescnc.jarvis.editor.service;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.LocationVO;

public interface RackEditorService {
	
	public LocationVO getLocationList();
	
	public LocationVO getSelectLocationList(String parentId);
	
	public List<AssetInfoVO> getRackInList(String id);
	
	public List<AssetInfoVO> getAvailableAssetList();
	
	public List<AssetInfoVO> getRackInfo(String id);
	
	public Integer updateServerInList(HashMap map);
	
	public Integer updateServerOutList(HashMap map);
	
	public Integer updateRackInfo(HashMap map);
	
	public Integer updateUnitSize(HashMap map);
	
	public Integer updateServerInfo(HashMap map);
}
