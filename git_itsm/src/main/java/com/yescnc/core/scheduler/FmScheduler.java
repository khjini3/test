package com.yescnc.core.scheduler;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.yescnc.core.scheduler.task.FmDayCron;
import com.yescnc.core.scheduler.task.FmHourCron;
import com.yescnc.core.scheduler.task.FmMonthCron;

@Service
public class FmScheduler {

	private static final Logger logger = LoggerFactory.getLogger(FmScheduler.class);

	@Autowired
	FmHourCron fmHourCron;

	@Autowired
	FmDayCron fmDayCron;

	@Autowired
	FmMonthCron fmMonthCron;

	@PostConstruct
	public void init() {

	}

	@Scheduled(cron = "31 0 * * * *")
	public void fmHourCron() {
		logger.info("[FmScheduler][fmHourCron] start");

		fmHourCron.execute();
	}

	@Scheduled(cron = "35 0 0 * * *")
	public void fmDayCron() {
		logger.info("[FmScheduler][fmDayCron] start");

		try {
			fmDayCron.execute();
		} catch (Exception e) {
			e.printStackTrace();
			logger.warn(e.toString());
		}
	}

	@Scheduled(cron = "39 0 0 1 * *")
	public void fmMonthCron() {
		logger.info("[FmScheduler][fmMonthCron] start");

		try {
			fmMonthCron.execute();
		} catch (Exception e) {
			e.printStackTrace();
			logger.warn(e.toString());
		}
	}

}
