package com.yescnc.jarvis.entity.db;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class AssetInfoVO implements Serializable {

	/**
	 * 자산 정보
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer recid;
	
	private String assetId;
	
	private String assetName;
	
	private String codeId;
	
	private String modelId;
	
	private String modelName;
	
	private String modelDesc;
	
	private String locId;
	
	private String locName;
	
	private String mappingYN;
	
	private String codeName;
	
	private Integer unitSize;
	
	private Integer startPosition;
	
	private Integer endPosition;
	
	private Integer unitIndex;
	
	private String temp;
	
	private String parentId;
	
	private Map w2ui;
	
	private String serialNumber;
	
	private String productModel;
	
	private String status;
	
	private String fwVersion;
	
	private String hwVersion;
	
	private String revision;
	
	private String releaseDate;
	
	private String receiptDate;
	
	private String codeDesc;
	
	private Integer sequenceId;
	
	private String symbolId;
	
	private String symbolSvg;
	
	private Integer symbolSeqId;
	
	private List<AssetInfoVO> children;
	
	/*
	 * MapEditor에서 사용하는 variable
	 * **/
	
	private List<AssetInfoVO> nodes = new ArrayList<AssetInfoVO>();
	
	private Boolean draggable = true;
	private String text; 
	private String icon;
	private String id;
	private String name;
	private String nodeStyle = ""; //W2UI  기능 추가 Node별 Style
}
