package com.yescnc.core.util.json;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JSonUtil {
	public static Object parseData(String data, Class cls) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.readValue(data, cls);
		}
		catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String toJSONString(Object obj) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			String a = mapper.writeValueAsString(obj);
			return a;
		}
		catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}


