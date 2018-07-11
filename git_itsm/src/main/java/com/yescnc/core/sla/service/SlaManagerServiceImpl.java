package com.yescnc.core.sla.service;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.yescnc.core.db.sla.SlaDao;
import com.yescnc.core.entity.db.FmEventVO;
import com.yescnc.core.entity.db.SlaVO;
import com.yescnc.core.lib.fm.util.AmConstant;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.util.json.JsonResult;

@Service
public class SlaManagerServiceImpl implements SlaManagerService {
	private Logger logger = LoggerFactory.getLogger(SlaManagerServiceImpl.class);
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	@Value("${sla_path}")
	private String SLA_PATH;
	
	@Autowired
	SlaDao slaDao;
	
	@Autowired
	SlaAlarmManager slaAlarmManager;
	
	@PostConstruct
	public void init() {
		String core_home = "";
		try {
			core_home = resourceLoader.getResource(SLA_PATH+"slaCategory.xml").getURI().getPath();
		} catch (Exception e) {
			e.printStackTrace();
		}
		    	
    	List<SlaVO> categoryList = slaDao.selectCategoryList();
    	
    	List<SlaVO> categoryColList = new ArrayList<>();
    	List<SlaVO> typeColList = new ArrayList<>();
    	List<SlaVO> paramColList = new ArrayList<>();
    	Map<String, List<SlaVO>> categoryMap = new HashMap<String, List<SlaVO>>();
    	Map<String, List<SlaVO>> typeMap = new HashMap<String, List<SlaVO>>();
    	Map<String, List<SlaVO>> paramMap = new HashMap<String, List<SlaVO>>();
    	
    	if(categoryList.isEmpty()){
    		logger.info("[categoryList.isEmpty() size = 0]" + categoryList.size());
    		
    		try{
        		InputSource   is = new InputSource(new FileReader(core_home));
    			Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
    			// xpath 생성
    			XPath  xpath = XPathFactory.newInstance().newXPath();
    			String category_expression = "//*/category";
    			String type_expression = "//*/type";
    			String pi_expression = "//*/pi";
    			NodeList  category_cols = (NodeList) xpath.compile(category_expression).evaluate(document, XPathConstants.NODESET);
    			NodeList  type_cols = (NodeList) xpath.compile(type_expression).evaluate(document, XPathConstants.NODESET);
    			NodeList  pi_cols = (NodeList) xpath.compile(pi_expression).evaluate(document, XPathConstants.NODESET);
    		  
    			//Catagory ///////////////////////////////////////////////////////////////////////////////////////////
    			for(int i = 0; i < category_cols.getLength(); i++) {
    				SlaVO categoryVO = new SlaVO();
    				
    				Node categoryNode = category_cols.item(i);
    				Element categoryElement = (Element)categoryNode;
    				String categoryName = categoryElement.getAttribute("name");
    				int categoryValue = Integer.parseInt( categoryElement.getAttribute("value") );
    				String categoryDisplay = categoryElement.getAttribute("display");
    				
    				if(categoryDisplay.equals("on")){
    					categoryVO.setDisplay_on_off(1);
    					categoryVO.setCategory_name(categoryName);
        				categoryVO.setIdx(categoryValue);
    					logger.info("[categoryDisplay] => " + categoryDisplay);
    					categoryColList.add(categoryVO);
    				}
    			}
    			if( !categoryColList.isEmpty() ){    				
    				categoryMap.put("list", categoryColList);
    				slaDao.insertCategoryList(categoryMap);
    			}
    			
    			//Type ///////////////////////////////////////////////////////////////////////////////////////////    			
    			if( !categoryColList.isEmpty() ){
    				for(int j = 0; j < categoryColList.size(); j++) {
    					
    					for(int i = 0; i < type_cols.getLength(); i++) {
    						SlaVO typeVO = new SlaVO();

    						Node typeNode = type_cols.item(i);
    						Element typeElement = (Element)typeNode;
    						String typeName = typeElement.getAttribute("name");
    						int typeValue = Integer.parseInt( typeElement.getAttribute("value") );
    						int typeParent = Integer.parseInt( typeElement.getAttribute("parent") );
    						String typeDisplay = typeElement.getAttribute("display");

    						if(typeDisplay.equals("on") && categoryColList.get(j).getIdx().equals(typeParent)){
    							typeVO.setDisplay_on_off(1);
    							typeVO.setType_name(typeName);
    							typeVO.setIdx(typeValue);
    							typeVO.setCategory_pid(typeParent);
    							typeColList.add(typeVO);
    						}
    					}
    					
    				}
    			}
	
    			if( !typeColList.isEmpty() ){    				
    				typeMap.put("list", typeColList);
    				slaDao.insertTypeList(typeMap); 
    			}
    			
    			//Param ///////////////////////////////////////////////////////////////////////////////////////////
    			if( !typeColList.isEmpty() ){
    				for(int j = 0; j < typeColList.size(); j++) {
    					
    					for(int i = 0; i < pi_cols.getLength(); i++) {
    	    				SlaVO paramVO = new SlaVO();
    	    				
    	    				Node paramNode = pi_cols.item(i);
    	    				Element paramElement = (Element)paramNode;
    	    				String paramName = paramElement.getAttribute("name");
    	    				int paramValue = Integer.parseInt( paramElement.getAttribute("value") );
    	    				int paramParent = Integer.parseInt( paramElement.getAttribute("parent") );
    	    				int critical = Integer.parseInt( paramElement.getAttribute("critical") );
    	    				int major = Integer.parseInt( paramElement.getAttribute("major") );
    	    				int minor = Integer.parseInt( paramElement.getAttribute("minor") );
    	    				String alarm_on_off = paramElement.getAttribute("alarm_on_off");
    	    				String stat_id = paramElement.getAttribute("stat_id");
    	    				String stat_column = paramElement.getAttribute("stat_column");
    	    				String paramDisplay = paramElement.getAttribute("display");
    	    				
    	    				if(paramDisplay.equals("on") && typeColList.get(j).getIdx().equals(paramParent)){
    	    					paramVO.setDisplay_on_off(1);
    	    					paramVO.setParam_name(paramName);
    	        				paramVO.setIdx(paramValue);
    	        				paramVO.setType_pid(paramParent);
    	        				paramVO.setCritical(critical);
    	        				paramVO.setMajor(major);
    	        				paramVO.setMinor(minor);
    	        				paramVO.setDirection(1);
    	        				paramVO.setStat_id(stat_id);
    	        				paramVO.setStat_column(stat_column);
    	        				
    	        				if(alarm_on_off.equals("on")){
    	        					paramVO.setAlarm_on_off(1);
    	        				}else {
    	        					paramVO.setAlarm_on_off(0);
    	        				}
    	        				paramColList.add(paramVO);
    	        				
    	    				}
    	    			}
    					
    				}
    			}
    			
    			if(!paramColList.isEmpty()) {    				
    				paramMap.put("list", paramColList);
    				slaDao.insertParamList(paramMap);
    			}
    			
    			
        	} catch(Exception e){
      		   e.printStackTrace();
      	   }
    		
    	}else {
    		logger.info("[categoryList.isEmpty() size != 0]" + categoryList.size());
    	}

	}
	
