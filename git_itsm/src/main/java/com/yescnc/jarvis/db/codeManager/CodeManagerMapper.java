package com.yescnc.jarvis.db.codeManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface CodeManagerMapper {
	public List<IdcCodeVO> getCodeList();
	
	public void insertCode(HashMap map);
	
	public void deleteCode(Map map);
	
	public void updateCode(HashMap map);
}
