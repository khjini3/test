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
import com.yescnc.core.entity.os.NetworkInterfaceVO;
import com.yescnc.core.lib.os.NetworkInfo;
import com.yescnc.core.scheduler.SystemCheckScheduler;

@Component
@Scope("prototype")
public class CoreNetworkCheckTask {

	private static final Logger logger = LoggerFactory.getLogger(CoreNetworkCheckTask.class);

	@Autowired
	NetworkInfo networkInfo;

	@Autowired
	SystemCheckScheduler systemCheck;
	
	@Autowired
	ResourceDao resourceDao;
	
	@Async
	public void networkCheck(boolean save) {

		try {
			Optional<List<NetworkInterfaceVO>> networkListOption = networkInfo.getNetworkInterface();
			if (networkListOption.isPresent()) {
				List<NetworkInterfaceVO> networkList = networkListOption.get();
				systemCheck.setRealtimeResource(SystemCheckScheduler.RESOURCE_NETWORK, networkList);
				if(save){
					resourceDao.insertNetwork(networkList);
					/*
					for (NetworkInterfaceVO network : networkList) {
						logger.info(network.toString());
					}
					*/
				}
			} else {
				logger.debug("networkCheck Fail.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
