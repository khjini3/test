package com.yescnc.core.login.component;

import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.security.auth.login.LoginException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.constant.MessageKey;
import com.yescnc.core.constant.SecurityKey;
import com.yescnc.core.constant.SessionKey;
import com.yescnc.core.constant.UserStatus;
import com.yescnc.core.db.session.SessionDao;
import com.yescnc.core.db.user.LoginLogDao;
import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.db.ip.IpDao;
import com.yescnc.core.db.loginhistory.LoginHistoryDao;
import com.yescnc.core.entity.db.IpVO;
import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.entity.db.LoginLogVO;
import com.yescnc.core.entity.db.SessionVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.user.service.UserService;
import com.yescnc.core.util.ip.IpAddressChecker;
import com.yescnc.core.util.json.JsonResult;


@Component
public class CreateSession {

	private static final Logger logger = LoggerFactory.getLogger(CreateSession.class);
	private static String lmtOnOff = "EMS";

	@Autowired
	UserDao userDao;
	
	@Autowired
	SessionDao sessionDao;
	
	@Autowired
	LoginLogDao loginLogDao;
	
	@Autowired
	UserService userService;
	
	@Autowired
	LoginHistoryDao loginHistoryDao;
	
	@Autowired
	IpDao ipDao;

	public JsonResult create(JsonResult message) throws Exception {

		int userIdx = 0;
		int loginStatus = 2;
		int lhresult = 1;
		int privilege = 0;
		String group_id = null; // yypark
		String tempPassword = null;
		//boolean findMatchingIp = false;
		String findMatchingIp = "letter.message.notexists.loginip";
		
		String reason = null;
		String tomcatIp = null;
		String failReason = null;
		String logoutTime = null;
		String logoutReason = null;
		int sessionId = 0;
		String lloc = (String) message.getData(MessageKey.SRC_IP);
		String tomcatSession = (String) message.getData(SessionKey.SESSION_ID);
		String sessionType = (String) message.getData("SESSION.TYPE");
		InetAddress local = null;
		String lastLoginIp = null;
		
		try{
			//local = InetAddress.getLocalHost();
			//lastLoginIp = local.getHostAddress();
			lastLoginIp = (String) message.getData(MessageKey.SRC_IP);
		} catch (Exception e){
			logger.error("[crte_session1] InetAddress fail!! ( " + e.getMessage() + " )");
		}
		
		String ip = message.getData(MessageKey.SRC_IP).toString();
		
		logger.info("[" + this.getClass().getName() + "] handleMessage() start !!!!! ");

		if (message.getData(MessageKey.SRC_IP) != null) {
			if (IpAddressChecker.isIPv6(ip)) {
				logger.info("[crte_session2] IPv6 Client IP: " + ip);

				ip = IpAddressChecker.getIpAddress(ip);
				if (ip != null) {
					message.setData(MessageKey.SRC_IP, ip);
				}
				logger.info("[crte_session2] IPv6 Format IP: " + ip);
			}

//			IpFilterChecker ipcheck = new IpFilterChecker();
//			findMatchingIp = ipcheck.checkCountByAddress(ip, ipList);
//			
//			for (IpVO ipAddr : ipList) {
//				compare = ipAddr.getIpAddress().indexOf("*") < 0 ? ipAddr.getIpAddress() : ipAddr.getIpAddress().substring(0, ipAddr.getIpAddress().indexOf("*"));
//				if(ip.contains(compare) && ipAddr.getAllowance() == 1) {
//					logger.info("ipAddr.getIpAddress: " + ipAddr.getIpAddress());
//					logger.info("user ip: " + ip);
//					findMatchingIp = true;
//					break;
//				} 
//			}

//			IPCheckLoginModule ipcheck = new IPCheckLoginModule();
//			ipcheck.checkCountByAddress(ip);
			
			//message.setData(MessageKey.SRC_IP, message.getData(SecurityKey.USER_IP).toString());
		}

		String userId = (String) message.getData(SecurityKey.USER_ID);
		String lmt_count = (String) message.getData(SessionKey.LMT_COUNT);
		String isWrite = (String) message.getData(SessionKey.IS_WRITE);

		if (isWrite == null) {
			isWrite = "true";
		}

		String webSession = message.getData(SessionKey.WEB_SESSION) != null
				? message.getData(SessionKey.WEB_SESSION).toString() : ".";
		SessionHelper2.setWebSession(message.getData(), webSession);

		UserVO user = new UserVO();
		user.setUserId(userId);
		UserVO res = userDao.selectUser(user);
		if(res != null) {
			userIdx = res.getId();
			privilege = res.getPrivilegeId();
			group_id = res.getGroup_id(); // yypark
		}
		
		SimpleDateFormat formatter = new SimpleDateFormat ( "yyyy-MM-dd HH:mm:ss" ); 
		Date currentTime = new Date ( ); 
		String lastLoginTime = formatter.format ( currentTime );
		
		logger.info("USER.ID=[" + userId + "] " + "SRC.IP" + "=[" + message.getData(SecurityKey.USER_IP) + "]");
		
		try {
			if ("root".equals(userId)) {
				checkPassword4DefaultUser(message.getData());
			} else {
				try {
					checkNormalUser(message.getData());
				} catch (Exception e) {
					//e.printStackTrace();
					reason = e.getMessage();
					logger.info("checkNormalUser is Fail(" + reason + ")");
					if (("letter.message.currentuser".equals(reason)) || ("letter.message.maxover".equals(reason))) {
						logger.info("[ORANGE] isAlreadyExistsSession step 01 : letter.message.currentuser");
						isAlreadyExistsSession(message.getData());
					}
					throw e;
				}

				UserVO userInfo = getUserInfo(userId);
				
				logger.info("checkNormalUser password(" + userInfo.getPassword() + "/"
						+ message.getData(SessionKey.USER_PASSWORD) + ")");

				if(userInfo.getTempPassword() != null && userInfo.getPassword().equals(message.getData(SessionKey.USER_PASSWORD))) {
					throw new LoginException("letter.message.firstLogin.changePassword");
				}
				
				if (!userInfo.getPassword().equals(message.getData(SessionKey.USER_PASSWORD))) {
					lhresult = 2;
					throw new LoginException("letter.message.password");
				}
				
				
				/* Login시 등록 IP Check 부분  */
				//String user_id = (String) message.getData(SecurityKey.USER_ID);
				List<IpVO> ipList = ipDao.selectIpList();
				
				if (null != ipList) {
					if (ipList.isEmpty()) {
						throw new Exception("letter.message.noips");
					}
				} else {
					throw new Exception("letter.message.dbfail");
				}

				String[] supernet = IpAddressChecker.getParentNetwork(ip);
				
				for (IpVO ipAddr : ipList) {
					for(int i = 0; i < supernet.length; i++) {
						if (supernet[i].contains(ipAddr.getIpAddress()) == true && ipAddr.getAllowance() == 1) {
							//findMatchingIp = true;
							//break;
							findMatchingIp = "success";
						}
						
						if(supernet[i].equals(ipAddr.getIpAddress()) == true && ipAddr.getAllowance() == 0) {
							//findMatchingIp = false;
							findMatchingIp = "letter.message.denyed.ipaddr";
						}
					}
					//if(findMatchingIp)
						//break;
				}
				
				//if(!findMatchingIp) {
				if(findMatchingIp.equals("letter.message.notexists.loginip")) {
					message.setResult(false);
					message.setFailReason("letter.message.notexists.loginip");
					message.setData("RESULT", "letter.message.notexists.loginip");
					throw new Exception("letter.message.notexists.loginip");
				} else if(findMatchingIp.equals("letter.message.denyed.ipaddr")) {
					message.setResult(false);
					message.setFailReason("letter.message.denyed.ipaddr");
					message.setData("RESULT", "letter.message.denyed.ipaddr");
					throw new Exception("letter.message.denyed.ipaddr");
				} else if(userInfo.getStatus() != UserStatus.ENABLE) {
					message.setResult(false);
					message.setFailReason("letter.message.denyed.userid");
					message.setData("RESULT", "letter.message.denyed.userid");
					throw new Exception("letter.message.denyed.userid");
				}		
				// message.putBody(SessionKey.USER_PASSWORD"USER.PASSWORD.DB",
				// message.getBody("USER.PASSWORD"));
				logger.info("[ORANGE] isAlreadyExistsSession step 01");
				isAlreadyExistsSession(message.getData());
				logger.info("[ORANGE] isWrite : " + isWrite);
				if (isWrite.equals("true")) {
					/* update session state*/
					//sessionId = String.valueOf(createSessionID());
					sessionId = createSessionID();

					if ((lmtOnOff == null) || ("".equals(lmtOnOff))) {
						lmtOnOff = getSessionType(Integer.valueOf(sessionId));
					}

					System.out.println("lmt_count: " + lmt_count);
					System.out.println("lmtOnOff: " + lmtOnOff);

					checkSessionValid(lmt_count, lmtOnOff, Integer.valueOf(sessionId));
				}
				loginStatus = 1; /* loginStatus 1 현재 접속중인 상태, 2 logout 상태*/
				logoutTime = "1900-01-01 00:00:00";
				updateUserLoginStatus(userIdx, loginStatus, lastLoginTime, lastLoginIp, res, tempPassword);
				addLoginHistory(sessionId, userId, privilege, lastLoginIp, lastLoginTime, logoutTime, 
						lhresult, failReason, logoutReason, tomcatSession, lloc, tomcatIp, sessionType);
			}
			
			message.setData("GROUP_ID", group_id); // yypark
			message.setData("PRIVILEGE_ID", privilege);
			message.setData("EMAIL", res.getEmail());
			message.setData(SessionKey.USER_INDEX, userIdx);
			message.setData("SESSION.ID", String.valueOf(tomcatSession));
			message.setData("IS.CONNECTED", Boolean.valueOf(true));
			message.setData("RESULT", "OK");

			message.setResult(true);

		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error("[crte_session2] login fail!! ( " + e.getMessage() + " )");
			lhresult = 2;
			failReason = e.getMessage();
			message.setResult(false);
			message.setFailReason(failReason);
			if("letter.message.password.empty".equals(failReason)) {
				message.setData("RESULT", failReason);
			} else if(("letter.message.password".equals(failReason)) && ("root".equals(userId))) {
				message.setData("RESULT", failReason);
			} else if("letter.message.notexists.loginip".equals(failReason)) {
				message.setData("RESULT", failReason);
			} else if("letter.message.notexists.loginid".equals(reason)) {
				message.setData("RESULT", failReason);
			} else if("letter.message.notexists.root".equals(failReason)) {
				message.setData("RESULT", failReason);
			} else if("letter.message.firstLogin.changePassword".equals(failReason)) {
				message.setData("RESULT", failReason);
			} else {
				if(e.getMessage().equals("letter.message.currentuser")) {
					getCurrentSessions(message.getData(), userId);
				}
				if(!"root".equals(userId)) {
					message.setData("RESULT", failReason);
					addLoginHistory(sessionId, userId, privilege, lastLoginIp, lastLoginTime, logoutTime, 
							lhresult, failReason, logoutReason, tomcatSession, lloc, tomcatIp, sessionType);
				}
			}
		}

		/*
		 * login history 입력 추후 구현 필요.
		 */
		// addLoginHistory(message, lmtOnOff);
		logger.info("[" + this.getClass().getName() + "] response message = " + message + " - dump End");
		return message;
	}

