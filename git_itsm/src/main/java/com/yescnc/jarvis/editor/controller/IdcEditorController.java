package com.yescnc.jarvis.editor.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.editor.service.IdcEditorService;
import com.yescnc.jarvis.entity.db.IdcObjectVO;
import com.yescnc.jarvis.entity.db.IdcEditorAssetVO;
import com.yescnc.jarvis.entity.db.IdcEditorModelVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.core.util.json.JsonResult;

@RequestMapping("/editor")
@RestController
public class IdcEditorController {
	
	private Logger logger = LoggerFactory.getLogger(IdcEditorController.class);
	
	@Autowired
	IdcEditorService editorService;
	
	@RequestMapping(value="/location/{parent_loc_id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcLocationVO> selectLocationList(@PathVariable("parent_loc_id") Integer parent_loc_id) {
		IdcLocationVO vo = new IdcLocationVO();
		vo.setParent_loc_id(parent_loc_id);
		
		List<IdcLocationVO> result = editorService.selectLocationList(vo);
		logger.debug(result.toString());
		logger.debug("########### selectLocationList");
		logger.debug(result.toString());
		logger.debug("## " + result.get(0));
		
		return result;
	}
	
	@RequestMapping(value="/location", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcLocationVO> selectLocationList() {
		List<IdcLocationVO> result = editorService.selectLocationListAll();
		logger.debug(result.toString());
		logger.debug("########### selectLocationListAll");
		logger.debug(result.toString());
		logger.debug("## " + result.get(0));
		
		return result;
	}
	
	@RequestMapping(value="/object/{loc_id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcObjectVO> selectObjectList(@PathVariable("loc_id") String loc_id){

		List<IdcObjectVO> result = editorService.selectObjectList(loc_id);
		logger.debug(result.toString());
		
		return result;
	}
	
	@RequestMapping(value="/asset/{loc_id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcEditorAssetVO> selectAssetList(@PathVariable("loc_id") String loc_id){

		List<IdcEditorAssetVO> result = editorService.selectAssetList(loc_id);
		logger.debug(result.toString());
		
		return result;
	}
	
	@RequestMapping(value="/model", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcEditorModelVO> selectModelList(){

		List<IdcEditorModelVO> result = editorService.selectModelList();
		logger.debug(result.toString());
		
		return result;
	}
	
	@RequestMapping(value="/object", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public JsonResult save(HttpServletRequest req, HttpServletResponse res,
			@RequestBody ArrayList<IdcObjectVO> objectList){

		logger.debug(objectList.toString());
		
//		for (IdcVLocationVO location : objectList) {
//			logger.debug(location.getLoc_name());
//		}
		
		return editorService.saveObjectList(objectList);
	}
	
}
