package com.yescnc.project.itsm.db.order;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.util.tree.IdcTree;
import com.yescnc.project.itsm.entity.db.EstimateVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;
import com.yescnc.project.itsm.estimate.controller.EstimateController;

@Repository
public class OrderDaoImpl implements OrderDao {
	private org.slf4j.Logger log = LoggerFactory.getLogger(OrderDaoImpl.class);
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<EstimateVO> getEstimateList(Map<String, Object> params) {
		return sqlSession.getMapper(OrderMapper.class).getEstimateList(params);
	}
	
	@Override
	public List<Object> getOrderParameters(){
		Map<String, Object> params = new HashMap<String, Object>();
		List<Object> result = new ArrayList<Object>();
		
		List<HashMap<String, Object>> orderStatus = new ArrayList<HashMap<String, Object>>();
		List<HashMap<String, Object>> mailStatus = new ArrayList<HashMap<String, Object>>();
		List<HashMap<String, Object>> period = new ArrayList<HashMap<String, Object>>();
		//List<HashMap<String, Object>> year = new ArrayList<HashMap<String, Object>>();
		
		orderStatus = sqlSession.getMapper(OrderMapper.class).getOrderStatusParam();
		mailStatus = sqlSession.getMapper(OrderMapper.class).getMailStatusParam();
		period = sqlSession.getMapper(OrderMapper.class).getPeriodStatusParam();
		//year = sqlSession.getMapper(OrderMapper.class).getYearParam();
		
		params.put("orderStatus", orderStatus);
		params.put("mailStatus", mailStatus);
		params.put("period", period);
		//params.put("year", year);
		
		result.add(params);
		
		return result;
	}
	
