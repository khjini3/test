package com.yescnc.project.itsm.itsmUtil.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.MailParseException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.yescnc.project.itsm.db.itsmUtil.ItsmUtilDao;
import com.yescnc.project.itsm.entity.db.EmailVO;
import com.yescnc.project.itsm.entity.db.UpDownVO;

@Service
public class ItsmUtilServiceImpl implements ItsmUtilService {

	@Autowired
	ItsmUtilDao itsmUtilDao;
	
	@Value("${report_path}")
	private String REPORT_PATH;
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	@Override
	public int setSendMail(Map param) {
		int result =100;
		try {
			JavaMailSenderImpl sender = new JavaMailSenderImpl();
			sender.setHost("wsmtp.ecounterp.com");
			sender.setPort(587);
			sender.setUsername("webmaster@yescnc.co.kr");
			sender.setPassword("yes112233");
			
			Properties prop = new Properties();
			prop.setProperty("mail.smtp.auth", "true");
			prop.setProperty("mail.smtp.debug", "true");
			sender.setJavaMailProperties(prop);
			
			MimeMessage message = sender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			
			helper.setSubject((String) param.get("title"));
			helper.setFrom((String) param.get("fromMail"));
			
			List toUserList = (ArrayList) param.get("toUserList");
			String[] toUserArr = new String[toUserList.size()];
			
			List addUserList = (ArrayList) param.get("addUserList");
			
			/*
			 * 받는사람 리스트
			 */
			for(int i=0; i < toUserList.size(); i++){
				Map<String, String> userMap =  (Map<String, String>) toUserList.get(i);
				toUserArr[i] = userMap.get("email");
			}
			
			helper.setTo(toUserArr);
			
			if(addUserList != null){ 
				String[] addUserArr = new String[addUserList.size()];
				
				/*
				 * 참조인이 있다면
				 */
				for(int i=0; i < addUserList.size(); i++){
					Map<String, String> addUserMap =  (Map<String, String>) addUserList.get(i);
					addUserArr[i] = addUserMap.get("email");
				}
				
				helper.setCc(addUserArr);
				
			}
			
			String htmlContent = (String) param.get("body");
			
			/*
			 * 첨부 파일
			 */
			String core_home = "";
			try {
				core_home = resourceLoader.getResource(REPORT_PATH).getURI().getPath();
			} catch (Exception e) {
				e.printStackTrace();
			}
			//System.getProperty("user.dir")
			List<String> fileList = new ArrayList<String>();
			/*
			 * 견적/발주 PDF 문서 꼭 추가해야함.
			 */
			//fileList.add(core_home+"201804231530_16_TestValue.pdf");
			String filePath = (String)param.get("path");
			fileList.add(filePath + (String) param.get("fileName")); //견적/발주 PDF 문서
			/*fileList.add("C:/resources/reports/PO_Sample.pdf");
			fileList.add("C:/resources/reports/test.txt");*/
			
			List<String> attachFileList = (ArrayList<String>) param.get("attachFiles");
			
			if(attachFileList != null){
				/*
				 * 첨부파일이 있다면
				 */
				String path = (String) param.get("path");
				for(String name : attachFileList){
					fileList.add(path + name);
				}
			}
			
			Multipart multipart = new MimeMultipart(); //메일+첨부
			//본문
			MimeBodyPart bodypart = new MimeBodyPart();
			bodypart.setText(htmlContent, "utf-8", "html"); 
			multipart.addBodyPart(bodypart);
			
			String orgFileName = (String) param.get("orgFileName");
			//첨부파일
			for(int i=0; i < fileList.size(); i++){
				String fileName = fileList.get(i);

				File file = new File(fileName);
				/*
				 * 첨부 문서 5M까지만
				 */
				if (file.length() > (1024 * 1024 * 5)) { 
					continue;
				}
				if(i == 0){
					FileInputStream fis = new FileInputStream(filePath+param.get("fileName"));
					FileOutputStream fos = new FileOutputStream(filePath+param.get("orgFileName"));
					int data = 0;
					while((data=fis.read())!=-1) {
					   fos.write(data);
					}
					fis.close();
					fos.close();
					multipart.addBodyPart(getAttachFile(filePath+orgFileName));
				}else{
					multipart.addBodyPart(getAttachFile(fileName));
				}
				
			}
			
			message.setContent(multipart);
			sender.send(message);
			
		} catch (MessagingException e) {
			result = -100;
			throw new MailParseException(e);
		} catch (Throwable e) {
		      e.printStackTrace();
		}

		return result;
	}

	private MimeBodyPart getAttachFile(String fileName) throws Exception {
		MimeBodyPart attachFile = new MimeBodyPart();
		FileDataSource fileDataSource = new FileDataSource(new File(fileName));
		
		try {
			attachFile.setDataHandler(new DataHandler(fileDataSource));
			attachFile.setFileName(javax.mail.internet.MimeUtility.encodeText(fileDataSource.getName(), "UTF-8", "B"));
		} catch (MessagingException e) {
			throw new Exception("[Mail Warning] Fail to send Messages");
		} catch (UnsupportedEncodingException e) {
			throw new Exception("[Mail Warning] Cannot File Encoding");
		}

		return attachFile;
	}

	@Override
	public EmailVO setSendMailHistory(EmailVO emailVo) {
		EmailVO resultVo = new EmailVO();
		resultVo = itsmUtilDao.setSendMailHistory(emailVo);
		return resultVo;
	}

	@Override
	public List<UpDownVO> getDownLoadList(String id) {
		List<UpDownVO> result = itsmUtilDao.getDownLoadList(id);
		return result;
	}

	@Override
	public int setInsertAttachFile(UpDownVO vo) {
		int result = itsmUtilDao.setInsertAttachFile(vo);
		return result;
	}

	@Override
	public int setDeleteFileInfo(UpDownVO vo) {
		int result = itsmUtilDao.setDeleteFileInfo(vo);
		return result;
	}
	
	@Override
	public int updatePreviewDownloadInfo(UpDownVO vo) {
		int result = itsmUtilDao.updatePreviewDownloadInfo(vo);
		return result;
	}	

}
