package com.yescnc.core.entity.db;

import java.io.Serializable;

import com.yescnc.core.util.common.FmConstant;


public class FmEventVO implements Serializable, Cloneable{

	private static final long serialVersionUID = -8463305217843236311L;
	
	private	long		seqNo				=	-1;
	private	String		neType				=	FmConstant.STR_NA;
	private	String		neVersion			=	FmConstant.STR_NA;
	private	int			lvl1Id				=	-1;
	private	int			lvl2Id				=	-1;
	private	int			lvl3Id				=	-1;
	private	int			lvl4Id				=	-1;
	private	int			lvl5Id				=	-1;
	private	int			lvl6Id				=	-1;
	private	int			lvl7Id				=	-1;
	private	int			lvl8Id				=	-1;
	private	int			lvl9Id				=	-1;
	private	int			lvl10Id				=	-1;
	private	String		lloc				=	FmConstant.STR_NA;
	private	String		locationAlias		=	FmConstant.STR_NA;
	private	int			eventType			=	FmConstant.FM_TYPE_EVENT;
	private int			displayType			=	FmConstant.DISPLAY_DBINSERT;
	private	String		alarmTime			=	FmConstant.STR_NA;
	private int			severity			=	FmConstant.FM_SEVERITY_EVENT;
	private	int			alarmGroup			=	FmConstant.GROUP_ETC;
	private	String		alarmId				=	FmConstant.STR_NA;
	private	int			probcauseInt		=	-1;
	private	String		probcauseStr		=	FmConstant.STR_NA;
	private	String		additionalText		=	FmConstant.STR_NA;
	private	int			clearType			=	-1;
	private	int			reserveInt			=	-1;
	private	String		reserveStr			=	FmConstant.STR_NA;
	private	String		operatorInfo		=	FmConstant.STR_NA;
	private int			gencount			=    1;  // SRKIM added
	
	// UnUsed Member
	private	int			serviceAffect		=	-1;
	private	String		msgName				=	FmConstant.STR_EMPTY;
	
	// ACK, CLEAR FIELD
	private	int			ackType				=	0;
	private	String		ackUser				=	FmConstant.STR_EMPTY;
	private	String		ackTime				=	null;
	private	String		clearUser			=	FmConstant.STR_EMPTY;
	private	String		clearTime			=	null;
	private	long		clearSeq			=	-1;
	
	// For Kddi
	private	int			serviceStatus 		=	-1;
	private	String		sysType				=	FmConstant.STR_EMPTY;
	private	String		bandClass			=	FmConstant.STR_EMPTY;
	private	String		neId				=	FmConstant.STR_EMPTY;
	private	String		alarmPosition		=	FmConstant.STR_EMPTY;
	private	String		alarmIdPosition		=	FmConstant.STR_EMPTY;
	
	private	String		ackSystem			=	FmConstant.STR_EMPTY;
	private	String		clearSystem			=	FmConstant.STR_EMPTY;
	private int 		techInfo 			= 	FmConstant.TECH_NONE;
	
	public FmEventVO() {
		// Do Nothing
	}
	
	public FmEventVO(
			long seqNo, String neType, String neVersion, int lvl1Id,
			int lvl2Id, int lvl3Id, int lvl4Id, int lvl5Id, int lvl6Id,
			int lvl7Id, int lvl8Id, int lvl9Id, int lvl10Id, String lloc,
			String locationAlias, int eventType, int displayType,
			String alarmTime, int severity, int alarmGroup, String alarmId,
			int probcauseInt, String probcauseStr, String additionalText,
			int clearType, int reserveInt, String reserveStr, String operatorInfo) {
		
		super();
		this.seqNo = seqNo;
		this.neType = neType;
		this.neVersion = neVersion;
		this.lvl1Id = lvl1Id;
		this.lvl2Id = lvl2Id;
		this.lvl3Id = lvl3Id;
		this.lvl4Id = lvl4Id;
		this.lvl5Id = lvl5Id;
		this.lvl6Id = lvl6Id;
		this.lvl7Id = lvl7Id;
		this.lvl8Id = lvl8Id;
		this.lvl9Id = lvl9Id;
		this.lvl10Id = lvl10Id;
		this.lloc = lloc;
		this.locationAlias = locationAlias;
		this.eventType = eventType;
		this.displayType = displayType;
		this.alarmTime = alarmTime;
		this.severity = severity;
		this.alarmGroup = alarmGroup;
		this.alarmId = alarmId;
		this.probcauseInt = probcauseInt;
		this.probcauseStr = probcauseStr;
		this.additionalText = additionalText;
		this.clearType = clearType;
		this.reserveInt = reserveInt;
		this.reserveStr = reserveStr;
		this.operatorInfo = operatorInfo;
	}

