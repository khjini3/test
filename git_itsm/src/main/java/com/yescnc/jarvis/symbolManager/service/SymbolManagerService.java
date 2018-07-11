package com.yescnc.jarvis.symbolManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.AssetInfoVO;

public interface SymbolManagerService {

	Integer addSymbol(HashMap map);

	List getSymbolList(String id);

	List<AssetInfoVO> getAssetList(String id);

	Integer updateSymbolList(HashMap<String, Object> param);

	Integer deleteSymbol(Map<String, Object> param);

	Integer modifySymbol(HashMap<String, Object> param);

}
