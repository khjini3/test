package com.yescnc.core.db.report;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.ReportVO;


@Repository
public class DbReportDaoImpl implements DbReportDao {
	
	@Autowired
	private SqlSession session;

	@Override
	public ArrayList<ReportVO> selectAllReports() {
		return session.getMapper(DbReportMapper.class).selectAllReports();
	}
	@Override
	public ArrayList<ReportVO> selectReports(String reporttype) {
		return session.getMapper(DbReportMapper.class).selectReports(reporttype);
	}
	@Override
	public ArrayList<ReportVO> selectReportHistory(ReportVO vo){
		return session.getMapper(DbReportMapper.class).selectReportHistory(vo);
	}
	@Override
	public ArrayList<ReportVO> searchReportHistory(ReportVO vo){
		return session.getMapper(DbReportMapper.class).searchReportHistory(vo);
	}
	@Override
	public String getReportHistoryPath(ReportVO vo){
		return session.getMapper(DbReportMapper.class).getReportHistoryPath(vo);
	}
	@Override
	public int insertReport(ReportVO report) {
		return session.getMapper(DbReportMapper.class).insertReport(report);
	}
	@Override
	public int insertSubReport(ReportVO report) {
		return session.getMapper(DbReportMapper.class).insertSubReport(report);
	}
	@Override
	public int updateReport(ReportVO report) {
		return session.getMapper(DbReportMapper.class).updateReport(report);
	}
	@Override
	public int updateReportSchedule(ReportVO report){
		return session.getMapper(DbReportMapper.class).updateReportSchedule(report);
	}
	@Override
	public int deleteReport(String report_ids) {
		return session.getMapper(DbReportMapper.class).deleteReport(report_ids);
	}
	@Override
	public int deleteSubReport(String report_ids) {
		return session.getMapper(DbReportMapper.class).deleteSubReport(report_ids);
	}
	@Override
	public int deleteReportHistory(String report_ids) {
		return session.getMapper(DbReportMapper.class).deleteReportHistory(report_ids);
	}
	@Override
	public ArrayList<ReportVO> selectAllReportHistory(){
		return session.getMapper(DbReportMapper.class).selectAllReportHistory();
	}
	@Override
	public int reportListTotalRecord() {
		return session.getMapper(DbReportMapper.class).reportListTotalRecord();
	}	
	@Override
	public List<ReportVO> reportLimitList(ReportVO vo) {
		return session.getMapper(DbReportMapper.class).reportLimitList(vo);
	}
}
