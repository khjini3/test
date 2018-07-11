package com.yescnc.jarvis.itamDashboard.service;

import java.util.List;

public interface ItamDashboardService {
	public List getModel(String value);
	
	public List getLocation(String value);
	
	public List getInstockWeekly();
	
	public List getInstockMonthly();
	
	public List getActiveWeekly();
	
	public List getActiveMonthly();
	
	public List getKeepWeekly();
	
	public List getKeepMonthly();
}
