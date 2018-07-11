package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
//@Builder
public class AssetVO implements Serializable {
	/**
	 * 
	 * Product VO
	 * 
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer max_id = -1;
	private Integer recid;
	private String asset_id;
	private String asset_name;
	private String product_model;
	private String serial_number;
	private Integer status;
	private String site_id;
	private String project_id;
	private String product_id;
	private String receipt_date;
	private String release_date;
	private String project_name; 
	private String product_type; 

}