	public String getDebugString() {
		return "FmEventDto [seqNo=" + seqNo + ", neType=" + neType
				+ ", neVersion=" + neVersion + ", lvl1Id=" + lvl1Id
				+ ", lvl2Id=" + lvl2Id + ", lvl3Id=" + lvl3Id + ", lvl4Id="
				+ lvl4Id + ", lvl5Id=" + lvl5Id + ", lvl6Id=" + lvl6Id
				+ ", lvl7Id=" + lvl7Id + ", lvl8Id=" + lvl8Id + ", lvl9Id="
				+ lvl9Id + ", lvl10Id=" + lvl10Id + ", lloc=" + lloc
				+ ", locationAlias=" + locationAlias + ", eventType="
				+ eventType + ", displayType=" + displayType + ", alarmTime="
				+ alarmTime + ", severity=" + severity + ", alarmGroup="
				+ alarmGroup + ", alarmId=" + alarmId + ", probcauseInt="
				+ probcauseInt + ", probcauseStr=" + probcauseStr
				+ ", additionalText=" + additionalText + ", clearType="
				+ clearType + ", reserveInt=" + reserveInt + ", reserveStr="
				+ reserveStr + ", operatorInfo=" + operatorInfo
				+ ", serviceAffect=" + serviceAffect + ", msgName=" + msgName
				+ ", ackType=" + ackType + ", ackUser=" + ackUser
				+ ", ackTime=" + ackTime + ", clearUser=" + clearUser
				+ ", clearTime=" + clearTime + ", clearSeq=" + clearSeq
				+ ", serviceStatus=" + serviceStatus + ", sysType=" + sysType
				+ ", bandClass=" + bandClass + ", neId=" + neId
				+ ", alarmPosition=" + alarmPosition + ", alarmIdPosition="
				+ alarmIdPosition + ", ackSystem=" + ackSystem
				+ ", clearSystem=" + clearSystem + ", techInfo=" + techInfo
				+ "]";
	}

	/**
	 * For Alarm Audit. Alarm time should be added.
	 * @return
	 */
	public String getAlarmKeyStringWithTime() {
		
		StringBuilder sb = new StringBuilder();
		sb.append(this.severity > 10 ? this.severity-10 : this.severity).append("/")
		  .append(this.alarmId).append("/")
		  .append(getLocationCompStr()).append("/")
		  .append(this.lvl3Id).append(".").append(this.lvl4Id).append(".").append(this.lvl5Id).append(".").append(this.lvl6Id).append("/")
		  .append(this.alarmTime);
		return sb.toString();
		
	}

	protected String getLocationCompStr()
	{
		String temp = lloc == null ? FmConstant.STR_EMPTY:lloc.trim();
		temp = temp.equalsIgnoreCase( FmConstant.STR_NA) ? FmConstant.STR_EMPTY : temp;
		return temp;
	}
	
	public String getAlarmKeyString() {

		StringBuilder sb = new StringBuilder();
		sb.append(this.severity > 10 ? this.severity - 10 : this.severity).append("/")
				.append(this.alarmId).append("/").append(getLocationCompStr())
				.append("/").append(this.lvl3Id).append(".").append(this.lvl4Id)
				.append(".").append(this.lvl5Id).append(".").append(this.lvl6Id);
		return sb.toString();

	}
	
	public String getAlarmKeyStringExceptSeverity() {

		StringBuilder sb = new StringBuilder();
		sb.append(this.alarmId).append("/").append(getLocationCompStr())
			.append("/").append(this.lvl3Id).append(".").append(this.lvl4Id)
			.append(".").append(this.lvl5Id).append(".").append(this.lvl6Id);
		return sb.toString();

	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("\n[").append(this.seqNo).append("\t/")
		  .append(this.alarmTime).append("\t/")
		  .append(this.displayType).append("\t/")
		  .append(this.severity).append("\t/")
		  .append(this.clearType).append("\t/")
		  .append(this.ackType).append("\t/")
		  .append(this.alarmId).append("\t/")
		  .append(this.probcauseStr).append("\t/")
		  .append(this.locationAlias).append("\t/")
		  .append(this.lvl1Id).append(".").append(this.lvl2Id).append(".").append(this.lvl3Id).append("/")
		  .append(this.lvl4Id).append(".").append(this.lvl5Id).append(".").append(this.lvl6Id).append("]");
		return sb.toString();
	}
	