	@Override
	public Map<String, Object> getCompanyList() {
		Map<String, Object> allData = new HashMap<String,Object>();
		List<SiteManagerCompanyVO> result = new ArrayList<SiteManagerCompanyVO>();
		result = sqlSession.getMapper(OrderMapper.class).getCompanyList();
		
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
			}else{
				vo1.setExpanded(true);
				vo1.setImg("fas fa-cube fa-lg");
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
	public List<HashMap<String, Object>> getProductInfo(String estimateId){
		return sqlSession.getMapper(OrderMapper.class).getProductInfo(estimateId);
	}
	
	@Override
	public Integer saveOrderData(Map<String, Object> param){
		int result = 100;
		int mailStatus = 0; // 1. Send, 2. No Send
		String orderId = null;
		
		Map<String, Object> orderParams = new HashMap<String, Object>();
		ArrayList<Object> orderProduct = new ArrayList<Object>();
		
		try{
			orderParams = (Map<String, Object>) param.get("params");
			orderProduct = (ArrayList<Object>) param.get("product");
			orderId = (String) orderParams.get("order_id");
			mailStatus = (int) orderParams.get("o_status");
			
			Integer checkOrderData = sqlSession.getMapper(OrderMapper.class).selectOrderData(orderId);
			System.out.println("==========ORDER DAO IMPL========== "+checkOrderData);
			System.out.println("==========ORDER DAO IMPL mailStatus========== "+mailStatus);
			if(checkOrderData == 0){
				System.out.println("Check Order DATA == 0");
				if(mailStatus == 2){ // Send Email directly.
					System.out.println("Mail Status == 1");
					sqlSession.getMapper(OrderMapper.class).saveSendEmailOrderData(orderParams); 
					//order_start_date = order_end_date = customs_start_date = sysdate()
				}else{ // Only Save
					sqlSession.getMapper(OrderMapper.class).saveOrderData(orderParams);
					//order_start_date = sysdate()
				}
				sqlSession.getMapper(OrderMapper.class).saveProductData(orderProduct);
			}else{ // Send Email after Save
				if(mailStatus == 2){
					sqlSession.getMapper(OrderMapper.class).updateOrderDate(orderParams);
					//order_end_date  = customs_start_date = sysdate()
				}else{
					sqlSession.getMapper(OrderMapper.class).updateOrderData(orderParams);
				}
				System.out.println("==============order Product========="+orderProduct);
				sqlSession.getMapper(OrderMapper.class).updateProductData(orderProduct);
			}

		}catch (Exception e){
			result = -100;
		}
		return result;
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> getOrderData(Map<String, Object> params){
		return sqlSession.getMapper(OrderMapper.class).getOrderData(params);
	}
	
	@Override
	public Map<String, Object> getSelectedOrderData(String orderId){
		Map<String, Object> result = new HashMap<String, Object>();
		
		List<Object> orderData = new ArrayList<Object>();
		List<Object> productData = new ArrayList<Object>();
		List<Object> shippingData = new ArrayList<Object>(); 
		List<Object> portData = new ArrayList<Object>();
		List<Object> customsData = new ArrayList<Object>();
		Map<String, Object> deliveryData = new HashMap<String, Object>();
		
		orderData = sqlSession.getMapper(OrderMapper.class).getSelectedOrderData(orderId);
		productData = sqlSession.getMapper(OrderMapper.class).getSelectedProductData(orderId);
		shippingData = sqlSession.getMapper(OrderMapper.class).getSelectedShippingData(orderId);
		portData = sqlSession.getMapper(OrderMapper.class).getSelectedPortData(orderId);
		customsData = sqlSession.getMapper(OrderMapper.class).getSelectedCustomsData(orderId);
		deliveryData = sqlSession.getMapper(OrderMapper.class).getSelectedDeliveryData(orderId);
		
		result.put("orderData", orderData);
		result.put("productData", productData);
		result.put("shippingData", shippingData);
		result.put("portData", portData);
		result.put("customsData", customsData);
		result.put("deliveryData", deliveryData);
		
		return result;
	}
	
	@Override
	public Integer deleteOrderData(Map<String, Object> param){
		return sqlSession.getMapper(OrderMapper.class).deleteOrderData(param);
	}
	
	/*@Override // Not Use
	public Integer updateOrderData(Map<String, Object> param){
		int result = 100;
		Map<String, Object> orderParams = new HashMap<String, Object>();
		ArrayList<Object> orderProduct = new ArrayList<Object>();
		
		try{
			orderParams = (Map<String, Object>) param.get("params");
			orderProduct = (ArrayList<Object>) param.get("product");
			
			sqlSession.getMapper(OrderMapper.class).updateOrderData(orderParams);
			sqlSession.getMapper(OrderMapper.class).updateProductData(orderProduct);
		}catch (Exception e){
			result = -100;
		}
		return result;
	}*/
	
	@Override
	public Integer saveShippingData(Map<String, Object> param){
		int result = 100;
		Map<String, Object> etcParams = new HashMap<String, Object>();
		ArrayList<Object> orderParams = new ArrayList<Object>();
		ArrayList<Object> compare = new ArrayList<Object>();
		Integer complete = 2;
		String orderId = null;
		
		try{
			orderParams = (ArrayList<Object>) param.get("params");
			etcParams = (Map<String, Object>) param.get("product");
			compare = (ArrayList<Object>) etcParams.get("compare");
			
			complete = (Integer) etcParams.get("s_complete");
			orderId = (String) etcParams.get("order_id");
			
			sqlSession.getMapper(OrderMapper.class).deleteShippingData(orderId);
			sqlSession.getMapper(OrderMapper.class).saveShippingData(orderParams);
			if(complete == 1){ //complete
				sqlSession.getMapper(OrderMapper.class).updateCompleteShipping(etcParams);
				sqlSession.getMapper(OrderMapper.class).insertFltMawbHawbInfo(compare);
			}else{ //not complete
				sqlSession.getMapper(OrderMapper.class).updateNotCompleteShipping(etcParams);
			}
		}catch (Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer savePortData(Map<String, Object> param){
		int result = 100;
		Map<String, Object> etcParams = new HashMap<String, Object>();
		ArrayList<Object> orderParams = new ArrayList<Object>();
		Integer complete = 2;
		String orderId = null;
		
		try{
			orderParams = (ArrayList<Object>) param.get("params");
			etcParams = (Map<String, Object>) param.get("product");
			
			complete = (Integer) etcParams.get("p_complete");
			orderId = (String) etcParams.get("order_id");
			
			sqlSession.getMapper(OrderMapper.class).deletePortData(orderId);
			sqlSession.getMapper(OrderMapper.class).savePortData(orderParams);
			if(complete == 1){ //complete
				sqlSession.getMapper(OrderMapper.class).updateCompletePort(etcParams);
			}else{ //not complete
				sqlSession.getMapper(OrderMapper.class).updateNotCompletePort(etcParams);
			}
		}catch (Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer saveCustomsData(Map<String, Object> param){
		int result = 100;
		Map<String, Object> etcParams = new HashMap<String, Object>();
		ArrayList<Object> orderParams = new ArrayList<Object>();
		Integer complete = 2;
		String orderId = null;
		
		try{
			orderParams = (ArrayList<Object>) param.get("params");
			etcParams = (Map<String, Object>) param.get("product");
			
			complete = (Integer) etcParams.get("c_complete");
			orderId = (String) etcParams.get("order_id");
			
			sqlSession.getMapper(OrderMapper.class).deleteCustomsData(orderId);
			sqlSession.getMapper(OrderMapper.class).saveCustomsData(orderParams);
			if(complete == 1){ //complete
				sqlSession.getMapper(OrderMapper.class).updateCompleteCustoms(etcParams);
			}else{ //not complete
				sqlSession.getMapper(OrderMapper.class).updateNotCompleteCustoms(etcParams);
			}
		}catch (Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Integer saveDeliveryData(Map<String, Object> param){
		int result = 100;
		Map<String, Object> customsParam = new HashMap<String, Object>();
		Integer complete = 2;
		
		try{
			customsParam = (Map<String, Object>) param.get("params");
			complete = (Integer) customsParam.get("d_complete");
			
			sqlSession.getMapper(OrderMapper.class).saveDeliveryData(customsParam);
			if(complete == 1){ //complete
				sqlSession.getMapper(OrderMapper.class).updateCompleteDelivery(customsParam);
			}else{ //not complete
				sqlSession.getMapper(OrderMapper.class).updateNotCompleteDelivery(customsParam);
			}
		}catch (Exception e){
			result = -100;
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Map<String, Object> getStatusCounts(String year){
		return sqlSession.getMapper(OrderMapper.class).getStatusCounts(year);
	}
	
	@Override
	public List<Object> getYearList(){
		return sqlSession.getMapper(OrderMapper.class).getYearList();
	}
	
	@Override
	public Object getRowCount(){
		return sqlSession.getMapper(OrderMapper.class).getRowCount();
	}
}
