package com.yescnc.jarvis.symbolManager.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import com.yescnc.jarvis.modelManager.controller.ModelManagerController;
import com.yescnc.jarvis.symbolManager.service.SymbolManagerService;

@RequestMapping(value="/symbolManager")
@RestController
public class SymbolManagerController {
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(ModelManagerController.class);
	
	@Autowired 
	SymbolManagerService symbolManagerService;
	
	@RequestMapping(value="/addSymbol", method=RequestMethod.POST)
	public Integer addSymbol(@RequestBody HashMap map){
		return symbolManagerService.addSymbol(map);
	}
	//getSymbolList
	@RequestMapping(value="/{cmd}/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getParamDataList(@PathVariable("cmd") String cmd, @PathVariable("id") String id){
		List result = new ArrayList();
		
		
		switch(cmd){
			case "getAssetList":
				result = symbolManagerService.getAssetList(id);
				break;
			case "getSymbolList":
				result = symbolManagerService.getSymbolList(id);
				break;
		}
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateData(@PathVariable("cmd") String cmd, @RequestBody HashMap<String, Object> param){
		
		Integer result = null;
		
		switch(cmd){
		case "updateSymbolList":
			result = symbolManagerService.updateSymbolList(param);
			break;
		case "modifySymbol":
			result = symbolManagerService.modifySymbol(param);
			break;
		}
		
		return result;
	}

	@RequestMapping(value = "/deleteSymbol", method=RequestMethod.POST)
	public Integer deleteSymbol(@RequestBody Map<String, Object> param){
		int result = symbolManagerService.deleteSymbol(param);
		return result;
	}
}
