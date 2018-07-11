define([
	"jquery",
	"underscore",
	"backbone",
	//"js/editor/buildingLoader",
	"babylon",
	"editControl",
	"text!views/editor/building",
	"w2ui",
	"datgui",
	"jqueryuiLayout",
	"css!cs/editor/buildingeditor",
	"css!plugins/datgui/dat.gui"
],function(
	$,
	_,
	Backbone,
	//Loader,
	babylon,
	EditControl,
	JSP,
	W2ui,
	Datgui
){
	var that;
	
	var CoordinateText = function() {
		this.X = 0;
		this.Y = 0;
		this.Z = 0;
	};
	
	var LocationModel = Backbone.Collection.extend({
		//model: LocationModel,
		url: 'editor/location',
		parse: function(result) {
			return {data: result};
		}
	});
	
	var ObjectModel = Backbone.Collection.extend({
		//model: ObjectModel,
		url: 'editor/object',
		parse: function(result) {
			return {data: result};
		}
	});
	
	var GizmoMode = {
		none: 0,
		position: 1,
		rotation: 2,
		scaling: 3
	};
	
	var Main = Backbone.View.extend({
	    el: '.content .wrap',
		initialize : function() {
			that = this;
			EDITOR = that;
			this.elements = {
				scene : null,
				engine : null,
				canvas : null,
				advancedTexture : null,
				editControl : null,
				selectedMesh : null,
				gizmoMode : 0, // 0:none, 1:Position, 2:Rotation, 3:Scaling
				positionText : new CoordinateText(),
				rotationText : new CoordinateText(),
				scalingText : new CoordinateText(),
				objectList : []
			};
			this.configurations = {
				grid : true,
				wireframe : false,
				bounding_boxes : false,
				local_axes : true,
				label : false
			}
			this.$el.append(JSP);
			
			this.start();
		},
		initSetData: function(method, model, options) { 
			this.render(model);
		},
		render : function(result){
			console.log(result);
		},
		getLocationList : function(method, model, options) {
			this.renderLocation(model);
		},
		renderLocation : function(result){
			console.log(result);
		},
		removeScene : function(){
			var engine = that.elements.engine;
			engine.stopRenderLoop();
			engine.clear(BABYLON.Color3.Black(),false,false);
			//window.removeEventListener('resize');
			if (engine.scenes.length !== 0) {
				// if more than 1 scene,
				while (engine.scenes.length > 0) {
					engine.scenes[0].dispose();
				}
			}
			
			
//			if(that.elements.scene) {
//        		var length = that.elements.scene.meshes.length;
//        		for(var i=length-1; i >= 0; i--){
//        			if(that.elements.scene.meshes[i].hasOwnProperty("actionManager")){
//        				that.elements.scene.meshes[i].actionManager = null;
//        			}
//        			
//        			that.elements.scene.removeMesh(that.elements.scene.meshes[i]);
//        		}
//        		
//        		if(that.elements.engine.scenes.length > 0){
//        			that.elements.engine.scenes[0].dispose();
//        		}
//        		
//        		that.elements.scene.dispose();
//        		that.elements.scene = null;
//			}
		},
		events: {
			'click #btnDebugCamera' : 'onBtnDebugCamera',
			'click #btnReload' : 'onBtnReload',
			'click #btnSave' : 'onBtnSave',
			'click #btnPointer' : 'onBtnPointer',
			'click #btnPosition' : 'onBtnPosition',
			'click #btnRotation' : 'onBtnRotation',
			'click #btnScaling' : 'onBtnScaling',
			'click #btnFocus' : 'onBtnFocus',
			'click #display_GRID' : 'onDisplay_GRID',
			'click #display_WIREFRAME' : 'onDisplay_WIREFRAME',
			'click #display_BoundingBoxes' : 'onDisplay_BoundingBoxes',
			'click #enable_LocalMode' : 'onEnable_LocalMode',
			'click #display_Label' : 'onDisplay_Label',
			'click #enable_Snap' : 'onEnable_Snap',
			'click #buildingEditorLocationTree' : 'onBuildingEditorLocationTree',
			'click #btnAddObject' : 'onBtnAddObject',
			'click #btnDeleteObject' : 'onBtnDeleteObject',
			'click #parameter_Visible' : 'onParameter_Visible',
			'change #parameter_Opacity' : 'onParameter_Opacity'
				
		},
		onBtnDebugCamera: function(ev) {
			var scene = that.elements.scene;
			console.log(that.elements.scene.activeCamera);
			console.log("position: " + scene.activeCamera.position);
			
			console.log("target: " + scene.activeCamera.target);
		},
		onBtnPointer: function(ev) {
			that.changeGizmoMode(GizmoMode.none);
		},
		onBtnPosition: function(ev){
			if(!that.elements.editControl) {
				return;
			}
			
			if(that.elements.selectedMesh) {
				that.elements.editControl.switchTo(that.elements.selectedMesh);
			}
			
			// check toggle
			if( $("#btnPosition").hasClass("active") ) {
				that.changeGizmoMode(GizmoMode.none);
			} else {
				that.changeGizmoMode(GizmoMode.position);
			}
		},
		onBtnRotation: function(ev){
			if(!that.elements.editControl) {
				return;
			}
			
			if(that.elements.selectedMesh) {
				that.elements.editControl.switchTo(that.elements.selectedMesh);
			}
			
			// check toggle
			if( $("#btnRotation").hasClass("active") ) {
				that.changeGizmoMode(GizmoMode.none);
			} else {
				that.changeGizmoMode(GizmoMode.rotation);
			}
		},
		onBtnScaling: function(ev){
			if(!that.elements.editControl) {
				return;
			}
			
			if(that.elements.selectedMesh) {
				that.elements.editControl.switchTo(that.elements.selectedMesh);
			}
			
			// check toggle
			if( $("#btnScaling").hasClass("active") ) {
				that.changeGizmoMode(GizmoMode.none);
			} else {
				that.changeGizmoMode(GizmoMode.scaling);
			}
		},
		onBtnFocus: function(ev){
			if(!that.elements.editControl) {
				return;
			}
			
			var meshPicked = that.elements.editControl.mesh;
			if(meshPicked) {
				that.elements.scene.activeCamera.target.copyFrom(meshPicked.position);
				that.elements.scene.activeCamera.zoomOn([meshPicked], true);
			}
		},
		onDisplay_GRID: function(ev){
			var isVisible = that.elements.scene.getMeshByName("gridGround").isVisible;
			
			that.elements.scene.getMeshByName("gridGround").isVisible = !isVisible;
		},
		onDisplay_WIREFRAME: function(ev){
			var forceWireframe = that.elements.scene.forceWireframe;
			
			that.elements.scene.forceWireframe = !forceWireframe;
		},
		onDisplay_BoundingBoxes: function(ev){
			var forceShowBoundingBoxes = that.elements.scene.forceShowBoundingBoxes;
			
			that.elements.scene.forceShowBoundingBoxes = !forceShowBoundingBoxes;
		},
		onEnable_LocalMode: function(ev){
			if(!that.elements.editControl) {
				return;
			}
			
			var checked = ev.target.checked;
			that.elements.editControl.setLocal(checked);
		},
		onDisplay_Label: function(ev) {
			var checked = ev.target.checked;
			
			if(checked === true) {
				that.elements.objectList.forEach(function(objectInfo, idx){
					if(that.currentLocation.loc_id == objectInfo.comp_id) {
						return;
					}
					
					var mesh = that.elements.scene.getMeshByName(objectInfo.name);
					that.createLabel(mesh);
				});
			} else {
				that.elements.objectList.forEach(function(objectInfo, idx){
					var mesh = that.elements.scene.getMeshByName(objectInfo.name);
					that.removeLabel(mesh);
				});
			}
		},
		createLabel: function(mesh) {
			if(!mesh){
				return;
			}
			
			if(!that.elements.advancedTexture) {
				that.elements.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
			}
			
		    var rect1 = new BABYLON.GUI.Rectangle();
		    rect1.width = 4 + 10 * mesh.name.length + "px";
		    rect1.height = "22px";
		    rect1.cornerRadius = 5;
		    rect1.thickness = 1;
		    rect1.background = "rgba(0,0,0,0.4)";
		    rect1.color = "black";
		    that.elements.advancedTexture.addControl(rect1);
		
		    var label = new BABYLON.GUI.TextBlock();
		    label.text = mesh.name;
		    label.fontSize = 12;
		    rect1.addControl(label);
		
		    rect1.linkWithMesh(mesh);
		},
		removeLabel: function(mesh) {
			//for (var g of that.elements.advancedTexture._rootContainer.children) {
			that.elements.advancedTexture._rootContainer.children.forEach(function(g, idx){
				var ed = g._linkedMesh;
				if (ed === mesh) {
					that.elements.advancedTexture.removeControl(g);
					//break;
				}
			});
		},
		onEnable_Snap: function(ev){
			if(!that.elements.editControl) {
				return;
			}
			
			var checked = ev.target.checked;
			that.elements.editControl.setTransSnap(checked);
			that.elements.editControl.setRotSnap(checked);
			that.elements.editControl.setScaleSnap(checked);
		},
		onBuildingEditorLocationTree: function(ev){
			//$('#locationPOPUP').w2popup();
			that.openPopupLocation();
		},
		onBtnAddObject: function(ev){
//			$().w2layout(configAddObject.layout);
//			$().w2sidebar(configAddObject.sidebar);
//			$().w2grid(configAddObject.grid);
//			
//			openPopupAddObject();
		},
		onBtnDeleteObject: function(ev){
		    //w2confirm('Do you want to continue this process?')
			//w2confirm('Are you sure you want to delete the selected object?', 'Delete Confirmation')
//			w2confirm('Are you sure you want to delete the selected object?', '<ul><li>Delete</li></ul>')
//			.yes(function () { console.log('YES'); })
//			.no(function () { console.log('NO'); });
		},
		onBtnSave: function(ev){
		    //w2confirm('Do you want to continue this process?')
			w2confirm('Are you sure you want to save this scene?', 'Save')
			.yes(function () { that.saveAction(); })
			.no(function () { console.log('NO'); });
		},
		onBtnReload: function(ev){
		    //w2confirm('Do you want to continue this process?')
			w2confirm('Are you sure you want to reload this scene?', 'Reload')
			.yes(function () { that.reloadAction(); })
			.no(function () { console.log('NO'); });
		},
		onParameter_Visible: function(evt){
			if(that.elements.selectedMesh) {
				that.elements.selectedMesh.isVisible = evt.target.checked;
				
				that.elements.scene.meshes.forEach(function(mesh, idx){
					if(mesh.parent && mesh.parent instanceof BABYLON.Mesh && mesh.parent.name === that.elements.selectedMesh.name) {
						mesh.isVisible = evt.target.checked;
					}
				});
			}
		},
		onParameter_Opacity: function(evt){
			if(that.elements.selectedMesh) {
				//that.elements.selectedMesh.visibility = this.value;
				that.elements.selectedMesh.visibility = evt.target.value;
				
				that.elements.scene.meshes.forEach(function(mesh, idx){
					if(mesh.parent && mesh.parent instanceof BABYLON.Mesh && mesh.parent.name === that.elements.selectedMesh.name) {
						mesh.visibility = evt.target.value;
					}
				});
			}
		},
		openPopupLocation: function() {
			var locationList;
			
			w2popup.open({
				title   : 'Location',
				width   : 400,
				height  : 350,
				showMax : false,
				opacity : '0.5',
				style	: 'overflow:hidden;',
				body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
				buttons : '<button class="w2ui-btn" id="btnLocationDone">Done</button>',
				onOpen  : function (event) {
					event.onComplete = function () {
						$().w2layout({
							name: 'layoutLocationPopup',
							style: 'width:100%, height:200px',
							//padding: 0,
							panels: [
								{ type: 'main', minSize: 350, overflow: 'hidden' }
							]
						});
						
						$().w2sidebar({
							name: 'sidebarLocationPopup',
						});
						
						$('#w2ui-popup #main').w2render('layoutLocationPopup');

						
						
						w2ui.layoutLocationPopup.content('main', w2ui.sidebarLocationPopup);
						
						
						
						$("#btnLocationDone").on("click", function(ev){
							console.log(locationList);
							var selId = w2ui.sidebarLocationPopup.selected;
							if(!selId) {
								return;
							}
							
							//that.selectLocation( _.findWhere(locationList, {"loc_id": Number(selId)}) );
							that.selectLocation( _.findWhere(locationList, {"loc_name": selId}) );
							w2popup.close();
						});
						
						w2ui.sidebarLocationPopup.on('click', function (event) {
							console.log(event);
						});
						
						w2ui.sidebarLocationPopup.on('dblClick', function (event) {
							console.log(locationList);
							if(event && event.target) {
								var selId = w2ui.sidebarLocationPopup.selected;
								//that.selectLocation( _.findWhere(locationList, {"loc_id": Number(selId)}) );
								that.selectLocation( _.findWhere(locationList, {"loc_name": selId}) );
								w2popup.close();
							}
						});
						
						
						var locationModel = new LocationModel();
						//locationModel.url += '/-1';
						locationModel.fetch();
						//that.listenTo(locationModel, "sync", that.getLocationList);
						that.listenTo(
							locationModel, 
							"sync", 
							function(method, model, options) {
								//this.renderLocation(model);
								console.log(method);
								console.log(model);
								console.log(options);
								
								locationList = model;
								
								var rootNodes = [];
								
								model.forEach(function(item,idx){
									console.log(item.loc_name);
//									item.id = item.loc_id;
//									item.text = item.loc_name;
//					        		item.img = '';
//					        		item.icon = 'fa fa-map-o';
					        		var newItem = $.extend({}, item);
					        		newItem.id = newItem.loc_id;
					        		newItem.text = newItem.loc_name;
					        		newItem.img = '';
					        		newItem.icon = 'fa fa-map-o';
					        		rootNodes.push(newItem);
								});
								
								var treeNode = that.createLocationTree(rootNodes);
								
								//rootNodes.push(arrayList.splice(index, 1)[0])
								
//					        	for(var i=0; i < treeList.length; i++){
//					        		var item = treeList[i];
//									w2ui['codeMgrAssetTree'].insert('root', null, item);
//					        	}
								
					        	//w2ui.sidebar.insert('root', null, [{ id: 'new-4', text: 'New Item 4', icon: 'w2ui-icon-check' }]);
								
//								if(w2ui.sidebar) {
//									w2ui.sidebar.destroy();
//								}
								w2ui.sidebarLocationPopup.remove('root');
								w2ui.sidebarLocationPopup.add([{ id: 'root', text: 'Sites', group: true, expanded: true }]);
								//w2ui.sidebarLocationPopup.insert('root', null, rootNodes);
								w2ui.sidebarLocationPopup.insert('root', null, treeNode);
								
								w2ui.sidebarLocationPopup.unselect();
							}
						);
					}
				},
				onToggle: function (event) { 
					event.onComplete = function () {
						w2ui.layout.resize();
					}
				},
				onDone: function () {
					console.log('done');
					w2popup.close();
				},
				onClose: function () {
					//w2ui['layout'].destroy();
				}
			});
		},
		changeGizmoMode: function(gizmoMode) {
			if(!that.elements.editControl) {
				return;
			}
			
			switch(gizmoMode) {
				case GizmoMode.position:
					that.elements.gizmoMode = GizmoMode.position;
					
					that.elements.editControl.enableTranslation();
					that.elements.editControl.xaxis.visibility = 1;
					that.elements.editControl.yaxis.visibility = 1;
					that.elements.editControl.zaxis.visibility = 1;
					
					$("#btnPosition").addClass("active")
					$("#btnRotation").removeClass("active");
					$("#btnScaling").removeClass("active");
					break;
				case GizmoMode.rotation:
					that.elements.gizmoMode = GizmoMode.rotation;
					
					that.elements.editControl.enableRotation();
					that.elements.editControl.xaxis.visibility = 1;
					that.elements.editControl.yaxis.visibility = 1;
					that.elements.editControl.zaxis.visibility = 1;
					
					$("#btnPosition").removeClass("active")
					$("#btnRotation").addClass("active");
					$("#btnScaling").removeClass("active");
					break;
				case GizmoMode.scaling:
					that.elements.gizmoMode = GizmoMode.scaling;
					
					that.elements.editControl.enableScaling();		
					that.elements.editControl.xaxis.visibility = 1;
					that.elements.editControl.yaxis.visibility = 1;
					that.elements.editControl.zaxis.visibility = 1;
					
					$("#btnPosition").removeClass("active")
					$("#btnRotation").removeClass("active");
					$("#btnScaling").addClass("active");
					break;
				case GizmoMode.none:
				default:
					that.elements.gizmoMode = GizmoMode.none;
				
					that.elements.editControl.disableTranslation();
					that.elements.editControl.disableRotation();
					that.elements.editControl.disableScaling();				
					that.elements.editControl.xaxis.visibility = 0;
					that.elements.editControl.yaxis.visibility = 0;
					that.elements.editControl.zaxis.visibility = 0;
					
					$("#btnPosition").removeClass("active")
					$("#btnRotation").removeClass("active");
					$("#btnScaling").removeClass("active");
					break;
			}
		},
		selectLocation: function(location, reload) {
			if(!location) {
				return;
			}
			
			if(!reload && that.currentLocation && that.currentLocation.loc_id === location.loc_id) {
				return;
			}
			
			that.elements.advancedTexture = null;
			
			that.currentLocation = location;
			$("#locationResultBoard").text(that.currentLocation.loc_name);
			$("#locationResultBoard").attr("title", that.currentLocation.loc_name);
			
			that.initEditControl();
			that.removeScene();
			that.elements.objectList = [];
			
			that.elements.scene = that.createScene();
			
//			window.addEventListener("resize", function() {
//				that.elements.engine.resize();
//			});
			
			that.elements.engine.runRenderLoop(function () {
				if(!that.elements.scene){
					return;
				}
				
				that.elements.scene.render();
				
				var fpsLabel = document.getElementById("fpsLabel");
				if(fpsLabel) {
					fpsLabel.innerHTML = that.elements.engine.getFps().toFixed() + " fps";
				}
			});
		},
		reloadAction: function() {
			that.selectLocation( that.currentLocation, true );
		},
		saveAction: function() {
			var saveObjectList = [];
			that.elements.objectList.forEach(function(objectInfo, idx){
				var mesh = that.elements.scene.getMeshByName(objectInfo.name);
				if(that.compareMeshAndObjectInfo(mesh, objectInfo) == false){
//					var newObjectInfo = {};
//					$.extend(newObjectInfo, objectInfo);
//					//newObjectInfo.save_method = "update"; // insert, update, delete
//					saveObjectList.push(newObjectInfo);
					
//					that.updateObjectInfo(objectInfo, mesh);
//					saveObjectList.push(objectInfo);
					
					var newObjectInfo = $.extend(true, {}, objectInfo);
					that.copyObjectInfoFromMesh(newObjectInfo, mesh);
					newObjectInfo.reserve_str = "update"; // insert, update, delete
					saveObjectList.push(newObjectInfo);
				}
			});
			console.log(saveObjectList);
			
			if(saveObjectList.length == 0) {
				w2alert('There is no change.', 'Information')
			    .ok(function () { console.log('ok'); });
			} else {
				Backbone.ajax({
					dataType: "json",
					contentType: 'application/json',
					url: "editor/object",
					method: "put",
					data: JSON.stringify(saveObjectList),
					success: function(val){
						if(val && val.result == true) {
							saveObjectList.forEach(function(objectInfo, idx){
								var targetObjectInfo = _.findWhere(that.elements.objectList, {name: objectInfo.name})
								if(targetObjectInfo) {
									that.copyObjectInfo(targetObjectInfo, objectInfo);
								}
							});
							
							w2alert('Save OK', 'Information')
						    .ok(function () { });
						} else {
							w2alert('Faild' + (val && val.reason.length>0) ? " : " + val.reason : "")
						    .ok(function () { });
						}
					},
					error: function(val) {
						w2alert('Failed')
					    .ok(function () { });
					}
				});
			}
		},
		compareMeshAndObjectInfo: function(mesh, objectInfo) {
			if(mesh.position.x != objectInfo.position_x)
				return false;
			
			if(mesh.position.y != objectInfo.position_y)
				return false;
			
			if(mesh.position.z != objectInfo.position_z)
				return false;
			
			if(mesh.rotation.x != objectInfo.rotation_x)
				return false;
			
			if(mesh.rotation.y != objectInfo.rotation_y)
				return false;
			
			if(mesh.rotation.z != objectInfo.rotation_z)
				return false;
			
			if(mesh.scaling.x != objectInfo.scale_x)
				return false;
			
			if(mesh.scaling.y != objectInfo.scale_y)
				return false;
			
			if(mesh.scaling.z != objectInfo.scale_z)
				return false;
			
//			if(mesh.visibility != objectInfo.opacity)
//				return false;
			
//			if(mesh.isPickable != objectInfo.is_pickable) {
//				return false;
//			}
			
			return true;
		},
		copyObjectInfoFromMesh: function(objectInfo, mesh) {
			objectInfo.position_x = mesh.position.x;
			objectInfo.position_y = mesh.position.y;
			objectInfo.position_z = mesh.position.z;
			objectInfo.rotation_x = mesh.rotation.x;
			objectInfo.rotation_y = mesh.rotation.y;
			objectInfo.rotation_z = mesh.rotation.z;
			objectInfo.scale_x = mesh.scaling.x;
			objectInfo.scale_y = mesh.scaling.y;
			objectInfo.scale_z = mesh.scaling.z;
			//objectInfo.opacity = mesh.visibility;
			objectInfo.is_pickable = mesh.isPickable;
		},
		copyObjectInfo: function(objectInfoDest, objectInfoSrc) {
			objectInfoDest.position_x = objectInfoSrc.position_x;
			objectInfoDest.position_y = objectInfoSrc.position_y;
			objectInfoDest.position_z = objectInfoSrc.position_z;
			objectInfoDest.rotation_x = objectInfoSrc.rotation_x;
			objectInfoDest.rotation_y = objectInfoSrc.rotation_y;
			objectInfoDest.rotation_z = objectInfoSrc.rotation_z;
			objectInfoDest.scale_x = objectInfoSrc.scale_x;
			objectInfoDest.scale_y = objectInfoSrc.scale_y;
			objectInfoDest.scale_x = objectInfoSrc.scale_x;
			//objectInfoDest.opacity = objectInfoSrc.opacity;
			objectInfoDest.is_pickable = objectInfoSrc.is_pickable;
		},
		initEditControl: function() {
			if(that.elements.editControl) {
				that.elements.editControl.detach();
			}
			that.elements.editControl = null;
		},
		start: function() {
			//startingPoint = null; //Fix SonarQube by GI HWAN . 2018.06.15
			//currentMesh = null;
			
			//------------------EDIT COTROL -------------------------------------------------
			//this.elements.sceneLoader = new Loader('#renderCanvas');
			//var scene = this.elements.sceneLoader.scene;
			//scene.clearColor = new BABYLON.Color4(0.29, 0.29, 0.29, 0);

			$('#buildingEditorObjectsTree').w2sidebar({
				name: 'buildingEditorObjectsTree',
			});
			
			var configAddObject = {
				layout: {
					name: 'layout',
					padding: 0,
					panels: [
						{ type: 'top', size: 32, content: '<div style="padding: 7px;">Top Panel</div>', style: 'border-bottom: 1px solid silver;' },
						{ type: 'left', size: 200, resizable: true, minSize: 120 },
						{ type: 'main', minSize: 350, overflow: 'hidden' }
					]
				},
				sidebar: {
					name: 'sidebar',
					nodes: [ 
						{ id: 'general', text: 'General', group: true, expanded: true, nodes: [
							{ id: 'grid', text: 'Grid', img: 'icon-page', selected: true },
							{ id: 'html', text: 'Some HTML', img: 'icon-page' }
						]}
					],
					onClick: function (event) {
						switch (event.target) {
							case 'grid':
								w2ui.layout.content('main', w2ui.grid);
								break;
							case 'html':
								w2ui.layout.content('main', '<div style="padding: 10px">Some HTML</div>');
								$(w2ui.layout.el('main'))
									.removeClass('w2ui-grid')
									.css({ 
										'border-left': '1px solid silver'
									});
								break;
						}
					}
				},
				grid: { 
					name: 'grid',
					style: 'border: 0px; border-left: 1px solid silver',
					columns: [
						{ field: 'state', caption: 'State', size: '80px' },
						{ field: 'title', caption: 'Title', size: '100%' },
						{ field: 'priority', caption: 'Priority', size: '80px', attr: 'align="center"' }
					],
					records: [
						{ recid: 1, state: 'Open', title: 'Short title for the record', priority: 2 },
						{ recid: 2, state: 'Open', title: 'Short title for the record', priority: 3 },
						{ recid: 3, state: 'Closed', title: 'Short title for the record', priority: 1 }
					]
				}
			};
			
//			$(function () {
//				// initialization in memory
//				$().w2layout(configAddObject.layout);
//				$().w2sidebar(configAddObject.sidebar);
//				$().w2grid(configAddObject.grid);
//			});

			function openPopupAddObject() {
				w2popup.open({
					title   : 'Add Object',
					width   : 800,
					height  : 600,
					showMax : true,
					body	: '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
					onOpen  : function (event) {
						event.onComplete = function () {
							$('#w2ui-popup #main').w2render('layout');
							w2ui.layout.content('left', w2ui.sidebar);
							w2ui.layout.content('main', w2ui.grid);
						}
					},
					onToggle: function (event) { 
						event.onComplete = function () {
							w2ui.layout.resize();
						}
					},
					onClose: function () {
						//w2ui['layout'].destroy();
					}
				});
			}
			
			/*
			var precision = {
				"w" : 1,
				"h" : 1
			};
			var subdivisions = {
				'h' : 17,
				'w' : 17
			};
			var ground = BABYLON.Mesh.CreateTiledGround("Tiled Ground", -8.5, -8.5, 8.5, 8.5, subdivisions, precision, scene, false);
			ground.receiveShadows = true;
			ground.position.y = -0.5;
			*/

			/*
			$(function () {
				var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
				$('#BUILDING-EDITOR-MAIN').w2layout({
					name: 'BUILDING-EDITOR-MAIN',
					padding: 4,
					panels: [
						{ type: 'left', size: 200, resizable: true, style: pstyle, content: 'left' },
						{ type: 'main', style: pstyle, content: '<canvas id="renderCanvas" class="canvas-3d"></canvas>' },
						{ type: 'right', size: 200, resizable: true, style: pstyle, content: 'right' }
					]
				});
				
				var people = ['George Washington', 'John Adams', 'Thomas Jefferson', 'James Buchanan', 'James Madison', 'Abraham Lincoln', 'James Monroe', 'Andrew Johnson', 'John Adams', 'Ulysses Grant', 'Andrew Jackson', 'Rutherford Hayes', 'Martin Van Buren', 'James Garfield', 'William Harrison', 'Chester Arthur', 'John Tyler', 'Grover Cleveland', 'James Polk', 'Benjamin Harrison', 'Zachary Taylor', 'Grover Cleveland', 'Millard Fillmore', 'William McKinley', 'Franklin Pierce', 'Theodore Roosevelt', 'John Kennedy', 'William Howard', 'Lyndon Johnson', 'Woodrow Wilson', 'Richard Nixon', 'Warren Harding', 'Gerald Ford', 'Calvin Coolidge', 'James Carter', 'Herbert Hoover', 'Ronald Reagan', 'Franklin Roosevelt', 'George Bush', 'Harry Truman', 'William Clinton', 'Dwight Eisenhower', 'George W. Bush', 'Barack Obama'];
				$('input[type=list]').w2field('list', { items: people });
				$('input[type=combo]').w2field('combo', { items: people });
			});
			*/

			var layoutSettings = {
				applyDefaultStyles: false, 
				defaults: {
					spacing_open: 4,
					spacing_closed: 4,
					//togglerLength_open: 0,
					//togglerLength_closed: -1,
					//initClosed: true,
					resizable: false
				}, 
				center: {
					//paneSelector: "#mainContent", 
					//minWidth: 800,
					//minHeight: 400
					onresize: function() {
						that.elements.engine.resize();
					}
				}, 
				west: {
					size: 220
				},
				east: {
					size: 220
				},
				south: {
					togglerLength_open: 0,
					togglerLength_closed: -1,
					spacing_open: 3,
					spacing_closed: 4,
				}
			}
	    	
			$('#BUILDING-EDITOR-MAIN').layout(layoutSettings);
	
//			$('#buildingEditorObjectsTree').w2sidebar({
//				name: 'buildingEditorObjectsTree',
//				nodes: [
//					{
//						id: 'Scene', text: 'Scene', img: 'icon-folder', expanded: true, group: true,
//						nodes: [
//							//{ id: 'building1', text: 'building1', icon: 'w2ui-icon icon-folder' },
//							//{ id: 'building1', text: 'building1', icon: 'fa fa-cube' },
//							{ id: 'building1', text: 'building1', icon: 'fa fa-cube' },
//							{ id: 'building2', text: 'building2', icon: 'fa fa-cube' }
//						]
//					},
//					{
//						id: 'Camera', text: 'Camera', img: 'icon-folder', expanded: true, group: true,
//						nodes: [
//							{ id: 'camera1', text: 'camera1', icon: 'fa fa-camera' }
//						]
//					},
//					{
//						id: 'Light', text: 'Light', img: 'icon-folder', expanded: true, group: true,
//						nodes: [
//							{ id: 'light1', text: 'light1', icon: 'fa fa-lightbulb-o' }
//						]
//					}
//				]
//			});
			
		
//			var FizzyText = function() {
//				this.Name = 'building1';
//				this.Model = 'BD001';
//				this.IsVisible = true;
//			};
//			
//			var text = new FizzyText();
			var datGuiElement = new Datgui.GUI({
				autoPlace: false
			});
			//$(datGuiElement.domElement).attr("hidden", true);

			/**
			 * Position
			 */
			var fPosition = datGuiElement.addFolder('Position');
			// Position X
			//var positionText = new CoordinateText();
			var positionText = that.elements.positionText;
			var controllerPositionX = fPosition.add(positionText, 'X').step(1).listen();
			controllerPositionX.onChange(function(value){
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.position.x = value;
					if(that.elements.editControl.isTranslationEnabled() === false) {
						that.changeGizmoMode(GizmoMode.position);
					}
				}
			});
			controllerPositionX.onFinishChange(function(value){
				
			});
			// Position Y
			var controllerPositionY = fPosition.add(positionText, 'Y').step(1).listen();
			controllerPositionY.onChange(function(value){
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.position.y = value;
					if(that.elements.editControl.isTranslationEnabled() === false) {
						that.changeGizmoMode(GizmoMode.position);
					}
				}
			});
			controllerPositionX.onFinishChange(function(value){
				
			});
			// Position Z
			var controllerPositionZ = fPosition.add(positionText, 'Z').step(1).listen();
			controllerPositionZ.onChange(function(value){
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.position.z = value;
					if(that.elements.editControl.isTranslationEnabled() === false) {
						that.changeGizmoMode(GizmoMode.position);
					}
				}
			});
			controllerPositionZ.onFinishChange(function(value){
				
			});
			
			fPosition.open();
			
			/**
			 * Rotation
			 */
			var fRotation = datGuiElement.addFolder('Rotation');
			//var rotationText = new CoordinateText();
			var rotationText = that.elements.rotationText;
			rotationText.X = 0;
			rotationText.Y = 0;
			rotationText.Z = 0;
			// Rotation X
			//var controllerRotationX = fRotation.add(rotationText, 'X', -5, 5).step(.1).listen();
			var controllerRotationX = fRotation.add(rotationText, 'X', 0, 359).step(1).listen();
			controllerRotationX.onChange(function(value){
				console.log("controllerRotationX: " + value + " => " + BABYLON.Tools.ToRadians(value));
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.rotation.x = BABYLON.Tools.ToRadians(value);
					if(that.elements.editControl.isRotationEnabled() === false) {
						that.changeGizmoMode(GizmoMode.rotation);
					}
				}
			});
			controllerRotationX.onFinishChange(function(value){
				
			});
			// Rotation Y
			//var controllerRotationY = fRotation.add(rotationText, 'Y', -5, 5).step(.1).listen();
			var controllerRotationY = fRotation.add(rotationText, 'Y', 0, 359).step(1).listen();
			controllerRotationY.onChange(function(value){
				console.log("controllerRotationY: " + value + " => " + BABYLON.Tools.ToRadians(value));
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.rotation.y = BABYLON.Tools.ToRadians(value);
					if(that.elements.editControl.isRotationEnabled() === false) {
						that.changeGizmoMode(GizmoMode.rotation);
					}
				}
			});
			controllerRotationY.onFinishChange(function(value){
				
			});
			// Rotation Z
			//var controllerRotationZ = fRotation.add(rotationText, 'Z', -5, 5).step(.1).listen();
			var controllerRotationZ = fRotation.add(rotationText, 'Z', 0, 359).step(1).listen();
			controllerRotationZ.onChange(function(value){
				console.log("controllerRotationZ: " + value + " => " + BABYLON.Tools.ToRadians(value));
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.rotation.z = BABYLON.Tools.ToRadians(value);
					if(that.elements.editControl.isRotationEnabled() === false) {
						that.changeGizmoMode(GizmoMode.rotation);
					}
				}
			});
			controllerRotationZ.onFinishChange(function(value){
				
			});
			fRotation.open();
			
			/**
			 * Scaling
			 */
			var fScaling = datGuiElement.addFolder('Scaling');
			//var scalingText = new CoordinateText();
			var scalingText = that.elements.scalingText;
			scalingText.X = 1;
			scalingText.Y = 1;
			scalingText.Z = 1;
			// Scaling X
			var controllerScalingX = fScaling.add(scalingText, 'X').step(.1).listen();
			controllerScalingX.onChange(function(value){
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.scaling.x = value;
					if(that.elements.editControl.isScalingEnabled() === false) {
						that.changeGizmoMode(GizmoMode.scaling);
					}
				}
			});
			controllerScalingX.onFinishChange(function(value){
				
			});
			// Scaling Y
			var controllerScalingY = fScaling.add(scalingText, 'Y').step(.1).listen();
			controllerScalingY.onChange(function(value){
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.scaling.y = value;
					if(that.elements.editControl.isScalingEnabled() === false) {
						that.changeGizmoMode(GizmoMode.scaling);
					}
				}
			});
			controllerScalingY.onFinishChange(function(value){
				
			});
			// Scaling Z
			var controllerScalingZ = fScaling.add(scalingText, 'Z').step(.1).listen();
			controllerScalingZ.onChange(function(value){
				if(that.elements.selectedMesh) {
					that.elements.selectedMesh.scaling.z = value;
					if(that.elements.editControl.isScalingEnabled() === false) {
						that.changeGizmoMode(GizmoMode.scaling);
					}
				}
			});
			controllerScalingZ.onFinishChange(function(value){
				
			});
			fScaling.open();
			
			var parentElement = $("#buildingEditorProperties");
			datGuiElement.width = parentElement.width();
			datGuiElement.height = parentElement.height();
			parentElement[0].appendChild(datGuiElement.domElement);
			
			
			
			var camera;
			var editControl;

			/*
			 * The scene
			 */
			that.elements.canvas = document.querySelector("#renderCanvas");
			that.elements.engine = new BABYLON.Engine(that.elements.canvas, true, { stencil: true });


			

