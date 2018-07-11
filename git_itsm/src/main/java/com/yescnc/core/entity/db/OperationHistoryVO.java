package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
//import lombok.Builder;

@Data
//@Builder
public class OperationHistoryVO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7407768028587836290L;
	private Integer id;
	private Integer recid;
	private String loginId; 
	private Integer privilege;
	private String ipAddress; 
	private String category;
	private String actionType; 
	private String command;
	private String requestTime;
	private String responseTime;
	private Integer result;
	private String failReason;
	private Integer startRow;
	private Integer endRow;	
	private List userList;
	private Integer max_id = -1;

}
