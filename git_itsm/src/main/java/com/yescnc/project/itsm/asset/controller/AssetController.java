package com.yescnc.project.itsm.asset.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.jarvis.db.assetHistory.AssetHistoryDao;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.project.itsm.asset.service.AssetService;
import com.yescnc.project.itsm.entity.db.AssetVO;
import com.yescnc.project.itsm.productManager.service.ProductManagerService;
import com.yescnc.project.itsm.sitemanager.service.SiteManagerService;

@RequestMapping("/asset")
@RestController
public class AssetController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(AssetController.class);
	
	@Autowired
	SiteManagerService siteManagerService;
	
	@Autowired
	AssetService assetService;
	
	@Autowired
	AssetHistoryDao assetHistoryDao;
	
	@Autowired
	ProductManagerService productManagerService;
	
	
	@RequestMapping(value = "/getCompanyList", method=RequestMethod.GET)
	public Map<String, Object> getCompanyList() {
		Map<String, Object> result = siteManagerService.getCompanyList(null);
			return result;
	}
	
	@RequestMapping(value = "/getModelList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public List<AssetVO> getModelList(){
		return assetService.getModelList();
	}
	
	@RequestMapping(value = "/getModelTypeList", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public List<AssetVO> getModelTypeList(){
		return assetService.getModelList();
	}
	
	@OperationLogging(enabled=true)
	@RequestMapping(value = "/selectModelList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> selectModelList(@RequestBody HashMap map) {
		Map<String, Object> result =  assetService.selectModelList(map);
		return result;
	}
	
	@RequestMapping(value = "/updateModel", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public int updateModel(HttpServletRequest request, @RequestBody HashMap map) {
		int result =  assetService.updateAsset(map);

		HttpSession session = request.getSession();
		UserVO userVo = (UserVO)session.getAttribute("userVO");

		Map<String, Object> param = new HashMap<>();
		
		if( result > 0){
			//정상 동작 했을 경우에만 기록 남김
			param.put("userVO", userVo);
			Integer historyResult = 0;
			
			historyResult = assetHistoryDao.insertHistory(param);
		}
		return result;
	}
	
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

		String crudTxt = "";
		int status = 0; //삽입:100, 삽입오류:-100, 삽입중복오류:-110,//삭제:200, 삭제오류:-200, //업데이트:300, 업데이트 오류 : -300
		int changeCnt = 0; //crud 건수
		
		switch(cmd){
			case "multiUpdate":
				param.put("type", "multiUpdate");
				ArrayList csvList = (ArrayList) map.get("crudList");
				
				int result= 0;
				int csvLen = csvList.size();
				for(int i =0; i< csvLen; i++){
					try{
						HashMap csvMap = (HashMap) csvList.get(i);
						result = assetService.csvAsset(csvMap);
											
					}catch(Exception e){
						e.printStackTrace();
					}
				}
				
				status = result;
							
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
	
	@RequestMapping(value = "/getProductList", method=RequestMethod.GET)
	public List<IdcCodeVO> getProductList() {
		List<IdcCodeVO> result = new ArrayList();
		result = productManagerService.getProductList();
		return result;
	}
	
	@RequestMapping(value="/searchAsset", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public HashMap<String, Object> searchAsset(@RequestBody Map<String, Object> param){
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("result", assetService.searchAsset(param));
		
		return map;
	}
	
}
