package com.yescnc.core.scheduler.task;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.scheduler.DbFmSchedulerDao;
import com.yescnc.core.scheduler.DbScheduleUtil;

@Component
public class FmHourCron {

	private static final Logger logger = LoggerFactory.getLogger(FmHourCron.class);
	
	@Autowired
	private DbFmSchedulerDao fmStat;

	@Autowired
	private DbScheduleUtil db_reposit;
	
	public boolean execute() {
		String calc_time = "";
		boolean isAutoStatisticsJob = true;
		boolean isScheduleJobSuccess = true;

		try {
			String current_time = "";
			if (calc_time.equals("")) {
				current_time = DbScheduleUtil.getCurrentTimeWithTimeFormat();

				current_time = DbScheduleUtil.getPrevStatisticCalcTime(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_HOUR, current_time);
				current_time = current_time.substring(0, 13);
				isAutoStatisticsJob = true;
			} else {
				current_time = calc_time;
				isAutoStatisticsJob = false;
			}

			logger.info("current_time = " + current_time);

			boolean isValidTimeFormat = DbScheduleUtil.chkStatisticCalcTimeFormat(DbScheduleUtil._FM_STATISTICS,
					DbScheduleUtil._FM_HOUR, current_time);

			if (isValidTimeFormat == false) {
				logger.info("input time format is not matched for this schedule job");
				return isValidTimeFormat;
			}

			Object previous_time;
			if (isAutoStatisticsJob == true) {
				previous_time = DbScheduleUtil.getPrevStatisticCalcTime(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_HOUR, current_time);

				int db_cnt = db_reposit.getLastExecTimeOfStatisticsJob(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_HOUR, (String) previous_time);

				if (db_cnt == DbScheduleUtil.DB_FAIL) { // db_fail
					isScheduleJobSuccess = false;
				}

				if (db_cnt == DbScheduleUtil.DB_NO_DATA) // no_data
				{
					db_cnt = insFmHourCronCurAlarms((String) previous_time);
					if (db_cnt == DbScheduleUtil.DB_FAIL) {
						logger.warn("[FmHourCron] Hourly Stat Cronjob failed - insFmHourCronCurAlarms");
						isScheduleJobSuccess = false;
					}
					db_cnt = insFmHourCronHist((String) previous_time);
					if (db_cnt == -DbScheduleUtil.DB_FAIL) {
						logger.warn("[FmHourCron] Hourly Stat Cronjob failed - insFmHourCronHist");
						isScheduleJobSuccess = false;
					}
				}
			}

			int result = insFmHourCronCurAlarms(current_time);
			if (result == DbScheduleUtil.DB_FAIL) {
				logger.warn("[FmHourCron] Hourly Stat Cronjob failed - insFmHourCronCurAlarms");
				isScheduleJobSuccess = false;
			}

			result = insFmHourCronHist(current_time);
			if (result == DbScheduleUtil.DB_FAIL) {
				logger.warn("[FmHourCron] Hourly Stat Cronjob failed - insFmHourCronHist");
				isScheduleJobSuccess = false;
			}

			if (isAutoStatisticsJob == true) {
				result = db_reposit.setLastExecTimeOfStatisticsJob(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_HOUR, current_time);
				if (result == DbScheduleUtil.DB_FAIL) {
					isScheduleJobSuccess = false;
				}
			}
			if (isScheduleJobSuccess == false) {
				return false;
			} else
				return true;
		} catch (Exception e) {
			logger.info("[ERROR] while inserting alarms from fm_t_alarms to fm_t_hourly_alarms");
			return false;
		}
	}

	private int insFmHourCronCurAlarms(String calc_time) {
		// String month = null;
		try {
			String time_format_from = calc_time + ":00:00";
			String time_format_to = calc_time + ":59:59";

			ArrayList<String> months = fmStat.getCurrentHourlyAlarm(time_format_from, time_format_to);
			logger.info("insFmHourCronCurAlarms [start = " + time_format_from + ", end = " + time_format_to + "]");

			if (months == null) {
				logger.info("[ERROR] there are no insert job into fm_t_hourly_alarms");
				return DbScheduleUtil.DB_FAIL;
			}

			// if data exists
			if (months.size() > 0) {
				boolean result = fmStat.insFmHourlyAlarms(time_format_from, time_format_to);
				if (result == true) {
					logger.info("[SUCCESS] insert into fm_t_hourly_alarms");
					return months.size();
				}
			}
			return months.size();
		} catch (Exception e) {
			logger.info("[FAIL] while inserting alarms from fm_t_alarms to fm_t_hourly_alarms");
			logger.warn(e.toString());
			return DbScheduleUtil.DB_FAIL;
		}
	}

	private int insFmHourCronHist(String calc_time) {
		//String month = null;
		try {
			String time_format_from = calc_time + ":00:00";
			String time_format_to   = calc_time + ":59:59";

			ArrayList<String> months = fmStat.getHistoryHourlyAlarm(time_format_from, time_format_to);
			logger.info("insFmHourCronHist [start = " + time_format_from + ", end = " + time_format_to + "]");

			if (months == null) {
				logger.info("[Error] there are no insert job into fm_t_hourly_alarms");
				return DbScheduleUtil.DB_FAIL;
			} else if (months.size() > 0) {
				boolean result = fmStat.insFmHourlyAlarmsFromHist(time_format_from, time_format_to);
				if (result == true) {
					logger.info("[success] insert into fm_t_hourly_alarms");
					return months.size();
				}
			}
			return months.size() ;
		} catch (Exception e) {
			logger.info("[error] while inserting alarms from fm_t_alarms to fm_t_hourly_alarms");
			logger.warn(e.toString()) ;
			return DbScheduleUtil.DB_FAIL  ;
		}
	}

}
