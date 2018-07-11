package com.yescnc.core.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
//@Service
public class ItsmScheduler {
	
	public void init() {
		
	}
	
	@Scheduled(cron = "10 * * * * *")
	public void createAlarm(){
		System.out.println("---------------------------------- job 수행--------------- ");
	}
}
