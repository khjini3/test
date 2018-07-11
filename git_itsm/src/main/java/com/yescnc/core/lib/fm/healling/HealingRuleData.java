package com.yescnc.core.lib.fm.healling;

import java.io.Serializable;
import java.util.Vector;


public class HealingRuleData implements Serializable {
	private static final long serialVersionUID = 1L;
//	private boolean isChecked		= false;
	private String ruleName			= null;
	private String ProbableCause		= null;
	private String neUnit			= null;
	private String targetNE			= null;
	private String additionalInfo	= null;
	private String status			= null;
	private String user				= null;
	private String regDate			= null;
	private String neType			= null;
	
	private String[] orgAlarmCode 	= null; // targeted alarm code
	private String[] orgAlarmName 	= null; // targeted alarm name
	private String[] dn				= null;
	private String[] neAlias 		= null;
//	private String[] groupAlias		= null;
//	private String[] groupDn		= null;

	private Vector<HealingRuleScriptData>	cliScript		= null;
	private String scriptFileName	= null;
	

	public HealingRuleData() {
	}
	
	public String getRuleName() {
		return ruleName;
	}
	public void setRuleName(String strRuleName) {
		this.ruleName = strRuleName;
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
	public String getTargetNE() {
		return targetNE;
	}
	public void setTargetNE(String strTargetNE) {
		this.targetNE = strTargetNE;
	}
	public String getAdditionalInfo() {
		return additionalInfo;
	}
	public void setAdditionalInfo(String strAdditionalInfo) {
		this.additionalInfo = strAdditionalInfo;
	}

//	public boolean isChecked() {
//		return isChecked;
//	}
//	public void setChecked(boolean isChecked) {
//		this.isChecked = isChecked;
//	}

	public String getProbableCause() {
		return ProbableCause;
	}

	public void setProbableCause(String probableCause) {
		ProbableCause = probableCause;
	}


	public String[] getDn() {
		return dn;
	}

	public void setDn(String[] neDn) {
		this.dn = neDn;
	}
	
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

	public String[] getNeAlias() {
		return neAlias;
	}

	public void setNeAlias(String[] neAlias) {
		this.neAlias = neAlias;
	}

	public Vector<HealingRuleScriptData> getCliScript() {
		return cliScript;
	}

	public void setCliScript(Vector<HealingRuleScriptData> cliScript) {
		this.cliScript = cliScript;
	}

	public String getScriptFileName() {
		return scriptFileName;
	}

	public void setScriptFileName(String scriptFileName) {
		this.scriptFileName = scriptFileName;
	}
	
	
	public String getNeUnit() {
		return neUnit;
	}

	public void setNeUnit(String neUnit) {
		this.neUnit = neUnit;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getNeType() {
		return neType;
	}

	public void setNeType(String neType) {
		this.neType = neType;
	}

	public boolean isExist(String ne, String alarmCode) {
		boolean isExist = false;
		if (ne == null || orgAlarmCode == null) return isExist;
		for (int j = 0; j < dn.length; j++) {
			if (ne.equals(dn[j]) && 
					alarmCode.equals(orgAlarmCode[0])) { // Healing �� ���� �˶� 
				isExist = true;
				break;
			}
		}
		return isExist;
	}

	public String toString() {
		StringBuffer alarmID = new StringBuffer("");
		if (orgAlarmCode != null) {
			for (int i = 0; i < orgAlarmCode.length; i++) {				
				alarmID.append(orgAlarmCode[i]);
				if (i < (orgAlarmCode.length)-1) alarmID.append(",");
			}
		}
		StringBuffer targetId = new StringBuffer("");
		if (dn != null) {
			for (int i = 0; i < dn.length; i++) {				
				targetId.append(dn[i]);
				if (i < (dn.length)-1) targetId.append(",");
			}
		}
		StringBuffer buf = new StringBuffer("");
		buf.append("\n-----------------------------------");
		buf.append("\nRule Name \t : " + ruleName);
		buf.append("\nTarget NE \t : " + targetNE);		
		buf.append("\nTarget ID \t : " + targetId);
		buf.append("\nAlarm ID \t : " + alarmID);
		buf.append("\nStatus \t : " + status);
		buf.append("\n-----------------------------------\n");
		return buf.toString();
	}

	public boolean isGroup() {
		return "Group".equals(neUnit);
	}	
}
