package com.yescnc.core.agent.service;

import java.io.File;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.transform.stream.StreamSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.core.entity.db.WorkerVO;
/*import com.yes.collect.runner.CollectRunnable;
import com.yes.collect.worker.WorkerCallableDB;
import com.yes.collect.worker.WorkerCallableFTP;
import com.yes.collect.worker.WorkerCallableSFTP;
import com.yes.collect.worker.WorkerCallableSSH;
import com.yes.collect.worker.WorkerCallableTT;
import com.yes.util.ConfigUtil;
import com.yes.util.DateUtil;*/
import com.yescnc.core.agent.vo.info.CollectInfoList;
import com.yescnc.core.db.agent.CollectDao;
import com.yescnc.core.entity.db.AgentCollectVO;
import com.yescnc.core.entity.db.AgentDBInfoVO;

@Service
public class AgentServiceImpl implements AgentService {
	
	
	@Autowired
	CollectDao collectDao;
	
	@Override
	public List<AgentCollectVO> selectAgentCollectInfoList(){
		// TODO Auto-generated method stub
		return collectDao.selectCollectInfoList();
	}
	
	@Override
	public List<AgentDBInfoVO> selectAgentDBInfoList(){
		// TODO Auto-generated method stub
		return collectDao.selectDBInfoList();
	}
	
	@Override
	public int insertAgentCollectInfoList(AgentCollectVO vo){
		// TODO Auto-generated method stub
		return collectDao.insertCollectInfo(vo);
	}
	
	@Override
	public int insertAgentDBInfoList(AgentDBInfoVO vo){
		// TODO Auto-generated method stub
		return collectDao.insertDBInfo(vo);
	}
	
	@Override
	public int updateAgentCollectInfoList(AgentCollectVO vo){
		// TODO Auto-generated method stub
		return collectDao.updateCollectInfo(vo);
	}
	
	@Override
	public int updateAgentDBInfoList(AgentDBInfoVO vo){
		// TODO Auto-generated method stub
		return collectDao.updateDBInfo(vo);
	}
	
	@Override
	public int deleteAgentCollectInfoList(Integer id){
		// TODO Auto-generated method stub
		AgentCollectVO vo = new AgentCollectVO();
		vo.setIdx(id);
		return collectDao.deleteCollectInfo(vo);
	}
	
	@Override
	public int deleteAgentDBInfoList(Integer id){
		// TODO Auto-generated method stub
		AgentDBInfoVO vo = new AgentDBInfoVO();
		vo.setIdx(id);
		return collectDao.deleteDBInfo(vo);
	}
	
