package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.List;

import com.google.common.collect.Lists;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=true)
public class MenuTreeVO extends MenuVO implements Serializable {


	/**
	* 
	*/
	private static final long serialVersionUID = 7195227245894273869L;

	private String fullName;
	private String depth;
	
	private List<MenuTreeVO> child = Lists.newArrayList();
	
	public MenuTreeVO(Integer menuId, Integer parent, String menuName, String url, Integer privilegeId, Integer sortOrder,
			String description) { /*, Integer usingMenu */		
		super(menuId, parent, menuName, url, privilegeId, sortOrder, description);/*, usingMenu*/
	}
	
	@Builder
	private MenuTreeVO(Integer menuId, Integer parent, String menuName, String url, Integer privilegeId, Integer sortOrder,
			String description, String fullName, String depth) { /*, Integer usingMenu*/
		super(menuId, parent, menuName, url, privilegeId, sortOrder, description); /*, usingMenu*/
		this.fullName = fullName;
		this.depth = depth;
	}

}
