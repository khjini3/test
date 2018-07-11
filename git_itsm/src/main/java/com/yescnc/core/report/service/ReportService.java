package com.yescnc.core.report.service;

import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;

import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.report.Reports;
import com.yescnc.core.util.json.JsonPagingResult;

public interface ReportService {
	
	
	public ArrayList<ReportVO> getAllReport();
	
	public ArrayList<ReportVO> getReport(String reporttype);
	
	public int setReport(ReportVO vo);
	
	public int updateReport(ReportVO vo);
	
	public int updateSchedultReport(ReportVO vo);
	
	public int deleteReport(String reportid);
	
	public ArrayList<ReportVO> getReportHistory(String id);
	
	public ArrayList<ReportVO> searchReportHistory(ReportVO vo);
	
	public Reports getReportCondition(HttpServletRequest req);
	
	public ReportVO downloadReportDirect(HttpServletRequest req);
	
	public String getReportHistoryPath(String id);
	
	public JsonPagingResult reportLimitList(ReportVO vo);
}
