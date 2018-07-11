package com.yescnc.core.util.ip;

import java.net.InetAddress;
import java.util.StringTokenizer;

public class IpAddressChecker {
	/* Constants */
	private static final int MAX_SIZE_IPV4 = 4;
	private static final int MAX_SIZE_IPV6 = 8;

	private static final String SEPARATOR_IPV4 = ".";
	private static final String SEPARATOR_IPV6 = ":";

	private static final String FORMAT_IPV4 = "^(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}$";

	// private static final String IPV4_REGEX =
	// "\\A(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}\\z";
	private static final String IPV6_HEX4DECCOMPRESSED_REGEX = "\\A((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}:)*)(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}\\z";
	private static final String IPV6_6HEX4DEC_REGEX = "\\A((?:[0-9A-Fa-f]{1,4}:){6,6})(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}\\z";
	private static final String IPV6_HEXCOMPRESSED_REGEX = "\\A((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)\\z";
	private static final String IPV6_REGEX = "\\A(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\z";
	private static final String FORMAT_IPV6 = /* IPV4_REGEX + "|" + */IPV6_HEX4DECCOMPRESSED_REGEX
			+ "|"
			+ IPV6_6HEX4DEC_REGEX
			+ "|"
			+ IPV6_HEXCOMPRESSED_REGEX
			+ "|"
			+ IPV6_REGEX;

	/**
	 * isValidIP
	 */
	public static boolean isValidIP(String ip) {
		if (ip == null) {
			return false;
		}

		if (isIPv6(ip)) {
			return ip.matches(FORMAT_IPV6);
		} else {
			return ip.matches(FORMAT_IPV4);
		}
	}
	
	public static boolean isValidIP(String ip,String ipVer) {
		if (ip == null) {
			return false;
		}

		if ("1".equals(ipVer)) {
			return ip.matches(FORMAT_IPV4);
		} else {
			return ip.matches(FORMAT_IPV6);
		}
	}

	/**
	 * isIPv4
	 */
	public static boolean isIPv4(String ip) {
		return hasString(ip, SEPARATOR_IPV4);
	}

	/**
	 * isIPv6
	 */
	public static boolean isIPv6(String ip) {
		return hasString(ip, SEPARATOR_IPV6);
	}

	public static boolean isValidIpv6(String ip) {
		return ip.matches(FORMAT_IPV6);
	}
	
	/**
	 * getIpAddress
	 */
	public static String getIpAddress(String ip) {
		if (isIPv6(ip)) {
			String formatIp = getHostAddressValue(ip);
			if (formatIp != null) {
				return formatIp;
			}
		}

		return ip;
	}

	/**
	 * getIpAddressWithAsterisk
	 */
	public static String getIpAddressWithAsterisk(String ip) {
		if (ip == null || ip.length() < 2) {
			return null; // ( Invalid! )
		}

		/* IP has a asterisk. */
		if (hasString(ip, "*")) {
			int asteriskStringLength = ip.indexOf("*") + 1;
			String separator = getPreviousChar(ip, "*");
			boolean isIPv4 = SEPARATOR_IPV4.equals(separator);
			boolean isIPv6 = SEPARATOR_IPV6.equals(separator);

			// <o>--- [ÀüÁ¦Á¶°Ç] * ¾Õ¿¡´Â . È¤Àº : ÀÌ¾î¾ß ÇÑ´Ù.
			if (!(isIPv4 || isIPv6)) {
				return null; // ( Invalid! )
			}

			// <o>--- [ÀüÁ¦Á¶°Ç] * µÚ¿¡´Â ¹®ÀÚ°¡ ¾ø¾î¾ß ÇÑ´Ù.
			if (asteriskStringLength < ip.length()) {
				return null; // ( Invalid! )
			}

			// <o>--- [ÀüÁ¦Á¶°Ç] * »ç¿ë ½Ã, :: ¸¦ »ç¿ëÇÒ ¼ö ¾ø´Ù. 0 À» ¾ÐÃàÇÒ ¼ö ¾ø´Ù.
			if (hasString(ip, "::")) {
				return null; // ( Invalid! )
			}

			// <o>--- * ´ë½Å¿¡ IP Ã¼Å©°¡ °¡´ÉÇÑ 0 °ú : ·Î º¯°æÇÏ±â
			int asteriskArrayIndex = getAsteriskIndex(isIPv6, ip);
			String ipI = getIPAsteriskTempString(isIPv6, ip, asteriskArrayIndex);
			// printDebug("ip  : " + ip);
			// printDebug("ipI : " + ipI + " (tempIP)");

			// <o>--- Check IP (1st)
			if (!isValidIP(ipI)) {
				return null; // ( Invalid! )
			}

			// <o>--- Check IP (2nd) and get well-formed address.
			String ipJ = getHostAddressValue(ipI);
			// printDebug("ipJ : " + ipJ);

			if (ipJ == null) {
				return null; // ( Invalid! )
			}

			// <o>--- ´Ù½Ã * ÇüÅÂ·Î µÇµ¹¸®±â (well-formed address À¯ÁöÇØ¾ß ÇÔ)
			String ipK = getIPAsteriskNewString(isIPv6, ipJ, asteriskArrayIndex);
			// printDebug("ipK : " + ipK + " (newIP)");

			return ipK;
		}
		/* IP doesn't have a asterisk. */
		else {
			if (isValidIP(ip)) {
				String formatIp = getHostAddressValue(ip);
				if (formatIp != null) {
					return formatIp;
				}
			}

			return null; // ( Invalid! )
		}
	}

