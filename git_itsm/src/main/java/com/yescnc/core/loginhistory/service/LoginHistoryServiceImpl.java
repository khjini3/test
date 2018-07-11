package com.yescnc.core.loginhistory.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yescnc.core.db.loginhistory.LoginHistoryDao;
import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.json.JsonPagingResult;

@Service
public class LoginHistoryServiceImpl implements LoginHistoryService {
	
	private static final Logger logger = LoggerFactory.getLogger(LoginHistoryServiceImpl.class);
	
	@Autowired
	UserDao userDao;
	
	@Autowired
	LoginHistoryDao loginHistoryDao;
	
	@Override
	public int insertLoginHistory(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return loginHistoryDao.insertLoginHistory(vo);
	}

	@Override
	public LoginHistoryVO selectLoginHistory(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return loginHistoryDao.selectLoginHistory(vo);
	}

	@Override
	public List<LoginHistoryVO> selectLoginHistoryList() {
		// TODO Auto-generated method stub
		return loginHistoryDao.selectLoginHistoryList();
	}

	@Override
	public int updateByLoginHistoryId(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return loginHistoryDao.updateByLoginHistoryId(vo);
	}

	@Override
	public int deleteByLoginHistoryId(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return loginHistoryDao.deleteByLoginHistoryId(vo);
	}
	
	@Override
	@Transactional
	public List<LoginHistoryVO> searchLoginHistoryList(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		//List<LoginHistoryVO> aa = loginHistoryDao.searchLoginHistoryList(vo);
		int bb = loginHistoryDao.searchLoginHistoryListTotalRecord();
		logger.info("searchLoginHistoryListTotalRecord={}" , bb);
		return loginHistoryDao.searchLoginHistoryList(vo);
	}
	
	@Override
	public List<LoginHistoryVO>loginHistoryList(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return loginHistoryDao.loginHistoryList(vo);
	}

	@Override
	public JsonPagingResult loginHistoryLimitList(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
    	int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();
    	vo.setStartRow(startRow);
		List<LoginHistoryVO> aa = loginHistoryDao.loginHistoryLimitList(vo);
		int totalCount = loginHistoryDao.searchLoginHistoryListTotalRecord();
		logger.info("searchLoginHistoryListTotalRecord={}" , totalCount);
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("data", aa);
		//return loginHistoryDao.loginHistoryLimitList(vo);
		return result;
	}
	
	@Override
	public List<LoginHistoryVO> selectLoginHistoryForlogin(LoginHistoryVO vo) {
		// TODO Auto-generated method stub
		return loginHistoryDao.selectLoginHistoryForlogin(vo);
	}	
	
	@Override
	public List<UserVO> getUserList(){
		return userDao.returnUserIdList();
	}
}