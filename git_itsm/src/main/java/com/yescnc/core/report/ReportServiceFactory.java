package com.yescnc.core.report;

import org.springframework.stereotype.Component;

@Component(value="RSFactory")
public class ReportServiceFactory {

	public static final String SCHEDULE_SUCCESS = "SUCCESS";
	public static final String SCHEDULE_FAIL 	= "FAIL";
	public static final String SCHEDULE_IDNULL 	= "IDNULL";
	public static final String SCHEDULE_STOP 	= "STOP";
	public static final String SCHEDULE_START 	= "START";
	
	private String DEFAULT_DROPPATH = "resources/reports/";	// 리포트 파일 위치.
	private String DELETE_INTERVAL = "1";					// 리포트 삭제 주기 Day
	

//	private static ReportServiceFactory instance;
	
									    //초 분 시 날짜 월 요일 년
	private String[] cronExpression 	= {"0 0/1 * * * ?",		// 5분 마다 	
										  "0 0/20 0 * * ?",		// 20분 마다
										  "0 0 0/1 * * *",		// 1시간 마다.
										  "0 0 0 * * ?",		// 매일 0시에
										  "0 0 0 ? * 2",		// 매주 월요일 0시에 0-6 일~금
										  "0 0 0 1 * ?",		// 매달 1일 0시에
										  "0 0/5 * * * ?"	};  // 매 5분마다 테스트용
	
	
	
	public void setDEFAULT_DROPPATH(String dEFAULT_DROPPATH) {
		DEFAULT_DROPPATH = dEFAULT_DROPPATH;
	}
	public String getDEFAULT_DROPPATH() {
		return DEFAULT_DROPPATH;
	}
	
	public String getDELETE_INTERVAL() {
		return DELETE_INTERVAL;
	}
	public void setDELETE_INTERVAL(String dELETE_INTERVAL) {
		DELETE_INTERVAL = dELETE_INTERVAL;
	}
	
	public String[] getCronExpression() {
		return cronExpression;
	}

//	public static ReportServiceFactory getInstance() {
//		
//		if( instance == null ){
//			instance = new ReportServiceFactory();
//		}
//		return instance;
//	}
	
}
