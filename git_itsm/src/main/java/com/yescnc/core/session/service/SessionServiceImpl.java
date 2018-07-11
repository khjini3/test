package com.yescnc.core.session.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.session.SessionDao;
import com.yescnc.core.entity.db.SessionVO;

@Service
public class SessionServiceImpl implements SessionService {
	@Autowired
	SessionDao sessionDao;
	
	@Override
	public int insertSession(SessionVO vo) {
		// TODO Auto-generated method stub
		return sessionDao.insertSession(vo);
	}

	@Override
	public SessionVO selectSession(SessionVO vo) {
		// TODO Auto-generated method stub
		return sessionDao.selectSession(vo);
	}

	@Override
	public List<SessionVO> selectSessionList() {
		// TODO Auto-generated method stub
		return sessionDao.selectSessionList();
	}

	@Override
	public int updateBySessionId(SessionVO vo) {
		// TODO Auto-generated method stub
		return sessionDao.updateBySessionId(vo);
	}

	@Override
	public int deleteBySessionId(SessionVO vo) {
		// TODO Auto-generated method stub
		return sessionDao.deleteBySessionId(vo);
	}
	
	@Override
	public List<SessionVO> searchSessionList(SessionVO vo) {
		// TODO Auto-generated method stub
		return sessionDao.searchSessionList(vo);
	}

}