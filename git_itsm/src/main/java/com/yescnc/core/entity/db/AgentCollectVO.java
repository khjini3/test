package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
//@Builder
public class AgentCollectVO implements Serializable {
	/**
	 * 
	 * Agent Collect VO
	 * 
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer idx;
	private String protocol; 
	private String period; 
	private String unit; 
	private Integer connect_jdbc; 
	private String remote_url;
	private String remote_id;
	private String remote_pwd;
	private String query_id;
	private String query_get;
	private String query_ins;
	private String query_param;
	private Integer max_id = -1;
}
