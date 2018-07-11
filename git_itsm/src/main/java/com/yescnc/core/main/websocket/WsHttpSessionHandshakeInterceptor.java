package com.yescnc.core.main.websocket;

import java.io.PrintStream;
import java.util.Locale;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.http.HttpRequestParser;


public class WsHttpSessionHandshakeInterceptor extends HttpSessionHandshakeInterceptor {
	Logger logger;
	//private LoginProcessor loginProcessor;
	//private SessionProcessor sessionProcessor;

	public WsHttpSessionHandshakeInterceptor() {
		//this.logger = LoggerFactory.getLogger(PollingEventController.class);
	}


	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {
		
		HttpServletRequest httpRequest = ((ServletServerHttpRequest) request).getServletRequest();
				
		String id = HttpRequestParser.getUserId(httpRequest);
		System.out.println("[beforeHandshake] ID: " + id);
		HttpSession session = httpRequest.getSession();
		if (session != null) {
			System.out.println("[beforeHandshake] sessionId : " + session.getId());
		}
		createSession(httpRequest);

		
		attributes.put("HTTP_SESSION", session);
		attributes.put("USER_ID", id);
		attributes.put("USER_IP", httpRequest.getRemoteAddr());

		return super.beforeHandshake(request, response, wsHandler, attributes);
	}

	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Exception e) {
		super.afterHandshake(request, response, wsHandler, e);
	}

	private void createSession(HttpServletRequest httpRequest) throws Exception {
		HttpSession session = httpRequest.getSession();

		String id = HttpRequestParser.getUserId(httpRequest);
		String ip = httpRequest.getRemoteAddr();
		System.out.println("[beforeHandshake] ID: " + id + ", IP: " + ip);

		UserVO userVo = HttpRequestParser.getUserVo(httpRequest);
		if (userVo == null) {
			System.out.println("[beforeHandshake] UserVO Object is NULL.");
			
			userVo = new UserVO();
			userVo.setUserId(id);
			userVo.setIpAddress(ip);
			setSesssionAttribute(httpRequest, userVo);
			
			/*
			if (this.loginProcessor != null) {
				userVo = this.loginProcessor.loginProc(session, id, ip);
				String result = userVo.getResult();
				if ("OK".equals(result)) {
					setSesssionAttribute(httpRequest, userVo);
				} else if ("letter.message.same.session.logged".equals(result)) {
					System.out.println("[beforeHandshake] letter.message.same.session.logged");
					System.out.println("[beforeHandshake] forcedLogoutByIdAndIp");
					Map res = this.sessionProcessor.forcedLogoutByIdAndIp(httpRequest, id, ip);
					if ("OK".equals(res.get("RESULT"))) {
						Thread.sleep(7000L);

						HttpRequestParser.removeUserVo(httpRequest);
						System.out.println("[beforeHandshake] Relogin");
						userVo = this.loginProcessor.loginProc(session, id, ip);
						result = userVo.getResult();
						System.out.println("[beforeHandshake] Relogin [" + result + "]");
						if ("OK".equals(result))
							setSesssionAttribute(httpRequest, userVo);
					} else {
						System.out.println("[beforeHandshake] forcedLogoutByIdAndIp Fail(" + result + ")");
						throw new Exception("Not Create USER VO.(" + result + ")");
					}
				} else {
					System.out.println("[beforeHandshake] Not Create USER VO.");
					throw new Exception("Not Create USER VO.");
				}
			} else {
				System.out.println("[beforeHandshake] loginProcessor is NULL");
			}
			*/
		} else {
			System.out.println("[beforeHandshake] There is alrady UserVO Object.");
		}
	}

	private void setSesssionAttribute(HttpServletRequest httpRequest, UserVO userVo) {
		Locale locale = getLocale(httpRequest);
		String lmt = getLmt(httpRequest);
		System.out.println("[afterHandshake] locale : " + locale.toString() + ", lmt:" + lmt);
		HttpSession session = httpRequest.getSession();

		session.setAttribute("LOCALE", locale);
		session.setAttribute("lmt", lmt);
		try {
			HttpRequestParser.setUserVo(httpRequest, userVo);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String getLmt(HttpServletRequest httpRequest) {
		String lmt = httpRequest.getParameter("lmt");
		if (lmt == null) {
			lmt = "EMS";
		}
		return lmt;
	}

	private Locale getLocale(HttpServletRequest httpRequest) {
		Cookie[] cookies = httpRequest.getCookies();
		Cookie cookie = null;
		String locale = null;
		for (int i = 0; i < cookies.length; ++i) {
			cookie = cookies[i];
			if (cookie.getName().equals("locale")) {
				locale = cookie.getValue();
				break;
			}
		}
		if (locale == null) {
			return httpRequest.getLocale();
		}

		return new Locale(locale);
	}
}