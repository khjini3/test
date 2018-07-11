package com.yescnc.core.db.eventNotification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.AssetCoreInfoVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.jarvis.db.assetManager.AssetManagerDaoImpl;

@Repository
public class EventNotificationDaoImpl implements EventNotificationDao {
	private Logger log = LoggerFactory.getLogger(EventNotificationDaoImpl.class);
	@Autowired
	private SqlSession sqlSession;
	
	/*@Autowired
	private DataSourceTransactionManager transactionManager; */
	
	@Override
	public List<UserVO> getNotiUserList() {
		return sqlSession.getMapper(EventNotificationMapper.class).getUserList();
	}
	
	@Override
	public List<AssetCoreInfoVO> getNotiTargetList() {
		return sqlSession.getMapper(EventNotificationMapper.class).getTargetList();
	}
	
	@Override
	public Integer saveNotiInfo(Map<String, Object> param){
		
		ArrayList<HashMap<String, Object>> group = (ArrayList<HashMap<String, Object>>) param.get("group");
		ArrayList<HashMap<String, Object>> target = (ArrayList<HashMap<String, Object>>) param.get("target");
		ArrayList<HashMap<String, Object>> user = (ArrayList<HashMap<String, Object>>) param.get("user");
		
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).saveNotiGroupInfo(group);
			if(target.size() > 0){
				sqlSession.getMapper(EventNotificationMapper.class).saveNotiTargetInfo(target);
			}
			if(user.size() > 0){
				sqlSession.getMapper(EventNotificationMapper.class).saveNotiUserInfo(user);
				sqlSession.getMapper(EventNotificationMapper.class).updateNotiUserInfo(user);
			}
		}catch (Exception e){
			result = -100;
		}
		
		return result;
	}
	
	@Override
	public Integer updateNotiInfo(Map<String, Object> param){
		
		ArrayList<HashMap<String, Object>> group = (ArrayList<HashMap<String, Object>>) param.get("group");
		ArrayList<HashMap<String, Object>> target = (ArrayList<HashMap<String, Object>>) param.get("target");
		ArrayList<HashMap<String, Object>> user = (ArrayList<HashMap<String, Object>>) param.get("user");
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		
		String uId = null;
		getMap = (HashMap<String, Object>) group.get(0);
		uId = (String) getMap.get("uId");
		
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).updateNotiGroupInfo(group);
			
			sqlSession.getMapper(EventNotificationMapper.class).deleteNotiTargetList(uId);
			if(target.size() > 0){
				sqlSession.getMapper(EventNotificationMapper.class).saveNotiTargetInfo(target);
			}
			
			sqlSession.getMapper(EventNotificationMapper.class).deleteNotiUserList(uId);
			if(user.size() > 0){
				sqlSession.getMapper(EventNotificationMapper.class).saveNotiUserInfo(user);
				sqlSession.getMapper(EventNotificationMapper.class).updateNotiUserInfo(user);
			}
		}catch (Exception e){
			result = -100;
		}
		
		return result;
	}
	
	@Override
	public HashMap<String, Object> getNotiInitGroupList(){
		HashMap<String, Object> result = new HashMap<String, Object>();
		ArrayList<HashMap<String, Object>> getTargetList = new ArrayList<HashMap<String, Object>>();
		ArrayList<HashMap<String, Object>> getUserList = new ArrayList<HashMap<String, Object>>();
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		String uId = null;
		
		ArrayList<HashMap<String, Object>> allGroup = sqlSession.getMapper(EventNotificationMapper.class).getNotiGroupList();
		int size = allGroup.size();
		if(size > 0){
			getMap = (HashMap<String, Object>) allGroup.get(0);
			uId = (String) getMap.get("uId");
			log.debug("[Event Notification By Group - First UID = "+uId);
			
			getTargetList = sqlSession.getMapper(EventNotificationMapper.class).getInitTargetList(uId);
			getUserList = sqlSession.getMapper(EventNotificationMapper.class).getInitUserList(uId);
			
			log.debug("[Event Notification By Group - allGroup = "+allGroup);
			log.debug("[Event Notification By Group - getTargetList = "+getTargetList);
			log.debug("[Event Notification By Group - getUserList = "+getUserList);
			
			result.put("allGroup", allGroup);
			result.put("selectedTarget", getTargetList);
			result.put("selectedUser", getUserList);
		}else{
			result.put("allGroup", "NODATA");
		}
		return result;
	}
	
	@Override
	public HashMap<String, Object> getNotiSelectedList(String cmd){
		HashMap<String, Object> result = new HashMap<String, Object>();
		ArrayList<HashMap<String, Object>> getSelectedGroupList = new ArrayList<HashMap<String, Object>>();
		ArrayList<HashMap<String, Object>> getSelectedTargetList = new ArrayList<HashMap<String, Object>>();
		ArrayList<HashMap<String, Object>> getSelectedUserList = new ArrayList<HashMap<String, Object>>();
		
		try{
			getSelectedGroupList = sqlSession.getMapper(EventNotificationMapper.class).getInitGroupList(cmd);
			getSelectedTargetList = sqlSession.getMapper(EventNotificationMapper.class).getInitTargetList(cmd);
			getSelectedUserList = sqlSession.getMapper(EventNotificationMapper.class).getInitUserList(cmd);
		}catch (Exception e){
			e.printStackTrace();
		}
		
		result.put("selectedGroupList", getSelectedGroupList);
		result.put("selectedTargetList", getSelectedTargetList);
		result.put("selectedUserList", getSelectedUserList);
		
		return result;
	}
	
	@Override
	public Integer deleteNotiGroup(Map<String, Object>  param){
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).deleteNotiGroup(param);
		}catch(Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer updateNotiGroupStatus(Map<String, Object>  param){
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).updateNotiGroupStatus(param);
		}catch(Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	//---------------- USER NOTIFICATION ---------------------------
	@Override
	public List<UserVO> getAllUserList() {
		return sqlSession.getMapper(EventNotificationMapper.class).getAllUserList();
	}
	
	@Override
	public Integer userSaveInfo(Map<String, Object> param){ //USING
		int result = 100;
		ArrayList<HashMap<String, Object>> userList = (ArrayList<HashMap<String, Object>>) param.get("user");
		
		try{
			sqlSession.getMapper(EventNotificationMapper.class).userDeleteInfo();
			sqlSession.getMapper(EventNotificationMapper.class).userSaveInfo(userList);
			sqlSession.getMapper(EventNotificationMapper.class).updateNotiUserInfo(userList);
		}catch (Exception e){
			result = -100;
		}
		
		return result;
	}
	
	@Override
	public Integer targetSaveInfo(Map<String, Object> param){ //USING
		int result = 100;
		ArrayList<HashMap<String, Object>> targetList = (ArrayList<HashMap<String, Object>>) param.get("target");
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		String userId = null;
		
		getMap = (HashMap<String, Object>) targetList.get(0);
		userId = (String) getMap.get("userId");
		
		try{
			sqlSession.getMapper(EventNotificationMapper.class).targetDeleteInfo(userId);
			sqlSession.getMapper(EventNotificationMapper.class).targetSaveInfo(targetList);
		}catch (Exception e){
			result = -100;
		}
		
		return result;
	}
	
	@Override
	public HashMap<String, Object> getNotiUserInitList(){ //USING
		HashMap<String, Object> result = new HashMap<String, Object>();
		ArrayList<Object> userList = new ArrayList<Object>();
		ArrayList<HashMap<String, Object>> getUserList = new ArrayList<HashMap<String, Object>>();
		ArrayList<Object> getTargetList = new ArrayList<Object>();
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		String userId = null;
		
		ArrayList<HashMap<String, Object>> allUser = sqlSession.getMapper(EventNotificationMapper.class).getUser();
		int userListLen = allUser.size();
		
		if(userListLen > 0){
			getMap = (HashMap<String, Object>) allUser.get(0);
			userId = (String) getMap.get("userId");
			getTargetList = sqlSession.getMapper(EventNotificationMapper.class).getUserTargetList(userId);
			result.put("allUser", allUser);
			result.put("target", getTargetList);
		}else{
			result.put("allUser", "NODATA");
		}
		return result;
	}
	
	@Override
	public Integer userUpdateInfo(Map<String, Object> param){ // USING
		int result = 100;
		HashMap<String, Object> user = new HashMap<String, Object>();
		HashMap<String, Object> notiUser = new HashMap<String, Object>();
			
		try{
			String userId = (String) param.get("userId");
			Integer emailStatus = (Integer) param.get("emailStatus");
			Integer phoneStatus = (Integer) param.get("phoneStatus");
			String email = (String) param.get("email");
			String phone = (String) param.get("phone");
			
			user.put("userId", userId);
			user.put("email", email);
			user.put("phone", phone);
			
			notiUser.put("userId", userId);
			notiUser.put("emailStatus", emailStatus);
			notiUser.put("phoneStatus", phoneStatus);
			
			sqlSession.getMapper(EventNotificationMapper.class).userUpdateInfo(user);
			sqlSession.getMapper(EventNotificationMapper.class).notiUserUpdateInfo(notiUser);
			
		}catch(Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer targetUpdateInfo(Map<String, Object> param){ // USING
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).targetUpdateInfo(param);
		}catch(Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer deleteUser(Map<String, Object>  param){ // USING
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).deleteUser(param);
		}catch(Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer deleteTarget(Map<String, Object>  param){ // USING
		int result = 100;
		try{
			sqlSession.getMapper(EventNotificationMapper.class).deleteTarget(param);
		}catch(Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public ArrayList<Object> getTargetList(String cmd){ // USING
		ArrayList<Object> result = new ArrayList<Object>();
		try{
			result = sqlSession.getMapper(EventNotificationMapper.class).getUserTargetList(cmd);
		}catch(Exception e){
			e.printStackTrace();
		}
		return result;
	}
}
