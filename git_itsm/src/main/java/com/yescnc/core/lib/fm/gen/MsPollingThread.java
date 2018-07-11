package com.yescnc.core.lib.fm.gen;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.entity.db.MsInfoDto;
import com.yescnc.core.fm.action.PollEventInfo;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.cache.FmEventCache;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;


public class MsPollingThread extends Thread {

	private String strLogPrefix;
	private MsInfoDto msInfoDto;
	private Logger logger;
	private AtomicBoolean isRunnableStatus;
	
	@Autowired
	private PollEventInfo pollEventInfo;
	
	public MsPollingThread(int nMsId, String strSvrIp) {
		this.strLogPrefix = "[Lvl1Id : " + nMsId + "] [ IP_ADDR : " + strSvrIp + "] ";
		this.msInfoDto = new MsInfoDto(nMsId, strSvrIp);
		this.setName("mf.fm.ms.poll");
		this.logger = Logger.getLogger("mf.fm.ms.poll");
		this.isRunnableStatus = new AtomicBoolean(true);
	}

	@Override
	public void run() {

		//MyMessage reqMessage = this.createPollingRqstMessage();

		while (true) {

			try {

				Map<String, Object> hmReqstBody = createPollingRqstMessage();//reqMessage.getBody();

				if (this.isRunnableStatus.get() == false) {
					this.logger.warning(this.strLogPrefix + " Terminate MS Polling Thread");
					break;
				}

				Map<String, Object> respMessage = null;
				try {
					//respMessage = this.sendMessage(reqMessage.getBody());
					respMessage = this.sendMessage(createPollingRqstMessage());
				} catch (Exception e) {
					LogUtil.warning(this.strLogPrefix + " Network communication fail");
					continue;
				}

				if (respMessage == null) {
					this.logger.warning(this.strLogPrefix + respMessage);
					continue;
				}

				if (respMessage == null) {
					this.logger.warning(this.strLogPrefix + " MsgResult NOK");
					continue;
				}

				HashMap<String, Object> hmRespBody = (HashMap<String, Object>) respMessage;
				ArrayList<FmEventVO> alMsPollingResult = (ArrayList<FmEventVO>) hmRespBody.get("EVENT.LIST");
				hmReqstBody.put(MsgKey.CLIENT_ID, hmRespBody.get(MsgKey.CLIENT_ID));
				hmReqstBody.put(MsgKey.SEQ_NO, hmRespBody.get(MsgKey.SEQ_NO));

				List<Long> seqNoList = new ArrayList<>();
				if (null != alMsPollingResult) {
					for (FmEventVO dto : alMsPollingResult) {
						seqNoList.add(dto.getSeqNo());
					}
				}

				LogUtil.info(this.strLogPrefix + " [ClientID] " + hmReqstBody.get(MsgKey.CLIENT_ID) + " [SEQ.NO] "
						+ hmReqstBody.get(MsgKey.SEQ_NO) + " [EventList SeqId:] " + seqNoList);

				if (alMsPollingResult == null)
					continue;

				// Insert Event To Cache
				for (int i = alMsPollingResult.size() - 1; i >= 0; i--) {
					FmEventVO fmEventDto = alMsPollingResult.get(i);
					FmEventCache.getInstance().putEventToCache(this.msInfoDto.getnLvl1Id(), fmEventDto);
				}

				for (FmEventVO fmEventDto : alMsPollingResult)
					FmEventCache.getInstance().putEventToCache(fmEventDto.getLvl1Id(), fmEventDto);

				if (this.msInfoDto.isAliveMs() == false)
					this.msInfoDto.setAliveMs(true);

			} catch (Exception e) {
				LogUtil.warning(e);
				// if ( e.getMessage() != null )
				// this.logger.warning( this.strLogPrefix + e.getMessage() );
				// this.logger.warning( this.strLogPrefix +
				// Arrays.toString(e.getStackTrace()) );
				this.msInfoDto.setAliveMs(false);
			} finally {
				try {
					Thread.sleep(2000);
				} catch (Exception e) {
					LogUtil.warning(e);
				}
			}

		}

	}

	private Map<String, Object> sendMessage(Map<String, Object> hmRqst) throws Exception {

		LogUtil.info("[MsPollingThread] FM sendMessage start..");

		Map<String, Object> myMessage = null;
		try {
			/*
			myMessage = new MyMessage("app.fm", "pollEventInfo");
			myMessage.setBody(hmRqst);
			ApplicationContext context = ApplicationContextUtil.getContext();
			JmsModule jmsModule = (JmsModule) context.getBean("jmsModule");
			MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);
			*/
			myMessage = pollEventInfo.handleMessage(hmRqst);
		} catch (Exception e) {
			LogUtil.warning(e);
		}

		return myMessage;

	}

	private HashMap<String, Object> createPollingRqstMessage() {

		HashMap<Integer, Long> hmSeqByMsId = new HashMap<>();
		hmSeqByMsId.put(this.msInfoDto.getnLvl1Id(), 0l);
		String strLastSeqWithMsId = FmUtil.convertSeqMapToJsonString(hmSeqByMsId);

		//MyMessage mainMessage = new MyMessage("app.fm", "pollEventInfo");
		HashMap<String, Object> bodyMap = new HashMap<String, Object>();

		bodyMap.put(MsgKey.NE_TYPE, "nms");
		bodyMap.put(MsgKey.NE_VERSION, "v1");
		bodyMap.put(MsgKey.MSG_NAME, "PollEventInfo");
		bodyMap.put(MsgKey.DAEMON_ID, FmConstant.CLIENT_DAEMON_MS);
		bodyMap.put("REQUEST.MS_ID", EmsInfoList.getMsIdMyself());

		String localIP = null;
		try {
			localIP = InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			LogUtil.warning(e);
			localIP = "127.0.0.1";
		}
		bodyMap.put(MsgKey.SRC_IP, localIP);
		bodyMap.put(MsgKey.CLIENT_ID, -1);
		bodyMap.put(MsgKey.SEQ_NO, strLastSeqWithMsId);
		//mainMessage.setBody(bodyMap);

		//return mainMessage;
		return bodyMap;
	}

	public MsInfoDto getMsInfoDto() {
		return msInfoDto;
	}

	public void setIsRunnableStatus(boolean isRunnableStatus) {
		this.isRunnableStatus.set(isRunnableStatus);
	}

}
