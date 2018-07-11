package com.yescnc.project.davisMonitor.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.davisMonitor.DavisMonitorDao;
import com.yescnc.jarvis.entity.db.EventListVO;

@Service
public class DavisMonitorServiceImpl implements DavisMonitorService {
	
	@Autowired
	DavisMonitorDao davismonitorDao;
	
	@Override
	public List<EventListVO> getEventBrowerData() {
		return davismonitorDao.getEventBrowerData();
	}

	@Override
	public List getAssetInfo(String param) {
		return davismonitorDao.getAssetInfo(param);
	}

	@Override
	public List<EventListVO> getEventViewerList(String param) {
		return davismonitorDao.getEventViewerList(param);
	}

}
