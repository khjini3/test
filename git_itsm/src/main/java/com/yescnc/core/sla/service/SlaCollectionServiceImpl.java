package com.yescnc.core.sla.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.sla.SlaCollectionDao;
import com.yescnc.core.entity.db.SlaCollectionVO;
import com.yescnc.core.util.json.JsonPagingResult;

@Service
public class SlaCollectionServiceImpl implements SlaCollectionService {
	@Autowired
	SlaCollectionDao slaCollectionDao;
	
	@Override
	public SlaCollectionVO selectSlaCollectionData(SlaCollectionVO vo) {

		return slaCollectionDao.selectSlaCollectionData(vo);
		
	}
	
}