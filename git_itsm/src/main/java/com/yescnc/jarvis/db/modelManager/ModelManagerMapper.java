package com.yescnc.jarvis.db.modelManager;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface ModelManagerMapper {
	
	public List<IdcCodeVO> getAssetTypeList();
	
	public List<AssetInfoVO> getModelList(String id);
	
	public List<String> getModelDbList();
	
	public void updateModelList(HashMap map);
	
	public void removeModelList(HashMap map);
}
