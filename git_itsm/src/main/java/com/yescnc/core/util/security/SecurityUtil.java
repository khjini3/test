package com.yescnc.core.util.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SecurityUtil {
	public String encrypSHA256(String password) throws NoSuchAlgorithmException {
		String sha = "";
		
		MessageDigest sh = MessageDigest.getInstance("SHA-256");
		sh.update(password.getBytes());
		byte byteData[] = sh.digest();
		StringBuffer sb = new StringBuffer();
		
		for(int i = 0; i < byteData.length; i++) {
			sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
		}
		
		sha = sb.toString();
		return sha;
	}

}