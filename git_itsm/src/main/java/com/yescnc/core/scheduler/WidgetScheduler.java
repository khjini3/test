package com.yescnc.core.scheduler;

import java.util.Date;

import javax.annotation.PostConstruct;

import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

//import com.yescnc.core.report.ReportService;
import com.yescnc.core.report.job.ReportJobListener;
import com.yescnc.core.scheduler.task.WidgetTask;

@Component
public class WidgetScheduler {
	
	private static final Logger logger = LoggerFactory.getLogger(WidgetScheduler.class);
	
	private static final String WidgetScheduler_GROUP ="WIDGET";
	
	@Autowired
	WidgetTask widgetTask;
	
//	@Autowired
//	ReportService ReportService;
	
	@Autowired
	private ApplicationContext context;
	
	private StdSchedulerFactory schedFact;
	private Scheduler sched;

	@PostConstruct
	public void init() {

		schedFact = new StdSchedulerFactory();

		try {
			sched = schedFact.getScheduler();
			sched.addGlobalJobListener( new ReportJobListener() );
			sched.start();
			logger.debug("WidgetScheduler scheduler start.");
		} catch (SchedulerException e) {
			e.printStackTrace();
		}

	}
	
	public boolean createJob(Integer id) {

		JobDetail jobDetail = new JobDetail("widget_" + id, WidgetScheduler.WidgetScheduler_GROUP, widgetTask.getClass());
		jobDetail.getJobDataMap().put("extdata", String.valueOf(id));
		jobDetail.getJobDataMap().put("context", context);
		Trigger trigger = TriggerUtils.makeMinutelyTrigger(id); //스케쥴 타임
		trigger.setName("widget_trigger_"+id);
		trigger.setGroup(WidgetScheduler.WidgetScheduler_GROUP);
		trigger.setStartTime(new Date());

		try {
			//ReportService.getScheduler().scheduleJob(jobDetail, trigger);
			sched.scheduleJob(jobDetail, trigger);
		} catch (Exception e) {

		}

		return true;
	}
}
