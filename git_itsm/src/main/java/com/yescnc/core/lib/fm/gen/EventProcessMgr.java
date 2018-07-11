/**
 * 
 */
package com.yescnc.core.lib.fm.gen;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.correlation.CorrelationProcess;
import com.yescnc.core.lib.fm.healling.HealingDispatchExecutor;
import com.yescnc.core.lib.fm.util.EventProcessConstants;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;

/**
 * EventProcessMgr receives event for alarm healing and correlation.
 * 
 * For Healing:
 * 1. creates HealingDispatchExecutor with thread pool count and healing queue
 * 2. healing queue will updated by this class addHealingEvent().
 * 3. healing query will be processed by HealingParser Thread.
 * 
 * For Correlation:
 * 
 * It send request to CorrelationProcess.getInstance().addEvent() 
 * 
 * @author r.boopathi
 * 
 */
public final class EventProcessMgr
{

	
	private LinkedBlockingQueue<Map<String, Object>> healingQueue=null;
	private ExecutorService healingParserThreadPool = null;
	private static EventProcessMgr instance;
	private HealingDispatchExecutor parseExecutor;
	private EventProcessMgr()
	{
		healingQueue = new LinkedBlockingQueue<>(FmFoo.ALARM_HEALING_QUEUE_SIZE);
		try
		{
			healingParserThreadPool =  Executors.newFixedThreadPool(FmFoo.ALARM_HEALING_DISPATCH_THREAD_POOL_SIZE);
			parseExecutor = new HealingDispatchExecutor(healingParserThreadPool, healingQueue);
			parseExecutor.start();
		}
		catch( Exception e )
		{
			e.printStackTrace();
		}
	}

	public static synchronized EventProcessMgr getInstance()
	{
		if (null == instance)
		{
			instance = new EventProcessMgr();
		}
		return instance;
	}

	private void addHealingEvent(Map<String, Object> eventSet)
	{
		try
		{
			if (false == healingQueue.offer(eventSet))
			{
				LogUtil.warning(" EventProcessMgr [ERROR] Healing Queue  size Limited Exceeded : ["
						+ healingQueue.size() + "]");
			}
		} catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * 1. Retrieves event for event process( alarm healing or alarm correlation
	 * or both)
	 * 
	 * @param event
	 *            FmEventDto object
	 */
	public static synchronized void addEvent(FmEventVO event)
	{
		try
		{
			LogUtil.info("[EventProcessMgr] RuleChecker.getInstance().checkRule(event) " + event.getLvl1Id() + "."
					+ event.getLvl2Id() + "." + event.getLvl3Id() + " "
					+ event.getLloc() + " " + event.getProbcauseStr() + " "
					+ event.getAlarmId() + " " + event.getSeverity());
			
			// Rule Check
			Map<String, Object> rule = RuleChecker.getInstance().checkRule(event);

			// key: EventProcessConstants.EVENT, value: FmEventDto
			// key: EventProcessConstants.HEALING, value:
			// Map<String,Vector<String>> rule


			if (rule != null && rule.size() > 0)
			{
				LogUtil.info("[EventProcessMgr] RULE " + rule);
				if (rule.get(String.valueOf(EventProcessConstants.HEALING)) != null)
				{
					Map<String, Object> eventSet = new HashMap<String, Object>();
					eventSet.put(EventProcessConstants.EVENT, event);
					eventSet.put(String.valueOf(EventProcessConstants.HEALING), rule.get(String.valueOf(EventProcessConstants.HEALING)));
					LogUtil.info("[EventProcessMgr] HEALING " + rule.get(String
									.valueOf(EventProcessConstants.HEALING)));
					EventProcessMgr.getInstance().addHealingEvent(eventSet);
				}
			}

			// All event is inserted in correlationbuffer
			CorrelationProcess.getInstance().addEvent(event);

		} catch (Exception e)
		{
			LogUtil.warning(e);
		}
	}
}
