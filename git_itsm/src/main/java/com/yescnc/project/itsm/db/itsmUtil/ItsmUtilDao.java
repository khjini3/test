package com.yescnc.project.itsm.db.itsmUtil;

import java.util.List;

import com.yescnc.project.itsm.entity.db.EmailVO;
import com.yescnc.project.itsm.entity.db.UpDownVO;

public interface ItsmUtilDao {
	public EmailVO setSendMailHistory(EmailVO emailVo);
	
	public List<UpDownVO> getDownLoadList(String id);
	
	public int setInsertAttachFile(UpDownVO vo);
	
	public int setDeleteFileInfo(UpDownVO vo);
	
	public int updatePreviewDownloadInfo(UpDownVO vo);
}
