package com.yescnc.core.constant;

public interface SessionKey
{
	/// Identifier of the Session count
	public static final String SESSION_CNT = "SESSION.CNT";
	
	public static final String SESSION_TYPE = "SESSION.TYPE";
	
	public static final String URL_IP = "URL_IP";
	
	public static final String LMT_COUNT = "LMT.COUNT";

	public static final String IS_WRITE = "IS.WRITE";
	
	/// Identifier of the Session types 
	public static final String SESSION_TYPE_EMS = "EMS";
	
	public static final String SESSION_TYPE_LMT = "LMT";

	/// Identifier of the subscriber
	public static final String SUBSCRIBE_ID = "SUBSCRIBE.ID";

	/// Identifier of the current WebSession
	public static final String WEB_SESSION = "WEB.SESSION";

	/// Identifier of the current Session (value:String)
	public static final String SESSION_ID = "SESSION.ID";

	/// Identifier of the UX function count
	public static final String FUNC_CNT = "FUNC.CNT";

	/// Index of the current User (value:String)
	/// @deprecated do't use this key
	public static final String USER_INDEX = "USER.INDEX";

	/// Name of the current User (value:String)
	public static final String USER_ID = "USER.ID";
	/// Password of the current User (value:String)
	public static final String USER_PASSWORD = "USER.PASSWORD";
	/// Group of the current User (value:String)
	public static final String USER_GROUP = "USER.GROUP";
	/// Role of the current User (value:String)
	public static final String USER_ROLE = "USER.ROLE";
	/// Privilege of the current User (value:Integer)
	public static final String USER_PRIVILEGE = "USER.PRIVILEGE";
	// / Alarm Filter Group of the current User (value:Integer)
	public static final String USER_ALARM_GROUP = "USER.ALARM.GROUP";	

	/// Identifier of the client (value:String)
	public static final String CLIENT_ID = "CLIENT.ID";
	/// IP address of the client (value:String)
	public static final String CLIENT_IP = "CLIENT.IP";

	/// Identifier of the connected Server (value:String)
	public static final String SERVER_ID = "SERVER.ID";
	/// IP address of the connected Server (value:String)
	public static final String SERVER_IP = "SERVER.IP";
	/// PORT of the the connected Server (value:Integer)
	public static final String SERVER_PORT = "SERVER.PORT";
	/// TYPE of the the connected Server (value:String)
	public static final String SERVER_TYPE = "SERVER.TYPE";
	/// VERSION of the the connected Server (value:String)
	public static final String SERVER_VERSION = "SERVER.VERSION";

	/// Indicate if this session is connected (value:Boolean)
	public static final String IS_CONNECTED = "IS.CONNECTED";
	/// Last Login time of the this session (value:Date)
	public static final String LAST_LOGIN_TIME = "LAST.LOGIN.TIME";
	/// Last Logout time of the this session (value:Date)
	public static final String LAST_LOGOUT_TIME = "LAST.LOGOUT.TIME";

    // added by EunmiBaek(2006.06.13). for password expired warning days
    /// Password expire remain days (value:Integer)
    public static final String PASSWORD_EXPIRE_REMAIN_DAYS = "PASSWORD.EXPIRE.REMAIN.DAYS";
    /// Password expired warning days (value:Integer)
    public static final String PASSWORD_WARNING_DAYS = "PASSWORD.WARNING.DAYS";
    /// logout reason (value:String)
    public static final String LOGOUT_REASON = "LOGOUT.REASON";
    /// if true , use RMI over SSL
	public static final String IS_SSL = "IS.SSL";

}
