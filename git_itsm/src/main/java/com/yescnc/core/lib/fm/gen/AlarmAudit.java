/*package com.yescnc.core.lib.fm.gen;

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.springframework.context.ApplicationContext;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.alarm.NmsAlarmInfo;
import com.yescnc.core.lib.fm.util.AmConstant;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;


public class AlarmAudit {
	private static final String DEBUG_PREFIX = "[AlarmAudit] ";

	// call RtrvCurAlarmByDn handler to get unclearedAlarm
	public static ArrayList<FmEventVO> getUnclearedAlarm(String alarm_msg_name) {

		String handler = "rtrvLocalCurAlarmByMsgName";
		LogUtil.info("[getUnclearedAlarm] " + "Handler = " + handler + ", from = " + alarm_msg_name + "  send ...");

		HashMap requestMap = new HashMap();
		requestMap.put(MsgKey.NE_TYPE, "nms");
		requestMap.put(MsgKey.MSG_NAME, handler);
		requestMap.put(MsgKey.NE_VERSION, "v1");
		requestMap.put(MsgKey.MSG_TYPE, "HashMap");
		requestMap.put("GM.MSG.NAME", alarm_msg_name);

		MyMessage myMessage = new MyMessage("app.fm", handler);

		ArrayList<FmEventVO> list = null;

		try {
			myMessage.setBody(requestMap);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);

			Map respMap = (Map) resMessage.getBody();

			if ("OK".equals(resMessage.getResult()) && requestMap != null) {
				list = (ArrayList<FmEventVO>) respMap.get(MsgKey.EVENT_DATA);
			}

		} catch (Exception e) {
			LogUtil.warning(e);
		}

		return list;

	}

	public static void insertAlarm(FmEventVO fmEventDto) {

		String handler = "insertEventHandler";
		LogUtil.info("[insertAlarm] " + "Handler = " + handler + "..send ...");

		HashMap requestMap = new HashMap();
		requestMap.put(MsgKey.NE_TYPE, "nms");
		requestMap.put(MsgKey.MSG_NAME, handler);
		requestMap.put(MsgKey.NE_VERSION, "v1");
		requestMap.put(MsgKey.MSG_TYPE, "HashMap");
		requestMap.put(MsgKey.EVENT_DATA, fmEventDto);

		MyMessage myMessage = new MyMessage("app.fm", handler);

		try {
			myMessage.setBody(requestMap);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);

		} catch (Exception e) {
			LogUtil.warning(e);
		}

		return;
	}

	public static FmEventVO createNewAlarm(int severity, String alarmId, String lloc, String status) {
		int[] nmsIntDn = NmsAlarmInfo.getNmsIntDn();

		String probableCause = status.contains(lloc) ? status : lloc + "(H/W) " + status;

		FmEventVO fmEventDto = createNewFmEventDto(nmsIntDn[0], nmsIntDn[1], nmsIntDn[2], "rept_hw_status", lloc,
				"N/A", severity, FmConstant.FM_TYPE_ALARM, AmConstant.DISPLAY_DBINSERT, AmConstant.ENVIRONMENTAL,
				alarmId, probableCause, FmConstant.FM_CLEAR_TYPE_NONE);

		return fmEventDto;
	}

	public static FmEventVO createNewFmEventDto(int lvl1Id, int lvl2Id, int lvl3Id, String msgName, String lloc,
			String locationAlias, int severity, int eventType, int displayType, int alarmGroup, String alarmId,
			String probcauseStr, int reserveInt, String reserveStr, int clearType) {
		FmEventVO fmEventDto = createNewFmEventDto(lvl1Id, lvl2Id, lvl3Id, msgName, lloc, locationAlias, severity,
				eventType, displayType, alarmGroup, alarmId, probcauseStr, clearType);

		fmEventDto.setReserveInt(reserveInt);
		fmEventDto.setReserveStr(reserveStr);

		return fmEventDto;
	}

	public static FmEventVO createNewFmEventDto(int lvl1Id, int lvl2Id, int lvl3Id, String msgName, String lloc,
			String locationAlias, int severity, int eventType, int displayType, int alarmGroup, String alarmId,
			String probcauseStr, String additionalText, int clearType) {
		FmEventVO fmEventDto = createNewFmEventDto(lvl1Id, lvl2Id, lvl3Id, msgName, lloc, locationAlias, severity,
				eventType, displayType, alarmGroup, alarmId, probcauseStr, clearType);

		fmEventDto.setAdditionalText(additionalText);

		return fmEventDto;
	}

	public static FmEventVO createNewFmEventDto(int lvl1Id, int lvl2Id, int lvl3Id, String msgName, String lloc,
			String locationAlias, int severity, int eventType, int displayType, int alarmGroup, String alarmId,
			String probcauseStr, int clearType) {
		FmEventVO fmEventDto = new FmEventVO();
		fmEventDto.setNeType("nms");
		fmEventDto.setNeVersion("v1");
		fmEventDto.setMsgName(msgName);
		EmsInfoList.getInstance();
		// fmEventDto.setLvl1Id(lvl1Id);
		fmEventDto.setLvl1Id(EmsInfoList.getMsIdMyself());
		fmEventDto.setLvl2Id(lvl2Id);
		fmEventDto.setLvl3Id(lvl3Id);
		fmEventDto.setLloc(lloc);
		fmEventDto.setLocationAlias(lloc); // requested by jiny lee
		fmEventDto.setEventType(eventType);
		fmEventDto.setAlarmTime(CTime.getCurrentDBTime());
		fmEventDto.setSeverity(severity);
		fmEventDto.setAlarmGroup(alarmGroup);
		fmEventDto.setAlarmId(alarmId);
		fmEventDto.setProbcauseStr(probcauseStr);
		fmEventDto.setClearType(clearType);
		fmEventDto.setDisplayType(displayType);

		return fmEventDto;
	}

	public static List<FmEventVO> getUnclearedAlarms(int severity) {
		ArrayList<FmEventVO> alarm = AlarmAudit.getUnclearedAlarm("rept_hw_status");

		List<FmEventVO> unclearedAlarms = new Vector<FmEventVO>();
		if (alarm.size() > 0) {
			int alarmSize = alarm.size();
			LogUtil.info("Uncleared Alarm Count : " + alarmSize);

			for (FmEventVO fmEventDto : alarm) {
				unclearedAlarms.add(createNewAlarm(severity, fmEventDto.getAlarmId(), fmEventDto.getLloc(),
						fmEventDto.getProbcauseStr()));
			}

			for (FmEventVO unclearedAlarm : unclearedAlarms) {
				LogUtil.info(DEBUG_PREFIX + "unclearedAlarm.alarm_id : " + unclearedAlarm.getAlarmId());
				LogUtil.info(DEBUG_PREFIX + "unclearedAlarm.lloc : " + unclearedAlarm.getLloc());
				LogUtil.info(DEBUG_PREFIX + "unclearedAlarm.probcause_str : " + unclearedAlarm.getProbcauseStr());
			}
		}

		LogUtil.info(DEBUG_PREFIX + "getUnclearedAlarms = " + unclearedAlarms);

		return unclearedAlarms;
	}

	public static String getAlarmId(String lloc) {
		int alarmId = NmsEventId.HW_SERVER_CPU;

		if (lloc.contains("CPU")) {
			alarmId = NmsEventId.HW_SERVER_CPU;
		} else if (lloc.contains("Fan")) {
			if (lloc.contains("RAID"))
				alarmId = NmsEventId.HW_RAID_FAN;
			else
				alarmId = NmsEventId.HW_SERVER_FAN;
		} else if (lloc.contains("Memory")) {
			alarmId = NmsEventId.HW_SERVER_MEMORY;
		} else if (lloc.contains("Power")) {
			if (lloc.contains("RAID"))
				alarmId = NmsEventId.HW_RAID_POWER;
			else
				alarmId = NmsEventId.HW_SERVER_POWER;
		} else if (lloc.contains("Temperature")) {
			alarmId = NmsEventId.HW_SERVER_TEMPERATURE;
		} else if (lloc.contains("Disk")) {
			if (lloc.contains("RAID"))
				alarmId = NmsEventId.HW_RAID_DISK;
			else
				alarmId = NmsEventId.HW_SERVER_DISK;
		} else if (lloc.contains("Etc")) {
			if (lloc.contains("RAID"))
				alarmId = NmsEventId.HW_RAID_ETC;
			else
				alarmId = NmsEventId.HW_SERVER_ETC;
		} else if (lloc.contains("Controller")) {
			alarmId = NmsEventId.HW_RAID_CONTROLLER;
		} else if (lloc.contains("Battery")) {
			alarmId = NmsEventId.HW_RAID_BATTERY;
		} else if (lloc.contains("Cache")) {
			alarmId = NmsEventId.HW_RAID_CACHE;
		} else if ((lloc.contains("CHASSIS"))) {
			if (lloc.contains("FAN")) {
				alarmId = NmsEventId.CHASSIS_HW_FAN;
			} else if (lloc.contains("POWER")) {
				alarmId = NmsEventId.CHASSIS_HW_POWER;
			} else if (lloc.contains("OA")) {
				alarmId = NmsEventId.CHASSIS_HW_OA;
			} else if (lloc.contains("ICB")) {
				alarmId = NmsEventId.CHASSIS_HW_ICB;
			}
		}

		return String.valueOf(alarmId);
	}

	public static void fireAlarm(FmEventVO fmEventDto, boolean isCleared) {
		
		 * if (isCleared) { fmEventDto.setSeverity(fmEventDto.getSeverity() +
		 * AmConstant.SVR_OFFSET); }
		 

		fmEventDto.setAlarmTime(CTime.getCurrentDBTime());

		try {
			insertAlarm(fmEventDto);
		} catch (Exception e) {
			LogUtil.warning(e);
		}
	}
}
*/