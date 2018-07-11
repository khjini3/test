package com.yescnc.core.menu.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.yescnc.core.db.menu.MenuDao;
import com.yescnc.core.entity.db.MenuManagerVO;
import com.yescnc.core.entity.db.MenuTreeVO;
import com.yescnc.core.entity.db.MenuVO;
import com.yescnc.core.entity.db.UserVO;

@Service
public class MenuServiceImpl implements MenuService {

	private static final Logger logger = LoggerFactory.getLogger(MenuServiceImpl.class);

	@Autowired
	MenuDao menuDao;

	@Override
	public HashMap<String, Object> selectMenuTree(UserVO user) {
		
		List<MenuTreeVO> groupCompMenus = menuDao.groupCompMenuList(user.getGroup_id()); // "그룹에 할당된 메뉴 리스트" yypark
		HashMap<String, Object> result = new HashMap<String, Object>();
		ArrayList<HashMap<String, Object>> startPage = menuDao.getStartPage(user.getGroup_id());
		ArrayList<String> menuList = new ArrayList<String>(); // "사용자에게 보여질 메뉴 리스트"
		
//		List<MenuTreeVO> groupCompMenus = menuDao.listMenuTree(); // 기존 방식
		List<MenuTreeVO> tree = Lists.newArrayList();
		
		result.put("startPage", startPage);
		for (MenuTreeVO topMenu : groupCompMenus) {
			if (topMenu.getParent() == -1) {
				discoveryMenu(topMenu, groupCompMenus, user);
				/*
				List<MenuTreeVO> sub = menus.stream().filter(x -> x.getParent().equals(topMenu.getMenuId())).collect(Collectors.toList());
				if(null != sub){
					for(MenuTreeVO item : sub){
						List<MenuTreeVO> items = menus.stream().filter(x -> x.getParent().equals(item.getMenuId())).collect(Collectors.toList());
						if(null != items){
							item.setChild(items);
						}
					}
					topMenu.setChild(sub);
				}
				*/

				if (topMenu.getChild().isEmpty()) {
					if (checkRoleMenu(topMenu, user)) {
						tree.add(topMenu);
						menuList.add(topMenu.getMenuName());
					}
				} else {
					tree.add(topMenu);
					menuList.add(topMenu.getMenuName());
				}
			}else{
				if (checkRoleMenu(topMenu, user)) {
					menuList.add(topMenu.getMenuName());
				}
			}
		}
		result.put("menuList", menuList);
		result.put("tree", tree);
		return result;
	}

	@Override
	public Map<String, Object> getMenuStatus(String groupId){
		Map<String, Object> result = menuDao.getMenuStatus(groupId);
		return result;
	}
	
	/*@Override
	public Integer insertMenu(MenuVO vo){
		return menuDao.insertMenu(vo);
	}*/
	
	@Override
	public Integer insertMenu(HashMap map){
		return menuDao.insertMenu(map);
	}
	
	@Override
	public Integer deleteMenu(Map map){
		return menuDao.deleteMenu(map);
	}
	
	@Override
	public Integer updateMenu(HashMap map){
		return menuDao.updateMenu(map);
	}
	
	private void discoveryMenu(MenuTreeVO parent, List<MenuTreeVO> list, UserVO user) {
		if (null == parent) {
			return;
		}

		List<MenuTreeVO> subTree = Lists.newArrayList();
		List<MenuTreeVO> sub = list.stream().filter(x -> x.getParent().equals(parent.getMenuId())).collect(Collectors.toList());

		if (null != sub && !sub.isEmpty()) {
			for (MenuTreeVO subMenu : sub) {
				List<MenuTreeVO> subChild = list.stream().filter(x -> x.getParent().equals(subMenu.getMenuId())).collect(Collectors.toList());
				if (null != subChild && !subChild.isEmpty()) {
					discoveryMenu(subMenu, list, user);
					if (checkRoleMenu(subMenu, user)) {
						subTree.add(subMenu);
					}
				} else {
					if (checkRoleMenu(subMenu, user)) {
						subTree.add(subMenu);
					}
				}
			}
			parent.setChild(subTree);
		}
	}

	private boolean checkRoleMenu(MenuTreeVO menuVo, UserVO user) {
		logger.debug(menuVo.toString());
		boolean result = false;

		if (user.getPrivilegeId() == 0) {
			if (menuVo.getPrivilegeId().equals(user.getPrivilegeId()) || menuVo.getMenuId() == 18) {
				result = true;
			}
		} else if (user.getPrivilegeId() >= 1) {
			if (menuVo.getPrivilegeId().compareTo(user.getPrivilegeId()) >= 0) {
				result = true;
			}
		} else {
			logger.debug("user.getPrivilegeId() is null");
		}

		logger.debug("menu :{}, result :{}", menuVo.toString(), result);
		return result;
	}
}
