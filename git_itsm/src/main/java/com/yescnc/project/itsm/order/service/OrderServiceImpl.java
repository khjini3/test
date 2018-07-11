package com.yescnc.project.itsm.order.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.entity.db.AssetCoreInfoVO;
import com.yescnc.project.itsm.db.estimate.EstimateDao;
import com.yescnc.project.itsm.db.order.OrderDao;
import com.yescnc.project.itsm.entity.db.EstimateVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;

@Service
public class OrderServiceImpl implements OrderService {
	
	@Autowired
	OrderDao orderDao;

	@Autowired
	EstimateDao estimateDao;
	
	@Override
	public List<EstimateVO> getEstimateList(Map<String, Object> params){
		return orderDao.getEstimateList(params);
	}
	
	@Override
	public Map<String, Object> getCompanyList(){
		return orderDao.getCompanyList();
	}
	
	@Override
	public List<SiteManagerCustomerVO> selectItemList(SiteManagerCustomerVO vo) {
		return estimateDao.selectItemList(vo);
	}
	
	@Override
	public List<Object> getOrderParameters(){
		return orderDao.getOrderParameters();
	}
	
	@Override
	public List<HashMap<String, Object>> getProductInfo(String estimateId){
		return orderDao.getProductInfo(estimateId);
	}
	
	@Override
	public Integer saveOrderData(Map<String, Object> param){
		return orderDao.saveOrderData(param);
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> getOrderData(Map<String, Object> params){
		return orderDao.getOrderData(params);
	}
	
	@Override
	public Map<String, Object> getSelectedOrderData(String orderId){
		return orderDao.getSelectedOrderData(orderId);
	}
	
	@Override
	public Integer deleteOrderData(Map<String, Object> param){
		return orderDao.deleteOrderData(param);
	}
	
	/*@Override
	public Integer updateOrderData(Map<String, Object> param){
		return orderDao.updateOrderData(param);
	}*/
	
	@Override
	public Integer saveShippingData(Map<String, Object> param){
		return orderDao.saveShippingData(param);
	}
	
	@Override
	public Integer savePortData(Map<String, Object> param){
		return orderDao.savePortData(param);
	}
	
	@Override
	public Integer saveCustomsData(Map<String, Object> param){
		return orderDao.saveCustomsData(param);
	}
	
	@Override
	public Integer saveDeliveryData(Map<String, Object> param){
		return orderDao.saveDeliveryData(param);
	}
	
	@Override
	public Map<String, Object> getStatusCounts(String year){
		return orderDao.getStatusCounts(year);
	}
	
	@Override
	public List<Object> getYearList(){
		return orderDao.getYearList();
	}
	
	@Override
	public Object getRowCount(){
		return orderDao.getRowCount();
	}
}