package com.yescnc.core.scheduler.task;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.os.ResourceDao;
import com.yescnc.core.entity.os.GlobalMemoryVO;
import com.yescnc.core.lib.os.MemoryInfo;
import com.yescnc.core.scheduler.SystemCheckScheduler;

@Component
@Scope("prototype")
public class CoreMemoryCheckTask {

	private static final Logger logger = LoggerFactory.getLogger(CoreMemoryCheckTask.class);

	@Autowired
	MemoryInfo memoryInfo;

	@Autowired
	SystemCheckScheduler systemCheck;
	
	@Autowired
	ResourceDao resourceDao;
	
	@Async
	public void memCheck(boolean save) {
		Optional<GlobalMemoryVO> memory = memoryInfo.getGlobalMemoryInfo();
		if (memory.isPresent()) {
			systemCheck.setRealtimeResource(SystemCheckScheduler.RESOURCE_MEMORY, memory.get());
			if(save){
				resourceDao.insertMemory(memory.get());
			}
		} else {
			logger.debug("memCheck Fail");
		}
	}

}
