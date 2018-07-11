
package com.yescnc.core.lib.fm.healling;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;

import com.yescnc.core.util.common.LogUtil;


/**
 * 
 * Gets input from healing queue and send to HealingDispatcher thread.
 * 
 * 
 * @author r.boopathi
 *
 */
public class HealingDispatchExecutor extends Thread
{
	private static final String DEBUG_PREFIX = "[HealingDispatchExecutor] ";
	
	
	private LinkedBlockingQueue<Map<String, Object>> healingQueue=null;
	private ExecutorService healingDispatchThreadPool = null;
	
	public HealingDispatchExecutor( ExecutorService threadPool ,
			LinkedBlockingQueue<Map<String, Object>> inputQueue)
	{
		healingQueue = inputQueue;
		healingDispatchThreadPool = threadPool;
	}
	
	public void run()
	{
		this.setName("mf.fm.healing.dispatcher.executor");

		LogUtil.config(DEBUG_PREFIX + "Healing HealingDispatchExecutor Thread START....\n");
		Map<String, Object> headlingEventSet = null;
		while (true)
		{
			try
			{
				headlingEventSet = healingQueue.take();
				healingDispatchThreadPool.execute(new HealingDispatcher(headlingEventSet));
			} 
			catch (InterruptedException e)
			{
				LogUtil.warning(DEBUG_PREFIX + "Exception occurred in HealingDispatchExecutor " + e.getMessage());
			}
			catch( Exception e )
			{
				LogUtil.warning(DEBUG_PREFIX + "Exception occurred in KpiParHealingDispatchExecutorseExecutor " + e.getMessage());
			}
		}
	}
}
