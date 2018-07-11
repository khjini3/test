package com.yescnc.core.eventhistory.controller;

import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.core.entity.db.EventHistoryVO;
import com.yescnc.core.eventhistory.service.EventHistoryService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/settings/eventhistory")
@RestController
public class EventHistoryController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(EventHistoryController.class);
	
	@Autowired
	EventHistoryService eventHistoryService;

	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult operationLimitList(@RequestBody EventHistoryVO vo) {
		log.info("POST : " + vo);
		return eventHistoryService.eventHistoryLimitList(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/{seq}",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateEventHistory(@PathVariable("seq") Integer seq_no, @RequestBody EventHistoryVO vo) {
		vo.setSeq_no(seq_no);
		return eventHistoryService.updateEventHistory(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/changeAckType",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer changeAckType(@RequestBody Map<String, Object> param) {
		log.info("============================== changeAckType ================ " + param);
		return eventHistoryService.changeAckType(param);
	}
}
