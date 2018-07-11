package com.yescnc.jarvis.idc.contorller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.idc.service.IdcService;
import com.yescnc.jarvis.entity.db.IdcModelVO;

@RequestMapping(value="/idc")
@RestController
public class IdcController{
	
	@Value("${rackAlign}")
	private String rackAlign;
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(IdcController.class);
	
	@Autowired
	IdcService idcService;
	
	@RequestMapping(value="/{cmd}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List selectDataInfo(@PathVariable("cmd") String cmd){
		//log.info(cmd);
		List result = new ArrayList();
		
		switch(cmd){
			case "getEventData" : 
				result = idcService.selectEventList();
				break;
			case "getMainIconSeverityData" : 
				result = idcService.getMainIconSeverityData();
				break;
			case "getTemperData" : 
				result = idcService.getTemperData();
				break;
			case "config" : 
				result.add(rackAlign);
				break;
			case "dumyEventDataInsert" : 
				result.add(idcService.dumyEventDataInsert());
				break;
				
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{param}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List selectModelInfo(@PathVariable("cmd") String cmd, @PathVariable("param") String param){
		
		List result = new ArrayList();
		String rackId = param;
		switch(cmd){
			case "getBuildData" : 
				result = idcService.selectBuild(param);
				break;
			case "getRackData" : 
				result = idcService.selectRackInfo(rackId);
				break;
			case "getRackInData" : 
				result = idcService.selectRackInList(rackId);
				break;
			case "getPOPUPEventData" : 
				result = idcService.getPOPUPEventData(rackId);
				break;
			case "getRoomData" : 
				result = idcService.selectRoom(param);
				break;
			case "getFloorData" : 
				result = idcService.selectFloor(param);
				break;
		}
		
		return result;
	}
	
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map postProcess(@PathVariable("cmd") String cmd, @RequestBody HashMap map){
		
		Map result = new HashMap();
		
		switch(cmd){
			case "ackData":
				result.put("result", idcService.ackData(map));
				break;
		}
		
		return result;
	}
	
}
