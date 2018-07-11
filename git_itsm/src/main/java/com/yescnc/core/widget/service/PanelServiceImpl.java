package com.yescnc.core.widget.service;

import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.collect.Iterables;
import com.yescnc.core.db.widget.PanelDao;
import com.yescnc.core.db.widget.KpiWidgetDao;
import com.yescnc.core.entity.db.KpiWidgetVO;
import com.yescnc.core.entity.db.PanelVO;
import com.yescnc.core.entity.db.WidgetDataVO;
import com.yescnc.core.entity.db.WidgetDataVO.WidgetList;
import com.yescnc.core.util.json.JsonResult;

@Service
public class PanelServiceImpl implements PanelService {
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(PanelServiceImpl.class);
	
	@Autowired
	PanelDao PanelDao;
	
	@Autowired
	KpiWidgetDao KpiWidgetDao;
	
	@Autowired
	PanelCache cache;
	
	@Override
	public int insertPanel(PanelVO vo) {
		//log.info("vo : " + vo);
		return PanelDao.insertPanel(vo);
	}
	
	@Override
	public WidgetDataVO selectPanel(PanelVO vo) {
		WidgetDataVO data = null;
		PanelVO panel = PanelDao.selectPanel(vo);
		List<KpiWidgetVO> kpiList = KpiWidgetDao.selectKpiWidgetList();

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
		mapper.disable(SerializationFeature.WRITE_NULL_MAP_VALUES);

		try{
			data = mapper.readValue(panel.getWidgetData(), WidgetDataVO.class);
			List<WidgetList> list = data.getWidgetData();
			for(WidgetList widget : list){
				if(null != widget.getKpiId()){
					KpiWidgetVO kpiWidget= Iterables.tryFind(kpiList, kpi -> kpi.getId() == Integer.valueOf(widget.getKpiId())).orNull();
					if(kpiWidget != null) {
						widget.setTitle(kpiWidget.getKpiTitle());
						widget.setChart(kpiWidget.getChartType());
						if(kpiWidget.getThreshold()!=null) {
							widget.setThreshold(kpiWidget.getThreshold());
						} else {
							widget.setThreshold(-1);
						}
						if(kpiWidget.getPolling()!=null) {
							widget.setPolling(kpiWidget.getPolling());
						} else {
							widget.setPolling(-1);
						}
					}
					
				}
			}
			log.info("vo: "+vo.getUserId());
			log.info("vo: "+vo.getId());
			cache.setIndex(vo.getGroupId(), vo.getId());
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return data;
	}

	@Override
	public JsonResult selectPanelList(String groupId) {
		JsonResult result = new JsonResult();
		
		try{
			result.setData("list", PanelDao.selectPanelList(groupId));
			result.setResult(true);
		} catch(Exception e) {
			result.setResult(false);
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public int updateByPanelId(PanelVO vo) {
		return PanelDao.updateByPanelId(vo);
	}

	@Override
	public int deleteByPanelId(PanelVO vo) {
		return PanelDao.deleteByPanelId(vo);
	}

}
