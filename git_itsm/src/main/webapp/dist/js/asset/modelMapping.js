define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/modelMapping",
    "w2ui",
    "js/lib/component/BundleResource",
    "obj-loader",
    "css!cs/asset/modelMapping"
], function(
    $,
    _,
    Backbone,
    JSP,
    W2ui,
    BundleResource
){
	
	var Model = Backbone.Model.extend({
		model:Model,
		url:'modelMapping',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		that = this;
    		this.elements = {
    				
    		};
    		this.currentCamera = {};
    		this.$el.append(JSP);
    		this.selectItem = null;
    		this.init();
    		
    		$('#leftMiddleContent div:first-child').css('position', 'static');
        },
        
        events : {
        	'click .modelMap svg#applyBtn' : 'applyBtnClickHandler',
        	'click #showGrid' : 'showGridCheckHandler',
        },
        
        init : function(){
        	
        	this.eventListenerRegister();
        	
        	$("#contentsDiv").w2layout({
        		name:'modelMapLayout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
        	});
        	
        	$("#leftContents").w2layout({
        		name:'modelMapLayoutSub1',
        		panels:[
        			{type:'top', size:'34px', content:'<div id="leftTop"></div>'},
        			{type:'main', size:'50%', content:'<div id="leftMiddle"></div>'},
        			{type:'preview', size:'50%', content:'<div id="leftBottom"></div>'}
        		]
        	});
        	
        	var leftMiddle =  '<div class="dashboard-panel" style="width:100%;height:calc(50vh - 67px);">'+
						    		'<div class="dashboard-title">Model List</div>'+
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
							                    '<canvas id="modelMapCanvas"></canvas>'+
						                    '</div>'+
						                  '</div>'+
						    			
						    			'</div>'+
						    		'</div>'+
						    	'</div>';
        
        	$("#leftMiddle").html(leftMiddle);
        	$("#leftBottom").html(leftBottom);
        	
        	this.createLocationTree();
        	
        	var mainSub = '<div id="mainLeftContents">'+
							    		'<div id="mainLeftTop">'+
							    		'</div>'+
							    		'<div id="mainLeft"></div>'+
								'</div>'+
									
								'<div id="mainRightContents">'+
									
									'<div id="mainRightTop">'+
							    		'<div id="modelMapBtnGroup">'+
							    			'<i class="icon fas fa-check fa-2x" aria-hidden="true" title="Apply" id="applyBtn" disabled="disabled"></i>'+
							    		'</div>'+
									'</div>'+
									
									'<div id="mainRight"></div>'+
								'</div>';
        	
	    	$("#mainContents").html(mainSub);
        	
	    	var mainLeft = '<div class="dashboard-panel" style="width:100%;">'+
					    		'<div class="dashboard-title">Asset List</div>'+
					    		'<div class="dashboard-contents"><div id="mainLeftBottom"></div></div>'+
					    	'</div>';
        
	    	var mainRight = '<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title">Model List</div>'+
						    		'<div class="dashboard-contents"><div id="mainRightBottom"></div></div>'+
						    	'</div>';
        	
        	$("#mainLeft").html(mainLeft);
        	$("#mainRight").html(mainRight);
			
	    	this.createLeftTable();
	    	
	    	this.createRightTable();
	    	
	    	this.previewInit();
	    	
	    	this.start();
        },
        
        previewInit : function(){
        	this.canvas = document.getElementById("modelMapCanvas");
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
    		/*camera.lowerRadiusLimit = 1;
    		camera.upperRadiusLimit = 1000;
    		camera.wheelPrecision = 20;*/
    		
    		
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
    		
    		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.5);
    		
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
			
			//ground.position.y = -250;
			
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
    	
        start: function() {
        	this.listNotifiCation("getAssetTypeList");
        },
        
        createLeftTable : function(){
        	
        	$("#mainLeftBottom").w2grid({
        		name:'modelMapLeftTable',
                show: { 
                	toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    lineNumbers: true,
                    selectColumn: true,
                },
                
                recordHeight : 60,
        		style:'padding:5px;width:100%;height:calc(100vh - 176px);', //height:calc(100% - 92px);
                
        		searches: [
                	{ field: 'assetId', caption: 'ID ', type: 'text' },
                	{ field: 'assetName', caption: 'NAME ', type: 'text' },
                	{ field: 'locName', caption: 'LOCATION ', type: 'text' }
                ],
                
                columns: [  
                    { field: 'assetId', caption: 'ID', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'unitSize', caption: 'U-SIZE', size: '70px', sortable: true, attr: 'align=right', style:'padding-right:10px;'},
                    { field: 'locName', caption: 'LOCATION', size: '100px', sortable: true, attr: 'align=right', style:'padding-right:10px;'},
                    { field: 'modelName', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=right', style:'padding-right:10px;', 
                    	render : function(record){
                    		if(record.modelName){
                    			return '<div style="width:100%;height:100%;text-align: center;"><img class="modelMapImg" src="dist/models/' + record.modelName + '/' + record.modelName + '_pre.png" onerror="this.style.display=\'none\'" ></div>';
                    		}
                    		return '<div style="width:100%;height:100%;text-align: center;"></div>';
                    	}
                    }
                ]
                
            });
        	
        	w2ui["modelMapLeftTable"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["modelMapLeftTable"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["modelMapLeftTable"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["modelMapLeftTable"].lock("Loading...", true);
        },
        
        validationCheck : function(){
        	if(w2ui["modelMapLeftTable"].getSelection().length > 0 && w2ui["modelMapRightTable"].getSelection().length>0){
        		$(".modelMap svg#applyBtn").prop("disable", false);
        		$(".modelMap svg#applyBtn").addClass('link');
        	}else{
        		$(".modelMap svg#applyBtn").prop("disable", true);
        		$(".modelMap svg#applyBtn").removeClass('link');
        	}
        },
        
        createRightTable : function(){
        	
        	$("#mainRightBottom").w2grid({
        		name:'modelMapRightTable',
        		show: {
        			toolbar: true,
        			footer:false,
        			toolbarSearch:false,
        			toolbarReload  : false,
        			searchAll : false,
        			toolbarColumns : false,
        			lineNumbers: true
        		},
        		
        		recordHeight : 60,
        		multiSelect : false,
        		style:'padding:5px;width:100%;height:calc(100vh - 176px);', //height:calc(100% - 92px);
        		searches: [
    				{ field: 'modelName', caption: 'NAME ', type: 'text' }
    			],
    			columns: [
    				    { field: 'modelName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
        				{ field: 'modelName', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=center', 
        					render : function(record){
        						if(record.modelName){
                        			return '<div style="width:100%;height:100%;text-align: center;"><img class="modelMapImg" src="dist/models/' + record.modelName + '/' + record.modelName + '_pre.png" onerror="this.style.display=\'none\'" ></div>';
                        		}
                        		return '<div style="width:100%;height:100%;text-align: center;"></div>';
                        	}
        				},
        				{ field: 'modelDesc', caption: 'DESC', size: '150px', sortable: true, attr: 'align=center' }
    				],
    			
    			onDblClick : function(event){
    				var item = this.get(event.recid);
    				that.createPreview(item);
    			}
    			
        		
        	});
        	
        	w2ui["modelMapRightTable"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["modelMapRightTable"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["modelMapRightTable"].lock("Loading...", true);
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
    					
    					//that.camera.setPosition(new BABYLON.Vector3(-12, 7, -21));
    					//that.camera.upperRadiusLimit = 100;
    					that.camera.target = new BABYLON.Vector3(0, meshSize.y, 0);
    					that.camera.zoomOn([value], true);
    					that.camera.radius = meshRadius;
    					
    					that.currentCamera.radius = meshRadius;
        				/* 중심점 맞추기
        				var meshSize = value.getBoundingInfo().boundingBox.extendSize;        				

        				var meshWidth = meshSize.x*2;
    					var meshHeight = meshSize.y*2;
    					var meshDepth = meshSize.z;
    					
    					
    					var camera = that.camera;
    					camera.radius = meshWidth+meshHeight+meshDepth+10;
    					
        				var {x, z} = value.getBoundingInfo().boundingBox.center;
        				
        			    camera.setTarget(new BABYLON.Vector3(0, meshSize.y, 0))
        			    camera.zoomOn([value], true);*/
        				
        			}
        		});
        		
        		
        	});
        },
        
        createLocationTree : function(){
        	
        	$("#leftMiddleContent").w2sidebar({
        		name : 'modelMapAssetTree',
        		style : 'height:calc(50vh - 116px);', //height:calc(100% - 48px);
        		nodes: [
                    { id: 'Asset', text: 'ASSET TYPE', expanded: true, group: true}
                ],
                onClick: function(event) {
                	var item = w2ui["modelMapAssetTree"].get(event.target);
                	
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
        
        /*
         * EventHandler Start
         * **/
        eventListenerRegister : function(){
        	$(document).on("contextmenu", function(event){
        		event.preventDefault();
        		if(event.target.id === "modelMapCanvas"){
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
        	$(document).off("contextmenu");
        	$(document).off("click","body");
        },
        
        applyBtnClickHandler : function(event){
        	
        	var sourceModel = w2ui["modelMapRightTable"].get(w2ui["modelMapRightTable"].getSelection());
        	
        	var targetModel = [];
        	for(var i=0; i < w2ui["modelMapLeftTable"].getSelection().length; i++){
        		var item = w2ui["modelMapLeftTable"].get(w2ui["modelMapLeftTable"].getSelection()[i]);
        		targetModel.push(item);
        	}
        	
        	var param = {}
        	param.modelId = sourceModel[0].modelId;
        	param.targetModels = targetModel;
        	this.listNotifiCation("updateModelList", param);
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
        
        /*
         * Data Handler
         * **/
        listNotifiCation : function(cmd, param){
        	switch(cmd){
	        	case "getAssetTypeList": //자산 종류 가져오기
	        		this.getAssetTypeList();
	        		break;
	        	case "getAssetList": //선택된 자산 가져오기
	        		this.getAssetList();
	        		break;
	        	case "getModelList": //선택된 모델 가져오기
	        		this.getModelList();
	        		break;
	        	case "updateModelList": //선택된 자산 모델 업데이트
	        		this.updateModelList(param);
	        		break;
        	}
        },
        
        updateModelList : function(param){
        	var model = new Model(param);
        	model.url += "/updateModelList";
        	model.save(null, {
	              success: function(model, response) {
	            	 if(response === 100){
	            		 //$(".modelMap svg#applyBtn").css("visibility","hidden");
	            		 $(".modelMap svg#applyBtn").prop("disable", true);
	             		 $(".modelMap svg#applyBtn").removeClass('link');
	            		 that.getData();
	            		 w2alert(BundleResource.getString('label.modelMapping.applySuccess'), BundleResource.getString('title.modelMapping.info'));
	            	 }
	              },
	              error: function(model, response) {
	            	  $(".modelMap svg#applyBtn").prop("disable", true);
	          		  $(".modelMap svg#applyBtn").removeClass('link');
	            	  //$(".modelMap svg#applyBtn").css("visibility","hidden");
	            	  that.getData();
	            	  w2alert(BundleResource.getString('label.modelMapping.errorContents')+'\n'+BundleResource.getString('label.modelMapping.reTry'), BundleResource.getString('title.modelMapping.info'));
	              }
	          });
        },
        
        getModelList : function(){
        	var model = new Model();
        	model.url += "/getModelList/"+this.selectItem.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setModelList);
        },
        
        setModelList : function(method, model, options){
        	w2ui["modelMapRightTable"].selectNone();
    		w2ui['modelMapRightTable'].records = model;
    		w2ui['modelMapRightTable'].refresh();
			w2ui["modelMapRightTable"].unlock();
        },
        
        getAssetList : function(){
        	var model = new Model();
        	model.url += "/getAssetList/"+this.selectItem.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setAssetList);
        },
        
        setAssetList : function(method, model, options){
        	w2ui["modelMapLeftTable"].selectNone();
    		w2ui['modelMapLeftTable'].records = model;
    		w2ui['modelMapLeftTable'].refresh();
    		w2ui["modelMapLeftTable"].unlock();
        },
        
        getAssetTypeList : function(){
        	var model = new Model();
        	model.url += "/getAssetTypeList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setAssetTypeList);
        },
        
        setAssetTypeList : function(method, model, options){
        	
        	if(model.length > 0){
        		
        		for(var i=0; i < model.length; i++){
					var item = model[i];
					item.text = item.name;
					item.icon = 'fas fa-cube fa-lg';
				}
        		
        		w2ui["modelMapAssetTree"].insert('Asset', null, model);
        		
        		//기본적으로 첫번째 아이템을 선택 아이템으로 지정
        		this.selectItem = w2ui["modelMapAssetTree"].get(w2ui["modelMapAssetTree"].nodes[0].nodes[0].id);
        		
        		w2ui["modelMapAssetTree"].select(w2ui["modelMapAssetTree"].nodes[0].nodes[0].id);
        		
        		this.getData();
        		
        	}else{
        		
        	}
        	
        },
        
        getData : function(){
        	//선택된 타입의 자산 정보 호출
    		this.listNotifiCation("getAssetList");
    		
    		//선택된 타입의 모델 정보 호출
    		this.listNotifiCation("getModelList");
        },
        
        /*
         * Data Handler End
         * **/
        
        destroy: function() {
        	console.log('modelMapping destroy');
        	
        	$("div.custom-menu").remove();
        	
        	this.disposeGUI("finish");
        	
        	this.removeEventListener();
        	
        	this.undelegateEvents();
        	
        	if (w2ui.modelMapLeftTable)
        		w2ui.modelMapLeftTable.destroy();
        		
        	if (w2ui.modelMapRightTable)
        		w2ui.modelMapRightTable.destroy();

        	if (w2ui.modelMapAssetTree)
        		w2ui.modelMapAssetTree.destroy();

        	if (w2ui.modelMapLayoutSub2)
        		w2ui.modelMapLayoutSub2.destroy();

        	if (w2ui.modelMapLayoutSub1)
        		w2ui.modelMapLayoutSub1.destroy();

        	if (w2ui.modelMapLayout)
        		w2ui.modelMapLayout.destroy();
        	
        	that = null;
        }
    })

    return Main;
});