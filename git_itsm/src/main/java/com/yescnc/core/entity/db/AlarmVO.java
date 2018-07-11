package com.yescnc.core.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class AlarmVO  implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -9195990251274059346L;
	
	private Integer seq_no;
	private String ne_type;
	private String ne_version;
	private String msg_name;
	private Integer level3_id;
	private Integer level4_id;
	private Integer level5_id;
	private Integer level6_id;
	private Integer level7_id;
	private Integer level8_id;
	private Integer level9_id;
	private Integer level10_id;
	private String lloc;
	private String location_alias;
	private Integer event_type;
	private Integer display_type;
	private String alarm_time;
	private Integer severity;
	private Integer service_affect;
	private Integer alarm_group;
	private String alarm_id;
	private Integer probcause_int;
	private String probcause_str;
	private String additional_text;
	private Integer reserve_int;
	private String reserve_str;
	private String operator_info;
	private Integer gen_count;
	private Integer clear_type;
	private Integer ack_type;
	private String ack_user;
	private String ack_time;
	private String clear_user;
	private Integer clear_time;
	private Integer cleared_by_seq_no;
	private Integer service_status;
	private String sys_type;
	private String band_class;
	private String ne_id;
	private String alarm_position;
	private String alarm_id_position;
	private String ack_syalarms_currstem;
	private String clear_system;
	private Integer tech_info;
	
}
