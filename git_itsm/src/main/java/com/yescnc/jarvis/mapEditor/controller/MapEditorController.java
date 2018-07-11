package com.yescnc.jarvis.mapEditor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcObjectVO;
import com.yescnc.jarvis.entity.db.MapVO;
import com.yescnc.jarvis.entity.db.SymbolVO;
import com.yescnc.jarvis.mapEditor.service.MapEditorService;

@RequestMapping("/mapEditor")
@RestController
public class MapEditorController {
	
	@Autowired
	MapEditorService mapEditorService;
	
	@RequestMapping(value="/{cmd}/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getData(@PathVariable("cmd") String cmd, @PathVariable("id") String id ){
		List result = new ArrayList();
		int status = 0;
		switch(cmd){
			case "getMapListType": //Map Editor ToolBox 메뉴 리스트
				Map<String, Object> resultParam = new HashMap();
				List<IdcCodeVO> temp = mapEditorService.getMapListType();
				IdcCodeVO idcCodevo = temp.get(0);
				resultParam.put("treeList", temp);
				Map<String, Object> availParam = new HashMap();
				availParam.put("codeId", idcCodevo.getId());
				availParam.put("mapId", id);
				resultParam.put("availableList", mapEditorService.getAvailableList(availParam));
				resultParam.put("useList", mapEditorService.getUseList(id));
				result.add(resultParam);
				break;
			case "getMapList": //Map Editor ToolBox 메뉴 리스트
				result = mapEditorService.getMapList();
				break;
			case "getAssetList": //ToolBox에서 선택한 자산 리스트
				result = mapEditorService.getAssetList(id);
				break;
			case "deleteAllData":
				status = mapEditorService.deleteAllData(id);
				result.add(status);
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{cmd1}/{cmd2}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getMapListTypeData(@PathVariable("cmd") String cmd, @PathVariable("cmd1") String cmd1, @PathVariable("cmd2") String cmd2 ){
		List result = new ArrayList();
		switch(cmd){
		case "getAvailableList": //사용가능한 자산 리스트
			Map<String, Object> param1 = new HashMap();
			param1.put("codeId", cmd1);
			param1.put("mapId", cmd2);
			result = mapEditorService.getAvailableList(param1);
			break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{mapId}", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public List getMapEditor(@PathVariable("cmd") String cmd,	@PathVariable("mapId") String mapId, @RequestBody Map<String, List<SymbolVO>> param){
		
		List result = new ArrayList();
		
		List<SymbolVO> saveList = null;
		List<SymbolVO> deleteList = null;
		
		int status = 0;
		
		switch(cmd){
			case "setSaveEditor":
				saveList = (ArrayList<SymbolVO>) param.get("saveData");
				deleteList = (ArrayList<SymbolVO>) param.get("deleteData");
				
				if(saveList.size() > 0){
					status = mapEditorService.setSaveEditor((ArrayList<SymbolVO>) saveList);
				}
				
				if(deleteList.size() > 0){
					status = mapEditorService.setDeleteEditor(param);
				}
				
				result.add(status);
				break;
			case "setSaveEditorList":
				saveList = (ArrayList<SymbolVO>) param.get("saveData");
				
				status =  mapEditorService.deleteAllData(mapId);
				
				if(status > 0 &&  saveList.size() > 0){
					status = mapEditorService.insertAllData((ArrayList<SymbolVO>) saveList);
				}
				result.add(status);
				break;
			case "getMapInfo":
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public List getMapData(HttpServletRequest req, HttpServletResponse res, @PathVariable("cmd") String cmd, 
			@RequestBody ArrayList<MapVO> mapList){
		
		List result = new ArrayList();
		int status = 0;
		switch(cmd){
			case "getMapData":
				Map<String, Map<String, List<SymbolVO>>> resultMap = new HashMap<String, Map<String, List<SymbolVO>>>();
				for(int i = 0; i < mapList.size(); i++){
					MapVO mapVo = mapList.get(i);
					Map<String, List<SymbolVO>> list = mapEditorService.getMapData(mapVo);
					resultMap.put(mapVo.getMapId(), list);
				}
				result.add(resultMap);
				break;
			case "getMapInfo":
				Map<String, List<MapVO>> mapInfo = new HashMap<String, List<MapVO>>();
				mapInfo.put("mapList", mapList);
				result = mapEditorService.getMapInfo(mapInfo);
				break;
			case "setSaveMapInfo":
				status = mapEditorService.setSaveMapInfo(mapList);
				break;
		}
		
		return result;
	}
	
}
