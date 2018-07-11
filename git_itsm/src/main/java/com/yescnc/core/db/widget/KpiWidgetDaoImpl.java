package com.yescnc.core.db.widget;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.KpiWidgetVO;

@Repository("kpiWidgetDao")
public class KpiWidgetDaoImpl implements KpiWidgetDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public int insertKpiWidget(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).insertKpiWidget(vo);
	}

	@Override
	public KpiWidgetVO selectKpiWidget(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).selectKpiWidget(vo);
	}

	@Override
	public List<KpiWidgetVO> selectKpiWidgetList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).selectKpiWidgetList();
	}

	@Override
	public int updateByKpiWidgetId(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).updateByKpiWidgetId(vo);
	}

	@Override
	public int deleteByKpiWidgetId(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).deleteByKpiWidgetId(vo);
	}

	@Override
	public int deleteKpiWidgetMuti(Map<String, List<KpiWidgetVO>> map) {
		return sqlSession.getMapper(KpiWidgetMapper.class).deleteKpiWidgetMuti(map);
	}
	
	@Override
	public String selectKpiWidgetQuery(Integer id) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).selectKpiWidgetQuery(id);
	}

	@Override
	public KpiWidgetVO selectKpiWidgetMap(Integer id) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).selectKpiWidgetMap(id);
	}

	@Override
	public List<KpiWidgetVO> selectKpiWidgetLimitList(KpiWidgetVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).selectKpiWidgetLimitList(vo);
	}

	@Override
	public int selectKpiWidgetListTotalRecord() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(KpiWidgetMapper.class).selectKpiWidgetListTotalRecord();
	}
}
