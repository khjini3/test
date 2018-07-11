package com.yescnc.project.itsm.db.estimate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.EstimateVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

public interface EstimateMapper {

	public List<HashMap<String, Object>> getValidityList();

	public List<HashMap<String, Object>> getMailStatusList();
	
	public List<HashMap<String, Object>> getPeriodList();
	
	public List<HashMap<String, Object>> getYearList();
	
	public ArrayList<HashMap<String, Object>> searchEstimate(Map<String, Object> param);
	
	public Integer getRowCount();

	public List<SiteManagerCompanyVO> getSiteList();

	public List<SiteManagerCustomerVO> selectItemList(SiteManagerCustomerVO vo);

	public List getModelList();

	public List getModelTypeList();

	public void insertProject(Map<String, Object> project);

	public void insertEstimate(Map<String, Object> estimate);
	
	public void insertProduct(ArrayList<HashMap<String, Object>> product);

	public Map<String, Object> selectAllEstimate(String estimate_id);
	
	public Map<String, Object> selectAllProject(String project_id);

	public void updateProject(Map<String, Object> project);

	public void updateEstimate(Map<String, Object> estimate);

	public void updateProduct(ArrayList<HashMap<String, Object>> product);

	public List getEstimateProductList(String estimateId);

	public void deleteEstimate(String estimateId);

	public void deleteEstimateProduct(String estimateId);

	public Map<String, Object> getYearData(String year);


}
