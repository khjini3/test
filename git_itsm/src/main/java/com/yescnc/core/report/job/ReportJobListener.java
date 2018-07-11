package com.yescnc.core.report.job;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.List;

import org.apache.log4j.Logger;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.springframework.context.ApplicationContext;

import com.yescnc.core.db.report.ReportDao;
import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.ReportServiceFactory;

//import com.yescnc.framework.util.common.ApplicationContextUtil;

public class ReportJobListener implements JobListener {
	
	private final SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");
	private final SimpleDateFormat formatterHistroy = new SimpleDateFormat("yyyy-MM-dd HH:mm:00");
	
	private ApplicationContext appcontext;

	private ReportServiceFactory rsFactory;
	
	Logger 	logger = Logger.getLogger(ReportJobListener.class);
	
	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return this.getClass().getName();
	}

	/**
	 * Batch 작업을 실행한 후에 Batch결과 '에러'상태로 저장한다.
	 */
	@Override
	public void jobExecutionVetoed(JobExecutionContext context) {
		// TODO Auto-generated method stub
		logger.info("testJob jobExecutionVetoed" + context.getJobDetail().getKey().getName());

	}

	/**
	 * Batch 작업을 실행하기전에 Batch결과 '수행중'상태로 저장한다.
	 */
	@Override
	public void jobToBeExecuted(JobExecutionContext context) {
		// TODO Auto-generated method stub
		logger.info("testJob jobToBeExecuted" + context.getJobDetail().getKey().getName());

	}

	/**
	 * Batch 작업을 완료한후 Batch결과 '완료'상태로 저장한다.
	 */
	@Override
	public void jobWasExecuted(JobExecutionContext context,	JobExecutionException paramJobExecutionException) {
		
		if(context.getJobDetail().getName().startsWith("YES_JOB_")){
			JobDataMap dataMap = context.getJobDetail().getJobDataMap();
			
			appcontext = (ApplicationContext)dataMap.get("context");
			
			rsFactory = (ReportServiceFactory)appcontext.getBean("RSFactory");
			
			//ApplicationContext appcontext = ApplicationContextUtil.getContext();
			ReportDao reportDao = (ReportDao) appcontext.getBean("reportDao");
			
			ReportVO rvo = (ReportVO)dataMap.get("param");
			
			logger.info("-----------------------------------------------------------------");
			logger.info("testJob jobWasExecuted getKey() : " + context.getJobDetail().getKey().getName());
			logger.info("testJob jobWasExecuted getDescription() : " + context.getJobDetail().getDescription());
			logger.info("testJob jobWasExecuted isStateful() : " + context.getJobDetail().isStateful());
			logger.info("testJob jobWasExecuted isVolatile() : " + context.getJobDetail().isVolatile());
			logger.info("testJob jobWasExecuted getStatus() : " + rvo.getStatus() );
			logger.info("-----------------------------------------------------------------");
			
			//String droppath = dataMap.getString("droppath");
			//String droppath = ReportServiceFactory.getInstance().getDEFAULT_DROPPATH();
			String droppath = rsFactory.getDEFAULT_DROPPATH();
			
			String export_type = ".pdf";
			if(rvo.getExport_type().equals("0")){
				export_type = ".pdf";
			}else if(rvo.getExport_type().equals("1")){
				export_type = ".xlsx";
			}
			rvo.setReserve_str(rvo.getExport_type());
			
			String reportName = formatter.format( context.getFireTime() )+"_"+rvo.getReport_id()+"_"+rvo.getReport_title()+export_type;
			rvo.setReport_name(reportName);
			
			String reportFullPath = droppath + reportName;
			rvo.setMessage( reportFullPath );
			
			rvo.setRun_date( formatterHistroy.format( context.getFireTime() ) );
			
			if( context.getNextFireTime() == null ){
				rvo.setNext_run_date( null );
				rvo.setScheduling("-1");
			}else{
				rvo.setNext_run_date( formatterHistroy.format( context.getNextFireTime() ) );
			}
			
			logger.info("testJob next_run_date : " + rvo.getNext_run_date() );
			
			// 리포트 이력
			reportDao.insertReportHistory(rvo);
			// 리포트 다음 실행 시간
			reportDao.updateNextRunDate(rvo);
			
			rvo.setDelete_interval(rsFactory.getDELETE_INTERVAL() );
			List<ReportVO> list = reportDao.selectReportDeleteHistory(rvo);
			
			for( ReportVO deleteRvo : list){
				
				File deleteFile = new File( deleteRvo.getMessage() );
				
				try{
					if( deleteFile.exists() ){
						if( deleteFile.delete() ){
							//리포트 히스토리 삭제
							reportDao.deleteReportHistory(deleteRvo);
						}else{
							logger.info("File is not exist");
						}
					}
				}catch(Exception e){
					e.printStackTrace();
				}
				
			}
			
			//logger.info("Job 3-2 insertReportHistory >" + " : " + resultInt);
		}else{
			
		}
	}
}
