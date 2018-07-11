package com.yescnc.jarvis.tickerManager.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.TickerVO;

public interface TickerManagerService {
	
	public List getTickerList();
	
	public List getTickerScrollingList();
	
	public List<TickerVO> searchTickerList(HashMap param);
	
	public Integer createTicker(HashMap map);
	
	public Integer updateTicker(HashMap map);
	
	public Integer deleteTicker(HashMap map);

}
