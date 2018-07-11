package com.yescnc.core.lib.os;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.yescnc.core.entity.os.NetworkInterfaceVO;
import com.yescnc.core.scheduler.SystemCheckScheduler;
import com.yescnc.core.util.date.DateUtil;

import oshi.hardware.NetworkIF;

@Component
public class NetworkInfo {

	private static final Logger logger = LoggerFactory.getLogger(NetworkInfo.class);
	
	@Autowired
	SystemCheckScheduler systemScheduler;
	
	public Optional<List<NetworkInterfaceVO>> getNetworkInterface() {
		
		//logger.info("getNetworkInterface() start at "+ LocalTime.now()); 
		
		oshi.SystemInfo si = new oshi.SystemInfo();
		Optional<List<NetworkInterfaceVO>> networkOption = null;
		try {
			List<NetworkInterfaceVO> netList = Lists.newArrayList();
			
			Date checkDate = DateUtil.getDbInsertZeroSecond();
			Optional<List<NetworkInterfaceVO>> preNetworkListOption = systemScheduler.getRealtimeNetwork();
			
			for (NetworkIF net : si.getHardware().getNetworkIFs()) {
				NetworkInterfaceVO netInfo = new NetworkInterfaceVO();
				
				netInfo.setRecordTime(checkDate);
				netInfo.setName(net.getName());
				
				netInfo.setDisplayName(net.getDisplayName());
				netInfo.setMac(net.getMacaddr());
				
				String[] ipv4Arr = net.getIPv4addr();
				String ipV4 = (null != ipv4Arr && ipv4Arr.length>0 ) ? ipv4Arr[0] :"N/A";
				netInfo.setIpv4(ipV4);
				
				String[] ipv6Arr = net.getIPv4addr();
				String ipV6 = (null != ipv6Arr && ipv6Arr.length>0 ) ? ipv6Arr[0] :"N/A";
				netInfo.setIpv6(ipV6);
				
				netInfo.setMtu(net.getMTU());
				
				netInfo.setBytesRecvTotal(net.getBytesRecv());
				netInfo.setBytesSentTotal(net.getBytesSent());
				netInfo.setPacketsRecvTotal(net.getPacketsRecv());
				netInfo.setPacketsSentTotal(net.getPacketsSent());
				
				if(preNetworkListOption.isPresent()){
					List<NetworkInterfaceVO> list = preNetworkListOption.get();
					Optional<NetworkInterfaceVO> preNetworkOption = list
							.stream()
							.filter(network -> network.getName().equalsIgnoreCase(net.getName()))
							.findFirst();
					if(preNetworkOption.isPresent()){
						NetworkInterfaceVO network = preNetworkOption.get();
						netInfo.setBytesRecv(netInfo.getBytesRecvTotal()-network.getBytesRecvTotal());
						netInfo.setBytesSent(netInfo.getBytesSentTotal()-network.getBytesSentTotal());
						netInfo.setPacketsRecv(netInfo.getPacketsRecvTotal()-network.getPacketsRecvTotal());
						netInfo.setPacketsSent(netInfo.getPacketsSentTotal()-network.getPacketsSentTotal());
					
					}
				}
					
				netInfo.setInErrors(net.getInErrors());
				netInfo.setOutErrors(net.getOutErrors());
				netInfo.setTimeStamp(net.getTimeStamp());
				netInfo.setSpeed(net.getSpeed());
				
				netList.add(netInfo);
			}
			
			networkOption = Optional.ofNullable(netList);
		} catch (Exception e) {
			e.printStackTrace();
			networkOption = Optional.empty();
		}

		return networkOption;
	}
}
