package com.yescnc.project.itsm.sitemanager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.yescnc.project.itsm.db.sitemanager.SiteManagerDao;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

@Service
public class SiteManagerServiceImpl implements SiteManagerService {

	@Autowired
	SiteManagerDao siteManagerDao;
	
	@Override
	public Map<String, Object> getCompanyList(String groupId){
		Map<String, Object> result = siteManagerDao.getCompanyList(groupId);
		return result;
	}	
	
//	@Override
//	public Map<String, Object> getCustomerList(SiteManagerCustomerVO vo){
//		Map<String, Object> result = siteManagerDao.getCustomerList(vo);
//		return result;
//	}	
	
	@Override
	public Map<String, Object> getCustomerList(HashMap map){
		Map<String, Object> result = siteManagerDao.getCustomerList(map);
		return result;
	}		
	
	@Override
	public Integer addCompanyInfo(SiteManagerCompanyVO vo){
		return siteManagerDao.addCompanyInfo(vo);
	}		
	
	@Override
	public Integer updateCompanyInfo(SiteManagerCompanyVO vo){
		return siteManagerDao.updateCompanyInfo(vo);
	}	
	
	@Override
//	public Integer deleteCompanyInfo(SiteManagerCompanyVO vo){
	public Integer deleteCompanyInfo(HashMap map){
		return siteManagerDao.deleteCompanyInfo(map);
//		return siteManagerDao.deleteCompanyInfo(vo);
	}	
	
//	@Override
//	public Integer addCustomerInfo(SiteManagerCustomerVO vo){
//		return siteManagerDao.addCustomerInfo(vo);
//	}	
	
	@Override
	public Integer addCustomerInfo(Map<String, Object> param){
		return siteManagerDao.addCustomerInfo(param);
	}	
	
	@Override
	public int deleteCustomerInfo(HashMap map) {
//	public int deleteCustomerInfo(SiteManagerCustomerVO vo) {
//		return siteManagerDao.deleteCustomerInfo(vo);
		return siteManagerDao.deleteCustomerInfo(map);
	}	
}
