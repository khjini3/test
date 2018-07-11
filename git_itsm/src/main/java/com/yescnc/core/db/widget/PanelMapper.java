package com.yescnc.core.db.widget;

import java.util.List;

import com.yescnc.core.entity.db.PanelVO;

public interface PanelMapper {
	int insertPanel(PanelVO vo);
	
	PanelVO selectPanel(PanelVO vo);
	
	List<PanelVO> selectPanelList(String groupId);
	
	List<PanelVO> selectPanelListAll();
	
	int updateByPanelId(PanelVO vo);
	
	int deleteByPanelId(PanelVO vo);
	
}
