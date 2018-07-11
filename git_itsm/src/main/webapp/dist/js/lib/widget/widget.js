function DataMapper() {
	
}

DataMapper.prototype = {
	getMulti: function(data) { //multi, radar
		if(!data) {
			console.log('no data');
			return;
		}
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		
		return  {count: values.length, name: values, label: data.data.data[keys], value: result}
	},
	getSingle: function(data) {
		// histgram
		if(!data) {
			console.log('no data');
			return;
		}
		
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		
		return  {value: result}
	},
	getPie: function() {
		if(!data) {
			console.log('no data');
			return;
		}
		var key = data.keys;
		var values = data.values;
		var result = data.data.data;
		var dataArr = [];
		result.forEach(function(val) {
			dataArr.push({name : val[key], value: val[values]});
		});
		
		return {data : dataArr};
	},
	/*
	type4: function(data, chartName) {
		if(!data) {
			console.log('no data');
			return;
		}
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		var _chartName = chartName || '';
		values.forEach(function(val) {
			result.push({data:data.data.data[val]});
		});
		
		return {label: data.data.data[keys], value: [{name: _chartName, data: result}]};
	},
	type7: function() {
		//rainfall, multiplexaxis
		//query 두번
	},
	*/
	getGauge: function(data) {
		// gauge, realtime
		if(!data) {
			console.log('no data');
			return;
		}
		var key = data.keys[data.keys.length-1];
		var values = data.values.split(",");
		var value = values[values.length-1];
		
		return {"label": key, "value": value};
	},
}

$.widget("dash.component", {
	options: {
		_polling: 60000,
		polling: {}
	},
	el: {
		_id : null,
		_class : null,
		_chartId : null,
		_article : null,
		_header : null,
		_title : null,
		_button : null, 
		_chart : null,
		_svg : null,
	},
	_create: function() {
		this.setEl();
		//this.setPolling();
	},
	_destroy: function() {
		clearInterval(this.options.polling[this.element.attr('id')]);
	}
	
});

