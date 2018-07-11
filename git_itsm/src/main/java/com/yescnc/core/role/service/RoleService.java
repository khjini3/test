package com.yescnc.core.role.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.RoleVO;
import com.yescnc.core.entity.db.UserVO;

public interface RoleService {
//	public List getGroupInfo();
	
	public List<UserVO> getUserList();
	
	public HashMap<String, Object> getSelectedList(String cmd);
	
	public HashMap<String, Object> getInitGroupInfo();
	
	public Integer insertRoleGroup(Map<String, Object> param);
	
	public Integer updateRoleGroup(Map<String, Object> param);
	
	public Integer updateUserGroup(Map<String, Object> param);
	
	public Integer insertGroupComponent(Map<String, Object> param);
	
	public Integer deleteRoleGroup(Map<String, Object> param);
	
	public RoleVO selectGroup(RoleVO vo);
	
	public int updatePolling(RoleVO vo);
}
