package com.yescnc.core.lib.fm.util;

import java.io.Serializable;
import java.util.Date;

import com.yescnc.core.util.common.AlarmStruct;
import com.yescnc.core.util.common.FmConstant;



public class FmEvent implements Serializable {

  public static final int NOT_YET = -1;

  private int seqNo = -1;

  private int level1Id = -1;
  private int level2Id = -1;
  private int level3Id = -1;
  private int level4Id = -1;
  private int level5Id = -1;
  private int level6Id = -1;

  private String lloc = "";
  private String location = "";
  private int eventType = -1;
  private Date alarmTime = new Date();
  private int severity = -1;
  private int serviceAffect = -1;
  private int alarmGroup = -1;
  private String alarmId = "";
  private int probcauseInt = -1;
  private String probcauseStr = "";
  private String additionalText = "";
  private int ackType = 0;

  private boolean uiDisplay = true;
  private boolean storeDB = true;

  private String ackUser;
  private Date ackTime;
  private int clearType = NOT_YET;
  private String clearUser;
  private Date clearTime;
  private long clearedBySeqNo;
  private int genCount;
  private int reserveInt;
  private String reserveStr;
  private int durationTime;
  private String operationInfo;
  private Date occuredTime = null;

  public FmEvent() {}

  public FmEvent(int level1Id, int level2Id, int level3Id, int level4Id,
		  int level5Id, int level6Id, String lloc, int eventType, int severity, int clearType,
      int alarmGroup, String alarmId, Date occuredTime, String probcauseStr, String additionalText,
      boolean uiDisplay, boolean storeDB) {

    this.level1Id = level1Id;
    this.level2Id = level2Id;
    this.level3Id = level3Id;
    this.level4Id = level4Id;
    this.level5Id = level5Id;
    this.level6Id = level6Id;
    this.lloc = lloc;
    this.eventType = eventType;
    this.severity = severity;
    this.alarmGroup = alarmGroup;
    this.alarmId = alarmId;
    this.probcauseStr = probcauseStr;
    this.additionalText = additionalText;
    this.uiDisplay = uiDisplay;
    this.storeDB = storeDB;
    this.clearType = clearType;
    this.occuredTime = occuredTime;
  }

  public FmEvent(int level1Id, int level2Id, int level3Id, int level4Id,
		  int level5Id, int level6Id, String lloc, int eventType, int severity, int clearType,
      Date occuredTime, AlarmStruct alarmStrcut, String probcauseStr, String additionalText,
      boolean uiDisplay, boolean storeDB) {

    this.level1Id = level1Id;
    this.level2Id = level2Id;
    this.level3Id = level3Id;
    this.level4Id = level4Id;
    this.level5Id = level5Id;
    this.level6Id = level6Id;
    this.lloc = lloc;
    this.eventType = eventType;
    this.severity = severity;
    this.probcauseStr = probcauseStr;
    this.additionalText = additionalText;
    this.uiDisplay = uiDisplay;
    this.storeDB = storeDB;
    this.clearType = clearType;
    this.occuredTime = occuredTime;

    if (null != alarmStrcut) {
      this.alarmGroup = alarmStrcut.getGroup();
      this.alarmId = alarmStrcut.getAlarmId();

      if (null != probcauseStr && "".equalsIgnoreCase(probcauseStr)) {
        this.probcauseStr = alarmStrcut.getProbableCause();
      } else {
        this.probcauseStr = alarmStrcut.getProbableCause() + " ( " + probcauseStr + " )";
      }
    }

    if (null == additionalText) {
      additionalText = "";
    } else {
      this.additionalText = additionalText;
    }
  }

  public void init() {
    if (this.severity < 5 || this.severity > 10) {
      this.eventType = FmConstant.FM_TYPE_ALARM;
    } else if (this.severity == FmConstant.FM_SEVERITY_FAULT) {
      this.eventType = FmConstant.FM_TYPE_FAULT;
    } else {
      this.eventType = FmConstant.FM_TYPE_EVENT;
    }

    if (clearType != FmConstant.FM_CLEAR_TYPE_NONE) {
      if (this.severity < 10) {
        this.severity += 10;
      }

      if (null == this.occuredTime) {
        this.clearTime = this.occuredTime;
      } else {
        this.clearTime = new Date();
      }
    } else {
      if (null != this.occuredTime) {
        this.alarmTime = this.occuredTime;
      } else {
        this.alarmTime = new Date();
      }
    }
  }

  public int getSeqNo() {
    return seqNo;
  }

  public void setSeqNo(int seqNo) {
    this.seqNo = seqNo;
  }

  public int getLevel1Id() {
    return level1Id;
  }

  public void setLevel1Id(int level1Id) {
    this.level1Id = level1Id;
  }

  public int getLevel2Id() {
    return level2Id;
  }

  public void setLevel2Id(int level2Id) {
    this.level2Id = level2Id;
  }

  public int getLevel3Id() {
    return level3Id;
  }

  public void setLevel3Id(int level3Id) {
    this.level3Id = level3Id;
  }

  public int getLevel4Id() {
    return level4Id;
  }

  public void setLevel4Id(int level4Id) {
    this.level4Id = level4Id;
  }

