package com.yescnc.project.itsm.productManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.project.itsm.entity.db.ProductVO;

public interface ProductManagerService {
	
	public List<IdcCodeVO> getProductList();	
	
	public List<ProductVO> getModelList(ProductVO vo);
	
	public List<ProductVO> getSearchlList(ProductVO vo);
	
	public int insertModel(ProductVO vo);
	
	public int updateModel(ProductVO vo);
	
	public int deleteIpMulti(Map<String, List<ProductVO>> map);
	
	public int deleteModelList(ProductVO vo);
	
	//import // export
	public Integer csvAsset(HashMap map);
	
	public Integer csvRackPlace(HashMap map);
}
