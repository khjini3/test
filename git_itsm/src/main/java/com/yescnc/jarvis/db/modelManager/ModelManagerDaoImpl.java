package com.yescnc.jarvis.db.modelManager;

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
public class ModelManagerDaoImpl implements ModelManagerDao {

	@Autowired
	SqlSession sqlSession;
	
	@Override
	public IdcCodeVO getAssetTypeList() {
		List<IdcCodeVO> result = sqlSession.getMapper(ModelManagerMapper.class).getAssetTypeList();
		
		IdcCodeVO rootVo = new IdcCodeVO();
		rootVo.setId("root");
		rootVo.setParentId(null);
		rootVo.setText("root");
		
		IdcTree idcTree = new IdcTree();
		
		Map<String, IdcCodeVO> treeMapData = new HashMap<String, IdcCodeVO>();
		
		treeMapData.put("root", rootVo);
		
		for(IdcCodeVO vo1 : result){
			vo1.setId(vo1.getId().toString());
			vo1.setText(vo1.getName());
			
			switch(vo1.getName()){
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
				case "ASSET":
				case "LOCATION":
					vo1.setIcon("fa icon-folder");
					break;
				default : 
					vo1.setIcon("fas fa-cube fa-lg");
					break;
			}
			
			treeMapData.put(vo1.getId().toString(), vo1);
		}
		
		for(IdcCodeVO vo2:result){
			IdcCodeVO parentVO = treeMapData.get(vo2.getParentId().toString());
			IdcCodeVO currentVO = treeMapData.get(vo2.getId().toString());
			
			if(parentVO != null){
				idcTree.addCode(parentVO, currentVO);
			}
			
		}
		
		return rootVo;
	}

	@Override
	public List<AssetInfoVO> getModelList(String id) {
		List<AssetInfoVO> result = sqlSession.getMapper(ModelManagerMapper.class).getModelList(id);
		return result;
	}

	@Override
	public List<String> getModelDbList() {
		List<String> result = sqlSession.getMapper(ModelManagerMapper.class).getModelDbList();
		return result;
	}

	@Override
	public Integer updateModelList(HashMap map) {
		Integer result = 100;
		
		try {
			sqlSession.getMapper(ModelManagerMapper.class).updateModelList(map);
		} catch (Exception e) {
			result = -100;
		}
		 
		return result;
	}

	@Override
	public Integer removeModelList(HashMap map) {
		Integer result = 100;
		
		try {
			sqlSession.getMapper(ModelManagerMapper.class).removeModelList(map);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

}
