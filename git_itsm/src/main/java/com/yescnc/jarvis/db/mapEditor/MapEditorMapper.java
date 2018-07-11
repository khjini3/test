package com.yescnc.jarvis.db.mapEditor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.javassist.compiler.ast.Symbol;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.MapVO;
import com.yescnc.jarvis.entity.db.SymbolVO;

public interface MapEditorMapper {
	
	public List<SymbolVO> getMapData(String id);
	
	public List<IdcCodeVO> getMapList();
	
	public List<IdcCodeVO> getMapListType();
	
	public List<AssetInfoVO> getAssetList(String id);
	
	public void setSaveEditor(SymbolVO symbol);
	
	public void setDeleteEditor(Map<String, List<SymbolVO>> param);
	
	public List<SymbolVO> getAvailableList(Map param);
	
	public List<SymbolVO> getUseList(String mapId);
	
	public void deleteAllData(String mapId);
	
	public void insertAllData(SymbolVO symbol);
	
	public List<MapVO> getMapInfo(Map<String, List<MapVO>> mapInfo);
	
	public void setSaveMapInfo(MapVO mapVo);
	
}
