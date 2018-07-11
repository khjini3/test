package com.yescnc.core.report.report;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

public class ReportCondition {

	private String type;
	private String column;
	private String label;
	private String columntype;

	private ReportConditionData[] data;
	
	@XmlAttribute(name="type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	@XmlAttribute(name="column")
	public String getColumn() {
		return column;
	}

	public void setColumn(String column) {
		this.column = column;
	}
	
	@XmlAttribute(name="label")
	public String getLabel() {
		return label;
	}
	
	public void setLabel(String label) {
		this.label = label;
	}
	
	@XmlAttribute(name="columntype")
	public String getColumntype() {
		return columntype;
	}

	public void setColumntype(String columntype) {
		this.columntype = columntype;
	}
	
	@XmlElement(name="data")
	public ReportConditionData[] getData() {
		return data;
	}

	public void setData(ReportConditionData[] data) {
		this.data = data;
	}

}
