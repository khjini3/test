package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
//@Builder
public class ProductVO implements Serializable {
	/**
	 * 
	 * Product VO
	 * 
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer max_id = -1;
	private Integer recid;
	private Integer cnt;
	private String product_id;
	private String product_name;
	private String spec;
	private String product_type;
	private String note;
	private String file_name; 
	private String site_id;
	
}
