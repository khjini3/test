package com.yescnc.jarvis.db.idc;

import java.util.HashMap;
import java.util.List;

import com.yescnc.jarvis.entity.db.IdcModelVO;
import com.yescnc.jarvis.entity.db.AssetInfoVO;
import com.yescnc.jarvis.entity.db.EventListVO;

public interface IdcDao {
	
	public List<IdcModelVO> selectBuild(String locId);
	
	public List<IdcModelVO> selectFloor(String id);
	
	public List<IdcModelVO> selectRoom(String id);
	
	public List<EventListVO> selectEventList();
	
	public List<AssetInfoVO> selectRackInfo(String rackId);
	
	public List<AssetInfoVO> selectRackInList(String rackId);
	
	public List getPOPUPEventData(String rackId);
	
	public List getMainIconSeverityData();
	
	public List getTemperData();
	
	public Integer dumyEventDataInsert();
	
	public Integer ackData(HashMap map);
	
}
