package com.yescnc.core.lib.fm.correlation;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.cache.FmCurAlarmCache;
import com.yescnc.core.lib.fm.gen.FmEventGenerator;
import com.yescnc.core.lib.fm.gen.RuleChecker;
import com.yescnc.core.lib.fm.util.EventProcessConstants;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;

public class CorrelationTaskThread extends Thread{
	private ArrayBlockingQueue<List<FmEventVO>> taskBuffer;
	private List<FmEventVO> oneTimeTask;
	
	private int []massCountArray;
	private boolean []isOccurMass;
	private static ConcurrentHashMap<String,MassAlarmInfo> massRule;
	private static AtomicBoolean isModifiedRule=new AtomicBoolean(false);
	private AtomicBoolean isBuiltMassRule=new AtomicBoolean(false);
	
	private static int MASSTHRESHOLDCOUNT=EventProcessConstants.MASS_ALARM_THRESHOLD;
	private static final FmCurAlarmCache fmCurAlarmCache = FmCurAlarmCache.getInstance();
	
	//for debug
	//private static int MASSTHRESHOLDCOUNT=100;
	private static SimpleDateFormat dateFormat = null;
	
	static {
		dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	}
	
	public CorrelationTaskThread(CorrelationProcess cp){
		this.taskBuffer=cp.getTaskBuffer();
	}
	
	@Override
	public void run() {
		Thread.currentThread().setName(Thread.currentThread().getName());

		MassAlarmInfo massinfo;
		while (true) {
			try {
				// LogUtil.info("CORRELATION TASK THREAD!");
				oneTimeTask = taskBuffer.take();
				LogUtil.info("[CorrelationTaskThread] "+"start onTimeTask");

				if (oneTimeTask == null)
					continue;
				classifyMassAlarm(oneTimeTask);
				sendMassEvent();
				int size = oneTimeTask.size();
				for (int i = 0; i < size; i++) {
					FmEventVO dto = oneTimeTask.get(i);
					if (massRule != null && massCountArray != null && isOccurMass != null && (massinfo = massRule.get(dto.getAlarmId())) != null) {
						if (isOccurMass[massinfo.getArrayIndex()]) {// Current Alarm
														// contained Mass, and
														// occur Mass
							dto.setDisplayType(FmConstant.ALLNODISPLAY_DBINSERT);
							sendEvent(dto);
						} else { //it Alarm is contained in MassRule but is not Mass status.
							sendEvent(dto);
						}
					} else { //it Alarm is not contained in MassRule.
						sendEvent(dto);
					}
				}
			} catch (Exception e) {
				for(StackTraceElement el:e.getStackTrace()){
					LogUtil.info("[CorrelationTaskThread] " +el.getFileName()+":"+el.getLineNumber()+":"+el.getMethodName());
				}
			}
		}
	}

	/**
	 * 
	 * @param oneTimeTask
	 */
	private void classifyMassAlarm(List<FmEventVO> oneTimeTask){
		if(isModifiedRule.get()){ //if rule was modified, make MassCountList again.
			if (massRule != null) {
				for (String key : massRule.keySet()) {
					MassAlarmInfo massinfo = massRule.get(key);
					sendClearedMassEvent(key, massinfo.getMassProbCause());
				}
			}
			isBuiltMassRule.set(buildMassCountArray());
			setModifiedRule(false);
			
		}
		if (isBuiltMassRule.get()) { //if exist mass rule.
			Arrays.fill(massCountArray, 0);
			Arrays.fill(isOccurMass, false);

			int size = oneTimeTask.size();
			MassAlarmInfo massinfo;
			for (int i = 0; i < size; i++) {
				FmEventVO dto = oneTimeTask.get(i);
				if ( massRule != null && (massinfo = massRule.get(dto.getAlarmId())) != null) {// if current Alarm is Mass, count++
					massCountArray[massinfo.getArrayIndex()]++;
				}
			}

			for (int i = 0; i < massCountArray.length; i++) {
				if (massCountArray[i] >= MASSTHRESHOLDCOUNT) { //if mass alarm declared.
					if(massRule != null )
						LogUtil.info("[CorrelationTaskThread] "+"mass alarm declared "+massRule.get(i));
					isOccurMass[i] = true;
				}
			}
		}
	}
	
	public boolean buildMassCountArray() { //MassCount array and MassDeclared marking array
		synchronized(RuleChecker.massRuleSync){
			massRule = RuleChecker.getInstance().getMassRule();
			if ( massRule == null || massRule.size() == 0) {
				return false;
			}
			massCountArray = new int[massRule.size()];
			isOccurMass = new boolean[massRule.size()];

			return true;
		}
	}

	public static boolean isModifiedRule() {
		return isModifiedRule.get();
	}

	public static void setModifiedRule(boolean isModifiedRule) {
		CorrelationTaskThread.isModifiedRule.set(isModifiedRule);
	}
	
