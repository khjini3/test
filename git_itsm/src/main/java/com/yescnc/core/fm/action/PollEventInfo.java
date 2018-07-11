package com.yescnc.core.fm.action;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yescnc.core.lib.fm.alarm.AbstPollEvent;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.util.MessageConstant;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.lib.fm.util.MsgResult;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;

@Component
public class PollEventInfo {
	
	public Map<String, Object> handleMessage(Map<String, Object> message) throws Exception {

		LogUtil.warning("[PollEventInfo] Start....") ;
		
		try
		{
			//start_fm_svr.FM_INIT_CDL.await();///
			//svr.handleMessage();
		} 
		catch (Exception e)
		{
			return FmUtil.getRspnsMsgMap(message,	MessageConstant.MSG_RESULT_NOK,
					"[Error] The server initialization is in progress.");
		}
		
		AbstPollEvent abstPollEvent = null;
		
		Map   body = message ;
		
		if (body != null && body.containsKey(MsgKey.DAEMON_ID))
		{

			int nDaemonId = Integer.parseInt(body.get(MsgKey.DAEMON_ID).toString());
			
			
			if (nDaemonId == FmConstant.CLIENT_DAEMON_MS)
			{
				abstPollEvent = new PollEventToMs();
			}
			
			else if (nDaemonId == FmConstant.CLIENT_DAEMON_MD)
			{
				abstPollEvent = new PollEventToOss();
			} else if (nDaemonId == FmConstant.CLIENT_DAEMON_SVC)
			{
				abstPollEvent = new PollEventToSvc();
			}  
			
			else
			{
				String strMsg = "[PollEventInfo] Unknow Daemon Request is delivered";
				LogUtil.warning(strMsg);
				return FmUtil.getRspnsMsgMap(message, MsgResult.NOK, strMsg);
			}

		} 
		else
		{
			abstPollEvent = new PollEventToWeb() ;
		}

		Map<String, Object> response = null;
		try
		{
			response = abstPollEvent.getEventsFromCache(message);
		} catch (Exception e) {
			response = FmUtil.getRspnsMsgMap(message, MsgResult.NOK,"[Error] Unknown Client ID is delivered");

			// print Exception Info.
			String strExceptionMessage = "" + e.getMessage();
			if (strExceptionMessage.indexOf("Unknown") >= 0)
			{
				LogUtil.warning("[PollEventInfo][INFO] " + e.getMessage());
			} else
			{
				LogUtil.warning(e);
				//e.printStackTrace();
			}
		}
		
		LogUtil.warning("[PollEventInfo] info....Completed.") ;
		return response;

	}
}
