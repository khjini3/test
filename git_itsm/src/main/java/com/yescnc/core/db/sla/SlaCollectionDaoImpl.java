package com.yescnc.core.db.sla;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.SlaCollectionVO;

@Repository
public class SlaCollectionDaoImpl implements SlaCollectionDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public SlaCollectionVO selectSlaCollectionData(SlaCollectionVO vo) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(SlaCollectionMapper.class).selectSlaCollectionData(vo);
	}

}
