package com.yescnc.jarvis.db.symbolManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.db.modelMapping.ModelMappingMapper;
import com.yescnc.jarvis.entity.db.AssetInfoVO;

@Repository
public class SymbolManagerDaoImpl implements SymbolManagerDao {
	
	@Autowired
	private SqlSession  sqlSession;
	
	@Override
	public Integer addSymbol(HashMap map){
		int result = 100;
		try {
			sqlSession.getMapper(SymbolManagerMapper.class).addSymbol(map);
		} catch (Exception e){
			result = -100;
		}
		
		return result;
	}
	
	@Override
	public List<AssetInfoVO> getAssetList(String id){
		List<AssetInfoVO> result = sqlSession.getMapper(SymbolManagerMapper.class).getAssetList(id);
		return result;
	}
	
	@Override
	public List getSymbolList(String id){
		List result = sqlSession.getMapper(SymbolManagerMapper.class).getSymbolList(id);
		return result;
	}
	
	@Override
	public Integer updateSymbolList(HashMap<String, Object> param) {
		Integer result = 100;
		try {
			sqlSession.getMapper(SymbolManagerMapper.class).updateSymbolList(param);
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}
	
	@Override
	public Integer deleteSymbol(Map<String, Object> param){
		int result = 100;
		try{
			//sqlSession.getMapper(SymbolManagerMapper.class).updateSymbolSvg(param);
			sqlSession.getMapper(SymbolManagerMapper.class).deleteSymbol(param);
		} catch (Exception e){
			e.printStackTrace();
			result = -100;
		}
		return result;
	}
	
	@Override
	public Integer modifySymbol(HashMap<String, Object> param) {
		Integer result = 100;
		try {
			sqlSession.getMapper(SymbolManagerMapper.class).modifySymbol(param);
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}
}
