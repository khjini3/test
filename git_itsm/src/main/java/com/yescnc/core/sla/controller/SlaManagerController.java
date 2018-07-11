package com.yescnc.core.sla.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.SlaVO;
import com.yescnc.core.sla.service.SlaManagerService;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

@RequestMapping("/settings/sla")
@RestController
public class SlaManagerController {
	private Logger logger = LoggerFactory.getLogger(SlaManagerController.class);
	
	@Autowired
	SlaManagerService slaManagerService;
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
//	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
//	public Integer insertSla(@RequestBody SlaVO vo) {
//		return slaManagerService.insertSla(vo);
//	}
	
	@RequestMapping(value="/addSla", method=RequestMethod.POST)
	public Integer addSla(@RequestBody SlaVO vo) {
		logger.info("vo.getCheck_pid() : " + vo.getCheck_pid());
		return slaManagerService.addSla(vo);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)*/
	@RequestMapping(value = "/{seq}",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateSla(@PathVariable("seq") Integer idx, @RequestBody SlaVO vo) {
		vo.setIdx(idx);
		return slaManagerService.updateBySla(vo);
	}
	
	@RequestMapping(value = "/edit/{seq}",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateSlaCategory(@PathVariable("seq") Integer idx, @RequestBody SlaVO vo) {
		vo.setIdx(idx);
		logger.info("updateSlaCategory : " + vo);
		return slaManagerService.updateSlaCategory(vo);
	}
	
	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult slaLimitList(@RequestBody SlaVO vo) {
		logger.info("POST : " + vo);
		return slaManagerService.slaLimitList(vo);
	}	
	
	@RequestMapping(value = "/searchList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<SlaVO> slaSearchList(@RequestBody SlaVO vo) {
		logger.info("POST : " + vo);
		return slaManagerService.slaSearchList(vo);
	}
	
	@RequestMapping(value = "/paramList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<SlaVO> slaSearchParamList(@RequestBody SlaVO vo) {
		logger.info("POST : " + vo);
		return slaManagerService.slaSearchParamList(vo);
	}
	
	@RequestMapping(value = "/slaNotification", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public JsonResult slaNotification(@RequestBody List<HashMap<String, ?>> slaStatList) {
		logger.info("slaNotification PUT : " + slaStatList);
		return slaManagerService.slaNotification(slaStatList);
	}
	
	@RequestMapping(value="/thresholds", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public int updateThresholds(HttpServletRequest req, HttpServletResponse res, @RequestBody List<HashMap<String, ?>> slaList) {
		List<SlaVO> thresholdList = new ArrayList<>();
		Map<String, List<SlaVO>> thresholdMap = new HashMap<String, List<SlaVO>>();
		for(int i = 0; i < slaList.size(); i++) {
			SlaVO vo = new SlaVO();

			String Sidx = String.valueOf(slaList.get(i).get("recid"));
			int idx = Integer.parseInt( Sidx );
			vo.setIdx(idx);
			
			String Scritical = String.valueOf(slaList.get(i).get("critical"));
			if( Scritical != "null" ) {				
				int critical = Integer.parseInt( Scritical );
				vo.setCritical(critical);
			}else {
				vo.setCritical(-1);
			}
			
			String Smajor = String.valueOf(slaList.get(i).get("major"));
			logger.info("slaList Smajor : " + Smajor );
			if( Smajor != "null" ) {				
				int major = Integer.parseInt( Smajor );
				vo.setMajor(major);
			}else {
				vo.setMajor(-1);
			}
			
			String Sminor = String.valueOf(slaList.get(i).get("minor"));
			if( Sminor != "null" ) {				
				int minor = Integer.parseInt( Sminor );
				vo.setMinor(minor);			
			}else {
				vo.setMinor(-1);
			}
			
			thresholdList.add(vo);
			logger.info("slaList PUT : " + vo );
		}
		if( !thresholdList.isEmpty() ){    				
			thresholdMap.put("list", thresholdList);
		}
		
		return slaManagerService.slaThresholdUpdate(thresholdMap);
	}
	
	@RequestMapping(value = "/multiDelete/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteSlaMulti(@PathVariable("seq") String id) {
		
		int result = -1;
		List<String> multis = Arrays.asList(id.split(","));
		Iterator<String> iterator = multis.iterator();
		
		List<SlaVO> categoryList = new ArrayList<>();
		List<SlaVO> tyepList = new ArrayList<>();
		List<SlaVO> paramList = new ArrayList<>();
		Map<String, List<SlaVO>> categoryMap = new HashMap<String, List<SlaVO>>();
		Map<String, List<SlaVO>> typeMap = new HashMap<String, List<SlaVO>>();
		Map<String, List<SlaVO>> paramMap = new HashMap<String, List<SlaVO>>();		
		
		while(iterator.hasNext()){
			String deleteIdx = iterator.next();
			int numInt = Integer.parseInt(deleteIdx);
			
			SlaVO multi = new SlaVO();
			multi.setIdx(numInt);
			if(numInt < 1000){
				categoryList.add(multi);
			}
			else if(numInt < 10000){
				tyepList.add(multi);
			}else{
				paramList.add(multi);
			}
		}
		try{
			if( !categoryList.isEmpty() ){
				logger.info("categoryList : " + categoryList );
				categoryMap.put("list", categoryList);
				slaManagerService.deleteCategoryMulti(categoryMap);				
			}
			
			if( !tyepList.isEmpty() ){
				logger.info("tyepList : " + tyepList );
				typeMap.put("list", tyepList);
				slaManagerService.deleteTypeMulti(typeMap);				
			}
			
			if( !paramList.isEmpty() ){
				logger.info("paramList : " + paramList );
				paramMap.put("list", paramList);
				slaManagerService.deleteParamMulti(paramMap);
			}
			
			result = 1;
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return result;

	}
	
}
