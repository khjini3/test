package com.yescnc.core.db.ip;

import java.util.List;
import java.util.Map;

import com.yescnc.core.entity.db.IpVO;

public interface IpDao {

	public int insertIp(IpVO vo);
	
	public IpVO selectIp(IpVO vo);
	
	public List<IpVO> selectIpList();
	
	public String selectIpForLogin(IpVO vo);
	
	public int updateByIp(IpVO vo);
	
	public int deleteByIp(IpVO vo);
	
	public int deleteIpMulti(Map<String, List<IpVO>> map);
	
	public List<IpVO> searchIpList(IpVO vo);
	
	public int ipListTotalRecord();	
	
	public List<IpVO> ipLimitList(IpVO vo);	
}
