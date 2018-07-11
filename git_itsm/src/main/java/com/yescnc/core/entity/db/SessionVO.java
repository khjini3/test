package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
//@Builder
public class SessionVO implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 969647982310456295L;

	private Integer id;
	private String loginId; 
	private Integer privilegeId;
	private String ipAddress; 
	private String loginTime;
	private Integer max_id = -1;

	private Integer state;
	private Integer sessionId;

}