//			var scene = that.createScene();
//			that.elements.scene = scene;


//			engine.runRenderLoop(function() {
//				scene.render();
//				
//				var fpsLabel = document.getElementById("fpsLabel");
//				fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";
//			});
//			window.addEventListener("resize", function() {
//				that.elements.engine.resize();
//			});
			
//			$("#renderCanvas").on("resize", function(ev){
//				engine.resize();
//			});
	    },
		createScene : function() {
			var canvas = that.elements.canvas;
			var scene = new BABYLON.Scene(that.elements.engine);
			//scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
			//scene.clearColor = new BABYLON.Color4(0.29, 0.29, 0.29, 0);
			scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
			
			var bbr = scene.getBoundingBoxRenderer();
			bbr.showBackLines = false;
			//bbr.backColor = new BABYLON.Color3(1, 0, 0);
			//bbr.frontColor = new BABYLON.Color3(0, 1, 0);
			//bbr.frontColor = new BABYLON.Color3(137/256, 255/256, 0/256);
			bbr.frontColor = new BABYLON.Color3(0.53, 0.99, 0);

			//camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.2, 1000, new BABYLON.Vector3(0, 140.0641, 200), scene);
			//camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.2, 1000, new BABYLON.Vector3(663.3808444473705, 661.8514165775731, 1033.1544515304267), scene);
			var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1.23, 1.38, 1409.66, new BABYLON.Vector3(0, 140.0641, 200), scene);
			//camera.wheelPrecision = 15;
			camera.setTarget(BABYLON.Vector3.Zero());
			//var useCtrlForPanning = false; // set it to false to allow only right click
			var useCtrlForPanning = true;
			camera.attachControl(canvas, false, useCtrlForPanning);
			camera.panningSensibility = 10; // default => 50

			var light1 = new BABYLON.HemisphericLight("light1",new BABYLON.Vector3(0, 1001, 1000), scene);
			light1.intensity = .5;

			
			var light2 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);
	        light2.intensity = 0.8;

	        scene.registerBeforeRender(function () {
	        	light2.position = that.elements.scene.activeCamera.position;
	        });
			
	        
	    	// Skybox
	        if(that.currentLocation.code_name == "SITE") {
		    	//var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
		    	var skybox = BABYLON.Mesh.CreateSphere("skyBox", 64, 10000, scene);
		        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		    	skyboxMaterial.backFaceCulling = false;
		    	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../dist/img/idc/texture/TropicalSunnyDay", scene);
		    	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		    	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		    	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		    	skyboxMaterial.disableLighting = true;
		    	skybox.material = skyboxMaterial;
		    	skybox.isPickable = false;
	        }
	        
