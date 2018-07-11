package com.yescnc.core.sla.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Vector;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.sla.SlaDao;
import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.entity.db.SlaVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.lib.fm.util.AmConstant;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.fm.action.InsertEventHandler;

@Service
public class SlaAlarmManager {
	private Logger logger = LoggerFactory.getLogger(SlaAlarmManager.class);
	
	@Autowired
	InsertEventHandler insertEventHandler;
	
	@Autowired
	FmDao fmDao;
	
	@Autowired
	SlaDao slaDao;
	
	@Autowired
	UserDao userDao;
	
	public static final String SLA_ALARM_MSG_NAME = "rept_sla_status";
	
	/**
	 * check Alarm
	 * @param dn
	 * @param lloc
	 * @param alarmId
	 * @param alarmName
	 * @param currentValue
	 * @param prevAlarm
	 * @param currentAlarm
	 */
	public void checkAlarm(String dn, String lloc, int alarmId, String alarmName, String currentValue, int prevAlarm, int currentAlarm, HashMap<String, Object> additionalInfo) {
		logger.info("[SlaAlarmManager][checkAlarm] start");
		
		logger.info("[SlaAlarmManager][checkAlarm] dn:" + dn + ", lloc:" + lloc + ", alarmId" + alarmId + ", alarmName:"
				+ alarmName + ", currentValue:" + currentValue + ", prevAlarm:" + prevAlarm + ", currentAlarm:" + currentAlarm);
		
		if (prevAlarm <= AmConstant.CLEARED) {
			if (currentAlarm <= AmConstant.CLEARED) {
				logger.info("[SlaAlarmManager][checkAlarm] not alarm");
				return;
			}

			// occur new alarm
			logger.info("[SlaAlarmManager][checkAlarm] alarm occurred");
			slaAlarm(dn, lloc, alarmId, alarmName, currentValue, 1, currentAlarm, additionalInfo);
		} else {
			if (currentAlarm == prevAlarm) {
				logger.info("[SlaAlarmManager][checkAlarm] alarm status not changed");
				return;
			}

			// clear previous alarm
			logger.info("[SlaAlarmManager][checkAlarm] clear alarm");
			slaAlarm(dn, lloc, alarmId, alarmName, currentValue, 0, prevAlarm, additionalInfo);
			
			if (currentAlarm == AmConstant.CLEARED) {
				logger.info("[SlaAlarmManager][checkAlarm] not alarm");
				return;
			}

			// occur new alarm
			logger.info("[SlaAlarmManager][checkAlarm] alarm occurred");
			slaAlarm(dn, lloc, alarmId, alarmName, currentValue, 1, currentAlarm, additionalInfo);
		}
	}
	
