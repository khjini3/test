/**
 * 
 */
package com.yescnc.core.lib.fm.healling;

import java.util.HashMap;
import java.util.Map;

import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.util.EventProcessConstants;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.util.common.LogUtil;


public class HealingDispatcher implements Runnable
{

	private static final String DEBUG_PREFIX = "[HealingDispatcher] ";
	private static final String HEALING_HANDLER_NAME = "healingHandler";
	private Map<String, Object> headlingEventSet;
	

	public HealingDispatcher(Map<String, Object> headlingEventSet)
	{
		this.headlingEventSet = headlingEventSet;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Runnable#run()
	 */
	@Override
	public void run()
	{
		try
		{
			Thread.currentThread().setName("app.fm.HealingDispatcher");
			sendHealingReqToMcServer(headlingEventSet);

		} catch (Exception e)
		{
			e.printStackTrace();
		}

	}

	private void sendHealingReqToMcServer(Map<String, Object> eventSet)
	{

		LogUtil.warning( DEBUG_PREFIX + " sendHealingReqToMcServer : start ....");
		
		try
		{
/*			
			Map<String, Object> body = getReqMessage(eventSet);
			
			Map<String, Object> myMessage = new MyMessage("app.fm", HEALING_HANDLER_NAME);
			myMessage.setBody(body);

			Map<String, Object> myMessage = null;
			// MC 서버의 app.fm 으로 전상 하여야 하낟.
			//
			//MyMessage resMessage = jmsModule.sendRequestMessage(myMessage);
			LogUtil.warning("[sendHealingReqToMcServer][execute] response completed : " + resMessage);

			if (resMessage != null && resMessage.getResult().equalsIgnoreCase(MsgResult.OK))
				LogUtil.info( DEBUG_PREFIX + "sendHealingReqToMcServer : "+ MsgResult.OK);
			else
				LogUtil.warning( DEBUG_PREFIX + " sendHealingReqToMcServer : Response null or empty");
			*/
		} 
		
		catch (Exception e)
		{
			LogUtil.warning( DEBUG_PREFIX + "CMDACTION RMI log : Fail");
			e.printStackTrace();
		}
	

	}

	/**
	 * Generates
	 * 
	 * @param eventSet
	 * @return
	 */
	private Map<String, Object> getReqMessage(Map<String, Object> eventSet)
	{

		FmEventVO fmEventDto = (FmEventVO) eventSet.get(EventProcessConstants.EVENT);
		String ne = String.valueOf(fmEventDto.getLvl1Id()) + "."
				+ String.valueOf(fmEventDto.getLvl2Id()) + "."
				+ String.valueOf(fmEventDto.getLvl3Id());

		LogUtil.info( DEBUG_PREFIX + "Healing Dispatch Process run for "
				+ fmEventDto.getAlarmId() + " dn:" + ne);

		Map<String, Object> message = new HashMap<String, Object>();
		message.put(MsgKey.NE_TYPE, "nms");
		message.put(MsgKey.NE_VERSION, "v1");
		message.put(MsgKey.MSG_NAME, HEALING_HANDLER_NAME);
		message.put(HealingConstants.GET_TYPE, HealingConstants.GET_TYPE_NOMAL);
		message.put(MsgKey.FUNCTION_TYPE, "menu.fm");
		message.put("ReqType", "CMDACTION");
		message.put("Status", "Activated");
		Map<String, Object> body = new HashMap<String, Object>();
		body.put("eventSet", eventSet);
		body.put("dn", ne);
		message.put(MsgKey.BODY, body);
		return message;
	}

}
