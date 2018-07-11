package com.yescnc.core.widget.service;

import java.util.List;

import com.yescnc.core.entity.db.SlaWidgetVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface SlaWidgetService {

	List<SlaWidgetVO> selectSlaWidgetList();

	JsonPagingResult readSlaCategoryXML();
}
