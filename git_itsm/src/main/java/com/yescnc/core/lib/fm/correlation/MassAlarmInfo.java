package com.yescnc.core.lib.fm.correlation;

public class MassAlarmInfo {
	private String massAlarmId;
	private String massProbCause;
	private int arrayIndex;
	public String getMassAlarmId() {
		return massAlarmId;
	}
	public void setMassAlarmId(String massAlarmId) {
		this.massAlarmId = massAlarmId;
	}
	public String getMassProbCause() {
		return massProbCause;
	}
	public void setMassProbCause(String massProbCause) {
		this.massProbCause = massProbCause;
	}
	public int getArrayIndex() {
		return arrayIndex;
	}
	public void setArrayIndex(int arrayIndex) {
		this.arrayIndex = arrayIndex;
	}
	public MassAlarmInfo(String massAlarmId, String massProbCause, int arrayIndex) {
		this.massAlarmId = massAlarmId;
		this.massProbCause = massProbCause;
		this.arrayIndex = arrayIndex;
	}
	
	
	
}
