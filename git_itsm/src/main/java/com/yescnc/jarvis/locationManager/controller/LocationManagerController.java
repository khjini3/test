package com.yescnc.jarvis.locationManager.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.jarvis.entity.db.IdcLocationManagerCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.jarvis.locationManager.service.LocationManagerService;
import com.yescnc.core.util.json.JsonResult;

@RequestMapping("/locationManager")
@RestController
public class LocationManagerController {
	private Logger logger = LoggerFactory.getLogger(LocationManagerController.class);
	
	@Autowired
	LocationManagerService locationManagerService;
	
	@RequestMapping(value="/location", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcLocationVO> selectLocationList() {
		List<IdcLocationVO> result = locationManagerService.selectLocationListAll();
		logger.debug(result.toString());
		logger.debug("########### selectLocationListAll");
		logger.debug(result.toString());
		logger.debug("## " + result.get(0));
		
		return result;
	}
	
	@RequestMapping(value="/location", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonResult addLocation(HttpServletRequest req, HttpServletResponse res,
			@RequestBody IdcLocationVO location){

		logger.debug(location.toString());
		
		return locationManagerService.addLocation(location);
	}
	
	@RequestMapping(value="/location", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public JsonResult deleteLocation(HttpServletRequest req, HttpServletResponse res,
			@RequestBody IdcLocationVO location){

		logger.debug(location.toString());
		
		return locationManagerService.deleteLocation(location);
	}
	
	@RequestMapping(value="/location", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public JsonResult updateLocation(HttpServletRequest req, HttpServletResponse res,
			@RequestBody IdcLocationVO location){

		logger.debug(location.toString());
		
		return locationManagerService.updateLocation(location);
	}
	
	@RequestMapping(value="/locationType", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<IdcLocationManagerCodeVO> selectLocationTypeList() {
		List<IdcLocationManagerCodeVO> result = locationManagerService.selectLocationTypeList();
		logger.debug(result.toString());
		logger.debug("########### selectLocationTypeList");
		logger.debug(result.toString());
		logger.debug("## " + result.get(0));
		
		return result;
	}
	
	@RequestMapping(value="/chgLocID", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public JsonResult updateIdcAssetLocID(HttpServletRequest req, HttpServletResponse res,
			@RequestBody IdcLocationVO location){

		logger.debug(location.toString());
		
		return locationManagerService.updateIdcAssetLocID(location);
	}
}
