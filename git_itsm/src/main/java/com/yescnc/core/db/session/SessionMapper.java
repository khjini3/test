package com.yescnc.core.db.session;

import java.util.List;

import com.yescnc.core.entity.db.SessionVO;

public interface SessionMapper {
	int insertSession(SessionVO vo);
	
	SessionVO selectSession(SessionVO vo);
	
	List<SessionVO> selectSessionList();
	
	String selectSessionForLogin(SessionVO vo);
	
	int updateBySessionId(SessionVO vo);
	
	int deleteBySessionId(SessionVO vo);
	
	List<SessionVO> searchSessionList(SessionVO vo);

	SessionVO getNextSessionId();

	boolean updSessionState(SessionVO vo);

	int getSessionCount();
}
