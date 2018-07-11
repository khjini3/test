package com.yescnc.core.fm.action;

import java.util.Map;

import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.lib.fm.alarm.AbstPollEvent;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.service.FmDbService;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmFoo;



public class PollEventToMs extends AbstPollEvent {

	@Override
	protected FmClientVO getLoginedFmClientDto(Map<String, Object> message) throws Exception {
		Map body = (Map) message;
		String strIpAddr = body.get(MsgKey.SRC_IP).toString();
		return FmClientCache.getInstance().getClientDtoByIpAddr(strIpAddr);
	}

	@Override
	protected FmClientVO processClientLogin(Map<String, Object> message) throws Exception {
		return FmDbService.processMsClientLogin(message);
	}

	@Override
	protected int getPollingResponseMaxSize()
	{
		return FmFoo.DEAMON_POLL_EVENT_RESPONSE_MAX_SIZE;
	}

	
}
