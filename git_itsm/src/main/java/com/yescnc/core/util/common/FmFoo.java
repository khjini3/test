package com.yescnc.core.util.common;

import java.util.HashSet;
import java.util.Set;

public class FmFoo {
	
	private static final int MILLI_SEC = 1000;

	public static final boolean IS_OUTPUT_TEXT = false;
	
	/**
	 * This field is used for Alarm Healing and Alarm Correlation Function
	 */
	public static final boolean IS_SUPPORT_EVT_PROCESS = false;
	
	/**
	 * This field is used for KDDI or UQ customer only.
	 */
	public static final boolean IS_EXTENDED_FIELD_MODE = false;
	
	/**
	 * This field is used for LGU for display history alarm in current alarm viewer
	 */
	public static final boolean IS_SHOW_HIST_IN_CUR_ALARM = false;

	/**
	 * Default client poll response size : 100
	 */
	public static final int CLIENT_POLL_EVENT_RESPONSE_MAX_SIZE;
	
	/**
	 * Default server poll response size : 10,000
	 */
	public static final int DEAMON_POLL_EVENT_RESPONSE_MAX_SIZE;
	
	/**
	 * Maximum event poll size allowed. if crossed, buffer clean will start for WEB client.
	 */
	public static final int MAX_POLL_EVENT_CACHE_SIZE_LIMIT;
	
	/**
	 * buffer is overflow, but buffer over flow max limit is crossed, then clean buffer for all clients( including oss,ms client also)
	 */
	public static final int BUFFER_OVER_FLOW_MAX_EVENT_CACHE_SIZE_LIMIT;
	
	public static final int POLLING_EVENT_TIME_OUT_PERIOD;
	
	public static final Set<String> BUFFER_OVERFLOW_FILTER_EVENT_ID = new HashSet<>();

	public static final int ALARM_CODE_TOP_N_LIMIT;

	public static final int ALARM_RANK_RECORDS_PER_PAGE;
	
	/**
	 * To remove unused clients check interval. Default is 10 seconds.
	 */
	public static final int THREAD_TIMER_INTERVAL_CLIENT_CACHE_CHECK;
	
	/**
	 * Timer interval to check event queue to delete old events. Default is 5 seconds.
	 */
	public static final int THREAD_TIMER_INTERVAL_EVENT_CACHE_CHECK;
	
	/**
	 * Alarm healing queue size. Default value is 50000 records. 
	 */
	
	public static final int ALARM_HEALING_QUEUE_SIZE;
	/**
	 * Thread count for sending request to MC server.Default value is 3.
	 */
	public static final int ALARM_HEALING_DISPATCH_THREAD_POOL_SIZE;
	/**
	 * MC server Headling command parse thread count. Default vaue is 10.
	 */
	public static final int ALARM_HEALING_COMMAND_PARSE_THREAD_POOL_SIZE;
	static 
	{
		
		/**
		 *  service foo properties start
		 */
		/*
		IS_SUPPORT_EVT_PROCESS = ServiceUtil.isProperty("service.fm.alarm.eventprocess");
		IS_EXTENDED_FIELD_MODE = ServiceUtil.isProperty("service.fm.alarm.additionalcolumn");
		IS_OUTPUT_TEXT = ServiceUtil.isProperty("service.fm.alarm.outputtext");
		IS_SHOW_HIST_IN_CUR_ALARM = ServiceUtil.isProperty("service.fm.cur.alarm.show.history");
		*/
		/**
		 *  service foo properties end
		 */
		
		/**
		 * fm-config properties start
		 */
		THREAD_TIMER_INTERVAL_CLIENT_CACHE_CHECK = getIntProperties("service.fm.client.cache.check.timer.interval.in.seconds", 10) * MILLI_SEC;
		THREAD_TIMER_INTERVAL_EVENT_CACHE_CHECK = getIntProperties("service.fm.event.cache.check.timer.interval.in.seconds", 5) * MILLI_SEC;
		
		// Top N alarm code for Alarm Rank
		ALARM_CODE_TOP_N_LIMIT = getIntProperties("service.fm.alarm.rank.alarm.code.topn.limit", 10);
		
		ALARM_RANK_RECORDS_PER_PAGE =getIntProperties("service.fm.alarm.rank.number.of.records.per.page", 100);
		
		// 50 per seconds, 2 seconds 100 events/alarms
		CLIENT_POLL_EVENT_RESPONSE_MAX_SIZE = getIntProperties("service.fm.client.polling.max.event.size", 100);
		
		
		DEAMON_POLL_EVENT_RESPONSE_MAX_SIZE = getIntProperties("service.fm.deamon.polling.max.event.size", 10000);
		// Default value : 10,000
		MAX_POLL_EVENT_CACHE_SIZE_LIMIT = getIntProperties("service.fm.server.event.queue.size", 50000);
		
		BUFFER_OVER_FLOW_MAX_EVENT_CACHE_SIZE_LIMIT = getIntProperties("service.fm.server.event.queue.size.stop.limit", 100000); 
		// Default is 10 mins(600 seconds)
		POLLING_EVENT_TIME_OUT_PERIOD = getIntProperties("service.fm.event.polling.time.out.in.seconds", 600) * MILLI_SEC;
		
		// Add alarms which should not filtered when buffer over flow
		addBufferOverFlowFilterAlarmList();
		
		ALARM_HEALING_QUEUE_SIZE = getIntProperties("service.fm.alarm.healing.queue.size", 50000);
		ALARM_HEALING_DISPATCH_THREAD_POOL_SIZE = getIntProperties("service.fm.alarm.healing.mcserver.req.dispatch.thread.count", 3);
		ALARM_HEALING_COMMAND_PARSE_THREAD_POOL_SIZE = getIntProperties("service.fm.alarm.healing.command.send.to.mfsvc.thread.count", 10);
		
		
		/**
		 * fm-config properties end
		 */
	}

