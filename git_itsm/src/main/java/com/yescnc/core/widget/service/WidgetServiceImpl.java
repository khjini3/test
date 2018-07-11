package com.yescnc.core.widget.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.entity.os.CpuInfoVO;
import com.yescnc.core.entity.os.FileSystemInfoVO;
import com.yescnc.core.entity.os.GlobalMemoryVO;
import com.yescnc.core.entity.os.NetworkInterfaceVO;
import com.yescnc.core.scheduler.SystemCheckScheduler;
import com.yescnc.core.scheduler.WidgetScheduler;
import com.yescnc.core.util.json.JsonCacheResult;
import com.yescnc.core.util.json.JsonResult;

@Service
public class WidgetServiceImpl implements WidgetService {

	private static final Logger logger = LoggerFactory.getLogger(WidgetServiceImpl.class);

	@Autowired
	WidgetScheduler widgetScheduler;
	
	@Autowired
	WidgetCache widgetCache;
	
	@Autowired
	SystemCheckScheduler systemCheckScheduler;
	
	public JsonCacheResult getWidgetData(Integer id) throws Exception {
		// TODO Auto-generated method stub

		JsonCacheResult jsonResult = new JsonCacheResult();
		
		widgetScheduler.createJob(id);
		jsonResult = widgetCache.getWidgetData(id);
		
		/*
		jsonResult.setFailReason("data_strerdsfsdf");
		Thread.sleep(2000);
		logger.info("cache put --> widget id="+id);
		*/
		return jsonResult;
	}

	@Override
	public JsonResult systemMonitoringData(Integer id) {
		// TODO Auto-generated method stub
		JsonResult result = new JsonResult();
		switch(id){
			case SystemCheckScheduler.RESOURCE_CPU : 
				Optional<CpuInfoVO> cpuInfo = systemCheckScheduler.getRealtimeCpu(); 
				if(cpuInfo.isPresent()){
					result.setData("cpu", cpuInfo.get());
					result.setResult(true);
				}
				break;
			case SystemCheckScheduler.RESOURCE_FILESYSTEM: 
				Optional<List<FileSystemInfoVO>> fileSystemInfo = systemCheckScheduler.getRealtimeFileSystem(); 
				if(fileSystemInfo.isPresent()){
					result.setData("fileSystem", fileSystemInfo.get());
					result.setResult(true);
				}
				break;
			case SystemCheckScheduler.RESOURCE_MEMORY: 
				Optional<GlobalMemoryVO> memoryInfo = systemCheckScheduler.getRealtimeMemory(); 
				if(memoryInfo.isPresent()){
					result.setData("memory", memoryInfo.get());
					result.setResult(true);
				}
				break;
			case SystemCheckScheduler.RESOURCE_NETWORK : 
				Optional<List<NetworkInterfaceVO>> networknfo = systemCheckScheduler.getRealtimeNetwork(); 
				if(networknfo.isPresent()){
					result.setData("network", networknfo.get());
					result.setResult(true);
				}
				break;
			default :
				result.setResult(false);
				result.setFailReason("message.not.ready");
		}

		return result;
	}
	
	/*
	@Override
	@Cacheable(value = "widgetJsonResult", key = "#id")
	public JsonResult getWidgetData(Integer id) throws Exception {
		// TODO Auto-generated method stub
		JsonResult jsonResult = new JsonResult();
		jsonResult.setFailReason("data_strerdsfsdf");
		Thread.sleep(2000);
		logger.info("cache put --> widget id="+id);
		return jsonResult;
	}

	@CacheEvict(value = "widgetJsonResult", key = "#id")
	public void ClearWidgetData(Integer id) {
		logger.info("cache clear --> widget id="+id);
	}
	*/

}
