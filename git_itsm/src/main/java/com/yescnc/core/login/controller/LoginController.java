package com.yescnc.core.login.controller;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.constant.SecurityKey;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.login.service.LoginProcessor;
import com.yescnc.core.login.service.LogoutProcessor;
import com.yescnc.core.util.http.HttpRequestParser;
import com.yescnc.core.util.ip.IpAddressChecker;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.util.security.SecurityUtil;

@RestController
@RequestMapping("/login")
public class LoginController {
	
	static Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private LoginProcessor loginProcessor;

	@Autowired
	private LogoutProcessor logoutProcessor;

	public static String LOGIN_CREATE_ROOT = "login.create.root";
	public static String LETTER_MESSAGE_NOTSUBSCRIBED = "letter.message.notsubscribed";

	public LoginController() {

	}
	
	@RequestMapping(value = "/getSession", method = RequestMethod.GET)
	public @ResponseBody UserVO getSession(HttpServletRequest request, @RequestParam Map<String, String> param) {
		logger.info("Orange getSession Start ");
		logger.info("Orange33 getSession request: " + param.toString());
		
		UserVO uv = HttpRequestParser.getUserVo(request);
		
		if(uv != null)
			logger.info("Orange getSession uv: " + uv);
		else
			logger.info("Orange getSession uv is null ");
		
		return uv;
	}
	