	private void sendMassEvent() {
		if(massRule == null){
			return ;
		}
		for (String key : massRule.keySet()) {
			MassAlarmInfo massinfo = massRule.get(key);
			if (isOccurMass != null && isOccurMass[massinfo.getArrayIndex()]) {// if current key occur mass, send
											// mass alarm
				sendDeclaredMassEvent(key,massCountArray[massinfo.getArrayIndex()],massinfo.getMassProbCause());
			} else{
				sendClearedMassEvent(key,massinfo.getMassProbCause());
			}
		}
	}
	
	private void sendEvent(FmEventVO dto){
		FmEventGenerator.getInstance().executeInsert(dto);	
	}
	
	private void sendDeclaredMassEvent(String AlarmCode,int massCount,String probCause){		
		FmEventVO mass_alarm = new FmEventVO();
		mass_alarm.setNeType("EMS");
		mass_alarm.setNeVersion("v1");
		mass_alarm.setLvl1Id( EmsInfoList.getMsIdMyself() );
		mass_alarm.setLvl2Id(-1);
		mass_alarm.setLvl3Id(-1);
		mass_alarm.setLvl4Id(-1);
		mass_alarm.setLvl5Id(-1);
		mass_alarm.setLvl6Id(-1);
		mass_alarm.setEventType(FmConstant.FM_TYPE_ALARM);
		mass_alarm.setLocationAlias("EMS-"+AlarmCode);
		mass_alarm.setLloc("EMS-"+AlarmCode);
		mass_alarm.setSeverity(FmConstant.FM_SEVERITY_CRITICAL);
		mass_alarm.setDisplayType(FmConstant.DISPLAY_DBNOINSERT);
		mass_alarm.setAlarmTime(dateFormat.format(new Date(System.currentTimeMillis())));
		mass_alarm.setAlarmGroup(FmConstant.GROUP_QOS);
		mass_alarm.setAlarmId("A"+String.valueOf(FmConstant.MASS_EVENT_CODE));
		mass_alarm.setProbcauseStr("MASS_ALARM("+AlarmCode+"/"+probCause+"/"+massCount+"events)");
		mass_alarm.setClearType(FmConstant.CLEAR_TYPE_UNCLEAR);
		
		FmEventVO dbDto=fmCurAlarmCache.getAlarmInCache(mass_alarm.getAlarmKeyString());
		
		//if curAlarm is null or cleared, it insert new mass alarm 
		if(dbDto==null||dbDto.getClearType()!=FmConstant.CLEAR_TYPE_UNCLEAR){ 
			LogUtil.info("[CorrelationTaskThread] "+"mass alarm declare inserted:"+mass_alarm.getProbcauseStr());
			FmEventGenerator.getInstance().executeInsert(mass_alarm);		
		}else{ //if it exists declared alarm already, first clear alarm and insert.
			sendClearedMassEvent(AlarmCode,probCause);
			mass_alarm.setAlarmTime(dbDto.getAlarmTime());
			FmEventGenerator.getInstance().executeInsert(mass_alarm);
		}
	}

	public static void sendClearedMassEvent(String AlarmCode,String probCause){
		FmEventVO mass_alarm = new FmEventVO();
		mass_alarm.setNeType("EMS");
		mass_alarm.setNeVersion("v1");
		mass_alarm.setLvl1Id( EmsInfoList.getMsIdMyself() );
		mass_alarm.setLvl2Id(-1);
		mass_alarm.setLvl3Id(-1);
		mass_alarm.setLvl4Id(-1);
		mass_alarm.setLvl5Id(-1);
		mass_alarm.setLvl6Id(-1);
		mass_alarm.setEventType(FmConstant.FM_TYPE_ALARM);
		mass_alarm.setLocationAlias("EMS-"+AlarmCode);
		mass_alarm.setLloc("EMS-"+AlarmCode);
		mass_alarm.setSeverity(FmConstant.SEVERITY_CRITICAL_CLEAR);
		mass_alarm.setDisplayType(FmConstant.DISPLAY_DBNOINSERT);
		mass_alarm.setAlarmTime(dateFormat.format(new Date(System.currentTimeMillis())));
		mass_alarm.setAlarmGroup(FmConstant.GROUP_QOS);
		mass_alarm.setAlarmId("A"+String.valueOf(FmConstant.MASS_EVENT_CODE));
		mass_alarm.setProbcauseStr("MASS_ALARM("+AlarmCode+"/"+probCause+")");
		mass_alarm.setClearType(FmConstant.CLEAR_TYPE_AUTO);
		
		FmEventVO dbDto=fmCurAlarmCache.getAlarmInCache(mass_alarm.getAlarmKeyString());
		
		if(dbDto!=null&&dbDto.getClearType()==FmConstant.CLEAR_TYPE_UNCLEAR){
			LogUtil.info("[CorrelationTaskThread] "+"mass alarm clear inserted :"+mass_alarm.getProbcauseStr());
			FmEventGenerator.getInstance().executeInsert(mass_alarm);		
		}
	}
	
}
