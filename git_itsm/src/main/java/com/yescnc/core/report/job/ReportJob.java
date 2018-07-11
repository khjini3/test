package com.yescnc.core.report.job;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

import com.yescnc.core.db.report.ReportDao;
import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.ReportServiceFactory;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;

//import com.yescnc.framework.util.common.ApplicationContextUtil;

public class ReportJob implements Job {

	private static final Logger logger = LoggerFactory.getLogger(ReportJob.class);
	
	private final SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");
	
	private ApplicationContext appcontext;
	
	private ReportServiceFactory rsFactory;
	
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		
		// parameter 확인
		JobDataMap map = context.getJobDetail().getJobDataMap();
		appcontext = (ApplicationContext)map.get("context");
		rsFactory = (ReportServiceFactory)appcontext.getBean("RSFactory");
		
		try {
			pdfCompile(map, context);	// report compile
		} catch (Exception e) {
			ReportVO rvo = (ReportVO)map.get("param");
			rvo.setStatus("0");
			logger.info("ReportJob Exception " + e.toString() );
			e.printStackTrace();
		} finally {
			
		}
	}
	
	/**
	 * 	컴파일 된 파일 pdf로 저장
	 */
	private void saveReportFile( JasperPrint jasperPrint, JobDataMap paramMap, JobExecutionContext context ){
		
		ReportVO rvo = (ReportVO)paramMap.get("param");
		//String droppath = paramMap.getString("droppath");
		//String droppath = ReportServiceFactory.getInstance().getDEFAULT_DROPPATH();
		String droppath = rsFactory.getDEFAULT_DROPPATH();
		
		String reportNm = formatter.format( context.getFireTime() )+"_"+rvo.getReport_id()+"_"+rvo.getReport_title();

		//logger.info("testJob 2 reportNm > " +  reportNm);
		try {
			
			//분기 하여 출력
			switch ( rvo.getExport_type().toString() ) {
			
				case "0":
					//pdf 출력
					JasperExportManager.exportReportToPdfFile(jasperPrint, droppath+reportNm+".pdf");
					break;
					
				case "1":
					//xls 출력
					JRXlsxExporter exporter = new JRXlsxExporter();
					exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
					File outputFile = new File(droppath+reportNm+".xlsx");
					exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputFile));
					SimpleXlsxReportConfiguration configuration = new SimpleXlsxReportConfiguration(); 
					configuration.setDetectCellType(true);//Set configuration as you like it!!
					configuration.setCollapseRowSpan(false);
					exporter.setConfiguration(configuration);
					exporter.exportReport();
					break;
	
				default:
					//Default pdf
					JasperExportManager.exportReportToPdfFile(jasperPrint, droppath+reportNm+".pdf");
					break;
			}
		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			rvo.setStatus("1");
		}
	}
	
	/**
	 * Jasper Report Compile
	 */
	public void pdfCompile( JobDataMap paramMap, JobExecutionContext context )throws Exception {
		
		ReportVO rvo = (ReportVO)paramMap.get("param");
		
		// Report Data 가져오기
		JRDataSource jrcd = getReportData(rvo);
		
		// ReportDao Bean 가져오기
		//ApplicationContext appcontext = ApplicationContextUtil.getContext();
		ReportDao reportDao = (ReportDao) appcontext.getBean("reportDao");
		
		//logger.info("testJob 0 > " + rvo.getReport_id() + " : " + rvo.getReport_sub_type() );
		
		// main 리포트 컴파일  rvo.getReport_sub_type()에 jrxml 파일 경로.
		
		//String jasperPath = ReportServiceFactory.getInstance().getDEFAULT_DROPPATH();
		String jasperPath = rsFactory.getDEFAULT_DROPPATH();
		
		logger.info("jasperPath : " + jasperPath);
		
		if( jasperPath.equals(""))
			return;
		
		JasperReport jasperMasterReport = null;
		
		Map<String, Object> parameters = new HashMap<String, Object>();	// repot send parameter map
		
		
		
		// sub 리포트 있는지 확인.
		List<ReportVO> subreportList = new ArrayList<>();
		String type = rvo.getDestination_name();
		if(type != null && !type.equals("none")){
			String[] typeArr = type.split(",");
			for(int i=0;i<typeArr.length;i++){
				ReportVO subreport = new ReportVO();
				subreport.setUser_id("1");
				subreport.setMybatis_id(rvo.getMybatis_id()+"_"+typeArr[i]);
				subreport.setReport_sub_type(typeArr[i]+"_"+rvo.getReport_sub_type());
				subreport.setReport_key("_sub_report"+(i+1));
				subreport.setReportdata_key("subdata"+(i+1));
				subreport.setConditions(rvo.getConditions());
				subreportList.add(subreport);
			}
		}
		
		// 있으면 서브 리포트 작업
		if( subreportList.size() > 0){
			
			for( ReportVO subVo : subreportList){
				
				JasperReport jasperSubReport = JasperCompileManager.compileReport(jasperPath + subVo.getReport_sub_type());
				
				logger.info("testJob 1-2 subReport "  + subVo.getReport_key() + " : " +  subVo.getReportdata_key() );
				///정의된 key 로 report와 data setting
				parameters.put( subVo.getReport_key()     , jasperSubReport);
				parameters.put( subVo.getReportdata_key() , getReportData(subVo));
			}
		}
		
		List<Map<String, Object>> tempList = new ArrayList<Map<String, Object>>();
		Map<String, Object> obj = new HashMap<String, Object>();
		obj.put("no", "data");
		tempList.add( obj );
		
		//Data 없으면 noData.jrxml 출력
		if( jrcd != null){
			if(rvo.getReport_sub_type().indexOf("test_tracker") != -1){//tt
				jasperMasterReport = JasperCompileManager.compileReport( jasperPath + "main_report.jrxml" );
				JasperReport jasperTableReport = JasperCompileManager.compileReport( jasperPath + "table_"+rvo.getReport_sub_type());
				parameters.put("main_report", jasperTableReport);
				parameters.put("maindata", jrcd);
				
				jrcd = new JRBeanCollectionDataSource( tempList );
			}else{
				jasperMasterReport = JasperCompileManager.compileReport( jasperPath + rvo.getReport_sub_type() );
			}
		}else{
			jrcd = new JRBeanCollectionDataSource( tempList );
			jasperMasterReport = JasperCompileManager.compileReport( jasperPath + "noData.jrxml" );
		}
		
		//Data provider
		JasperPrint jasperPrint = JasperFillManager.fillReport(jasperMasterReport, parameters, jrcd);
		
		//pdf 파일 저장
		saveReportFile(jasperPrint,paramMap,context);
		
	}
	
	
	/**
	 * Jasper Report Data
	 *  
	 */
	private JRDataSource getReportData( ReportVO rvo ){
	
		//ApplicationContext appcontext = ApplicationContextUtil.getContext();
		// ReportDao Bean 가져오기
		ReportDao reportDao = (ReportDao) appcontext.getBean("reportDao");
		
		// 조회 쿼리 mybatis ID
		String mybatisID = rvo.getMybatis_id();
		
		// Main Report Data List
		List<HashMap<String, Object>> reportDataList = null;
		
		// query where 조건식 확인.
		if( rvo.getConditions() != null && !"".equals( rvo.getConditions() ) ){
			
			//logger.info("testJob conditions : " + rvo.getConditions() );
			reportDataList = reportDao.getReportData(mybatisID, rvo);
		}else{
			
			//logger.info("testJob mybatisID : " + mybatisID );
			reportDataList = reportDao.getReportData(mybatisID);
		}
		
		if( reportDataList != null ){
			logger.info("testJob reportDataList size : " + reportDataList );
			if( reportDataList.size() == 0){
				return null;
			}
		}else{
			return null;
		}
		
		// jasper 리포트 Data type으로 변경.
		JRDataSource jrcd = new JRBeanCollectionDataSource( reportDataList );
		
		return jrcd;
		
	}
	
}
