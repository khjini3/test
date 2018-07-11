package com.yescnc.core.db.os;

import java.util.ArrayList;
import java.util.List;

import com.yescnc.core.entity.os.CpuInfoVO;
import com.yescnc.core.entity.os.FileSystemInfoVO;
import com.yescnc.core.entity.os.GlobalMemoryVO;
import com.yescnc.core.entity.os.NetworkInterfaceVO;

public interface ResourceMapper {

	// CPU
	int insertCpu(CpuInfoVO cpu);
	ArrayList<CpuInfoVO> getCpuLastOneHour();
	
	//MEMORY
	int insertMemory(GlobalMemoryVO memory);
	ArrayList<GlobalMemoryVO> getMemoryLastOneHour();
	
	//FileSystem
	int insertFileSystem(List<FileSystemInfoVO> file);
	ArrayList<FileSystemInfoVO> getFileSystemLastOneHour();
	
	//Network
	int insertNetwork(List<NetworkInterfaceVO> network);
	ArrayList<NetworkInterfaceVO> getNetworkLastOneHour();
}
