package com.yescnc.project.itsm.db.itsmUtil;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.project.itsm.entity.db.EmailVO;
import com.yescnc.project.itsm.entity.db.UpDownVO;

@Repository
public class ItsmUtilDaoImpl implements ItsmUtilDao {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public EmailVO setSendMailHistory(EmailVO emailVo) {
		EmailVO resultVo = new EmailVO();
		int result = 100;
		try {
			sqlSession.getMapper(ItsmUtilMapper.class).setSendMailHistory(emailVo);
			resultVo.setInsertHistorySuccess(true);
			resultVo = sqlSession.getMapper(ItsmUtilMapper.class).getMailHistory(emailVo.getMail_id());
			resultVo.setInsertHistorySuccess(true);
			resultVo.setSelectHistorySuccess(true);
		} catch (Exception e) {
			result = -100;
			resultVo.setResult(false);
		}
		
		return resultVo;
	}

	@Override
	public List<UpDownVO> getDownLoadList(String id) {
		List<UpDownVO> result = sqlSession.getMapper(ItsmUtilMapper.class).getDownLoadList(id);
		return result;
	}

	@Override
	public int setInsertAttachFile(UpDownVO vo) {
		int result = 100;
		try {
			sqlSession.getMapper(ItsmUtilMapper.class).setInsertAttachFile(vo);
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}

	@Override
	public int setDeleteFileInfo(UpDownVO vo) {
		int result = 100;
		try {
			sqlSession.getMapper(ItsmUtilMapper.class).setDeleteFileInfo(vo);
		} catch (Exception e) {
			result  = -100;
		}
		return result;
	}
	
	@Override
	public int updatePreviewDownloadInfo(UpDownVO vo) {
		int result = 100;
		try {
			sqlSession.getMapper(ItsmUtilMapper.class).updatePreviewDownloadInfo(vo);
		} catch (Exception e) {
			result  = -100;
		}
		return result;
	}	

}
