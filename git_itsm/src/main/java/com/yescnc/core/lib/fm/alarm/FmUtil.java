package com.yescnc.core.lib.fm.alarm;

import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.AbstractList;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.Vector;

import org.json.JSONObject;
import org.springframework.context.ApplicationContext;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.entity.db.FmSeqNoPageDto;
import com.yescnc.core.lib.fm.util.AmConstant;
import com.yescnc.core.lib.fm.util.ComparaotFactory;
import com.yescnc.core.lib.fm.util.FmSeqNoPageDtoAscComparator;
import com.yescnc.core.lib.fm.util.FmSeqNoPageDtoDescComparator;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.ConfigUtil;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.json.JsonResult;


public class FmUtil {

	public static String getEventCode(int eventType, String id) {
		DecimalFormat df = new DecimalFormat("0000");
		String eventId = df.format(Integer.parseInt(id));
		String prefix = "";
		String postfix = FmFoo.IS_EXTENDED_FIELD_MODE ? "" : "R";

		switch (eventType) {
		case AmConstant.TYPE_ALARM:
			prefix = "A";
			break;
		case AmConstant.TYPE_FAULT:
			prefix = "F";
			break;
		case AmConstant.TYPE_EVENT:
			prefix = "S";
			break;
		default:
			break;
		}

		return prefix + eventId + postfix;
	}

	public static String getAlarmCode(String id) {
		DecimalFormat df = new DecimalFormat("0000");
		String eventId = df.format(Integer.parseInt(id));
		String prefix = "A";
		String postfix = FmFoo.IS_EXTENDED_FIELD_MODE ? "" : "R";
		return prefix + eventId + postfix;
	}

	public static Date parseStringToDate(String strAlarmTime) {
		try {
			SimpleDateFormat SDF_FM_FORMATTER = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			return SDF_FM_FORMATTER.parse(strAlarmTime);
		} catch (ParseException e) {
			LogUtil.warning(e);
			// e.printStackTrace();
		}
		return null;
	}

	public static int getNeIdIntValue(String strNeId) {
		int neId = -1;
		try {
			neId = Integer.parseInt(strNeId);
		} catch (Exception e) {
			neId = -1;
		}
		return neId;
	}

	public static String getCurTimeOfEventTimeFmt() {
		SimpleDateFormat SDF_FM_FORMATTER = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return SDF_FM_FORMATTER.format(Calendar.getInstance().getTime());
	}

	public static void addExtendedFieldToEvent(FmEventVO fmEventDto, Map<String, Object> message) {

		if (message.get("SERVICE_STATE") != null)
			fmEventDto.setServiceStatus(Integer.valueOf(message.get("SERVICE_STATE").toString()));

		if (message.get("NE_TYPE") != null)
			fmEventDto.setSysType(message.get("NE_TYPE").toString());

		if (message.get("SYSTEM_ID") != null)
			fmEventDto.setNeId(message.get("SYSTEM_ID").toString());

		fmEventDto.setAlarmIdPosition("");
	}

	public static HashMap<Integer, Long> convertJsonStringToSeqMap(String strJson)
			throws JsonParseException, JsonMappingException, IOException {

		JsonFactory factory = new JsonFactory();
		ObjectMapper mapper = new ObjectMapper(factory);
		TypeReference<HashMap<Integer, Long>> typeRef = new TypeReference<HashMap<Integer, Long>>() {};
		return mapper.readValue(strJson, typeRef);

	}

	public static String convertSeqMapToJsonString(Map<Integer, Long> hmSeqByMsId) {

		return (new JSONObject(hmSeqByMsId)).toString();

	}

