package com.yescnc.jarvis.db.codeManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;

public interface CodeManagerDao {
	public List<IdcCodeVO> getCodeList();
	
	public Integer insertCode(HashMap map);
	
	public Integer deleteCode(Map map);
	
	public Integer updateCode(HashMap map);
}
