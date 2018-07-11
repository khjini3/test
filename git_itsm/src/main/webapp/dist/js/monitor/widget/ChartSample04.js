define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample04",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample04(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample04.prototype = {
		init : function() {
			console.log("chartSample04 Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start : function() {
			this.renderChartLT();
			this.renderChartRT();
			this.renderChartLB();
			this.renderChartRB();
		},
		stop : function() {
			
		},
		getData : function() {
			
		},
		setData : function() {
			
		},
		renderChartLT: function() {
			var target = this.selector.find(".chart-lt .chart-area");
			var count = target.find("canvas").length;
        	var base = +new Date(1968, 9, 3);
        	var oneDay = 24 * 3600 * 1000;
        	var date = [];

        	var data = [Math.random() * 300];

        	for (var i = 1; i < 20000; i++) {
        	    var now = new Date(base += oneDay);
        	    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        	    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        	}
			
			
			this.selector.find(".chart-lt .chart-title").text("Line Area");
			target.lineArea({count: 1, name: ['아날로그 데이터']});
			target.lineArea('update', 
				{label: date, 
				value: [data]
			});
			
		},
		renderChartRT: function() {
			var target = this.selector.find(".chart-rt .chart-area");
			var count = target.find("canvas").length;
			var dataAxis = [];
        	var data = [];
			for(var i=1;i<16;i++){
				dataAxis.push("d"+i);
				data.push(Math.round(Math.random()*300 + 10));
			}
        	var yMax = 500;
        	var dataShadow = [];

        	for (var i = 0; i < data.length; i++) {
        	    dataShadow.push(yMax);
        	}
			
			this.selector.find(".chart-rt .chart-title").text("Bar Gradient");
			target.barGradient({count: 1, color:['#28ba77','#0f75c6']});
			target.barGradient('update', 
				{label: dataAxis, 
				value: [dataShadow, data]
			});
			
		},
		renderChartLB: function() {
			var target = this.selector.find(".chart-lb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lb .chart-title").text("Line Temperature");
			target.lineTemperature({count: 2});
			target.lineTemperature('update', 
				{label: ['월','화','수','목','금','토','일'], 
				value: [[11, 11, 15, 13, 12, 13, 10], [1, -2, 2, 5, 3, 2, 0]]
			});
			
		},
		renderChartRB: function() {
			var target = this.selector.find(".chart-rb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rb .chart-title").text("Bar Ticks");
			target.barTicks({count: 1, color: ['#FF786a'], name: ['access']});
			target.barTicks('update', 
				{label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
				value: [[10, 52, 200, 334, 390, 330, 220]]
			});
		}
	}
	
    return ChartSample04;
});