	public static ArrayList<Object> parsefmEventDtoToArrayList(FmEventVO fmEventDto) {

		ArrayList<Object> alFmDtoArrayList = new ArrayList<>(50);
		alFmDtoArrayList.add("Fm_v2");
		alFmDtoArrayList.add(fmEventDto.getSeqNo());
		alFmDtoArrayList.add(fmEventDto.getNeType());
		alFmDtoArrayList.add(fmEventDto.getNeVersion());
		alFmDtoArrayList.add(fmEventDto.getMsgName());
		alFmDtoArrayList.add(fmEventDto.getLvl1Id());
		alFmDtoArrayList.add(fmEventDto.getLvl2Id());
		alFmDtoArrayList.add(fmEventDto.getLvl3Id());
		alFmDtoArrayList.add(fmEventDto.getLvl4Id());
		alFmDtoArrayList.add(fmEventDto.getLvl5Id());
		alFmDtoArrayList.add(fmEventDto.getLvl6Id());
		alFmDtoArrayList.add(fmEventDto.getLvl7Id());
		alFmDtoArrayList.add(fmEventDto.getLvl8Id());
		alFmDtoArrayList.add(fmEventDto.getLvl9Id());
		alFmDtoArrayList.add(fmEventDto.getLvl10Id());
		alFmDtoArrayList.add(fmEventDto.getLloc());
		alFmDtoArrayList.add(fmEventDto.getLocationAlias());
		alFmDtoArrayList.add(fmEventDto.getEventType());
		alFmDtoArrayList.add(fmEventDto.getDisplayType());
		alFmDtoArrayList.add(fmEventDto.getAlarmTime());
		alFmDtoArrayList.add(fmEventDto.getSeverity());
		alFmDtoArrayList.add(fmEventDto.getServiceAffect());
		alFmDtoArrayList.add(fmEventDto.getAlarmGroup());
		alFmDtoArrayList.add(fmEventDto.getAlarmId());
		alFmDtoArrayList.add(fmEventDto.getProbcauseInt());
		alFmDtoArrayList.add(fmEventDto.getProbcauseStr());
		alFmDtoArrayList.add(fmEventDto.getAdditionalText());
		alFmDtoArrayList.add(fmEventDto.getClearType());
		alFmDtoArrayList.add(fmEventDto.getReserveInt());
		alFmDtoArrayList.add(fmEventDto.getReserveStr());

		alFmDtoArrayList.add(fmEventDto.getAckType());
		alFmDtoArrayList.add(fmEventDto.getAckUser());
		if (fmEventDto.getAckTime() == null)
			fmEventDto.setAckTime("");
		alFmDtoArrayList.add(fmEventDto.getAckTime());
		alFmDtoArrayList.add(fmEventDto.getClearUser());
		if (fmEventDto.getClearTime() == null)
			fmEventDto.setClearTime("");
		alFmDtoArrayList.add(fmEventDto.getClearTime());
		alFmDtoArrayList.add(fmEventDto.getClearSeq());
		alFmDtoArrayList.add(fmEventDto.getOperatorInfo());

		// For KDDI
		alFmDtoArrayList.add(fmEventDto.getServiceStatus());
		alFmDtoArrayList.add(fmEventDto.getSysType());
		alFmDtoArrayList.add(fmEventDto.getBandClass());
		alFmDtoArrayList.add(fmEventDto.getNeId());
		alFmDtoArrayList.add(fmEventDto.getAlarmPosition());
		alFmDtoArrayList.add(fmEventDto.getAlarmIdPosition());
		alFmDtoArrayList.add(fmEventDto.getAckSystem());
		alFmDtoArrayList.add(fmEventDto.getClearSystem());
		alFmDtoArrayList.add(fmEventDto.getTechInfo());

		return alFmDtoArrayList;

	}
	
