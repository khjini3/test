package com.yescnc.core.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.yescnc.core.main.websocket.PollingEventController;
import com.yescnc.core.main.websocket.PushWebSocketController;
import com.yescnc.core.main.websocket.WebsocketEventController;
import com.yescnc.core.main.websocket.WsHttpSessionHandshakeInterceptor;

import com.yescnc.core.lib.fm.gen.start_fm_svr;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	@Autowired
	private PushWebSocketController pushWebSocketController;
	
	@Autowired
	private PollingEventController pollingEventController;
	
	@Autowired
	private WebsocketEventController websocketEventController;
	
	@Autowired
	private start_fm_svr svr;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		//registry.addHandler(pushWebSocketController, "/pushEvent").setAllowedOrigins("*");
		registry.addHandler(pollingEventController, "/pollingEvent").addInterceptors(interceptor()).withSockJS();
		registry.addHandler(pushWebSocketController, "/pushEvent").withSockJS().setClientLibraryUrl("/dist/plugins/sockjs/sockjs-1.1.1.min.js");
		//registry.addHandler(websocketEventController, "/websocketEvent").addInterceptors(interceptor()).withSockJS();
		registry.addHandler(websocketEventController, "/websocketEvent").withSockJS().setClientLibraryUrl("/dist/plugins/sockjs/sockjs-1.1.1.min.js");
		
		try {
			svr.handleMessage();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Bean
	public WsHttpSessionHandshakeInterceptor interceptor(){
		return new WsHttpSessionHandshakeInterceptor();
	}
}
