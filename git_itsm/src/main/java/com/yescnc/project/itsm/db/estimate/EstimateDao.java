package com.yescnc.project.itsm.db.estimate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

public interface EstimateDao {

//	public List getValidityList();

	public ArrayList<HashMap<String, Object>> searchEstimate(Map<String, Object> param);
	
	public Integer getRowCount();

	public Map<String, Object> getSiteList();

	public List<SiteManagerCustomerVO> selectItemList(SiteManagerCustomerVO vo);

	public List getModelList();

	public List getModelTypeList();
	
//	public List getMailStatusList();

	public Integer insertEstimate(Map<String, Object> param);

	public List getEstimateProductList(String estimateId);

	public Integer deleteEstimate(String estimateId);

	public List<Object> getEstimateParameters();

	public Map<String, Object> getYearData(String year);
	
}