	/**
	 * SLA Alarm process
	 * @param dn
	 * @param lloc
	 * @param alarmId
	 * @param alarmName
	 * @param currentValue
	 * @param alarmOn
	 * @param alarmStatus
	 */
	public void slaAlarm(String dn, String lloc, int alarmId, String alarmName, String currentValue, int alarmOn, int alarmStatus, HashMap<String, Object> additionalInfo) {
		logger.info("[SlaAlarmManager][slaAlarm] start");
		
		logger.info("[SlaAlarmManager][slaAlarm] dn:" + dn + ", lloc:" + lloc + ", alarmId:" + alarmId + ", alarmName:"
				+ alarmName + ", currentValue:" + currentValue + ", alarmOn:" + alarmOn + ", alarmStatus:" + alarmStatus);
		
		if (alarmStatus <= AmConstant.CLEARED) {
			logger.info("[SlaAlarmManager][slaAlarm] no action");
			return;
		}
		
		int severity = 0;
		int clearType = 1;
		if (alarmOn == 0) {
			severity = 10 + alarmStatus;
			clearType = FmConstant.FM_CLEAR_TYPE_AUTO;
		} else {
			severity = alarmStatus;
			clearType = FmConstant.FM_CLEAR_TYPE_NONE;
		}
		
		Integer level_1 = -1;
		Integer level_2 = -1;
		Integer level_3 = -1;
		
		if (dn != null && !dn.isEmpty()) {
			String[] ids = dn.split("\\.");

			if (ids.length >= 1) {
				try {
					level_1 = Integer.valueOf(ids[0]);
				} catch (Exception e) {
				}
			}

			if (ids.length >= 2) {
				try {
					level_2 = Integer.valueOf(ids[1]);
				} catch (Exception e) {
				}
			}

			if (ids.length >= 3) {
				try {
					level_3 = Integer.valueOf(ids[2]);
				} catch (Exception e) {
				}
			}
		}
		
		String probcause = "";
		if (alarmOn == 1) {
			probcause = "SLA Alarm ( " + alarmName + "=" + currentValue + " )";
		} else {
			probcause = "";
		}
		
		SimpleDateFormat dbTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String alarmTime = dbTimeFormat.format(Calendar.getInstance().getTime());
		
		String additionalText = "N/A";
		
		if (additionalInfo != null) {
			Object objTemp = null;
			additionalText = ((objTemp = additionalInfo.get("ADDITIONAL_TEXT")) == null) ? "N/A" : objTemp.toString();
		}
		
		FmEventVO fmEventVO = new FmEventVO();
		fmEventVO.setNeType("nms");
		fmEventVO.setNeVersion("v1");
		fmEventVO.setMsgName(SLA_ALARM_MSG_NAME);
		fmEventVO.setLvl1Id(level_1);
		fmEventVO.setLvl2Id(level_2);
		fmEventVO.setLvl3Id(level_3);
		fmEventVO.setLloc(lloc);
		fmEventVO.setLocationAlias(lloc);
		fmEventVO.setEventType(FmConstant.FM_TYPE_ALARM);
		fmEventVO.setAlarmTime(alarmTime);
		fmEventVO.setSeverity(severity);
		fmEventVO.setAlarmGroup(-1);
		fmEventVO.setAlarmId("" + alarmId);
		fmEventVO.setProbcauseStr(probcause);
		fmEventVO.setClearType(clearType);
		fmEventVO.setDisplayType(-1);
		fmEventVO.setAdditionalText(additionalText);
		
		HashMap<String, Object> requestMap = new HashMap<String, Object>();
		requestMap.put("NE.TYPE", "nms");
		requestMap.put("MSG.NAME", "insertEventHandler");
		requestMap.put("NE.VERSION", "v1");
		requestMap.put("MSG.TYPE", "HashMap");
		requestMap.put("EVENT.DATA", fmEventVO);
		
		JsonResult message = new JsonResult();
		message.setData(requestMap);
		
		try {
			logger.info("[SlaAlarmManager][slaAlarm] request alarm, fmEventVO => " + fmEventVO);
			insertEventHandler.handleMessage(message);
			
			if (alarmOn == 1) {
				Thread thread = new Thread(new Runnable() {
					@Override
					public void run() {
						sendAlarmMail(fmEventVO, additionalInfo);
					}
				});
				thread.start();
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("[SlaAlarmManager][slaAlarm] request alarm Exception => " + e);
		}
	}
	
	/**
	 * get Uncleared SLA Alarm
	 * @return
	 */
	public ArrayList<FmEventVO> getUnclearedSlaAlarm() {
		return fmDao.selectFmCurAlarmsByMsgName(SLA_ALARM_MSG_NAME);
	}
	
	/**
	 * audit SLA Alarm
	 */
	public void auditSlaAlarm() {
		logger.info("[SlaAlarmManager][auditSlaAlarm] start");

		ArrayList<FmEventVO> slaAlarmList = getUnclearedSlaAlarm();
		if (slaAlarmList == null || slaAlarmList.isEmpty()) {
			logger.info("[SlaManagerServiceImpl][auditSlaAlarm] slaAlarmList is null");
			return;
		}
		
		List<SlaVO> slaList = slaDao.selectEnableSlaParameterList();
		HashMap<String, Integer> slaIndexList = new HashMap<String, Integer>();
		if (slaList != null && !slaList.isEmpty()) {
			for (int i = 0; i < slaList.size(); i++) {
				SlaVO vo = slaList.get(i);
				if (vo == null) {
					continue;
				}

				slaIndexList.put(vo.getIdx() + "", i);
			}
		}
		
		for (FmEventVO dto : slaAlarmList) {
			if (!slaIndexList.isEmpty() && slaIndexList.containsKey(dto.getAlarmId())) {
				continue;
			}

			Integer alarmId = 0;
			try {
				alarmId = Integer.valueOf(dto.getAlarmId());
			} catch (Exception e) {
				continue;
			}
			
			logger.info("[SlaManagerServiceImpl][auditSlaAlarm] request clear SLA alarm => " + dto);
			slaAlarm(dto.getDn(), dto.getLloc(), alarmId, "", "", 0, dto.getSeverity(), null);
		}
	}
	
	/**
	 * send Alarm Mail
	 * @param fmEventVO
	 * @param additionalInfo
	 */
	public void sendAlarmMail(FmEventVO fmEventVO, HashMap<String, Object> additionalInfo) {
		String severityStr = "";
		switch(fmEventVO.getSeverity()) {
			case AmConstant.CRITICAL:
				severityStr = "critical";
				break;
			case AmConstant.MAJOR:
				severityStr = "major";
				break;
			case AmConstant.MINOR:
				severityStr = "minor";
				break;
			default:
				return;
		}
		
		try {
			List<UserVO> userList = userDao.selectUserMailList();
			if (userList == null || userList.isEmpty()) {
				return;
			}
			
			JavaMailSenderImpl sender = new JavaMailSenderImpl();

			sender.setHost("wsmtp.ecounterp.com");
			sender.setPort(587);
			sender.setUsername("webmaster@yescnc.co.kr");
			// sender.setUsername("webmaster");
			sender.setPassword("yes112233");

			Properties prop = new Properties();
			prop.setProperty("mail.smtp.auth", "true");
			// prop.setProperty("mail.smtp.starttls.enable", "true");
			prop.setProperty("mail.smtp.debug", "true");

			sender.setJavaMailProperties(prop);
			
			String alarmId = fmEventVO.getAlarmId();
			alarmId = (alarmId == null || alarmId.isEmpty()) ? "N/A" : alarmId;
			String alarmGroup = fmEventVO.getAlarmGroup() + "";
			alarmGroup = (alarmGroup == null || alarmGroup.isEmpty()) ? "N/A" : alarmGroup;
			String lloc = fmEventVO.getLloc();
			lloc = (lloc == null || lloc.isEmpty()) ? "N/A" : lloc;
			String probableCause = fmEventVO.getProbcauseStr();
			probableCause = (probableCause == null || probableCause.isEmpty()) ? "N/A" : probableCause;
			String alarmTime = fmEventVO.getAlarmTime();
			alarmTime = (alarmTime == null || alarmTime.isEmpty()) ? "N/A" : alarmTime;
			//String additionalText = fmEventVO.getAdditionalText();
			String thresholdInfo = "N/A";
			String category_name = "N/A";
			String type_name = "N/A";
			String param_name = "N/A";
			if (additionalInfo != null) {
				Object objTemp = null;
				thresholdInfo = ((objTemp = additionalInfo.get("THRESHOLD_INFO")) == null) ? "N/A" : objTemp.toString();
				category_name = ((objTemp = additionalInfo.get("CATEGORY_NAME")) == null) ? "N/A" : objTemp.toString();
				type_name = ((objTemp = additionalInfo.get("TYPE_NAME")) == null) ? "N/A" : objTemp.toString();
				param_name = ((objTemp = additionalInfo.get("PARAM_NAME")) == null) ? "N/A" : objTemp.toString();
			}
			
			MimeMessage message = sender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message);
			helper.setSubject("[ALARM][SLA] SLA " + severityStr.toUpperCase() + " Alarm ( " + category_name + "/"
					+ type_name + "/" + param_name + ", " + lloc + " )");
			helper.setFrom("webmaster@yescnc.co.kr");

			Vector<String> mailList = new Vector<String>();
			for (UserVO user : userList) {
				String email = user.getEmail();
				if (email == null || email.isEmpty()) {
					continue;
				}

				String alarmType = user.getAlarm_type();
				if (alarmType == null || alarmType.indexOf(severityStr) < 0) {
					continue;
				}
				
				if (!mailList.contains(email)) {
					mailList.add(email);
				}
			}
			
			if (mailList.isEmpty()) {
				return;
			} else if(mailList.size()==1) {
				helper.setTo(mailList.get(0));
			} else {
				for (String mail : mailList) {
					helper.addTo(mail);
				}
			}

			StringBuilder sb = new StringBuilder();
			sb.append("───────────────────────────────────────────────<br>");
			sb.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SLA alarm Information<br>");
			sb.append("───────────────────────────────────────────────<br>");
			sb.append("<ul>");
			
			String severityColor = "";
			if (severityStr.equals("critical")) {
				severityColor = "red";
			} else if (severityStr.equals("major")) {
				severityColor = "orange";
			} else if (severityStr.equals("minor")) {
				severityColor = "yellow";
			} else {
				severityColor = "black";
			}

			sb.append("<li>Grade: ").append("<font color='" + severityColor + "'>").append(severityStr).append("</font>").append("</li>");
			sb.append("<li>Code: ").append(alarmId).append("</li>");
			sb.append("<li>Group: ").append(alarmGroup).append("</li>");
			sb.append("<li>Location: ").append(lloc).append("</li>");
			sb.append("<li>ProbableCause: ").append(probableCause).append("</li>");
			sb.append("<li>Time: ").append(alarmTime).append("</li>");
			sb.append("<li>ThresholdInfo: ").append(thresholdInfo).append("</li>");
			sb.append("<li>CATEGORY_NAME: ").append(category_name).append("</li>");
			sb.append("<li>TYPE_NAME: ").append(type_name).append("</li>");
			sb.append("<li>PARAM_NAME: ").append(param_name).append("</li>");
			sb.append("</ul>");
			sb.append("───────────────────────────────────────────────<br>");
			
			logger.info(sb.toString());
			
			message.setText(sb.toString(), "utf-8", "html");
			sender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
	}
}
