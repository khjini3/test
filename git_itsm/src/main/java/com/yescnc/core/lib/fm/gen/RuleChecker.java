package com.yescnc.core.lib.fm.gen;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.ApplicationContext;

import com.yescnc.core.entity.db.CorrelationRuleData;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.correlation.CorrelationTaskThread;
import com.yescnc.core.lib.fm.correlation.MassAlarmInfo;
import com.yescnc.core.lib.fm.healling.HealingConstants;
import com.yescnc.core.lib.fm.healling.HealingRuleData;
import com.yescnc.core.lib.fm.healling.HealingRuleScriptData;
import com.yescnc.core.lib.fm.healling.HealingUtil;
import com.yescnc.core.lib.fm.util.EventProcessConstants;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.common.ServiceUtil;


public class RuleChecker {

	private static final String HEALING_HANDLER_NAME = "HealingHandler";
	private static final String CORRELATION_HANDLER_NAME = "CorrelationHandler";
	// private final static String DEFAULT_PRODUCT_TYPE = "access";
	// private final static String DEFAULT_SYS_TYPE = "mbs";
	private final static String TARGET_SVC = "mf.fm";
	private static Map<String, Object> healingRule;
	private static Map<String, Object> healingGroupRule;
	private static ConcurrentHashMap<String, MassAlarmInfo> massRule;
	// private static Map<String, Object> rootCauseRule;
	// private static Map<String, Object> correlatedAlarm;
	private static String[] targetNeFromDB;

	private static RuleChecker ruleChecker = null;
	public static Object massRuleSync = new Object();

	public RuleChecker() {
		LogUtil.info("[RuleChecker] init");
		LogUtil.info("[RuleChecker] HEALING_PROCESS_RUN : " + EventProcessConstants.HEALING_PROCESS_RUN);
		LogUtil.info("[RuleChecker] CORRELATION_PROCESS_RUN : " + EventProcessConstants.CORRELATION_PROCESS_RUN);
		init();
	}

	public static RuleChecker getInstance() {
		if (ruleChecker == null) {
			ruleChecker = new RuleChecker();
		}
		return ruleChecker;
	}

	public void init() {
			healingRule = new HashMap<String, Object>();
			healingGroupRule = new HashMap<String, Object>();
		
		
		loadHealingRule(true);

			targetNeFromDB = new String[0];	
		
		massRule = new ConcurrentHashMap<String, MassAlarmInfo>();

		loadCorrelationRule();
		loggingRule();
		LogUtil.info("[RuleChecker] Init Complete.");
	}

	/**
	 * it once read Rule XML at first
	 */
	private void loadCorrelationRule() {
		synchronized(massRuleSync){
			/*
			Map<String, Object> reqMsg = new HashMap<String, Object>();
			reqMsg.put(MsgKey.NE_TYPE, "nms");
			reqMsg.put(MsgKey.NE_VERSION, "v1");
			reqMsg.put(MsgKey.MSG_NAME, CORRELATION_HANDLER_NAME);
			reqMsg.put(MsgKey.FUNCTION_TYPE, "menu.fm");
			reqMsg.put("ReqType", "GET");

			try {
				String mcip = FmUtil.getMcIpAddr();
				MyMessage sendMsg = new MyMessage ("app,fm", CORRELATION_HANDLER_NAME) ;
				sendMsg.setBody(reqMsg);
				MyMessage response = FmUtil.sendMsgToFmAndRtnList(sendMsg, mcip);

				if (response == null) {
					LogUtil.info("[RuleChecker] ####### FAILED TO GET CORRELATION RULE INFORMATION =====> No response from server!!! check if fm server is running.");
					return;
				}
				Map resMsg = (Map) response.getBody();
				Map body = (Map) resMsg.get(MsgKey.BODY);

				if (resMsg.get(MsgKey.RESULT).equals(MsgResult.OK)) {
					massRule = new ConcurrentHashMap<String, MassAlarmInfo>();

					CorrelationRuleData[] data = (CorrelationRuleData[]) body.get(HealingConstants.RULE_DATA);

					setRuleData(data);

				} else if (resMsg.get(MsgKey.RESULT).equals(MsgResult.NOK)) {
					LogUtil.info("[RuleChecker] Getting rule data is failed.");
				}

				// must notify after modified.
				CorrelationTaskThread.setModifiedRule(true);
			} catch (Exception e) {
				LogUtil.info("[RuleChecker] loadCorrelationRule()..." + e.getMessage());
				e.printStackTrace();
			}
			*/
		}
	}
	private static final boolean MCMS_SERVER
	= (ServiceUtil.getServerType().contains("mc")
		&& ServiceUtil.getServerType().contains("ms"));
	
