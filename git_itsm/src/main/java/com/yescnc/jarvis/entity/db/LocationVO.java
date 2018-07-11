package com.yescnc.jarvis.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class LocationVO implements Serializable {

	/**
	 * Location Info
	 */
	private static final long serialVersionUID = 1L;
	
	private String locId;
	
	private Integer parentId;
	
	private String locName;
	
	private String codeId;
	
	private String codeName;
	
	private String id;
	
	private String text;
	
	private String icon;
	
	private Boolean expanded = true;
	
	private Integer unitSize;
	
	private List<LocationVO> nodes;
}
