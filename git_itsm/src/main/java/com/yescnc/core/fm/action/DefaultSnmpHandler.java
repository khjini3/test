/*package com.yescnc.core.fm.action;

import java.util.Map;
import java.util.Vector;

import org.springframework.stereotype.Component;

import com.yescnc.framework.db.model.fm.FmEventDto;
import com.yescnc.framework.lib.fm.alarm.FmUtil;
import com.yescnc.framework.lib.fm.gen.FmEventGenerator;
import com.yescnc.framework.lib.fm.snmp.PDDFactory;
import com.yescnc.framework.lib.fm.snmp.PDDKey;
import com.yescnc.framework.lib.fm.snmp.SnmpUtil;
import com.yescnc.framework.lib.message.snmp.SnmpKey;
import com.yescnc.framework.lib.protocol.jms.DefaultMyHandler;
import com.yescnc.framework.lib.protocol.jms.MyMessage;
import com.yescnc.framework.util.common.FmConstant;
import com.yescnc.framework.util.common.FmFoo;
import com.yescnc.framework.util.date.DateUtil;
import com.yescnc.framework.util.log.LogUtil;
import com.yescnc.framework.util.message.MsgKey;
import com.yescnc.framework.util.message.manage.AmConstant;

@Component
public class DefaultSnmpHandler extends DefaultMyHandler {

	@Override
	public MyMessage handleMessage(MyMessage message) throws Exception {

		LogUtil.info("[InsertEventHandler] handleMessage() start !!!!! ");

		String desc = "";
		processEvent(message, desc);

		return message;

	}

	public void processEvent(MyMessage message, String strDesc) {

		Map<String, Object> body = message.getBody();
		FmEventDto fmEventDto = this.convertEventMapToFmDto(body, strDesc);
		FmEventGenerator.getInstance().generateEvent(fmEventDto);

	}

	public void processEvent(MyMessage message, String strEventId, String strEventTitle, String strDesc) {

		Map<String, Object> body = message.getBody();
		FmEventDto fmEventDto = this.convertEventMapToFmDto(body, strDesc);
		fmEventDto.setAlarmId(FmUtil.getEventCode(AmConstant.TYPE_EVENT, strEventId));
		fmEventDto.setProbcauseStr(this.parseProbCauseStr(body, strEventTitle, strDesc));
		FmEventGenerator.getInstance().generateEvent(fmEventDto);

	}

	protected FmEventDto convertEventMapToFmDto(Map<String, Object> message, String strDesc) {

		String strNeType = this.parseNeType(message);
		String strNeVer = this.parseNeVer(message);

		String[] arPddInfo = this.getEventInfoFromPdd(message, strNeType, strNeVer);
		String strEventId = arPddInfo[0];
		String strEventTitle = arPddInfo[1];
		String strNotiType = arPddInfo[2];

		int nEventType = FmConstant.FM_TYPE_EVENT;
		int nSeverity = FmConstant.FM_SEVERITY_EVENT;
		if ("FAULT".contentEquals(strNotiType)) {
			nEventType = FmConstant.FM_TYPE_FAULT;
			nSeverity = FmConstant.FM_SEVERITY_FAULT;
		}

		int[] arDns = (int[]) message.get(MsgKey.NE_DN);
		String strLLoc = "N/A";
		int nDisplayType = FmConstant.DISPLAY_DBINSERT;
		String strAlarmTime = this.parseEventTime(message);
		int nAlarmGroup = FmConstant.FM_ALARM_GROUP_ETC;
		int nProbcause = -1;
		String strProbcause = this.parseProbCauseStr(message, strEventTitle, strDesc);
		String strAdditionalText = this.parseAdditionalText(message);
		String strReseveredString = this.parseUserInfo(message);
		int nClearType = FmConstant.CLEAR_TYPE_DEFAULT;

		FmEventDto fmEventDto = new FmEventDto(-1, strNeType, strNeVer, arDns[0], arDns[1], arDns[2], -1, -1, -1, -1,
				-1, -1, -1, strLLoc, "N/A", nEventType, nDisplayType, strAlarmTime, nSeverity, nAlarmGroup, strEventId,
				nProbcause, strProbcause, strAdditionalText, nClearType, -1, strReseveredString, "N/A");

		if (FmFoo.IS_EXTENDED_FIELD_MODE)
			FmUtil.addExtendedFieldToEvent(fmEventDto, message);

		return fmEventDto;
	}

	protected FmEventDto convertEventMapToFmDto(Map<String, Object> message) {

		String strNeType = this.parseNeType(message);
		String strNeVer = this.parseNeVer(message);
		int[] arDns = this.parseLvl1ToLvl6Ids(message);
		String strLocationAlias = this.parseLocationAlias(message);
		String strLLoc = this.parselLoc(strLocationAlias);

		int nEventType = FmConstant.FM_TYPE_ALARM;
		int nDisplayType = FmConstant.DISPLAY_DBINSERT;
		String strAlarmTime = this.parseEventTime(message);
		int nSeverity = this.parseSeverity(message);
		int nAlarmGroup = this.parseAlarmGroup(message);
		String strAlarmId = this.parseAlarmId(message);
		int nProbcause = this.parseProbCauseInt(message);
		String strProbcause = FmFoo.IS_EXTENDED_FIELD_MODE ? this.parseProbCauseStrOnExtendedFieldMode(message)
				: this.parseProbCauseStr(message);
		String strAdditionalText = FmFoo.IS_EXTENDED_FIELD_MODE ? this.parseThresHoldInfo(message)
				: this.parseAdditionalText(message);
		int nClearType = FmConstant.CLEAR_TYPE_UNCLEAR;

		FmEventDto fmEventDto = new FmEventDto(-1, strNeType, strNeVer, arDns[0], arDns[1], arDns[2], arDns[3],
				arDns[4], arDns[5], -1, -1, -1, -1, strLLoc, strLocationAlias, nEventType, nDisplayType, strAlarmTime,
				nSeverity, nAlarmGroup, strAlarmId, nProbcause, strProbcause, strAdditionalText, nClearType, -1, "",
				"N/A");

		if (FmFoo.IS_EXTENDED_FIELD_MODE) {
			String strUnitType = this.parseUnitType(message);
			// FmUtil.addExtendedFieldToAlarm(fmEventDto, message,
			// strLocationAlias, strUnitType) ;
		}

		return fmEventDto;
	}

	protected String getStringFromBody(Map<String, Object> message, String strKey) {
		return this.getObjectFromBody(message, strKey).toString();
	}

	protected int getIntFromBody(Map<String, Object> message, String strKey) {
		return Integer.parseInt(this.getObjectFromBody(message, strKey).toString());
	}

	protected Long getLongFromBody(Map<String, Object> message, String strKey) {
		return Long.parseLong(this.getObjectFromBody(message, strKey).toString());
	}

	private Object getObjectFromBody(Map<String, Object> message, String strKey) {
		return (Object) message.get(strKey);
	}

	protected String getStringFromExtractBody(Map<String, Object> message, String strKey) {
		return this.getObjectFromExtractBody(message, strKey).toString();
	}

	protected int getIntFromExtractBody(Map<String, Object> message, String strKey) {
		return Integer.parseInt(this.getObjectFromExtractBody(message, strKey).toString());
	}

	protected Long getLongFromExtractBody(Map<String, Object> message, String strKey) {
		return Long.parseLong(this.getObjectFromExtractBody(message, strKey).toString());
	}

	private Object getObjectFromExtractBody(Map<String, Object> message, String strKey) {
		return (Object) message.get(strKey);
	}

	private boolean isExistInExtractBody(Map<String, Object> message, String strKey) {
		Map<String, Object> extractBody = (Map<String, Object>) message.get(MsgKey.BODY);
		return extractBody.containsKey(strKey);
	}

	protected String[] getEventInfoFromPdd(Map<String, Object> message, String neType, String strNeVer) {

		String[] arRtnValue = { FmConstant.DEFAULT_ID, FmConstant.DEFAULT_TITLE, "STATUS" };

		String msgName = (String) message.get(MsgKey.MSG_NAME);

		String strEventId = FmConstant.DEFAULT_ID;
		String strEventTitle = FmConstant.DEFAULT_TITLE;
		String strNotiType = "STATUS";

		if (message.get(MsgKey.NE_REL_VER) != null) {
			String neRelVersion = (String) message.get(MsgKey.NE_REL_VER);
			strNeVer = strNeVer + "_" + neRelVersion;
		}

		Map pdd = PDDFactory.getInstance().get(neType, strNeVer, msgName);

		if (pdd != null) {
			strEventId = (String) pdd.get(PDDKey.NOTI_ID);
			strEventTitle = (String) pdd.get(PDDKey.TITLE);
			strNotiType = (String) pdd.get(PDDKey.NOTI_TYPE);
		}

		if ("FAULT".contentEquals(strNotiType))
			strEventId = FmUtil.getEventCode(AmConstant.TYPE_FAULT, strEventId);
		else
			strEventId = FmUtil.getEventCode(AmConstant.TYPE_EVENT, strEventId);

		arRtnValue[0] = strEventId;
		arRtnValue[1] = strEventTitle;
		arRtnValue[2] = strNotiType = "STATUS";

		return arRtnValue;
	}

	protected String parseProbCauseStr(Map<String, Object> message, String strEventTitle, String strDesc) {

		String strDetailCause = "";
		if (this.isExistInExtractBody(message, "sirpaDetailCause")) {
			strDetailCause = this.getStringFromExtractBody(message, "sirpaDetailCause");
			if (strDetailCause.length() > 0 && strDesc.length() > 0) {
				strDesc = strDetailCause + ", " + strDesc;
			} else if (strDetailCause.length() > 0 && strDesc.length() == 0) {
				strDesc = strDetailCause;
			}
		}

		if (strDesc.length() > 0)
			return strEventTitle + " (" + strDesc;
		else
			return strEventTitle;
	}

	protected String parseNeType(Map<String, Object> body) {
		return body.get(MsgKey.NE_TYPE).toString();
	}

	protected String parseNeVer(Map<String, Object> body) {
		return body.get(MsgKey.NE_VERSION).toString();
	}

	protected int[] parseLvl1ToLvl6Ids(Map<String, Object> body) {

		int[] arDns = { -1, -1, -1, -1, -1, -1 };
		int[] dn = (int[]) body.get(MsgKey.NE_DN);

		String location = this.getStringFromExtractBody(body, "sirpaAddionalText");
		String[] loc = location.split("-");

		arDns[0] = dn[0];
		arDns[1] = dn[1];
		arDns[2] = dn[2];

		// physical location 추출 필요 함
		// rack, shelf, slot 정보 추가 필요함
		// arDns[3] = phyDn[0] ;
		// arDns[4] = dphyDnn[1] ;
		// arDns[5] = phyDn[2] ;

		return arDns;
	}

	protected String parseLocationAlias(Map<String, Object> message) {
		return this.getStringFromExtractBody(message, "sirpaAddionalText");
	}

	protected String parselLoc(String strLocationAlias) {

		String strLLoc = "N/A";
		String[] arLLoc = strLocationAlias.split("-");

		if (arLLoc.length > 1
				&& (arLLoc[0].contains("RACK") || arLLoc[0].contains("SHELF") || arLLoc[0].contains("SLOT"))) {
			strLLoc = arLLoc[1];
		} else {
			if (!strLocationAlias.equals("-") && !strLocationAlias.equals(""))
				strLLoc = strLocationAlias;
		}
		return strLLoc;
	}

	protected String parseEventTime(Map<String, Object> message) {
		if (this.isExistInExtractBody(message, "sirpaEventTime"))
			return this.getStringFromExtractBody(message, "sirpaEventTime");
		else
			return DateUtil.getCurrentDateString();
	}

	protected int parseSeverity(Map<String, Object> message) {
		String strSeverity = this.getStringFromExtractBody(message, "sirpaPerceivedSeverity");

		if (strSeverity.equals("indeterminate"))
			return FmConstant.FM_SEVERITY_INDETERMINATE;
		else if (strSeverity.equals("warning"))
			return FmConstant.FM_SEVERITY_WARNING;
		else if (strSeverity.equals("minor"))
			return FmConstant.FM_SEVERITY_MINOR;
		else if (strSeverity.equals("major"))
			return FmConstant.FM_SEVERITY_MAJOR;
		else if (strSeverity.equals("critical"))
			return FmConstant.FM_SEVERITY_CRITICAL;
		else
			return FmConstant.FM_SEVERITY_INDETERMINATE;
	}

	protected int parseAlarmGroup(Map<String, Object> message) {
		int nAlarmGroup = this.getIntFromBody(message, "sirpaEventType");

		switch (nAlarmGroup) {

		case FmConstant.FM_ALARM_GROUP_COMMUNICATION:
			return FmConstant.FM_ALARM_GROUP_COMMUNICATION;
		case FmConstant.FM_ALARM_GROUP_ENVIRONMENT:
			return FmConstant.FM_ALARM_GROUP_ENVIRONMENT;
		case FmConstant.FM_ALARM_GROUP_EQUIPMENT:
			return FmConstant.FM_ALARM_GROUP_EQUIPMENT;
		case FmConstant.FM_ALARM_GROUP_ETC:
			return FmConstant.FM_ALARM_GROUP_ETC;
		case FmConstant.FM_ALARM_GROUP_PROCESSING:
			return FmConstant.FM_ALARM_GROUP_PROCESSING;
		case FmConstant.FM_ALARM_GROUP_QOS:
			return FmConstant.FM_ALARM_GROUP_QOS;
		default:
			return FmConstant.FM_ALARM_GROUP_ETC;
		}

	}

	protected String parseAlarmId(Map<String, Object> message) {

		Map<String, Object> body = (Map<String, Object>) message.get(MsgKey.BODY);
		Vector<String> columnNames = (Vector<String>) body.get(SnmpKey.COLUMN_NAME);

		return columnNames.contains("sirpaAlarmCode")
				? FmUtil.getAlarmCode(this.getStringFromBody(message, "sirpaAlarmCode"))
				: FmUtil.getEventCode(AmConstant.TYPE_ALARM, this.getStringFromBody(message, "sirpaSpecificProblem"));

	}

	protected int parseProbCauseInt(Map<String, Object> message) {

		return this.getIntFromBody(message, "sirpaProbableCause");
	}

	protected String parseProbCauseStr(Map<String, Object> message) {

		String strProbcause = SnmpUtil.getProbableCause(this.getStringFromExtractBody(message, "sirpaSpecificProblem"));

		String unitType = "";
		if (this.isExistInExtractBody(message, "sirpaObjectClass")) {
			if (this.getObjectFromExtractBody(message, "sirpaObjectClass") instanceof String) {
				unitType = this.getObjectFromExtractBody(message, "sirpaObjectClass").toString();
			} else {
				Vector<String> vecObjectClass = (Vector<String>) this.getObjectFromExtractBody(message,
						"sirpaObjectClass");
				unitType = vecObjectClass.get(0).toString();
			}
		}

		int unitTypeInt = -1;
		try {
			unitTypeInt = Integer.parseInt(unitType);
		} catch (Exception e) {
			unitTypeInt = -1;
		}

		if (unitTypeInt == -1 && !"SYS".contentEquals(unitType))
			return unitType + " " + strProbcause;
		else
			return strProbcause;
	}

	protected String parseProbCauseStrOnExtendedFieldMode(Map<String, Object> message) {
		return SnmpUtil.getProbableCause(this.getStringFromExtractBody(message, "sirpaSpecificProblem"));
	}

	protected String parseAdditionalText(Map<String, Object> message) {

		String strAdditionalText = (String) message.get(MsgKey.OUTPUT_MSG);
		if (strAdditionalText.length() > FmConstant.ADDITIONAL_TEXT_MAX)
			strAdditionalText = strAdditionalText.substring(0, FmConstant.ADDITIONAL_TEXT_MAX);

		return strAdditionalText;
	}

	protected String parseOperInfo(Map<String, Object> message) {

		if (this.isExistInExtractBody(message, "sirpaOperatorInfo"))
			return this.getStringFromExtractBody(message, "sirpaOperatorInfo");
		else
			return "N/A";
	}

	protected String parseUserInfo(Map<String, Object> message) {

		if (this.isExistInExtractBody(message, "sirpaUserInfo"))
			return this.getStringFromExtractBody(message, "sirpaUseInfo");
		else
			return "N/A";
	}

	protected Long parseSeqId(Map<String, Object> message) {
		return this.getLongFromBody(message, "sirpaSequenceId");
	}

	protected String parseUnitType(Map<String, Object> message) {
		String unit_type = ((String) message.get("UNIT_TYPE")).toLowerCase();
		return unit_type.contentEquals("ump") ? "ecp" : unit_type;
	}

	protected String parseThresHoldInfo(Map<String, Object> message) {
		return this.getStringFromExtractBody(message, "sirpaThresholdInfo");
	}

}
*/