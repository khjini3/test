package com.yescnc.core.sla.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.SlaCollectionVO;
import com.yescnc.core.sla.service.SlaCollectionService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/sla/collection")
@RestController
public class SlaCollectionWidgetController {

	@Autowired
	SlaCollectionService slaCollectionService;
	
	@RequestMapping(value = "/data", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public SlaCollectionVO selectSlaCollectionData(@RequestBody SlaCollectionVO vo) {
		return slaCollectionService.selectSlaCollectionData(vo);
	}	
	
}
