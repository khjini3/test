package com.yescnc.core.db.user;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.LoginLogVO;

@Repository
public class LoginLogDaoImpl implements LoginLogDao {
	@Autowired
	private SqlSession session;
	
	@Override
	public int getSmTLoginHisCount(Map<String, Object> param) {
		return session.getMapper(LoginLogMapper.class).getSmTLoginHisCount(param);

	}


	@Override
	public ArrayList<LoginLogVO> getSmTLoginHis(Map<String, Object> param) {
		return session.getMapper(LoginLogMapper.class).getSmTLoginHis(param);

	}
	
	
	@Override
	public ArrayList<LoginLogVO> getSmTLoginLog() {
		// TODO Auto-generated method stub
		return session.getMapper(LoginLogMapper.class).getSmTLoginLog();
	}


	@Override
	public ArrayList<LoginLogVO> getSmTLoginLogBySessionId(Integer session_id) {
		// TODO Auto-generated method stub
		return session.getMapper(LoginLogMapper.class).getSmTLoginLogBySessionId(session_id);
	}

	@Override
	public ArrayList<LoginLogVO> getCurrentLoginLog() {
		// TODO Auto-generated method stub
		return session.getMapper(LoginLogMapper.class).getCurrentLoginLog();
	}

	@Override
	public ArrayList<LoginLogVO> getCurrentLoginLogOnPage(@Param("paragraph_no") Integer paragraph_no, @Param("row_count_per_paragraph") Integer row_count_per_paragraph) throws Exception {
		// TODO Auto-generated method stub

		return session.getMapper(LoginLogMapper.class).getCurrentLoginLogOnPage(paragraph_no, row_count_per_paragraph);
	}
	
	@Override
	public boolean putSmTLoginLog(LoginLogVO loginlog) {

		return session.getMapper(LoginLogMapper.class).putSmTLoginLog(loginlog);
	}

	
/*	@Override
	public int getCurrentLoginLogCount() {

		return session.getMapper(LoginLogDao.class).getCurrentLoginLogCount("N/A");
	}*/

	@Override
	public int getCurrentLoginLogCount(String session_type) {

		if (session_type == null){
			session_type = "N/A";
		}
		
		return session.getMapper(LoginLogMapper.class).getCurrentLoginLogCount(session_type);
	}


	@Override
	public int setUsersLogout(LoginLogVO loginlog) {

		return session.getMapper(LoginLogMapper.class).setUsersLogout(loginlog);
	}


	@Override
	public int updAllSessionsIdle() {
		
		return session.getMapper(LoginLogMapper.class).updAllSessionsIdle();
	}

}
