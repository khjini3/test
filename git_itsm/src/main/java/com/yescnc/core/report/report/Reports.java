package com.yescnc.core.report.report;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name = "reports")
public class Reports {

	private Report[] report;

	@XmlElement(name = "report")
	public Report[] getReport() {
		return report;
	}

	public void setReport(Report[] report) {
		this.report = report;
	}

}
