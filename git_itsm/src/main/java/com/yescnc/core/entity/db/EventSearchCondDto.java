package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

import com.yescnc.core.util.common.LogUtil;
//import java.util.Map.Entry;

//import com.yescnc.framework.lib.alarm.EmsInfoList;



public class EventSearchCondDto implements Serializable, Cloneable {
	
	private static final long serialVersionUID = -5840094520764374604L;
	
	/* Target Conditions */
	private boolean isSave = false;
	private boolean isTargetAll = false;
	private boolean isEmsEventOnly = false;
	private boolean isNeEventOnly = false;
	private boolean isSingleMcServer = false;	// filter condition in fm_t_alarms for (kddi, uq) vendor.
	private HashMap<Integer, ArrayList<Integer>> hmLvl3IdByMsId;
	private ArrayList<Integer> alLvl3Ids;
	
	/* Date Condition */
	private String strFromTime;
	private String strToTime;
	
	/* Another Condition */
	private	int eventType = -1;
	private ArrayList<Integer> alSeverity;
	private	ArrayList<Integer> alAlarmGroup;
	private ArrayList<String> alAlarmId;
	private	int ackType = -1;
	private	int	clearType = -1;
	
	/* Page Condition */
	private int nRqstedPage = -1;
	private int nStartRow = -1;
	
	private String strSortColumn = "ALARM_TIME";
	private String strSortOrder = "ASC";
	
	private int nRowCntPerPage = 100;
	
	// For FM old table like fm_t_alarms, fm_t_events
	private boolean isNeedToQueryOldTable = false;
	
	//For FM new table like fm_t_cur_alarms, fm_t_hist
	private boolean isNeedToQueryNewTable = false;

	public EventSearchCondDto() {
		
	}

	public EventSearchCondDto(boolean isTargetAll, boolean isEmsEventOnly,
			int nLvl1Id, int nLvl2Id, int nLvl3Id, String strFromTime,
			String strToTime, int eventType, ArrayList<Integer> alSeverity,
			ArrayList<Integer> alAlarmGroup, ArrayList<String> alAlarmId,
			int ackType, int clearType, int nRqstedPage, String strSortColumn,
			String strSortOrder, int nRowCntPerPage, HashMap<Integer, ArrayList<Integer>> hmLvl3IdByMsId) {
		super();
		this.isTargetAll = isTargetAll;
		this.isEmsEventOnly = isEmsEventOnly;
		// this.isNeEventOnly = isNeEventOnly;
		this.strFromTime = strFromTime;
		this.strToTime = strToTime;
		this.eventType = eventType;
		this.alSeverity = alSeverity;
		this.alAlarmGroup = alAlarmGroup;
		this.alAlarmId = alAlarmId;
		this.ackType = ackType;
		this.clearType = clearType;
		this.setnRqstedPage(nRqstedPage);
		this.strSortColumn = strSortColumn.toUpperCase();
		this.strSortOrder = strSortOrder;
		this.nRowCntPerPage = nRowCntPerPage;
		this.hmLvl3IdByMsId = hmLvl3IdByMsId;
	}
	
	@Override
	public EventSearchCondDto clone() {
		try {
			EventSearchCondDto clonedObj = (EventSearchCondDto) super.clone();
			return setMemberVar(this, clonedObj);
		} catch (CloneNotSupportedException e) {
			 LogUtil.warning(e) ;
			//e.printStackTrace();
		}
		return setMemberVar(this, new EventSearchCondDto());
	}
	
	private EventSearchCondDto setMemberVar(EventSearchCondDto original, EventSearchCondDto copiedOne) {
		copiedOne.isSave = original.isSave;
		copiedOne.isTargetAll = original.isTargetAll;
		copiedOne.isEmsEventOnly = original.isEmsEventOnly;
		copiedOne.isNeEventOnly = original.isNeEventOnly;
		copiedOne.isSingleMcServer = original.isSingleMcServer;
		copiedOne.strFromTime = original.strFromTime;
		copiedOne.strToTime = original.strToTime;
		copiedOne.eventType = original.eventType;
		if ( original.alSeverity != null )
			copiedOne.alSeverity = (ArrayList<Integer>) original.alSeverity.clone();
		if ( original.alAlarmGroup != null )
			copiedOne.alAlarmGroup = (ArrayList<Integer>) original.alAlarmGroup.clone();
		if ( original.alAlarmId != null )
			copiedOne.alAlarmId = (ArrayList<String>) original.alAlarmId.clone();
		copiedOne.ackType = original.ackType;
		copiedOne.clearType = original.clearType;
		
		copiedOne.nRqstedPage = original.nRqstedPage;
		copiedOne.nStartRow = original.nStartRow;
		
		copiedOne.strSortColumn = original.strSortColumn;
		copiedOne.strSortOrder = original.strSortOrder;
		
		copiedOne.nRowCntPerPage = original.nRowCntPerPage;
		
		if ( original.hmLvl3IdByMsId != null )
			copiedOne.hmLvl3IdByMsId = (HashMap<Integer, ArrayList<Integer>>) original.hmLvl3IdByMsId.clone();
		
		if ( original.alLvl3Ids != null )
			copiedOne.alLvl3Ids = (ArrayList<Integer>) original.alLvl3Ids.clone();
		
		return copiedOne;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("\n[isTargetAll : ").append(this.isTargetAll).append("\t/")
		  .append("isEmsEventOnly : ").append(this.isEmsEventOnly).append("\t/")
		  .append("isNeEventOnly : ").append(this.isNeEventOnly).append("\t/")
		  .append("isSingleMcServer : ").append(this.isSingleMcServer).append("\t/")
		  .append("strFromTime : ").append(this.strFromTime).append("\n/")
		  .append("strToTime : ").append(this.strToTime).append("\t/")
		  .append("eventType : ").append(this.eventType).append("\t/")
		  .append("alSeverity : ").append(this.alSeverity).append("\n/")
		  .append("alAlarmGroup : ").append(this.alAlarmGroup).append("\t/")
		  .append("alAlarmId : ").append(this.alAlarmId).append("\t/")
		  .append("ackType : ").append(this.ackType).append("\n/")
		  .append("clearType : ").append(this.clearType).append("\t/")
		  .append("ackType : ").append(this.ackType).append("\t/")
		  .append("nRqstedPage : ").append(this.nRqstedPage).append("\n/")
		  .append("strSortColumn : ").append(this.strSortColumn).append("\t/")
		  .append("strSortOrder : ").append(this.strSortOrder).append("\t/")
		  .append("hmLvl3IdByMsId : ").append(this.hmLvl3IdByMsId).append("\t/")
		  .append("alLvl3Ids : ").append(this.alLvl3Ids);
		return sb.toString();
	}
	
	
 	public boolean isSave() {
		return isSave;
	}

