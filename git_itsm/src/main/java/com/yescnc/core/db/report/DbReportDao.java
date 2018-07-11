package com.yescnc.core.db.report;

import java.util.ArrayList;
import java.util.List;

import com.yescnc.core.entity.db.ReportVO;

public interface DbReportDao {
	
	ArrayList<ReportVO> selectAllReports();
	
	ArrayList<ReportVO> selectReports(String reporttype);
	
	ArrayList<ReportVO> selectReportHistory(ReportVO vo);
	
	ArrayList<ReportVO> searchReportHistory(ReportVO vo);
	
	String getReportHistoryPath(ReportVO vo);
	
	int insertReport(ReportVO report);
	
	int insertSubReport(ReportVO report);
	
	int updateReport(ReportVO report);
	
	int updateReportSchedule(ReportVO report);
	
	int deleteReport(String report_ids);
	
	int deleteSubReport(String report_id);
	
	int deleteReportHistory(String report_ids);
		
	ArrayList<ReportVO> selectAllReportHistory();
	
	public List<ReportVO> reportLimitList(ReportVO vo);
	
	public int reportListTotalRecord();	
}

