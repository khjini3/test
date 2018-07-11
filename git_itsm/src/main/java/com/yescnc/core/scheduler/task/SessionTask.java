package com.yescnc.core.scheduler.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.yescnc.core.configuration.SessionListener;
import com.yescnc.core.db.loginhistory.LoginHistoryDao;
import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.main.websocket.PushWebSocketController;

@Component
@Scope("prototype")
public class SessionTask {

	private static final Logger logger = LoggerFactory.getLogger(SessionTask.class);
	
	@Autowired
	LoginHistoryDao loginHistoryDao;
	
	@Autowired
	SessionListener sessionListener;
	
	
	@Async
	public void sessionCheck() {
		List<LoginHistoryVO> checkSession = loginHistoryDao.checkLoginSession();
		
		sessionListener.checkConnectionSession(checkSession);
	}	

}
