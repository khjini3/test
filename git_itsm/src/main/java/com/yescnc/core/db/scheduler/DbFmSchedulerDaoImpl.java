package com.yescnc.core.db.scheduler;

import java.util.ArrayList;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DbFmSchedulerDaoImpl implements DbFmSchedulerDao {

	@Autowired
	private SqlSession sqlSession;

	
	@Override
	public ArrayList<String> getCurrentHourlyAlarm(String time_format_from, String time_format_to) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).getCurrentHourlyAlarm(time_format_from, time_format_to);
	}

	@Override
	public ArrayList<String> getHistoryHourlyAlarm(String time_format_from, String time_format_to) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).getHistoryHourlyAlarm(time_format_from, time_format_to);
	}

	@Override
	public boolean insFmHourlyAlarms(String time_format_from, String time_format_to) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).insFmHourlyAlarms(time_format_from, time_format_to);
	}

	@Override
	public boolean insFmHourlyAlarmsFromHist(String time_format_from, String time_format_to) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).insFmHourlyAlarmsFromHist(time_format_from, time_format_to);
	}

	@Override
	public ArrayList<String> isDailyAlarmExists(String start_time, String end_time) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).isDailyAlarmExists(start_time, end_time);
	}

	@Override
	public boolean insDailyAlarm(String start_time, String end_time) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).insDailyAlarm(start_time, end_time);
	}

	@Override
	public ArrayList<String> isMonthlyAlarmExists(String start_time, String end_time) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).isMonthlyAlarmExists(start_time, end_time);
	}

	@Override
	public boolean insMonthlyAlarm(String start_time, String end_time) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).insMonthlyAlarm(start_time, end_time);
	}

	@Override
	public Integer getFmPartitionNum(String strTimeFormat) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).getFmPartitionNum(strTimeFormat);
	}

	@Override
	public boolean turncateFmNextPartion(String strTrunPartitionName) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).turncateFmNextPartion(strTrunPartitionName);
	}
	
	@Override
	public boolean deleteFmHistoryData(String strDate) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).deleteFmHistoryData(strDate);
	}
	
	@Override
	public boolean deleteFmCurAlarmsNeDeleted(String strDate) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).deleteFmCurAlarmsNeDeleted(strDate);
	}

	
	@Override
	public boolean deleteFmCurAlarmsMSDeleted(String strDate) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).deleteFmCurAlarmsMSDeleted(strDate);
	}

	@Override
	public boolean turncateFmPartion(int jobType, String partionName) {
		return sqlSession.getMapper(DbFmSchedulerDao.class).turncateFmPartion(jobType, partionName);
	}

}
