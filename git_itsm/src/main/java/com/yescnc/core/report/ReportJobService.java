package com.yescnc.core.report;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.quartz.CronTrigger;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import com.yescnc.core.db.report.ReportDao;
import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.job.ReportDirectJob;
import com.yescnc.core.report.job.ReportJob;
import com.yescnc.core.report.job.ReportJobListener;
import com.yescnc.core.util.date.DateUtil;

@Component(value="reportJobService")
public class ReportJobService {
	
	private static final Logger logger = LoggerFactory.getLogger(ReportJobService.class);
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	private final SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");
	
	private final String JOB_NAME 		= "YES_JOB_";	
	private final String TRIGGER_NAME	= "YES_TRIGGER_";
	
	@Resource(name="reportDao")
	private ReportDao reportDao;
	
	@Resource(name="reportDirectJob")
	private ReportDirectJob reportDirectDao;
	
	@Value("${report_path}")
	private String REPORT_PATH;
	
	@Value("${report_delete_interval}")
	private String REPORT_DELETE_INTERVAL;
	
	@Resource(name="RSFactory")
	ReportServiceFactory rsFactory;
	
	private SchedulerFactory schedFact;
	private Scheduler sched;
	
	@PostConstruct
	public void init(){
			
		schedFact = new StdSchedulerFactory();
		
		try {
			sched = schedFact.getScheduler();
			sched.addGlobalJobListener( new ReportJobListener() );
			startSchedule();
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
		
	}
	
	public Scheduler getScheduler(){
		return sched;
	}
	
	/**
	 * 
	 */
	public void startSchedule(){
		
		//환경 변수 가져옴, 환경변수가 우선순위 높음
		String core_home = "";
		try {
			core_home = resourceLoader.getResource(REPORT_PATH).getURI().getPath();
		} catch (Exception e) {
			e.printStackTrace();
		}
//		String os = System.getProperty("os.name");
//		if (os != null && os.startsWith("Windows")) {
//			core_home = "src/main/webapp";
//		} else {
//			core_home = System.getenv("CORE_HOME");
//		}
		
		logger.info("System.getenv('CORE_HOME')@@ > " + core_home );
		
		if( REPORT_DELETE_INTERVAL != null && !"".equals(REPORT_DELETE_INTERVAL) ){
			//ReportServiceFactory.getInstance().setDELETE_INTERVAL(REPORT_DELETE_INTERVAL);
			rsFactory.setDELETE_INTERVAL(REPORT_DELETE_INTERVAL);
		}
		
		//1 DB에서 리포트 정보 LIST 가져옴.
		List<ReportVO> list = reportDao.getReportList();
//		logger.info("ReportService startSchedule list() > " + list.size() );
		
		if( core_home != null){
//			ReportServiceFactory.getInstance().setDEFAULT_DROPPATH(core_home+File.separator+REPORT_PATH);
			rsFactory.setDEFAULT_DROPPATH(core_home+File.separator);
			logger.info("System.getenv('CORE_HOME')@@2 > " + core_home );
		}else{
		
			try {
//				ReportServiceFactory.getInstance().setDEFAULT_DROPPATH( context.getResource(REPORT_PATH).getURI().getPath() );
				rsFactory.setDEFAULT_DROPPATH( context.getResource(REPORT_PATH).getURI().getPath() );
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		
//		ReportVO testVo = new ReportVO();
//		testVo.setScheduling("0");
//		testVo.setReport_id("test1");
//		testVo.setReport_title("test1_title");
//		addSchedule(testVo);
		
		//2. 갯수 만큼 Job 생성 
		for( ReportVO rvo : list ){
			addSchedule(rvo);
		}
		
		try {
			sched.start();
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * Report Job 등록
	 * @param rvo
	 */
	private String addSchedule( ReportVO rvo ){
		
		if( Integer.parseInt( rvo.getReport_view() ) == 0 ){
			logger.info(ReportServiceFactory.SCHEDULE_STOP);
			return ReportServiceFactory.SCHEDULE_STOP;
		}
		
		logger.info(ReportServiceFactory.SCHEDULE_START);
		
		String jobNm = JOB_NAME + rvo.getReport_id();
		
		JobDetail job = new JobDetail(jobNm, Scheduler.DEFAULT_GROUP, ReportJob.class);
		
		JobDataMap jobMap = job.getJobDataMap();
		jobMap.put("param", rvo);
		jobMap.put("jobNm", jobNm);
		jobMap.put("context", context);
		//jobMap.put("droppath", REPORT_RESOURCE_PATH );
		
		try {
			
			String triggerNm = TRIGGER_NAME+rvo.getReport_id();
			
//			String cronExpression = rsFactory.getCronExpression()[0];
			
//			String cronExpression = ReportServiceFactory.getInstance().getCronExpression()[ Integer.parseInt(rvo.getScheduling())];
			String cronExpression = rsFactory.getCronExpression()[ Integer.parseInt(rvo.getScheduling())];
			
			if( rvo.getCron_expression() != null && !rvo.getCron_expression().equals("") ){
				cronExpression = rvo.getCron_expression();
			}
			
			logger.info("ReportService cronExpression() > " + rvo.getReport_title() + " : " + triggerNm + " : " +  cronExpression);
			
			CronTrigger trigger = new CronTrigger(triggerNm, Scheduler.DEFAULT_GROUP, cronExpression);	//스케쥴 타임
			
			// 스케쥴 Start 시간이 있다면 Setting.
			if( rvo.getSchedule_start() != null && !"".equals(rvo.getSchedule_start()) ){
				
				Date startTime =  DateUtil.parse( rvo.getSchedule_start() );
				
				if( System.currentTimeMillis() <  startTime.getTime() ){
					logger.info("ReportService getSchedule_start > " + rvo.getSchedule_start() );
					trigger.setStartTime( startTime );
				}
			}
			
			// 스케쥴 END 시간이 있다면 Setting.
			if( rvo.getSchedule_end() != null && !"".equals(rvo.getSchedule_end()) ){
				logger.info("ReportService getSchedule_end > " + rvo.getSchedule_end() );
				
				Date endTime = DateUtil.parse(  rvo.getSchedule_end() );
				
				if( System.currentTimeMillis() <  endTime.getTime() ){
					trigger.setEndTime(DateUtil.parse(  rvo.getSchedule_end() ));
				}else{
					return ReportServiceFactory.SCHEDULE_FAIL;
				}
			}
			
			
			if( trigger.getStartTime() != null ){
				logger.info("ReportService trigger starttime() > " + formatter.format( trigger.getStartTime() ) );
			}
			
			
			if( trigger.getEndTime() != null ){
				logger.info("ReportService trigger endtime() > " + formatter.format( trigger.getEndTime() ) );
			}
			
			sched.scheduleJob(job, trigger);
			logger.info("ReportService updateJob getJobGroupNames() > " + returnToJobGroupName() );
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			logger.info("ReportService ParseException() > " + e.toString() );
			e.printStackTrace();
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			logger.info("ReportService SchedulerException() > " + e.toString() );
			e.printStackTrace();
			return ReportServiceFactory.SCHEDULE_FAIL;
		}
		
		return ReportServiceFactory.SCHEDULE_SUCCESS;
	}
	
	/**
	 * 스케쥴 추가.
	 * @param rvo
	 * @throws SchedulerException 
	 */
	public String addJob( ReportVO rvo ) throws SchedulerException{
		logger.info("ReportService addJob() > ");
		
		if(  rvo.getReport_id() == null || "".equals( rvo.getReport_id()) ){
			logger.info("ReportService addJob() > report ID NULL");
			return ReportServiceFactory.SCHEDULE_IDNULL;
		}
		
		return addSchedule( rvo );
	}
	
	
	/**
	 * 스케쥴 update ( 삭제하고 다시 등록한다. )
	 * @param rvo
	 * @throws SchedulerException 
	 */
	public String updateJob( ReportVO rvo ) throws SchedulerException{
		logger.info("ReportService updateJob() > ");
		deleteJob( rvo.getReport_id() );	// 삭제
		
		// 스케쥴링이 -1(주기 없음)아니면
		if( Integer.parseInt( rvo.getScheduling() ) != -1 ){
			return addSchedule( rvo );	// 다시 등록
		}
		
		logger.info("ReportService updateJob getJobGroupNames() > " + returnToJobGroupName() );
		return ReportServiceFactory.SCHEDULE_SUCCESS;
	}
	
	/**
	 * 스케쥴 삭제
	 * @param jobName
	 * @throws SchedulerException
	 */
	public void deleteJob( String report_ids )throws SchedulerException{
		try {
			
			String[] ids = report_ids.split(",");
			
			for( int i = 0; i<ids.length; i++){
				String jobName = JOB_NAME+ids[i].toString();
				
				logger.info("ReportService deleteJob() > " + jobName );
				sched.deleteJob(jobName, Scheduler.DEFAULT_GROUP); 
				
			}
			logger.info("ReportService deleteJob getJobGroupNames() > " + returnToJobGroupName() );
			
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			logger.info("ReportService deleteJob SchedulerException() > " + e.toString() );
			e.printStackTrace();
		}
	}

	/**
	 * log용
	 * @param names
	 * @return
	 * @throws SchedulerException 
	 */
	private String returnToJobGroupName() throws SchedulerException{
		
		String[] names = sched.getJobNames(Scheduler.DEFAULT_GROUP);
		
		String returnToName = "";
		for( int i=0; i< names.length; i++ ){
			returnToName+= names[i]+",";
		}
		return returnToName;
	}
	
	
	/**
	 * 스케쥴 등록 하지 않고 직접 실행.
	 * @param rvo
	 */
	public synchronized ReportVO directJob( ReportVO rvo ){
		logger.info("ReportService direct() > ");
		rvo.setReport_id("-1");
		return reportDirectDao.execute(rvo);
	}
}
