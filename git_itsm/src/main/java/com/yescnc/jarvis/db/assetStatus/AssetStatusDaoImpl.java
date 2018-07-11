package com.yescnc.jarvis.db.assetStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.util.json.JsonResult;
import com.yescnc.jarvis.codeManager.controller.CodeManagerController;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

@Repository
public class AssetStatusDaoImpl implements AssetStatusDao{
	private org.slf4j.Logger log = LoggerFactory.getLogger(CodeManagerController.class);

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<IdcLocationVO> getLocationList(){
		List<IdcLocationVO> result = sqlSession.getMapper(AssetStatusMapper.class).getLocationList();
		return result;
	}
	
	@Override
	public List<IdcCodeVO> getProductList(){
		List<IdcCodeVO> result = sqlSession.getMapper(AssetStatusMapper.class).getProductList();
		return result;
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> getAssetStatus(Map<String, Object> param){
		log.debug("AssetStatusDaoImpl - result = "+param.toString());
		ArrayList<HashMap<String, Object>> result = sqlSession.getMapper(AssetStatusMapper.class).getAssetStatus(param);
		return result;
		//return sqlSession.getMapper(AssetStatusMapper.class).getAssetStatus(param);
	}

	@Override
	public Integer getRowCount() {
		return sqlSession.getMapper(AssetStatusMapper.class).getRowCount();
	}
	
}
