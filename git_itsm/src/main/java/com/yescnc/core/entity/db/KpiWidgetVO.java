package com.yescnc.core.entity.db;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
//import lombok.Builder;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class KpiWidgetVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7872080825508123947L;
	
	private Integer id;
	private Integer recid;
	private Integer max_id;
	private String kpiTitle;
	private Integer polling;
	private String chartType;
	private String kpiKeys;
	private String kpiValues;
	private String kpiCondition;
	private String kpiColumns;
	private String query;
	private Integer threshold;
	private String description;
	private String tableName;
	private Integer startRow;
	private Integer endRow;
}
