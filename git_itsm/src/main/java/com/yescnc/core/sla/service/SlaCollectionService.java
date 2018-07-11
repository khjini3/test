package com.yescnc.core.sla.service;

import com.yescnc.core.entity.db.SlaCollectionVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface SlaCollectionService {
	
	public SlaCollectionVO selectSlaCollectionData(SlaCollectionVO vo);	

}
