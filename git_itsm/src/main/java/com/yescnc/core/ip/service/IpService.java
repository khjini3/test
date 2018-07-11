package com.yescnc.core.ip.service;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.IpVO;
import com.yescnc.core.util.json.JsonPagingResult;

public interface IpService {
	public int insertIp(IpVO vo);
	
	public IpVO selectIp(IpVO vo);
	
	public List<IpVO> selectIpList();
	
	public int updateByIp(IpVO vo);
	
	public int deleteByIp(IpVO vo);
	
	public int deleteIpMulti(Map<String, List<IpVO>> map);
	
	public List<IpVO> searchIpList(IpVO vo);
	
	public JsonPagingResult ipLimitList(IpVO vo);	
}
