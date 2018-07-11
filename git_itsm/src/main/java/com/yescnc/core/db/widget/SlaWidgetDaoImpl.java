package com.yescnc.core.db.widget;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.SlaWidgetVO;

@Repository("slaWidgetDao")
public class SlaWidgetDaoImpl implements SlaWidgetDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public List<SlaWidgetVO> selectSlaWidgetList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SlaWidgetMapper.class).selectSlaWidgetList();
	}
}
