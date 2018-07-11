package com.yescnc.core.widget.service;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("panelCache")
@Scope("singleton")
public class PanelCache {
//private static final Logger logger = LoggerFactory.getLogger(PanelCache.class);
	
	private static HashMap<String, Integer> PANEL_INDEX = new HashMap<String, Integer>();
	
	public void setIndex(String groupId, Integer panelId) {
		PANEL_INDEX.put(groupId, panelId);
	}
	
	public Integer getIndex(String groupId) {
		return PANEL_INDEX.get(groupId);
	}
	
}
