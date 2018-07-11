package com.yescnc.core.main.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ResourceController {

	@Autowired
	ServletContext context;

	private static final Logger logger = LoggerFactory.getLogger(ResourceController.class);

	@RequestMapping(value = "/locales/{lang}/{namespace}", produces = "application/json;charset=UTF-8")
	public void getLocale(@PathVariable String lang, @PathVariable String namespace, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		ClassPathResource classPathResource =null;
		InputStream inputStream = null;
		//String target = null;
		
		logger.info("locale-lang=" + lang);
		logger.info("locale-namespace=" + namespace);

		String path = "WEB-INF" + File.separator + "locales" + File.separator + lang + File.separator + namespace
				+ ".json";

		String contextPath = request.getServletContext().getRealPath(File.separator+path);
		
		classPathResource = new ClassPathResource(path);
		
		if(null != contextPath){
			File tmpFile = new File(contextPath);
			if(tmpFile.exists()){
				inputStream = new FileInputStream(tmpFile);
			}
		}else{
			classPathResource = new ClassPathResource(path);
			inputStream = classPathResource.getInputStream();
		}
		
		if(null ==inputStream ){
			throw new Exception ("Locale File not found");
		}
		
		OutputStream outputStream = response.getOutputStream();
		List<String> readLines = IOUtils.readLines(inputStream, "UTF-8");
		IOUtils.writeLines(readLines, null, outputStream, Charset.forName("UTF-8"));

		IOUtils.closeQuietly(inputStream);
		IOUtils.closeQuietly(outputStream);
	}
}
