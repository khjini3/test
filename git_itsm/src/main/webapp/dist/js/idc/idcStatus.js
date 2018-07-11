define([
    "jquery",
    "underscore",
    "backbone",
    "idc",
    "text!views/idc/idc",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/idc/idc"
],function(
    $,
    _,
    Backbone,
    IdcLoader,
    IdcJSP,
    W2ui,
    BundleResource
){
	var Model = Backbone.Model.extend({
		model:Model,
		url:'idc',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		this.rackAlign = null, //rack 정렬 상태 asc, desc
    		this.pathArr = [];
    		this.soundFlag = true;
    		this.elements = {
    			sceneComp : null, //IDC Component
    			eventBrowerTImter : 0, //Event Timer
    			iconTimer : 0, //Main Icon Timer
    			eventDataProvider : null, //EventBrower Data
    			popupTImter : 0, //POPUPEvent Timer
    			popupDataProvider : null, //POPUP EventBrower Data
    			follingTime : 5000 //EventFolling Time
    		};
    		
    		this.$el.append(IdcJSP);
    		this.init();
    		//3D
    		this.start();
        },
        
        events : {
        	'click .subNavi' : 'subNaviClickHandler',
        	'click .idcCls img#ackBtn' : 'ackBtnClickHandler',
        	'click #soundBtn' : 'soundHandler'
        },
        
        /* alarm button toggle */
        soundHandler : function(event){
        	
        	if($("#soundBtn").hasClass('fa-sound_on')){
        		$("#alarmAudio").trigger('pause');
        		$("#soundBtn").removeClass('fa-sound_on');
        		$("#soundBtn").addClass('fa-sound_off');
//        		$("#soundBtn").css("color", "#4e4e4e");
        		
        	}else{
        		$("#soundBtn").removeClass('fa-sound_off');
        		$("#soundBtn").addClass('fa-sound_on');
//        		$("#soundBtn").css('color', '#fff');
        		if(this.soundFlag){
            		$("#alarmAudio").trigger('play');
            	}
        	}
        },
        
        ackBtnClickHandler : function(event){ //gihwan
        	var arr = w2ui["eventBrower"].getSelection();
        	var param = {};
        	param.dataAC = [];
        	
        	if(arr.length > 0){
        		for(var i=0; i < arr.length; i++){
            		param.dataAC.push(w2ui["eventBrower"].get(arr[i]));
            	}
        		
        		this.listNotifiCation("ackData", param);
        	}else{
        		w2alert('선택된 이벤트가 없습니다.', "알림");
        	}
        },
        
        init : function(){
        	this.elements.sceneComp = new Idc3DLoader('#idcRenderCanvas');
        	sceneComp = this.elements.sceneComp;
        	sceneComp.setIdc(this);
        	this.eventListenerRegister(); //이벤트 리스너 등록
        	this.listNotifiCation("getConfig");
        },
        
        buildingUI : function(){
        	this.removeUI();
        	this.eventBrowerRender();
        	this.leftContentsUI('building');
        	this.rightContentsUI('building');
        },
        
        floorUI : function(){
        	this.removeUI();
        	this.eventBrowerRender();
        	this.leftContentsUI('floor');
        	this.rightContentsUI('floor');
        },
        
        roomUI : function(){
        	this.removeUI();
        	this.eventBrowerRender();
        	this.leftContentsUI('room');
        	this.rightContentsUI('room');
        },
        
        leftContentsUI : function(status){
        	var iconMenu = "";
        	
        	switch(status){
	    		case "building":
	    		case "floor":
	    			iconMenu = '<div id="iconPanel">'+
	    			'<img src="dist/img/idc/alarmIcon/icon_server_normal.png" id="serverImg" style="cursor:pointer;" class="severityIcon">'+
	    			'<img src="dist/img/idc/alarmIcon/icon_ups_normal.png" id="upsImg" style="cursor:pointer;" class="severityIcon">'+
	    			'<img src="dist/img/idc/alarmIcon/icon_temperature_normal.png" id="temperatureImg" style="cursor:pointer;" class="severityIcon">'+
	    			'<img src="dist/img/idc/alarmIcon/icon_waterLeak_normal.png" id="waterLeakImg" style="cursor:pointer;" class="severityIcon">'+
	    			'</div>';
	    			$("#leftMenu").css("width", "150px");
	    			$("#leftMenu").html(iconMenu);
	    			break;
	    		case "room":
	    			iconMenu = '<div id="btnPanel">'+
	    			'<img src="dist/img/idc/btn/label_on.png" id="btn_label" style="cursor:pointer;" class="btnOnOffCls">'+
	    			'<img src="dist/img/idc/btn/temperature_on.png" id="btn_temperature" style="cursor:pointer;" class="btnOnOffCls">'+
	    			'<img src="dist/img/idc/btn/fire_off.png" id="btn_fire" style="cursor:pointer;" class="btnOnOffCls">'+
	    			'<img src="dist/img/idc/btn/waterLeak_off.png" id="btn_waterLeak" style="cursor:pointer;" class="btnOnOffCls">'+
	    			'</div>';
	    			$("#leftMenu").css("width", "");
	    			$("#leftMenu").html(iconMenu);
	    			break;
	    	}
        },
        
        createSubNavi : function(){
        	var naviContents = '';
        	for(var i=0; i < this.pathArr.length; i++){
        		var item = this.pathArr[i]; 
        		if(i===0){
        			if(this.pathArr.length > 1){
        				naviContents+= '<span id="subNavi_'+i+'" class="subNavi">'+item.toolTipTxt+'</span>';
        			}else{
        				naviContents+= '<span id="subNavi_'+i+'" class="currentNavi">'+item.toolTipTxt+'</span>';
        			}
        			
        		}else if(i === this.pathArr.length-1){
        			naviContents+= ' <img src="dist/img/idc/navi/right_arrow.png" class="naviArrowCls"><span id="subNavi_'+i+'" class="currentNavi">'+item.toolTipTxt+'</span>';
        		}else{
        			naviContents+= ' <img src="dist/img/idc/navi/right_arrow.png" class="naviArrowCls"><span id="subNavi_'+i+'" class="subNavi">'+item.toolTipTxt+'</span>';
        		}
        		
        	}
        	
        	$("#naviIcon").html(naviContents);
        },
        
        rightContentsUI : function(status){
				var naviIcon = '';
				        	
	        	switch(status){
		        	case 'building':
		        		naviIcon ='<div id="naviIcon"></div>'+
		            	'<div id="contentsBox" ></div>';
		        		$("#rightMenu").html(naviIcon);
		        		this.createSubNavi();
		            	'<div id="contentsBox" style="display:none"></div>';
		        		break;
		        	case 'floor':
		        		naviIcon ='<div id="naviIcon"></div>'+
		            	'<div id="contentsBox" ></div>';
		        		$("#rightMenu").html(naviIcon);
		        		this.createSubNavi();
		        		$("#navi-floor").attr("src","dist/img/idc/navi/floor_over.png");
		        		break;
		        	case 'room':
		        		naviIcon ='<div id="naviIcon"></div>'+
		            	'<div id="contentsBox" style="display:none"></div>';
		        		$("#rightMenu").html(naviIcon);
		        		this.createSubNavi();
		        		$("#navi-room").attr("src","dist/img/idc/navi/room_over.png");
		        		$("#contentsBox").css("display", "block");
		        		
		        		$("div.assetSearchContents").remove();
		        		
		        		var assetSearchRe = '<div id="assetSearchContents">'+ 
		        			'<div class="assetSearchImg" style="float:left;position: relative; left: 1px;">'+
		        				'<img src="dist/img/idc/btn/asset_search.png" id="search-asset-img">'+
		        			'</div>'+
			        		'<div id="assetSearch" >'+
			        		'<div id="searchTop">'+
			        		 	'<div style="float:left;padding-top: 4px;">'+
			        		 	'<img src="dist/img/idc/btn/camera_icon.png" id="search-camera-img" style="opacity:0.5;">'+
			        		 	'<label id="asset-search-lbl" style="border:0px;" >ASSET TYPE</label></div>'+
				        		'<div class="w2ui-field w2ui-span3" style="float:right;margin-top: -27px;">'+
				        		'<div id="assetSearchContainer"> <input type="list" id="assetTypeInput" text="All"></div>'+
				        		'</div>'+
			        		'</div>'+
			        		'<div id="assetTable"></div>'+
			        		'</div>'+
		        		'</div>';
		        		
		        		$("#contentsBox").append(assetSearchRe);
		        		
		        		$("#assetTable").w2grid({
	                		name:'assetTable',
	                        show: { 
	                            toolbar: true,
	                            footer:false,
	                            toolbarSearch:false,
	                            toolbarReload  : false,
	                            searchAll : false,
	                            toolbarColumns : false
	                        },
	                       /* recordHeight : 40,*/
	                		multiSelect : false,
	                		style:'padding:5px;margin:0px 5px 5px 5px;width:230px;height:400px;float:right',
	                        searches: [
	                            { field: 'assetId', caption: 'ID ', type: 'text' }
	                        ],
	                        columns: [                
	                            { field: 'recid', caption: 'NO', size: '25%', sortable: true, attr: 'align=center' },
	                            { field: 'assetId', caption: 'ID', size: '50%', sortable: true },
	                            { field: 'modelType', caption: 'TYPE', size: '50%', sortable: true }
	                        ],
	                        
	                        onClick : function(event){
	                        	
	                        	var dataAC = w2ui['assetTable'].records;
	                        	var selectItem = this.get(event.recid);
	                        	var lblGroup = sceneComp.labelGroups;
	                        	
	                        	if(w2ui['assetTable'].getSelection()[0] == event.recid){
	                        		//선택 해제
	                        		$("#search-camera-img").css({cursor:"",opacity :0.5})
	                        		if(sceneComp.arrowAni){
	        							sceneComp.arrowAni.dispose();
	        						}
	                        		
	                        		sceneComp.scene.getMeshByID(selectItem.assetId).showBoundingBox = false;
	                        		
	                        		if(lblGroup.length > 0){
	                        			var initLbl = _.filter(lblGroup, function(obj){
	                            			return obj.id.split("#")[1] === selectItem.assetId;
	                            		});
	                        			
	                            		initLbl[0].children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(255,255,255,1);
	                        		}
	                        		
	                        		return;
	                        	}
	                        	
	                        	/*$("#search-camera-img").css({visibility:"visible"})*/
	                        	$("#search-camera-img").css({cursor:"pointer",opacity :1});
	                        	
	                        	for(var i=0; i < dataAC.length; i++){
	                        		var item = dataAC[i];
	                        		var mesh = sceneComp.scene.getMeshByID(item.assetId);
	                        		if(item.assetId === selectItem.assetId){
	                        			mesh.showBoundingBox = true;
	                        			
	                        			var meshSize = mesh.getBoundingInfo().boundingBox.extendSize;
	            						var meshHeight = (meshSize.y*2)*mesh.scaling.y;
	            						if(sceneComp.arrowAni){
	            							sceneComp.arrowAni.dispose();
	            						}
	            						sceneComp.arrowAni = new BABYLON.Sprite("arrowAni", sceneComp.spriteManger);
	            						sceneComp.arrowAni.playAnimation(0, 6, true, 100);
	            						sceneComp.arrowAni.size = 10;
	            						sceneComp.arrowAni.position.x = mesh.position.x;
	            						sceneComp.arrowAni.position.y = mesh.position.y+meshHeight+sceneComp.arrowAni.height;
	            						sceneComp.arrowAni.position.z = mesh.position.z;
	            						
	                        			if(lblGroup.length > 0){
	                        				for(var j=0; j < lblGroup.length; j++){
	                        					var lbl = lblGroup[j];
	                        					if(lbl.id.split("#")[1] === item.assetId){
	                        						
	                        						lbl.children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(0,255,255,1);
	                        						//sceneComp.camera.target = mesh;
	                        						
	                        					}else{
	                        						lbl.children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(255,255,255,1);
	                        					}
	                        					
	                        				}
	                        				
	                        			}
	                        			
	                        		}else{
	                        			mesh.showBoundingBox = false;
	                        		}
	                        		
	                        	}
	                        }
	                    });
		        		
		        		break;
	        	}
        },
        
        removeUI :function(){
        	
        	if(w2ui['assetTable']){
    			w2ui['assetTable'].destroy();
    		}
        	
        	if(w2ui['properties']){
        		w2ui['properties'].destroy();
        	}
        	
        	if(w2ui['popupEventBrower']){
        		w2ui['popupEventBrower'].destroy();
        	}
	    	
        	if(w2ui['unitTableDiv']){
        		w2ui['unitTableDiv'].destroy();
        	}
        	
        	if(w2ui['footerInfo']){
        		w2ui['footerInfo'].destroy();
        	}
        	
        	if(w2ui['eventBrower']){
        		w2ui['eventBrower'].destroy();
        	}
        	
        	this.eventBrowerRemoveTimer();
        	this.elements.eventDataProvider = null;
        	
        	this.iconRemoveTimer();
        	
        	$("#leftMenu").empty();
        	$("#rightMenu").empty();
        	$("#eventBrower").empty();
        },
        
        eventBrowerRender : function(){
        	/*
        	 * EventBrower 생성
        	 * */
        	
        	var eventBrowerContents = '<div class="dashboard-panel" style="width:100%; background-color: rgba(2, 15, 39, 0.86);">'+
        	
										    	   	'<div class="dashboard-title" style="padding:0px;">'+
										    	   		'<div id="topDownDiv"></div>'+
										    	   		'<div id="severityDiv">'+
										    	   			/* Alarm Audio Setting */
										    	   			'<audio id="alarmAudio" controls loop style="display:none;">'+
										    	   		    '<source src="dist/sounds/alarm.mp3" type="audio/mpeg">'+
										    	   			'</audio>'+
										    	   			/* Alarm Button */
											    	   		'<div class="severityBtnCls" style="text-align:center;padding:5px;width:50px;">'+
											    	   		'<i class="severityBtn fab fa-sound_on" id="soundBtn" title="sound on"></i>'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/ack_btn_img.png" class="severityBtn" id="ackBtn">'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/alarm_cr.png" class="severityBtn">'+ //cr_btn_img
												        	'<div class="severityTxt" id="criCnt">0</div>'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/alarm_ma.png" class="severityBtn">'+//ma_btn_img
												        	'<div class="severityTxt" id="maCnt">0</div>'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/alarm_mi.png" class="severityBtn">'+//mi_btn_img
												        	'<div class="severityTxt" id="miCnt">0</div>'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/alarm_wa.png" class="severityBtn">'+//wa_btn_img
												        	'<div class="severityTxt" id="waCnt">0</div>'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/alarm_no.png" class="severityBtn">'+//no_btn_img
												        	'<div class="severityTxt" id="noCnt">0</div>'+
												        	'</div>'+
												        	'<div class="severityBtnCls">'+
												        	'<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">'+
												        	'<div class="severityTxt" id="allCnt">0</div>'+
												        	'</div>'+
											        	'</div>'+ //severityDiv close
										    	   	'</div>'+ //title close
											    	
										    	   	'<div class="dashboard-contents">'+
										    			'<div id="eventBottom"></div>'+
										    		'</div>'+ //contents close
										       '</div>'; //panel close
        		
        	
        	$("#eventBrower").html(eventBrowerContents);
        	
        	var buttonTop = $('<img />', {
        		id:'btnTop',
        		src : 'dist/img/idc/btn/event_up_btn.png',
        		click: function(e){
        			$("#btnTop").css('display','none');
        			$("#btnDown").css('display','block');
        			$("#eventBrower").animate({bottom:0}, 500);
        		}
        	});
        	
        	var buttonDown = $('<img />', {
        		id:'btnDown',
        		src : 'dist/img/idc/btn/event_down_btn.png',
        		click: function(e){
        			$("#btnTop").css('display','block');
        			$("#btnDown").css('display','none');
        			$("#eventBrower").animate({bottom:-302}, 500);
        		},
        		style : 'display:none;'
        	});
        	
        	$("#topDownDiv").append(buttonTop, buttonDown);
        	
        	$("#eventBottom").w2grid({
        		name:'eventBrower',
        		recordHeight : 35,
        		multiSelect : true,
        		show : {
        			selectColumn: true
        		},
        		columns: [
	 				   { field: 'severity', caption: 'Severity', size: '15%', sortable: true, attr: 'align=center', 
	 					  render : function(record){
	 						  	var imgName = "";
	 						  	switch(record.severity){
		 						  	case 1 :
		 						  		imgName = "Normal";
		 						  		break;
		 						  	case 2 :
		 						  		imgName = "Warning";
		 						  		break;
		 						  	case 3 :
		 						  		imgName = "Minor";
		 						  		break;
		 						  	case 4 :
		 						  		imgName = "Major";
		 						  		break;
		 						  	case 5 :
		 						  		imgName = "Critical";
		 						  		break;
	 						  	}
	 						  	return util.getDivIcon(imgName);
	                    	}
	 				   },
	 				   { field: 'msgGrp', caption: 'MSG Group', size: '15%', sortable: true, attr: 'align=center' },
	 				   { field: 'name', caption: 'NAME', size: '15%', sortable: true, attr: 'align=center' },
	 				   { field: 'dupplication', caption: 'APP', size: '15%', sortable: true, attr: 'align=center' },
	 				   { field: 'updateTime', caption: 'UPDATE', size: '15%', sortable: true, attr: 'align=center' },
	 				   { field: 'ip', caption: 'IP', size: '10%', attr: 'align=center' }
 				   ],
 				   
 				  onClick:function(target, data){
 					 var selectItem = this.get(event.recid);
 				  }
 			
        	});
        },
        
        start: function() {
        	/*
        	 * 빌딩, 층, 룸 작업시 아래 Noti를 변경
        	 * */
        	this.listNotifiCation("createBuild" , "1");
        	
        },
        
        /*이벤트 등록*/
        subNaviClickHandler : function(event){
        	var currentNum = parseInt(event.currentTarget.id.split("_")[1]);
        	
        	for(var i = this.pathArr.length-1; i >= 0; i--){
        		if(i === currentNum){
        			var mesh = this.pathArr[i];
        			if(mesh.hasOwnProperty("id")){
        				this.listNotifiCation("createBuild" , mesh.id);
        			}else{
        				this.listNotifiCation("createBuild" , mesh.assetId);
        			}
        			
        			break;
        			
        		}else{
        			this.pathArr.pop(i);
        		}
        		
        	}
        },
        
        eventListenerRegister : function(){
        	
        	$(document).on("contextmenu", function(event){
        		event.preventDefault();
        		if(event.target.id === "idcRenderCanvas"){
        			$("div.custom-menu").remove();
            		$("<div class='custom-menu'>Camera 초기화</div>").appendTo("body")
            			.css({
            				top:event.pageY+"px",
            				left:event.pageX+"px"
            			});
            		
        		}else if(event.target.id === "popupCanvas"){
        			$("div.popup-custom-menu").remove();
        			$("<div class='popup-custom-menu' style='position:absolute;padding:2px;'>Camera 초기화</div>").prependTo("div#canvasContents")
        			.css({
        				top:event.offsetY+"px",
            			left:event.offsetX+"px"
        			});
        		}
        	});
        	
        	$(document).on("click", "body", function(event){
        		if(event.target.className === "custom-menu"){
        			sceneComp.resetCamera();
        		}
        		
        		$("div.custom-menu").remove();
        		
        	});
        	
        	$(document).on("click", "#canvasContents", function(event){
        		if(event.target.className === "popup-custom-menu"){
        			sceneComp.resetCamera("popup");
        		}
        		
        		$("div.popup-custom-menu").remove();
        		
        	});
        	
        	/*Scene Double Click Event*/
        	$("#idcRenderCanvas").dblclick(function(e){
        		var currentStatus = sceneComp.currentState;
        		if(currentStatus === "room"){
        			sceneComp.idc.modelDblClickEventHandler(e);
        		}
        	});
        	
        	$("#idcRenderCanvas").mousedown(function(e){
    			sceneComp.aniCheck.aniFlug = false;	
        	});
        	
        	$("#idcRenderCanvas").mouseup(function(e){
        		if(sceneComp.currentState ==="building"){
        			sceneComp.aniCheck.aniFlug = true;
        		}
        		
        	});
        	
        	/*Severity Btn Click Event Listener*/
        	$(document).on("click", "#criCnt, #maCnt, #miCnt, #waCnt, #noCnt, #allCnt, #criCntPop, #maCntPop, #miCntPop, #waCntPop, #noCntPop, #allCntPop", function(e){
        		
        		var severityRank = e.currentTarget.id;
        		
        		var rack = 0;
        		switch(severityRank){
	        		case "criCnt":
	        		case "criCntPop":
	        			rack = 5;
	        			break;
	        		case "maCnt":
	        		case "maCntPop":
	        			rack = 4;
	        			break;
	        		case "miCnt":
	        		case "miCntPop":
	        			rack = 3;
	        			break;
	        		case "waCnt":
	        		case "waCntPop":
	        			rack = 2;
	        			break;
	        		case "noCnt":
	        		case "noCntPop":
	        			rack = 1;
	        			break;
	        		case "allCnt":
	        		case "allCntPop":
	        			rack = '';
	        			break;
        		}
        		
        		if(severityRank.indexOf("Pop") === -1){
        			w2ui["eventBrower"].search('severity', rack);
        		}else{
        			//POPUP일 경우
        			w2ui["popupEventBrower"].search('severity', rack);
        		}
        		
        		/*if($('#eventBottom').css('display') == "none"){ // gihwan
        			$("#btnTop").css('display','none');
        			$("#btnDown").css('display','block');
        			$("#eventBrower").animate({bottom:350}, 500);
        			$('#eventBottom').css('display','block');
        		}*/
        		$("#btnTop").css('display','none');
    			$("#btnDown").css('display','block');
    			$("#eventBrower").animate({bottom:0}, 500);
        	});
        	
        	$(document).on("click", ".severityIcon", function(e){
        		//sceneComp.idc.listNotifiCation("createRoom");
        	});
        	
        	$(document).on("click", ".btnOnOffCls", function(e){
        		console.log("btnOnOffCls Click");
        		var targetName = e.currentTarget.id.split("_")[1];
        		var imgSrc = "";
        		var urlArr = $(e.currentTarget).attr("src").split("/");
        		var onOffFlug = null;
        		
        		for(var i=0; i<urlArr.length-1; i++){
        			imgSrc += urlArr[i]+"/";
        		}
        		
        		if($(e.currentTarget).attr("src").indexOf("on.png") > 0){ 
        			//On일 경우 Off로
        			imgSrc += targetName+"_off.png";
        			onOffFlug = false; 
        		}else{
        			//Off일 경우 On으로
        			imgSrc += targetName+"_on.png";
        			onOffFlug = true;
        		}
        		
        		$(e.currentTarget).attr("src", imgSrc);
        		
        		switch(targetName){
	        		case "label": 
	        			//라벨
	        			if(onOffFlug){
	        				sceneComp.createLabel(sceneComp.scene);
	        			}else{
	        				sceneComp.disposeLabel();
	        			}
	        			
	        			break;
	        			
	        		case "temperature":
	        			 //온습도
	        			if(onOffFlug){
	        				sceneComp.createTemperLabel(sceneComp.scene);
	        				sceneComp.idc.listNotifiCation("getTemperData");
	        			}else{
	        				sceneComp.disposeTemperLabel();
	        			}
	        			
	        			break;
	        			
	        		case "fire": //방화
	        			
	        			var mesh = _.find(sceneComp.getData(), function(obj){
	            			return obj.modelType === "ROOM";
	            		})
	            		
	        			var roomItem = sceneComp.scene.getMeshByID(mesh.assetId);
	        			
	        			if(onOffFlug){
	        				roomItem.material = roomItem.fireMaterial;
	        			}else{
	        				roomItem.material = roomItem.orgMaterial;
	        			}
	        			
	        			break;
	        			
	        		case "waterLeak": //누수
	        			
	        			if(onOffFlug){
	        				sceneComp.waterTop.isVisible = sceneComp.waterBottom.isVisible = true;
	        				sceneComp.waterLeakOccurrence([100,270,320], 'top');
	        				sceneComp.waterLeakOccurrence([150,300,420], 'bottom');
	        			}else{
	        				sceneComp.waterTop.isVisible = sceneComp.waterBottom.isVisible = false;
	        				sceneComp.removeWaterLabel();
	        			}
	        			
	        			break;
        		}
        	});
        	
        	/**
        	 * Asset Search
        	 * */ 
        	//검색 창 열기
        	$(document).on("click", "#search-asset-img", function(e){
        		if($("#assetSearchContents").css("right") === "0px"){
        			$("#assetSearchContents").animate({right:-239}, 500);
        			
        			w2ui['assetTable'].selectNone();
            		
            		var assetTableAC = _.sortBy(_.filter(sceneComp.getData(), function(obj){
            			return obj.modelType !== "ROOM";
            		}), 'modelType');
            		
            		for(var i=0; i < assetTableAC.length; i++){
            			var item = assetTableAC[i];
            			item.recid = i+1;
            		}
            		
            		var meshes = sceneComp.scene.meshes;
            		
            		for(var j=0; j < meshes.length; j++){
            			var mesh = meshes[j];
        				
            			mesh.visibility = 1;
    					mesh.showBoundingBox = false;
        				
            		}
            		
            		var lblGroup = sceneComp.labelGroups;
            		
            		if(lblGroup.length > 0){
        				for(var m=0; m < lblGroup.length; m++){
        					var lbl = lblGroup[m];
        					lbl.children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(255,255,255,1);
        				}
        			}
            		
            		if(sceneComp.arrowAni){
						sceneComp.arrowAni.dispose();
					}
            		
            		$('#assetTypeInput').data('selected', {text:'All'}).data('w2field').refresh();
            		w2ui['assetTable'].searchReset();
            		
            		w2ui['assetTable'].records = assetTableAC;
            		w2ui['assetTable'].refresh();
        		}else{
        			//검색창 열기
        			w2ui['assetTable'].refresh();
        			$("#assetSearchContents").animate({right:0}, 500);
        		}
        		
        		w2ui['assetTable'].selectNone();
        		
        	});
        	
        	$(document).on('change', '#assetTypeInput', function(e){
        		
        		w2ui['assetTable'].selectNone();
        		
        		$("#search-camera-img").css({cursor:"",opacity :0.5});
        		
        		var meshes = sceneComp.scene.meshes;
        		
        		for(var k=0; k < meshes.length; k++){
        			var mesh = meshes[k];
					mesh.showBoundingBox = false;
        		}
        		
        		var lblGroup = sceneComp.labelGroups;
        		if(lblGroup.length > 0){
    				for(var m=0; m < lblGroup.length; m++){
    					var lbl = lblGroup[m];
    					lbl.children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(255,255,255,1);
    				}
    			}
        		
        		if(sceneComp.arrowAni){
					sceneComp.arrowAni.dispose();
				}
        		
        		var selectItem = e.currentTarget.value;
        		var assetTableAC = null;
        		
        		var meshes = sceneComp.scene.meshes;
        		
        		if(selectItem === "All"){
        			assetTableAC = _.sortBy(_.filter(sceneComp.getData(), function(obj){
            			return obj.modelType !== "ROOM";
            		}), 'modelType');
        			
        		}else{
        			assetTableAC = _.sortBy(_.filter(sceneComp.getData(), function(obj){
            			return obj.modelType === selectItem; 
            		}), 'modelType');
        		}
        		
        		for(var i=0; i < assetTableAC.length; i++){
        			var item = assetTableAC[i];
        			item.recid = i+1;
        		}
        		
        		for(var j=0; j < meshes.length; j++){
        			var mesh = meshes[j];
        			if(selectItem === "All"){
        				mesh.visibility = 1;
        			}else{
        				if( mesh.type === selectItem){
    						mesh.visibility = 1;
        				}else{
        					mesh.visibility = 0.3;
        				}
        			}
        			
        		}
        		
        		w2ui['assetTable'].records = assetTableAC;
        		w2ui['assetTable'].refresh();
        		
        	});
        	
        	$(document).on('click', "#search-camera-img", function(event){
        		if($("#search-camera-img").css("opacity")==="1"){
        			var selectItem = w2ui["assetTable"].get(w2ui["assetTable"].getSelection())[0];
        			var mesh = sceneComp.scene.getMeshByID(selectItem.assetId);
        			
        			sceneComp.camera.target = mesh;
        		}
        	});
        },
        
        /*이벤트 해제*/
        removeEventListener : function(){
        	$(document).off("contextmenu");
        	$(document).off("click","body");
        	$(document).off("click","#canvasContents");
        	$("#idcRenderCanvas").unbind("dblclick");
        	$("#idcRenderCanvas").unbind("mousedown");
        	$("#idcRenderCanvas").unbind("mouseup");
        	$(document).off("click", "#criCnt, #maCnt, #miCnt, #waCnt, #noCnt, #allCnt, #criCntPop, #maCntPop, #miCntPop, #waCntPop, #noCntPop, #allCntPop");
        	$(document).off("click", ".severityIcon");
        	$(document).off("click", ".btnOnOffCls");
        	$(document).off("click", "#search-asset-img");
        	$(document).off("click", "#asset-search-lbl");
        	$(document).off('change', '#assetTypeInput');
        },
        
        /*DB조회를 위한 명령어를 관리하는 메소드 입니다.*/
        listNotifiCation : function(cmd, param){
        	switch(cmd){
        		case "getConfig":
        			this.getConfig();
        			break;
        		case "createBuild":
        			this.elements.eventDataProvider = null;
        			this.createBuild(param);
        			break;
        		case "createRoom":
        			this.elements.eventDataProvider = null;
        			this.createRoom(param.id);
        			break;
        		case "getEventBrowerData":
        			this.createEventBrower();
        			break;
        		case "getPOPUPEventBrowerData":
        			this.createPOPUPEventBrower(param);
        			break;
        		case "getRackData":
        			this.selectRackData(param);
        			break;
        		case "getRackInData":
        			this.selectRackInData(param);
        			break;
        		case "getMainIconSeverityData":
        			this.getMainIconSeverityData();
        			break;
        		case "getTemperData":
        			this.getTemperData();
        			break;
        		case "dumyEventDataInsert":
        			this.dumyEventDataInsert();
        			break;
        		case "ackData":
        			this.ackData(param);
        			break;
        	}
        	
        },
        
        /*Scene Load가 완료되는 시점에 보이기 위해 초기화함*/
        initSideMenu : function(status){
        	
        	switch(status){
	        	case 'building':
	        		this.buildingUI();
	        		break;
	        	case 'floor':
	        		this.floorUI();
	        		break;
	        	case 'room':
	        		this.roomUI();
	        		break;
	    	}
        	
        	$("#leftMenu").css("display","none");
        	$("#rightMenu").css("display","none");
        	$("#eventBrower").css({bottom:"-302px", display:"none"});
        	
        },
        
        /*
         * Scene Load Animation이 종료 되었을때 실행함.
         * */
        createComplete : function(sceneType){
        	switch(sceneType){
	        	case "building":
	        		this.showHideBrower("show");
        			this.showHideLeftMenu("show");
        			this.showHideRightMenu("show");
        			this.iconInitTimer();
	        		break;
	        	case "floor":
	        		this.showHideBrower("show");
        			this.showHideLeftMenu("show");
        			this.showHideRightMenu("show");
        			this.iconInitTimer();
	        		break;
	        	case "room":
	        		this.showHideBrower("show");
        			this.showHideLeftMenu("show");
        			this.showHideRightMenu("show");
	        		break;
        	}
        	
        	this.eventBrowerinitTimer();
        },
        
        iconInitTimer : function(){
        	if(this.elements.iconTimer > 0){
        		this.iconRemoveTimer();
        	}
        	
        	sceneComp.idc.listNotifiCation("getMainIconSeverityData");
        	
        	var follingTime = this.elements.follingTime;
        	this.elements.iconTimer = setInterval(function(){
        		sceneComp.idc.listNotifiCation("getMainIconSeverityData");
        	}, follingTime);
        },
        
        iconRemoveTimer : function(){
        	if(this.elements.iconTimer === null) return;
        	clearTimeout(this.elements.iconTimer);
        },
        
        showHideLeftMenu : function(status){
        	if(status === "show"){
        		$("#leftMenu").css("display","");
        	}else{
        		$("#leftMenu").css("display","none");
        	}
        },
        
        showHideRightMenu : function(status){
			if(status === "show"){
				$("#rightMenu").css("display","");
			}else{
				$("#rightMenu").css("display","none");  		
			}
        },
        
        showHideBrower : function(status){
        	if(status === "show"){
        		$("#eventBrower").css({bottom:"-302px", display:""});
        		
        	}else{
        		$("#eventBrower").css({bottom:"-302px", display:"none"});
        	}
        	
        	$("#btnTop").css('display','');
			$("#btnDown").css('display','none');
        },
        
        popupEventBrowerinitTimer : function(){
        	if(this.elements.popupTImter > 0){
        		this.popupEventBrowerRemoveTimer();
        	}
        	
        	var follingTime = this.elements.follingTime;
        	
        	this.elements.popupTImter = setInterval(function(){
        		var item = w2ui['popupEventBrower'].param;
        		sceneComp.idc.listNotifiCation("getPOPUPEventBrowerData", item);
        	}, follingTime);
        },
        
        popupEventBrowerRemoveTimer : function(){
        	if(this.elements.popupTImter === null) return;
        	clearTimeout(this.elements.popupTImter);
        },
        
        eventBrowerinitTimer : function(){
        	sceneComp.idc.elements.eventDataProvider = null;
        	
        	if(this.elements.eventBrowerTImter > 0){
        		this.eventBrowerRemoveTimer();
        	}
        	
        	this.listNotifiCation("getEventBrowerData");
        	
        	if(sceneComp.currentState === "room"){
    			this.listNotifiCation("getTemperData");
    		}
        	
        	var follingTime = this.elements.follingTime;
        	
        	this.elements.eventBrowerTImter = setInterval(function(){
        		sceneComp.idc.listNotifiCation("getEventBrowerData");
        		
        		if(sceneComp.currentState === "room"){
        			sceneComp.idc.listNotifiCation("getTemperData");
        		}
        		
        	}, follingTime);
        },
        
        eventBrowerRemoveTimer : function(){
        	if(this.elements.eventBrowerTImter === null) return;
        	clearTimeout(this.elements.eventBrowerTImter);
        },
        
        createPOPUPEventBrower : function(item){
        	var model = new Model();
        	model.url +="/getPOPUPEventData/"+item.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setPOPUPEventData);
        },
        
        setPOPUPEventData : function(method, model, options){
        	var dataProvdier = sceneComp.idc.elements.popupDataProvider;
			
			if(sceneComp.util.compare(dataProvdier, model)){
				//console.log("같음");
			}else{
				//console.log("다름");
				/* 차후에는 주석 해제*/
				w2ui['popupEventBrower'].records = model;
    			w2ui['popupEventBrower'].refresh();
				
				/*데이터가 없어서 가상의 데이터를 이용함. 차후에 지울것*/
				/*var popupItem = w2popup.get();
				var popupArr = [];
				var dataProvider = popupItem.param.dataProvider;
				for(var i=0; i < dataProvider.length; i++){
					var im = Math.round(Math.random()*4+1);
					var data = {app:"A", dupplication:2, ip:"192.168.0.1", msgGrp:"GP1", name:dataProvider[i].id, 
							obj:"jini", recid:i+1, severity:im, updateTime : "2017-04-13"};
					popupArr.push(data);
				}
				
				w2ui['popupEventBrower'].records = popupArr;
    			w2ui['popupEventBrower'].refresh();*/
    			
    			var criCntPop = w2ui['popupEventBrower'].find({severity:5}).length;
    			var maCntPop = w2ui['popupEventBrower'].find({severity:4}).length;
    			var miCntPop = w2ui['popupEventBrower'].find({severity:3}).length;
    			var waCntPop = w2ui['popupEventBrower'].find({severity:2}).length;
    			var noCntPop = w2ui['popupEventBrower'].find({severity:1}).length;
    			var allCntPop = w2ui["popupEventBrower"].records.length;
    			
    			//criCnt maCnt miCnt waCnt noCnt allCnt
    			$("#criCntPop").animateNumber({ number: criCntPop });
    			$("#maCntPop").animateNumber({ number: maCntPop });
    			$("#miCntPop").animateNumber({ number: miCntPop });
    			$("#waCntPop").animateNumber({ number: waCntPop });
    			$("#noCntPop").animateNumber({ number: noCntPop });
    			$("#allCntPop").animateNumber({ number: allCntPop });

				/*severity check*/
    			sceneComp.severityCheck(model, "popup");
			}
        },
        
        createEventBrower : function(){
        	var model = new Model();
        	model.url +="/getEventData";
        	model.fetch();
        	this.listenTo(model, "sync", this.setEventData);
        },
        
        setEventData : function(method, model, options){
        	var dataProvdier = sceneComp.idc.elements.eventDataProvider;
			
			if(sceneComp.util.compare(dataProvdier, model)){
				//console.log("같음");
			}else{
				//console.log("다름");
				sceneComp.idc.elements.eventDataProvider = model;
				
				for(var i=0; i < model.length; i++){
					var status = model[i].severity;
					if(status === 5){
						this.soundFlag = true;
						$("#btnTop").css('display','none');
	        			$("#btnDown").css('display','');
	        			
        				if($("#soundBtn").hasClass('fa-sound_off')){
        					$("#alarmAudio").trigger('pause');
        				}else{
        					$("#alarmAudio").trigger('play'); // alarm play
        				}
	        			
	        			$("#eventBrower").animate({bottom:0}, 500);
						break;
					}else{
						this.soundFlag = false;
						$("#alarmAudio").trigger('pause'); // alarm pause
					}
				}
				
				w2ui['eventBrower'].records = model;
    			w2ui['eventBrower'].refresh();
    			
    			/*
    			 * Count 
    			 * **/
    			
    			var criCnt = w2ui['eventBrower'].find({severity:5}).length;
    			var maCnt = w2ui['eventBrower'].find({severity:4}).length;
    			var miCnt = w2ui['eventBrower'].find({severity:3}).length;
    			var waCnt = w2ui['eventBrower'].find({severity:2}).length;
    			var noCnt = w2ui['eventBrower'].find({severity:1}).length;
    			var allCnt = w2ui["eventBrower"].records.length;
    			
    			//criCnt maCnt miCnt waCnt noCnt allCnt
    			$("#criCnt").animateNumber({number :criCnt});
    			$("#maCnt").animateNumber({number: maCnt});
    			$("#miCnt").animateNumber({number: miCnt});
    			$("#waCnt").animateNumber({number: waCnt});
    			$("#noCnt").animateNumber({number: noCnt});
    			$("#allCnt").animateNumber({number: allCnt});
    			
    			if(sceneComp.currentState === "room"){
    				/*Rack Severity Check*/
    				sceneComp.severityCheck(model);
    			}
    			
			}
        },
        
        getConfig : function(){
        	var model = new Model();
        	model.url += "/config"
        	model.fetch();
        	this.listenTo(model, "sync", this.setConfig);
        },
        
        setConfig : function(method, model, options){
        	if(model){
        		this.rackAlign = model[0];
        	}
        },
        
        createBuild : function(locId){
        	var model = new Model();
        	model.url +="/getBuildData/"+locId;//뚝섬역 loc코드가 1임
        	model.fetch();
        	this.listenTo(model, "sync", this.setBuildData);
        },
        
        setBuildData : function(method, model, options){
        	var rootItem = _.filter(model, function(obj){
        		return obj.partitionType === "root";
        	})[0];
        	
        	switch(rootItem.modelType){
	        	case "SITE":
	        		sceneComp.idc.pathArr = [];
	        		sceneComp.idc.pathArr.push(_.clone(rootItem));
	        		sceneComp.idc.initSideMenu('building');
	        		sceneComp.initBuilds(model, 'building');
	        		break;
	        	case "BUILDING":
	        		sceneComp.idc.initSideMenu('floor');
	        		sceneComp.initBuilds(model, 'floor');
	        		break;
	        	case "FLOOR":
	        		
	        		var roomList = _.filter(model, function(obj){
	            		return obj.partitionType === "sub";
	            	});
	        		
	        		sceneComp.idc.initSideMenu('room');
	        		sceneComp.idc.createRoom(roomList[0].assetId)
	        		break;
        	}
        	
        },
        
        createRoom : function(id){
        	var model = new Model();
        	model.url +="/getRoomData/"+id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setRoomData);
        },
        
        setRoomData : function(method, model, options){
        	if(model.length > 0){
        		sceneComp.initBuilds(model, 'room');
    			
    			/*
    			 * Search Table Setting
    			 * */
    			var list = _.groupBy(sceneComp.getData(), 'modelType');
        		
        		var items = ["All"];
        		
        		for(var name in list){
        			if(name !== "ROOM"){
        				items.push(name);
        			}
        		}
        		
        		$('#assetTypeInput').w2field('list', { 
        			items: items,
        			selected : ['All']
        		});
        		
    			var assetTableAC = _.sortBy(_.filter(sceneComp.getData(), function(obj){
        			return obj.modelType !== "ROOM"; 
        		}), 'modelType');
        		
        		for(var i=0; i < assetTableAC.length; i++){
        			var item = assetTableAC[i];
        			item.recid = i+1;
        		}
        		
        		w2ui['assetTable'].records = assetTableAC;
        		w2ui['assetTable'].refresh();
        	}
        },
        
        selectRackData : function(mesh){
        	var rackInfo = Backbone.Model.extend({
        		urlRoot : 'idc/getRackData',
        		url: function(){
        			return this.urlRoot + "/" + mesh.id;
        		},
        		param : mesh,
        		parse:function(result){
        			if(result.length === 0){
        				w2alert('해당 장비로 조회된 데이터가 없습니다.', "알림");
        			}else{
            			
        				this.param.info = result;
            			sceneComp.idc.listNotifiCation("getRackInData", this.param);
        			}
        			
        		}
        	});
        	
        	var rack = new rackInfo();
        	rack.fetch();
        },
        
        selectRackInData : function(mesh){
        	var rackIn = Backbone.Model.extend({
        		urlRoot : 'idc/getRackInData',
        		url: function(){
        			return this.urlRoot + "/" + mesh.id;
        		},
        		param : mesh,
        		parse:function(result){
        			//선택한 Rack에 server List를 담는다.
        			this.param.dataProvider = result;
        			sceneComp.idc.createPOPUP(this.param);
        			
        		}
        	});
        	
        	var rackIn = new rackIn();
        	rackIn.fetch();
        },
        
        getTemperData : function(){
        	var temper = Backbone.Model.extend({
        		url:'idc/getTemperData',
        		parse : function(result){
        			
        			var dataProvider = [
        				{id:"T1", temper: Math.floor(Math.random()*40), hu: Math.floor(Math.random()*100),  severity: Math.floor(Math.random()*5+1)},
        				{id:"T2", temper: Math.floor(Math.random()*40), hu: Math.floor(Math.random()*100),  severity: Math.floor(Math.random()*5+1)},
        				{id:"T3", temper: Math.floor(Math.random()*40), hu: Math.floor(Math.random()*100),  severity: Math.floor(Math.random()*5+1)},
        				{id:"T4", temper: Math.floor(Math.random()*40), hu: Math.floor(Math.random()*100),  severity: Math.floor(Math.random()*5+1)}
        			];
        			
        			sceneComp.temperSeverityCheck(dataProvider);
        			
        		}
        	});
        	
        	var temper = new temper();
        	temper.fetch();
        },
        
        getMainIconSeverityData : function(){
        	var iconSeverity = Backbone.Model.extend({
        		url: 'idc/getMainIconSeverityData',
        		parse:function(result){
        			for(name in result[0]){
        				//console.log(name);
        				var changeImg = null;
        				switch(name){
        					case 'server':
        						changeImg = document.getElementById("serverImg");
        						break;
        					case 'ups':
        						changeImg = document.getElementById("upsImg");
        						break;
        					case 'temperature':
        						changeImg = document.getElementById("temperatureImg");
        						break;
        					case 'waterLeak':
        						changeImg = document.getElementById("waterLeakImg");
        						break;
        				}
        				
        				var severity = result[0][name];
        				var urlName = "dist/img/idc/alarmIcon/icon_";
        				if(severity === 1){
        					urlName += name+"_normal.png";
        				}else if(severity === 2){
        					urlName+= name+"_warning.png";
        				}else if(severity === 3){
        					urlName += name+"_minor.png";
        				}else if(severity === 4){
        					urlName += name+"_major.png";
        				}else if(severity === 5){
        					urlName += name+"_critical.png";
        				}
        				
        				$(changeImg).attr("src", urlName);
        			}
        		}
        	});
        	
        	var iconSeverity = new iconSeverity();
        	iconSeverity.fetch();
        },
        
        
        dumyEventDataInsert : function(){
        	var model = new Model();
        	model.url += "/dumyEventDataInsert";
        	model.fetch();
        	this.listenTo(model, "sync", this.setDumyEventDataInsert);
        },
        
        setDumyEventDataInsert : function(method, model, options) { 
        	console.log("DumyEventDataInsert Succeess");
        },
        
        ackData : function(param){
        	var model = new Model(param);
        	model.url +="/ackData";
        	model.save(null, {
        		success: function(model, response) {
        			w2alert('정상적으로 ACK 처리 되었습니다.', "알림", function(event){
        				sceneComp.idc.eventBrowerinitTimer();
    				});
        		},
        		
        		error: function(model, response) {
        			w2alert('일시적 오류가 발생했습니다.', "알림", function(event){
        				sceneComp.idc.eventBrowerinitTimer();
    				});
        		}
        	})
        },
        /*
         * POPUP Manager
         * */
        createPOPUP : function(item){
        	
        	var body = "";
        	var popupWidth = 0;
        	var popupHeight = 0;
        	
        	switch(item.type){
	        	case "RACK":
	        		body = '<div class="w2ui-centered" id="detailPOPUP" style="width: 100%; height: 100%; overflow:hidden; padding :0px;">'+
					        	    '<div id="popupLeftDiv" style="float:left; width:450px; height:650px; border: 1px solid rgba(192, 192, 192, 0.4); margin:5px;">'+
							        /* 배경 추가시 주석 해제
							        '<div id="popupBackgroundImg">'+
							        '<img src="dist/img/idc/popup/popupBG.jpg" width="100%" height="100%">'+
							        '</div>'+
							        */
						        	'<div id="canvasContents">'+
						        		'<canvas id="popupCanvas" style="width:448px; height:648px;"></canvas>'+
						        	'</div>'+
						        '</div>' +
				        		'<div id="popupRightDiv" style="float:left;width:333px; height:650px; margin-top:5px;">'+
				        		
					        		'<div class="dashboard-panel" style="margin-bottom: 5px;">'+
						        		'<div class="dashboard-title">Properties</div>'+
						        		'<div class="dashboard-contents">'+
						        			'<div id="propertiesDiv"></div>'+
						        		'</div>'+
						        	'</div>'+
						        	
						        	'<div class="dashboard-panel">'+
						        		'<div class="dashboard-title" style="padding: 12px 5px 5px 15px;">'+BundleResource.getString('label.idc.innerAssetList') +'</div>'+
						        		'<div class="dashboard-contents">'+
						        			'<div id="unitTableDiv"></div>'+
						        		'</div>'+
						        	'</div>'+
						        	
						        '</div>'+
				        		'<div id="popupFooterDiv" style="float:left;width:100%;;height: 252px;padding:5px;;">'+
				        			'<div id="popupEventBrowerTop"></div>'+
				        			'<div id="popupEventBrowerBottom"></div>'+
						        '</div>'+
			        		'</div>';
	        		popupWidth = 800;
	        		popupHeight = 950; 
	        		break;
	        	case "AIRCON":
	        	case "FINGER-SCAN":
	        	case "PDU":
	        	case "TEMPER":
	        		body = '<div class="w2ui-centered" id="detailPOPUP" style="width: 100%; height: 100%; overflow:auto; padding :0px;">'+
				        		'<div id="popupLeftDiv" style="float:left; width:375px; height:470px; border: 1px solid rgba(192, 192, 192, 0.4); margin:5px;">'+
				        			'<div id="canvasContents">'+
						        		'<canvas id="popupCanvas" style="width:373px; height:468px;"></canvas>'+
						        	'</div>'+
								'</div>' +
				        		'<div id="popupRightDiv" style="float:left;width:333px; height:470px; margin-top:5px;">'+
					        		'<div class="dashboard-panel" style="margin-bottom: 5px;">'+
						        		'<div class="dashboard-title">Properties</div>'+
						        		'<div class="dashboard-contents">'+
						        			'<div id="propertiesDiv"></div>'+
						        		'</div>'+
						        	'</div>'+
						        '</div>'+
						        
						        '<div id="popupFooterDiv" style="float:left;width:100%;;height: 252px;padding:5px;">'+
				        			'<div id="popupEventBrowerTop"></div>'+
				        			'<div id="popupEventBrowerBottom"></div>'+
						        '</div>'+
						        
				    		'</div>';
	        		popupWidth = 725;
	        		popupHeight = 800; 
	        		break;
	        	case "CCTV":
	        		body = '<div class="w2ui-centered" id="detailPOPUP" style="width: 100%; height: 100%; overflow:auto; padding :0px;">'+
	        				'<iframe src="http://cctv.ktict.co.kr/175.mp4" width="100%" height="450px"></iframe>'+
				    		'</div>';
					popupWidth = 650;
					popupHeight = 500; 
	        		break;
	        	default : 
	        		//alert("등록되지 않는 타입 입니다.");
	        		//console.log(type);
	        		break;
        	}
        	
        	/*공통부분*/
        	w2popup.open({
        		title : "[ "+item.id + " ] 상세 정보",
        		body : body,
        		id : 'detailPOPUP',
        		width     : popupWidth,
   		     	height    : popupHeight,
        		opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	param : item,
	   		    onOpen    : function(event){
	   		    	event.onComplete = function(event){
	   		    		var popCanvas = document.getElementById("popupCanvas");
	   		    		var selectItem = event.options.param;
	   		    		
	   		    		if(selectItem.type !=="CCTV"){
	   		    			sceneComp.initPOPUP(popCanvas, selectItem);
		   		    		
		   		    		/*
		   		    		 * DATA Call 
		   		    		 * */
		   		    		switch(selectItem.type){
			   		    		case "RACK":
			   		    			var getData = function(){
				   		    			sceneComp.idc.listNotifiCation("getPOPUPEventBrowerData", item);
				   		    			sceneComp.idc.popupEventBrowerinitTimer();
			   		    			};
			   		    			this.getEventData = getData;
			   		    			break;
		   		    		}
	   		    		}
	   		    		
	   		    	};
	   		    	
	   		    	var popupType = event.options.param.type;
	   		    	sceneComp.idc.eventBrowerRemoveTimer();
	   		    	
	   		    },
	   		    
	   		    onClose   : function(event){
	   		    	//Event Brower data Polling 재시작
	   		    	sceneComp.idc.eventBrowerinitTimer();
	   		    	
	   		    	var type = event.options.param.type;
	   		    	
	   		    	if(type !=="CCTV"){
	   		    		sceneComp.initArr(); //팝업 Mesh 제거
	   		    		switch(type){
			   		    	case "RACK":
			   		    		/*사용한 w2ui 자산 반납*/
			   		    		w2ui['properties'].destroy();
			   		    		w2ui['popupEventBrower'].destroy();
			   		    		w2ui['unitTableDiv'].destroy();
			   		    		sceneComp.idc.popupEventBrowerRemoveTimer();
			   		    		break;
			   		    	case "CCTV":
			   		    		break;
			   		    	case "PDU":
			   		    	case "AIRCON":
			   		    	case "FINGER-SCAN":
			   		    	case "TEMPER":
			   		    		w2ui['properties'].destroy();
			   		    		
			   		    		if(type === "FINGER-SCAN"){
			   		    			w2ui['footerInfo'].destroy();
			   		    		}
			   		    		
			   		    		break;
		   		    		
	   		    		}
	   		    	}
	   		    	
	   		    }
        	});
        	
        	/*
        	 * 타입별 상세 정보 만들기
        	 */
        	switch(item.type){
        	case "RACK":
        		var param = item.info[0];
        		$("#propertiesDiv").w2form({
        			name : 'properties',
        			param : param,
        			init : function(){
        				//Rack 정보를 담아두고 사용함.
        				this.record = {
    						id:this.param.assetId,
    						name:this.param.assetName,
            				modelName:this.param.modelName,
            				unitSize:this.param.unitSize,
            				madeIn:'',
            				user:'',
            				startPostion:''
        				}
        				
        				this.refresh();
        			},
        			fields : [
        				{name:'id', type: 'text', disabled:true, html:{caption:'ID', attr:'style="width:138px;"'} },
        				{name:'name', type: 'text', disabled:true, html:{caption:'NAME', attr:'style="width:138px;"'} },
    					{name:'modelName', type: 'text', disabled:true, html:{caption:'모델명', attr:'style="width:138px;"'}},
    					{name:'unitSize', type: 'int', disabled:true, html:{caption:'Unit Size', attr:'style="width:138px;"'}},
    					{name:'madeIn', type: 'text', disabled:true, html:{caption:'제조사', attr:'style="width:138px;"'}},
    					{name:'user', type: 'text', disabled:true, html:{caption:'관리자', attr:'style="width:138px;"'}},
    					{name:'startPostion', type: 'text', disabled:true, html:{caption:'시작위치', attr:'style="width:138px;"'}}
        			],
        			record:{
        				id:param.assetId,
        				name:param.assetName,
        				modelName:param.modelName,
        				unitSize:param.unitSize,
        				madeIn:'',
        				user:'',
        				startPostion:''
    				}
        		});
        		
        		$("#unitTableDiv").w2grid({
        			name:'unitTableDiv',
            		recordHeight : 40,
            		multiSelect : false,
            		style:'width:100%;height:296px;',
            		columns: [
    	 				   { field: 'recid', caption: 'NO', size: '20%', attr: 'align=center'},
    	 				   { field: 'assetId', caption: 'ID', size: '20%', attr: 'align=center'},
    	 				   { field: 'unitSize', caption: 'SIZE', size: '20%', attr: 'align=center'},
    	 				   { field: 'unitIndex', caption: 'INDEX', size: '20%', attr: 'align=center'},
    	 				   { field: 'startPosition', caption: 'SP', size: '20%', attr: 'align=center'}
     				   ],
     				  onClick:function(event){
     					 var selectItem = this.get(event.recid);
     				  }
        		});
        		
        		w2ui['unitTableDiv'].records = item.dataProvider;
    			w2ui['unitTableDiv'].refresh();
        		
    			var severityDiv = '<div id="severityDiv">'+
	    			'<div class="severityBtnCls">'+
	            		'<img src="dist/img/idc/btn/ack_btn_img.png" class="severityBtn" id="ackBtnPop">'+
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
	            	'<div class="severityBtnCls">'+
	            		'<img src="dist/img/idc/btn/alarm_wa.png" class="severityBtn">'+
	            		'<div class="severityTxt" id="waCntPop">0</div>'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
	            		'<img src="dist/img/idc/btn/alarm_no.png" class="severityBtn">'+
	            		'<div class="severityTxt" id="noCntPop">0</div>'+
	            	'</div>'+
	            	'<div class="severityBtnCls">'+
	            		'<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">'+
	            		'<div class="severityTxt" id="allCntPop">0</div>'+
	            	'</div>'+
    			'</div>';
            	
    			$("#popupEventBrowerTop").append(severityDiv);
    			
        		$("#popupEventBrowerBottom").w2grid({
            		name:'popupEventBrower',
            		recordHeight : 40,
            		multiSelect : true,
            		style:'height:210px',
            		param : item,
            		show:{
            			selectColumn: true
            		},
            		
            		columns: [
    	 				   { field: 'recid', caption: 'NO', size: '10%', attr: 'align=center' },
    	 				   { field: 'severity', caption: 'Severity', size: '15%', sortable: true, attr: 'align=center' },
    	 				   { field: 'msgGrp', caption: 'MSG Group', size: '15%', sortable: true, attr: 'align=center' },
    	 				   { field: 'name', caption: 'NAME', size: '15%', sortable: true, attr: 'align=center' },
    	 				   { field: 'dupplication', caption: 'APP', size: '15%', sortable: true, attr: 'align=center' },
    	 				   { field: 'updateTime', caption: 'UPDATE', size: '15%', sortable: true, attr: 'align=center' },
    	 				   { field: 'ip', caption: 'IP', size: '10%', attr: 'align=center' }
     				   ],
     				   
     				  onClick:function(event){
     					 var selectItem = this.get(event.recid);
     				  }
     			
            	});
        		
        		break;
        	case "AIRCON":
        	case "FINGER-SCAN":
        	case "PDU":
        	case "TEMPER":
        		/*우측 속성창*/
        		$("#propertiesDiv").w2form({
        			name : 'properties',
        			param : item,
        			style:'width:100%;height:421px;',
        			fields : [
        				{name:'user', type: 'text', disabled:true, html:{caption:'관리자', attr:'style="width:138px;"'}},
    					{name:'madeIn', type: 'text', disabled:true, html:{caption:'제조사', attr:'style="width:138px;"'}},
    					{name:'madeDate', type: 'text', disabled:true, html:{caption:'제조일자', attr:'style="width:138px;"'}}
        			],
        			record:{
        				user:'김현진',
        				madeIn:'jiniworld',
        				madeDate:'2017-04-26'
    				}
        		});
        		
        		/*하단*/
        		if(item.type === "FINGER-SCAN"){
        			/*차후에는 실데이터로*/
        			$("#popupFooterDiv").w2grid({
                		name:'footerInfo',
                        show: {
                            toolbar: true,
                            footer:false,
                            toolbarSearch:false,
                            toolbarReload  : false,
                            searchAll : false,
                            toolbarColumns : false
                        },
                        recordHeight : 40,
                		multiSelect : false,
                		style:'padding:5px;margin:0px 5px 5px 5px;width:715px;',
                		
                        searches: [
                            { field: 'recid', caption: 'ID ', type: 'int' }
                        ],
                        
                        columns: [
                            { field: 'recid', caption: 'ID', size: '50px', sortable: true, attr: 'align=center' },
                            { field: 'lname', caption: 'Last Name', size: '25%', sortable: true },
                            { field: 'fname', caption: 'First Name', size: '25%', sortable: true },
                            { field: 'email', caption: 'Email', size: '40%' },
                            { field: 'sdate', caption: 'Start Date', size: '80px' }
                        ],
                        
                        records: [
                            { recid: 1, fname: 'Jane', lname: 'Doe', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 2, fname: 'Stuart', lname: 'Motzart', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 3, fname: 'Jin', lname: 'Franson', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 4, fname: 'Susan', lname: 'Ottie', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 5, fname: 'Kelly', lname: 'Silver', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 6, fname: 'Francis', lname: 'Gatos', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 7, fname: 'Mark', lname: 'Welldo', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 8, fname: 'Thomas', lname: 'Bahh', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 9, fname: 'Sergei', lname: 'Rachmaninov', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 20, fname: 'Jill', lname: 'Doe', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 21, fname: 'Frank', lname: 'Motzart', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 22, fname: 'Peter', lname: 'Franson', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 23, fname: 'Andrew', lname: 'Ottie', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 24, fname: 'Manny', lname: 'Silver', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 25, fname: 'Ben', lname: 'Gatos', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 26, fname: 'Doer', lname: 'Welldo', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 27, fname: 'Shashi', lname: 'Bahh', email: 'jdoe@gmail.com', sdate: '4/3/2012'},
                            { recid: 28, fname: 'Av', lname: 'Rachmaninov', email: 'jdoe@gmail.com', sdate: '4/3/2012'}
                        ]
                    }); 
        		}
        		break;
        	default : 
        		//alert("등록되지 않는 타입 입니다.");
        		//console.log(item.type);
        		break;
        	}
        	
        },
        
        /*
         * Event Handler
         * */
        /*Double Click Event*/
        modelDblClickEventHandler : function(evt){
        	var pickInfo = sceneComp.scene.pick(sceneComp.scene.pointerX, sceneComp.scene.pointerY);
        	if(pickInfo.hit){
        		var mesh = pickInfo.pickedMesh;
        		var type = mesh.type;
        		
        		switch(type){
        			case "RACK":
        				this.listNotifiCation("getRackData", mesh);
        				break;
        			case "CCTV":
        			case "AIRCON":
        			case "FINGER-SCAN":
        			case "PDU":
        			case "TEMPER":
        				/*차후에는 데이터 불러와서 작업해야함.*/
        				this.createPOPUP(mesh);
        				break;
        		}
        		
        	}
        },
        
        /*Click Event*/
        modelClickHandler : function(mesh, type){
        	if(type === 'POPUP'){
        		//POPUP Scene 영역
        		if(mesh.type === "SERVER"){
        			var item = mesh.item;
        			w2ui['properties'].record = {
    					id:item.assetId,
    					name:item.assetName,
        				modelName:item.modelName,
        				unitSize:item.unitSize,
        				madeIn:'',
        				user:'',
        				startPostion:item.startPosition
        			};
        			
        			w2ui['properties'].refresh();
        		}
        		
        	}else{
        		//일반 Scene 영역
        		if(mesh.isPickable){
        			if(this.pathArr.length>0){
        				var currentPath = this.pathArr[this.pathArr.length-1];
        			}
        			
        			if(currentPath.id !== mesh.id ){
        				this.pathArr.push(_.clone(mesh));
        			}
        			
    				this.listNotifiCation("createBuild" , mesh.id); 
        			
            		/* 건물간에 이동을 유연하게 하기 위해서 변경함.
            		if(mesh.type === "BUILDING"){
            			//빌딩 클릭
            			this.listNotifiCation("createFloor", mesh);
            		}else if(mesh.type === "FLOOR"){
            			//층 클릭
            			this.listNotifiCation("createRoom", mesh);
            		}else{
            			//console.log("기타 : "+ mesh.name);
            		}*/
            		
            	}
        	}
        	
        },
        
        /*
         * Page Destroy
         * */
        destroy: function() {
        	
        	console.log('IDC destroy');
        	
        	$("div.custom-menu").remove();
        	
        	this.removeUI();
        	
        	this.removeEventListener();
        	
        	/*
        	 * 필수
        	 * */
        	if(sceneComp){
        		sceneComp.removeAllElement();
            	sceneComp = null;
        	}
        	
        	sceneComp = null;
        	
        	this.undelegateEvents();
        }
        
    })

    return Main;
});