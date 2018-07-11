package com.yescnc.core.login.service;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.constant.MessageKey;
import com.yescnc.core.constant.SessionKey;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.login.component.CreateSession;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.user.service.UserService;
import com.yescnc.core.db.user.UserDao;

@Service
public class LoginProcessor {
	
	private static final Logger logger = LoggerFactory.getLogger(LoginProcessor.class);
	
	@Autowired
	private CreateSession createSession;
	
	@Autowired
	UserService userService;
	
	@Autowired
	UserDao userDao;
	
	public static final String CREATE_SESSION = "crte_session";
		
	//final String ERROR_MESSAGE = "error message";
	//private Hashtable<String, Object> sessionTable;
	private int passwordAlertDays = -1;
		
	public LoginProcessor() {
	}

	public JsonResult loginProc(HttpSession session, String userId, String password, 
			String ipAddress, String urlIp, String sessionType, Locale locale,	String isWrite) {
		
		JsonResult restResponse = new JsonResult();

		UserVO userVO = new UserVO();
		
		try {

			JsonResult requestMap = new JsonResult();
			
			String lmtCount = getLmtSessionCount(null);				
			
			requestMap.setData(SessionKey.USER_ID, userId);
			requestMap.setData(SessionKey.USER_PASSWORD, password);
			requestMap.setData(SessionKey.WEB_SESSION, session.getId());
			requestMap.setData("IS.WRITE", isWrite);
			requestMap.setData("LMT.COUNT", lmtCount);
			requestMap.setData("SESSION.TYPE", sessionType);
			
			if (urlIp != null) {
				requestMap.setData("URL_IP", urlIp);
			}

			requestMap.setData(MessageKey.SRC_ID, userId);
			requestMap.setData(MessageKey.SRC_IP, ipAddress);
			requestMap.setData(MessageKey.INPUT_MSG, "LOGIN");
			requestMap.setData("SESSION.TYPE", sessionType);
			requestMap.setData(SessionKey.SESSION_ID, session.getId());

			logger.info("[login] requestMap : {}", requestMap.toString());
				
			JsonResult result = createSession.create(requestMap);

			if (result != null) {
				String results = (String) result.getData("RESULT");
				String sessionId = (String) result.getData(SessionKey.SESSION_ID);
				String loginId = (String) result.getData(SessionKey.USER_ID);
				if (result.getResult()) {
					int privilegeId = (Integer) result.getData("PRIVILEGE_ID");
					String group_id = (String) result.getData("GROUP_ID"); // yypark
					userVO = createUserVO(result.getData());
					userVO.setIpAddress(ipAddress);
					userVO.setSessionId(sessionId);
					userVO.setUserId(loginId);
					userVO.setPrivilegeId(privilegeId);
					userVO.setGroup_id(group_id); // yypark
					userVO.setEmail((String)result.getData("EMAIL"));
					logger.info("[Login Success!!] orange Session.ID {} :" + session.getId());
					logger.info("[Login Success!!] orange User.ID {} :" + userVO.getUserId());
					logger.info("[Login Success!!] orange IP.ADDRESS {} :" + userVO.getLastLoginIp());
					
					restResponse.setResult(true);
					restResponse.setData("USER" , userVO);
				} else {
					String resasonText = result.getFailReason().toString();;
					logger.info("[LoginProcessor] reasonText : " + resasonText);
					userVO.setResult(results);
					userVO.setSessionId(sessionId);
					userVO.setUserId(loginId);
					userVO.setIpAddress(ipAddress);
					restResponse.setResult(false);
					restResponse.setData("USER" , userVO);
					restResponse.setFailReason(resasonText);	
				}
			} else {
				logger.info("letter.message.fail");
				restResponse.setResult(false);
				restResponse.setFailReason("letter.message.fail");
			} 

		}catch (Exception e) {
			logger.error(e.getMessage());
			//e.printStackTrace();
		}
		return restResponse;

	}

	@SuppressWarnings("unused")
	private void checkPasswordWarninigDays(Map<String, Object> body) {
		Integer warningDays = (Integer) body.get(SessionKey.PASSWORD_WARNING_DAYS);
		Integer expireRemainDays = (Integer) body.get(SessionKey.PASSWORD_WARNING_DAYS);
		if (expireRemainDays.intValue() <= warningDays.intValue()) {
			passwordAlertDays = expireRemainDays.intValue();
		} else {
			passwordAlertDays = -1;
		}
		logger.info("expire remain days = " + expireRemainDays.intValue());
		logger.info("warning days = " + warningDays.intValue());
		logger.info("epasswordAlertDays = " + passwordAlertDays);
		
	}

/*
	public void setCurrentSessions(Hashtable<String, Object> sessions) {
		this.sessionTable = sessions;
	}
	
	public Hashtable<String, Object> getCurrentSessions() {
		return this.sessionTable;
	}
*/
	@SuppressWarnings("rawtypes")
	public UserVO createUserVO(Map result) {
		UserVO userVO = new UserVO();
		logger.info("[loginProcessor] createUserVO orange result: " + result);
		Integer index = (Integer) result.get(SessionKey.USER_INDEX);
		Integer privilege = (Integer) result.get(SessionKey.USER_PRIVILEGE);
		//Integer alarmGroup = (Integer) result.get(SessionKey.USER_ALARM_GROUP);
		String sessionId = (String) result.get(SessionKey.SESSION_ID);
		String results = (String) result.get("RESULT");

		userVO.setId(index.intValue());
		userVO.setPrivilegeId(privilege.intValue());
		userVO.setSessionId(sessionId);
		userVO.setUserId(result.get("SRC.ID").toString());
		userVO.setLastLoginIp(result.get("SRC.IP").toString());
		userVO.setResult(results);

		return userVO;
	}
	
