package com.yescnc.core.role.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.RoleVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.role.service.RoleService;

@RequestMapping(value="/role")
@RestController
public class RoleController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(RoleController.class);
	
	@Autowired
	RoleService roleService;
	
	/*@RequestMapping(value="/getGroupInfo", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getGroupInfo(){
		return roleService.getGroupInfo();
	}*/
	
	@RequestMapping(value="/getUserList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> getUserList(){
		return roleService.getUserList();
	}
	
	@RequestMapping(value="/getSelectedList/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> getSelectedList(@PathVariable("cmd") String cmd){
		return roleService.getSelectedList(cmd);
	}
	
	@RequestMapping(value="/getInitGroupInfo", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> getInitGroupInfo(){
		return roleService.getInitGroupInfo();
	}
	
	@RequestMapping(value = "/insertRoleGroup",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertRoleGroup(@RequestBody Map<String, Object> param) {
		return roleService.insertRoleGroup(param);
	}
	
	@RequestMapping(value = "/updateRoleGroup",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateRoleGroup(@RequestBody Map<String, Object> param) {
		return roleService.updateRoleGroup(param);
	}
	
	@RequestMapping(value = "/updateUserGroup",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateUserGroup(@RequestBody Map<String, Object> param) {
		return roleService.updateUserGroup(param);
	}
	
	@RequestMapping(value = "/insertGroupComponent",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertGroupComponent(@RequestBody Map<String, Object> param) {
		return roleService.insertGroupComponent(param);
	}
	
	@RequestMapping(value="/deleteRoleGroup", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteRoleGroup(@RequestBody Map<String, Object> param){
		return roleService.deleteRoleGroup(param);
	}
	
	@RequestMapping(value="/{groupId}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public RoleVO selectGroup(@PathVariable("groupId") String groupId){
		RoleVO vo = new RoleVO();
		vo.setGroupId(groupId);
		return roleService.selectGroup(vo);
	}
	
	@RequestMapping(value = "/change",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public void updatePolling(@RequestBody RoleVO vo) {
		roleService.updatePolling(vo);
	}
	
}