	/**
	 * 설정파일 (xml)읽어서 Data 수집 시작 까지 분리 작업 필요
	 */
	@Override
	public CollectInfoList getAgentCondition(HttpServletRequest req){
		
		String core_home = System.getenv("CORE_HOME");
		String path = "/resources/collect_info.xml";
		
		if( core_home != null && !"".equals(core_home) ){
			path = core_home + File.separator + "resources" + File.separator + "collect_info.xml";
		}else{
			path = req.getServletContext().getRealPath("/resources/"+"collect_info.xml");
		}
		
		//xml 수집설정 확인
		CollectInfoList colList = parsingCollectXml(path);
		
		
		/*if( colList == null )
			return;
		
		String localip = getLocalIp();
		
		// xml 설정 정보를 WorkerCallable 에 세팅. 
		for( WorkerVO wvo : colList.getCollect()){
			
			Callable<WorkerVO> worker = null;
			
			String key = wvo.getType().toLowerCase();
			wvo.setLocalIp( localip );
			
			// collect_info.xml 에 설정된 type별로 worker 생성
			// 추후 프로토콜 추가 되면 이부분에 추가 하면 될듯함
			switch (key) {
				case "db":
					worker = (WorkerCallableDB)context.getBean("workDB",wvo);
					//worker = (WorkerCallableDB2)context.getBean("testBean",wvo);
					break;
					
				case "ftp":
					worker = new WorkerCallableFTP(wvo);	// 개발은 했는데 테스트 못함
					break;
					
				case "sftp":
					worker = (WorkerCallableSFTP)context.getBean("workSFTP",wvo);
					break;
					
				case "ssh":
					worker = (WorkerCallableSSH)context.getBean("workSSH",wvo);
					break;
					
				case "tt":
					worker = (WorkerCallableTT)context.getBean("workTT",wvo);
					break;
	
				default:
					break;
			}
			
			if( worker == null )
				continue;
			
			//고유 Key 생성 ( 키는 period_unit_startTime으로 구성 하며 startTime이 없어도 상관 없음
			//ex) 5__M
			//주기가 같은 것들을 하나의 리스트로 관리 하고 실행 하려했음.
			String workKey = getWorkKey(wvo);
			
			List<Callable<WorkerVO>> worklist = workListMap.get( workKey );
			
			// 없으면 생성해서 add 하고 workListMap 저장.
			if( worklist == null ){
				worklist = new ArrayList<>();
				worklist.add(worker);
				workListMap.put( workKey, worklist);
			}else{
				worklist.add(worker);
			}
			
		}
		
		// 수집할 Woker List별 등록
		if( workListMap.size() > 0 ){
		
			// workListMap ScheduledThreadPoolExecutor에 주기별 등록
			for( String keyPeriod_unit_startTime : workListMap.keySet() ){
		
				// 수집 주기및 delay시간 계산을 위해.
				// mapKey[0]은 주기, mapKey[1]은 단위, mapKey[2]는 시작시간(필수 X)
				String[] mapKey = keyPeriod_unit_startTime.split("\\__");
				
				Long keyPeriod = Long.parseLong( mapKey[0] );				//주기 long값으로
				Long unitMilliSeconds = getUnitMilliSeconds( mapKey[1] );	//단위별 milliseconds 값으로
				
				keyPeriod = keyPeriod * unitMilliSeconds;
				
				long currentTime 	= System.currentTimeMillis();	//현재 시간
				long startDelay 	= 0L;							//시작까지 Delay 시간.
				
				if( mapKey.length == 2 ){	// StartTime 이 없는경우
					//딜레이시간 = 주기 - (현재시간 % 주기) 
					startDelay = keyPeriod-(currentTime%(keyPeriod));
					
				}else{// 시작시간이 있는 경우 Delay시간 계산
					
					long startTimeLong 			= 0L;	//설정된 시작값.
					long startLongHHMMdd 		= 0L;	//시작 시간 
					long currentLongHHMMdd		= 0L;	//현재 시간
					
					String startTime = mapKey[2];
					
					try {
						Calendar calendar = Calendar.getInstance();
						currentLongHHMMdd = getLongHMS(calendar);
						
						calendar.setTime(DateUtil.parse(startTime));
						startTimeLong = calendar.getTime().getTime();
						startLongHHMMdd = getLongHMS(calendar);
						
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					//시작시간 이미 지났으면
					if( currentTime > startTimeLong){
						startDelay = keyPeriod - ( (currentLongHHMMdd+ Math.abs(keyPeriod-startLongHHMMdd) )%keyPeriod );
						
					//시작시간 이전이라면	
					}else{
						startDelay = (startTimeLong-currentTime);
					}
					
				}
				
		        logger.info("YesCollect.startCollect() startDelay > " + startDelay );

		        //주기적으로 exec(ScheduledThreadPoolExecutor) 에서  실행할 Runnable.
		        //CollectRunnable은 Runnable 구현하며 생성자에 넘기는 파라미터는 수집주기가 같은 List
		        CollectRunnable collectRun = new CollectRunnable( workListMap.get(keyPeriod_unit_startTime) );
		        
		        // 주기별로 실행등록 (Runnale, delay시간, 수집주기, 단위 )
		        exec.scheduleAtFixedRate( collectRun, startDelay, keyPeriod, TimeUnit.MILLISECONDS );
			}
		}*/
		return colList;
	}
	public static CollectInfoList parsingCollectXml(String path) {
		
		JAXBContext jc;
		CollectInfoList collectList = null;
		
		try {
			jc = JAXBContext.newInstance(CollectInfoList.class);
			XMLInputFactory xif = XMLInputFactory.newFactory();
	        xif.setProperty(XMLInputFactory.SUPPORT_DTD, false);
	        XMLStreamReader xsr = xif.createXMLStreamReader(new StreamSource(path));

	        Unmarshaller unmarshaller = jc.createUnmarshaller();
	        collectList = (CollectInfoList) unmarshaller.unmarshal(xsr);
			
		} catch (JAXBException | XMLStreamException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return collectList;
	}

	
}