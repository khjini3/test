package com.yescnc.project.itsm.sitemanager.controller;

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

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.project.itsm.defect.controller.DefectController;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;
import com.yescnc.project.itsm.sitemanager.service.SiteManagerService;

@RequestMapping("/siteManager")
@RestController
public class SiteManagerController {

	private org.slf4j.Logger log = LoggerFactory.getLogger(DefectController.class);
	
	@Autowired
	SiteManagerService siteManagerService;
	
//	@OperationLogging(enabled=true)
	@RequestMapping(value = "/getCompanyList", method=RequestMethod.GET)
	public Map<String, Object> getCompanyList() {
		Map<String, Object> result = siteManagerService.getCompanyList(null);
			return result;
	}
	
	@RequestMapping(value = "/getCompanyList/{groupId}", method=RequestMethod.GET)
	public Map<String, Object> getUseYNMenuStatus(@PathVariable("groupId") String groupId){
		Map<String, Object> result = siteManagerService.getCompanyList(groupId);
		return result;
	}	
	
//	@OperationLogging(enabled=true)
//	@RequestMapping(value = "/getCustomerList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
//	public Map<String, Object> getCustomerList(@RequestBody SiteManagerCustomerVO vo) {
//		Map<String, Object> result = siteManagerService.getCustomerList(vo);
//			return result;
//	}
	
	@RequestMapping(value = "/getCustomerList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> getCustomerList(@RequestBody HashMap map) {
		Map<String, Object> result = siteManagerService.getCustomerList(map);
			return result;
	}	
	
//	@OperationLogging(enabled=true)
	@RequestMapping(value = "/addCompanyInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer addCompanyInfo(@RequestBody SiteManagerCompanyVO vo) {
		return siteManagerService.addCompanyInfo(vo);
	}	
	
//	@OperationLogging(enabled=true)
	@RequestMapping(value = "/updateCompanyInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateCompanyInfo(@RequestBody SiteManagerCompanyVO vo) {
		return siteManagerService.updateCompanyInfo(vo);
	}	
	
//	@OperationLogging(enabled=true)
	@RequestMapping(value = "/deleteCompanyInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
//	public Integer deleteCompanyInfo(@RequestBody SiteManagerCompanyVO vo) {
	public Integer deleteCompanyInfo(@RequestBody HashMap map) {
		return siteManagerService.deleteCompanyInfo(map);
//		return siteManagerService.deleteCompanyInfo(vo);
	}		
	
//	@OperationLogging(enabled=true)
//	@RequestMapping(value = "/addCustomerInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
//	public Integer addCustomerInfo(@RequestBody SiteManagerCustomerVO vo) {
//		return siteManagerService.addCustomerInfo(vo);
//	}
	
//	@OperationLogging(enabled=true)
	@RequestMapping(value = "/addCustomerInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer addCustomerInfo(@RequestBody Map<String, Object> param) {
		return siteManagerService.addCustomerInfo(param);
	}	
	
//	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/deleteCustomerInfo", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteCustomerInfo(@RequestBody HashMap map) {
//	public Integer deleteCustomerInfo(@RequestBody SiteManagerCustomerVO vo) {
//		int result = siteManagerService.deleteCustomerInfo(vo);
		int result = siteManagerService.deleteCustomerInfo(map);
		
		return result;
	}	
}
