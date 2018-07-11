package com.yescnc.core.widget.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.SlaVO;
import com.yescnc.core.entity.db.SlaWidgetVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.widget.service.SlaWidgetService;

@RequestMapping("/dashboard/slawidgets")
@RestController
public class SlaWidgetController {
	private Logger logger = LoggerFactory.getLogger(SlaWidgetController.class);
	
	@Autowired
	SlaWidgetService slaWidgetService;
	
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<SlaWidgetVO> selectSlaWidgetList() {
		return slaWidgetService.selectSlaWidgetList();
	}
	
	@RequestMapping(value = "/categoryList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult readSlaCategoryXML() {
		logger.info("readSlaCategoryXML");
		return slaWidgetService.readSlaCategoryXML();
	}
	
}
