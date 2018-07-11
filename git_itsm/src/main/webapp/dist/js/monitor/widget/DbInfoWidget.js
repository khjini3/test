define([
    "jquery",
    "underscore",
    "text!views/monitor/dbInfoWidget",
    "css!cs/monitor/dbInfoWidget"
],function(
    $,
    _,
    JSP
){
	function DBinfo(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	DBinfo.prototype = {
		init : function() {
			console.log("DBinfo Custom Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
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
			/*
			var record = recordTime;
			var sysdate = new Date(record);
			*/
			var sysdate = new Date();
			var hours = sysdate.getHours();
			var mins = sysdate.getMinutes();
			hours = hours < 10 ? hours+10 : hours;
			mins = mins < 10 ? mins+10 : mins;
			return hours + ":"+mins;
		},
		setData : function() {
			this.setNeworkTraffic();
			this.setConnections();
		},
		setNeworkTraffic: function() {
			var id = this.selector.find(".dbInfo-chart-network");
			var count = id.find("canvas").length;
			if(count == 0) id.multi({count: 2, type: 'line', name:['tx', 'rx']});
			id.multi('update', 
					{label: ["00:01","00:02","00:03","00:04","00:05","00:06","00:07","00:08","00:09"], 
				 	value: [
						    [15, 20, 90, 80, 10, 10, 40, 10, 10], 
							[10, 50, 16, 20, 30, 20, 15, 20, 76],
					]
			});
		},
		setConnections: function() {
			var id = this.selector.find(".dbInfo-chart-conn");
			var count = id.find("canvas").length;
			if(count == 0) id.multi({count: 1, type: 'bar', name:['connect']});
			id.multi('update', 
					{label: ["00:01","00:02","00:03","00:04","00:05","00:06","00:07","00:08","00:09"], 
				 	value: [
						    [1, 2, 1, 1, 1, 4, 1, 3, 1]
					]
			});
		},
		getData : function(id, callback) {
			var that = this;
			/*
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
			*/
		},
	}
	
    return DBinfo;
});