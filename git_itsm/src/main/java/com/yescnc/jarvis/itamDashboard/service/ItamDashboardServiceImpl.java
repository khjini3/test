package com.yescnc.jarvis.itamDashboard.service;

import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.ItamDashboard.ItamDashboardDao;
import com.yescnc.jarvis.itamDashboard.controller.ItamDashboardController;

@Service
public class ItamDashboardServiceImpl implements ItamDashboardService {

	private org.slf4j.Logger log = LoggerFactory.getLogger(ItamDashboardController.class);
	
	@Autowired
	ItamDashboardDao itamDashboardDao;
	
	@Override
	public List getModel(String value) {
		return itamDashboardDao.getModel(value);
	}

	@Override
	public List getLocation(String value) {
		return itamDashboardDao.getLocation(value);
	}

	@Override
	public List getInstockWeekly() {
		List result = itamDashboardDao.getInstockWeekly();
		log.debug("ITAM Dash result = "+result);
		return result;
	}
	
	@Override
	public List getInstockMonthly() {
		return itamDashboardDao.getInstockMonthly();
	}

	@Override
	public List getActiveWeekly() {
		return itamDashboardDao.getActiveWeekly();
	}

	@Override
	public List getActiveMonthly() {
		return itamDashboardDao.getActiveMonthly();
	}
	
	@Override
	public List getKeepWeekly() {
		return itamDashboardDao.getKeepWeekly();
	}

	@Override
	public List getKeepMonthly() {
		return itamDashboardDao.getKeepMonthly();
	}
}