	public static Map parsefmEventDtoToJsonString(FmEventVO fmEventDto) {

		Map fmEventMap = new HashMap();
		

		fmEventMap.put("seq_no", fmEventDto.getSeqNo()); 
		
		fmEventMap.put("ne_type", fmEventDto.getNeType());
		fmEventMap.put("ne_version", fmEventDto.getNeVersion());
		fmEventMap.put("msg_name", fmEventDto.getMsgName());
		fmEventMap.put("level1_id", fmEventDto.getLvl1Id());
		fmEventMap.put("level2_id", fmEventDto.getLvl2Id());
		fmEventMap.put("level3_id", fmEventDto.getLvl3Id());
		fmEventMap.put("level4_id", fmEventDto.getLvl4Id());
		fmEventMap.put("level5_id", fmEventDto.getLvl5Id());
		fmEventMap.put("level6_id", fmEventDto.getLvl6Id());
		fmEventMap.put("level7_id", fmEventDto.getLvl7Id());
		fmEventMap.put("level8_id", fmEventDto.getLvl8Id());
		fmEventMap.put("level9_id", fmEventDto.getLvl9Id());
		fmEventMap.put("level10_id", fmEventDto.getLvl10Id());
		fmEventMap.put("lloc", fmEventDto.getLloc());
		fmEventMap.put("location_alias", fmEventDto.getLocationAlias());
		fmEventMap.put("event_type", fmEventDto.getEventType());
		fmEventMap.put("display_type", fmEventDto.getDisplayType());
		fmEventMap.put("alarm_time", fmEventDto.getAlarmTime());
		fmEventMap.put("severity", fmEventDto.getSeverity());
		fmEventMap.put("service_affect", fmEventDto.getServiceAffect());
		fmEventMap.put("alarm_group", fmEventDto.getAlarmGroup());
		fmEventMap.put("alarm_id", fmEventDto.getAlarmId());
		fmEventMap.put("probcause_int", fmEventDto.getProbcauseInt());
		fmEventMap.put("probcause_str", fmEventDto.getProbcauseStr());
		fmEventMap.put("additional_text", fmEventDto.getAdditionalText());
		fmEventMap.put("clear_type", fmEventDto.getClearType());
		fmEventMap.put("reserve_int", fmEventDto.getReserveInt());
		fmEventMap.put("reserve_str", fmEventDto.getReserveStr());

		fmEventMap.put("ack_type", fmEventDto.getAckType());
		fmEventMap.put("ack_user", fmEventDto.getAckUser());
		if (fmEventDto.getAckTime() == null)
			fmEventDto.setAckTime("");
		fmEventMap.put("ack_time", fmEventDto.getAckTime());
		fmEventMap.put("clear_user", fmEventDto.getClearUser());
		if (fmEventDto.getClearTime() == null)
			fmEventDto.setClearTime("");
		fmEventMap.put("clear_time", fmEventDto.getClearTime());
		fmEventMap.put("clear_seq", fmEventDto.getClearSeq());
		fmEventMap.put("operator_info", fmEventDto.getOperatorInfo());

		// For KDDI
		fmEventMap.put("service_status", fmEventDto.getServiceStatus());
		fmEventMap.put("sys_type", fmEventDto.getSysType());
		fmEventMap.put("band_class", fmEventDto.getBandClass());
		fmEventMap.put("ne_id", fmEventDto.getNeId());
		fmEventMap.put("alarm_position", fmEventDto.getAlarmPosition());
		fmEventMap.put("alarm_id_position", fmEventDto.getAlarmIdPosition());
		fmEventMap.put("ack_system", fmEventDto.getAckSystem());
		fmEventMap.put("clear_system", fmEventDto.getClearSystem());
		fmEventMap.put("tech_info", fmEventDto.getTechInfo());

		return fmEventMap;

	}

	public static Map<String, Object> getRspnsMsgMap(Map<String, Object> message, String strResult, String strMsg) {

		message.put("result", strResult);
		message.put("reason", strMsg);
		return message;

	}

	public static String getMcIpAddr() {
		// Properties prop = (Properties)
		// ApplicationContextUtil.getContext().getBean("mcProps");
		String mcFile = System.getProperty("nms.home") + "/resource/properties/mc.properties";
		Properties prop = ConfigUtil.loadProperty(mcFile);
		return prop.containsKey("host") ? prop.getProperty("host") : "";
	}

	public static String getMsIpAddrByLvl1Id(int nLvl1Id) {
		HashMap<Integer, String> hmLvl1IpMap = FmUtil.getSiblingMsIdIpMap(true);
		return hmLvl1IpMap.get(nLvl1Id);
	}

