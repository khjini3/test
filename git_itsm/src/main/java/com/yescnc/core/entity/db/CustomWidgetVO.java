package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class CustomWidgetVO  implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7887385854184074448L;
	
	private Integer id;
	private Integer max_id;
	private String customTitle;
	private String widgetName;
	private String chartType;
	private Integer polling;
	private Integer xpos;
	private Integer ypos;
	private Integer width;
	private Integer height;
	private String url;
	private String description;
	
}
