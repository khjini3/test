package com.yescnc.core.user.service;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.yescnc.core.db.role.RoleDao;
import com.yescnc.core.db.security.PrivilegeDao;
import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.PrivilegeVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.security.SecurityUtil;

@Service
public class UserServiceImpl implements UserService {
	
	private Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
	
	@Autowired
	UserDao userDao;
	
	@Autowired
	PrivilegeDao privilegeDao;
	
	@Autowired
	RoleDao roleDao;
	
	@Override
	public int insertUser(UserVO vo) {
		// TODO Auto-generated method stub
		SecurityUtil securitypassword = new SecurityUtil();
		try {
			vo.setPassword(securitypassword.encrypSHA256(vo.getPassword()));
			if(vo.getTempPassword() != null) {
				vo.setTempPassword(securitypassword.encrypSHA256(vo.getTempPassword()));
			}
		} catch (NoSuchAlgorithmException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return userDao.insertUser(vo);
	}

	@Override
	public UserVO selectUser(UserVO vo) {
		// TODO Auto-generated method stub
		return userDao.selectUser(vo);
	}

	@Override
	public List<UserVO> selectUserList() {
		// TODO Auto-generated method stub
		return userDao.selectUserList();
	}

	@Override
	public List<UserVO> returnUserIdList() {
		// TODO Auto-generated method stub
		return userDao.returnUserIdList();
	}	
	
	@Override
	public int updateByUserId(UserVO vo) {
		// TODO Auto-generated method stub
		SecurityUtil securitypassword = new SecurityUtil();
		try {
			if(StringUtils.isEmpty(vo.getPassword()) != true) {
				if(vo.getPassword() != null) {
					vo.setPassword(securitypassword.encrypSHA256(vo.getPassword()));
				}
			}
			
			if(StringUtils.isEmpty(vo.getTempPassword()) != true) {
				if(vo.getTempPassword() != null) {
					vo.setTempPassword(securitypassword.encrypSHA256(vo.getTempPassword()));
				}
			}
		} catch (NoSuchAlgorithmException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}		
		return userDao.updateByUserId(vo);
	}
	
	@Override
	public int updateByUserStatus(UserVO vo) {
		// TODO Auto-generated method stub
		return userDao.updateByUserStatus(vo);
	}

	@Override
	public int deleteByUserId(UserVO vo) {
		// TODO Auto-generated method stub
		return userDao.deleteByUserId(vo);
	}
	
	@Override
	public int deleteUserMulti(Map<String, List<UserVO>> map) {
		return userDao.deleteUserMulti(map);
	}
	
	@Override
	public List<UserVO> searchUserList(UserVO vo) {
		// TODO Auto-generated method stub
		return userDao.searchUserList(vo);
	}

	@Override
	public JsonPagingResult userLimitList(UserVO vo) {
		// TODO Auto-generated method stub
    	int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();
    	
    	List<UserVO> totalList = userDao.selectUserList();
    	vo.setStartRow(startRow);
		List<UserVO> limitList = userDao.userLimitList(vo);
		int totalCount = userDao.userListTotalRecord();
		//logger.info("searchLoginHistoryListTotalRecord={}" , totalCount);
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("data", limitList);
		result.setData("totaldata", totalList);
		//return loginHistoryDao.loginHistoryLimitList(vo);
		return result;
	}
	
	@Override
	public List<PrivilegeVO> getPrivilegeList(){
		return privilegeDao.selectPrivilege(null);
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> getGroupList(){
		/*ArrayList<HashMap<String, Object>> getGroupList = new ArrayList<HashMap<String, Object>>();
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		ArrayList<HashMap<String, Object>> changeMap = new ArrayList<HashMap<String, Object>>();
		
		String groupId = null;
		String groupName = null;
		
		int groupSize = getGroupList.size();
		for(int i = 0; i < groupSize; i++){
			getMap = getGroupList.get(i);
			groupName = (String)getMap.get("groupName");
			changeMap.add("id" : i, "text" : groupName);
			groupId = (String)getGroupList.get(i).get("groupId");
			groupName = (String)getGroupList.get(i).get("groupName");
			result.put(groupId, groupName);
		}
		
		getGroupList = roleDao.getGroupList();
		log.debug("TEST================ "+getGroupList);*/
		
		return roleDao.getGroupList();
	}
}