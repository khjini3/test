package com.yescnc.core.widget.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.widget.CustomWidgetDao;
import com.yescnc.core.entity.db.CustomWidgetVO;

@Service
public class CustomWidgetServiceImpl implements CustomWidgetService {
	@Autowired
	CustomWidgetDao customWidgetDao;
	
	@Override
	public List<CustomWidgetVO> selectCustomWidgetList() {
		// TODO Auto-generated method stub
		return customWidgetDao.selectCustomWidgetList();
	}
}
