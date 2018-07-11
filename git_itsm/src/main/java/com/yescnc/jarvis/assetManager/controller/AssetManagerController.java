package com.yescnc.jarvis.assetManager.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.assetManager.service.AssetManagerService;
import com.yescnc.jarvis.db.assetHistory.AssetHistoryDao;
import com.yescnc.jarvis.db.assetManager.AssetManagerDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

import net.sf.json.JSONArray;


@RequestMapping("/assetManager")
@RestController
public class AssetManagerController {
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(AssetManagerController.class);
	
	@Autowired
	AssetManagerService assetManagerService;
	
	@Autowired
	AssetManagerDao assetManagerDao;
	
	@Autowired
	AssetHistoryDao assetHistoryDao;
	
	/*자산 종류 리스트*/
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcCodeVO> getAssetList(){
		List<IdcCodeVO> result = assetManagerService.getAssetList();
		return result;
	}
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getData(@PathVariable("cmd") String cmd){
		List result = new ArrayList();
		
		switch(cmd){
			case "getExportFileFormat":
				result = assetManagerService.getExportFileFormat();
				break;
			case "getLocationList" : 
				result = assetManagerService.getLocationList();
				break;
			case "getProductStatus" : 
				result = assetManagerService.getProductStatus();
				break;
		}
		
		return result;
	}
	
	/*조회*/
	@RequestMapping(value="/{cmd}", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Map<String, Object> selectItemList(@PathVariable("cmd") String cmd, @RequestBody HashMap map){
		
		HashMap<String, Object> param = new HashMap<String, Object>();
		
		String id = (String)map.get("id");
		
		if(id.equals("All")){
			param.put("id", null);
		}else{
			param.put("id", id);
		}
		
		param.put("startRow", map.get("startRow"));
		param.put("endRow", map.get("endRow"));
		
		param.put("result", assetManagerService.selectItemList(param)); //itemLIst
		param.put("totalCount", assetManagerService.getRowCount());
		
		return param;
	}
	
	/*Create, UPdate, Delete*/
	@RequestMapping(value="/{cmd}/{type}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> createAsset(HttpServletRequest request, HttpServletResponse response, @PathVariable("cmd") String cmd,@PathVariable("type") String type, @RequestBody HashMap map){
		
		HttpSession session = request.getSession();
		UserVO userVo = (UserVO)session.getAttribute("userVO");
		
		Map<String, Object> param = new HashMap<>();
		
		String paramType = "";
		
		String userId = (String)map.get("userId");
		String ipAddr = (String)map.get("ip");
		
		if(!cmd.equals("delete") && !cmd.equals("multiUpdate")){
			if(map.get("type") instanceof String){
				paramType = (String)map.get("type");
			}else{
				paramType = (String)((HashMap)map.get("type")).get("text");
			}
		}
		
		param.put("param", map);
		List<String> historyList = new ArrayList<String>();
		List<String> deleteList = new ArrayList<String>();
//		List<String> csvList = new ArrayList<String>();
		String crudTxt = "";
		int status = 0; //삽입:100, 삽입오류:-100, 삽입중복오류:-110,//삭제:200, 삭제오류:-200, //업데이트:300, 업데이트 오류 : -300
		int changeCnt = 0; //crud 건수
		switch(cmd){
			case "create":
				param.put("type", "create");
				
				status = assetManagerService.createAsset(map);
				
				if(status == 100){
					historyList.add("idc_asset 삽입 성공");
					
					if(paramType.equals("SERVER")){
						status = assetManagerService.createServerInfo(map);
						
						if(status == 100){
							historyList.add("IDC_RACK_PLACE 서버 삽입 성공");
						}else{
							historyList.add("IDC_RACK_PLACE 서버 삽입 실패");
						}
					}
					
					changeCnt = 1;
					crudTxt = (String)map.get("assetId");
					
				}else if(status == -110){
					historyList.add("key 중복");
					param.put("result", assetManagerDao.dupleKeySearch(map));
				}else{
					historyList.add("idc_asset 삽입 실패");
				}
				
				break;
			case "update":
				param.put("type", "update");
				
				status = assetManagerService.updateAsset(map);
				
				if(status == 300){
					historyList.add("idc_asset 업데이트 성공");
					
					if(paramType.equals("SERVER")){
						status = assetManagerService.updateServer(map);
						
						if(status == 300){
							historyList.add("IDC_RACK_PLACE 서버 업데이트 성공");
						}else{
							historyList.add("IDC_RACK_PLACE 서버 업데이트 실패");
						}
						
					}
					
					changeCnt = 1;
					crudTxt = (String)map.get("assetId");
					
				}else{
					historyList.add("idc_asset 업데이트 실패");
				}
				break;
			case "delete":
				param.put("type", "delete");
				
				Iterator iterator = map.entrySet().iterator();
				
				while(iterator.hasNext()){
					Entry entry = (Entry)iterator.next();
					Map resultMap = (Map) entry.getValue();
					deleteList.add((String) resultMap.get("assetId"));
					if(deleteList.size() == 1){
						crudTxt = (String) resultMap.get("assetId");
					}else{
						crudTxt += ","+(String) resultMap.get("assetId");
					}
					//String id = (String) resultMap.get("assetId");
				}
				
				HashMap<String, Object> paramMap = new HashMap<String, Object>();
				paramMap.put("param", deleteList);
				
				status = assetManagerService.deleteAsset(paramMap);
				
				if(status == 200){
					historyList.add("idc_asset 삭제 성공");
					changeCnt = deleteList.size();
				}else{
					historyList.add("idc_asset 삭제 실패");
				}
				
				param.put("deleteList", deleteList);
				
				break;
				
			case "multiUpdate":
				param.put("type", "multiUpdate");
//				ArrayList multiUpdateList = new ArrayList();
				ArrayList csvList = (ArrayList) map.get("crudList");
				
				int result= 0;
				int csvLen = csvList.size();
				for(int i =0; i< csvLen; i++){
					try{
						HashMap csvMap = (HashMap) csvList.get(i);
						result = assetManagerService.csvAsset(csvMap);
						
						if(i == 0){
							crudTxt = (String) csvMap.get("assetId");
						}else{
							crudTxt += "," + (String) csvMap.get("assetId");
						}
						
						if(result == 400 && csvMap.get("codeName").equals("SERVER")){
							try {
								result = assetManagerService.csvRackPlace(csvMap);
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
						
					}catch(Exception e){
						e.printStackTrace();
					}
				}
				
				status = result;
				
				if(status > 0){
					historyList.add("idc_asset csv import 성공");
					changeCnt = csvList.size();
				}else{
					historyList.add("idc_asset csv import 실패");
				}
				
				break;
		}
		
		param.put("status", status);
		param.put("history", historyList);
		param.put("changeCnt", changeCnt);
		param.put("crudTxt", crudTxt);
		
		if(status > 0){
			//정상 동작 했을 경우에만 기록 남김
			param.put("userVO", userVo);
			Integer historyResult = 0;
			
			historyResult = assetHistoryDao.insertHistory(param);
		}
		return param;
	}
}
