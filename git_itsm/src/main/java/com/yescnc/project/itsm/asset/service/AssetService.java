package com.yescnc.project.itsm.asset.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.AssetVO;

public interface AssetService {
	
	public List<AssetVO> getModelList();
	
	public Map<String, Object> selectModelList(HashMap map);
	
	public Integer csvAsset(HashMap map);
	
	public Integer updateAsset(HashMap map);
	
	public ArrayList<HashMap<String,Object>> searchAsset(Map<String, Object> param);
}