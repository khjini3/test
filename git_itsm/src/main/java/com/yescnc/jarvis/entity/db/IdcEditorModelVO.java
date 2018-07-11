package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class IdcEditorModelVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer recid;
	private String model_id;
	private String model_name;
	private String model_desc;
	private String code_id;
	private String code_name;
}