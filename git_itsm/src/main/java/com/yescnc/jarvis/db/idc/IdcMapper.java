package com.yescnc.jarvis.db.idc;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.EventListVO;
import com.yescnc.jarvis.entity.db.IdcModelVO;

public interface IdcMapper {
	List<IdcModelVO> selectBuild(String locId);
	
	List<IdcModelVO> selectFloor(String id);
	
	List<IdcModelVO> selectRoom(String id);
	
	List<EventListVO> selectEventList();
	
	List<AssetInfoVO> selectRackInfo(String rackId);
	
	List<AssetInfoVO> selectRackInList(String rackId);
	
	List getPOPUPEventData(String rackId);
	
	List getMainIconSeverityData();
	
	List getTemperData();
	
	void dumyEventDataInsert();
	
	void ackData(HashMap map);
}
