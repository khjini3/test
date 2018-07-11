package com.yescnc.core.loginhistory.controller;

import java.util.List; 

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.loginhistory.service.LoginHistoryService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/settings/loginhistory")
@RestController
public class LoginHistoryController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(LoginHistoryController.class);
	
	@Autowired
	LoginHistoryService loginHistoryService;
	
	@OperationLogging(enabled=true)
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<LoginHistoryVO> loginHistoryAllList() {
//		if(searchItem != null) {
//			LoginHistoryVO vo = new LoginHistoryVO();
//			vo.setLoginId(searchItem);
//			log.info("GET : " + vo);
//			return loginHistoryService.searchLoginHistoryList(vo);
//		} else {
			return loginHistoryService.selectLoginHistoryList();
//		}
	}
	
	@OperationLogging(enabled=true)
	@RequestMapping(value = "/search", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<LoginHistoryVO> selectLoginHistoryList(@RequestBody LoginHistoryVO vo) {
		log.info("POST : " + vo);
		return loginHistoryService.searchLoginHistoryList(vo);
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public LoginHistoryVO selectLoginHistory(@PathVariable("seq") Integer id) {
		LoginHistoryVO vo = new LoginHistoryVO();
		vo.setId(id);
		return loginHistoryService.selectLoginHistory(vo);
	}
	
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertLoginHistory(@RequestBody LoginHistoryVO vo) {
		log.info("POST : " + vo);
		return loginHistoryService.insertLoginHistory(vo);
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateLoginHistory(@PathVariable("seq") Integer id, @RequestBody LoginHistoryVO vo) {
		log.info("PUT : " + vo);
		//UserVO vo1 = new UserVO();
		vo.setId(id);
		return loginHistoryService.updateByLoginHistoryId(vo);
	}
	
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteLoginHistory(@PathVariable("seq") Integer id) {
		log.info("DELETE : " + id);
		LoginHistoryVO vo = new LoginHistoryVO();
		vo.setId(id);
		return loginHistoryService.deleteByLoginHistoryId(vo);
	}
	
	@OperationLogging(enabled=true)
	@RequestMapping(value = "/list", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<LoginHistoryVO> loginHistoryList(@RequestBody LoginHistoryVO vo) {
		log.info("POST : " + vo);
		return loginHistoryService.loginHistoryList(vo);
	}

	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult loginHistoryLimitList(@RequestBody LoginHistoryVO vo) {
		log.info("POST : " + vo);
		return loginHistoryService.loginHistoryLimitList(vo);
	}
	
	@RequestMapping(value = "/logoutSearch", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<LoginHistoryVO> selectLoginHistoryForlogin(@RequestBody LoginHistoryVO vo) {
		log.info("POST : " + vo);
		return loginHistoryService.selectLoginHistoryForlogin(vo);
	}	
	
	@RequestMapping(value="/getUserList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> getUserList(){
		return loginHistoryService.getUserList();
	}
}
