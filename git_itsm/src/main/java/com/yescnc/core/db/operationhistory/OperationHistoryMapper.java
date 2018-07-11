package com.yescnc.core.db.operationhistory;

import java.util.List;

import com.yescnc.core.entity.db.OperationHistoryVO;

public interface OperationHistoryMapper {
	int insertOperationHistory(OperationHistoryVO vo);
	
	OperationHistoryVO selectOperationHistory(OperationHistoryVO vo);
	
	List<OperationHistoryVO> selectOperationHistoryList();
	
	String selectOperationHistoryForLogin(OperationHistoryVO vo);
	
	int updateByOperationHistoryId(OperationHistoryVO vo);
	
	int deleteByOperationHistoryId(OperationHistoryVO vo);
	
	List<OperationHistoryVO> searchOperationHistoryList(OperationHistoryVO vo);
	
	int operationListTotalRecord();
	
	List<OperationHistoryVO> operationLimitList(OperationHistoryVO vo);	

	List<OperationHistoryVO> searchCagegoryList(OperationHistoryVO vo);
	
	List<OperationHistoryVO> searchActionTypeList(OperationHistoryVO vo);
}
