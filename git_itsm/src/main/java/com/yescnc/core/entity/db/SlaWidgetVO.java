package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class SlaWidgetVO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -5122099988347352376L;
	
	private Integer id;
	private Integer max_id;
	private String slaTitle;
	private String widgetName;
	private String chartType;
	private Integer polling;
	private Integer xpos;
	private Integer ypos;
	private Integer width;
	private Integer height;
	private String url;
	private String description;
	private Integer alarmCode;
	private String dataColumn;
	private String unit;
	private String legend;
	private Integer displayCode;
}
