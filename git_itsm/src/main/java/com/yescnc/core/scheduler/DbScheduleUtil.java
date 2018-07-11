package com.yescnc.core.scheduler;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Map;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.scheduler.DbFmSchedulerDao;
import com.yescnc.core.db.scheduler.DbGmSchedulerDao;

@Component
public class DbScheduleUtil {
	private static final Logger logger = LoggerFactory.getLogger(DbScheduleUtil.class);

	@Autowired
	private DbGmSchedulerDao gmStat;

	@Autowired
	private DbFmSchedulerDao fmStat;

	public static final int DB_SUCCESS = 0;
	public static final int DB_FAIL = -1;
	public static final int DB_NO_DATA = -2;

	public static final String _BASE_MINUTE = "minute";
	public static final String _BASE_HOUR = "hour";
	public static final String _BASE_DAY = "day";
	public static final int _FM_STATISTICS = 1;
	public static final int _PM_STATISTICS = 2;
	public static final int _GM_STATISTICS = 3;
	public static final int _FM_HOUR = 101;
	public static final int _FM_DAY = 102;
	public static final int _FM_MONTH = 103;
	public static final int _PM_HOUR = 104;
	public static final int _PM_DAY = 105;
	public static final int _PM_MONTH = 106;
	public static final int _GM_HOUR = 107;
	public static final int _GM_DAY = 108;
	public static final int _GM_MONTH = 109;
	public static final int _PM_30MINUTE = 110;
	public static final int _FM_HOUR_SCHEDULE_JOB = 14;
	public static final int _FM_DAY_SCHEDULE_JOB = 15;
	public static final int _FM_MONTH_SCHEDULE_JOB = 16;
	public static final int _PM_HOUR_SCHEDULE_JOB = 11;
	public static final int _PM_DAY_SCHEDULE_JOB = 12;
	public static final int _PM_MONTH_SCHEDULE_JOB = 13;
	public static final int _GM_HOUR_SCHEDULE_JOB = 20;
	public static final int _GM_DAY_SCHEDULE_JOB = 21;
	public static final int _GM_MONTH_SCHEDULE_JOB = 22;
	public static final int _PM_30MINUTE_SCHEDULE_JOB = 27;
	// private static int _NODE_MOVE = 0;
	public static boolean FM_STATISTICS_NE_TYPE_VERSION_FIELD = true;

	public static int _PM_HOUR_MULTI_THREAD_CNT = 0;
	public static int _PM_DAY_MULTI_THREAD_CNT = 0;
	public static int _PM_MONTH_MULTI_THREAD_CNT = 0;

	public int getScheduleJobId(int statistics_type, int calc_type) {
		int schedule_job_id = -1;

		switch (statistics_type) {
		case _FM_STATISTICS:
			if (calc_type == _FM_HOUR) {
				schedule_job_id = _FM_HOUR_SCHEDULE_JOB;
			} else if (calc_type == _FM_DAY) {
				schedule_job_id = _FM_DAY_SCHEDULE_JOB;
			} else if (calc_type == _FM_MONTH) {
				schedule_job_id = _FM_MONTH_SCHEDULE_JOB;
			}
			break;
		}

		return schedule_job_id;
	}

	public String getScheduleRegCommand(int statistics_type, int calc_type) {
		String schedule_reg_command = "";

		switch (statistics_type) {
		case _FM_STATISTICS:
			if (calc_type == _FM_HOUR) {
				schedule_reg_command = "class=FmHourCron";
			} else if (calc_type == _FM_DAY) {
				schedule_reg_command = "class=FmDayCron";
			} else if (calc_type == _FM_MONTH) {
				schedule_reg_command = "class=FmMonthCron";
			}
			break;
		}

		return schedule_reg_command;
	}

	public static String getCurrentTimeWithTimeFormat() {
		String current_time = "";
		SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar curTime = Calendar.getInstance();
		current_time = fmt.format(curTime.getTime());
		return current_time;
	}

	public static String getPrevStatisticCalcTime(int statistics_type, int calc_type, String time) {
		String prev_time = "";

		switch (statistics_type) {

		case _FM_STATISTICS:
			if (calc_type == _FM_HOUR) {
				prev_time = getPrevHourBasedTime(time);
			} else if (calc_type == _FM_DAY) {
				prev_time = getPrevDayBasedTime(time);
			} else if (calc_type == _FM_MONTH) {
				prev_time = getPrevMonthBasedTime(time);
			}
			break;
		}
		return prev_time;

	}

