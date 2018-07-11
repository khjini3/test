package com.yescnc.core.db.security;

import java.util.List;

import com.yescnc.core.entity.db.PrivilegeVO;

public interface PrivilegeMapper {

	int insertPrivilege(PrivilegeVO privilege);

	List<PrivilegeVO> selectPrivilege(PrivilegeVO privilege);

	int updateByPrivilegeId(PrivilegeVO privilege);

	int deleteByPrivilegeId(PrivilegeVO privilege);
}