$.extend( $.dash.component.prototype, {
	setPolling: function() {
		var poll = this.options.polling;
		if(poll != undefined) this.options._polling = poll * 60000;
		if(!isNaN(this.options._polling)) this.getData();
	},
	getWidgetData: function(id, threshold) {
		var that = this;
		$.ajax({
            type: "GET",
            url: "/dashboard/widget/data/"+id,
            contentType: "application/json; charset=utf-8",
            success: function(data, textStatus, xhr) {
            	that.setData(data, threshold);
            	
            },
            error: function(data, textStatus, xhr) {
            	
            }
        }).done(function(){
            
        });
	},
	getData: function(kpiId, poll, threshold) {
		//console.log("getData");
		var that = this;
		this.getWidgetData(kpiId, threshold);
		var time = (function() {
			var res = 0;
			if(poll == 0 || poll == -1 ||poll == undefined) {
				res = 60000;
			} else {
				res = that.options._polling * poll;
			}
			
			return res;
		})();
		this.options.polling[this.element.attr("id")] = setInterval(function() {
			that.getWidgetData(kpiId, threshold);
		}, time);
		
	},
	setData: function(data, threshold) {
		var chartType = this.element.parent().attr('data-chart');
		var chartId = this.element.attr("id")+"-chart";
		this.drawChart(chartType, chartId, data, threshold);
	},
	setEl: function() {
		if(this.options.chartType == undefined) return;
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.el._chartId = this.element.attr("id")+"-chart";
		this.el._article = $("<article>");
		this.el._header = $("<div class='header'>");
		this.el._title = $("<h2 class='widget-title'>");
		//this.el._title.text('Title');
		this.el._title.text(this.options.title);
		this.el._button = $("<div id='"+this.el._id+"-btn' class='button-group close-btn'>"); 
		this.el._chart = $("<div id='"+this.el._chartId+"' class='chart'>");
		
		this.element.parent().attr("id", this.el._id+'-parent');
		this.element.parent().addClass("kpi-widget");
		this.render();
	},
	render: function() {
		$(this.element).append(this.el._article);
		$(this.el._article).append(this.el._header);
		$(this.el._header).append(this.el._title);
		$(this.el._header).append(this.el._button);
		$(this.el._article).append(this.el._chart);
		
		//this.start();
		this.drawChart(this.options.chartType, this.el._chartId);
	},
	drawChart: function(chartType, id, data, threshold) {
		switch(chartType) {
			case 'pie' :
				this.drawPie(id, data);
				break;
			case 'line' :
				this.drawLine(id, data, threshold);
				break;
			case 'mpline' :
				this.drawMpline(id, data, threshold);
				break;
			case 'stkline' :
				this.drawStkLine(id, data, threshold);
				break;
			case 'stkarea' :
				this.drawStkArea(id, data, threshold);
				break;
			case 'stkbar' :
				this.drawStkBar(id, data, threshold);
				break;
			case 'bar' :
				this.drawBar(id, data, threshold);
				break;
			case 'hbar' :
				this.drawHbar(id, data, threshold);
				break;
			case 'treemap' :
				this.drawTreemap(id, data);
				break;
			case 'table' :
				this.drawTable(id, data);
			default :
				break;
		}
	},
	drawHbar : function(selector, data) {
		if(data == undefined) {
    		this.setEvent('hbar');
    		return;
    	}
		
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		
		if(count == 0) {
			$("#"+selector).hbar({count: values.length, stack: false, color: ['#e1561f','#88be42','#00ace6']});
			this.setEvent('hbar');
		}
		
		$("#"+selector).hbar('update', 
			{label: data.data.data[keys],
			 name: values,
			 type: 'bar',
			 value: result
		});
	},
	drawMpline : function(selector, data, threshold) {
		if(data == undefined) {
			this.setEvent('markline');
			return;
		}
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		/*
		if(threshold != -1 && threshold != undefined) {
			values.unshift('Threshold');
			var array = [];
			result[0].forEach(function(val) {
				array.push(threshold);
			})
			result.unshift(array);
		}
		*/
		if(count == 0) {
			$("#"+selector).markline({count: values.length, name: values, type: 'line', mark: true, threshold: threshold});
			this.setEvent('markline');
		}
		
		$("#"+selector).markline('update', 
			{label: data.data.data[keys],
			 name: values,
			 type: 'line',
			 value: result
		});
	},
	drawStkLine : function(selector, data, size) {
		if(data == undefined) {
    		this.setEvent('stacked');
    		return;
    	}
		
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		
		if(count == 0) {
			var colors = ['#1952a3', '#1772bc', '#28ba77'];
			$("#"+selector).stacked({count: values.length, name: values, color: colors});
			this.setEvent('stacked');
		}
		
		$("#"+selector).stacked('update', 
			{label: data.data.data[keys],
			 name: values,
			 value: result
		});
	},
	drawStkArea : function(selector, data, size) {
		if(data == undefined) {
    		this.setEvent('stacked');
    		return;
    	}
		
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		
		if(count == 0) {
			var colors = ['#1952a3', '#1772bc', '#28ba77'];
			$("#"+selector).stacked({count: values.length, area: true, name: values, color: colors});
			this.setEvent('stacked');
		}
		
		$("#"+selector).stacked('update', 
			{label: data.data.data[keys],
			 name: values,
			 value: result
		});
	},
	drawStkBar : function(selector, data, size) {
		if(data == undefined) {
    		this.setEvent('stacked');
    		return;
    	}
		
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		
		if(count == 0) {
			//var colors = ['#4873c2', '#97cc34', '#51cace'];
			var colors = ['#9fda3a','#4ac16d','#1fa187','#277f8e','#365c8d'];
			$("#"+selector).stacked({count: values.length, type: 'bar', stack: true, name: values, color: colors});
			this.setEvent('stacked');
		}
		
		$("#"+selector).stacked('update', 
			{label: data.data.data[keys],
			 name: values,
			 type: 'bar',
			 value: result
		});
	},
	drawFunnel : function(selector, data, size) {
		if(data == undefined) {
    		this.setEvent('grid');
    		return;
    	}
	},
	drawTreemap: function(selector, data, size) {
		
		this.setEvent('treemap');
	},
	drawTable: function(selector, data, size) {
    	if(data == undefined) {
    		this.setEvent('grid');
    		return;
    	}
		var columns = [];
    	var result = data.data;
    	result.field.forEach(function(val) {
    		columns.push({field: val, caption: val, size: '10%'});
    	});
    	var count = $("#"+selector).find('table').length
    	if(count == 0) {
    		$("#"+selector).grid({columns: columns, data: result.data});
    	} else {
    		$("#"+selector).grid("update", result.data);
    	}
    	this.setEvent('grid');
	},
	drawPie: function(selector, data) {
		var that = this;
		if(data==undefined) {
			this.setEvent('pie');
			return;
		}
		var key = data.keys;
		var values = data.values;
		var result = data.data.data;
		var dataArr = [];
		result.forEach(function(val) {
			dataArr.push({name : val[key], value: val[values]});
		});
		
		$("#"+selector).pie({data : dataArr});
		this.setEvent('pie');
	},
	drawLine: function(selector, data, threshold) {
		//console.log(data);
		if(data == undefined) {
			this.setEvent('multi');
			return;
		}
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		/*
		if(threshold != -1 && threshold != undefined) {
			values.unshift('Threshold');
			var array = [];
			result[0].forEach(function(val) {
				array.push(threshold);
			})
			result.unshift(array);
		}
		*/
		if(count == 0) {
			$("#"+selector).multi({count: values.length, name: values, type: 'line', threshold: threshold});
			this.setEvent('multi');
		}
		$("#"+selector).multi('update', 
			{label: data.data.data[keys],
			 name: values,
			 type: 'line',
			 value: result
		});
	},
	drawBar: function(selector, data, threshold) {
		//console.log(data);
		if(data == undefined) {
			this.setEvent('multi');
			return;
		}
		var keys = data.keys;
		var values = data.values.split(",");
		var result = [];
		values.forEach(function(val) {
			result.push(data.data.data[val]);
		});
		var count = this.element.find("canvas").length;
		/*
		if(threshold != -1 && threshold != undefined) {
			values.unshift('Threshold');
			var array = [];
			result[0].forEach(function(val) {
				array.push(threshold);
			});
			result.unshift(array);
		}
		*/
		if(count == 0) {
			$("#"+selector).multi({count: values.length, name: values, type: 'bar', threshold: threshold});
			this.setEvent('multi');
		}
		
		$("#"+selector).multi('update', 
			{label: data.data.data[keys],
			 name: values,
			 type: 'bar',
			 value: result
		});
	},
	start: function(polling, threshold) {
//		console.log(polling)
		var kpiId = this.element.parent().attr('data-kpi-id');
		if(kpiId == 0) return;
//		console.log("Component polling start");
		this.getData(kpiId, polling, threshold);
	},
	stop: function() {
//		console.log("Component polling stop");
		clearInterval(this.options.polling[this.element.attr("id")]);
	},
	setEvent : function(callback) {
		var that = this;
		var id = this.element.attr('id');
		//if(this.options.loading) this.start();
		//this.options.loading = undefined;
		/*
		$( "#"+id+"-btn").on( "click", function() {
			gridster.remove_widget($("#"+id+"-parent")); ///
		});
		*/
		$(".button-group.close-btn").unbind("click");
		$("#"+id+"-parent .gs-resize-handle").unbind("click");
		$(".button-group.close-btn").on( "click", function() {
			var parent = $(this).attr("id").replace("btn", "parent")
			gridster.remove_widget($("#"+parent));
		});
		
		$( "#"+id+"-parent .gs-resize-handle" ).on( "click", function() {
			$("#"+id+"-chart")[callback]("resize");
		});
		
		$( "#"+id ).attr('callback', callback);
	}
});

