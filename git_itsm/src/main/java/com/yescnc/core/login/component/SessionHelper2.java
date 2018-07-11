package com.yescnc.core.login.component;

import java.util.Date;
import java.util.Map;

import com.yescnc.core.constant.SessionKey;

public class SessionHelper2 {
	/**
	 * get Session Id
	 * 
	 * @param map
	 * @return
	 */
	public static Integer getSessionId(Map map) {
		return (Integer) map.get(SessionKey.SESSION_ID);
	}

	/**
	 * get Session Identifier
	 * 
	 * @param map
	 * @param sessionId
	 */
	public static void setSessionId(Map map, Integer sessionId) {
		map.put(SessionKey.SESSION_ID, sessionId);
	}

	public static String getSubscribeId(Map map) {
		return (String) map.get(SessionKey.SUBSCRIBE_ID);
	}

	public static void setSubscribeId(Map map, String subscribeId) {
		map.put(SessionKey.SUBSCRIBE_ID, subscribeId);
	}

	public static String getWebSession(Map map) {
		return (String) map.get(SessionKey.WEB_SESSION);
	}

	public static void setWebSession(Map map, String webSession) {
		map.put(SessionKey.WEB_SESSION, webSession);
	}

	/**
	 * get User Index
	 * 
	 * @param map
	 * @return
	 */
	public static Integer getUserIndex(Map map) {
		return (Integer) map.get(SessionKey.USER_INDEX);
	}

	/**
	 * set User Index
	 * 
	 * @param map
	 * @param userId
	 */
	public static void setUserIndex(Map map, Integer userIndex) {
		map.put(SessionKey.USER_INDEX, userIndex);
	}

	/**
	 * get User Identifier
	 * 
	 * @param map
	 * @return
	 */
	public static String getUserId(Map map) {
		return (String) map.get(SessionKey.USER_ID);
	}

	/**
	 * set User Identifier
	 * 
	 * @param map
	 * @param userId
	 */
	public static void setUserId(Map map, String userId) {
		map.put(SessionKey.USER_ID, userId);
	}

	/**
	 * get User Password
	 * 
	 * @param map
	 * @return
	 */
	public static String getUserPassword(Map map) {
		return (String) map.get(SessionKey.USER_PASSWORD);
	}