//	        var background = new BABYLON.Layer("back", "../../dist/img/idc/texture/TropicalSunnyDay_nx.jpg", scene);
//	    	background.isBackground = true;
//	    	//background.texture.level = 0;
//	    	//background.texture.wAng = .2;
	        
//			var ground = BABYLON.Mesh.CreateGround("ground1", 2000, 2000, 10, scene);
//			var gridMaterial = new BABYLON.StandardMaterial("Grid Material", scene);
//			gridMaterial.wireframe = true;
//			ground.material = gridMaterial;
//			ground.isPickable = false;

	        
			var gridGround = BABYLON.MeshBuilder.CreateGround("gridGround", {
				width: 10000,
				height: 10000
			}, scene);
			gridGround.position.y = 0;
			
			var groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
			groundMaterial.majorUnitFrequency = 5;
			groundMaterial.minorUnitVisibility = 0.45;
			groundMaterial.gridRatio = 20;
			groundMaterial.backFaceCulling = false;
			//groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
			//groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
			groundMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
			groundMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);
			groundMaterial.opacity = 0.98;
			gridGround.material = groundMaterial;
			gridGround.isPickable = false;
	        
			var assetsManager = new BABYLON.AssetsManager(scene);
			
			var modelName = "";
			
			//that.currentLocation.is_pickable = false;
			//that.addMeshTask(assetsManager, that.currentLocation);
			
			