$.widget("dash.custom", {
	options: {
		_polling: 30000,
	},
	el: {
		_id : null,
		_class : null,
		_chartId : null,
		_article : null,
		_header : null,
		_title : null,
		_button : null, 
		_chart : null,
		_svg : null,
	},
	_create: function() {
		this.setEl();
		//this.setPolling();
	},
	_destroy: function() {
		this.custom.stop();
	}
	
});

$.extend( $.dash.custom.prototype, {
	setPolling: function() {
		var poll = this.options.polling;
		if(poll != undefined) this.options._polling = poll * 60000;
		if(!isNaN(this.options._polling)) this.getData();
	},
	getData: function() {
		//console.log("getData");
		var that = this;
		var id = this.el._chartId;
		var chart = this.options.chart;
		var chartType = this.options.chartType;
		var url = this.options.url;
		
		this.options.polling = setInterval(function() {
			//console.log("polling="+id);
			that.drawChart(chartType, id, url);
		}, this.options._polling);
	},
	updateChart: function() {
		
	},
	setData: function() {
		console.log("setData");
	},
	setEl: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.el._chartId = this.element.attr("id")+"-chart";
		this.el._article = $("<article>");
		this.el._header = $("<div class='header'>");
		this.el._title = $("<h2 class='widget-title'>");
		this.el._title.text(this.options.title);
		this.el._button = $("<div id='"+this.el._id+"-btn' class='button-group close-btn'>"); 
		this.el._chart = $("<div id='"+this.el._chartId+"' class='chart'>");
		
		this.element.parent().attr("id", this.el._id+'-parent');
		this.element.parent().addClass("custom-widget");
		this.render();
	},
	render: function() {
		var that = this;
		var url = this.options.url;
		var id = this.el._chartId;
		
		$(this.element).append(this.el._article);
		$(this.el._article).append(this.el._header);
		$(this.el._header).append(this.el._title);
		$(this.el._header).append(this.el._button);
		$(this.el._article).append(this.el._chart);
		
		requirejs([
			url
		], function(
			CustomWidget
		){
			that.custom = new CustomWidget(id);
			if(that.options.loading) that.custom.start();
		});
		
		this.setEvent();
	},
	start: function() {
		/*
		var that = this;
		setTimeout(function() {
			that.custom.start();
		}, 100);
		*/
		this.custom.start();
	},
	stop: function() {
		this.custom.stop();
	},
	setEvent : function(callback) {
		var that = this;
		var id = this.el._id;
		/*
		$( "#"+id+"-btn").on( "click", function() {
			gridster.remove_widget($("#"+id+"-parent")); ///
		});
		*/
		
		$(".button-group.close-btn").on( "click", function() {
			var parent = $(this).attr("id").replace("btn", "parent")
			gridster.remove_widget($("#"+parent));
		});
	
	}
});

