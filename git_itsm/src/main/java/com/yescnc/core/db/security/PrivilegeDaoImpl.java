package com.yescnc.core.db.security;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.PrivilegeVO;

@Repository
public class PrivilegeDaoImpl implements PrivilegeDao {

	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertPrivilege(PrivilegeVO privilege) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PrivilegeMapper.class).insertPrivilege(privilege);
	}

	@Override
	public List<PrivilegeVO> listPrivilege() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PrivilegeMapper.class).selectPrivilege(null);
	}

	@Override
	public List<PrivilegeVO> selectPrivilege(PrivilegeVO privilege) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PrivilegeMapper.class).selectPrivilege(privilege);
	}

	@Override
	public int updateByPrivilegeId(PrivilegeVO privilege) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PrivilegeMapper.class).updateByPrivilegeId(privilege);
	}

	@Override
	public int deleteByPrivilegeId(PrivilegeVO privilege) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PrivilegeMapper.class).deleteByPrivilegeId(privilege);
	}

}
