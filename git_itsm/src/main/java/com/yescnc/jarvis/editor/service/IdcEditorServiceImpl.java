package com.yescnc.jarvis.editor.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yescnc.jarvis.db.editor.IdcEditorDao;
import com.yescnc.jarvis.entity.db.IdcObjectVO;
import com.yescnc.jarvis.entity.db.IdcEditorAssetVO;
import com.yescnc.jarvis.entity.db.IdcEditorModelVO;
import com.yescnc.jarvis.entity.db.IdcLocationVO;
import com.yescnc.core.util.json.JsonResult;

@Service
public class IdcEditorServiceImpl implements IdcEditorService {

	@Autowired
	IdcEditorDao editorDao;
	
	@Override
	public List<IdcLocationVO> selectLocationList(IdcLocationVO vo) {
		List<IdcLocationVO> result = editorDao.selectLocationList(vo);
		return result;
	}
	
	@Override
	public List<IdcLocationVO> selectLocationListAll() {
		List<IdcLocationVO> result = editorDao.selectLocationListAll();
		return result;
	}

	@Override
	public List<IdcObjectVO> selectObjectList(String loc_id) {
		List<IdcObjectVO> result = editorDao.selectObjectList(loc_id);
		return result;
	}
	
	@Override
	public List<IdcEditorAssetVO> selectAssetList(String loc_id) {
		List<IdcEditorAssetVO> result = editorDao.selectAssetList(loc_id);
		return result;
	}
	
	@Override
	public List<IdcEditorModelVO> selectModelList() {
		List<IdcEditorModelVO> result = editorDao.selectModelList();
		return result;
	}
	
	@Override
	public JsonResult saveObjectList(ArrayList<IdcObjectVO> voList) {
		JsonResult result = new JsonResult();
		
		boolean bRsult = false;
		String failReason = "";
		try {
			bRsult = editorDao.saveObjectList(voList);
		} catch (Exception e) {
			System.out.println("## exception => " + e);
			bRsult = false;
			failReason = getSqlErrorMessageFromExeption(e);
		}
		
		result.setResult(bRsult);
		result.setFailReason(failReason);
		
		return result;
	}
	
	private String getSqlErrorMessageFromExeption(Exception exception) {
		String errMsg = exception.getMessage();
		String[] splitLine = errMsg.split("\r\n|\n");
		for (String line : splitLine) {
			if (line.indexOf("### Cause: ") >= 0) {
				String[] split = line.split(": ");
				if (split.length >= 3) {
					return split[2];
				}
				break;
			}
		}

		return "Unknown Error";
	}

}
