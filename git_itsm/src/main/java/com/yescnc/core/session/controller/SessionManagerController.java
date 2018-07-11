package com.yescnc.core.session.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.SessionVO;
import com.yescnc.core.session.service.SessionService;

@RequestMapping("/session")
@RestController
public class SessionManagerController {
	private org.slf4j.Logger logger = LoggerFactory.getLogger(SessionManagerController.class);
	
	@Autowired
	SessionService sessionService;
	
	@RequestMapping(value = "/check", method=RequestMethod.GET, produces="text/html;charset=UTF-8")
	public String checkSession(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(false);
		if(null == session){
			logger.info("checkSession is null");
			return "NOK";
		}else{
			//logger.info("Session Id : {} , lastAccess: {}", session.getId(), session.getLastAccessedTime());
			return "OK";
		}
		
		
	}
	
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<SessionVO> selectSessionList(@RequestParam(value = "search", required = false) String searchItem) {
		if(searchItem != null) {
			SessionVO vo = new SessionVO();
			vo.setLoginId(searchItem);
			return sessionService.searchSessionList(vo);
		} else {
			return sessionService.selectSessionList();
		}
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public SessionVO selectSession(@PathVariable("seq") Integer id) {
		SessionVO vo = new SessionVO();
		vo.setId(id);
		return sessionService.selectSession(vo);
	}
	
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertSession(@RequestBody SessionVO vo) {
		return sessionService.insertSession(vo);
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateSession(@PathVariable("seq") Integer id, @RequestBody SessionVO vo) {
		vo.setId(id);
		return sessionService.updateBySessionId(vo);
	}
	
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteSession(@PathVariable("seq") Integer id) {
		SessionVO vo = new SessionVO();
		vo.setId(id);
		return sessionService.deleteBySessionId(vo);
	}

}
