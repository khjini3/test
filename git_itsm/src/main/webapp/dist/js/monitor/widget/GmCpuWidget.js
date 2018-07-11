define([
    "jquery",
    "underscore",
    "text!views/monitor/gmCpuWidget",
    "css!cs/monitor/gmCpuWidget",
],function(
    $,
    _,
    JSP
){
	function GmCpuWidget(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	GmCpuWidget.prototype = {
		init : function() {
			console.log("GM CPU Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start: function() {
			var that = this;
			this.getData(1);
			this.timer = setInterval(function() {
				that.getData(1);
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
			var coreUsage = data.data.cpu.coreUsage;
			var coreArr = coreUsage.split(",");
			var total = 0;
			var avg = 0;
			var time = this.getTime(data.data.cpu.recordTime);
			var cpuNameArr = (function() {
				var arr = [];
				for(var i=0; i<coreArr.length; i++) {
					var num = i+1;
					arr.push("cpu-"+num);
				}
				return arr;
			})();
			var dataArr = [];
			
			coreArr.forEach(function(val){
				total += Number(val);
				dataArr.push({"label": time, "value": val});
			});
			avg = total / coreArr.length;
			
			this.renderDonutChart(avg);
			
			this.renderLineChart(1, ["CPU-AVG"], [{label: time, value: avg.toFixed(2)}]);
		},
		renderDonutChart: function(avg) {
			var result = avg.toFixed(2);
			var id = this.selector.find(".gm-chart-bar");
			var count = id.find("canvas").length;
			if(count == 0) {
				id.donut({data: []});
				id.append("<div class='gm-chart-avg'>"+0.000+"%</div>")
				
			}
			id.donut('update', [
				{value:result, name: 'Usage'},
				{value:100-result, name: 'Available'}
			]);
			
			this.selector.find(".gm-chart-avg").empty();
			this.selector.find(".gm-chart-avg").text(result+"%");
		},
		renderLineChart: function(length, cpuNameArr, dataArr) {
			var id = this.selector.find(".gm-chart-line");
			var count = id.find("canvas").length;
			
			if(count == 0) id.realtime({dataLength:10, count: length, name: cpuNameArr, type: 'line'});
			id.realtime('update', dataArr);
		}
	}
	
    return GmCpuWidget;
});