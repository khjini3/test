package com.yescnc.project.itsm.db.order;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.EstimateVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCompanyVO;

public interface OrderMapper {

	List<EstimateVO> getEstimateList(Map<String, Object> params);

	List<SiteManagerCompanyVO> getCompanyList();

	List<HashMap<String, Object>> getOrderStatusParam();
	
	List<HashMap<String, Object>> getMailStatusParam();
	
	List<HashMap<String, Object>> getPeriodStatusParam();

	List<HashMap<String, Object>> getProductInfo(String estimateId);

	Integer saveOrderData(Map<String, Object> orderParams);

	ArrayList<HashMap<String, Object>> getOrderData(Map<String, Object> params);

	void saveProductData(ArrayList<Object> orderProduct);

	List<Object> getSelectedOrderData(String orderId);

	List<Object> getSelectedProductData(String orderId);
	
	List<Object> getSelectedShippingData(String orderId);

	Integer deleteOrderData(Map<String, Object> param);

	Integer updateOrderData(Map<String, Object> param);

	int selectOrderData(String orderId);

	void updateProductData(ArrayList<Object> orderProduct);

	void updateOrderDate(Map<String, Object> orderParams);

	void saveSendEmailOrderData(Map<String, Object> orderParams);

	void deleteShippingData(String orderId);

	void saveShippingData(ArrayList<Object> orderParams);

	void updateCompleteShipping(Map<String, Object> completeFlag);

	void updateNotCompleteShipping(Map<String, Object> completeFlag);

	void insertPortData(Map<String, Object> completeFlag);

	void deletePortData(String orderId);

	void savePortData(ArrayList<Object> orderParams);

	void updateCompletePort(Map<String, Object> etcParams);

	void updateNotCompletePort(Map<String, Object> etcParams);

	List<Object> getSelectedPortData(String orderId);

	//List<Object> getSelectedPortFltMawbHawbInfo(String orderId);

	void insertFltMawbHawbInfo(ArrayList<Object> compare);

	void deleteCustomsData(String orderId);

	void saveCustomsData(ArrayList<Object> orderParams);

	void updateCompleteCustoms(Map<String, Object> etcParams);

	void updateNotCompleteCustoms(Map<String, Object> etcParams);

	List<Object> getSelectedCustomsData(String orderId);

	void saveDeliveryData(Map<String, Object> customsParam);

	void updateCompleteDelivery(Map<String, Object> customsParam);

	void updateNotCompleteDelivery(Map<String, Object> customsParam);

	Map<String, Object> getSelectedDeliveryData(String orderId);

	List<HashMap<String, Object>> getYearParam();

	Map<String, Object> getStatusCounts(String year);

	List<Object> getYearList();

	Object getRowCount();

}
