package com.yescnc.core.widget.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.sla.service.SlaAlarmManager;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.widget.service.WidgetService;

@RequestMapping("/dashboard/widget")
@RestController
public class WidgetController {
	//private org.slf4j.Logger log = LoggerFactory.getLogger(WidgetController.class);
	
	@Autowired
	WidgetService widgetService;
	
	@Autowired
	SlaAlarmManager slaAlarmManager;
	
	//@OperationLogging(enabled=true)
	@RequestMapping(value = "/sysmon/{seq}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public JsonResult selectSystemMonitoringData(@PathVariable("seq") Integer id) throws Exception {
			return widgetService.systemMonitoringData(id);
	}
	
	@RequestMapping(value = "/data/{seq}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public JsonResult selectWidgetData(@PathVariable("seq") Integer id) throws Exception {
		return widgetService.getWidgetData(id);
	}
	
	@RequestMapping(value = "/alarm/{seq}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public void alarmTest(@PathVariable("seq") Integer seq) throws Exception {
		if(seq == 0) {
			slaAlarmManager.slaAlarm("", "", 12345, "testAlarm", "", 1, 0, null);
		}else {
			slaAlarmManager.slaAlarm("", "", 12345, "testAlarm", "", 1, 1, null);
		}
		
	}
}
