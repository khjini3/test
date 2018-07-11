package com.yescnc.core.db.widget;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.KpiWidgetVO;

public interface KpiWidgetMapper {
	public int insertKpiWidget(KpiWidgetVO vo);
	
	public KpiWidgetVO selectKpiWidget(KpiWidgetVO vo);
	
	public List<KpiWidgetVO> selectKpiWidgetList();
	
	public int updateByKpiWidgetId(KpiWidgetVO vo);
	
	public int deleteByKpiWidgetId(KpiWidgetVO vo);
	
	public int deleteKpiWidgetMuti(Map<String, List<KpiWidgetVO>> map);
	
	public String selectKpiWidgetQuery(Integer id);

	public KpiWidgetVO selectKpiWidgetMap(Integer id);
	
	public List<KpiWidgetVO> selectKpiWidgetLimitList(KpiWidgetVO vo);
	
	public int selectKpiWidgetListTotalRecord();
}
