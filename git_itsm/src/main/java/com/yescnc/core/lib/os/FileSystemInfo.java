package com.yescnc.core.lib.os;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;
import com.yescnc.core.entity.os.FileSystemInfoVO;
import com.yescnc.core.util.date.DateUtil;

import oshi.software.os.FileSystem;
import oshi.software.os.OSFileStore;
import oshi.software.os.OperatingSystem;

@Component
public class FileSystemInfo {

	private static final Logger logger = LoggerFactory.getLogger(FileSystemInfo.class);

	public Optional<List<FileSystemInfoVO>> getNetworkInterface() {

		//logger.info("getNetworkInterface() start at "+ LocalTime.now()); 
		
		Optional<List<FileSystemInfoVO>> nfOption = null;

		try {
			oshi.SystemInfo si = new oshi.SystemInfo();
			OperatingSystem os = Preconditions.checkNotNull(si.getOperatingSystem());
			FileSystem fileSystem = Preconditions.checkNotNull(os.getFileSystem());

			OSFileStore[] fsArray = Preconditions.checkNotNull(fileSystem.getFileStores());

			List<FileSystemInfoVO> fsList = Lists.newArrayList();
			
			for (OSFileStore fs : fsArray) {
				FileSystemInfoVO fsVo = new FileSystemInfoVO();
				long usable = fs.getUsableSpace();
				long total = fs.getTotalSpace();
				long usage = total-usable;
				
				fsVo.setRecordTime(DateUtil.getDbInsertZeroSecond());
				fsVo.setFileSystem(fs.getName());
				fsVo.setTotalSpace(String.valueOf(total));
				fsVo.setUsableSpace(String.valueOf(usable));
				fsVo.setUsedSpace(String.valueOf(usage));
				fsVo.setUsage(String.format("%.1f", 100d * usage / total));
				fsVo.setMount(fs.getMount());
				fsList.add(fsVo);
			}

			nfOption = Optional.ofNullable(fsList);
		} catch (Exception e) {
			e.printStackTrace();
			nfOption = Optional.empty();
		}
		return nfOption;
	}
}
