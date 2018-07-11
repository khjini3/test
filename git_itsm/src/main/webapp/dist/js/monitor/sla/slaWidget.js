define([
    "jquery",
    "underscore",
    "text!views/monitor/slaWidget",
    "css!cs/monitor/slaWidget"
],function(
    $,
    _,
    JSP
){
	var Model = Backbone.Model.extend({
        model: Model,
        url: '/sla/collection',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var SlaSet_Model = Backbone.Model.extend({
        model: SlaSet_Model,
        url: 'settings/sla',
        parse: function(result) {
            return {data: result};
        }
    });	
	
	function SLA(data) {
		this.selector = $("#"+data.id);
		this.alarmCode = data.slaId;
		this.dataColumn = data.slaColumn;
		this.unit = data.slaUnit;
		this.legend = data.slaLegend;
		this.severity = data.slaSeverity;
		this.widgetOrgData = null;
		this.widgetData = null;
		this.widgetData_dataColumn = null;
		this.widgetData_unit = null;
		this.widgetData_legend = null;
		this.widgetData_time = null;
		this.init();
	}	
	
	SLA.prototype = {
		init : function() {
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start: function(data) {
			var that = this;
			this.setData(data);
			this.timer = setInterval(function() {
				that.getData(that.alarmCode, that.dataColumn, that.unit, that.legend, that.severity);
			}, 60000);
		},
		stop: function() {
			 clearInterval(this.timer);
		},
		getTime: function(recordTime) {
			var record = recordTime;
			var sysdate = new Date(record);
			var hours = sysdate.getHours();
			var mins = sysdate.getMinutes();
			hours = hours < 10 ? '0' + hours : hours;
			mins = mins < 10 ? '0' + mins : mins;
			return hours + ":"+mins;
		},
		setData : function(data) {
			var that = this;
			this.getData(data.slaId, data.slaColumn, data.slaUnit, data.slaTitle, data.slaSeverity, function(data) {
				that.renderChart(data, that.dataColumn, that.unit, that.legend, that.severity);
			});
		},
		renderChart: function(data, dataColumn, unit, legend, idx) {
			var _this = this;
			var array = data.toJSON();
			var slaSet_model = new SlaSet_Model();
        	var urlRoot = "";
			
        	_this.widgetOrgData = data;
        	_this.widgetData = array;
        	_this.widgetData_dataColumn = dataColumn;
        	_this.widgetData_unit = unit;
        	_this.widgetData_legend = legend;
        	_this.widgetData_time = array.data.collect_time.substring(11,16);
        	
        	urlRoot = "/settings/sla";
        	window.w2utils.settings.dataType = "RESTFULLJSON";
        	
        	slaSet_model.url = urlRoot + '/searchList'; 
        	
        	//slaSet_model.set("stat_id", array.stat_id);
        	slaSet_model.set("idx", idx);
			
        	slaSet_model.save(null, {
	              success: function(array, response) {
						var that = _this;   
						var data = array.toJSON();
						
//						if(unit == "percent") {
//							_this.renderPieChart(that.widgetOrgData, that.widgetData_dataColumn, that.widgetData_unit, that.widgetData_legend, data);
//						} else {
//							var pieces = [{gte: data.data[0].minor, lte: data.data[0].major-1, color: '#ffde33'}, {gte: data.data[0].major, lte: data.data[0].critical-1, color: '#ff9933'}, {gte: data.data[0].critical, color: '#cc0033'}];
//							var markData = [{yAxis: data.data[0].minor},{yAxis: data.data[0].major},{yAxis: data.data[0].critical}];
//							_this.renderBarChart([{"label": that.widgetData_time, "value": that.widgetData.data[that.widgetData_dataColumn]}], that.widgetData_legend, pieces, markData);
//						}
						var pieces = [{gte: data.data[0].minor, lt: data.data[0].major, color: '#ffde33'}, {gte: data.data[0].major, lt: data.data[0].critical, color: '#ffab33'}, {gte: data.data[0].critical, color: '#ff3333'}];
						var markData = [{yAxis: data.data[0].minor},{yAxis: data.data[0].major},{yAxis: data.data[0].critical}];
						_this.renderBarChart([{"label": that.widgetData_time, "value": that.widgetData.data[that.widgetData_dataColumn]}], that.widgetData_legend, pieces, markData);
	              },
	              error: function(model, response) {

	              }
	          });
		},
		renderPieChart: function(widgetData, dataColumn, unit, legend, severityData) {
			var array = widgetData.toJSON();
			console.log(widgetData);
			var memory = array.data[dataColumn];
			var id = this.selector.find(".sla-bar");
			var count = id.find("canvas").length;
			var widgetColor;
			
			if(memory >= severityData.data[0].critical) {
				widgetColor = ["#FF3333", "#FF3333"];
			} else if(memory >= severityData.data[0].major) {
				widgetColor = ["#FFAB33", "#FFAB33"];
			} else if(memory >= severityData.data[0].minor) {
				widgetColor = ["#FFDE33", "#FFDE33"];
			} else {
				widgetColor = ["#4BBB38", "#4BBB38"];
			}
			
			if(count == 0) {
				id.donut({data: [], color: widgetColor/*['rgb(0,153,203)','rgb(239,211,85)']*/});
				id.append("<div class='slaInfo-chart-mem-per'>"+0.000+"%</div>")
				
			}
			id.donut('update', [
				{value:memory, name: legend}
			]);
			
			this.selector.find(".slaInfo-chart-mem-per").empty();
			this.selector.find(".slaInfo-chart-mem-per").text(memory+"%");
		},
		renderBarChart: function(data, legend, pieces, markData) {
			var id = this.selector.find(".sla-bar");
			var count = id.find("canvas").length;
			if(count == 0) id.slaRealtime({dataLength:7, name: ''/*[legend]*/, type: 'bar', pieces: pieces, markData: markData});
			id.slaRealtime('update', data);
//			if(data[0].value >= markData[2].yAxis ) {
//				$("#slaHeader").css("background-color", "#CC0033");
//			} else if(data[0].value >= markData[1].yAxis ) {
//				$("#slaHeader").css("background-color", "#FF9933");
//			} else if(data[0].value >= markData[0].yAxis ) {
//				$("#slaHeader").css("background-color", "#FFDE33");
//			} else {
//				$("#slaHeader").css("background-color", "#FFFFFF");
//			}
		},
		getData : function(alarmCode, dataColumn, unit, legend, severity) {
			var that = this;
        	var edit_model = new Model();
        	
        	edit_model.url = edit_model.url + '/data'; 
        	edit_model.set("stat_id", that.alarmCode);
			//edit_model.set( that.dataColumn, dataColumn );
        	edit_model.set( "dataColumn", dataColumn );
			
			edit_model.save(null, {
	              success: function(data, textStatus, xhr) {
	            	  that.renderChart(data, that.dataColumn, that.unit, that.legend, that.severity);
	              },
	              error: function(model, response) {}
	          });			
		},
        destroy : function() {
    		this.selector = null;
    		this.alarmCode = null;
    		this.dataColumn = null;
    		this.unit = null;
    		this.legend = null;
    		this.widgetData = null;
    		this.widgetData_dataColumn = null;
    		this.widgetData_unit = null;
    		this.widgetData_legend = null;
    	} 
	}
	
    return SLA;
});