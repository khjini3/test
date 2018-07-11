package com.yescnc.project.itsm.db.order;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.EstimateVO;

public interface OrderDao {

	List<EstimateVO> getEstimateList(Map<String, Object> params);

	Map<String, Object> getCompanyList();

	List<Object> getOrderParameters();

	List<HashMap<String, Object>> getProductInfo(String estimateId);

	Integer saveOrderData(Map<String, Object> param);

	ArrayList<HashMap<String, Object>> getOrderData(Map<String, Object> params);

	Map<String, Object> getSelectedOrderData(String orderId);

	Integer deleteOrderData(Map<String, Object> param);

	//Integer updateOrderData(Map<String, Object> param);

	Integer saveShippingData(Map<String, Object> param);

	Integer savePortData(Map<String, Object> param);

	Integer saveCustomsData(Map<String, Object> param);

	Integer saveDeliveryData(Map<String, Object> param);

	Map<String, Object> getStatusCounts(String year);

	List<Object> getYearList();

	Object getRowCount();

}