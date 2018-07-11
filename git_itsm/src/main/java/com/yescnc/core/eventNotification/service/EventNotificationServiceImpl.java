package com.yescnc.core.eventNotification.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.eventNotification.EventNotificationDao;
import com.yescnc.core.entity.db.AssetCoreInfoVO;
import com.yescnc.core.entity.db.UserVO;

@Service
public class EventNotificationServiceImpl implements EventNotificationService{
	@Autowired
	EventNotificationDao eventNotificationDao;
	
	@Override
	public List<UserVO> getNotiUserList(){
		return eventNotificationDao.getNotiUserList();
	}
	
	@Override
	public List<AssetCoreInfoVO> getNotiTargetList(){
		return eventNotificationDao.getNotiTargetList();
	}
	
	@Override
	public Integer saveNotiInfo(Map<String,Object> param){
		return eventNotificationDao.saveNotiInfo(param);
	}
	
	@Override
	public Integer updateNotiInfo(Map<String,Object> param){
		return eventNotificationDao.updateNotiInfo(param);
	}
	
	@Override
	public HashMap<String, Object> getNotiInitGroupList(){
		return eventNotificationDao.getNotiInitGroupList();
	}
	
	@Override
	public HashMap<String, Object> getNotiSelectedList(String cmd){
		return eventNotificationDao.getNotiSelectedList(cmd);
	}
	
	@Override
	public Integer deleteNotiGroup(Map<String, Object> param){
		return eventNotificationDao.deleteNotiGroup(param);
	}
	
	@Override
	public Integer updateNotiGroupStatus(Map<String, Object> param){
		return eventNotificationDao.updateNotiGroupStatus(param);
	}
	
	//---------------- USER NOTIFICATION ---------------------------
	@Override
	public List<UserVO> getAllUserList(){
		return eventNotificationDao.getAllUserList();
	}
	
	@Override
	public Integer userSaveInfo(Map<String,Object> param){
		return eventNotificationDao.userSaveInfo(param);
	}
	
	@Override
	public Integer targetSaveInfo(Map<String,Object> param){
		return eventNotificationDao.targetSaveInfo(param);
	}
	
	@Override
	public HashMap<String, Object> getNotiUserInitList(){
		return eventNotificationDao.getNotiUserInitList();
	}
	
	@Override
	public Integer userUpdateInfo(Map<String,Object> param){
		return eventNotificationDao.userUpdateInfo(param);
	}
	
	@Override
	public Integer targetUpdateInfo(Map<String,Object> param){
		return eventNotificationDao.targetUpdateInfo(param);
	}
	
	@Override
	public Integer deleteUser(Map<String, Object> param){
		return eventNotificationDao.deleteUser(param);
	}
	
	@Override
	public Integer deleteTarget(Map<String, Object> param){
		return eventNotificationDao.deleteTarget(param);
	}
	
	@Override
	public ArrayList<Object> getTargetList(String cmd){
		return eventNotificationDao.getTargetList(cmd);
	}
}
