package com.yescnc.jarvis.tickerManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.yescnc.jarvis.db.tickerManager.TickerManagerDao;
import com.yescnc.jarvis.entity.db.TickerVO;

@Service
public class TickerManagerServiceImpl implements TickerManagerService {

	@Autowired
	TickerManagerDao tickerManagerDao;

	@Override
	public List getTickerList() {
		return tickerManagerDao.getTickerList();
	}
	
	@Override
	public List getTickerScrollingList() {
		return tickerManagerDao.getTickerScrollingList();
	}

	@Override
	public List<TickerVO> searchTickerList(HashMap param) {
		List<TickerVO> result = tickerManagerDao.searchTickerList(param);
		return result;
	}

	@Override
	public Integer createTicker(HashMap map) {
		return tickerManagerDao.createTicker(map);
	}

	@Override
	public Integer updateTicker(HashMap map) {
		return tickerManagerDao.updateTicker(map);
	}
	
	@Override
	public Integer deleteTicker(HashMap map) {
		return tickerManagerDao.deleteTicker(map);
	}

}
