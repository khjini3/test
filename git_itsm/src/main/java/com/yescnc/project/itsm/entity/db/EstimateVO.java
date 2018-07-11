package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
//@Builder
public class EstimateVO implements Serializable {
	/**
	 * 
	 * Estimate VO
	 * 
	 */
	private static final long serialVersionUID = 8180418101203353901L;
	
	private Integer recid;
	private String estimate_id;
	private String project_id;
	private Integer edition;
	private String estimate_title;
	private Integer status;
	private String registration_date;
	private String comfirmed_date;
	private String customer_site;
	private Integer customer_id;
	private String validity;
	private String warranty;
	private String payment;
	private String note;
	private String mail_id;
	private String user_id;
	private String total_amount;
	private String reserve_str;
	
	private String project_name;
	private String site_name;
	private String customer_name;
}