	public void setSave(boolean isSave) {
		this.isSave = isSave;
	}

	public String getStrSortColumn() {
		return strSortColumn;
	}

	public void setStrSortColumn(String strSortColumn) {
		this.strSortColumn = strSortColumn.toUpperCase();
	}

	public String getStrSortOrder() {
		return strSortOrder;
	}

	public void setStrSortOrder(String strSortOrder) {
		this.strSortOrder = strSortOrder;
	}

	public boolean isTargetAll() {
		return isTargetAll;
	}

	public void setTargetAll(boolean isTargetAll) {
		this.isTargetAll = isTargetAll;
	}

	public boolean isEmsEventOnly() {
		return isEmsEventOnly;
	}

	public void setEmsEventOnly(boolean isEmsEventOnly) {
		this.isEmsEventOnly = isEmsEventOnly;
	}

	public boolean isNeEventOnly() {
		return isNeEventOnly;
	}

	public void setNeEventOnly(boolean isNeEventOnly) {
		isNeEventOnly = isNeEventOnly;
	}
	
	public boolean isSingleMcServer() {
		return isSingleMcServer;
	}

	public void setSingleMcServer(boolean isSingleMcServer) {
		this.isSingleMcServer = isSingleMcServer;
	}

	public String getStrFromTime() {
		return strFromTime;
	}

	public void setStrFromTime(String strFromTime) {
		this.strFromTime = strFromTime;
	}

	public String getStrToTime() {
		return strToTime;
	}

	public void setStrToTime(String strToTime) {
		this.strToTime = strToTime;
	}

	public int getEventType() {
		return eventType;
	}

	public void setEventType(int eventType) {
		this.eventType = eventType;
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

	public int getClearType() {
		return clearType;
	}

	public void setClearType(int clearType) {
		this.clearType = clearType;
	}

	public int getnRqstedPage() {
		return nRqstedPage;
	}

	public void setnRqstedPage(int nRqstedPage) {
		this.nRqstedPage = nRqstedPage;
		this.nStartRow = nRqstedPage <= 1 ? 0 : (nRqstedPage-1) * this.nRowCntPerPage;
	}

	public int getnStartRow() {
		return nStartRow;
	}

	public int getnRowCntPerPage() {
		return nRowCntPerPage;
	}

	public void setnRowCntPerPage(int nRowCntPerPage) {
		this.nRowCntPerPage = nRowCntPerPage;
	}

	public boolean isNeedToQueryOldTable() {
		return isNeedToQueryOldTable;
	}

	public void setNeedToQueryOldTable(boolean isNeedToQueryOldTable) {
		this.isNeedToQueryOldTable = isNeedToQueryOldTable;
	}

	public boolean isNeedToQueryNewTable() {
		return isNeedToQueryNewTable;
	}

	public void setNeedToQueryNewTable(boolean isNeedToQueryNewTable) {
		this.isNeedToQueryNewTable = isNeedToQueryNewTable;
	}
	
	public HashMap<Integer, ArrayList<Integer>> getHmLvl3IdByMsId() {
		return hmLvl3IdByMsId;
	}

	public void setHmLvl3IdByMsId(HashMap<Integer, ArrayList<Integer>> hmLvl3IdByMsId) {
		this.hmLvl3IdByMsId = hmLvl3IdByMsId;
	}

	public ArrayList<Integer> getAlLvl3Ids() {
		return alLvl3Ids;
	}

	public void setAlLvl3Ids(ArrayList<Integer> alLvl3Ids) {
		this.alLvl3Ids = alLvl3Ids;
	}
	
}
