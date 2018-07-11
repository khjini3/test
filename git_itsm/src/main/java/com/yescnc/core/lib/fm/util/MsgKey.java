package com.yescnc.core.lib.fm.util;

public interface MsgKey extends EventKey {
	/// Type of Product
	public static final String PRODUCT_TYPE = "PRODUCT.TYPE";
	/// Type of System
	public static final String SYS_TYPE = "SYS.TYPE";
	/// Type of Network Element
	public static final String NE_TYPE = "NE.TYPE";
	/// Version of Network Element
	public static final String NE_VERSION = "NE.VERSION";
	/// Release Version of Network Element
	public static final String NE_REL_VER = "NE.REL.VER";

	/// Name of Network Element
	public static final String NE_NAME = "NE.NAME";
	/// Identifier of Network Element
	public static final String NE_ID = "NE.ID";
	/// Distinguishable Name of Network Element
	public static final String NE_DN = "NE.DN";
	/// Address of Network Element
	public static final String NE_ADDR = "NE.ADDR";
	/// IP Port of Network Element
	public static final String NE_PORT = "NE.PORT";

	// if login is required, use this username
	public static final String NE_USERNAME = "NE.USERNAME";

	// if login is required, use this password
	public static final String NE_PASSWORD = "NE.PASSWORD";

	/// Type of Message
	/// @see MsgType
	public static final String MSG_TYPE = "MSG.TYPE";
	/// Version of Message
	public static final String MSG_VERSION = "MSG.VERSION";
	/// Name of Message
	public static final String MSG_NAME = "MSG.NAME";

	/// full input command string that describes entire operation.
	public static final String INPUT_MSG = "INPUT.MSG";
	/// Type of input command (display,create,delete,change...)
	public static final String INPUT_TYPE = "INPUT.TYPE";
	/// arguments for executing input command
	public static final String INPUT_PARAMETERS = "INPUT.PARAMETERS";

	/// command string that describes entire operation result.
	public static final String OUTPUT_MSG = "OUTPUT.MSG";

	/// TableModel that describes entire operation result.
	public static final String TABLE_MODEL = "TABLE.MODEL";

	/// Message Body
	public static final String BODY = "BODY";

	/// IP of Source
	public static final String SRC_IP = "SRC.IP";
	/// Identifier of Source
	public static final String SRC_ID = "SRC.ID";
	/// Index of Source
	public static final String SRC_INDEX = "SRC.INDEX";
	/// Grade of Source
	public static final String SRC_PRIVILEGE = "SRC.PRIVILEGE";
	/**
	 * Object of Source (used for callback listener)
	 * <Purpose>
	 * If responses are consist of many messages,
	 * All response are buffered until the last message arrives.
	 * So, Out of Memory can happened.  
	 * In this case, If this key is not empty, responses will be received
	 * Whenever each reponse is received.
	 */
	public static final String CALLBACK_OBJECT = "CALLBACK.OBJECT";

	/// IP of Destination
	public static final String DEST_IP = "DEST.IP";
	/// Identifier of Destination
	public static final String DEST_ID = "DEST.ID";

	///	Key of Result Value which is received.
	public static final String RESULT = "RESULT";
	public static final String RESULT_FORMAT = "RESULT.FORMAT";
	public static final String RESULT_FORMAT_OBJ = "RESULT.OBJECT";
	public static final String RESULT_FORMAT_JSON = "RESULT.JSON";

	public static final String REASON = "REASON";
	public static final String ERROR_LOC = "ERROR.LOC";

	/// Correlation Tag
	public static final String CTAG = "CTAG";
	/// Sequential Number
	public static final String SEQ_NO = "SEQ.NO";
	// Client Id
	public static final String CLIENT_ID = "CLIENT.ID";
	// Daemon Id
	public static final String DAEMON_ID = "DAEMON_ID";
	/// Timeout Value (seconds)
	public static final String TIMEOUT = "TIMEOUT";

	/// Type of Management Function (FCAPS...) 
	public static final String FUNCTION_TYPE = "FUNCTION.TYPE";

	/// event data
	public static final String EVENT_DATA = "EVENT.DATA";

	/// start data
	public static final String REQUEST_TIME = "REQUEST.TIME";

	public static final String LOG_PRIORITY = "LOG.PRIORITY";

	public static final String RECEIVED_TIME = "RECEIVED_TIME";

	public static final String ROUTE = "ROUTE";

	public static final String MANAGER_IP = "MANAGER.IP";

	public static final String OVER_FLOW_FLAG = "OVER_FLOW_FLAG";

	public static final String PROC_NAME = "PROC.NAME";
}