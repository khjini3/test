package com.yescnc.core.report.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.xml.transform.stream.StreamSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Service;

import com.yescnc.core.db.report.DbReportDao;
import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.ReportJobService;
import com.yescnc.core.report.report.Reports;
import com.yescnc.core.util.json.JsonPagingResult;

@Service
public class ReportServiceImpl implements ReportService {
	private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
	
	@Autowired
	DbReportDao reportDao;
	
	@Autowired
	Jaxb2Marshaller marshaller;
	
	//@Autowired
	private Reports reports;
	
	@Resource(name="reportJobService")
	private ReportJobService reportService;

	public ArrayList<ReportVO> getAllReport(){
		return reportDao.selectAllReports();
	}
	public ArrayList<ReportVO> getReport(String reporttype){
		return reportDao.selectReports(reporttype);
	}
	public int setReport(ReportVO vo){
		int isSet = 1;
		vo.setUser_id("1");
		String type = vo.getDestination_type();
		
		reportDao.insertReport(vo);
		vo.setReport_id(vo.getMax_id()+"");
		/*
		 * 여기서 바로 subreport 넘기고
		 * (report_id->parent_id,mybatis_id+"[type]", report_key, report_datakey, cron, ui_setting 까지 동일, insertReport 똑같이
		 * 
		 * */
		try{
			reportService.addJob(vo);	
		}catch(Exception e){
			isSet = -1;
		}
//		if(!type.equals("none")){
//			setSubreport(vo, type);
//		}
		return isSet;  
	}
	public int updateReport(ReportVO vo){
		int isSet = 1;
		vo.setUser_id("1");
		//String type = vo.getDestination_type();
		
		reportDao.updateReport(vo);//update
		/*
		 * 
		 * subreport 지우기
		 * 
		 * */
//		reportDao.deleteSubReport(vo.getReport_id());
		try{
			reportService.updateJob(vo);	
		}catch(Exception e){
			isSet = -1;
		}
//		if(!type.equals("none")){
//			setSubreport(vo, type);
//		}
		return isSet;
	}
	
	/*public void setSubreport(ReportVO vo, String type){
		ReportVO subreport = new ReportVO();
		subreport.setParent_id(vo.getReport_id());
		subreport.setUser_id("1");
		subreport.setMybatis_id(vo.getMybatis_id()+type);
		subreport.setReport_sub_type("sub"+type+"_"+vo.getReport_sub_type());
		subreport.setReport_key("_sub_report");
		subreport.setReportdata_key("subdata");
		reportDao.insertSubReport(subreport);
	}*/
	public int updateSchedultReport(ReportVO vo){
		int isUpdate = 1;
		try{
			reportDao.updateReportSchedule(vo);
			if(vo.getReport_view().equals("0")){//running -> stop
				reportService.deleteJob(vo.getReport_id());	
			}else if(vo.getReport_view().equals("1")){//stop -> running
				reportService.addJob(vo);
			}
		}catch(Exception e){
			isUpdate = -1;
		}
		return isUpdate;
	}
	
	public int deleteReport(String reportid){
		int isOk = 1;
		try{
//			reportDao.deleteReportHistory(reportid);
			reportService.deleteJob(reportid);	
			reportDao.deleteReport(reportid);
		}catch(Exception e){
			e.printStackTrace();
			isOk = -1;
		}
		return isOk;
	}
	
	public ArrayList<ReportVO> getReportHistory(String id){
		ReportVO vo = new ReportVO();
		vo.setReport_id(id);
		return reportDao.selectReportHistory(vo);
	}
	
	public ArrayList<ReportVO> searchReportHistory(ReportVO vo){
		return reportDao.searchReportHistory(vo);
	}
	
