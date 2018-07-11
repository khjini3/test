package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MenuVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6436385591550928069L;

	private Integer menuId;
	private Integer parent;
	private String menuName;
	private String url;
	private Integer privilegeId;
	private Integer sortOrder;
	private String description;
//	private Integer usingMenu;
}
