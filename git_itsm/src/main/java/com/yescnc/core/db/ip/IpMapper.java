package com.yescnc.core.db.ip;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.IpVO;

public interface IpMapper {
	int insertIp(IpVO vo);
	
	IpVO selectIp(IpVO vo);
	
	List<IpVO> selectIpList();
	
	String selectIpForLogin(IpVO vo);
	
	int updateByIp(IpVO vo);
	
	int deleteByIp(IpVO vo);
	
	int deleteIpMulti(Map<String, List<IpVO>> map);
	
	List<IpVO> searchIpList(IpVO vo);
	
	int ipListTotalRecord();
	
	List<IpVO> ipLimitList(IpVO vo);		
}
