package com.yescnc.core.db.agent;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.AgentCollectVO;
import com.yescnc.core.entity.db.AgentDBInfoVO;
import com.yescnc.core.entity.db.IpVO;

@Repository
public class CollectDaoImpl implements CollectDao {
	
	@Autowired
	private SqlSession sqlSession;

	@Override
	public List<AgentCollectVO> selectCollectInfoList(){
		// TODO Auto-generated method stub
		return sqlSession.getMapper(CollectMapper.class).selectCollectInfoList();
	}
	
	@Override
	public List<AgentDBInfoVO> selectDBInfoList(){
		// TODO Auto-generated method stub
		return sqlSession.getMapper(CollectMapper.class).selectDBInfoList();
	}

	@Override
	public int insertCollectInfo(AgentCollectVO vo){
		// TODO Auto-generated method stub
		return  sqlSession.getMapper(CollectMapper.class).insertCollectInfo(vo);
	}
	
	@Override
	public int insertDBInfo(AgentDBInfoVO vo){
		// TODO Auto-generated method stub
		return  sqlSession.getMapper(CollectMapper.class).insertDBInfo(vo);
	}
	
	@Override
	public int updateCollectInfo(AgentCollectVO vo){
		// TODO Auto-generated method stub
		return  sqlSession.getMapper(CollectMapper.class).updateCollectInfo(vo);
	}

	@Override
	public int updateDBInfo(AgentDBInfoVO vo){
		// TODO Auto-generated method stub
		return  sqlSession.getMapper(CollectMapper.class).updateDBInfo(vo);
	}

	@Override
	public int deleteCollectInfo(AgentCollectVO vo){
		// TODO Auto-generated method stub
		return  sqlSession.getMapper(CollectMapper.class).deleteCollectInfo(vo);
	}
	
	@Override
	public int deleteDBInfo(AgentDBInfoVO vo){
		// TODO Auto-generated method stub
		return  sqlSession.getMapper(CollectMapper.class).deleteDBInfo(vo);
	}
}
