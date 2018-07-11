package com.yescnc.core.report.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.report.Reports;
import com.yescnc.core.report.service.ReportService;
import com.yescnc.core.util.json.JsonPagingResult;

@RequestMapping("/report")
@RestController
public class ReportController {

	private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
	
	@Autowired
	private ReportService reportService;
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public List<ReportVO> getAllReport() {
		
		return reportService.getAllReport();
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(value = "/{seq}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public List<ReportVO> getReport(@PathVariable("seq") Integer id) {
		
		return reportService.getReport(id.toString());
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public Integer setReport(@RequestBody ReportVO vo) {
		
		return reportService.setReport(vo);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(method = RequestMethod.PUT, produces = "application/json;charset=UTF-8")
	public Integer updateReport(@RequestBody ReportVO vo) {
		
		return reportService.updateReport(vo);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(value = "/change", method = RequestMethod.PUT, produces = "application/json;charset=UTF-8")
	public Integer updateReportSchedule(@RequestBody ReportVO vo) {
		
		return reportService.updateSchedultReport(vo);
	}
	
	@RequestMapping(value="/condition", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public Reports getReportCondition(HttpServletRequest req) {

		return reportService.getReportCondition(req);
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(value = "/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteReport(@PathVariable("seq") Integer id){
		return reportService.deleteReport(id.toString());
	}
	
	/*@OperationLogging(enabled=true, category=CategoryKey.CATEGORY_REPORT)*/
	@RequestMapping(value="/history/{seq}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public List<ReportVO> getReportHistory(@PathVariable("seq") Integer id) {
		return reportService.getReportHistory(id.toString());
	}
	
	@RequestMapping(value="/history/{seq}", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public List<ReportVO> searchReportHistory(@PathVariable("seq") Integer id, @RequestBody ReportVO vo) {
		vo.setReport_id(id.toString());
		return reportService.searchReportHistory(vo);
	}
	
	@RequestMapping(value = "/history/limitList", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public JsonPagingResult reportLimitList(@RequestBody ReportVO vo) {
//		log.info("POST : " + vo);
		if(vo.getReport_id() != null){			
			String id = vo.getReport_id().toString();
			vo.setReport_id(id);
		}
		return reportService.reportLimitList(vo);
	}
	
	/*
	
	@RequestMapping(method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public JsonResult setReport(HttpServletRequest req, @RequestBody Map<String, Object> param) {
		
		return reportService.setReport(req, param);
	}
	@RequestMapping(value="/delete", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public JsonResult deleteReport(HttpServletRequest req, @RequestBody Map<String, Object> param) {
		
		return reportService.deleteReport(req, param);
	} */
	
//	@RequestMapping(value="/{report_id}",method = RequestMethod.PUT, produces = "application/json;charset=UTF-8")
//	public JsonResult updateReport(HttpServletRequest req, @RequestBody Map<String, Object> param) {
//		
//		return reportService.setReport(req, param, false);
//	}
	
//	@RequestMapping(value="/condition", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
//	public JsonResult setReportCondition(HttpServletRequest req, @RequestBody Map<String, Object> param) {
//		
//		return reportService.setReportCondition(req, param);
//	}

	/*@RequestMapping(value="/history", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public JsonResult getReportHistory(HttpServletRequest req) {
		return reportService.getReportHistory(req.getParameter("reportId").toString());
	}*/
	
	
	/**
	 * report download
	 * @param req
	 * @param res
	 */
	@RequestMapping(value="/reportdown", method = RequestMethod.POST)
	public synchronized void downloadReport(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String path = (String)request.getParameter("path");
		String cookie = (String)request.getParameter("cookie");
		
		logger.info( "report path : " + path );
		logger.info( "report cookie : " + cookie );
		
		String fileName = path.split("/")[path.split("/").length-1];
		String docName = null;
		
		response.setContentType("application/force-download");
		
		String header = getBrowser(request);
		
		if (header.contains("MSIE")) {
		       docName = URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+", "%20");
		       response.setHeader("Content-Disposition", "attachment;filename=" + docName + ";");
		} else if (header.contains("Firefox")) {
		       docName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
		       response.setHeader("Content-Disposition", "attachment; filename=\"" + docName + "\"");
		} else if (header.contains("Opera")) {
		       docName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
		       response.setHeader("Content-Disposition", "attachment; filename=\"" + docName + "\"");
		} else if (header.contains("Chrome")) {
		       docName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
		       response.setHeader("Content-Disposition", "attachment; filename=\"" + docName + "\"");
		}

		response.setHeader("Set-Cookie", cookie+"true; path=/");
		
		InputStream inputstream = null;
		File downFile = null;
		
		try{
			downFile = new File(path);
			inputstream = new FileInputStream(downFile);
			
			if( inputstream != null ){
				int count = IOUtils.copy( inputstream, response.getOutputStream() );
				logger.info( "count : " + count );
			}
			
			response.flushBuffer();
			inputstream.close();
			
		}catch(Exception e){
			if( inputstream != null ){
				inputstream.close();
			}
			e.printStackTrace();
		}finally{
			inputstream = null;
			downFile = null;
		}
		
//		response.setHeader("Content-Type", "application/octet-stream");
//		response.setContentLength((int)file.getSize());
//		response.setHeader("Content-Transfer-Encoding", "binary;");
//		response.setHeader("Pragma", "no-cache;");
//		response.setHeader("Expires", "-1;");
		
		
	}
	
	private String getBrowser(HttpServletRequest request) {
		
        String header = request.getHeader("User-Agent");
        
        if (header.contains("MSIE")) {
               return "MSIE";
        } else if(header.contains("Chrome")) {
               return "Chrome";
        } else if(header.contains("Opera")) {
               return "Opera";
        }
        return "Firefox";
	}
	
	
	@RequestMapping(value="/previewReport/{hid}", method = RequestMethod.GET)
    public void generateReport(HttpServletRequest request, HttpServletResponse response,
    							@PathVariable("hid") String hid) throws Exception {

		
    	String path = reportService.getReportHistoryPath(hid);

        InputStream inputstream = null;
		File downFile = null;
		
		try{
			downFile = new File(path);
			
			if( !downFile.exists() )
				return;
			
			inputstream = new FileInputStream(downFile);
			
			byte[] data = new byte[(int)downFile.length()];
			
			int i = 0, j = 0;

			while((i = inputstream.read()) != -1) {
				data[j] = (byte)i;
				j++;
			}
        		
	        response.setContentType("application/pdf");
	        response.setHeader("Content-disposition", "inline; filename=" + "preview.pdf");
	        response.setContentLength(data.length);
	
	        response.getOutputStream().write(data);
	        response.getOutputStream().flush();
        
		}catch(Exception e){
			if( inputstream != null ){
				inputstream.close();
			}
			e.printStackTrace();
		}finally{
			inputstream.close(); // Fixed by GI HWAN for SonarQube. 2018-06-18
			downFile = null;
		}
    }
	
	@RequestMapping(value="/reportdown", method = RequestMethod.GET)
	public synchronized ReportVO downloadReportDirect(HttpServletRequest request, HttpServletResponse response) throws Exception{
		System.out.println("Report request : " + request);
		return reportService.downloadReportDirect(request);
	}
	
}
