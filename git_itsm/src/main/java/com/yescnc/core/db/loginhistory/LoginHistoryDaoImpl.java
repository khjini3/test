package com.yescnc.core.db.loginhistory;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.LoginHistoryVO;

@Repository
public class LoginHistoryDaoImpl implements LoginHistoryDao {
	
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertLoginHistory(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).insertLoginHistory(vo);
	}

	@Override
	public LoginHistoryVO selectLoginHistory(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).selectLoginHistory(vo);
	}

	@Override
	public List<LoginHistoryVO> selectLoginHistoryList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).selectLoginHistoryList();
	}

	@Override
	public String selectLoginHistoryForLogin(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).selectLoginHistoryForLogin(vo);
	}

	@Override
	public int updateByLoginHistoryId(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).updateByLoginHistoryId(vo);
	}

	@Override
	public int deleteByLoginHistoryId(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).deleteByLoginHistoryId(vo);
	}
	
	@Override
	public List<LoginHistoryVO> searchLoginHistoryList(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).searchLoginHistoryList(vo);
	}

	@Override
	public int searchLoginHistoryListTotalRecord() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).searchLoginHistoryListTotalRecord();
	}
	
	@Override
	public List<LoginHistoryVO> loginHistoryList(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).loginHistoryList(vo);
	}
	
	@Override
	public List<LoginHistoryVO> loginHistoryLimitList(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).loginHistoryLimitList(vo);
	}
	
	@Override
	public List<LoginHistoryVO> selectLoginHistoryForlogin(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).selectLoginHistoryForlogin(vo);
	}	
	
	@Override
	public List<LoginHistoryVO> checkLoginSession() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(LoginHistoryMapper.class).checkLoginSession();
	}	
}
