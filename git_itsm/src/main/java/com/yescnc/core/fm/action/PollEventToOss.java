package com.yescnc.core.fm.action;

import java.util.Map;

import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.lib.fm.alarm.AbstPollEvent;
import com.yescnc.core.lib.fm.cache.FmClientCache;
import com.yescnc.core.lib.fm.service.FmDbService;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmFoo;




public class PollEventToOss extends AbstPollEvent {

	@Override
	protected FmClientVO getLoginedFmClientDto(Map<String, Object> message) throws Exception {
		Map body = (Map) message ;
		int nClientType = (int) body.get(MsgKey.DAEMON_ID);
		return FmClientCache.getInstance().getClientDtoByClientType(nClientType);
	}

	@Override
	protected FmClientVO processClientLogin(Map<String, Object> message) throws Exception {
		return FmDbService.processOssClientLogin();
	}
	@Override
	protected int getPollingResponseMaxSize()
	{
		return FmFoo.DEAMON_POLL_EVENT_RESPONSE_MAX_SIZE;
	}
}
