package com.yescnc.core.entity.db;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class WidgetDataVO{

	@JsonProperty(value = "id")
	private int id;
	
	@JsonProperty(value = "userId")
	private int userId;
	
	@JsonProperty(value = "panelName")
	private String panelName;
	
	@JsonProperty(value = "groupId")
	private String groupId;
	
	@JsonProperty(value = "widgetData")
	private List<WidgetList> widgetData;
	
	public WidgetDataVO(){
		super();
	}
	
	public WidgetDataVO(int id, String panelName, String groupId, List<WidgetList> widgetData) {
		this.id = id;
		this.panelName = panelName;
		this.groupId = groupId;
		this.widgetData = widgetData;
	}
	
	@Data
	public static class WidgetList {
		
		@JsonProperty(value = "url")
		private String url;
		
		@JsonProperty(value = "chart")
		private String chart;
		
		@JsonProperty(value = "kpiId")
		private String kpiId;
		
		@JsonProperty(value = "title")
		private String title;
		
		@JsonProperty(value = "dataCol")
		private int dataCol;
		
		@JsonProperty(value = "dataRow")
		private int dataRow;
		
		@JsonProperty(value = "widgetId")
		private String widgetId;
		
		@JsonProperty(value = "dataSizex")
		private int dataSizex;
		
		@JsonProperty(value = "dataSizey")
		private int dataSizey;
		
		@JsonProperty(value = "threshold")
		private int threshold;
		
		@JsonProperty(value = "polling")
		private int polling;
		
		@JsonProperty(value = "streamUrl")
		private String streamUrl;
		
		@JsonProperty(value = "slaId")
		private String slaId;	
		
		@JsonProperty(value = "slaColumn")
		private String slaColumn;	
		
		@JsonProperty(value = "slaUnit")
		private String slaUnit;	
		
		@JsonProperty(value = "slaLegend")
		private String slaLegend;	
		
		@JsonProperty(value = "slaSeverity")
		private String slaSeverity;
		
		public WidgetList(){
			super();
		}
		
		public WidgetList(String url, String chart, String kpiId, String title, int dataCol, int dataRow, String widgetId,
				int dataSizex, int dataSizey,int threshold, int polling,String streamUrl, String slaId, String slaColumn, String slaUnit, String slaLegend, String slaSeverity) {
			this.url = url;
			this.chart = chart;
			this.kpiId = kpiId;
			this.title = title;
			this.dataCol = dataCol;
			this.dataRow = dataRow;
			this.widgetId = widgetId;
			this.dataSizex = dataSizex;
			this.dataSizey = dataSizey;
			this.threshold = threshold;
			this.polling = polling;
			this.streamUrl = streamUrl;
			this.slaId = slaId;	
			this.slaColumn = slaColumn;
			this.slaUnit = slaUnit;
			this.slaLegend = slaLegend;
			this.slaSeverity = slaSeverity;
			
		}
	}
}