package com.yescnc.core.main.websocket;

import java.util.List;

public class EventData {
	String loginId;
	String loginIp;
	String dn;
	String resState;
	int clientId;
	String seqNo;
	Object[] data;

	public String getDn() {
		return this.dn;
	}

	public void setDn(String dn) {
		this.dn = dn;
	}

	public String getLoginIp() {
		return this.loginIp;
	}

	public void setLoginIp(String loginIp) {
		this.loginIp = loginIp;
	}

	public String getLoginId() {
		return this.loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public int getClientId() {
		return this.clientId;
	}

	public void setClientId(int clientId) {
		this.clientId = clientId;
	}

	public String getSeqNo() {
		return this.seqNo;
	}

	public void setSeqNo(String seqNo) {
		this.seqNo = seqNo;
	}

	public String getResState() {
		return this.resState;
	}

	public void setResState(String resState) {
		this.resState = resState;
	}

	public Object[] getData() {
		return this.data;
	}

	public void setData(Object[] data) {
		this.data = data;
	}

	public String toDataString() {
		Object[] data = getData();
		if ((data == null) || (data.length == 0)) {
			return "";
		}

		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < data.length; ++i) {
			//buffer.append("[" + getSeqNoFromData(data[i]) + "]");
			buffer.append("[" + data[i].toString() + "]");
		}
		return buffer.toString();
	}

	private String getSeqNoFromData(Object data) {
		if (data instanceof List) {
			return "" + ((List) data).get(1);
		}

		return "" + ((Object[]) (Object[]) data)[1];
	}

	public EventData clone() {
		EventData eventData = new EventData();
		eventData.setDn(this.dn);
		eventData.setLoginIp(this.loginIp);
		eventData.setLoginId(this.loginId);
		eventData.setClientId(this.clientId);
		eventData.setSeqNo(this.seqNo);
		return eventData;
	}

	public String toString() {
		return String.format("loginId[%s],loginIp[%s],dn[%s],clientId[%d],seqNo[%s],resState[%s],data[%s]", new Object[] {
				this.loginId, this.loginIp, this.dn, Integer.valueOf(this.clientId), this.seqNo, this.resState, this.data, toDataString() });
	}
}
