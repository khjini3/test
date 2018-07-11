package com.yescnc.jarvis.db.editor;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.yescnc.jarvis.entity.db.IdcEditorAssetVO;
import com.yescnc.jarvis.entity.db.IdcEditorModelVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.jarvis.entity.db.IdcObjectVO;

@Repository
public class IdcEditorDaoImpl implements IdcEditorDao {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<IdcLocationVO> selectLocationList(IdcLocationVO vo) {
		List<IdcLocationVO> result = sqlSession.getMapper(IdcEditorMapper.class).selectLocationList(vo);
		System.out.println("### EditorDaoImpl => " + result.toString());
		return result;
	}
	
	@Override
	public List<IdcLocationVO> selectLocationListAll() {
		List<IdcLocationVO> result = sqlSession.getMapper(IdcEditorMapper.class).selectLocationListAll();
		System.out.println("### EditorDaoImpl => " + result.toString());
		return result;
	}

	@Override
	public List<IdcObjectVO> selectObjectList(String loc_id) {
		List<IdcObjectVO> result = sqlSession.getMapper(IdcEditorMapper.class).selectObjectList(loc_id);
		return result;
	}
	
	@Override
	public List<IdcEditorAssetVO> selectAssetList(String loc_id) {
		List<IdcEditorAssetVO> result = sqlSession.getMapper(IdcEditorMapper.class).selectAssetList(loc_id);
		return result;
	}
	
	@Override
	public List<IdcEditorModelVO> selectModelList() {
		List<IdcEditorModelVO> result = sqlSession.getMapper(IdcEditorMapper.class).selectModelList();
		return result;
	}
	
	@Transactional
	@Override
	public boolean saveObjectList(ArrayList<IdcObjectVO> voList) {

		for (IdcObjectVO vo : voList) {
			boolean result = false;
			if ("LOCATION".equalsIgnoreCase(vo.getComp_type())) {
				IdcLocationVO locVo = new IdcLocationVO();
				// locVo.setParent_loc_id(Integer.parseInt(vo.getParent_loc_id()));
				locVo.setLoc_id(Integer.parseInt(vo.getComp_id()));
				locVo.setPosition_x(vo.getPosition_x());
				locVo.setPosition_y(vo.getPosition_y());
				locVo.setPosition_z(vo.getPosition_z());
				locVo.setScale_x(vo.getScale_x());
				locVo.setScale_y(vo.getScale_y());
				locVo.setScale_z(vo.getScale_z());
				locVo.setRotation_x(vo.getRotation_x());
				locVo.setRotation_y(vo.getRotation_y());
				locVo.setRotation_z(vo.getRotation_z());
				locVo.setIs_pickable(vo.getIs_pickable());
				locVo.setOpacity(vo.getOpacity());
				locVo.setIs_tooltip(vo.getIs_tooltip());
				locVo.setCamera(vo.getCamera());
				result = sqlSession.getMapper(IdcEditorMapper.class).updateLocation(locVo);
			} else if ("ASSET".equalsIgnoreCase(vo.getComp_type())) {
				if ("DELETE".equalsIgnoreCase(vo.getObjectState())) {
					result = sqlSession.getMapper(IdcEditorMapper.class).deleteComponent(vo);
				} else {
					result = sqlSession.getMapper(IdcEditorMapper.class).setComponent(vo);
				}
			}
		}

		return true;
	}

}
