package com.yescnc.core.db.report;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.ReportVO;

@Repository("reportDao")
public class ReportDao{
	
	Logger 	logger = Logger.getLogger(ReportDao.class);
	
	private final String MAPPER_NAMESPACE = "com.yescnc.core.db.job.report.";

	//@Qualifier("msSqlSessionTemplate")
	@Autowired
	private SqlSession session;

	/**
	 * Report List
	 * @return List<ReportVO>
	 */
	public List<ReportVO> getReportList() {
		
		return session.selectList( MAPPER_NAMESPACE+"selectReportList") ;
	}
	
	/**
	 * Sub Report List
	 * @return List<ReportVO>
	 */
	public List<ReportVO> selectSubReportList(ReportVO vo) {
		
		return session.selectList( MAPPER_NAMESPACE+"selectSubReportList", vo) ;
	}
	
	/**
	 * Sub ReportHistory Insert
	 * @return List<ReportVO>
	 */
	public synchronized int insertReportHistory(ReportVO vo) {
		
		return session.insert( MAPPER_NAMESPACE+"insertReportHistory", vo) ;
	}
	
	/**
	 * Sub ReportHistory Insert
	 * @return List<ReportVO>
	 */
	public synchronized int updateNextRunDate(ReportVO vo) {
		return session.insert( MAPPER_NAMESPACE+"updateNextRunDate", vo) ;
	}
	
	
	/**
	 * Sub ReportHistory selectList
	 * @return List<ReportVO>
	 */
//	public synchronized int selectReportHistory(ReportVO vo) {
//		
//		return session.insert( MAPPER_NAMESPACE+"selectReportHistory", vo) ;
//	}
	
	/**
	 * get ReportDeleteHistory DeleteList
	 * @return List<ReportVO>
	 */
	public List<ReportVO> selectReportDeleteHistory(ReportVO vo) {
		
		return session.selectList( MAPPER_NAMESPACE+"selectReportDeleteHistory", vo) ;
	}
	
	/**
	 * Sub ReportHistory Insert
	 * @return List<ReportVO>
	 */
	public synchronized int deleteReportHistory(ReportVO vo) {
		return session.delete(MAPPER_NAMESPACE+"deleteReportHistory", vo) ;
	}
	
	
	
	
	/**
	 * Report Data mybatis_id 로 조회
	 */
	
	public List<HashMap<String, Object>> getReportData(String mybatis_id) {
		
		return session.selectList( MAPPER_NAMESPACE+mybatis_id) ;
	}
	
	
	public List<HashMap<String, Object>> getReportData(String mybatis_id, ReportVO param) {
		
		return session.selectList( MAPPER_NAMESPACE+mybatis_id, param) ;
	}

}
