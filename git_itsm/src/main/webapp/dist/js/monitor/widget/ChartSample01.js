define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample01",
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
			console.log("chartSample01 Widget Init");
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
		setBackground: function(){
			var waterMarkText = 'DAVIS';

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = canvas.height = 100;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.globalAlpha = 0.08;
			ctx.font = '20px Microsoft Yahei';
			ctx.translate(50, 50);
			ctx.rotate(-Math.PI / 4);
			ctx.fillText(waterMarkText, 0, 0);
			
			return{
				 type: 'pattern',
			     image: canvas,
			     repeat: 'repeat'
			}
		},
		renderChartLT: function() {
			

			var target = this.selector.find(".chart-lt .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lt .chart-title").text("Stacked Line");
			var label = [];
			var value = 0;
			var value1 = [];
			var value2 = [];
			var value3 = [];
			for(var i=1;i<20; i++){
				value = Math.round(Math.random() * 200 + 10);
				label.push("sample"+i);
				value1.push(value);
				value2.push(value + 5);
				value3.push(value + 30);
				
			}
			
			var colors = ['#1952a3', '#1772bc', '#28ba77'];
			target.stacked({count: 3, backgroundColor: this.setBackground(), color: colors});
			target.stacked('update', 
				{label: label, 
				value: [
							value1, value2, value3
					   ]
			});
			
		},
		renderChartRT: function() {
			var target = this.selector.find(".chart-rt .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rt .chart-title").text("Stacked Area");
			var label = [];
			var value = 0;
			var value1 = [];
			var value2 = [];
			var value3 = [];
			for(var i=1;i<20; i++){
				value = Math.round(Math.random() * 1000 + 10);
				label.push("sample"+i);
				value1.push(value);
				value2.push(value + 20);
				value3.push(value + 100);
				
			}
			var colors = ['#1952a3', '#1772bc', '#28ba77'];
			target.stacked({count: 3, area: true, backgroundColor: this.setBackground(), color: colors});
			target.stacked('update', 
				{label: label, 
				value: [
					     value1, value2, value3
					   ]
			});
			
		},
		renderChartLB: function() {
			var target = this.selector.find(".chart-lb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lb .chart-title").text("Stacked Bar");
			var label = [];
			var values1 = [];
			var values2 = [];
			var values3 = [];
			for(var i=1;i<40; i++){
				label.push("sample"+i);
				values1.push(Math.round(Math.random() * 120));
				values2.push(Math.round(Math.random() * 120));
				values3.push(Math.round(Math.random() * 120));
			}
			var colors = ['#4873c2', '#97cc34', '#51cace'];
			target.stacked({count: 3, type: 'bar', stack: true, backgroundColor: this.setBackground(), color: colors});
			target.stacked('update', 
				{label: label, 
				value: [values1, values2, values3]
			});
			
		},
		renderChartRB: function() {
			var target = this.selector.find(".chart-rb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rb .chart-title").text("Step Line");
			var label = [];
			var values1 = [];
			var values2 = [];
			for(var i=1;i<40; i++){
				label.push("sample"+i);
				values1.push(Math.round(Math.random() * 20));
				values2.push(Math.round(Math.random() * 40));
			}
			
			
			var colors = ['#0f75c6', '#28ba77'];
			target.stepline({count: 2, backgroundColor: this.setBackground(), color: colors});
			target.stepline('update', 
				{label: label, 
				value: [values1, values2]
			});
		}
	}
	
    return ChartSample01;
});