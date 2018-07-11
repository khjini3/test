package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
//@Builder
public class RoleVO implements Serializable {
	/**
	 * 
	 * Role VO
	 * 
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer recid;
	
	private Integer sequenceId;
	
	private String groupId;
	
	private String groupName;
	
	private Integer startPage;
	
	private Integer polling;
}