	/**
	 * getHostAddressValue
	 */
	private static String getHostAddressValue(String ip) {
		try {
			InetAddress ia = InetAddress.getByName(ip); // IP checking step.

			/* return well-formed address */
			return ia.getHostAddress();

		} catch (Exception e) {
			return null; // Invalid IP on IP checking step.
		}
	}

	/**
	 * hasString
	 */
	private static boolean hasString(String str, String IN) {
		if (str == null) {
			return false;
		}

		return (str.indexOf(IN) >= 0);
	}

	/**
	 * getPreviousChar
	 */
	private static String getPreviousChar(String str, String separator) {
		if (str == null) {
			return null;
		}

		int index = str.indexOf(separator);

		if (index < 1) {
			return null;
		} else {
			return str.substring(index - 1, index);
		}
	}

	/**
	 * getReplacedString
	 */
	private static String getReplacedString(String str, String FROM, String TO) {
		if (hasString(str, FROM)) {
			StringBuffer strBuffer = new StringBuffer(str);
			int index = str.lastIndexOf(FROM);

			strBuffer = strBuffer.replace(index, index + FROM.length(), TO);

			return strBuffer.toString();
		} else {
			return str;
		}
	}

	/**
	 * getStringArray
	 */
	private static String[] getStringArray(String str, String separator) {
		StringTokenizer st = new StringTokenizer(str, separator);

		String[] values = new String[st.countTokens()];
		int count = 0;

		while (st.hasMoreTokens()) {
			values[count++] = st.nextToken().trim();
		}

		return values;
	}

	/**
	 * getAsteriskIndex
	 */
	private static int getIPMaxSize(boolean isIPv6) {
		return isIPv6 ? MAX_SIZE_IPV6 : MAX_SIZE_IPV4;
	}

	/**
	 * getIPSeparator
	 */
	private static String getIPSeparator(boolean isIPv6) {
		return isIPv6 ? SEPARATOR_IPV6 : SEPARATOR_IPV4;
	}

