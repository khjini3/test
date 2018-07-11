define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample02",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample02(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample02.prototype = {
		init : function() {
			console.log("chartSample02 Widget Init");
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
			this.selector.find(".chart-lt .chart-title").text("Histogram");
			
			target.histogram({name: 'height', color: ['#00ace6']});
			target.histogram('update', 
				{
					value: [8.3, 8.6, 8.8, 10.5, 10.7, 10.8, 11.0, 11.0, 11.1, 11.2, 11.3, 11.4, 11.4, 11.7, 12.0, 12.9, 
						12.9, 13.3, 13.7, 13.8, 14.0, 14.2, 14.5, 16.0, 16.3, 17.3, 17.5, 17.9, 18.0, 18.0, 20.6]
				}
			);
			
		},
		renderChartRT: function() {
			var target = this.selector.find(".chart-rt .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rt .chart-title").text("Animation Bar");
			var label= [];
			var data1 =[];
			var data2 =[];
			for(var i=0;i<100; i++){
				label.push('sample'+(i+1));
				data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
			    data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
			}
			target.anibar({count: 2, color: ['#e1561f','#88be42','#00ace6']});
			target.anibar('update', 
				{label: label, 
				value: [
				     	data1, data2 
				    ]
			});
			
		},
		renderChartLB: function() {
			var target = this.selector.find(".chart-lb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lb .chart-title").text("Horizon Bar");
			target.hbar({count: 3, color: ['#e1561f','#88be42','#00ace6']});
			target.hbar('update', 
				{label: ["sample1","sample2","sample3","sample4","sample5","sample6"], 
				value: [
					     [10, 20, 36, 10, 1, 27], 
					     [10, 20, 36, 10, 9, 27],
					   ]
			});
			
		},
		renderChartRB: function() {
			var target = this.selector.find(".chart-rb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rb .chart-title").text("Horizon Stacked Bar");
			target.hbar({count: 3, stack: true, color: ['#e1561f','#88be42','#00ace6']});
			target.hbar('update', 
				{label: ["sample1","sample2","sample3","sample4","sample5","sample6"], 
				value: [
				     	[10, 20, 36, 10, 10, 27], 
				     	[5, 10, 3, 16, 11, 25], 
				     	[5, 10, 3, 16, 11, 25], 
				    ]
			});
		}
	}
	
    return ChartSample02;
});