	@Override
	public int slaThresholdUpdate(Map<String, List<SlaVO>> thresholdMap) {
		return slaDao.slaThresholdUpdate(thresholdMap);
	}

	@Override
	public int insertSla(SlaVO vo) {
		return slaDao.insertSla(vo);
	}
	
	@Override
	public int addSla(SlaVO vo) {
		int parentIdxCheck = vo.getCheck_pid();
		vo.setDisplay_on_off(1);
		
		if(parentIdxCheck == -1) {
			return slaDao.addSlaCategory(vo);
		}else if(parentIdxCheck < 1000) {
			return slaDao.addSlaType(vo);
		}else {
			vo.setCritical(0);
			vo.setMajor(0);
			vo.setMinor(0);
			vo.setAlarm_on_off(0);
			vo.setDirection(1);
			return slaDao.addSlaParam(vo);
		}
	}
	
	@Override
	public int deleteCategoryMulti(Map<String, List<SlaVO>> map) {
		return slaDao.deleteCategoryMulti(map);
	}

	@Override
	public int deleteTypeMulti(Map<String, List<SlaVO>> map) {
		return slaDao.deleteTypeMulti(map);
	}

	@Override
	public int deleteParamMulti(Map<String, List<SlaVO>> map) {
		return slaDao.deleteParamMulti(map);
	}
	