	@SuppressWarnings("unused")
	private Map<String, Object> parseForm(Map<String, String> param) {		
		Map<String, Object> map = new HashMap<String, Object>();
		
		return map;
	}
	
	
	public String getLmtSessionCount(String path) {
		return "10";
	}
	
	public int getPasswordAlertDays() {
		return this.passwordAlertDays;
	}

/*
	public void setCurrentSessions(Hashtable<String, Object> sessions) {
		this.sessionTable = sessions;
	}

	public Hashtable<String, Object> getCurrentSessions() {
		return this.sessionTable;
	}

	private void checkPasswordWarningDays(Map<String, Object> body) {
		Integer warningDays = (Integer) body.get("PASSWORD.WARNING.DAYS");

		Integer expireRemainDays = (Integer) body.get("PASSWORD.EXPIRE.REMAIN.DAYS");

		if (expireRemainDays.intValue() <= warningDays.intValue())
			this.passwordAlertDays = expireRemainDays.intValue();
		else
			this.passwordAlertDays = -1;
	}

	public int getPasswordAlertDays() {
		return this.passwordAlertDays;
	}

	private void setErrorMessage(String errorMessage) {
		this.error = errorMessage;
		System.out.println(this.error);
	}

	public String getLmtSessionCount(String path) {
		return "0";
	}

	public void syncUserAccessAuthoruty(String path, UserVO userVO) {
		int privilege = userVO.getPrivilege();
		String userId = userVO.getUserID();
		File menuFile = new File(path + "/base/data/xml/menubar.xml");
		File authFile = new File(path + "/base/data/xml/authrity/access_authority_" + userId + ".xml");

		if ((!(authFile.exists())) || (authFile.lastModified() < menuFile.lastModified())) {
			Hashtable hashTable = CommandUtil.getDefaultDisabledMenu(path + "/base/data/xml/", userId, privilege);

			HashMap body = new HashMap();
			body.put("USER.ID", userId);
			body.put("PRIVILEGE", Integer.valueOf(privilege));
			body.put("DIRECTORY", path + "/base/data/xml/authority/");
			body.put("DISABLEDMENU", hashTable);

			Map rmiRequest = new HashMap();
			rmiRequest.put("BODY", body);
			sendMessage(rmiRequest, path, "write_access_authority");
		}

		CommandUtil.changeAccessAuthority(userId);
	}

	public boolean checkLastTime(HttpSession session) {
		if (session.getAttribute(session.getId()) instanceof UserVO) {
			Map body = new HashMap();

			body.put("SESSION.ID", session.getId());

			Map rmiRequest = new HashMap();
			rmiRequest.put("MSG.NAME", "set_last_checkTime");
			rmiRequest.put("BODY", body);
			sendMessage(session.getServletContext().getRealPath("/"), rmiRequest);

			return true;
		}

		return false;
	}

	public void relogin(HttpServletRequest request, String id, String locale) {
		StringBuffer reqUrl = request.getRequestURL();
		String urlIp = null;
		logger.warn("reqUrl: {} ", reqUrl);

		if (reqUrl != null) {
			urlIp = reqUrl.toString().replaceAll("http[s]{0,1}://", "");
			int endPos = urlIp.indexOf(":");
			if (endPos == -1) {
				endPos = urlIp.indexOf("/");
			}
			urlIp = (endPos != -1) ? urlIp.substring(0, endPos) : urlIp;
		}
		Vector urlIpV = new Vector(1);
		urlIpV.add(urlIp);

		UserVO userVO = null;
		HttpSession session = request.getSession();
		try {
			userVO = login(session, id, request.getRemoteAddr(), urlIpV);
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (userVO != null) {
			String key = HttpRequestParser.getKeyNameForUserVo(session, id, request.getRemoteAddr());
			logger.info("key : {}", key);
			session.setAttribute(key, userVO);

			session.setAttribute("LOCALE", new Locale(locale));
		}
	}
*/
}