	private Boolean msReloadHealingRule(){
		Boolean ReLoadingResult = true;
		
		
		Map<String, Object> body = new HashMap<String, Object>();
		body.put(MsgKey.NE_TYPE, "nms");
		body.put(MsgKey.NE_VERSION, "v1");
		body.put(MsgKey.MSG_NAME, HEALING_HANDLER_NAME);
		body.put(HealingConstants.GET_TYPE, HealingConstants.GET_TYPE_NOMAL);
		body.put(MsgKey.FUNCTION_TYPE, "menu.fm");
		body.put("ReqType", "RELOAD");
		body.put("Status", "Activated");
		body.put(MsgKey.BODY, new HashMap<String, Object>());
	/*
		MyMessage message = new MyMessage ("app.fm", HEALING_HANDLER_NAME) ;
		message.setBody(body);
		
		try {
			MyMessage reMesg = FmUtil.sendMsgToFmAndRtnMap(message, TARGET_SVC); 
			
			Map alResponse = reMesg.getBody();
			for(int i=0; i<alResponse.size(); i++){
				Map resMsg = (Map) alResponse.get(i);
				if(resMsg.get(MsgKey.RESULT).equals(MsgResult.NOK)){
					LogUtil.info("[RuleChecker] MS Rule Reoalding Fail");
					ReLoadingResult = false;
				}
			}
			
		} catch (Exception e) {
		
			LogUtil.info("[RuleChecker] MS Rule Reoalding Fail");
			ReLoadingResult = false;
			e.printStackTrace();
		}
		*/
		return ReLoadingResult;
	}

	/**
	 * it once read Rule XML at first
	 */
	public void loadHealingRule(Boolean msFlag) {

		Map<String, Object> reqMsg = new HashMap<String, Object>();
		reqMsg.put(MsgKey.NE_TYPE, "nms");
		reqMsg.put(MsgKey.NE_VERSION, "v1");
		reqMsg.put(MsgKey.MSG_NAME, HEALING_HANDLER_NAME);
		reqMsg.put(HealingConstants.GET_TYPE, HealingConstants.GET_TYPE_NOMAL);
		reqMsg.put(MsgKey.FUNCTION_TYPE, "menu.fm");
		reqMsg.put("ReqType", "GET");
		reqMsg.put("Status", "Activated");
		reqMsg.put(MsgKey.BODY, new HashMap<String, Object>());
/*
		try {
			MyMessage myMessage = new MyMessage("nas.svc", HEALING_HANDLER_NAME);
			myMessage.setBody(reqMsg);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);
			
			if(!MCMS_SERVER && !msFlag){
				msReloadHealingRule();
			}

			if (resMessage == null) {
				LogUtil.info("[RuleChecker] ####### FAILED TO GET HEALING RULE INFORMATION =====> No response from server!!! check if fm server is running.");
				return;
			}
			//Map resMsg = (Map) response.get(0);
			Map body = (Map) resMessage.getBody();

			if (resMessage.getResult().equals(MsgResult.OK)) {
				synchronized (healingRule) {
					healingRule = new HashMap<String, Object>();
				}
				synchronized (healingGroupRule) {
					healingGroupRule = new HashMap<String, Object>();
				}

				HealingRuleData[] data = (HealingRuleData[]) body.get(HealingConstants.RULE_DATA);

				// if (data != null && data.length > 0)
				// LogUtil.info(data[0].toString());

				setRuleData(data);

			} else if (resMessage.getResult().equals(MsgResult.NOK)) {
				LogUtil.info("[RuleChecker] Getting rule data is failed.");
			}
		} catch (Exception e) {
			LogUtil.info("[RuleChecker] loadHealingRule()..." + e.getMessage());
			e.printStackTrace();
		}
		*/
	}