	public static HashMap<Integer, String> getSiblingMsIdIpMap(boolean isIncludeMySelf) {

		HashMap<Integer, String> hmRtn = new HashMap<Integer, String>();

		Vector[] result = EmsInfoList.getMsInfo();
		Vector<Integer> vecLvl1Id = result[2];
		Vector<String> vecIpAddr = result[0];

		for (int i = 0; i < vecLvl1Id.size(); i++) {

			int nLvl1Id = vecLvl1Id.get(i);
			String strIpAddr = vecIpAddr.get(i);

			if (isIncludeMySelf)
				hmRtn.put(nLvl1Id, strIpAddr);
			else {
				if (nLvl1Id != EmsInfoList.getMsIdMyself())
					hmRtn.put(nLvl1Id, strIpAddr);
			}

		}

		// Check MC IP Address
		if (MyServerType.MCMS_INTEGRATED_SERVER) {
			LogUtil.warning("[GetMcIpAddr] No need to add MC IP address -> " + MyServerType.MC_IP);
		} else {
			hmRtn.put(-1, MyServerType.MC_IP);
		}

		LogUtil.warning("[Level1 MS Select] " + hmRtn);

		return hmRtn;

	}
/*
	public static JsonResult sendMsgToFmAndRtnMap(JsonResult message, String strIpAddr) throws Exception {

		String handler = (String) message.getCommand();

		HashMap requestMap = new HashMap();
		requestMap.put(MsgKey.NE_TYPE, "nms");
		requestMap.put(MsgKey.MSG_NAME, handler);
		requestMap.put(MsgKey.NE_VERSION, "v1");
		requestMap.put(MsgKey.MSG_TYPE, "HashMap");

		LogUtil.info("[sendMsgToFmAndRtnMap] send to IP=" + strIpAddr + ", Handler=" + handler);

		MyMessage myMessage = new MyMessage("app.fm", handler);

		try {
			myMessage.setBody(requestMap);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);

		} catch (Exception e) {
			LogUtil.warning(e);
		}

		return myMessage;

	}
*/

	public static JsonResult sendMsgToFmAndRtnList(JsonResult hmRqst, String strIpAddr) throws Exception {

		// TO DO :: SRKIM
		String url = "//" + strIpAddr + "/app.fm";
		// return RmiHelper.send(url, hmRqst);
		return null;

	}

	public static boolean isMsServerDownAlarm(String strAlarmId) {
		return strAlarmId.contentEquals("2013") || strAlarmId.contentEquals("A9050100");
	}

	public static FmEventVO fixTimeFormat(FmEventVO fmEventDto) {
		if (fmEventDto != null) {
			fmEventDto.setAlarmTime(fmEventDto.getAlarmTime().split("\\.")[0]);
			if (fmEventDto.getClearTime() != null && fmEventDto.getClearTime().length() > 0)
				fmEventDto.setClearTime(fmEventDto.getClearTime().split("\\.")[0]);
			if (fmEventDto.getAckTime() != null && fmEventDto.getAckTime().length() > 0)
				fmEventDto.setAckTime(fmEventDto.getAckTime().split("\\.")[0]);
		}
		return fmEventDto;
	}

	
	
	public static void sendNetworkStatusAlarmToMfgm(FmEventVO fmEventDto) {
		String neDN = "" + fmEventDto.getLvl1Id() + "." + fmEventDto.getLvl2Id() + "." + fmEventDto.getLvl3Id();
		String protocolType = (fmEventDto.getReserveStr().indexOf("snmp") != -1) ? "SNMP" : "ICMP";
		Boolean genAlarm = Boolean.FALSE;
		String handler = "rept_network_state";

		HashMap<String, Object> hmRqst = new HashMap<String, Object>();
		hmRqst.put(MsgKey.NE_TYPE, "nms");
		hmRqst.put(MsgKey.MSG_NAME, handler);

		hmRqst.put(MsgKey.NE_DN, neDN);
		hmRqst.put("STATUS", "UP");
		hmRqst.put("PROTOCOL", protocolType); // ICMP or SNMP
		hmRqst.put("GEN.ALARM", genAlarm);

		LogUtil.warning("[ManualClearAlarm-" + neDN + "-" + protocolType + "-" + genAlarm + "] Send message to mf.gm");

		try {
			/*
			MyMessage myMessage = new MyMessage("app.fm", handler);
			myMessage.setBody(hmRqst);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);
			*/
		} catch (Exception e) {
			LogUtil.warning(e);
		}
	}

	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {

		Date date1 = parseStringToDate("2014-07-03 20:33:19");
		Date date2 = parseStringToDate("2014-07-03 20:31:18");
		long nDiff = date1.getTime() - date2.getTime();
		System.out.println(nDiff);
		System.out.println(nDiff / 1000);

		HashMap<Integer, Long> hmMsIDBySeq = new HashMap<>();
		hmMsIDBySeq.put(2, 2222l);
		hmMsIDBySeq.put(3, 33333l);
		hmMsIDBySeq.put(4, 4444444l);
		hmMsIDBySeq.put(5, 5555555555l);

		JSONObject obj = new JSONObject(hmMsIDBySeq);
		System.out.println(obj.toString());
		System.out.println(obj.toString());
		String strJsonMap = obj.toString();

		JsonFactory factory = new JsonFactory();
		ObjectMapper mapper = new ObjectMapper(factory);
		TypeReference<HashMap<Integer, Long>> typeRef = new TypeReference<HashMap<Integer, Long>>() {
		};

		HashMap<Integer, Long> o = mapper.readValue(strJsonMap, typeRef);
		System.out.println("Got " + o);

		System.out.println("2014-07-03 20:33:19".split("\\.")[0]);

	}

