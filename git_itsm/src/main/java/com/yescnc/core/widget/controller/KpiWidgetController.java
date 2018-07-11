package com.yescnc.core.widget.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.db.widget.WidgetRepository;
import com.yescnc.core.entity.db.KpiWidgetVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.widget.service.KpiWidgetService;

@RequestMapping("/dashboard/kpiwidgets")
@RestController
public class KpiWidgetController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(KpiWidgetController.class);
	
	@Autowired
	KpiWidgetService kpiWidgetService;

	@Autowired
	WidgetRepository repository;
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult selectLimitList(@RequestBody KpiWidgetVO vo) {
		log.info("POST : " + vo);
		return kpiWidgetService.selectKpiWidgetLimitList(vo);
	}		
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<KpiWidgetVO> selectKpiWidgetList() {
		return kpiWidgetService.selectKpiWidgetList();
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(value = "/{seq}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public KpiWidgetVO selectKpiWidget(@PathVariable("seq") Integer id) {
		KpiWidgetVO vo = new KpiWidgetVO();
		vo.setId(id);
		return kpiWidgetService.selectKpiWidget(vo);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	/*@RequestMapping(value = "/query", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonResult executeQuery(@RequestBody HashMap<String, Object> map) {
		log.info("POST : " + map);
		return repository.widgetExcute((String) map.get("columns"), (String) map.get("tableName"), (String) map.get("condition"));
	}*/
	
	@RequestMapping(value = "/query", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonResult executeQuery(@RequestBody HashMap<String, Object> map) {
		log.info("POST : " + map);
		return repository.widgetExcute((String) map.get("query"));
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public int insertKpiWidget(@RequestBody KpiWidgetVO vo) {
		log.info("POST : " + vo);
		return kpiWidgetService.insertKpiWidget(vo);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(value = "/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public int updateKpiWidget(@RequestBody KpiWidgetVO vo) {
		log.info("PUT : " + vo);
		return kpiWidgetService.updateByKpiWidgetId(vo);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public JsonResult deleteKpiWidget(@PathVariable("seq") Integer id) {
		log.info("DELETE : " + id);
		KpiWidgetVO vo = new KpiWidgetVO();
		vo.setId(id);
		return kpiWidgetService.deleteByKpiWidgetId(vo);
	}
	
	@RequestMapping(value = "/multiDelete/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteKpiWidgetMuti(@PathVariable("seq") String id) {
		
		int result = -1;
		List<String> multis = Arrays.asList(id.split(","));
		Iterator<String> iterator = multis.iterator();
		
		List<KpiWidgetVO> resultList = new ArrayList<>();
		Map<String, List<KpiWidgetVO>> map = new HashMap<String, List<KpiWidgetVO>>();		
		
		while(iterator.hasNext()){
			String tc_seq_multi = iterator.next();
			int numInt = Integer.parseInt(tc_seq_multi);
			
			KpiWidgetVO multi = new KpiWidgetVO();
			multi.setId(numInt);
			resultList.add(multi);
		}
		map.put("list", resultList);
		result = kpiWidgetService.deleteKpiWidgetMuti(map);
		
		return result;

	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(value = "/query/{seq}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public JsonResult runKpiWidget(@PathVariable("seq") Integer id) {
		log.info("runKpiWidget : " + id);
		return repository.widgetExcute("");
	}
}
