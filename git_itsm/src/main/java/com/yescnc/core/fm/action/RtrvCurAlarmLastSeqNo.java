package com.yescnc.core.fm.action;


import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.util.AbstractList;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.yescnc.core.entity.db.CurAlarmSearchCondVO;
import com.yescnc.core.entity.db.FmClientVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.alarm.MyServerType;
import com.yescnc.core.lib.fm.service.FmDbService;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.lib.fm.util.MsgResult;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.json.JsonResult;

@Component
public class RtrvCurAlarmLastSeqNo {
	private static final boolean MCMS_SERVER = MyServerType.MCMS_INTEGRATED_SERVER;	
	private static final String CUR_ALARM_SEARCH_COND_DTO = "CurAlarmSearchCondVO";
	
	public JsonResult handleMessage(Map<String, Object> message) {
		
		JsonResult jsonResult = new JsonResult();
		long time = System.currentTimeMillis();
		String result = MsgResult.NOK;
		int nLocalMsId = EmsInfoList.getMsIdMyself();
		String maxSeq = null;
		int clientId = -1;
		
		try{
			FmClientVO fmClientDto = FmDbService.processWebClientLogin(message);
			String strLastSeqWithMsId = fmClientDto.getLastSeqWithMsId();
			HashMap<Integer, Long> hmLastSeqMap = FmUtil.convertJsonStringToSeqMap(strLastSeqWithMsId);
			maxSeq = FmUtil.convertSeqMapToJsonString(hmLastSeqMap);
			clientId = fmClientDto.getClientId();

		}catch(Exception e){
			LogUtil.info("get hmLastSeqMap is fail ====>" +e.getMessage());
			jsonResult.setResult(false); 
			return jsonResult;
		}
		
		// 1. Figure it out whether query to Local or Remote MS
		HashMap<String, Object> bodyMap = (HashMap<String, Object>) message;
		CurAlarmSearchCondVO condition = getConditionObj( bodyMap);
		
		// Checking mf.oss : mf.fm sends mf.oss all of the data
		boolean isRequestFromOss = !bodyMap.containsKey(MsgKey.SRC_ID);
		if (isRequestFromOss) {
			condition.setnRowCntPerPage(-1); // -1 is "all"
		}
		
		bodyMap.put(CUR_ALARM_SEARCH_COND_DTO, condition);
		
		int maxLimit = condition.getnRowCntPerPage();
		LogUtil.warning("[RtrvCurAlarmLastSeqNo] The number of records to retrieve : "
				+ (maxLimit == -1 ? "all" : maxLimit));
		
		String strReturnFormat = MsgKey.RESULT_FORMAT_JSON;
		/*
		if ( bodyMap.containsKey(MsgKey.RESULT_FORMAT) ) 
		{
			strReturnFormat = bodyMap.get(MsgKey.RESULT_FORMAT).toString();
		}
		*/
		// case of "mc,ms" one-server
		//if (MCMS_SERVER)
		if (true)
		{
			LogUtil.warning("[RtrvCurAlarmLastSeqNo] Retriving from local: " ) ;
			RtrvLocalCurAlarm localAlarm = new RtrvLocalCurAlarm();
			JsonResult  handleMessage = localAlarm.handleMessage(message);
			bodyMap = (HashMap<String, Object>) handleMessage.getData();
			bodyMap.remove(CUR_ALARM_SEARCH_COND_DTO);
			List<FmEventVO> msData = (List<FmEventVO>) bodyMap.get(MsgKey.EVENT_DATA);
			if (null != msData)
			{
				bodyMap.put(MsgKey.EVENT_DATA , msData);//convertData( msData, strReturnFormat));
				if (msData != null) {
					bodyMap.put(MsgKey.EVENT_DATA + ".SIZE", msData.size());
				}
			}
			time = System.currentTimeMillis() - time;
			LogUtil.warning("[RtrvCurAlarmLastSeqNo] Time Taken" + time );
			
			bodyMap.put(MsgKey.SEQ_NO, (null == maxSeq)? "": maxSeq);
			bodyMap.put(MsgKey.CLIENT_ID, clientId);
			
			LogUtil.info("[RtrvCurAlarmLastSeqNo] Result bodyMap=" + bodyMap );
			return handleMessage;
		}
		
		else
		{
			LogUtil.warning("[RtrvCurAlarmLastSeqNo] Retriving from Large Scale MS" ) ;
			
			/**********
			try
			{
				int totalRecordCount = 0;
				Map<Integer, List<FmEventDto>> msLevelData = new HashMap<Integer, List<FmEventDto>>();
				MyMessage response = FmUtil.sendMsgToFmAndRtnMap( crteRqstMap(message), "");
				Map<String, Object> bodyList = (Map<String, Object>) respList.getBody();
				ArrayList<FmEventDto> alarms = (ArrayList<FmEventDto>) bodyList.get(MsgKey.EVENT_DATA) ;
				
				for (Map<String, Object> response  : alarms)
				{
					try
					{
						Integer level1Id = (Integer) response.get("level1_id");
						String responseResult = "" + response.get(MsgKey.RESULT);
						if(  MsgResult.OK.equalsIgnoreCase(responseResult) )
						{
							HashMap<String, Object> tempBody =  (HashMap<String, Object>) response.get(MsgKey.BODY);
							List<FmEventDto> msData = (List<FmEventDto>) tempBody.get(MsgKey.EVENT_DATA);
							if (null != msData)
							{
								msLevelData.put(level1Id, msData);
								totalRecordCount = totalRecordCount + msData.size();
								LogUtil.warning("[RtrvCurAlarm] EVENT DATA Size [Level1ID=" + level1Id + "],[Size=" +msData.size() +"]");
							}
						}
						else
						{
							LogUtil.warning("[RtrvCurAlarm] Response Dropped due to error: [Level1ID=" + level1Id + "],[Result=" +responseResult +"]");
						}
					} catch (Exception e)
					{
						e.printStackTrace();
					}
				}
				
				// 4. Take top N records
				int nRecordCount = (0 < maxLimit && maxLimit < totalRecordCount) ? maxLimit : totalRecordCount;
				LogUtil.warning("[RtrvCurAlarm] Total number of records : " + nRecordCount);
				List<FmEventDto> eventData = FmUtil.mergeData(msLevelData, "ALARM_TIME", "DESC", nRecordCount);
				
				bodyMap.remove(CUR_ALARM_SEARCH_COND_DTO);
				bodyMap.put(MsgKey.EVENT_DATA, convertData( eventData , strReturnFormat));
				if (eventData != null) {
					bodyMap.put(MsgKey.EVENT_DATA + ".SIZE", eventData.size());
				}
				
				result = MsgResult.OK;
				message.put(MsgKey.RESULT, result);
				
			} catch (Exception e)
			{
				e.printStackTrace();
			}
			AbstractList<Map<String, Object>> response = new ArrayList<Map<String, Object>>(1);
			response.add(message);
			time = System.currentTimeMillis() - time;
			LogUtil.warning("[RtrvCurAlarm-main] Time Taken" + time );
			
			return response;
			******/
			
			return null ;
				
		}
		
	}
	

