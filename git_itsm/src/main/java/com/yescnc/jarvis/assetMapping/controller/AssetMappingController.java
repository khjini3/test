package com.yescnc.jarvis.assetMapping.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.LoggerFactory;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.UserVO;
import com.yescnc.jarvis.assetManager.controller.AssetManagerController;
import com.yescnc.jarvis.assetMapping.service.AssetMappingService;
import com.yescnc.jarvis.db.assetHistory.AssetHistoryDao;
import com.yescnc.jarvis.db.assetMapping.AssetMappingDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.LocationVO;

@RequestMapping("/assetMapping")
@RestController
public class AssetMappingController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(AssetManagerController.class);
	
	@Autowired
	AssetMappingService assetMappingService;
	
	@Autowired
	AssetHistoryDao assetHistoryDao;
	
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public LocationVO getLocalList(){
		LocationVO result = assetMappingService.getLocalList(); 
		return result;
	}
	
	@RequestMapping(value="/{cmd}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getLocalList(@PathVariable("cmd") String cmd){
		List result = new ArrayList<AssetInfoVO>();
		switch(cmd){
			case "assetList":
				result = assetMappingService.assetList();
				break;
			case "codeList":
				result = assetMappingService.codeList();
				break;
			case "getServerList":
				result = assetMappingService.getServerList();
				break;
			case "getAvailabilityList":
				result = assetMappingService.getAvailabilityList();
				break;
				
		}
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{id}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<AssetInfoVO> getList(@PathVariable("cmd") String cmd, @PathVariable("id") String id){
		List<AssetInfoVO> result = new ArrayList<AssetInfoVO>();
		switch(cmd){
			case "getRackInList":
				result = assetMappingService.getRackInList(id);
				break;
			case "getRackServerList":
				result = assetMappingService.getRackServerList(id);
				break;
			case "getRoomAssetList":
				result = assetMappingService.getRoomAssetList(id);
				break;
		}
		return result;
	}
	
	@RequestMapping(value="/{cmd}/{id}",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> updateLocationInfo(HttpServletRequest request, @PathVariable("cmd") String cmd, @PathVariable("id") String id, @RequestBody HashMap map){
		
		Map<String, Object> param = new HashMap<>();
		Map<String, Object> historyParam = new HashMap<>();
		
		HttpSession session = request.getSession();
		UserVO userVo = (UserVO)session.getAttribute("userVO");
		
		int changeCnt = 0; // 건 수
		String crudTxt = ""; // asset list
		String locName = ""; // room name
		
		param.put("param", map);
		historyParam.put("userVO", userVo);
		
		List historyList = new ArrayList<String>();
		
		switch(cmd){
		
			case "updateLocationInfo":
			case "updateServerInfo":
				
				List<AssetInfoVO> leftAC = (List<AssetInfoVO>)map.get("leftAC"); // assigned
				List<AssetInfoVO> rightAC = (List<AssetInfoVO>)map.get("rightAC"); // unassigned
				
				Integer status = 0;
				
				if(leftAC != null && leftAC.size() > 0){
					
					Map leftMap = new HashMap();
					
					leftMap.put("locId", id);
					leftMap.put("list", leftAC);
					
					changeCnt = leftAC.size();

					for(int i = 0; i<changeCnt; i++){
						if(i == 0){
							crudTxt = (String)((Map)leftAC.get(0)).get("assetId");
						}else{
							crudTxt += "," + (String)((Map)leftAC.get(i)).get("assetId");
						}
					}
					locName = (String)((Map)leftAC.get(0)).get("locName");
					
					historyParam.put("locName", locName);
					historyParam.put("crudTxt", crudTxt);
					historyParam.put("changeCnt", changeCnt);
					historyParam.put("type", "assigned");
					
					if(cmd.equals("updateLocationInfo")){
						status = assetMappingService.updateLocationInfo((HashMap) leftMap);
					}else{
						status = assetMappingService.updateServerInfo((HashMap) leftMap);
					}
					
					if(status > 0){
						Integer historyResult = 0;
						historyResult = assetHistoryDao.insertHistory(historyParam);
					}
					
					historyList.add(status);
					
				}
				
				if(rightAC != null && rightAC.size() > 0){
					
					Map rightMap = new HashMap();
					
					rightMap.put("locId", null);
					rightMap.put("list", rightAC);
					
					changeCnt = rightAC.size();
					
					for(int i = 0; i<changeCnt; i++){
						if(i == 0){
							crudTxt = (String)((Map)rightAC.get(0)).get("assetId");
						}else{
							crudTxt += "," + (String)((Map)rightAC.get(i)).get("assetId");
						}
					}
					
					locName = (String)((Map)rightAC.get(0)).get("locName");
					
					historyParam.put("locName", locName);
					historyParam.put("crudTxt", crudTxt);
					historyParam.put("changeCnt", changeCnt);
					historyParam.put("type", "unassigned");
					
					if(cmd.equals("updateLocationInfo")){
						status = assetMappingService.updateLocationInfo((HashMap) rightMap);
						if(status>0){
							Integer deleteComponent = 0;
							deleteComponent = assetMappingService.deleteComponent((HashMap) rightMap);
						}
					}else{
						status = assetMappingService.updateServerInfo((HashMap) rightMap);
					}
					
					if(status > 0){
						Integer historyResult = 0;
						historyResult = assetHistoryDao.insertHistory(historyParam);
					}
					
					historyList.add(status);
				}
				
				param.put("history", historyList);
			
			break;
		}
		
		return param;
	}
}
