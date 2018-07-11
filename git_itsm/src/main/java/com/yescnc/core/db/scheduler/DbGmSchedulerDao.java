package com.yescnc.core.db.scheduler;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public abstract interface DbGmSchedulerDao {

	public abstract Integer getScheduleJobCounter(@Param("gm_schedule_cronjob_id") int gm_schedule_cronjob_id);

	public abstract Integer getScheduleJobStatus(@Param("gm_schedule_cronjob_id") int gm_schedule_cronjob_id,
			@Param("compare_time") String compare_time);

	public abstract boolean updScheduleJobStatus(@Param("schedule_job_id") int schedule_job_id,
			@Param("last_exec_time") String last_exec_time);

	public abstract boolean insScheduleJobStatus(@Param("schedule_job_id") int schedule_job_id,
			@Param("schedule_reg_command") String schedule_reg_command, @Param("last_exec_time") String last_exec_time);

	public abstract boolean deleteStatData(@Param("timeType") int timeType, @Param("timeValue") String timeValue);

	public abstract Integer isGmHourlyDataExists();

	public abstract boolean insGmTHourlyResourceData(@Param("time_format_from") String time_format_from,
			@Param("time_format_to") String time_format_to);

	public abstract ArrayList<String> isGmDailyDataExists(@Param("start_time") String start_time,
			@Param("end_time") String end_time);

	public abstract boolean insGmDailyResourceData(@Param("start_time") String start_time,
			@Param("end_time") String end_time);

	public abstract ArrayList<String> isGmMonthlyDataExists(@Param("start_time") String start_time,
			@Param("end_time") String end_time);

	public abstract boolean insMonthlyResourceData(@Param("start_time") String start_time,
			@Param("end_time") String end_time);

	public abstract Map<String, Object> getGmMonthlydata(@Param("deposit_period") int deposit_period);

	public abstract Map<String, Object> getGmDepositMonthly(@Param("alMonthList") ArrayList<String> alMonthList);

	public abstract ArrayList<Integer> getGmScheduleLogGlag(@Param("schedule_id") int schedule_id);

	public abstract boolean turncateGmPartion(@Param("jobType") int jobType, @Param("partionName") String partionName);

	public abstract boolean turncateSmPartion(@Param("jobType") int jobType, @Param("partionName") String partionName);
}
