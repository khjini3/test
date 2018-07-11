package com.yescnc.core.role.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.role.RoleDao;
import com.yescnc.core.entity.db.RoleVO;
import com.yescnc.core.entity.db.UserVO;

@Service
public class RoleServiceImpl implements RoleService{
	@Autowired
	RoleDao roleDao;
	
	/*@Override
	public List getGroupInfo() {
		return roleDao.getGroupInfo();
	}*/
	
	@Override
	public List<UserVO> getUserList(){
		return roleDao.getUserList();
	}

	@Override
	public HashMap<String, Object> getSelectedList(String cmd) {
		return roleDao.getSelectedList(cmd);
	}
	
	@Override
	public HashMap<String, Object> getInitGroupInfo() {
		return roleDao.getInitGroupInfo();
	}

	@Override
	public Integer insertRoleGroup(Map<String, Object> param) {
		return roleDao.insertRoleGroup(param);
	}
	
	@Override
	public Integer updateRoleGroup(Map<String, Object> param) {
		return roleDao.updateRoleGroup(param);
	}
	
	@Override
	public Integer updateUserGroup(Map<String, Object> param) {
		return roleDao.updateUserGroup(param);
	}

	@Override
	public Integer insertGroupComponent(Map<String, Object> param) {
		return roleDao.insertGroupComponent(param);
	}
	
	@Override
	public Integer deleteRoleGroup(Map<String, Object> param) {
		return roleDao.deleteRoleGroup(param);
	}
	
	@Override
	public RoleVO selectGroup(RoleVO vo) {
		return roleDao.selectGroup(vo);
	}
	
	@Override
	public int updatePolling(RoleVO vo) {
		return roleDao.updatePolling(vo);
	}
	
}
