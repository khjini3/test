package com.yescnc.core.lib.fm.alarm;

public class NmsAlarmInfo {
	final public static String EMS_RESTART = "ems_restart";
	final public static String PROCESS_RESTART = "process_restart";
	final public static String PROCESS_STOP = "process_stop";
	final public static String NETWORK_RECOVERED = "network_recovered";
	final public static String HDD_FULL = "hdd_full";
	/*
	private static int[] nms_level = {-1,-1,-1 };
	private static String nmsDn = "";
	private static IAlarmIdConvertor convertor = null;
	
	static 
	{
		setNmsDn( MyI18N.getString( "nms_alarm_info", "nms_dn" ) );
		setConvertor();
	}

	public static void setAlarmIdConvertor( IAlarmIdConvertor convertor )
	{
		NmsAlarmInfo.convertor = convertor;
	}
	
	public static void setConvertor()
	{
		String convertorName = MyI18N.getString( "nms_alarm_info", "alarmIdConvertor" );
		
		System.out.println("==== set Convertor : " + convertorName);

		if( !"".equals( convertorName ) ) {
			convertor = (IAlarmIdConvertor)ConfigUtil.newInstance( convertorName );
		    System.out.println("set Convertor : " + convertor);
		}
	}
	
	public static String getAlarmId(int severity, int alarmId, String desc) {
		if( convertor != null )
			return convertor.getAlarmId(severity,alarmId,desc);
		else
			return "" + alarmId;
	}
	
	public static void setNmsDn( String dn )
	{
		if( dn != null && !"".equals( dn ) )
		{
			String[] ids = dn.split("\\.");
			nmsDn = dn;
			for( int i=0; i<ids.length; i++)
			{
				if( i>2 )
					break;
				
				nms_level[i] = Integer.parseInt(ids[i]);
			}			
		}
	}

	public static int[] getNmsIntDn()
	{
		return nms_level;
	}

	public static String getNmsDn()
	{
		return nmsDn;
	}

	public static String getNmsAlarmHandler( String type ) {
		return MyI18N.getString( "nms_alarm_info", type ) ;
	}*/
}