	public static String getPrevHourBasedTime(String time) {
		String prev_time = "";

		String year = time.substring(0, 4);
		String month = time.substring(5, 7);
		String day = time.substring(8, 10);
		String hour = time.substring(11, 13);

		SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH");

		Calendar curTime = Calendar.getInstance();

		curTime.set(Calendar.YEAR, Integer.parseInt(year));
		curTime.set(Calendar.MONTH, Integer.parseInt(month) - 1);
		curTime.set(Calendar.DATE, Integer.parseInt(day));
		curTime.set(Calendar.HOUR_OF_DAY, Integer.parseInt(hour));

		curTime.set(Calendar.SECOND, 0);

		logger.info("[getPrevHourBasedTime] Input time -> " + curTime.getTime());

		curTime.set(Calendar.HOUR_OF_DAY, curTime.get(Calendar.HOUR_OF_DAY) - 1);
		logger.info("[getPrevHourBasedTime] Previous time -> " + curTime.getTime());

		prev_time = fmt.format(curTime.getTime());

		return prev_time;
	}

	public static String getPrevDayBasedTime(String time) {
		String prev_time = "";

		String year = time.substring(0, 4);
		String month = time.substring(5, 7);
		String day = time.substring(8, 10);

		SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");

		Calendar curTime = Calendar.getInstance();

		curTime.set(Calendar.SECOND, 0);
		curTime.set(Calendar.MINUTE, 0);

		curTime.set(Calendar.DATE, Integer.parseInt(day));
		curTime.set(Calendar.MONTH, Integer.parseInt(month) - 1);
		curTime.set(Calendar.YEAR, Integer.parseInt(year));

		logger.info("[getPrevDayBasedTime] Input time -> " + curTime.getTime());

		curTime.set(Calendar.DATE, curTime.get(Calendar.DATE) - 1);

		logger.info("[getPrevDayBasedTime] Previous time -> " + curTime.getTime());

		prev_time = fmt.format(curTime.getTime());

		return prev_time;
	}

	public static String getPrevMonthBasedTime(String time) {
		String prev_time = "";

		String year = time.substring(0, 4);
		String month = time.substring(5, 7);

		SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM");

		Calendar curTime = Calendar.getInstance();

		curTime.set(Calendar.SECOND, 0);
		curTime.set(Calendar.MINUTE, 0);
		curTime.set(Calendar.HOUR_OF_DAY, 0);

		curTime.set(Calendar.MONTH, Integer.parseInt(month) - 1);
		curTime.set(Calendar.YEAR, Integer.parseInt(year));

		logger.info("[getPrevMonthBasedTime] Input time -> " + curTime.getTime());

		curTime.set(Calendar.MONTH, curTime.get(Calendar.MONTH) - 1);

		logger.info("[getPrevMonthBasedTime] Previous time -> " + curTime.getTime());

		prev_time = fmt.format(curTime.getTime());

		return prev_time;
	}

	public static String getLastDayOfMonth(String time) {
		String year = time.substring(0, 4);
		String month = time.substring(5, 7);

		SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");

		Calendar curTime = Calendar.getInstance();

		curTime.set(Calendar.SECOND, 0);
		curTime.set(Calendar.MINUTE, 0);

		curTime.set(Calendar.DATE, 1); // 매월 1일 기준
		curTime.set(Calendar.MONTH, Integer.parseInt(month) - 1);
		curTime.set(Calendar.YEAR, Integer.parseInt(year));

		logger.info("[getLastDayOfMonth] Start time -> " + curTime.getTime());

		curTime.add(Calendar.MONTH, +1); // 다음달을 더하고
		curTime.add(Calendar.DATE, -1); // 하루를 빼면 이달의 마지막 날이다
		logger.info("[getLastDayOfMonth] Last time -> " + curTime.getTime());

		String last_time = fmt.format(curTime.getTime());

		return last_time;
	}

	public static boolean chkStatisticCalcTimeFormat(int statistics_type, int calc_type, String time) {
		boolean is_time_format_true = true;

		switch (statistics_type) {
		case _FM_STATISTICS:
			if (calc_type == _FM_HOUR) {
				if (time.length() == 13) {
					is_time_format_true = true;
				} else {
					is_time_format_true = false;
				}
			} else if (calc_type == _FM_DAY) {
				if (time.length() == 10) {
					is_time_format_true = true;
				} else {
					is_time_format_true = false;
				}
			} else if (calc_type == _FM_MONTH) {
				if (time.length() == 7) {
					is_time_format_true = true;
				} else {
					is_time_format_true = false;
				}
			} else {
				is_time_format_true = false;
			}
			break;
		}
		return is_time_format_true;
	}

	public int getLastExecTimeOfStatisticsJob(int statistics_type, int calc_type, String compare_time) {
		try {
			int gm_schedule_cronjob_id = getScheduleJobId(statistics_type, calc_type);

			Integer db_count = gmStat.getScheduleJobStatus(gm_schedule_cronjob_id, compare_time);

			if (db_count == null) { // fail
				return DB_FAIL;
			} else if (db_count.intValue() >= 1) { // success
				logger.info("gmStat.deleteStatData()...success ..." + calc_type + "," + compare_time);
				return db_count.intValue();
			} else { // else Next step is no data
				logger.info("gmStat.deleteStatData()...no data ..." + calc_type + "," + compare_time);
				boolean rtn = gmStat.deleteStatData(calc_type, compare_time);
				return DB_NO_DATA;
			}
		} catch (Exception e) {
			logger.error(e.toString());
			return DB_FAIL;
		}
	}