$.widget("dash.video", {
	options: {
		
	},
	el: {
		_id : null,
		_class : null,
		_chartId : null,
		_article : null,
		_header : null,
		_title : null,
		_button : null, 
		_chart : null,
		_svg : null,
	},
	_create: function() {
		this.setEl();
		//this.setPolling();
	},
	_destroy: function() {
		this.video.stop();
	}
	
});

$.extend( $.dash.video.prototype, {
	setPolling: function() {

	},
	getData: function() {

	},
	updateChart: function() {
		
	},
	setData: function() {
		
	},
	setEl: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.el._chartId = this.element.attr("id")+"-chart";
		this.el._article = $("<article>");
		this.el._header = $("<div class='header'>");
		this.el._title = $("<h2 class='widget-title'>");
		this.el._title.text(this.options.title);
		this.el._button = $("<div id='"+this.el._id+"-btn' class='button-group close-btn'>"); 
		this.el._chart = $("<video id='"+this.el._chartId+"' class='chart' controls='true'/>");
		
		this.element.parent().attr("id", this.el._id+'-parent');
		this.element.parent().addClass("video-widget");
		this.render();
	},
	render: function() {
		var that = this;
		var url = this.options.url;
		var id = this.el._chartId;
		
		$(this.element).append(this.el._article);
		$(this.el._article).append(this.el._header);
		$(this.el._header).append(this.el._title);
		$(this.el._header).append(this.el._button);
		$(this.el._article).append(this.el._chart);
		
		this.setEvent();
	},
	start: function() {
		this.startVideo();
	},
	stop: function() {
		this.stopVideo();
	},
	startVideo: function() {
		//var id = this.el._chartId;
		var id = $(this.element).attr('id')+"-chart";
		
		var MPD_2S_SEGMENTS = "http://vm2.dashif.org/livesim/testpic_2s/Manifest.mpd";
		this.player = dashjs.MediaPlayer().create();
		this.player.initialize(document.querySelector("#"+id),MPD_2S_SEGMENTS ,true);
		//to disable logging of dash.js 
		this.player.getDebug().setLogToBrowserConsole(false)
	},
	stopVideo: function() {
		if(this.player) this.player.reset();
	},
	setEvent : function(callback) {
		var that = this;
		var id = this.el._id;
		if(this.options.loading) this.start();
		
		$(".button-group.close-btn").on( "click", function() {
			var parent = $(this).attr("id").replace("btn", "parent")
			gridster.remove_widget($("#"+parent));
		});
	
	}
});

$.widget("dash.sla", {
	options: {
		_polling: 30000,
	},
	el: {
		_id : null,
		_class : null,
		_chartId : null,
		_article : null,
		_header : null,
		_title : null,
		_button : null, 
		_chart : null,
		_svg : null,
		_alarmCode: null,
		_dataColumn: null,
		_unit: null,
		_legend: null,
		_severity: null,
	},
	_create: function() {
		this.setEl();
		//this.setPolling();
	},
	_destroy: function() {
		this.sla.stop();
	}
	
});

