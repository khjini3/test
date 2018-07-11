package com.yescnc.jarvis.db.mapEditor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.MapVO;
import com.yescnc.jarvis.entity.db.SymbolVO;
import com.yescnc.jarvis.util.tree.IdcTree;

@Repository
public class MapEditorDaoImpl implements MapEditorDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public Map<String, List<SymbolVO>> getMapData(MapVO mapVo) {
		Map<String, List<SymbolVO>> param = new HashMap<String, List<SymbolVO>>();
		List<SymbolVO> result = sqlSession.getMapper(MapEditorMapper.class).getMapData(mapVo.getMapId());
		
		param.put("useList", result);
		
		List<SymbolVO> mapList = new ArrayList<SymbolVO>();
		
		if(result.size() > 0){
			SymbolVO rootVO = new SymbolVO();
			rootVO.setId("root");
			rootVO.setText("root");
			rootVO.setParentId(null);

			IdcTree tree = new IdcTree();
			
			Map<String, SymbolVO> treeMapData = new HashMap<String, SymbolVO>();
			
			treeMapData.put("root", rootVO);
			
			for(SymbolVO vo1 : result){
				vo1.setId(vo1.getAssetId().toString());
				vo1.setText(vo1.getAssetName().toString());
				
				treeMapData.put(vo1.getCompId().toString(), vo1);
			}
			
			for(SymbolVO vo2 : result){
				SymbolVO parentVO = null;
				if(vo2.getParentId().equals(mapVo.getMapId())){
					parentVO = treeMapData.get(vo2.getParentId().toString());
				}else{
					parentVO = treeMapData.get(mapVo.getMapId() +"_"+ vo2.getParentId().toString());
				}
				
				SymbolVO currentVO = treeMapData.get(vo2.getCompId().toString());
				
				if(parentVO == null){
					parentVO = new SymbolVO();
					parentVO.setId(vo2.getParentId().toString());
					parentVO.setText(vo2.getParentId().toString());
					parentVO.setParentId("root");
					treeMapData.put(parentVO.getId(), parentVO);
					
					SymbolVO parentRootVo = treeMapData.get("root");
					tree.add(parentRootVo, parentVO); //root 와  Map id 간의 상관관계를 설정
				}
				
				if(parentVO != null){
					tree.add(parentVO, currentVO);
				}
				
				if(currentVO.getParentId().toString().equals(mapVo.getCurrentPosition())){
					mapList.add(currentVO);
				}
			}
		}
		
		param.put("currentList", mapList);
		
