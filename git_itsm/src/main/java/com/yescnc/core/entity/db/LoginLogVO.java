package com.yescnc.core.entity.db;

import lombok.Data;

@Data
public class LoginLogVO {

	public Integer sessionId;
	public String tomcatSession;
	public Integer id;
	public String loginId;
	public Integer privilege;
	public String loginTime;
	public String lastCheckTime;
	public String logoutTime;
	public String lloc;
	public String failReason;
	public String logoutReason;
	public String tomcatIp;
	public String sessionType;
	public String ipAddress;
}
