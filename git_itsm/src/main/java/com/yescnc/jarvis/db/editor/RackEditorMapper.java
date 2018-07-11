package com.yescnc.jarvis.db.editor;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.LocationVO;

public interface RackEditorMapper {
	
	public List<LocationVO> getLocationList();
	
	public List<LocationVO> getSelectLocationList();
	
	public List<AssetInfoVO> getRackInList(String id);
	
	public List<AssetInfoVO> getAvailableAssetList();
	
	public List<AssetInfoVO> getRackInfo(String id);
	
	public void updateServerInList(HashMap map);
	
	public void updateServerOutList(HashMap map);
	
	public void updateRackInfo(HashMap map);
	
	public void updateServerInfo(HashMap map);
	
	public void updateUnitSize(HashMap map);
	
}
