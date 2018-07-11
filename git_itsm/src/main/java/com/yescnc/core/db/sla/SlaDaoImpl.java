package com.yescnc.core.db.sla;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.SlaVO;

@Repository
public class SlaDaoImpl implements SlaDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertSla(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).insertSla(vo);
	}
	
	@Override
	public int addSlaCategory(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).addSlaCategory(vo);
	}
	
	@Override
	public int addSlaType(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).addSlaType(vo);
	}
	
	@Override
	public int addSlaParam(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).addSlaParam(vo);
	}
	
	@Override
	public int deleteCategoryMulti(Map<String, List<SlaVO>> map) {
		int result = -1;
		List<SlaVO> selectTypeList = new ArrayList<>();
		List<SlaVO> resultSlaTypeList = new ArrayList<>();
		List<SlaVO> resultSlaParamList = new ArrayList<>();
		Map<String, List<SlaVO>> selectTypeMap = new HashMap<String, List<SlaVO>>();
		Map<String, List<SlaVO>> selectParamMap = new HashMap<String, List<SlaVO>>();
		selectTypeList = map.get("list");
		// type 
		try {
			for(int i = 0; i < selectTypeList.size(); i++) {
				SlaVO typeMulti = new SlaVO();
				typeMulti.setCategory_pid(selectTypeList.get(i).getIdx());	
				resultSlaTypeList = sqlSession.getMapper(SlaMapper.class).selectSlaTypeList(typeMulti);
				selectTypeMap.put("list", resultSlaTypeList);
				// param
				for(int j = 0; j < resultSlaTypeList.size(); j++) {
					SlaVO paramMulti = new SlaVO();
					paramMulti.setType_pid(resultSlaTypeList.get(j).getIdx());
					resultSlaParamList = sqlSession.getMapper(SlaMapper.class).selectSlaParamList(paramMulti);
					if( !resultSlaParamList.isEmpty() ) {						
						selectParamMap.put("list", resultSlaParamList);
						sqlSession.getMapper(SlaMapper.class).deleteParamMulti(selectParamMap);
					}
				}
				if( !resultSlaTypeList.isEmpty() ) {
					sqlSession.getMapper(SlaMapper.class).deleteTypeMulti(selectTypeMap);
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			result = sqlSession.getMapper(SlaMapper.class).deleteCategoryMulti(map);
		}
		
		return result;
	}
	
	@Override
	public int deleteTypeMulti(Map<String, List<SlaVO>> map) {
		//param
		int result = -1;
		List<SlaVO> resultSlaParamList = new ArrayList<>();
		List<SlaVO> SlaParamList = new ArrayList<>();
		Map<String, List<SlaVO>> selectParamMap = new HashMap<String, List<SlaVO>>();
		resultSlaParamList = map.get("list");
		try {
			for(int j = 0; j < resultSlaParamList.size(); j++) {
				SlaVO paramMulti = new SlaVO();
				paramMulti.setType_pid(resultSlaParamList.get(j).getIdx());
				SlaParamList = sqlSession.getMapper(SlaMapper.class).selectSlaParamList(paramMulti);
				if( !SlaParamList.isEmpty() ) {
					selectParamMap.put("list", SlaParamList);
					sqlSession.getMapper(SlaMapper.class).deleteParamMulti(selectParamMap);
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			result = sqlSession.getMapper(SlaMapper.class).deleteTypeMulti(map);
		}
		return result;
	}

	@Override
	public int deleteParamMulti(Map<String, List<SlaVO>> map) {
		int result = -1;
		List<SlaVO> resultSlaParamList = new ArrayList<>();
		List<SlaVO> SlaParamList = new ArrayList<>();
		Map<String, List<SlaVO>> selectParamMap = new HashMap<String, List<SlaVO>>();
		resultSlaParamList = map.get("list");
		try {
			for(int j = 0; j < resultSlaParamList.size(); j++) {
				SlaVO paramMulti = new SlaVO();
				paramMulti.setIdx(resultSlaParamList.get(j).getIdx());
				SlaParamList = sqlSession.getMapper(SlaMapper.class).selectSlaParam(paramMulti);
				if( !SlaParamList.isEmpty() ) {
					selectParamMap.put("list", SlaParamList);
					result = sqlSession.getMapper(SlaMapper.class).deleteParamMulti(map);
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return result;
	}
		
	@Override
	public SlaVO selectSla(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).selectSla(vo);
	}

	@Override
	public List<SlaVO> selectSlaList() {
		return sqlSession.getMapper(SlaMapper.class).selectSlaList();
	}

	@Override
	public String selectSlaForLogin(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).selectSlaForLogin(vo);
	}
	
	@Override
	public int updateCategoryXmlToDb(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updateCategoryXmlToDb(vo);
	}
	
	@Override
	public int updateTypeXmlToDb(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updateTypeXmlToDb(vo);
	}
	
	@Override
	public int updatePIXmlToDb(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updatePIXmlToDb(vo);
	}

	@Override
	public int updateBySla(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updateBySla(vo);
	}
	
	@Override
	public int updateSlaCategory(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updateSlaCategory(vo);
	}
	
	@Override
	public int updateSlaType(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updateSlaType(vo);
	}
	
	@Override
	public int updateSlaParam(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).updateSlaParam(vo);
	}

	@Override
	public int deleteBySla(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).deleteBySla(vo);
	}
	
	@Override
	public List<SlaVO> searchSlaList(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).searchSlaList(vo);
	}

	@Override
	public int slaListTotalRecord() {
		return sqlSession.getMapper(SlaMapper.class).slaListTotalRecord();
	}
	
	@Override
	public List<SlaVO> slaLimitList(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).slaLimitList(vo);
	}
	
	@Override
	public List<SlaVO> selectCategoryList() {
		return sqlSession.getMapper(SlaMapper.class).selectCategoryList();
	}
	
	@Override
	public List<SlaVO> selectTypeList() {
		return sqlSession.getMapper(SlaMapper.class).selectTypeList();
	}
	
	@Override
	public List<SlaVO> selectParameterList() {
		return sqlSession.getMapper(SlaMapper.class).selectParameterList();
	}
	
	@Override
	public List<SlaVO> selectEnableSlaParameterList() {
		return sqlSession.getMapper(SlaMapper.class).selectEnableSlaParameterList();
	}
	
	@Override
	public List<SlaVO> slaSearchList(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).slaSearchList(vo);
	}	
	
	@Override
	public List<SlaVO> slaSearchParamList(SlaVO vo) {
		return sqlSession.getMapper(SlaMapper.class).slaSearchParamList(vo);
	}	
	
	//XML List
	@Override
	public int insertCategoryList(Map<String, List<SlaVO>> map) {
		return sqlSession.getMapper(SlaMapper.class).insertCategoryList(map);
	}
	
	@Override
	public int insertTypeList(Map<String, List<SlaVO>> map) {
		return sqlSession.getMapper(SlaMapper.class).insertTypeList(map);
	}
	
	@Override
	public int insertParamList(Map<String, List<SlaVO>> map) {
		return sqlSession.getMapper(SlaMapper.class).insertParamList(map);
	}
	
	@Override
	public int slaThresholdUpdate(Map<String, List<SlaVO>> map) {
		return sqlSession.getMapper(SlaMapper.class).slaThresholdUpdate(map);
	}
	
}
