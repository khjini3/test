define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/modelManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "obj-loader",
    "css!cs/asset/modelManager"
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
		url:'modelManager',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		that = this;
    		this.elements = {
				leftMap:{},
    			rightMap:{},
				orgLeftMap : {},
    			orgRightMap : {}
    		};
    		this.currentCamera = {};
    		this.$el.append(JSP);
    		this.selectItem = null;
    		this.init();
    		
    		$('#mainMiddle div:first-child').css('width', '100%');
    		$('#mainMiddle div:first-child').css('height', '100%');
        },
        
        events : {
        	'click #showGrid' : 'showGridCheckHandler',
        	'click .modelMgr svg#modelMgrSaveBtn' : 'modelMgrSaveBtnHandler',
        	'click .modelMgr svg#modelMgrCancelBtn' : 'modelMgrCancelBtnHandler',
        	'click .modelMgr svg#modelMgrEditBtn' : 'modelMgrEditBtnHandler',
        	'click .modelMgr button#modelMgrLeftBtn' : 'modelMgrLeftBtnHandler',
        	'click .modelMgr button#modelMgrRightBtn' : 'modelMgrRightBtnHandler'
        },
        
        /*
         * EventHandler Start
         * **/
        modelMgrPopupCancelBtnHandler : function(event){
        	that.leftRightBtnStatus(false);
        	that.editorModeStatus(false);
        	
        	that.useAbleCheckFunc();
        	
        	that.getData();
        },
        
        modelMgrCancelBtnHandler : function(event){
        	var bodyContents = BundleResource.getString('label.modelManager.notChanedWhenCanceled'); //"취소 시 내용이 변경 되지 않습니다.";
        	
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="modelMgrCancerBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.modelManager.confirm')+'</button>'+
					'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.modelManager.cancel')+'</button>'+
				'</div>'+
			'</div>';
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.modelManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        },
        
        modelMgrEditBtnHandler : function(event){
        	this.leftRightBtnStatus(true);
    		
    		this.editorModeStatus(true);
    		
    		this.treeDisableCheckFunc(false);
        },
        
        modelMgrSaveBtnHandler : function(event){
        	var leftMap = that.elements.leftMap;
			var rightMap = that.elements.rightMap;
			
			var param = {};
			
			var leftAC = [];
			var rightAC = [];
			
			for(var name in leftMap){
				if(leftMap[name]["temp"]==="right"){
					leftMap[name]["codeId"] = this.selectItem.id;
					leftAC.push(leftMap[name]);
				}
			}
			
			for(var name in rightMap){
				if(rightMap[name]["temp"]==="left"){
					rightAC.push(rightMap[name]);
				}
			}
			
			if(leftAC.length > 0 || rightAC.length > 0){
				
				param.leftData = leftAC;
				param.rightData = rightAC;
				
				this.listNotifiCation("updateModelList", param);
				
			}else{
				w2alert(BundleResource.getString('label.modelManager.noChangeedContents'), BundleResource.getString('title.modelManager.info'));
			}
			
        },
        
        modelMgrLeftBtnHandler : function(event){
        	this.modelMoveHandler('left');
        },
        
        modelMoveHandler : function(value){
        	
        	var selectArr = null;
        		
        	if(value === "left"){
        		selectArr = w2ui["modelManagerRightTable"].getSelection();
        	}else{
        		selectArr = w2ui["modelManagerLeftTable"].getSelection();
        	}
        	
        	if(selectArr.length === 0){
        		//선택한 항목이 없다면
        		this.alarmMsgFunc("noneSelect");
        	}else{
        		
        		var leftMap = that.elements.leftMap;
    			var rightMap = that.elements.rightMap;
    			
    			for(var i =0; i < selectArr.length; i++){
    				
    				var item = null;
    				
    				if(value === "left"){
    					item = w2ui["modelManagerRightTable"].get(selectArr[i]);
    					leftMap[item.modelId] = item;
        				delete rightMap[item.modelId];
    				}else{
    					item = w2ui["modelManagerLeftTable"].get(selectArr[i]);
    					rightMap[item.modelId] = item;
        				delete leftMap[item.modelId];
    				}
    				
    			}
    			
    			var leftDataProvider = [];
    			var rightDataProvider = [];
    			
    			for(var name in leftMap){
    				leftDataProvider.push(leftMap[name]);
    			}
    			
    			for(var name in rightMap){
    				rightDataProvider.push(rightMap[name]);
    			}
    			
    			//rightDataProvider = _.sortBy(rightDataProvider, "modelName");
    			
    			for(var m=0; m < rightDataProvider.length; m++){
    				var item = rightDataProvider[m];
    				item.recid = m+1;
    			}
    			
    			//leftDataProvider = _.sortBy(leftDataProvider, "modelName");
    			
    			for(var n=0; n < leftDataProvider.length; n++){
    				var item = leftDataProvider[n];
    				item.recid = n+1;
    			}
    			
    			w2ui["modelManagerLeftTable"].records = leftDataProvider;
    			w2ui["modelManagerLeftTable"].refresh();
    			w2ui["modelManagerLeftTable"].selectNone();
    			
    			w2ui["modelManagerRightTable"].records = rightDataProvider;
    			w2ui["modelManagerRightTable"].refresh();
    			w2ui["modelManagerRightTable"].selectNone();
        	}
        },
        
        modelMgrRightBtnHandler : function(event){
        	this.modelMoveHandler('right');
        },
        
        alarmMsgFunc : function(type){
        	
        	var bodyContents = "";
        	
        	switch(type){
        		case "noneSelect":
        			bodyContents =BundleResource.getString('label.modelManager.noSelectedItem'); // "선택된 항목이 없습니다.";
        			break;
        	}
        	
        	var body = '<div class="w2ui-centered">'+
			'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="popup-btnGroup">'+
					'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.modelManager.confirm')+'</button>'+
				'</div>'+
			'</div>';
    		
			w2popup.open({
    			width: 385,
  		        height: 180,
		        title : BundleResource.getString('title.modelManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        },
        
        showGridCheckHandler : function(event){
        	var status = $("#showGrid").prop("checked");
        	var groundMesh = this.scene.getMeshByID("ground");
    		if(status){
    			//show
    			groundMesh.isVisible = true;
    		}else{
    			//hide
    			groundMesh.isVisible = false;
    		}
        },
        
        /*
         * EventHandler End
         * **/
        
        init : function(){
        	
        	this.eventListenerRegister();
        	
        	$("#contentsDiv").w2layout({
        		name:'modelMgrLayout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
        	});
        	
        	$("#leftContents").w2layout({
        		name:'modelMgrLayoutSub1',
        		panels:[
        			{type:'top', size:'34px', content:'<div id="leftTop"></div>'},
        			{type:'main', size:'50%', content:'<div id="leftMiddle"></div>'},
        			{type:'preview', size:'50%', content:'<div id="leftBottom"></div>'}
        		]
        	});
        	
        	var leftMiddle =  '<div class="dashboard-panel" style="width:100%;height:calc(50vh - 67px);">'+
						    		'<div class="dashboard-title">Detailed AssetInformation</div>'+
						    		'<div class="dashboard-contents"><div id="leftMiddleContent"></div></div>'+
						    	'</div>';
        		
    	    var leftBottom = '<div class="dashboard-panel" style="width:100%;height:calc(50vh - 67px);">'+
						    		'<div class="dashboard-title">Model Preview</div>'+
						    		'<div class="dashboard-contents">'+
						    			'<div id="leftBottomContent">'+
						    			
						    			 '<div id="canvasTitle" class="modelManagerTitle"></div>'+
				    	                    '<div id="modelPreView">'+
				    		                    '<div id="optionDiv">'+
				        		                    '<input type="checkbox" id="showGrid" name="checkGroup" checked>'+
								                    '<label class="optionTxt" for="showGrid">Show Grid</label>'+
				    		                    '</div>'+
				    		                    '<canvas id="modelManagerCanvas"></canvas>'+
				    	                    '</div>'+
				    	                  '</div>'+
						    			
						    			'</div>'+
						    		'</div>'+
						    	'</div>';
    	    
        	$("#leftMiddle").html(leftMiddle);
        	$("#leftBottom").html(leftBottom);
        	
        	
        	this.createLocationTree();
        	
        	var mainSub = '<div id="mainLeftContents">'+
							    		'<div id="mainLeftTop"></div>'+
							    		'<div id="mainLeft"></div>'+
						    	'</div>'+
						    		
					    		'<div id="mainMiddleContents">'+
						    		'<div id="mainMiddleTop"></div>'+
						    		'<div id="mainMiddle"></div>'+
					    		'</div>'+
						    		
					    		'<div id="mainRightContents">'+
						    		
					    			'<div id="mainRightTop">'+
						        		'<div id="modelMapBtnGroup">'+
							        		'<i id="modelMgrSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save" style="display:none"></i>'+
								        	'<i id="modelMgrCancelBtn"  class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel" style="display:none"></i>'+
							        		'<i id="modelMgrEditBtn" style="visibility:hidden;" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Edit"></i>'+
						        		'</div>'+
						    		'</div>'+
						    		
						    		'<div id="mainRight"></div>'+
						    	'</div>';
    	
			$("#mainContents").html(mainSub);
			
        	var mainLeft = '<div class="dashboard-panel" style="width:100%;">'+
					    		'<div class="dashboard-title">Model List</div>'+
					    		'<div class="dashboard-contents"><div id="mainLeftBottom"></div></div>'+
					    	'</div>';
        	
    	    var mainMiddle = '<div style="display: table-cell;vertical-align: middle;">'+
    		    '<button class="darkButton" style="margin-bottom: 20px;" id="modelMgrLeftBtn"> < </button>'+
    		    '<button class="darkButton" id="modelMgrRightBtn"> > </button>'+
		    '</div>';
    	
    	    var mainRight = '<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title">Available Model List</div>'+
						    		'<div class="dashboard-contents"><div id="mainRightBottom"></div></div>'+
						    	'</div>';
    	    	
        	$("#mainLeft").html(mainLeft);
        	$("#mainMiddle").html(mainMiddle);
        	$("#mainRight").html(mainRight);
			
			
			this.createLeftTable();
	    	
	    	this.createRightTable();
	    	
	    	this.previewInit();
	    	
	    	this.leftRightBtnStatus(false);//자산 이동 버튼 비 활성화
	    	
	    	this.editorModeStatus(false);
	    	
        	this.start();
        },
        
        start: function() {
        	this.listNotifiCation("getAssetTypeList");
        },
        
        createLocationTree : function(){
        	$("#leftMiddleContent").w2sidebar({
        		name : 'modelManagerAssetTree',
        		style : 'height:calc(50vh - 116px);', //height:calc(100% - 48px);
        		nodes: [
                    { id: 'Asset', text: 'MODEL TYPE', expanded: true, group: true}
                ],
                onClick: function(event) {
                	var item = w2ui["modelManagerAssetTree"].get(event.target);
                	
                	var selectItem = that.selectItem;
                	
                	if(selectItem.id === item.id){
                		return;
                	}else{
                		that.selectItem = item;
                		that.getData();
                	}
                }
        	});
        },
        
        createLeftTable : function(){
        	$("#mainLeftBottom").w2grid({
        		name:'modelManagerLeftTable',
                show: { 
                	toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true,
                    lineNumbers: true
                },
                
                recordHeight : 60,
        		style:'padding:5px;width:100%;height:calc(100vh - 176px);', //height:calc(100% - 92px);
                
        		searches: [
                	{ field: 'modelName', caption: 'NAME ', type: 'text' }
                ],
                
                columns: [  
                    { field: 'modelName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'modelName', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=right', style:'padding-right:10px;', 
                    	render : function(record){
                    		if(record.modelName){
                    			return '<div style="width:100%;height:100%;text-align: center;"><img class="modelMgrImg" src="dist/models/' + record.modelName + '/' + record.modelName + '_pre.png" onerror="this.style.display=\'none\'" ></div>';
                    		}
                    		return '<div style="width:100%;height:100%;text-align: center;"></div>';
                    	}
                    }
                ],
                
    			onClick : function(event){
    				console.log(event);
    			},
    			
    			onDblClick : function(event){
    				var item = this.get(event.recid);
    				that.createPreview(item);
    			}
                
            });
        	
        	w2ui["modelManagerLeftTable"].lock("Loading...", true);
        },
        
        createRightTable : function(){
        	$("#mainRightBottom").w2grid({
        		name:'modelManagerRightTable',
        		show: {
        			toolbar: true,
        			footer:false,
        			toolbarSearch:false,
        			toolbarReload  : false,
        			searchAll : false,
        			toolbarColumns : false,
        			selectColumn: true,
        			lineNumbers: true
        		},
        		
        		recordHeight : 60,
        		multiSelect : true,
        		style:'padding:5px;width:100%;height:calc(100vh - 176px);', //height:calc(100% - 92px);
        		
        		searches: [
        				{field: 'modelName', caption: 'NAME ', type: 'text'}
        			],
        			
    			columns: [  
                    { field: 'modelName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'modelName', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=right', style:'padding-right:10px;', 
                    	render : function(record){
                    		if(record.modelName){
                    			return '<div style="width:100%;height:100%;text-align: center;"><img class="modelMgrImg" src="dist/models/' + record.modelName + '/' + record.modelName + '_pre.png" onerror="this.style.display=\'none\'" ></div>';
                    		}
                    		return '<div style="width:100%;height:100%;text-align: center;"></div>';
                    	}
                    }
                ],
    				
    			onClick : function(event){
    				console.log(event);
    			},
    			
    			onDblClick : function(event){
    				var item = this.get(event.recid);
    				that.createPreview(item);
    			}
    			
        		
        	});
        	
        	//w2ui["modelManagerRightTable"].lock("Loading...", true);
        },
        
        disposeGUI : function(type){
        	for(var m=this.scene.meshes.length-1; m >= 0; m--){
				var mesh = this.scene.meshes[m];
				
				if(!type){
					if(mesh.id!=="ground"){
						this.scene.removeMesh(mesh);
					}
				}
				
			}
        },
        
        treeDisableCheckFunc : function(value){
        	
        	if(value){
        		this.useAbleCheckFunc();
        	}else{
        		this.editStatus(w2ui["modelManagerAssetTree"].nodes[0].nodes);
        	}
        	
        },
        
        editStatus : function(nodes){
        	for(var i=0;i < nodes.length; i++){
				var item = nodes[i];
				if(item.id === "985985a5-21a5-726a-e64c-d79203c6e656" || item.id === "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca" ){
					var w2uiItem = w2ui["modelManagerAssetTree"].get(item.id);
					w2uiItem.icon = "";
					w2uiItem.img = "fa icon-folder";
					w2ui['modelManagerAssetTree'].disable(item.id);
					
				}else{
					if(this.selectItem.id === item.id){
						w2ui['modelManagerAssetTree'].enable(item.id);
					}else{
						w2ui['modelManagerAssetTree'].disable(item.id);
					}
				}
				
				if(item.nodes !== null && item.nodes.length > 0 ){
					this.editStatus(item.nodes);
				}
			}
        },
        
        //Button Group Status
        leftRightBtnStatus : function(value){
        	if(value === false){
        		$("#modelMgrLeftBtn, #modelMgrRightBtn").attr('disabled', true);
        		$("#modelMgrLeftBtn, #modelMgrRightBtn").css('opacity', 0.4);
        		
        		document.getElementById("modelMgrLeftBtn").className = "darkButtonDisable";
        		document.getElementById("modelMgrRightBtn").className = "darkButtonDisable";
        	}else{
        		$("#modelMgrLeftBtn, #modelMgrRightBtn").attr('disabled', false);
        		$("#modelMgrLeftBtn, #modelMgrRightBtn").css('opacity', 1);
        		
        		document.getElementById("modelMgrLeftBtn").className = "darkButton";
        		document.getElementById("modelMgrRightBtn").className = "darkButton";
        	}
        },
        
        //Edit Mode Enable/Disable
        editorModeStatus : function(value){
        	if(value === true){
        		//Ediotor Mode
        		$("#modelMgrEditBtn").css("display", "none");
        		
        		$("#modelMgrSaveBtn").css("display", "");
        		$("#modelMgrCancelBtn").css("display", "");
        	}else{
        		//Read Mode
        		$("#modelMgrEditBtn").css("visibility", "visible");
        		$("#modelMgrEditBtn").css("display", "");
        		
        		$("#modelMgrSaveBtn").css("display", "none");
        		$("#modelMgrCancelBtn").css("display", "none");
        	}
        	
        },
        
        createPreview : function(item){
        	
        	this.disposeGUI();
        	
        	var path =  "dist/models/"+item.modelName+"/";
        	var fileName = item.modelName+".babylon";
        	
        	BABYLON.SceneLoader.ImportMesh("", path, fileName, this.scene, function(meshes) {
        		var mesh = meshes[0];
        		
        		meshes.forEach(function(value, idx){
        			if(idx === 0){
        				var meshSize = value.getBoundingInfo().boundingBox.extendSize;        				

        				var meshWidth = meshSize.x*2;
    					var meshHeight = meshSize.y*2;
    					var meshDepth = meshSize.z;
    					
    					var resultWidthHeight = 0;
    					
    					if(meshWidth < meshHeight){
    						resultWidthHeight = meshHeight;
    					}else{
    						resultWidthHeight = meshWidth;
    					}
    					
    					var meshRadius = 21.7/13.75 * resultWidthHeight+meshDepth;
    					
    					meshRadius *= value.scaling.x;
    					
    					that.camera.target = new BABYLON.Vector3(0, meshSize.y, 0);
    					that.camera.zoomOn([value], true);
    					that.camera.radius = meshRadius;
    					
    					that.currentCamera.radius = meshRadius;
        			}
        		});
        		
        		
        	});
        },
        
        previewInit : function(){
        	this.canvas = document.getElementById("modelManagerCanvas");
        	this.engine = new BABYLON.Engine(this.canvas, true);
        	this.scene = new BABYLON.Scene(this.engine);
        	
        	var _this = this;
			
			window.addEventListener("resize", function () {
                 _this.engine.resize();
            });
			
			var sceneRender = this.scene.getBoundingBoxRenderer();
        	sceneRender.showBackLines = false;
        	sceneRender.frontColor = this.getRGBAfunc(234, 255, 0);
			
        	this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
        	
        	var camera = this.camera;
        	camera.setPosition(new BABYLON.Vector3(-3, 44, -705));
    		camera.target = new BABYLON.Vector3(0, 110, 0);
    		camera.attachControl(this.canvas, true);
        	
    		this.currentCamera.radius = camera.radius;
    		this.currentCamera.beta = camera.beta;
    		this.currentCamera.alpha = camera.alpha;
    		this.currentCamera.targetX = camera.target.x;
        	this.currentCamera.targetY = camera.target.y;
        	this.currentCamera.targetZ = camera.target.z;
        	this.currentCamera.positionX = camera.position.x;
        	this.currentCamera.positionY = camera.position.y;
        	this.currentCamera.positionZ = camera.position.z;
        	
        	var baseLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    		
    		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), this.scene);
    		
    		light.intensity = 0.8;
    		
    		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    		
    		var scene = this.scene;
    		
    		var ground = BABYLON.MeshBuilder.CreateGround("ground", {
		        width: 4000,
		        height: 4000
		    }, this.scene);
			
			var groundMaterial = new BABYLON.GridMaterial("groundMaterial", this.scene);
			groundMaterial.majorUnitFrequency = 5;
			groundMaterial.minorUnitVisibility = 0.45;
			groundMaterial.gridRatio = 20;
			groundMaterial.backFaceCulling = false;
			groundMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
			groundMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);;
			groundMaterial.opacity = 0.98;
			
			ground.material = groundMaterial;
			ground.id = "ground";
			ground.isPickable = false;
			ground.isVisible = true;
			
		    this.scene.registerBeforeRender(function () {
        		light.position = camera.position;
        	});
		    
    		this.engine.runRenderLoop(function(){
    			scene.render();
    		})
        },
        
        resetCamera : function(){
        	this.camera.radius = this.currentCamera.radius;
        	this.camera.beta = this.currentCamera.beta;
        	this.camera.alpha = this.currentCamera.alpha;
        },
        
        getRGBAfunc : function(r, g, b, a){
    		var s = 255;
    		var valueR = r/s;
    		var valueG = g/s;
    		var valueB = b/s;
    		
    		var color = null;
    		
    		if(a !== undefined){
    			color = new BABYLON.Color4(valueR, valueG, valueB, a);
    		}else{
    			color = new BABYLON.Color3(valueR, valueG, valueB);
    		}
    		
    		return color;
    	},
        
        /*
         * Event Listener Start
         * */
        eventListenerRegister : function(){
        	$(document).on('click', '#modelMgrCancerBtn', that.modelMgrPopupCancelBtnHandler);
        	
        	$(document).on("contextmenu", function(event){
        		event.preventDefault();
        		if(event.target.id === "modelManagerCanvas"){
        			$("div.custom-menu").remove();
            		$("<div class='custom-menu'>Camera 초기화</div>").appendTo(".content")
            			.css({
            				top:event.pageY+"px",
            				left:event.pageX+"px",
            				position:"absolute"
            			});
            		
        		}else{
        			$("div.custom-menu").remove();
        		}
        	});
        	
        	$(document).on("click", "body", function(event){
        		if(event.target.className === "custom-menu"){
        			that.resetCamera();
        		}
        		
        		$("div.custom-menu").remove();
        		
        	});
        },
        
        removeEventListener : function(){
        	$(document).off('click', '#modelMgrCancerBtn');
        	$(document).off("contextmenu");
        	$(document).off("click","body");
        },
        
        /*
         * Event Listener End
         * */
        
        /**
         * ListNotifiCation List Start
         * */
        
        listNotifiCation : function(cmd, param){
        	switch(cmd){
        		case "getAssetTypeList": //자산 종류 가져오기
        			this.getAssetTypeList();
	        		break;
        		case "getModelList": //자산 종류 가져오기 left Table
        			this.getModelList();
        			break;
        		case "getAvailableModelList": //모델 모델 가져오기 Right Table
        			this.getAvailableModelList();
        			break;
        		case "updateModelList": //모델 모델 가져오기 Right Table
        			this.updateModelList(param);
        			break;
        	}
        },
        
        updateModelList : function(param){
        	var model = new Model(param);
        	model.url += "/updateModelList";
        	model.save(null,{
        		 success: function(model, response) {
        			 w2alert(BundleResource.getString('label.modelManager.successSave'), BundleResource.getString('title.modelManager.info'), function(event){
        				 	that.leftRightBtnStatus(false);
        		        	that.editorModeStatus(false);
        		        	that.treeDisableCheckFunc(true);
        					that.getData();
        				});
	             },
	             error: function(model, response) {
	            	 w2alert(BundleResource.getString('label.modelManager.errorContents'), BundleResource.getString('title.modelManager.info'), function(event){
	            		that.leftRightBtnStatus(false);
     		        	that.editorModeStatus(false);
     		        	that.treeDisableCheckFunc(true);
     					that.getData();
     				});
	             }
        	});
        },
        
        getAvailableModelList : function(){
        	var model = new Model();
        	model.url += "/getAvailableModelList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setAvailableModelList);
        },
        
        setAvailableModelList : function(method, model, options){
        	var param = model[0];//dbList, folderList
        	var result = [];
        	var cnt = 0;
        	for(var i=0; i < param.folderList.length; i++){
        		var itemA = param.folderList[i];
        		var xFlug = true;
        		for(var j=0; j < param.dbList.length; j++){
        			var itemB = param.dbList[j];
        			if(itemA.modelName === itemB.modelName){
        				xFlug = false;
        				break;
        			}
        		}
        		
        		if(xFlug){
        			itemA.recid = cnt;
        			itemA.modelId = util.createUID();
        			itemA.temp = 'right';
        			result.push(itemA);
        			cnt++;
        		}
        	}
        	
        	that.elements.rightMap = {}
			that.elements.orgRightMap = {};
        	
        	if(result.length > 0){
        		for(var i=0;i <result.length; i++){
            		var item = _.clone(result[i]);
            		that.elements.rightMap[item.modelId] = item;
        			that.elements.orgRightMap[item.modelId] = _.clone(item);
            	}
        		
        		w2ui["modelManagerRightTable"].selectNone();
        		w2ui['modelManagerRightTable'].records = result;
        		w2ui['modelManagerRightTable'].refresh();
    			w2ui["modelManagerRightTable"].unlock();
        	}
        	
        },
        
        getModelList : function(){
        	var model = new Model();
        	model.url += "/getModelList/"+this.selectItem.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setModelList);
        },
        
        setModelList : function(method, model, options){
        	that.elements.leftMap = {};
        	that.elements.orgLeftMap = {};
        	
        	for(var i=0;i <model.length; i++){
        		var item = _.clone(model[i]);
        		that.elements.leftMap[item.modelId] = item;
    			that.elements.orgLeftMap[item.modelId] = _.clone(item);
        	}
        	
        	w2ui["modelManagerLeftTable"].selectNone();
    		w2ui['modelManagerLeftTable'].records = model;
    		w2ui['modelManagerLeftTable'].refresh();
			w2ui["modelManagerLeftTable"].unlock();
        },
        
        getAssetTypeList : function(){
        	var model = new Model();
        	model.url += "/getAssetTypeList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setAssetTypeList);
        },
        
        setAssetTypeList : function(method, model, options){
        	
        	w2ui["modelManagerAssetTree"].insert('Asset', null, model[0].nodes);
    		
        	this.useAbleCheckFunc();
    		
    		this.getData();
        	
        },
        
        useAbleCheckFunc : function(){
        	this.treeSelectAbleCheck(w2ui["modelManagerAssetTree"].nodes[0].nodes);
        	//w2ui["modelManagerAssetTree"].expandAll();
        },
        
        treeSelectAbleCheck : function(nodes){
        	for(var i=0;i < nodes.length; i++){
				var item = nodes[i];
				if(item.id === "985985a5-21a5-726a-e64c-d79203c6e656" || item.id === "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca" ){
					var w2uiItem = w2ui["modelManagerAssetTree"].get(item.id);
					w2uiItem.icon = "";
					w2uiItem.img = "fa icon-folder";
					w2uiItem.expanded = true;
					w2ui['modelManagerAssetTree'].disable(item.id);
					
				}else{
					if(!this.selectItem){
						//선택된 정보가 없다면
						this.selectItem = item;
						w2ui["modelManagerAssetTree"].select(that.selectItem.id);
					}
					
					w2ui['modelManagerAssetTree'].enable(item.id);
					
				}
				
				if(item.nodes !== null && item.nodes.length > 0 ){
					this.treeSelectAbleCheck(item.nodes);
				}
			}
        },
        
        getData : function(){
        	//선택된 타입의 할당된 모델 정보 호출
    		this.listNotifiCation("getModelList");
    		
    		//선택된 타입의 비할당된 모델 정보 호출
    		this.listNotifiCation("getAvailableModelList");
        },
        
        /**
         * ListNotifiCation List End
         * */
        
        destroy: function() {
        	console.log('modelManager destroy')
        	
        	$("div.custom-menu").remove();
        	
        	this.disposeGUI("finish");
        	
        	this.undelegateEvents();
        	
        	if (w2ui.modelManagerLeftTable)
        		w2ui.modelManagerLeftTable.destroy();
        		
        	if (w2ui.modelManagerRightTable)
        		w2ui.modelManagerRightTable.destroy();
        	
        	if (w2ui.modelManagerAssetTree)
        		w2ui.modelManagerAssetTree.destroy();
        	
        	if (w2ui.modelMgrLayoutSub2)
        		w2ui.modelMgrLayoutSub2.destroy();
        	
        	if (w2ui.modelMgrLayoutSub1)
        		w2ui.modelMgrLayoutSub1.destroy();
        	
        	if (w2ui.modelMgrLayout)
        		w2ui.modelMgrLayout.destroy();
        	
        	that = null;
        }
    })

    return Main;
});