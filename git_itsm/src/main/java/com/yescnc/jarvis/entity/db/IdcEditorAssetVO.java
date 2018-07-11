package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class IdcEditorAssetVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer recid;
	private String asset_id;
	private String asset_name;
	private String code_id;
	private String code_name;
	private String model_id;
	private String model_name;
	private String loc_id;
	private String loc_name;
}