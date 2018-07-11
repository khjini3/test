package com.yescnc.core.util.ip;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.yescnc.core.entity.db.IpVO;
import com.yescnc.core.entity.db.LoginHistoryVO;

@Component
@Scope("prototype")
public class IpFilterChecker {
	private static final Logger logger = LoggerFactory.getLogger(IpFilterChecker.class);

	@SuppressWarnings("unused")
	private Boolean checkCountByAddress(String ipaddress, List<IpVO> ipList, List<LoginHistoryVO> currentLoginLog)
			throws Exception {
		Boolean result = false;
		/*
		Map addressFilter = getAddressFilter(ipaddress);
		String address = (String) addressFilter.get("IP");
		Integer sessionCnt = (Integer) addressFilter.get("SESSION_CNT");

		int count = 0;
		SQLResult sql = DbSm.getCurrentLoginLog();
		if (result == 10000) {
			Vector ipVector = (Vector) FRV_hash.get("LLOC");
			String compare = address.indexOf("*") < 0 ? address : address.substring(0, address.indexOf("*"));
			for (int i = 0; i < ipVector.size(); i++) {
				if (ipVector.get(i).toString().indexOf(compare) >= 0) {
					count++;
				}
			}
		} else if (result == 10002) {
			count = 0;
		} else {
			throw new Exception("message.db.fail");
		}
		if (sessionCnt.intValue() <= count) {
			if (address.indexOf("*") < 0) {
				throw new Exception("letter.message.ip.working");
			}
			throw new Exception("letter.message.ip.band.working");
		}
		*/
		try {
			Map addressFilter = getAddressFilter(ipaddress, ipList);
			String address = (String) addressFilter.get("IP");
			Integer sessionCnt = (Integer) addressFilter.get("SESSION_CNT");

			int count = 0;

			if (null != currentLoginLog || !currentLoginLog.isEmpty()) {
				String compare = address.indexOf("*") < 0 ? address : address.substring(0, address.indexOf("*"));

				for (LoginHistoryVO currentLogin : currentLoginLog) {
					if (currentLogin.getLloc().toString().indexOf(compare) >= 0) {
						count++;
					}
				}
			} else if(null != currentLoginLog || currentLoginLog.isEmpty()){
				count = 0;
			} else {
				throw new Exception("message.db.fail");
			}

			if (sessionCnt.intValue() <= count) {
				if (address.indexOf("*") < 0) {
					throw new Exception("letter.message.ip.working");
				}
				throw new Exception("letter.message.ip.band.working");
			}
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
			result = false;
		}

		return result;
	}

	private int findPosition(Vector ips, Vector sessions, String host) {
		if ((ips == null) || (sessions == null) || (ips.size() != sessions.size())) {
			return -1;
		}
		String ipaddress = "";
		for (int i = 0; i < ips.size(); i++) {
			ipaddress = (String) ips.get(i);
			if (host.equals(ipaddress)) {
				return i;
			}
		}
		return 0;
	}

	private Map getAddressFilter(String ipaddress, List<IpVO> ipList) throws Exception {
		Map filterMap = new HashMap(2);
		String[] supernet = IpAddressChecker.getParentNetwork(ipaddress);

		/*
		 * Vector sortKey = new Vector(); sortKey.addElement("IP"); SQLResult
		 * sql = DbSm.getIp(1, Integer.MAX_VALUE, -1, "N/A", sortKey, 101);
		 */
		if (null != ipList) {
			if (ipList.isEmpty()) {
				throw new Exception("letter.message.noips");
			}
		} else {
			throw new Exception("letter.message.dbfail");
		}

		Vector<String> ipVector = new Vector<String>();
		Vector<String> countVector = new Vector<String>();
		for (IpVO ip : ipList) {
			ipVector.add(ip.getIpAddress());
			// 현재 CORE에 IP SESSION COUNT가 없어서 임의로 255넣음.
			countVector.add("255");
		}

		/*
		 * Vector ipVector = (Vector) FRV_hash.get("IP"); Vector countVector =
		 * (Vector) FRV_hash.get("SESSION_CNT");
		 */

		int position = 0;
		if (ipVector.contains(ipaddress) == true) {
			position = findPosition(ipVector, countVector, ipaddress);
			filterMap.put("IP", ipVector.get(position).toString());
			filterMap.put("SESSION_CNT", new Integer(countVector.get(position).toString()));
		} else {
			for (int i = 0; i < supernet.length; i++) {
				if (ipVector.contains(supernet[i]) == true) {
					position = findPosition(ipVector, countVector, supernet[i]);
					filterMap.put("IP", ipVector.get(position).toString());
					filterMap.put("SESSION_CNT", new Integer(countVector.get(position).toString()));

					break;
				}
			}
		}
		logger.info("[crte_session2] IP filterMap: " + filterMap);

		int allowedSession = -1;
		if (filterMap.containsKey("SESSION_CNT")) {
			Integer sessionCnt = (Integer) filterMap.get("SESSION_CNT");
			allowedSession = sessionCnt.intValue();
		}
		if (allowedSession < 1) {
			throw new Exception("letter.message.notallowedip");
		}
		return filterMap;
	}
}
