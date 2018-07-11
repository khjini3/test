package com.yescnc.jarvis.locationManager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.locationManager.LocationManagerDao;
import com.yescnc.jarvis.entity.db.IdcLocationManagerCodeVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.core.util.json.JsonResult;

@Service
public class LocationManagerServiceImpl implements LocationManagerService {
	@Autowired
	LocationManagerDao locationManagerDao;
	
	@Override
	public List<IdcLocationVO> selectLocationListAll() {
		List<IdcLocationVO> result = locationManagerDao.selectLocationListAll();
		return result;
	}
	
	@Override
	public JsonResult addLocation(IdcLocationVO location) {
		JsonResult result = new JsonResult();
		
		boolean bRsult = false;
		String failReason = "";
		try {
			bRsult = locationManagerDao.addLocation(location);
		} catch (Exception e) {
			System.out.println("## exception => " + e);
			bRsult = false;
			failReason = getSqlErrorMessageFromExeption(e);
		}
		
		result.setResult(bRsult);
		result.setFailReason(failReason);
		
		return result;
	}
	
	@Override
	public JsonResult deleteLocation(IdcLocationVO location) {
		JsonResult result = new JsonResult();
		
		boolean bRsult = false;
		String failReason = "";
		try {
			int cntLocChild = locationManagerDao.selectCountChildLocation(location.getLoc_id());
			if (cntLocChild > 0) {
				bRsult = false;
				failReason = "The selected node has a child node. Please delete the child node first.";
			} else {
				bRsult = locationManagerDao.deleteLocation(location);
			}
		} catch (Exception e) {
			System.out.println("## exception => " + e);
			bRsult = false;
			failReason = getSqlErrorMessageFromExeption(e);
		}
		
		result.setResult(bRsult);
		result.setFailReason(failReason);
		
		return result;
	}
	
	@Override
	public JsonResult updateLocation(IdcLocationVO location) {
		JsonResult result = new JsonResult();
		
		boolean bRsult = false;
		String failReason = "";
		try {
			bRsult = locationManagerDao.updateLocation(location);
		} catch (Exception e) {
			System.out.println("## exception => " + e);
			bRsult = false;
			failReason = getSqlErrorMessageFromExeption(e);
		}
		
		result.setResult(bRsult);
		result.setFailReason(failReason);
		
		return result;
	}
	
	@Override
	public JsonResult updateIdcAssetLocID(IdcLocationVO location){
		JsonResult result = new JsonResult();
		
		boolean bRsult = false;
		String failReason = "";
		try{
			bRsult = locationManagerDao.updateIdcAssetLocID(location);
		} catch (Exception e) {
			System.out.println("## exception => " + e);
			bRsult = false;
			failReason = getSqlErrorMessageFromExeption(e);
		}
		
		result.setResult(bRsult);
		result.setFailReason(failReason);
		return result;
	}
	
	@Override
	public List<IdcLocationManagerCodeVO> selectLocationTypeList() {
		List<IdcLocationManagerCodeVO> result = locationManagerDao.selectLocationTypeList();
		return result;
	}
	
	private String getSqlErrorMessageFromExeption(Exception exception) {
		String errMsg = exception.getMessage();
		String[] splitLine = errMsg.split("\r\n|\n");
		for (String line : splitLine) {
			if (line.indexOf("### Cause: ") >= 0) {
				String[] split = line.split(": ");
				if (split.length >= 3) {
					return split[2];
				}
				break;
			}
		}

		return "Unknown Error";
	}
}