	protected int createSessionID() throws Exception {
		int session_id = -1;
		logger.info("[Start orange createSessionID]");

		SessionVO result = null;
		try {
			result = sessionDao.getNextSessionId();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		logger.info("[SmTSessionDaoImpl::getNextSessionId][" + result + "]");

		if (result == null) {
			throw new Exception("letter.message.maxover");
		} else {

			session_id = result.getSessionId();

			try {
				SessionVO sessDto = new SessionVO();
				sessDto.setSessionId(session_id);
				sessDto.setState(1);
				boolean updateResult = sessionDao.updSessionState(sessDto);

				if (updateResult) {
					logger.info("[SmTSessionDaoImpl::updSessionState -> 1][" + session_id + "]");
				} else {
					throw new Exception("letter.message.dbfail");
				}

			} catch (Exception e) {
				logger.error(e.getMessage());
				throw new Exception("letter.message.dbfail");
			}

			return session_id;
		}

	}

	private void getCurrentSessions(Map message, String userId) {

		String userID = message.get(MessageKey.SRC_ID).toString();

		logger.info("[crte_session2] getCurrentSessions Check userID : " + userID);

		ArrayList<LoginLogVO> results = new <LoginLogVO>ArrayList();
		try {
			results = loginLogDao.getCurrentLoginLog();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		String[] columnName = { "LOGIN_ID", "SESSION_ID", "LLOC", "LOGIN_TIME" };

		LoginLogVO result = null;

		for (int i = 0; i < results.size(); i++) {
			if ((userID.equals(results.get(i).getLoginId()))) {
				result = results.get(i);
				message.put("CURRENT.SESSION", results.get(i));
				break;
			}
		}
	}

	private String getSessionType(int session_id) {
		String session_type = "EMS";

		try {

			ArrayList<LoginLogVO> results = loginLogDao.getSmTLoginLogBySessionId(session_id);

			if (null == results) {
				logger.info("[SmTUsersDaoImpl::getSmTUsersById] ERROR :: NE LIST GET FAIL OR NOT FOUND :: NasTSnmpDao");
			} else {
				LoginLogVO result = results.get(0);
				logger.info("getSmTUsersById" + result);
				return result.getSessionType();
			}

		} catch (Exception e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return session_type;
		}
		
		return session_type;
	}
	
	private void isAlreadyExistsSession(Map message) throws Exception {

//		String userIP = message.get(SecurityKey.USER_IP).toString();
		String userIP = (String) message.get("SRC.IP");
		String userID = message.get(SessionKey.USER_ID).toString();

		logger.info("[crte_session2] isAlreadyExistsSession Check userIP : " + userIP);
		logger.info("[crte_session2] isAlreadyExistsSession Check userID : " + userID);

		ArrayList<LoginLogVO> results = new <LoginLogVO>ArrayList();
		try {
			results = loginLogDao.getCurrentLoginLog();
			logger.info("[crte_session2]  orange isAlreadyExistsSession result : " + results);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		String[] columnName = { "LOGIN_ID", "SESSION_ID", "LLOC", "LOGIN_TIME" };

		logger.info("[crte_session2]  orange isAlreadyExistsSession results size: " + results.size());
		LoginLogVO result = null;// orange why? null?

		for (int i = 0; i < results.size(); i++) {
			if ((userIP.equals(results.get(i).getLloc())) && (userID.equals(results.get(i).getLoginId()))) {
				result = results.get(i);
				message.put("CURRENT.SESSION", results.get(i));
				logger.info("[crte_session2] already exists session same ip address and same user_id");
				throw new Exception("letter.message.same.session.logged");

			}
		}
	}

	private void checkNormalUser(Map message) throws Exception {

		String userId = (String) message.get(SessionKey.USER_ID);

		UserVO user = getUserInfo(userId);
		Integer userIndexDb = user.getId();

		int userIndex = -1;
		try {
			userIndex = userIndexDb.intValue();
		} catch (Exception e) {
			logger.error("User Index in not valid");
		}
		SessionHelper2.setUserIndex(message, userIndexDb);

		String groupName = "ALL";

		SessionHelper2.setUserGroup(message, groupName);

		Integer privilege = user.getPrivilegeId();
		SessionHelper2.setUserPrivilege(message, privilege);

		// User 의 세션별 카운트를 1로 고정함.
		Integer sessionCnt = 1;
		SessionHelper2.setUserSessionCnt(message, sessionCnt);

	}

	private void checkSessionValid(String lmt_count, String lmtOnOff, int session_Id) throws Exception {
		int[] idArray = new int[1];
		idArray[0] = session_Id;

		System.out.println("lmt_count: " + lmt_count);
		System.out.println("lmtOnOff: " + lmtOnOff);

		int lmtCount = 0;

		try {
			lmtCount = Integer.valueOf(lmt_count).intValue();
		} catch (Exception e) {
			e.printStackTrace();
		}

		int maxSessionCnt = 0;
		int maxEmsSessionCnt = 0;
		int currentEmsSessionCnt = 0;
		int currentLmtSessionCnt = 0;

		try {
			maxSessionCnt = sessionDao.getSessionCount();
			logger.info("[SmTSessionDaoImpl::getSessionCount][" + maxSessionCnt + "]");

		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new Exception("letter.message.dbfail");
		}

		maxEmsSessionCnt = maxSessionCnt - lmtCount;

		try {
			currentEmsSessionCnt = loginLogDao.getCurrentLoginLogCount("EMS");
			currentLmtSessionCnt = loginLogDao.getCurrentLoginLogCount("LMT");
			logger.info("[SmTLoginLogDaoImpl::getCurrentLoginLogCount][" + currentEmsSessionCnt + "]["
					+ currentLmtSessionCnt + "]");

		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new Exception("letter.message.dbfail");
		}

		if ("EMS".equals(lmtOnOff)) {
			if (currentEmsSessionCnt >= maxEmsSessionCnt) {
				try {
					SessionVO sessDto = new SessionVO();
					sessDto.setSessionId(session_Id);
					sessDto.setState(0);
					boolean updateResult = sessionDao.updSessionState(sessDto);
					if (updateResult) {
						logger.info("[SmTSessionDaoImpl::updSessionState -> 0][EMS_SESSION_FAIL][" + session_Id + "]");
					} else {
						throw new Exception("letter.message.dbfail");
					}
				} catch (Exception e) {
					logger.error(e.getMessage());
					throw new Exception("letter.message.dbfail");
				}
				System.out.println("EMS_SESSION_FAIL");
				throw new Exception("letter.message.maxover");
			}
		}
		if (("LMT".equals(lmtOnOff)) && (currentLmtSessionCnt >= lmtCount)) {
			try {
				SessionVO sessDto = new SessionVO();
				sessDto.setSessionId(session_Id);
				sessDto.setState(0);
				boolean updateResult = sessionDao.updSessionState(sessDto);
				if (updateResult) {
					logger.info("[SmTSessionDaoImpl::updSessionState -> 0][LMT_SESSION_FAIL][" + session_Id + "]");
				} else {
					throw new Exception("letter.message.dbfail");
				}
			} catch (Exception e) {
				logger.error(e.getMessage());
				throw new Exception("letter.message.dbfail");
			}
			System.out.println("LMT_SESSION_FAIL");
			throw new Exception("letter.message.maxover");
		}
	}

	private void checkPassword4DefaultUser(Map message) throws Exception {
		// Map body = (Map) message.get("BODY");
		String userPassword = (String) message.get("USER.PASSWORD");
		UserVO userInfo = getUserInfo("root");

		SessionHelper2.setUserIndex(message, Integer.valueOf(0));
		SessionHelper2.setUserPrivilege(message, Integer.valueOf(0));
		SessionHelper2.setUserRole(message, "all");
		if (userInfo != null) {
			String password = userInfo.getPassword();
			if (!userPassword.equals(password)) {
				throw new LoginException("letter.message.password");
			} else if (userPassword.equals(null)) {
				throw new LoginException("letter.message.password");
			}
		}
		message.put("PASSWORD.EXPIRE.REMAIN.DAYS", Integer.valueOf(Integer.MAX_VALUE));

		message.put("PASSWORD.WARNING.DAYS", Integer.valueOf(-1));
	}

	protected UserVO getUserInfo(String userId) throws Exception {// banana

		UserVO user = new UserVO();
		user.setUserId(userId);
		UserVO result = userDao.selectUser(user);

		if("root".equals(userId) && result == null) {
			throw new LoginException("letter.message.notexists.root");
		}
		else if("root".equals(userId) && result.getPassword() == null) {
			throw new LoginException("letter.message.password.empty");
		}
		else if (null == result) {
			logger.info("[SmTUsersDaoImpl::getSmTUsersById] ERROR :: NE LIST GET FAIL OR NOT FOUND :: NasTSnmpDao");
			throw new Exception("letter.message.notexists.loginid");
//			throw new Exception("letter.message.notsubscribed");
		} else {
			logger.error("User Information not exits.");

		}
		return result;
		
	}
	
	private String getUnknownUserId(String userid) {
		if (userid.length() > 20) {
			return userid.substring(0, 17) + "...";
		} else {
			return userid;
		}
	}
	
	public void updateUserLoginStatus(int userIdx, int loginStatus, String lastLoginTime, String lastLoginIp, UserVO res, String tempPassword) {
		res.setId(userIdx);
		res.setLoginStatus(loginStatus);
		res.setLastLoginTime(lastLoginTime);
		res.setLastLoginIp(lastLoginIp);
		res.setTempPassword(tempPassword);
		userDao.updateByUserId(res);
	}
	
	public void addLoginHistory(int sessionId, String userId, int privilege, String lastLoginIp, String lastLoginTime, 
			String logoutTime, int lhresult, String failReason, String logoutReason, String tomcatSession, String lloc, String tomcatIp, String sessionType) {
		
		LoginHistoryVO loginHistoryVO = new LoginHistoryVO();
		loginHistoryVO.setSessionId(sessionId);
		loginHistoryVO.setLoginId(userId);
		loginHistoryVO.setPrivilege(privilege);
		loginHistoryVO.setIpAddress(lastLoginIp);
		loginHistoryVO.setLoginTime(lastLoginTime);
		loginHistoryVO.setLastCheckTime(lastLoginTime);
		loginHistoryVO.setLogoutTime(logoutTime);
		loginHistoryVO.setResult(lhresult);
		loginHistoryVO.setFailReason(failReason);
		loginHistoryVO.setLogoutReason(logoutReason);
		loginHistoryVO.setTomcatSession(tomcatSession);
		loginHistoryVO.setLloc(lloc);
		loginHistoryVO.setTomcatIp(tomcatIp);
		loginHistoryVO.setSessionType(sessionType);
		loginHistoryDao.insertLoginHistory(loginHistoryVO);
	}	
/*	
	  private void checkCountByAddress(String ipaddress)
			    throws Exception
	  {
	    Map addressFilter = getAddressFilter(ipaddress);
	    String address = (String)addressFilter.get("IP");
	    Integer sessionCnt = (Integer)addressFilter.get("SESSION_CNT");
	    
	    int count = 0;
	    SQLResult sql = DbSm.getCurrentLoginLog();
	    if (sql.result == 10000)
	    {
	      Vector ipVector = (Vector)sql.FRV_hash.get("LLOC");
	      String compare = address.indexOf("*") < 0 ? address : address.substring(0, address.indexOf("*"));
	      for (int i = 0; i < ipVector.size(); i++) {
	        if (ipVector.get(i).toString().indexOf(compare) >= 0) {
	          count++;
	        }
	      }
	    }
	    else if (sql.result == 10002)
	    {
	      count = 0;
	    }
	    else
	    {
	      throw new Exception("message.db.fail");
	    }
	    if (sessionCnt.intValue() <= count)
	    {
	      if (address.indexOf("*") < 0) {
	        throw new Exception("letter.message.ip.working");
	      }
	      throw new Exception("letter.message.ip.band.working");
	    }
	  }	
	
	  private Map getAddressFilter(String ipaddress)
			    throws Exception
	  {
	    Map filterMap = new HashMap(2);
	    String[] supernet = IpAddressChecker.getParentNetwork(ipaddress);
	    
	    Vector sortKey = new Vector();
	    sortKey.addElement("IP");
	    SQLResult sql = DbSm.getIp(1, Integer.MAX_VALUE, -1, "N/A", sortKey, 101);
	    if (sql.result != 10000)
	    {
	      if (sql.result == 10002) {
	        throw new Exception("letter.message.noips");
	      }
	      throw new Exception("letter.message.dbfail");
	    }
	    Vector ipVector = (Vector)sql.FRV_hash.get("IP");
	    Vector countVector = (Vector)sql.FRV_hash.get("SESSION_CNT");
	    
	    int position = 0;
	    if (ipVector.contains(ipaddress) == true)
	    {
	      position = findPosition(ipVector, countVector, ipaddress);
	      filterMap.put("IP", ipVector.get(position).toString());
	      filterMap.put("SESSION_CNT", new Integer(countVector.get(position).toString()));
	    }
	    else
	    {
	      for (int i = 0; i < supernet.length; i++) {
	        if (ipVector.contains(supernet[i]) == true)
	        {
	          position = findPosition(ipVector, countVector, supernet[i]);
	          filterMap.put("IP", ipVector.get(position).toString());
	          filterMap.put("SESSION_CNT", new Integer(countVector.get(position).toString()));
	          
	          break;
	        }
	      }
	    }
	    logger.info("[crte_session2] IP filterMap: " + filterMap);
	    
	    int allowedSession = -1;
	    if (filterMap.containsKey("SESSION_CNT"))
	    {
	      Integer sessionCnt = (Integer)filterMap.get("SESSION_CNT");
	      allowedSession = sessionCnt.intValue();
	    }
	    if (allowedSession < 1) {
	      throw new Exception("letter.message.notallowedip");
	    }
	    return filterMap;
	  }
	}	  
*/	  
	/*
	 * protected void notify(Map<String, Object> message) { String result =
	 * message.getResult();
	 * 
	 * String userId = (String) message.get("USER.ID"); String ipAddress =
	 * (String) message.get("SRC.IP");
	 * 
	 * Map report = new HashMap(); report.put("MSG.NAME", "fire_login_status");
	 * report.put("alarmId", Integer.valueOf(3006)); report.put("userId",
	 * userId); report.put("ipAddress", ipAddress); if ("OK".equals(result)) {
	 * report.put("status", "LOGIN_SUCCESS"); } else if
	 * ("letter.message.currentuser".equals(message.getReason())) { Integer
	 * sessionCnt = (Integer) message.getBody("SESSION.CNT"); if ((sessionCnt !=
	 * null) && (sessionCnt.intValue() > 1)) { report.put("status",
	 * "LOGIN_FAILURE_MAX_SESSION"); } else { report.put("status",
	 * "LOGIN_FAILURE"); } } else { report.put("status", "LOGIN_FAILURE"); }
	 * StatusReporter.getInstance().report(report); }
	 */

	/*
	 * 
	 * protected void addLoginHistory(Map message) { Map body = (Map)
	 * message.get("BODY");
	 * 
	 * String id = (String) body.get("USER.ID"); SQLResult sqlResult =
	 * DbSm.getUsers(id);
	 * 
	 * SessionHelper session = new SessionHelper(body); int index =
	 * session.getUserIndex() == null ? -1 : session.getUserIndex().intValue();
	 * 
	 * int privilege = session.getUserPrivilege() == null ? 1 :
	 * session.getUserPrivilege().intValue();
	 * 
	 * SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	 * String loginTime = formatter.format(new
	 * Date(System.currentTimeMillis()));
	 * 
	 * Sm_T_LoginLog table = new Sm_T_LoginLog(); session_type = ""; user_index
	 * = index; if (result == 10000) { login_id = session.getUserId(); } else {
	 * login_id = getUnknownUserId(session.getUserId()); } login_time =
	 * loginTime; privilege = privilege; lloc = ((String)
	 * message.get("SRC.IP")); if ("OK".equals((String) message.get("RESULT")))
	 * { session_id = session.getSessionId().intValue(); login_fail_reason =
	 * "SUCCESS"; tomcat_session = session.getWebSession(); } else { session_id
	 * = -1; login_fail_reason = ((String) message.get("RESULT"));
	 * tomcat_session = SessionHelper2.getWebSession(body); logout_time =
	 * CTime.getCurrentDBTime(); } if (body.containsKey("URL_IP")) { tomcat_ip =
	 * body.get("URL_IP").toString(); } DbSm.insLoginLog(table); }
	 */

	/*
	 * protected void addLoginHistory(MyMessage message, String lmtOnOff) { Map
	 * body = message.getBody();
	 * 
	 * String id = (String) body.get(SecurityKey.USER_ID); //SQLResult sqlResult
	 * = DbSm.getUsers(id); SmTUsers existUser = null; try { existUser =
	 * getUserInfo(id); } catch (Exception e1) { LogUtil.warning(e1); }
	 * SessionHelper session = new SessionHelper(body); int index =
	 * (session.getUserIndex() == null) ? -1 : session
	 * .getUserIndex().intValue(); int privilege = (session.getUserPrivilege()
	 * == null) ? 1 : session .getUserPrivilege().intValue(); SimpleDateFormat
	 * formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); String loginTime
	 * = formatter .format(new Date(System.currentTimeMillis()));
	 * 
	 * SmTLoginLog table = new SmTLoginLog();
	 * 
	 * // if(lmtOnOff.equals("true")) if ("LMT".equals(lmtOnOff)) {
	 * table.session_type = "LMT"; } else { table.session_type = "EMS"; }
	 * 
	 * table.user_index = index; if (existUser != null) { table.login_id =
	 * session.getUserId(); } else { table.login_id =
	 * getUnknownUserId(session.getUserId()); } table.login_time = loginTime;
	 * table.privilege = privilege; table.lloc = (String) body.get("SRC.IP");
	 * 
	 * if ("OK".equals(message.getResult())) { table.session_id =
	 * session.getSessionId().intValue(); table.login_fail_reason = "SUCCESS";
	 * table.tomcat_session = (String) session.getWebSession(); } else {
	 * table.session_id = -1; table.login_fail_reason = message.getReason();
	 * table.tomcat_session = SessionHelper2.getWebSession(body);
	 * SimpleDateFormat dbFormat = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" )
	 * ; table.logout_time = dbFormat.format(new Date()); } if
	 * (body.containsKey("URL_IP")) { table.tomcat_ip =
	 * body.get("URL.IP").toString(); }
	 * 
	 * try { ApplicationContext context = ApplicationContextUtil.getContext();
	 * SmTLoginLogDaoImpl smtLoginDB = (SmTLoginLogDaoImpl)
	 * context.getBean("smTLoginLogDaoImpl");
	 * LogUtil.info("[SmTLoginLogDaoImpl::putSmTLoginLog][" + table + "]");
	 * 
	 * boolean result = smtLoginDB.putSmTLoginLog(table);
	 * 
	 * if (!result) {
	 * LogUtil.info("[SmTLoginLogDaoImpl::putSmTLoginLog] ERROR ");
	 * 
	 * } } catch (Exception e) { e.printStackTrace(); LogUtil.warning(e); } }
	 */
}