package com.yescnc.project.itsm.db.sitemanager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.loginhistory.controller.LoginHistoryController;
import com.yescnc.jarvis.util.tree.IdcTree;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

@Repository
public class SiteManagerDaoImpl implements SiteManagerDao {
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(LoginHistoryController.class);
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public Map<String, Object> getCompanyList(String groupId) {
		// TODO Auto-generated method stub
		Map<String, Object> allData = new HashMap<String,Object>();
		List<SiteManagerCompanyVO> company_result = new ArrayList<SiteManagerCompanyVO>();
		//List<SiteManagerCustomerVO> customer_result = new ArrayList<SiteManagerCustomerVO>();
		if(groupId == null){
			company_result = sqlSession.getMapper(SiteManagerMapper.class).getCompanyList(null);
			//customer_result = sqlSession.getMapper(SiteManagerMapper.class).getCustomerList();
		}else{
			//result = sqlSession.getMapper(SiteManagerMapper.class).getUseYNMenuStatus(groupId);
		}
		
		SiteManagerCompanyVO rootVo = new SiteManagerCompanyVO();
		
		rootVo.setId("-1");
		rootVo.setText("root");
		rootVo.setSite_id("-1");
		rootVo.setParent_site_id("-1");
		rootVo.setSite_name("root");
		rootVo.setMain_phone(null);
		rootVo.setFax(null);
		rootVo.setCeo_name(null);
		rootVo.setCompany_number(null);
		rootVo.setArea(null);
		rootVo.setAddress(null);
		
		IdcTree idcTree = new IdcTree();
		Map<String, SiteManagerCompanyVO> companyMapData = new HashMap<String, SiteManagerCompanyVO>();
		
		//String checkBoxTagFront = "<input id='compaanyTreeCheckbox' class='menu-tree-checkbox check-x' name='compaanyTreeCheckbox' type='checkbox'";
		//String checkBoxTagEnd = "/>"; // yypark
		
		companyMapData.put("-1",  rootVo);
		for(SiteManagerCompanyVO vo1 : company_result){

			vo1.setId(vo1.getSite_id().toString());
			//String result1 = checkBoxTagFront + "rowNum='" + vo1.getId() + "'"+ checkBoxTagEnd;
			//String resultTxt = result1.concat(vo1.getSite_name()); // yypark
			String resultTxt = vo1.getSite_name();
			vo1.setText(resultTxt);
			if(vo1.getParent_site_id().equals("-1")){
				vo1.setExpanded(true);
				for(SiteManagerCompanyVO vo3 : company_result) {
					if(vo1.getSite_id().equals(vo3.getParent_site_id())) {
						vo1.setIcon("");
						vo1.setImg("fa icon-folder fa-lg");
						break;
					} else {
						vo1.setImg("");
						vo1.setIcon("fa fa-cube fa-lg");
					}
				}
			}else{
				vo1.setExpanded(true);
				for(SiteManagerCompanyVO vo4 : company_result) {
					if(vo1.getSite_id().equals(vo4.getParent_site_id())) {
						vo1.setIcon("");
						vo1.setImg("fa icon-folder fa-lg");
						break;
					} else {
						vo1.setImg("");
						vo1.setIcon("fa fa-cube fa-lg");
					}
				}				
			}
			companyMapData.put(vo1.getSite_id().toString(), vo1);
		}
		
		for(SiteManagerCompanyVO vo2 : company_result){
			SiteManagerCompanyVO parentVO = companyMapData.get(vo2.getParent_site_id().toString());
			SiteManagerCompanyVO currentVO = companyMapData.get(vo2.getSite_id().toString());
			
			if(parentVO != null){
				idcTree.add(parentVO, currentVO);
			}
		}
		
//		for(int i = 0; i < rootVo.getNodes().size(); i++) {
//			List<SiteManagerCompanyVO> parentNodes = new ArrayList<SiteManagerCompanyVO>();
//			for(SiteManagerCustomerVO vo3 : customer_result) {
//				SiteManagerCompanyVO vo4 = new SiteManagerCompanyVO();
//				if(rootVo.getNodes().get(i).getSite_id() == vo3.getSite_id()) {
//					for(int j = 0; j < ) {
//						
//					}
//					vo4.setId(vo3.getCustomer_id().toString());
//					String result1 = checkBoxTagFront + "rowNum='" + vo4.getId() + "'"+ checkBoxTagEnd;
//					String resultTxt = result1.concat(vo3.getDepartment()); // yypark
//					vo4.setText(resultTxt);
//					vo4.setExpanded(true);
//					vo4.setCustomer_id(vo3.getCustomer_id());
//					vo4.setCustomer_name(vo3.getCustomer_name());
//					vo4.setPhone(vo3.getPhone());
//					vo4.setEmail(vo3.getEmail());
//					vo4.setDepartment(vo3.getDepartment());
//					vo4.setNote(vo3.getNote());
//					customerMapData.put(rootVo.getNodes().get(i).getSite_id().toString(), vo4);
//					SiteManagerCompanyVO currentVO = customerMapData.get(rootVo.getNodes().get(i).getSite_id().toString());
//			    	
//			    	parentNodes.add(currentVO);
//				}
//			}
//	    	
//	    	rootVo.getNodes().get(i).setNodes(parentNodes);
//		}
		
		allData.put("treeData", rootVo);
		allData.put("allData", company_result);
		
		return allData;
	}
	
//	@Override
//	public Map<String, Object> getCustomerList(SiteManagerCustomerVO vo) {
//		Map<String, Object> allData = new HashMap<String,Object>();
//		List<SiteManagerCompanyVO> company_result = new ArrayList<SiteManagerCompanyVO>();
//		List<SiteManagerCustomerVO> customer_result = new ArrayList<SiteManagerCustomerVO>();
//		
//		company_result = sqlSession.getMapper(SiteManagerMapper.class).getCompanyList(vo);
//		customer_result = sqlSession.getMapper(SiteManagerMapper.class).getCustomerList(vo);
//		
//		allData.put("companyData", company_result);
//		allData.put("customerData", customer_result);
//		
//		return allData;
//	}
	
