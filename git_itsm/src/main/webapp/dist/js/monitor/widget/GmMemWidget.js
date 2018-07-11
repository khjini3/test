define([
    "jquery",
    "underscore",
    "text!views/monitor/gmMemWidget",
    "echart",
    "css!cs/monitor/gmMemWidget",
],function(
    $,
    _,
    JSP,
    echarts
){
	function GmMemWidget(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	GmMemWidget.prototype = {
		init : function() {
			console.log("GM Mem Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start: function() {
			var that = this;
			this.getData(2);
			this.timer = setInterval(function() {
				that.getData(2);
			}, 60000);
		},
		stop: function() {
			 clearInterval(this.timer);
		},
		
		getData : function(id) {
			var that = this;
			$.ajax({
                type: "GET",
                url: "/dashboard/widget/sysmon/"+id,
                contentType: "application/json; charset=utf-8",
                success: function(data, textStatus, xhr) {
                	that.setData(data);
                },
                error: function(data, textStatus, xhr) {
                	
                }
            }).done(function(){
                
            });
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
			console.log(data);
			if(data.data == undefined) return;
			var memoryData = data.data.memory;
			var time = this.getTime(data.data.memory.recordTime);
			var dataArr = [];
			var nameArr = ['Mem-Usage','Swap-Usage'];
			
			var memUsage = Number(memoryData.usedMemory) / Number(memoryData.totalMemory) * 100;
			var swapMemUsage = Number(memoryData.usedSwapMemory) / Number(memoryData.totalSwapMemory) * 100;
			memUsage = memUsage.toFixed(2);
			swapMemUsage = swapMemUsage.toFixed(2)
			dataArr.push({"label": time, "value": memUsage});
			dataArr.push({"label": time, "value": swapMemUsage});
			
			/*
			var id = this.selector.find(".gm-chart-text");
			id.empty();
			var html = "";
			html += "<div class='memInfo'>" +
					"<div class='title'>Memory</div>" +
					"<div class='percent mem-per'></div>" +
					"<div class='progress'>" +
					"<div class='memory progress-sm active progress-bar progress-bar-success progress-bar-striped'" +
					"role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100'></div></div></div>"+
					"<div class='swapInfo'>" +
					"<div class='title'>Swap</div>" +
					"<div class='percent swap-per'></div>" +
					"<div class='progress'>" +
					"<div class='swap progress-sm active progress-bar progress-bar-success progress-bar-striped'" +
					"role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100'></div></div></div>";
			*/
			/*
			var html = "<div class='gm-textBox'>" + "<ul>" +
					   		"<li><span>Memory</span></li>" +
					   		"<li><span> Avail : "+ memoryData.availableMemory + "</span><span> Total : "+ memoryData.totalMemory + "</span></li>" +
					   		"<li><span>Swap</span></li>" +
					   		"<li><span> Avail : "+ memoryData.availableSwapMemory + "</span><span> Total : "+ memoryData.totalSwapMemory + "</span></li>" +
				   	   "</ul>" + "</div>";
			*/
			/*
			id.append(html);
			var memBars = id.find(".memory");
			var swapBars = id.find(".swap");
			id.find(".mem-per").text(memUsage+"%");
			id.find(".swap-per").text(swapMemUsage+"%");
			memBars.css("width", memUsage+"%");
			swapBars.css("width", swapMemUsage+"%");
			*/
			this.setPieChart(memUsage, swapMemUsage);
			this.setLineChart(nameArr, dataArr);
		},
		setLineChart: function(nameArr, dataArr) {
			var id = this.selector.find(".gm-chart-line");
			var count = id.find("canvas").length;
			if(count == 0) id.realtime({
										dataLength:10, count: nameArr.length, name: nameArr, type: 'line',
										color: ['#cd5e7e','#85b6b2','#e38980','#f7db88','#85b6b2', '#6d4f8d'],
										area: true, yAxis: {type: 'value',max: 100}
									  });
			id.realtime('update', dataArr);
		},
		setPieChart: function(memData, swapData) {
			var pieChart = echarts.init(this.selector.find(".gm-chart-pie")[0]);
			var dataStyle = { 
				    normal: {
				        label: {show:false},
				        labelLine: {show:false},
				        shadowBlur: 40,
				        shadowColor: 'rgba(40, 40, 40, 0.5)',
				    }
				};
				var placeHolderStyle = {
				    normal : {
				        color: 'rgba(0,0,0,0)',
				        label: {show:false},
				        labelLine: {show:true}
				    },
				    emphasis : {
				        color: 'rgba(0,0,0,0)'
				    }
				};
				option = {
				   //backgroundColor: '#fff',
				    //color: ['rgb(0,153,203)','rgb(252,177,80)','rgb(230,76,101)','rgb(79,196,246)'],
				    color: ['#cd5e7e','#85b6b2','#e38980','#f7db88','#85b6b2', '#6d4f8d'],
				    tooltip : {
				        show: true,
				        formatter: "{a} <br/>{b} : {c} "
				    },
				    legend: {
				        itemGap:12,
				        top: '87%',
				        data:['Memory','Swap'],
        		        textStyle : {
        		        	color : "#fff"
        		        },
        		        icon : "circle",
				    },
				    
				    series : [
				        {
				            name:'Memory',
				            type:'pie',
				            clockWise:false,
				            radius : [60,80],
				            itemStyle : dataStyle,
				            hoverAnimation: false,
				            data:[
				                {
				                    value:memData,
				                    name:'Used'
				                },
				                {
				                    value:100 - memData,
				                    name:'Avail',
				                    itemStyle : placeHolderStyle
				                }
				         
				            ]
				        }, 
				         {
				            name:'Swap',
				            type:'pie',
				            clockWise:false,
				            radius : [40, 60],
				            itemStyle : dataStyle,
				            hoverAnimation: false,
				            data:[
				                {
				                    value:swapData,
				                    name:'Used'
				                },
				                {
				                    value:100 - swapData,
				                    name:'Avail',
				                    itemStyle : placeHolderStyle
				                }
				            ]
				        }

				    ]
				};
				pieChart.setOption(option);
		}
	}
	
    return GmMemWidget;
});