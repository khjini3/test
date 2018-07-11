package com.yescnc.core.widget.service;

import java.time.LocalTime;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.yescnc.core.db.widget.KpiWidgetDao;
import com.yescnc.core.db.widget.WidgetRepository;
import com.yescnc.core.entity.db.KpiWidgetVO;
import com.yescnc.core.util.json.JsonCacheResult;

@Component("widgetCache")
@Scope("singleton")
public class WidgetCache {

	private static final Logger logger = LoggerFactory.getLogger(WidgetCache.class);
	
	@Autowired
	KpiWidgetDao kpiWidgetDao;
	
	@Autowired
	WidgetRepository widgetRepository;
	
	private LoadingCache<Integer, JsonCacheResult> cache;
	
	
	@PostConstruct
	public void init(){
			
		cache =	CacheBuilder.newBuilder()
				.maximumSize(100)
				.expireAfterAccess(10, TimeUnit.MINUTES)
				//.removalListener(null)
				.build(
						new CacheLoader<Integer, JsonCacheResult>(){

							@Override
							public JsonCacheResult load(Integer id) throws Exception {
								// TODO Auto-generated method stub
								logger.info("CacheLoader(not Schedule) load id="+id);
								
								KpiWidgetVO vo = kpiWidgetDao.selectKpiWidgetMap(id);
								JsonCacheResult result = new JsonCacheResult();
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
								
								result.setKeys(vo.getKpiKeys());
								result.setValues(vo.getKpiValues());
								result.setThreshold(vo.getThreshold());
								result.setPolling(vo.getPolling());
								
								return result;
							}
						});
	}
	
	public JsonCacheResult loadWidgetData(Integer id){
		
		JsonCacheResult result = new JsonCacheResult();
		logger.debug("Cache load ---> CacheSize :"+cache.size());
		
		try {
			Thread.sleep(1000*id);
			logger.debug("Cache load ---> Widget ID :"+id);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		result.setUpdateAt(LocalTime.now());
		return result;
	}
	
	public JsonCacheResult getWidgetData(Integer id){
		JsonCacheResult result = new JsonCacheResult();
		try {
			result = cache.get(id);
			result.setReadAt(LocalTime.now());
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
	
	public void setWidgetData(Integer id, JsonCacheResult result){
		cache.put(id, result);
	}
}
