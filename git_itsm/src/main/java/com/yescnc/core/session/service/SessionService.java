package com.yescnc.core.session.service;

import java.util.List;

import com.yescnc.core.entity.db.SessionVO;

public interface SessionService {
	public int insertSession(SessionVO vo);
	
	public SessionVO selectSession(SessionVO vo);
	
	public List<SessionVO> selectSessionList();
	
	public int updateBySessionId(SessionVO vo);
	
	public int deleteBySessionId(SessionVO vo);
	
	public List<SessionVO> searchSessionList(SessionVO vo);
}
