package com.yescnc.core.user.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.PrivilegeVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface UserService {
	public int insertUser(UserVO vo);
	
	public UserVO selectUser(UserVO vo);
	
	public List<UserVO> selectUserList();
	
	public List<UserVO> returnUserIdList();
	
	public int updateByUserId(UserVO vo);
	
	public int updateByUserStatus(UserVO vo);
	
	public int deleteByUserId(UserVO vo);
	
	public int deleteUserMulti(Map<String, List<UserVO>> map);
	
	public List<UserVO> searchUserList(UserVO vo);
	
	public JsonPagingResult userLimitList(UserVO vo);

	public List<PrivilegeVO> getPrivilegeList();

	public ArrayList<HashMap<String, Object>> getGroupList();
}
