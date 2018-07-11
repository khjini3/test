package com.yescnc.core.db.agent;

import java.util.List;

import com.yescnc.core.entity.db.AgentCollectVO;
import com.yescnc.core.entity.db.AgentDBInfoVO;;

public interface CollectDao {

	public List<AgentCollectVO> selectCollectInfoList();
	public List<AgentDBInfoVO> selectDBInfoList();
	
	public int insertCollectInfo(AgentCollectVO vo);
	public int insertDBInfo(AgentDBInfoVO vo);
	
	public int updateCollectInfo(AgentCollectVO vo);
	public int updateDBInfo(AgentDBInfoVO vo);
	
	public int deleteCollectInfo(AgentCollectVO vo);
	public int deleteDBInfo(AgentDBInfoVO vo);
	
}
