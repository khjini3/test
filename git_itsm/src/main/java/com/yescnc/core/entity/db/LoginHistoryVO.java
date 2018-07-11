package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;
//import lombok.Builder;

@Data
//@Builder
public class LoginHistoryVO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 3757302112020575770L;
	
	private Integer recid;
	private Integer sessionId;
	private String tomcatSession; 
	private Integer id;
	private String loginId; 
	private Integer privilege;
	private String ipAddress; 
	private String loginTime;
	private String lastCheckTime; 
	private String logoutTime;
	private String lloc;
	private Integer result;
	private String failReason;
	private String logoutReason;
	private String tomcatIp;
	private String sessionType;
	private Integer startRow;
	private Integer endRow;
	private Integer totalRow;
	private Integer max_id = -1;

}
