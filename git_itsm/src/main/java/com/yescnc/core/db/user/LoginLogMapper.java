package com.yescnc.core.db.user;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.yescnc.core.entity.db.LoginLogVO;

public abstract interface LoginLogMapper {

	int getSmTLoginHisCount(Map<String, Object> param);
	ArrayList<LoginLogVO> getSmTLoginHis(Map<String,Object> param);
	ArrayList<LoginLogVO> getSmTLoginLog();
	ArrayList<LoginLogVO> getSmTLoginLogBySessionId(Integer session_id);
	boolean putSmTLoginLog(LoginLogVO loginlog);
	ArrayList<LoginLogVO> getCurrentLoginLog();	
	ArrayList<LoginLogVO> getCurrentLoginLogOnPage(@Param("paragraph_no") Integer paragraph_no, @Param("row_count_per_paragraph") Integer row_count_per_paragraph) throws Exception ;	
	int getCurrentLoginLogCount(String session_type);
	int setUsersLogout(LoginLogVO loginlog);
	int updAllSessionsIdle();
	
}
