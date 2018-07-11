package com.yescnc.core.util.common;

import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;


public class MyI18N {
	// Current Locale $LANG
	private static Locale locale = Locale.getDefault();

	private static final MyUTF8Control CONTROL = new MyUTF8Control();

	public static void setLocale(Locale l) {
		locale = l;
	}

	public static Locale getLocale() {
		return locale;
	}

	/**
	 * Get current locale's string.
	 **/
	public static String getString(String key) {
		return getString(locale, "project-resources", key);
	}

	/**
	 * Get current locale's string.
	 **/
	public static String getStringWithDefault(String key, String defaultStr) {
		String value = getString(locale, "project-resources", key);
		if ("".equals(value))
			value = defaultStr;

		return value;
	}

	public static String getString(String bundle, String key) {
		return getString(locale, bundle, key);
	}

	public static String getString(String bundle, String key, String defaultStr) {
		String value = getString(locale, bundle, key);
		if ("".equals(value))
			value = defaultStr;

		return value;
	}

	public static char getMnemonic(String bundle, String key) {
		return getMnemonic(locale, bundle, key);
	}

	/**
	  *	Get a string matched with the key.
	  **/
	public static String getString(Locale locale, String key) {
		return getString(locale, "project-resources", key);
	}

	public static String getString(Locale locale, String bundle, String key) {
		boolean isFound = false;

		String newStr = "";
		try {
			ResourceBundle m_myResource = ResourceBundle.getBundle(bundle, locale);
			newStr = m_myResource.getString(key);

			isFound = true;
		} catch (MissingResourceException e) {
			//System.out.println("MissingResourceException : Couldn't find value [" + key + "] in " + bundle);
		} catch (Exception e) {
			//LogUtil.warning(e);
			//e.printStackTrace();
		}

		if (isFound == false && bundle.indexOf("common-resources") < 0) {
			return getString(locale, "common-resources", key);
		}

		if (locale.toString().indexOf("ko") >= 0) {
			try {
				newStr = new String(newStr.getBytes("8859_1"), "EUC-KR");
			} catch (Exception e) {
				//LogUtil.warning(e);
			}
		}

		return newStr;
	}

	public static String getString(Locale locale, String bundle, String key, String defaultStr) {
		boolean isFound = false;

		String newStr = "";
		try {
			ClassLoader cl = new MyI18NClassLoader(MyI18N.class.getClassLoader());
			ResourceBundle m_myResource = ResourceBundle.getBundle(bundle, locale, cl, CONTROL);
			newStr = m_myResource.getString(key);

			isFound = true;
		} catch (MissingResourceException e) {
			//System.out.println("MissingResourceException : Couldn't find value [" + key + "] in " + bundle);
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (isFound == false && bundle.indexOf("common-resources") < 0) {
			return getString(locale, "common-resources", key, defaultStr);
		}

		return nullToEmpty(newStr).isEmpty() ? defaultStr : newStr;
	}

	private static String nullToEmpty(String s) {
		return (s != null) ? s : "";
	}

	/**
	 * Returns a mnemonic from the resource bundle. Typically used as
	 * keyboard shortcuts in menu items.
	 */
	public static char getMnemonic(Locale locale, String bundle, String key) {
		return (getString(locale, bundle, key)).charAt(0);
	}
}
