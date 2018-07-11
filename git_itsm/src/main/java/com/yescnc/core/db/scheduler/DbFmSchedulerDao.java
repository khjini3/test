package com.yescnc.core.db.scheduler;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

public abstract interface DbFmSchedulerDao {

	public abstract ArrayList<String> getCurrentHourlyAlarm(
					@Param("time_format_from") String time_format_from,
					@Param("time_format_to") String time_format_to);

	public abstract ArrayList<String> getHistoryHourlyAlarm(
					@Param("time_format_from") String time_format_from,
					@Param("time_format_to") String time_format_to);

	public abstract boolean insFmHourlyAlarms(
					@Param("time_format_from") String time_format_from,
					@Param("time_format_to") String time_format_to);

	public abstract boolean insFmHourlyAlarmsFromHist(
					@Param("time_format_from") String time_format_from,
					@Param("time_format_to") String time_format_to);

	
	public abstract ArrayList<String> isDailyAlarmExists(
					@Param("start_time")	String  start_time ,
					@Param("end_time")		String  end_time  ) ;
		

	public abstract boolean insDailyAlarm (
					@Param("start_time")	String  start_time ,
					@Param("end_time")		String  end_time  ) ;
	

	public abstract ArrayList<String> isMonthlyAlarmExists(	
					@Param("start_time")	String  start_time ,
					@Param("end_time")		String  end_time  ) ;
	
	public abstract boolean  insMonthlyAlarm (
					@Param("start_time")	String  start_time ,
					@Param("end_time")		String  end_time  ) ;
	

	public abstract Integer getFmPartitionNum (
					@Param("strTimeFormat")	String strTimeFormat) ;

	public abstract boolean turncateFmNextPartion (
					@Param("strTrunPartitionName")	String strTrunPartitionName) ;

	public abstract boolean deleteFmHistoryData( @Param("strDate")	String strDate ) ;
			
	public abstract boolean deleteFmCurAlarmsNeDeleted( @Param("strDate")	String strDate ) ;

	public abstract boolean deleteFmCurAlarmsMSDeleted( @Param("strDate")	String strDate ) ;
		
	public abstract boolean  turncateFmPartion (
			@Param("jobType")		int  jobType ,
			@Param("partionName")	String  partionName  ) ;
	
	
}
