package com.yescnc.jarvis.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.yescnc.core.entity.db.ReportVO;
import com.yescnc.core.report.service.ReportService;
import com.yescnc.project.itsm.entity.db.EmailVO;
import com.yescnc.project.itsm.entity.db.SiteManagerCustomerVO;
import com.yescnc.project.itsm.entity.db.UpDownVO;
import com.yescnc.project.itsm.estimate.service.EstimateService;
import com.yescnc.project.itsm.itsmUtil.service.ItsmUtilService;

@RequestMapping("/itsmUtil")
@RestController
public class ItsmUtilController {
	
	@Value("${preview.download.window.path}")
	private String PREVIEW_DOWNLOAD_WINDOW_PATH;	
	
	@Value("${preview.download.linux.path}")
	private String PREVIEW_DOWNLOAD_LINUX_PATH;	
	
	@Autowired
	EstimateService estimateService;
	
	@Autowired
	ItsmUtilService itsmUtilService;
	
	@Autowired
	ReportService reportService;
	
	@RequestMapping(value = "/getSiteList", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public Map<String, Object> getSiteList(){
		Map<String, Object> result = estimateService.getSiteList();
		return result;
	}
	
	@RequestMapping(value="/selectItemList", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public List<SiteManagerCustomerVO> selectItemList(@RequestBody SiteManagerCustomerVO vo){
		List<SiteManagerCustomerVO> result = estimateService.selectItemList(vo);
		return result; //itemLIst
	}
	
	@RequestMapping(value="/sendMail", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public EmailVO setSendMail(@RequestBody Map<String, Object> param){
		String path = getFilePath();
		param.put("path", path );
		int result = itsmUtilService.setSendMail(param);
		
		EmailVO emailVo = new EmailVO(); //paramVO
		EmailVO resultVo = new EmailVO(); //resultVO
		if(result > 0 ){
			/*
			 * 첨부파일 서버에서 삭제 구간
			 */
			List<String> attachFileList = (ArrayList<String>) param.get("attachFiles");
			if(attachFileList != null){
				for(String name : attachFileList){
					File file = new File(path+File.separator+name);
					if(file.exists()){
						if(file.delete()){
							emailVo.setAttachFileDelete(true);
						}else{
							emailVo.setAttachFileDelete(false);
						}
					}else{
						emailVo.setAttachFileDelete(false);
					}
				}
			}
			/*
			 * 정상적으로 메일을 보냈다면 복사된 파일 삭제
			 */
			
			File copyFile = new File(path+File.separator+param.get("orgFileName"));
			if(copyFile.exists()){
				if(copyFile.delete()){
					//성공
				}else{
					//실표
				}
			}
			
			emailVo.setCmdId((String)param.get("cmdId")); //견적 or 발주 아이디
			emailVo.setCmdType((String)param.get("cmdType")); //견적 or 발주
			emailVo.setFromTarget((String)param.get("fromMail")); //작성자
			emailVo.setToTarget((String)param.get("toTraget")); //받는사람
			emailVo.setAppendTarget((String)param.get("appendTarget")); //참조인
			emailVo.setFileName((String)param.get("fileName")); //첨부 파일 이름
			emailVo.setOrgFileName((String)param.get("orgFileName")); //오리지널 이름
			emailVo.setMailTitle((String)param.get("title")); //제목
			emailVo.setMailBody((String)param.get("body")); //내용
			resultVo.setSendMailSuccess(true);
			resultVo = itsmUtilService.setSendMailHistory(emailVo);
			resultVo.setSendMailSuccess(true);
			resultVo.setResult(true); //최종 완료
		}
		return resultVo; //itemLIst
	}
	
	@RequestMapping(value = "/getDownLoadList/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<UpDownVO> getDownLoadList(@PathVariable("id") String id){
		List<UpDownVO> result = itsmUtilService.getDownLoadList(id);
		return result;
	}
	
	@RequestMapping(value="/FileManager/delete", method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Map<String, String> setDeleteFiles(@RequestBody List<UpDownVO> fileList){
		Map<String, String> resultMap = new HashMap<String, String>();
		String filePath = getFilePath();
		
		for(UpDownVO fileVo : fileList){
			String path = filePath + fileVo.getFileName();
			File file = new File(path);
			if(file.exists()){ //file 존재 여부
				if(file.delete()){
					//삭제 성공 시 DB 삭제
					int result = itsmUtilService.setDeleteFileInfo(fileVo);
					if(result > 0){
						resultMap.put(fileVo.getOrgFileName(), "Success");
					}else{
						resultMap.put(fileVo.getOrgFileName(), "Delete Fail");
					}
				}else{
					//삭제 실패
					resultMap.put(fileVo.getOrgFileName(), "Delete File Fail");
				}
			}else{
				resultMap.put(fileVo.getOrgFileName(), "Not Find");
			}
		}
		
		return resultMap;
	}
	
	@RequestMapping(value="/FileManager/download", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public void downloadFile(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String fileName = (String) request.getParameter("fileName"); //저장되어있는 실제 파일 이름
		String path = getFilePath()+ fileName;
		String orgName = (String) request.getParameter("orgFileName"); //저장되어질 이름

		String docName = null;

		response.setContentType("application/force-download");

		String header = getBrowser(request);

		if (header.contains("MSIE")) {
			docName = URLEncoder.encode(orgName, "UTF-8").replaceAll("\\+", "%20");
			response.setHeader("Content-Disposition", "attachment;filename=" + docName + ";");
		} else if (header.contains("Firefox")) {
			docName = new String(orgName.getBytes("UTF-8"), "ISO-8859-1");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + docName + "\"");
		} else if (header.contains("Opera")) {
			docName = new String(orgName.getBytes("UTF-8"), "ISO-8859-1");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + docName + "\"");
		} else if (header.contains("Chrome")) {
			docName = new String(orgName.getBytes("UTF-8"), "ISO-8859-1");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + docName + "\"");
		}

		InputStream inputstream = null;
		File downFile = null;

		try {
			downFile = new File(path);
			inputstream = new FileInputStream(downFile);
			if (inputstream != null) {
				IOUtils.copy(inputstream, response.getOutputStream()); //file copy
			}
			response.flushBuffer();
			inputstream.close();

		} catch (Exception e) {
			if (inputstream != null) {
				inputstream.close();
			}
			e.printStackTrace();
		} finally {
			inputstream = null;
			downFile = null;
		}
	}
	
	/*
	 * Mail Server에 업로드 후 메일 보낼때 참조 후 전송 끝나면 Mail Server에서 삭제
	 */
	@RequestMapping(value="/mail/fileupload", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public List<Map<String, String>> setMailAttachFile(MultipartHttpServletRequest multipartRequest){
		String filePath = getFilePath();
		
		File dir = new File(filePath);
		
		if(!dir.exists()){//파일 또는 폴더 존재 유무
			//파일 또는 폴더가 없다면 생성
			dir.mkdirs();
		}
		
		Iterator<String> ite = multipartRequest.getFileNames();
		List<Map<String, String>> saveResultList = new ArrayList<Map<String,String>>();
		
		while(ite.hasNext()){
			MultipartFile file = multipartRequest.getFile(ite.next());
			String fileName = file.getOriginalFilename();
			//filePath + File.separator + fileName;
			File saveFile = new File(filePath + File.separator + fileName);
			Map<String, String> saveResultMap = new HashMap<String, String>();
			try {
				file.transferTo(saveFile);
				saveResultMap.put(fileName, "success");
			} catch (IllegalStateException e) {
				e.printStackTrace();
				saveResultMap.put(fileName, "fail");
			} catch (IOException e) {
				e.printStackTrace();
				saveResultMap.put(fileName, "fail");
			}
			
			saveResultList.add(saveResultMap);
		}
		
		return saveResultList;
	}
	
	@RequestMapping(value="/FileManager/upload/{id}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, List<String>> setUploadFiles(@PathVariable("id") String id, MultipartHttpServletRequest multipartRequest){
		Map<String, List<String>> result = new HashMap<String, List<String>>();
		String filePath = getFilePath();
		
		File dir = new File(filePath);
		if(!dir.exists()){
			dir.mkdirs();
		}
		
		List<UpDownVO> fileList = new ArrayList<UpDownVO>();
		Iterator<String> itr = multipartRequest.getFileNames();
		while(itr.hasNext()){
			MultipartFile file = multipartRequest.getFile(itr.next());
			String fileName = file.getOriginalFilename();
			
			try {
				String ext = fileName.substring(fileName.lastIndexOf('.')); //확장자 분리
				String saveFileID = getUuid(); //새롭게 생성한 파일이름
				String saveFileName = saveFileID + ext;
				UpDownVO vo = new UpDownVO();
				vo.setFileId(saveFileID);
				vo.setCmdId(id);
				vo.setOrgFileName(fileName);
				vo.setFileName(saveFileName);
				File serverFile = new File(filePath + File.separator + saveFileName);
				fileList.add(vo);
				file.transferTo(serverFile); //다른이름으로 저장
				
			} catch (Exception e) {
				e.printStackTrace(); 
			}
		} //File 전송 완료
		
		/*
		 * DB 저장
		 */
		List<String> saveResultList = new ArrayList<String>();
		for(UpDownVO fileVo : fileList){
			int saveResult = itsmUtilService.setInsertAttachFile(fileVo);
			if(saveResult > 0){
				saveResultList.add(fileVo.getOrgFileName() + " : success");
			}else{
				saveResultList.add(fileVo.getOrgFileName() + " : fail");
				break;
			}
		}
		
		result.put("fileResultList", saveResultList);
		
		return result;
	}
	
	@RequestMapping(value="/download", method = RequestMethod.GET)
	public synchronized Map<String, Object> downloadReportDirect(HttpServletRequest request, HttpServletResponse response) throws Exception{
		System.out.println("Report request : " + request);
		
		List<UpDownVO> previewInfo = itsmUtilService.getDownLoadList(request.getParameter("condition"));

		Map<String, Object> allData = new HashMap<String,Object>();
		
		String downloadAction = request.getParameter("downloadAction");
		
		if(previewInfo.size() > 0) {
			//allData.put("previewIdx", previewInfo.get(0).getIdx());
			allData.put("previewId", previewInfo.get(0).getCmdId());
			allData.put("message", previewInfo.get(0).getOrgFileName());
			
			if(checkEstimateFile(previewInfo.get(0).getOrgFileName()) && downloadAction.equals("skip")) {
				//reportInfo.setMessage(previewInfo.get(0).getMessage());
				allData.put("findFile", true);
			} else {
				ReportVO reportInfo = reportService.downloadReportDirect(request);
				
				UpDownVO vo = new UpDownVO();
				vo.setFileId(previewInfo.get(0).getFileId());
				vo.setFileId(previewInfo.get(0).getFileName());
				vo.setFileId(previewInfo.get(0).getOrgFileName());
				itsmUtilService.updatePreviewDownloadInfo(vo);
				
				allData.put("findFile", false);
				allData.put("reportInfo", reportInfo);
			}
		} else {
			ReportVO reportInfo = reportService.downloadReportDirect(request);
			
			saveToAttachFileInfoDB(reportInfo.getMessage(), request.getParameter("condition"));
			
			List<UpDownVO> listInfo = itsmUtilService.getDownLoadList(request.getParameter("condition"));
			
			allData.put("previewId", listInfo.get(0).getCmdId());
			allData.put("message", listInfo.get(0).getOrgFileName());
		}
		
		return allData;
	}	
	
	@RequestMapping(value="/preview/{hid}", method = RequestMethod.GET)
    public void generateReport(HttpServletRequest request, HttpServletResponse response,
    							@PathVariable("hid") String hid) throws Exception {
		
		List<UpDownVO> previewInfo = itsmUtilService.getDownLoadList(hid);
		String osName = System.getProperty("os.name").toLowerCase();
		String orgName = null;
		String[] fileName = null;
		
    	String filePath = PREVIEW_DOWNLOAD_LINUX_PATH + previewInfo.get(0).getOrgFileName();
		
		if (previewInfo.get(0).getOrgFileName() != null && osName.contains("win")) {
			filePath = PREVIEW_DOWNLOAD_WINDOW_PATH + previewInfo.get(0).getOrgFileName();
		}

		if (osName != null && osName.contains("win")) {
			fileName = filePath.split("/");
			orgName = fileName[2].toString();
		} else {
			fileName = filePath.split("/");
			orgName = fileName[4].toString();
		}

        InputStream inputstream = null;
		File downFile = null;
		
		try{
			downFile = new File(filePath);
			
			if( !downFile.exists() )
				return;
			
			inputstream = new FileInputStream(downFile);
			
			byte[] data = new byte[(int)downFile.length()];
			
			int i = 0, j = 0;

			while((i = inputstream.read()) != -1) {
				data[j] = (byte)i;
				j++;
			}
	        
	        String docName = null;
			String header = getBrowser(request);

			if (header.contains("MSIE")) {
				docName = URLEncoder.encode(orgName, "UTF-8").replaceAll("\\+", "%20");
				response.setHeader("Content-Disposition", "inline; filename=" + docName + ";");
			} else if (header.contains("Firefox")) {
				docName = new String(orgName.getBytes("UTF-8"), "ISO-8859-1");
				response.setHeader("Content-Disposition", "inline; filename=\"" + docName + "\"");
			} else if (header.contains("Opera")) {
				docName = new String(orgName.getBytes("UTF-8"), "ISO-8859-1");
				response.setHeader("Content-Disposition", "inline; filename=\"" + docName + "\"");
			} else if (header.contains("Chrome")) {
				docName = new String(orgName.getBytes("UTF-8"), "ISO-8859-1");
				response.setHeader("Content-Disposition", "inline; filename=\"" + docName + "\"");
			}
    		
			response.setContentType("application/pdf");
			
	        response.setContentLength(data.length);

			response.setHeader("Content-Transfer-Encoding", "binary;");

			response.setHeader("Pragma", "no-cache;");

			response.setHeader("Expires", "-1;");
	
	        response.getOutputStream().write(data);
	        response.getOutputStream().flush();
        
		}catch(Exception e){
			if( inputstream != null ){
				inputstream.close();
			}
			e.printStackTrace();
		}finally{
			inputstream.close(); // Fixed by GI HWAN for SonarQube. 2018-06-18
			downFile = null;
		}
    }	
	
    private boolean checkEstimateFile(String fileName) {
    	String osName = System.getProperty("os.name").toLowerCase();
    	String filePath = PREVIEW_DOWNLOAD_LINUX_PATH + fileName;
		
		if (fileName != null && osName.contains("win")) {
			filePath = PREVIEW_DOWNLOAD_WINDOW_PATH + fileName;
		}
		
        File file = new File(filePath);
        return file.isFile();
    }
    
	private void saveToAttachFileInfoDB(String filePath, String id) {
		String osName = System.getProperty("os.name").toLowerCase();		
		String[] tempFileName = filePath.split("/");
		String fileName = null;
		
		if (osName != null && osName.contains("win")) {
			fileName = tempFileName[2].toString();
		} else {
			fileName = tempFileName[4].toString();
		}		
		
		String ext = fileName.substring(fileName.lastIndexOf('.')); //확장자 분리
		String saveFileID = getUuid(); //새롭게 생성한 파일이름
		String saveFileName = saveFileID + ext;
		UpDownVO vo = new UpDownVO();
		vo.setFileId(saveFileID);
		vo.setCmdId(id);
		vo.setOrgFileName(fileName);
		vo.setFileName(saveFileName);		
		
		itsmUtilService.setInsertAttachFile(vo);
	} 	
	
	/*
	 * Mail 첨부 파일은 업로드 후 메일 보내고 난 후 지움
	 * Mail 첨부 파일은 파일명을 그대로 보내야 하기 때문에 컴파일 하지 않기 때문에 폴더를 달리함.
	 */
	private String getFilePath(){
		String path = "";
		String osName = System.getProperty("os.name").toLowerCase();
		
		path = PREVIEW_DOWNLOAD_LINUX_PATH;
		
		if (osName != null && osName.contains("win")) {
			path = PREVIEW_DOWNLOAD_WINDOW_PATH;
		}
		
		return path;
	}
	
	private String getBrowser(HttpServletRequest request) {

		String header = request.getHeader("User-Agent");

		if (header.contains("MSIE")) {
			return "MSIE";
		} else if (header.contains("Chrome")) {
			return "Chrome";
		} else if (header.contains("Opera")) {
			return "Opera";
		}
		return "Firefox";
	}
	
	// uuid생성 메소드
	public static String getUuid() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

}
