package com.yescnc.core.util.ip;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;

public class IpUtil {
	  
	public static boolean isMyHostIpAddress(String ip) {
		try {
			return isMyHostIpAddress(InetAddress.getByName(ip));
		} catch (UnknownHostException e) {
			return false;
		}
	}

	public static boolean isMyHostIpAddress(InetAddress addr) {
		// Check if the address is a valid special local or loop back
		if (addr.isAnyLocalAddress() || addr.isLoopbackAddress())
			return true;
		// Check if the address is defined on any interface
		try {
			return NetworkInterface.getByInetAddress(addr) != null;
		} catch (SocketException e) {
			return false;
		}
	}

	public static String getMyHostIpList() {
		try {
			Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
			NetworkInterface ni = null;
			Enumeration<InetAddress> addresses = null;
			InetAddress addr = null;
			StringBuffer ip = new StringBuffer();

			if (networkInterfaces != null) {
				while (networkInterfaces.hasMoreElements()) {
					ni = networkInterfaces.nextElement();
					addresses = ni.getInetAddresses();
					while (addresses.hasMoreElements()) {
						addr = addresses.nextElement();
						ip.append(",");
						ip.append(addr.getHostAddress());
					}
				}
			}

			if (ip.length() > 0)
				return ip.substring(1);
		} catch (SocketException e) {
			e.printStackTrace();
		}

		return "";
	}
}