	private void setRuleData(HealingRuleData[] data) {
		if (data != null) {
			LogUtil.info("[RuleChecker] HEALING RULE COUNT : " + data.length);

			String[] targetNe = new String[0];
			for (int i = 0; i < data.length; i++) {
				if ("All".equals(data[i].getTargetNE())) {

					// read all ne
					synchronized (targetNeFromDB) {
						if (targetNeFromDB.length == 0) {
							targetNe = getAllNe();
							targetNeFromDB = targetNe;
						} else {
							targetNe = targetNeFromDB;
						}
					}
				} else {

					targetNe = data[i].getDn();
				}
				if (targetNe == null || targetNe.length <= 0) {
					LogUtil.info("[RuleChecker] targetNe is null...");
					return;
				}

				String dn;
				String level3Id;
				for (int ne = 0; ne < targetNe.length; ne++) {
					dn = targetNe[ne];
					level3Id = HealingUtil.getLevel3Id(dn);
					// LogUtil.info("[RuleChecker] ne="+dn);
					Map<String, Object> alarm;

					if ("Individual".equals(data[i].getNeUnit())) {
						synchronized (healingRule) {
							if (healingRule.containsKey(level3Id)) {

								alarm = (Map<String, Object>) healingRule.get(level3Id);

								String alarmCode;
								for (int al = 0; al < data[i].getOrgAlarmCode().length; al++) {
									alarmCode = data[i].getOrgAlarmCode()[al];
									if (!alarm.containsKey(alarmCode)) {
										Map<String, Object> rule = makeRuleMap(level3Id, data[i].getOrgAlarmCode()[al], data[i].getOrgAlarmName()[al], data[i]);

										if (rule != null) {
											alarm.put(alarmCode, rule);
										}
									}
								}
							}

							else {
								alarm = new HashMap<String, Object>();
								for (int al = 0; al < data[i].getOrgAlarmCode().length; al++) {
									Map<String, Object> rule = makeRuleMap(level3Id, data[i].getOrgAlarmCode()[al], data[i].getOrgAlarmName()[al], data[i]);
									if (rule != null) {
										alarm.put(data[i].getOrgAlarmCode()[al], rule);
									}
								}
								healingRule.put(level3Id, alarm);
							}
						}
					} else {

						synchronized (healingGroupRule) {
							if (healingGroupRule.containsKey(level3Id)) {
								alarm = (Map<String, Object>) healingGroupRule.get(level3Id);

								String alarmCode;
								for (int al = 0; al < data[i].getOrgAlarmCode().length; al++) {
									alarmCode = data[i].getOrgAlarmCode()[al];
									if (!alarm.containsKey(alarmCode)) {
										Map<String, Object> rule = makeRuleMap(level3Id, data[i].getOrgAlarmCode()[al], data[i].getOrgAlarmName()[al], data[i]);

										if (rule != null) {
											alarm.put(alarmCode, rule);
										}
									}
								}
							}

							else {
								alarm = new HashMap<String, Object>();
								for (int al = 0; al < data[i].getOrgAlarmCode().length; al++) {
									Map<String, Object> rule = makeRuleMap(level3Id, data[i].getOrgAlarmCode()[al], data[i].getOrgAlarmName()[al], data[i]);
									if (rule != null) {
										alarm.put(data[i].getOrgAlarmCode()[al], rule);
									}
								}
								healingGroupRule.put(level3Id, alarm);
							}
						}
					}
				}
			}
		} // if (data != null)
	}

	private void setRuleData(CorrelationRuleData[] data) {
		if (data != null) {
			LogUtil.info("[RuleChecker] CORRELATION RULE COUNT : " + data.length);
			String alarmCode;
			String alarmName;
			String type = "";

			for (int i = 0; i < data.length; i++) {
				type = data[i].getType();
				// type : 0 ==> Mass Alarm (Single Alarm)
				// type : 1 ==> RootCause Alarm
				// LogUtil.info("[RuleChecker] CORRELATION type ..." + type
				// + " | " + MyI18N.getString("project/fm-resources",
				// "fm.ahac.type.single") );
				if (type.equals(HealingUtil.getFmResources("fm.ahac.type.single"))) { // MyI18N.getString("project/fm-resources",
																						// "fm.ahac.type.single")))
																						// {
					alarmCode = data[i].getOrgAlarmCode()[0];
					alarmName = data[i].getAlarmName();

					if (!massRule.containsKey(alarmCode)) {
						// Map<String,Object> rule =
						// makeRuleMap4Mass(data[i]);
						MassAlarmInfo massAlarmInfo=new MassAlarmInfo(alarmCode, alarmName, i);
						massRule.put(alarmCode, massAlarmInfo);
					} else {
						LogUtil.info("[RuleChecker] The same rule for the alarm is skipped ..." + alarmCode);
					}
					LogUtil.info("[RuleChecker] CORRELATION MASS ALARM RULE COUNT : " + massRule.size());

				} else if (type.equals(HealingUtil.getFmResources("fm.ahac.type.rootcause"))) {
					alarmCode = data[i].getOrgAlarmCode()[0];
				}
			}
		}
	}

