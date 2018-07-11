package com.yescnc.core.lib.fm.util;

public class AmConstant {

	/**
	 * The definition of ALL.
	 */
	public static final int ALL = 0xFF;

	/********/
	/* Type */
	/********/

	/**
	 * The definition of notification ALARM.
	 */
	public static final int TYPE_ALARM = 1;

	/**
	 * The definition of notification EVENT.
	 */
	public static final int TYPE_EVENT = 2;

	/**
	 * The definition of notification STATUS.
	 */
	//public static final int TYPE_STATUS = 2;

	/**
	 * The definition of notification FAULT.
	 */
	public static final int TYPE_FAULT = 3;

	/******************/
	/* Alarm Severity */
	/******************/

	/**
	 * The definition of severity CLEARED.
	 */
	public static final int CLEARED = 0;

	/**
	 * The definition of severity CRITICAL.
	 */
	public static final int CRITICAL = 1;

	/**
	 * The definition of severity MAJOR.
	 */
	public static final int MAJOR = 2;

	/**
	 * The definition of severity MINOR.
	 */
	public static final int MINOR = 3;

	/**
	 * The definition of severity WARNING.
	 */
	public static final int WARNING = 4;

	/**
	 * The definition of severity INDETERMINATE.
	 */
	public static final int INDETERMINATE = 5;

	/**
	 * The definition of severity EVENT.
	 */
	public static final int EVENT = 6;

	/**
	 * The definition of severity INFORMATION.
	 */
	public static final int INFORMATION = 7;

	/**
	 * The definition of severity FAULT.
	 */
	public static final int FAULT = 8;

	/***************/
	/* Alarm Group */
	/***************/

	/**
	 * The definition of group COMMUNICATION ALARMS.
	 */
	public static final int COMMUNICATIONS = 1;

	/**
	 * The definition of group PROCESSING ALARMS.
	 */
	public static final int PROCESSING = 2;

	/**
	 * The definition of group ENVIRONMENTAL AlARMS.
	 */
	public static final int ENVIRONMENTAL = 3;

	/**
	 * The definition of group QUALITY OF SERVICE ALARMS.
	 */
	public static final int QOS = 4;

	/**
	 * The definition of group EQUIPMENT ALARMS.
	 */
	public static final int EQUIPMENT = 5;

	/**
	 * The definition of group ETC ALARMS that is not defined any alarm group.
	 */
	public static final int ETC = 12;

	/*******/
	/* Ack */
	/*******/

	/**
	 * The definition of ack status FAIL .
	 */
	public static final int ACK_FAIL = 0;

	/**
	 * The definition of ack status UNACK.
	 */
	public static final int UNACK = 1;

	/**
	 * The definition of ack status ACK.
	 */
	public static final int ACK = 2;

	public static final String EMS_REBUILT = "2099";

	/***********/
	/* Cleared */
	/***********/

	/**
	 * The definition of clear status FAIL.
	 */
	public static final int CLR_FAIL = 0;

	/**
	 * The definition of clear status UNCLEAR.
	 */
	public static final int UNCLEAR = 1;

	/**
	 * The definition of clear status CLEAR.
	 * alarm cleared automatically by receiving a clear notification.
	 */
	public static final int A_CLEAR = 2;

	/**
	 * The definition of clear status CLEAR.
	 * alarm cleared manually by operator.
	 */
	public static final int M_CLEAR = 3;

	/**
	 * The definition of clear status NO DISPLAY.
	 */
	public static final int NO_DISP = 4;

	/**
	 * The definition of clear status CLEAR.
	 * alarm cleared automatically or manually.
	 */
	public static final int CLEAR = 5;

	/********************************/
	/* 		Event Display Values	*/
	/********************************/

	public static final int DISPLAY_DBINSERT = -1;
	public static final int DISPLAY_DBNOINSERT = -51;
	public static final int NODISPLAY_DBNOINSERT = 50;
	public static final int NODISPLAY_DBINSERT = 51;

	/* added by EunmiBaek(2008.03.26)-manual clear�� NE�˶� ó���� ���� �߰� */
	public static final int PROCESS_CM_ONLY = 99;

	/* events generated from sm */
	public static final int DISPLAY_SM_EVENT = 98;

	/******************************/
	/* History Information Change */
	/******************************/

	/**
	 * The definition of alarm history information change CLEAR.
	 */
	public static final int HISTORY_CHANGE_CLEAR = 1;

	/**
	 * The definition of alarm history information change ACK.
	 */
	public static final int HISTORY_CHANGE_ACK = 2;

	/**
	 * The definition of alarm history information change UNACK.
	 */
	public static final int HISTORY_CHANGE_UNACK = 3;

	/****************/
	/* Service Type */
	/****************/

	/**
	 * The definition of service function REALTIME.
	 */
	public static final int SERVICE_REALTIME = 1;

	/**
	 * The definition of service function HISTORY.
	 */
	public static final int SERVICE_HISTORY = 2;

	/**
	 * The definition of service function STATISTICS.
	 * will display statistics data by table.
	 */
	public static final int SERVICE_STATISTICS = 3;

