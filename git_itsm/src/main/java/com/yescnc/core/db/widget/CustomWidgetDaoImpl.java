package com.yescnc.core.db.widget;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.CustomWidgetVO;

@Repository("customWidgetDao")
public class CustomWidgetDaoImpl implements CustomWidgetDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public List<CustomWidgetVO> selectCustomWidgetList() {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(CustomWidgetMapper.class).selectCustomWidgetList();
	}
}
