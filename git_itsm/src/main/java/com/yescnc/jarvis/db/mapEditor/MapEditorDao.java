package com.yescnc.jarvis.db.mapEditor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.MapVO;
import com.yescnc.jarvis.entity.db.SymbolVO;

public interface MapEditorDao {
	public Map<String, List<SymbolVO>> getMapData(MapVO mapVo);
	
	public List<IdcCodeVO> getMapList();
	
	public List<IdcCodeVO> getMapListType();
	
	public List<AssetInfoVO> getAssetList(String id);
	
	public int setSaveEditor(SymbolVO symbol);
	
	public int setDeleteEditor(Map<String, List<SymbolVO>> param);
	
	public List<SymbolVO> getAvailableList(Map param);
	
	public List<SymbolVO> getUseList(String mapId);
	
	public int deleteAllData(String mapId);
	
	public int insertAllData(SymbolVO symbol);
	
	public List<MapVO> getMapInfo(Map<String, List<MapVO>> mapInfo);
	
	public int setSaveMapInfo(ArrayList<MapVO> mapList);
}
