package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;
//import lombok.Builder;

@Data
//@Builder
public class UserVO implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer id;
	private Integer recid;
	private String userId; 
	private String password; 
	private Integer privilegeId; 
	private Integer groupId; 
	private Integer status;
	private String userName;
	private String userName_eng;
	private String email;
	private String createTime;
	private Integer loginStatus;
	private String lastLoginTime;
	private String lastLoginIp;
	private String phone;
	private String alarm_on_off;
	private String alarm_type;
	private String sessionId;
	private String result;
	private String failReason;
	private String ipAddress;
	private String tempPassword;	
	private Integer startRow;
	private Integer endRow;	
	private Integer max_id = -1;
	private String privilegeName;
	private String group_id;
}
