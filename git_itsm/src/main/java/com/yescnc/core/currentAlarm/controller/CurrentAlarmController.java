package com.yescnc.core.currentAlarm.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.core.currentAlarm.service.CurrentAlarmService;
import com.yescnc.core.entity.db.CurrentAlarmVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

@RequestMapping("/currentAlarm")
@RestController
public class CurrentAlarmController {
	private org.slf4j.Logger logger = LoggerFactory.getLogger(CurrentAlarmController.class);
	
	@Autowired
	CurrentAlarmService currentAlarmService;

	@OperationLogging(enabled = true, category = CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/selectCurrentAlarm", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public JsonPagingResult selectCurrentAlarm(@RequestBody CurrentAlarmVO vo) {
		logger.info("POST : " + vo);
		return currentAlarmService.selectCurrentAlarm(vo);
	}
	
	@RequestMapping(value = "/alarmAck", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public JsonResult updateCurrentAlarmAck(@RequestBody HashMap<String, ?> param) {
		logger.info("alarmAck PUT : " + param);
		return currentAlarmService.updateCurrentAlarmAck(param);
	}
	
	@RequestMapping(value = "/delete", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public JsonResult deleteCurrentAlarm(@RequestBody ArrayList<CurrentAlarmVO> param) {
		logger.info("delete PUT : " + param);
		return currentAlarmService.deleteCurrentAlarm(param);
	}
}
