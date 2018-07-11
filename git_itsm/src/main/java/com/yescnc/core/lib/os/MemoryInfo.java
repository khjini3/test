package com.yescnc.core.lib.os;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.base.Preconditions;
import com.yescnc.core.entity.os.GlobalMemoryVO;
import com.yescnc.core.util.date.DateUtil;

import oshi.hardware.GlobalMemory;

@Component
public class MemoryInfo {

	private static final Logger logger = LoggerFactory.getLogger(MemoryInfo.class);

	public Optional<GlobalMemoryVO> getGlobalMemoryInfo() {

		//logger.info("getGlobalMemoryInfo() start at " + LocalTime.now());

		Optional<GlobalMemoryVO> memOption = null;

		try {
			oshi.SystemInfo si = new oshi.SystemInfo();
			GlobalMemoryVO memVo = new GlobalMemoryVO();

			GlobalMemory mem = Preconditions.checkNotNull(si.getHardware().getMemory());
			
			long usedMemory = mem.getTotal()-mem.getAvailable();
			long availableSwapMemory = mem.getSwapTotal()-mem.getSwapUsed();
			
			memVo.setRecordTime(DateUtil.getDbInsertZeroSecond());
			memVo.setTotalMemory(String.valueOf(mem.getTotal()));
			memVo.setAvailableMemory(String.valueOf(mem.getAvailable()));
			memVo.setUsedMemory(String.valueOf(usedMemory));
			memVo.setTotalSwapMemory(String.valueOf(mem.getSwapTotal()));
			memVo.setUsedSwapMemory(String.valueOf(mem.getSwapUsed()));
			memVo.setAvailableSwapMemory(String.valueOf(availableSwapMemory));
			
			memVo.setMemoryUsage(String.format("%.1f", usedMemory/mem.getTotal()* 100d));
			memVo.setSwapUsage(String.format("%.1f", mem.getSwapUsed()/mem.getSwapTotal()* 100d));

			memOption = Optional.ofNullable(memVo);

		} catch (Exception e) {
			e.printStackTrace();
			memOption = Optional.empty();
		}

		return memOption;
	}

}
