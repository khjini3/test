package com.yescnc.core.util.common;

public class FmConstant {

  public static final String STR_EMPTY = "";
  public static final String STR_NA = "N/A";
	
	
  // ALARM GROUP
  public static final int GROUP_COMM = 1;
  public static final int GROUP_PROC = 2;
	public static final int GROUP_ENV = 3;
	public static final int GROUP_QOS = 4;
	public static final int GROUP_EQUIP = 5;
	public static final int GROUP_ETC = 12;
	
  // ALARM TYPE
  public static final int FM_TYPE_ALARM = 1;
  public static final int FM_TYPE_EVENT = 2;
  public static final int FM_TYPE_FAULT = 3;
  public static final int FM_TYPE_Message = 4;

  // ALARM SEVERITY
  public static final int FM_SEVERITY_CLEARED = 0;
  public static final int FM_SEVERITY_CRITICAL = 1;
  public static final int FM_SEVERITY_MAJOR = 2;
  public static final int FM_SEVERITY_MINOR = 3;
  public static final int FM_SEVERITY_WARNING = 4;
  public static final int FM_SEVERITY_INDETERMINATE = 5;
  public static final int FM_SEVERITY_EVENT = 6;
  public static final int FM_SEVERITY_INFORMATION = 7;
  public static final int FM_SEVERITY_FAULT = 8;

  // ALARM SEVERITY CLEAR
	public final static int SEVERITY_CRITICAL_CLEAR = 11;
	public final static int SEVERITY_MAJOR_CLEAR = 12;
	public final static int SEVERITY_MINOR_CLEAR = 13;
	public final static int SEVERITY_WARNING_CLEAR = 14;
	public final static int SEVERITY_INDETERMINATE_CLEAR = 15;
	
	final public static int MASS_EVENT_CODE = 9070001;
	
  //CLEAR STATUS
  public static final int FM_CLEAR_TYPE_NONE = 1; //諛쒖깮
  public static final int FM_CLEAR_TYPE_AUTO = 2; //�빐�젣
  public static final int FM_CLEAR_TYPE_FORCE = 3; //�닔�룞�빐�젣
  
  
  
  // ALARM GROUP
  public static final int FM_ALARM_GROUP_COMMUNICATION = 1;
  public static final int FM_ALARM_GROUP_PROCESSING = 2;
  public static final int FM_ALARM_GROUP_ENVIRONMENT =3;
  public static final int FM_ALARM_GROUP_QOS = 4;
  public static final int FM_ALARM_GROUP_EQUIPMENT = 5;
  public static final int FM_ALARM_GROUP_ETC = 12;
  
  
	// DISPLAY TYPE
	public static final int DISPLAY_DBINSERT = -1;
	public static final int DISPLAY_DBNOINSERT = -51;
	public static final int NODISPLAY_DBNOINSERT = 50;
	public static final int NODISPLAY_DBINSERT = 51;
	public static final int ALLNODISPLAY_DBINSERT = 60;
	
  //ALARM ID
  // 1001 --> 2007 (2016.09.21)
  public static final int FM_ALARM_ID_PING_STATUS = 2007;
  
	// TECH TYPE
	public final static int TECH_NONE = 0;
  
  /*
   * ALARM STRUCT
   */
  
  //Network Monitor
  public static final AlarmStruct FM_ALARM_STRUCT_PING_STATUS  = new AlarmStruct("2006","PING Communication Fail", FM_ALARM_GROUP_COMMUNICATION);
  public static final AlarmStruct FM_ALARM_STRUCT_TL1_STATUS  = new AlarmStruct("2007","TL1 Communication Fail", FM_ALARM_GROUP_COMMUNICATION);
  public static final AlarmStruct FM_ALARM_STRUCT_SNMP_STATUS  = new AlarmStruct("2008","SNMP Communication Fail", FM_ALARM_GROUP_COMMUNICATION);
    
  public static final AlarmStruct FM_ALARM_ID_IP_BAND_STATUS  = new AlarmStruct("2009","IP Band Status", FM_ALARM_GROUP_COMMUNICATION);
  
	// CLIENT_RE_LOGIN_TIMEOUT : 10mins
	public static final long CLIENT_RE_LOGIN_TIMEOUT = FmFoo.POLLING_EVENT_TIME_OUT_PERIOD;
	
	// CLIENT TYPE
	public static final int CLIENT_WEB = 0;					// Web Client
	public static final int CLIENT_DAEMON_DBLD = 1;
	public static final int CLIENT_DAEMON_TT = 2;			// Trouble Ticketing
	public static final int CLIENT_DAEMON_MD = 3;			// OSS
	public static final int CLIENT_DAEMON_MS = 4;			// MS in Large Scaled EMS
	public static final int CLIENT_DAEMON_NI = 5;
	public static final int CLIENT_DAEMON_SVC = 6;			// mf.svc
	
	
	// ACK TYPE
	public static final int ACK_TYPE_UNACKED = 1;
	public static final int ACK_TYPE_ACKED = 2;
	
	
	// CLEAR TYPE
	public static final int CLEAR_TYPE_DEFAULT = -1;
	public static final int CLEAR_TYPE_FAIL = 0;
	public static final int CLEAR_TYPE_UNCLEAR  = 1;
	public static final int CLEAR_TYPE_AUTO  = 2;
	public static final int CLEAR_TYPE_MANUAL  = 3;
	public static final int CLEAR_TYPE_AUDIT  = 4;
	public static final int CLEAR_TYPE_INIT  = 5;
	public static final int CLEAR_TYPE_NO_DECLARED  = 6;
	public static final int CLEAR_TYPE_ALREADY_EXIST_DECLARED  = 7;
	
	// Clear System
	public static final String SYSTEM_NAME_EMS = "EMS";
	public static final String SYSTEM_NAME_NE = "NE";
	
	public static final String DEFAULT_ID = "0000" ;
	public static final String DEFAULT_TITLE = "UNKNOWN EVENT" ;
	
	public static final int ADDITIONAL_TEXT_MAX = 4000 ;
}