	private CurAlarmSearchCondVO getConditionObj(HashMap<String, Object> bodyMap)
	{
		/**
		// max=2000, isTargetAll=false, isEmsEventOnly=true, alLvl3Id=[]}
		 * isTargetAll is True,then all Target [ default value: isEmsEventOnly = false,alLvl3Id = null]
		 * 
		 * isTargetAll is false, then need to check ems or target level or both.
		 * 
		 */
		
		LogUtil.warning("[RtrvCurAlarm] input: " + bodyMap) ;
		CurAlarmSearchCondVO object = new CurAlarmSearchCondVO();
		Integer maxLimit = (Integer) bodyMap.get("max");
		if( null == maxLimit)
		{
			maxLimit = 2000;
		}
		object.setnRowCntPerPage(maxLimit);
		
		if(null != bodyMap.get("lastSeq")){
			Integer lastSeq = (Integer) bodyMap.get("lastSeq");
			object.setLastSeq(lastSeq);
		}
		
		Boolean isAllTarget = (Boolean) bodyMap.get("isTargetAll");
		if( null == isAllTarget )
		{
			isAllTarget = true;
		}
		
		if( isAllTarget )
		{
			return object;
		}
		else
		{
			Boolean isEmsEventOnly = (Boolean) bodyMap.get("isEmsEventOnly");
			if( null == isEmsEventOnly )
			{
				isEmsEventOnly = false;
			}
			ArrayList<Integer> alLvl3Id =   (ArrayList<Integer>) bodyMap.get("alLvl3Id");
			if( null == alLvl3Id )
			{
				alLvl3Id = new ArrayList<Integer>(); 
			}
			// if EMS event, then add level3 id -1 in list.
			if( isEmsEventOnly)
			{
				alLvl3Id.add(-1);
			}
			
			if( !alLvl3Id.isEmpty())
			{
				object.setAlLvl3Ids(alLvl3Id);
			}
		}
		
		
		
		
		return object;
	}


	private Object convertData(List<FmEventVO> alCurAlarms,String strReturnFormat)
	{
		if (strReturnFormat.contentEquals(MsgKey.RESULT_FORMAT_OBJ))
		{
			return alCurAlarms;
		} 
		else
		{
			ArrayList<Object> alJsonLocalEvt = new ArrayList<>();
			for (FmEventVO fmEventDto : alCurAlarms)
			{
				alJsonLocalEvt.add(FmUtil.parsefmEventDtoToJsonString(fmEventDto));
			}
			return alJsonLocalEvt;
		}

	}


	private JsonResult crteRqstMap(JsonResult message) 
	{
		//JsonResult retMessage = new JsonResult(); //("", "rtrvLocalCurAlarm") ;
		Map<String, Object> body = new HashMap<String, Object>() ; ;
		
		body.put( MsgKey.NE_TYPE , "nms" );
		body.put( MsgKey.NE_VERSION, "v1" );
		body.put( MsgKey.MSG_NAME, "rtrvLocalCurAlarm" );
		body.put( "REQUEST.MS_ID", EmsInfoList.getMsIdMyself() );
		try
		{
			body.put( MsgKey.SRC_IP, Inet4Address.getLocalHost().getHostAddress() );
		} catch (UnknownHostException e) {
			LogUtil.warning(e);
			//e.printStackTrace();
		}
		
		message.setData(body);
		return message;
		
	}
	
}

