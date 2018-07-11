package com.yescnc.core.scheduler.task;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.scheduler.DbFmSchedulerDao;
import com.yescnc.core.scheduler.DbScheduleUtil;

@Component
public class FmDayCron {
	private static final Logger logger = LoggerFactory.getLogger(FmDayCron.class);

	@Autowired
	private DbFmSchedulerDao fmStat;

	@Autowired
	private DbScheduleUtil db_reposit;

	public boolean execute() throws Exception {
		String target_time = "";
		return insFmDayCron(target_time);
	}

	public boolean insFmDayCron(String calc_time) {
		boolean isAutoStatisticsJob = true;
		boolean isScheduleJobSuccess = true;

		try {
			logger.info("FmDayCron.insFmDayCron() start .... Calc_Time = " + calc_time);

			String current_time = "";
			if (calc_time.equals("")) {
				current_time = DbScheduleUtil.getCurrentTimeWithTimeFormat();
				current_time = DbScheduleUtil.getPrevStatisticCalcTime(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_DAY, current_time);
				current_time = current_time.substring(0, 10);
				isAutoStatisticsJob = true;
			} else {
				current_time = calc_time;
				isAutoStatisticsJob = false;
			}
			logger.info("FmDayCron.insFmDayCron() .... current_time = " + current_time);

			boolean isValidTimeFormat = DbScheduleUtil.chkStatisticCalcTimeFormat(DbScheduleUtil._FM_STATISTICS,
					DbScheduleUtil._FM_DAY, current_time);
			if (!isValidTimeFormat) {
				logger.info("input time format is not matched for this schedule job");
				return false;
			}

			int rtn;
			if (isAutoStatisticsJob == true) {
				String previous_time = DbScheduleUtil.getPrevStatisticCalcTime(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_DAY, current_time);

				rtn = db_reposit.getLastExecTimeOfStatisticsJob(DbScheduleUtil._FM_STATISTICS, DbScheduleUtil._FM_DAY,
						previous_time);
				if (rtn == DbScheduleUtil.DB_NO_DATA) { // no data
					rtn = insFmDailyData(previous_time);
					if (rtn == DbScheduleUtil.DB_FAIL) { // db fail
						isScheduleJobSuccess = false;
					}
				}
			}
			rtn = insFmDailyData(current_time);
			if (rtn == DbScheduleUtil.DB_FAIL) { // db fail
				isScheduleJobSuccess = false;
			}

			if (isAutoStatisticsJob == true) {
				rtn = db_reposit.setLastExecTimeOfStatisticsJob(DbScheduleUtil._FM_STATISTICS, DbScheduleUtil._FM_DAY,
						current_time);
				if (rtn == DbScheduleUtil.DB_FAIL) { // db fail
					isScheduleJobSuccess = false;
				}
			}
			if (isScheduleJobSuccess == false) {
				return false;
			}
			return true;
		} catch (Exception e) {
			logger.info("[error] while inserting alarms from fm_t_hourly_alarms to fm_t_daily_alarms");
			logger.warn(e.toString());
			return false;
		}
	}

	public int insFmDailyData(String calc_time) {
		// int db_count = 0;
		try {
			String start_time = calc_time + " 00";
			String end_time = calc_time + " 23";

			ArrayList<String> daily = fmStat.isDailyAlarmExists(start_time, end_time);
			if (daily == null) {
				logger.info("fmStat.isDailyDataExists()fail ::  start = " + start_time + " , end = " + end_time);
				return DbScheduleUtil.DB_FAIL;
			}

			if (daily.size() > 0) { // data exists
				boolean result = fmStat.insDailyAlarm(start_time, end_time);
				if (result == true) {
					logger.info("[SUCCESS]  fmStat.insDailyAlarm() ... insert into fm_t_daily_alarms");
					return DbScheduleUtil.DB_SUCCESS;
				} else {
					logger.info("[FAIL] There are no insert job into fm_t_daily_alarms..step 1");
					return DbScheduleUtil.DB_FAIL;
				}
			} else {
				logger.info("[FAIL] There are no insert job into fm_t_daily_alarms...step 2");
				return DbScheduleUtil.DB_FAIL;
			}

		} catch (Exception e) {
			logger.info("[FAIL] while inserting alarms from fm_t_hourly_alarms to fm_t_daily_alarms");
			logger.warn(e.toString());
			return DbScheduleUtil.DB_FAIL;
		}
	}
}
