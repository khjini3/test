package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.ArrayList;

public class CurAlarmSearchCondVO implements Serializable
{
	private static final long serialVersionUID = -680216190200634793L;

	/* Target Conditions */
	private boolean isIncludeEmsAlarm = false;
	private	ArrayList<Integer> alLvl3Ids = null;
	
	/* Another Condition */
	private ArrayList<Integer> alSeverity = null;
	private	ArrayList<Integer> alAlarmGroup = null;
	private ArrayList<String> alAlarmId = null;
	private	int ackType = -1;
	
	private String strSortColumn = "ALARM_TIME";
	private String strSortOrder = "ASC";
	
	private int nRowCntInSelection = 10000;
	private int lastSeq = -1;
	public CurAlarmSearchCondVO() {	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("\n[nRowCntInSelection : ").append(this.nRowCntInSelection).append("\t/")
		  .append("isIncludeEmsAlarm : ").append(this.isIncludeEmsAlarm).append("\n/")
		  .append("alSeverity : ").append(this.alSeverity).append("\t/")
		  .append("alAlarmGroup : ").append(this.alAlarmGroup).append("\t/")
		  .append("alAlarmId : ").append(this.alAlarmId).append("\t/")
		  .append("ackType : ").append(this.ackType).append("\n/")
		  .append("alLvl3Ids : ").append(this.alLvl3Ids).append("\n/")
		  .append("lastSeq : ").append(this.lastSeq)
		  .append("]");
		return sb.toString();
	}
	
	public boolean isIncludeEmsAlarm() {
		return isIncludeEmsAlarm;
	}

	public void setIncludeEmsAlarm(boolean isIncludeEmsAlarm) {
		this.isIncludeEmsAlarm = isIncludeEmsAlarm;
	}

	public ArrayList<Integer> getAlLvl3Ids() {
		return alLvl3Ids;
	}

	public void setAlLvl3Ids(ArrayList<Integer> alLvl3Ids) {
		this.alLvl3Ids = alLvl3Ids;
	}

	public ArrayList<Integer> getAlSeverity() {
		return alSeverity;
	}

	public void setAlSeverity(ArrayList<Integer> alSeverity) {
		this.alSeverity = alSeverity;
	}

	public ArrayList<Integer> getAlAlarmGroup() {
		return alAlarmGroup;
	}

	public void setAlAlarmGroup(ArrayList<Integer> alAlarmGroup) {
		this.alAlarmGroup = alAlarmGroup;
	}

	public ArrayList<String> getAlAlarmId() {
		return alAlarmId;
	}

	public void setAlAlarmId(ArrayList<String> alAlarmId) {
		this.alAlarmId = alAlarmId;
	}

	public int getAckType() {
		return ackType;
	}

	public void setAckType(int ackType) {
		this.ackType = ackType;
	}

	public String getStrSortColumn() {
		return strSortColumn;
	}

	public void setStrSortColumn(String strSortColumn) {
		this.strSortColumn = strSortColumn;
	}

	public String getStrSortOrder() {
		return strSortOrder;
	}

	public void setStrSortOrder(String strSortOrder) {
		this.strSortOrder = strSortOrder;
	}

	public int getnRowCntPerPage() {
		return nRowCntInSelection;
	}

	public void setnRowCntPerPage(int nRowCntPerPage) {
		this.nRowCntInSelection = nRowCntPerPage;
	}

	public int getLastSeq() {
		return lastSeq;
	}

	public void setLastSeq(int lastSeq) {
		this.lastSeq = lastSeq;
	}
	
}
