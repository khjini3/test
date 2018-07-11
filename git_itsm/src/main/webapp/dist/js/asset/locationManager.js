define([
	'jquery',
	'underscore',
	'backbone',
	'text!views/asset/locationManager',
	'w2ui',
	"js/lib/component/BundleResource",
	'css!cs/asset/locationManager'
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
    BundleResource
){
	var that;
	
	var LOCATION_TYPE = {
		SITE: 'SITE',
		BUILDING: 'BUILDING',
		FLOOR: 'FLOOR',
		ROOM: 'ROOM'
	};
	
	var Model = Backbone.Model.extend({
	});
	
	var LocationModel = Backbone.Collection.extend({
		model: Model,
		url: 'locationManager/location',
//		parse: function(result) {
//			return {data: result};
//		}
	});
	
	var Main = Backbone.View.extend({
		el: '.content .wrap',
		initialize : function() {
			that = this;
			LOCMGR = that; // GLOBAL
			
			this.locationModel = null;
			this.locationTypeList = null;
			this.modelList = null;
			this.selectedLocationId = null;
			
			this.$el.append(JSP);
			
			this.start();
		},
		
		start: function() {
			that.initGUI();
			
			that.loadLocationList();
			that.loadLocationTypeList();
			that.loadModelList();
			
			that.registerOtherEvents();
		},
		events: {
			'click #locMgr_RefreshBtn' : 'refreshLocation',
			'click #locMgr_AddBtn' : 'addLocation',
			'click #locMgr_DelBtn' : 'deleteLocation',
			'click #locMgr_ModifyBtn' : 'modifyLocation',
			'click #locMgr_SaveBtn' : 'saveModifyLocation',
			'click #locMgr_CancelBtn' : 'endModifyLocation',
		},
		registerOtherEvents: function() {
			$(document).on('click', '#locMgr_BtnAddLocationPopupDone', function(event) {
				that.addLocationAction();
			});
		},
		unRegisterOtherEvents: function() {
			$(document).off('click', '#locMgr_BtnAddLocationPopupDone');
		},
		initGUI: function(){
			$('#LOCATION-MANAGER-MAIN').w2layout({
				name:'locMgr_layout',
				panels:[
					{type:'left', size:450, resizable: false, content:'<div id="locMgr_leftContents"></div>'},
					{type:'main', size:'100%', content:'<div id="locMgr_mainContents"></div>'}
				]
			});
			
			var leftContent = '';
			leftContent = ''+
			'<div id="locMgr_leftContents_top" style="height:35px">'+
				/*'<div id="locMgr_leftContents_top_left">'+
					'<i id="locMgr_RefreshBtn" class="icon link fas fa-sync-alt fa-2x" aria-hidden="true" title="Refresh"></i>'+
				'</div>'+*/ //Block Refresh button by gihwan - 2018-02-28
				'<div id="locMgr_leftContents_top_right">'+
					'<i id="locMgr_AddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					'<i id="locMgr_DelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Delete"></i>'+
					'<i id="locMgr_ModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Modify"></i>'+
				'</div>'+
			'</div>'+
			'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Location List</div>'+
	    		'<div class="dashboard-contents"><div id="locMgr_leftContents_center"></div></div>'+
	    	'</div>';
			
			$('#locMgr_leftContents').html(leftContent);
			

			$('#locMgr_leftContents_center').w2sidebar({
				name : 'locMgr_locationTree',
				bottomHTML : '<div id="bottomTree"></div>',
				nodes: [
					{
						id: 'locationList', text: 'LOCATION LIST', expanded: true, group: true, 
						nodes: [{id: 'root', text: 'ROOT', expanded: true, img: 'fa icon-folder'}]
					}
				],
				onClick: function(event) {
                	var sidebar = this;
					if(event && event.target) {
						var selObj = event.node;
						if(!selObj) {
							return;
						}
						
						that.selectLocation(selObj);
					}
				}
			});
			
			w2ui["locMgr_locationTree"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
				that.btnValidationFunc();
        	});
        	
        	w2ui["locMgr_locationTree"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.btnValidationFunc();
        	});
			
			var mainSub = '';
			mainSub = ''+
			'<div id="locMgr_mainContents_top"></div>'+
			'<div id="locMgr_mainContents_center">'+
				'<div class="dashboard-panel" style="width:100%">'+
		    		'<div class="dashboard-title">Detailed Location Information</div>'+
		    		'<div class="dashboard-contents" id="detailInfo">'+
		    		
		    		'<div class="w2ui-page page-0">'+
						'<div style="height: 100%">'+
							'<div class="w2ui-field">'+
								'<label>LOCATION ID</label>'+
								'<div><input name="locMgr_locationForm_locId" type="text" size="60"/></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>NAME</label>'+
								'<div><input name="locMgr_locationForm_locName" type="text" size="60"/></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>TYPE</label>'+
								'<div><input name="locMgr_locationForm_locType" type="combo" size="60"/></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL NAME</label>'+
								'<div><input name="locMgr_locationForm_modelName" type="combo" size="60"/></div>'+
							'</div>'+
							'<div id="locMgr_locationForm_modelImage_container">'+
								'<div style="width: 352px; height: 150px;">'+
									'<img id="locMgr_locationForm_modelImage" class="logMgr_modelImage" style="" src="" onerror="this.src=\'dist/img/common/no_image.png\'">'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="w2ui-page page-1">'+
						'<div style="height: 100%">'+
							'<div class="w2ui-field">'+
								'<label>LOCATION ID</label>'+
								'<div><input name="locMgr_locationForm_EditMode_locId" type="text" maxlength="10" size="60"/></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>NAME</label>'+
								'<div><input name="locMgr_locationForm_EditMode_locName" type="text" maxlength="20" size="60"/></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>TYPE</label>'+
								'<div><input name="locMgr_locationForm_EditMode_locType" type="combo" size="60"/></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL NAME</label>'+
								'<div><input name="locMgr_locationForm_EditMode_modelName" type="combo" size="60"/></div>'+
							'</div>'+
							'<div id="locMgr_locationForm_EditMode_modelImage_container">'+
								'<div>'+
									'<img id="locMgr_locationForm_EditMode_modelImage" class="logMgr_modelImage" style="" src="" onerror="this.src=\'dist/img/common/no_image.png\'">'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
		    		
		    		'</div>'+
	    		'</div>'+
			'</div>';
			
			$('#locMgr_mainContents').html(mainSub);
			
			var rightContent = '';
			rightContent = ''+
			'<div id="locMgr_mainContents_top_toolbar" style="width:100%;height:100%;visibility:hidden; ">'+
				'<i id="locMgr_SaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save"></i>'+
				'<i id="locMgr_CancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel"></i>'+
			'</div>';
			
			$('#locMgr_mainContents_top').html(rightContent);
			
			$('#detailInfo').w2form({ 
				name: 'locMgr_locationForm',
				focus: 1,
				fields: [
					{name:'locMgr_locationForm_locId', type:'text', disabled:true, required:false, html:{caption:'LOCATION ID'}},
					{name:'locMgr_locationForm_locName', type:'text', disabled:true, required:false, html:{caption:'NAME'}},
					{name:'locMgr_locationForm_locType', type:'text', disabled:true, required:false, html:{caption:'TYPE'}},
					{name:'locMgr_locationForm_modelName', type:'text', disabled:true, required:false, html:{caption:'MODEL NAME'}},
					
					{name:'locMgr_locationForm_EditMode_locId', type:'int', disabled:true, required:false, html:{caption:'LOCATION ID'}, options:{autoFormat:false, min:0, max:2147483647}},
					{name:'locMgr_locationForm_EditMode_locName', type:'alphanumeric', disabled:false, required:true, html:{caption:'NAME'}},
					{name:'locMgr_locationForm_EditMode_locType', type:'list', disabled:false, required:true, html:{caption:'TYPE'}, options:{items:that.locationTypeList}},
					{name:'locMgr_locationForm_EditMode_modelName', type:'list', disabled:false, required:true, html:{caption:'MODEL NAME'}}
				],
				record: {
					locMgr_locationForm_locId: '',
					locMgr_locationForm_locName: '',
					locMgr_locationForm_locType: '',
					locMgr_locationForm_modelName: '',
					
					locMgr_locationForm_EditMode_locId: '',
					locMgr_locationForm_EditMode_locName: '',
					locMgr_locationForm_EditMode_locType: '',
					locMgr_locationForm_EditMode_modelName: '',
				},
				onChange: function(event) {
					if(!event.value_new) {
						return;
					}
					
//					if(event.target === 'locMgr_locationForm_modelName') {
//						if(event.value_new.model_name) {
//							var imgUrl = 'dist/models/' + event.value_new.model_name + '/' + event.value_new.model_name + '_pre.png';
//							$('#locMgr_locationForm_modelImage').attr('src', imgUrl);
//						} else {
//							$('#locMgr_locationForm_modelImage').attr('src', '');
//						}
//					}
					
					if(event.target === 'locMgr_locationForm_EditMode_locType') {
						setTimeout(function() {
							var filteredList = _.filter(that.modelList, function(item) {
								return (event.value_new.code_name == item.code_name) ? true : false;
							});
							w2ui.locMgr_locationForm.set('locMgr_locationForm_EditMode_modelName', {options:{items:filteredList}});
							var selectedModelName = w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_modelName;

							if(selectedModelName.model_id && _.findWhere(filteredList, {model_id:selectedModelName.model_id})) {
								w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_modelName = selectedModelName;
							} else {
								w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_modelName = '';
								$('#locMgr_locationForm_EditMode_modelImage').attr('src', '');
							}
							
							w2ui.locMgr_locationForm.refresh();
						}, 10);
					} else if(event.target === 'locMgr_locationForm_EditMode_modelName') {
						if(event.value_new.model_name) {
							var imgUrl = 'dist/models/' + event.value_new.model_name + '/' + event.value_new.model_name + '_pre.png';
							$('#locMgr_locationForm_EditMode_modelImage').attr('src', imgUrl);
						} else {
							$('#locMgr_locationForm_EditMode_modelImage').attr('src', '');
						}
					}
				}
			});
			
			$("#locMgr_DelBtn").prop('disabled', true);
			$("#locMgr_DelBtn").removeClass('link');
			$("#locMgr_ModifyBtn").prop('disabled', true);
			$("#locMgr_ModifyBtn").removeClass('link');
		},
		
		btnValidationFunc : function(){
			if(w2ui['locMgr_locationTree'].selected !== null){
				$("#locMgr_DelBtn").prop('disabled', false);
				$("#locMgr_DelBtn").addClass('link');
				
				$("#locMgr_ModifyBtn").prop('disabled', false);
				$("#locMgr_ModifyBtn").addClass('link');
			}else{
				$("#locMgr_DelBtn").prop('disabled', true);
				$("#locMgr_DelBtn").removeClass('link');
				
				$("#locMgr_ModifyBtn").prop('disabled', true);
				$("#locMgr_ModifyBtn").removeClass('link');
			}
		},
		
		loadLocationList: function() {
			that.locationModel = new LocationModel();
			//that.locationModel.fetch({reset:true});
			that.listenTo(that.locationModel, 'sync', that.setLocationList);
			that.locationModel.fetch();
		},
		loadLocationTypeList: function() {
			var locationTypeListModel = new Model();
			locationTypeListModel.url = 'locationManager/locationType';
			that.listenTo(locationTypeListModel, 
				'sync', 
				function(method, model, options) {
					console.log(model);
					try {
						that.locationTypeList = [];
						
						model.forEach(function(item,idx) {
							var newItem = $.extend({}, item);
							
							newItem.id = that.locationTypeList.length + 1;
							newItem.text = newItem.code_name;
							that.locationTypeList.push(newItem);
						});
					} catch(e) {
						console.log(e);
					}
				}
			);
			locationTypeListModel.fetch();
		},
		loadModelList: function() {
			var modelModel = new Model();
			modelModel.url = 'editor/model';
			that.listenTo(modelModel, 
				'sync', 
				function(method, model, options) {
					try {
						that.modelList = [];
						
						model.forEach(function(item,idx) {
							var newItem = $.extend({}, item);
							
							newItem.id = that.modelList.length + 1;
							newItem.text = newItem.model_name;
							that.modelList.push(newItem);
						});
					} catch(e) {
						console.log(e);
					}
				}
			);
			modelModel.fetch();
		},
		selectLocation: function(selObj) {
			if(!selObj) {
				return;
			}
			
			that.selectedLocationId = selObj.loc_id;
			
			w2ui.locMgr_locationTree.expandParents(that.selectedLocationId);
			w2ui.locMgr_locationTree.select(that.selectedLocationId);
			
			w2ui.locMgr_locationForm.record.locMgr_locationForm_locId = selObj.loc_id;
			w2ui.locMgr_locationForm.record.locMgr_locationForm_locName = selObj.loc_name;
			w2ui.locMgr_locationForm.record.locMgr_locationForm_locType = selObj.code_name;
			w2ui.locMgr_locationForm.record.locMgr_locationForm_modelName = selObj.model_name;
			w2ui.locMgr_locationForm.refresh();
			
			if(selObj.model_name) {
				var imgUrl = 'dist/models/' + selObj.model_name + '/' + selObj.model_name + '_pre.png';
				$('#locMgr_locationForm_modelImage').attr('src', imgUrl);
			} else {
				$('#locMgr_locationForm_modelImage').attr('src', '');	
			}
		},
		refreshLocation: function(event) {
			that.loadLocationList();
			that.loadLocationTypeList();
			that.loadModelList();
			
			if(that.selectedLocationId) {
				setTimeout(function() {
					var selObj = w2ui.locMgr_locationTree.get(that.selectedLocationId);
					if(!selObj) {
						that.selectedLocationId = null;
						return;
					}
					
					that.selectLocation(selObj);
				}, 100);
			}
		},
		addLocation: function(event) {
			that.openPopupAddLocation();
		},
		addLocationAction: function() {
			if(w2ui.locMgr_AddLocationPopupForm.validate().length > 0) {
				return;
			}
			
			var newLocation = {
				parent_loc_id: w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_ParentLocId,
				loc_id: w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_LocId,
				loc_name: w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_LocName,
				code_id: w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_LocType.code_id,
				model_id: w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_ModelName.model_id
			};
			
			Backbone.ajax({
				dataType: 'json',
				contentType: 'application/json',
				url: 'locationManager/location',
				method: 'post',
				data: JSON.stringify(newLocation),
				success: function(val) {
					if(val && val.result == true) {
						that.loadLocationList();
						
						//w2alert('Saved successfully.', 'Result')
						//.ok(function () {
							setTimeout(function() {
								that.selectedLocationId = newLocation.loc_id;
								that.refreshLocation();
							}, 100);
						//});
					} else {
						w2alert((val && val.failReason && val.failReason.length > 0) ? 'Failed : ' + val.failReason : 'Failed : Unknown', 'Error');
					}
				},
				error: function(val) {
					w2alert('Failed', 'Error');
				}
			});
			
			w2popup.close();
		},
		deleteLocation: function(event) {
			that.btnValidationFunc();
			
			var selObj = w2ui.locMgr_locationTree.get(w2ui.locMgr_locationTree.selected);
			if(!selObj || selObj.id === 'root') {
				return;
			}
			
			if(selObj.nodes && selObj.nodes.length > 0) {
				w2alert('The selected node has a child node.<br>Please delete the child node first.');
				
				return;
			}
			
			w2confirm(BundleResource.getString('label.locationManager.delete'), 'Delete')
			.yes(function () {
				that.updateIdcAssetLocIDAction(selObj);
				that.deleteLocationAction(selObj);
			})
			.no(function () {
				console.log('NO');
			});
		},
		deleteLocationAction: function(location) {
			var deleteLocation = {
				parent_loc_id: location.parent_loc_id,
				loc_id: location.loc_id,
				loc_name: location.loc_name,
				code_id: location.code_id,
				model_id: location.model_id
			};
			
			var parentId = location.parent.id;
			
			Backbone.ajax({
				dataType: 'json',
				contentType: 'application/json',
				url: 'locationManager/location',
				method: 'delete',
				data: JSON.stringify(deleteLocation),
				success: function(val) {
					if(val && val.result == true) {
						that.selectedLocationId = parentId;
						that.refreshLocation();
					} else {
						w2alert((val && val.failReason && val.failReason.length > 0) ? 'Failed : ' + val.failReason : 'Failed : Unknown', 'Error');
					}
				},
				error: function(val) {
					w2alert('Failed', 'Error');
				}
			});
		},
		updateIdcAssetLocIDAction: function(location){
			var updateIdcAssetLocID = {
					loc_id: location.loc_id
			}
			
			Backbone.ajax({
				dataType: 'json',
				contentType: 'application/json',
				url: 'locationManager/chgLocID',
				method: 'put',
				data: JSON.stringify(updateIdcAssetLocID),
				success: function(val){
					console.log("Change loc_id to null.");
				},
				error: function(val){
					w2alert('Failed', 'Error');
				}
			})
		},
		modifyLocation: function(event) {
			
			that.btnValidationFunc();
			
			var selObj = w2ui.locMgr_locationTree.get(w2ui.locMgr_locationTree.selected);
			if(!selObj || selObj.id === 'root') {
				return;
			}
			
			that.divisionMaskOn('locMgr_leftContents');
			
			w2ui.locMgr_locationForm.set('locMgr_locationForm_EditMode_locType', {options:{items:that.locationTypeList}});
			
			w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_locId = w2ui.locMgr_locationForm.record.locMgr_locationForm_locId;
			w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_locName = w2ui.locMgr_locationForm.record.locMgr_locationForm_locName;
			
			var locTypeObj = _.findWhere(that.locationTypeList, {'code_name': w2ui.locMgr_locationForm.record.locMgr_locationForm_locType});
			if(locTypeObj) {
				w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_locType = locTypeObj;
				
				var filteredList = _.filter(that.modelList, function(item) {
					return (locTypeObj.code_name == item.code_name) ? true : false;
				});
				w2ui.locMgr_locationForm.set('locMgr_locationForm_EditMode_modelName', {options:{items:filteredList}});
			}
			
			var modelObj = _.findWhere(that.modelList, {'model_name': w2ui.locMgr_locationForm.record.locMgr_locationForm_modelName});
			if(modelObj) {
				w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_modelName = modelObj;
			}
			
			var modelName = w2ui.locMgr_locationForm.record.locMgr_locationForm_modelName;
			if(modelName) {
				var imgUrl = 'dist/models/' + modelName + '/' + modelName + '_pre.png';
				$('#locMgr_locationForm_EditMode_modelImage').attr('src', imgUrl);
			} else {
				$('#locMgr_locationForm_EditMode_modelImage').attr('src', '');
			}
			
			w2ui.locMgr_locationForm.refresh();
			
			w2ui.locMgr_locationForm.goto(1);
			
			$('#locMgr_leftContents_top').css({visibility:'hidden'});
			
			$('#locMgr_locationForm_locName').focus();
			$('#locMgr_mainContents_top_toolbar').css('visibility', 'visible');
		},
		saveModifyLocation: function(event) {
			var selObj = w2ui.locMgr_locationTree.get(w2ui.locMgr_locationTree.selected);
			if(!selObj || selObj.id === 'root') {
				return;
			}
			
			if(w2ui.locMgr_locationForm.validate().length > 0) {
				return;
			}
			
			w2confirm(BundleResource.getString('label.locationManager.save'), 'Save')
			.yes(function () {
				that.saveModifyLocationAction(selObj);
			})
			.no(function () {
				console.log('NO');
			});
		},
		saveModifyLocationAction: function(location) {
			var updateLocation = {
				loc_id: location.loc_id,
				loc_name: w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_locName,
				code_id: w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_locType.code_id,
				model_id: w2ui.locMgr_locationForm.record.locMgr_locationForm_EditMode_modelName.model_id
			};
			
			Backbone.ajax({
				dataType: 'json',
				contentType: 'application/json',
				url: 'locationManager/location',
				method: 'put',
				data: JSON.stringify(updateLocation),
				success: function(val) {
					if(val && val.result == true) {
						that.refreshLocation();
						setTimeout(function() {
							that.endModifyLocation();
						}, 100);
					} else {
						w2alert((val && val.failReason && val.failReason.length > 0) ? 'Failed : ' + val.failReason : 'Failed : Unknown', 'Error');
					}
				},
				error: function(val) {
					w2alert('Failed', 'Error');
				}
			});
		},
		endModifyLocation: function() {
			that.divisionMaskOff('locMgr_leftContents');
			
			w2ui.locMgr_locationForm.goto(0);
			
			$('#locMgr_leftContents_top').css({visibility:'visible'});
			
			$('#locMgr_mainContents_top_toolbar').css('visibility', 'hidden');
		},
		openPopupAddLocation: function() {
			that.loadModelList();
			that.loadLocationTypeList();
			
			var parentId = '';
			var parentName = '';

			if (w2ui.locMgr_locationTree.selected === null || w2ui.locMgr_locationTree.selected === 'root') {
				parentId = -1;
				parentName = 'ROOT';
			} else {
				var selObj = w2ui.locMgr_locationTree.get(w2ui.locMgr_locationTree.selected);
				parentId = selObj.loc_id;
				parentName = selObj.loc_name;
			}

			var bodyHTML = ''+
			'<div class="w2ui-centered">'+
				'<div id="locMgr_AddLocationPopupContents" style="width:100%; height:100%" ></div>'+
				'<div id="locMgr_AddLocationPopupBottom">'+
				'</div>'
			'</div>';

			w2popup.open({
				title: BundleResource.getString('title.locationManager.addLocation'),
				body: bodyHTML,
				width: 400,
				height: 420,
				opacity: '0.5',
				modal: true,
				showClose: true,
				style: 'overflow:hidden;',

				onOpen: function(event) {
					event.onComplete = function() {
						$('#locMgr_AddLocationPopupBottom').html('<button id="locMgr_BtnAddLocationPopupDone" class="darkButton">'+BundleResource.getString('button.locationManager.done')+'</button>');
						
						var formHTML = ''+
						'<div class="w2ui-page page-0">'+
							'<div class="w2ui-field">'+
								'<label>PARENT NAME</label>'+
								'<div><input name="locMgr_AddLocationPopup_ParentLocName" type="text" class="field-inputtext" size="28" style="width:186px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>LOCATION ID</label>'+
								'<div><input name="locMgr_AddLocationPopup_LocId" type="text" class="field-inputtext" maxlength="10" size="28" style="width:186px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>NAME</label>'+
								'<div><input name="locMgr_AddLocationPopup_LocName" type="text" class="field-inputtext" maxlength="20" size="28" style="width:186px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>TYPE</label>'+
								'<div><input name="locMgr_AddLocationPopup_LocType" type="text" class="field-inputtext" size="28" style="width:186px;" /></div>'+
							'</div>'+
							'<div class="w2ui-field">'+
								'<label>MODEL NAME</label>'+
								'<div><input name="locMgr_AddLocationPopup_ModelName" type="text" class="field-inputtext" size="28" style="width:186px;" /></div>'+
							'</div>'+
							'<div id="locMgr_AddLocationPopup_modelImage_container">'+
								'<div>'+
									'<img id="locMgr_AddLocationPopup_modelImage" class="logMgr_modelImage" src="" onerror="this.src=\'dist/img/common/no_image.png\'">'+
								'</div>'+
							'</div>'+
						'</div>';
						
						$('#locMgr_AddLocationPopupContents').html(formHTML);
						
						$('#locMgr_AddLocationPopupContents').w2form({
							name: 'locMgr_AddLocationPopupForm',
							style: 'border:1px solid rgba(0,0,0,0)',
							focus: 1,
							fields: [
								{name:'locMgr_AddLocationPopup_ParentLocName', type:'text', disabled:true, required:false, html:{caption:'PARENT NAME'}},
								{name:'locMgr_AddLocationPopup_LocId', type:'int', disabled:false, required:true, html:{caption:'LOCATION ID'}, options:{autoFormat:false, min:0, max:2147483647}},
								{name:'locMgr_AddLocationPopup_LocName', type:'alphanumeric', disabled:false, required:true, html: {caption:'NAME'}},
								{name:'locMgr_AddLocationPopup_LocType', type:'list', disabled:false, required:true, html:{caption:'TYPE'}, options:{items:that.locationTypeList}},
								//{name:'locMgr_AddLocationPopup_ModelName', type:'list', disabled:false, required:true, html:{caption:'MODEL NAME'}, options:{items:that.modelList}}
								{name:'locMgr_AddLocationPopup_ModelName', type:'list', disabled:false, required:true, html:{caption:'MODEL NAME'}}
							],
							record: {
								locMgr_AddLocationPopup_ParentLocName:parentName,
								locMgr_AddLocationPopup_LocId:'',
								locMgr_AddLocationPopup_LocName:'',
								locMgr_AddLocationPopup_LocType:'',
								locMgr_AddLocationPopup_ModelName:'',
								
								locMgr_AddLocationPopup_ParentLocId:parentId
							},
							onChange: function(event) {
								if(!event.value_new) {
									return;
								}
								
								if(event.target === 'locMgr_AddLocationPopup_LocType') {
									setTimeout(function() {
										var filteredList = _.filter(that.modelList, function(item) {
											return (event.value_new.code_name == item.code_name) ? true : false;
										});
										w2ui.locMgr_AddLocationPopupForm.set('locMgr_AddLocationPopup_ModelName', {options:{items:filteredList}});
										var selectedModelName = w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_ModelName;
	
										if(selectedModelName.model_id && _.findWhere(filteredList, {model_id:selectedModelName.model_id})) {
											w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_ModelName = selectedModelName;
										} else {
											w2ui.locMgr_AddLocationPopupForm.record.locMgr_AddLocationPopup_ModelName = '';
											$('#locMgr_AddLocationPopup_modelImage').attr('src', '');
										}
										
										w2ui.locMgr_AddLocationPopupForm.refresh();
									}, 10);
								} else if(event.target === 'locMgr_AddLocationPopup_ModelName') {
									if(event.value_new.model_name) {
										var imgUrl = 'dist/models/' + event.value_new.model_name + '/' + event.value_new.model_name + '_pre.png';
										$('#locMgr_AddLocationPopup_modelImage').attr('src', imgUrl);
									} else {
										$('#locMgr_AddLocationPopup_modelImage').attr('src', '');
									}
								}
							}
						});
					}
				},

				onClose: function(event) {
					w2ui.locMgr_AddLocationPopupForm.destroy();
				}
			});
		},
		setLocationList: function(method, model, options){
			var rootNodes = [];
			
			var treeNode = that.createLocationTree(method.toJSON(), -1);
			
			w2ui.locMgr_locationTree.remove('root');
			w2ui.locMgr_locationTree.add([{id: 'root', text: 'ROOT', expanded: true, img: 'fa icon-folder', nodes: treeNode}]);
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
				newItem.id = item.loc_id;
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
		divisionMaskOn: function(elemId, parentMaskDivId) {
			var elem = $('#' + elemId);
			if (!elem) {
				return;
			}

			var maskDiv = elem.data('maskDiv');
			if (!maskDiv) {
				maskDiv = $('<div class="maskDiv" style="position:fixed; display:inline;"></div>');
				
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
		divisionOffAll: function() {
			$('.maskDiv').remove();
		},
		destroy: function() {
			console.log('Location Manager destroy');
			that.undelegateEvents();
			that.unRegisterOtherEvents();
			
			that.divisionOffAll();
			
			if (w2ui.locMgr_AddLocationPopupForm)
				w2ui.locMgr_AddLocationPopupForm.destroy();
			
			if (w2ui.locMgr_locationTree)
				w2ui.locMgr_locationTree.destroy();
			
			if (w2ui.locMgr_locationForm)
				w2ui.locMgr_locationForm.destroy();
			
			if (w2ui.locMgr_layout)
				w2ui.locMgr_layout.destroy();
		}
	})

	return Main;
});