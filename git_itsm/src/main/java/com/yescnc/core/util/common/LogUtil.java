package com.yescnc.core.util.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogUtil {
	private static String logName = null;
	private static Logger logger = getLogger();

	/**
	 * initialize LogManager and add a specific name Logger
	 *
	 * @param name	Logger Name
	 * @return log	Logger
	 */
	public synchronized static Logger init(String name) {
		logger = getLogger();
		return logger;
	}

	/**
	 * find Logger
	 *
	 * @param  void
	 * @return Logger
	 */
	public static Logger getLogger() {
		Logger logger = null;
		
		if(logName != null){
			logger = LoggerFactory.getLogger(logName);
		} else {
			//logger = Logger.getLogger( System.getProperty("proc.name") );
			logger = LoggerFactory.getLogger(Thread.currentThread().getName());
		}
		return logger;
	}

	public static void trace (String msg){
		logger.trace(msg);
	}
	
	public static void debug(String msg){
		logger.debug(msg);
	}
	
	public static void info(String msg) {
		logger.info(msg);
	}
	
	public static void warn(String msg){
		logger.warn(msg);
	}
	
	public static void error(Throwable e){
		LogUtil.error("ERROR!", e);
	}
	
	public static void error(String msg, Throwable e){
		logger.error(msg, e);
	}
	
	@Deprecated
	public static boolean isDebug() {
		return true;
	}

	@Deprecated
	public static boolean isAllowSevere() {
		return true;
	}
	
	@Deprecated
	public static boolean isAllowWarning() {
		return true;
	}

	@Deprecated
	public static boolean isAllowInfo() {
		return true;
	}

	@Deprecated
	public static boolean isAllowConfig() {
		return true;
	}

	@Deprecated
	public static boolean isAllowFine() {
		return true;
	}
	
	@Deprecated
	public static boolean isAllowFiner() {
		return true;
	}

	@Deprecated
	public static boolean isAllowFinest() {
		return true;
	}

	@Deprecated
	public static boolean isSevere() {
		return true;
	}

	@Deprecated
	public static boolean isWarning() {
		return true;
	}

	@Deprecated
	public static boolean isInfo() {
		return true;
	}

	@Deprecated
	public static boolean isConfig() {
		return true;
	}

	@Deprecated
	public static boolean isFine() {
		return true;
	}

	@Deprecated
	public static boolean isFiner() {
		return true;
	}

	@Deprecated
	public static boolean isFinest() {
		return true;
	}

	@Deprecated
	public static void config(String msg) {
		logger.trace(msg);
	}

	@Deprecated
	public static void warning(String msg) {
		logger.warn(msg);
	}

	@Deprecated
	public static void fine(String msg) {
		logger.trace(msg);
	}

	@Deprecated
	public static void finer(String msg) {
		logger.trace(msg);
	}

	@Deprecated
	public static void finest(String msg) {
		logger.trace(msg);
	}

	@Deprecated
	public static void warning(Throwable e) {
		logger.error("Error!", e);
	}

	
}
