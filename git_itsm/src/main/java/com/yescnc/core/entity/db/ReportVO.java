package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.List;

@SuppressWarnings("serial")
public class ReportVO implements Serializable {

	private int max_id;
	public int getMax_id() {
		return max_id;
	}
	public void setMax_id(int max_id) {
		this.max_id = max_id;
	}
	private String report_id;
	private String parent_id;
	private Integer recid;
	private String user_id;
	private String report_title;
	private String report_type;
	private String report_sub_type;
	private String level1_id;
	private String level2_id;
	private String level3_id;
	private String level4_id;
	private String report_view;
	private String period_last;
	private String period_from;
	private String period_to;
	private String scheduling;
	private String export_type;
	private String destination_type;
	private String destination_name;
	private String schedule_start;
	private String schedule_end;
	private String recurrence_type;
	private String recurrence_interval;
	private String next_run_date;
	private String last_run_date;
	private String conditions;
	private String mybatis_id;
	private String ui_setting;
	private String ui_value;
	private String report_key;
	private String reportdata_key;
	private String cron_expression;
	
	private List<ReportVO> subreportList;
	
	/** ars_t_report_history **/
	private String history_id;
//	private String report_id;
//	private String report_type;
	private String status;
	private String message;
	private String run_date;
	private String reserve_int;
	private String reserve_str;
	private String email_status;
	private String email_address;
	private String report_name;
	private String delete_interval;
	
	private Integer startRow;
	private Integer endRow;	
	private String action_type;
	private String file_name;
	 