	private String[] getAllNe() {
		String[] dn = new String[0];

		try {
			LogUtil.info("[RuleChecker]  getAllNe() not implement ...") ;
		
			/*****
			SQLResult SQLR = DbCmLSM.getAllCmLevel3();
			SQLResult SQLR_level2 = DbCmLSM.getAllCmLevel2();
			if (SQLR.result == DbCommon.DB_SUCC) {
				// Vector vecLevel1Id = (Vector) SQLR.FRV_hash.get("LEVEL1_ID");
				Vector vecLevel2Id = (Vector) SQLR_level2.FRV_hash.get("LEVEL2_ID");
				Vector vecLevel3Id = (Vector) SQLR.FRV_hash.get("LEVEL3_ID");

				dn = new String[vecLevel3Id.size()];
				for (int i = 0; i < vecLevel3Id.size(); i++) {
					dn[i] = (String) vecLevel3Id.get(i);
				}

				String[] groupdn = new String[vecLevel2Id.size()];
				for (int j = 0; j < vecLevel2Id.size(); j++) {
					groupdn[j] = (String) vecLevel2Id.get(j);
				}

			}
			*********/
		} catch (Exception e) {
			LogUtil.warning(e) ;
			//e.printStackTrace();
		}
		return dn;
	}

	private void loggingRule() {
		LogUtil.info("[RuleChecker] RULE INFORMATION");
		LogUtil.info("------------------------------------------------------------------------");
		if (healingRule != null) {
			synchronized (healingRule) {
				for (Map.Entry entrySet : healingRule.entrySet()) {
					String ne = (String) entrySet.getKey();
					Map<String, Object> alarm = (Map<String, Object>) entrySet.getValue();
					for (Map.Entry alarmEntrySet : alarm.entrySet()) {
						Map<String, Object> rule = (Map<String, Object>) alarmEntrySet.getValue();

						LogUtil.info("[HEALING]" + ne + "\t" + alarmEntrySet.getKey() + "\t" + ((Vector) rule.get("SCRIPT_FILE")).get(0));
					}
				}
			}
		}
		if (healingGroupRule != null) {
			synchronized (healingGroupRule) {
				for (Map.Entry entrySet : healingGroupRule.entrySet()) {
					String ne = (String) entrySet.getKey();
					Map<String, Object> alarm = (Map<String, Object>) entrySet.getValue();
					for (Map.Entry alarmEntrySet : alarm.entrySet()) {
						Map<String, Object> rule = (Map<String, Object>) alarmEntrySet.getValue();

						LogUtil.info("[HEALINGGroup]" + ne + "\t" + alarmEntrySet.getKey() + "\t" + ((Vector) rule.get("SCRIPT_FILE")).get(0));
					}
				}
			}
		}

		if (massRule != null) {
			for (Map.Entry entrySet : massRule.entrySet()) {
				String alarm = (String) entrySet.getKey();
				LogUtil.info("[MASS]" + alarm);
			}
		}

		LogUtil.info("------------------------------------------------------------------------");
	}

	private Map<String, Object> makeRuleMap(String ne,
	// String neAlias,
			String alarmCode, String alarmName, HealingRuleData data) {
		Map<String, Object> rule = new HashMap<String, Object>();
		Vector<String> ruleNameVec;
		Vector<String> userVec;
		Vector<String> regDateVec;
		Vector<String> scriptNameVec;
		Vector<String> targetNeDnVec;
		Vector<String> targetNeAliasVec;
		Vector<String> alarmCodeVec;
		Vector<String> alarmNameVec;
		Vector<HealingRuleScriptData> scriptData;
		Vector<String> statusVec;

		ruleNameVec = new Vector<String>();
		userVec = new Vector<String>();
		regDateVec = new Vector<String>();
		scriptNameVec = new Vector<String>();
		targetNeDnVec = new Vector<String>();
		targetNeAliasVec = new Vector<String>();
		alarmCodeVec = new Vector<String>();
		alarmNameVec = new Vector<String>();
		statusVec = new Vector<String>();

		ruleNameVec.add(data.getRuleName());
		userVec.add(data.getUser());
		regDateVec.add(data.getRegDate());
		scriptNameVec.add(data.getScriptFileName());
		targetNeDnVec.add(ne);
		// targetNeAliasVec.add(neAlias);
		statusVec.add(data.getStatus());
		alarmCodeVec.add(alarmCode);
		alarmNameVec.add(alarmName);
		scriptData = data.getCliScript();

		rule.put("RULE_NAME", ruleNameVec);
		rule.put("USER", userVec);
		rule.put("REG_DATE", regDateVec);
		rule.put("SCRIPT_FILE", scriptNameVec);
		rule.put("NE_DN", targetNeDnVec);
		rule.put("NE_ALIAS", targetNeAliasVec);
		rule.put("ALARM_CODE", alarmCodeVec);
		rule.put("ALARM_NAME", alarmNameVec);
		rule.put("CLI_SCRIPT", scriptData);
		rule.put("STATUS", statusVec);

		System.out.println("@@@@@@@@CLI_SCRIPT" + scriptData);
		System.out.println("@@@@@@@@CLI_SCRIPT" + rule);

		return rule;

	}

