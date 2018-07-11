package com.yescnc.core.login.component;

import java.util.ArrayList;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.base.Preconditions;
import com.yescnc.core.db.session.SessionDao;
import com.yescnc.core.db.user.LoginLogDao;
import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.LoginLogVO;
import com.yescnc.core.entity.db.SessionVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.json.JsonResult;

@Component
public class DeleteSession {

	private static final Logger logger = LoggerFactory.getLogger(DeleteSession.class);

	@Autowired
	UserDao userDao;

	@Autowired
	SessionDao sessionDao;

	@Autowired
	LoginLogDao loginLogDao;

	public JsonResult remove(JsonResult message) throws Exception {

		try {

			logger.info("[" + this.getClass().getName() + "] DeleteSession.remove() start !!!!! ");

			Preconditions.checkNotNull(message);
			Preconditions.checkNotNull(message.getData("SRC.ID"));
			Preconditions.checkNotNull(message.getData("SRC.IP"));

			String id = String.class.cast(message.getData("SRC.ID"));
			String ip = String.class.cast(message.getData("SRC.IP"));

			logger.info("ID: " + id);
			logger.info("IP: " + ip);

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

			Vector<Object> returnVector = getSessionsByIDandIP(id, ip, results);

			int[] sessionId = new int[returnVector.size()];
			for (int i = 0; i < returnVector.size(); i++) {
				sessionId[i] = Integer.parseInt(returnVector.get(i).toString());
			}

			for (int i = 0; i < sessionId.length; i++) {
				logger.info("del_session : " + sessionId[i]);
				setLogoutTimeSetState0(sessionId[i], (String) message.getData("LOGOUT.REASON"), id, ip);
				// notify(message.getBody());
			}
			
			message.setResult(true);

		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.info("[" + this.getClass().getName() + "] fail!! ( " + e.getMessage() + " )");
			message.setResult(false);
			message.setFailReason(e.getMessage());
		}
		logger.info("[" + this.getClass().getName() + "] response message body = " + message.getData()
				+ " - body dump End");
		logger.info("[" + this.getClass().getName() + "] handleMessage() end !!!!! ");
		return message;

	}

	private Vector getSessionsByIDandIP(String id, String ip, ArrayList<LoginLogVO> dataHashList) {
		Vector<Object> returnVector = new Vector<Object>();

		for (int i = 0; i < dataHashList.size(); i++) {

			if (!"root".equals(dataHashList.get(i).getLoginId()) && id.equals(dataHashList.get(i).getLoginId())
					&& ip.equals(dataHashList.get(i).getLloc())) {
				returnVector.addElement(dataHashList.get(i).getSessionId());
			}
		}
		return returnVector;
	}

	private void setLogoutTimeSetState0(int sessionId, String reason, String userId, String ip) throws Exception {
		UserVO sm_User = new UserVO();
		sm_User.setLoginStatus(2);
		sm_User.setUserId(userId);
		sm_User.setLastLoginIp(ip);
		int updateUserResult = userDao.updateByUserStatus(sm_User);
		
		// 2 means state value of sm_t_sessions table
		LoginLogVO sm_LoginLog = new LoginLogVO();
		sm_LoginLog.setSessionId(sessionId);
		sm_LoginLog.setFailReason(reason);
		sm_LoginLog.setLogoutReason(reason);
		int updateResult = loginLogDao.setUsersLogout(sm_LoginLog);
		logger.info("[Del_Session::setUsersLogout] updated :: " + updateResult);

		SessionVO sm_Session = new SessionVO();
		sm_Session.setSessionId(sessionId);
		sm_Session.setState(0);
		boolean removeResult = sessionDao.updSessionState(sm_Session);
		logger.info("[Del_Session::updSessionState] updated :: " + removeResult);
		if (!removeResult)
			throw new Exception("setUsersLogout fail");

	}

}
