package com.yescnc.core.user.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.core.entity.db.PrivilegeVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.user.service.UserService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/settings/user")
@RestController
public class UserManagerController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(UserManagerController.class);
	
	@Autowired
	UserService userService;
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> selectUserList(@RequestParam(value = "search", required = false) String searchItem) {
		if(searchItem != null) {
			UserVO vo = new UserVO();
			vo.setUserId(searchItem);
			return userService.searchUserList(vo);
		} else {
			return userService.selectUserList();
		}
	}
	
	@RequestMapping(value = "/retUserId", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> returnUserIdList() {
		return userService.returnUserIdList();
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/{seq}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public UserVO selectUser(@PathVariable("seq") Integer id) {
		UserVO vo = new UserVO();
		vo.setId(id);
		return userService.selectUser(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertUser(@RequestBody UserVO vo) {
		return userService.insertUser(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateUser(@PathVariable("seq") Integer id, @RequestBody UserVO vo) {
		vo.setId(id);
		return userService.updateByUserId(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteUser(@PathVariable("seq") Integer id) {
		UserVO vo = new UserVO();
		vo.setId(id);
		return userService.deleteByUserId(vo);
	}
	
	@RequestMapping(value = "/multiDelete/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteUserMulti(@PathVariable("seq") String id) {
		
		int result = -1;
		List<String> multis = Arrays.asList(id.split(","));
		Iterator<String> iterator = multis.iterator();
		
		List<UserVO> resultList = new ArrayList<>();
		Map<String, List<UserVO>> map = new HashMap<String, List<UserVO>>();		
		
		while(iterator.hasNext()){
			String tc_seq_multi = iterator.next();
			int numInt = Integer.parseInt(tc_seq_multi);
			
			UserVO multi = new UserVO();
			multi.setId(numInt);
			resultList.add(multi);
		}
		map.put("list", resultList);
		result = userService.deleteUserMulti(map);
		
		return result;

	}
	
	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult userLimitList(@RequestBody UserVO vo) {
		log.info("POST : " + vo);
		return userService.userLimitList(vo);
	}	
	
	@RequestMapping(value = "/update", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateUserId(@RequestBody UserVO vo) {
		return userService.updateByUserId(vo);
	}

	@RequestMapping(value = "/getPrivilegeList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<PrivilegeVO> getPrivilegeList() {
		return userService.getPrivilegeList();
	}
	
	@RequestMapping(value = "/getGroupList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public ArrayList<HashMap<String, Object>> getGroupList() {
		return userService.getGroupList();
	}
	
}
