package com.yescnc.core.scheduler.task;

import java.io.Serializable;
import java.time.LocalTime;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.widget.KpiWidgetDao;
import com.yescnc.core.db.widget.WidgetRepository;
import com.yescnc.core.entity.db.KpiWidgetVO;
import com.yescnc.core.util.json.JsonCacheResult;
import com.yescnc.core.widget.service.WidgetCache;

@Component
public class WidgetTask implements Job, Serializable {

	private static final Logger logger = LoggerFactory.getLogger(WidgetTask.class);

	private static final long serialVersionUID = 1L;
	
	private ApplicationContext appcontext;
	
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		// TODO Auto-generated method stub
		
		JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
		Integer id = Integer.parseInt(jobDataMap.getString("extdata"));
		appcontext = (ApplicationContext)jobDataMap.get("context");
		
		logger.info("WidgetTask : " + LocalTime.now().toString() + " " + id);
		
		KpiWidgetDao kpiWidgetDao = (KpiWidgetDao) appcontext.getBean("kpiWidgetDao");
		WidgetRepository widgetRepository = (WidgetRepository) appcontext.getBean("widgetRepository");
		WidgetCache cache = (WidgetCache) appcontext.getBean("widgetCache");
		
		KpiWidgetVO vo = kpiWidgetDao.selectKpiWidgetMap(id);
		JsonCacheResult result = new JsonCacheResult();
		if(vo.getChartType() != null) {
			if(vo.getChartType().equals("line") || vo.getChartType().equals("bar")
			|| vo.getChartType().equals("stkline") || vo.getChartType().equals("stkarea") 
			|| vo.getChartType().equals("stkbar") || vo.getChartType().equals("mpline") 
			|| vo.getChartType().equals("hbar")) {
				result = widgetRepository.excute(vo.getQuery(), 1);
			} else if(vo.getChartType().equals("table")){
				result = widgetRepository.excute(vo.getQuery(), 3);
			} else {
				result = widgetRepository.excute(vo.getQuery(), 2);
			}
		}
		
		result.setKeys(vo.getKpiKeys());
		result.setValues(vo.getKpiValues());
		result.setThreshold(vo.getThreshold());
		result.setPolling(vo.getPolling());
		cache.setWidgetData(id, result);
	}

}
