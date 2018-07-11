package com.yescnc.core.widget.service;


import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.yescnc.core.db.sla.SlaDao;
import com.yescnc.core.db.widget.SlaWidgetDao;
import com.yescnc.core.entity.db.SlaVO;
import com.yescnc.core.entity.db.SlaWidgetVO;
import com.yescnc.core.util.json.JsonPagingResult;
import com.yescnc.core.widget.controller.SlaWidgetController;

@Service
public class SlaWidgetServiceImpl implements SlaWidgetService {
	private Logger logger = LoggerFactory.getLogger(SlaWidgetController.class);
	
	@Value("${sla_path}")
	private String SLA_PATH;
	
	@Autowired
	SlaDao slaDao;
	
	@Autowired
	SlaWidgetDao slaWidgetDao;
	
	@Override
	public List<SlaWidgetVO> selectSlaWidgetList() {
		// TODO Auto-generated method stub
		return slaWidgetDao.selectSlaWidgetList();
	}
	
	@Override
	public JsonPagingResult readSlaCategoryXML() {
		String core_home = "";
		String os = System.getProperty("os.name");
		if (os != null && os.startsWith("Windows")) {
			core_home = "src/main/webapp";
		} else {
			core_home = System.getenv("CORE_HOME");
		}
		
		List<SlaVO> categoryList = slaDao.selectCategoryList();
    	List<SlaVO> typeList = slaDao.selectTypeList();
    	List<SlaVO> piList = slaDao.selectParameterList();
    	
    	Map<String, Object> category_map  = new HashMap<String, Object>();
    	Map<String, Object> type_map  = new HashMap<String, Object>();
    	Map<String, Object> pi_map  = new HashMap<String, Object>();
    	List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> type_list = new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> pi_list = new ArrayList<Map<String, Object>>();
    	
    	try{
//			InputSource   is = new InputSource(new FileReader(core_home+File.separator+SLA_PATH+"slaCategory.xml"));
//			Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
//			// xpath 생성
//			XPath  xpath = XPathFactory.newInstance().newXPath();
//			String category_expression = "//*/category";
//			String type_expression = "//*/type";
//			String pi_expression = "//*/pi";
//			NodeList  category_cols = (NodeList) xpath.compile(category_expression).evaluate(document, XPathConstants.NODESET);
//			NodeList  type_cols = (NodeList) xpath.compile(type_expression).evaluate(document, XPathConstants.NODESET);
//			NodeList  pi_cols = (NodeList) xpath.compile(pi_expression).evaluate(document, XPathConstants.NODESET);
			/* --------------------------------------------------------------------------------------- */ 
//			for(int i = 0; i < categoryList.size(); i++) {
//				if(category_cols.item(i).getAttributes().item(0).getTextContent().equals("on")) {
//					category_map.put("name", category_cols.item(i).getAttributes().item(1).getTextContent());
//					category_map.put("value", category_cols.item(i).getAttributes().item(2).getTextContent());
//					category_map.put("display", category_cols.item(i).getAttributes().item(0).getTextContent());
//					 	 				
//					for(int j = 0; j < typeList.size(); j++) {
//						if(categoryList.get(i).getIdx().equals(typeList.get(j).getCategory_pid())) {
//							if(type_cols.item(j).getAttributes().item(0).getTextContent().equals("on")) {
//								type_map.put("name", type_cols.item(j).getAttributes().item(1).getTextContent());
//								type_map.put("value", type_cols.item(j).getAttributes().item(2).getTextContent());
//								type_map.put("display", type_cols.item(j).getAttributes().item(0).getTextContent());
//								 	 	 		 				
//								for(int k = 0; k < piList.size(); k++) {
//									if(typeList.get(j).getIdx().equals(piList.get(k).getType_pid())) {
//										if(pi_cols.item(k).getAttributes().item(0).getTextContent().equals("on")) {
//											pi_map.put("name", pi_cols.item(k).getAttributes().item(1).getTextContent());
//											pi_map.put("value", pi_cols.item(k).getAttributes().item(2).getTextContent());
//											pi_map.put("display", pi_cols.item(k).getAttributes().item(0).getTextContent());
//											pi_list.add(pi_map);
//											pi_map  = new HashMap<String, Object>();
//										}
//									}
//								}
//							}
//							type_map.put("piList", pi_list);
//							pi_list = new ArrayList<Map<String, Object>>();
//							if(categoryList.get(i).getIdx().equals(typeList.get(j).getCategory_pid())) {
//								type_list.add(type_map);
//							}
//							type_map  = new HashMap<String, Object>();
//						}
//					}
//					category_map.put("typeList", type_list);
//					type_list = new ArrayList<Map<String, Object>>();
//					list.add(category_map);
//					category_map  = new HashMap<String, Object>();
//				}
//			}
			/* --------------------------------------------------------------------------------------- */ 
 		    for(int i = 0; i < categoryList.size(); i++) {
 			    if(categoryList.get(i).getDisplay_on_off() == 1) {
					category_map.put("name", categoryList.get(i).getCategory_name());
					category_map.put("value", categoryList.get(i).getIdx());
					category_map.put("display", "on");
 				    for(int j = 0; j < typeList.size(); j++) {
 					    if((categoryList.get(i).getIdx().equals(typeList.get(j).getCategory_pid())) && typeList.get(j).getDisplay_on_off() == 1) {
							type_map.put("name", typeList.get(j).getType_name());
							type_map.put("value", typeList.get(j).getIdx());
							type_map.put("display", "on");
 						   
 						    for(int k = 0; k < piList.size(); k++) {
 							    if((typeList.get(j).getIdx().equals(piList.get(k).getType_pid())) && piList.get(k).getDisplay_on_off() == 1) {
									pi_map.put("name", piList.get(k).getParam_name());
									pi_map.put("value", piList.get(k).getIdx());
									pi_map.put("display", "on");
									pi_list.add(pi_map);
									pi_map  = new HashMap<String, Object>();
 							    }
 						    }
							type_map.put("piList", pi_list);
							pi_list = new ArrayList<Map<String, Object>>();
							if(categoryList.get(i).getIdx().equals(typeList.get(j).getCategory_pid())) {
								type_list.add(type_map);
							}
							type_map  = new HashMap<String, Object>();
 					    }
 				    }
					category_map.put("typeList", type_list);
					type_list = new ArrayList<Map<String, Object>>();
					list.add(category_map);
					category_map  = new HashMap<String, Object>();
 			    }
 		    }
		}catch(Exception e){
			e.printStackTrace();
		}
			
		JsonPagingResult result = new JsonPagingResult();
		result.setData("slaWidgetList", list);
		return result;
	}
}
