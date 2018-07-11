package com.yescnc.jarvis.modelManager.availableModelList;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;

import com.yescnc.jarvis.idc.contorller.IdcController;

import lombok.Data;

public class AvailableModelList {
	String separator = File.separator;
	
	private org.slf4j.Logger log = LoggerFactory.getLogger(IdcController.class);
	
	@Data
	class ModelVO {
		String modelName = "";
	}
	//System.getProperty("user.dir")
	
	public static void main(String[] args){
		//new AvailableModelList();
	}
	
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	private List<ModelVO> dirList = new ArrayList<ModelVO>();
	
	public AvailableModelList(String pathUrl){
		String source = pathUrl + "dist" + separator + "models";
		
		File dir = new File(source); 
		
		File[] fileList = dir.listFiles(); 

		for(int i = 0 ; i < fileList.length ; i++){

			File folder = fileList[i]; 
			
			//log.debug("ModelList ############## " + folder.getPath());
			
			if(folder.isDirectory()){

				String path = source.replaceAll("\\\\", "/"); 

				String filename = folder.getPath().replaceAll("\\\\", "/").replaceAll(path+"/", ""); 
				
				File file = new File(path+"/"+filename+"/"+filename+".babylon");

				ModelVO modelVO = new ModelVO(); 
				modelVO.modelName = filename;
				if(file.isFile()){
					dirList.add(modelVO); 
				}
				
			}

		}
	}

	public List<ModelVO> ModelList(){
		return dirList;
	}
	
	
	
}
