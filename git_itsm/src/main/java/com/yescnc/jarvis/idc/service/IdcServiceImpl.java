package com.yescnc.jarvis.idc.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.idc.IdcDao;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.EventListVO;
import com.yescnc.jarvis.entity.db.IdcModelVO;

@Service
public class IdcServiceImpl implements IdcService {
	
	@Autowired
	IdcDao idcDao;
	
	@Override
	public List<IdcModelVO> selectBuild(String locId) {
		//List <IdcModelVO> result = idcDao.selectBuild();
		return idcDao.selectBuild(locId);
	}

	@Override
	public List<IdcModelVO> selectFloor(String id) {
		return idcDao.selectFloor(id);
	}

	@Override
	public List<IdcModelVO> selectRoom(String id) {
		return idcDao.selectRoom(id);
	}

	@Override
	public List<EventListVO> selectEventList() {
		return idcDao.selectEventList();
	}

	@Override
	public List<AssetInfoVO> selectRackInfo(String rackId) {
		return idcDao.selectRackInfo(rackId);
	}

	@Override
	public List<AssetInfoVO> selectRackInList(String rackId) {
		return idcDao.selectRackInList(rackId);
	}

	@Override
	public List getPOPUPEventData(String rackId) {
		return idcDao.getPOPUPEventData(rackId);
	}

	@Override
	public List getMainIconSeverityData() {
		return idcDao.getMainIconSeverityData();
	}

	@Override
	public List getTemperData() {
		return idcDao.getTemperData();
	}

	@Override
	public Integer dumyEventDataInsert() {
		return idcDao.dumyEventDataInsert();
	}

	@Override
	public Integer ackData(HashMap map) {
		return idcDao.ackData(map);
	}

}
