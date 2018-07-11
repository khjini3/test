package com.yescnc.jarvis.tickerManager.controller;

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
import com.yescnc.jarvis.db.assetHistory.AssetHistoryDao;
import com.yescnc.jarvis.db.tickerManager.TickerManagerDao;
import com.yescnc.jarvis.entity.db.TickerVO;
import com.yescnc.jarvis.tickerManager.service.TickerManagerService;


@RequestMapping("/tickerManager")
@RestController
public class TickerManagerController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(TickerManagerController.class);
	
	@Autowired
	TickerManagerService tickerManagerService;
	
	@Autowired
	TickerManagerDao tickerManagerDao;
	
	@Autowired
	AssetHistoryDao assetHistoryDao;
	
	@RequestMapping(value="/{cmd}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List getData(@PathVariable("cmd") String cmd){
		List result = new ArrayList();
		
		switch(cmd){
			case "getTickerList" :
				result = tickerManagerService.getTickerList();
				break;
			case "getTickerScrollingList" : 
				result = tickerManagerService.getTickerScrollingList();
				break;
		}
		
//		List<TickerVO> result = tickerManagerService.getTickerList();
		return result;
	}
	
	@RequestMapping(value="/searchTickerList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> searchTickerList(@RequestBody HashMap param){
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		map.put("result", tickerManagerService.searchTickerList(param));
		
		return map;
	}
	
	/*Create, Update, Delete*/
	@RequestMapping(value="/{cmd}/{type}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> createTicker(HttpServletRequest request, HttpServletResponse response, @PathVariable("cmd") String cmd,@PathVariable("type") String type, @RequestBody HashMap map){
		
		HttpSession session = request.getSession();
		UserVO userVo = (UserVO)session.getAttribute("userVO");
		
		Map<String, Object> param = new HashMap<>();
		
		String paramType = "";
		
		String userId = (String)map.get("userId");
		String ipAddr = (String)map.get("ip");
		
		/*if(!cmd.equals("delete")){
			if(map.get("type") instanceof String){
				paramType = (String)map.get("type");
			}else{
				paramType = (String)((HashMap)map.get("type")).get("text");
			}
		}*/
		
		param.put("param", map);
		List<String> historyList = new ArrayList<String>();
		List<String> deleteList = new ArrayList<String>();
		
		String crudTxt = "";
		int status = 0; //삽입:100, 삽입오류:-100, 삽입중복오류:-110,//삭제:200, 삭제오류:-200, //업데이트:300, 업데이트 오류 : -300
		int changeCnt = 0; //crud 건수
		
		switch(cmd){
			case "create":
				param.put("type", "create");
				
				status = tickerManagerService.createTicker(map);
				
				if(status == 100){
					historyList.add("idc_ticker 삽입 성공");
					
					changeCnt = 1;
					crudTxt = (String)map.get("tickerText");
					
				}else if(status == -110){
					historyList.add("key 중복");
					param.put("result", tickerManagerDao.dupleKeySearch(map));
				}else{
					historyList.add("idc_ticker 삽입 실패");
				}
				
				break;
				
			case "update":
				param.put("type", "update");
				
				status = tickerManagerService.updateTicker(map);
				
				if(status == 300){
					historyList.add("idc_ticker 업데이트 성공");
					
					changeCnt = 1;
					crudTxt = (String)map.get("tickerText");
					
				}else{
					historyList.add("idc_ticker 업데이트 실패");
				}
				break;
			
			case "delete":
				param.put("type", "delete");
				
				Iterator iterator = map.entrySet().iterator();
				
				while(iterator.hasNext()){
					Entry entry = (Entry)iterator.next();
					Map resultMap = (Map) entry.getValue();
					deleteList.add((String) resultMap.get("tickerText"));
					if(deleteList.size() == 1){
						crudTxt = (String) resultMap.get("tickerText");
					}else{
						crudTxt += ","+(String) resultMap.get("tickerText");
					}
				}
				
				HashMap<String, Object> paramMap = new HashMap<String, Object>();
				paramMap.put("param", deleteList);
				
				status = tickerManagerService.deleteTicker(paramMap);
				
				if(status == 200){
					historyList.add("idc_ticker 삭제 성공");
					changeCnt = deleteList.size();
				}else{
					historyList.add("idc_ticker 삭제 실패");
				}
				
				param.put("deleteList", deleteList);
				
				break;
		}
		
		param.put("status", status);
		param.put("history", historyList);
		param.put("changeCnt", changeCnt);
		param.put("crudTxt", crudTxt);
		
		/*if(status > 0){
			//정상 동작 했을 경우에만 기록 남김
			param.put("userVO", userVo);
			Integer historyResult = 0;
			
			historyResult = assetHistoryDao.insertHistory(param);
		}*/
		
		return param;
		
	}
}
