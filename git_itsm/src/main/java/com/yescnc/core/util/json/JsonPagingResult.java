package com.yescnc.core.util.json;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class JsonPagingResult extends JsonResult {

	int noOffsetRecord;
	int countPerPage;
	int indexofPage;
	
	public int getNoOffsetRecord() {
		return noOffsetRecord;
	}
	public void setNoOffsetRecord(int noOffsetRecord) {
		this.noOffsetRecord = noOffsetRecord;
	}
	public int getCountPerPage() {
		return countPerPage;
	}
	public void setCountPerPage(int countPerPage) {
		this.countPerPage = countPerPage;
	}
	public int getIndexofPage() {
		return indexofPage;
	}
	public void setIndexofPage(int indexofPage) {
		this.indexofPage = indexofPage;
	}
		
}
