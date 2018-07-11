package com.yescnc.core.menu.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.MenuTreeVO;
import com.yescnc.core.entity.db.MenuVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.core.menu.Service.MenuService;

@RequestMapping(value="/menu")
@RestController
public class MenuController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(MenuController.class);
	
	@Autowired
	MenuService menuService;
	
	@RequestMapping(method=RequestMethod.GET)
	public HashMap<String, Object> selectMenuList(HttpServletRequest req) {
		
		HttpSession session = req.getSession(false);
		Object account = session.getAttribute("userVO");
		
		if(null != account && account instanceof UserVO ){
			return menuService.selectMenuTree(UserVO.class.cast(account));
		}else{
			return menuService.selectMenuTree(null);
		}
	}
	
	@RequestMapping(value="/{id}",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public MenuVO selectMenu(MenuVO vo) {
		return null;
	}
	
	/*@RequestMapping(value="/insertMenu", method=RequestMethod.POST)
	public Integer insertMenu(@RequestBody MenuVO vo) {
		return menuService.insertMenu(vo);
	}*/
	
	@RequestMapping(value="/insertMenu", method=RequestMethod.POST)
	public Integer insertMenu(@RequestBody HashMap map) {
		return menuService.insertMenu(map);
	}
	
	@RequestMapping(value = "/{cmd}",method=RequestMethod.POST)
	public Integer updateMenu(@PathVariable("cmd") String cmd, @RequestBody HashMap map) {
		return menuService.updateMenu(map);
	}
	
	@RequestMapping(value = "/deleteMenu/{seq}", method=RequestMethod.DELETE)
	public Integer deleteMenu(@PathVariable("seq") String id) {
		String[] menuIdArr = id.split("_");
		List list = new ArrayList();
		
		for(int i=0; i<menuIdArr.length; i++){
			String subId = menuIdArr[i];
			Map subMap = new HashMap();
			subMap.put("id", subId);
			list.add(subId);
		}
		
		Map paramMap = new HashMap();
		paramMap.put("param", list);
		
		int result = menuService.deleteMenu(paramMap);
		return result;
	}
	
	@RequestMapping(value = "/getMenuStatus", method=RequestMethod.GET)
	public Map<String, Object> getMenuStatus(){
		Map<String, Object> result = menuService.getMenuStatus(null);
		return result;
	}
	
	@RequestMapping(value = "/getMenuStatus/{groupId}", method=RequestMethod.GET)
	public Map<String, Object> getUseYNMenuStatus(@PathVariable("groupId") String groupId){
		Map<String, Object> result = menuService.getMenuStatus(groupId);
		return result;
	}
}