	public Reports getReportCondition(HttpServletRequest req){
		Map<String, Object> responseData = new HashMap<>();
		
		try{
			String core_home = System.getenv("CORE_HOME");
			String path = "";
			
			if( core_home != null ){
				path = core_home + File.separator + "resources" + File.separator + "report.xml";
			}else{
				path = req.getServletContext().getRealPath("/resources/"+"report.xml");
			}
			
			reports = new Reports();
			reports = parsingMenuXml(path);
			
			//for(Report report : reports.getReport()){
			//	report.getLabel().indexOf(str)
			//}
			responseData.put("report", reports);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return reports;
	}
	
	public Reports parsingMenuXml(String path) {
		File file = new File(path);
		FileInputStream fis = null;

		try {
			fis = new FileInputStream(file);
			Reports parseReport = (Reports) marshaller.unmarshal(new StreamSource(fis));
			reports.setReport(parseReport.getReport());
			fis.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != fis) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return reports;
	}
	public ReportVO downloadReportDirect(HttpServletRequest req){
		String title = req.getParameter("title");
		String parent_id = req.getParameter("parent_id");
		String report_sub_type = req.getParameter("report_sub_type");
		String query = req.getParameter("query");
		String condition = req.getParameter("condition");
		String type = req.getParameter("destination_name"); 
		String report_type = req.getParameter("report_type");
		String export_type = req.getParameter("export_type");
		String action_type = req.getParameter("actionType");
		String file_name = req.getParameter("fileName");
		
		ReportVO rvo = new ReportVO();
		rvo.setReport_title(title);
		rvo.setParent_id(parent_id);
		rvo.setReport_type(report_type);
		rvo.setReport_sub_type(report_sub_type);
		rvo.setMybatis_id(query);
		rvo.setConditions(condition);
		rvo.setUser_id("1");
		rvo.setExport_type(export_type);
		rvo.setAction_type(action_type);
		rvo.setFile_name(file_name);
		
		List<ReportVO> subreportList = new ArrayList<>();
		
		logger.info("210 type . equals none?"+type+(type.equals("none")));
		
		if(!type.equals("none")){
			String[] typeArr = type.split(",");
			for(int i=0;i<typeArr.length;i++){
				ReportVO subreport = new ReportVO();
				subreport.setUser_id("1");
				subreport.setMybatis_id(query+"_"+typeArr[i]);
				subreport.setReport_sub_type(typeArr[i]+"_"+report_sub_type);
				subreport.setReport_key("_sub_report"+(i+1));
				subreport.setReportdata_key("subdata"+(i+1));
				subreport.setConditions(condition);
				subreportList.add(subreport);
			}
		}
		rvo.setSubreportList(subreportList);
		
		return reportService.directJob(rvo);
	}
	
	public String getReportHistoryPath(String hid){
		ReportVO vo = new ReportVO();
		vo.setHistory_id(hid);
		return reportDao.getReportHistoryPath(vo);
	}
	
	@Override
	public JsonPagingResult reportLimitList(ReportVO vo) {
		// TODO Auto-generated method stub
    	int startRow = (vo.getStartRow() * vo.getEndRow()) - vo.getEndRow();
    	
    	List<ReportVO> totalList = reportDao.selectAllReportHistory();
    	vo.setStartRow(startRow);
		List<ReportVO> limitList = reportDao.reportLimitList(vo);
		int totalCount = reportDao.reportListTotalRecord();
		JsonPagingResult result = new JsonPagingResult();
		result.setNoOffsetRecord(totalCount);
		result.setData("data", limitList);
		result.setData("totaldata", totalList);
		return result;
	}
}
	/*public JsonResult setReport(HttpServletRequest req, Map<String, Object> param){//, boolean isSet) {
		JsonResult restResponse = new JsonResult();
		MyMessage result = null;
		try {
			MyMessage sendMessage = new MyMessage("app.pm", HANDLER_SET_REPORT);
			if(param.get("report_id").equals("")){//set
				param.put("isSet", true);	
			}else{//update
				param.put("isSet", false);
			}
			
			sendMessage.setBody(param);
			
			result = jmsWebModule.sendRequestMessage(sendMessage);
			logger.info("[JM] response completed : " + result);
		} catch (Exception e) {
			e.printStackTrace();
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.fail");
			return restResponse;
		}

		if (result.getResult() == null || !result.getResult().equalsIgnoreCase("ok")) {
			logger.error("response is null");
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.null");
			return restResponse;
		}

		restResponse.setResult(true);
		restResponse.setData(result.getBody());
		
		return restResponse;
	}
	
	public JsonResult deleteReport(HttpServletRequest req, Map<String, Object> param){
		JsonResult restResponse = new JsonResult();
		MyMessage result = null;
		try {
			MyMessage sendMessage = new MyMessage("app.pm", HANDLER_DELETE_REPORT);
			sendMessage.setBody(param);
			
			result = jmsWebModule.sendRequestMessage(sendMessage);
			logger.info("[JM] response completed : " + result);
		} catch (Exception e) {
			e.printStackTrace();
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.fail");
			return restResponse;
		}

		if (result.getResult() == null || !result.getResult().equalsIgnoreCase("ok")) {
			logger.error("response is null");
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.null");
			return restResponse;
		}

		restResponse.setResult(true);
		restResponse.setData(result.getBody());
		
		return restResponse;
	}
	public JsonResult getReportHistory(String id){
		JsonResult restResponse = new JsonResult();
		logger.info("[JM] getReportHistory ID =  " + id);
		MyMessage result = null;

		try {
			MyMessage sendMessage = new MyMessage("app.pm", HANDLER_GET_REPORT_HISTORY);
			Map<String, Object> body = new HashMap<String, Object>();
			body.put("reportId", id);
			sendMessage.setBody(body);
			
			result = jmsWebModule.sendRequestMessage(sendMessage);
			logger.info("[JM] response completed : " + result);
		} catch (Exception e) {
			e.printStackTrace();
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.fail");
			return restResponse;
		}

		if (result.getResult() == null || !result.getResult().equalsIgnoreCase("ok")) {
			logger.error("response is null");
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.null");
			return restResponse;
		}

		restResponse.setResult(true);
		restResponse.setData(result.getBody());
		
		return restResponse;
		
	}
	
	public JsonResult getReportCondition(HttpServletRequest req) {
		JsonResult restResponse = new JsonResult();
		Map<String, Object> responseData = new HashMap<>();
		
		try{
			String path = req.getServletContext().getRealPath("/resources/xml/" + "report.xml");
			reports = parsingMenuXml(path);
			responseData.put("report", reports);
			restResponse.setResult(true);
			restResponse.setData(responseData);
		}catch(Exception e){
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.fail");
		}
		
		return restResponse;
	}
	
	public JsonResult setReportCondition(HttpServletRequest req, Map<String, Object> param){
		JsonResult restResponse = new JsonResult();
		
		return restResponse;
	}
	
	public JsonResult downloadReportDirect(HttpServletRequest req) {
		JsonResult restResponse = new JsonResult();
		MyMessage result = null;
		try {
			MyMessage sendMessage = new MyMessage("app.pm", HANDLER_DOWNLOAD_REPORT_DIRECT);
			
			String title = req.getParameter("title");
			String parent_id = req.getParameter("parent_id");
			String report_sub_type = req.getParameter("report_sub_type");
			String query = req.getParameter("query");
			String condition = req.getParameter("condition");
			
			Map<String, Object> param = new HashMap<String, Object>();
			param.put("title", title);
			param.put("parent_id", parent_id);
			param.put("report_sub_type", report_sub_type);
			param.put("query", query);
			param.put("condition", condition);
			sendMessage.setBody(param);
			
			result = jmsWebModule.sendRequestMessage(sendMessage);
			logger.info("[JM] response completed : " + result);
		} catch (Exception e) {
			e.printStackTrace();
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.fail");
			return restResponse;
		}

		if (result.getResult() == null || !result.getResult().equalsIgnoreCase("ok")) {
			logger.error("response is null");
			restResponse.setResult(false);
			restResponse.setFailReason("response.error.null");
			return restResponse;
		}

		restResponse.setResult(true);
		restResponse.setData(result.getBody());
		
		return restResponse;
	}
	
	
	}
	*/
	

