package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
//@Builder
public class AgentDBInfoVO implements Serializable {
	/**
	 *  Agent collect DB info
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer idx;
	private String name; 
	private String driver; 
	private String hostname; 
	private String id;
	private String password;
	private String port;
	private String schema;
	private String description;
	private Integer max_id = -1;

	private String db_id; 
}
