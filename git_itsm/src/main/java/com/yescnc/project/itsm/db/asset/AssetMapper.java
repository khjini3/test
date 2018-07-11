package com.yescnc.project.itsm.db.asset;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.AssetVO;

public interface AssetMapper {
	
	public List<AssetVO> getModelList();
	
	public List<AssetVO> selectModelList(HashMap map);
	
	public void csvAsset(HashMap map);
	
	public void updateAsset(HashMap map);
	
	public ArrayList<HashMap<String, Object>> searchAsset(Map<String, Object> param);
	
}