package com.yescnc.core.fm.action;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.alarm.MyServerType;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.gen.FmEventGenerator;
import com.yescnc.core.lib.fm.util.MessageConstant;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.main.websocket.PushWebSocketController;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.json.JsonResult;

@Component
public class InsertEventHandler {
	private static String MC_IP = null ;
	
	@Autowired
	ApplicationContext context;
	
	@PostConstruct
	public void init() {
		ContextWrapper.context = context;
	}
	
	@Autowired
	PushWebSocketController push;
	
	public void onMessage(JsonResult message) throws Exception {

		LogUtil.info("[InsertEventHandler] onMessage() start !!!!! " );
		try {
			Map<String, Object> body = message.getData();
			FmEventVO event  = (FmEventVO) body.get(MsgKey.EVENT_DATA);
			FmEventGenerator.getInstance().generateEvent(event);
		} catch (Exception e) {
			LogUtil.warning(e);
		}

	}

	public JsonResult handleMessage(JsonResult message) throws Exception {

		LogUtil.info("[InsertEventHandler] handleMessage() start !!!!! " );
		
		String result = MessageConstant.MSG_RESULT_NOK;
		
		getMcIPpddress() ;
		
		try {
			Map<String, Object> body = message.getData();

			LogUtil.info("body =====> " + body);
			
			FmEventVO newEvent  = (FmEventVO) body.get(MsgKey.EVENT_DATA);
			LogUtil.info("[InsertEventHandler] Event : " + newEvent.getDebugString());
			FmEventGenerator.getInstance().generateEvent(newEvent);
			result = MessageConstant.MSG_RESULT_OK;
			//push.handleJsonMessage(message);
		} 
		catch (Exception e) {
			LogUtil.warning(e);
			LogUtil.info("[InsertEventHandler] ERROR : ROROROROROROROROORRORORO" );

			message.setResult(false);
			message.setFailReason("common.message.db.fail");
		} 

		LogUtil.info("[InsertEventHandler] handleMessage() end !!!!! " );
		
		
		
		return message;

	}

	private JsonResult requestToMcServer(JsonResult message) {

		LogUtil.info("[requestToMcServer] before ..") ;
		JsonResult hmResp = null;

		try {
			//hmResp = FmUtil.sendMsgToFmAndRtnMap(message, MyServerType.MC_IP);
		} catch (Exception e1) {
			if (hmResp == null) {
				//hmResp = new JsonResult("app.fm", message.getCommand());
			}
			message.setResult(false);
			LogUtil.warning(e1);
		}

		return hmResp;

	}

	private void getMcIPpddress() {
		
		if (MC_IP == null) {
			MC_IP = FmUtil.getMcIpAddr();
		}
		
		LogUtil.info("[getMcIPpddress]  NC=" + MC_IP );
	}
	
}
