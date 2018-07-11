package com.yescnc.core.menu.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.MenuManagerVO;
import com.yescnc.core.entity.db.MenuTreeVO;
import com.yescnc.core.entity.db.MenuVO;
import com.yescnc.core.entity.db.UserVO;

public interface MenuService {
	
	public HashMap<String, Object> selectMenuTree(UserVO user);
	
	public Integer updateMenu(HashMap map);
	
//	public Integer insertMenu(MenuVO vo);
	
	public Integer insertMenu(HashMap map);
	
	public Integer deleteMenu(Map map);

	public Map<String, Object> getMenuStatus(String groupId);
	
}
