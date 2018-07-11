package com.yescnc.jarvis.assetStatus.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

public interface AssetStatusService {
	public List<IdcLocationVO> getLocationList();
	
	public List<IdcCodeVO> getProductList();
	
	public ArrayList<HashMap<String,Object>> searchAssetStatus(Map<String, Object> param);
	
	public Integer getRowCount();
}
