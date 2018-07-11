package com.yescnc.jarvis.db.symbolManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.AssetInfoVO;

public interface SymbolManagerDao {

	public Integer addSymbol(HashMap map);
	
	public List getSymbolList(String id);

	public List<AssetInfoVO> getAssetList(String id);

	public Integer updateSymbolList(HashMap<String, Object> param);

	public Integer deleteSymbol(Map<String, Object> param);

	public Integer modifySymbol(HashMap<String, Object> param);

}
