package com.yescnc.core.widget.controller;

import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.PanelVO;
import com.yescnc.core.entity.db.WidgetDataVO;
import com.yescnc.core.util.json.JacksonParsing;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.widget.service.PanelCache;
import com.yescnc.core.widget.service.PanelService;

@RequestMapping("/dashboard/panels")
@RestController
public class PanelController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(PanelController.class);
	
	@Autowired
	private PanelService panelService;
	
	@Autowired
	PanelCache cache;
	
	@RequestMapping(value = "/index/{groupId}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public Integer getPanelIndex(@PathVariable("groupId") String groupId) {
		log.info("cache : "+cache.getIndex(groupId));
		return cache.getIndex(groupId);
	}
	
	@RequestMapping(value = "/{groupId}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public JsonResult selectPanelList(@PathVariable("groupId") String groupId) {
		JsonResult result = panelService.selectPanelList(groupId);
		result.setData("index", getPanelIndex(groupId));
		return result;
	}
	
	@RequestMapping(value = "/{groupId}/{panelId}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public WidgetDataVO selectPanel(@PathVariable("groupId") String groupId, @PathVariable("panelId") Integer id) {
		PanelVO vo = new PanelVO();
		vo.setGroupId(groupId);
		vo.setId(id);
		return panelService.selectPanel(vo);
	}
	
	@RequestMapping(method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public int insertWidgetList(@RequestBody Map<String, Object> body) {
		log.info("POST: "+body);
		PanelVO vo = new PanelVO();
		vo.setUserId(Integer.parseInt((String) body.get("userId")));
		vo.setGroupId((String) body.get("groupId"));
		vo.setPanelName((String) body.get("panelName"));
		vo.setWidgetData(JacksonParsing.toString(body));
		
		return panelService.insertPanel(vo);
	}
	
	@RequestMapping(value = "/{groupId}/{panelId}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public void updateWidget(@PathVariable("panelId") Integer id, @RequestBody Map<String, Object> body) {
		PanelVO vo = new PanelVO();
		vo.setId(id);
		vo.setUserId(Integer.parseInt((String) body.get("userId")));
		vo.setPanelName((String) body.get("panelName"));
		vo.setWidgetData(JacksonParsing.toString(body));

		panelService.updateByPanelId(vo);
	}
		
	@RequestMapping(value = "/{groupId}/{panelId}",method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public int deleteWidget(@PathVariable("panelId") Integer id) {
		log.info("DELETE:"+id);
		PanelVO vo = new PanelVO();
		vo.setId(id);
		return panelService.deleteByPanelId(vo);
	}
}
