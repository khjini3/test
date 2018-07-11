define([
	'jquery',
	'underscore',
	'editControl'
],function(
	$,
	_,
	EditControl
){
	var that;	

	var GIZMO_MODE = {
		NONE: 0,
		POSITION: 1,
		ROTATION: 2,
		SCALING: 3
	};
	
	var LOCATION_TYPE = {
		SITE: 'SITE',
		BUILDING: 'BUILDING',
		FLOOR: 'FLOOR',
		ROOM: 'ROOM'
	};
	
	var EVENT_TYPE = {
		SELECT_OBJECT: 100,
		DELETE_OBJECT: 101,
		LOAD_MESH_FINISH: 102,
		ADD_MESH_FINISH: 103,
		CHANGE_TRANSFORMS: 104,
		SWITCH_GIZMO: 105
	};
	
	function EditorSceneManager(canvas, callback) {
		/**
		 * babylon elements
		 */
		this.canvas = canvas;
		this.engine = null;
		this.scene = null;
		this.assetsManager = null;
		this.advancedTexture = null;
		
		/**
		 * etc elements
		 */
		this.currentLocation = null;
		this.selectedMesh = null;
		this.objectList = [];
		this.editControl = null;
		this.currentGizmoMode = GIZMO_MODE.NONE;
		this.isLoadMeshes = false;
		this.editorOptions = null;
		
		this.callback = callback;
		
		this.init();
	}
	EditorSceneManager.prototype = {
		init: function() {
			that = this;
			
			that.engine = new BABYLON.Engine(that.canvas, true, { stencil: true });
		},
		createScene: function(editorOptions) {
			that.editorOptions = editorOptions;
			that.isLoadMeshes = false;

			that.disposeEditControl();
			that.disposeScene();
			
			that.currentLocation = null;
			that.selectedMesh = null;
			that.objectList = [];
			that.editControl = null;
			
			that.engine.loadingUIBackgroundColor = "#041128ba";
			
			that.scene = new BABYLON.Scene(that.engine);
			that.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
			
			var bbr = that.scene.getBoundingBoxRenderer(); 
			bbr.showBackLines = false;
			bbr.frontColor = new BABYLON.Color3(0.53, 0.99, 0);

			//camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 1.23, 1.38, 1409.66, new BABYLON.Vector3(0, 140.0641, 200), that.scene);
			//camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0, 0, 1000, new BABYLON.Vector3(0, 0, 0), that.scene);
			var camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', -1.5767650717612351, 1.1717862463007935, 500, new BABYLON.Vector3(0, 0, 0), that.scene);
			camera.setTarget(BABYLON.Vector3.Zero());
			camera.lowerRadiusLimit = 1;
			camera.upperRadiusLimit = 2000;
			camera.wheelPrecision = 1;
			var useCtrlForPanning = true;
			camera.attachControl(that.canvas, false, useCtrlForPanning);
			camera.panningSensibility = 10; // default => 50
			
			var light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), that.scene);
			//light1.intensity = .8;
			
			var light2 = new BABYLON.PointLight('Omni', new BABYLON.Vector3(20, 20, 100), that.scene);
			light2.intensity = 0.8;
			
			that.scene.registerBeforeRender(function () {
				light2.position = that.scene.activeCamera.position;
			});
			
			that.createGridHelper();
			that.createSkybox();
			
			that.showGridHelper(that.editorOptions.isShowGrid);
			
			if(BABYLON.GUI !== undefined) {
				that.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
//				
//			    var panel3 = new BABYLON.GUI.StackPanel();
//			    panel3.width = "220px";
//			    panel3.fontSize = "14px";
//			    panel3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//			    panel3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//			    that.advancedTexture.addControl(panel3);
//				
//				var slider = new BABYLON.GUI.Slider();
//				slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
//				slider.minimum = 0;
//				slider.maximum = 2 * Math.PI;
//				slider.color = "green";
//				slider.value = 0;
//				slider.height = "20px";
//				slider.width = "200px";
//				panel3.addControl(slider);
			}
			
			that.engine.runRenderLoop(function() {
				if(!that.scene) {
					return;
				}
				
				that.scene.render();
				
				var fpsLabel = document.getElementById('idcEditor_FpsLabel');
				if(fpsLabel) {
					fpsLabel.innerHTML = that.engine.getFps().toFixed() + ' fps';
				}
			});
			
			setTimeout(function() {
				that.engine.resize();
			}, 10);
		},
		disposeScene: function() {
			if (that.engine) {
				that.engine.stopRenderLoop();
			}
			
			if (that.engine && that.engine.scenes.length !== 0) {
				// if more than 1 scene,
				while (that.engine.scenes.length > 0) {
					that.engine.scenes[0].dispose();
				}
			}
		},
		getEngine: function() {
			return that.engine;
		},
		getScene: function() {
			return that.scene;
		},
		getSelectedMesh: function() {
			return that.selectedMesh;
		},
		getObjectList: function() {
			return that.objectList;
		},
		setSelectedMeshValue: function(propName, propSubName, value) {
			if(!that.selectedMesh) {
				return;
			}
			
			if(that.selectedMesh[propName] === undefined || that.selectedMesh[propName][propSubName] === undefined) {
				return;
			}
			
			that.selectedMesh[propName][propSubName] = value;
		},
		resizeEngine: function() {
			if(that.engine) {
				that.engine.resize();
			}
		},
		disposeEditControl: function() {
			if(that.editControl) {
				that.editControl.detach();
				that.editControl.removeActionListener();
			}
			that.editControl = null;
		},
		createGridHelper: function() {
			var gridHelper = BABYLON.MeshBuilder.CreateGround('gridHelper', {
				width: 9000,
				height: 90000
			}, that.scene);
			gridHelper.position.y = 0;
			
			var groundMaterial = new BABYLON.GridMaterial('gridHelperMaterial', that.scene);
			groundMaterial.majorUnitFrequency = 5;
			groundMaterial.minorUnitVisibility = 0.45;
			groundMaterial.gridRatio = 20;
			groundMaterial.backFaceCulling = false;
			groundMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
			groundMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);
			groundMaterial.opacity = 0.98;
			gridHelper.material = groundMaterial;
			gridHelper.isPickable = false;
			gridHelper.isVisible = false;
		},
		createSkybox: function() {
			return;
			var skybox = BABYLON.Mesh.CreateSphere('skyBox', 16, 5000, that.scene);
			var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', that.scene);
			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../../dist/img/idc/texture/TropicalSunnyDay', that.scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.disableLighting = true;
			skybox.material = skyboxMaterial;
			skybox.isPickable = false;
			skybox.isVisible = false;
		},
		loadMeshes: function(model, currentLocation) {
			that.currentLocation = currentLocation;
			
			that.isLoadMeshes = false;
			
			that.assetsManager = new BABYLON.AssetsManager(that.scene);
			
			model.forEach(function(item,idx) {
				that.addMeshTask(that.assetsManager, item);
			});
			
			that.assetsManager.onFinish = function (tasks) {
				that.isLoadMeshes = true;
				
				that.objectList = _.sortBy(that.objectList, function (i) { return i.comp_name.toLowerCase(); });
				
				if(that.currentLocation.code_name == LOCATION_TYPE.SITE) {
					that.showSkyBox(true);
				} else {
					that.showSkyBox(false);
				}
				
				that.scene.meshes.forEach(function(mesh, idx) {
					mesh.actionManager = new BABYLON.ActionManager(that.scene);
					
					mesh.actionManager.registerAction(
						new BABYLON.ExecuteCodeAction(
							BABYLON.ActionManager.OnLeftPickTrigger,  
							function (event) {
								if (event.source instanceof BABYLON.Mesh) {
									that.selectObject(event.source, true);
								}
							}
						)
					);
					
					if(BABYLON.ActionManager.OnDoublePickTrigger !== undefined) {
						mesh.actionManager.registerAction(
							new BABYLON.ExecuteCodeAction(
								BABYLON.ActionManager.OnDoublePickTrigger,  
								function (event) {
									if (event.source instanceof BABYLON.Mesh) {
										that.selectObject(event.source, true);
										that.focusOnObject();
									}
								}
							)
						);
					}
				});
				
				that.updateCameraLimit();
				
				that.fireCallback({type: EVENT_TYPE.LOAD_MESH_FINISH});
				
				setTimeout(function() {
					that.showWireframe(that.editorOptions.isShowWireframe);
					that.showBoundingBoxes(that.editorOptions.isShowBoundingBoxes);
					that.setLocalAxesMode(that.editorOptions.isLocalAxes);
					that.showNames(that.editorOptions.isShowNames);
					
					
					var locationMesh = that.scene.getMeshByName(that.currentLocation.loc_name);
					if(that.currentLocation.code_name != LOCATION_TYPE.SITE && that.currentLocation.code_name != LOCATION_TYPE.ROOM ) {
						locationMesh.visibility = 0.1;
					}
					locationMesh.isPickable = false;
					
//					/**
//					 * calculate camera upperRadiusLimit
//					 */
//					var bBox = locationMesh.getBoundingInfo().boundingBox;
//					var maxNum = Math.abs(bBox.maximumWorld.x - bBox.minimumWorld.x);
//					var tempNum = Math.abs(bBox.maximumWorld.y - bBox.minimumWorld.y);
//					maxNum = (tempNum > maxNum) ? tempNum : maxNum;
//					tempNum = Math.abs(bBox.maximumWorld.z - bBox.minimumWorld.z);
//					maxNum = (tempNum > maxNum) ? tempNum : maxNum;
//					maxNum += 200;
//					maxNum = maxNum | 0;
//					
//					//that.scene.activeCamera.upperRadiusLimit = (maxNum > 1000) ? maxNum : 1000;
//					that.scene.activeCamera.upperRadiusLimit = maxNum;
					
					/**
					 * set camera info from DB
					 */
					var locationObj = _.findWhere(that.objectList, {'comp_id': that.currentLocation.loc_id + ''});
					if(locationObj && locationObj.camera && locationObj.camera.length > 0) {
						try {
							var camera = JSON.parse(locationObj.camera);
							that.scene.activeCamera.position.x = camera.position.x;
							that.scene.activeCamera.position.y = camera.position.y;
							that.scene.activeCamera.position.z = camera.position.z;
							that.scene.activeCamera.target.x = camera.target.x;
							that.scene.activeCamera.target.y = camera.target.y;
							that.scene.activeCamera.target.z = camera.target.z;
							that.scene.activeCamera.alpha = camera.alpha;
							that.scene.activeCamera.beta = camera.beta;
							that.scene.activeCamera.radius = camera.radius;
							//that.scene.activeCamera.upperRadiusLimit = (camera.upperRadiusLimit !== undefined) ? camera.upperRadiusLimit : camera.radius * 1.2;
						} catch(e) {
							console.log(e);
						}
					} else {
						that.focusOnObject(locationMesh);
						//that.scene.activeCamera.upperRadiusLimit = that.scene.activeCamera.radius * 1.5;
					}
				}, 10);
			};
			
			that.assetsManager.load();
		},
		addMeshTask: function(assetsManager, objectInfo) {
			var modelName = objectInfo.model_name;
			var assetName = objectInfo.comp_name;
			
			//assetsManager.addMeshTask(`task ${modelName}`, '', `../../dist/models/${modelName}/`, `${modelName}.babylon`).onSuccess = function (task) {
			assetsManager.addMeshTask('task ' + modelName, '', '../../dist/models/' + modelName + '/', modelName + '.babylon').onSuccess = function (task) {
				if(task.loadedMeshes.length > 1) {
					var meshGroupClone = []; //a collection for cloned meshes has to be created
					task.loadedMeshes.forEach(function(mesh, idx) {
						if(mesh.isVisible === true) {
							if(mesh.name === modelName || mesh.id === modelName) {
								meshGroupClone.push(mesh.clone('clone'));
							} else if(mesh.parent && mesh.parent instanceof BABYLON.Mesh && mesh.parent.name === modelName) {
								meshGroupClone.push(mesh.clone('clone'));
							}
						}
					});
					
					if(meshGroupClone.length > 1) {
						var tempSumMesh = BABYLON.Mesh.MergeMeshes(meshGroupClone, true, true); //merge all the meshes to one mesh
						task.loadedMeshes.forEach(function(mesh, idx) {
							if(mesh.name === modelName || mesh.id === modelName) {
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
				
				task.loadedMeshes.forEach(function(mesh, idx) {
					if(mesh.name === modelName || mesh.id === modelName) {
						mesh.id = objectInfo.comp_name;
						mesh.name = objectInfo.comp_name;
						mesh.IDCEDITOR_is_pickable = objectInfo.is_pickable;
						mesh.IDCEDITOR_is_tooltip = objectInfo.is_tooltip;
						//mesh.isVisible = objectInfo.is_visible;
						mesh.isVisible = true;
						
						var isInitializedScaling = true;
						if(objectInfo.scale_x == -1 && objectInfo.scale_y == -1 && objectInfo.scale_z == -1) {
							isInitializedScaling = false;
						}
						
						mesh.position = new BABYLON.Vector3(objectInfo.position_x, objectInfo.position_y, objectInfo.position_z);
						mesh.rotation = new BABYLON.Vector3(objectInfo.rotation_x, objectInfo.rotation_y, objectInfo.rotation_z);
						if(objectInfo.objectState !== 'INSERT' && isInitializedScaling == true) {
							mesh.scaling = new BABYLON.Vector3(objectInfo.scale_x, objectInfo.scale_y, objectInfo.scale_z);
						}
						//mesh.visibility = objectInfo.opacity;
						//mesh.isPickable = objectInfo.is_pickable;
						mesh.isPickable = true;
						
						mesh.rotationQuaternion = undefined;
						
						if(mesh.isPickable === true && mesh.isVisible === true) {
							var object = {};
							$.extend(object, objectInfo);
							object.name = assetName;
							object.model = modelName;
							object.visible = mesh.isVisible;
							
							var filteredModel = _.filter(that.objectList, function(item) {
								return (item.comp_name == objectInfo.comp_name) ? false : true;
							});
							that.objectList = filteredModel;
							
							that.objectList.push(object);
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
			};
		},
		updateCameraLimit: function() {
			return;
			
			var maxNum = 0;
			var tempNum = 0;
			var maxWidth = 0;
			var maxHeight = 0;
			var maxDepth = 0;
			
			that.objectList.forEach(function(objectInfo, idx){
				var mesh = that.scene.getMeshByName(objectInfo.name);
				if(!mesh) {
					return;
				}
				
				/**
				 * calculate camera upperRadiusLimit
				 */
//				var bBox = mesh.getBoundingInfo().boundingBox;
//				tempNum = Math.abs(bBox.maximumWorld.x - bBox.minimumWorld.x) + 200;
//				maxNum = (tempNum > maxNum) ? tempNum : maxNum;
//				tempNum = Math.abs(bBox.maximumWorld.y - bBox.minimumWorld.y) + 400;
//				maxNum = (tempNum > maxNum) ? tempNum : maxNum;
//				tempNum = Math.abs(bBox.maximumWorld.z - bBox.minimumWorld.z);
//				maxNum = (tempNum > maxNum) ? tempNum : maxNum;

				
//				var meshSize = mesh.getBoundingInfo().boundingBox.extendSize;
//				
//				var meshWidth = meshSize.x * 2;
//				var meshHeight = meshSize.y * 2;
//				var meshDepth = meshSize.z;
//
//				var resultWidthHeight = (meshWidth < meshHeight) ? meshHeight : meshWidth;
//
//				var meshRadius = 21.7/13.75 * resultWidthHeight+meshDepth+2;
//				
//				maxNum = (meshRadius > maxNum) ? meshRadius : maxNum;
				
				
//				var bBox = mesh.getBoundingInfo().boundingBox;
//				var minX = Math.abs(bBox.minimumWorld.x);
//				var maxX = Math.abs(bBox.maximumWorld.x);
//				var meshWidth = (minX > maxX) ? minX : maxX;
//				
//				var minY = Math.abs(bBox.minimumWorld.y);
//				var maxY = Math.abs(bBox.maximumWorld.y);
//				var meshHeight = ((minY > maxY) ? minY : maxY) * 1.7;
//				
//				var minZ = Math.abs(bBox.minimumWorld.z);
//				var maxZ = Math.abs(bBox.maximumWorld.z);
//				var meshDepth = ((minZ > maxZ) ? minZ : maxZ);
//				
//				var resultWidthHeight = (meshWidth > meshHeight) ? meshWidth : meshHeight;
//				
//				var meshRadius = (21.7/13.75 * resultWidthHeight) + meshDepth + 2;
//				
//				maxNum = (meshRadius > maxNum) ? meshRadius : maxNum;
				
				
				var bBox = mesh.getBoundingInfo().boundingBox;
				var meshWidth = Math.abs(bBox.maximumWorld.x - bBox.minimumWorld.x);
				var meshHeight = Math.abs(bBox.maximumWorld.y - bBox.minimumWorld.y);
				var meshDepth = Math.abs(bBox.maximumWorld.z - bBox.minimumWorld.z);
				
				maxWidth = (meshWidth > maxWidth) ? meshWidth : maxWidth;
				maxHeight = (meshHeight > maxHeight) ? meshHeight : maxHeight;
				maxDepth = (meshDepth > maxDepth) ? meshDepth : maxDepth;
//				
//				var resultWidthHeight = (meshWidth > meshHeight) ? meshWidth : meshHeight;
//				//resultWidthHeight = resultWidthHeight * 1.5;
//				
//				//var meshRadius = resultWidthHeight + meshDepth + 2;
//				var meshRadius = (meshDepth > resultWidthHeight) ? meshDepth : resultWidthHeight;
//				//meshRadius *= 1.7;
//				
//				maxNum = (meshRadius > maxNum) ? meshRadius : maxNum;
				
				
				maxNum = (maxWidth > maxNum) ? maxWidth : maxNum;
				maxNum = (maxHeight > maxNum) ? maxHeight : maxNum;
				maxNum = (maxDepth > maxNum) ? maxDepth : maxNum;
			});
			
			console.log('maxWidth: ' + maxWidth);
			console.log('maxHeight: ' + maxHeight);
			console.log('maxDepth: ' + maxDepth);
			
			//maxNum = (maxNum * (50/42)) + 50;
			maxNum = maxNum * 1.30;
			
			maxNum = maxNum | 0;
			
			console.log('maxNum: ' + maxNum);
			
			that.scene.activeCamera.upperRadiusLimit = (maxNum > 10000) ? 1000 : maxNum;
		},
		fireCallback: function(obj) {
			if(that.callback) {
				that.callback(obj);
			}
		},
		selectObject: function(mesh, selectedOn3DView) {
			if(typeof mesh === 'string') {
				mesh = that.scene.getMeshByName(mesh);
			}
			
			var positionText = that.positionText;
			var rotationText = that.rotationText;
			var scalingText = that.scalingText;
			
			if(!mesh || (selectedOn3DView === false && !_.findWhere(that.objectList, {name: mesh.name}))) {
				if(that.editControl) {
					that.changeGizmoMode(GIZMO_MODE.NONE);
					
					that.scene.meshes.forEach(function(mesh, idx) {
						mesh.showBoundingBox = false;
					});
				}
				
				that.selectedMesh = null;
			
				that.fireCallback({type: EVENT_TYPE.SELECT_OBJECT, selectedOn3DView: selectedOn3DView, result: false});
				
				return;
			}
			
			if(mesh.parent && mesh.parent instanceof BABYLON.Mesh) {
				mesh = mesh.parent;
			}
			
			if (!that.editControl) {
				that.editControl = new org.ssatguru.babylonjs.component.EditControl(mesh, that.scene.activeCamera, that.canvas, 0.75, true);
				// enable translation controls
				//editControl.enableTranslation();
	
				
				// set transalation sna value in meters
				//editControl.setTransSnapValue(0.5);
				that.editControl.setTransSnapValue(1);
				// set rotational snap value in radians
				//editControl.setRotSnapValue(3.14 / 18);
				//editControl.setRotSnapValue(0.1);
				that.editControl.setRotSnapValue(BABYLON.Tools.ToRadians(1));
				// set scale snap value in meters
				that.editControl.setScaleSnapValue(0.1);
				
				that.editControl.setTransSnap(false);
				that.editControl.setRotSnap(true);
				that.editControl.setScaleSnap(true);
				
				that.editControl.addActionListener(function(actionType) {
					if(!that.selectedMesh) {
						return;
					}
	
					switch(actionType) {
						case 0: // ActionType.TRANS, Translation
							that.fireCallback({type: EVENT_TYPE.CHANGE_TRANSFORMS, propName: 'position'});
							break;
						case 1: // ActioneType.ROT, Rotation
							that.fireCallback({type: EVENT_TYPE.CHANGE_TRANSFORMS, propName: 'rotation'});
							break;
						case 2: // ActioneType.SCALE, Scaling
							that.fireCallback({type: EVENT_TYPE.CHANGE_TRANSFORMS, propName: 'scaling'});
							break;
					}
				});
				
				that.changeGizmoMode(that.currentGizmoMode);
			}
	
			if(selectedOn3DView == true && that.editControl.isPointerOver() == true) {
				return;
			}
			
			that.scene.meshes.forEach(function(mesh, idx) {
				mesh.showBoundingBox = false;
			});
			
			mesh.showBoundingBox = true;
			
			that.editControl.switchTo(mesh);
			that.selectedMesh = mesh;
			
			that.changeGizmoMode(that.currentGizmoMode);
			
			that.fireCallback({type: EVENT_TYPE.SELECT_OBJECT, selectedOn3DView: selectedOn3DView});
		},
		addObject: function(newObjectList) {
			if(!newObjectList) {
				return;
			}
			
			
			//that.loadMeshes(newObjectList, that.currentLocation);
			
			that.assetsManager = new BABYLON.AssetsManager(that.scene);
			newObjectList.forEach(function(item,idx) {
				that.addMeshTask(that.assetsManager, item);
			});
			
			that.assetsManager.onFinish = function (tasks) {
				that.objectList = _.sortBy(that.objectList, function (i) { return i.comp_name.toLowerCase(); });
				
				var reviseX = 0;
				var reviseY = 0;
				var reviseZ = 0;
				
				var locationMesh = that.scene.getMeshByName(that.currentLocation.loc_name);
				if(locationMesh) {
					var bBox = locationMesh.getBoundingInfo().boundingBox;
					reviseX = bBox.center.x;
					reviseY = bBox.center.y;
					reviseZ = bBox.center.z;
				}
				
				that.scene.meshes.forEach(function(mesh, idx) {
					var findObj = _.findWhere(newObjectList, {'comp_name': mesh.name});
					if(!findObj) {
						return;
					}
					
					mesh.position.x = reviseX;
					mesh.position.y = reviseY;
					mesh.position.z = reviseZ;
					
					mesh.actionManager = new BABYLON.ActionManager(that.scene);
					
					mesh.actionManager.registerAction(
						new BABYLON.ExecuteCodeAction(
							BABYLON.ActionManager.OnLeftPickTrigger,  
							function (event) {
								if (event.source instanceof BABYLON.Mesh) {
									that.selectObject(event.source, true);
								}
							}
						)
					);
				});
				
				that.updateCameraLimit();
				
				that.fireCallback({type: EVENT_TYPE.ADD_MESH_FINISH, value: newObjectList});
				
//				setTimeout(function() {
//					that.showWireframe(that.editorOptions.isShowWireframe);
//					that.showBoundingBoxes(that.editorOptions.isShowBoundingBoxes);
//					that.setLocalAxesMode(that.editorOptions.isLocalAxes);
//					that.showNames(that.editorOptions.isShowNames);
//				}, 10);
			}
			
			that.assetsManager.load();
		},
		deleteObject: function(objectInfo) {
			var mesh = that.scene.getMeshByName(objectInfo.comp_name);
			if(mesh) {
				that.scene.getMeshByName(objectInfo.comp_name).dispose();
				
				that.changeGizmoMode(GIZMO_MODE.NONE);
				
				if(that.selectedMesh && that.selectedMesh.name == objectInfo.comp_name) {
					that.selectedMesh = null;
				}
				
				if(objectInfo.objectState === 'INSERT') {
					var filteredObjectList = _.filter(that.objectList, function(item) {
						return (item.comp_name === objectInfo.comp_name) ? false : true;
					});
					that.objectList = filteredObjectList;
				} else {
					objectInfo.objectState = 'DELETE';
				}
				
				that.updateCameraLimit();
				
				that.fireCallback({type: EVENT_TYPE.DELETE_OBJECT, value: objectInfo.comp_name});
			}
		},
		saveScene: function() {
			var saveObjectList = [];
			that.objectList.forEach(function(objectInfo, idx) {
				
				if(objectInfo.objectState == 'DELETE') {
					var newObjectInfo = $.extend(true, {}, objectInfo);
					saveObjectList.push(newObjectInfo);
					return;
				}
				
				var mesh = that.scene.getMeshByName(objectInfo.name);
				if(!mesh) {
					return;
				}
				
				if(that.currentLocation.loc_id == objectInfo.comp_id) {
					if(that.editorOptions.isSaveViewPoint !== true && that.isChangedMeshInfo(mesh, objectInfo) !== true) {
						return;
					}
				} else {
					if(that.isChangedMeshInfo(mesh, objectInfo) !== true) {
						return;
					}
				}
				
				var newObjectInfo = $.extend(true, {}, objectInfo);
				that.copyObjectInfoFromMesh(newObjectInfo, mesh);
				//newObjectInfo.objectState = 'UPDATE'; // INSERT, UPDATE, DELETE
				
				var cameraInfo = {
					'position':{
						'x':that.scene.activeCamera.position.x,
						'y':that.scene.activeCamera.position.y,
						'z':that.scene.activeCamera.position.z
					},
					'target':{
						'x':that.scene.activeCamera.target.x,
						'y':that.scene.activeCamera.target.y,
						'z':that.scene.activeCamera.target.z
					},
					'alpha':that.scene.activeCamera.alpha,
					'beta':that.scene.activeCamera.beta,
					'radius':that.scene.activeCamera.radius,
					'lowerRadiusLimit':1,
					'upperRadiusLimit':that.scene.activeCamera.radius * 1.5,
					'wheelPrecision':1
				}
				newObjectInfo.camera = JSON.stringify(cameraInfo);
				that.currentLocation.camerea = newObjectInfo.camera;
				
				saveObjectList.push(newObjectInfo);
			});
			console.log('saveObjectList =>');
			console.log(saveObjectList);
			
			if(saveObjectList.length == 0) {
				w2alert('There is no change.', 'Information')
				.ok(function () {
					//console.log('ok');
				});
			} else {
				Backbone.ajax({
					dataType: 'json',
					contentType: 'application/json',
					url: 'editor/object',
					method: 'put',
					data: JSON.stringify(saveObjectList),
					success: function(val) {
						if(val && val.result == true) {
							var filteredObjectList = _.filter(that.objectList, function(item) {
								return (item.objectState === 'DELETE') ? false : true;
							});
							that.objectList = filteredObjectList;
							
							saveObjectList.forEach(function(objectInfo, idx) {
								var targetObjectInfo = _.findWhere(that.objectList, {name: objectInfo.name})
								if(targetObjectInfo) {
									targetObjectInfo.objectState = null;
									that.copyObjectInfo(targetObjectInfo, objectInfo);
								}
							});
							
							w2alert('Saved successfully.', 'Result')
							.ok(function () { });
						} else {
							w2alert('Faild' + (val && val.reason.length>0) ? ' : ' + val.reason : '')
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
		isChangedMeshInfo: function(mesh, objectInfo) {
			if(mesh.position.x != objectInfo.position_x)
				return true;
			
			if(mesh.position.y != objectInfo.position_y)
				return true;
			
			if(mesh.position.z != objectInfo.position_z)
				return true;
			
			if(mesh.rotation.x != objectInfo.rotation_x)
				return true;
			
			if(mesh.rotation.y != objectInfo.rotation_y)
				return true;
			
			if(mesh.rotation.z != objectInfo.rotation_z)
				return true;
			
			if(mesh.scaling.x != objectInfo.scale_x)
				return true;
			
			if(mesh.scaling.y != objectInfo.scale_y)
				return true;
			
			if(mesh.scaling.z != objectInfo.scale_z)
				return true;
			
			if(mesh.IDCEDITOR_is_pickable != objectInfo.is_pickable)
				return true;
			
			if(mesh.IDCEDITOR_is_tooltip != objectInfo.is_tooltip)
				return true;
			
			return false;
		},
		copyObjectInfoFromMesh: function(objectInfo, mesh) {
			if(!objectInfo || !mesh) {
				return;
			}
			
			objectInfo.position_x = mesh.position.x;
			objectInfo.position_y = mesh.position.y;
			objectInfo.position_z = mesh.position.z;
			objectInfo.rotation_x = mesh.rotation.x;
			objectInfo.rotation_y = mesh.rotation.y;
			objectInfo.rotation_z = mesh.rotation.z;
			objectInfo.scale_x = mesh.scaling.x;
			objectInfo.scale_y = mesh.scaling.y;
			objectInfo.scale_z = mesh.scaling.z;
			objectInfo.is_pickable = mesh.IDCEDITOR_is_pickable;
			objectInfo.is_tooltip = mesh.IDCEDITOR_is_tooltip;
		},
		copyObjectInfo: function(objectInfoDest, objectInfoSrc) {
			if(!objectInfoDest || !objectInfoSrc) {
				return;
			}
			
			objectInfoDest.position_x = objectInfoSrc.position_x;
			objectInfoDest.position_y = objectInfoSrc.position_y;
			objectInfoDest.position_z = objectInfoSrc.position_z;
			objectInfoDest.rotation_x = objectInfoSrc.rotation_x;
			objectInfoDest.rotation_y = objectInfoSrc.rotation_y;
			objectInfoDest.rotation_z = objectInfoSrc.rotation_z;
			objectInfoDest.scale_x = objectInfoSrc.scale_x;
			objectInfoDest.scale_y = objectInfoSrc.scale_y;
			objectInfoDest.scale_x = objectInfoSrc.scale_x;
			objectInfoDest.is_pickable = objectInfoSrc.is_pickable;
			objectInfoDest.is_tooltip = objectInfoSrc.is_tooltip;
		},
		changeGizmoModeToNone: function() {
			that.changeGizmoMode(GIZMO_MODE.NONE);
		},
		changeGizmoModeToPosition: function() {
			that.changeGizmoMode(GIZMO_MODE.POSITION);
		},
		changeGizmoModeToRotation: function() {
			that.changeGizmoMode(GIZMO_MODE.ROTATION);
		},
		changeGizmoModeToScaling: function() {
			that.changeGizmoMode(GIZMO_MODE.SCALING);
		},
		changeGizmoMode: function(gizmoMode) {
			if(!that.editControl || !that.selectedMesh) {
				return;
			}
			
			that.editControl.switchTo(that.selectedMesh);
			
			switch(gizmoMode) {
				case GIZMO_MODE.POSITION:
					that.currentGizmoMode = GIZMO_MODE.POSITION;
					
					if(that.editControl.isTranslationEnabled() === false) {
						that.editControl.enableTranslation();
					}
					that.editControl.xaxis.visibility = 1;
					that.editControl.yaxis.visibility = 1;
					that.editControl.zaxis.visibility = 1;
					
					that.fireCallback({type: EVENT_TYPE.SWITCH_GIZMO, value: 'position'});
					break;
				case GIZMO_MODE.ROTATION:
					that.currentGizmoMode = GIZMO_MODE.ROTATION;
					
					if(that.editControl.isRotationEnabled() === false) {
						that.editControl.enableRotation();
					}
					that.editControl.xaxis.visibility = 1;
					that.editControl.yaxis.visibility = 1;
					that.editControl.zaxis.visibility = 1;
					
					that.fireCallback({type: EVENT_TYPE.SWITCH_GIZMO, value: 'rotation'});
					break;
				case GIZMO_MODE.SCALING:
					that.currentGizmoMode = GIZMO_MODE.SCALING;
					
					if(that.editControl.isScalingEnabled() === false) {
						that.editControl.enableScaling();
					}
					that.editControl.xaxis.visibility = 1;
					that.editControl.yaxis.visibility = 1;
					that.editControl.zaxis.visibility = 1;
					
					that.fireCallback({type: EVENT_TYPE.SWITCH_GIZMO, value: 'scaling'});
					break;
				case GIZMO_MODE.NONE:
				default:
					that.currentGizmoMode = GIZMO_MODE.NONE;
				
					that.editControl.disableTranslation();
					that.editControl.disableRotation();
					that.editControl.disableScaling();
					that.editControl.xaxis.visibility = 0;
					that.editControl.yaxis.visibility = 0;
					that.editControl.zaxis.visibility = 0;
					that.fireCallback({type: EVENT_TYPE.SWITCH_GIZMO, value: 'none'});
					break;
			}
		},
		gizmoSwitchToPosition: function() {
			that.changeGizmoMode(GIZMO_MODE.POSITION);
		},
		gizmoSwitchToRotation: function() {
			that.changeGizmoMode(GIZMO_MODE.ROTATION);
		},
		gizmoSwitchToScaling: function() {
			that.changeGizmoMode(GIZMO_MODE.SCALING);
		},
		gizmoSwitchToNone: function() {
			that.changeGizmoMode(GIZMO_MODE.NONE);
		},
		focusOnObject: function(mesh) {
			var targetMesh = (mesh) ? mesh : that.selectedMesh;
			
			if(!targetMesh) {
				return;
			}
			
			that.scene.activeCamera.target.copyFrom(targetMesh.position);
			that.scene.activeCamera.zoomOnFactor = (that.currentLocation.loc_name == targetMesh.name) ? 1 : 1.3;
			that.scene.activeCamera.zoomOn([targetMesh], true);
		},
		createLabel: function(mesh) {
			if(!mesh || !that.advancedTexture) {
				return;
			}
			
			var rect1 = new BABYLON.GUI.Rectangle();
			rect1.width = 4 + 10 * mesh.name.length + 'px';
			rect1.height = '22px';
			rect1.cornerRadius = 5;
			rect1.thickness = 1;
			rect1.background = 'rgba(0,0,0,0.4)';
			rect1.color = 'black';
			that.advancedTexture.addControl(rect1);
			
			var label = new BABYLON.GUI.TextBlock();
			label.text = mesh.name;
			label.fontSize = 12;
			rect1.addControl(label);
			
			rect1.linkWithMesh(mesh);
		},
		removeLabel: function(mesh) {
			if(!mesh || !that.advancedTexture) {
				return;
			}
			
			//for (var g of that.advancedTexture._rootContainer.children) {
			that.advancedTexture._rootContainer.children.forEach(function(g, idx) {
				var ed = g._linkedMesh;
				if (ed === mesh) {
					that.advancedTexture.removeControl(g);
					//break;
				}
			});
		},
		showSkyBox: function(isShow) {
			try {
				that.scene.getMeshByName('skyBox').isVisible = isShow;
			} catch(e) {
			}
		},
		showGridHelper: function(isShow) {
			that.editorOptions.isShowGrid = isShow;
			try {
				that.scene.getMeshByName('gridHelper').isVisible = isShow;
			} catch(e) {
			}
		},
		showWireframe: function(isShow) {
			that.editorOptions.isShowWireframe = isShow;
			that.scene.forceWireframe = isShow;
		},
		showBoundingBoxes: function(isShow) {
			that.editorOptions.isShowBoundingBoxes = isShow;
			try {
				that.scene.forceShowBoundingBoxes = isShow;
			} catch(e) {
			}
		},
		setLocalAxesMode: function(isEnable) {
			that.editorOptions.isLocalAxes = isEnable;
			
			if(!that.editControl) {
				return;
			}
			
			that.editControl.setLocal(isEnable);
		},
		showNames: function(isShow) {
			that.editorOptions.isShowNames = isShow;
			
			if(isShow === true) {
				that.objectList.forEach(function(objectInfo, idx) {
					if(that.currentLocation.loc_id == objectInfo.comp_id) {
						return;
					}
					
					var mesh = that.scene.getMeshByName(objectInfo.name);
					that.createLabel(mesh);
				});
			} else {
				that.objectList.forEach(function(objectInfo, idx) {
					var mesh = that.scene.getMeshByName(objectInfo.name);
					that.removeLabel(mesh);
				});
			}
		},
		setSaveViewPoint: function(isEnable) {
			that.editorOptions.isSaveViewPoint = isEnable;
		},
		setMeshPickable: function(isShow) {
			if(that.selectedMesh) {
				that.selectedMesh.IDCEDITOR_is_pickable = isShow;
			}
		},
		setMeshNameVisible: function(isShow) {
			if(that.selectedMesh) {
				that.selectedMesh.IDCEDITOR_is_tooltip = isShow;
			}
		},
		setMeshVisible: function(isShow) {
			if(that.selectedMesh) {
				that.selectedMesh.isVisible = isShow;
				
				that.scene.meshes.forEach(function(mesh, idx) {
					if(mesh.parent && mesh.parent instanceof BABYLON.Mesh && mesh.parent.name === that.selectedMesh.name) {
						mesh.isVisible = isShow;
					}
				});
			}
		},
		setMeshOpacity: function(value) {
			if(that.selectedMesh) {
				that.selectedMesh.visibility = value;
				
				that.scene.meshes.forEach(function(mesh, idx) {
					if(mesh.parent && mesh.parent instanceof BABYLON.Mesh && mesh.parent.name === that.selectedMesh.name) {
						mesh.visibility = event.target.value;
					}
				});
			}
		},
		destroy: function() {
			if(!that.engine) {
				return;
			}
			
			that.engine.stopRenderLoop();
			
			if (that.engine.scenes.length !== 0) {
				// if more than 1 scene,
				while (that.engine.scenes.length > 0) {
//					while (that.engine.scenes[0].meshes.length > 0) {
//						that.engine.scenes[0].meshes[0].dispose();
//					}
					
					that.engine.scenes[0].dispose();
				}
			}
			
			that.engine.dispose();
		}
	}

	return EditorSceneManager;
});

