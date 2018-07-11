package com.yescnc.jarvis.db.modelMapping;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface ModelMappingDao {
	
	public List<IdcCodeVO> getAssetTypeList();
	
	public List<AssetInfoVO> getAssetList(String id);
	
	public List<AssetInfoVO> getModelList(String id);
	
	public Integer updateModelList(HashMap map);
}