		return param;
	}

	@Override
	public List<IdcCodeVO> getMapList() {
		List<IdcCodeVO> result = sqlSession.getMapper(MapEditorMapper.class).getMapList();
		
		for (IdcCodeVO code : result){
			switch(code.getName()){
				case "SERVER" :
					code.setIcon("fab fa-yes-server");
					break;
				case "SWITCH" :
					code.setIcon("fab fa-yes-switch");
					break;
				case "RACK" :
					code.setIcon("fab fa-yes-rack");
					break;
				default :
					code.setIcon("fas fa-cubes");
					break;
			}
			//첫글자 대문자로
			String codeName = Character.toUpperCase(code.getName().charAt(0)) +  code.getName().substring(1).toLowerCase();
			code.setText(codeName);
			List<IdcCodeVO> temp = new ArrayList<IdcCodeVO>();
			code.setNodes(temp);
		}
		
		IdcCodeVO groupVO = new IdcCodeVO();
		groupVO.setId("10");
		groupVO.setName("Group");
		groupVO.setText("Group");
		groupVO.setIcon("fab fa-yes-group");
		groupVO.setDraggable(true);
		List<IdcCodeVO> groupList = new ArrayList<IdcCodeVO>();
		groupVO.setNodes(groupList);
		
		IdcCodeVO saveVO = new IdcCodeVO();
		saveVO.setId("20");
		saveVO.setName("Save");
		saveVO.setText("Save");
		saveVO.setIcon("fas fa-save");
		saveVO.setIconType("EditorIcon");
		List<IdcCodeVO> saveList = new ArrayList<IdcCodeVO>();
		saveVO.setNodes(saveList);
		
		IdcCodeVO deleteVO = new IdcCodeVO();
		deleteVO.setId("30");
		deleteVO.setName("Clear");
		deleteVO.setText("Clear");
		deleteVO.setIcon("fas fa-trash-alt");
		deleteVO.setIconType("EditorIcon");
		List<IdcCodeVO> deleteList = new ArrayList<IdcCodeVO>();
		deleteVO.setNodes(deleteList);
		
		IdcCodeVO confVO = new IdcCodeVO();
		confVO.setId("40");
		confVO.setName("Properties");
		confVO.setText("Properties");
		confVO.setIcon("fas fa-cogs");
		confVO.setIconType("EditorIcon");
		List<IdcCodeVO> confList = new ArrayList<IdcCodeVO>();
		confVO.setNodes(confList);
		
		IdcCodeVO alignVo = new IdcCodeVO();
		alignVo.setId("50");
		alignVo.setName("Align");
		alignVo.setText("Align");
		alignVo.setIcon("fab fa-yes-align");
		alignVo.setIconType("EditorIcon");
		List<IdcCodeVO> alignList = new ArrayList<IdcCodeVO>();
		alignVo.setNodes(alignList);
		
		IdcCodeVO exitVO = new IdcCodeVO();
		exitVO.setId("60");
		exitVO.setName("Exit");
		exitVO.setText("Exit");
		exitVO.setIcon("fas fa-sign-out-alt");
		exitVO.setIconType("EditorIcon");
		List<IdcCodeVO> exitList = new ArrayList<IdcCodeVO>();
		exitVO.setNodes(exitList);
		
		result.add(groupVO);
		result.add(saveVO);
		result.add(deleteVO);
		result.add(confVO);
		result.add(alignVo);
		result.add(exitVO);
		
		return result;
	}

	@Override
	public List<AssetInfoVO> getAssetList(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(MapEditorMapper.class).getAssetList(id);
		
		for(AssetInfoVO asset : result){
			asset.setIcon("fas fa-cube fa-lg");
			asset.setText(asset.getAssetName());
			asset.setId(asset.getAssetId());
		}
		
		return result;
	}

	@Override
	public int setSaveEditor(SymbolVO symbol) {
		int result = 0;
		
		try {
			result = 100;
			sqlSession.getMapper(MapEditorMapper.class).setSaveEditor(symbol);
			
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

	@Override
	public int setDeleteEditor(Map<String, List<SymbolVO>> param) {
		int result = 0;
		try {
			result = 100;
			sqlSession.getMapper(MapEditorMapper.class).setDeleteEditor(param);
		} catch (Exception e) {
			result = -100;
		}
		return 0;
	}

	@Override
	public List<IdcCodeVO> getMapListType() {
		List<IdcCodeVO> result = sqlSession.getMapper(MapEditorMapper.class).getMapListType();
		return result;
	}

	@Override
	public List<SymbolVO> getAvailableList(Map param) {
		return sqlSession.getMapper(MapEditorMapper.class).getAvailableList(param);
	}

	@Override
	public List<SymbolVO> getUseList(String mapId) {
		return sqlSession.getMapper(MapEditorMapper.class).getUseList(mapId);
	}

	@Override
	public int deleteAllData(String mapId) {
		int result = 100;
		
		try {
			sqlSession.getMapper(MapEditorMapper.class).deleteAllData(mapId);
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}

	@Override
	public int insertAllData(SymbolVO symbol) {
		int result = 100;
		
		try {
			sqlSession.getMapper(MapEditorMapper.class).insertAllData(symbol);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

	@Override
	public List<MapVO> getMapInfo(Map<String, List<MapVO>> mapInfo) {
		return sqlSession.getMapper(MapEditorMapper.class).getMapInfo(mapInfo);
	}

	@Override
	public int setSaveMapInfo(ArrayList<MapVO> mapList) {
		int result = 100;
		for(MapVO mapVo : mapList){
			try {
				if(result == -100) break;
				sqlSession.getMapper(MapEditorMapper.class).setSaveMapInfo(mapVo);
			} catch (Exception e) {
				result = -100;
			}
		}
		return 0;
	}

}