	/**
	 * getAsteriskIndex
	 */
	private static int getAsteriskIndex(boolean isIPv6, String ip) {
		int max_size = getIPMaxSize(isIPv6);
		String separator = getIPSeparator(isIPv6);

		String[] array = getStringArray(ip, separator);

		for (int i = 0; i < array.length && i < max_size; i++) {
			if ("*".equals(array[i])) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * getIPAsteriskTempString
	 */
	private static String getIPAsteriskTempString(boolean isIPv6, String ip,
			int asteriskArrayIndex) {
		if (isIPv6) {
			return getReplacedString(ip, ":*", "::");
		} else {
			return getIPv4AsteriskTempString(isIPv6, ip, asteriskArrayIndex);
		}
	}

	/**
	 * getIPv4AsteriskTempString
	 */
	private static String getIPv4AsteriskTempString(boolean isIPv6, String ip,
			int asteriskArrayIndex) {
		int max_size = getIPMaxSize(isIPv6);
		String separator = getIPSeparator(isIPv6);

		String[] tempIP = new String[max_size];
		String[] array = getStringArray(ip, separator);

		for (int i = 0; i < max_size; i++) {
			if (i < asteriskArrayIndex) {
				tempIP[i] = array[i];
			} else {
				tempIP[i] = "0";
			}
		}

		return getIPString(tempIP, separator);
	}

	/**
	 * getIPAsteriskNewString
	 */
	private static String getIPAsteriskNewString(boolean isIPv6, String ip,
			int asteriskArrayIndex) {
		int max_size = getIPMaxSize(isIPv6);
		String separator = getIPSeparator(isIPv6);

		String[] array = getStringArray(ip, separator);

		if (asteriskArrayIndex < max_size) {
			array[asteriskArrayIndex] = "*";
		}

		return getIPString(array, separator);
	}

	/**
	 * getIPString
	 */
	private static String getIPString(String[] array, String separator) {
		if (array == null) {
			return null;
		}

		StringBuffer ip = new StringBuffer();

		for (int i = 0; i < array.length; i++) {
			if (i > 0) {
				ip.append(separator);
			}

			ip.append(array[i]);

			if ("*".equals(array[i])) {
				return ip.toString();
			}
		}

		return ip.toString();
	}

	/**
	 * getParentNetwork
	 */
	public static String[] getParentNetwork(String ipaddress) {
		if (isIPv4(ipaddress)) {
			return getParentNetwork(ipaddress, SEPARATOR_IPV4);
		} else {
			return getParentNetwork(ipaddress, SEPARATOR_IPV6);
		}
	}

	/**
	 * getParentNetwork
	 */
	private static String[] getParentNetwork(String ipaddress, String separator) {
		String[] array = getStringArray(ipaddress, separator);

		int maxLength = array.length + 1;
		int cnt = 1;
		
		if (hasString(ipaddress, "*")) {
			maxLength--;
		}

		String[] supernet = new String[maxLength];

		for (int i = 0, pos = maxLength; i < supernet.length && pos > 0; i++, pos--) {
			supernet[i] = getParentIP(array, pos, separator, cnt);
			cnt++;
		}

		return supernet;
	}

	/**
	 * getParentIP
	 */
	private static String getParentIP(String[] array, int position,
			String separator, int cnt) {
		if (array != null) {
			StringBuffer ip = new StringBuffer();
			
			for (int i = 0; i < position - 1; i++) {
				if (i > 0) {
					ip = ip.append(separator);
				}

				ip = ip.append(array[i]);

				// printDebug("[" + i + "] ip : " + ip);
			}

			if (position > 1 && cnt > 1) {
				ip = ip.append(separator);
			}

			if(cnt > 1) {
				ip = ip.append("*");
			}

			// printDebug("	=> ip : " + ip);

			return ip.toString();
		}
		return null;
	}

	/**
	 * printDebug
	 */
	private static void printDebug(Object msg) {
		System.out.println("" + msg);
	}

	/**
	 * testIpAddress
	 */
	private static void testIpAddress(String ip) {
		String ipAddr = IpAddressChecker.getIpAddressWithAsterisk(ip);

		if (ipAddr == null) {
			printDebug("Invalid IP ( " + ip + " )");
		} else {
			printDebug("  Valid IP ( " + ip + " -> " + ipAddr + " )");
		}
	}

	public static void main(String[] args) {
		testIpAddress(null);
		testIpAddress("");
		testIpAddress(".");
		testIpAddress(":");
		printDebug("");

		testIpAddress("::"); // (0:0:0:0:0:0:0:0) IPv6 unspecified address
		testIpAddress("::1"); // (0:0:0:0:0:0:0:1) IPv6 loopback address
		printDebug("");

		testIpAddress("1.2.3.4"); // (==)
		testIpAddress("1:2.3.4");
		testIpAddress("1.2.3:4");
		testIpAddress("1.");
		testIpAddress("1:");
		testIpAddress("1::"); // (1:0:0:0:0:0:0:0)
		testIpAddress("1.1");
		testIpAddress("1:1");
		testIpAddress("1::1"); // (1:0:0:0:0:0:0:1)
		testIpAddress("1.1*");
		testIpAddress("1.1.*"); // (1:1:*)
		testIpAddress("1:1*");
		testIpAddress("1:1:*"); // (1:1:*)
		testIpAddress("1:1::*");
		testIpAddress("123456");
		testIpAddress("255.255.255.0"); // (==)
		printDebug("");

		testIpAddress("2001:0DB8:0:0:0:0:1428:57ab"); // (2001:db8:0:0:0:0:1428:57ab)
		testIpAddress("2001:0DB8::1428:57ab"); // (2001:db8:0:0:0:0:1428:57ab)
		testIpAddress("2001:0DB8:0::1428:57ab"); // (2001:db8:0:0:0:0:1428:57ab)
		testIpAddress("2001:0DB8:0000:0000:0000:0000:1428:57ab"); // (2001:db8:0:0:0:0:1428:57ab)
		testIpAddress("2001:0DB8::0000::0000:1428:57ab");
		testIpAddress("2001:0DB8::"); // (2001:db8:0:0:0:0:0:0)
		printDebug("");

		testIpAddress("21DA:00D3:0000:2F3B:02AA:00FF:FE28:9C5A"); // (21da:d3:0:2f3b:2aa:ff:fe28:9c5a)
		testIpAddress("21DA:D3:0:2F3B:2AA:FF:FE28:9C5A"); // (21da:d3:0:2f3b:2aa:ff:fe28:9c5a)
		printDebug("");

		testIpAddress("0:2001:0001:0000:0000:003a:192.0.2.101"); // (0:2001:1:0:0:3a:c000:265)
		testIpAddress("0:2001:1:0:0:3a:192.0.2.101"); // (0:2001:1:0:0:3a:c000:265)
		testIpAddress("0:2001:1::3a:192.0.2.101"); // (0:2001:1:0:0:3a:c000:265)
		testIpAddress("0:2001:1::3A:192.0.2.101"); // (0:2001:1:0:0:3a:c000:265)
		printDebug("");

		testIpAddress("fe80:0000:0000:0000:0204:61ff:fe9d:f156"); // (fe80:0:0:0:204:61ff:fe9d:f156)
		testIpAddress("fe80:0:0:0:204:61ff:fe9d:f156"); // (fe80:0:0:0:204:61ff:fe9d:f156)
		testIpAddress("fe80::204:61ff:fe9d:f156"); // (fe80:0:0:0:204:61ff:fe9d:f156)
		testIpAddress("fe80:0:0:0:0204:61ff:254.157.241.86"); // (fe80:0:0:0:204:61ff:fe9d:f156)
		testIpAddress("fe80::204:61ff:254.157.241.86"); // (fe80:0:0:0:204:61ff:fe9d:f156)
		testIpAddress("::fe9d:f156"); // (0:0:0:0:0:0:fe9d:f156)
		testIpAddress("10.254.130.142"); // (==)
		testIpAddress("::10.254.130.142"); // (0:0:0:0:0:0:afe:828e)
		testIpAddress("::ffff:10.254.140.142"); // (10.254.140.142)
		printDebug("");

		testIpAddress("10.004.*"); // (10.4.*)
		testIpAddress("10.254.0.*"); // (10.254.0.*)
		testIpAddress("10.254.00.*"); // (10.254.0.*)
		testIpAddress("010.254.01.*"); // (10.254.1.*)
		testIpAddress("10.004.130.142"); // (10.4.130.142)
		testIpAddress("10.254.00.142"); // (10.254.0.142)
		testIpAddress("010.254.01.142"); // (10.254.1.142)
		testIpAddress("010.254.01.0"); // (10.254.1.0)
		testIpAddress("010.254.01.000"); // (10.254.1.0)
		printDebug("");

		testIpAddress("10.254.0.*1");
		testIpAddress("2001:0DB8:*1");
		printDebug("");

		testIpAddress("01.*"); // (1.*)
		testIpAddress("10.*"); // (10.*)
		testIpAddress("10.004.*"); // (10.4.*)
		testIpAddress("10.004.02.*"); // (10.4.2.*)
		testIpAddress("10.254.00.*"); // (10.254.0.*)
		testIpAddress("010.254.01.*"); // (10.254.1.*)
		testIpAddress("10.004.130.142"); // (10.4.130.142)
		testIpAddress("10.254.00.142"); // (10.254.0.142)
		testIpAddress("010.254.01.142"); // (10.254.1.142)
		printDebug("");

		testIpAddress("1.2.3.4"); // (==)
		testIpAddress("1.2.3.4.5");
		testIpAddress("1:2:3:4:5:6:7:8"); // (==)
		testIpAddress("1:2:3:4:5:6:7:8:9");
	}
}
