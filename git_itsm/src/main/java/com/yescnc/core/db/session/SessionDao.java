package com.yescnc.core.db.session;

import java.util.List;

import com.yescnc.core.entity.db.SessionVO;

public interface SessionDao {

	public int insertSession(SessionVO vo);
	
	public SessionVO selectSession(SessionVO vo);
	
	public List<SessionVO> selectSessionList();
	
	public String selectSessionForLogin(SessionVO vo);
	
	public int updateBySessionId(SessionVO vo);
	
	public int deleteBySessionId(SessionVO vo);
	
	public List<SessionVO> searchSessionList(SessionVO vo);
	
	public SessionVO getNextSessionId();

	public boolean updSessionState(SessionVO vo);

	public int getSessionCount();
}
