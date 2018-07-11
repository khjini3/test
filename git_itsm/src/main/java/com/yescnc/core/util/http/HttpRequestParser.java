package com.yescnc.core.util.http;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.yescnc.core.entity.db.UserVO;

public class HttpRequestParser {

	public static final String SRC_ID = "srcId";
	public static final String LOGIN_ID = "LOGIN_ID";

	public static String getValueFromCookie(HttpServletRequest request, String key) {
		return getValueFromCookie(request.getCookies(), key);
	}

	public static String getValueFromCookie(Cookie[] cookies, String key) {
		Cookie cookie = null;
		for (int i = 0; i < cookies.length; i++) {
			cookie = cookies[i];
			if (key.equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}

	public static UserVO getUserVo(HttpServletRequest request) {
		HttpSession session = request.getSession();
		try {
			String key = getKeyNameForUserVo(request);
			return (UserVO) session.getAttribute(key);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static void setUserVo(HttpServletRequest request, UserVO userVo) throws Exception {
		HttpSession session = request.getSession();

		String id = userVo.getUserId();
		if (id == null || "".equals(id.trim())) {
			throw new Exception("Invalid user ID(" + id + ")");
		}
		//String ip = userVo.getLastLoginIp();

		//String key = getKeyNameForUserVo(session, id, ip);
//		session.setAttribute(key, userVo);
		session.setAttribute("userVO", userVo);

	}

	public static void removeUserVo(HttpServletRequest request) throws Exception {
		HttpSession session = request.getSession();
		String id = getUserId(request);
		if (id == null || "".equals(id.trim())) {
			throw new Exception("Invalid user ID(" + id + ")");
		}
		String ip = request.getRemoteAddr();
		String key = getKeyNameForUserVo(session, id, ip);
		session.removeAttribute(key);
	}

	public static void removeUserVo(HttpServletRequest request, UserVO userVo) throws Exception {
		HttpSession session = request.getSession();
		String id = userVo.getUserId();
		if (id == null || "".equals(id.trim())) {
			System.out.println("[HttpRequestParser.removeUserVo] There is no userId.(" + session.getId() + ")");
			return;
		}
		String ip = userVo.getLastLoginIp();
		String key = getKeyNameForUserVo(session, id, ip);
		session.removeAttribute(key);
	}

	public static String getUserId(HttpServletRequest request) {
		String userId = request.getParameter(SRC_ID);
		if (userId == null) {
			userId = request.getParameter(LOGIN_ID);
		}
		if (userId == null) {
			userId = request.getAttribute(SRC_ID).toString();
		}
		return userId;
	}

	private static String getKeyNameForUserVo(HttpServletRequest request) throws Exception {
		String id = getUserId(request);
		if (id == null) {
			throw new Exception("There is no user ID in HTTP request.");
		}
		String ip = request.getRemoteAddr();
		return getKeyNameForUserVo(request.getSession(), id, ip);
	}

	public static String getKeyNameForUserVo(HttpSession session, String id, String ip) throws Exception {
//		String key = session.getId() + "_" + id + "_" + ip;
		String key = "userVO";
		return key;
	}

}