	@Override
	public SlaVO selectSla(SlaVO vo) {
		return slaDao.selectSla(vo);
	}

	@Override
	public List<SlaVO> selectSlaList() {
		return slaDao.selectSlaList();
	}

	@Override
	public int updateBySla(SlaVO vo) {
		int result = slaDao.updateBySla(vo);
		if (result <= 0 || vo.getAlarm_on_off() != 0) {
			return result;
		}

		// SLA ALARM OFF 로 설정된 알람 해제 처리
		Integer param_pid = vo.getIdx();
		String param_name = vo.getParam_name();
		ArrayList<FmEventVO> slaAlarmList = slaAlarmManager.getUnclearedSlaAlarm();
		if (slaAlarmList != null) {
			for (FmEventVO dto : slaAlarmList) {
				if (!param_pid.toString().equals(dto.getAlarmId())) {
					continue;
				}

				slaAlarmManager.checkAlarm(dto.getDn(), dto.getLloc(), param_pid, param_name, "", dto.getSeverity(), AmConstant.CLEARED, null);
			}
		}

		return result;
	}
	
	@Override
	public int updateSlaCategory(SlaVO vo) {
		int idxCheck = vo.getIdx();
		if(idxCheck > 10000) {
			vo.setDirection(1);
			return slaDao.updateSlaParam(vo);
		}else if(idxCheck > 1000) {
			return slaDao.updateSlaType(vo);
		}else {
			return slaDao.updateSlaCategory(vo);
		}
	}

	@Override
	public int deleteBySla(SlaVO vo) {
		return slaDao.deleteBySla(vo);
	}
	
