package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class EventListVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6427566355022886151L;
	
	private Integer recid;
	private String msgGrp;
	private String name;
	private String app;
	private String obj;
	private Integer severity;
	private String updateTime;
	private Integer dupplication;
	private String ip;
	private String parentName;
}
