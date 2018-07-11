package com.yescnc.core.widget.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.yescnc.core.db.widget.PanelDao;
import com.yescnc.core.db.widget.BuildQuery;
import com.yescnc.core.db.widget.KpiWidgetDao;
import com.yescnc.core.entity.db.KpiWidgetVO;
import com.yescnc.core.entity.db.PanelVO;
import com.yescnc.core.entity.db.WidgetDataVO;
import com.yescnc.core.entity.db.WidgetDataVO.WidgetList;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

@Service
public class KpiWidgetServiceImpl implements KpiWidgetService {
	@Autowired
	KpiWidgetDao kpiWidgetDao;
	
	@Autowired
	PanelDao PanelDao;
	
	@Autowired
	BuildQuery ql;
	
	@Override
	public int insertKpiWidget(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		
		//vo.setQuery(ql.getSelect(vo.getKpiColumns(), vo.getTableName(), vo.getKpiCondition()));
		return kpiWidgetDao.insertKpiWidget(vo);
	}
	
	@Override
	public KpiWidgetVO selectKpiWidget(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		return kpiWidgetDao.selectKpiWidget(vo);
	}

	@Override
	public List<KpiWidgetVO> selectKpiWidgetList() {
		// TODO Auto-generated method stub
		return kpiWidgetDao.selectKpiWidgetList();
	}

	@Override
	public int updateByKpiWidgetId(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
//		vo.setQuery(ql.getSelect(vo.getKpiColumns(), vo.getTableName(), vo.getKpiCondition()));
		return kpiWidgetDao.updateByKpiWidgetId(vo);
	}

	@Override
	public JsonResult deleteByKpiWidgetId(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		JsonResult result = new JsonResult();
		Boolean flag = true;
		List<PanelVO> list = PanelDao.selectPanelListAll();
		
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		mapper.disable(SerializationFeature.WRITE_NULL_MAP_VALUES);
						
		for(PanelVO panel : list ){
			try{
				WidgetDataVO data = mapper.readValue(panel.getWidgetData(), WidgetDataVO.class);
				List<WidgetList> widgetList =  data.getWidgetData();
				List<WidgetList>  found= widgetList.stream().filter(x -> x.getKpiId().equalsIgnoreCase(vo.getId().toString())).collect(Collectors.toList());
				if(!found.isEmpty()){
					flag = false;
					result.setResult(false);
					result.setFailReason("kpi.delete.fail.panelInvolve");
					break;
				}
			}catch(Exception e){
				
			}
		}
		
		if(flag) {
			kpiWidgetDao.deleteByKpiWidgetId(vo);
			result.setResult(true);
		}
		
		return result;
	}
	
	public int deleteKpiWidgetMuti(Map<String, List<KpiWidgetVO>> map) {
		return kpiWidgetDao.deleteKpiWidgetMuti(map);
	}

	@Override
	public String selectKpiWidgetQuery(Integer id) {
		// TODO Auto-generated method stub
		return kpiWidgetDao.selectKpiWidgetQuery(id);
	}

	@Override
	public JsonPagingResult selectKpiWidgetLimitList(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		JsonPagingResult result = new JsonPagingResult();
		int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();
		vo.setStartRow(startRow);
		result.setData("data", kpiWidgetDao.selectKpiWidgetLimitList(vo));
		result.setNoOffsetRecord(kpiWidgetDao.selectKpiWidgetListTotalRecord());
		return result;
	}
	
}
