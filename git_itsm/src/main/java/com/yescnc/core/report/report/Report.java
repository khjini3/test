package com.yescnc.core.report.report;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

public class Report {
	String label;
	String template;
	String key;
	String reportDataKey;
	String query;
	
	private Reportlist reportlist;
	private SubReportlist subreportlist;
	
	@XmlAttribute(name="label")
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
	
	@XmlElement(name="template")
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}
	
	@XmlAttribute(name="key")
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	
	@XmlAttribute(name="reportDataKey")
	public String getReportDataKey() {
		return reportDataKey;
	}

	public void setReportDataKey(String reportDataKey) {
		this.reportDataKey = reportDataKey;
	}

	@XmlElement(name="query")
	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	@XmlElement(name = "list")
	public Reportlist getReportlist() {
		return reportlist;
	}

	public void setReportlist(Reportlist reportlist) {
		this.reportlist = reportlist;
	}

	@XmlElement(name = "subreport")
	public SubReportlist getSubReportlist() {
		return subreportlist;
	}

	public void setSubReportlist(SubReportlist subreportlist) {
		this.subreportlist = subreportlist;
	}
}
