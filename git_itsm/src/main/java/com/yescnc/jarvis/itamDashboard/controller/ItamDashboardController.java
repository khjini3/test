package com.yescnc.jarvis.itamDashboard.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.assetManager.controller.AssetManagerController;
import com.yescnc.jarvis.itamDashboard.service.ItamDashboardService;

@RequestMapping("/itamDashboard")
@RestController
public class ItamDashboardController {

	private org.slf4j.Logger log = LoggerFactory.getLogger(ItamDashboardController.class);
	
	@Autowired
	ItamDashboardService itamDashboardService;
	
	@RequestMapping(value="/{cmd}/{value}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getDataList(@PathVariable("cmd") String cmd, @PathVariable("value") String value ){
		List result = new ArrayList();
		
		switch(cmd){
			case "getModel":
				result = itamDashboardService.getModel(value);
				break;
			case "getLocation":
				result = itamDashboardService.getLocation(value);
				break;
			case "getInstockWeekly":
				result = itamDashboardService.getInstockWeekly();
				break;
			case "getInstockMonthly":
				result = itamDashboardService.getInstockMonthly();
				break;
			case "getActiveWeekly":
				result = itamDashboardService.getActiveWeekly();
				break;
			case "getActiveMonthly":
				result = itamDashboardService.getActiveMonthly();
				break;
			case "getKeepWeekly":
				result = itamDashboardService.getKeepWeekly();
				break;
			case "getKeepMonthly":
				result = itamDashboardService.getKeepMonthly();
				break;
		}
		
		return result;
	}
}
