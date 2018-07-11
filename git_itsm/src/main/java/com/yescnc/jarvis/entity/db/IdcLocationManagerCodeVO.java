package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class IdcLocationManagerCodeVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String code_id;
	private String code_name;
	private String code_desc;
	private String parent_code_id;
	private Integer sort_order;
}