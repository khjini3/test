define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample03",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample03(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample03.prototype = {
		init : function() {
			console.log("chartSample02 Widget Init");
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
			clearInterval(this.polling);
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
		renderChartTop: function() {
			var target = this.selector.find(".chart-top .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-top .chart-title").text("Dynamic Data");
			target.realtime({dataLength:60, backgroundColor: this.setBackground()});
			this.polling = setInterval(function() {
				var now = new Date();
				var time = (function() {
					var hours = now.getHours();
					var mins = now.getMinutes();
					var sec = now.getSeconds();
					hours = hours < 10 ? '0'+hours : hours;
					mins = mins < 10 ? '0'+mins : mins;
					sec = sec < 10 ? '0'+sec : sec;
					
					return hours +':'+ mins +':'+ sec;
				})();
				
	        	target.realtime('update', [{"label": time, "value": Math.round(Math.random() * 1000)}]);
	        }, 200);
			
		},
		renderChartBottom: function() {
			var target = this.selector.find(".chart-bottom .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-bottom .chart-title").text("Beiijing AQI");
			var now = new Date(2017, 7, 25);
			var oneDay = 24 * 3600 * 1000;
			var label1= [];
			var value1= [];
			for(var i=0;i<50;i++){
				now = new Date(+now+oneDay);
				label1.push([now.getFullYear(), now.getMonth() + 1].join('-'));
				value1.push(Math.round(Math.random() * 330));
			}
			target.beijingaqi({count: 1, backgroundColor: this.setBackground()});
			target.beijingaqi('update', {label: label1, value: [value1]});
			
		},
	}
	
    return ChartSample03;
});