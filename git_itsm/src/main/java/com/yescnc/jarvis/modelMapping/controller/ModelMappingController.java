package com.yescnc.jarvis.modelMapping.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.modelManager.controller.ModelManagerController;
import com.yescnc.jarvis.modelMapping.service.ModelMappingService;

@RequestMapping("/modelMapping")
@RestController
public class ModelMappingController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(ModelManagerController.class);
	
	@Autowired
	ModelMappingService modelManagerService;
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getDataList(@PathVariable("cmd") String cmd){
		List result = new ArrayList();
		
		switch(cmd){
			case "getAssetTypeList":
				result = modelManagerService.getAssetTypeList();
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getParamDataList(@PathVariable("cmd") String cmd, @PathVariable("id") String id){
		List result = new ArrayList();
		
		switch(cmd){
			case "getAssetList":
				result = modelManagerService.getAssetList(id);
				break;
			case "getModelList":
				result = modelManagerService.getModelList(id);
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateData(@PathVariable("cmd") String cmd, @RequestBody HashMap map){
		
		return modelManagerService.updateModelList(map);
	}
	
}
	