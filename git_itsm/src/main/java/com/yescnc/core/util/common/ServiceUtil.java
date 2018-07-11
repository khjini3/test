package com.yescnc.core.util.common;

import java.util.Iterator;
import java.util.Properties;

public class ServiceUtil {
	/* DEBUG */
	private static boolean _DEBUG_ = false;
	private static final String DEBUG_NAME = "ServiceUtil";

	/* Constants */
	private static final String KEY_VENDOR = "v.vendor";
	private static final String KEY_SUBJECT = "v.subject";
	private static final String KEY_COMPANY = "v.company";
	private static final String KEY_ON_PROPERTY = "v.on.";
	private static final String KEY_SERVER_TYPE = "v.server";
	private static final String KEY_LARGE_SCALE = "v.large.scale";

	/* static Variables */
	private static ServiceUtil instance;

	/* Variables */
	private Properties properties;

	/**
	 * getInstance
	 */
	public synchronized static ServiceUtil getInstance() {
		if (instance == null) {
			instance = new ServiceUtil();
		}

		return instance;
	}

	/**
	 * ServiceUtil
	 */
	private ServiceUtil() {

		try {
			String home = System.getProperty("nms.home");

			if (home == null) {
				//LogUtil.warning("[ServiceUtil] ServiceUtil nms.home NOT define...");
				return;
			}

			String procName = System.getProperty("proc.name");
			String vendor = MyI18N.getString("vendor", "vendor");
			String subject = MyI18N.getString("vendor", "subject");
			String company = MyI18N.getString("vendor_foodef", "vendor." + vendor + ".company");
			String server = MyI18N.getString("vendor", "server");
			String largeScaled = MyI18N.getString("vendor", "large_scaled");

			String fooFileName = home + "/resource/properties/" + getFooFileName(vendor, subject);

			properties = ConfigUtil.loadProperty(fooFileName);

			properties.setProperty(KEY_VENDOR, vendor);
			properties.setProperty(KEY_SUBJECT, subject);
			properties.setProperty(KEY_COMPANY, company);
			properties.setProperty(KEY_SERVER_TYPE, server);
			properties.setProperty(KEY_LARGE_SCALE, largeScaled);

			if (procName != null && procName.startsWith("app")) {
				print("ServiceProperties procName: " + procName);
				//print("ServiceProperties: " + LogMethod.getTraceString(properties));
			}

		} catch (Exception e) {
			LogUtil.warning(e);
		}
	}

	/**
	 * getFooFileName
	 */
	private String getFooFileName(String vendor, String subject) {
		String fooFileName = "service_" + vendor;

		if (subject != null && !"none".equals(subject) && !"default".equals(subject)) {
			fooFileName += "_" + subject;
		}

		fooFileName += ".properties";

		return fooFileName;
	}

	/**
	 * getProperrties
	 */
	public Properties getProperrties() {
		return properties;
	}

	/**
	 * setProperties
	 */
	public void setProperties(Properties props) {
		properties = props;
	}

	/**
	 * print
	 */
	private static void print(String msg) {
		LogUtil.info("[" + DEBUG_NAME + "] " + msg);
	}

	// --------------------------------------------------------------------------
	// get... PROPERTY value
	// --------------------------------------------------------------------------
	/**
	 * getValue
	 */
	private String getValue(String key) {
		if (properties == null || key == null) {
			return null;
		}

		String value = properties.getProperty(key.replaceAll("\\|", "\\."));

		if (value != null) {
			value = value.trim();

			if ("".equals(value)) {
				value = null;
			}
		}

		if (_DEBUG_) {
			print("       --getValue(\"" + key + "\"): " + value);
		}

		return value;
	}

	/**
	 * getVValue
	 */
	private static String getVValue(String key) {
		String value = ServiceUtil.getInstance().getValue(key);

		if (!key.contains("|")) {
			return value;
		} else {
			if (value == null) {
				return getVValue(key.substring(0, key.lastIndexOf("|")));
			} else {
				return value;
			}
		}
	}

	/**
	 * getVKey
	 */
	private static String getVKey(String... params) {
		StringBuffer key = new StringBuffer();

		for (String param : params) {
			key.append(param);
			key.append("|");
		}

		return key.substring(0, key.length() - 1);
	}

	// --------------------------------------------------------------------------
	// about... PROPERTY FUNCTION
	// --------------------------------------------------------------------------
	/**
	 * getProperty
	 */
	public static String getProperty(String... params) {
		return getVValue(getVKey(params));
	}

	/**
	 * getIntProperty
	 */
	public static int getIntProperty(String... params) {
		try {
			return Integer.parseInt(getProperty(params));
		} catch (Exception e) {
			return -1;
		}
	}

	/**
	 * isSupport : old API
	 */
	public static boolean isSupport(String... params) {
		return isProperty(params);
	}

	/**
	 * isProperty
	 */
	public static boolean isProperty(String... params) {
		return "true".equals(getProperty(params));
	}

	/**
	 * onProperty
	 */
	public static boolean onProperty(String mainKey) {
		return ServiceUtil.getInstance().onPropertyPrivate(mainKey);
	}

	/**
	 * onPropertyPrivate
	 */
	private boolean onPropertyPrivate(String mainKey) {
		String onKey = KEY_ON_PROPERTY + mainKey;
		String value = getValue(onKey);

		if (value != null) {
			return "true".equals(value);
		} else {
			boolean onoff = onPropertyInternally(mainKey);

			properties.setProperty(onKey, "" + onoff);

			return onoff;
		}
	}

	/**
	 * onPropertyInternally
	 */
	private boolean onPropertyInternally(String mainKey) {
		if (isProperty(mainKey)) {
			return true;
		} else {
			Iterator iter = properties.keySet().iterator();
			String key = null;

			while (iter.hasNext()) {
				key = iter.next().toString();

				if (key.startsWith(mainKey)) {
					if (isProperty(key)) {
						return true;
					}
				}
			}

			return false;
		}
	}

	// --------------------------------------------------------------------------
	// about... SPECIAL FUNCTION
	// --------------------------------------------------------------------------
	/**
	 * getVendor
	 */
	public static String getVendor() {
		return ServiceUtil.getInstance().getValue(KEY_VENDOR);
	}

	/**
	 * getSubject
	 */
	public static String getSubject() {
		return ServiceUtil.getInstance().getValue(KEY_SUBJECT);
	}

	/**
	 * getCompany
	 */
	public static String getCompany() {
		return ServiceUtil.getInstance().getValue(KEY_COMPANY);
	}

	public static String getServerType() {
		return ServiceUtil.getInstance().getValue(KEY_SERVER_TYPE);
	}

	public static Boolean isLargeScaled() {
		return Boolean.valueOf(ServiceUtil.getInstance().getValue(KEY_LARGE_SCALE));
	}

	/**
	 * isPropertyGrowNbrRelation (12/03/22)
	 */
	public static boolean isPropertyGrowNbrRelation(String relation) {
		// relation: cdma1x, cdma2000, wcdma

		String property = getProperty("service.cm.grow.nbr", relation);

		if (property != null) {
			return "true".equals(property);
		} else {
			return isProperty("service.cm.nbr.plmntab", relation);
		}
	}
}
