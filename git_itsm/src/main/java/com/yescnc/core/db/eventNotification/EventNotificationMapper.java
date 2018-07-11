package com.yescnc.core.db.eventNotification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.AssetCoreInfoVO;
import com.yescnc.core.entity.db.UserVO;

public interface EventNotificationMapper {
	List<UserVO> getUserList();
	
	List<AssetCoreInfoVO> getTargetList();

	void saveNotiGroupInfo(ArrayList<HashMap<String, Object>> param);

	void saveNotiTargetInfo(ArrayList<HashMap<String, Object>> param);

	void saveNotiUserInfo(ArrayList<HashMap<String, Object>> param);

	ArrayList<HashMap<String, Object>> getNotiGroupList();

	ArrayList<HashMap<String, Object>> getInitTargetList(String uId);

	ArrayList<HashMap<String, Object>> getInitUserList(String uId);

	void deleteNotiTargetList(String uId);

	void deleteNotiUserList(String uId);

	void updateNotiUserInfo(ArrayList<HashMap<String, Object>> param);

	void deleteNotiGroup(Map<String, Object> param);

	ArrayList<HashMap<String, Object>> getInitGroupList(String cmd);

	void deleteGroupList(String uId);

	void updateNotiGroupInfo(ArrayList<HashMap<String, Object>> group);

	void updateNotiGroupStatus(Map<String, Object> param);

	//---------------- USER NOTIFICATION ---------------------------
	void userSaveInfo(ArrayList<HashMap<String, Object>> userList);

	void targetDeleteInfo();
	
	void userTargetSaveInfo(ArrayList<HashMap<String, Object>> targetList);

	void userDeleteInfo();

	ArrayList<HashMap<String, Object>> getUser();

	ArrayList<Object> getUserTargetList(String userId);

	void updateNotiUser(ArrayList<HashMap<String, Object>> user);

	void deleteUser(Map<String, Object> param);

	void targetDeleteInfo(String userId);

	void targetSaveInfo(ArrayList<HashMap<String, Object>> targetList);

	void deleteTarget(Map<String, Object> param);

	void userUpdateInfo(HashMap<String, Object> user);

	void notiUserUpdateInfo(HashMap<String, Object> notiUser);

	void targetUpdateInfo(Map<String, Object> param);

	List<UserVO> getAllUserList();
	
}
