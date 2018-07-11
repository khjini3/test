package com.yescnc.project.davisMonitor.service;

import java.util.List;

import com.yescnc.jarvis.entity.db.EventListVO;

public interface DavisMonitorService {
	public List<EventListVO> getEventBrowerData();
	
	public List getAssetInfo(String param);
	
	public List<EventListVO> getEventViewerList(String param);
}
