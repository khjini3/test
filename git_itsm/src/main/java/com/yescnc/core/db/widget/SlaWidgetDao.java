package com.yescnc.core.db.widget;

import java.util.List;

import com.yescnc.core.entity.db.SlaWidgetVO;

public interface SlaWidgetDao {
	public List<SlaWidgetVO> selectSlaWidgetList();
}
