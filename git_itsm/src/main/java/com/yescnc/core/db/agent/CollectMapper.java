package com.yescnc.core.db.agent;

import java.util.List;

import com.yescnc.core.entity.db.AgentCollectVO;
import com.yescnc.core.entity.db.AgentDBInfoVO;

public interface CollectMapper {
	List<AgentCollectVO> selectCollectInfoList();
	List<AgentDBInfoVO> selectDBInfoList();
	
	int insertCollectInfo(AgentCollectVO vo);
	int insertDBInfo(AgentDBInfoVO vo);
	
	int updateCollectInfo(AgentCollectVO vo);
	int updateDBInfo(AgentDBInfoVO vo);
	
	int deleteCollectInfo(AgentCollectVO vo);
	int deleteDBInfo(AgentDBInfoVO vo);
}
