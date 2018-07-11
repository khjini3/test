define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/itamDashboard",
    "w2ui",
    "js/lib/component/BundleResource",
    "echart",
    "ecStat",
    "jquery-csv",
    "css!cs/asset/itamDashboard"
],function(
    $,
    _,
    Backbone,
    JSP,
    W2ui,
    BundleResource,
    echarts,
    ecStats
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var Model = Backbone.Model.extend({
		model:Model,
		url:'itamDashboard',
		parse: function(result) {
            return {data: result};
        }
	});
	
	
	var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		that = this;
    		this.lineChartColors = util.getColors('line');
    		this.pieChartColors = util.getColors('pie');
    		
    		this.collection = null;
    		this.selectItem = null;
    		this.dataProvider = [];
    		this.convertModelMap = {};
    		this.convertLocationMap = {};
    		this.countListMap = {
        			'TOP 5' : 5,
        			'TOP 10' : 10
        	};
    		this.periodListMap = {
    			'주간' : 'weekly',
    			'월간' : 'monthly'
    		};
    		this.lineChart1 = null;
    		this.lineChart2 = null;
    		this.lineChart3 = null;
    		this.pieChart1 = null;
    		this.pieChart2 = null;
    		this.pieChart3 = null;
    		this.chartFontColor = "#fff";
    		//왼쪽 트리 잠금 상태 체크
    		this.elements = {
    		};
    		this.$el.append(JSP);
    		this.init();
    		
    		
        	if(this.checkBrowser() == "chrome") {
        		console.log("Chrome");
        	} else if(this.checkBrowser() == "safari") {
        		console.log("Safari");
        	} else if(this.checkBrowser() == "firefox") {
        		console.log("Firefox");
        		$("#leftContents").css("height", "calc(100% - 100px)");
        		$(".w2ui-reset.w2ui-form").css("height", "calc(100% - 130px)");
        	} else if(this.checkBrowser() == "opera") {
        		console.log("Opera");
        	} else {
        		console.log("IE");
        	} 
        },
        
        events:{
        	
        },
        
        eventListenerRegister : function(){
        	
        	// Model 현황 (5, 10) Select Box
        	$(document).on('change', '#selectModelLimit', function(e){
        		var selectModelLimit = e.currentTarget.value;
        		that.listNotifiCation('getModel', that.countListMap[selectModelLimit]);
        	});
        	
        	// Location 현황 (5, 10) Select Box
        	$(document).on('change', '#selectLocLimit', function(e){
        		var selectLocLimit = e.currentTarget.value;
        		that.listNotifiCation('getLocation', that.countListMap[selectLocLimit]);
        	});
        	
        	// 입고 현황 (주간, 월간) Select Box
        	$(document).on('change', '#selectInPeriod', function(e){
        		var selectInPeriod = e.currentTarget.value;
        		if("주간" == selectInPeriod){
        			that.listNotifiCation('getInstockWeekly', that.periodListMap[selectInPeriod]);
        		}else{
        			that.listNotifiCation('getInstockMonthly', that.periodListMap[selectInPeriod]);
        		}
        	});
        	
        	// 출고 현황 (주간, 월간) Select Box
        	$(document).on('change', '#selectOutPeriod', function(e){
        		var seletOutPeriod = e.currentTarget.value;
        		if("주간" == seletOutPeriod){
        			that.listNotifiCation('getActiveWeekly', that.periodListMap[seletOutPeriod]);
        		}else{
        			that.listNotifiCation('getActiveMonthly', that.periodListMap[seletOutPeriod]);
        		}
        	});
        	
        	// 재고 현황 (주간, 월간) Select Box
        	$(document).on('change', '#selectKeepPeriod', function(e){
        		var selectKeepPeriod = e.currentTarget.value;
        		if("주간" == selectKeepPeriod){
        			that.listNotifiCation('getKeepWeekly', that.periodListMap[selectKeepPeriod]);
        		}else{
        			that.listNotifiCation('getKeepMonthly', that.periodListMap[selectKeepPeriod]);
        		}
        	});
        },
        
        removeEventListener : function(){
        	$(document).off('change', '#selectModelLimit');
        	$(document).off('change', '#selectLocLimit');
        	$(document).off('change', '#selectInPeriod');
        	$(document).off('change', '#selectOutPeriod');
        	$(document).off('change', '#selectKeepPeriod');
        },
        
        init : function(){
        	
        	this.eventListenerRegister();
        	
        	let contents = '';
        	contents += '<section class="contents-area">'+
        					'<div class="col-xs-4" style="height:calc(100vh - 86px)">'+
        					
        						'<section class="pie-chart-area">'+
        						'<div class="dashboard-panel" >'+
	    							'<div class="dashboard-title">'+
        								'<span>Model 현황</span>'+
        								'<div id="pie-char1-right-title" style="float:right;">'+
        									'<div class="w2ui-field w2ui-span3 drop-down-list">'+
        										/*'<label>Count</label>'+*/
        										'<div><input class="listGroup" name="modelCount" type="list" size="7" id="selectModelLimit" style="width:77px;" /></div>'+
        									'</div>'+
        								'</div>'+
        							'</div>'+
	    							'<div class="dashboard-contents">'+
		    							'<div id="leftTopMain">'+
		    							'</div>'+
	    							'</div>'+
								'</div>'+
								'</section>'+
								
								'<section class="pie-chart-area">'+
									'<div class="dashboard-panel" >'+
										'<div class="dashboard-title">'+
											'<span>Location 현황</span>'+
	        								'<div id="pie-char1-right-title" style="float:right;">'+
	        									'<div class="w2ui-field w2ui-span3 drop-down-list">'+
	        										/*'<label>Count</label>'+*/
	        										'<div><input class="listGroup" name="locationCount" type="list" size="7" id="selectLocLimit" style="width:77px;" /></div>'+
	        									'</div>'+
	        								'</div>'+
	        							'</div>'+
										'<div class="dashboard-contents"><div id="leftMiddleMain"></div></div>'+
									'</div>'+
								'</section>'+
    						'</div>'+
    						
    						'<div class="col-xs-8" style="height:calc(100vh - 86px)">'+
	    						'<section class="line-chart-area">'+
									'<div class="dashboard-panel" >'+
										'<div class="dashboard-title">'+
											'<span>입고 현황</span>'+
											'<div id="pie-char1-right-title" style="float:right;">'+
	        									'<div class="w2ui-field w2ui-span3 drop-down-list">'+
	        										'<div><input class="listGroup" name="inPeriod" type="list" size="4" id="selectInPeriod" style="width:53px;" /></div>'+
	        									'</div>'+
	        								'</div>'+
										'</div>'+
										'<div class="dashboard-contents"><div id="rightTopMain"></div></div>'+
									'</div>'+
								'</section>'+
								'<section class="line-chart-area">'+
									'<div class="dashboard-panel" >'+
										'<div class="dashboard-title">'+
											'<span>출고 현황</span>'+
											'<div id="pie-char1-right-title" style="float:right;">'+
	        									'<div class="w2ui-field w2ui-span3 drop-down-list">'+
	        										'<div><input class="listGroup" name="outPeriod" type="list" size="4" id="selectOutPeriod" style="width:53px;" /></div>'+
	        									'</div>'+
	        								'</div>'+
										'</div>'+
										'<div class="dashboard-contents"><div id="rightMiddleMain"></div></div>'+
									'</div>'+
								'</section>'+
								'<section class="line-chart-area">'+
									'<div class="dashboard-panel" >'+
										'<div class="dashboard-title">'+
											'<span>재고 현황</span>'+
											'<div id="pie-char1-right-title" style="float:right;">'+
		    									'<div class="w2ui-field w2ui-span3 drop-down-list">'+
		    										'<div><input class="listGroup" name="keepPeriod" type="list" size="4" id="selectKeepPeriod" style="width:53px;" /></div>'+
		    									'</div>'+
		    								'</div>'+
										'</div>'+
										'<div class="dashboard-contents"><div id="rightBottomMain"></div></div>'+
									'</div>'+
								'</section>'+
    						'</div>'+
    					'</section>';
        	
        	$("#contentsDiv").html(contents);
        	
        	var countList = [ {"text" : "TOP 5", "id" : "5"}, {"text" : "TOP 10", "id" : "10"} ];
        	
        	var periodList = [ {"text" : "주간", "id" : "Weekly"}, {"text" : "월간", "id" : "Monthly"} ];
        	
        	$('input[name=modelCount]').w2field('list', { items: countList, selected: "5" });
        	$('input[name=locationCount]').w2field('list', { items: countList, selected: "5" });
        	$('input[name=inPeriod]').w2field('list', { items: periodList, selected: "Monthly" });
        	$('input[name=outPeriod]').w2field('list', { items: periodList, selected: "Monthly" });
        	$('input[name=keepPeriod]').w2field('list', { items: periodList, selected: "Monthly" });
        	
        	this.start();
        },
        
        start : function(){
        	this.getDataList();
        	
        	polling = setInterval(this.getDataList, 300000);
        	//polling = setInterval(this.getDataList, 10000);
        	
        	/*var year  = (new Date()).getFullYear();
        	var month = (new Date()).getMonth() + 1;
        	$('input[type=us-date]').w2field('date',  { format: 'yyyy-mm-dd' });
        	this.createPieChart1();
        	this.createPieChart2();
        	this.createPieChart3();
        	
        	this.createLineChart1();
        	this.createLineChart2();
        	this.createLineChart3();
        	
        	*/
        	
        	window.onresize = function(){
        		if(that != null){
        			if(that.lineChart1 !== undefined || that.lineChart1 != null){
        				that.lineChart1.resize();
        			}
        			if(that.lineChart2 !== undefined || that.lineChart2 != null){
        				that.lineChart2.resize();
        			}
        			if(that.lineChart3 !== undefined || that.lineChart3 != null){
        				that.lineChart3.resize();
        			}
        			if(that.pieChart1 !== undefined || that.pieChart1 != null){
        				that.pieChart1.resize();
        			}
        			if(that.pieChart2 !== undefined || that.pieChart2 != null){
        				that.pieChart2.resize();
        			}
        		}
			}
        },
        
        getDataList : function(){
        	console.log("polling");
        	let modelParam = that.countListMap[$('input[name=modelCount]').val()];
        	let locParam = that.countListMap[$('input[name=locationCount]').val()];
        	let instockParam = that.periodListMap[$('input[name=inPeriod]').val()];
        	let activeParam = that.periodListMap[$('input[name=outPeriod]').val()];
        	let keepParam = that.periodListMap[$('input[name=keepPeriod]').val()];
        	
        	that.listNotifiCation('getModel', modelParam); // Model 현황
        	that.listNotifiCation('getLocation', locParam); // Location 현황
        	
        	if(instockParam == "weekly"){
        		that.listNotifiCation('getInstockWeekly', instockParam);  // 입고 주간 현황
        	}else{
        		that.listNotifiCation('getInstockMonthly', instockParam); // 입고 월간 현황
        	}
        	if(activeParam == "weekly"){
        		that.listNotifiCation('getActiveWeekly', activeParam); // 출고 주간 현황
        	}else{
        		that.listNotifiCation('getActiveMonthly', activeParam); // 출고 월간 현황
        	}
        	if(keepParam == "weekly"){
        		that.listNotifiCation('getKeepWeekly', keepParam); // 재고 주간 현황
        	}else{
        		that.listNotifiCation('getKeepMonthly', keepParam); // 재고 월간 현황
        	}
        	
        	/*
        	that.listNotifiCation('getInstockWeekly', instockParam); // 입고 현황
        	that.listNotifiCation('getActiveWeekly', activeParam); // 출고 현황
        	that.listNotifiCation('getKeepWeekly', keepParam); // 재고 현황
        	*/ 
       },
        
        listNotifiCation : function(cmd, param){
        	switch(cmd){
	    		case "getModel" : // Model 현황
	    			this.getModel(cmd, param); 
	    		break;
	    		case "getLocation" : // Location 현황
	    			this.getLocation(cmd, param);
	    		break;
	    		case "getInstockWeekly" : // 입고 주간 현황
	    			this.getInstockWeekly(cmd, param);
	    		break;
	    		case "getInstockMonthly" : // 입고 월간 현황
	    			this.getInstockMonthly(cmd, param);
	    		break;
	    		case "getActiveWeekly" : // 출고 주간 현황
	    			this.getActiveWeekly(cmd, param);
	    		break;
	    		case "getActiveMonthly" : // 출고 월간 현황
	    			this.getActiveMonthly(cmd, param);
	    		break;
	    		case "getKeepWeekly" : // 재고 주간 현황
	    			this.getKeepWeekly(cmd, param);
	    		break;
	    		case "getKeepMonthly" : // 재고 월간 현황
	    			this.getKeepMonthly(cmd, param);
	    		break;
	    	}
        },
        
        getModel : function(cmd, param){
        	var model = new Model();
        	model.url += '/'+cmd + '/'+param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setModel);
        },
        
        setModel : function(method, model, options){
        	if(model.length > 0){
        		that.createPieChart1(model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getLocation : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd + '/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setLocation);
        },
        
        setLocation : function(method, model, options){
        	if(model.length > 0){
        		that.createPieChart2(model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getInstockWeekly : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd + '/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setInstockWeekly);
        },
        
        setInstockWeekly : function(method, model, options){
        	if(model.length > 0){
        		that.createLineChart1(method, model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getInstockMonthly : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd +'/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setInstockMonthly);
        },
        
        setInstockMonthly : function(method, model, options){
        	if(model.length > 0){
        		that.createLineChart1(method, model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getActiveWeekly : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd + '/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setActiveWeekly);
        },
        
        setActiveWeekly : function(method, model, options){
        	if(model.length > 0){
        		that.createLineChart2(method, model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getActiveMonthly : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd + '/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setActiveMonthly);
        },
        
        setActiveMonthly : function(method, model, options){
        	if(model.length > 0){
        		that.createLineChart2(method, model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getKeepWeekly : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd + '/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setKeepWeekly);
        },
        
        setKeepWeekly : function(method, model, options){
        	if(model.length > 0){
        		that.createLineChart3(method, model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        getKeepMonthly : function(cmd, param){
        	var model = new Model();
        	model.url += '/' + cmd + '/' + param;
        	model.fetch();
        	this.listenTo(model, "sync", this.setKeepMonthly);
        },
        
        setKeepMonthly : function(method, model, options){
        	if(model.length > 0){
        		that.createLineChart3(method, model);
        	}else{
        		console.log("No Data");
        	}
        },
        
        createLineChart1 : function(param, data){
        	var option = null;
        	var xAxis = [];
        	var changeData = [];
        	var legendData = [];
        	var seriesData = [];
        	
        	for (var i = 0; i < data.length; i++){
//        		if(param.url.includes("weekly")){
        		if(param.url.indexOf("weekly") >= 0){
        			xAxis.push(data[i].weekday);
        		}else{
        			xAxis.push(data[i].month_day);
        		}
        		if(i == 0){
	        		var item = data[i];
	        		for(var name in item){
	        			if(name == "weekday" || name == "month_day"){
	        				continue;
	        			}else{
	        				legendData.push(name);
	        			}
	            	}
        		}
        	}
        	
        	legendData = _.sortBy(legendData);
        	
        	for(var i=0; i< legendData.length; i++){
        		var obj = {};
        		var name = legendData[i];
        		obj.name = name;
        		obj.data = _.pluck(data, name);
        		obj.type = 'line';
        		obj.smooth = true;
        		seriesData.push(obj);
        	}
        	
        	if(that.lineChart1){
        		that.lineChart1.clear();
        	}
        	
        	
        	option = {
        		   /* title: {
        		        text: '입고',
        		        textStyle : {
        		        	color : "#fff"
        		        }
        		    },*/
        			tooltip: {
          		        trigger: 'axis',
	          		    axisPointer: {
	                          type: 'cross',
	                          label: {
	                              backgroundColor: '#283b56'
	                          }
	                      }
          		    },
        		    legend: {
        		    	inactiveColor: '#5a5a5a',
        		    	data:legendData,
        		        textStyle : {
        		        	color : "#fff"
        		        },
        		        icon : "circle",
        		        right : '45',
        		        top : '10'
        		    },
        		    grid: {
        		        left: '3%',
        		        right: '4%',
        		        bottom: '3%',
        		        containLabel: true,
        		        backgroundColor : 'rgba(255,255,255,.05)',
        		        show : true
        		    },
        		    /*toolbox: { //screenshot
        		        feature: {
        		            saveAsImage: {}
        		        }
        		    },*/
        		    xAxis: {
        		        type: 'category',
        		        boundaryGap: false,
        		        data : xAxis,
        		        axisLabel : {
        		        	formatter: function (value, index) {
								var result = "";
								result = value.substr(5,8);
							    return result;
							},
        		        	textStyle : {color : "#fff"} //x축 폰트 컬러
						},
						splitLine : {
							show : true,
							lineStyle : {
								color : "#fff", //세로 라인
								opacity : 0.2
							}
						}
        		    },
        		    yAxis: {
        		        type: 'value',
        		        axisLabel : {
        		        	textStyle : {color : "#fff"} //Y축 폰트 컬러
						},
						splitLine : {
							show : true,
							lineStyle : {
								color : "#fff", //가로 라인
								opacity : 0.2
							}
						}
						/*splitNumber : 1,
						interval : 20*/
        		    },
        		    series: seriesData,
        		    color : that.lineChartColors
        		};
        	this.lineChart1 = echarts.init(document.getElementById("rightTopMain"));
        	this.lineChart1.setOption(option);
        	
        },
        
        createLineChart2 : function(param, data){
        	var option = null;
        	
        	var xAxis = [];
        	var changeData = [];
        	var legendData = [];
        	var seriesData = [];
        	
        	for (var i = 0; i < data.length; i++){
//        		if(param.url.includes("weekly")){
        		if(param.url.indexOf("weekly") >= 0){
        			xAxis.push(data[i].weekday);
        		}else{
        			xAxis.push(data[i].month_day);
        		}
        		if(i == 0){
	        		var item = data[i];
	        		for(var name in item){
	        			if(name == "weekday" || name == "month_day"){
	        				continue;
	        			}else{
	        				legendData.push(name);
	        			}
	            	}
        		}
        	}
        	
        	legendData = _.sortBy(legendData);
        	
        	for(var i=0; i< legendData.length; i++){
        		var obj = {};
        		var name = legendData[i];
        		obj.name = name;
        		obj.data = _.pluck(data, name);
        		obj.type = 'line';
        		obj.smooth = true;
        		seriesData.push(obj);
        	}
        	
        	if(that.lineChart2){
        		that.lineChart2.clear();
        	}

        	
        	option = {
         		   /* title: {
         		        text: '입고',
         		        textStyle : {
         		        	color : "#fff"
         		        }
         		    },*/
        			tooltip: {
          		        trigger: 'axis',
	          		    axisPointer: {
	                          type: 'cross',
	                          label: {
	                              backgroundColor: '#283b56'
	                          }
	                      }
          		    },
         		    legend: {
         		    	inactiveColor: '#5a5a5a',
         		    	data:legendData,
         		        textStyle : {
         		        	color : "#fff"
         		        },
         		        icon : "circle",
         		        right : '45',
         		        top : '10'
         		    },
         		    grid: {
         		        left: '3%',
         		        right: '4%',
         		        bottom: '3%',
         		        containLabel: true,
         		       backgroundColor : 'rgba(255,255,255,.05)',
         		       show : true
         		    },
         		    /*toolbox: { //screenshot
         		        feature: {
         		            saveAsImage: {}
         		        }
         		    },*/
         		    xAxis: {
         		        type: 'category',
         		        boundaryGap: false,
         		        data: xAxis,
         		        axisLabel : {
         		        	formatter: function (value, index) {
								var result = "";
								result = value.substr(5,8);
							    return result;
							},
         		        	textStyle : {color : "#fff"} //x축 폰트 컬러
 						},
 						splitLine : {
 							show : true,
 							lineStyle : {
 								color : "#fff", //세로 라인
 								opacity : 0.2
 							}
 						}
         		    },
         		    yAxis: {
         		        type: 'value',
         		        axisLabel : {
         		        	textStyle : {color : "#fff"} //Y축 폰트 컬러
 						},
 						splitLine : {
 							show : true,
 							lineStyle : {
 								color : "#fff", //가로 라인
 								opacity : 0.2
 							}
 						}
 						/*min : 0,
 						max : 10*/
 						/*splitNumber : 1*/
 						
         		    },
         		    series: seriesData,
         		    color : that.lineChartColors
         		};
        	
        	this.lineChart2 = echarts.init(document.getElementById("rightMiddleMain"));
        	this.lineChart2.setOption(option);
        	
        },
        
        createLineChart3 : function(param, data){
        	let option = null;
        	let xAxis = [];
        	let changeData = [];
        	let legendData = [];
        	let seriesData = [];
        	
        	for(var i = 0; i<data.length; i++){
//        		if(param.url.includes("weekly")){
        		if(param.url.indexOf("weekly") >= 0){
        			xAxis.push(data[i].week_day);
        		}else{
        			xAxis.push(data[i].month_day);
        		}
        		if(i == 0){
        			let item = data[i];
        			for(var name in item){
        				if(name == "week_day" || name == "month_day"){
        					continue;
        				}else{
        					legendData.push(name);
        				}
        			}
        		}
        	}
        	
        	legendData = _.sortBy(legendData);
        	
        	for(var i = 0; i<legendData.length; i++){
        		var obj = {};
        		var name = legendData[i];
        		obj.name = name;
        		obj.data = _.pluck(data, name);
        		obj.type = 'line';
        		obj.smooth = true;
        		seriesData.push(obj);
        	}
        	
        	if(that.lineChart3){
        		that.lineChart3.clear();
        	}
        	
        	option = {
          		   /* title: {
          		        text: '입고',
          		        textStyle : {
          		        	color : "#fff"
          		        }
          		    },*/
          		    tooltip: {
          		        trigger: 'axis',
	          		    axisPointer: {
	                          type: 'cross',
	                          label: {
	                              backgroundColor: '#283b56'
	                          }
	                      }
          		    },
          		    legend: {
          		    	inactiveColor: '#5a5a5a',
          		    	data:legendData,
          		        textStyle : {
          		        	color : "#fff"
          		        },
          		        icon : "circle",
          		        right : '45',
          		        top : '10'
          		    },
          		    grid: {
          		        left: '3%',
          		        right: '4%',
          		        bottom: '3%',
          		        containLabel: true,
          		       backgroundColor : 'rgba(255,255,255,.05)',
          		       show : true
          		    },
          		    /*toolbox: { //screenshot
          		        feature: {
          		            saveAsImage: {}
          		        }
          		    },*/
          		    xAxis: {
          		        type: 'category',
          		        boundaryGap: false,
          		        data: xAxis,
          		        axisLabel : {
          		        	formatter: function (value, index) {
 								var result = "";
 								result = value.substr(5,8);
 							    return result;
 							},
          		        	textStyle : {color : "#fff"} //x축 폰트 컬러
  						},
  						splitLine : {
  							show : true,
  							lineStyle : {
  								color : "#fff", //세로 라인
  								opacity : 0.2
  							}
  						}
          		    },
          		    yAxis: {
          		        type: 'value',
          		        axisLabel : {
          		        	textStyle : {color : "#fff"} //Y축 폰트 컬러
  						},
  						splitLine : {
  							show : true,
  							lineStyle : {
  								color : "#fff", //가로 라인
  								opacity : 0.2
  							}
  						}
          		    },
          		    series: seriesData,
          		    color : that.lineChartColors
          		};

        	
        	this.lineChart3 = echarts.init(document.getElementById("rightBottomMain"));
        	this.lineChart3.setOption(option);
        },
        
        createPieChart1 : function(data){
        	var option = null;
        	for(var i = 0; i<data.length; i++){
        		var item = data[i];
        		that.convertModelMap[item.name] = item.value;
        	}
        	
        	if(that.pieChart1){
        		that.pieChart1.clear();
        	}
        	
        	option = {
        		    tooltip : {
        		        trigger: 'item',
        		        formatter: "{a} <br/>{b} : {c} ({d}%)"
        		    },
        		    
        		    legend: {
        		    	inactiveColor: '#5a5a5a',
        		    	orient: 'vertical',
        		        left: 'left',
//        		        data: ['입고','출고','재고','폐기'],
        		        data: data,
        		        textStyle : {
        		        	color : "#fff"
        		        },
        		        formatter : function(name){
        		        	return name + " ("+that.convertModelMap[name]+")";
        		        }
        		    },
        		    
        		    grid: {
         		        left: '3%',
         		        right: '4%',
         		        bottom: '3%',
         		        containLabel: true
         		      /* backgroundColor : 'rgba(255,255,255,.05)',
         		       show : true*/
         		    },
        		    
        		    series : [
        		        {
        		            /*name: 'jini',*/
        		            type: 'pie',
        		            radius: ['30%', '70%'],
        		            center: ['60%', '50%'],
        		            /*data:[
        		                {value:335, name:'입고'},
        		                {value:310, name:'출고'},
        		                {value:1548, name:'재고'},
        		                {value:1548, name:'폐기'}
        		                
        		            ],*/
        		            data : data,
        		            itemStyle: {
        		                emphasis: {
        		                    shadowBlur: 10,
        		                    shadowOffsetX: 0,
        		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        		                }
        		            }
        		        }
        		    ],
        		    color : that.pieChartColors
        		};
        	
        	this.pieChart1 = echarts.init(document.getElementById("leftTopMain"));
        	this.pieChart1.setOption(option);
        },
        
        createPieChart2 : function(data){
        	var option = null;
        	for(var i = 0; i<data.length; i++){
        		var item = data[i];
        		that.convertLocationMap[item.name] = item.value;
        	}
        	
        	if(that.pieChart2){
        		that.pieChart2.clear();
        	}
        	
        	option = {
        		    tooltip : {
        		        trigger: 'item',
        		        formatter: "{a} <br/>{b} : {c} ({d}%)"
        		    },
        		    
        		    legend: {
        		    	inactiveColor: '#5a5a5a',
        		    	orient: 'vertical',
        		        left: 'left',
//        		        data: ['입고','출고','재고'],
        		        data: data,
        		        textStyle : {
        		        	color : "#fff"
        		        },
        		        formatter : function(name){
        		        	return name + " ("+that.convertLocationMap[name]+")";
        		        }
        		    },
        		    
        		    series : [
        		        {
        		            /*name: 'jini',*/
        		            type: 'pie',
        		            radius: ['30%', '70%'],
        		            center: ['60%', '50%'],
        		            /*data:[
        		                {value:70, name:'입고'},
        		                {value:20, name:'출고'},
        		                {value:10, name:'재고'}
        		            ],*/
        		            data: data,
        		            itemStyle: {
        		                emphasis: {
        		                    shadowBlur: 10,
        		                    shadowOffsetX: 0,
        		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        		                }
        		            }
        		        }
        		    ],
        		    color : that.pieChartColors
        		};
        	
        	this.pieChart2 = echarts.init(document.getElementById("leftMiddleMain"));
        	this.pieChart2.setOption(option);
        	 
        },
        
        createPieChart3 : function(){
        	
        	var option = null;
        	option = {
        		    tooltip : {
        		        trigger: 'item',
        		        formatter: "{a} <br/>{b} : {c} ({d}%)"
        		    },
        		    
        		    legend: {
        		        orient: 'vertical',
        		        left: 'left',
        		        data: ['입고','출고','재고'],
        		        textStyle : {
        		        	color : "#fff"
        		        },
        		    },
        		    
        		    series : [
        		        {
        		            /*name: 'jini',*/
        		            type: 'pie',
        		            radius: ['30%', '80%'],
        		            data:[
        		                {value:14, name:'입고'},
        		                {value:30, name:'출고'},
        		                {value:60, name:'재고'}
        		            ],
        		            itemStyle: {
        		                emphasis: {
        		                    shadowBlur: 10,
        		                    shadowOffsetX: 0,
        		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        		                }
        		            }
        		        }
        		    ],
        		    color : that.pieChartColors
        		};
        	
        	this.pieChart3 = echarts.init(document.getElementById("leftBottomMain"));
        	this.pieChart3.setOption(option);
        	 
        },
        
        checkBrowser : function() {
            // 브라우저 및 버전을 구하기 위한 변수들.
            var agent = navigator.userAgent.toLowerCase(),
                name = navigator.appName,
                browser;
            
            // MS 계열 브라우저를 구분하기 위함.
            if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
                browser = 'ie';
                if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
                    agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
                    browser += parseInt(agent[1]);
                } else { // IE 11+
                    if(agent.indexOf('trident') > -1) { // IE 11 
                        return browser += 11;
                    } else if(agent.indexOf('edge/') > -1) { // Edge
                        return browser = 'edge';
                    }
                }
            } else if(agent.indexOf('safari') > -1) { // Chrome or Safari
                if(agent.indexOf('opr') > -1) { // Opera
                    return browser = 'opera';
                } else if(agent.indexOf('chrome') > -1) { // Chrome
                    return browser = 'chrome';
                } else { // Safari
                    return browser = 'safari';
                }
            } else if(agent.indexOf('firefox') > -1) { // Firefox
                return browser = 'firefox';
            }

            // IE: ie7~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
            document.getElementsByTagName('html')[0].className = browser;
            
        },
        
    	destroy: function() {
        	
        	that = null;
        	
        	clearInterval(polling);
        	
        	this.removeEventListener();
        	
        	this.undelegateEvents();
        }
        
	 })

	    return Main;
	});