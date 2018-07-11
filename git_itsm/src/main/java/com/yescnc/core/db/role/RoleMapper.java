package com.yescnc.core.db.role;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.RoleVO;
import com.yescnc.core.entity.db.UserVO;

public interface RoleMapper {
	public List<UserVO> getUserList();
	
	ArrayList<HashMap<String, Object>> getInitUserList(String group_id);
	
	ArrayList<HashMap<String, Object>> getInitMenuCheck(String group_id);
	
	ArrayList<HashMap<String, Object>> getGroupInfo();
	
	ArrayList<HashMap<String, Object>> getInitGroupInfo(String cmd);
	
	ArrayList<HashMap<String, Object>> selecteInnerUsers(Object object);
	
	public Integer insertRoleGroup(Map<String, Object> param);
	
	public Integer updateRoleGroup(Map<String, Object> param);
	
	public Integer updateUserGroup(ArrayList<HashMap<String, Object>> param);
	
	public Integer insertGroupComponent(ArrayList<HashMap<String, Object>> groupComp);
	
	public Integer deleteRoleGroup(Map<String, Object> param);
	
	public Integer updateUserBaseGroup(Map<String, Object> tt);
	
	void updateStartPage(HashMap map);
	
	void deleteGroupComponent(String groupId);

	RoleVO selectGroup(RoleVO vo);

	int updatePolling(RoleVO vo);
}
