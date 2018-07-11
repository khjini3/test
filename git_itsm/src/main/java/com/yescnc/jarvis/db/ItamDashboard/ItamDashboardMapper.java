package com.yescnc.jarvis.db.ItamDashboard;

import java.util.List;

public interface ItamDashboardMapper {
	public List getModel(Integer value);
	
	public List getLocation(Integer value);
	
	public List getInstockWeekly();
	
	public List getInstockMonthly();
	
	public List getActiveWeekly();
	
	public List getActiveMonthly();
	
	public List getKeepWeekly();
	
	public List getKeepMonthly();
}
