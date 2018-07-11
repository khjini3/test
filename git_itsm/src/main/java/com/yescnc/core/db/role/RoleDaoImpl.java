package com.yescnc.core.db.role;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.db.widget.PanelMapper;
import com.yescnc.core.entity.db.PanelVO;
import com.yescnc.core.entity.db.RoleVO;
import com.yescnc.core.entity.db.UserVO;

@Repository
public class RoleDaoImpl implements RoleDao {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public ArrayList<HashMap<String, Object>> getGroupList() {
		return sqlSession.getMapper(RoleMapper.class).getGroupInfo();
	}
	
	@Override
	public List<UserVO> getUserList() {
		return sqlSession.getMapper(RoleMapper.class).getUserList();
	}
	
	@Override
	public HashMap<String, Object> getSelectedList(String cmd) {
		HashMap<String, Object> result = new HashMap<String, Object>();
		ArrayList<HashMap<String, Object>> getSelectedUserList = new ArrayList<HashMap<String, Object>>();
		ArrayList<HashMap<String, Object>> getSelectedMenuCheckList = new ArrayList<HashMap<String, Object>>();
		try{
			getSelectedUserList = sqlSession.getMapper(RoleMapper.class).getInitUserList(cmd);
			getSelectedMenuCheckList = sqlSession.getMapper(RoleMapper.class).getInitMenuCheck(cmd);
		} catch (Exception e){
			e.printStackTrace();
		}
		
		result.put("selectedUserList", getSelectedUserList);
		result.put("getSelectedMenuCheckList", getSelectedMenuCheckList);
		return result;
	}
	
	@Override
	public HashMap<String, Object> getInitGroupInfo() {
		HashMap<String, Object> result = new HashMap<String, Object>();
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		ArrayList<HashMap<String, Object>> getUserList = new ArrayList<HashMap<String, Object>>();
		ArrayList<HashMap<String, Object>> allGroup = sqlSession.getMapper(RoleMapper.class).getGroupInfo();
		
		String group_id = null;
		if(allGroup.size() > 0){
			getMap = (HashMap<String, Object>) allGroup.get(0);
			group_id = (String) getMap.get("groupId");
			
			getUserList = sqlSession.getMapper(RoleMapper.class).getInitUserList(group_id);
			
			result.put("allGroup", allGroup);
			result.put("selectedUser", getUserList);
		}else{
			result.put("allGroup", "NODATA");
		}
		return result;
	}

	@Override
	public Integer insertRoleGroup(Map<String, Object> param) {
		int result = 100;
		try{
			sqlSession.getMapper(RoleMapper.class).insertRoleGroup(param);
		}catch (Exception e){
			result = -100;
		}
		return result;
	}
	
	@Override
	public Integer updateRoleGroup(Map<String, Object> param) {
		int result = 100;
		try{
			sqlSession.getMapper(RoleMapper.class).updateRoleGroup(param);
		}catch (Exception e){
			result = -100;
		}
		return result;
	}
	
	@Override
	public Integer updateUserGroup(Map<String, Object> param) {
		ArrayList<HashMap<String, Object>> users = (ArrayList<HashMap<String, Object>>) param.get("user");
		
		int result = 100;
		try{
			if(users.size() > 0){
				sqlSession.getMapper(RoleMapper.class).updateUserGroup(users);
			}
		}catch (Exception e){
			result = -100;
		}
		return result;
	}

	@Override
	public Integer insertGroupComponent(Map<String, Object> param) {
		int result = 100;
		ArrayList<HashMap<String, Object>> groupComp = (ArrayList<HashMap<String, Object>>) param.get("param");
		HashMap<String, Object> getMap = new HashMap<String, Object>();
		String groupId = null;
		
		try {
			if(groupComp.size() > 0){
				getMap = (HashMap<String, Object>) groupComp.get(0);
				groupId = (String) getMap.get("groupId");
				sqlSession.getMapper(RoleMapper.class).deleteGroupComponent(groupId);
				sqlSession.getMapper(RoleMapper.class).insertGroupComponent(groupComp);
			} else {
				groupId = (String) param.get("groupId");
				sqlSession.getMapper(RoleMapper.class).deleteGroupComponent(groupId);
			}
		} catch (Exception e) {
			result = -100;
			e.printStackTrace();
		}
		
		return result;
	}

	@Override
	public Integer deleteRoleGroup(Map<String, Object> param) {
		int result = 100;
		 Map<String, Object> map = new HashMap<String, Object>();
		try{
			//선택된 그룹내의 유저들
			ArrayList<HashMap<String, Object>> groupInnerUsers = sqlSession.getMapper(RoleMapper.class).selecteInnerUsers(param);
			//지워질  group
			sqlSession.getMapper(RoleMapper.class).deleteRoleGroup(param);
			//베이스그룹으로 돌아갈 유저들
			if(groupInnerUsers.size() > 0){
				map.put("list", groupInnerUsers);
				map.put("baseId", param.get("baseId"));
				sqlSession.getMapper(RoleMapper.class).updateUserBaseGroup(map);
			}
		}catch (Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public RoleVO selectGroup(RoleVO vo) {
		return sqlSession.getMapper(RoleMapper.class).selectGroup(vo);
	}
	
	@Override
	public int updatePolling(RoleVO vo) {
		return sqlSession.getMapper(RoleMapper.class).updatePolling(vo);
	}
	
}
