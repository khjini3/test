package com.yescnc.core.operationhistory.service;

import java.util.List;

import com.yescnc.core.entity.db.OperationHistoryVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface OperationHistoryService {
	public int insertOperationHistory(OperationHistoryVO vo);
	
	public OperationHistoryVO selectOperationHistory(OperationHistoryVO vo);
	
	public List<OperationHistoryVO> selectOperationHistoryList();
	
	public int updateByOperationHistoryId(OperationHistoryVO vo);
	
	public int deleteByOperationHistoryId(OperationHistoryVO vo);
	
	public List<OperationHistoryVO> searchOperationHistoryList(OperationHistoryVO vo);
	
	public JsonPagingResult operationLimitList(OperationHistoryVO vo);
}
