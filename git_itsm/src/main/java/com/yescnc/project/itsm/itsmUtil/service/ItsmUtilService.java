package com.yescnc.project.itsm.itsmUtil.service;

import java.util.List;
import java.util.Map;

import com.yescnc.project.itsm.entity.db.EmailVO;
import com.yescnc.project.itsm.entity.db.UpDownVO;

public interface ItsmUtilService {
	public int setSendMail(Map param);
	
	public EmailVO setSendMailHistory(EmailVO emailVo);
	
	public List<UpDownVO> getDownLoadList(String id);
	
	public int setInsertAttachFile(UpDownVO vo);
	
	public int setDeleteFileInfo(UpDownVO vo);
	
	public int updatePreviewDownloadInfo(UpDownVO vo);	
}
