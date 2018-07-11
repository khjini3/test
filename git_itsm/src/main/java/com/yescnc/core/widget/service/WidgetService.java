package com.yescnc.core.widget.service;

import com.yescnc.core.util.json.JsonResult;

public interface WidgetService {
	
	public JsonResult getWidgetData(Integer id) throws Exception;
	
	public JsonResult systemMonitoringData(Integer id);
}
