package com.yescnc.core.eventNotification.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.AssetCoreInfoVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.eventNotification.service.EventNotificationService;

@RequestMapping("/eventNotification")
@RestController
public class EventNotificationController {
	@Autowired
	EventNotificationService eventNotificationService;
	
	@RequestMapping(value="/getNotiAllUserList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> getNotiUserList(){
		return eventNotificationService.getNotiUserList();
	}
	
	@RequestMapping(value="/getNotiAllTargetList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<AssetCoreInfoVO> getNotiTargetList(){
		return eventNotificationService.getNotiTargetList();
	}
	
	@RequestMapping(value="/saveNotiInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer saveNotiInfo(@RequestBody Map<String, Object> param){
		return eventNotificationService.saveNotiInfo(param);
	}
	
	@RequestMapping(value="/updateNotiInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateNotiInfo(@RequestBody Map<String, Object> param){
		return eventNotificationService.updateNotiInfo(param);
	}

	@RequestMapping(value="/getNotiInitGroupList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> getNotiInitGroupList(){
		return eventNotificationService.getNotiInitGroupList();
	}
	
	@RequestMapping(value="/getNotiSelectedList/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> getNotiSelectedList(@PathVariable("cmd") String cmd){
		return eventNotificationService.getNotiSelectedList(cmd);
	}
	
	@RequestMapping(value="/deleteNotiGroup", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteNotiGroup(@RequestBody Map<String, Object> param){
		return eventNotificationService.deleteNotiGroup(param);
	}
	
	@RequestMapping(value="/updateNotiGroupStatus", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateNotiGroupStatus(@RequestBody Map<String, Object> param){
		return eventNotificationService.updateNotiGroupStatus(param);
	}
	
	//---------------- USER NOTIFICATION ---------------------------
	@RequestMapping(value="/getAllUserList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> getAllUserList(){
		return eventNotificationService.getAllUserList();
	}
	
	@RequestMapping(value="/userSaveInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer userSaveInfo(@RequestBody Map<String, Object> param){
		return eventNotificationService.userSaveInfo(param);
	}
	
	@RequestMapping(value="/targetSaveInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer targetSaveInfo(@RequestBody Map<String, Object> param){
		return eventNotificationService.targetSaveInfo(param);
	}
	
	@RequestMapping(value="/getNotiUserInitList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> getNotiUserInitList(){
		return eventNotificationService.getNotiUserInitList();
	}
	
	@RequestMapping(value="/userUpdateInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer userUpdateInfo(@RequestBody Map<String, Object> param){
		return eventNotificationService.userUpdateInfo(param);
	}
	
	@RequestMapping(value="/targetUpdateInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer targetUpdateInfo(@RequestBody Map<String, Object> param){
		return eventNotificationService.targetUpdateInfo(param);
	}
	
	@RequestMapping(value="/getTargetList/{cmd}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public ArrayList<Object> getTargetList(@PathVariable("cmd") String cmd){
		return eventNotificationService.getTargetList(cmd);
	}
	
	@RequestMapping(value="/deleteUser", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteUser(@RequestBody Map<String, Object> param){
		return eventNotificationService.deleteUser(param);
	}
	
	@RequestMapping(value="/deleteTarget", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteTarget(@RequestBody Map<String, Object> param){
		return eventNotificationService.deleteTarget(param);
	}
}
