package com.yescnc.core.report.report;

import javax.xml.bind.annotation.XmlElement;

public class SubReportlist {

	private Report[] list;
	
	@XmlElement(name="report")
	public Report[] getSubReports() {
		return list;
	}

	public void setSubReports(Report[] list) {
		this.list = list;
	}

}
