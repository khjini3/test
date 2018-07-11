package com.yescnc.core.report.job;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Repository;

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

//import com.yescnc.framework.action.app.pm.ReportServiceFactory;
//import com.yescnc.framework.util.common.ApplicationContextUtil;

@Repository("reportDirectJob")
public class ReportDirectJob{
	
	@Autowired
	private ApplicationContext appcontext;
	
	@Resource(name="RSFactory")
	ReportServiceFactory rsFactory;
	
	@Value("${preview.download.window.path}")
	private String PREVIEW_DOWNLOAD_WINDOW_PATH;	
	
	@Value("${preview.download.linux.path}")
	private String PREVIEW_DOWNLOAD_LINUX_PATH;	
	
	//private final String DEFAULT_DROPPATH = "/home/yescnc/yesnms/resource/reports/";
	
	private static final Logger logger = LoggerFactory.getLogger(ReportDirectJob.class);
	
	private final SimpleDateFormat direct_formatter = new SimpleDateFormat("yyyyMMddHHmmss");
	
	@SuppressWarnings("finally")
	public ReportVO execute(ReportVO rvo){
		
		String current_time = direct_formatter.format( System.currentTimeMillis() ); 
		
		try {
			pdfCompile(rvo, current_time);	// report compile
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("reportDirectJob Exception " + e.toString() );
		}finally{
			return rvo;
		}
	}
	
	/**
	 * Jasper Report Compile
	 */
	public void pdfCompile( ReportVO rvo, String current_time )throws Exception {
		
		// Report Data 가져오기
		JRDataSource jrcd = getReportData(rvo);
		
		if( jrcd == null )
			return;
		
		// ReportDao Bean 가져오기
		//ApplicationContext appcontext = ApplicationContextUtil.getContext();
		//ReportDao reportDao = (ReportDao) appcontext.getBean("reportDao");
		
		//String jasperPath = ReportServiceFactory.getInstance().getDEFAULT_DROPPATH();
		String jasperPath = rsFactory.getDEFAULT_DROPPATH();
		
		logger.info("jasperPath : " + jasperPath);
		
		if( jasperPath.equals(""))
			return;
		
		Map<String, Object> parameters = new HashMap<String, Object>();	// repot send parameter map

		// sub 리포트 있는지 확인.
		//List<ReportVO> subReportList = reportDao.selectSubReportList(rvo);
		List<ReportVO> subReportList = rvo.getSubreportList();
		
		logger.info("testJob 1 subReportList size " +  subReportList.size() );
		
		// 있으면 서브 리포트 작업
		if( subReportList.size() > 0){
			
			for( ReportVO subVo : subReportList){
				
				JasperReport jasperSubReport = JasperCompileManager.compileReport(jasperPath + subVo.getReport_sub_type());
				
				logger.info("testJob 1-2 subReport "  + subVo.getReport_key() + " : " +  subVo.getReportdata_key() );
				///정의된 key 로 report와 data setting
				parameters.put( subVo.getReport_key()     , jasperSubReport);
				parameters.put( subVo.getReportdata_key() , getReportData(subVo));
			}
		}
		
		// main 리포트 컴파일  rvo.getReport_sub_type()에 jrxml 파일 경로.
		JasperReport jasperMasterReport = null;
		
		// main table 리포트 (raw data)
		if(rvo.getReport_sub_type().indexOf("test_tracker") != -1){//tt
			jasperMasterReport = JasperCompileManager.compileReport( jasperPath + "main_report.jrxml" );
			JasperReport jasperTableReport = JasperCompileManager.compileReport( jasperPath + "table_"+rvo.getReport_sub_type());
			parameters.put("main_report", jasperTableReport);
			parameters.put("maindata", jrcd);
			
			List<Map<String, Object>> tempList = new ArrayList<Map<String, Object>>();
			Map<String, Object> obj = new HashMap<String, Object>();
			obj.put("no", "data");
			tempList.add( obj );
			jrcd = new JRBeanCollectionDataSource( tempList );
		}else{
			jasperMasterReport = JasperCompileManager.compileReport( jasperPath + rvo.getReport_sub_type() );
		}
		
		// 리포트 Data 적용
		JasperPrint jasperPrint = JasperFillManager.fillReport(jasperMasterReport, parameters, jrcd);
		
		// 파일 저장
		saveReportFile(jasperPrint,rvo,current_time);
		
	}
	
	/**
	 * 	컴파일 된 파일 pdf로 저장
	 */
	private void saveReportFile( JasperPrint jasperPrint, ReportVO rvo, String current_time ){
		
		String osName = System.getProperty("os.name").toLowerCase();
		
//		String droppath = ReportServiceFactory.getInstance().getDEFAULT_DROPPATH();
		String droppath = rsFactory.getDEFAULT_DROPPATH();
		String reportNm = current_time+"_"+"D"+"_"+rvo.getReport_title();
		
		//logger.info("testJob 2 reportNm > " +  reportNm);
		try {
			
			//분기 하여 출력
			switch ( rvo.getExport_type().toString() ) {
			
				case "0":
					//pdf 출력
					if(rvo.getAction_type().equals("estimate") || rvo.getAction_type().equals("order")) {
						droppath = PREVIEW_DOWNLOAD_LINUX_PATH;
						
						if (osName != null && osName.contains("win")) {
							droppath = PREVIEW_DOWNLOAD_WINDOW_PATH;
						}
						
						if(!rvo.getFile_name().equals("")) {
							reportNm = rvo.getFile_name();
						}
					}
					rvo.setMessage(droppath+reportNm+".pdf");
					JasperExportManager.exportReportToPdfFile(jasperPrint, droppath+reportNm+".pdf");
					break;
					
				case "1":
					//xls 출력
					rvo.setMessage(droppath+reportNm+".xlsx");
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
					rvo.setMessage(droppath+reportNm+".pdf");
					JasperExportManager.exportReportToPdfFile(jasperPrint, droppath+reportNm+".pdf");
					break;
			}
		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
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
			logger.info("testJob reportDataList data : " + reportDataList );
		}
		
		if( reportDataList.size() == 0 ){
			return null;
		}
		
		// jasper 리포트 Data type으로 변경.
		JRDataSource jrcd = new JRBeanCollectionDataSource( reportDataList );
		return jrcd;
	}
}
