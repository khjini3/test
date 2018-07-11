package com.yescnc.core.db.menu;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yescnc.core.db.role.RoleMapper;
import com.yescnc.core.entity.db.MenuManagerVO;
import com.yescnc.core.entity.db.MenuTreeVO;
import com.yescnc.core.entity.db.MenuVO;
import com.yescnc.jarvis.codeManager.controller.CodeManagerController;
import com.yescnc.jarvis.entity.db.LocationVO;
import com.yescnc.jarvis.util.tree.IdcTree;

@Repository
public class MenuDaoImpl implements MenuDao {
	private org.slf4j.Logger log = LoggerFactory.getLogger(CodeManagerController.class);
	
	@Autowired
	private SqlSession sqlSession;
	
	/*@Override
	public Integer insertMenu(MenuVO menu) {
		// TODO Auto-generated method stub
		int result = 100;
		try {
			sqlSession.getMapper(MenuMapper.class).insertMenu(menu);
		} catch (Exception e){
			e.printStackTrace();
			result = -100;
		}
		return result;
	}*/
	
	@Override
	public Integer insertMenu(HashMap map) {
		// TODO Auto-generated method stub
		int result = 100;
		HashMap<String, Object> menuInfo = new HashMap<String, Object>();
		menuInfo =  (HashMap<String, Object>) map.get("menuInfo");
		
		ObjectMapper mapper = new ObjectMapper();
		MenuVO menu = mapper.convertValue(menuInfo, new TypeReference<MenuVO>() {});
		
		try {
			sqlSession.getMapper(MenuMapper.class).insertMenu(menu);
		} catch (Exception e){
			e.printStackTrace();
			result = -100;
		}
		return result;
	}

	@Override
	public List<MenuVO> listMenu() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(MenuMapper.class).selectMenu(null);
	}
	
	@Override
	public List<MenuVO> selectMenu(MenuVO menu) {
		// TODO Auto-generated method stub
		//Preconditions.checkNotNull(menu);
		return sqlSession.getMapper(MenuMapper.class).selectMenu(menu);
	}

	@Override
	public int updateByMenuId(MenuVO menu) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(MenuMapper.class).updateByMenuId(menu);
	}

	@Override
	public int deleteByMenuId(MenuVO menu) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(MenuMapper.class).deleteByMenuId(menu);
	}

	@Override
	public List<MenuTreeVO> listMenuTree() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(MenuMapper.class).listMenuTree();
	}

	
	@Override
	public Integer deleteMenu(Map map){
		int result = 100;
		log.debug("=================IMPL map Param ========= "+map);
		try{
			sqlSession.getMapper(MenuMapper.class).deleteMenu(map);
		} catch (Exception e){
			e.printStackTrace();
			result = -100;
		}
		return result;
	}
	
	@Override
	public Integer updateMenu(HashMap map){
		int result = 100;
		try {
			sqlSession.getMapper(MenuMapper.class).updateMenu(map);
			sqlSession.getMapper(RoleMapper.class).updateStartPage(map);
		} catch (Exception e){
			e.printStackTrace();
			result = -100;
		}
		return result;
	}
	
	@Override
	public Map<String, Object> getMenuStatus(String groupId) {
		// TODO Auto-generated method stub
		Map<String, Object> allData = new HashMap<String,Object>();
		List<MenuManagerVO> result = new ArrayList<MenuManagerVO>();
		if(groupId == null){
			result = sqlSession.getMapper(MenuMapper.class).getMenuStatus();
		}else{
			result = sqlSession.getMapper(MenuMapper.class).getUseYNMenuStatus(groupId);
		}
		
		MenuManagerVO rootVo = new MenuManagerVO();
		
		rootVo.setId("-1");
		rootVo.setText("root");
		rootVo.setMenuId(-1);
		rootVo.setParent(-1);
		rootVo.setMenuName("root");
		rootVo.setUrl(null);
		rootVo.setPrivilegeId(-1);
		rootVo.setSortOrder(-1);
		rootVo.setDescription("root");
		rootVo.setUsingMenu(1);
		
		IdcTree idcTree = new IdcTree();
		Map<String, MenuManagerVO> treeMapData = new HashMap<String, MenuManagerVO>();
		
		String checkBoxTagFront = "<input id='menuTreeCheckbox' class='menu-tree-checkbox check-x' name='menuTreeCheckbox' type='checkbox'";
		String checkBoxTagEnd = "/>"; // yypark
		
		treeMapData.put("-1",  rootVo);
		for(MenuManagerVO vo1 : result){
			vo1.setId(vo1.getMenuId().toString());
			String result1 = checkBoxTagFront + "rowNum='" + vo1.getId() + "'"+ checkBoxTagEnd;
			String resultTxt = result1.concat(vo1.getMenuName()); // yypark
			vo1.setText(resultTxt);
//			vo1.setText(vo1.getMenuName());
			if(vo1.getParent() == -1){
//				vo1.setImg("fa icon-folder");
				vo1.setExpanded(true);
				if(vo1.getUrl() != null){
//					vo1.setImg("far fa-file-alt");
				}
			}else{
				vo1.setExpanded(true);
//				vo1.setImg("far fa-file-alt");
			}
			treeMapData.put(vo1.getMenuId().toString(), vo1);
		}
		
		for(MenuManagerVO vo2 : result){
			MenuManagerVO parentVO = treeMapData.get(vo2.getParent().toString());
			MenuManagerVO currentVO = treeMapData.get(vo2.getMenuId().toString());
			
			if(parentVO != null){
				idcTree.add(parentVO, currentVO);
			}
		}
		allData.put("treeData", rootVo);
		allData.put("allData", result);
		
		return allData;
	}

	@Override
	public List<MenuTreeVO> groupCompMenuList(String group_id) {
		return sqlSession.getMapper(MenuMapper.class).groupCompMenuList(group_id);
	}

	@Override
	public ArrayList<HashMap<String, Object>> getStartPage(String group_id) {
		return sqlSession.getMapper(MenuMapper.class).getStartPage(group_id);
	}
}
