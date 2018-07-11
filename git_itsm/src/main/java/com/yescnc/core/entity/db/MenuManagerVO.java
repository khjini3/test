package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class MenuManagerVO implements Serializable {
	
	private static final long serialVersionUID = -6436385591550928069L;

	private Integer menuId;
	private Integer parent;
	private String menuName;
	private String url;
	private Integer privilegeId;
	private Integer sortOrder;
	private String description;
	private Integer usingMenu;
	private String id;
	private String text;
	private String icon;
	private String img;
	private Boolean expanded;
	private List<MenuManagerVO> nodes;
	private Boolean useYN = false;
}
