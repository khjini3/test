package com.yescnc.core.db.eventNotification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.AssetCoreInfoVO;
import com.yescnc.core.entity.db.UserVO;

public interface EventNotificationDao {

	public List<UserVO> getNotiUserList();

	public List<AssetCoreInfoVO> getNotiTargetList();

	public Integer saveNotiInfo(Map<String, Object> param);

	public Integer updateNotiInfo(Map<String, Object> param);

	public HashMap<String, Object> getNotiInitGroupList();

	public HashMap<String, Object> getNotiSelectedList(String cmd);

	public Integer deleteNotiGroup(Map<String, Object> param);

	public Integer updateNotiGroupStatus(Map<String, Object> param);

	//---------------- USER NOTIFICATION ---------------------------
	public Integer userSaveInfo(Map<String, Object> param);

	public HashMap<String, Object> getNotiUserInitList();

	public Integer userUpdateInfo(Map<String, Object> param);

	public Integer deleteUser(Map<String, Object> param);

	public Integer targetSaveInfo(Map<String, Object> param);

	public Integer deleteTarget(Map<String, Object> param);

	public ArrayList<Object> getTargetList(String cmd);

	public Integer targetUpdateInfo(Map<String, Object> param);

	public List<UserVO> getAllUserList();
	
}