	private static int getIntProperties(String key, int defaultValue)
	{
		try {
			return Integer.parseInt(MyI18N.getString("fm-config", key));
		} catch (Exception e) {
			return defaultValue;
		}
	}

	private static void addBufferOverFlowFilterAlarmList()
	{
		String alarmIdList = MyI18N.getString("fm-config", "service.fm.events.overflow.filter.alarm.ids");
		if( alarmIdList != null && !alarmIdList.isEmpty())
		{
			String[] split = alarmIdList.split(",");
			for(String alarm:split)
			{
				// to avoid empty space or invalid alarms
				if( !alarm.isEmpty() && alarm.length() > 1)
				{
					BUFFER_OVERFLOW_FILTER_EVENT_ID.add(alarm);
				}
			}
		}
	}
	
	public static String getInfo() {
		StringBuilder sb = new StringBuilder();
		sb.append("FM Conf.")
				.append("\n----------------------------------------------------------------")
				//.append("\n . IS_EXTENDED_FIELD_MODE : " + IS_EXTENDED_FIELD_MODE)	// default:false, kddi/uq:true
				//.append("\n . IS_SUPPORT_EVT_PROCESS : " + IS_SUPPORT_EVT_PROCESS)	// default:false, mts/uq:true
			//	.append("\n . IS_OUTPUT_TEXT : " + IS_OUTPUT_TEXT)	// default:true
				//.append("\n . IS_SHOW_HIST_IN_CUR_ALARM : " + IS_SHOW_HIST_IN_CUR_ALARM)	// default:false, lgt:true
				.append("\n----------------------------------------------------------------")
				.append("\n . THREAD_TIMER_INTERVAL_EVENT_CACHE_CHECK : " + THREAD_TIMER_INTERVAL_EVENT_CACHE_CHECK)
				.append("\n . THREAD_TIMER_INTERVAL_CLIENT_CACHE_CHECK : " + THREAD_TIMER_INTERVAL_CLIENT_CACHE_CHECK)
				.append("\n . POLLING_EVENT_TIME_OUT_PERIOD : " + POLLING_EVENT_TIME_OUT_PERIOD)
				.append("\n . CLIENT_POLL_EVENT_RESPONSE_MAX_SIZE : " + CLIENT_POLL_EVENT_RESPONSE_MAX_SIZE)
				.append("\n . MAX_POLL_EVENT_CACHE_SIZE_LIMIT : " + MAX_POLL_EVENT_CACHE_SIZE_LIMIT)
				.append("\n . BUFFER_OVERFLOW_FILTER_EVENT_ID : " + BUFFER_OVERFLOW_FILTER_EVENT_ID)
				.append("\n . ALARM_CODE_TOP_N_LIMIT : " + ALARM_CODE_TOP_N_LIMIT)
				.append("\n . ALARM_RANK_RECORDS_PER_PAGE : " + ALARM_RANK_RECORDS_PER_PAGE)
				.append("\n----------------------------------------------------------------");
		return sb.toString();
	}
}
