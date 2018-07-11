package com.yescnc.jarvis.entity.db;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

//import lombok.AllArgsConstructor;
import lombok.Data;

@Data
//@AllArgsConstructor
public class TickerVO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer recid;
	private Integer sequenceId;
	private String tickerText;
	private String createDate;
	private String startDate;
	private String endDate;
	private Integer tickerStatus;
	private Integer tickerPriority;
}
