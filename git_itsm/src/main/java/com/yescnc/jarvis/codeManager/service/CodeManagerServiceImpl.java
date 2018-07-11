package com.yescnc.jarvis.codeManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.yescnc.jarvis.db.codeManager.CodeManagerDao;
import com.yescnc.jarvis.entity.db.IdcCodeVO;

@Service
public class CodeManagerServiceImpl implements CodeManagerService {
	
	@Autowired
	CodeManagerDao codeManagerDao;
	
	@Override
	public List<IdcCodeVO> getCodeLIst() {
		List<IdcCodeVO> result = codeManagerDao.getCodeList();
		
		return result;
	}

	@Override
	public Integer insertCode(HashMap map) {
		return codeManagerDao.insertCode(map);
	}

	@Override
	public Integer deleteCode(Map map) {
		return codeManagerDao.deleteCode(map);
	}

	@Override
	public Integer updateCode(HashMap map) {
		return codeManagerDao.updateCode(map);
	}


}
