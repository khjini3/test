package com.yescnc.core.scheduler.task;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.os.ResourceDao;
import com.yescnc.core.entity.os.CpuInfoVO;
import com.yescnc.core.lib.os.CpuInfo;
import com.yescnc.core.scheduler.SystemCheckScheduler;

@Component
@Scope("prototype")
public class CoreCpuCheckTask {

	private static final Logger logger = LoggerFactory.getLogger(CoreCpuCheckTask.class);

	@Autowired
	CpuInfo cpuInfo;

	@Autowired
	ResourceDao resourceDao;
	
	@Autowired
	SystemCheckScheduler systemCheck;
	
	@Async
	public void cpuCheck(boolean save) {
		Optional<CpuInfoVO> cpu = cpuInfo.getCpuInfo();
		if (cpu.isPresent()) {
			systemCheck.setRealtimeResource(SystemCheckScheduler.RESOURCE_CPU, cpu.get());
			if(save){
				resourceDao.insertCpu(cpu.get());
			}
		} else {
			logger.debug("cpuCheck Fail");
		}
	}
}
