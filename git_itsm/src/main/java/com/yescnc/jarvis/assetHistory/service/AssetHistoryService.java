package com.yescnc.jarvis.assetHistory.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.UserVO;

public interface AssetHistoryService {
	public ArrayList<HashMap<String, Object>> searchHistory(Map<String, Object> param);
	
	public List<UserVO> getUserList();
	
	public Integer getRowCount();
}
