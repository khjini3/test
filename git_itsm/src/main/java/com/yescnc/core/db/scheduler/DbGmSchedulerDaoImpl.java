package com.yescnc.core.db.scheduler;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DbGmSchedulerDaoImpl implements DbGmSchedulerDao {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public Integer getScheduleJobStatus(int gm_schedule_cronjob_id, String compare_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).getScheduleJobStatus(gm_schedule_cronjob_id, compare_time);
	}

	@Override
	public Integer getScheduleJobCounter(int gm_schedule_cronjob_id) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).getScheduleJobCounter(gm_schedule_cronjob_id);
	}

	@Override
	public boolean updScheduleJobStatus(int schedule_job_id, String last_exec_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).updScheduleJobStatus(schedule_job_id, last_exec_time);
	}

	@Override
	public boolean insScheduleJobStatus(int schedule_job_id, String schedule_reg_command, String last_exec_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).insScheduleJobStatus(schedule_job_id, schedule_reg_command,
				last_exec_time);
	}

	@Override
	public boolean deleteStatData(int timeType, String timeValue) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).deleteStatData(timeType, timeValue);
	}

	@Override
	public Integer isGmHourlyDataExists() {
		return sqlSession.getMapper(DbGmSchedulerDao.class).isGmHourlyDataExists();
	}

	@Override
	public boolean insGmTHourlyResourceData(String time_format_from, String time_format_to) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).insGmTHourlyResourceData(time_format_from, time_format_to);
	}

	@Override
	public ArrayList<String> isGmDailyDataExists(String start_time, String end_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).isGmDailyDataExists(start_time, end_time);
	}

	@Override
	public boolean insGmDailyResourceData(String start_time, String end_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).insGmDailyResourceData(start_time, end_time);
	}

	@Override
	public ArrayList<String> isGmMonthlyDataExists(String start_time, String end_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).isGmMonthlyDataExists(start_time, end_time);
	}

	@Override
	public boolean insMonthlyResourceData(String start_time, String end_time) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).insMonthlyResourceData(start_time, end_time);
	}

	@Override
	public ArrayList<Integer> getGmScheduleLogGlag(int schedule_id) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).getGmScheduleLogGlag(schedule_id);
	}

	@Override
	public Map<String, Object> getGmMonthlydata(int deposit_period) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).getGmMonthlydata(deposit_period);
	}

	@Override
	public Map<String, Object> getGmDepositMonthly(ArrayList<String> alMonthList) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).getGmDepositMonthly(alMonthList);
	}

	@Override
	public boolean turncateGmPartion(int jobType, String partionName) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).turncateGmPartion(jobType, partionName);
	}

	@Override
	public boolean turncateSmPartion(int jobType, String partionName) {
		return sqlSession.getMapper(DbGmSchedulerDao.class).turncateSmPartion(jobType, partionName);
	}
}