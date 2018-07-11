package com.yescnc.core.db.user;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.yescnc.core.entity.db.LoginLogVO;

public abstract interface LoginLogDao {

	public abstract int getSmTLoginHisCount(Map<String, Object> param);
	public abstract ArrayList<LoginLogVO> getSmTLoginHis(Map<String,Object> param);
	public abstract ArrayList<LoginLogVO> getSmTLoginLog();
	public abstract ArrayList<LoginLogVO> getSmTLoginLogBySessionId(Integer session_id);
	public abstract boolean putSmTLoginLog(LoginLogVO loginlog);
	public abstract ArrayList<LoginLogVO> getCurrentLoginLog();	
	public abstract ArrayList<LoginLogVO> getCurrentLoginLogOnPage(@Param("paragraph_no") Integer paragraph_no, @Param("row_count_per_paragraph") Integer row_count_per_paragraph) throws Exception ;	
	public abstract int getCurrentLoginLogCount(String session_type);
	public abstract int setUsersLogout(LoginLogVO loginlog);
	public abstract int updAllSessionsIdle();
	
}
