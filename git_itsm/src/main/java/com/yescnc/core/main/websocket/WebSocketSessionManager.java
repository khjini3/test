package com.yescnc.core.main.websocket;


import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpSession;

import org.springframework.web.socket.WebSocketSession;

import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.http.HttpRequestParser;


public class WebSocketSessionManager {
	private static WebSocketSessionManager instance;
	private Map<String, WebSocketSession> container;

	private WebSocketSessionManager() {
		this.container = new HashMap();
	}

	public static synchronized WebSocketSessionManager getInstance() {
		if (instance == null) {
			instance = new WebSocketSessionManager();
		}
		return instance;
	}

	public String getKey(WebSocketSession session) {
//		Map attribute = session.getHandshakeAttributes();
		Map attribute = session.getAttributes();
		HttpSession httpSession = (HttpSession) attribute.get("HTTP_SESSION");
		String userId = (String) attribute.get("USER_ID");
		String userIp = (String) attribute.get("USER_IP");

		try {
			String keyForUserVo = HttpRequestParser.getKeyNameForUserVo(httpSession, userId, userIp);
			String httpSessionId = httpSession.getId();
			UserVO userVo = (UserVO) httpSession.getAttribute(keyForUserVo);
			int dbId = userVo.getId();
			return dbId + "_" + httpSessionId;
		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println(e.getMessage());
			return null;
		}
	}

	public synchronized boolean contains(WebSocketSession session) {
		String key = getKey(session);
		return this.container.containsKey(key);
	}

	public synchronized void add(WebSocketSession session) {
		String key = getKey(session);
		this.container.put(key, session);
	}

	public synchronized WebSocketSession remove(WebSocketSession session) {
		String key = getKey(session);
		/*LogoutProcessor의 httpSession removeUserVo 실행시 httpSession 삭제로 인하여 userVO null로 인해 key 생성시 exception 발생하여 container의 session 삭제 불가로 위치 옮김 */
		//Map attribute = session.getAttributes();
		//HttpSession httpSession = (HttpSession) attribute.get("HTTP_SESSION");
		//httpSession.removeAttribute("userVO");
		/********************************************************************************************************************************************/		
		WebSocketSession oldSession = (WebSocketSession) this.container.remove(key);
		return oldSession;
	}

	public synchronized WebSocketSession get(WebSocketSession session) {
		String key = getKey(session);
		return ((WebSocketSession) this.container.get(key));
	}
}

