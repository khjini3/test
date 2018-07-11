package com.yescnc.jarvis.tickerManager.task;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;

import com.yescnc.core.main.websocket.WebsocketEventController;

@Service
public class TickerScheduler {
	@Autowired
	WebsocketEventController websocketEventController;
	
	@Scheduled(cron="0 10 0 * * *")
	public void checkScrollingList() {
		String message = "getTickerScrollingMessage";
		TextMessage textMessage = new TextMessage(message);
		try {
			websocketEventController.handleTextMessage(null, textMessage);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Scheduled(cron="1 10 0 * * *")
	public void checkTickerList() {
		String message = "getTickerList";
		TextMessage textMessage = new TextMessage(message);
		try {
			websocketEventController.handleTextMessage(null, textMessage);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
