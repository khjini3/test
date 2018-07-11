package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserMenuMappingVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8745656818696562493L;
	
	private Integer userId;
	private Integer menuId;
	private Integer isShow;
}