//			var locationModel = new LocationModel();
//			locationModel.url += '/' + that.currentLocation.loc_id;
//			locationModel.fetch();
			
			var objectModel = new ObjectModel();
			objectModel.url += '/' + that.currentLocation.loc_id;
			objectModel.fetch();
			
			//that.listenTo(locationModel, "sync", that.getLocationList);
			that.listenTo(
				objectModel, 
				"sync", 
				function(method, model, options) {
					//this.renderLocation(model);
					console.log(method);
					console.log(model);
					console.log(options);
					
					model.forEach(function(item,idx){
						console.log(item.comp_name);
						//addMeshTask(assetsManager, item.model_name, item.loc_name);
						that.addMeshTask(assetsManager, item);
					});
					
					assetsManager.load();
					
					//rootNodes.push(arrayList.splice(index, 1)[0])
					
//		        	for(var i=0; i < treeList.length; i++){
//		        		var item = treeList[i];
//						w2ui['codeMgrAssetTree'].insert('root', null, item);
//		        	}
					
				}
			);
			
			assetsManager.onFinish = function (tasks) {
				scene.meshes.forEach(function(mesh, idx){
					console.log(mesh.name);

					mesh.actionManager = new BABYLON.ActionManager(scene);
					
					mesh.actionManager.registerAction(
						new BABYLON.ExecuteCodeAction(
							BABYLON.ActionManager.OnLeftPickTrigger,  
							function (evt) {
								console.log(evt);
								if (that.elements.editControl) {
									console.log("isEditing: " + that.elements.editControl.isEditing());
									console.log("isPointeOver: " + that.elements.editControl.isPointerOver());
								}
								if (evt.source instanceof BABYLON.Mesh) {
									that.selectObject(evt.source, true);
								}
							}
						)
					);
				});
				
//				var maxMeshSize = 0;
//				that.elements.scene.meshes.forEach(function(mesh, idx){
//					var size = mesh.getBoundingInfo().boundingBox.extendSizeWorld;
//					var maxSize = size.x > size.z ? size.x : size.z;
//					maxMeshSize = maxSize > maxMeshSize ? maxSize : maxMeshSize;
//				});
				
//				var locationMesh = that.elements.scene.getMeshByName(that.currentLocation.loc_name);
//				var locationMesh_size = locationMesh.getBoundingInfo().boundingBox.extendSize;
//				var maxMeshSize = locationMesh_size.x > locationMesh_size.z ? locationMesh_size.x : locationMesh_size.z;
//				var meshCenter = locationMesh.getBoundingInfo().boundingBox.center;
//				
//				that.elements.scene.activeCamera.setTarget(meshCenter);
//			    var ratio = that.elements.engine.getAspectRatio(that.elements.scene.activeCamera);
//			    var h = maxMeshSize / (Math.tan (that.elements.scene.activeCamera.fov / 2) * ratio);
//				that.elements.scene.activeCamera.setPosition(new BABYLON.Vector3(meshCenter.x, meshCenter.y + h, meshCenter.z + maxMeshSize * 2));
				//that.elements.scene.activeCamera.zoomOn([locationMesh], true);
				
//				var zoomMeshList = [];
//				that.elements.objectList.forEach(function(object, idx){
//					zoomMeshList.push(that.elements.scene.getMeshByName(object.name));
//				});
//				//that.elements.scene.activeCamera.setTarget(locationMesh);
//				that.elements.scene.activeCamera.zoomOn(zoomMeshList, true);
				

				var treeNode = [];
//				that.elements.objectList.forEach(function(object, idx){
//					console.log("OBJ:" + object.name);
//					//treeNode.push({ id: object.name, text: object.name, icon: 'fa fa-cube'});
//					treeNode.push({ id: object.name, text: object.name, icon: 'fa fa-building'});
//				});
				
				treeNode = that.createObjectTree(that.elements.objectList, that.currentLocation.parent_loc_id);
				
				if(w2ui.buildingEditorObjectsTree) {
					w2ui.buildingEditorObjectsTree.remove('Mesh');
					w2ui.buildingEditorObjectsTree.remove('Camera');
					w2ui.buildingEditorObjectsTree.remove('Light');
				}
				
//				$().w2sidebar({
//					name: 'buildingEditorObjectsTree',
//				});
				
//				w2ui.buildingEditorObjectsTree.add([
//					{
//						id: 'Mesh', text: 'Mesh', img: 'icon-folder', expanded: true, group: true,
//						nodes: treeNode
//					},
//					{
//						id: 'Camera', text: 'Camera', img: 'icon-folder', expanded: true, group: true,
//						nodes: [
//							{ id: 'camera1', text: 'camera1', icon: 'fa fa-camera' }
//						]
//					},
//					{
//						id: 'Light', text: 'Light', img: 'icon-folder', expanded: true, group: true,
//						nodes: [
//							{ id: 'light1', text: 'light1', icon: 'fa fa-lightbulb-o' }
//						]
//					}
//				]);
				
				w2ui.buildingEditorObjectsTree.add([
					{
						id: 'Mesh', text: 'Mesh', img: 'icon-folder', expanded: true, group: true,
						nodes: treeNode
					}
				]);
				
//				$('#buildingEditorObjectsTree').w2sidebar({
//					name: 'buildingEditorObjectsTree',
//					nodes: [
//						{
//							id: 'Mesh', text: 'Mesh', img: 'icon-folder', expanded: true, group: true,
//							//nodes: treeNode
//						},
//						{
//							id: 'Camera', text: 'Camera', img: 'icon-folder', expanded: true, group: true,
//							nodes: [
//								{ id: 'camera1', text: 'camera1', icon: 'fa fa-camera' }
//							]
//						},
//						{
//							id: 'Light', text: 'Light', img: 'icon-folder', expanded: true, group: true,
//							nodes: [
//								{ id: 'light1', text: 'light1', icon: 'fa fa-lightbulb-o' }
//							]
//						}
//					]
//				});
				
				w2ui.buildingEditorObjectsTree.on('click', function (event) {
					console.log(event);
				    
					that.selectObject(that.elements.scene.getMeshByName(event.target), false);
				});
				
				w2ui.buildingEditorObjectsTree.on('dblClick', function (event) {
					console.log(event);
				    
					that.selectObject(that.elements.scene.getMeshByName(event.target), false);
					
					var meshPicked = that.elements.editControl.mesh;
					if(meshPicked) {
						that.elements.scene.activeCamera.target.copyFrom(meshPicked.position);
						that.elements.scene.activeCamera.zoomOn([meshPicked], true);
					}
				});
				
				setTimeout(function() {
					var locationMesh = that.elements.scene.getMeshByName(that.currentLocation.loc_name);
					if(that.currentLocation.code_name != "SITE" && that.currentLocation.code_name != "ROOM" ) {
						locationMesh.visibility = 0.2;
					}
					locationMesh.isPickable = false;
					
					that.elements.scene.activeCamera.target.copyFrom(locationMesh.position);
					that.elements.scene.activeCamera.zoomOn([locationMesh], true);
				}, 10);
			};
			
			//assetsManager.load();
			