	/**
	 * set User Password
	 * 
	 * @param map
	 * @param userPassword
	 */
	public static void setUserPassword(Map map, String userPassword) {
		map.put(SessionKey.USER_PASSWORD, userPassword);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getUserGroup(Map map) {
		return (String) map.get(SessionKey.USER_GROUP);
	}

	/**
	 * @param map
	 * @param userId
	 */
	public static void setUserGroup(Map map, String userId) {
		map.put(SessionKey.USER_GROUP, userId);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getUserRole(Map map) {
		return (String) map.get(SessionKey.USER_ROLE);
	}

	/**
	 * @param map
	 * @param role
	 */
	public static void setUserRole(Map map, String role) {
		map.put(SessionKey.USER_ROLE, role);
	}

	/**
	 * @param map
	 * @return
	 */
	public static Integer getUserPrivilege(Map map) {
		return (Integer) map.get(SessionKey.USER_PRIVILEGE);
	}

	/**
	 * @param map
	 * @param userPrivilege
	 */
	public static void setUserPrivilege(Map map, Integer userPrivilege) {
		map.put(SessionKey.USER_PRIVILEGE, userPrivilege);
	}

	/**
	 * get User SessionCnt
	 * 
	 * @param map
	 * @return
	 */
	public static Integer getUserSessionCnt(Map map) {
		return (Integer) map.get(SessionKey.SESSION_CNT);
	}

	/**
	 * set User SessionCnt
	 * 
	 * @param map
	 * @param userId
	 */
	public static void setUserSessionCnt(Map map, Integer sessionCnt) {
		map.put(SessionKey.SESSION_CNT, sessionCnt);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getClientId(Map map) {
		return (String) map.get(SessionKey.CLIENT_ID);
	}

	/**
	 * @param map
	 * @param clientId
	 */
	public static void setClientId(Map map, String clientId) {
		map.put(SessionKey.CLIENT_ID, clientId);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getClientIp(Map map) {
		return (String) map.get(SessionKey.CLIENT_IP);
	}

	/**
	 * @param map
	 * @param clientIP
	 */
	public static void setClientIp(Map map, String clientIP) {
		map.put(SessionKey.USER_ID, clientIP);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getServerId(Map map) {
		return (String) map.get(SessionKey.SERVER_ID);
	}

	/**
	 * @param map
	 * @param serverId
	 */
	public static void setServerId(Map map, String serverId) {
		map.put(SessionKey.SERVER_ID, serverId);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getServerIp(Map map) {
		return (String) map.get(SessionKey.SERVER_IP);
	}

	/**
	 * @param map
	 * @param serverIp
	 */
	public static void setServerIp(Map map, String serverIp) {
		map.put(SessionKey.SERVER_IP, serverIp);
	}

	/**
	 * @param map
	 * @return
	 */
	public static Integer getServerPort(Map map) {
		return (Integer) map.get(SessionKey.SERVER_PORT);
	}

	/**
	 * @param map
	 * @param serverPort
	 */
	public static void setServerPort(Map map, Integer serverPort) {
		map.put(SessionKey.SERVER_PORT, serverPort);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getServerType(Map map) {
		return (String) map.get(SessionKey.SERVER_TYPE);
	}

	/**
	 * @param map
	 * @param serverType
	 */
	public static void setServerType(Map map, String serverType) {
		map.put(SessionKey.SERVER_TYPE, serverType);
	}

	/**
	 * @param map
	 * @return
	 */
	public static String getServerVersion(Map map) {
		return (String) map.get(SessionKey.SERVER_VERSION);
	}

	/**
	 * @param map
	 * @param serverVersion
	 */
	public static void setServerVersion(Map map, String serverVersion) {
		map.put(SessionKey.SERVER_VERSION, serverVersion);
	}

	/**
	 * @param map
	 * @return
	 */
	public static Boolean isConnected(Map map) {
		return (Boolean) map.get(SessionKey.IS_CONNECTED);
	}

	/**
	 * @param map
	 * @param isConnected
	 */
	public static void setConnected(Map map, Boolean isConnected) {
		map.put(SessionKey.IS_CONNECTED, isConnected);
	}

	/**
	 * @param map
	 * @return
	 */
	public static Date getLastLoginTime(Map map) {
		return (Date) map.get(SessionKey.LAST_LOGIN_TIME);
	}

	/**
	 * @param map
	 * @param date
	 */
	public static void setLastLoginTime(Map map, Date date) {
		map.put(SessionKey.LAST_LOGIN_TIME, date);
	}

	/**
	 * @param map
	 * @return
	 */
	public static Date getLastLogoutTime(Map map) {
		return (Date) map.get(SessionKey.LAST_LOGOUT_TIME);
	}

	/**
	 * @param map
	 * @param date
	 */
	public static void setLastLogoutTime(Map map, Date date) {
		map.put(SessionKey.LAST_LOGOUT_TIME, date);
	}

	public static void setSSL(Map map, boolean isSSL) {
		map.put(SessionKey.IS_SSL, Boolean.valueOf(isSSL));
	}

	public static boolean isSSL(Map map) {
		Boolean isSSL = (Boolean) map.get(SessionKey.IS_SSL);
		if (isSSL != null)
			return isSSL.booleanValue();

		return false;
	}

	public static String getURL(Map map, String destId) {
		String url = "";
		if (getServerPort(map) == null)
			url = "//" + getServerIp(map) + "/" + destId;
		else
			url = "//" + getServerIp(map) + ":" + getServerPort(map) + "/" + destId;

		return isSSL(map) && !destId.endsWith("publisher") ? url + ".ssl" : url;
	}
}