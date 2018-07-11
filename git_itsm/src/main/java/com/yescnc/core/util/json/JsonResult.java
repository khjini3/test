package com.yescnc.core.util.json;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class JsonResult {

	private Boolean result = false;
	private String failReason = "";
	private Map<String,Object> data = new HashMap<String,Object>();
	
	public Boolean getResult() {
		return result;
	}
	public void setResult(Boolean result) {
		this.result = result;
	}
	public String getFailReason() {
		return failReason;
	}
	public void setFailReason(String failReason) {
		this.failReason = failReason;
	}
	public Map<String, Object> getData() {
		return data;
	}
	
	public void setData(String key, Object value){
		data.put(key, value);
	}
	
	public Object getData(String key){
		return data.get(key);
	}
	
	public void setData(Map<String, Object> data) {
		this.data = data;
	}
	
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("JsonResult [result=");
		builder.append(result);
		builder.append(", failReason=");
		builder.append(failReason);
		builder.append(", data=");
		builder.append(data);
		builder.append("]");
		return builder.toString();
	}
	
	
}
