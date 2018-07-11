package com.yescnc.core.configuration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.core.db.operationhistory.OperationHistoryDao;
import com.yescnc.core.entity.db.OperationHistoryVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.date.DateUtil;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

	@Autowired
	AuthInterceptor authInterceptor;

	@Autowired
	OperationHistoryDao operationHistoryDao;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// TODO Auto-generated method stub
		registry.addInterceptor(authInterceptor).addPathPatterns("/**").excludePathPatterns("/", "/login", "/settings/sla/slaNotification", "/settings/user", "/settings/user/update");
	}

}

@Component
class AuthInterceptor implements HandlerInterceptor {

	private static final Logger logger = LoggerFactory.getLogger(AuthInterceptor.class);

	@Value("${operation_log_inhibit}")
	String OperationLogInhibitPattern;
	
	@Autowired
	OperationHistoryDao operationHistoryDao;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		// 세션체크
		HttpSession session = request.getSession(false);
		if (null == session) {
			logger.info("session is empty");
			response.sendRedirect("/");
			return false;
		}
		// String sessionId = request.getRequestedSessionId();
		// String loginId = (String) session.getAttribute("LOGINID");
		// String ipAddr = request.getRemoteAddr();
		// String key = sessionId + "_" + loginId + "_" + ipAddr;

		Object account = session.getAttribute("userVO");
		// 로그인 체크 & 레벨 체크
		if (account == null) {
			response.setStatus(302);
			return false;
		}

		request.setAttribute("requestTime", DateUtil.getCurrentTime());
		HandlerMethod handlerMethod = (HandlerMethod) handler;
		OperationLogging operationAnnotation = handlerMethod.getMethodAnnotation(OperationLogging.class);
		if(null != operationAnnotation && operationAnnotation.enabled() == true){
			request.setAttribute("requestTime", DateUtil.getCurrentTime());
			request.setAttribute("loggingOperation", true);
			request.setAttribute("operationCategory", operationAnnotation.category());
			request.setAttribute("loggingUrl", request.getRequestURI());
		}
		return true;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception exception) throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mv)
			throws Exception {
		// TODO Auto-generated method stub
		try{
			HttpSession session = request.getSession(false);
			Object userObject = session.getAttribute("userVO");
			
			Object loggingFlag = request.getAttribute("loggingOperation");
			Object loggingUrl   = request.getAttribute("loggingUrl");
			Object requestTime   = request.getAttribute("requestTime");
			Object categoryObject   = request.getAttribute("operationCategory");
			
			Boolean logFlag = null != loggingFlag ? (Boolean)loggingFlag : false;
			String logUrl = null != loggingUrl ? (String)loggingUrl : null;
			String rTime = null != requestTime ? (String)requestTime : "";
			String category = null != categoryObject ? (String)categoryObject : CategoryKey.CATEGORY_GENERAL;
			
			if(null != userObject && null != logUrl && logFlag == true){

				UserVO user = UserVO.class.cast(userObject);
				OperationHistoryVO history = new OperationHistoryVO();
				
				history.setLoginId(user.getUserId());
				history.setIpAddress(user.getIpAddress());
				history.setActionType(request.getMethod());
				history.setCategory(category);
				history.setCommand(logUrl);
				history.setRequestTime(rTime);
				history.setResponseTime(DateUtil.getCurrentTime());
				history.setResult(response.getStatus() == 200 ? 1 : 2);
				operationHistoryDao.insertOperationHistory(history);
				//history.setFailReason(failReason);
				logger.info("OperationHistoryVO={}",history);
			}
			
		}catch(Exception e){
			logger.error(request.getRequestURL().toString() +"is Logging Exception");
		}
		
			/*
			OperationHistoryVO history = new OperationHistoryVO();

			history.setLoginId(user.getUserId());
			history.setIpAddress(user.getIpAddress());
			history.setActionType(request.getMethod());
			history.setCommand(request.getRequestURL().toString());
			history.setRequestTime(request.getAttribute("requestTime").toString());
			history.setResponseTime(DateUtil.getCurrentTime());
			history.setResult(response.getStatus() == 200 ? "1" : "2");
			*/
			// history.setFailReason(failReason);
			//logger.info("afterCompletion=" + request.getRequestURI());
			//logger.info("afterCompletion=" + history);
	
	}
}
