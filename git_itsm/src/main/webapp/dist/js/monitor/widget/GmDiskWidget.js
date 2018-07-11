define([
    "jquery",
    "underscore",
    "text!views/monitor/gmDiskWidget",
    "css!cs/monitor/gmDiskWidget",
],function(
    $,
    _,
    JSP
){
	function GmDiskWidget(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	GmDiskWidget.prototype = {
		init : function() {
			console.log("GM Disk Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start: function() {
			var that = this;
			this.getData(3);
			this.timer = setInterval(function() {
				that.getData(3);
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
		setData : function(data) {
			//console.log(data);
			if(data.data == undefined) return;
			 
			var that = this;
			var diskData = data.data.fileSystem;
			if(diskData == undefined) return;
			var dataArr = [];
			var diskName = [];
			
			var id = this.selector.find(".gm-chart-progress");
			var bars = id.find(".bar");
			var count = bars.length;
			if(count == 0) {
				var html = "<div class='bar'>";
				diskData.forEach(function(val, idx) {
					html += "<div class='title disk-"+idx+"-title' style='color:white'>" + val.fileSystem + "</div>" +
							"<div class='percent disk-"+idx+"-per'></div>" +
							"<div class='progress'>" +
							"<div class='disk-"+idx+" progress-sm active progress-bar progress-bar-success progress-bar-striped'" +
							"role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100'></div></div>";
							
				});
				html += "</div>";
				id.append(html);
			}
			
			diskData.forEach(function(val, idx) {
				//console.log(val.usage);
				var usage = isNaN(val.usage) ? 0.0 : Number(val.usage);
				var total = val.totalSpace;
				var used  = val.usedSpace;
				var tooltip = used +" / "+ total;
				that.selector.find(".disk-"+idx+"-per").text(usage+" %");
				var target = that.selector.find(".disk-"+idx); 
				target.attr("title", tooltip);
				target.css("height", '10px'); //////////////////////
				target.css("width", usage+"%");
				//target.progressbar({value: usage});
			});
		}
	}
	
    return GmDiskWidget;
});