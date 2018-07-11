package com.yescnc.jarvis.db.assetManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.AssetInfoVO;

public interface AssetManagerDao {
	public List<IdcCodeVO> getAssetList();
	
	public List<AssetInfoVO> selectItemList(HashMap map);
	
	public Integer createAsset(HashMap map);
	
	public Integer createServerInfo(HashMap map);
	
	public Integer updateAsset(HashMap map);
	
	public Integer updateServer(HashMap map);
	
	public Integer deleteAsset(HashMap map);
	
	public List dupleKeySearch(HashMap map);
	
	public Integer csvAsset(HashMap map);
	
	public Integer csvRackPlace(HashMap map);
	
	public List getExportFileFormat();
	
	public List getLocationList();
	
	public List<IdcCodeVO> getProductStatus();

	public Integer getRowCount();

}
