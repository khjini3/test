package com.yescnc.core.db.menu;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.MenuManagerVO;
import com.yescnc.core.entity.db.MenuTreeVO;
import com.yescnc.core.entity.db.MenuVO;

public interface MenuDao {

//	Integer insertMenu(MenuVO menu);

	List<MenuVO> listMenu();

	List<MenuVO> selectMenu(MenuVO menu);

	int updateByMenuId(MenuVO menu);

	int deleteByMenuId(MenuVO menu);
	
	List<MenuTreeVO> listMenuTree();
	
	Integer updateMenu(HashMap map);
	
	public Map<String, Object> getMenuStatus(String groupId);
	
	Integer deleteMenu(Map map);
	
	List<MenuTreeVO> groupCompMenuList(String group_id);
	
	ArrayList<HashMap<String, Object>>getStartPage(String group_id);

	Integer insertMenu(HashMap map);

}
