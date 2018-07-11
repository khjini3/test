package com.yescnc.core.main.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.YescoreBootApplication;
import com.yescnc.core.fm.action.RtrvCurAlarmLastSeqNo;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.json.JsonResult;

@RestController
@RequestMapping("/alarmModel")
public class AlarmModelController {

	private static final Logger logger = LoggerFactory.getLogger(AlarmModelController.class);
	
	@Autowired
	private RtrvCurAlarmLastSeqNo rtrvCurAlarmLastSeqNo;
	
	@RequestMapping(method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public JsonResult getAlarmModel(HttpServletRequest req, HttpServletResponse res) {
		logger.info("Requested AlarmModel");
		return rtrvSummaryAlarm(null);
	}
	
	private JsonResult rtrvSummaryAlarm(Map<String, Object> reqData)
	{
		JsonResult restResponse = new JsonResult();
		Map<String, Object> result = null;

		try {
			/*
			MyMessage sendMessage = new MyMessage("app.fm", RTRV_CUR_ALARM_LAST_SEQ_NO);

			Map<String, Object> body = new HashMap<String, Object>();
			body.put(MsgKey.PROC_NAME, "app.fm");
			sendMessage.setBody(body);

			result = jmsWebModule.sendRequestMessage(sendMessage);
			*/
			Map<String, Object> body = new HashMap<String, Object>();
			body.put(MsgKey.PROC_NAME, "app.fm");
			restResponse = rtrvCurAlarmLastSeqNo.handleMessage(body);
		} catch (Exception e) {
			e.printStackTrace();
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.null");
			return restResponse;
		}

		if (restResponse.getResult() == null || !restResponse.getResult()) {
			logger.error("response is null");
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.null");
			return restResponse;
		}
		
		restResponse.setResult(true);
		
		return restResponse;
	}
	
}
