package com.yescnc.project.itsm.db.estimate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.util.tree.IdcTree;
import com.yescnc.project.itsm.entity.db.EstimateVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

@Repository
public class EstimateDaoImpl implements EstimateDao {
	@Autowired
	private SqlSession sqlSession;

	/*@Override
	public List getValidityList() {
		return sqlSession.getMapper(EstimateMapper.class).getValidityList();
	}*/

	@Override
	public ArrayList<HashMap<String, Object>> searchEstimate(Map<String, Object> param) {
		ArrayList<HashMap<String, Object>> result = sqlSession.getMapper(EstimateMapper.class).searchEstimate(param);
		return result;
	}

	@Override
	public Integer getRowCount() {
		return sqlSession.getMapper(EstimateMapper.class).getRowCount();
	}

	@Override
	public Map<String, Object> getSiteList() {
		Map<String, Object> allData = new HashMap<String,Object>();
		List<SiteManagerCompanyVO> result = new ArrayList<SiteManagerCompanyVO>();
		result = sqlSession.getMapper(EstimateMapper.class).getSiteList();
		
		SiteManagerCompanyVO rootVo = new SiteManagerCompanyVO();
		
		rootVo.setId("-1");
		rootVo.setSite_id("-1");
		rootVo.setParent_site_id("-1");
		rootVo.setSite_name("root");
		rootVo.setText("root");
		rootVo.setMain_phone(null);
		rootVo.setFax(null);
		rootVo.setCeo_name(null);
		rootVo.setCompany_number(null);
		rootVo.setArea(null);
		rootVo.setAddress(null);
		
		IdcTree idcTree = new IdcTree();
		
		Map<String, SiteManagerCompanyVO> treeMapData = new HashMap<String, SiteManagerCompanyVO>();
		
		treeMapData.put("-1", rootVo);
		for(SiteManagerCompanyVO vo1 : result){
			vo1.setId(vo1.getSite_id().toString());
			vo1.setText(vo1.getSite_name());
			if(vo1.getParent_site_id().equals("-1")){
				vo1.setImg("fa icon-folder");
				vo1.setExpanded(true);
				for(SiteManagerCompanyVO vo3 : result) {
					if(vo1.getSite_id() == vo3.getParent_site_id()) {
						vo1.setIcon("");
						vo1.setImg("fa icon-folder fa-lg");
						break;
					} else {
						vo1.setImg("");
						vo1.setIcon("fa fa-cube fa-lg");
					}
				}
			}else{
				vo1.setImg("fas fa-cube fa-lg");
				vo1.setExpanded(true);
				for(SiteManagerCompanyVO vo4 : result) {
					if(vo1.getSite_id() == vo4.getParent_site_id()) {
						vo1.setIcon("");
						vo1.setImg("fa icon-folder fa-lg");
						break;
					} else {
						vo1.setImg("");
						vo1.setIcon("fa fa-cube fa-lg");
					}
				}
			}
			treeMapData.put(vo1.getSite_id().toString(), vo1);
		}
		
		for(SiteManagerCompanyVO vo2 : result){
			SiteManagerCompanyVO parentVO = treeMapData.get(vo2.getParent_site_id().toString());
			SiteManagerCompanyVO currentVO = treeMapData.get(vo2.getSite_id().toString());
			
			if(parentVO != null){
				idcTree.add(parentVO, currentVO);
			}
		}
		
		allData.put("treeData", rootVo);
		allData.put("allData", result);
		
		return allData;
	}

	@Override
	public List<SiteManagerCustomerVO> selectItemList(SiteManagerCustomerVO vo) {
		return sqlSession.getMapper(EstimateMapper.class).selectItemList(vo);
	}

	@Override
	public List getModelList() {
		return sqlSession.getMapper(EstimateMapper.class).getModelList();
	}
	
	@Override
	public List getModelTypeList() {
		return sqlSession.getMapper(EstimateMapper.class).getModelTypeList();
	}

	/*@Override
	public List getMailStatusList() {
		return sqlSession.getMapper(EstimateMapper.class).getMailStatusList();
	}*/

