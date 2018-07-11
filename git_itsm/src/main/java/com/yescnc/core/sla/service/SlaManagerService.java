package com.yescnc.core.sla.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.SlaVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

public interface SlaManagerService {
	public int insertSla(SlaVO vo);
	
	public SlaVO selectSla(SlaVO vo);
	
	public List<SlaVO> selectSlaList();
	
	public int updateBySla(SlaVO vo);
	
	public int addSla(SlaVO vo);
	
	public int updateSlaCategory(SlaVO vo);
	
	public int deleteBySla(SlaVO vo);
	
	public int deleteCategoryMulti(Map<String, List<SlaVO>> map);

	public int deleteTypeMulti(Map<String, List<SlaVO>> map);

	public int deleteParamMulti(Map<String, List<SlaVO>> map);
	
	public List<SlaVO> searchSlaList(SlaVO vo);
	
	public JsonPagingResult slaLimitList(SlaVO vo);	
	
	public List<SlaVO> selectCategoryList();
	
	public List<SlaVO> selectTypeList();
	
	public List<SlaVO> selectParameterList();
	
	public List<SlaVO> slaSearchList(SlaVO vo);	
	
	public List<SlaVO> slaSearchParamList(SlaVO vo);
	
	public JsonResult slaNotification(List<HashMap<String, ?>> slaStatList);
	
	public int slaThresholdUpdate(Map<String, List<SlaVO>> thresholdMap);

}
