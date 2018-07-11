define([
    "jquery",
    "underscore",
    "text!views/monitor/wasInfoWidget",
    "css!cs/monitor/wasInfoWidget"
],function(
    $,
    _,
    JSP
){
	function WASinfo(id) {
		this.selector = $("#"+id);
		this.init();
	}
	
	WASinfo.prototype = {
		init : function() {
			console.log("WASinfo Custom Widget Init");
			this.render();
		},
		render : function() {
			var that = this;
			this.selector.append(JSP);
		},
		start: function() {
			var that = this;
			this.getData();
			this.timer = setInterval(function() {
				that.getData();
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
		setData : function(data) {
			console.log(data);
			var memory = data.mem - data['mem.free'];
			
			var id = this.selector.find(".wasInfo-chart-memory");
			var count = id.find("canvas").length;
			if(count == 0) {
				id.donut({data: []});
				id.append("<div class='wasInfo-chart-mem-per'>"+0.000+"%</div>")
				
			}
			id.donut('update', [
				{value:memory, name: 'Usage'},
				{value:data['mem.free'], name: 'Free'}
			]);
			
			this.selector.find(".wasInfo-chart-mem-per").empty();
			this.selector.find(".wasInfo-chart-mem-per").text((memory/data.mem*100).toFixed(2)+"%");
			
			
			this.renderBarChart([{"label": "", "value": data.threads}]);
		},
		renderBarChart: function(data) {
			var id = this.selector.find(".wasInfo-chart-thread");
			var count = id.find("canvas").length;
			if(count == 0) id.realtime({dataLength:10, name: ['Thread'], type: 'bar'});
			id.realtime('update', data);
		},
		getData : function() {
			var that = this;
		
			$.ajax({
                type: "GET",
                url: "/mngSystem/metrics",
                contentType: "application/json; charset=utf-8",
                success: function(data, textStatus, xhr) {
                	that.setData(data);
                },
                error: function(data, textStatus, xhr) {
                	
                }
            }).done(function(){
                
            });
			
		},
	}
	
    return WASinfo;
});