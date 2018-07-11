package com.yescnc.project.itsm.order.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.UserVO;
import com.yescnc.project.itsm.entity.db.EstimateVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;
import com.yescnc.project.itsm.order.service.OrderService;

@RequestMapping("/order")
@RestController
public class OrderController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(OrderController.class);
	
	@Autowired
	OrderService orderService;
	
	@RequestMapping(value="/getEstimateList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<EstimateVO> getEstimateList(@RequestBody Map<String, Object> params){
		return orderService.getEstimateList(params);
	}
	
	@RequestMapping(value = "/getCompanyList", method=RequestMethod.GET)
	public Map<String, Object> getCompanyList(){
		Map<String, Object> result = orderService.getCompanyList();
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<SiteManagerCustomerVO> selectItemList(@PathVariable("cmd") String cmd){
		SiteManagerCustomerVO vo = new SiteManagerCustomerVO();
		String site_id = cmd;
		
		if(site_id.equals("-1")){
			site_id = "0";
		}else{
			site_id = cmd;
		}
		vo.setSite_id(site_id);
		
		return orderService.selectItemList(vo); //itemLIst
	}
	
	@RequestMapping(value="/getOrderParameters", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<Object> getOrderParameters(){
		return orderService.getOrderParameters();
	}
	
	@RequestMapping(value="/getProductInfo/{estimateId}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<HashMap<String, Object>> getProductInfo(@PathVariable("estimateId") String estimateId){
		return orderService.getProductInfo(estimateId);
	}
	
	@RequestMapping(value="/saveOrderData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer saveOrderData(@RequestBody Map<String, Object> param){
		return orderService.saveOrderData(param);
	}
	
	@RequestMapping(value="/getOrderData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> getOrderData(@RequestBody Map<String, Object> params){
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("startRow", params.get("startRow"));
		map.put("endRow", params.get("endRow"));
		
		map.put("result", orderService.getOrderData(params));
		map.put("totalCount", orderService.getRowCount());
		
		return map;
	}
	
	@RequestMapping(value = "/getSelectedOrderData/{orderId}", method=RequestMethod.GET)
	public Map<String, Object> getSelectedOrderData(@PathVariable("orderId") String orderId){
		return orderService.getSelectedOrderData(orderId);
	}
	
	
	@RequestMapping(value="/deleteOrderData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer deleteOrderData(@RequestBody Map<String, Object> param){
		return orderService.deleteOrderData(param);
	}
	
	/*@RequestMapping(value="/updateOrderData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateOrderData(@RequestBody Map<String, Object> param){
		return orderService.updateOrderData(param);
	}*/
	
	@RequestMapping(value="/saveShippingData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer saveShippingData(@RequestBody Map<String, Object> param){
		return orderService.saveShippingData(param);
	}
	
	@RequestMapping(value="/savePortData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer savePortData(@RequestBody Map<String, Object> param){
		return orderService.savePortData(param);
	}
	
	@RequestMapping(value="/saveCustomsData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer saveCustomsData(@RequestBody Map<String, Object> param){
		return orderService.saveCustomsData(param);
	}
	
	@RequestMapping(value="/saveDeliveryData", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer saveDeliveryData(@RequestBody Map<String, Object> param){
		return orderService.saveDeliveryData(param);
	}
	
	@RequestMapping(value="/getStatusCounts/{year}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public Map<String, Object> getStatusCounts(@PathVariable("year") String year){
		return orderService.getStatusCounts(year);
	}
	
	@RequestMapping(value="/getYearList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<Object> getYearList(){
		return orderService.getYearList();
	}
}
