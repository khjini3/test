package com.yescnc.core.widget.service;

import com.yescnc.core.entity.db.PanelVO;
import com.yescnc.core.entity.db.WidgetDataVO;
import com.yescnc.core.util.json.JsonResult;

public interface PanelService {
	public int insertPanel(PanelVO vo);
	
	public WidgetDataVO selectPanel(PanelVO vo);
	
	public JsonResult selectPanelList(String groupId);
	
	public int updateByPanelId(PanelVO vo);
	
	public int deleteByPanelId(PanelVO vo);

}
