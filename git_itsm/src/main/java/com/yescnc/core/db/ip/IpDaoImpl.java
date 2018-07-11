package com.yescnc.core.db.ip;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.IpVO;

@Repository
public class IpDaoImpl implements IpDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertIp(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).insertIp(vo);
	}

	@Override
	public IpVO selectIp(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).selectIp(vo);
	}

	@Override
	public List<IpVO> selectIpList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).selectIpList();
	}

	@Override
	public String selectIpForLogin(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).selectIpForLogin(vo);
	}

	@Override
	public int updateByIp(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).updateByIp(vo);
	}

	@Override
	public int deleteByIp(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).deleteByIp(vo);
	}
	
	@Override
	public int deleteIpMulti(Map<String, List<IpVO>> map) {
		return sqlSession.getMapper(IpMapper.class).deleteIpMulti(map);
	}
	
	@Override
	public List<IpVO> searchIpList(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).searchIpList(vo);
	}

	@Override
	public int ipListTotalRecord() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).ipListTotalRecord();
	}
	
	@Override
	public List<IpVO> ipLimitList(IpVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(IpMapper.class).ipLimitList(vo);
	}	
}
