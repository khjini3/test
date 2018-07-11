package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsergGroupVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1871427569595127081L;
	
	private Integer groupId; 
	private String groupName;
}
