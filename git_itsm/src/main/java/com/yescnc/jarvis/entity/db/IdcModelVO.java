package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class IdcModelVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6934548808226518917L;
	
	private String compeId;
	private String compName;
	private String modelId;
	private String modelName;
	private String modelType;
	private String assetId;
	private Float positionX;
	private Float positionY;
	private Float positionZ;
	private Float scaleX;
	private Float scaleY;
	private Float scaleZ;
	private String toolTipTxt;
	private String toolTipFlug;
	private String eventFlug; //Event 여부
	private Float rotationX;
	private Float rotationY;
	private Float rotationZ;
	private String camera;
	private String codeId;
	private String parentId;
	private String partitionType;
	
}
