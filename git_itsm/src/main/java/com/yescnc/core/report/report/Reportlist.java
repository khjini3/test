package com.yescnc.core.report.report;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="list")
public class Reportlist {
	
	private ReportCondition[] data;
	
	@XmlElement(name="condition")
	public ReportCondition[] getData() {
		return data;
	}

	public void setData(ReportCondition[] data) {
		this.data = data;
	}

}
