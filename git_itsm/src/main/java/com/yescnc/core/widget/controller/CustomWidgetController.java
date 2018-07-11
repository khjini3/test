package com.yescnc.core.widget.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.CustomWidgetVO;
import com.yescnc.core.widget.service.CustomWidgetService;

@RequestMapping("/dashboard/customwidgets")
@RestController
public class CustomWidgetController {
	//private org.slf4j.Logger log = LoggerFactory.getLogger(CustomWidgetController.class);
	
	@Autowired
	CustomWidgetService customWidgetService;
	
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<CustomWidgetVO> selectKpiWidgetList() {
		return customWidgetService.selectCustomWidgetList();
	}
	
}
