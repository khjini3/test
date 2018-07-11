package com.yescnc.core.entity.db;

import java.io.Serializable;


public class CorrelationRuleData implements Serializable {

	private static final long serialVersionUID = 1L;
	private Boolean isChecked = false;
	public String ruleName = null;
	public String type = null;
	public String alarmName = null; // new Alarm Name
	public String period = null;
	public String alarmCount = null;
	public String targetNE = null;	// targeted ne alias
	public String additionalInfo = null;
	
	private String user = null;
	private String regDate = null;
	
	private int group = 0;
	private String groupString = "";
	
	private String alarmID = null; 	// new alarm code
	private int alarmSeverity;		// new alarm severity
	//public String ProbableCause = null;
	private String[] orgAlarmCode = null; // targeted alarm code
	private String[] orgAlarmName = null; // targeted alarm name

	private String[] dn = null;	// targeted ne dn
	private String[] neAlias = null;
	private String neType = null;
	 
	public CorrelationRuleData() {
	}

	public boolean isChecked() {
		return isChecked;
	}
	public void setChecked(boolean isChecked) {
		this.isChecked = isChecked;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String strRuleName) {
		this.ruleName = strRuleName;
	}

	public String getType() {
		return type;
	}

	public void setType(String strType) {
		this.type = strType;
	}

	public String getAlarmName() {
		return alarmName;
	}

	public void setAlarmName(String strAlarmName) {
		this.alarmName = strAlarmName;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String strPeriod) {
		this.period = strPeriod;
	}

	public String getAlarmCount() {
		return alarmCount;
	}

	public void setAlarmCount(String strAlarmCount) {
		this.alarmCount = strAlarmCount;
	}

	public String getTargetNE() {
		return targetNE;
	}

	public void setTargetNE(String strTargetNe) {
		this.targetNE = strTargetNe;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String strUser) {
		this.user = strUser;
	}

	public String getRegDate() {
		return regDate;
	}

	public void setRegDate(String strRegDate) {
		this.regDate = strRegDate;
	}

	public String getAdditionalInfo() {
		return additionalInfo;
	}

	public void setAdditionalInfo(String strAdditionalInfo) {
		this.additionalInfo = strAdditionalInfo;
	}

	public void setAlarmID(String alarmID) {
		this.alarmID = alarmID;
	}

	public String getAlarmID() {
		return alarmID;
	}

	public int getAlarmSeverity() {
		return alarmSeverity;
	}

	public void setAlarmSeverity(int alarmSeverity) {
		this.alarmSeverity = alarmSeverity;
	}
//
//	public String getProbableCause() {
//		return ProbableCause;
//	}
//
//	public void setProbableCause(String probableCause) {
//		ProbableCause = probableCause;
//	}

	public String[] getOrgAlarmCode() {
		return orgAlarmCode;
	}

	public void setOrgAlarmCode(String[] orgAlarmCode) {
		this.orgAlarmCode = orgAlarmCode;
	}

	public String[] getOrgAlarmName() {
		return orgAlarmName;
	}

	public void setOrgAlarmName(String[] orgAlarmName) {
		this.orgAlarmName = orgAlarmName;
	}

	public String[] getDn() {
		return dn;
	}

	public void setDn(String[] dn) {
		this.dn = dn;
	}
	
	public String[] getNeAlias() {
		return neAlias;
	}

	public void setNeAlias(String[] neAlias) {
		this.neAlias = neAlias;
	}

	public int getGroup() {
		return group;
	}

	public void setGroup(int group) {
		this.group = group;
	}

	public String getGroupString() {
		return groupString;
	}

	public void setGroupString(String groupString) {
		this.groupString = groupString;
	}
	
	public boolean isExist(String alarmCode) {
		boolean isExist = false;
		if (orgAlarmCode == null) return isExist;
		
		for (int k = 0; k < orgAlarmCode.length; k++) {
			if (alarmCode.equals(orgAlarmCode[k])) {
				isExist = true;
				break;
			}
		}
		return isExist;
	}

	public String getNeType() {
		return neType;
	}

	public void setNeType(String neType) {
		this.neType = neType;
	}
	
	public String toString() {
		StringBuffer buf = new StringBuffer("");
		buf.append("\n-----------------------------------");
		buf.append("\nRule Name \t : " + ruleName);
		buf.append("\nRule Type \t : " + type);
		buf.append("\nNe Type \t : " + neType);
		buf.append("\nTarget NE \t : " + targetNE);
		buf.append("\nAlarm ID \t : " + alarmID);
		buf.append("\nAlarm Name \t : " + alarmName);
		buf.append("\n-----------------------------------\n");
		return buf.toString();
	}
}
 