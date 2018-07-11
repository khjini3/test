package com.yescnc.jarvis.mapEditor.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.mapEditor.MapEditorDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.MapVO;
import com.yescnc.jarvis.entity.db.SymbolVO;

@Service
public class MapEditorServiceImpl implements MapEditorService {

	@Autowired
	MapEditorDao mapEditorDao;

	@Override
	public Map<String, List<SymbolVO>> getMapData(MapVO mapVo) {
		return mapEditorDao.getMapData(mapVo);
	}

	@Override
	public List<IdcCodeVO> getMapList() {
		return mapEditorDao.getMapList();
	}
	
	@Override
	public List<IdcCodeVO> getMapListType() {
		return mapEditorDao.getMapListType();
	}

	@Override
	public List<AssetInfoVO> getAssetList(String id) {
		return mapEditorDao.getAssetList(id);
	}

	@Override
	public int setSaveEditor(ArrayList<SymbolVO> symbolList) {
		
		int result = 0;
		
		for(SymbolVO symbol : symbolList){
			
			try {
				
				if(result == -100){
					break;
				}
				
				result = mapEditorDao.setSaveEditor(symbol);
				
			} catch (Exception e) {
				result = -100;
			}
		}
		return result;
	}

	@Override
	public int setDeleteEditor(Map<String, List<SymbolVO>> param) {
		int result =0;
		
		try {
			result = mapEditorDao.setDeleteEditor(param);
		} catch (Exception e) {
			result = -100;
		}
		return 0;
	}

	@Override
	public List<SymbolVO> getAvailableList(Map param) {
		return mapEditorDao.getAvailableList(param);
	}

	@Override
	public List<SymbolVO> getUseList(String mapId) {
		return mapEditorDao.getUseList(mapId);
	}

	@Override
	public int deleteAllData(String mapId) {
		return mapEditorDao.deleteAllData(mapId);
	}

	@Override
	public int insertAllData(ArrayList<SymbolVO> saveList) {
		int result = 100;
		
		for(SymbolVO symbol : saveList){
			
			try {
				
				if(result == -100){
					break;
				}
				
				result = mapEditorDao.insertAllData(symbol);
				
			} catch (Exception e) {
				result = -100;
			}
		}
		return result;
	}

	@Override
	public List<MapVO> getMapInfo(Map<String, List<MapVO>> mapInfo) {
		return mapEditorDao.getMapInfo(mapInfo);
	}

	@Override
	public int setSaveMapInfo(ArrayList<MapVO> mapList) {
		return mapEditorDao.setSaveMapInfo(mapList);
	}
	
}
