package com.yescnc.core.db.os;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.os.CpuInfoVO;
import com.yescnc.core.entity.os.FileSystemInfoVO;
import com.yescnc.core.entity.os.GlobalMemoryVO;
import com.yescnc.core.entity.os.NetworkInterfaceVO;

@Repository
public class ResourceDaoImpl implements ResourceDao {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public int insertCpu(CpuInfoVO cpu) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(ResourceMapper.class).insertCpu(cpu);
	}

	@Override
	public ArrayList<CpuInfoVO> getCpuLastOneHour() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int insertMemory(GlobalMemoryVO memory) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(ResourceMapper.class).insertMemory(memory);
	}

	@Override
	public ArrayList<GlobalMemoryVO> getMemoryLastOneHour() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int insertFileSystem(List<FileSystemInfoVO> file) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(ResourceMapper.class).insertFileSystem(file);
	}

	@Override
	public ArrayList<FileSystemInfoVO> getFileSystemLastOneHour() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int insertNetwork(List<NetworkInterfaceVO> network) {
		// TODO Auto-generated method stub
		return sqlSession.getMapper(ResourceMapper.class).insertNetwork(network);
	}

	@Override
	public ArrayList<NetworkInterfaceVO> getNetworkLastOneHour() {
		// TODO Auto-generated method stub
		return null;
	}

}
