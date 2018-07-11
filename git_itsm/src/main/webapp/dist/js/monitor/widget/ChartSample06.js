define([
    "jquery",
    "underscore",
    "text!views/monitor/chartSample06",
    "css!cs/monitor/chartSample",
],function(
    $,
    _,
    JSP
){
	function ChartSample06(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	ChartSample06.prototype = {
		init : function() {
			console.log("chartSample03 Widget Init");
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
			var colors = ['rgba(255,68,69,0.5)','rgba(125,175,0,1)']
			this.selector.find(".chart-lt .chart-title").text("Basic Radar");
			target.basicRadar({count: 2, backgroundColor: this.setBackground(), color: colors, name : [ 'Allocated Budget', 'Actual Spending']});
			target.basicRadar('update', 
					{label: ['매출','관리','정보기술','고객지원','개발','마케팅'],
					value: [
					[4300, 10000, 28000, 35000, 50000, 19000],
					[5000, 14000, 28000, 31000, 42000, 21000]]
			});
			
		},
		renderChartRT: function() {
			var target = this.selector.find(".chart-rt .chart-area");
			var count = target.find("canvas").length;
			
			this.selector.find(".chart-rt .chart-title").text("Square Radar");
			target.squareRadar({count: 1, backgroundColor: this.setBackground(), color: ['rgba(54, 162, 235, 0.5)']});
			target.squareRadar('update', 
				{label: [
	                		{text: '브랜드', max: 100},
	                		{text: '함유량', max: 100},
	                		{text: '가용성', max: 100},
	                		{text: '기능', max: 100}], 
				value: [
                    {
                        value: [60,73,85,40],
                        name: '소프트웨어'
                    }]
			});
			
		},
		renderChartLB: function() {
			var target = this.selector.find(".chart-lb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-lb .chart-title").text("Pentagon Radar");
			var colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'];
			target.pentagonRadar({count: 2, backgroundColor: this.setBackground(), color: colors});
			target.pentagonRadar('update', 
				{label: [
	                		{text: '외부', max: 100},
	                		{text: '사진', max: 100},
	                		{text: '체계', max: 100},
	                		{text: '공연', max: 100},
	                		{text: '화면', max: 100}], 
				value: [
			                {
			                    value: [55, 40, 60, 35, 95],
			                    name: '전화'
			                },
			                {
			                    value: [95, 80, 25, 70, 93],
			                    name: '휴대전화'
			                }
	                ]
			});
			
		},
		renderChartRB: function() {
			var target = this.selector.find(".chart-rb .chart-area");
			var count = target.find("canvas").length;
			this.selector.find(".chart-rb .chart-title").text("Dodecagon Radar");
			target.dodecagonRadar({count: 2, backgroundColor: this.setBackground(), color: ['rgba(151, 58, 206, 0.5)','rgba(0, 150, 0, 0.5)']});
			target.dodecagonRadar('update', 
				{label: [
			            	{text: '1월', max: 100},
			                {text: '2월', max: 100},
			                {text: '3월', max: 100},
			                {text: '4월', max: 100},
			                {text: '5월', max: 100},
			                {text: '6월', max: 100},
			                {text: '7월', max: 100},
			                {text: '8월', max: 100},
			                {text: '9월', max: 100},
			                {text: '10월', max: 100},
			                {text: '11월', max: 100},
			                {text: '12월', max: 100}  
	            ], 
				value: [
		                    {
		                        name: '강수량',
		                        value: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3],
		                    },
		                    {
		                        name:'증발량',
		                        value:[23.2, 25.6, 76.7, 2.0, 4.9, 7.0, 20.0, 6.4, 3.3, 35.6, 62.2, 32.6,]
		                    }
                ]
			});
		}
	}
	
    return ChartSample06;
});