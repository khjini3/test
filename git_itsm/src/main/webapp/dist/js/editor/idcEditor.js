define([
	'jquery',
	'underscore',
	'backbone',
	'js/editor/idcEditorSceneManager',
	'text!views/editor/idcEditor',
	'w2ui',
	'datgui',
	'jqueryuiLayout',
	'css!cs/editor/idcEditor.css',
	'css!plugins/datgui/dat.gui'
],function(
	$,
	_,
	Backbone,
	EditorSceneManager,
	JSP,
	W2ui,
	Datgui
){
	var that;

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
	
	var CoordinateText = function() {
		this.X = 0;
		this.Y = 0;
		this.Z = 0;
	};
	
	var EditorModel = Backbone.Collection.extend({
		//model: Model,
		parse: function(result) {
			return {data: result};
		}
	});
	
	var Main = Backbone.View.extend({
		el: '.content .wrap',
		initialize: function() {
			that = this;
			IDCEDITOR = that; // GLOBAL
			
			this.edtSceneMgr = null;
			this.currentLocation = null;
			this.locationList = null;
			this.availableAssetList = null;
			this.datGuiElement = null;
			this.datGuiManager = {
				elements: {
					position: {X: 0, Y: 0, Z: 0},
					rotation: {X: 0, Y: 0, Z: 0},
					scaling: {X: 0, Y: 0, Z: 0}
				},
				controllers: {
					position: {
						x: null, y: null, z: null, 
						updateDisplay: function(){
							this.x.updateDisplay();
							this.y.updateDisplay();
							this.z.updateDisplay();
						}
					},
					rotation: {
						x: null, y: null, z: null, 
						updateDisplay: function(){
							this.x.updateDisplay();
							this.y.updateDisplay();
							this.z.updateDisplay();
						}
					},
					scaling: {
						x: null, y: null, z: null, 
						updateDisplay: function(){
							this.x.updateDisplay();
							this.y.updateDisplay();
							this.z.updateDisplay();
						}
					}, 
					updateDisplay: function(){
						this.position.updateDisplay();
						this.rotation.updateDisplay();
						this.scaling.updateDisplay();
					}
				}
			};
			
			this.editorOptions = {
				isShowGrid: true,
				isShowWireframe: false,
				isShowBoundingBoxes: false,
				isLocalAxes: true,
				isShowNames: false,
				isSaveViewPoint: false
			};
			
	        /**
	         * HTML element id
	         */
			
			$(window.document).on("contextmenu", function(event){return false;});
			this.ID_BtnGizmoSwitchToPosition = '#idcEditor_BtnGizmoSwitchToPosition';
			this.ID_BtnGizmoSwitchToRotation = '#idcEditor_BtnGizmoSwitchToRotation';
			this.ID_BtnGizmoSwitchToScaling = '#idcEditor_BtnGizmoSwitchToScaling';
			this.ID_Properties_Name = '#idcEditor_Properties_Name';
			this.ID_Properties_Model = '#idcEditor_Properties_Model';
			this.ID_Properties_Type = '#idcEditor_Properties_Type';
			this.ID_Properties_Pickable = '#idcEditor_Properties_Pickable';
			this.ID_Properties_ShowName = '#idcEditor_Properties_ShowName';
			this.ID_Options_Visible = '#idcEditor_Options_Visible';
			this.ID_Options_Opacity = '#idcEditor_Options_Opacity';
			
			this.$el.append(JSP);
			this.start();
		},
		start: function() {
			that.edtSceneMgr = new EditorSceneManager(
				document.querySelector('#idcEditor_RenderCanvas'),
				that.sceneManagerCallbackAction
			);
			that.edtSceneMgr.createScene(that.editorOptions);
			
			that.initUI();
			
			that.registerOtherEvents();
		},
		events: {
			'click #idcEditor_Location' : 'locationAction',
			'change #idcEditor_EditorOptions_Grid' : 'showGridAction',
			'change #idcEditor_EditorOptions_Wireframe' : 'showWireframe',
			'change #idcEditor_EditorOptions_BoundingBoxes' : 'showBoundingBoxes',
			'change #idcEditor_EditorOptions_LocalAxes' : 'setLocalAxesMode',
			'change #idcEditor_EditorOptions_ShowNames' : 'showNamesAction',
			'change #idcEditor_EditorOptions_SaveViewPoint' : 'setSaveViewPoint',
			'click #idcEditor_BtnAddObject' : 'addObject',
			'click #idcEditor_BtnDeleteObject' : 'deleteObject',
			'click #idcEditor_BtnReload' : 'reloadAction',
			'click #idcEditor_BtnSave' : 'saveAction',
			'click #idcEditor_BtnGizmoSwitchToPosition' : 'gizmoSwitchToPosition',
			'click #idcEditor_BtnGizmoSwitchToRotation' : 'gizmoSwitchToRotation',
			'click #idcEditor_BtnGizmoSwitchToScaling' : 'gizmoSwitchToScaling',
			'click #idcEditor_BtnFocusOnObject' : 'focusOnObject',
			'change #idcEditor_Properties_Pickable' : 'setMeshPickable',
			'change #idcEditor_Properties_ShowName' : 'setMeshNameVisible',
			'change #idcEditor_Options_Visible' : 'setMeshVisible',
			'change #idcEditor_Options_Opacity' : 'setMeshOpacity'
		},
		registerOtherEvents: function() {
			$(document).on('click', '#idcEditor_BtnLocationPopupDone', function(event) {
				that.selectLocationFromPopup();
			});
			
			$(document).on('click', '#idcEditor_BtnAddObjectPopupDone', function(event) {
				that.selectAddObjectFromPopup();
			});
		},
		unRegisterOtherEvents: function() {
			$(document).off('click', '#idcEditor_BtnLocationPopupDone');
			
			$(document).off('click', '#idcEditor_BtnAddObjectPopupDone');
		},
		initUI: function() {
			/**************************************************** 
			 * initialize Layout
			 ****************************************************/
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
					//paneSelector: '#mainContent', 
					//minWidth: 800,
					//minHeight: 400
					onresize: function() {
						if(that.edtSceneMgr) {
							that.edtSceneMgr.resizeEngine();
						}
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
			
			$('#IDC-EDITOR-MAIN').layout(layoutSettings);
			
			
			/**************************************************** 
			 * initialize Location UI
			 ****************************************************/
			that.setLocationLabel('Select a Location');
			
			
			/**************************************************** 
			 * initialize Objects UI
			 ****************************************************/
			$('#idcEditor_ObjectsTree').w2sidebar({
				name: 'idcEditor_ObjectsTree',
				onClick: function(event) {
					that.edtSceneMgr.selectObject(event.target, false);
				},
				onDblClick: function(event) {
					that.edtSceneMgr.selectObject(event.target, false);
					that.edtSceneMgr.focusOnObject();
					
					if(event.target == that.currentLocation.loc_name) {
						setTimeout(function() {
							w2ui.idcEditor_ObjectsTree.expand(event.target);
						}, 1);
					}
				}
			});
			
			
			/**************************************************** 
			 * initialize Editor Options UI
			 ****************************************************/
			var formHTML_EditorOptions = '';
			if(BABYLON.GUI !== undefined) {
				formHTML_EditorOptions = ''+
				'<div class="w2ui-page page-0">'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_Grid" type="checkbox"/></div>'+
						'<div><label>GRID</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_Wireframe" type="checkbox"/></div>'+
						'<div><label>WIREFRAME</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_BoundingBoxes"type="checkbox"/></div>'+
						'<div><label>BOUNDING BOXES</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_LocalAxes" type="checkbox"/></div>'+
						'<div><label>LOCAL AXES</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_ShowNames" type="checkbox"/></div>'+
						'<div><label>SHOW NAMES</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_SaveViewPoint" type="checkbox"/></div>'+
						'<div><label>SAVE VIEWPOINT</label></div>'+
					'</div>'+
				'</div>';
			} else {
				formHTML_EditorOptions = ''+
				'<div class="w2ui-page page-0">'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_Grid" type="checkbox"/></div>'+
						'<div><label>GRID</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_Wireframe" type="checkbox"/></div>'+
						'<div><label>WIREFRAME</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_BoundingBoxes"type="checkbox"/></div>'+
						'<div><label>BOUNDING BOXES</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_LocalAxes" type="checkbox"/></div>'+
						'<div><label>LOCAL AXES</label></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<div><input name="idcEditor_EditorOptions_SaveViewPoint" type="checkbox"/></div>'+
						'<div><label>SAVE VIEWPOINT</label></div>'+
					'</div>'+
				'</div>';
			}
			
			$('#idcEditor_EditorOptions').html(formHTML_EditorOptions);
			
			if(BABYLON.GUI !== undefined) {
				$('#idcEditor_EditorOptions').w2form({
					name : 'idcEditor_Form_EditorOptions',
					//focus : 1,
					fields : [
						{name: 'idcEditor_EditorOptions_Grid', type: 'toggle', disabled: false, required: false, html: {caption: 'GRID'}},
						{name: 'idcEditor_EditorOptions_Wireframe', type: 'toggle', disabled: false, required: false, html: {caption: 'WIREFRAME'}},
						{name: 'idcEditor_EditorOptions_BoundingBoxes', type: 'toggle', disabled: false, required: false, html: {caption: 'BOUNDING BOXES'}},
						{name: 'idcEditor_EditorOptions_LocalAxes', type: 'toggle', disabled: false, required: false, html: {caption: 'LOCAL AXES'}},
						{name: 'idcEditor_EditorOptions_ShowNames', type: 'toggle', disabled: false, required: false, html: {caption: 'SHOW NAMES'}},
						{name: 'idcEditor_EditorOptions_SaveViewPoint', type: 'toggle', disabled: false, required: false, html: {caption: 'SAVE VIEWPOINT'}}
					],
					record : {
						idcEditor_EditorOptions_Grid : that.editorOptions.isShowGrid,
						idcEditor_EditorOptions_Wireframe : that.editorOptions.isShowWireframe,
						idcEditor_EditorOptions_BoundingBoxes : that.editorOptions.isShowBoundingBoxes,
						idcEditor_EditorOptions_LocalAxes : that.editorOptions.isLocalAxes,
						idcEditor_EditorOptions_ShowNames : that.editorOptions.isShowNames,
						idcEditor_EditorOptions_SaveViewPoint : that.editorOptions.isSaveViewPoint
					},
				});
			} else {
				$('#idcEditor_EditorOptions').w2form({
					name : 'idcEditor_Form_EditorOptions',
					//focus : 1,
					fields : [
						{name: 'idcEditor_EditorOptions_Grid', type: 'toggle', disabled: false, required: false, html: {caption: 'GRID'}},
						{name: 'idcEditor_EditorOptions_Wireframe', type: 'toggle', disabled: false, required: false, html: {caption: 'WIREFRAME'}},
						{name: 'idcEditor_EditorOptions_BoundingBoxes', type: 'toggle', disabled: false, required: false, html: {caption: 'BOUNDING BOXES'}},
						{name: 'idcEditor_EditorOptions_LocalAxes', type: 'toggle', disabled: false, required: false, html: {caption: 'LOCAL AXES'}},
						{name: 'idcEditor_EditorOptions_SaveViewPoint', type: 'toggle', disabled: false, required: false, html: {caption: 'SAVE VIEWPOINT'}}
					],
					record : {
						idcEditor_EditorOptions_Grid : that.editorOptions.isShowGrid,
						idcEditor_EditorOptions_Wireframe : that.editorOptions.isShowWireframe,
						idcEditor_EditorOptions_BoundingBoxes : that.editorOptions.isShowBoundingBoxes,
						idcEditor_EditorOptions_LocalAxes : that.editorOptions.isLocalAxes,
						idcEditor_EditorOptions_SaveViewPoint : that.editorOptions.isSaveViewPoint
					},
				});
			}
			
			
			/**************************************************** 
			 * initialize Toolbar UI
			 ****************************************************/
			var formHTML_ToolbarUI = ''+
				'<div class="toolbar">'+
					'<i id="idcEditor_BtnSave" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save"></i>'+
					'<i id="idcEditor_BtnReload" class="icon link fas fa-sync-alt fa-2x" aria-hidden="true" title="Reload"></i>'+
					'<div class="split" style="display: inline-block; position: relative; bottom: 9px;">&nbsp;</div>'+
					'<i id="idcEditor_BtnGizmoSwitchToPosition" class="icon link fas fa-arrows-alt fa-2x" aria-hidden="true" title="Position"></i>'+
					'<i id="idcEditor_BtnGizmoSwitchToRotation" class="icon link fas fa-redo-alt fa-2x" aria-hidden="true" title="Rotation"></i>'+
					'<i id="idcEditor_BtnGizmoSwitchToScaling" class="icon link fas fa-expand fa-2x" aria-hidden="true" title="Scaling"></i>'+
					'<div class="split" style="display: inline-block; position: relative; bottom: 9px;">&nbsp;</div>'+
					'<i id="idcEditor_BtnFocusOnObject" class="icon link fas fa-eye fa-2x" aria-hidden="true" title="Focus object"></i>'+
				'</div>';
			
			$('#idcEditor_Toolbar').html(formHTML_ToolbarUI);
			
			/**************************************************** 
			 * initialize Properties UI
			 ****************************************************/
			var formHTML = ''+
				'<div class="w2ui-page page-0">'+
					'<div class="w2ui-field">'+
						'<label>NAME</label>'+
						'<div><input name="idcEditor_Properties_Name" type="text" class="field-inputtext" maxlength="50" size="10"/></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<label>MODEL</label>'+
						'<div><input name="idcEditor_Properties_Model" type="text" class="field-inputtext" maxlength="50" size="10"/></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<label>TYPE</label>'+
						'<div><input name="idcEditor_Properties_Type" type="text" class="field-inputtext" maxlength="50" size="10"/></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<label>PICKABLE</label>'+
						'<div><input name="idcEditor_Properties_Pickable" type="checkbox"/></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<label>SHOW NAME</label>'+
						'<div><input name="idcEditor_Properties_ShowName" type="checkbox"/></div>'+
					'</div>'+
				'</div>';
			
			$('#idcEditor_Properties').html(formHTML);
			
			$('#idcEditor_Properties').w2form({
				name : 'idcEditor_Form_Properties',
				//focus : 1,
				fields : [
					{name: 'idcEditor_Properties_Name', type: 'text', disabled: true, required: false, html: {caption: 'NAME'}},
					{name: 'idcEditor_Properties_Model', type: 'text', disabled: true, required: false, html: {caption: 'MODEL'}},
					{name: 'idcEditor_Properties_Type', type: 'text', disabled: true, required: false, html: {caption: 'TYPE'}},
					{name: 'idcEditor_Properties_Pickable', type: 'toggle', disabled: false, required: false, html: {caption: 'PICKABLE'}},
					{name: 'idcEditor_Properties_ShowName', type: 'toggle', disabled: false, required: false, html: {caption: 'SHOW NAME'}}
				],
				record : {
					idcEditor_Properties_Visible : true,
					idcEditor_Properties_Opacity : 1
				}
			});
			
			
			/**************************************************** 
			 * initialize Transforms UI
			 ****************************************************/
			that.datGuiElement = new Datgui.GUI({
				autoPlace: false
			});
			
			
			/**
			 * Position
			 */
			var fPosition = that.datGuiElement.addFolder('Position');
			// Position X
			//var positionText = new CoordinateText();
			var positionText = that.datGuiManager.elements.position;
			that.datGuiManager.controllers.position.x = fPosition.add(positionText, 'X').step(1);
			that.datGuiManager.controllers.position.x.onChange(function(value) {
				if(Math.abs(value) > 10000) {
					value = (value < 0) ? -10000 : 10000;
					that.datGuiManager.elements.position.X = value;
					that.datGuiManager.controllers.position.x.updateDisplay();
				}
				
				that.edtSceneMgr.setSelectedMeshValue('position', 'x', value);
				that.edtSceneMgr.changeGizmoModeToPosition();
			});
			that.datGuiManager.controllers.position.x.onFinishChange(function(value) {
				
			});
			// Position Y
			that.datGuiManager.controllers.position.y = fPosition.add(positionText, 'Y').step(1);
			that.datGuiManager.controllers.position.y.onChange(function(value) {
				if(Math.abs(value) > 10000) {
					value = (value < 0) ? -10000 : 10000;
					that.datGuiManager.elements.position.Y = value;
					that.datGuiManager.controllers.position.y.updateDisplay();
				}
				
				that.edtSceneMgr.setSelectedMeshValue('position', 'y', value);
				that.edtSceneMgr.changeGizmoModeToPosition();
			});
			that.datGuiManager.controllers.position.y.onFinishChange(function(value) {
				
			});
			// Position Z
			that.datGuiManager.controllers.position.z = fPosition.add(positionText, 'Z').step(1);
			that.datGuiManager.controllers.position.z.onChange(function(value) {
				if(Math.abs(value) > 10000) {
					value = (value < 0) ? -10000 : 10000;
					that.datGuiManager.elements.position.Z = value;
					that.datGuiManager.controllers.position.z.updateDisplay();
				}
				
				that.edtSceneMgr.setSelectedMeshValue('position', 'z', value);
				that.edtSceneMgr.changeGizmoModeToPosition();
			});
			that.datGuiManager.controllers.position.z.onFinishChange(function(value) {
				
			});
			fPosition.open();
			
			/**
			 * Rotation
			 */
			var fRotation = that.datGuiElement.addFolder('Rotation');
			var rotationText = that.datGuiManager.elements.rotation;
			rotationText.X = 0;
			rotationText.Y = 0;
			rotationText.Z = 0;
			
			// Rotation X
			that.datGuiManager.controllers.rotation.x = fRotation.add(rotationText, 'X', 0, 359).step(1);
			that.datGuiManager.controllers.rotation.x.onChange(function(value) {
				if(value > 359 || value < 0) {
					value = (value < 0) ? 0 : 359;
					that.datGuiManager.elements.rotation.X = value;
					that.datGuiManager.controllers.rotation.x.updateDisplay();
				}
				
				//console.log('controllerRotationX: ' + value + ' => ' + BABYLON.Tools.ToRadians(value));
				that.edtSceneMgr.setSelectedMeshValue('rotation', 'x', BABYLON.Tools.ToRadians(value));
				that.edtSceneMgr.changeGizmoModeToRotation();
			});
			that.datGuiManager.controllers.rotation.x.onFinishChange(function(value) {
				
			});
			
			// Rotation Y
			that.datGuiManager.controllers.rotation.y = fRotation.add(rotationText, 'Y', 0, 359).step(1);
			that.datGuiManager.controllers.rotation.y.onChange(function(value) {
				if(value > 359 || value < 0) {
					value = (value < 0) ? 0 : 359;
					that.datGuiManager.elements.rotation.Y = value;
					that.datGuiManager.controllers.rotation.y.updateDisplay();
				}
				
				//console.log('controllerRotationY: ' + value + ' => ' + BABYLON.Tools.ToRadians(value));
				that.edtSceneMgr.setSelectedMeshValue('rotation', 'y', BABYLON.Tools.ToRadians(value));
				that.edtSceneMgr.changeGizmoModeToRotation();
			});
			that.datGuiManager.controllers.rotation.y.onFinishChange(function(value) {
				
			});
			
			// Rotation Z
			that.datGuiManager.controllers.rotation.z = fRotation.add(rotationText, 'Z', 0, 359).step(1);
			that.datGuiManager.controllers.rotation.z.onChange(function(value) {
				if(value > 359 || value < 0) {
					value = (value < 0) ? 0 : 359;
					that.datGuiManager.elements.rotation.Z = value;
					that.datGuiManager.controllers.rotation.z.updateDisplay();
				}
				
				//console.log('controllerRotationZ: ' + value + ' => ' + BABYLON.Tools.ToRadians(value));
				that.edtSceneMgr.setSelectedMeshValue('rotation', 'z', BABYLON.Tools.ToRadians(value));
				that.edtSceneMgr.changeGizmoModeToRotation();
			});
			that.datGuiManager.controllers.rotation.z.onFinishChange(function(value) {
				
			});
			fRotation.open();
			
			/**
			 * Scaling
			 */
			var fScaling = that.datGuiElement.addFolder('Scaling');
			var scalingText = that.datGuiManager.elements.scaling;
			scalingText.X = 1;
			scalingText.Y = 1;
			scalingText.Z = 1;
			
			// Scaling X
			that.datGuiManager.controllers.scaling.x = fScaling.add(scalingText, 'X').step(.01);
			that.datGuiManager.controllers.scaling.x.onChange(function(value) {
				//if(Math.abs(value) > 10000) {
				if(value < 0 || value > 10000) {
					value = (value < 0) ? 0 : 10000;
					that.datGuiManager.elements.scaling.X = value;
					that.datGuiManager.controllers.scaling.x.updateDisplay();
				}
				
				that.edtSceneMgr.setSelectedMeshValue('scaling', 'x', value);
				that.edtSceneMgr.changeGizmoModeToScaling();
			});
			that.datGuiManager.controllers.scaling.x.onFinishChange(function(value) {
				
			});
			
			// Scaling Y
			that.datGuiManager.controllers.scaling.y = fScaling.add(scalingText, 'Y').step(.01);
			that.datGuiManager.controllers.scaling.y.onChange(function(value) {
				//if(Math.abs(value) > 10000) {
				if(value < 0 || value > 10000) {
					value = (value < 0) ? 0 : 10000;
					that.datGuiManager.elements.scaling.Y = value;
					that.datGuiManager.controllers.scaling.y.updateDisplay();
				}
				
				that.edtSceneMgr.setSelectedMeshValue('scaling', 'y', value);
				that.edtSceneMgr.changeGizmoModeToScaling();
			});
			that.datGuiManager.controllers.scaling.y.onFinishChange(function(value) {
				
			});
			
			// Scaling Z
			that.datGuiManager.controllers.scaling.z = fScaling.add(scalingText, 'Z').step(.01);
			that.datGuiManager.controllers.scaling.z.onChange(function(value) {
				//if(Math.abs(value) > 10000) {
				if(value < 0 || value > 10000) {
					value = (value < 0) ? 0 : 10000;
					that.datGuiManager.elements.scaling.Z = value;
					that.datGuiManager.controllers.scaling.z.updateDisplay();
				}
				
				that.edtSceneMgr.setSelectedMeshValue('scaling', 'z', value);
				that.edtSceneMgr.changeGizmoModeToScaling();
			});
			that.datGuiManager.controllers.scaling.z.onFinishChange(function(value) {
				
			});
			fScaling.open();
			
			var parentElement = $('#idcEditor_Transforms');
			that.datGuiElement.width = parentElement.width();
			that.datGuiElement.height = parentElement.height();
			parentElement[0].appendChild(that.datGuiElement.domElement);
			
			
			/**************************************************** 
			 * initialize initOptions UI
			 ****************************************************/
			var formHTML_OptionsUI = ''+
				'<div class="w2ui-page page-0">'+
					'<div class="w2ui-field">'+
						'<label>VISIBLE</label>'+
						'<div><input name="idcEditor_Options_Visible" type="checkbox"/></div>'+
					'</div>'+
					'<div class="w2ui-field">'+
						'<label>OPACITY</label>'+
						'<div><input name="idcEditor_Options_Opacity" type="range" class="field-inputrange" min="0" max="1" step="0.1" value="1"></div>'+
					'</div>'+
				'</div>';
			
			$('#idcEditor_Options').html(formHTML_OptionsUI);
			
			$('#idcEditor_Options').w2form({
				name : 'idcEditor_Form_Options',
				//focus : 1,
				fields : [
					{name: 'idcEditor_Options_Visible', type: 'toggle', disabled: false, required: false, html: {caption: 'VISIBLE'}},
					{name: 'idcEditor_Options_Opacity', type: 'float', disabled: false, required: false, html: {caption: 'OPACITY'}}
				],
				record : {
					idcEditor_Options_Visible : true,
					idcEditor_Options_Opacity : 1
				}
			});
			
			
			/**************************************************** 
			 * initialize ETC
			 ****************************************************/
			that.divisionMaskOn('idcEditor_Toolbar', 'idcEditor_Layout_East');
			that.divisionMaskOn('idcEditor_Properties', 'idcEditor_Layout_East');
			that.divisionMaskOn('idcEditor_Transforms', 'idcEditor_Layout_East');
			that.divisionMaskOn('idcEditor_Options', 'idcEditor_Layout_East');
			
			that.resetProperties();
		},
		resetProperties: function() {
			/**
			 * Properties
			 */
			$(that.ID_Properties_Name).val('');
			$(that.ID_Properties_Model).val('');
			$(that.ID_Properties_Type).val('');
			$(that.ID_Properties_Pickable).prop('checked', false);
			$(that.ID_Properties_ShowName).prop('checked', false);
			
			/**
			 * Transforms
			 */
			that.datGuiManager.elements.position.X = 0;
			that.datGuiManager.elements.position.Y = 0;
			that.datGuiManager.elements.position.Z = 0;
			that.datGuiManager.elements.rotation.X = 0;
			that.datGuiManager.elements.rotation.Y = 0;
			that.datGuiManager.elements.rotation.Z = 0;
			that.datGuiManager.elements.scaling.X = 1;
			that.datGuiManager.elements.scaling.Y = 1;
			that.datGuiManager.elements.scaling.Z = 1;
			that.datGuiManager.controllers.updateDisplay();
			
			/**
			 * Options
			 */
			$(that.ID_Options_Visible).prop('checked', false);
			$(that.ID_Options_Opacity).val(0);
		},
		sceneManagerCallbackAction: function(event) {
			switch(event.type) {
				case EVENT_TYPE.SELECT_OBJECT:
					if(event.result !== undefined && event.result === false) {
						that.resetProperties();
						return;
					}
					
					var mesh = that.edtSceneMgr.getSelectedMesh();
					if(!mesh) {
						//console.log('selectedMesh is null');
						that.resetProperties();
						return;
					}
					
					var selObj = _.findWhere(that.edtSceneMgr.getObjectList(), {'name': mesh.name});
					
					/**
					 * unlock Layout_East Division
					 */
					that.divisionMaskOff('idcEditor_Toolbar');
					that.divisionMaskOff('idcEditor_Properties');
					that.divisionMaskOff('idcEditor_Transforms');
					that.divisionMaskOff('idcEditor_Options');
					
					/**
					 * Properties & Options UI update
					 */
					$(that.ID_Properties_Name).val(selObj.name);
					$(that.ID_Properties_Model).val(selObj.model);
					$(that.ID_Properties_Type).val(selObj.code_name);
					$(that.ID_Options_Visible).prop('checked', (mesh.isVisible === true) ? true : false);
					$(that.ID_Options_Opacity).val(mesh.visibility);
					$(that.ID_Properties_Pickable).prop('checked', (mesh.IDCEDITOR_is_pickable === true) ? true : false);
					$(that.ID_Properties_ShowName).prop('checked', (mesh.IDCEDITOR_is_tooltip === true) ? true : false);
					
					/**
					 * update Transforms UI
					 */
					that.datGuiManager.elements.position.X = mesh.position.x;
					that.datGuiManager.elements.position.Y = mesh.position.y;
					that.datGuiManager.elements.position.Z = mesh.position.z;
					
					that.datGuiManager.elements.rotation.X = BABYLON.Tools.ToDegrees((mesh.rotation.x >= 360) ? 0 : mesh.rotation.x);
					that.datGuiManager.elements.rotation.Y = BABYLON.Tools.ToDegrees((mesh.rotation.y >= 360) ? 0 : mesh.rotation.y);
					that.datGuiManager.elements.rotation.Z = BABYLON.Tools.ToDegrees((mesh.rotation.z >= 360) ? 0 : mesh.rotation.z);
					
					that.datGuiManager.elements.scaling.X = mesh.scaling.x;
					that.datGuiManager.elements.scaling.Y = mesh.scaling.y;
					that.datGuiManager.elements.scaling.Z = mesh.scaling.z;
					
					that.datGuiManager.controllers.updateDisplay();

					
					/**
					 * Objects Tree scroll update
					 */
					if(event.selectedOn3DView === true) {
						w2ui.idcEditor_ObjectsTree.expandParents(mesh.name);
						w2ui.idcEditor_ObjectsTree.select(mesh.name);
						w2ui.idcEditor_ObjectsTree.scrollIntoView();
					}
					
					break;
				case EVENT_TYPE.DELETE_OBJECT:
					/**
					 * lock Layout_East Division
					 */
					that.divisionMaskOn('idcEditor_Toolbar', 'idcEditor_Layout_East');
					that.divisionMaskOn('idcEditor_Properties', 'idcEditor_Layout_East');
					that.divisionMaskOn('idcEditor_Transforms', 'idcEditor_Layout_East');
					that.divisionMaskOn('idcEditor_Options', 'idcEditor_Layout_East');
					
					/**
					 * remove object from Objects Tree
					 */
					w2ui.idcEditor_ObjectsTree.remove(event.value);
					
					/**
					 * reset Properties, Transforms, Options UI
					 */
					that.resetProperties();
					break;
				case EVENT_TYPE.LOAD_MESH_FINISH:
					/**
					 * unlock Layout_East Division
					 */
					//that.divisionMaskOff('idcEditor_ObjectsTree');
					//that.divisionMaskOff('idcEditor_Properties');
					//that.divisionMaskOff('idcEditor_Transforms');
					//that.divisionMaskOff('idcEditor_Options');

					/**
					 * clear Objects Tree
					 */
					if(w2ui.idcEditor_ObjectsTree) {
						w2ui.idcEditor_ObjectsTree.remove('Mesh');
						//w2ui.idcEditor_ObjectsTree.remove('Camera');
						//w2ui.idcEditor_ObjectsTree.remove('Light');
					}
					
					/**
					 * insert into Objects Tree
					 */
					var treeNode = [];
					treeNode = that.createObjectTree(that.edtSceneMgr.getObjectList(), that.currentLocation.parent_loc_id);
					
					w2ui.idcEditor_ObjectsTree.add([
						{
							id: 'Mesh', text: 'Mesh', img: 'icon-folder', expanded: true, group: true,
							nodes: treeNode
						}
					]);
					
					break;
				case EVENT_TYPE.ADD_MESH_FINISH:
					/**
					 * unlock Layout_East Division
					 */
					//that.divisionMaskOff('idcEditor_ObjectsTree');
					//that.divisionMaskOff('idcEditor_Properties');
					//that.divisionMaskOff('idcEditor_Transforms');
					//that.divisionMaskOff('idcEditor_Options');

					/**
					 * clear Objects Tree
					 */
					if(w2ui.idcEditor_ObjectsTree) {
						w2ui.idcEditor_ObjectsTree.remove('Mesh');
						//w2ui.idcEditor_ObjectsTree.remove('Camera');
						//w2ui.idcEditor_ObjectsTree.remove('Light');
					}
					
					/**
					 * insert into Objects Tree
					 */
					var treeNode = [];
					treeNode = that.createObjectTree(that.edtSceneMgr.getObjectList(), that.currentLocation.parent_loc_id);
					
					w2ui.idcEditor_ObjectsTree.add([
						{
							id: 'Mesh', text: 'Mesh', img: 'icon-folder', expanded: true, group: true,
							nodes: treeNode
						}
					]);
					
					if(event.value && event.value.length > 0) {
						var lastNewObject = event.value[event.value.length - 1]
						
						w2ui.idcEditor_ObjectsTree.expandParents(lastNewObject.comp_name);
						w2ui.idcEditor_ObjectsTree.select(lastNewObject.comp_name);
						w2ui.idcEditor_ObjectsTree.scrollIntoView();
						
						that.edtSceneMgr.selectObject(lastNewObject.comp_name, false);
						that.edtSceneMgr.focusOnObject();
					}

					break;
				case EVENT_TYPE.CHANGE_TRANSFORMS:
					if(that.datGuiManager.elements[event.propName] === undefined) {
						return;
					}
					
					var mesh = that.edtSceneMgr.getSelectedMesh();
					
					switch(event.propName) {
						case 'position':
							/**
							 * update Transforms position UI
							 */
							that.datGuiManager.elements.position.X = mesh.position.x;
							that.datGuiManager.elements.position.Y = mesh.position.y;
							that.datGuiManager.elements.position.Z = mesh.position.z;
							
							that.datGuiManager.controllers.position.updateDisplay();
							
							//console.log('rotation: ' + that.datGuiManager.elements.position.X + ', ' + that.datGuiManager.elements.position.Y + ', ' + that.datGuiManager.elements.position.Z);
							break;
						case 'rotation':
							var tempRot;
							tempRot = mesh.rotation.x;
							var rotX = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
							tempRot = mesh.rotation.y;
							var rotY = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
							tempRot = mesh.rotation.z;
							var rotZ = (tempRot < 0) ? Math.PI + Math.PI - Math.abs(tempRot) : tempRot;
							
							rotX = BABYLON.Tools.ToDegrees(rotX) | 0;
							rotY = BABYLON.Tools.ToDegrees(rotY) | 0;
							rotZ = BABYLON.Tools.ToDegrees(rotZ) | 0;
							if(rotX >= 0 && rotY >= 0 && rotZ >= 0) {
								/**
								 * update Transforms rotation UI
								 */
								that.datGuiManager.elements.rotation.X = (rotX >= 360) ? 0 : rotX;
								that.datGuiManager.elements.rotation.Y = (rotY >= 360) ? 0 : rotY;
								that.datGuiManager.elements.rotation.Z = (rotZ >= 360) ? 0 : rotZ;
								
								that.datGuiManager.controllers.rotation.updateDisplay();
								
								//console.log('rotation: ' + that.datGuiManager.elements.rotation.X + ', ' + that.datGuiManager.elements.rotation.Y + ', ' + that.datGuiManager.elements.rotation.Z);
							}
							break;
						case 'scaling':
							/**
							 * update Transforms scaling UI 
							 */
							that.datGuiManager.elements.scaling.X = mesh.scaling.x;
							that.datGuiManager.elements.scaling.Y = mesh.scaling.y;
							that.datGuiManager.elements.scaling.Z = mesh.scaling.z;
							
							that.datGuiManager.controllers.scaling.updateDisplay();
							
							//console.log('rotation: ' + that.datGuiManager.elements.scaling.X + ', ' + that.datGuiManager.elements.scaling.Y + ', ' + that.datGuiManager.elements.scaling.Z);
							break;
					}

					break;
				case EVENT_TYPE.SWITCH_GIZMO:
					switch(event.value) {
						case 'position':
							$(that.ID_BtnGizmoSwitchToPosition).addClass('active')
							$(that.ID_BtnGizmoSwitchToRotation).removeClass('active');
							$(that.ID_BtnGizmoSwitchToScaling).removeClass('active');
							break;
						case 'rotation':
							$(that.ID_BtnGizmoSwitchToPosition).removeClass('active')
							$(that.ID_BtnGizmoSwitchToRotation).addClass('active');
							$(that.ID_BtnGizmoSwitchToScaling).removeClass('active');
							break;
						case 'scaling':
							$(that.ID_BtnGizmoSwitchToPosition).removeClass('active')
							$(that.ID_BtnGizmoSwitchToRotation).removeClass('active');
							$(that.ID_BtnGizmoSwitchToScaling).addClass('active');
							break;
						case 'none':
							$(that.ID_BtnGizmoSwitchToPosition).removeClass('active')
							$(that.ID_BtnGizmoSwitchToRotation).removeClass('active');
							$(that.ID_BtnGizmoSwitchToScaling).removeClass('active');
							break;
					}
					break;
			}
		} ,
		locationAction: function(event) {
			that.openPopupLocation();
		},
		showGridAction: function(event) {
			that.editorOptions.isShowGrid = event.target.checked;
			that.edtSceneMgr.showGridHelper(event.target.checked);
		},
		showWireframe: function(event) {
			that.editorOptions.isShowWireframe = event.target.checked;
			that.edtSceneMgr.showWireframe(event.target.checked);
		},
		showBoundingBoxes: function(event) {
			that.editorOptions.isShowBoundingBoxes = event.target.checked;
			that.edtSceneMgr.showBoundingBoxes(event.target.checked);
		},
		setLocalAxesMode: function(event) {
			that.editorOptions.isLocalAxes = event.target.checked;
			that.edtSceneMgr.setLocalAxesMode(event.target.checked);
		},
		showNamesAction: function(event) {
			that.editorOptions.isShowNames = event.target.checked;
			that.edtSceneMgr.showNames(event.target.checked);
		},
		setSaveViewPoint: function(event) {
			that.editorOptions.isSaveViewPoint = event.target.checked;
			that.edtSceneMgr.setSaveViewPoint(event.target.checked);
		},
		addObject: function(event) {
			if(!that.currentLocation || that.edtSceneMgr.isLoadMeshes !== true) {
				return;
			}
			
			that.openPopupAddObject();
		},
		deleteObject: function(event) {
			var selId = w2ui.idcEditor_ObjectsTree.selected;
			var objectInfo = _.findWhere(that.edtSceneMgr.getObjectList(), {'comp_name': selId});
			if(!objectInfo) {
				return;
			}
			
			if(objectInfo.comp_type == 'LOCATION') {
				//You cannot delete the Location object.
				//Unable to delete the Location object.
				w2alert('You cannot delete the Location object.<br>(You should delete in Location Manager)', 'Information');
				return;
			}
			
			w2confirm('Are you sure to delete the selected object?', 'Delete')
			.yes(function () {
				that.edtSceneMgr.deleteObject(objectInfo);
			})
			.no(function () {
				console.log('NO');
			});
		},
		saveAction: function(event) {
			if(!that.edtSceneMgr || !that.edtSceneMgr.isLoadMeshes) {
				return;
			}
			
			w2confirm('Are you sure to save this scene?', 'Save')
			.yes(function () {
				that.edtSceneMgr.saveScene();
			})
			.no(function () {
				console.log('NO');
			});
		},
		reloadAction: function(event) {
			if(!that.edtSceneMgr || !that.edtSceneMgr.isLoadMeshes) {
				return;
			}
			
			w2confirm('Are you sure to reload this scene?', 'Reload')
			.yes(function () {
				that.changeLocation( that.currentLocation, true );
			})
			.no(function () {
				console.log('NO');
			});
		},
		gizmoSwitchToPosition: function(event) {
			// check toggle
			if( $(that.ID_BtnGizmoSwitchToPosition).hasClass('active') ) {
				that.edtSceneMgr.gizmoSwitchToNone();
			} else {
				that.edtSceneMgr.gizmoSwitchToPosition();
			}
		},
		gizmoSwitchToRotation: function(event) {
			// check toggle
			if( $(that.ID_BtnGizmoSwitchToRotation).hasClass('active') ) {
				that.edtSceneMgr.gizmoSwitchToNone();
			} else {
				that.edtSceneMgr.gizmoSwitchToRotation();
			}
		},
		gizmoSwitchToScaling: function(event) {
			// check toggle
			if( $(that.ID_BtnGizmoSwitchToScaling).hasClass('active') ) {
				that.edtSceneMgr.gizmoSwitchToNone();
			} else {
				that.edtSceneMgr.gizmoSwitchToScaling();
			}
		},
		focusOnObject: function(event) {
			that.edtSceneMgr.focusOnObject();
		},
		setMeshPickable: function(event) {
			that.edtSceneMgr.setMeshPickable(event.target.checked);
		},
		setMeshNameVisible: function(event) {
			that.edtSceneMgr.setMeshNameVisible(event.target.checked);
		},
		setMeshVisible: function(event) {
			that.edtSceneMgr.setMeshVisible(event.target.checked);
		},
		setMeshOpacity: function(event) {
			that.edtSceneMgr.setMeshOpacity(event.target.value);
		},
		loadLocationPopupList: function() {
			w2popup.lock('Loading...', true);
			
			try {
				var locationModel = new EditorModel();
				//locationModel.url += 'editor/location/-1';
				locationModel.url = 'editor/location';
				that.listenTo(locationModel, 'sync', that.setLocationPopupList);
				that.listenTo(locationModel, 'error', function() {
					w2popup.unlock();
					w2alert('Failed to load.', 'Error');
				});
				locationModel.fetch();
			} catch(e) {
				console.log(e);
				w2popup.unlock();
			}
		},
		setLocationPopupList: function(method, model, options) {
			try {
				that.locationList = model;
				
				var rootNodes = [];
				
//				model.forEach(function(item,idx) {
//					var newItem = $.extend({}, item);
//					newItem.id = newItem.loc_id;
//					newItem.text = newItem.loc_name;
//					newItem.img = '';
//					newItem.icon = that.getObjectIcon(LOCATION_TYPE.SITE);
//					rootNodes.push(newItem);
//				});
				
				//rootNodes = _.sortBy(rootNodes, function (i) { return i.loc_name.toLowerCase(); });
				
				var treeNode = that.createLocationTree(model);
				
				w2ui.idcEditor_SidebarLocationPopup.insert('Location', null, treeNode);
			} catch(e) {
				console.log(e);
			}
			
			w2popup.unlock();
		},
		openPopupLocation: function() {
			var bodyHTML = ''+
				'<div class="w2ui-centered content-idc">'+
					'<div id="idcEditor_LocationPopupContents" style="width:338px; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
					'<div id="idcEditor_LocationPopupBottom">'+
						'<button id="idcEditor_BtnLocationPopupDone" class="darkButton">Done</button>'+
					'</div>'+
				'</div>';
			
			w2popup.open({
				title : 'Location',
				width : 360,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$('#idcEditor_LocationPopupContents').w2sidebar({
							name: 'idcEditor_SidebarLocationPopup',
							style: 'width:100%, height:200px',
							nodes: [
								{ id: 'Location', text: 'LOCATION', expanded: true, group: true}
							],
							onDblClick: function(event) {
								if(event && event.target) {
									that.selectLocationFromPopup();
								}
							}
						});
						
						that.loadLocationPopupList();
					}
				},
				onToggle: function (event) { 
					event.onComplete = function () {
						w2ui.layout.resize();
					}
				},
				onDone: function () {
					w2popup.close();
				},
				onClose: function () {
					w2ui.idcEditor_SidebarLocationPopup.destroy();
				}
			});
		},
		openPopupAddObject_old: function() {
			var bodyHTML = ''+
				'<div class="w2ui-centered">'+
					'<div id="idcEditor_AddObjectPopupContents" style="width:338px; height:415px; margin-bottom: 6px; background-color: #1b1b1b;"></div>'+
					'<div id="idcEditor_AddObjectPopupBottom">'+
						'<button id="idcEditor_BtnAddObjectPopupDone" class="darkButton">Done</button>'+
					'</div>'+
				'</div>';
			
			w2popup.open({
				title : 'Add New Object',
				width : 600,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$('#idcEditor_AddObjectPopupContents').w2grid({
							name: 'idcEditor_AddObjectPopupAssetTable',
							show: { 
								toolbar: false,
								footer: false,
								toolbarSearch: false,
								toolbarReload: false,
								searchAll: false,
								toolbarColumns: false,
								selectColumn: true,
								lineNumbers: false
							},
							recordHeight: 60,
							style: 'padding:5px; width:100%; height:415px;',
							searches: [
								{ field: 'asset_id', caption: 'ID ', type: 'text' },
								{ field: 'asset_name', caption: 'NAME ', type: 'text' },
								{ field: 'loc_name', caption: 'LOCATION ', type: 'text' }
							],
							columns: [
								{ field: 'asset_id', caption: 'ID', size: '100px', sortable: true, attr: 'align=center'},
								{ field: 'asset_name', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
								//{ field: 'loc_name', caption: 'LOCATION', size: '100px', sortable: true, attr: 'align=right', style:'padding-right:10px;'},
								{ field: 'model_name', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=right', style:'padding-right:10px;', 
									render: function(record) {
										if(record.model_name) {
											//return `<div style="width:100%;height:100%;text-align: center;"><img src="dist/models/${record.model_name}/${record.model_name}_pre.png" onerror="this.style.display='none'" ></div>`;
											return '<div style="width:100%;height:100%;text-align: center;"><img src="dist/models/' + record.model_name + '/' + record.model_name + '_pre.png" onerror="this.style.display=\'none\'" ></div>';
										}
										return '<div style="width:100%;height:100%;text-align: center;"></div>';
									}
							    }
							]
						});
						
						//that.loadLocationPopupList();
						
						var assetModel = new EditorModel();
						assetModel.url = 'editor/asset/' + that.currentLocation.loc_id;
						that.listenTo(assetModel, 
							'sync', 
							function(method, model, options) {
								/**
								 * filter model if already exist objects list
								 */
								var filteredModel = _.filter(model, function(item) {
									var findObj = _.findWhere(that.edtSceneMgr.getObjectList(), {'asset_id': item.asset_id});
									return (findObj) ? false : true;
								});
								//console.log(filteredModel);
								model = filteredModel;
								
								if(model.length > 0) {
									w2ui.idcEditor_AddObjectPopupAssetTable.selectNone();
									w2ui.idcEditor_AddObjectPopupAssetTable.records = model;
									w2ui.idcEditor_AddObjectPopupAssetTable.refresh();
									w2ui.idcEditor_AddObjectPopupAssetTable.unlock();
								} else {
									w2ui.idcEditor_AddObjectPopupAssetTable.lock();
								}
							}
						);
						assetModel.fetch();
					}
				},
				onToggle: function (event) { 
					event.onComplete = function () {
						w2ui.layout.resize();
					}
				},
				onDone: function () {
					w2popup.close();
				},
				onClose: function () {
					w2ui.idcEditor_AddObjectPopupAssetTable.destroy();
				}
			});
		},
		openPopupAddObject: function() {
			var bodyHTML = ''+
				'<div class="w2ui-centered content-idc">'+
					//'<div id="idcEditor_AddObjectPopupContents" style="width:100%; height:415px; margin-bottom: 6px; background-color: #1b1b1b;"></div>'+
					'<div id="idcEditor_AddObjectPopupContents" style="width:100%; height:415px; margin-bottom: 6px;"></div>'+
					'<div id="idcEditor_AddObjectPopupBottom">'+
						'<button id="idcEditor_BtnAddObjectPopupDone" class="darkButton">Done</button>'+
					'</div>'+
				'</div>';
			
			w2popup.open({
				title : 'Add New Object',
				width : 600,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$("#idcEditor_AddObjectPopupContents").w2layout({
							name: 'idcEditor_AddObjectPopupLayout',
							panels:[
								{type:'left', size:'200', resizable: false, content:'<div id="idcEditor_AddObjectPopup_model_leftContents" style="background-color: inherit !important;"></div>'},
								{type:'main', content:'<div id="idcEditor_AddObjectPopup_model_mainContents" style="height:415px;"></div>'}
							]
						});
						
						$('#idcEditor_AddObjectPopup_model_leftContents').w2sidebar({
							name: 'idcEditor_AddObjectPopupTree',
							style: 'padding:5px; width:100%; height:415px;',
							nodes: [
								{ id: 'Asset', text: 'ASSET LIST', expanded: true, group: true},
								{ id: 'Model', text: 'Non-ASSET LIST', expanded: true, group: true} // MODEL LIST
							],
							onClick: function(event) {
								var sidebar = this;
								if(!event || !event.target) {
									return;
								}
								
								var selObj = event.node;
								if(!selObj) {
									return;
								}
								
								if(selObj.is_asset === true) {
									w2ui.idcEditor_AddObjectPopupForm.goto(0);
									
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_asset_Name = selObj.asset_name;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_asset_AssetId = selObj.asset_id;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_asset_AssetName = selObj.asset_name;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_asset_AssetType = selObj.code_name;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_asset_ModelName = selObj.model_name;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_asset_ModelType = selObj.code_name;
									w2ui.idcEditor_AddObjectPopupForm.refresh();
									
									if(selObj.model_name) {
										var imgUrl = 'dist/models/' + selObj.model_name + '/' + selObj.model_name + '_pre.png';
										$('#idcEditor_AddObjectPopup_asset_Image').attr('src', imgUrl);
									} else {
										$('#idcEditor_AddObjectPopup_asset_Image').attr('src', '');
									}
								} else {
									w2ui.idcEditor_AddObjectPopupForm.goto(1);
									
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_model_Name = '';
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_model_ModelName = selObj.model_name;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_model_ModelType = selObj.code_name;
									w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_model_ModelDesc = selObj.model_desc;
									w2ui.idcEditor_AddObjectPopupForm.refresh();
									
									if(selObj.model_name) {
										var imgUrl = 'dist/models/' + selObj.model_name + '/' + selObj.model_name + '_pre.png';
										$('#idcEditor_AddObjectPopup_model_Image').attr('src', imgUrl);
									} else {
										$('#idcEditor_AddObjectPopup_model_Image').attr('src', '');
									}
								}
							}
						});
						
						that.loadAssetList();
						
						that.loadModelList();
						
						var formHTML = ''+
						'<div class="w2ui-page page-0" style="overflow: hidden;">'+
							'<div class="w2ui-field">'+
								'<label>NAME</label>'+
								'<div><input name="idcEditor_AddObjectPopup_asset_Name" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>ASSET ID</label>'+
								'<div><input name="idcEditor_AddObjectPopup_asset_AssetId" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>ASSET NAME</label>'+
								'<div><input name="idcEditor_AddObjectPopup_asset_AssetName" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>ASSET TYPE</label>'+
								'<div><input name="idcEditor_AddObjectPopup_asset_AssetType" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL NAME</label>'+
								'<div><input name="idcEditor_AddObjectPopup_asset_ModelName" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL TYPE</label>'+
								'<div><input name="idcEditor_AddObjectPopup_asset_ModelType" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div id="idcEditor_AddObjectPopup_asset_Image_container">'+
								'<div style="width:346px;" >'+
									'<img id="idcEditor_AddObjectPopup_asset_Image" class="idcEditor_modelImage" src="" onerror="this.src=\'dist/img/common/no_image.png\'">'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="w2ui-page page-1" style="overflow: hidden;">'+
							'<div class="w2ui-field">'+
								'<label>NAME</label>'+
								'<div><input name="idcEditor_AddObjectPopup_model_Name" type="text" class="field-inputtext" maxlength="40" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL NAME</label>'+
								'<div><input name="idcEditor_AddObjectPopup_model_ModelName" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL TYPE</label>'+
								'<div><input name="idcEditor_AddObjectPopup_model_ModelType" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL DESC</label>'+
								'<div><input name="idcEditor_AddObjectPopup_model_ModelDesc" type="text" class="field-inputtext" maxlength="50" size="34" style="width:222px;" /></div>'+
							'</div>'+
							'<div id="idcEditor_AddObjectPopup_model_Image_container">'+
								'<div style="width:346px;" >'+
									'<img id="idcEditor_AddObjectPopup_model_Image" class="idcEditor_modelImage" src="" onerror="this.src=\'dist/img/common/no_image.png\'">'+
								'</div>'+
							'</div>'+
						'</div>';
						
						$('#idcEditor_AddObjectPopup_model_mainContents').html(formHTML);
						
						$('#idcEditor_AddObjectPopup_model_mainContents').w2form({
							name : 'idcEditor_AddObjectPopupForm',
							//focus : 0,
							fields : [
								{name: 'idcEditor_AddObjectPopup_asset_Name', type: 'text', disabled: true, required: false, html: {caption: 'NAME'}},
								{name: 'idcEditor_AddObjectPopup_asset_AssetId', type: 'text', disabled: true, required: false, html: {caption: 'ASSET ID'}},
								{name: 'idcEditor_AddObjectPopup_asset_AssetName', type: 'text', disabled: true, required: false, html: {caption: 'ASSET NAME'}},
								{name: 'idcEditor_AddObjectPopup_asset_AssetType', type: 'text', disabled: true, required: false, html: {caption: 'ASSET TYPE'}},
								{name: 'idcEditor_AddObjectPopup_asset_ModelName', type: 'text', disabled: true, required: false, html: {caption: 'MODEL NAME'}},
								{name: 'idcEditor_AddObjectPopup_asset_ModelType', type: 'text', disabled: true, required: false, html: {caption: 'MODEL TYPE'}},
								{name: 'idcEditor_AddObjectPopup_model_Name', type: 'alphanumeric', disabled: false, required: true, html: {caption: 'NAME'}},
								{name: 'idcEditor_AddObjectPopup_model_ModelName', type: 'text', disabled: true, required: false, html: {caption: 'MODEL NAME'}},
								{name: 'idcEditor_AddObjectPopup_model_ModelType', type: 'text', disabled: true, required: false, html: {caption: 'MODEL TYPE'}},
								{name: 'idcEditor_AddObjectPopup_model_ModelDesc', type: 'text', disabled: true, required: false, html: {caption: 'MODEL DESC'}}
							],
							record : {
								idcEditor_AddObjectPopup_asset_Name : '',
								idcEditor_AddObjectPopup_asset_AssetId : '',
								idcEditor_AddObjectPopup_asset_AssetName : '',
								idcEditor_AddObjectPopup_asset_AssetType : '',
								idcEditor_AddObjectPopup_asset_ModelName : '',
								idcEditor_AddObjectPopup_asset_ModelType : '',
								idcEditor_AddObjectPopup_model_Name : '',
								idcEditor_AddObjectPopup_model_ModelName : '',
								idcEditor_AddObjectPopup_model_ModelType : '',
								idcEditor_AddObjectPopup_model_ModelDesc : ''
							}
						});
					}
				},
				onToggle: function (event) { 
					event.onComplete = function () {
						w2ui.layout.resize();
					}
				},
				onDone: function () {
					w2popup.close();
				},
				onClose: function () {
					w2ui.idcEditor_AddObjectPopupTree.destroy();
					w2ui.idcEditor_AddObjectPopupForm.destroy();
					w2ui.idcEditor_AddObjectPopupLayout.destroy();
				}
			});
		},
		loadAssetList: function() {
			var assetModel = new EditorModel();
			assetModel.url = 'editor/asset/' + that.currentLocation.loc_id;
			that.listenTo(assetModel, 
				'sync', 
				function(method, model, options) {
					/**
					 * filter model if already exist objects list
					 */
					var filteredModel = _.filter(model, function(item) {
						var findObj = _.findWhere(that.edtSceneMgr.getObjectList(), {'asset_id': item.asset_id});
						return (findObj) ? ((findObj.objectState === 'DELETE') ? true : false) : true;
					});
					
					model = filteredModel;
					
					if(!model || model.length == 0) {
						return;
					}
					
					try {
						var rootNodes = [];
						
						model.forEach(function(item,idx) {
							var newItem = $.extend({}, item);
							newItem.id = newItem.asset_id;
							newItem.text = newItem.asset_name;
							newItem.img = '';
							newItem.icon = that.getObjectIcon(newItem.code_name);
							newItem.is_asset = true;
							rootNodes.push(newItem);
							
//							var findGroup = _.findWhere(rootNodes, {'id': newItem.code_id});
//							if(findGroup) {
//								findGroup.nodes.push(newItem);
//							} else {
//								rootNodes.push({
//									id: newItem.code_id,
//									text: newItem.code_name,
//									img: 'fa icon-folder',
//									icon: '',
//									is_asset: true,
//									expanded: true,
//									disabled: true,
//									nodes: [newItem]
//								});
//							}
						});
						
						that.availableAssetList = rootNodes;
						
						w2ui.idcEditor_AddObjectPopupTree.insert('Asset', null, rootNodes);
					} catch(e) {
						console.log(e);
					}
				}
			);
			assetModel.fetch();
		},
		loadModelList: function() {
			var modelModel = new EditorModel();
			modelModel.url = 'editor/model';
			that.listenTo(modelModel, 
				'sync', 
				function(method, model, options) {
					try {
						var rootNodes = [];
						
						model.forEach(function(item,idx) {
							var newItem = $.extend({}, item);
							newItem.id = newItem.model_id;
							newItem.text = newItem.model_name;
							newItem.img = '';
							newItem.icon = that.getObjectIcon(newItem.code_name);
							newItem.is_asset = false;
							//rootNodes.push(newItem);
							
							var findGroup = _.findWhere(rootNodes, {'id': newItem.code_id});
							if(findGroup) {
								findGroup.nodes.push(newItem);
							} else {
								rootNodes.push({
									id: newItem.code_id,
									text: newItem.code_name,
									img: 'fa icon-folder',
									icon: '',
									is_asset: false,
									expanded: true,
									disabled: true,
									nodes: [newItem]
								});
							}
						});
						
						w2ui.idcEditor_AddObjectPopupTree.insert('Model', null, rootNodes);
					} catch(e) {
						console.log(e);
					}
				}
			);
			modelModel.fetch();
		},
		createLocationTree: function(objectArray, rootId) {
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

				var icon = that.getObjectIcon(item.code_name);
				
				var newItem = $.extend({}, item);
				newItem.id = item.loc_name;
				newItem.text = item.loc_name;
				newItem.icon = icon;
				newItem.loc_id = item.loc_id;
				newItem.expanded = true;
				//target.push({ id: item.loc_name, text: item.loc_name, icon: icon, loc_id: item.loc_id, expanded: true});
				target.push(newItem);
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
		createObjectTree: function(objectArray, rootId) {
			if(!objectArray) {
				return;
			}
			
			var rootNodes = [], nodes = {};
			var root_id = '-1';
			if(rootId) {
				root_id = rootId + '';
			}

			// find the top level nodes and hash the children based on parent
			for (var i = 0, len = objectArray.length; i < len; ++i) {
				var item = objectArray[i];
				var p = item.parent_loc_id;
				//var p = (item.comp_type === 'LOCATION') ? item.comp_id : item.parent_loc_id;
				var target = (p === root_id) ? rootNodes : (nodes[p] || (nodes[p] = []));

				var icon = that.getObjectIcon(item.code_name);
				
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
		getObjectIcon: function(type) {
			var icon;
			
			switch(type) {
				case LOCATION_TYPE.SITE:
					icon = 'far fa-map fa-lg';
					break;
				case LOCATION_TYPE.BUILDING:
					icon = 'far fa-building fa-lg';
					break;
				case LOCATION_TYPE.FLOOR:
					icon = 'fas fa-align-justify fa-lg';
					break;
				case LOCATION_TYPE.ROOM:
					icon = 'fab fa-gg fa-lg';
					break;
				default:
					icon = 'fas fa-cube fa-lg';
					break;
			}
			
			return icon;
		},
		selectLocationFromPopup: function(event) {
			var selId = w2ui.idcEditor_SidebarLocationPopup.selected;
			if(!selId) {
				return;
			}
			
			if(!that.locationList) {
				return;
			}
			
			that.changeLocation( _.findWhere(that.locationList, {'loc_name': selId}) );
			w2popup.close();
		},
		selectAddObjectFromPopup_old: function() {
			var selectedList = w2ui.idcEditor_AddObjectPopupAssetTable.getSelection();
			if(!selectedList || selectedList.length === 0) {
				return;
			}
			
			var addNewObjectList = [];
			selectedList.forEach(function(item,idx) {
				var selObj = _.findWhere(w2ui.idcEditor_AddObjectPopupAssetTable.records, {'recid': item});
				
				var newObj = {
					parent_loc_id: that.currentLocation.loc_id + '',
					comp_id: selObj.asset_id,
					comp_name: selObj.asset_id,
					comp_type: 'ASSET',
					asset_id: selObj.asset_id,
					code_id: selObj.code_id,
					code_name: selObj.code_name,
					model_id: selObj.model_id,
					model_name: selObj.model_name,
					position_x: 0,
					position_y: 0,
					position_z: 0,
					scale_x: 1,
					scale_y: 1,
					scale_z: 1,
					rotation_x: 0,
					rotation_y: 0,
					rotation_z: 0,
					is_pickable: true,
					is_tooltip: true,
					is_visible: true,
					opacity: 1,
					camera: null,
					reserve_str: null,
					objectState: 'INSERT'
				};
				addNewObjectList.push(newObj);
			});
			
			that.edtSceneMgr.addObject(addNewObjectList);
			
//			that.changeLocation( _.findWhere(that.locationList, {'loc_name': selId}) );
			w2popup.close();
		},
		selectAddObjectFromPopup: function() {
			var selId = w2ui.idcEditor_AddObjectPopupTree.selected;
			if(!selId) {
				return;
			}

			var selObj = w2ui.idcEditor_AddObjectPopupTree.get(selId);
			if(!selObj) {
				return;
			}
			
			if(selObj.is_asset !== true) {
				if(w2ui.idcEditor_AddObjectPopupForm.validate().length > 0) {
					return;
				}
			}
			
			/**
			 * check duplicate
			 */
			var compName = w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_model_Name;
			var findObj = _.findWhere(that.edtSceneMgr.getObjectList(), {'name': compName});
			if(findObj) {
				w2alert('Object "' + compName + '" already exists on the Object List or Database.');
				return;
			} else {
				findObj = _.findWhere(that.availableAssetList, {'asset_name': compName});
				if(findObj) {
					w2alert('Object "' + compName + '" already exists on the Object List or Database.');
					return;
				}
			}
			
			/**
			 * add new object
			 */
			var addNewObjectList = [];
			var newObj = {
				parent_loc_id: that.currentLocation.loc_id + '',
				comp_id: (selObj.is_asset === true) ? selObj.asset_name : that.createUID(),
				comp_name: (selObj.is_asset === true) ? selObj.asset_name : w2ui.idcEditor_AddObjectPopupForm.record.idcEditor_AddObjectPopup_model_Name,
				comp_type: 'ASSET',
				asset_id: (selObj.is_asset === true) ? selObj.asset_id : null,
				na_model_id: (selObj.is_asset === true) ? null : selObj.model_id,
				code_id: selObj.code_id,
				code_name: selObj.code_name,
				model_id: selObj.model_id,
				model_name: selObj.model_name,
				position_x: 0,
				position_y: 0,
				position_z: 0,
				scale_x: 1,
				scale_y: 1,
				scale_z: 1,
				rotation_x: 0,
				rotation_y: 0,
				rotation_z: 0,
				is_pickable: (selObj.is_asset === true) ? true : false,
				is_tooltip: (selObj.is_asset === true) ? true : false,
				is_visible: true,
				opacity: 1,
				camera: null,
				reserve_str: null,
				objectState: 'INSERT'
			};
			console.log('new object =>');
			console.log(newObj);
			addNewObjectList.push(newObj);
			
			that.edtSceneMgr.addObject(addNewObjectList);
			
//			that.changeLocation( _.findWhere(that.locationList, {'loc_name': selId}) );
			w2popup.close();
		},
		changeLocation: function(location, reload) {
			if(!location) {
				return;
			}
			
			if(!reload && that.currentLocation && that.currentLocation.loc_id === location.loc_id) {
				return;
			}
			
			that.currentLocation = location;
			that.setLocationLabel(that.currentLocation.loc_name);
			
			that.edtSceneMgr.createScene(that.editorOptions);
			
			
			/**
			 * load objectList
			 */
			var objectModel = new EditorModel();
			objectModel.url = 'editor/object/' + that.currentLocation.loc_id;
			that.listenTo(objectModel, 'sync', that.setObjectList);
			objectModel.fetch();

//			window.addEventListener('resize', function() {
//				that.edtSceneMgr.resizeEngine();
//			});
		},
		setObjectList: function(method, model, options)  {
			that.edtSceneMgr.loadMeshes(model, that.currentLocation);
		},
		setLocationLabel: function(name) {
			$('#idcEditor_LocationResultBoard').text(name);
			$('#idcEditor_LocationResultBoard').attr('title', name);
		},
		divisionMaskOn: function(elemId, parentMaskDivId) {
			var elem = $('#' + elemId);
			if (!elem) {
				return;
			}

			var maskDiv = elem.data('maskDiv');
			if (!maskDiv) {
				maskDiv = $('<div style="position:fixed; display:inline;"></div>');
				
				var parentMaskDivElem = $('#' + parentMaskDivId);
				if(parentMaskDivId !== undefined && parentMaskDivElem) {
					parentMaskDivElem.append(maskDiv);	
				} else {
					$('body').append(maskDiv);
				}
				parentMaskDivElem = null;
				
				elem.data('maskDiv', maskDiv);
			}
			
			maskDiv.width(elem.outerWidth());
			maskDiv.height(elem.outerHeight());
			maskDiv.offset($(elem).offset());
			
			elem = null;

			// set styles
			//maskDiv[0].style.backgroundColor = 'transparent';
			maskDiv[0].style.backgroundColor = 'inherit';
			maskDiv[0].style.opacity = 0.4;
			maskDiv[0].style.zIndex = 999;

			return maskDiv;
		},
		divisionMaskOff: function(elemId) {
			var elem = $('#' + elemId);
			if (!elem)
				return;

			var maskDiv = elem.data('maskDiv');
			if (!maskDiv) {
				//console.log('maskOff no mask !');
				return;
			}

			elem.removeData('maskDiv');
			maskDiv.remove();
		},
		createUID: function(){
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		},
		/*
		 * Page Destroy
		 */
		destroy: function() {
			console.log('IDC Editor destroy');
			
			if(that.edtSceneMgr) {
				that.edtSceneMgr.destroy();
			}
			
			that.undelegateEvents();
			that.unRegisterOtherEvents();
			
			if (w2ui.idcEditor_SidebarLocationPopup)
				w2ui.idcEditor_SidebarLocationPopup.destroy();
			
			if (w2ui.idcEditor_AddObjectPopupAssetTable)
				w2ui.idcEditor_AddObjectPopupAssetTable.destroy();

			if (w2ui.idcEditor_AddObjectPopupTree)
				w2ui.idcEditor_AddObjectPopupTree.destroy();
			
			if (w2ui.idcEditor_AddObjectPopupTree)
				w2ui.idcEditor_AddObjectPopupForm.destroy();
			
			if (w2ui.idcEditor_AddObjectPopupLayout)
				w2ui.idcEditor_AddObjectPopupLayout.destroy();

			if (w2ui.idcEditor_ObjectsTree)
				w2ui.idcEditor_ObjectsTree.destroy();
			
			if (w2ui.idcEditor_Form_EditorOptions)
				w2ui.idcEditor_Form_EditorOptions.destroy();
			
			if (w2ui.idcEditor_Form_Properties)
				w2ui.idcEditor_Form_Properties.destroy();
			
			if (w2ui.idcEditor_Form_Options)
				w2ui.idcEditor_Form_Options.destroy();
		}
	});
	
	return Main;
});