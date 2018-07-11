package com.yescnc.core.ip.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.ip.IpDao;
import com.yescnc.core.entity.db.IpVO;
import com.yescnc.core.util.json.JsonPagingResult;

@Service
public class IpServiceImpl implements IpService {
	@Autowired
	IpDao ipDao;
	
	@Override
	public int insertIp(IpVO vo) {
		// TODO Auto-generated method stub
		return ipDao.insertIp(vo);
	}

	@Override
	public IpVO selectIp(IpVO vo) {
		// TODO Auto-generated method stub
		return ipDao.selectIp(vo);
	}

	@Override
	public List<IpVO> selectIpList() {
		// TODO Auto-generated method stub
		return ipDao.selectIpList();
	}

	@Override
	public int updateByIp(IpVO vo) {
		// TODO Auto-generated method stub
		return ipDao.updateByIp(vo);
	}

	@Override
	public int deleteByIp(IpVO vo) {
		// TODO Auto-generated method stub
		return ipDao.deleteByIp(vo);
	}
	
	@Override
	public int deleteIpMulti(Map<String, List<IpVO>> map) {
		return ipDao.deleteIpMulti(map);
	}
	
	@Override
	public List<IpVO> searchIpList(IpVO vo) {
		// TODO Auto-generated method stub
		return ipDao.searchIpList(vo);
	}

	@Override
	public JsonPagingResult ipLimitList(IpVO vo) {
		// TODO Auto-generated method stub
    	int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();

    	List<IpVO> totalList = ipDao.selectIpList();
    	vo.setStartRow(startRow);
		List<IpVO> limitList = ipDao.ipLimitList(vo);
		int totalCount = ipDao.ipListTotalRecord();
		//logger.info("searchLoginHistoryListTotalRecord={}" , totalCount);
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("data", limitList);
		result.setData("totaldata", totalList);
		//return loginHistoryDao.loginHistoryLimitList(vo);
		return result;
	}
	
}