package com.yescnc.jarvis.locationManager.service;

import java.util.List;

import com.yescnc.jarvis.entity.db.IdcLocationManagerCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.core.util.json.JsonResult;

public interface LocationManagerService {
	public List<IdcLocationVO> selectLocationListAll();
	public JsonResult addLocation(IdcLocationVO location);
	public JsonResult deleteLocation(IdcLocationVO location);
	public JsonResult updateLocation(IdcLocationVO location);
	public List<IdcLocationManagerCodeVO> selectLocationTypeList();
	public JsonResult updateIdcAssetLocID(IdcLocationVO location);
}
