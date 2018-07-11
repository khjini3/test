package com.yescnc.jarvis.assetStatus.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.assetStatus.service.AssetStatusService;
import com.yescnc.jarvis.codeManager.controller.CodeManagerController;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

@RequestMapping("/assetStatus")
@RestController
public class AssetStatusController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(CodeManagerController.class);
	
	@Autowired
	AssetStatusService assetStatusService;
	
	@RequestMapping(value="/getLocationList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcLocationVO> selectLocationList(){
		List <IdcLocationVO> result = new ArrayList();
		
		result = assetStatusService.getLocationList();
		return result;
	}
	
	@RequestMapping(value="/getProductList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcCodeVO> selectProductList(){
		List<IdcCodeVO> result = new ArrayList();
		
		result = assetStatusService.getProductList();
		return result;
	}
	
	@RequestMapping(value="/searchAssetStatus", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> searchAssetStatus(@RequestBody Map<String, Object> param){
		
//		ArrayList<HashMap<String, Object>> result = assetStatusService.searchAssetStatus(param);
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("startRow", param.get("startRow"));
		map.put("endRow", param.get("endRow"));
		
		map.put("result", assetStatusService.searchAssetStatus(param));
		map.put("totalCount", assetStatusService.getRowCount());
		
		log.debug("AssetStatusController result = "+map.toString());
		return map;
	}
	
	/*@RequestMapping(value="/locationType", method=RequestMethod.GET, produces="application/json;charset=UTF-8"))
	public JsonResult getLocationType*/
}
