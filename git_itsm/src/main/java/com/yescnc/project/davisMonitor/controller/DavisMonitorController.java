package com.yescnc.project.davisMonitor.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.entity.db.EventListVO;
import com.yescnc.project.davisMonitor.service.DavisMonitorService;

@RequestMapping("/davisMonitor")
@RestController
public class DavisMonitorController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(DavisMonitorController.class);
	
	@Autowired
	DavisMonitorService davisMonitorService;
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getData(@PathVariable String cmd){
		List result = new ArrayList();
		
		switch(cmd){
			case "getEventBrowerData":
				result = davisMonitorService.getEventBrowerData();
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{param}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getPopupData(@PathVariable String cmd, @PathVariable String param){
		List result = new ArrayList();
		
		switch(cmd){
			case "getAssetInfo": // Detail Info (Asset)
				result = davisMonitorService.getAssetInfo(param);
				break;
			case "getEventViewerList": // Detail Info (Event Viewer)
				result = davisMonitorService.getEventViewerList(param);
				break;
		}
		
		return result;
	}
	
}
