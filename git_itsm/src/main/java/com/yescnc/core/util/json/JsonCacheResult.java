package com.yescnc.core.util.json;

import java.time.Duration;
import java.time.LocalTime;

public class JsonCacheResult extends JsonResult {

	LocalTime updateAt;
	LocalTime readAt;
	Long period;
	String keys;
	String values;
	Integer threshold;
	Integer polling;
	
	public String getKeys() {
		return keys;
	}

	public Integer getThreshold() {
		return threshold;
	}

	public void setThreshold(Integer threshold) {
		this.threshold = threshold;
	}

	public Integer getPolling() {
		return polling;
	}

	public void setPolling(Integer polling) {
		this.polling = polling;
	}

	public void setKeys(String keys) {
		this.keys = keys;
	}

	public String getValues() {
		return values;
	}

	public void setValues(String values) {
		this.values = values;
	}

	public LocalTime getUpdateAt() {
		return updateAt;
	}

	public void setUpdateAt(LocalTime updateAt) {
		this.updateAt = updateAt;
		this.readAt = updateAt;
	}

	public LocalTime getReadAt() {
		return readAt;
	}

	public void setReadAt(LocalTime readAt) {
		this.readAt = readAt;
	}

	public Long getPeriod() {
		return period;
	}

	public void setPeriod(Long period) {
		this.period = period;
	}

	public Long readDuration() {
		Long duration = 0L;
		if (null != updateAt && null != readAt) {
			duration = Duration.between(readAt, updateAt).getSeconds();
		}
		return duration;
	}
}
