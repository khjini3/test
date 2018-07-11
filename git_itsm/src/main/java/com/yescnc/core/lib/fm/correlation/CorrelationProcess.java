package com.yescnc.core.lib.fm.correlation;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;

import com.yescnc.core.entity.db.FMArrayDeQueue;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.gen.RuleChecker;
import com.yescnc.core.util.common.LogUtil;



public  class CorrelationProcess extends Thread{

	private static CorrelationProcess co = null;
	private static CorrelationTaskThread ct=null;
	private String threadName = null;
	private ArrayBlockingQueue<List<FmEventVO>> taskBuffer;
	private FMArrayDeQueue<FmEventVO> correlationBuffer;
	private boolean isRunning;
	private int secondChanceCount=0;

	private final static int DEFAULTBUFFERSIZE=16384;
	//for debug
	//private final static int DEFAULTBUFFERSIZE=1024;
		
	/*
	 * default constructor
	 */
	private CorrelationProcess() {
		super();
		taskBuffer=new ArrayBlockingQueue<>(DEFAULTBUFFERSIZE);
		correlationBuffer=new FMArrayDeQueue<FmEventVO>(DEFAULTBUFFERSIZE);
		isRunning=false;
		ct = new CorrelationTaskThread(this);
		threadName = Thread.currentThread().getName();
	}
		
	public static synchronized CorrelationProcess getInstance() {
		if (co != null) {
			return co;
		} else { 
			co = new CorrelationProcess();		
			return co;
		}
	}
		
	/**
	 * CorrelationProcess thread procedure 
	 * 1.every 1second, make ArrayList<FmEventDto>
	 */
	@Override
	public void run() {
		Thread.currentThread().setName(threadName);
		LogUtil.info("CORRELATION PROCESS START!");
		
		FmEventVO fmEventDto = null;
		List<FmEventVO> oneTimeTask=null;
		while (true) {
			try {
				waitSleep(); //sleep 1period time

				if((fmEventDto = removeEvent())!=null){ //if there exist alarm in buffer.
					oneTimeTask=new ArrayList<>();
					oneTimeTask.add(fmEventDto); //add first
					secondChanceCount=0;
				}else{ 
					secondChanceCount++;
					if(secondChanceCount==2){ //if no exist alarm during 2 second in buffer, it clear all massRule.
						ConcurrentHashMap<String, MassAlarmInfo> massRule=RuleChecker.getInstance().getMassRule();
						if (massRule != null) {
							for (String code : massRule.keySet()) {
								CorrelationTaskThread.sendClearedMassEvent(code,massRule.get(code).getMassProbCause());
							}
						}
					}
					continue;
				}
				
				while ((fmEventDto = removeEvent()) != null){ //if buffer size is 0, return null
					oneTimeTask.add(fmEventDto); //add from second to end.
				}
				taskBuffer.put(oneTimeTask); //put one period task.
			} catch (Exception e) {
				for(StackTraceElement el:e.getStackTrace()){
					LogUtil.info("[CorrelationTaskThread] " +el.getFileName()+":"+el.getLineNumber()+":"+el.getMethodName());
				}
			}
		}		
	}
	
	
	public void addEvent(FmEventVO dto){
		if(!isRunning){
			super.start();
			ct.start();
			isRunning=true;
		}
		synchronized (correlationBuffer) {
			correlationBuffer.add(dto);
		}
	}
	
	private FmEventVO removeEvent(){
		synchronized (correlationBuffer) {
			return correlationBuffer.poll();
		}
	}
	private void waitSleep() {
		try {
			Thread.sleep(1000);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public ArrayBlockingQueue<List<FmEventVO>> getTaskBuffer() {
		return taskBuffer;	
	}
}