	public String getReport_id() {
		return report_id;
	}
	public void setReport_id(String report_id) {
		this.report_id = report_id;
	}
	public String getParent_id() {
		return parent_id;
	}
	public void setParent_id(String parent_id) {
		this.parent_id = parent_id;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getReport_title() {
		return report_title;
	}
	public void setReport_title(String report_title) {
		this.report_title = report_title;
	}
	public String getReport_type() {
		return report_type;
	}
	public void setReport_type(String report_type) {
		this.report_type = report_type;
	}
	public String getReport_sub_type() {
		return report_sub_type;
	}
	public void setReport_sub_type(String report_sub_type) {
		this.report_sub_type = report_sub_type;
	}
	public String getLevel1_id() {
		return level1_id;
	}
	public void setLevel1_id(String level1_id) {
		this.level1_id = level1_id;
	}
	public String getLevel2_id() {
		return level2_id;
	}
	public void setLevel2_id(String level2_id) {
		this.level2_id = level2_id;
	}
	public String getLevel3_id() {
		return level3_id;
	}
	public void setLevel3_id(String level3_id) {
		this.level3_id = level3_id;
	}
	public String getLevel4_id() {
		return level4_id;
	}
	public void setLevel4_id(String level4_id) {
		this.level4_id = level4_id;
	}
	public String getReport_view() {
		return report_view;
	}
	public void setReport_view(String report_view) {
		this.report_view = report_view;
	}
	public String getPeriod_last() {
		return period_last;
	}
	public void setPeriod_last(String period_last) {
		this.period_last = period_last;
	}
	public String getPeriod_from() {
		return period_from;
	}
	public void setPeriod_from(String period_from) {
		this.period_from = period_from;
	}
	public String getPeriod_to() {
		return period_to;
	}
	public void setPeriod_to(String period_to) {
		this.period_to = period_to;
	}
	public String getScheduling() {
		return scheduling;
	}
	public void setScheduling(String scheduling) {
		this.scheduling = scheduling;
	}
	public String getExport_type() {
		return export_type;
	}
	public void setExport_type(String export_type) {
		this.export_type = export_type;
	}
	public String getDestination_type() {
		return destination_type;
	}
	public void setDestination_type(String destination_type) {
		this.destination_type = destination_type;
	}
	public String getDestination_name() {
		return destination_name;
	}
	public void setDestination_name(String destination_name) {
		this.destination_name = destination_name;
	}
	public String getSchedule_start() {
		return schedule_start;
	}
	public void setSchedule_start(String schedule_start) {
		this.schedule_start = schedule_start;
	}
	public String getSchedule_end() {
		return schedule_end;
	}
	public void setSchedule_end(String schedule_end) {
		this.schedule_end = schedule_end;
	}
	public String getRecurrence_type() {
		return recurrence_type;
	}
	public void setRecurrence_type(String recurrence_type) {
		this.recurrence_type = recurrence_type;
	}
	public String getRecurrence_interval() {
		return recurrence_interval;
	}
	public void setRecurrence_interval(String recurrence_interval) {
		this.recurrence_interval = recurrence_interval;
	}
	public String getNext_run_date() {
		return next_run_date;
	}
	public void setNext_run_date(String next_run_date) {
		this.next_run_date = next_run_date;
	}
	public String getLast_run_date() {
		return last_run_date;
	}
	public void setLast_run_date(String last_run_date) {
		this.last_run_date = last_run_date;
	}
	public String getConditions() {
		return conditions;
	}
	public void setConditions(String conditions) {
		this.conditions = conditions;
	}
	public String getMybatis_id() {
		return mybatis_id;
	}
	public void setMybatis_id(String mybatis_id) {
		this.mybatis_id = mybatis_id;
	}
	public String getUi_setting() {
		return ui_setting;
	}
	public void setUi_setting(String ui_setting) {
		this.ui_setting = ui_setting;
	}
	public String getUi_value() {
		return ui_value;
	}
	public void setUi_value(String ui_value) {
		this.ui_value = ui_value;
	}
	public String getReport_key() {
		return report_key;
	}
	public void setReport_key(String report_key) {
		this.report_key = report_key;
	}
	public String getReportdata_key() {
		return reportdata_key;
	}
	public void setReportdata_key(String reportdata_key) {
		this.reportdata_key = reportdata_key;
	}
	public String getCron_expression() {
		return cron_expression;
	}
	public void setCron_expression(String cron_expression) {
		this.cron_expression = cron_expression;
	}
	public List<ReportVO> getSubreportList() {
		return subreportList;
	}
	public void setSubreportList(List<ReportVO> subreportList) {
		this.subreportList = subreportList;
	}

	
	
	/** ars_t_report_history **/
	public String getHistory_id() {
		return history_id;
	}
	public void setHistory_id(String history_id) {
		this.history_id = history_id;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getRun_date() {
		return run_date;
	}
	public void setRun_date(String run_date) {
		this.run_date = run_date;
	}
	public String getReserve_int() {
		return reserve_int;
	}
	public void setReserve_int(String reserve_int) {
		this.reserve_int = reserve_int;
	}
	public String getReserve_str() {
		return reserve_str;
	}
	public void setReserve_str(String reserve_str) {
		this.reserve_str = reserve_str;
	}
	public String getEmail_status() {
		return email_status;
	}
	public void setEmail_status(String email_status) {
		this.email_status = email_status;
	}
	public String getEmail_address() {
		return email_address;
	}
	public void setEmail_address(String email_address) {
		this.email_address = email_address;
	}
	public String getReport_name() {
		return report_name;
	}
	public void setReport_name(String report_name) {
		this.report_name = report_name;
	}
	public String getDelete_interval() {
		return delete_interval;
	}
	public void setDelete_interval(String delete_interval) {
		this.delete_interval = delete_interval;
	}
	public Integer getStartRow() {
		return startRow;
	}
	public void setStartRow(Integer startRow) {
		this.startRow = startRow;
	}
	public Integer getEndRow() {
		return endRow;
	}
	public void setEndRow(Integer endRow) {
		this.endRow = endRow;
	}
	public Integer getRecid() {
		return recid;
	}
	public void setRecid(Integer recid) {
		this.recid = recid;
	}
	
	public String getAction_type() {
		return action_type;
	}
	public void setAction_type(String action_type) {
		this.action_type = action_type;
	}	
	
	public String getFile_name() {
		return file_name;
	}
	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}	
	
}