	@Override
	public List<SlaVO> searchSlaList(SlaVO vo) {
		return slaDao.searchSlaList(vo);
	}
	
	
	@Override
	public JsonPagingResult slaLimitList(SlaVO vo) {	
		List<SlaVO> categoryList = slaDao.selectCategoryList();
    	List<SlaVO> typeList = slaDao.selectTypeList();
    	List<SlaVO> piList = slaDao.selectParameterList();
    	
    	Map<String, Object> category_map  = new HashMap<String, Object>();
    	Map<String, Object> type_map  = new HashMap<String, Object>();
    	Map<String, Object> pi_map  = new HashMap<String, Object>();
    	Map<String, Object> type_value_map  = new HashMap<String, Object>();
    	Map<String, Object> category_value_map  = new HashMap<String, Object>();
    	List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> type_list = new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> pi_list = new ArrayList<Map<String, Object>>();
    	try{
 		  /* --------------------------------------------------------------------------------------- */ 
 		  /* --------------------------------------------------------------------------------------- */ 
 		   for(int i = 0; i < categoryList.size(); i++) {
 			   if(categoryList.get(i).getDisplay_on_off() == 1) {
 				   category_map.put("recid", categoryList.get(i).getIdx());
 				   category_map.put("category_name", categoryList.get(i).getCategory_name());
 				   for(int j = 0; j < typeList.size(); j++) {
 					   if((categoryList.get(i).getIdx().equals(typeList.get(j).getCategory_pid())) && typeList.get(j).getDisplay_on_off() == 1) {
 						   type_map.put("recid", typeList.get(j).getIdx());
 						   type_map.put("category_name", typeList.get(j).getType_name());
 						   
 						   for(int k = 0; k < piList.size(); k++) {
 							   if((typeList.get(j).getIdx().equals(piList.get(k).getType_pid())) && piList.get(k).getDisplay_on_off() == 1) {
 	 								pi_map.put("recid", piList.get(k).getIdx());
 	 								pi_map.put("category_name", piList.get(k).getParam_name());
 	 								pi_map.put("critical", piList.get(k).getCritical());
 	 								pi_map.put("major", piList.get(k).getMajor());
 	 								pi_map.put("minor", piList.get(k).getMinor());
 	 								pi_map.put("alarm_on_off", piList.get(k).getAlarm_on_off());
 	 								pi_map.put("display_on_off", piList.get(k).getDisplay_on_off());
 	 								pi_map.put("stat_id", piList.get(k).getStat_id());
 	 								pi_map.put("stat_column", piList.get(k).getStat_column());
 	 								pi_list.add(pi_map);
 	 								pi_map  = new HashMap<String, Object>();
 							   }
 						   }
	 	 				   type_value_map.put("children", pi_list);
	 	 				   type_map.put("w2ui", type_value_map);
	 	 				   pi_list = new ArrayList<Map<String, Object>>();
	 	 				   if(categoryList.get(i).getIdx().equals(typeList.get(j).getCategory_pid())) {
	 	 					   type_list.add(type_map);
	 	 				   }
	 	 				   type_map  = new HashMap<String, Object>();
	 	 				   type_value_map  = new HashMap<String, Object>();
 					   }
 				   }
	 			   category_value_map.put("children", type_list);
	 			   category_map.put("w2ui", category_value_map);
	 			   type_list = new ArrayList<Map<String, Object>>();
	 			   list.add(category_map);
	 			   category_value_map  = new HashMap<String, Object>();
	 			   category_map  = new HashMap<String, Object>();
 			   }
 		   }
 		   
			/* --------------------------------------------------------------------------------------- */ 
 	   }catch(Exception e){
 		   e.printStackTrace();
 	   }
/* --------------------------------------------------------------------------------------- */
		int totalCount = slaDao.slaListTotalRecord();
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("categoryList", categoryList);
		result.setData("categorydata", list);
		return result;
	}

	@Override
	public List<SlaVO> selectCategoryList() {
		return slaDao.selectCategoryList();
	}

	@Override
	public List<SlaVO> selectTypeList() {
		return slaDao.selectTypeList();
	}
	
	@Override
	public List<SlaVO> selectParameterList() {
		return slaDao.selectParameterList();
	}	
	
	@Override
	public List<SlaVO> slaSearchList(SlaVO vo) {
		return slaDao.slaSearchList(vo);
	}
	
	@Override
	public List<SlaVO> slaSearchParamList(SlaVO vo) {
		return slaDao.slaSearchParamList(vo);
	}
	
