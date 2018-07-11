package com.yescnc.jarvis.db.modelManager;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface ModelManagerDao {
	
	public IdcCodeVO getAssetTypeList();
	
	public List<AssetInfoVO> getModelList(String id);
	
	public List<String> getModelDbList();
	
	public Integer updateModelList(HashMap map);
	
	public Integer removeModelList(HashMap map);
}
