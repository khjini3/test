package com.yescnc.core.db.user;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.UserVO;

@Repository
public class UserDaoImpl implements UserDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertUser(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).insertUser(vo);
	}

	@Override
	public UserVO selectUser(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).selectUser(vo);
	}

	@Override
	public List<UserVO> selectUserList() {
		return sqlSession.getMapper(UserMapper.class).selectUserList();
	}

	@Override
	public List<UserVO> returnUserIdList() {
		return sqlSession.getMapper(UserMapper.class).returnUserIdList();
	}

	@Override
	public int updateByUserId(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).updateByUserId(vo);
	}
	
	@Override
	public int updateByUserStatus(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).updateByUserStatus(vo);
	}

	@Override
	public int deleteByUserId(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).deleteByUserId(vo);
	}
	
	@Override
	public int deleteUserMulti(Map<String, List<UserVO>> map) {
		return sqlSession.getMapper(UserMapper.class).deleteUserMulti(map);
	}
	
	@Override
	public List<UserVO> searchUserList(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).searchUserList(vo);
	}

	@Override
	public int userListTotalRecord() {
		return sqlSession.getMapper(UserMapper.class).userListTotalRecord();
	}
	
	@Override
	public List<UserVO> userLimitList(UserVO vo) {
		return sqlSession.getMapper(UserMapper.class).userLimitList(vo);
	}
	
	@Override
	public List<UserVO> selectUserMailList() {
		return sqlSession.getMapper(UserMapper.class).selectUserMailList();
	}
}
