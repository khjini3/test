package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;
//import lombok.Builder;

@Data
//@Builder
public class IpVO implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 1523731212662789266L;
	
	private Integer recid;
	private Integer id;
	private String ipAddress; 
	private Integer allowance;
	private String description;
	private Integer startRow;
	private Integer endRow;	
	private Integer max_id = -1;

}
