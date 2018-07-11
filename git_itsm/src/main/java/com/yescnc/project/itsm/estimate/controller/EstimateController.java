package com.yescnc.project.itsm.estimate.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;
import com.yescnc.project.itsm.estimate.service.EstimateService;

@RequestMapping("/estimate")
@RestController
public class EstimateController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(EstimateController.class);
	
	@Autowired
	EstimateService estimateService;
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getData(@PathVariable("cmd") String cmd){
		List result = new ArrayList();
		
		switch(cmd){
			/*case "getValidityList":
				result = estimateService.getValidityList();
				break;*/
			/*case "getSiteList":
				result = estimateService.getSiteList();
				break;*/
			case "getModelList":
				result = estimateService.getModelList();
				break;
			case "getModelTypeList":
				result = estimateService.getModelTypeList();
				break;
			/*case "getMailStatusList":
				result = estimateService.getMailStatusList();
				break;*/
		}
		
		return result;
	}
	
	@RequestMapping(value="/getEstimateProductList/{estimateId}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getEstimateProductList(@PathVariable("estimateId") String estimateId){
		return estimateService.getEstimateProductList(estimateId);
	}
	
	@RequestMapping(value = "/getSiteList", method=RequestMethod.GET)
	public Map<String, Object> getSiteList(){
		Map<String, Object> result = estimateService.getSiteList();
		return result;
	}
	
	@RequestMapping(value="/selectItemList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<SiteManagerCustomerVO> selectItemList(@RequestBody SiteManagerCustomerVO vo){
		List<SiteManagerCustomerVO> result = estimateService.selectItemList(vo);
		return result; //itemLIst
	}
	
	@RequestMapping(value="/searchEstimate", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> searchEstimate(@RequestBody Map<String, Object> param){
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("startRow", param.get("startRow"));
		map.put("endRow", param.get("endRow"));
		
		map.put("result", estimateService.searchEstimate(param));
		map.put("totalCount", estimateService.getRowCount());
		
		log.debug("EstimateController result = "+map.toString());
		return map;
	}
	
	@RequestMapping(value="/insertEstimate", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertEstimate(@RequestBody Map<String, Object> param){
		return estimateService.insertEstimate(param);
	}
	
	@RequestMapping(value="/deleteEstimate/{estimateId}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteEstimate(@PathVariable("estimateId") String estimateId){
		return estimateService.deleteEstimate(estimateId);
	}
	
	@RequestMapping(value="/getEstimateParameters", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<Object> getEstimateParameters(){
		return estimateService.getEstimateParameters();
	}
	
	@RequestMapping(value="/getYearData/{year}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public Map<String, Object> getYearData(@PathVariable("year") String year){
		return estimateService.getYearData(year);
	}
}
