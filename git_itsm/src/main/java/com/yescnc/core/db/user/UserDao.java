package com.yescnc.core.db.user;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.UserVO;

public interface UserDao {

	public int insertUser(UserVO vo);
	
	public UserVO selectUser(UserVO vo);
	
	public List<UserVO> selectUserList();
	
	public List<UserVO> returnUserIdList();
	
	public int updateByUserId(UserVO vo);
	
	public int updateByUserStatus(UserVO vo);
	
	public int deleteByUserId(UserVO vo);
	
	public int deleteUserMulti(Map<String, List<UserVO>> map);
	
	public List<UserVO> searchUserList(UserVO vo);
	
	public int userListTotalRecord();	
	
	public List<UserVO> userLimitList(UserVO vo);
	
	public List<UserVO> selectUserMailList();
}
