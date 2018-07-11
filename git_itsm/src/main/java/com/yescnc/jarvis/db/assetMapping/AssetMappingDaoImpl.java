package com.yescnc.jarvis.db.assetMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.LocationVO;
import com.yescnc.jarvis.util.tree.IdcTree;

@Repository
public class AssetMappingDaoImpl implements AssetMappingDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public LocationVO getLocalList() {
		List<LocationVO> result = sqlSession.getMapper(AssetMappingMapper.class).getLocalList();
		
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
			LocationVO parentVO = treeMapData.get(vo2.getParentId().toString());
			LocationVO currentVO = treeMapData.get(vo2.getLocId().toString());
			
			if(parentVO != null){
				idcTree.add(parentVO, currentVO);
			}
			
		}
		
		return rootVo;
	}

	@Override
	public List<AssetInfoVO> assetList() {
		List<AssetInfoVO> im = sqlSession.getMapper(AssetMappingMapper.class).assetList();
		List<AssetInfoVO> result = new ArrayList<AssetInfoVO>();
		for(AssetInfoVO assetVO : im){
			
			result.add(assetVO);
			
			if(assetVO.getCodeName().equals("SERVER") && assetVO.getStartPosition() == null){
				Map resultMap = assetVO.getW2ui();
				if(resultMap == null){
					resultMap = new HashMap();
				}
				resultMap.put("style", "color: #ff0000");
				assetVO.setW2ui(resultMap);
			}
			
		}
		return result;
	}

	@Override
	public List<AssetInfoVO> getRoomAssetList(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(AssetMappingMapper.class).getRoomAssetList(id);
		return result;
	}

	@Override
	public List<IdcCodeVO> codeList() {
		List<IdcCodeVO> result = sqlSession.getMapper(AssetMappingMapper.class).codeList(); 
		return result;
	}

	@Override
	public Integer updateLocationInfo(HashMap map) {
		Integer result = 100;
		try {
			sqlSession.getMapper(AssetMappingMapper.class).updateLocationInfo(map);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

	@Override
	public List<AssetInfoVO> getRackInList(String id) {
		List<AssetInfoVO> temp = sqlSession.getMapper(AssetMappingMapper.class).getRackInList(id); 
		
		List<AssetInfoVO> result = new ArrayList<AssetInfoVO>();
		
		Map<String, AssetInfoVO> resultMap = new HashMap<String, AssetInfoVO>();
		
		for(AssetInfoVO vo : temp){
			resultMap.put(vo.getAssetId(), vo);
		}
		
		List<AssetInfoVO> children = null;
		
		for(AssetInfoVO vo1 : temp){
			if(vo1.getParentId().equals("")){
				result.add(vo1);
			}else{
				AssetInfoVO parentVO = resultMap.get(vo1.getParentId());
				children = parentVO.getChildren();
				
				if(children == null){
					children = new ArrayList<AssetInfoVO>();
					children.add(vo1);
				}else{
					children.add(vo1);
				}
				
				Map parentW2uiMap = parentVO.getW2ui();
				Map currentW2uiMap = vo1.getW2ui();
				
				if(parentW2uiMap == null){
					parentW2uiMap = new HashMap();
				}
				
				if(currentW2uiMap == null){
					currentW2uiMap = new HashMap();
					if(vo1.getStartPosition() == null || vo1.getStartPosition() == 0 || vo1.getUnitSize() == 0){
						currentW2uiMap.put("style", "background-color: rgba(255, 255, 255, 0.07);color: #ff0000");
					}else{
						currentW2uiMap.put("style", "background-color: rgba(255, 255, 255, 0.07);color: #00c9cd");
					}
					
					vo1.setW2ui(currentW2uiMap);
				}
				
				parentW2uiMap.put("children", children);
				
				parentVO.setChildren(children);
				parentVO.setW2ui(parentW2uiMap);
			}
			
			
		}
		
		return result;
	}

	@Override
	public List<AssetInfoVO> getServerList() {
		List<AssetInfoVO> im = sqlSession.getMapper(AssetMappingMapper.class).getServerList();
		
		List<AssetInfoVO> result = new ArrayList<AssetInfoVO>();
		for(AssetInfoVO assetVO : im){
			
			result.add(assetVO);
			
			if(assetVO.getCodeName().equals("SERVER") && assetVO.getStartPosition() == null){
				Map resultMap = assetVO.getW2ui();
				if(resultMap == null){
					resultMap = new HashMap();
				}
				resultMap.put("style", "color: #ff0000");
				assetVO.setW2ui(resultMap);
			}
			
		}
		
		return result;
	}

	@Override
	public List<AssetInfoVO> getRackServerList(String id) {
		List<AssetInfoVO> im = sqlSession.getMapper(AssetMappingMapper.class).getRackServerList(id); 
		
		List<AssetInfoVO> result = new ArrayList<AssetInfoVO>();
		for(AssetInfoVO assetVO : im){
			
			result.add(assetVO);
			
			if(assetVO.getCodeName().equals("SERVER") && assetVO.getStartPosition() == null){
				Map resultMap = assetVO.getW2ui();
				if(resultMap == null){
					resultMap = new HashMap();
				}
				resultMap.put("style", "color: #ff0000");
				assetVO.setW2ui(resultMap);
			}
			
		}
		
		return result;
	}

	@Override
	public Integer updateServerInfo(HashMap map) {
		Integer result = 100;
		try {
			sqlSession.getMapper(AssetMappingMapper.class).updateServerInfo(map);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

	@Override
	public List<AssetInfoVO> getAvailabilityList() {
		List<AssetInfoVO> im = sqlSession.getMapper(AssetMappingMapper.class).getAvailabilityList();
		List<AssetInfoVO> result = new ArrayList<AssetInfoVO>();
		for(AssetInfoVO assetVO : im){
			
			result.add(assetVO);
			
			if(assetVO.getStartPosition() == null){
				Map resultMap = assetVO.getW2ui();
				if(resultMap == null){
					resultMap = new HashMap();
				}
				resultMap.put("style", "color: #ff0000");
				assetVO.setW2ui(resultMap);
			}
			
		}
		return result;
	}

	@Override
	public Integer deleteComponent(HashMap map) {
		Integer result = 100;
		try {
			sqlSession.getMapper(AssetMappingMapper.class).deleteComponent(map);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

}
