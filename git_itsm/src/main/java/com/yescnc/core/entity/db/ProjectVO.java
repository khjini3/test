package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class ProjectVO implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 1076992503056491819L;
	
	private Integer id;
	private String projectTitle;
	private String scheduleStart;
	private String scheduleEnd;
	private String state;
}