	/**
	 * The definition of service function STATISTICS.
	 * will display statistics data by chart.
	 */
	public static final int SERVICE_STATISTICS_CHART = 4;

	/**************************/
	/* Statistics Report Type */
	/**************************/

	/**
	 * The definition of statistics report type HOURLY.
	 */
	public static final int REPORT_HOUR = 1;

	/**
	 * The definition of statistics report type DAILY.
	 */
	public static final int REPORT_DAY = 2;

	/**
	 * The definition of statistics report type MONTHLY.
	 */
	public static final int REPORT_MONTH = 3;

	/**
	 * The definition of statistics report type HOURLY Summary.
	 */
	public static final int REPORT_HOUR_SUM = 11;

	/**
	 * The definition of statistics report type DAILY Summary.
	 */
	public static final int REPORT_DAY_SUM = 12;

	/**
	 * The definition of statistics report type MONTHLY Summary.
	 */
	public static final int REPORT_MONTH_SUM = 13;

	/*************************/
	/* Statistics Class Type */
	/*************************/

	/**
	 * The definition of statistics class type SEVERITY.
	 */
	public static final int CLASS_SEVERITY = 1;

	/**
	 * The definition of statistics class type GROUP.
	 */
	public static final int CLASS_GROUP = 2;

	/**
	 * The definition of statistics class type ALARM ID.
	 */
	public static final int CLASS_ID = 3;

	/************************/
	/* Statistics Base Type */
	/************************/

	/**
	 * The definition of statistics base type TIME.
	 */
	public static final int BASE_TIME = 1; // CLASS_SEVERITY

	/**
	 * The definition of statistics base type UNIT.
	 */
	public static final int BASE_UNIT = 2; // CLASS_GROUP

	/**
	 * The definition of statistics base type ALARM ID.
	 */
	public static final int BASE_ID = 3; // CLASS_ID

	////////////////////////////////////////////////////////////////////
	//
	// Added by Joo Min, Lee (2004.02.19)
	//
	////////////////////////////////////////////////////////////////////

	// ALARM SEVERITY

	/**
	 * The definition of severity cleared SVR_CLR.
	 */
	public final static int SVR_CLR = 0;

	/**
	 * The definition of severity critical SVR_CRI.
	 */
	public final static int SVR_CRI = 1;

	/**
	 * The definition of severity major SVR_MAJ.
	 */
	public final static int SVR_MAJ = 2;

	/**
	 * The definition of severity minor SVR_MIN.
	 */
	public final static int SVR_MIN = 3;

	/**
	 * The definition of severity warning SVR_WRN.
	 */
	public final static int SVR_WRN = 4;

	/**
	 * The definition of severity indeterminate SVR_IND.
	 */
	public final static int SVR_IND = 5;

	/**
	 * The definition of severity event SVR_EVT.
	 */
	public final static int SVR_EVT = 6;

	/**
	 * The definition of severity event SVR_FLT.
	 */
	public final static int SVR_FLT = 8;

	/**
	 * The definition of severity cleared of critical alarm SVR_CRI_CLR.
	 */
	public final static int SVR_CRI_CLR = 11;

	/**
	 * The definition of severity cleared of major alarm SVR_MAJ_CLR.
	 */
	public final static int SVR_MAJ_CLR = 12;

	/**
	 * The definition of severity cleared of minor alarm SVR_MIN_CLR.
	 */
	public final static int SVR_MIN_CLR = 13;

	/**
	 * The definition of severity cleared of warning alarm SVR_WRN_CLR.
	 */
	public final static int SVR_WRN_CLR = 14;

	/**
	 * The definition of severity cleared of indeterminate alarm SVR_IND_CLR.
	 */
	public final static int SVR_IND_CLR = 15;

	/**
	 * The definition of severity cleared offset value.
	 */
	public final static int SVR_OFFSET = 10; // Clear offset value

	// ALARM GROUP
	/**
	 * The definition of group COMMUNICATION ALARMS.
	 */
	public final static int GRP_COMM = 1;

	/**
	 * The definition of group PROCESSING ALARMS.
	 */
	public final static int GRP_PROC = 2;

	/**
	 * The definition of group ENVIRONMENTAL AlARMS.
	 */
	public final static int GRP_ENVIR = 3;

	/**
	 * The definition of group QUALITY OF SERVICE ALARMS.
	 */
	public final static int GRP_QOS = 4;

	/**
	 * The definition of group EQUIPMENT ALARMS.
	 */
	public final static int GRP_EQUIP = 5;

	/**
	 * The definition of group ETC ALARMS that is not defined any alarm group.
	 */
	public final static int GRP_ETC = 12;

	// ALARM STATUS
	/**
	 * The definition of alarm status OFF.
	 */
	public final static int STS_OFF = 0;

	/**
	 * The definition of alarm status ON.
	 */
	public final static int STS_ON = 1;

	////////////////////////////////////////////////////////////////////
	//
	// End
	//
	////////////////////////////////////////////////////////////////////
}
