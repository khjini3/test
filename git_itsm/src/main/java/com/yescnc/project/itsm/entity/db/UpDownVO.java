package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class UpDownVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer recid;
	private String fileId;
	private String cmdId;
	private String cmdType;
	private String orgFileName;
	private String fileName;
	private String createTime;
}
