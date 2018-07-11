package com.yescnc.core.lib.os;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;
import com.yescnc.core.entity.os.OperatingSystemVO;
import com.yescnc.core.entity.os.ProcessInfoVO;

import oshi.hardware.ComputerSystem;
import oshi.hardware.Firmware;
import oshi.hardware.GlobalMemory;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.software.os.OSProcess;
import oshi.software.os.OperatingSystem;
import oshi.software.os.OperatingSystem.ProcessSort;
import oshi.util.FormatUtil;

@Component
public class SystemInfo {

	private static final Logger logger = LoggerFactory.getLogger(SystemInfo.class);
	
	private static final int processTopCount = 10;

	public Optional<OperatingSystemVO> getHwInfo() {

		//logger.info("getNetworkInterface() start at "+ LocalTime.now()); 
		
		Optional<OperatingSystemVO> osOption = null;

		try {
			oshi.SystemInfo si = new oshi.SystemInfo();
			OperatingSystemVO os = new OperatingSystemVO();

			ComputerSystem cs = Preconditions.checkNotNull(si.getHardware().getComputerSystem());
			os.setMenufacturer(cs.getManufacturer());
			os.setModel(cs.getModel());
			os.setSerialNumber(cs.getSerialNumber());

			Firmware fw = Preconditions.checkNotNull(cs.getFirmware());
			os.setFirmwareName(fw.getName());
			os.setFirmwareVersion(fw.getVersion());
			os.setFirmwareReleaseDate(fw.getReleaseDate());

			osOption = Optional.ofNullable(os);
		} catch (Exception e) {
			osOption = Optional.empty();
		}

		return osOption;
	}

	/*
	 * Top {processTopCount} of Process
	 * Sort : CPU Usage
	 */
	public Optional<List<ProcessInfoVO>> getProcessMemoryInfo() {
		Optional<List<ProcessInfoVO>> processOption = null;

		try {
			oshi.SystemInfo si = new oshi.SystemInfo();

			HardwareAbstractionLayer hal = si.getHardware();
			OperatingSystem os = si.getOperatingSystem();

			GlobalMemory globalMem = hal.getMemory();

			List<OSProcess> procs = Arrays.asList(os.getProcesses(this.processTopCount, ProcessSort.CPU));
			List<ProcessInfoVO> netList = Lists.newArrayList();

			for(int i =0 ; i < procs.size() && i < this.processTopCount ; i++){
				OSProcess p = procs.get(i);
				ProcessInfoVO procVo = new ProcessInfoVO();
				procVo.setProcessId(p.getProcessID());
				procVo.setName(p.getName());
				procVo.setCpuPercent(100d * (p.getKernelTime()+p.getUserTime())/p.getUpTime());
				procVo.setMemPercent(100d * p.getResidentSetSize() / globalMem.getTotal());
				procVo.setVirtualMemAsLong(p.getVirtualSize());
				procVo.setVirtualMemAsUnit(FormatUtil.formatBytes(p.getVirtualSize()));
				procVo.setRssAsLong(p.getResidentSetSize());
				procVo.setRssAsUnit(FormatUtil.formatBytes(p.getResidentSetSize()));
				netList.add(procVo);
			}
			processOption = Optional.ofNullable(netList);

		} catch (Exception e) {
			processOption = Optional.empty();
		}

		return processOption;
	}
}
