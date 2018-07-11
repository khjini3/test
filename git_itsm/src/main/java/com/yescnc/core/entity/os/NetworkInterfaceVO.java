package com.yescnc.core.entity.os;

import java.util.Date;

import lombok.Data;

@Data
public class NetworkInterfaceVO {

	private Date recordTime;
	private String name;
	private String displayName;
	private int mtu;
	private String mac;
	private String ipv4;
	private String ipv6;
	
	private long bytesRecv;
	private long bytesRecvTotal;
	private long bytesSent;
	private long bytesSentTotal;
	private long packetsRecv;
	private long packetsRecvTotal;
	private long packetsSent;
	private long packetsSentTotal;
	private long inErrors;
	private long outErrors;
	private long speed;
	private long timeStamp;
}
