package com.yescnc.core.login.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import com.yescnc.core.configuration.SessionListener;
import com.yescnc.core.configuration.SesssionConfiguration;
import com.yescnc.core.constant.MessageKey;
import com.yescnc.core.constant.SessionKey;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.login.component.DeleteSession;
import com.yescnc.core.main.websocket.PushWebSocketController;
import com.yescnc.core.util.http.HttpRequestParser;
import com.yescnc.core.util.json.JsonResult;


@Service
public class LogoutProcessor {
	
	private static final Logger logger = LoggerFactory.getLogger(LogoutProcessor.class);
	
	@Autowired
	private PushWebSocketController socketSession;
	
	@Autowired
	private SessionListener sessionListener;
	
	@Autowired
	private DeleteSession deleteSession;
	
	public static final String DEL_SESSION = "del_session";
	
	public JsonResult logout(HttpServletRequest request, Map<String, String> param) {
		
		logger.info("Orange logout Start ");
		logger.info("Orange33 logout request: " + param.toString());
		
		JsonResult restResponse = new JsonResult();
		JsonResult result = null;
		
		try {
			HttpSession session = request.getSession();
	
			request.setAttribute("srcId", param.get("srcId"));
			
			String reason = (param.get("LOGOUT_REASON") == null || param.get("LOGOUT_REASON") == "") ? "reason.logout.useraction" 
					: param.get("LOGOUT_REASON").toString();
			
			logger.info("Orange logout request.getAttribute: " + request.getAttribute("srcId").toString());
			UserVO userInfo = HttpRequestParser.getUserVo(request);
			logger.info("Orange logout userInfo: " + userInfo);
			
			if(userInfo == null) {
				restResponse.setFailReason("userInfo null");
				restResponse.setResult(false);
				return restResponse;
			}
					
			JsonResult requestSession = new JsonResult();

			requestSession.setData(SessionKey.WEB_SESSION, session.getId());
			requestSession.setData(SessionKey.SESSION_ID, userInfo.getSessionId());
			requestSession.setData(SessionKey.USER_ID, userInfo.getUserId());
			requestSession.setData(SessionKey.LOGOUT_REASON, reason);
			
			String msg_name = "del_session";

			requestSession.setData(MessageKey.SRC_ID, userInfo.getUserId());
			requestSession.setData(MessageKey.SRC_IP, userInfo.getLastLoginIp());
			requestSession.setData(MessageKey.INPUT_MSG, "LOGOUT");

			if(param.containsKey("USER_LOGOUT") == true) {
				requestSession.setData(SessionKey.WEB_SESSION, param.get("TOMCAT_SESSION"));
				requestSession.setData(SessionKey.SESSION_ID, param.get("SESSION_ID"));
				requestSession.setData(SessionKey.USER_ID, param.get("srcId"));
				requestSession.setData(SessionKey.LOGOUT_REASON, "reason.logout.adminaction");

				requestSession.setData(MessageKey.SRC_ID, param.get("srcId"));
				requestSession.setData(MessageKey.SRC_IP, param.get("IP.ADDRESS"));
				requestSession.setData(MessageKey.INPUT_MSG, "LOGOUT");
				
				logger.info("request : {}", request.getSession());
			}			
			
			logger.info("requestMap : {}", requestSession.toString());
			
			result = deleteSession.remove(requestSession);
		
			if (null == result) {
				restResponse.setFailReason("message.failure");
				restResponse.setResult(false);
				
				return restResponse;
			}
			logger.info("[LoginProcessor] response completed : " + result);
			
			if (!result.getResult()) {
				String message = "";
				logger.info("[LoginProcessor] get Fail Reason " + result.getFailReason());
				restResponse.setFailReason(result.getFailReason());

				restResponse.setResult(false);
		
				return restResponse;
			} 
			
			if(param.containsKey("USER_LOGOUT") == true) {
				//remove User VO
				sessionListener.removeSesssion(param.get("TOMCAT_SESSION"));
				
				socketSession.handleTextMessage("reason.logout.adminaction");
				
				param.put("USER_LOGOUT", null);
			} else {
				//remove User VO
				if(param.containsKey("FORCE_LOGOUT") == false) {
					logger.info("FORCE_LOGOUT : " + param.containsKey("FORCE_LOGOUT"));
					HttpRequestParser.removeUserVo(request, userInfo);
				}
				
				if(HttpRequestParser.getUserVo(request) == null) logger.info("[LoginProcessor] userVo remove Success");
			}
			
			//session.removeAttribute("LOGOUT_REASON");
			//return result
			restResponse.setData(result.getData());
			restResponse.setResult(true);
		
		}catch (Exception e) {
			e.printStackTrace();
			restResponse.setResult(false);
			restResponse.setFailReason(e.getMessage());
		}
		
		return restResponse;
	}

}