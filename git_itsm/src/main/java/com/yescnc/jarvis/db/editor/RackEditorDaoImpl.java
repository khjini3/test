package com.yescnc.jarvis.db.editor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.LocationVO;
import com.yescnc.jarvis.util.tree.IdcTree;

@Repository
public class RackEditorDaoImpl implements RackEditorDao {

	@Autowired
	private SqlSession sqlSession;

	@Override
	public LocationVO getLocationList() {
		List<LocationVO> result = sqlSession.getMapper(RackEditorMapper.class).getLocationList();
		
		LocationVO rootVo = new LocationVO();
		
		rootVo.setCodeId("root");
		rootVo.setCodeName("loc");
		rootVo.setParentId(null);
		rootVo.setLocName("root");
		rootVo.setText("root");
		rootVo.setLocId("-1");
		rootVo.setId("-1");
		
		IdcTree idcTree = new IdcTree();
		
		Map<String, LocationVO> treeMapData = new HashMap<String, LocationVO>();
		
		treeMapData.put("-1", rootVo);
		
		for(LocationVO vo1 : result){
			vo1.setId(vo1.getLocId().toString());
			vo1.setText(vo1.getLocName());
			vo1.setIcon("far fa-map fa-lg");
			
			treeMapData.put(vo1.getLocId().toString(), vo1);
		}
		
		for(LocationVO vo2 : result){
			LocationVO parentVO = treeMapData.get(vo2.getParentId().toString());
			LocationVO currentVO = treeMapData.get(vo2.getLocId().toString());
			
			if(parentVO != null){
				idcTree.add(parentVO, currentVO);
			}
		}
		
		return rootVo;
	}

	@Override
	public LocationVO getSelectLocationList(String parentId) {
		List<LocationVO> result = sqlSession.getMapper(RackEditorMapper.class).getSelectLocationList();
		
		LocationVO rootVo = new LocationVO();
		
		rootVo.setCodeId("root");
		rootVo.setCodeName("loc");
		rootVo.setParentId(null);
		rootVo.setLocName("root");
		rootVo.setText("root");
		rootVo.setLocId("-1");
		rootVo.setId("-1");
		
		IdcTree idcTree = new IdcTree();
		
		Map<String, LocationVO> treeMapData = new HashMap<String, LocationVO>();
		
		treeMapData.put("-1", rootVo);
		
		for(LocationVO vo1 : result){
			vo1.setId(vo1.getLocId().toString());
			vo1.setText(vo1.getLocName());
			
			switch(vo1.getCodeName()){
				case "SITE":
					vo1.setIcon("far fa-map fa-lg");
					break;
				case "BUILDING":
					vo1.setIcon("far fa-building fa-lg");
					break;
				case "FLOOR":
					vo1.setIcon("fas fa-align-justify fa-lg");
					break;
				case "ROOM":
					vo1.setIcon("fab fa-gg fa-lg");
					break;
				default : 
					vo1.setIcon("fas fa-cube fa-lg");
					break;
			}
			
			treeMapData.put(vo1.getLocId().toString(), vo1);
		}
		
		for(LocationVO vo2 : result){
			try {
				LocationVO parentVO = treeMapData.get(vo2.getParentId().toString());
				LocationVO currentVO = treeMapData.get(vo2.getLocId().toString());
				
				idcTree.add(parentVO, currentVO);
				
			} catch (Exception e) {
				System.out.println("############ "+ vo2.getId() );
			}
			
		}
		
		return rootVo;
	}

	@Override
	public List<AssetInfoVO> getRackInList(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(RackEditorMapper.class).getRackInList(id);
		return result;
	}

	@Override
	public List<AssetInfoVO> getAvailableAssetList() {
		List<AssetInfoVO> result = sqlSession.getMapper(RackEditorMapper.class).getAvailableAssetList();
		return result;
	}

	@Override
	public List<AssetInfoVO> getRackInfo(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(RackEditorMapper.class).getRackInfo(id);
		return result;
	}

	@Override
	public Integer updateServerInList(HashMap map) {
		Integer status = 100;
		
		try {
			sqlSession.getMapper(RackEditorMapper.class).updateServerInList(map);
		} catch (Exception e) {
			status = -100;
		}
		
		return status;
	}

	@Override
	public Integer updateServerOutList(HashMap map) {
		Integer status = 100;
		
		try {
			sqlSession.getMapper(RackEditorMapper.class).updateServerOutList(map);
		} catch (Exception e) {
			status = -100;
		}
		
		return status;
	}

	@Override
	public Integer updateRackInfo(HashMap map) {
		
		Integer status = 100;
		
		try {
			sqlSession.getMapper(RackEditorMapper.class).updateRackInfo(map);
		} catch (Exception e) {
			status = -100;
		}
		
		return status;
	}

	@Override
	public Integer updateServerInfo(HashMap map) {
		
		Integer status = 100;
		
		try {
			sqlSession.getMapper(RackEditorMapper.class).updateServerInfo(map);
		} catch (Exception e) {
			status = -100;
		}
		
		return status;
	}

	@Override
	public Integer updateUnitSize(HashMap map) {
		Integer status = 100;
		
		try {
			sqlSession.getMapper(RackEditorMapper.class).updateUnitSize(map);
		} catch (Exception e) {
			status = -100;
		}
		
		return status;
	}
	
	
}
