package com.yescnc.jarvis.db.assetManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.AssetInfoVO;

public interface AssetManagerMapper {
	public List<IdcCodeVO> getAssetList();

	public List<AssetInfoVO> selectItemList(HashMap map);
	
	public void createAsset(HashMap map);
	
	public void createServerInfo(HashMap map);
	
	public void updateAsset(HashMap map);
	
	public void updateServer(HashMap map);
	
	public void deleteAsset(HashMap map);
	
	public List dupleKeySearch(HashMap map);
	
	public void csvAsset(HashMap map);
	
	public List getExportFileFormat();
	
	public List getLocationList();
	
	public List<IdcCodeVO> getProductStatus();
	
	public void csvRackPlace(HashMap map);
	
	public Integer getRowCount();

}
