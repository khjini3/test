package com.yescnc.core.db.widget;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.PanelVO;

@Repository
public class PanelDaoImpl implements PanelDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertPanel(PanelVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PanelMapper.class).insertPanel(vo);
	}

	@Override
	public PanelVO selectPanel(PanelVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PanelMapper.class).selectPanel(vo);
	}

	@Override
	public List<PanelVO> selectPanelList(String groupId) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PanelMapper.class).selectPanelList(groupId);
	}
	
	@Override
	public List<PanelVO> selectPanelListAll() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PanelMapper.class).selectPanelListAll();
	}
	
	@Override
	public int updateByPanelId(PanelVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PanelMapper.class).updateByPanelId(vo);
	}
	
	@Override
	public int deleteByPanelId(PanelVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(PanelMapper.class).deleteByPanelId(vo);
	}
	
}
