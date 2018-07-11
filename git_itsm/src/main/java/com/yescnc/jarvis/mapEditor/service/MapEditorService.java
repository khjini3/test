package com.yescnc.jarvis.mapEditor.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.MapVO;
import com.yescnc.jarvis.entity.db.SymbolVO;

public interface MapEditorService {
	
	public Map<String, List<SymbolVO>> getMapData(MapVO mapVo);
	
	public List<IdcCodeVO> getMapListType();
	
	public List<IdcCodeVO> getMapList();
	
	public List<AssetInfoVO> getAssetList(String id);
	
	public int setSaveEditor(ArrayList<SymbolVO> saveList);
	
	public int setDeleteEditor(Map<String, List<SymbolVO>> param);
	
	public List<SymbolVO> getAvailableList(Map param);
	
	public List<SymbolVO> getUseList(String mapId);
	
	public int deleteAllData(String mapId);
	
	public int insertAllData(ArrayList<SymbolVO> saveList);
	
	public List<MapVO> getMapInfo(Map<String, List<MapVO>> mapInfo);
	
	public int setSaveMapInfo(ArrayList<MapVO> mapList);
	
}
