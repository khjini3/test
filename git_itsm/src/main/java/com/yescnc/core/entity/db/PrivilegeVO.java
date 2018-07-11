package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PrivilegeVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6043636611318186322L;
	
	private Integer id; 
	private String name;
}
