package com.yescnc.core.entity.db;

import java.io.Serializable;

import com.yescnc.core.util.common.EventTimeUtil;


public class FmClientVO implements Serializable {
	
	private static final long serialVersionUID = -6918377120694739505L;
	
	private int clientId;
	private String lastSeqWithMsId;
	private String lastUpdateTime;
	private int clientType;
	private String strIpAddr = "";
	private boolean isBufferOver = false;
	public void updateLastSeqAndTime(String lastSeqWithMsId) {

		this.lastSeqWithMsId = lastSeqWithMsId;
		this.refreshLastTime();
		
	}
	
	private void refreshLastTime() {
		this.lastUpdateTime = EventTimeUtil.getCurTimeOfEventTimeFmt();
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("\n[FmClientDto][ClientId:").append(this.clientId)
		.append(", LastSeq:").append(this.lastSeqWithMsId)
		.append(", UpdateTime:").append(this.lastUpdateTime)
		.append(", ClientType:").append(this.clientType)
		.append(", isBufferOver:").append(this.isBufferOver)
		.append(", IPAddr:").append(this.strIpAddr).append("]");
		return sb.toString();
	}

	//[start] Getter & Setter
	
	public int getClientId() {
		return clientId;
	}

	public void setClientId(int clinetId) {
		this.clientId = clinetId;
	}

	public String getLastSeqWithMsId() {
		return lastSeqWithMsId;
	}

	public void setLastSeqWithMsId(String lastSeqWithMsId) {
		this.lastSeqWithMsId = lastSeqWithMsId;
	}

	public String getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(String lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public int getClientType() {
		return clientType;
	}

	public void setClientType(int clientType) {
		this.clientType = clientType;
	}

	public String getStrIpAddr() {
		return strIpAddr;
	}

	public void setStrIpAddr(String strIpAddr) {
		this.strIpAddr = strIpAddr;
	}

	/**
	 * @return the isBufferOver
	 */
	public boolean isBufferOver()
	{
		return isBufferOver;
	}

	/**
	 * @param isBufferOver the isBufferOver to set
	 */
	public void setBufferOver(boolean isBufferOver)
	{
		this.isBufferOver = isBufferOver;
	}

	
	//[end]
	
}
