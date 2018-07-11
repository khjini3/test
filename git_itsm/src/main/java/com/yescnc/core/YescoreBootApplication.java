package com.yescnc.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.yescnc.core.fm.action.RtrvCurAlarmLastSeqNo;

@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
@EnableScheduling
@EnableAsync
@ComponentScan({"com.yescnc.core","com.yescnc.jarvis","com.yescnc.project"})
public class YescoreBootApplication extends SpringBootServletInitializer {

	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(YescoreBootApplication.class);
    }
	
	public static void main(String[] args) {
		SpringApplication.run(YescoreBootApplication.class, args);
	}
	
	@Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        return executor;
    }
	
	@Bean
	public RtrvCurAlarmLastSeqNo rtrvCurAlarmLastSeqNo() {
		RtrvCurAlarmLastSeqNo rtrvCurAlarmLastSeqNo  = new RtrvCurAlarmLastSeqNo();
		return rtrvCurAlarmLastSeqNo;
	}
}
