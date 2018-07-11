package com.yescnc.jarvis.symbolManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.symbolManager.SymbolManagerDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;

@Service
public class SymbolManagerServiceImpl implements SymbolManagerService{
	
	@Autowired
	SymbolManagerDao symbolManagerDao;
	
	@Override
	public Integer addSymbol(HashMap map) {
		return symbolManagerDao.addSymbol(map);
	}
	
	@Override
	public List<AssetInfoVO> getAssetList(String id){
		List<AssetInfoVO> result = symbolManagerDao.getAssetList(id);
		return result;
	}

	@Override
	public List getSymbolList(String id) {
		return symbolManagerDao.getSymbolList(id);
	}
	
	@Override
	public Integer updateSymbolList(HashMap<String, Object> param) {
		return symbolManagerDao.updateSymbolList(param);
	}
	
	@Override
	public Integer deleteSymbol(Map<String, Object> param){
		return symbolManagerDao.deleteSymbol(param);
	}
	
	@Override
	public Integer modifySymbol(HashMap<String, Object> param) {
		return symbolManagerDao.modifySymbol(param);
	}

}
