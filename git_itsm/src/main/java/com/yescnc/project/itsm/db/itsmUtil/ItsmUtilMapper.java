package com.yescnc.project.itsm.db.itsmUtil;

import java.util.List;

import com.yescnc.project.itsm.entity.db.EmailVO;
import com.yescnc.project.itsm.entity.db.UpDownVO;

public interface ItsmUtilMapper {
	public void setSendMailHistory(EmailVO emailVo);
	
	public EmailVO getMailHistory(int mailId);
	
	public List<UpDownVO> getDownLoadList(String id);
	
	public void setInsertAttachFile(UpDownVO vo);
	
	public void setDeleteFileInfo(UpDownVO vo);
	
	public int updatePreviewDownloadInfo(UpDownVO vo);	
}