//			var onPointerDown = function (evt) {
//
//			}
			
//			var onPointerUp = function () {
//				if(!that.elements.selectedMesh) {
//					return;
//				}
//
//				var positionText = that.elements.positionText;
//				var rotationText = that.elements.rotationText;
//				var scalingText = that.elements.scalingText;
//				
//				positionText.X = that.elements.selectedMesh.position.x;
//				positionText.Y = that.elements.selectedMesh.position.y;
//				positionText.Z = that.elements.selectedMesh.position.z;
//
//				var tempRot;
//				
//				tempRot = that.elements.selectedMesh.rotation.x;
//				var rotX = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
//				tempRot = that.elements.selectedMesh.rotation.y;
//				var rotY = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
//				tempRot = that.elements.selectedMesh.rotation.z;
//				var rotZ = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
//				
//				rotationText.X = BABYLON.Tools.ToDegrees((rotX == 360) ? 0 : rotX);
//				rotationText.Y = BABYLON.Tools.ToDegrees((rotY == 360) ? 0 : rotY);
//				rotationText.Z = BABYLON.Tools.ToDegrees((rotZ == 360) ? 0 : rotZ);
//				
//				scalingText.X = that.elements.selectedMesh.scaling.x;
//				scalingText.Y = that.elements.selectedMesh.scaling.y;
//				scalingText.Z = that.elements.selectedMesh.scaling.z;
//				
//				console.log("=================================================");
//				console.log(`position: ${positionText.X}, ${positionText.Y}, ${positionText.Z}`);
//				console.log(`rotation: ${rotationText.X}, ${rotationText.Y}, ${rotationText.Z}`);
//				console.log(`scaling: ${scalingText.X}, ${scalingText.Y}, ${scalingText.Z}`);
//				
//				console.log(`rotation_: ${that.elements.selectedMesh.rotation.x}, ${that.elements.selectedMesh.rotation.y}, ${that.elements.selectedMesh.rotation.z}`);
//			}
			
