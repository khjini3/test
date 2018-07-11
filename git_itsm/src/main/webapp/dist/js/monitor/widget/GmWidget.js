define([
    "jquery",
    "underscore",
    "text!views/monitor/gmWidget",
    "css!cs/monitor/gmWidget",
],function(
    $,
    _,
    JSP
){
	function GmWidget(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	GmWidget.prototype = {
		init : function() {
			console.log("GM Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
			/*
			this.selector.find("#gm-chart-cpu").realtime({dataLength:10, count: 2, type: 'bar'});
			this.selector.find("#gm-chart-mem").multi({count: 3, type: 'bar'});
			this.selector.find("#gm-chart-disk").multi({count: 3, type: 'line'});
			*/
		},
		start: function() {
			var that = this;
			this.setData();
			this.timer = setInterval(function() {
				that.setData();
			}, 60000);
		},
		stop: function() {
			 clearInterval(this.timer);
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
		setCpuData : function(data) {
			if(data.data == undefined) return;
			var coreUsage = data.data.cpu.coreUsage;
			var coreArr = coreUsage.split(",");
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
				dataArr.push({"label": time, "value": val});
			});
			var id = this.selector.find(".gm-chart-cpu");
			var count = id.find("canvas").length;
			if(count == 0) id.realtime({dataLength:10, count: coreArr.length, name: cpuNameArr, type: 'line'});
			id.realtime('update', dataArr)
		},
		setMemData : function(data) {
			if(data.data == undefined) return;
			var memoryData = data.data.memory;
			var time = this.getTime(data.data.memory.recordTime);
			var dataArr = [];
			var nameArr = [];
			var keys = {
				'memoryUsage': 'Mem-Usage',
				'swapUsage': 'Swap-Usage',
				'totalMemory': 'Total',
				'totalSwapMemory': 'Total(Swap)'
			};
			
			
			for(var val in keys) {
				nameArr.push(keys[val]);
				var data = memoryData[val]/1024/1024/1024;
				dataArr.push({"label": time, "value": data.toFixed(4)});
			}
			
			var id = this.selector.find(".gm-chart-mem");
			var count = id.find("canvas").length;
			if(count == 0) id.realtime({dataLength:10, count: nameArr.length, name: nameArr, type: 'line'});
			id.realtime('update', dataArr);
		},
		setDiskData : function(data) {
			if(data.data == undefined) return;
			var that = this;
			var diskData = data.data.fileSystem;
			var time;
			var dataArr = [];
			var nameArr = [];
			diskData.forEach(function(val) {
				if(val.totalSpace != 0) {
					time = that.getTime(val.recordTime);
					var totalSpace = val.totalSpace;
					var usedSpace = val.usedSpace;
					
					dataArr.push({"label": time, "value": val.usage});
					nameArr.push(val.mount);
				}
				
			});
			var id = this.selector.find(".gm-chart-disk");
			var count = id.find("canvas").length;
			
			if(count == 0) id.realtime({dataLength:10, count: nameArr.length, name: nameArr, type: 'line'});
			id.realtime('update', dataArr);
		},
		getData : function(id, callback) {
			var that = this;
			$.ajax({
                type: "GET",
                url: "/dashboard/widget/sysmon/"+id,
                contentType: "application/json; charset=utf-8",
                success: function(data, textStatus, xhr) {
                	
                	callback(data);
                },
                error: function(data, textStatus, xhr) {
                	
                }
            }).done(function(){
                
            });
		},
		setData : function() {
			/*
			this.selector.find("#gm-chart-mem").multi('update', 
				{label: ["00:01","00:02","00:03","00:04","00:05","00:06"], 
				 value: [
						    [5, 20, 36, 10, 10, 10], 
							[10, 50, 16, 20, 30, 20],
							[15, 20, 26, 50, 40, 30]
					    ]
			});
			this.selector.find("#gm-chart-disk").multi('update', 
				{label: ["00:01","00:02","00:03","00:04","00:05","00:06"], 
				 value: [
						    [5, 20, 36, 10, 10, 10], 
							[10, 50, 16, 20, 30, 20],
							[15, 20, 26, 50, 40, 30]
					    ]
			});
			*/
			var that = this;
			console.log("setData");
			this.getData(1, function(data) {
				that.setCpuData(data);
			});
			this.getData(2, function(data) {
				that.setMemData(data);
			});
			this.getData(3, function(data) {
				that.setDiskData(data);
			});
		}
	}
	
    return GmWidget;
});