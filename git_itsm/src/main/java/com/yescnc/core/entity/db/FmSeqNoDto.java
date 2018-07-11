package com.yescnc.core.entity.db;

import java.io.Serializable;


public class FmSeqNoDto implements Serializable {
	
	private long seqNo;
	private String tableVersion;
	private	String	alarmTime;
	private int	severity;
	private	int	alarmGroup;
	private String neId;
	private String clearTime;
	
	
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return "FmSeqNoDto [seqNo=" + seqNo + ", tableVersion=" + tableVersion
				+ ", alarmTime=" + alarmTime + ", severity=" + severity
				+ ", alarmGroup=" + alarmGroup + ", neId=" + neId
				+ ", clearTime=" + clearTime + "]";
	}

	public long getSeqNo() {
		return seqNo;
	}
	
	public void setSeqNo(long seqNo) {
		this.seqNo = seqNo;
	}
	
	public String getTableVersion() {
		return tableVersion;
	}
	
	public void setTableVersion(String tableVersion) {
		this.tableVersion = tableVersion;
	}
	
	public String getAlarmTime() {
		return alarmTime;
	}
	
	public void setAlarmTime(String alarmTime) {
		this.alarmTime = alarmTime;
	}
	
	public int getSeverity() {
		return severity;
	}
	
	public void setSeverity(int severity) {
		this.severity = severity;
	}
	
	public int getAlarmGroup() {
		return alarmGroup;
	}
	
	public void setAlarmGroup(int alarmGroup) {
		this.alarmGroup = alarmGroup;
	}

	/**
	 * @return the neId
	 */
	public String getNeId()
	{
		return neId;
	}

	/**
	 * @param neId the neId to set
	 */
	public void setNeId(String neId)
	{
		this.neId = neId;
	}

	/**
	 * @return the clearTime
	 */
	public String getClearTime()
	{
		return clearTime;
	}

	/**
	 * @param clearTime the clearTime to set
	 */
	public void setClearTime(String clearTime)
	{
		this.clearTime = clearTime;
	}

}
