package com.yescnc.core.db.menu;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.MenuManagerVO;
import com.yescnc.core.entity.db.MenuTreeVO;
import com.yescnc.core.entity.db.MenuVO;

public interface MenuMapper {

	Integer insertMenu(MenuVO menu);

	List<MenuVO> selectMenu(MenuVO menu);

	int updateByMenuId(MenuVO menu);

	int deleteByMenuId(MenuVO menu);
	
	List<MenuTreeVO> listMenuTree();
	
	void updateMenu(HashMap map);
	
	public List<MenuManagerVO> getMenuStatus();
	
	void deleteMenu(Map map);
	
	List<MenuTreeVO> groupCompMenuList(String group_id);
	
	ArrayList<HashMap<String, Object>> getStartPage(String group_id);

	List<MenuManagerVO> getUseYNMenuStatus(String groupId);
	
}