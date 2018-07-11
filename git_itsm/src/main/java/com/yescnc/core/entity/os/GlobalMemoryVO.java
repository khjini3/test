package com.yescnc.core.entity.os;

import java.util.Date;

import lombok.Data;

@Data
public class GlobalMemoryVO {
	
	private Date recordTime;
	
	private String totalMemory;
	private String usedMemory;
	private String availableMemory;
	private String memoryUsage;
	
	private String totalSwapMemory;
	private String usedSwapMemory;
	private String availableSwapMemory;
	private String swapUsage;

}
