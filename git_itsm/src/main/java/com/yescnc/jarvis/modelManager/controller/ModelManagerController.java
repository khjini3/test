package com.yescnc.jarvis.modelManager.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yescnc.jarvis.modelManager.availableModelList.AvailableModelList;
import com.yescnc.jarvis.modelManager.service.ModelManagerService;


@RequestMapping("/modelManager")
@RestController
public class ModelManagerController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(ModelManagerController.class);
	
	@Autowired
	ModelManagerService modelManagerService;
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getDataList(@PathVariable("cmd") String cmd, HttpServletRequest req){
		List result = new ArrayList();
		
		switch(cmd){
			case "getAssetTypeList":
				result.add(modelManagerService.getAssetTypeList());
				break;
			case "getAvailableModelList":
				Map resultMap = new HashMap();
				//Folder List
				AvailableModelList modelList = new AvailableModelList(req.getServletContext().getRealPath("/"));
				resultMap.put("folderList", modelList.ModelList());
				resultMap.put("dbList", modelManagerService.getModelDbList());
				result.add(resultMap);
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getModelList(@PathVariable("cmd") String cmd, @PathVariable("id") String id){
		List result = new ArrayList();
		
		switch(cmd){
			case "getModelList":
				result = modelManagerService.getModelList(id);
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map updateDataList(@PathVariable("cmd") String cmd, @RequestBody HashMap map){
		
		Map result = new HashMap();
		
		switch(cmd){
			case "updateModelList":
				List leftData = (List) map.get("leftData");
				
				if(leftData.size() > 0){
					result.put("updateStatus", modelManagerService.updateModelList(map));
				}
				
				List rightData = (List) map.get("rightData");
				
				if(rightData.size() > 0){
					result.put("deleteStatus", modelManagerService.removeModelList(map));
				}
				
				break;
		}
		
		return result;
	}
	
	
}
