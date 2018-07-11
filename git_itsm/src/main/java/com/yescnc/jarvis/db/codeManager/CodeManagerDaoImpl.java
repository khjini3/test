package com.yescnc.jarvis.db.codeManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.IdcCodeVO;

@Repository
public class CodeManagerDaoImpl implements CodeManagerDao {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<IdcCodeVO> getCodeList() {
		List<IdcCodeVO> result = sqlSession.getMapper(CodeManagerMapper.class).getCodeList();
		return result;
	}

	@Override
	public Integer insertCode(HashMap map) {
		int result = 100;
		try {
			sqlSession.getMapper(CodeManagerMapper.class).insertCode(map);
		} catch (Exception e) {
			result = -100;
		}
		
		return result;
	}

	@Override
	public Integer deleteCode(Map map) {
		int result = 200;
		try {
			sqlSession.getMapper(CodeManagerMapper.class).deleteCode(map);
		} catch (Exception e) {
			result =  -200; 
		}
		
		return result;
	}

	@Override
	public Integer updateCode(HashMap map) {
		int result = 300;
		
		try {
			sqlSession.getMapper(CodeManagerMapper.class).updateCode(map);
		} catch (Exception e) {
			result = -300;
		}
		
		return result;
	}



}
