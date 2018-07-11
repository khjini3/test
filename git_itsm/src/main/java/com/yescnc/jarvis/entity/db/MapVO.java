package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class MapVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String mapId;
	private int width;
	private int height;
	private String pageName;
	
	private String currentPosition;
}
