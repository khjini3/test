package com.yescnc.core.db.loginhistory;

import java.util.List;

import com.yescnc.core.entity.db.LoginHistoryVO;

public interface LoginHistoryMapper {
	int insertLoginHistory(LoginHistoryVO vo);
	
	LoginHistoryVO selectLoginHistory(LoginHistoryVO vo);
	
	List<LoginHistoryVO> selectLoginHistoryList();
	
	String selectLoginHistoryForLogin(LoginHistoryVO vo);
	
	int updateByLoginHistoryId(LoginHistoryVO vo);
	
	int deleteByLoginHistoryId(LoginHistoryVO vo);
	
	List<LoginHistoryVO> searchLoginHistoryList(LoginHistoryVO vo);
	
	int searchLoginHistoryListTotalRecord();
	
	List<LoginHistoryVO> loginHistoryList(LoginHistoryVO vo);
	
	List<LoginHistoryVO> loginHistoryLimitList(LoginHistoryVO vo);	
	
	List<LoginHistoryVO> selectLoginHistoryForlogin(LoginHistoryVO vo);	
	
	List<LoginHistoryVO> checkLoginSession();		
}
