package com.yescnc.core.db.sla;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.SlaVO;

public interface SlaDao {

	public int insertSla(SlaVO vo);
	
	public int addSlaCategory(SlaVO vo);
	
	public int addSlaType(SlaVO vo);
	
	public int addSlaParam(SlaVO vo);
	
	public int deleteCategoryMulti(Map<String, List<SlaVO>> map);

	public int deleteTypeMulti(Map<String, List<SlaVO>> map);

	public int deleteParamMulti(Map<String, List<SlaVO>> map);
	
	public SlaVO selectSla(SlaVO vo);
	
	public List<SlaVO> selectSlaList();
	
	public String selectSlaForLogin(SlaVO vo);

	public int updateCategoryXmlToDb(SlaVO vo);

	public int updateTypeXmlToDb(SlaVO vo);

	public int updatePIXmlToDb(SlaVO vo);	
	
	public int updateBySla(SlaVO vo);
	
	public int updateSlaCategory(SlaVO vo);
	
	public int updateSlaType(SlaVO vo);
	
	public int updateSlaParam(SlaVO vo);
	
	public int deleteBySla(SlaVO vo);
	
	public List<SlaVO> searchSlaList(SlaVO vo);
	
	public int slaListTotalRecord();	
	
	public List<SlaVO> slaLimitList(SlaVO vo);	
	
	public List<SlaVO> selectCategoryList();

	public List<SlaVO> selectTypeList();
	
	public List<SlaVO> selectParameterList();
	
	public List<SlaVO> selectEnableSlaParameterList();
	
	public List<SlaVO> slaSearchList(SlaVO vo);
	
	public List<SlaVO> slaSearchParamList(SlaVO vo);	

	//XML List
	public int insertCategoryList(Map<String, List<SlaVO>> map);
	
	public int insertTypeList(Map<String, List<SlaVO>> map);
	
	public int insertParamList(Map<String, List<SlaVO>> map);
	
	public int slaThresholdUpdate(Map<String, List<SlaVO>> map);
	
}
