package com.yescnc.core.db.user;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.UserVO;

public interface UserMapper {
	int insertUser(UserVO vo);
	
	UserVO selectUser(UserVO vo);
	
	List<UserVO> selectUserList();
	
	List<UserVO> returnUserIdList();
	
	int updateByUserId(UserVO vo);
	
	int updateByUserStatus(UserVO vo);
	
	int deleteByUserId(UserVO vo);
	
	int deleteUserMulti(Map<String, List<UserVO>> map);
	
	List<UserVO> searchUserList(UserVO vo);
	
	int userListTotalRecord();
	
	List<UserVO> userLimitList(UserVO vo);
	
	List<UserVO> selectUserMailList();
}
