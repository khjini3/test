package com.yescnc.jarvis.editor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.assetManager.controller.AssetManagerController;
import com.yescnc.jarvis.editor.service.RackEditorService;
import com.yescnc.jarvis.entity.db.LocationVO;

@RequestMapping("/rackEditor")
@RestController
public class RackEditorController {
	
	@Value("${rackAlign}")
	private String rackAlign;
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(AssetManagerController.class);
	
	@Autowired
	RackEditorService rackEditorService;
	
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<String> getConfig(){
		List<String> result = new ArrayList<String>();
		result.add(rackAlign);
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getDataList(@PathVariable("cmd") String cmd){
		List result = new ArrayList();
		
		switch(cmd){
			case "getLocationList":
				result.add(rackEditorService.getLocationList());
				break;
			case "getAvailableAssetList":
				result = rackEditorService.getAvailableAssetList();
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getDataList(@PathVariable("cmd") String cmd, @PathVariable("id") String id){
		
		List result = new ArrayList();
		
		switch(cmd){
			case "getSelectLocationList":
				LocationVO locationVO = rackEditorService.getSelectLocationList(id);
				result.add(locationVO);
				break;
			case "getRackInList":
				result = rackEditorService.getRackInList(id);
				break;
			case "getRackInfo":
				result = rackEditorService.getRackInfo(id);
				break;
				
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map crudCommand(@PathVariable("cmd") String cmd,   @RequestBody HashMap map){
		
		Map result = new HashMap();
		
		Integer status = 0;
		List history = new ArrayList();
		switch(cmd){
			case "updateServerInList" :
				status = rackEditorService.updateServerInList((HashMap) map);
				break;
			case "updateServerOutList" :
				status = rackEditorService.updateServerOutList((HashMap) map);
				break;
			case "updateRackInfo" :
				status = rackEditorService.updateRackInfo((HashMap) map);
				break;
			case "updateServerInfo" :
				
				Iterator iterator = map.entrySet().iterator();
				
				while(iterator.hasNext()){
					Entry entry = (Entry)iterator.next();
					Map paramMap = (Map) entry.getValue();
					Map resultMap = new HashMap();
					//idc_asset에 unit Size Update
					if(paramMap.get("unitFlug").equals(true)){
						status = rackEditorService.updateUnitSize((HashMap) paramMap);
						resultMap.put("updateUnitSize", status);
					}
					//idc_rack_place에 unitIndex, startPosition Update
					status = rackEditorService.updateServerInfo((HashMap) paramMap);
					resultMap.put("updateServerInfo", status);
					
					history.add(resultMap);
				}
				
				break;
		}
		
		if(cmd.equals("updateServerInfo")){
			result.put("status", history);
		}else{
			result.put("status", status);
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Map crudCommandPUT(@PathVariable("cmd") String cmd,   @RequestBody HashMap map){
		
		Map result = new HashMap();
		
		Integer status = 0;
		
		switch(cmd){
			case "updateRackInfo" :
				status = rackEditorService.updateRackInfo((HashMap) map);
				break;
		}
		
		result.put("status", status);
		
		return result;
	}
}
