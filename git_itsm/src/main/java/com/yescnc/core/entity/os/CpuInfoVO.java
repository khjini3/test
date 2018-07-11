package com.yescnc.core.entity.os;

import java.util.Date;

import lombok.Data;

@Data
public class CpuInfoVO {

	private Date recordTime;
	private String user;
	private String nice;
	private String sys;
	private String idle;
	private String iowait;
	private String irq;
	private String softirq;
	private String usage;
	
	private String coreUsage;
}
