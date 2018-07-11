package com.yescnc.core.main.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yescnc.core.fm.action.PollEventInfo;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.json.JsonResult;

@Component
public class PushWebSocketController extends TextWebSocketHandler {
	
	@Autowired
	private PollEventInfo pollEventInfo;
	private WebSocketSession socketSession;
    private List<WebSocketSession> connectedUsers;
    private String updateTimeInterval;
	private int iUpdateTimeInterval;
    
    public PushWebSocketController() {
        connectedUsers = new ArrayList<WebSocketSession>();
    }
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    	
    	connectedUsers.add(session);
//        System.out.println(session.getId() + " you are connected ");
//        TextMessage textMessage =  new TextMessage("Welcome -- " + session.getId());
        /*
        EventData data = new EventData();
        Object[] wsData = {textMessage};
        data.setData(wsData);
        sendMessageToClient(session, data, true);
        */
//        session.sendMessage(textMessage);
        
        socketSession = session;
    }
    /*
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println(message.getPayload());
        session.sendMessage(message);
    }
    */
    public void handleTextMessage(String message) throws Exception {
       if(null != message && !message.isEmpty()){
    	   TextMessage textMessage =  new TextMessage(message);
    	   
    	   for(int i = 0; i < connectedUsers.size(); i++){
    		   System.out.println(connectedUsers.get(i).getRemoteAddress().getAddress().toString() + " message sending... ");
    	   }
    	   socketSession.sendMessage(textMessage);
       }
    }

	public void handleJsonMessage(JsonResult jsonMessage) throws Exception {
		String message = jsonMessage.getData().get("EVENT.DATA").toString();
		System.out.println(message);
		TextMessage textMessage = new TextMessage(message);

		for (WebSocketSession wsSession : connectedUsers) {
			wsSession.sendMessage(textMessage);
		}
	}
    
    private EventData parseEventData(String data) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return ((EventData) mapper.readValue(data, EventData.class));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
    
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
		/*
    	EventData reqData = parseEventData((String) message.getPayload());
		
		if (reqData == null) {
			//log(session, "reqData(EventData) is invalid");
			return;
		}
		*/
		//onMessageToPoll(null, session); ////////
		
	}
    

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    	session.close();
    	connectedUsers.remove(session);
        System.out.println(session.getId() + " you are disconnected ");
    }
    
    public void updateLastCheckTime(WebSocketSession session, HttpSession tomcatSession, String loginId) {
		Map message = new HashMap();
		message.put("NE.TYPE", "nms");
		message.put("NE.VERSION", "v1");
		message.put("MSG.NAME", "set_last_checkTime");
		message.put("SRC.ID", loginId);
		Map body = new HashMap();
		body.put("SESSION.ID", tomcatSession.getId());
		message.put("BODY", body);
		/*
		try {
			RmiHelper.send(RmiHelper.findURL("us"), message, new RmiListener(session) {
				public boolean init() {
					return false;
				}

				public AbstractList<Map<String, Object>> reset(String command, Serializable args) throws Exception {
					return null;
				}

				public AbstractList<Map<String, Object>> send(Map<String, Object> message) {
					return null;
				}

				public void receive(AbstractList<Map<String, Object>> message) {
					Map resMap = (Map) message.get(0);
					PollingEventController.this.log(this.val$session,
							"UPDATE_LAST_CHECKTIME Result(" + resMap.get("RESULT") + ")");
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
		*/
	}
    
    public EventData retrieveEvent(EventData srcData, WebSocketSession session, HttpSession httpSession)
			throws Exception {
		String seqId = srcData.getSeqNo();
		int clientId = srcData.getClientId();
		String srcId = srcData.getLoginId();
		String srcIp = srcData.getLoginIp();

		EventData data = srcData.clone();
		Map<String, Object> response = null;		
		//MyMessage response = null;
		
		try {
			
			Map<String, Object> body = new HashMap<String, Object>();
			
			body.put(MsgKey.PROC_NAME, "app.fm");	
			
			body.put("SEQ.NO", seqId);
			body.put("CLIENT.ID", Integer.valueOf(clientId));
			body.put("SRC.ID", srcId);
			body.put("SRC.IP", srcIp);
			
			response = pollEventInfo.handleMessage(body);
			/*
			MyMessage sendMessage = new MyMessage("app.fm", POLL_EVENT_INFO);						
			Map<String, Object> body = new HashMap<String, Object>();
			
			body.put(MsgKey.PROC_NAME, "app.fm");	
			
			body.put("SEQ.NO", seqId);
			body.put("CLIENT.ID", Integer.valueOf(clientId));
			body.put("SRC.ID", srcId);
			body.put("SRC.IP", srcIp);
			
			sendMessage.setBody(body);
			
			response = jmsWebModule.sendRequestMessage(sendMessage);
			*/
			response.put("Result", "ok");
			
			
		}catch (Exception e) {
			e.printStackTrace();
			//restResponse.setResult(false);
			//restResponse.setFailReason(e.getMessage());
			response.put("Result", "nok");
			return data;
		}
		
		if (null == response || !response.get("Result").equals("ok")) {
			//restResponse.setFailReason("response.error.null");
			//restResponse.setResult(false);
			
			return data;
		} else {
			//restResponse.setData(result.getBody());
			//restResponse.setResult(true);
			;
		}
		
		
		String result = (String) response.get("Result");
		data.setResState(result);
		if ("OK".equals(result)) {
			Map eventData = response;

			data.setSeqNo((String) eventData.get("SEQ.NO"));
			data.setClientId(((Integer) eventData.get("CLIENT.ID")).intValue());
			//data.setData((Object[]) (Object[]) eventData.get("EVENT.LIST"));
			data.setData((Object[])eventData.get("EVENT.LIST"));

			return data;
		}

		return data;
	}

    
    private void onMessageToPoll(EventData data, WebSocketSession session) throws IOException {
    	System.out.println("[onMessageToPoll]");
		//Map attribute = session.getHandshakeAttributes();
		Map attribute = session.getAttributes();
		HttpSession httpSession = (HttpSession) attribute.get("HTTP_SESSION");

		if(data.getLoginId() == null)
			data.setLoginId((String)attribute.get("USER_ID"));
		
		if(data.getLoginIp() == null)
			data.setLoginIp((String)attribute.get("USER_IP"));
		
		
		EventData events = null;
		try {
			System.out.println("[onMessageToPoll try]");
			events = retrieveEvent(data, session, httpSession);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("[onMessageToPoll exception]");
			e.printStackTrace();
		}
		
		int pollingCnt = -1;
		while (true) {
			System.out.println("[onMessageToPoll loop]");
			try {
				if (!(session.isOpen())) {
					return;
				}
				pollingCnt = ((Integer) attribute.get("POLLING_CNT")).intValue();
				if (pollingCnt >= 2147483647) {
					pollingCnt = 0;
				}
				++pollingCnt;
				if (pollingCnt % this.iUpdateTimeInterval == 0) {
					updateLastCheckTime(session, httpSession, data.getLoginId());
				}
				try {
					events = retrieveEvent(data, session, httpSession);
					String resState = events.getResState();

					if ("OK".equals(resState)) {
						if ((httpSession.getAttribute("SHUTDOWN.FM") != null)
								&& (((Boolean) httpSession.getAttribute("SHUTDOWN.FM")).booleanValue())) {
							Object[] wsExceptionData = createWsExceptionData(1000, null, null, true);
							EventData newData = data.clone();
							newData.setData((Object[]) wsExceptionData);
							sendMessageToClient(session, newData, true);
						}
						httpSession.removeAttribute("SHUTDOWN.FM");
						if (!(isEmptyEvent(events))) {
							sendMessageToClient(session, events);

							attribute.put("POLLING_CNT", Integer.valueOf(pollingCnt));
							return;
						}
						sendPingMessageToClient(session);
					} else {
						httpSession.setAttribute("SHUTDOWN.FM", Boolean.valueOf(true));
						if (resState.contains("Unknown Web Client")) {
							Object[] wsExceptionData = createWsExceptionData(2000, resState, "-", true);
							EventData newData = data.clone();
							newData.setData((Object[]) wsExceptionData);
							sendMessageToClient(session, newData, true);

							attribute.put("POLLING_CNT", Integer.valueOf(pollingCnt));
							return;
						}
						Object[] wsExceptionData = createWsExceptionData(1000, resState, "-", false);
						EventData newData = data.clone();
						newData.setData((Object[]) wsExceptionData);
						sendMessageToClient(session, newData, true);
					}
				} catch (Exception e) {
					e.printStackTrace();
					httpSession.setAttribute("SHUTDOWN.FM", Boolean.valueOf(true));
					String cause = null;
					if (e.getCause() != null) {
						cause = e.getCause().toString();
					} else {
						cause = e.toString();
					}
					Object[] wsExceptionData = createWsExceptionData(1000, e.getMessage(), cause, false);
					EventData newData = data.clone();
					newData.setData((Object[]) wsExceptionData);
					sendMessageToClient(session, newData, true);
				}
				Thread.sleep(2000L);
				//Thread.sleep(30000L);
			} catch (InterruptedException e) {
				e.printStackTrace();

				return;
			} catch (IOException ioe) {
				ioe.printStackTrace();

				return;
			} finally {
				attribute.put("POLLING_CNT", Integer.valueOf(pollingCnt));
			}
		}
	}
    
    private void sendMessageToClient(WebSocketSession session, EventData data) throws IOException {
		sendMessageToClient(session, data, false);
	}

	private void sendMessageToClient(WebSocketSession session, EventData data, boolean bearer) throws IOException {
		TextMessage message = new TextMessage(toJSONString(data));
		session.sendMessage(message);
	}
	
	private String toJSONString(Object obj) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			String a = mapper.writeValueAsString(obj);
			return a;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return obj.toString();
	}
	
    public Object[] createWsExceptionData(int errorCode, String errorMsg, String errorReason, boolean fmState) {
		Object[] data = { "Ws_v1", Integer.valueOf(errorCode), errorMsg, errorReason, Boolean.valueOf(fmState) };
		Object[] wsExceptionData = { data };
		return wsExceptionData;
	}
    
    private void sendPingMessageToClient(WebSocketSession session) throws IOException {
		TextMessage pingMessage = new TextMessage("PING");
		session.sendMessage(pingMessage);
	}
    
    private boolean isEmptyEvent(EventData eventData) {
		Object[] data = eventData.getData();

		return ((data == null) || (data.length == 0));
	}
}
