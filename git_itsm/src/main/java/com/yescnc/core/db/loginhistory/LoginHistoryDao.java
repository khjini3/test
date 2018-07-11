package com.yescnc.core.db.loginhistory;

import java.util.List;

import com.yescnc.core.entity.db.LoginHistoryVO;

public interface LoginHistoryDao {

	public int insertLoginHistory(LoginHistoryVO vo);
	
	public LoginHistoryVO selectLoginHistory(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> selectLoginHistoryList();
	
	public String selectLoginHistoryForLogin(LoginHistoryVO vo);
	
	public int updateByLoginHistoryId(LoginHistoryVO vo);
	
	public int deleteByLoginHistoryId(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> searchLoginHistoryList(LoginHistoryVO vo);
	
	public int searchLoginHistoryListTotalRecord();
	
	public List<LoginHistoryVO> loginHistoryList(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> loginHistoryLimitList(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> selectLoginHistoryForlogin(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> checkLoginSession();
}
