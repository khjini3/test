package com.yescnc.core.scheduler.task;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.os.ResourceDao;
import com.yescnc.core.entity.os.FileSystemInfoVO;
import com.yescnc.core.lib.os.FileSystemInfo;
import com.yescnc.core.scheduler.SystemCheckScheduler;

@Component
@Scope("prototype")
public class CoreFileSystemCheckTask {

	private static final Logger logger = LoggerFactory.getLogger(CoreFileSystemCheckTask.class);

	@Autowired
	FileSystemInfo fileSystemInfo;

	@Autowired
	SystemCheckScheduler systemCheck;
	
	@Autowired
	ResourceDao resourceDao;
	
	@Async
	public void fileSystemCheck(boolean save) {
		Optional<List<FileSystemInfoVO>> fileListOption = fileSystemInfo.getNetworkInterface();
		if (fileListOption.isPresent()) {
			List<FileSystemInfoVO> fileList = fileListOption.get();
			systemCheck.setRealtimeResource(SystemCheckScheduler.RESOURCE_FILESYSTEM, fileList);
			if(save){
				resourceDao.insertFileSystem(fileList);
			}
		} else {			
			logger.debug("fileSystemCheck Fail");
		}
	}
}
