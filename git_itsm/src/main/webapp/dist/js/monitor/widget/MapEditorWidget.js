define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/monitor/mapEditorWidget",
    "css!cs/monitor/mapEditorWidget",
    "w2ui"
],function(
    $,
    _,
    Backbone,
    JSP,
    W2ui
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	function MapEditor(id) {
		this.selector = $("#"+id);
		_this = this;
		
		var Model = Backbone.Model.extend({
			model:Model,
			url:'/davisMonitor',
			parse: function(result) {
	            return {data: result};
	        }
		});
		_this.model = Model;
		
		this.init();
	}
	
	MapEditor.prototype = {
		init : function() {
			console.log("Map Editor Custom Widget Init");
			
			this.render();
		},
		
		render : function() {
			this.selector.append(JSP);
			
			let mapId = "map" + sessionStorage.GROUP_ID + "-"+sessionStorage.PRIVILEGE_ID;
			let mapDiv = '<div id="'+mapId+'" class="yesMap" type="map"></div>'
			$(".mapEditorWidget").append(mapDiv);
			
		},
		
		start: function() {
			this.yesMap = new mapEditor();
			this.eventListenerRegister();
			
			document.addEventListener("mapSymbolDblClick", this.mapSymbolDblClickEventHandler);
        	document.addEventListener("mapSymbolClick", this.mapSymbolClickEventHandler);
		},
		
		stop: function() {
			
			if(this.yesMap != null){
				this.yesMap.removeHandler();
			}
			this.yesMap = null;
			this.removeEventListener();
			
			document.removeEventListener("mapSymbolDblClick", this.mapSymbolDblClickEventHandler);
        	document.removeEventListener("mapSymbolClick", this.mapSymbolClickEventHandler);
		},
		
		getData : function() {
			
		},
		
		setData : function() {
			
		},
		
		 /* Double Click Event */
        mapSymbolDblClickEventHandler : function(event){
        	_this.listNotifiCation("getAssetInfo", event.detail.value.id);
        },
		
		eventListenerRegister : function(){
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
		},
		
		removeEventListener : function(){
        	$(document).off("click", "#criCntPop, #maCntPop, #miCntPop, #allCntPop");
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
        
        getAssetInfo : function(assetId){
        	var model = new _this.model();
        	model.url = '/davisMonitor/getAssetInfo/' + assetId;
        	model.fetch();
        	model.listenTo(model, 'sync', _this.setAssetInfo);
        },
        
        /*getAssetInfo : function(assetId){
        	$.ajax({
       		 type: "GET",
                url: "/davisMonitor/getAssetInfo" + assetId,
                contentType: "application/json; charset=utf-8",
                success: function(data, textStatus, xhr) {
               	 _this.setAssetInfo(data);
                },
                error: function(data, textStatus, xhr) {
                	
                }
            }).done(function(){
           	 
       	});
        },*/
        
        setAssetInfo : function(method, model, options){
        	let selectItem = model[0];
    		let popupHeight = 0;
        	let fields = [];
        	let record = {};
        	let body = "";
        	let closeBtnTxt = "";
        	let detailInfoTxt = "";
        	
        	if(sessionStorage.getItem("LOCALE") == "ko"){
        		closeBtnTxt = "닫기";
        		detailInfoTxt = "상세 정보";
        	}else{
        		closeBtnTxt = "Close";
        		detailInfoTxt = "Detail Info";
        	}
        	
        	if(selectItem.inout_status === 1){ // 실장장비 O
        		fields = [
	        		{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}},
					{name:'assetId', type: 'text', disabled:true, required:false, html:{caption:'ID'}},
					{name:'assetName', type: 'text', disabled:true, required:false, html:{caption:'NAME'}},
					{name:'productModel', type: 'text', disabled:true, required:false, html:{caption:'PRODUCT MODEL'}},
//					{name:'serialNumber', type: 'text', disabled:true, required:false, html:{caption:'SERIAL NUMBER'}},
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
//	    				serialNumber:selectItem.serial_number,
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
	    		'<button id="mapPopupOkBtn" onclick="w2popup.close();" class="darkButton">'+closeBtnTxt+'</button>'+ 
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
//        			{name:'serialNumber', type: 'text', disabled:true, required:false, html:{caption:'SERIAL NUMBER'}},
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
//        				serialNumber:selectItem.serial_number,
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
	    		'<button id="mapPopupOkBtn" onclick="w2popup.close();" class="darkButton">'+closeBtnTxt+'</button>'+
	    		'</div>'+
	    		'</div>'+ //w2ui-page page-0
	    		'</div>'+
	    		'</div>';
        		
        	}
        	
        	w2popup.open({
        		title : '[ ' + selectItem.asset_name + ' ] ' + detailInfoTxt,
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
        				
        				var svgContent = '<svg id="svgView" style="width:100%; viewBox="0 0 '+container.width + " "+container.height + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>';
						
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
//        		param : selectItem,
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
        	let model = new _this.model();
        	model.url += '/getEventViewerList/' + assetName;
        	model.fetch();
        	model.listenTo(model, 'sync', _this.setEventViewerList);
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
        		_this.listNotifiCation("getEventViewerList", name);
        	}, 10000);
        },
        
        popupEventBrowserRemoveTimer : function(){
        	if(this.popupTimer === null) return;
        	clearTimeout(this.popupTimer);
        },
        
        getCpuData : function(id){
        	var model = new _this.model();
        	model.url = "/dashboard/widget/sysmon/"+id;
        	model.fetch();
        	model.listenTo(model, 'sync', _this.setCpuData);
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
			var model = new _this.model();
			model.url = "/dashboard/widget/sysmon/"+id;
			model.fetch();
			model.listenTo(model, 'sync', _this.setMemData);
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
		
	}
	
    return MapEditor;
});