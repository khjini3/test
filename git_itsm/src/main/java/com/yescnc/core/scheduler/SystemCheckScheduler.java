package com.yescnc.core.scheduler;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.common.base.Preconditions;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.yescnc.core.entity.db.LoginHistoryVO;
import com.yescnc.core.entity.os.CpuInfoVO;
import com.yescnc.core.entity.os.FileSystemInfoVO;
import com.yescnc.core.entity.os.GlobalMemoryVO;
import com.yescnc.core.entity.os.NetworkInterfaceVO;
import com.yescnc.core.scheduler.task.CoreCpuCheckTask;
import com.yescnc.core.scheduler.task.CoreFileSystemCheckTask;
import com.yescnc.core.scheduler.task.CoreMemoryCheckTask;
import com.yescnc.core.scheduler.task.CoreNetworkCheckTask;
import com.yescnc.core.scheduler.task.SessionTask;

@Service
public class SystemCheckScheduler {

	private static final Logger logger = LoggerFactory.getLogger(SystemCheckScheduler.class);

	@Autowired
	CoreCpuCheckTask coreCpuCheckTask;
	
	@Autowired
	CoreFileSystemCheckTask coreFileSystemCheckTask;
	
	@Autowired
	CoreMemoryCheckTask coreMemoryCheckTask;
	
	@Autowired
	CoreNetworkCheckTask coreNetworkCheckTask;
	
	@Autowired
	SessionTask sessionTask;
	
	public static final int RESOURCE_CPU = 1;
	public static final int RESOURCE_MEMORY = 2;
	public static final int RESOURCE_FILESYSTEM = 3;
	public static final int RESOURCE_NETWORK = 4;
	
	private LoadingCache<Integer, Object> cache;
	
	@PostConstruct
	public void init() {
		cache =	CacheBuilder.newBuilder()
				.maximumSize(5)
				.build(new CacheLoader<Integer, Object>(){

					@Override
					public Object load(Integer arg0) throws Exception {
						// TODO Auto-generated method stub
						return null;
					}
				});
		/*
		coreFileSystemCheckTask.fileSystemCheck(false);
		coreCpuCheckTask.cpuCheck(false);
		coreMemoryCheckTask.memCheck(false);
		coreNetworkCheckTask.networkCheck(false);
		*/
	}
	
	@Scheduled(cron="0 */1 * * * *")
	public void SystemCheck() {
		coreFileSystemCheckTask.fileSystemCheck(true);
	}

	
	@Scheduled(cron="1 */1 * * * *")
	public void cpuCheck() {
		coreCpuCheckTask.cpuCheck(true);
	}

	@Scheduled(cron="2 */1 * * * *")
	public void memCheck() {
		coreMemoryCheckTask.memCheck(true);
	}
	
	@Scheduled(cron="3 */1 * * * *")
	public void networkCheck() {
		coreNetworkCheckTask.networkCheck(true);
	}
	
	@Scheduled(cron="4 */1 * * * *")
	public void sessionCheck() {
		sessionTask.sessionCheck();
	}
	
	public Optional<CpuInfoVO> getRealtimeCpu(){
		Optional<CpuInfoVO> cpu = null;
		try{
			CpuInfoVO  cpuVo = Preconditions.checkNotNull(CpuInfoVO.class.cast(cache.get(SystemCheckScheduler.RESOURCE_CPU)));
			cpu = Optional.ofNullable(cpuVo);
		}catch(Exception e){
			cpu = Optional.empty();
		}
		return cpu;
	}
	
	public Optional<GlobalMemoryVO> getRealtimeMemory(){
		Optional<GlobalMemoryVO> memory = null;
		try{
			GlobalMemoryVO  memoryVo = Preconditions.checkNotNull(GlobalMemoryVO.class.cast(cache.get(SystemCheckScheduler.RESOURCE_MEMORY)));
			memory = Optional.ofNullable(memoryVo);
		}catch(Exception e){
			memory = Optional.empty();
		}
		return memory;
	}
	
	@SuppressWarnings("unchecked")
	public Optional<List<FileSystemInfoVO>> getRealtimeFileSystem(){
		Optional<List<FileSystemInfoVO>> file = null;
		try{
			List<FileSystemInfoVO>  fileVo = Preconditions.checkNotNull((List<FileSystemInfoVO>)cache.get(SystemCheckScheduler.RESOURCE_FILESYSTEM));
			file = Optional.ofNullable(fileVo);
		}catch(Exception e){
			file = Optional.empty();
		}
		return file;
	}
	
	@SuppressWarnings("unchecked")
	public Optional<List<NetworkInterfaceVO>> getRealtimeNetwork(){
		Optional<List<NetworkInterfaceVO>> network = null;
		try{
			List<NetworkInterfaceVO>  networkVo = Preconditions.checkNotNull((List<NetworkInterfaceVO>)cache.get(SystemCheckScheduler.RESOURCE_NETWORK));
			network = Optional.ofNullable(networkVo);
		}catch(Exception e){
			network = Optional.empty();
		}
		return network;
	}
	
	public void setRealtimeResource(Integer id, Object obj){
		cache.put(id, obj);
		logger.info("RealtimeResource set id:"+id +" total_size = "+cache.size());
	}
	
}
