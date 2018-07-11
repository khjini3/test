package com.yescnc.core.db.operationhistory;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.OperationHistoryVO;

@Repository
public class OperationHistoryDaoImpl implements OperationHistoryDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertOperationHistory(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).insertOperationHistory(vo);
	}

	@Override
	public OperationHistoryVO selectOperationHistory(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).selectOperationHistory(vo);
	}

	@Override
	public List<OperationHistoryVO> selectOperationHistoryList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).selectOperationHistoryList();
	}

	@Override
	public String selectOperationHistoryForLogin(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).selectOperationHistoryForLogin(vo);
	}

	@Override
	public int updateByOperationHistoryId(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).updateByOperationHistoryId(vo);
	}

	@Override
	public int deleteByOperationHistoryId(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).deleteByOperationHistoryId(vo);
	}
	
	@Override
	public List<OperationHistoryVO> searchOperationHistoryList(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).searchOperationHistoryList(vo);
	}	
	
	@Override
	public int operationListTotalRecord() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).operationListTotalRecord();
	}
	
	@Override
	public List<OperationHistoryVO> operationLimitList(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).operationLimitList(vo);
	}	
	
	@Override
	public List<OperationHistoryVO> searchCagegoryList(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).searchCagegoryList(vo);
	}
	
	@Override
	public List<OperationHistoryVO> searchActionTypeList(OperationHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(OperationHistoryMapper.class).searchActionTypeList(vo);
	}
}
