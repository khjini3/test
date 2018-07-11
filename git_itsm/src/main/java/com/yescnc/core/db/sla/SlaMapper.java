package com.yescnc.core.db.sla;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.SlaVO;

public interface SlaMapper {
	int insertSla(SlaVO vo);
	
	int addSlaCategory(SlaVO vo);
	
	int addSlaType(SlaVO vo);
	
	int addSlaParam(SlaVO vo);
	
	int deleteCategoryMulti(Map<String, List<SlaVO>> map);

	int deleteTypeMulti(Map<String, List<SlaVO>> map);

	int deleteParamMulti(Map<String, List<SlaVO>> map);
	
	SlaVO selectSla(SlaVO vo);
	
	List<SlaVO> selectSlaList();
	
	String selectSlaForLogin(SlaVO vo);

	int updateCategoryXmlToDb(SlaVO vo);

	int updateTypeXmlToDb(SlaVO vo);

	int updatePIXmlToDb(SlaVO vo);
	
	int updateBySla(SlaVO vo);
	
	int updateSlaCategory(SlaVO vo);
	
	int updateSlaType(SlaVO vo);
	
	int updateSlaParam(SlaVO vo);
	
	int deleteBySla(SlaVO vo);
	
	List<SlaVO> searchSlaList(SlaVO vo);
	
	int slaListTotalRecord();
	
	List<SlaVO> slaLimitList(SlaVO vo);	
	
	List<SlaVO> selectCategoryList();
	
	List<SlaVO> selectTypeList();
	
	List<SlaVO> selectParameterList();
	
	List<SlaVO> selectEnableSlaParameterList();
	
	List<SlaVO> slaSearchList(SlaVO vo);	

	List<SlaVO> slaSearchParamList(SlaVO vo);

	//XML List
	int insertCategoryList(Map<String, List<SlaVO>> map);
	
	int insertTypeList(Map<String, List<SlaVO>> map);
	
	int insertParamList(Map<String, List<SlaVO>> map);
	
	int slaThresholdUpdate(Map<String, List<SlaVO>> map);

	List<SlaVO> selectSlaTypeList(SlaVO vo);
	
	List<SlaVO> selectSlaParamList(SlaVO vo);
	
	List<SlaVO> selectSlaParam(SlaVO vo);

}
