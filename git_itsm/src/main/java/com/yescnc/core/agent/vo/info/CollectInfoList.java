package com.yescnc.core.agent.vo.info;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import com.yescnc.core.entity.db.WorkerVO;

@XmlType
@XmlRootElement(name = "collectList")
public class CollectInfoList {

	private WorkerVO[] collect;

	@XmlElement(name = "collect")
	public WorkerVO[] getCollect() {
		return collect;
	}

	public void setCollect(WorkerVO[] collect) {
		this.collect = collect;
	}

}
