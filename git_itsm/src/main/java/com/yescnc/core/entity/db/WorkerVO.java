package com.yescnc.core.entity.db;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

public class WorkerVO {
	
	private String id;				// Primary Key
	private String type;			// 수집 타입 (혹시나 해서 db, csv, xml 정도 생각
	private int period;				// 수집 주기
	private String unit;			// 수집 주기 단위 (S,M,D,M)
	private String start_time;		// 시작 시간
	private String connect_id;		// ftp/sftp/ssh id
	private String connect_pwd;		// ftp/sftp/ssh pwd
	private String remote_db_table;	// ssh db table
	private String remote_db_id;	// ssh db id
	private String remote_db_pwd;	// ssh db pwd
	
	private String remote_conn;		// 원격 DB connetion 또는 IP
	private String target_conn;		// 저장할 곳의 DB connection
	private String labels;			// Data 관련 Label
	
	private String select_data;		// Data 가져올 Query 또는 ftp 일경우에는 파일 경로
	private String select_file;		// ftp,sftp 일 경우에만 사용 
	private String insert_query;	// Insert Query 앞부분.
	private String insert_param;	// Insert Query 뒷 params
	private String status;			// 상태
	private String event_statime;	// worker 시작 시간
	private String event_endtime;	// worker end 시간
	private String localIp;			// local IP  
	
	@XmlAttribute(name="id")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	@XmlAttribute(name="type")
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@XmlAttribute(name="period")
	public int getPeriod() {
		return period;
	}
	public void setPeriod(int period) {
		this.period = period;
	}
	
	@XmlAttribute(name="unit")
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	
	@XmlAttribute(name="start_time")
	public String getStart_time() {
		return start_time == null ? "" : start_time;
	}
	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}
	
	@XmlAttribute(name="connect_id")
	public String getConnect_id() {
		return connect_id;
	}
	public void setConnect_id(String connect_id) {
		this.connect_id = connect_id;
	}
	
	@XmlAttribute(name="connect_pwd")
	public String getConnect_pwd() {
		return connect_pwd;
	}
	public void setConnect_pwd(String connect_pwd) {
		this.connect_pwd = connect_pwd;
	}
	
	@XmlAttribute(name="remote_db_table")
	public String getRemote_db_table() {
		return remote_db_table;
	}
	public void setRemote_db_table(String remote_db_table) {
		this.remote_db_table = remote_db_table;
	}
	
	@XmlAttribute(name="remote_db_id")
	public String getRemote_db_id() {
		return remote_db_id;
	}
	public void setRemote_db_id(String remote_db_id) {
		this.remote_db_id = remote_db_id;
	}
	
	@XmlAttribute(name="remote_db_pwd")
	public String getRemote_db_pwd() {
		return remote_db_pwd;
	}
	public void setRemote_db_pwd(String remote_db_pwd) {
		this.remote_db_pwd = remote_db_pwd;
	}
	
	@XmlElement(name="remote_conn")
	public String getRemote_conn() {
		return remote_conn;
	}
	public void setRemote_conn(String remote_conn) {
		this.remote_conn = remote_conn;
	}
	
	@XmlElement(name="target_conn")
	public String getTarget_conn() {
		return target_conn;
	}
	public void setTarget_conn(String target_conn) {
		this.target_conn = target_conn;
	}
	
	@XmlElement(name="labels")
	public String getLabels() {
		return labels;
	}
	public void setLabels(String labels) {
		this.labels = labels;
	}
	
	@XmlElement(name="select_data")
	public String getSelect_data() {
		return select_data;
	}
	public void setSelect_data(String select_data) {
		this.select_data = select_data;
	}
	
	@XmlElement(name="select_file")
	public String getSelect_file() {
		return select_file;
	}
	public void setSelect_file(String select_file) {
		this.select_file = select_file;
	}
	
	@XmlElement(name="insert_query")
	public String getInsert_query() {
		return insert_query;
	}
	public void setInsert_query(String insert_query) {
		this.insert_query = insert_query;
	}
	
	@XmlElement(name="insert_param")
	public String getInsert_param() {
		return insert_param;
	}
	public void setInsert_param(String insert_param) {
		this.insert_param = insert_param;
	}
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getEvent_statime() {
		return event_statime;
	}
	public void setEvent_statime(String event_statime) {
		this.event_statime = event_statime;
	}
	public String getEvent_endtime() {
		return event_endtime;
	}
	public void setEvent_endtime(String event_endtime) {
		this.event_endtime = event_endtime;
	}
	public String getLocalIp() {
		return localIp;
	}
	public void setLocalIp(String localIp) {
		this.localIp = localIp;
	}
}