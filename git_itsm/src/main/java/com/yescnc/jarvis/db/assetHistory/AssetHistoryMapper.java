package com.yescnc.jarvis.db.assetHistory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public interface AssetHistoryMapper {
	public void insertHistory(Map map);
	
	public ArrayList<HashMap<String, Object>> searchHistory(Map<String, Object> param);
	
	public Integer getRowCount();
}
