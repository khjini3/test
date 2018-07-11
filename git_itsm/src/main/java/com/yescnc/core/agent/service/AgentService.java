package com.yescnc.core.agent.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.yescnc.core.agent.vo.info.CollectInfoList;
import com.yescnc.core.entity.db.AgentCollectVO;
import com.yescnc.core.entity.db.AgentDBInfoVO;;

public interface AgentService {
	public List<AgentCollectVO> selectAgentCollectInfoList(); 
	public List<AgentDBInfoVO> selectAgentDBInfoList();
	
	public int insertAgentCollectInfoList(AgentCollectVO vo); 
	public int insertAgentDBInfoList(AgentDBInfoVO vo);
	
	public int updateAgentCollectInfoList(AgentCollectVO vo); 
	public int updateAgentDBInfoList(AgentDBInfoVO vo);
	
	public int deleteAgentCollectInfoList(Integer id); 
	public int deleteAgentDBInfoList(Integer id);
	
	public CollectInfoList getAgentCondition(HttpServletRequest req);
}
