package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class PanelVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7206261825740289085L;
	
	private Integer id;
	private Integer userId;
	private String groupId;
	private Integer max_id;
	private String panelName;
	private String widgetData;
}