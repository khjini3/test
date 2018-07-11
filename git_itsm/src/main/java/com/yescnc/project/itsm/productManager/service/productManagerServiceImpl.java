package com.yescnc.project.itsm.productManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.project.itsm.db.productmanager.ProductManagerDao;
import com.yescnc.project.itsm.entity.db.ProductVO;

@Service
public class productManagerServiceImpl implements ProductManagerService {

	@Autowired
	ProductManagerDao productManagerDao;
	
	@Override
	public List<IdcCodeVO> getProductList(){
		List<IdcCodeVO> result = productManagerDao.getProductList();
		return result;
	}	
	
	@Override
	public List<ProductVO> getModelList(ProductVO vo){
		List<ProductVO> result = productManagerDao.getModelList(vo);
		return result;
	}
	
	@Override
	public List<ProductVO> getSearchlList(ProductVO vo){
		List<ProductVO> result = productManagerDao.getSearchlList(vo);
		return result;
	}
	
	@Override
	public int insertModel(ProductVO vo) {
		return productManagerDao.insertModel(vo);
	}
	
	@Override
	public int updateModel(ProductVO vo) {
		return productManagerDao.updateModel(vo);
	}
	
	@Override
	public int deleteIpMulti(Map<String, List<ProductVO>> map) {
		return productManagerDao.deleteIpMulti(map);
	}
	
	@Override
	public int deleteModelList(ProductVO vo) {
		return productManagerDao.deleteModelList(vo);
	}
	
	//import // export
	@Override
	public Integer csvAsset(HashMap map){
		return productManagerDao.csvAsset(map);
	}
	
	@Override
	public Integer csvRackPlace(HashMap map) {
		return productManagerDao.csvRackPlace(map);
	}
	
}
