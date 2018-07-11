package com.yescnc.jarvis.codeManager.controller;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
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

import com.yescnc.jarvis.codeManager.service.CodeManagerService;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

@RequestMapping("/codeManager")
@RestController
public class CodeManagerController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(CodeManagerController.class);
	
	@Autowired
	CodeManagerService codeManagerService;
	
	@RequestMapping(value="/{cmd}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcCodeVO> selectDataInfo(@PathVariable("cmd") String cmd){
		
		List<IdcCodeVO> result = new ArrayList();
		
		switch(cmd){
			case "getCodeList":
				result = codeManagerService.getCodeLIst();
				break;
		}
		
		return result;
	}
	
	@RequestMapping(value = "/{cmd}/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer insertCode(@PathVariable("cmd") String cmd, @PathVariable("seq") String id, @RequestBody HashMap map) {
		return codeManagerService.insertCode(map);
	}
	
	@RequestMapping(value = "/{cmd}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateCode(@PathVariable("cmd") String cmd,  @RequestBody HashMap map) {
		return codeManagerService.updateCode(map);
	}
	
	@RequestMapping(value = "/{cmd}/{seq}",method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteCode(@PathVariable("cmd") String cmd, @PathVariable("seq") String id) {
		
		String[] codeArr = id.split("_");
		
		List list = new ArrayList();
		
		for(int i=0; i < codeArr.length; i++){
			String subId = codeArr[i];
			Map subMap = new HashMap();
			subMap.put("id", subId);
			list.add(subMap);
		}
		
		Map paramMap = new HashMap();
		
		paramMap.put("param", list);
		
		int result = codeManagerService.deleteCode(paramMap);
		
		return result;
	}
	
}
