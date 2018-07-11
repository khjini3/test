package com.yescnc.core.util.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {
	
	private static final DateTimeFormatter  defaultDateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	
	public static String getCurrentTime() {
		SimpleDateFormat defaultFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return defaultFormat.format(new Date());
	}

	public static String format() {
		long time = System.currentTimeMillis();
		return format(time, null);
	}

	public static String format(long time) {
		return format(time, null);
	}

	public static String format(long time, String format) {
		SimpleDateFormat defaultFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat dateFormat = (format == null) ? defaultFormat : new SimpleDateFormat(format);
		TimeZone timeZone = TimeZone.getDefault();
		dateFormat.setTimeZone(timeZone);
		Date date = new Date(time);

		return (dateFormat.format(date));
	}

	public static Date parse() throws ParseException {
		Date date = new Date();
		return parse(date.toString(), null);
	}

	public static Date parse(String time) throws ParseException {
		return parse(time, null);
	}

	public static Date parse(String time, String format) throws ParseException {
		SimpleDateFormat defaultFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat dateFormat = (format == null) ? defaultFormat : new SimpleDateFormat(format);
		TimeZone timeZone = TimeZone.getDefault();
		dateFormat.setTimeZone(timeZone);

		return (dateFormat.parse(time));
	}
	
	public static String getCurrentDateString()
	{
		return getDateString(System.currentTimeMillis()) ;
	}
	
	public static String getDateString(long ms)
	{
		SimpleDateFormat dateFormat = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss") ;
		return dateFormat.format(new Date(ms)) ;
	}
	
	public static Date getDbInsertZeroSecond() throws ParseException{
		ZonedDateTime zTime = ZonedDateTime.now().withSecond(0);
		return DateUtil.parse(zTime.format(defaultDateFormat));
	}
}
