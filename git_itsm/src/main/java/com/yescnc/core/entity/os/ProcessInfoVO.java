package com.yescnc.core.entity.os;

import lombok.Data;

@Data
public class ProcessInfoVO {
	private int processId;
	private double cpuPercent;
	private double memPercent;
	private long virtualMemAsLong;
	private String virtualMemAsUnit;
	private long rssAsLong;
	private String rssAsUnit;
	private String Name;
}
