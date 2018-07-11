package com.yescnc.core.fm.action;

import java.util.HashMap;
import java.util.Map;

import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.lib.fm.alarm.AbstPollEvent;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;


public class PollEventToWeb extends AbstPollEvent
{

	@Override
	protected FmClientVO getLoginedFmClientDto(Map<String, Object> message) throws Exception
	{
		@SuppressWarnings("unchecked")
		HashMap<String, Object> hmBody = (HashMap<String, Object>) message;
		int nClientId = (int) hmBody.get(MsgKey.CLIENT_ID);
		return FmClientCache.getInstance().getClientDtoById(nClientId);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	protected FmClientVO processClientLogin(Map<String, Object> message) throws Exception
	{
		HashMap<String, Object> hmBody = (HashMap<String, Object>) message;
		FmClientVO dto = new FmClientVO() ;
		int nClientId = -1 ;
		String strSeqId    = null ;
		if (hmBody.get(MsgKey.CLIENT_ID) != null)
		{
			nClientId = (int) hmBody.get(MsgKey.CLIENT_ID);
			strSeqId    = (String) hmBody.get(MsgKey.SEQ_NO);
			dto.setClientId(nClientId);
			dto.setLastSeqWithMsId(strSeqId);
			LogUtil.warning("Unknown Web Client ID is delivered. Client ID is = " + nClientId + ", SEQ_NO is = " + strSeqId);
			return dto ;
		}
		else
		{
			LogUtil.warning("Unknown Web Client ID is delivered. Client ID is " + nClientId);
			throw new Exception("Unknown Web Client ID is delivered.");
		}
		
	}

	@Override
	protected int getPollingResponseMaxSize()
	{
		return FmFoo.CLIENT_POLL_EVENT_RESPONSE_MAX_SIZE;
	}
}
