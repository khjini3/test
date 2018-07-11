package com.yescnc.jarvis.db.tickerManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.TickerVO;

public interface TickerManagerDao {

	public List getTickerList();
	
	public List getTickerScrollingList();
	
	public List<TickerVO> searchTickerList(HashMap param);
	
	public Integer createTicker(HashMap map);
	
	public Integer updateTicker(HashMap map);
	
	public Integer deleteTicker(HashMap map);
	
	public List dupleKeySearch(HashMap map);

}
