package com.yescnc.jarvis.db.davisMonitor;

import java.util.List;

import com.yescnc.jarvis.entity.db.EventListVO;

public interface DavisMonitorMappper {
	public List<EventListVO> getEventBrowerData();
	
	public List getAssetInfo(String param);

	public List<EventListVO> getEventViewerList(String param);
}
