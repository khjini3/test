package com.yescnc.core.lib.os;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.yescnc.core.entity.os.CpuInfoVO;
import com.yescnc.core.util.date.DateUtil;

import oshi.hardware.CentralProcessor;
import oshi.hardware.CentralProcessor.TickType;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.util.Util;

@Component
public class CpuInfo {

	private static final int processTopCount = 10;

	private static final Logger logger = LoggerFactory.getLogger(CpuInfo.class);
	
	public Optional<CpuInfoVO> getCpuInfo() {

		//logger.info("getCpuInfo() start at "+ LocalTime.now()); 
		Optional<CpuInfoVO> cpuOption = null;

		try {
			

			CpuInfoVO cpuVo = new CpuInfoVO();
			cpuVo.setRecordTime(DateUtil.getDbInsertZeroSecond());
			
			oshi.SystemInfo si = new oshi.SystemInfo();
			HardwareAbstractionLayer hal = si.getHardware();
			CentralProcessor processor = hal.getProcessor();

			long[] prevTicks = processor.getSystemCpuLoadTicks();
			Util.sleep(3000);
			long[] ticks = processor.getSystemCpuLoadTicks();

			long user = ticks[TickType.USER.getIndex()] - prevTicks[TickType.USER.getIndex()];
			long nice = ticks[TickType.NICE.getIndex()] - prevTicks[TickType.NICE.getIndex()];
			long sys = ticks[TickType.SYSTEM.getIndex()] - prevTicks[TickType.SYSTEM.getIndex()];
			long idle = ticks[TickType.IDLE.getIndex()] - prevTicks[TickType.IDLE.getIndex()];
			long iowait = ticks[TickType.IOWAIT.getIndex()] - prevTicks[TickType.IOWAIT.getIndex()];
			long irq = ticks[TickType.IRQ.getIndex()] - prevTicks[TickType.IRQ.getIndex()];
			long softirq = ticks[TickType.SOFTIRQ.getIndex()] - prevTicks[TickType.SOFTIRQ.getIndex()];
			// STEAL is not support , oshi support 3.5.0
			// long steal = ticks[TickType.STEAL.getIndex()] -
			// prevTicks[TickType.STEAL.getIndex()];
			long totalCpu = user + nice + sys + idle + iowait + irq + softirq;
			/*
			cpuVo.setUser(Float.valueOf(String.format("%.1f", 100d * user / totalCpu)));
			cpuVo.setNice(Float.valueOf(String.format("%.1f", 100d * nice / totalCpu)));
			cpuVo.setSys(Float.valueOf(String.format("%.1f", 100d * sys / totalCpu)));
			cpuVo.setIdle(Float.valueOf(String.format("%.1f", 100d * idle / totalCpu)));
			cpuVo.setIowait(Float.valueOf(String.format("%.1f", 100d * iowait / totalCpu)));
			cpuVo.setIrq(Float.valueOf(String.format("%.1f", 100d * irq / totalCpu)));
			cpuVo.setSoftirq(Float.valueOf(String.format("%.1f", 100d * softirq / totalCpu)));

			cpuVo.setUsage(Float.valueOf(String.format("%.1f", processor.getSystemCpuLoadBetweenTicks() * 100)));
			*/

			cpuVo.setUser(String.format("%.1f", 100d * user / totalCpu));
			cpuVo.setNice(String.format("%.1f", 100d * nice / totalCpu));
			cpuVo.setSys(String.format("%.1f", 100d * sys / totalCpu));
			cpuVo.setIdle(String.format("%.1f", 100d * idle / totalCpu));
			cpuVo.setIowait(String.format("%.1f", 100d * iowait / totalCpu));
			cpuVo.setIrq(String.format("%.1f", 100d * irq / totalCpu));
			cpuVo.setSoftirq(String.format("%.1f", 100d * softirq / totalCpu));

			cpuVo.setUsage(String.format("%.1f", processor.getSystemCpuLoadBetweenTicks() * 100));
			double[] load = processor.getProcessorCpuLoadBetweenTicks();
			List<String> tmpCoreUsage = Lists.newArrayList();
			for (double avg : load) {
				tmpCoreUsage.add(Float.valueOf(String.format("%.1f", avg * 100)).toString().trim());
			}
			cpuVo.setCoreUsage(String.join(",", tmpCoreUsage));
			cpuOption = Optional.ofNullable(cpuVo);
		} catch (Exception e) {
			e.printStackTrace();
			cpuOption = Optional.empty();
		}

		return cpuOption;
	}
}
