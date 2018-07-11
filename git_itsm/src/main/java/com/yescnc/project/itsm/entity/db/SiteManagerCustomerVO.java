package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class SiteManagerCustomerVO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7417960548299879921L;
	private Integer max_id;
	private Integer customer_id;
	private String customer_name;
	private String phone;
	private String email;
	private String department;
	private String site_id;
	private String task;
	private String rank;
	private Integer recid;
	private String site_name;
	private String parent_site_id;
	private String mobile_phone;
}
