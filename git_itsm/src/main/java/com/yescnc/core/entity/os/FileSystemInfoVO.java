package com.yescnc.core.entity.os;

import java.util.Date;

import lombok.Data;

@Data
public class FileSystemInfoVO {

	private Date recordTime;
	
	private String fileSystem;
	private String mount;
	private String totalSpace;
	private String usedSpace;
	private String usableSpace;
	private String usage;
}
