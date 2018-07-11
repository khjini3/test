package com.yescnc.core.main.websocket;

import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Component
public class WebsocketEventController extends TextWebSocketHandler {
	
	private static Set<WebSocketSession> clients = Collections.synchronizedSet(new HashSet<WebSocketSession>());
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		clients.add(session);
	}
	
	@Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		clients.remove(session);
    }
	
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
		String yesMsg = message.getPayload();
		//JSONObject result = new JSONObject(yesMsg);
		
		/*try {
			ScriptEngineManager scriptManager = new ScriptEngineManager();
			ScriptEngine scriptEngine = scriptManager.getEngineByName("JavaScript");
			FileInputStream fileInputStream = new FileInputStream("src/main/java/com/yescnc/jarvis/js/javascriptFunc.js");
			BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream));
			scriptEngine.eval(reader);
			 
			Invocable inv = (Invocable) scriptEngine;
			inv.invokeFunction("pushEventHandler", yesMsg);
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		
		synchronized(clients) {
			for(WebSocketSession client : clients) {
				TextMessage pingMessage = new TextMessage(yesMsg);
            	client.sendMessage(pingMessage);
                /*if(!client.equals(session)) {
                    //client.getBasicRemote().sendText(message);
                	TextMessage pingMessage = new TextMessage("test");
                	client.sendMessage(pingMessage);
                }*/
			}
		}
	}
}