	@RequestMapping(method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public String loginFailPage() {
		return "/sm/login/loginfail";
	}
	
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public JsonResult login(HttpServletRequest req, @RequestBody Map<String, String> param) {

		//return loginProcessor.loginProc(req, param);
		return createSession(req, param);
	}

	private synchronized JsonResult createSession(HttpServletRequest request, Map<String, String> param) {
		JsonResult restResponse = new JsonResult();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		//UserVO userVO = null;		
		HttpSession session = request.getSession();
		String lmt = (request.getParameter("lmt") == null) ? "Platform" : request.getParameter("lmt").toString();
		String ip = request.getRemoteAddr();
		String userId = param.get(SecurityKey.USER_ID).toString();
		String userPw = param.get(SecurityKey.PASSWORD).toString();
		String language = (param.get("language") == null) ? "en" : param.get("language").toString();
		String isWrite = (param.get("IS.WRITE") == null) ? "true" : param.get("IS.WRITE").toString();
		String errMsg = "";

		SecurityUtil securitypassword = new SecurityUtil();
		try {
			userPw = securitypassword.encrypSHA256(userPw);
		} catch (NoSuchAlgorithmException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		logger.info("[createSession][" + userId + ", " + ip + "] {}, {}", new Object[] { language, userPw});

//		session.setMaxInactiveInterval(86400);
		logger.info("Session created for id-> " + session.getId()+", timeout->"+session.getMaxInactiveInterval());
		String urlIp = getUrlIp(request);
		String ipAddress = request.getRemoteAddr();

		if ((language == null) || (language.equals(""))) {
			language = (session.getAttribute("LOCALE") == null) ? request.getLocale().toString()
					: session.getAttribute("LOCALE").toString();
		}

		Locale locale = new Locale(language);
		logger.info("[createSession][" + userId + ", " + ip + "] loginController");
		
		JsonResult loginResult = loginProcessor.loginProc(session, userId, /*SmEncrypt.encrypt(userPw),*/userPw, ipAddress, urlIp, lmt, locale, isWrite);


		if (loginResult != null && loginResult.getResult()) {
			
			Boolean userVoResult = loginResult.getResult();
			
			logger.info("[createSession][" + userId + ", " + ip + "] result : " + userVoResult);
			//session.setAttribute("fullScreen", fullScreen);
			session.setAttribute("LOCALE", locale);
			session.setAttribute("lmt", lmt);
			session.removeAttribute("USER.ID");
			session.removeAttribute("USER.PASSWORD");
			session.removeAttribute("SESSION.ID");
			
			UserVO user  = UserVO.class.cast(loginResult.getData("USER"));
			
			resultMap.put("LOCALE", locale);
			resultMap.put("RESULT", user.getResult());
			resultMap.put("SESSION_ID", user.getSessionId());
			resultMap.put("LOGIN_ID", userId);
			resultMap.put("USER_IDX", user.getId());
			resultMap.put("SRC_IP", user.getIpAddress());
			resultMap.put("PRIVILEGE_ID", user.getPrivilegeId());
			resultMap.put("GROUP_ID", user.getGroup_id()); // yypark
			resultMap.put("EMAIL", user.getEmail()); //jini 
			 
			int warning = Integer.valueOf(loginProcessor.getPasswordAlertDays()).intValue();
			if (warning >= 0) {
				 session.setAttribute("PASSWORD.WARNING.DAYS", Integer.valueOf(warning));
			}
			
			try {
				 logger.info("[createSession][" + userId + ", " + ip + "] setUserVo in session");
				 HttpRequestParser.setUserVo(request, user);
			} catch (Exception e) {
				e.printStackTrace();
				restResponse.setFailReason(e.getMessage());
				restResponse.setResult(false);
					
				return restResponse;
			 }
			
			logger.info("[createSession][" + userId + ", " + ip + "] Login Result : " + restResponse.getResult());
			 
//		} else if (userId.equals("root")) {
//			resultMap.put("LOGIN.ID", "root");
		} else {
			session.setAttribute("LOCALE", locale);
			session.setAttribute("lmt", lmt);
			session.removeAttribute("USER.ID");
			session.removeAttribute("USER.PASSWORD");
			session.removeAttribute("SESSION.ID");
			
			UserVO user  = UserVO.class.cast(loginResult.getData("USER"));
			
			resultMap.put("LOCALE", locale);
			resultMap.put("RESULT", user.getResult());
			resultMap.put("SESSION_ID", user.getSessionId());
			if(userId.equals("root")){
				resultMap.put("LOGIN.ID", "root");
			} else {
				resultMap.put("LOGIN_ID", userId);
			}
			resultMap.put("USER_IDX", user.getId());
			resultMap.put("SRC_IP", user.getIpAddress());
			resultMap.put("PRIVILEGE_ID", user.getPrivilegeId());
			resultMap.put("GROUP_ID", user.getGroup_id()); // yypark
			
			errMsg = user.getResult();
			
			if(errMsg.equals("letter.message.notexists.root") || errMsg.equals("letter.message.password.empty") || 
			   errMsg.equals("letter.message.same.session.logged") || errMsg.equals("letter.message.password") ||
			   errMsg.equals("letter.message.notexists.loginid") || errMsg.equals("letter.message.notexists.loginip") || 
			   errMsg.equals("letter.message.denyed.userid") || errMsg.equals("letter.message.denyed.ipaddr") || errMsg.equals("letter.message.firstLogin.changePassword")) {
				logger.info("[createSession][" + userId + ", " + ip + "] Login Result : " + restResponse.getResult());
				loginResult.setResult(true);
			}
		}
			
		restResponse.setResult(loginResult.getResult());
		restResponse.setData(resultMap);
		
		return restResponse;
	}

	private String getUrlIp(HttpServletRequest request) {
		StringBuffer reqUrl = request.getRequestURL();
		String urlIp = null;
		if (reqUrl != null) {
			urlIp = reqUrl.toString().replaceAll("http[s]{0,1}://", "");
			int end = urlIp.indexOf("/");
			String ip = urlIp.substring(0, end);
			if(ip.indexOf("]") > 0) {
				return ip.substring(1, ip.indexOf("]"));
			} else {
				if(IpAddressChecker.isValidIpv6(ip)) {
					return ip;
				} else {
					int endPos = urlIp.indexOf(":");
					if (endPos == -1) {
						endPos = urlIp.indexOf("/");
					}
					urlIp = (endPos != -1) ? urlIp.substring(0, endPos) : urlIp;
				}
			}
		}
		return null;
	}

	@RequestMapping(value = { "/checkPassword" }, method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public JsonResult checkPassword(HttpServletRequest req, @RequestBody Map<String, String> param) {
		//Used on Dialog password confirm
		return null;
	}
	
	@RequestMapping(value = { "/logout" }, method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public JsonResult logout(HttpServletRequest req, @RequestBody Map<String, String> param) {

		return logoutProcessor.logout(req, param);
	}
	
/*	
	@RequestMapping(value = { "/forward" }, method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public ModelAndView getForwardJsp(HttpServletRequest request, HttpServletResponse response) {

		ModelAndView mv = new ModelAndView();
		Map map = createSession(request);

		String result = (String) map.get("RESULT");
		if (result.equals("OK")) {
			if (request.getParameter("language") != null)
				response.addCookie(new Cookie("locale", request.getParameter("language")));
			else {
				response.addCookie(new Cookie("locale", "en"));
			}

			mv.setViewName("redirect:/main.do?srcId=" + map.get("LOGIN.ID"));
		} else if (result.equals("passwordExpired")) {
			mv.setViewName("redirect:/passwordexpired.do");
		} else if ((result.equals("RMI Fail")) || (result.equals("letter.message.rmifail"))) {
			mv.setViewName("redirect:/rmifail.do");
		} else {
			mv.setViewName("redirect:/loginfail.do");
		}
		mv.addAllObjects(map);
		return mv;
	}


	@RequestMapping({ "/login" })
	public ModelAndView login(HttpServletRequest request) throws Exception {
		String id = request.getParameter("USER.ID");
		String ip = request.getRemoteAddr();

		logger.info("[login][" + id + ", " + ip + "]");
		ModelAndView mv = new ModelAndView();
		logger.info("[login][" + id + ", " + ip + "] createSession");
		Map map = createSession(request);
		mv.addAllObjects(map);
		mv.setView(this.jsonView);
		return mv;
	}
	
	private Map<String, Object> createSession(HttpServletRequest request) {
		UserVO userVO = null;
		HashMap map = new HashMap();

		HttpSession session = request.getSession();
		String lmt = request.getParameter("lmt");
		if (lmt == null) {
			lmt = "EMS";
		}

		String ip = request.getRemoteAddr();

		String userId = request.getParameter("USER.ID");
		String userPw = request.getParameter("USER.PASSWORD");
		String language = request.getParameter("language");
		String fullScreen = request.getParameter("fullScreen");
		String applicationType = request.getParameter("applicationType");
		String isWrite = request.getParameter("IS.WRITE");

		if (applicationType == null) {
			applicationType = "2";
		}
		String macAddress = request.getParameter("macAddress");
		String hash = request.getParameter("hash");
		String path = session.getServletContext().getRealPath("/");

		logger.info("[createSession][" + userId + ", " + ip + "] {}, {}, {}", new Object[] { language, userPw, path });

		StringBuffer requestUrl = request.getRequestURL();
		String urlIp = null;
		if (requestUrl != null) {
			urlIp = requestUrl.toString().replaceAll("http[s]{0,1}://", "");
			int endPos = urlIp.indexOf(":");
			if (endPos == -1) {
				endPos = urlIp.indexOf("/");
			}
			urlIp = (endPos != -1) ? urlIp.substring(0, endPos) : urlIp;
		}

		String ipAddress = request.getRemoteAddr();

		fullScreen = (session.getAttribute("fullScreen") == null) ? fullScreen
				: session.getAttribute("fullScreen").toString();

		if ((language == null) || (language.equals(""))) {
			language = (session.getAttribute("LOCALE") == null) ? request.getLocale().toString()
					: session.getAttribute("LOCALE").toString();
		}

		boolean isMobile = "1".equals(applicationType);
		Locale locale = new Locale(language);

		logger.info("[createSession][" + userId + ", " + ip + "] loginProcessor.loginProc");
		userVO = this.loginProcessor.loginProc(session, userId, SmEncrypt.encrypt(userPw), ipAddress, urlIp, lmt, path,
				applicationType, macAddress, hash, locale, isWrite);

		logger.info("[createSession][" + userId + ", " + ip + "] UserVO(" + userVO + ")");
		if (userVO != null) {
			String userVoResult = userVO.getResult();
			logger.info("[createSession][" + userId + ", " + ip + "] result : " + userVoResult);

			session.setAttribute("fullScreen", fullScreen);
			session.setAttribute("LOCALE", locale);
			session.setAttribute("lmt", lmt);
			session.removeAttribute("USER.ID");
			session.removeAttribute("USER.PASSWORD");
			session.removeAttribute("SESSION.ID");

			map.put("RESULT", userVO.getResult());
			map.put("SESSION.ID", userVO.getHashtable());
			map.put("LOGIN.ID", userId);
			if ("OK".equals(userVoResult)) {
				userVO.setMcUrl(this.commonUtil.getMcServerAddress());
				int warning = Integer.valueOf(this.loginProcessor.getPasswordAlertDays()).intValue();
				if (warning >= 0)
					session.setAttribute("PASSWORD.WARNING.DAYS", Integer.valueOf(warning));
				try {
					logger.info("[createSession][" + userId + ", " + ip + "] setUserVo in session");
					HttpRequestParser.setUserVo(request, userVO);
				} catch (Exception e) {
					e.printStackTrace();
					map.put("RESULT", e.getMessage());
					return map;
				}
			} else if ((userId.equals("root")) && (userVO.getResult().equals(LETTER_MESSAGE_NOTSUBSCRIBED))) {
				map.put("RESULT", LOGIN_CREATE_ROOT);
			}

		}

		logger.info("[createSession][" + userId + ", " + ip + "] Login Result : " + map.get("RESULT"));

		return map;
	}

	@RequestMapping({ "/checkPassword" })
	public ModelAndView checkPassword(HttpServletRequest request) {
		ModelAndView mv = new ModelAndView();
		HttpSession session = request.getSession();

		UserVO userInfo = HttpRequestParser.getUserVo(request);

		String password = request.getParameter("USER.PASSWORD");

		Map rmiRequest = new HashMap();
		Map body = new HashMap();
		body.put("USER.ID", userInfo.getUserID());
		body.put("USER.PASSWORD", password);
		body.put("IS.PASSWORD.PLAIN.TEXT", Boolean.valueOf(true));

		rmiRequest.put("BODY", body);
		String path = request.getServletContext().getRealPath("/");
		try {
			rmiRequest.put("NE.TYPE", "nms");
			rmiRequest.put("NE.VERSION", "v1");
			rmiRequest.put("MSG.NAME", "check_password");

			String url = RmiHelper.findURL(path + "/base/data/xml/", "us");
			AbstractList rmiResponse = RmiHelper.send(url, rmiRequest);
			mv.addAllObjects((Map) rmiResponse.get(0));
			mv.setView(this.jsonView);
			return mv;
		} catch (Exception e) {
			mv.setView(this.jsonView);
		}
	
		return mv;
	}


	@RequestMapping({ "/logout" })
	public ModelAndView logout(HttpServletRequest request) {
		ModelAndView mv = new ModelAndView();
		mv.setView(this.jsonView);
		HttpSession session = request.getSession();
		String id = request.getParameter("USER.ID");
		String ip = request.getParameter("IP.ADDRESS");
		logger.info("[logout][" + id + ", " + ip + "]");
		if (this.logoutProcessor.logout(request)) {
			logger.info("[logout][" + id + ", " + ip + "] Success in logout");
			UserVO userVo = HttpRequestParser.getUserVo(request);
			logger.info("[logout][" + id + ", " + ip + "] remove UserVO(" + userVo + ")");
			HttpRequestParser.removeUserVo(request, userVo);

			mv.addObject("RESULT", "OK");
			mv.addObject("mc_url", this.commonUtil.getMcServerAddress());
			return mv;
		}
		logger.info("[logout][" + id + ", " + ip + "] Fail to logout");
		mv.addObject("RESULT", "NOK");

		return mv;
	}

	@RequestMapping(value = { "/alive" }, method = { org.springframework.web.bind.annotation.RequestMethod.GET })
	@ResponseBody
	public Map keepAlive(HttpServletRequest request) {
		Map resMap = new HashMap();

		resMap.put("RESULT", "OK");
		return resMap;
	}
*/
}