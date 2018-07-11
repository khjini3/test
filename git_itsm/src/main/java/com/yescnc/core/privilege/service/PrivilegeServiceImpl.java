package com.yescnc.core.privilege.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.security.PrivilegeDao;
import com.yescnc.core.entity.db.PrivilegeVO;

@Service
public class PrivilegeServiceImpl implements PrivilegeService{
	@Autowired
	PrivilegeDao privilegeDao;
	
	@Override
	public List<PrivilegeVO> listPrivilege(){
		return privilegeDao.listPrivilege();
	}
}
