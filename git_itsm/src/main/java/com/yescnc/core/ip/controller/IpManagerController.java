package com.yescnc.core.ip.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.core.entity.db.IpVO;
import com.yescnc.core.ip.service.IpService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/settings/ip")
@RestController
public class IpManagerController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(IpManagerController.class);
	
	@Autowired
	IpService ipService;
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IpVO> selectIpList(@RequestParam(value = "search", required = false) String searchItem) {
		if(searchItem != null) {
			IpVO vo = new IpVO();
			vo.setIpAddress(searchItem);
			return ipService.searchIpList(vo);
		} else {
			return ipService.selectIpList();
		}		
	}
	
	@RequestMapping(value = "/{seq}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public IpVO selectIp(@PathVariable("seq") Integer id) {
		IpVO vo = new IpVO();
		vo.setId(id);
		return ipService.selectIp(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertIp(@RequestBody IpVO vo) {
		return ipService.insertIp(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateIp(@PathVariable("seq") Integer id, @RequestBody IpVO vo) {
		vo.setId(id);
		return ipService.updateByIp(vo);
	}
	
	@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_SETTINGS)
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteIp(@PathVariable("seq") Integer id) {
		IpVO vo = new IpVO();
		vo.setId(id);
		return ipService.deleteByIp(vo);
	}
	
	@RequestMapping(value = "/multiDelete/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteIpMulti(@PathVariable("seq") String id) {
		
		int result = -1;
		List<String> multis = Arrays.asList(id.split(","));
		Iterator<String> iterator = multis.iterator();
		
		List<IpVO> resultList = new ArrayList<>();
		Map<String, List<IpVO>> map = new HashMap<String, List<IpVO>>();		
		
		while(iterator.hasNext()){
			String tc_seq_multi = iterator.next();
			int numInt = Integer.parseInt(tc_seq_multi);
			
			IpVO multi = new IpVO();
			multi.setId(numInt);
			resultList.add(multi);
		}
		map.put("list", resultList);
		result = ipService.deleteIpMulti(map);
		
		return result;

}
	
	@RequestMapping(value = "/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult ipLimitList(@RequestBody IpVO vo) {
		log.info("POST : " + vo);
		return ipService.ipLimitList(vo);
	}		

}
