package com.yescnc.core.agent.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.agent.service.AgentService;
import com.yescnc.core.agent.vo.info.CollectInfoList;
import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.entity.db.AgentCollectVO;
import com.yescnc.core.entity.db.AgentDBInfoVO;
import com.yescnc.core.report.report.Reports;;

@RequestMapping("/agent")
@RestController
public class AgentController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(AgentController.class);
	
	@Autowired
	AgentService agentService;
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value="/collect", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<AgentCollectVO> getCollectInfoList() {
		
		return agentService.selectAgentCollectInfoList();
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value="/dbinfo", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<AgentDBInfoVO> getDBInfoList() {
		
		return agentService.selectAgentDBInfoList();
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/collect", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertCollectInfo(@RequestBody AgentCollectVO vo) {
		
		return agentService.insertAgentCollectInfoList(vo);
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/dbinfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertDBInfo(@RequestBody AgentDBInfoVO vo) {

		return agentService.insertAgentDBInfoList(vo);
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/collect", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateCollectInfo(@RequestBody AgentCollectVO vo) {
		
		return agentService.updateAgentCollectInfoList(vo);
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/dbinfo", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateDBInfo(@RequestBody AgentDBInfoVO vo) {
		
		return agentService.updateAgentDBInfoList(vo);
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/collect/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteCollectInfo(@PathVariable("seq") Integer id) {
		
		return agentService.deleteAgentCollectInfoList(id);
	}
	
	/*@OperationLogging(enabled=true)*/
	@RequestMapping(value = "/dbinfo/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteDBInfo(@PathVariable("seq") Integer id) {
		
		return agentService.deleteAgentDBInfoList(id);
	}
	
	@RequestMapping(value="/condition", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public CollectInfoList getReportCondition(HttpServletRequest req) {

		return agentService.getAgentCondition(req);
	}
}
