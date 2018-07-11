package com.yescnc.core.configuration;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.session.SessionDao;
import com.yescnc.core.db.user.LoginLogDao;
import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.entity.db.LoginLogVO;
import com.yescnc.core.entity.db.SessionVO;
import com.yescnc.core.entity.db.UserVO;

@Component
public class SessionListener implements HttpSessionListener {
	
	@Autowired
	SessionListener sessionListener;
	
	private static final Logger logger = LoggerFactory.getLogger(SessionListener.class);
	
	private static Map<String, HttpSession> sessions = new Hashtable<String, HttpSession>();
	
    private HttpSession session = null;
    
	@Autowired
	UserDao userDao;

	@Autowired
	SessionDao sessionDao;

	@Autowired
	LoginLogDao loginLogDao;
 
    public void sessionCreated(HttpSessionEvent event)
    {
        // no need to do anything here as connection may not have been established yet
        //session  = event.getSession();
        //session.setMaxInactiveInterval(60);
        //logger.info("Session created for id-> " + session.getId()+", timeout->"+session.getMaxInactiveInterval());
        HttpSession session = event.getSession();
        sessions.put(session.getId(), session);
        
        System.out.println("sessionCreated : " + session.getId());
        logger.info("sessions : " + sessions.keySet());    	
    }
    
    public void removeSesssion(String id){
    	logger.info("sessions : " + sessions); 
    	HttpSession liveSession = sessions.get(id);   	
    	if(null != liveSession){
    		//logger.info("liveSession.invalidate");    	
    		liveSession.invalidate();
    	}
    }
 
    public void sessionDestroyed(HttpSessionEvent event)
    {
    	String reason = "reason.logout.timeout";
    	//String msg_name = "del_session"; //not used
		//JsonResult result = null; //not used
		
		try {
	        session  = event.getSession();
	        logger.info("Session destroyed for id " + session.getId());
	        UserVO userInfo = (UserVO) session.getAttribute("userVO");
	        sessions.remove(session.getId());
	        if(userInfo != null) {
				String id = userInfo.getUserId();
				String ip = userInfo.getIpAddress();
				ArrayList<LoginLogVO> results = new ArrayList<LoginLogVO>();
	
				try {
					results = loginLogDao.getCurrentLoginLog();
				} catch (Exception e) {
					logger.error(e.getMessage());
					throw e;
				}
				
				if (results.size() < 1) {
					throw new Exception("message.db.nodata");
				}
				
				Vector<Object> returnVector = new Vector<Object>();
	
				for (int i = 0; i < results.size(); i++) {
	
					if (!"root".equals(results.get(i).getLoginId()) && id.equals(results.get(i).getLoginId())
							&& ip.equals(results.get(i).getLloc())) {
						returnVector.addElement(results.get(i).getSessionId());
					}
				}
	
				int[] sessionId = new int[returnVector.size()];
				for (int i = 0; i < returnVector.size(); i++) {
					sessionId[i] = Integer.parseInt(returnVector.get(i).toString());
				}
	
				for (int i = 0; i < sessionId.length; i++) {
					logger.info("del_session : " + sessionId[i]);
					
					UserVO sm_User = new UserVO();
					sm_User.setLoginStatus(2);
					sm_User.setUserId(id);
					int updateUserResult = userDao.updateByUserStatus(sm_User);
					logger.info("[Del_Session::setUsersLogout] updated :: " + updateUserResult);
					
					// 2 means state value of sm_t_sessions table
					LoginLogVO sm_LoginLog = new LoginLogVO();
					sm_LoginLog.setSessionId(sessionId[i]);
					sm_LoginLog.setFailReason(reason);
					sm_LoginLog.setLogoutReason(reason);
					int updateResult = loginLogDao.setUsersLogout(sm_LoginLog);
					logger.info("[Del_Session::setUsersLogout] updated :: " + updateResult);
	
					SessionVO sm_Session = new SessionVO();
					sm_Session.setSessionId(sessionId[i]);
					sm_Session.setState(0);
					boolean removeResult = sessionDao.updSessionState(sm_Session);
					logger.info("[Del_Session::updSessionState] updated :: " + removeResult);
					if (!removeResult)
						throw new Exception("setUsersLogout fail");
					// notify(message.getBody());
				}
				
				session.removeAttribute("userVO");
			}
			
		} catch (Exception e) {
			logger.error(e.getMessage());
			//e.printStackTrace();
		}
    }
    
    public void checkConnectionSession(List<LoginHistoryVO> checkSession) {
    	String reason = "reason.logout.timeout";
    	for(int i = 0; i < checkSession.size(); i++) {
    		if(sessions.get(checkSession.get(i).getTomcatSession()) == null) {
				UserVO sm_User = new UserVO();
				sm_User.setLoginStatus(2);
				sm_User.setUserId(checkSession.get(i).getLoginId());
				int updateUserResult = userDao.updateByUserStatus(sm_User);
				
				// 2 means state value of sm_t_sessions table
				LoginLogVO sm_LoginLog = new LoginLogVO();
				sm_LoginLog.setSessionId(checkSession.get(i).getSessionId());
				sm_LoginLog.setFailReason(reason);
				sm_LoginLog.setLogoutReason(reason);
				int updateResult = loginLogDao.setUsersLogout(sm_LoginLog);

				SessionVO sm_Session = new SessionVO();
				sm_Session.setSessionId(checkSession.get(i).getSessionId());
				sm_Session.setState(0);
				boolean removeResult = sessionDao.updSessionState(sm_Session);
    		}
    	}
    }    
}