	public static List<FmEventVO> mergeData(Map<Integer, List<FmEventVO>> msLevelData, String sortColName,
			String sortOrder, int pageRecordCount) {
		List<FmEventVO> returnList = new ArrayList<FmEventVO>();
		Comparator<FmSeqNoPageDto> comparator = sortOrder.toLowerCase().equals("asc")
				? new FmSeqNoPageDtoAscComparator() : new FmSeqNoPageDtoDescComparator();

		for (int record = 0; record < pageRecordCount; record++) {
			// Get minimum value from all MS
			Integer tempMsId = getNextValue(msLevelData, comparator, sortColName);

			FmEventVO temp = msLevelData.get(tempMsId).get(0);
			returnList.add(temp);
			msLevelData.get(tempMsId).remove(0);
		}
		return returnList;
	}

	/**
	 * @param inputMap
	 * @param comparator
	 * @param sortColName
	 * @return
	 */
	private static Integer getNextValue(Map<Integer, List<FmEventVO>> inputMap, Comparator<FmSeqNoPageDto> comparator,
			String sortColName) {
		Integer msFound = new Integer(Integer.MAX_VALUE);
		FmSeqNoPageDto existingValue = null;

		// Set<Integer> keySet = inputMap.keySet();
		Set<Entry<Integer, List<FmEventVO>>> entrySet = inputMap.entrySet();
		int msId = 0;
		for (Entry<Integer, List<FmEventVO>> entry : entrySet) {
			msId = entry.getKey();
			List<FmEventVO> list = inputMap.get(msId);
			if (null != list && !list.isEmpty()) {
				FmSeqNoPageDto curValue = getFmSeqNoPageDto(list.get(0), sortColName);
				if (existingValue == null) {
					existingValue = curValue;
					msFound = msId;
				} else {
					if (comparator.compare(existingValue, curValue) > 0) {
						msFound = msId;
						existingValue = curValue;
					}
				}
			}
		}
		return msFound;
	}

	/**
	 * Seq_no should not be set in response as event object is different ms
	 * server. it will lead to wrong sorting
	 * 
	 * @param fmEventDto
	 * @param sortColName
	 * @return
	 */
	private static FmSeqNoPageDto getFmSeqNoPageDto(FmEventVO fmEventDto, String sortColName) {
		FmSeqNoPageDto obj = new FmSeqNoPageDto();
		// obj.setSeqNo(fmEventDto.getSeqNo());
		switch (sortColName.toLowerCase()) {
		case "alarm_group": {
			obj.setKey1(fmEventDto.getAlarmGroup());
			obj.setKey2(getTimeIntValue(fmEventDto.getAlarmTime()));
			break;
		}
		case "severity": {
			obj.setKey1(fmEventDto.getSeverity());
			obj.setKey2(getTimeIntValue(fmEventDto.getAlarmTime()));
			break;
		}
		case "ne_id": {
			obj.setKey1(getIntNeId(fmEventDto.getNeId()));
			obj.setKey2(getTimeIntValue(fmEventDto.getAlarmTime()));
			break;
		}
		case "clear_time": {
			obj.setKey1(getTimeIntValue(fmEventDto.getClearTime()));
			obj.setKey2(getTimeIntValue(fmEventDto.getAlarmTime()));
			break;
		}
		case "alarm_time":
		default: // Defualt case : alarm time
		{
			obj.setKey1(getTimeIntValue(fmEventDto.getAlarmTime()));
			obj.setKey2(0);
			break;
		}
		}
		return obj;
	}