	@Override
	public FmEventVO clone() {
		
		try {
			FmEventVO copiedOne = (FmEventVO) super.clone();
			return setMemberVar(this, copiedOne);
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		
		return setMemberVar(this, new FmEventVO());
		
	}
	
	private FmEventVO setMemberVar(FmEventVO original, FmEventVO copiedOne) {
		
		copiedOne.seqNo = original.seqNo;
		copiedOne.neType = original.neType;
		copiedOne.neVersion = original.neVersion;
		copiedOne.lvl1Id = original.lvl1Id;
		copiedOne.lvl2Id = original.lvl2Id;
		copiedOne.lvl3Id = original.lvl3Id;
		copiedOne.lvl4Id = original.lvl4Id;
		copiedOne.lvl5Id = original.lvl5Id;
		copiedOne.lvl6Id = original.lvl6Id;
		copiedOne.lvl7Id = original.lvl7Id;
		copiedOne.lvl8Id = original.lvl8Id;
		copiedOne.lvl9Id = original.lvl9Id;
		copiedOne.lvl10Id = original.lvl10Id;
		copiedOne.lloc = original.lloc;
		copiedOne.locationAlias = original.locationAlias;
		copiedOne.eventType = original.eventType;
		copiedOne.displayType = original.displayType;
		copiedOne.alarmTime = original.alarmTime;
		copiedOne.severity = original.severity;
		copiedOne.alarmGroup = original.alarmGroup;
		copiedOne.alarmId = original.alarmId;
		copiedOne.probcauseInt = original.probcauseInt;
		copiedOne.probcauseStr = original.probcauseStr;
		copiedOne.additionalText = original.additionalText;
		copiedOne.clearType = original.clearType;
		copiedOne.reserveInt = original.reserveInt;
		copiedOne.reserveStr = original.reserveStr;
		copiedOne.operatorInfo = original.operatorInfo;
		
		copiedOne.serviceAffect = original.serviceAffect;
		copiedOne.msgName = original.msgName;
		
		copiedOne.ackType = original.ackType;
		copiedOne.ackUser = original.ackUser;
		copiedOne.ackTime = ackTime;
		copiedOne.clearUser = original.clearUser;
		copiedOne.clearTime = original.clearTime;
		copiedOne.clearSeq = original.clearSeq;
		
		copiedOne.serviceStatus = original.serviceStatus;
		copiedOne.sysType = original.sysType;
		copiedOne.bandClass = original.bandClass;
		copiedOne.neId = original.neId;
		copiedOne.alarmPosition = original.alarmPosition;
		copiedOne.alarmIdPosition = original.alarmIdPosition;
		
		copiedOne.ackSystem = original.ackSystem;
		copiedOne.clearSystem = original.clearSystem;
		copiedOne.techInfo = original.techInfo;
		
		return copiedOne;
		
	}
	
	public long getSeqNo() {
		return seqNo;
	}

	public int getAckType() {
		return ackType;
	}

	public void setAckType(int ackType) {
		this.ackType = ackType;
	}

	public String getAckUser() {
		return ackUser;
	}

	public void setAckUser(String ackUser) {
		this.ackUser = ackUser;
	}

	public String getAckTime() {
		return ackTime;
	}

	public void setAckTime(String ackTime) {
		this.ackTime = ackTime;
	}

	public String getClearUser() {
		return clearUser;
	}

	public void setClearUser(String clearUser) {
		this.clearUser = clearUser;
	}

	public String getClearTime() {
		return clearTime;
	}

	public void setClearTime(String clearTime) {
		this.clearTime = clearTime;
	}

	public long getClearSeq() {
		return clearSeq;
	}

	public void setClearSeq(long clearSeq) {
		this.clearSeq = clearSeq;
	}

	public void setSeqNo(long seqNo) {
		this.seqNo = seqNo;
	}

	public String getNeType() {
		return neType;
	}

	public void setNeType(String neType) {
		this.neType = neType;
	}

	public String getNeVersion() {
		return neVersion;
	}

	public void setNeVersion(String neVersion) {
		this.neVersion = neVersion;
	}

	public int getLvl1Id() {
		return lvl1Id;
	}

	public void setLvl1Id(int lvl1Id) {
		this.lvl1Id = lvl1Id;
	}

	public int getLvl2Id() {
		return lvl2Id;
	}

	public void setLvl2Id(int lvl2Id) {
		this.lvl2Id = lvl2Id;
	}

	public int getLvl3Id() {
		return lvl3Id;
	}

	public void setLvl3Id(int lvl3Id) {
		this.lvl3Id = lvl3Id;
	}

	public int getLvl4Id() {
		return lvl4Id;
	}

	public void setLvl4Id(int lvl4Id) {
		this.lvl4Id = lvl4Id;
	}

	public int getLvl5Id() {
		return lvl5Id;
	}

	public void setLvl5Id(int lvl5Id) {
		this.lvl5Id = lvl5Id;
	}

	public int getLvl6Id() {
		return lvl6Id;
	}

	public void setLvl6Id(int lvl6Id) {
		this.lvl6Id = lvl6Id;
	}

	public int getLvl7Id() {
		return lvl7Id;
	}

	public void setLvl7Id(int lvl7Id) {
		this.lvl7Id = lvl7Id;
	}

	public int getLvl8Id() {
		return lvl8Id;
	}

	public void setLvl8Id(int lvl8Id) {
		this.lvl8Id = lvl8Id;
	}

	public int getLvl9Id() {
		return lvl9Id;
	}

	public void setLvl9Id(int lvl9Id) {
		this.lvl9Id = lvl9Id;
	}

	public int getLvl10Id() {
		return lvl10Id;
	}

	public void setLvl10Id(int lvl10Id) {
		this.lvl10Id = lvl10Id;
	}

	public String getLloc() {
		return lloc;
	}

	public void setLloc(String lloc) {
		this.lloc = lloc;
	}

	public String getLocationAlias() {
		return locationAlias;
	}

	public void setLocationAlias(String locationAlias) {
		this.locationAlias = locationAlias;
	}

	public int getEventType() {
		return eventType;
	}

	public void setEventType(int eventType) {
		this.eventType = eventType;
	}

	public int getDisplayType() {
		return displayType;
	}

	public void setDisplayType(int displayType) {
		this.displayType = displayType;
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

	public String getAlarmId() {
		return alarmId;
	}

	public void setAlarmId(String alarmId) {
		this.alarmId = alarmId;
	}

	public int getProbcauseInt() {
		return probcauseInt;
	}

	public void setProbcauseInt(int probcauseInt) {
		this.probcauseInt = probcauseInt;
	}

	public String getProbcauseStr() {
		return probcauseStr;
	}

	public void setProbcauseStr(String probcauseStr) {
		this.probcauseStr = probcauseStr;
	}

	public String getAdditionalText() {
		return additionalText;
	}

	public void setAdditionalText(String additionalText) {
		this.additionalText = additionalText;
	}

	public int getClearType() {
		return clearType;
	}

	public void setClearType(int clearType) {
		this.clearType = clearType;
	}

	public int getReserveInt() {
		return reserveInt;
	}

	public void setReserveInt(int reserveInt) {
		this.reserveInt = reserveInt;
	}

	public String getReserveStr() {
		return reserveStr;
	}

	public void setReserveStr(String reserveStr) {
		this.reserveStr = reserveStr;
	}

	public String getOperatorInfo() {
		return operatorInfo;
	}

	public void setOperatorInfo(String operatorInfo) {
		this.operatorInfo = operatorInfo;
	}

	public int getServiceAffect() {
		return serviceAffect;
	}

	public void setServiceAffect(int serviceAffect) {
		this.serviceAffect = serviceAffect;
	}

	public String getMsgName() {
		return msgName;
	}

	public void setMsgName(String msgName) {
		this.msgName = msgName;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public int getServiceStatus() {
		return serviceStatus;
	}

	public void setServiceStatus(int serviceStatus) {
		this.serviceStatus = serviceStatus;
	}

	public String getSysType() {
		return sysType;
	}

	public void setSysType(String sysType) {
		this.sysType = sysType;
	}

	public String getBandClass() {
		return bandClass;
	}

	public void setBandClass(String bandClass) {
		this.bandClass = bandClass;
	}

	public String getNeId() {
		return neId;
	}

	public void setNeId(String neId) {
		this.neId = neId;
	}

	public String getAlarmPosition() {
		return alarmPosition;
	}

	public void setAlarmPosition(String alarmPosition) {
		this.alarmPosition = alarmPosition;
	}

	public String getAlarmIdPosition() {
		return alarmIdPosition;
	}

	public void setAlarmIdPosition(String alarmIdPosition) {
		this.alarmIdPosition = alarmIdPosition;
	}
	
	public String getAckSystem() {
		return ackSystem;
	}

	public void setAckSystem(String ack_system) {
		this.ackSystem = ack_system;
	}
	
	public String getClearSystem() {
		return clearSystem;
	}
	
	public void setClearSystem(String clear_system) {
		this.clearSystem = clear_system;
	}
	
	public int getTechInfo() {
		return techInfo;
	}
	
	public void setTechInfo(int techInfo) {
		this.techInfo = techInfo;
	}
	
	public String getDn() {
		StringBuilder sbDn = new StringBuilder();
		sbDn.append(getLvl1Id() + ".");
		sbDn.append(getLvl2Id() + ".");
		sbDn.append(getLvl3Id() + ".");
		sbDn.append(getLvl4Id() + ".");
		sbDn.append(getLvl5Id() + ".");
		sbDn.append(getLvl6Id() + "");
		
		return sbDn.toString();
	}
	
}
