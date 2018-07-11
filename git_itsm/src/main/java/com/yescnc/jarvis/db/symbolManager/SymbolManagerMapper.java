package com.yescnc.jarvis.db.symbolManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.AssetInfoVO;

public interface SymbolManagerMapper {

	public void addSymbol(HashMap map);

	public List getSymbolList(String id);

	public List<AssetInfoVO> getAssetList(String id);

	public void updateSymbolList(Map<String, Object> param);

	public void deleteSymbol(Map<String, Object> param);

	public void modifySymbol(Map<String, Object> param);

}
