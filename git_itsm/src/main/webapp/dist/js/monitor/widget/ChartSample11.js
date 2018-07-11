define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample11",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample11(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample11.prototype = {
		init : function() {
			console.log("chartSample11 Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start : function() {
			this.renderChartLeft();
//			this.renderChartLeftBottom();
			this.renderChartRight();
		},
		stop : function() {
			clearInterval(this.polling);
		},
		getData : function() {
			
		},
		setData : function() {
			
		},
		/*renderChartLeft: function() {
			var target = this.selector.find(".chart-left-top .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-left-top .chart-title").text("Treemap");
			
			var data = [
				{
			        "value": 19745536,
			        "name": "/"
			    },
			    {
			        "value": 1929756,
			        "name": "/dev",
			    },
			    {
			        "value": 1752092,
			        "name": "/run"
			    },
			    {
			        "value": 18256098,
			        "name": "/home",
			        "children": [{value: 20, name: "admin"},{value: 20, name: "user1"},{value: 20, name: "user2"},{value: 20, name: "user3"},{value: 20, name: "user4"}]
			    },
			    {
			        "value": 1362260,
			        "name": "/boot"
			    }
			];
			var colors = ["#004c69", "#0078a4", "#02afef", "#78cceb", "#b1daea"];
			target.treemap({name:'Disk Usage', color: colors});
			target.treemap('update', data);
		},*/
		renderChartLeft: function() {
			var target = this.selector.find(".chart-left .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-left .chart-title").text("Treemap");
			
			var data = [
				{
			        "value": 2745536,
			        "name": "/"
			    },
			    {
			        "value": 1929756,
			        "name": "/dev",
			    },
			    {
			        "value": 1752092,
			        "name": "/run"
			    },
			    {
			        "value": 3560968,
			        "name": "/home",
			        "children": [{value: 20, name: "admin"},{value: 20, name: "user1"},{value: 20, name: "user2"},{value: 20, name: "user3"},{value: 20, name: "user4"}]
			    },
			    {
			        "value": 4062260,
			        "name": "/boot"
			    }
			];
			var colors = ['#bbdee9','#6dc9c7','#014fa7','#044583','#012451'];
			target.treemap({name:'Disk Usage', color: colors});
			target.treemap('update', data);
		},
		renderChartRight : function() {
			var target = this.selector.find(".chart-right .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-right .chart-title").text("Calendar");
			
			target.calendar({year:2017, month:7});
			
			this.polling = setInterval(function() {
				var month = Math.round(Math.random() * 12 + 1);
				var year = 2000 + (Math.round(Math.random() * 20));
				target.calendar("update", {year:year, month:month});
			}, 7000);
		}
	}
	
    return ChartSample11;
});