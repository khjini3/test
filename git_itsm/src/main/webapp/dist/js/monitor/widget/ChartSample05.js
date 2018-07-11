define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample05",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample05(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample05.prototype = {
		init : function() {
			console.log("chartSample06 Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start : function() {
			this.renderChartTop();
			this.renderChartBottom();
			
		},
		stop : function() {
			
		},
		getData : function() {
			
		},
		setData : function() {
			
		},
		renderChartTop: function() {
			var target = this.selector.find(".chart-top .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-top .chart-title").text("Bar Multiple");
			target.barMultipleYAxis({count: 3, name: ['증발량','강수량','평균온도'], axisLabel: ['°C','ml','ml'], types: ['line', 'bar', 'bar']});
			target.barMultipleYAxis('update', 
				{label: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], 
				value: [[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
						[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
						[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]]
			});
			
		},
		renderChartBottom: function() {
			var target = this.selector.find(".chart-bottom .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-bottom .chart-title").text("Mixed Line and Bar");
			target.multi({count: 4, types: ['bar', 'line', 'bar', 'line']});
			target.multi('update', 
				{label: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], 
				value: [[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
		            	[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		            	[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
		            	[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
				]
			});
			
		},
	}
	
    return ChartSample05;
});