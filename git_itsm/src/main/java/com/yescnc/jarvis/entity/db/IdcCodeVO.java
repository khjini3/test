package com.yescnc.jarvis.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class IdcCodeVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String id;
	private String name;
	private String codeDesc;
	private String parentId;
	private Integer sortOrder;
	private String text; 
	private String icon;
	private String inOutStatus;
	private String column1;
	private String column2;
	
	/*
	 * MapEditor에서 사용
	 * */
	private String iconType = "";
	private Boolean draggable = false;
	
	
	private List<IdcCodeVO> nodes;
}
