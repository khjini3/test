package com.yescnc.project.itsm.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class EmailVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int mailId;
	private String cmdId;
	private String cmdType;
	private String fromTarget;
	private String toTarget;
	private String appendTarget;
	private String fileName;
	private String orgFileName;
	private String mailSendTime;
	private String mailTitle;
	private String mailBody;
	private Boolean sendMailSuccess;
	private Boolean insertHistorySuccess;
	private Boolean selectHistorySuccess;
	private Boolean attachFileDelete;
	private Boolean result;
	private int mail_id;
	
}