  public int getLevel5Id() {
    return level5Id;
  }

  public void setLevel5Id(int level5Id) {
    this.level5Id = level5Id;
  }

  public int getLevel6Id() {
    return level6Id;
  }
  public void setLevel6Id (int level6Id) {
    this.level6Id = level6Id;
  }

  public String getLloc() {
    return lloc;
  }

  public void setLloc(String lloc) {
    this.lloc = lloc;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public int getEventType() {
    return eventType;
  }

  public void setEventType(int eventType) {
    this.eventType = eventType;
  }

  public Date getAlarmTime() {
    return alarmTime;
  }

  public void setAlarmTime(Date alarmTime) {
    this.alarmTime = alarmTime;
  }

  public int getSeverity() {
    return severity;
  }

  public void setSeverity(int severity) {
    this.severity = severity;
  }

  public int getServiceAffect() {
    return serviceAffect;
  }

  public void setServiceAffect(int serviceAffect) {
    this.serviceAffect = serviceAffect;
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

  public int getAckType() {
    return ackType;
  }

  public void setAckType(int ackType) {
    this.ackType = ackType;
  }

  public boolean isUiDisplay() {
    return uiDisplay;
  }

  public void setUiDisplay(boolean uiDisplay) {
    this.uiDisplay = uiDisplay;
  }

  public boolean isStoreDB() {
    return storeDB;
  }

  public void setStoreDB(boolean storeDB) {
    this.storeDB = storeDB;
  }

  public String getAckUser() {
    return ackUser;
  }

  public void setAckUser(String ackUser) {
    this.ackUser = ackUser;
  }

  public Date getAckTime() {
    return ackTime;
  }

  public void setAckTime(Date ackTime) {
    this.ackTime = ackTime;
  }

  public int getClearType() {
    return clearType;
  }

  public void setClearType(int clearType) {
    this.clearType = clearType;
  }

  public String getClearUser() {
    return clearUser;
  }

  public void setClearUser(String clearUser) {
    this.clearUser = clearUser;
  }

  public Date getClearTime() {
    return clearTime;
  }

  public void setClearTime(Date clearTime) {
    this.clearTime = clearTime;
  }

  public long getClearedBySeqNo() {
    return clearedBySeqNo;
  }

  public void setClearedBySeqNo(long clearedBySeqNo) {
    this.clearedBySeqNo = clearedBySeqNo;
  }

  public int getGenCount() {
    return genCount;
  }

  public void setGenCount(int genCount) {
    this.genCount = genCount;
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

  public int getDurationTime() {
    return durationTime;
  }

  public void setDurationTime(int durationTime) {
    this.durationTime = durationTime;
  }

  public String getOperationInfo() {
    return operationInfo;
  }

  public void setOperationInfo(String operationInfo) {
    this.operationInfo = operationInfo;
  }

  public Date getOccuredTime() {
    return occuredTime;
  }

  public void setOccuredTime(Date occuredTime) {
    this.occuredTime = occuredTime;
  }

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append("FmEvent [seqNo=");
    builder.append(seqNo);
    builder.append(", level1Id=");
    builder.append(level1Id);
    builder.append(", level2Id=");
    builder.append(level2Id);
    builder.append(", level3Id=");
    builder.append(level3Id);
    builder.append(", level4Id=");
    builder.append(level4Id);
    builder.append(", level5Id=");
    builder.append(level5Id);
    builder.append(", level6Id=");
    builder.append(level6Id);
    builder.append(", lloc=");
    builder.append(lloc);
    builder.append(", location=");
    builder.append(location);
    builder.append(", eventType=");
    builder.append(eventType);
    builder.append(", alarmTime=");
    builder.append(alarmTime);
    builder.append(", severity=");
    builder.append(severity);
    builder.append(", serviceAffect=");
    builder.append(serviceAffect);
    builder.append(", alarmGroup=");
    builder.append(alarmGroup);
    builder.append(", alarmId=");
    builder.append(alarmId);
    builder.append(", probcauseInt=");
    builder.append(probcauseInt);
    builder.append(", probcauseStr=");
    builder.append(probcauseStr);
    builder.append(", additionalText=");
    builder.append(additionalText);
    builder.append(", ackType=");
    builder.append(ackType);
    builder.append(", uiDisplay=");
    builder.append(uiDisplay);
    builder.append(", storeDB=");
    builder.append(storeDB);
    builder.append(", ackUser=");
    builder.append(ackUser);
    builder.append(", ackTime=");
    builder.append(ackTime);
    builder.append(", clearType=");
    builder.append(clearType);
    builder.append(", clearUser=");
    builder.append(clearUser);
    builder.append(", clearTime=");
    builder.append(clearTime);
    builder.append(", clearedBySeqNo=");
    builder.append(clearedBySeqNo);
    builder.append(", genCount=");
    builder.append(genCount);
    builder.append(", reserveInt=");
    builder.append(reserveInt);
    builder.append(", reserveStr=");
    builder.append(reserveStr);
    builder.append(", durationTime=");
    builder.append(durationTime);
    builder.append(", operationInfo=");
    builder.append(operationInfo);
    builder.append(", occuredTime=");
    builder.append(occuredTime);
    builder.append("]");
    return builder.toString();
  }
}
