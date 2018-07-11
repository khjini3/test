package com.yescnc.core.lib.fm.util;

import com.yescnc.core.lib.fm.healling.HealingUtil;
import com.yescnc.core.util.common.MyI18N;

// by properties for future
public class EventProcessConstants {
	public static String SUPPORT = MyI18N.getString("fm.evtprocess.support");
	public static String EVENT = MyI18N.getString("fm.evtprocess.event.key");
	public static String RULE = MyI18N.getString("fm.evtprocess.rule.key");
	public static String NO_EVENT_EXCEPTION = MyI18N.getString("fm.evtprocess.no.event.key");
	
	public static long WAIT_TIME = Long.parseLong(MyI18N.getString("fm.evtprocess.buffer.wait.time"));
	public static long MASS_ALARM_WAIT_TIME = Long.parseLong(MyI18N.getString("fm.correlation.mass.wait.time"));
	
	public static int MASS_ALARM = Integer.parseInt(MyI18N.getString("fm.correlation.mass.const.key"));
	public static int ROOTCAUSE_ALARM = Integer.parseInt(MyI18N.getString("fm.correlation.rootcause.const.key"));
	public static int HEALING = Integer.parseInt(MyI18N.getString("fm.healing.const.key"));
		
	public static String MASS_ALARM_KEY = MyI18N.getString("fm.correlation.mass.alarm.probablecause");
	public static String MASS_EVENT_KEY = MyI18N.getString("fm.correlation.mass.event.probablecause");
	public static String MASS_SUPPRESS_KEY = MyI18N.getString("fm.correlation.mass.suppress.probablecause");
	public static String ROOTCAUSE_ALARM_KEY = MyI18N.getString("fm.correlation.rootcause.probablecause");
	public static String HEALING_KEY = MyI18N.getString("fm.evtprocess.healing.key");
	
	public static String CODE = MyI18N.getString("fm.healing.code.key");
	public static int MASS_ALARM_THRESHOLD = Integer.parseInt(MyI18N.getString("fm.correlation.mass.threshold"));
	
	public static String HEALING_PROCESS_RUN = HealingUtil.getFmResources("fm.healing.process.run");  
	public static String CORRELATION_PROCESS_RUN = HealingUtil.getFmResources("fm.correlation.process.run");
	
	/*
	static {
		EventProcessConstants.SUPPORT = MyI18N.getString("fm.evtprocess.support");
		LogUtil.info("SUPPORT IS " + SUPPORT);
		EventProcessConstants.EVENT = MyI18N.getString("fm.evtprocess.event.key");
		LogUtil.info("EVENT IS " + EVENT);
		EventProcessConstants.RULE = MyI18N.getString("fm.evtprocess.rule.key");
		LogUtil.info("RULE IS " + RULE);
		EventProcessConstants.NO_EVENT_EXCEPTION = MyI18N.getString("fm.evtprocess.no.event.key");
		LogUtil.info("NO_EVENT_EXCEPTION IS " + NO_EVENT_EXCEPTION);
		EventProcessConstants.WAIT_TIME = Long.parseLong(MyI18N.getString("fm.evtprocess.buffer.wait.time"));
		LogUtil.info("WAIT_TIME IS " + WAIT_TIME);
		EventProcessConstants.MASS_ALARM_WAIT_TIME = Long.parseLong(MyI18N.getString("fm.correlation.mass.wait.time"));
		LogUtil.info("MASS_ALARM_WAIT_TIME IS " + MASS_ALARM_WAIT_TIME);
		EventProcessConstants.MASS_ALARM = Integer.parseInt(MyI18N.getString("fm.correlation.mass.const.key"));
		LogUtil.info("MASS_ALARM IS " + MASS_ALARM);
		EventProcessConstants.ROOTCAUSE_ALARM = Integer.parseInt(MyI18N.getString("fm.correlation.rootcause.const.key"));
		LogUtil.info("ROOTCAUSE_ALARM IS " + ROOTCAUSE_ALARM);
		EventProcessConstants.HEALING = Integer.parseInt(MyI18N.getString("fm.healing.const.key"));
		LogUtil.info("HEALING IS " + HEALING);
		EventProcessConstants.MASS_ALARM_KEY = MyI18N.getString("fm.correlation.mass.alarm.probablecause");
		LogUtil.info("MASS_ALARM_KEY IS " + MASS_ALARM_KEY);
		EventProcessConstants.MASS_EVENT_KEY = MyI18N.getString("fm.correlation.mass.event.probablecause");
		LogUtil.info("MASS_EVENT_KEY IS " + MASS_EVENT_KEY);
		EventProcessConstants.MASS_SUPPRESS_KEY = MyI18N.getString("fm.correlation.mass.suppress.probablecause");
		LogUtil.info("MASS_SUPPRESS_KEY IS " + MASS_SUPPRESS_KEY);
		EventProcessConstants.ROOTCAUSE_ALARM_KEY = MyI18N.getString("fm.correlation.rootcause.probablecause");
		LogUtil.info("ROOTCAUSE_ALARM_KEY IS " + ROOTCAUSE_ALARM_KEY);
		EventProcessConstants.HEALING_KEY = MyI18N.getString("fm.evtprocess.healing.key");
		LogUtil.info("HEALING_KEY IS " + HEALING_KEY);
		EventProcessConstants.CODE = MyI18N.getString("fm.healing.code.key");
		LogUtil.info("CODE IS " + CODE);
		EventProcessConstants.MASS_ALARM_THRESHOLD = Integer.parseInt(MyI18N.getString("fm.correlation.mass.threshold"));
		LogUtil.info("MASS_ALARM_THRESHOLD IS " + MASS_ALARM_THRESHOLD);
	}
	*/
}
