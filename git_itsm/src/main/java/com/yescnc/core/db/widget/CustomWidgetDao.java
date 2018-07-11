package com.yescnc.core.db.widget;

import java.util.List;

import com.yescnc.core.entity.db.CustomWidgetVO;

public interface CustomWidgetDao {
	public List<CustomWidgetVO> selectCustomWidgetList();
}
