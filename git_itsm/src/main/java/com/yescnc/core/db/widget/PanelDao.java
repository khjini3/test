package com.yescnc.core.db.widget;

import java.util.List;

import com.yescnc.core.entity.db.PanelVO;

public interface PanelDao {

	public int insertPanel(PanelVO vo);
	
	public PanelVO selectPanel(PanelVO vo);
	
	public List<PanelVO> selectPanelList(String groupId);
	
	public int updateByPanelId(PanelVO vo);
	
	public int deleteByPanelId(PanelVO vo);

	public List<PanelVO> selectPanelListAll();
}
