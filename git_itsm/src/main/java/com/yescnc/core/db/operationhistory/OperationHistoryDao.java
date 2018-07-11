package com.yescnc.core.db.operationhistory;

import java.util.List;

import com.yescnc.core.entity.db.OperationHistoryVO;

public interface OperationHistoryDao {

	public int insertOperationHistory(OperationHistoryVO vo);
	
	public OperationHistoryVO selectOperationHistory(OperationHistoryVO vo);
	
	public List<OperationHistoryVO> selectOperationHistoryList();
	
	public String selectOperationHistoryForLogin(OperationHistoryVO vo);
	
	public int updateByOperationHistoryId(OperationHistoryVO vo);
	
	public int deleteByOperationHistoryId(OperationHistoryVO vo);
	
	public List<OperationHistoryVO> searchOperationHistoryList(OperationHistoryVO vo);
	
	public int operationListTotalRecord();	
	
	public List<OperationHistoryVO> operationLimitList(OperationHistoryVO vo);
	
	public List<OperationHistoryVO> searchCagegoryList(OperationHistoryVO vo);
	
	public List<OperationHistoryVO> searchActionTypeList(OperationHistoryVO vo);
}
