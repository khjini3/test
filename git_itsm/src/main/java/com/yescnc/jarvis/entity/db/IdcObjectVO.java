package com.yescnc.jarvis.entity.db;

import java.io.Serializable;

import lombok.Data;

@Data
public class IdcObjectVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String parent_loc_id;
	private String comp_id;
	private String comp_name;
	private String comp_type;
	private String asset_id;
	private String na_model_id;
	private Boolean is_asset;
	private String code_id;
	private String code_name;
	private String model_id;
	private String model_name;
	private Double position_x;
	private Double position_y;
	private Double position_z;
	private Double scale_x;
	private Double scale_y;
	private Double scale_z;
	private Double rotation_x;
	private Double rotation_y;
	private Double rotation_z;
	private Boolean is_pickable;
	private Boolean is_tooltip;
	private Boolean is_visible;
	private Float opacity;
	private String camera;
	private String reserve_str;
	private String objectState; // INSERT | UPDATE | DELETE
}