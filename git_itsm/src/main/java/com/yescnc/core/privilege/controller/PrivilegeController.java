package com.yescnc.core.privilege.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.PrivilegeVO;
import com.yescnc.core.privilege.service.PrivilegeService;

@RequestMapping("/privilege")
@RestController
public class PrivilegeController {
	@Autowired
	PrivilegeService privilegeService;
	
	@RequestMapping(value="/listPrivilege", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<PrivilegeVO> listPrivilege(){
		return privilegeService.listPrivilege();
	}
}