	private Map<String, Object> makeRuleMap4Mass(CorrelationRuleData data) {
		Map<String, Object> rule = new HashMap<String, Object>();
		Vector<String> ruleNameVec;
		Vector<String> userVec;
		Vector<String> regDateVec;
		Vector<String> alarmIdVec;
		Vector<String> alarmNameVec;

		ruleNameVec = new Vector<String>();
		userVec = new Vector<String>();
		regDateVec = new Vector<String>();
		alarmIdVec = new Vector<String>();
		alarmNameVec = new Vector<String>();

		ruleNameVec.add(data.getRuleName());
		userVec.add(data.getUser());
		regDateVec.add(data.getRegDate());
		alarmIdVec.add(data.getAlarmID());
		alarmNameVec.add(data.getAlarmName());

		rule.put("RULE_NAME", ruleNameVec);
		rule.put("USER", userVec);
		rule.put("REG_DATE", regDateVec);
		rule.put("ALARM_ID", alarmIdVec);
		rule.put("ALARM_NAME", alarmNameVec);
		return rule;
	}

	public void reloadCorrelationRule() {
		loadCorrelationRule();
		loggingRule();
	}

	public void reloadHealingRule() {
		LogUtil.info("[RuleChecker] RELOAD Healing Rule");
		loadHealingRule(false);
		loggingRule();
	}
	public void msActionHealingRule() {
		// TODO Auto-generated method stub
		loadHealingRule(true);
	}

	/**
	 * 
	 * @param event
	 * @return Map<String, Object> key = MASS_ALARM, ROOTCAUSE_ALARM, HEALING
	 *         value = Map<String, Vector<String>>
	 * @throws Exception
	 */
	public Map<String, Object> checkRule(FmEventVO event) throws Exception {
		// rule key: EventProcessConstants.MASS_ALARM, value: Map<String, Vector<String>> rule
		// rule key: EventProcessConstants.ROOTCAUSE_ALARM, value: Map<String, Vector<String>> rule
		// rule key: EventProcessConstants.HEALING, value: Map<String, Vector<String>> rule
		Map<String, Object> rule = new HashMap<String, Object>();
		Map<String, Object> alarm;
		String targetNe = String.valueOf(event.getLvl3Id());
		String targetGroup = String.valueOf(event.getLvl2Id());

		if (event.getSeverity() < 10) {
			if (healingRule != null) {
				synchronized (healingRule) {
					if (healingRule.containsKey(targetNe)) {
						alarm = (Map<String, Object>) healingRule.get(targetNe);
						if (alarm.containsKey(event.getAlarmId())) {
							rule.put(String.valueOf(EventProcessConstants.HEALING), alarm.get(event.getAlarmId()));
							LogUtil.info("[RuleChecker] checked for healing : " + event.getAlarmId());
						}
					}
				}
			}

			if (healingGroupRule != null) {
				synchronized (healingGroupRule) {
					if (healingGroupRule.containsKey(targetGroup)) {
						alarm = (Map<String, Object>) healingGroupRule.get(targetGroup);
						if (alarm.containsKey(event.getAlarmId())) {
							rule.put(String.valueOf(EventProcessConstants.HEALING), alarm.get(event.getAlarmId()));
							LogUtil.info("[RuleChecker] checked for healing : " + event.getAlarmId());
						}
					}
				}
			}
		}
	
		return rule;
	}

	/*
	 * public static Map<String, Object> getRootCauseRule() { synchronized
	 * (rootCauseRule) { return rootCauseRule; } }
	 */

	public ConcurrentHashMap<String, MassAlarmInfo> getMassRule() {
		return massRule;
	}

	
}