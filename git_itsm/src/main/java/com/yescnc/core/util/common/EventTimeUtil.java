package com.yescnc.core.util.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class EventTimeUtil {

	public static String getCurTimeOfEventTimeFmt() {
		SimpleDateFormat SDF_FM_FORMATTER = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return SDF_FM_FORMATTER.format(Calendar.getInstance().getTime());
	}
}
