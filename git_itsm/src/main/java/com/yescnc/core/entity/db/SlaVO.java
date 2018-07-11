package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;
//import lombok.Builder;

@Data
//@Builder
public class SlaVO implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -6308275111087181713L;
/**
	 * 
	 */
	
	private Integer id;
	private Integer idx;
	private Integer check_pid;
	private String name;
	private Integer category_pid;	
	private String category_name;
	private String type_name;
	private Integer type_pid;
	private String param_name;
	private String type;
	private String pi;
	private Integer direction;
	private double critical;
	private double major;
	private double minor;
	private Integer action;
	private Integer alarm_on_off;
	private Integer display_on_off;
	private Integer startRow;
	private Integer endRow;	
	private String stat_id;
	private String stat_column;
	private Integer max_id = -1;

}
