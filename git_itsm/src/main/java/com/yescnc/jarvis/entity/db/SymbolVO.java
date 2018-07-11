package com.yescnc.jarvis.entity.db;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class SymbolVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	private String compId;
	private String assetId;
	private String assetName;
	private String groupId;
	private String groupName;
	
	private String symbolType;
	private String transform;
	private String loc;
	private String mapId;
	private String color;
	
	private List<SymbolVO> nodes;
	
	private String symbolId;
	private String symbolSvg;
	private String codeId;
	
	private String id;
	private String parentId;
	private String text;
	private int severity;
	private int recid;
	private String ip;
	
}
