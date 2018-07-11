package com.yescnc.jarvis.codeManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface CodeManagerService {
	public List<IdcCodeVO> getCodeLIst();
	
	public Integer insertCode(HashMap map);
	
	public Integer deleteCode(Map paramMap);
	
	public Integer updateCode(HashMap map);
}
