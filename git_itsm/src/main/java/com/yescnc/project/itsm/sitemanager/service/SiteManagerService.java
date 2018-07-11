package com.yescnc.project.itsm.sitemanager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;

import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

public interface SiteManagerService {
	
	public Map<String, Object> getCompanyList(String groupId);	
	
//	public Map<String, Object> getCustomerList(SiteManagerCustomerVO vo);
	public Map<String, Object> getCustomerList(HashMap map);
	
	public Integer addCompanyInfo(SiteManagerCompanyVO vo);
	
	public Integer updateCompanyInfo(SiteManagerCompanyVO vo);	
	
//	public Integer deleteCompanyInfo(SiteManagerCompanyVO vo);
	public Integer deleteCompanyInfo(HashMap map);	
	
	//public Integer addCustomerInfo(SiteManagerCustomerVO vo);
	public Integer addCustomerInfo(Map<String, Object> param);
	
	int deleteCustomerInfo(HashMap map);
//	int deleteCustomerInfo(SiteManagerCustomerVO vo);
}
