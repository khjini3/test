define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample07",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample01(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample01.prototype = {
		init : function() {
			console.log("chartSample07 Widget Init");
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
			clearInterval(this.timer);
		},
		getData : function() {
			
		},
		setData : function() {
			
		},
		renderChartLT: function() {
			var target = this.selector.find(".chart-lt .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lt .chart-title").text("Donut Chart");
			target.donut({count: 5, color: ['#4b74e0','#4164c2','#3855a5','#25396e','#5684fe' ]});
			target.donut('update', 
				[{value:1.5, name:'sample1'},
                {value:1.5, name:'sample2'},
                {value:4, name:'sample3'},
                {value:2, name:'sample4'},
                {value:3, name:'sample5'}]);
			
		},
		renderChartRT: function() {
			var target = this.selector.find(".chart-rt .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rt .chart-title").text("Pie Chart");
			target.pie({count: 3});
			target.pie('update', 
				[{value:15, name:'sample1'},
                {value:310, name:'sample2'},
                {value:23, name:'sample3'},
                {value:135, name:'sample4'},
                {value:155, name:'sample5'}]);
			
		},
		renderChartLB: function() {
			var target = this.selector.find(".chart-lb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lb .chart-title").text("Funnel Chart");
			target.funnel({count: 5, color: ['#1884f7', '#008dd8', '#e3f374', '#3bc200', '#ff8763']});
			target.funnel('update', 
					[{value:100, name:'sample1'},
		                {value:80, name:'sample2'},
		                {value:60, name:'sample3'},
		                {value:40, name:'sample4'},
		                {value:20, name:'sample5'}]);
			
		},
		renderChartRB: function() {
			var target = this.selector.find(".chart-rb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rb .chart-title").text("Gauge Chart");
			target.gauge({name: '비지니스 색인',colors: [[0.6,'#0044b8'],[0.8,'#7df111'],[1,'#fcd15d']]});
			target.gauge('update', 
					[{value: 0, name: '완료율'}]);
			this.timer = setInterval(function() {
	        		target.gauge('update', [{name: '완료율', "value": (Math.random() * 100).toFixed(2) - 0}]);
	        }, 1000);
		}
	}
	
    return ChartSample01;
});