package com.yescnc.jarvis.assetHistory.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.jarvis.db.assetHistory.AssetHistoryDao;

@Service
public class AssetHistoryServiceImpl implements AssetHistoryService{

	@Autowired
	UserDao userDao;
	
	@Autowired
	AssetHistoryDao assetHistoryDao;
	
	@Override
	public ArrayList<HashMap<String, Object>> searchHistory(Map<String, Object> param){
		return assetHistoryDao.searchHistory(param);
	}
	
	@Override
	public List<UserVO> getUserList(){
		return userDao.returnUserIdList();
	}

	@Override
	public Integer getRowCount() {
		return assetHistoryDao.getRowCount();
	}
	
}
