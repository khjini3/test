package com.yescnc.project.itsm.db.defect;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DefectDaoImpl implements DefectDao {
	@Autowired
	private SqlSession sqlSession;
	
}
