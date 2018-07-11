package com.yescnc.core.fm.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.yescnc.core.entity.db.CurAlarmSearchCondVO;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.context.ContextWrapper;
import com.yescnc.core.lib.fm.dao.FmDao;
import com.yescnc.core.lib.fm.util.MsgKey;
import com.yescnc.core.lib.fm.util.MsgResult;
import com.yescnc.core.util.common.FmFoo;
import com.yescnc.core.util.common.LogUtil;
import com.yescnc.core.util.json.JsonResult;

@Component
public class RtrvLocalCurAlarm  
{
	public JsonResult handleMessage(Map<String, Object> message) {
		
		long time = System.currentTimeMillis();
		String result = MsgResult.NOK;
		JsonResult jsonResult = new JsonResult();
		try {
			
			// 1. Figure it out whether query to Local or Remote MS
			//String strReturnFormat = MsgKey.RESULT_FORMAT_JSON;
			HashMap<String, Object> bodyMap = (HashMap<String, Object>) message;
			CurAlarmSearchCondVO condition = (CurAlarmSearchCondVO) bodyMap.get("CurAlarmSearchCondVO");
			/*if ( bodyMap.containsKey(MsgKey.RESULT_FORMAT) ) {
				strReturnFormat = bodyMap.get(MsgKey.RESULT_FORMAT).toString();
			}*/
			
			// 2. Query to Local DB
			//ArrayList<ArrayList<Object>> alJsonLocalEvt = new ArrayList<>();
			//ArrayList<FmEventDto> alObjLocalEvt = new ArrayList<>();
			
			FmDao fmDao = ContextWrapper.getInstance().getFmDaoFromContext();
			ArrayList<FmEventVO> alCurAlarms = fmDao.selectAllUnclearedAlarms( condition );
			addHistoryAlarm(fmDao, alCurAlarms, condition);
			
			
			/*for ( FmEventDto fmEventDto : alCurAlarms ) 
			{
				if ( strReturnFormat.contentEquals(MsgKey.RESULT_FORMAT_OBJ) )
					alObjLocalEvt.add(fmEventDto);
				else
					alJsonLocalEvt.add( FmUtil.parsefmEventDtoToArrayList(fmEventDto) );
			}
			
			if ( strReturnFormat.contentEquals(MsgKey.RESULT_FORMAT_OBJ) )
				bodyMap.put(MsgKey.EVENT_DATA, alObjLocalEvt);
			else
				bodyMap.put(MsgKey.EVENT_DATA, alJsonLocalEvt);
			*/
			FmUtil.sortData(alCurAlarms, "ALARM_TIME",	"DESC");
			
			bodyMap.put(MsgKey.EVENT_DATA, alCurAlarms);
			
			if (alCurAlarms != null) {
				bodyMap.put(MsgKey.EVENT_DATA + ".SIZE", alCurAlarms.size());
			}
			jsonResult.setData(bodyMap);
			jsonResult.setResult(true);
			result = MsgResult.OK;
			
		} catch( Exception e ) 
		{
			LogUtil.warning(e) ;
			//e.printStackTrace();
			jsonResult.setResult(false);
		} finally 
		{
			//jsonResult.setResult();
		}
		
		time = System.currentTimeMillis() - time;
		LogUtil.warning("[RtrvLocalCurAlarm] Time Taken" + time );
		
		return jsonResult;
		
	}

	private void addHistoryAlarm(FmDao fmDao, ArrayList<FmEventVO> alCurAlarms, CurAlarmSearchCondVO condition) 
	{
		if ( FmFoo.IS_SHOW_HIST_IN_CUR_ALARM ) 
		{
			int nHistMax = condition.getnRowCntPerPage() - alCurAlarms.size();
			if ( nHistMax > 0 ) 
			{
				LogUtil.warning("[RtrvLocalCurAlarm.addHistoryAlarm] " + nHistMax + " limited Query Executed"
						+ " ( max : " + condition.getnRowCntPerPage() + ", cur : " + alCurAlarms.size() + " )");
				condition.setnRowCntPerPage(nHistMax);
				ArrayList<FmEventVO> alHistAlarm = fmDao.selectHistoryAlarms(condition);
				alCurAlarms.addAll(alHistAlarm);
			}
		}
	}
	
}