	private static int getIntNeId(String strNeId) {
		int neId = -1;
		try {
			neId = Integer.parseInt(strNeId);
		} catch (Exception e) {
		}
		return neId;
	}

	public static int getTimeIntValue(String alarmTime) {

		String timeFormatString = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat dateFormat = new SimpleDateFormat(timeFormatString);

		long time = -1;

		try

		{

			Date date = dateFormat.parse(alarmTime);

			Calendar cal = Calendar.getInstance();

			cal.setTime(date);

			time = cal.getTimeInMillis() / 1000;

		}

		catch (Exception e)

		{

			time = -1;

		}
		return (int) time;
	}

	public static void sortPageIndex(List<FmSeqNoPageDto> value, String strSortOrder) {
		Comparator<FmSeqNoPageDto> comparator = strSortOrder.toLowerCase().equals("asc")
				? new FmSeqNoPageDtoAscComparator() : new FmSeqNoPageDtoDescComparator();
		Collections.sort(value, comparator);
	}

	public static void sortData(List<FmEventVO> alSearchResult, String strSortColumn, String strSortOrder) {
		Comparator<FmEventVO> comparator = ComparaotFactory.getFmEventDtoComparator(strSortColumn, strSortOrder);
		Collections.sort(alSearchResult, comparator);
	}

	
	public static List<Integer> getLvl3IdLstByLvl1Id( List<Integer> level1IdList )
	{
		List<Integer> alLvl3IdList = new ArrayList<Integer>();
	
		/**** TO DO :: SRKIM
		String query = "select level3_id from cm_v_level3_lsm where level1_id in " + getInConditionValue(level1IdList);
		SQLResult sqlR = CommonDbAPI.commonDbQuery(query, DbCommon.SERVER_TYPE_MC);
		if( sqlR.result != DbCommon.DB_NODATA)
		{
			Map<String, Object> dbResult = sqlR.FRV_hash;
			Vector<Integer> vecId = (Vector<Integer>) dbResult.get("LEVEL3_ID");
			alLvl3IdList.addAll(vecId);
		}
		********/
		return alLvl3IdList;
	}
	
	public static List<Integer> getLvl3IdLstByLvl2Id( List<Integer> level2IdList )
	{
		List<Integer> alLvl3IdList = new ArrayList<Integer>();
		
		/****** TO DO :: SRKIM
		String query = "select level3_id from cm_v_level3_lsm where level2_id in " + getInConditionValue(level2IdList);
		SQLResult sqlR = CommonDbAPI.commonDbQuery(query, DbCommon.SERVER_TYPE_MC);
		if( sqlR.result != DbCommon.DB_NODATA)
		{
			Map<String, Object> dbResult = sqlR.FRV_hash;
			Vector<Integer> vecId = (Vector<Integer>) dbResult.get("LEVEL3_ID");
			alLvl3IdList.addAll(vecId);
		}
		****/
		return alLvl3IdList;
	}
	

	/**
	 * return condition value .Format as "(23,34)"
	 * 
	 * @param intValueLst
	 * @return
	 */
	private static String getInConditionValue(List<Integer> intValueLst) {
		StringBuilder sb = new StringBuilder();
		if (!intValueLst.isEmpty()) {
			int size = intValueLst.size();
			sb.append("(").append(intValueLst.get(0));
			for (int index = 1; index < size; index++) {
				sb.append(",").append(intValueLst.get(index));
			}
			sb.append(")");
		}
		return sb.toString();
	}

