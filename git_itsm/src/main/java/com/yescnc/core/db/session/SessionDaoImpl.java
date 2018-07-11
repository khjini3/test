package com.yescnc.core.db.session;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.SessionVO;

@Repository
public class SessionDaoImpl implements SessionDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertSession(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).insertSession(vo);
	}

	@Override
	public SessionVO selectSession(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).selectSession(vo);
	}

	@Override
	public List<SessionVO> selectSessionList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).selectSessionList();
	}

	@Override
	public String selectSessionForLogin(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).selectSessionForLogin(vo);
	}

	@Override
	public int updateBySessionId(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).updateBySessionId(vo);
	}

	@Override
	public int deleteBySessionId(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).deleteBySessionId(vo);
	}
	
	@Override
	public List<SessionVO> searchSessionList(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).searchSessionList(vo);
	}

	@Override
	public SessionVO getNextSessionId() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).getNextSessionId();
	}

	@Override
	public boolean updSessionState(SessionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).updSessionState(vo);
	}

	@Override
	public int getSessionCount() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SessionMapper.class).getSessionCount();
	}
	
}