$.extend( $.dash.sla.prototype, {
	setPolling: function() {
		var poll = this.options.polling;
		if(poll != undefined) this.options._polling = poll * 60000;
		if(!isNaN(this.options._polling)) this.getData();
	},
	getData: function() {
		//console.log("getData");
		var that = this;
		var id = this.el._chartId;
		var chart = this.options.chart;
		var chartType = this.options.chartType;
		var url = this.options.url;
		
		this.options.polling = setInterval(function() {
			//console.log("polling="+id);
			that.drawChart(chartType, id, url);
		}, this.options._polling);
	},
	updateChart: function() {
		
	},
	setData: function() {
		console.log("setData");
	},
	setEl: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.el._chartId = this.element.attr("id")+"-chart";
		this.el._article = $("<article>");
		this.el._header = $("<div class='header' id='slaHeader'>");
		this.el._title = $("<h2 class='widget-title'>");
		this.el._title.text(this.options.title);
		this.el._button = $("<div id='"+this.el._id+"-btn' class='button-group close-btn'>"); 
		this.el._chart = $("<div id='"+this.el._chartId+"' class='chart'>");
		this.el._alarmCode = this.options.alarmCode;
		this.el._dataColumn = this.options.dataColumn;
		this.el._unit = this.options.unit;
		this.el._legend = this.options.legend;
		this.el._severity = this.options.severity;
		
		this.element.parent().attr("id", this.el._id+'-parent');
		this.element.parent().addClass("sla-widget");
		this.render();
	},
	render: function() {
		var that = this;
		var url = this.options.url;
		var id = this.el._chartId;
		var alarmCode = this.el._alarmCode;
		var dataColumn = this.el._dataColumn;
		var unit = this.el._unit;
		var slaId = this.element.parent().attr('data-sla-id');
		var slaColumn = this.element.parent().attr('data-sla-column');
		var slaUnit = this.element.parent().attr('data-sla-unit');	
		var slaLegend = this.element.parent().attr('data-sla-legend');
		var slaSeverity = this.element.parent().attr('data-sla-param-severity');
		var slaArray = new Array();
		var slaInfo = new Object();	
		
		if(slaId == 0 || slaColumn == 0) return;
		
		slaInfo.id = id;
		slaInfo.slaId = slaId;
		slaInfo.slaColumn = slaColumn;
		slaInfo.slaUnit = slaUnit;
		slaInfo.slaLegend = slaLegend;
		slaInfo.slaSeverity = slaSeverity;
		
		slaArray.push(slaInfo);
		
		$(this.element).append(this.el._article);
		$(this.el._article).append(this.el._header);
		$(this.el._header).append(this.el._title);
		$(this.el._header).append(this.el._button);
		$(this.el._article).append(this.el._chart);
		
		requirejs([
			url
		], function(
			SlaWidget
		){
//			that.sla = new SlaWidget(id, slaId, slaColumn);
//			if(that.options.loading) that.sla.start(slaId, slaColumn);
			that.sla = new SlaWidget(slaInfo);
			if(that.options.loading) that.sla.start(slaInfo);			
		});
		
		this.setEvent();
	},
	start: function() {
		/*
		var that = this;
		setTimeout(function() {
			that.custom.start();
		}, 100);
		*/
		var slaId = this.element.parent().attr('data-sla-id');
		var slaColumn = this.element.parent().attr('data-sla-column');
		var slaUnit = this.element.parent().attr('data-sla-unit');
		var slaLegend = this.element.parent().attr('data-sla-legend');	
		var slaSeverity = this.element.parent().attr('data-sla-param-severity');
		var slaArray = new Array();
		var slaInfo = new Object();
		
		if(slaId == 0 || slaColumn == 0 || slaUnit == 0) return;

		slaInfo.slaId = slaId;
		slaInfo.slaColumn = slaColumn;
		slaInfo.slaUnit = slaUnit;
		slaInfo.slaLegend = slaLegend;
		slaInfo.slaSeverity = slaSeverity;
		
		slaArray.push(slaInfo);
		
		this.sla.start(slaInfo);
	},
	stop: function() {
		this.sla.stop();
	},
	setEvent : function(callback) {
		var that = this;
		var id = this.el._id;
		/*
		$( "#"+id+"-btn").on( "click", function() {
			gridster.remove_widget($("#"+id+"-parent")); ///
		});
		*/
		
		$(".button-group.close-btn").on( "click", function() {
			var parent = $(this).attr("id").replace("btn", "parent")
			gridster.remove_widget($("#"+parent));
		});
	
	}
});