	/**
	 * To create location_alias for old alarms to have compatible with new
	 * alarm.
	 * 
	 * Old table is not having location alias and new table is having location
	 * alias.
	 * 
	 * location alias format: l4/l5/l6-lloc if l4 is -1, then format is "lloc"
	 * 
	 * Note: it should not start with "/"
	 * 
	 * @param alEvents
	 */
	// public static void modifyLocationAliasToOldResult(ArrayList<FmEventDto>
	// alEvents) {
	//
	// HashMap<String, String> hmCache = new HashMap<String, String>();
	//
	// for (FmEventDto fmEventDto : alEvents) {
	//
	// String strAlias = "N/A";
	// String strKey = fmEventDto.getLvl1Id() + "," + fmEventDto.getLvl2Id() +
	// "," + fmEventDto.getLvl3Id() + fmEventDto.getLvl4Id() + "," +
	// fmEventDto.getLvl5Id() + "," + fmEventDto.getLvl6Id()
	// + "," + fmEventDto.getLloc();
	//
	// if (hmCache.containsKey(strKey)) {
	// strAlias = hmCache.get(strKey);
	//
	// } else {
	// if (fmEventDto.getLvl4Id() == -1) {
	// String lloc = fmEventDto.getLloc();
	// if (lloc != null && !lloc.equals("N/A") && !lloc.equals("")) {
	// strAlias = lloc;
	// }
	// } else {
	// String locationAlias = "N/A";
	// String strQuery = String.format("SELECT
	// getAliasWithLevel3Id(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ALIAS",
	// fmEventDto.getLvl1Id(), fmEventDto.getLvl2Id(), fmEventDto.getLvl3Id(),
	// fmEventDto.getLvl4Id(), fmEventDto.getLvl5Id(), fmEventDto.getLvl6Id(),
	// -1, -1, -1, -1);
	// SQLResult SQLR = CommonDbAPI.commonDbQuery(strQuery,
	// DbCommon.SERVER_TYPE_MC);
	// /**
	// * /l1/l2/l3/l4/l5/l6
	// */
	// String strLvl1To6 = ((Vector<String>) SQLR.FRV_hash.get("ALIAS")).get(0);
	//
	// strQuery = String.format("SELECT
	// getAliasWithLevel3Id(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ALIAS",
	// fmEventDto.getLvl1Id(), fmEventDto.getLvl2Id(), fmEventDto.getLvl3Id(),
	// -1, -1, -1, -1,
	// -1, -1, -1);
	// SQLR = CommonDbAPI.commonDbQuery(strQuery, DbCommon.SERVER_TYPE_MC);
	//
	// /**
	// * /l1/l2/l3
	// */
	//
	// String strLvl1To3 = ((Vector<String>) SQLR.FRV_hash.get("ALIAS")).get(0);
	//
	// /**
	// * /l4/l5/l6
	// */
	// locationAlias = strLvl1To6.replace(strLvl1To3, "");
	//
	// /**
	// * remove / at beginning l4/l5/l6
	// */
	// if (locationAlias.startsWith("/")) {
	// locationAlias = locationAlias.substring(1);
	// }
	// /**
	// * if lloc is valid, then add l4/l5/l6 with '-lloc'. else keep l4/l5/l6
	// */
	// String lloc = fmEventDto.getLloc();
	// if (lloc != null && !lloc.equals("N/A") && !lloc.equals("")) {
	// locationAlias = locationAlias + "-" + lloc;
	// }
	//
	// strAlias = locationAlias;
	// }
	// hmCache.put(strKey, strAlias);
	//
	// }
	// fmEventDto.setLocationAlias(strAlias);
	//
	// }
	//
	// }

	public static long getSeqGap(FmClientVO fmClientDto, HashMap<Integer, Long> maxSeqByMs) {
		long seqGap = 0;

		try {
			HashMap<Integer, Long> curSeqByMs = convertJsonStringToSeqMap(fmClientDto.getLastSeqWithMsId());
			Set<Integer> msSet = curSeqByMs.keySet();
			Long curSeq = null;
			Long maxSeq = null;
			for (int msId : msSet) {
				curSeq = curSeqByMs.get(msId);
				maxSeq = maxSeqByMs.get(msId);
				if (null != maxSeq && curSeq != null && curSeq != 0L && maxSeq != 0L) {
					seqGap = seqGap + (maxSeq - curSeq);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return seqGap;
	}

	public static String getMcUrl(String target) {
		// String port = RmiMapper.getInstance().getRmiPort(target);
		// return RmiMapper.getUrlStr(target, FmUtil.getMcIpAddr(), port);
		return null;
	}

	public static int getClearTimeCompVal(String clearTime1, String clearTime2) {
		int clearTimeVal = -1;
		if (clearTime1 != null && clearTime2 != null) {
			clearTimeVal = clearTime1.compareTo(clearTime2);
		} else if (clearTime1 != null) {
			clearTimeVal = 1;
		}
		return clearTimeVal;
	}

}
