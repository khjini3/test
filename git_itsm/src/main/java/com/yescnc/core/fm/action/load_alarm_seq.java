/*package com.yescnc.core.fm.action;

import java.util.AbstractList;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Vector;

import org.springframework.stereotype.Component;

import com.yescnc.framework.lib.fm.alarm.AlarmSeqUtil;
import com.yescnc.framework.lib.protocol.jms.DefaultMyHandler;
import com.yescnc.framework.lib.protocol.jms.MessageConstant;
import com.yescnc.framework.lib.protocol.jms.MyMessage;
import com.yescnc.framework.util.log.LogUtil;

@Component
public class load_alarm_seq extends DefaultMyHandler {
	private Timer timer = new Timer();

	@Override
	public MyMessage handleMessage(MyMessage message) throws Exception {

		
		try {
			
			AlarmSeqUtil.loadFromFile();

			int period = 10;
			//Item intervalItem = inputMessage.getMessagePayload().getItemIgnoreCase("interval");
			//if (intervalItem != null) {
			//	period = Integer.parseInt(intervalItem.getQuotedValue());
			//}
			timer.scheduleAtFixedRate(new SaveTask(), 1000L, period * 1000);
			message.setResult(MessageConstant.MSG_RESULT_OK);
		} catch (Exception e) {
			LogUtil.warning(e);
			message.setResult(MessageConstant.MSG_RESULT_NOK);
		}
	
		return message;
	}

	static class SaveTask extends TimerTask {
		public void run() {
			Thread.currentThread().setName("mf.fm");
			LogUtil.info("[DEBUG] SaveTask : AlarmSeqUtil.saveToFile() ");
			AlarmSeqUtil.saveToFile();
		}
	}
}

*/