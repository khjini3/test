package com.yescnc.jarvis.util;

import java.util.HashMap;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/yesUtil")
@RestController
public class UtilController {
	
	@RequestMapping(value="/{cmd}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public String postUtilInfo(@PathVariable("cmd") String cmd,  @RequestBody HashMap map){
		StandardPBEStringEncryptor jasypt = new StandardPBEStringEncryptor();
		jasypt.setPassword("yescnc");
		jasypt.setAlgorithm("PBEWithMD5AndDES");
		
		String result = "";
		
		switch(cmd){
			case "compile":
				result = jasypt.encrypt((String)map.get("msg"));
				break;
			case "decompile":
				result = jasypt.decrypt((String)map.get("msg"));
				break;
		}
		return result;
	}
	
	
}
