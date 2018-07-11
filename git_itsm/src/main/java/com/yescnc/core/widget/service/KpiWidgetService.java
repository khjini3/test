package com.yescnc.core.widget.service;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.KpiWidgetVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

public interface KpiWidgetService {
	public int insertKpiWidget(KpiWidgetVO vo);
	
	public KpiWidgetVO selectKpiWidget(KpiWidgetVO vo);
	
	public JsonPagingResult selectKpiWidgetLimitList(KpiWidgetVO vo);
	
	public List<KpiWidgetVO> selectKpiWidgetList();
	
	public int updateByKpiWidgetId(KpiWidgetVO vo);
	
	public JsonResult deleteByKpiWidgetId(KpiWidgetVO vo);
	
	public int deleteKpiWidgetMuti(Map<String, List<KpiWidgetVO>> map);
	
	public String selectKpiWidgetQuery(Integer id);
}
