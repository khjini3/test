package com.yescnc.core.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

import com.yescnc.core.report.report.Report;
import com.yescnc.core.report.report.ReportCondition;
import com.yescnc.core.report.report.ReportConditionData;
import com.yescnc.core.report.report.Reportlist;
import com.yescnc.core.report.report.Reports;
import com.yescnc.core.report.report.SubReportlist;

@Configuration
public class BeanConfig {


	@Bean
	public Jaxb2Marshaller getJaxb2Marshaller() {
		Jaxb2Marshaller marshller = new Jaxb2Marshaller();
		
		Class<?>[] clazz = {Reports.class, Report.class, ReportCondition.class, ReportConditionData.class, Reportlist.class, SubReportlist.class};
		
		marshller.setClassesToBeBound(clazz);
		return marshller;
	}
}
