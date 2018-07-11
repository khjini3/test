package com.yescnc.core.util.common;

public class AlarmStruct {

  private String alarmId;
  private String probableCause;
  private int group;
  
  public AlarmStruct(String alarmId, String probableCause, int group) {
    super();
    this.alarmId = alarmId;
    this.probableCause = probableCause;
    this.group = group;
  }

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append("AlarmStruct [alarmId=");
    builder.append(alarmId);
    builder.append(", probableCause=");
    builder.append(probableCause);
    builder.append(", group=");
    builder.append(group);
    builder.append("]");
    return builder.toString();
  }

  public String getAlarmId() {
    return alarmId;
  }

  public void setAlarmId(String alarmId) {
    this.alarmId = alarmId;
  }

  public String getProbableCause() {
    return probableCause;
  }

  public void setProbableCause(String probableCause) {
    this.probableCause = probableCause;
  }

  public int getGroup() {
    return group;
  }

  public void setGroup(int group) {
    this.group = group;
  }
    
}