	public int setLastExecTimeOfStatisticsJob(int statistics_type, int calc_type, String last_exec_time) {
		int schedule_job_id = 0;
		String schedule_reg_command = "";

		schedule_job_id = getScheduleJobId(statistics_type, calc_type);
		schedule_reg_command = getScheduleRegCommand(statistics_type, calc_type);

		try {
			Integer db_count = gmStat.getScheduleJobCounter(schedule_job_id);
			if (db_count == null) {
				logger.info("gmStat.getScheduleJobCounter() :: Fail");
				return DB_FAIL;
			}

			boolean result = false;
			if (db_count >= 1) { // alaready exists ...
				result = gmStat.updScheduleJobStatus(schedule_job_id, last_exec_time);
				return db_count.intValue();
			} else { // new job
				result = gmStat.insScheduleJobStatus(schedule_job_id, schedule_reg_command, last_exec_time);
				if (result == true) {
					logger.info("[success] set gm_t_schedule for last_exec_time");
					return DB_SUCCESS;
				} else {
					logger.info("[Fail] set gm_t_schedule for last_exec_time");
					return DB_FAIL;
				}
			}
		} catch (Exception e) {
			logger.error(e.toString());
			return DB_FAIL;
		}
	}

	public int doFmDepositPeriod(int table_type, int deposit_period) {
		String period_date_year_to_day = null;
		String period_date_month = null;
		String period_date_year = null;

		logger.info("doFmDepositPeriod() start ...type=" + table_type + ", deposit_period = " + deposit_period);
		try {
			Map<String, Object> rtn_map = gmStat.getGmMonthlydata(deposit_period + 1);
			if (rtn_map == null) {
				logger.info("FAIL :: doFmDepositPeriod(int type, int deposit_period) ");
				return DB_FAIL;
			}

			period_date_year_to_day = (String) rtn_map.get("day");
			period_date_month = (String) rtn_map.get("month");
			period_date_year = (String) rtn_map.get("year");

			logger.info("period_date_year_to_day = " + period_date_year_to_day + ", period_date_month = "
					+ period_date_month + ", period_date_year = " + period_date_year);

			String[] partition_all_month = { "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" };
			Vector<String> intime_partition_date = new Vector<String>();
			Vector<String> outtime_partition_date = new Vector<String>();
			for (int i = 0; i < partition_all_month.length; i++) {
				outtime_partition_date.add(partition_all_month[i]);
			}

			ArrayList<String> aList = new ArrayList<>();
			for (int i = 0; i <= deposit_period; i++) {
				aList.add(String.valueOf(deposit_period - i));
			}

			rtn_map = gmStat.getGmDepositMonthly(aList);

			Iterator iter = rtn_map.entrySet().iterator();
			String partition_date = "";
			String m;
			while (iter.hasNext()) {
				Map.Entry entry = (Map.Entry) iter.next();
				// String key = (String) entry.getKey();
				m = (String) entry.getValue();
				if (m != null)
					partition_date = m;
				intime_partition_date.add(partition_date);
			}

			for (int i = 0; i < intime_partition_date.size(); i++) {
				logger.info("intime_partition_date = " + (String) intime_partition_date.get(i));
			}

			String partition_name = "";
			for (int i = 0; i < intime_partition_date.size(); i++) {
				partition_name = (String) intime_partition_date.get(i);
				for (int j = 0; j < outtime_partition_date.size(); j++) {
					if (partition_name.equals((String) outtime_partition_date.get(j))) {
						outtime_partition_date.remove(j);
					}
				}
			}
			
			for (int i = 0; i < outtime_partition_date.size(); i++) {
				logger.info("outtime_partition_date = " + (String) outtime_partition_date.get(i));
			}

			boolean rtn_status = false;
			if (table_type == 1) {
			} else if (table_type == 2) {
				for (int i = 0; i < outtime_partition_date.size(); i++) {
					rtn_status = fmStat.turncateFmPartion(table_type, "fm_p_" + (String) outtime_partition_date.get(i));
				}
			} else if (table_type == 3) {
				for (int i = 0; i < outtime_partition_date.size(); i++) {
					rtn_status = fmStat.turncateFmPartion(table_type, "fm_p_" + (String) outtime_partition_date.get(i));
				}
			} else if (table_type == 4) {
				for (int i = 0; i < outtime_partition_date.size(); i++) {
					rtn_status = fmStat.turncateFmPartion(table_type, "fm_p_" + (String) outtime_partition_date.get(i));
				}
			}
			return DB_SUCCESS;
		} catch (Exception e) {
			logger.info("turncateFmPartion() Exception ...");
			logger.error(e.toString());
			return DB_FAIL;
		}
	}
}
