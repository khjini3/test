define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/davis/davisMonitor",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/davis/davisMonitor"
],function(
    $,
    _,
    Backbone,
    JSP,
    W2ui,
    BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var Model = Backbone.Model.extend({
		model:Model,
		url:'davisMonitor',
		parse: function(result) {
            return {data: result};
        }
	});
	
	 var Main = Backbone.View.extend({
	        el: '.content .wrap',
	    	initialize : function() {
	    		_this = this;
	    		this.yesMap = null;
	    		this.$el.append(JSP);
	    		this.timer = 0;
	    		this.popupTimer = 0;
	    		this.dataProvider = null; //Event Data 비교
	    		this.init();
	    		
	        	if(this.checkBrowser() == "chrome") {
	        		console.log("Chrome");
	        	} else if(this.checkBrowser() == "safari") {
	        		console.log("Safari");
	        	} else if(this.checkBrowser() == "firefox") {
	        		console.log("Firefox");
	        		/* The line-height is bigger than other browsers. */
	        		$("#leftContents").css("height", "calc(100% - 100px)");
	        		$("#mainContents").css("height", "calc(100% - 100px)");
	        	} else if(this.checkBrowser() == "opera") {
	        		console.log("Opera");
	        	} else {
	        		console.log("IE");
	        	} 
	        },
	        
	        events: {
	        	'click .severityBtnCls' : 'severityBtnClickHandler'
	        },
	        
	        severityBtnClickHandler : function(event){
	        	let severityRank = event.target.id;
	        	if(severityRank === 'ackBtn') return;
	        	let rack = 0;
	        	switch(severityRank){
	        		case "criCnt":
	        			rack = 1;
	        			break;
	        		case "maCnt":
	        			rack = 2;
	        			break;
	        		case "miCnt":
	        			rack = 3;
	        			break;
	        		case "allCnt":
	        			rack = '';
	        			break;
	    		}
	        	
	        	w2ui["eventBrower"].search('severity', rack);
	        	
	        },
	        
	        init : function(){
	        	
	        	$("#eventViwer").w2grid({
	        		name:'eventBrower',
	        		recordHeight : 35,
	        		multiSelect : true,
	        		style : 'width:100%; height:222px;',
	        		show : {
	        			selectColumn: true
	        		},
	        		columns: [
		 				   { field: 'severity', caption: 'Severity', size: '15%', sortable: true, attr: 'align=center', 
		 					  render : function(record){
		 						  	var imgName = "";
		 						  	switch(record.severity){
			 						  	case 1 :
			 						  		imgName = "Critical";
			 						  		break;
			 						  	case 2 :
			 						  		imgName = "Major";
			 						  		break;
			 						  	case 3 :
			 						  		imgName = "Minor";
			 						  		break;
		 						  	}
		 						  	return util.getDivIcon(imgName);
		                    	}
		 				   },
		 				   { field: 'msgGrp', caption: 'MSG Group', size: '15%', sortable: true, attr: 'align=center' },
		 				   { field: 'name', caption: 'NAME', size: '15%', sortable: true, attr: 'align=center' },
		 				   { field: 'app', caption: 'APP', size: '15%', sortable: true, attr: 'align=center' },
		 				   { field: 'updateTime', caption: 'UPDATE', size: '15%', sortable: true, attr: 'align=center' },
		 				   { field: 'ip', caption: 'IP', size: '10%', attr: 'align=center' }
	 				   ],
	 				   
	 				  onClick:function(target, data){
	 					 var selectItem = this.get(event.recid);
	 				  }
	 			
	        	});
	        	
	        	this.yesMap = new mapEditor(false);
	        	document.addEventListener("mapSymbolDblClick", this.mapSymbolDblClickEventHandler);
	        	document.addEventListener("mapSymbolClick", this.mapSymbolClickEventHandler);
	        	this.start();
	        },
	        
	        /* Double Click Event */
	        mapSymbolDblClickEventHandler : function(event){
//	        	console.log(event.detail);
	        	_this.listNotifiCation("getAssetInfo", event.detail.value.id);
	        },
	        
	        
	        mapSymbolClickEventHandler : function(event){
	        	console.log(event.detail);
	        },
	        
	        start : function(){
	        	this.eventListenerRegister();
	        	this.initTime();
	        },
	        
	        initTime : function(){
	        	let _this = this;
	        	
	        	_this.intervalMethod();
	        	
	        	if(_this.timer > 0){
	        		_this.removeTimer();
	        	}
	        	
	        	_this.timer = setInterval(function(){
	        		_this.intervalMethod();
	        	}, 10000);
	        },
	        
	        intervalMethod : function(){
	        	this.getEventBrowerData("getEventBrowerData");
	        },
	        
	        removeTimer : function(){
	        	let _this = this;
	        	if(_this.timer === null) return;
	        	clearTimeout(_this.timer);
	        },
	        /*
			 * get listNotification Method End
			 * */
	        
	        listNotifiCation : function(cmd, param){
	        	switch(cmd){
		        	case 'getEventBrowerData':
		        		this.getEventBrowerData();
		        		break;
		        	case 'getAssetInfo':
		        		this.getAssetInfo(param);
		        		break;
		        	case 'getEventViewerList':
		        		this.getEventViewerList(param);
		        		break;
		        	case 'ackData':
		        		this.ackData(param);
		        		break;
	        	}
	        },
	        
	        /*
			 * Set ListNotification Start
			 * */
	        
	        getEventBrowerData : function(){
	        	let model = new Model();
	        	model.url += "/getEventBrowerData";
	        	model.fetch();
	        	this.listenTo(model, "sync", this.setEventBrowerData);
	        },
	        
	        setEventBrowerData : function(method, model, options){
	        	if(util.compare(_this.dataProvider, model)){
	        		//console.log("일치");
	        	}else{
	        		console.log("불일치");
	        		if(w2ui['eventBrower']){
	        		    w2ui['eventBrower'].records = model;
		    			w2ui['eventBrower'].refresh();
		    			var criCnt = w2ui['eventBrower'].find({severity:1}).length;
		    			var maCnt = w2ui['eventBrower'].find({severity:2}).length;
		    			var miCnt = w2ui['eventBrower'].find({severity:3}).length;
		    			var allCnt = w2ui["eventBrower"].records.length;
		    			
		    			$("#criCnt").animateNumber({number :criCnt});
		    			$("#maCnt").animateNumber({number: maCnt});
		    			$("#miCnt").animateNumber({number: miCnt});
		    			$("#allCnt").animateNumber({number: allCnt});
		    			
		    			_this.dataProvider = model;
		    			
		    			_this.yesMap.initTimer();
	        		}
	    			
	        	}
        		
	        },
	        
	        getAssetInfo : function(assetId){
	        	let model = new Model();
	        	model.url += '/getAssetInfo/' + assetId;
	        	model.fetch();
	        	_this.listenTo(model, 'sync', _this.setAssetInfo);
	        },
	        
	        setAssetInfo : function(method, model, options){
	        	let selectItem = model[0];
        		let popupHeight = 0;
	        	let fields = [];
	        	let record = {};
	        	let body = "";
	        	
	        	if(selectItem.inout_status === 1){ // 실장장비 O
	        		fields = [
		        		{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}},
						{name:'assetId', type: 'text', disabled:true, required:false, html:{caption:'ID'}},
						{name:'assetName', type: 'text', disabled:true, required:false, html:{caption:'NAME'}},
						{name:'productModel', type: 'text', disabled:true, required:false, html:{caption:'PRODUCT MODEL'}},
//						{name:'serialNumber', type: 'text', disabled:true, required:false, html:{caption:'SERIAL NUMBER'}},
						{name:'revision', type: 'text', disabled:true, required:false, html:{caption:'REVISION'}},
						{name:'hwVersion', type: 'text', disabled:true, required:false, html:{caption:'H/W VERSION'}},
						{name:'fwVersion', type: 'text', disabled:true, required:false, html:{caption:'F/W VERSION'}},
						{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'RECEIPT DATE'}},
						{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'RELEASE DATE'}},
						{name:'location', type : 'text', disabled:true, required:false, html:{caption:'LOCATION'}},
						{name:'status', type : 'text', disabled:true, required:false, html:{caption:'STATUS'}},
						{name:'unitSize', type: 'int', disabled:true, required:false, html:{caption:'UNIT SIZE'}},
						{name:'startPosition', type: 'int', disabled:true, required:false, html:{caption:'START POSITION'}},
						{name:'unitIndex', type: 'int', disabled:true, required:false, html:{caption:'UNIT INDEX'}},
						{name:'ip', type: 'text', disabled:true, required:false, html:{caption:'IP'}}
					];
		        	
		        	record={
							assetId:selectItem.asset_id,
		    				assetName : selectItem.asset_name,
		    				productModel:selectItem.product_model,
		    				type:selectItem.code_name,
		    				unitSize : selectItem.unit_size,
//		    				serialNumber:selectItem.serial_number,
		    				revision:selectItem.revision,
		    				hwVersion:selectItem.hw_version,
		    				fwVersion:selectItem.fw_version,
		    				receiptDate:selectItem.receipt_date,
		    				releaseDate:selectItem.release_date,
		    				status:selectItem.status,
		    				startPosition : selectItem.start_pos,
							unitIndex : selectItem.uindex,
							ip : selectItem.ip
						};
		    		popupHeight = 785;
		    		
		    		body = '<div style="padding:0px;">'+
		    		'<div id="davisMoInfoPopupContents" style="width:100%; height:100%" >'+
		    		'<div class="w2ui-page page-0">'+
		    		
		    		'<div style="width: 16%; float: left; margin-right: 0px;">'+ // 0열       
		    		'<div id="mapSvgView">'+
		    		'</div>'+
		    		'</div>'+ // 0열
		    		
		    		'<div style="width: 28%; float: left; margin-right: 0px;">'+ // 1열       
		    		'<div class="" style="height: 185px;">'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">TYPE</label>'+
		    		'<div>'+
		    		'<input name="type" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">PRODUCT MODEL</label>'+
		    		'<div>'+
		    		'<input name="productModel" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">H/W VERSION</label>'+
		    		'<div>'+
		    		'<input name="hwVersion" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">RECEIPT DATE</label>'+
		    		'<div>'+
		    		'<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">UNIT SIZE</label>'+
		    		'<div>'+
		    		'<input name="unitSize" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'</div>'+
		    		'</div>'+ // 1열
		    		
		    		'<div style="width: 28%; float: left; margin-right: 0px;">'+ // 2열      
		    		'<div class="" style="height: 185px;">'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">ID</label>'+
		    		'<div>'+
		    		'<input name="assetId" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">IP</label>'+
		    		'<div>'+
		    		'<input name="ip" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">F/W VERSION</label>'+
		    		'<div>'+
		    		'<input name="fwVersion" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">RELEASE DATE</label>'+
		    		'<div>'+
		    		'<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">START POSITION</label>'+
		    		'<div>'+
		    		'<input name="startPosition" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'</div>'+
		    		'</div>'+ // 2열
		    		
		    		'<div style="width: 28%; float: left; margin-right: 0px;">'+ // 3열      
		    		'<div class="" style="height: 185px;">'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">NAME</label>'+
		    		'<div>'+
		    		'<input name="assetName" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">REVISION</label>'+
		    		'<div>'+
		    		'<input name="revision" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">STATUS</label>'+
		    		'<div>'+
		    		'<input name="status" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">LOCATION</label>'+
		    		'<div>'+
		    		'<input name="location" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">UNIT INDEX</label>'+
		    		'<div>'+
		    		'<input name="unitIndex" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'</div>'+
		    		'</div>'+ // 3열
		    		
		    		'<div style="clear: both; padding-top: 1px;"></div>'+
		    		
		    		'<div id="chartArea" style="height:220px;">'+
		    		'<div class="dashboard-panel" style="width:49%; height:99%; float:left;">'+
		    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
		    		'<div id="cpuChartTitle" style="float:left; padding:8px;">'+
		    		'<span>CPU</span>'+
		    		'</div>'+
		    		'</div>'+ //dashboard-title
		    		'<div class="dashboard-contents">'+
		    		'<div id="cpuChartArea" class="chart-area-div" style="float:left;"></div>'+
		    		'</div>'+ //dashboard-contents
		    		'</div>'+ //dashboard-panel
		    		
		    		'<div class="dashboard-panel" style="width:49%; height:99%; float:right;">'+
		    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
		    		'<div id="memoryChartTitle" style="float:left; padding:8px;">'+
		    		'<span>MEMORY</span>'+
		    		'</div>'+
		    		'</div>'+ //dashboard-title
		    		'<div class="dashboard-contents">'+
		    		'<div id="memoryChartArea" class="chart-area-div" style="float:right;"></div>'+
		    		'</div>'+ //dashboard-contents
		    		'</div>'+ //dashboard-panel
		    		'</div>'+
		    		
		    		'<div style="clear: both; padding-top: 15px;"></div>'+
		    		
		    		'<div id="mapPopupFooter" style="width:100%; height:252px;">'+ // Event Browser
		    		'<div class="dashboard-panel" style="width:100%; height:99%;">'+
		    		'<div class="dashboard-title" style="padding:0px;">'+
		    		'<div id="evtViewerTitle" style="float:left; padding:12px;">'+
		    		'<span>Event Viewer</span>'+
		    		'</div>'+ //evtViewerTitle
		    		'<div id="severityDiv">'+
	    			'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/ack_btn_img.png" class="severityBtn" id="ackBtnPop">'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
            		'<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">'+
            		'<div class="severityTxt" id="allCntPop">0</div>'+
            		'</div>'+
	            	'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/alarm_cr.png" class="severityBtn">'+
	        		'<div class="severityTxt" id="criCntPop">0</div>'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/alarm_ma.png" class="severityBtn">'+
	        		'<div class="severityTxt" id="maCntPop">0</div>'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/alarm_mi.png" class="severityBtn">'+
	        		'<div class="severityTxt" id="miCntPop">0</div>'+
	            	'</div>'+
	            	'</div>'+ //severityDiv
		    		'</div>'+ //dashboard-title
		    		'<div class="dashboard-contents">'+
		    		'<div id="mapPopupEventBottom"></div>'+
		    		'</div>'+ //dashboard-contents
		    		'</div>'+ //dashboard-panel
		    		'</div>'+ //mapPopupFooter
		    		
		    		'<div id="mapPopupBottom" style="text-align:center; position: relative; top:22px;">'+
		    		'<button id="mapPopupOkBtn" onclick="w2popup.close();" class="darkButton">'+ BundleResource.getString('button.davisMonitor.close') + '</button>'+
		    		'</div>'+
		    		'</div>'+ //w2ui-page page-0
		    		'</div>'+
		    		'</div>';
		    		
	        	}else{ // 실장장비 X
	        		
	        		fields = [
	        			{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}},
	        			{name:'assetId', type: 'text', disabled:true, required:false, html:{caption:'ID'}},
	        			{name:'assetName', type: 'text', disabled:true, required:false, html:{caption:'NAME'}},
	        			{name:'productModel', type: 'text', disabled:true, required:false, html:{caption:'PRODUCT MODEL'}},
//	        			{name:'serialNumber', type: 'text', disabled:true, required:false, html:{caption:'SERIAL NUMBER'}},
	        			{name:'revision', type: 'text', disabled:true, required:false, html:{caption:'REVISION'}},
	        			{name:'hwVersion', type: 'text', disabled:true, required:false, html:{caption:'H/W VERSION'}},
	        			{name:'fwVersion', type: 'text', disabled:true, required:false, html:{caption:'F/W VERSION'}},
	        			{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'RECEIPT DATE'}},
	        			{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'RELEASE DATE'}},
	        			{name:'location', type : 'text', disabled:true, required:false, html:{caption:'LOCATION'}},
	        			{name:'status', type : 'text', disabled:true, required:false, html:{caption:'STATUS'}},
	        			{name:'unitSize', type: 'int', disabled:true, required:false, html:{caption:'UNIT SIZE'}},
	        			{name:'ip', type: 'text', disabled:true, required:false, html:{caption:'IP'}}
	        			];
	        		
	        		record={
	        				type:selectItem.code_name,
	        				assetId:selectItem.asset_id,
	        				assetName : selectItem.asset_name,
	        				productModel:selectItem.product_model,
//	        				serialNumber:selectItem.serial_number,
	        				revision:selectItem.revision,
	        				hwVersion:selectItem.hw_version,
	        				fwVersion:selectItem.fw_version,
	        				receiptDate:selectItem.receipt_date,
	        				releaseDate:selectItem.release_date,
	        				location:selectItem.loc_name,
	        				status:selectItem.status,
	        				unitSize : selectItem.unit_size,
	        				ip : selectItem.ip
	        		};
	        		popupHeight = 785;
	        		
	        		body = '<div style="padding:0px;">'+
	        		'<div id="davisMoInfoPopupContents" style="width:100%; height:100%" >'+
		    		'<div class="w2ui-page page-0">'+
		    		
		    		'<div style="width: 16%; float: left; margin-right: 0px;">'+ // 0열       
		    		'<div id="mapSvgView">'+
		    		'</div>'+
		    		'</div>'+ // 0열
		    		
		    		'<div style="width: 28%; float: left; margin-right: 0px;">'+ // 1열       
		    		'<div class="" style="height: 185px;">'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">TYPE</label>'+
		    		'<div>'+
		    		'<input name="type" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">PRODUCT MODEL</label>'+
		    		'<div>'+
		    		'<input name="productModel" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">H/W VERSION</label>'+
		    		'<div>'+
		    		'<input name="hwVersion" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">RECEIPT DATE</label>'+
		    		'<div>'+
		    		'<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">UNIT SIZE</label>'+
		    		'<div>'+
		    		'<input name="unitSize" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'</div>'+
		    		'</div>'+ // 1열
		    		
		    		'<div style="width: 28%; float: left; margin-right: 0px;">'+ // 2열      
		    		'<div class="" style="height: 185px;">'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">ID</label>'+
		    		'<div>'+
		    		'<input name="assetId" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">IP</label>'+
		    		'<div>'+
		    		'<input name="ip" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">F/W VERSION</label>'+
		    		'<div>'+
		    		'<input name="fwVersion" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">RELEASE DATE</label>'+
		    		'<div>'+
		    		'<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'</div>'+
		    		'</div>'+ // 2열
		    		
		    		'<div style="width: 28%; float: left; margin-right: 0px;">'+ // 3열      
		    		'<div class="" style="height: 185px;">'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">NAME</label>'+
		    		'<div>'+
		    		'<input name="assetName" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">REVISION</label>'+
		    		'<div>'+
		    		'<input name="revision" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">STATUS</label>'+
		    		'<div>'+
		    		'<input name="status" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'<div class="w2ui-field w2ui-span4">'+
		    		'<label style="width: 116px;">LOCATION</label>'+
		    		'<div>'+
		    		'<input name="location" type="text" maxlength="100" size="20">'+
		    		'</div>'+
		    		'</div>'+
		    		
		    		'</div>'+
		    		'</div>'+ // 3열
		    		
		    		'<div style="clear: both; padding-top: 1px;"></div>'+
		    		
		    		'<div id="chartArea" style="height:220px;">'+
		    		'<div class="dashboard-panel" style="width:49%; height:99%; float:left;">'+
		    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
		    		'<div id="cpuChartTitle" style="float:left; padding:8px;">'+
		    		'<span>CPU</span>'+
		    		'</div>'+
		    		'</div>'+ //dashboard-title
		    		'<div class="dashboard-contents">'+
		    		'<div id="cpuChartArea" class="chart-area-div" style="float:left;"></div>'+
		    		'</div>'+ //dashboard-contents
		    		'</div>'+ //dashboard-panel
		    		
		    		'<div class="dashboard-panel" style="width:49%; height:99%; float:right;">'+
		    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
		    		'<div id="memoryChartTitle" style="float:left; padding:8px;">'+
		    		'<span>MEMORY</span>'+
		    		'</div>'+
		    		'</div>'+ //dashboard-title
		    		'<div class="dashboard-contents">'+
		    		'<div id="memoryChartArea" class="chart-area-div" style="float:right;"></div>'+
		    		'</div>'+ //dashboard-contents
		    		'</div>'+ //dashboard-panel
		    		'</div>'+
		    		
		    		'<div style="clear: both; padding-top: 15px;"></div>'+
		    		
		    		'<div id="mapPopupFooter" style="width:100%; height:252px;">'+ // Event Browser
		    		'<div class="dashboard-panel" style="width:100%; height:99%;">'+
		    		'<div class="dashboard-title" style="padding:0px;">'+
		    		'<div id="evtViewerTitle" style="float:left; padding:12px;">'+
		    		'<span>Event Viewer</span>'+
		    		'</div>'+ //evtViewerTitle
		    		'<div id="severityDiv">'+
	    			'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/ack_btn_img.png" class="severityBtn" id="ackBtnPop">'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
            		'<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">'+
            		'<div class="severityTxt" id="allCntPop">0</div>'+
            		'</div>'+
	            	'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/alarm_cr.png" class="severityBtn">'+
	        		'<div class="severityTxt" id="criCntPop">0</div>'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/alarm_ma.png" class="severityBtn">'+
	        		'<div class="severityTxt" id="maCntPop">0</div>'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
	        		'<img src="dist/img/idc/btn/alarm_mi.png" class="severityBtn">'+
	        		'<div class="severityTxt" id="miCntPop">0</div>'+
	            	'</div>'+
	            	'</div>'+ //severityDiv
		    		'</div>'+ //dashboard-title
		    		'<div class="dashboard-contents">'+
		    		'<div id="mapPopupEventBottom"></div>'+
		    		'</div>'+ //dashboard-contents
		    		'</div>'+ //dashboard-panel
		    		'</div>'+ //mapPopupFooter
		    		
		    		'<div id="mapPopupBottom" style="text-align:center; position: relative; top:22px;">'+
		    		'<button id="mapPopupOkBtn" onclick="w2popup.close();" class="darkButton">'+ BundleResource.getString('button.davisMonitor.close') + '</button>'+
		    		'</div>'+
		    		'</div>'+ //w2ui-page page-0
		    		'</div>'+
		    		'</div>';
	        		
	        	}
	        	
	        	w2popup.open({
	        		title : '[ ' + selectItem.asset_name + ' ] ' + BundleResource.getString('title.davisMonitor.detailInfo'),
	        		body: body,
	        		width : 1030,
	        		height : popupHeight,
	        		type : 'Info',
	        		opacity   : '0.5',
	        		param : selectItem,
	        		selectItem : selectItem,
	        		modal     : true,
	        		showClose : true,
	        		style	  : "overflow:hidden;",
	        		onOpen    : function(event){
	        			event.onComplete = function () {
	        				_this.listNotifiCation("getEventViewerList", event.options.selectItem.asset_name);
	        				_this.popupEventBrowserInitTimer(event.options.selectItem.asset_name);
	        				_this.getCpuData(1);
	        				_this.getMemData(2);
	        				_this.timer = setInterval(function(){
	        					_this.getCpuData(1);
	        					_this.getMemData(2);
	        				}, 60000);
	        			}
	        		},
	        		onClose   : function(event){
	        			w2ui['davisMo_popup_properties'].destroy();
	        			w2ui['mapPopupEventBrowser'].destroy();
	        			_this.popupEventBrowserRemoveTimer();
	        			clearInterval(_this.timer);
	        		}
	        	});
	        	
	        	$("#davisMoInfoPopupContents").w2form({
	        		name : 'davisMo_popup_properties',
	        		style:"border:1px solid rgba(0,0,0,0)",
	        		focus : 1,
	        		fields : fields,
	        		record : record,
	        		selectItem : selectItem,
	        		onRender : function(event){
	        			event.onComplete = function(){
	        				d3.selectAll("#svgView .pop-yes-symbol").remove();
	        				let container = {
	        						width : $("#mapSvgView").width(),
	        						height : $("#mapSvgView").height()
	        				};
	        				
	        				var svgContent = '<svg id="svgView" style="width:100%; height:100%; viewBox="0 0 '+container.width + " "+container.height + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>';
							
	        				$("#mapSvgView").append(svgContent);
	        				let item = this.selectItem;
	        				let parseEl = jQuery.parseXML(item.symbol_svg);
	        				parseEl = parseEl.documentElement; //svg code만 추출
	        				$(parseEl).attr("class", "pop-yes-symbol");
	        				$(parseEl).attr("symbol-type", item.code_name);
	        				$(parseEl).attr("id", item.asset_id); //symbol ID 부여
	        				
	        				let makeSvg = function(tag, attrs, orgTag){
	        					let el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	        					
	        					for (var i=0; i < attrs.length; i++){
	        						let item = attrs[i];
	        						el.setAttribute(item.name, item.value);
	        					}
	        		            
	        					if(tag === "text"){
	        						el.innerHTML = orgTag.innerHTML;
	        					}
	        					
	        					return el;
	        				};
	        				
	        				let symbol = makeSvg(parseEl.tagName, parseEl.attributes); //SVG Tag로 감싸주는 역활
	        				
	        				for(var j=0; j < parseEl.childElementCount; j++){
	        					let child = parseEl.children[j];
	        					
	        					switch(j.toString()){
		    						case "0" : //image
		    							$(child).attr("class", "popup-symbol-img-bg");
		    							break;
		    						case "1" : //Severity bg
		    							$(child).attr("class", "popup-severity-bg").attr("fill", "none");
		    							break;
		    						case "2" : //border
		    							$(child).attr("class", "popup-severity-border").attr("fill", "none");
		    							break;
		    						case "3" : //text
		    							$(child).attr("fill", item.color).attr("fill", "white").attr("class", "popup-symbol-text").attr("text-anchor", "middle");
		    							break;
		    					}
	        					
	        					let element = makeSvg(child.tagName, child.attributes, child);
	        					
	        					if(child.tagName === "text"){
	    							element.innerHTML = item.asset_name;
	        					}
	        					
	        					$(symbol).append(element);
	        				}
	        				
	        				$('#svgView').append(symbol);
	        				
							let symbolBox = symbol.getBBox();
							let symbolScale = 1;
							if(container.width < symbolBox.width){
								symbolScale = container.width / symbolBox.width;
							}
							
							let symbolMargin = {};
							symbolMargin.width = (container.width - symbolBox.width)/2;
							symbolMargin.height = (container.height - symbolBox.height)/2;
								
							$(symbol).attr("transform",  'translate('+ symbolMargin.width  +','+ symbolMargin.height  +') scale('+symbolScale+')');
							
	        			}
	        		}
	        	});
	        	
	        	$("#mapPopupEventBottom").w2grid({
	        		name : 'mapPopupEventBrowser',
	        		recordHeight : 35,
	        		multiSelect : true,
	        		style : 'height:210px',
//	        		param : selectItem,
	        		show : {
	        			selectColumn : true
	        		},
	        		columns: [
 	 				   { field: 'recid', caption: 'NO', size: '10%', attr: 'align=center' },
 	 				   { field: 'severity', caption: 'SEVERITY', size: '15%', sortable: true, attr: 'align=center',
 	 					   render : function(record){
 	 						 var imgName = "";
	 						  	switch(record.severity){
		 						  	case 1 :
		 						  		imgName = "Critical";
		 						  		break;
		 						  	case 2 :
		 						  		imgName = "Major";
		 						  		break;
		 						  	case 3 :
		 						  		imgName = "Minor";
		 						  		break;
	 						  	}
	 						  	return util.getDivIcon(imgName);
 	 					   }
 	 				   },
 	 				   { field: 'msgGrp', caption: 'MSG Group', size: '15%', sortable: true, attr: 'align=center' },
 	 				   { field: 'name', caption: 'NAME', size: '15%', sortable: true, attr: 'align=center' },
 	 				   { field: 'parentName', caption: 'PARENT NAME', size: '15%', sortable: true, attr: 'align=center', hidden:true },
 	 				   { field: 'app', caption: 'APP', size: '15%', sortable: true, attr: 'align=center' },
 	 				   { field: 'obj', caption: 'OBJECT', size: '15%', sortable: true, attr: 'align=center', hidden:true },
 	 				   { field: 'updateTime', caption: 'UPDATE', size: '15%', sortable: true, attr: 'align=center' },
 	 				   { field: 'dupplication', caption: 'DUPLICATION', size: '15%', sortable: true, attr: 'align=center', hidden:true },
 	 				   { field: 'ip', caption: 'IP', size: '10%', attr: 'align=center' }
  				   ],
  				   onClick : function(event){
  					   var item = this.get(event.recid);
  				   }
	        	});
	        },
	        
	        getEventViewerList : function(assetName){
	        	let model = new Model();
	        	model.url += '/getEventViewerList/' + assetName;
	        	model.fetch();
	        	_this.listenTo(model, 'sync', _this.setEventViewerList);
	        },
	        
	        setEventViewerList : function(method, model, options){
	        	w2ui['mapPopupEventBrowser'].records = model;
	        	w2ui['mapPopupEventBrowser'].refresh();
	        	
	        	var criCntPop = w2ui['mapPopupEventBrowser'].find({severity:1}).length;
    			var maCntPop = w2ui['mapPopupEventBrowser'].find({severity:2}).length;
    			var miCntPop = w2ui['mapPopupEventBrowser'].find({severity:3}).length;
    			var allCntPop = w2ui["mapPopupEventBrowser"].records.length;
    			
    			//criCnt maCnt miCnt
    			$("#criCntPop").animateNumber({ number: criCntPop });
    			$("#maCntPop").animateNumber({ number: maCntPop });
    			$("#miCntPop").animateNumber({ number: miCntPop });
    			$("#allCntPop").animateNumber({ number: allCntPop });
	        },
	        
	        popupEventBrowserInitTimer : function(name){
	        	if(this.popupTimer > 0){
	        		_this.popupEventBrowserRemoveTimer();
	        	}
	        	this.popupTimer = setInterval(function(){
//	        		var item = w2ui['mapPopupEventBrowser'].param;
	        		_this.listNotifiCation("getEventViewerList", name);
	        	}, 10000);
	        },
	        
	        popupEventBrowserRemoveTimer : function(){
	        	if(this.popupTimer === null) return;
	        	clearTimeout(this.popupTimer);
	        },
	        
	        ackData : function(param){
	        	var model = new Model(param);
	        	model.url +="/ackData";
	        	model.save(null, {
	        		success: function(model, response) {
	        			w2alert('정상적으로 ACK 처리 되었습니다.', "알림", function(event){
//	        				sceneComp.idc.eventBrowerinitTimer();
	    				});
	        		},
	        		error: function(model, response) {
	        			w2alert('일시적 오류가 발생했습니다.', "알림", function(event){
//	        				sceneComp.idc.eventBrowerinitTimer();
	    				});
	        		}
	        	});
	        },
	        
	        getCpuData : function(id){
	        	var model = new Model();
	        	model.url = "/dashboard/widget/sysmon/"+id;
	        	model.fetch();
	        	_this.listenTo(model, 'sync', _this.setCpuData);
	        },
	        
	        setCpuData : function(method, model, options){
	        	console.log(model);
	        	if(model.data.cpu == undefined) return;
	        	var coreUsage = model.data.cpu.coreUsage;
				var coreArr = coreUsage.split(",");
				var total = 0;
				var avg = 0;
				var time = _this.getTime(model.data.cpu.recordTime);
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
				
				_this.renderCpuChart(1, ["CPU-AVG"], [{label: time, value: avg.toFixed(2)}]);
	        },
	        
	        renderCpuChart : function(length, cpuNameArr, dataArr){
	        	var id = $("#chartArea").find("#cpuChartArea");
	        	var count = id.find("canvas").length;
	        	
	        	if(count == 0){
	        		id.realtime({dataLength:10, count:length, name:cpuNameArr, type:'line'});
	        	}
	        	id.realtime('update', dataArr);
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
			
			getMemData : function(id){
				var model = new Model();
				model.url = "/dashboard/widget/sysmon/"+id;
				model.fetch();
				_this.listenTo(model, 'sync', _this.setMemData);
			},
			
			setMemData : function(method, model, options){
				console.log(model);
				if(model.data.memory == undefined) return;
				var memoryData = model.data.memory;
				var time = _this.getTime(model.data.memory.recordTime);
				var dataArr = [];
				var nameArr = ['Mem-Usage','Swap-Usage'];
				
				var memUsage = Number(memoryData.usedMemory) / Number(memoryData.totalMemory) * 100;
				var swapMemUsage = Number(memoryData.usedSwapMemory) / Number(memoryData.totalSwapMemory) * 100;
				memUsage = memUsage.toFixed(2);
				swapMemUsage = swapMemUsage.toFixed(2)
				dataArr.push({"label": time, "value": memUsage});
				dataArr.push({"label": time, "value": swapMemUsage});
				
				_this.setLineChart(nameArr, dataArr);
			},
			
			setLineChart : function(nameArr, dataArr){
				var id = $("#chartArea").find("#memoryChartArea");
				var count = id.find("canvas").length;
				if(count == 0) id.realtime({
											dataLength:10, count: nameArr.length, name: nameArr, type: 'line',
											color: ['#cd5e7e','#85b6b2','#e38980','#f7db88','#85b6b2', '#6d4f8d'],
											area: true, yAxis: {type: 'value',max: 100}
										  });
				id.realtime('update', dataArr);
			},
	        
	        //이벤트 등록
	        eventListenerRegister : function(){
	        	window.addEventListener("jiniworld", function(e){
	        		console.log(e);
	        	});
	        	
	        	/*Severity Btn Click Event Listener*/
	        	$(document).on("click", "#criCntPop, #maCntPop, #miCntPop, #allCntPop", function(e){
	        		
	        		var severityRank = e.currentTarget.id;
	        		
	        		var seValue = 0;
	        		switch(severityRank){
		        		case "criCnt":
		        		case "criCntPop":
		        			seValue = 1;
		        			break;
		        		case "maCnt":
		        		case "maCntPop":
		        			seValue = 2;
		        			break;
		        		case "miCnt":
		        		case "miCntPop":
		        			seValue = 3;
		        			break;
		        		case "allCnt":
		        		case "allCntPop":
		        			seValue = '';
		        			break;
	        		}
        			w2ui["mapPopupEventBrowser"].search('severity', seValue);
	        	});
	        	
	        	/*Ack Btn Click Event Listener*/ // 나중에 구현할때 주석 해제
	        	/*$(document).on("click", '#davisMoInfoPopupContents img#ackBtnPop', function(e){
	        		var arr = w2ui['mapPopupEventBrowser'].getSelection();
	        		var param = {};
	        		param.dataAC = [];
	        		
	        		if(arr.length > 0){
	        			for(var i=0; i<arr.length; i++){
	        				param.dataAC.push(w2ui['mapPopupEventBrowser'].get(arr[i]));
	        			}
	        			_this.listNotifiCation("ackData", param);
	        		}else{
	        			// 선택된 이벤트가 없습니다.
	        		}
	        	});*/
	        },
	        
	        //이벤트 해제
	        removeEventListener : function(){
	        	$(document).off("click", "#criCntPop, #maCntPop, #miCntPop, #allCntPop");
//	        	$(document).off("click", "#davisMoInfoPopupContents img#ackBtnPop");
	        },
	        
	        destroy: function() {
	        	this.undelegateEvents();
	        	this.yesMap.removeHandler();
	        	this.yesMap = null;
	        	
	        	if(w2ui["eventBrower"]){
	        		w2ui["eventBrower"].destroy();
	        	}
	        	
	        	if(w2ui['davisMo_popup_properties']){
	        		w2ui['davisMo_popup_properties'].destroy();
	        	}
	        	
	        	if(w2ui['mapPopupEventBrowser']){
	        		w2ui['mapPopupEventBrowser'].destroy();
	        	}
	        	
	        	document.removeEventListener("mapSymbolDblClick", this.mapSymbolDblClickEventHandler);
	        	document.removeEventListener("mapSymbolClick", this.mapSymbolClickEventHandler);
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
	            
	        }
	 });
	
	return Main;
});