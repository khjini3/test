package com.yescnc.core.fm.action;

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.yescnc.core.constant.MessageKey;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.lib.fm.alarm.EmsInfoList;
import com.yescnc.core.lib.fm.alarm.FmUtil;
import com.yescnc.core.lib.fm.alarm.MyServerType;
import com.yescnc.core.lib.fm.gen.FmEventGenerator;
import com.yescnc.core.lib.fm.util.FmEventId;
import com.yescnc.core.util.common.FmConstant;
import com.yescnc.core.util.common.LogUtil;

@Component
public class GenerateEmsRebuiltEvent {

	public void handleMessage(Map body) throws Exception {

		try {
			
			//Map<String, Object> body = message.getBody();

			//String inputMsg = (String) body.get(MessageKey.INPUT_MSG);
			String inputMsg = (String) body.get(MessageKey.INPUT_MSG);
			// check server type.
			boolean isValid = isValidServerTypeForEmsRebuiltEvent();
//			LogUtil.warning("[GenerateEmsRebuiltEvent] server type["
//					+ MyServerType.SERVER_TYPE + "] is " + (isValid ? "valid" : "invalid")
//					+ ".");
			if (isValid) {
				// wait for a second while mf.oss init.
				Thread.sleep(5000);

				// generate Event.
				//LogUtil.warning("[GenerateEmsRebuiltEvent] generate EMS_REBUILT_EVENT.");
				String strAlarmTime = FmUtil.getCurTimeOfEventTimeFmt();
				generateEmsRebuiltEvent(strAlarmTime);

				//message.setResult(MessageConstant.MSG_RESULT_OK);

			}
		} catch (Exception e) {
			

		}

	}

	private void generateEmsRebuiltEvent(String strAlarmTime) {
		
		String strHostId = getServerHostId();

		FmEventVO event = new FmEventVO();
		
		if(event.getLloc().equals("N/A")) {
			event.setLloc("/");
		}
		
		if(event.getLocationAlias().equals("N/A")) {
			event.setLocationAlias("/");
		}
		
		event.setLvl1Id(EmsInfoList.getMsIdMyself());
		event.setNeType("nms");
		event.setNeVersion("v1");
		event.setEventType(FmConstant.FM_TYPE_EVENT);
		event.setDisplayType(FmConstant.NODISPLAY_DBNOINSERT);
		event.setAlarmTime(strAlarmTime);
		event.setSeverity(FmConstant.FM_SEVERITY_EVENT);
		event.setAlarmId(FmEventId.EMS_REBUILT_EVENT_ID);
		event.setReserveStr(MyServerType.SERVER_TYPE);
		event.setAdditionalText("EMS_START");
		event.setProbcauseStr("REPORT ALARM LIST REBUILT(EMS_START)");
		event.setAlarmPosition("eNB_EMS/" + strHostId + "/EMS_System/ems=1");

		FmEventGenerator.getInstance().generateEvent(event);
	}

	private String getServerHostId() {
		String host_id = "1";
		try {
			host_id = "localhost"; //todo
		} catch (Exception e1) {
			LogUtil.warning(e1);
		}
		return host_id;
	}

	private boolean isValidServerTypeForEmsRebuiltEvent() {
	
		if (MyServerType.MC_ROLE) { // contains MC ( mc,ms / mc / mc,md_xxx )
			return true;
		} else { // MS_SERVER_ONLY
			return true;
		}
	}


}
