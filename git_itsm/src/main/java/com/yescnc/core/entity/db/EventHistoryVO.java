package com.yescnc.core.entity.db;

import java.io.Serializable;

import com.yescnc.core.util.common.FmConstant;

import lombok.Data;
//import lombok.Builder;

@Data
//@Builder
public class EventHistoryVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8904720864411677750L;
	
	private Integer     recid;
	private	long		seq_no				=	-1;
	private	String		ne_type				=	FmConstant.STR_NA;
	private	String		ne_version			=	FmConstant.STR_NA;
	private	int			level1_id				=	-1;
	private	int			level2_id				=	-1;
	private	int			level3_id				=	-1;
	private	int			level4_id				=	-1;
	private	int			level5_id				=	-1;
	private	int			level6_id				=	-1;
	private	int			level7_id				=	-1;
	private	int			level8_id				=	-1;
	private	int			level9_id				=	-1;
	private	int			level10_id				=	-1;
	private	String		lloc				=	FmConstant.STR_NA;
	private	String		location_alias		=	FmConstant.STR_NA;
	//private	int			event_type			=	FmConstant.FM_TYPE_EVENT;
	private	int			event_type			=	-1;
	private int			display_type			=	FmConstant.DISPLAY_DBINSERT;
	private	String		alarm_time			=	FmConstant.STR_NA;
	private int			severity			=	FmConstant.FM_SEVERITY_EVENT;
	private	int			alarm_group			=	FmConstant.GROUP_ETC;
	private	String		alarm_id				=	FmConstant.STR_NA;
	private	int			probcause_int		=	-1;
	private	String		probcause_str		=	FmConstant.STR_NA;
	private	String		additional_text		=	FmConstant.STR_NA;
	private	int			clear_type			=	-1;
	private	int			reserve_int			=	-1;
	private	String		reserve_str			=	FmConstant.STR_NA;
	private	String		operator_info		=	FmConstant.STR_NA;
	private int			gen_count			=    1;  // SRKIM added
	
	// UnUsed Member
	private	int			service_affect		=	-1;
	private	String		msg_name				=	FmConstant.STR_EMPTY;
	
	// ACK, CLEAR FIELD
	private	int			ack_type				=	1;
	private	String		ack_user				=	FmConstant.STR_EMPTY;
	private	String		ack_time				=	null;
	private	String		clear_user			=	FmConstant.STR_EMPTY;
	private	String		clear_time			=	null;
	private	long		cleared_by_seq_no			=	-1;
	
	// For Kddi
	private	int			service_status 		=	-1;
	private	String		sys_type				=	FmConstant.STR_EMPTY;
	private	String		band_class			=	FmConstant.STR_EMPTY;
	private	String		ne_id				=	FmConstant.STR_EMPTY;
	private	String		alarm_position		=	FmConstant.STR_EMPTY;
	private	String		alarm_id_position		=	FmConstant.STR_EMPTY;
	
	private	String		ack_system			=	FmConstant.STR_EMPTY;
	private	String		clear_system			=	FmConstant.STR_EMPTY;
	private int 		tech_info 			= 	FmConstant.TECH_NONE;

	private int 		startRow 			=	-1;
	private int 		endRow 				=	-1;
	private Integer max_id = -1;
}
