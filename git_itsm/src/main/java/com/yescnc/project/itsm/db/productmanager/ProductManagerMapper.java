package com.yescnc.project.itsm.db.productmanager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.project.itsm.entity.db.ProductVO;


public interface ProductManagerMapper {
	
	public List<IdcCodeVO> getProductList();
	
	public List<ProductVO> getModelList(ProductVO vo);
	
	public List<ProductVO> getSearchlList(ProductVO vo);
	
	int insertModel(ProductVO vo);
	
	int updateModel(ProductVO vo);
	
	int deleteIpMulti(Map<String, List<ProductVO>> map);
	
	int deleteModelList(ProductVO vo);
	
	//import //export
	public void csvAsset(HashMap map);
	
	public void csvRackPlace(HashMap map);
}