package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class SiteManagerCompanyVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer max_id;
	private String site_id;
	private String site_name;
	private String main_phone;
	private String fax;
	private String parent_site_id;
	private String ceo_name;
	private String company_number;
	private String area;
	private String address;
	private String id;
	private String text;
	private String icon;
	private String img;
	private Boolean expanded;
	//private Boolean useYN = false;
	private String note;
	private String recid;
	private List<SiteManagerCompanyVO> nodes;
}
