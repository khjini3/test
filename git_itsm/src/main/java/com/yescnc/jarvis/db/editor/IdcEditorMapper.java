package com.yescnc.jarvis.db.editor;

import java.util.List;

import com.yescnc.jarvis.entity.db.IdcObjectVO;
import com.yescnc.jarvis.entity.db.IdcEditorAssetVO;
import com.yescnc.jarvis.entity.db.IdcEditorModelVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;

public interface IdcEditorMapper {
	public List<IdcLocationVO> selectLocationList(IdcLocationVO vo);
	public List<IdcLocationVO> selectLocationListAll();
	public List<IdcObjectVO> selectObjectList(String loc_id);
	public List<IdcEditorAssetVO> selectAssetList(String loc_id);
	public List<IdcEditorModelVO> selectModelList();
	public boolean updateLocation(IdcLocationVO vo);
	public boolean setComponent(IdcObjectVO vo);
	public boolean deleteComponent(IdcObjectVO vo);
}