	@Override
	public Map<String, Object> getCustomerList(HashMap map) {
		Map<String, Object> allData = new HashMap<String,Object>();
		//List<SiteManagerCompanyVO> company_result = new ArrayList<SiteManagerCompanyVO>();
		List<SiteManagerCustomerVO> customer_result = new ArrayList<SiteManagerCustomerVO>();
		
		//company_result = sqlSession.getMapper(SiteManagerMapper.class).getCompanyList(vo);
		customer_result = sqlSession.getMapper(SiteManagerMapper.class).getCustomerList(map);
		
		//allData.put("companyData", company_result);
		allData.put("customerData", customer_result);
		
		return allData;
	}	
	
	@Override
	public Integer addCompanyInfo(SiteManagerCompanyVO vo) {
		
		return sqlSession.getMapper(SiteManagerMapper.class).addCompanyInfo(vo);
	}	
	
	@Override
	public Integer updateCompanyInfo(SiteManagerCompanyVO vo) {
		
		return sqlSession.getMapper(SiteManagerMapper.class).updateCompanyInfo(vo);
	}	
	
	@Override
//	public Integer deleteCompanyInfo(SiteManagerCompanyVO vo) {
	public Integer deleteCompanyInfo(HashMap map) {
		return sqlSession.getMapper(SiteManagerMapper.class).deleteCompanyInfo(map);
//		return sqlSession.getMapper(SiteManagerMapper.class).deleteCompanyInfo(vo);
	}	
	
//	@Override
//	public Integer addCustomerInfo(SiteManagerCustomerVO vo) {
//		
//		return sqlSession.getMapper(SiteManagerMapper.class).addCustomerInfo(vo);
//	}	
	
	@Override
	public Integer addCustomerInfo(Map<String, Object> param) {
		
		ArrayList<HashMap<String, Object>> customer = (ArrayList<HashMap<String, Object>>) param.get("paramCustomerInfo");
		
		return sqlSession.getMapper(SiteManagerMapper.class).addCustomerInfo(customer);
	}	
	
	@Override
	public int deleteCustomerInfo(HashMap map) {
		// TODO Auto-generated method stub
		
		int result = 100;
		
		try {
//			HashMap param = new HashMap();
//			
//			if(map.get("paramCustomerId") != null) {
//				param.put("targetData", map.get("paramCustomerId"));
//				sqlSession.getMapper(SiteManagerMapper.class).deleteCustomerInfo(param);
//			}
			sqlSession.getMapper(SiteManagerMapper.class).deleteCustomerInfo(map);
		} catch (Exception e) {
			e.printStackTrace();
			result = -100;
		}		
		
		return result;
	}	
	
//	@Override
//	public int deleteCustomerInfo(SiteManagerCustomerVO vo) {
//		// TODO Auto-generated method stub
//		
//		int result = 100;
//		
//		try {
//			sqlSession.getMapper(SiteManagerMapper.class).deleteCustomerInfo(vo);
//		} catch (Exception e) {
//			e.printStackTrace();
//			result = -100;
//		}		
//		
//		return result;
//	}	
}
