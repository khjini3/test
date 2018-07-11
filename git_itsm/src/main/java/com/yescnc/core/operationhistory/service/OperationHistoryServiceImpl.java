package com.yescnc.core.operationhistory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.operationhistory.OperationHistoryDao;
import com.yescnc.core.entity.db.OperationHistoryVO;
import com.yescnc.core.util.json.JsonPagingResult;

@Service
public class OperationHistoryServiceImpl implements OperationHistoryService {
	
	//private org.slf4j.Logger log = LoggerFactory.getLogger(UserManagerController.class);
	
	@Autowired
	OperationHistoryDao operationHistoryDao;
	
	@Override
	public int insertOperationHistory(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return operationHistoryDao.insertOperationHistory(vo);
	}

	@Override
	public OperationHistoryVO selectOperationHistory(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return operationHistoryDao.selectOperationHistory(vo);
	}

	@Override
	public List<OperationHistoryVO> selectOperationHistoryList() {
		// TODO Auto-generated method stub
		return operationHistoryDao.selectOperationHistoryList();
	}

	@Override
	public int updateByOperationHistoryId(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return operationHistoryDao.updateByOperationHistoryId(vo);
	}

	@Override
	public int deleteByOperationHistoryId(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return operationHistoryDao.deleteByOperationHistoryId(vo);
	}
	
	@Override
	public List<OperationHistoryVO> searchOperationHistoryList(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return operationHistoryDao.searchOperationHistoryList(vo);
	}

	@Override
	public JsonPagingResult operationLimitList(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
    	//int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();

    	List<OperationHistoryVO> categoryList = operationHistoryDao.searchCagegoryList(vo);
    	List<OperationHistoryVO> actionTypeList = operationHistoryDao.searchActionTypeList(vo);
    	//vo.setStartRow(startRow);
		List<OperationHistoryVO> limitList = operationHistoryDao.operationLimitList(vo);
		
		for(int i = 0; i < actionTypeList.size(); i++) {
			if(actionTypeList.get(i).getActionType().equals("DELETE")) {
				actionTypeList.get(i).setActionType("DLT");
			}
		}
		
		for(int i = 0; i < limitList.size(); i++) {
			limitList.get(i).setRequestTime(limitList.get(i).getRequestTime().substring(0, limitList.get(i).getRequestTime().indexOf('.')));
			limitList.get(i).setResponseTime(limitList.get(i).getResponseTime().substring(0, limitList.get(i).getResponseTime().indexOf('.')));
			if(limitList.get(i).getActionType().equals("DELETE")) {
				limitList.get(i).setActionType("DLT");
			}
		}
		
		int totalCount = operationHistoryDao.operationListTotalRecord();
		//logger.info("searchLoginHistoryListTotalRecord={}" , totalCount);
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("data", limitList);
		result.setData("categoryList", categoryList);
		result.setData("actionTypeList", actionTypeList);
		//return loginHistoryDao.loginHistoryLimitList(vo);
		return result;
	}
}