//			var onPointerMove = function (evt) {
//
//			}
			
			var onCanvasResize = function (evt) {
				engine.resize();
			}
			
//			canvas.addEventListener("pointerdown", onPointerDown, false);
			//canvas.addEventListener("pointerup", onPointerUp, false);
//			canvas.addEventListener("pointermove", onPointerMove, false);
			
			canvas.addEventListener("resize", onCanvasResize, false);
			
			scene.onDispose = function () {
//				canvas.removeEventListener("pointerdown", onPointerDown);
//				canvas.removeEventListener("pointerup", onPointerUp);
//				canvas.removeEventListener("pointermove", onPointerMove);
				canvas.removeEventListener("resize", onCanvasResize);
			}
			
			return scene;
		},
		createLocationTree : function(objectArray, rootId) {
			var rootNodes = [], nodes = {};
			var root_id = -1;
			if(rootId) {
				root_id = rootId;
			}

			// find the top level nodes and hash the children based on parent
			for (var i = 0, len = objectArray.length; i < len; ++i) {
				var item = objectArray[i];
				var p = item.parent_loc_id;
				var target = (p === root_id) ? rootNodes : (nodes[p] || (nodes[p] = []));

				var icon;
				if(item.code_name === "SITE")
					icon = "fa fa-map-o";
				else if(item.code_name === "BUILDING")
					icon = "fa fa-building";
				else if(item.code_name === "FLOOR")
					icon = "fa fa-align-justify";
				else if(item.code_name === "ROOM")
					icon = "fa fa-gg";
				else
					icon = "fa fa-cube";
				
				target.push({ id: item.loc_name, text: item.loc_name, icon: icon, loc_id: item.loc_id, expanded: true});
			}

			// function to recursively build the tree
			var findChildren = function(parent) {
				if (nodes[parent.loc_id]) {
					parent.nodes = nodes[parent.loc_id];
					for (var i = 0, len = parent.nodes.length; i < len; ++i) {
						findChildren(parent.nodes[i]);
					}
				}
			};

			// enumerate through to handle the case where there are multiple roots
			for (var i = 0, len = rootNodes.length; i < len; ++i) {
				findChildren(rootNodes[i]);
			}

			return rootNodes;
		},
		createObjectTree : function(objectArray, rootId) {
			var rootNodes = [], nodes = {};
			var root_id = "-1";
			if(rootId) {
				root_id = rootId + "";
			}

			// find the top level nodes and hash the children based on parent
			for (var i = 0, len = objectArray.length; i < len; ++i) {
				var item = objectArray[i];
				var p = item.parent_loc_id;
				//var p = (item.comp_type === "LOCATION") ? item.comp_id : item.parent_loc_id;
				var target = (p === root_id) ? rootNodes : (nodes[p] || (nodes[p] = []));

				var icon;
				if(item.code_name === "SITE")
					icon = "fa fa-map-o";
				else if(item.code_name === "BUILDING")
					icon = "fa fa-building";
				else if(item.code_name === "FLOOR")
					icon = "fa fa-align-justify";
				else if(item.code_name === "ROOM")
					icon = "fa fa-gg";
				else
					icon = "fa fa-cube";
				
				target.push({ id: item.comp_name, text: item.comp_name, icon: icon, loc_id: item.comp_id, expanded: true});
			}

			// function to recursively build the tree
			var findChildren = function(parent) {
				if (nodes[parent.loc_id]) {
					parent.nodes = nodes[parent.loc_id];
					for (var i = 0, len = parent.nodes.length; i < len; ++i) {
						findChildren(parent.nodes[i]);
					}
				}
			};

			// enumerate through to handle the case where there are multiple roots
			for (var i = 0, len = rootNodes.length; i < len; ++i) {
				findChildren(rootNodes[i]);
			}

			return rootNodes;
		},
        createTree : function(arrayList, rootId){
        	var rootNodes = [];
			var traverse = function (nodes, item, index) {
				if (nodes instanceof Array) {
					return nodes.some(function (node) {
						if (node.id === item.parent_loc_id) {
							node.nodes = node.nodes || [];
							node.nodes.push(arrayList.splice(index, 1)[0]);
								
							if(node.nodes.length > 0){
								node.img = 'fa icon-folder';
								node.icon = '';
								//codeMgr.orderByDesc(node.nodes);
							}
								
							node.expanded = true;
							return ;
						}
							
	
						return traverse(node.nodes, item, index);
					});
				}
			};
				
			while (arrayList.length > 0) {
				arrayList.some(function (item, index) {
					if (item.parent_loc_id === rootId) {
						return rootNodes.push(arrayList.splice(index, 1)[0]);
					}
						
					return traverse(rootNodes, item, index);
				});
			}
					
			return rootNodes;
        },
		//addMeshTask : function(assetsManager, modelName, assetName) {
		addMeshTask : function(assetsManager, objectInfo) {
			var modelName = objectInfo.model_name;
			var assetName = objectInfo.comp_name;
			
			//assetsManager.addMeshTask(`task ${modelName}`, "", `../../dist/models/${modelName}/`, `${modelName}.babylon`).onSuccess = function (task) {
			assetsManager.addMeshTask("task " + modelName, "", "../../dist/models/" + modelName + "/", modelName + ".babylon").onSuccess = function (task) {
				if(task.loadedMeshes.length > 1) {
					var meshGroupClone = []; //a collection for cloned meshes has to be created
					task.loadedMeshes.forEach(function(mesh, idx){
						if(mesh.isVisible === true) {
							if(mesh.name === modelName || mesh.id === modelName){
								meshGroupClone.push(mesh.clone("clone"));
							} else if(mesh.parent && mesh.parent instanceof BABYLON.Mesh && mesh.parent.name === modelName) {
								meshGroupClone.push(mesh.clone("clone"));
							}
						}
					});
					
					if(meshGroupClone.length > 1) {
						var tempSumMesh = BABYLON.Mesh.MergeMeshes(meshGroupClone, true, true); //merge all the meshes to one mesh
						task.loadedMeshes.forEach(function(mesh, idx){
							if(mesh.name === modelName || mesh.id === modelName){
								mesh.getBoundingInfo().boundingBox = tempSumMesh.getBoundingInfo().boundingBox;
							}
						});

						tempSumMesh.dispose();
					} else {
						for (var k = meshGroupClone.length; k > 0; k--) {
							meshGroupClone[k - 1].dispose();
						}
					}
					
				}
				//} else {
					task.loadedMeshes.forEach(function(mesh, idx){
						if(mesh.name === modelName || mesh.id === modelName){
							//mesh.id = assetName;
							//mesh.name = assetName;
							//mesh.exModelName = modelName;
							//mesh.isVisible = true;
							
							mesh.id = objectInfo.comp_name;
							mesh.name = objectInfo.comp_name;
							mesh.exModelName = objectInfo.model_name;
							//mesh.isVisible = objectInfo.is_visible;
							mesh.isVisible = true;
							mesh.position = new BABYLON.Vector3(objectInfo.position_x, objectInfo.position_y, objectInfo.position_z);
							mesh.rotation = new BABYLON.Vector3(objectInfo.rotation_x, objectInfo.rotation_y, objectInfo.rotation_z);
							mesh.scaling = new BABYLON.Vector3(objectInfo.scale_x, objectInfo.scale_y, objectInfo.scale_z);
							//mesh.visibility = objectInfo.opacity;
							//mesh.isPickable = objectInfo.is_pickable;
							mesh.isPickable = true;
							
							switch(modelName + "X") {
								case "building": //IT_Valley
									//mesh.position = new BABYLON.Vector3(-30, 136.55756518745494, 172);
									mesh.position = new BABYLON.Vector3(-30, 137, 172);
									break;
								case "building_02": //APART
									//mesh.position = new BABYLON.Vector3(488.93378099955606, 0, -397.04291048938245);
									mesh.position = new BABYLON.Vector3(489, 0, -397);
									break;
								case "building_03": //Effel_Tower
									//mesh.position = new BABYLON.Vector3(488.93378099955606, 0, -397.04291048938245);
									mesh.position = new BABYLON.Vector3(489, 71, 143);
									mesh.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(90), 0, 0);
									break;
								case "building_04": //AUDI_A8
									//mesh.position = new BABYLON.Vector3(488.93378099955606, 0, -397.04291048938245);
									mesh.position = new BABYLON.Vector3(361, -4, 313);
									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(180), 0);
									mesh.scaling = new BABYLON.Vector3(30, 30, 30);
									break;
								case "building_05": //NIKE_Air
									mesh.position = new BABYLON.Vector3(211, -2, 418);
									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(270), 0);
//									mesh.scaling = new BABYLON.Vector3(30, 30, 30);
									break;
								case "building_06": //Office_Man
									mesh.position = new BABYLON.Vector3(316, 0, 360);
									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(180), 0);
									mesh.scaling = new BABYLON.Vector3(.3, .3, .3);
									break;
								case "building_07": //Lamborghini
									mesh.position = new BABYLON.Vector3(441, 0, 320);
									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(90), 0);
									mesh.scaling = new BABYLON.Vector3(26, 26, 26);
									break;
								case "building_08": //MiniCooper
									mesh.position = new BABYLON.Vector3(706, 0, 159);
									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(270), 0);
									mesh.scaling = new BABYLON.Vector3(.3, .3, .3);
									break;
								case "building_09": //DodgeViperGts
									mesh.position = new BABYLON.Vector3(523, 0, 324);
									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(180), 0);
									mesh.scaling = new BABYLON.Vector3(7.7, 7.7, 7.7);
									break;
								case "building_10": //Hercules Airplane
									mesh.position = new BABYLON.Vector3(800, 0, 57);
