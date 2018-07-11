package com.yescnc.core.entity.db;

import java.io.Serializable;

public class MsInfoDto implements Serializable {
	
	private static final long serialVersionUID = -6860441842364557713L;
	
	private int nLvl1Id;
	private String strIpAddr;
	private boolean isAliveMs;
	
	public MsInfoDto(int nLvl1Id, String strIpAddr) {
		super();
		this.nLvl1Id = nLvl1Id;
		this.strIpAddr = strIpAddr;
	}

	public int getnLvl1Id() {
		return nLvl1Id;
	}

	public String getStrIpAddr() {
		return strIpAddr;
	}
	
	@Override
	public String toString() {
		return "[Lvl1ID : " + this.nLvl1Id + ", IpAddr : " + this.strIpAddr + "]";
	}

	public boolean isAliveMs() {
		return isAliveMs;
	}

	public void setAliveMs(boolean isAliveMs) {
		this.isAliveMs = isAliveMs;
	}
	
}
