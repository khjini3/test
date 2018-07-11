package com.yescnc.core.scheduler.task;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.scheduler.DbFmSchedulerDao;
import com.yescnc.core.scheduler.DbScheduleUtil;

@Component
public class FmMonthCron {
	private static final Logger logger = LoggerFactory.getLogger(FmMonthCron.class);

	@Autowired
	private DbFmSchedulerDao fmStat;

	@Autowired
	private DbScheduleUtil db_reposit;

	public boolean execute() throws Exception {
		String target_time = "";
		return insMonthCron(target_time);
	}

	public boolean insMonthCron(String calc_time) {
		boolean isAutoStatisticsJob = true;

		try {
			logger.info("fmMonthCron.insMonthCron() Start ..." + calc_time);

			String current_time = "";
			if (calc_time.equals("")) {
				current_time = DbScheduleUtil.getCurrentTimeWithTimeFormat();
				current_time = DbScheduleUtil.getPrevStatisticCalcTime(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_MONTH, current_time);
				current_time = current_time.substring(0, 7);
				isAutoStatisticsJob = true;
			} else {
				current_time = calc_time;
				isAutoStatisticsJob = false;
			}
			
			logger.info("fmMonthCron.insMonthCron() current_time = " + current_time);

			boolean isValidTimeFormat = DbScheduleUtil.chkStatisticCalcTimeFormat(DbScheduleUtil._FM_STATISTICS,
					DbScheduleUtil._FM_MONTH, current_time);
			if (isValidTimeFormat == false) {
				logger.info(
						"[FAIL] fmMonthCron.insMonthCron() :: input time format is not matched for this schedule job");
				// return false;
			}

			Object previous_time;
			int result = -1;
			int db_cnt = -1;
			if (isAutoStatisticsJob == true) {
				previous_time = DbScheduleUtil.getPrevStatisticCalcTime(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_MONTH, current_time);
				db_cnt = db_reposit.getLastExecTimeOfStatisticsJob(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_MONTH, (String) previous_time);

				if (db_cnt == DbScheduleUtil.DB_NO_DATA) { // no_data
					result = insFmMonthAlarmData((String) previous_time);
					if (result == DbScheduleUtil.DB_FAIL) {
						logger.info(
								"[FAIL] fmMonthCron.insFmMonthAlarmData(previous_time) :: failed for this schedule job");
						// return false;
					}
				}
			}
			
			result = insFmMonthAlarmData(current_time);
			if (result == DbScheduleUtil.DB_FAIL) {
				logger.info("[FAIL] fmMonthCron.insFmMonthAlarmData(current_time) :: failed for this schedule job");
				return false;
			}

			if (isAutoStatisticsJob == true) {
				db_cnt = db_reposit.setLastExecTimeOfStatisticsJob(DbScheduleUtil._FM_STATISTICS,
						DbScheduleUtil._FM_MONTH, current_time);
			}

			if (db_cnt == DbScheduleUtil.DB_FAIL)
				return false;
			else
				return true;

		} catch (Exception e) {
			logger.info("[FAIL] while inserting alarms from fm_t_daily_alarms to fm_t_monthly_alarms");
			logger.warn(e.toString());
			return false;
		}
	}

	public int insFmMonthAlarmData(String calc_time) {
		try {
			String start_time = calc_time + "-01";
			String end_time = DbScheduleUtil.getLastDayOfMonth(start_time);

			ArrayList<String> monthly = fmStat.isMonthlyAlarmExists(start_time, end_time);
			if (monthly != null) {
				boolean result = fmStat.insMonthlyAlarm(start_time, end_time);

				if (result == false) {
					logger.info("[FAIL] insFmMonthAlarmData() :: There are no insert job into fm_t_monthly_alarms ");
					return DbScheduleUtil.DB_FAIL;
				} else {
					logger.info("[success] insert into fm_t_monthly_alarms");
					return DbScheduleUtil.DB_SUCCESS;
				}
			} else {
				logger.info("[FAIL] isMonthlyAlarmExists() :: There are no insert job into fm_t_monthly_alarms ");
				return DbScheduleUtil.DB_FAIL;
			}
		} catch (Exception e) {
			logger.info("[FAIL] while inserting alarms from fm_t_daily_alarms to fm_t_monthly_alarms");
			logger.warn(e.toString());
			return DbScheduleUtil.DB_FAIL;
		}
	}
}
