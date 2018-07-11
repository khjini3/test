package com.yescnc.jarvis.assetManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface AssetManagerService {
	public List<IdcCodeVO> getAssetList();
	
	public List<AssetInfoVO> selectItemList(HashMap map);
	
	public Integer createAsset(HashMap map);
	
	public Integer createServerInfo(HashMap map);
	
	public Integer updateAsset(HashMap map);
	
	public Integer updateServer(HashMap map);
	
	public Integer deleteAsset(HashMap map);
	
	public Integer csvAsset(HashMap map);
	
	public Integer csvRackPlace(HashMap map);
	
	public List getExportFileFormat();
	
	public List getLocationList();
	
	public List<IdcCodeVO> getProductStatus();
	
	public Integer getRowCount();

}
