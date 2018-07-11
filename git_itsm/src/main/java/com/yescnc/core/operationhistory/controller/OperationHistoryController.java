package com.yescnc.core.operationhistory.controller;

import java.util.List; 

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.entity.db.OperationHistoryVO;
import com.yescnc.core.operationhistory.service.OperationHistoryService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/settings/operationhistory")
@RestController
public class OperationHistoryController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(OperationHistoryController.class);
	
	@Autowired
	OperationHistoryService operationHistoryService;
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<OperationHistoryVO> operationHistoryList(/*@RequestParam(value = "search", required = false) String searchItem*/) {
//		if(searchItem != null) {
//			LoginHistoryVO vo = new LoginHistoryVO();
//			vo.setLoginId(searchItem);
//			log.info("GET : " + vo);
//			return loginHistoryService.searchLoginHistoryList(vo);
//		} else {
			return operationHistoryService.selectOperationHistoryList();
//		}
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/search", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<OperationHistoryVO> selectOperationHistoryList(@RequestBody OperationHistoryVO vo) {
		log.info("POST : " + vo);
		return operationHistoryService.searchOperationHistoryList(vo);
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public OperationHistoryVO selectOperationHistory(@PathVariable("seq") Integer id) {
		OperationHistoryVO vo = new OperationHistoryVO();
		vo.setId(id);
		return operationHistoryService.selectOperationHistory(vo);
	}
	
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertOperationHistory(@RequestBody OperationHistoryVO vo) {
		log.info("POST : " + vo);
		return operationHistoryService.insertOperationHistory(vo);
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateOperationHistory(@PathVariable("seq") Integer id, @RequestBody OperationHistoryVO vo) {
		log.info("PUT : " + vo);
		//UserVO vo1 = new UserVO();
		vo.setId(id);
		return operationHistoryService.updateByOperationHistoryId(vo);
	}
	
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteOperationHistory(@PathVariable("seq") Integer id) {
		log.info("DELETE : " + id);
		OperationHistoryVO vo = new OperationHistoryVO();
		vo.setId(id);
		return operationHistoryService.deleteByOperationHistoryId(vo);
	}

	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult operationLimitList(@RequestBody OperationHistoryVO vo) {
		log.info("POST : " + vo);
		return operationHistoryService.operationLimitList(vo);
	}
}
