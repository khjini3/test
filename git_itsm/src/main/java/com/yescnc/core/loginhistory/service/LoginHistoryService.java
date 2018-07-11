package com.yescnc.core.loginhistory.service;

import java.util.List;

import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface LoginHistoryService {
	public int insertLoginHistory(LoginHistoryVO vo);
	
	public LoginHistoryVO selectLoginHistory(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> selectLoginHistoryList();
	
	public int updateByLoginHistoryId(LoginHistoryVO vo);
	
	public int deleteByLoginHistoryId(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> searchLoginHistoryList(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> loginHistoryList(LoginHistoryVO vo);
	
	public JsonPagingResult loginHistoryLimitList(LoginHistoryVO vo);
	
	public List<LoginHistoryVO> selectLoginHistoryForlogin(LoginHistoryVO vo);

	public List<UserVO> getUserList();	
}
