package com.yescnc.project.itsm.db.productmanager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.loginhistory.controller.LoginHistoryController;
import com.yescnc.jarvis.db.assetManager.AssetManagerMapper;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.project.itsm.entity.db.ProductVO;

@Repository
public class ProductManagerDaoImpl implements ProductManagerDao {
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(LoginHistoryController.class);
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<IdcCodeVO> getProductList() {
		List<IdcCodeVO> result = sqlSession.getMapper(ProductManagerMapper.class).getProductList();
		return result;
	}
	
	@Override
	public List<ProductVO> getModelList(ProductVO vo) {
		List<ProductVO> result = sqlSession.getMapper(ProductManagerMapper.class).getModelList(vo);
		return result;
	}
	
	@Override
	public List<ProductVO> getSearchlList(ProductVO vo) {
		List<ProductVO> result = sqlSession.getMapper(ProductManagerMapper.class).getSearchlList(vo);
		return result;
	}
	
	@Override
	public int insertModel(ProductVO vo) {
		return sqlSession.getMapper(ProductManagerMapper.class).insertModel(vo);
	}
	
	@Override
	public int updateModel(ProductVO vo) {
		return sqlSession.getMapper(ProductManagerMapper.class).updateModel(vo);
	}
	
	@Override
	public int deleteIpMulti(Map<String, List<ProductVO>> map) {
		return sqlSession.getMapper(ProductManagerMapper.class).deleteIpMulti(map);
	}
	
	@Override
	public int deleteModelList(ProductVO vo) {
		return sqlSession.getMapper(ProductManagerMapper.class).deleteModelList(vo);
	}
	
	//import // export
	@Override
	public Integer csvAsset(HashMap map){
		int result = 400;
		
		try {
			sqlSession.getMapper(ProductManagerMapper.class).csvAsset(map);
		} catch (Exception e) {
			result = -400;
		}
		
		return result;
	}
	
	@Override
	public Integer csvRackPlace(HashMap map) {
		int result = 500;
		
		try {
			sqlSession.getMapper(ProductManagerMapper.class).csvRackPlace(map);
		} catch (Exception e) {
			result = -500;
		}
		
		return result;
	}
}
