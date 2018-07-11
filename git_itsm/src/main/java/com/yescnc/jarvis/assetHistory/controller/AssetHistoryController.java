package com.yescnc.jarvis.assetHistory.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.UserVO;
import com.yescnc.jarvis.assetHistory.service.AssetHistoryService;


@RequestMapping("/assetHistory")
@RestController
public class AssetHistoryController {
	
	@Autowired
	AssetHistoryService assetHistoryService;
	
	@RequestMapping(value="/searchHistory", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> searchHistory(@RequestBody Map<String, Object> param){
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("startRow", param.get("startRow"));
		map.put("endRow", param.get("endRow"));
		
		map.put("result", assetHistoryService.searchHistory(param));
		map.put("totalCount", assetHistoryService.getRowCount());

		return map;
	}
	
	@RequestMapping(value="/getUserList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UserVO> getUserList(){
		return assetHistoryService.getUserList();
	}
}
