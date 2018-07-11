package com.yescnc.project.itsm.estimate.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.project.itsm.db.estimate.EstimateDao;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

@Service
public class EstimateServiceImpl implements EstimateService {
	
	@Autowired
	EstimateDao estimateDao;

	/*@Override
	public List getValidityList() {
		return estimateDao.getValidityList();
	}*/

	@Override
	public ArrayList<HashMap<String, Object>> searchEstimate(Map<String, Object> param) {
		ArrayList<HashMap<String, Object>> result = estimateDao.searchEstimate(param);
		return result;
	}

	@Override
	public Integer getRowCount() {
		return estimateDao.getRowCount();
	}

	@Override
	public Map<String, Object> getSiteList() {
		Map<String, Object> result = estimateDao.getSiteList();
		return result;
	}

	@Override
	public List<SiteManagerCustomerVO> selectItemList(SiteManagerCustomerVO vo) {
		return estimateDao.selectItemList(vo);
	}

	@Override
	public List getModelList() {
		return estimateDao.getModelList();
	}
	
	@Override
	public List getModelTypeList() {
		return estimateDao.getModelTypeList();
	}

	/*@Override
	public List getMailStatusList() {
		return estimateDao.getMailStatusList();
	}*/

	@Override
	public Integer insertEstimate(Map<String, Object> param) {
		return estimateDao.insertEstimate(param);
	}

	@Override
	public List getEstimateProductList(String estimateId) {
		return estimateDao.getEstimateProductList(estimateId);
	}

	@Override
	public Integer deleteEstimate(String estimateId) {
		return estimateDao.deleteEstimate(estimateId);
	}

	@Override
	public List<Object> getEstimateParameters() {
		return estimateDao.getEstimateParameters();
	}

	@Override
	public Map<String, Object> getYearData(String year) {
		return estimateDao.getYearData(year);
	}

}