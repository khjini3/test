package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class AssetCoreInfoVO implements Serializable {

	/**
	 * 자산 정보
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer recid;
	
	private String assetName;
	
	private String assetId;
	
	private String codeId;
	
	private String codeName;
	
	private String serialNumber;
	
	private Integer inOutStatus;
	
}
