package com.yescnc.project.itsm.db.sitemanager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;


public interface SiteManagerMapper {
	
	public List<SiteManagerCompanyVO> getCompanyList(SiteManagerCustomerVO vo);
	
//	public List<SiteManagerCustomerVO> getCustomerList(SiteManagerCustomerVO vo);
	public List<SiteManagerCustomerVO> getCustomerList(HashMap map);
	
	public Integer addCompanyInfo(SiteManagerCompanyVO vo);
	
	public Integer updateCompanyInfo(SiteManagerCompanyVO vo);
	
//	public Integer deleteCompanyInfo(SiteManagerCompanyVO vo);
	public Integer deleteCompanyInfo(HashMap map);
	
//	public Integer addCustomerInfo(SiteManagerCustomerVO vo);
	public Integer addCustomerInfo(ArrayList<HashMap<String, Object>> product);
	
	int deleteCustomerInfo(HashMap map);
//	int deleteCustomerInfo(SiteManagerCustomerVO vo);
}