//									mesh.rotation = new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(180), 0);
									mesh.scaling = new BABYLON.Vector3(12, 12, 12);
									break;
								case "plane":
									//mesh.id = "SITE_01";
									//mesh.name = "SITE_01";
									mesh.isPickable = false;
									//mesh.position = new BABYLON.Vector3(0, 136.55756518745494, 0);
									mesh.position = new BABYLON.Vector3(0, 135, 0);
									mesh.scaling = new BABYLON.Vector3(4, 1, 4);
									break;
							}
							
							switch(assetName + "X") {
//								case "OBJ_PLANE_02":
//									mesh.position = new BABYLON.Vector3(838, 137, 0);
//									break;
//								case "OBJ_PLANE_03":
//									mesh.position = new BABYLON.Vector3(0, 137, -838);
//									break;
//								case "OBJ_PLANE_04":
//									mesh.position = new BABYLON.Vector3(838, 137, -838);
//									break;
								case "NIKE_Air 02":
									mesh.position = new BABYLON.Vector3(195, -2, 418);
									break;
							}
							
						
							mesh.rotationQuaternion = undefined;
							
							if(mesh.isPickable === true && mesh.isVisible === true) {
//								that.elements.objectList[mesh.name] = {
//									"name" : assetName,
//									"model" : modelName,
//									"visible" : mesh.isVisible
//								};
//								that.elements.objectList[mesh.name] = objectInfo;
//								that.elements.objectList[mesh.name].name = assetName;
//								that.elements.objectList[mesh.name].model = modelName;
//								that.elements.objectList[mesh.name].visible = mesh.isVisible;
								
								var object = {};
								$.extend(object, objectInfo);
								object.name = assetName;
								object.model = modelName;
								object.visible = mesh.isVisible;
								that.elements.objectList.push(object);
								
								
//								var fireMaterial = new BABYLON.StandardMaterial("firemat", that.elements.scene);
//								var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, that.elements.scene);
//								fireTexture.level = 150;
//								fireTexture.fireColors = BABYLON.FireProceduralTexture.BlueFireColors;
//								fireMaterial.diffuseTexture = fireTexture;
//								// fireMaterial.opacityTexture = fireTexture;
//								mesh.material = fireMaterial;
//								
//								var godrays2 = new BABYLON.VolumetricLightScatteringPostProcess('godrays2', 1.0, that.elements.scene.activeCamera, mesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, that.elements.engine, false);
//								
//							    godrays2.exposure = 0.05;
//							    godrays2.decay = 0.96815;
//							    godrays2.weight = 0.98767;
//							    godrays2.density = 0.996;
//							
//								// set the godrays texture to be the image.
//								godrays2.mesh.material.diffuseTexture = fireTexture;

							}
						} else {
							if(mesh.parent && mesh.parent instanceof BABYLON.Mesh) {
								if(mesh.parent.name === assetName) {
									//mesh.isPickable = false;
									return;
								}
							}
							
							//mesh.isVisible = false;
							mesh.dispose();	
						}
					});
				//}
			};
		},
		
		selectObject : function(mesh, selectedOn3DView) {
			var editControl = that.elements.editControl;
			
			var positionText = that.elements.positionText;
			var rotationText = that.elements.rotationText;
			var scalingText = that.elements.scalingText;
			
			if(!mesh || (selectedOn3DView === false && !_.findWhere(that.elements.objectList, {name: mesh.name}))) {
				if(that.elements.editControl) {
					that.changeGizmoMode(GizmoMode.none);
					
					that.elements.scene.meshes.forEach(function(mesh, idx){
						mesh.showBoundingBox = false;
					});
				}
				
				$("#parameter_Name").val("");
				$("#parameter_Model").val("");
				$("#parameter_Type").val("");
				
				return;
			}
			
			if(mesh.parent && mesh.parent instanceof BABYLON.Mesh) {
				mesh = mesh.parent;
			}
			
//		    let hlLayer = new BABYLON.HighlightLayer("hl1", that.elements.scene);
//		    hlLayer.addMesh(mesh, new BABYLON.Color3(0, 1, 0));
//			hlLayer.blurVerticalSize = 0.1;
//			hlLayer.blurHorizontalSize = 0.1;
			
			if (!editControl) {
				editControl = new org.ssatguru.babylonjs.component.EditControl(mesh, that.elements.scene.activeCamera, that.elements.canvas, 0.75, true);
				// enable translation controls
				//editControl.enableTranslation();

				
				// set transalation sna value in meters
				//editControl.setTransSnapValue(0.5);
				editControl.setTransSnapValue(1);
				// set rotational snap value in radians
				//editControl.setRotSnapValue(3.14 / 18);
				//editControl.setRotSnapValue(0.1);
				editControl.setRotSnapValue(BABYLON.Tools.ToRadians(1));
				// set scale snap value in meters
				editControl.setScaleSnapValue(0.1);
				
				editControl.setTransSnap(false);
				editControl.setRotSnap(true);
				editControl.setScaleSnap(true);
				
				editControl.addActionListener(function(actionType){
					console.log("=================================================");
					console.log("editControl.addActionListener => " + actionType);
					
					if(!that.elements.selectedMesh) {
						return;
					}

					switch(actionType) {
						case 0: // ActionType.TRANS, Translation
							var positionText = that.elements.positionText;
							positionText.X = that.elements.selectedMesh.position.x;
							positionText.Y = that.elements.selectedMesh.position.y;
							positionText.Z = that.elements.selectedMesh.position.z;
							//console.log(`position: ${positionText.X}, ${positionText.Y}, ${positionText.Z}`);
							console.log("position: " + positionText.X + ", " + positionText.Y + ", " + positionText.Z);
							break;
						case 1: // ActioneType.ROT, Rotation
							var rotationText = that.elements.rotationText;
							var tempRot;
							tempRot = that.elements.selectedMesh.rotation.x;
							var rotX = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
							tempRot = that.elements.selectedMesh.rotation.y;
							var rotY = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
							tempRot = that.elements.selectedMesh.rotation.z;
							var rotZ = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
							
							rotX = BABYLON.Tools.ToDegrees(rotX) | 0;
							rotY = BABYLON.Tools.ToDegrees(rotY) | 0;
							rotZ = BABYLON.Tools.ToDegrees(rotZ) | 0;
							if(rotX >= 0 && rotY >= 0 && rotZ >= 0) {
								rotationText.X = (rotX >= 360) ? 0 : rotX;
								rotationText.Y = (rotY >= 360) ? 0 : rotY;
								rotationText.Z = (rotZ >= 360) ? 0 : rotZ;
								//console.log(`rotation: ${rotationText.X}, ${rotationText.Y}, ${rotationText.Z}`);
								//console.log(`rotation_: ${that.elements.selectedMesh.rotation.x}, ${that.elements.selectedMesh.rotation.y}, ${that.elements.selectedMesh.rotation.z}`);
								console.log("rotation: " + rotationText.X + ", " + rotationText.Y + ", " + rotationText.Z);
								console.log("rotation_: " + that.elements.selectedMesh.rotation.x + ", " + that.elements.selectedMesh.rotation.y + "}, " + that.elements.selectedMesh.rotation.z);
							}
							break;
						case 2: // ActioneType.SCALE, Scaling
							var scalingText = that.elements.scalingText;
							scalingText.X = that.elements.selectedMesh.scaling.x;
							scalingText.Y = that.elements.selectedMesh.scaling.y;
							scalingText.Z = that.elements.selectedMesh.scaling.z;
							//console.log(`scaling: ${scalingText.X}, ${scalingText.Y}, ${scalingText.Z}`);
							console.log("scaling: " + scalingText.X + ", " + scalingText.Y + ", " + scalingText.Z);
							break;
					}
				});
				
				that.elements.editControl = editControl;
				
				that.changeGizmoMode(that.elements.gizmoMode);
			}

			if(selectedOn3DView == true && editControl.isPointerOver() == true) {
				return;
			}
			
			that.elements.scene.meshes.forEach(function(mesh, idx){
				mesh.showBoundingBox = false;
			});
			
			mesh.showBoundingBox = true;
			
			that.changeGizmoMode(that.elements.gizmoMode);
			
			editControl.switchTo(mesh);
			that.elements.selectedMesh = mesh;
			
			if(selectedOn3DView == true) {
				w2ui.buildingEditorObjectsTree.expandParents(mesh.name);
				w2ui.buildingEditorObjectsTree.select(mesh.name);
				//w2ui['buildingEditorObjectsTree'].scrollIntoView();
				w2ui.buildingEditorObjectsTree.scrollIntoView();
			}
			
			//var selObj = that.elements.objectList[mesh.name];
			var selObj = _.findWhere(that.elements.objectList, {"name": mesh.name});
			
			$("#parameter_Name").val(selObj.name);
			$("#parameter_Model").val(selObj.model);
			$("#parameter_Type").val(selObj.code_name);
			$("#parameter_Visible").prop("checked", (mesh.isVisible === true) ? true : false);
			$("#parameter_Opacity").val(mesh.visibility);
			positionText.X = mesh.position.x;
			positionText.Y = mesh.position.y;
			positionText.Z = mesh.position.z;

			rotationText.X = BABYLON.Tools.ToDegrees((mesh.rotation.x >= 360) ? 0 : mesh.rotation.x);
			rotationText.Y = BABYLON.Tools.ToDegrees((mesh.rotation.y >= 360) ? 0 : mesh.rotation.y);
			rotationText.Z = BABYLON.Tools.ToDegrees((mesh.rotation.z >= 360) ? 0 : mesh.rotation.z);
			
			scalingText.X = mesh.scaling.x;
			scalingText.Y = mesh.scaling.y;
			scalingText.Z = mesh.scaling.z;
			
			console.log("=================================================");
			//console.log(`position: ${positionText.X}, ${positionText.Y}, ${positionText.Z}`);
			//console.log(`rotation: ${rotationText.X}, ${rotationText.Y}, ${rotationText.Z}`);
			//console.log(`scaling: ${scalingText.X}, ${scalingText.Y}, ${scalingText.Z}`);
			console.log("position: " + positionText.X + ", " + positionText.Y + ", " + positionText.Z);
			console.log("rotation: " + rotationText.X + ", " + rotationText.Y + ", " + rotationText.Z);
			console.log("scaling: " + scalingText.X + ", " + scalingText.Y + ", " + scalingText.Z);
		},
		
//		highlightMesh: function (mesh) {
//			var outline = mesh.clone();
//			var geometry = mesh.geometry.copy('outline_geo');
//			geometry.applyToMesh(outline);
//		
//			var redMaterial = new BABYLON.StandardMaterial('redMat', that.elements.scene);
//			redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
//			redMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
//		
//			outline.flipFaces(true);
//		
//			outline.scaling = new BABYLON.Vector3(1.05, 1.05, 1.05);
//			outline.material = redMaterial;
//			outline.visibility = mesh.visibility;
//		
//			outline.parent = mesh;
//			outline.position = BABYLON.Vector3.Zero();
//			outline.rotation = BABYLON.Vector3.Zero();
//		
//			mesh.customOutline = outline;
//		},
//		
//		clearAllHighlightedMeshes: function () {
//			for (var i = 0; i < this.selectedMeshes.length; i++) {
//				this.selectedMeshes[i].customOutline.dispose();
//			}
//		},
		
        /*
         * Page Destroy
         * */
        destroy: function() {
        	console.log('Building Editor destroy');
        	this.undelegateEvents();
        }
	})
	
	return Main;
});