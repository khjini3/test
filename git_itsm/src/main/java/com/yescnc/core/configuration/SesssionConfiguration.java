package com.yescnc.core.configuration;

import javax.servlet.http.HttpSessionListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SesssionConfiguration {

	@Autowired
	SessionListener sessionListener;
	
	@Bean
    public ServletListenerRegistrationBean<HttpSessionListener> SessionListener()
    {
        return new ServletListenerRegistrationBean<HttpSessionListener>(sessionListener);
    }
}