	@Override
	public JsonResult slaNotification(List<HashMap<String, ?>> slaStatList) {
		logger.info("[SlaManagerServiceImpl][slaNotification] start");
		
		JsonResult result = new JsonResult();
		
		if (slaStatList == null || slaStatList.isEmpty()) {
			logger.info("[SlaManagerServiceImpl][slaNotification] slaStatList is null");
			
			result.setResult(false);
			result.setFailReason("slaStatList is null");
			return result;
		}
		
		//Current Alarm List
		ArrayList<FmEventVO> slaAlarmList = slaAlarmManager.getUnclearedSlaAlarm();
		logger.info("[SlaManagerServiceImpl][slaNotification] get slaAlarm List => " + slaAlarmList);
		
		HashMap<String, Integer> slaAlarmIndexList = new HashMap<String, Integer>();
		if (slaAlarmList != null && !slaAlarmList.isEmpty()) {
			for (int i = 0; i < slaAlarmList.size(); i++) {
				FmEventVO dto = slaAlarmList.get(i);
				if (dto == null) {
					continue;
				}

				slaAlarmIndexList.put(dto.getAlarmKeyStringExceptSeverity(), i);
			}
		}
		
		logger.info("[SlaManagerServiceImpl][slaNotification] slaAlarmIndexList List => " + slaAlarmIndexList);
		
		String stat_id = "";
		String stat_column = "";
		String stat_valueStr = "";
		Double stat_value = 0d;
		Integer param_pid = 0;
		String param_name = "";
		Double critical, major, minor;
		Integer level1_id, level2_id, level3_id, level4_id, level5_id, level6_id;
		String lloc = "";
		Integer direction = 1;
		
		//stat_base event
		for (HashMap<String, ?> stat : slaStatList) {
			stat_id = "";
			stat_valueStr = "";
			stat_value = 0d;
			param_pid = 0;
			param_name = "";
			critical = major = minor = 0d;
			level1_id = level2_id = level3_id = level4_id = level5_id = level6_id = -1;
			lloc = "";
			
			/*
			 * level1_id ~ level6_id
			 */
			try {
				level1_id = Integer.valueOf(stat.get("level1_id").toString());
			} catch (Exception e) {
			}
			
			try {
				level2_id = Integer.valueOf(stat.get("level2_id").toString());
			} catch (Exception e) {
			}
			
			try {
				level3_id = Integer.valueOf(stat.get("level3_id").toString());
			} catch (Exception e) {
			}
			
			try {
				level4_id = Integer.valueOf(stat.get("level4_id").toString());
			} catch (Exception e) {
			}
			
			try {
				level5_id = Integer.valueOf(stat.get("level5_id").toString());
			} catch (Exception e) {
			}
			
			try {
				level6_id = Integer.valueOf(stat.get("level6_id").toString());
			} catch (Exception e) {
			}
			
			try {
				direction = Integer.valueOf(stat.get("direction").toString());
			} catch (Exception e) {
			}
			
			/*
			 * lloc
			 */
			try {
				lloc = stat.get("lloc").toString();
			} catch(Exception e) {
				lloc = "N/A";
			}
			
			/*
			 * make dn
			 */
			String dn = level1_id + "." + level2_id + "." + level3_id + "." + level4_id + "." + level5_id + "." + level6_id;
			logger.info("[SlaManagerServiceImpl][slaNotification] dn => " + dn);
			
			/*
			 * stat_value, param_pid, param_name
			 */
			try {
				stat_id = stat.get("stat_id").toString();
				
				stat_column = stat.get("stat_column").toString();
				if (stat_column == null || stat_column.isEmpty()) {
					continue;
				}
				
				stat_valueStr = stat.get(stat_column).toString();
				stat_value = Double.valueOf(stat_valueStr);
				param_pid = Integer.valueOf(stat.get("param_pid").toString());
				param_name = stat.get("param_name").toString();
			} catch (Exception e) {
				e.printStackTrace();
				logger.info("[SlaManagerServiceImpl][slaNotification] Exception => " + e);
				continue;
			}
			
			Integer alarm_state = AmConstant.CLEARED;
			
			/*
			 * Check Minor
			 */
			try {
				minor = Double.valueOf(stat.get("minor").toString());
				if (direction == 1) {
					if (stat_value >= minor) {
						alarm_state = AmConstant.MINOR;
					}
				} else {
					if (stat_value <= minor) {
						alarm_state = AmConstant.MINOR;
					}
				}
			} catch (Exception e) {
			}
			
			/*
			 * Check Major
			 */
			try {
				major = Double.valueOf(stat.get("major").toString());
				if (direction == 1) {
					if (stat_value >= major) {
						alarm_state = AmConstant.MAJOR;
					}
				} else {
					if (stat_value <= major) {
						alarm_state = AmConstant.MAJOR;
					}
				}
			} catch (Exception e) {
			}
			
			/*
			 * Check Critical
			 */
			try {
				critical = Double.valueOf(stat.get("critical").toString());
				if (direction == 1) {
					if (stat_value >= critical) {
						alarm_state = AmConstant.CRITICAL;
					}
				} else {
					if (stat_value <= critical) {
						alarm_state = AmConstant.CRITICAL;
					}
				}
			} catch (Exception e) {
			}
			
			logger.info("[SlaManagerServiceImpl][slaNotification] alarm_state => " + alarm_state);
			
			/*
			 * additional Info
			 */
			HashMap<String, Object> additionalInfo = new HashMap<String, Object>();
			String thresholdInfo = "Critical(" + critical + "), Major(" + major + "), Minor(" + minor + ")";
			additionalInfo.put("THRESHOLD_INFO", thresholdInfo);
			additionalInfo.put("ADDITIONAL_TEXT", thresholdInfo);
			
			String category_name = "N/A";
			String type_name = "N/A";
			try {
				Object objTemp = null;
				category_name = (objTemp = stat.get("category_name")) == null ? "N/A" : objTemp.toString();
				type_name = (objTemp = stat.get("type_name")) == null ? "N/A" : objTemp.toString();
			} catch (Exception e) {
			}
			
			additionalInfo.put("CATEGORY_NAME", category_name);
			additionalInfo.put("TYPE_NAME", type_name);
			additionalInfo.put("PARAM_NAME", param_name);
			
			/*
			 * get previous alarm status
			 * Current Table Event
			 */
			Integer prev_alarm = AmConstant.CLEARED;
			if (slaAlarmIndexList != null && !slaAlarmIndexList.isEmpty()) {
				FmEventVO tempVO = new FmEventVO();
				tempVO.setSeverity(alarm_state);
				tempVO.setAlarmId(param_pid.toString());
				tempVO.setLloc(lloc);
				tempVO.setLvl1Id(level1_id);
				tempVO.setLvl2Id(level2_id);
				tempVO.setLvl3Id(level3_id);
				tempVO.setLvl4Id(level4_id);
				tempVO.setLvl5Id(level5_id);
				tempVO.setLvl6Id(level6_id);
				
				//Current Alarm Table에 존재 여부 파악
				Object objTemp = slaAlarmIndexList.get(tempVO.getAlarmKeyStringExceptSeverity());
				if (objTemp != null) {
					//current Table에 있는 이벤트라면
					Integer findIndex = (Integer) objTemp;
					FmEventVO dto = slaAlarmList.get(findIndex);
					if (dto != null) {
						prev_alarm = dto.getSeverity();
						logger.info("[SlaManagerServiceImpl][slaNotification] prev_alarm => " + prev_alarm);
					}
				}
			}
			
			StringBuilder sb = new StringBuilder();
			sb.append("\r\n********************************************\r\n");
			sb.append("     SLA ALARM PROCESS");
			sb.append("\r\n********************************************\r\n");
			sb.append("  param_pid: ").append(param_pid.toString()).append("\r\n");
			sb.append("  param_name: ").append(param_name).append("\r\n");
			sb.append("  critical: ").append(critical.toString());
			sb.append(", major: ").append(major.toString());
			sb.append(", minor: ").append(minor.toString()).append("\r\n");
			sb.append("  stat_id: ").append(stat_id).append("\r\n");
			sb.append("  stat_column: ").append(stat_column).append("\r\n");
			sb.append("  dn: ").append(dn).append("\r\n");
			sb.append("  lloc: ").append(lloc).append("\r\n");
			sb.append("  stat_value: ").append(stat_valueStr).append("\r\n");
			sb.append("  prev_alarm: ").append(prev_alarm.toString()).append("\r\n");
			sb.append("  alarm_state: ").append(alarm_state.toString()).append("\r\n");
			sb.append("********************************************");
			logger.info(sb.toString());
			
			/*
			 * check and occur alarm
			 */
			slaAlarmManager.checkAlarm(dn, lloc, param_pid, param_name, stat_valueStr, prev_alarm, alarm_state, additionalInfo);
		}
		
		result.setResult(true);
		return result;
	}

}