	@Override
	public Integer insertEstimate(Map<String, Object> param) {
		int result = 100;
		Map<String, Object> project = new HashMap<String, Object>();
		Map<String, Object> estimate = new HashMap<String, Object>();
		
		ArrayList<HashMap<String, Object>> product = (ArrayList<HashMap<String, Object>>) param.get("productQuantity");

		String project_id = null;
		String estimate_id = null;
		project = (Map<String, Object>) param.get("projectInfo");
		estimate = (Map<String, Object>) param.get("estimateInfo");
		project_id = (String) project.get("project_id");
		estimate_id = (String) estimate.get("estimate_id");
		
		Map<String, Object> projectResult = sqlSession.getMapper(EstimateMapper.class).selectAllProject(project_id);
		Map<String, Object> estimateResult = sqlSession.getMapper(EstimateMapper.class).selectAllEstimate(estimate_id);
		
		try {
			if(estimateResult == null){ //estimate insert
				if(projectResult == null){ //project insert
					sqlSession.getMapper(EstimateMapper.class).insertProject(project);
					sqlSession.getMapper(EstimateMapper.class).insertEstimate(estimate);
					if(product.size() > 0){
						sqlSession.getMapper(EstimateMapper.class).deleteEstimateProduct(estimate_id);
						sqlSession.getMapper(EstimateMapper.class).insertProduct(product);
					}
				}else{ //project update
					sqlSession.getMapper(EstimateMapper.class).insertEstimate(estimate);
					sqlSession.getMapper(EstimateMapper.class).updateProject(project);
					if(product.size() > 0){
						sqlSession.getMapper(EstimateMapper.class).deleteEstimateProduct(estimate_id);
						sqlSession.getMapper(EstimateMapper.class).insertProduct(product);
					}
				}
			}else{ //estimate update
				sqlSession.getMapper(EstimateMapper.class).updateProject(project);
				sqlSession.getMapper(EstimateMapper.class).updateEstimate(estimate);
				if(product.size() > 0){
					sqlSession.getMapper(EstimateMapper.class).deleteEstimateProduct(estimate_id);
					sqlSession.getMapper(EstimateMapper.class).insertProduct(product);
				}else{
					sqlSession.getMapper(EstimateMapper.class).deleteEstimateProduct(estimate_id);
				}
			}
		} catch (Exception e) {
			result = -100;
			e.printStackTrace();
		}
		
		return result;
	}

	@Override
	public List getEstimateProductList(String estimateId) {
		return sqlSession.getMapper(EstimateMapper.class).getEstimateProductList(estimateId);
	}

	@Override
	public Integer deleteEstimate(String estimateId) {
		int result = 100;
		
		try {
			sqlSession.getMapper(EstimateMapper.class).deleteEstimate(estimateId);
			sqlSession.getMapper(EstimateMapper.class).deleteEstimateProduct(estimateId);
		} catch (Exception e) {
			result = -100;
			e.printStackTrace();
		}
		
		return result;
	}

	@Override
	public List<Object> getEstimateParameters() {
		Map<String, Object> params = new HashMap<String, Object>();
		List<Object> result = new ArrayList<Object>();
		
		List<HashMap<String, Object>> year = new ArrayList<HashMap<String, Object>>();
		List<HashMap<String, Object>> mailStatus = new ArrayList<HashMap<String, Object>>();
		List<HashMap<String, Object>> period = new ArrayList<HashMap<String, Object>>();
		List<HashMap<String, Object>> validity = new ArrayList<HashMap<String, Object>>();
		
		year = sqlSession.getMapper(EstimateMapper.class).getYearList();
		mailStatus = sqlSession.getMapper(EstimateMapper.class).getMailStatusList();
		period = sqlSession.getMapper(EstimateMapper.class).getPeriodList();
		validity = sqlSession.getMapper(EstimateMapper.class).getValidityList();
		
		params.put("year", year);
		params.put("mailStatus", mailStatus);
		params.put("period", period);
		params.put("validity", validity);
		
		result.add(params);
		
		return result;
	}

	@Override
	public Map<String, Object> getYearData(String year) {
		return sqlSession.getMapper(EstimateMapper.class).getYearData(year);
	}

}
