define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/itsm/asset",
    "w2ui",
    "js/lib/component/BundleResource",
    "jquery-csv",
    "css!cs/itsm/asset"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var that;
	var Model = Backbone.Model.extend({
		model : Model,
		url : '/asset',
		parse : function(result){
			return {data : result};
		}
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : '/productManager/getProductList',
		model:Model,
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			assetMgr = this;
			this.$el.append(JSP);
			this.importFileFormat = [];
			this.exportFileFormat = [];
			this.getModelTypeList = [];
			this.getProductList();
			this.daysAgo = util.daysAgo(30);
			this.selectItem = null;
			this.elements = {
					
    		};
			
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
		
		events: {
			'click #assetExportBtn':'exportData',
			'click #assetEditBtn' : 'editPopup',
			'click #assetImportBtn' : 'importPopup',
			'click #assetMgrSearchBtn' : 'searchAction'
				
        },
		
		eventListenerRegister : function(){
			$(document).on("click", "#assetMgrImportDelBtn", this.importDelete);
        	$(document).on("click", "#importPopupSaveBtn", this.setImportData);
        	$(document).on("click", "#assetMgrPopupOkBtn", this.checkProcess);
		},
		
		removeEventListener : function(){
			$(document).off("click", "#assetMgrImportDelBtn");
        	$(document).off("click", "#importPopupSaveBtn");
        	$(document).off("click", "#assetMgrPopupOkBtn");
		},
		
		getProductList : function(){
			this.collection = new Collection();
        	this.collection.fetch({reset:true});
			this.listenTo(this.collection, "reset", this.setProductList);
		},
		
		setProductList: function(method, model, options){
			var result = method.toJSON();
			that.getModelTypeList.push({text :'All', id : -1});
			for(var i=0; i < result.length; i++){
				that.getModelTypeList.push({text : result[i].data.name, id : i});
			}
			
			this.init();
		},
				
		init : function(){
			this.importFileFormat = [
        		"project_id"
        		,"asset_name"
        		,"product_model"
        		,"serial_number"
        		,"receipt_date"
        		,"release_date"
        		,"status"
        		,"product_id"
        		,"site_id"
        	];
			
			this.exportFileFormat = [
        		"project_id"
        		,"asset_name"
        		,"product_model"
        		,"serial_number"
        		,"receipt_date"
        		,"release_date"
        		,"status"
        		,"product_id"
        		,"site_id"
        	];
			
			var cnvtDay = util.getDate("Day");
			var cnvtMonth = util.getDate("Month");
			var cnvtYear = util.getDate("Year");
			var getSearchTypeList = [{"text" : "일간", "value" : "1"},
										 {"text" : "월간", "value" : "2"},
										 {"text" : "기간", "value" : "3"}];

			$("#assetContentsDiv").w2layout({
				name : 'assetMgr_layout',
				panels : [
					{type:'top', size:'11.5%', resizable:false, content:'<div id="searchContents"></div>'},
					{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
				]
			});
			
			var searchContents = '<div class="dashboard-panel" id="searchTop" style="width:100%;">'+
											'<div id="searchBottom">'+
												'<div class="w2ui-page page-0">'+
													'<div class="search-options border" style="width:370px;">'+
										            '<div>'+
											            '<div class="w2ui-field">'+
												            '<label>타입</label>'+
									        				'<div class="inputArea">'+
																'<input name="searchType" type="list" size="35" />'+
									    					'</div>'+
									        			'</div>'+
									        			'<div class="w2ui-field">'+
									        				'<label>요청기간</label>'+
									        				'<div id="dailyMonthly" class="w2ui-field inputArea" style="padding-right:0px;">'+
																'<input name="searchDayMonth" type="searchDayMonth" size="35" />'+
															'</div>'+
									    					'<div class="periodic w2ui-field inputArea" style="padding-right:0px; color: #fff;">'+
									    						'<input name="searchFromPeriod" type="searchFromPeriod" size="15" /> ~ <input name="searchToPeriod" type="searchToPeriod" size="15" />'+
									    					'</div>'+
									        			'</div>'+
								            		'</div>'+
								            		'</div>'+//search-options
									            		
								            		'<div class="search-options border" style="width:220px;padding-top: 17px;">'+
											            '<div>'+
															'<div class="w2ui-field">'+
																'<label>Project</label>'+
																'<div class="inputArea"><input name="project" type="text" size="15" style="width:150px;" /></div>'+
															'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		
								            		'<div class="search-options nonBorder" style="width:220px;padding-top: 17px;">'+
										            '<div>'+
														'<div class="w2ui-field">'+
									            			'<label>S/N</label>'+
									            			'<div class="inputArea"><input name="serial_number" type="text" size="15"  style="width:150px;" /></div>'+
									            		'</div>'+
								            		'</div>'+
								            		'</div>'+//search-options
							            		
							            		'<div class="search-options nonBorder" style="width:220px;padding-top: 17px;">'+
									            '<div>'+
								            		'<div class="w2ui-field">'+
							            				'<label>Model</label>'+
							            				'<div class="inputArea"><input name="model" type="text" size="15"  style="width:150px;" /></div>'+
							            			'</div>'+
							            			'</div>'+
							            		'</div>'+//search-options
								            		
								            		'<div class="search-options nonBorder" style="width:210px;padding-top: 17px;">'+
											            '<div>'+
										            		'<div class="w2ui-field">'+
																'<label>Type</label>'+
																'<div class="inputArea"><input name="type" type="list" size="20" /></div>'+
										            		'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		
								            		
								            		'<div style="float:left; margin-left:0px;">'+
											            '<div class="" style="height: 62px; text-align: center; padding-top: 18px; float: right;">'+
											            	'<div><button id="assetMgrSearchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.assetStatus.search') + '</button></div>'+
									            		'</div>'+
								            		'</div>'+//search-options
												'</div>'+//w2ui-page page-0
											'</div>'+//searchBottom
										'</div>';//dashboard-panel
			
			var leftContents = '<div id="mainTop">'+
									'</div>'+//companyMainTop
									'<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title">' + 
							    			'<label>Company List</label>' +
							    		'</div>'+
							    		'<div class="dashboard-contents">'+
							    			'<div id="companyMainBottom"></div>'+
							    		'</div>'+
							    	'</div>';//dashboard-panel
			
			var mainContents = '<div id="mainTop">'+
										'<div class="align-right-btn">'+
											
										'</div>'+
									'</div>'+//mainTop
									'<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title">'+
							    			'<div class="assetModelListTitle" style="float:left; padding:0px;">'+
							    				'<span>Model List</span>'+
							    			'</div>'+
							    			'<div class="align-right-btn" style="float:right;">'+
												'<i id="assetImportBtn" class="icon link fab fa-yes-import fa-2x" aria-hidden="true" title="Import"></i>'+
												'<i id="assetEditBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
												'<i id="assetExportBtn" class="icon link fab fa-yes-export fa-2x" aria-hidden="true" title="Export"></i>'+
											'</div>'+
							    		'</div>'+
							    		'<div class="dashboard-contents">'+
							    			'<div id="mainBottom"></div>'+
							    		'</div>'+
							    	'</div>'//dashboard-panel
			
			$("#searchContents").html(searchContents);
			$("#leftContents").html(leftContents);
			$("#mainContents").html(mainContents);
			
			$("#searchBottom").w2form({
				name : 'asset_search_options',
				focus : -1,
				fields : [
					{name : 'type', type : 'list', options : {items : assetMgr.getModelTypeList}},
					{name : 'project', type : 'text'},
					{name : 'serial_number', type : 'text'},
					{name : 'model', type : 'text'},
					{name : 'searchType', type : 'list', options : {items : getSearchTypeList}},
					{name : 'searchDayMonth', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					project : '',
					serial_number : '',
					model : '',
					type : assetMgr.getModelTypeList[0],
					searchType : getSearchTypeList[0],
					searchDayMonth : cnvtDay,
					searchFromPeriod : assetMgr.daysAgo,
					searchToPeriod : cnvtDay
				},
				onChange : function(event){
					var eventTarget = event.target;
					if("searchType" == eventTarget){
						console.log("Change Search Type");
						if(3 == event.value_new.value){ // 기간
							$(".periodic").show();
							$("#dailyMonthly").hide();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							
							$("#searchFromPeriod").attr("placeholder", "yyyy-mm-dd");
							$("#searchToPeriod").attr("placeholder", "yyyy-mm-dd");
							
							$("#searchFromPeriod").val(assetMgr.daysAgo);
							$("#searchToPeriod").val(cnvtDay);
							
						}else if(2 == event.value_new.value){ // 월간
							
							$(".periodic").hide();
							$("#dailyMonthly").show();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							$("#searchDayMonth").attr("placeholder", "yyyy-mm");
							$("#searchDayMonth").val(cnvtMonth);
							//$("#searchDayMonth").attr("readonly", true);
							
						}else{ // Default = 일간
							$(".periodic").hide();
							$("#dailyMonthly").show();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							$("#searchDayMonth").attr("placeholder", "yyyy-mm-dd");
							$("#searchDayMonth").val(cnvtDay);
							//$("#searchDayMonth").attr("readonly", true);
						}
					}
				},
			});
			
			$(".periodic").hide();
			$('input[type=searchFromPeriod').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=searchToPeriod]')});
			$('input[type=searchToPeriod').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=searchFromPeriod]')});
			
			$("#mainBottom").w2grid({
				name : 'asset_list',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false,
					selectColumn:true
				},
				recordHeight : 30,
				columns: [                
                	{ field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
                	{ field: 'project_name', caption: 'PROJECT NAME', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;',
                		render :function(data){
                			if(data.project_name == null){
                				return '-';
                			}else{
                				return data.project_name;
                			}
                		}
                	}, // asset name
                	{ field: 'project_id', caption: 'PROJECT ID', size: '150px', hidden:true}, // hidden:true
                	{ field: 'product_id', caption: 'PROJECT ID', size: '150px', hidden:true}, // hidden:true
                	{ field: 'site_id', caption: 'PROJECT ID', size: '150px', hidden:true}, // hidden:true
					{ field: 'asset_name', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset name
					{ field: 'product_model', caption: 'MODEL', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serial_number', caption: 'S/N', size: '70%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receipt_date', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '120px', sortable: true, attr: 'align=center' }, // 입고일
					{ field: 'release_date', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '120px', sortable: true, attr: 'align=center' }, // 출고일
					{ field: 'status', caption: 'STATUS', size: '60px', sortable: true, attr: 'align=center',
						render : function(data){
							return '-';
					}},
					{ field: 'product_type', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					],
				onClick : function(event){
					event.onComplete = function(){
						
					}
				}
			});			
			
			w2ui["asset_list"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
				assetMgr.validationCheck();
        	});
        	
        	w2ui["asset_list"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		assetMgr.validationCheck();
        	});
        	
        	w2ui["asset_list"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		assetMgr.validationCheck();
        	});
			
			$("#assetEditBtn").prop('disabled', true);
			$("#assetEditBtn").removeClass('link');
			$("#assetExportBtn").prop('disabled', true);
			$("#assetExportBtn").removeClass('link');
			
			this.eventListenerRegister();
			this.start();
		},
		
		start : function(){
			this.createSiteTree();
			this.getCompanyList('init', null);
			this.getModelList();
		},
		
		searchAction : function(){
			var requestParam = {};
			var option = w2ui['asset_search_options'].record;
			var selectedDayMonth = $("#searchDayMonth").val();
			var selectedFromDate = $("#searchFromPeriod").val();
			var selectedToDate = $("#searchToPeriod").val();
			
			var selectedModel = option.model;
			if(selectedModel == ""){
				selectedModel = null;
			}
			
			var selectedProject = option.project;
			if(selectedProject == ""){
				selectedProject = null;
			}
			
			var selectedSerialNumber = option.serial_number;
			if(selectedSerialNumber == ""){
				selectedSerialNumber = null;
			}
			
			var selectedModelType = option.type.text;
			if(selectedModelType == "All"){
				selectedModelType = null;
			}
			
			var requestParam = {
					searchType : option.searchType.value,
					searchFromPeriod : selectedFromDate,
					searchToPeriod : selectedToDate,
					searchDayMonth : selectedDayMonth,
					searchModel : selectedModel,
					searchProject : selectedProject,
					searchSerialNumber : selectedSerialNumber,
					searchModelType : selectedModelType
			};
			
			var model = new Model(requestParam);
			model.url = model.url + '/searchAsset';
			model.save(null,{
				success : function(model, response){
					console.log('success : ');
					w2ui['asset_list'].clear();
					w2ui['asset_list'].records = model.attributes.data.result;
					w2ui['asset_list'].refresh();
				},
				error : function(model, xhr, options){
					console.log('error : ');
				}
			});
			
		},
		
		validationCheck : function(){
        	if(w2ui['asset_list'].getSelection().length > 0){				
				$("#assetExportBtn").prop('disabled', false);
				$("#assetExportBtn").addClass('link');
				
				if(w2ui['asset_list'].getSelection().length == 1){
					$("#assetEditBtn").prop('disabled', false);
					$("#assetEditBtn").addClass('link');
				}else{
					$("#assetEditBtn").prop('disabled', true);
					$("#assetEditBtn").removeClass('link');
				}
			}else{				
				$("#assetEditBtn").prop('disabled', true);
				$("#assetEditBtn").removeClass('link');
				
				$("#assetExportBtn").prop('disabled', true);
				$("#assetExportBtn").removeClass('link');
			}
        },
		
		createSiteTree : function(){
			$("#companyMainBottom").w2sidebar({
				name : 'companyTree',
				nodes : [
					{id: 'Company', text: 'COMPANY LIST', expanded: true, group: true,
					nodes: [{id:'site', text: 'SITE', expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					
					event.onComplete = function(){
						console.log('click site tree item');
						var seletId = event.target;
                        var selectItem = this.get(seletId);
                        var selectId = selectItem.id;
                        var selectModel = new Model();
                        
                        if(selectId != "site"){
        	    			var getModelListObj = [];
        	    			getModelListObj = that.makeModelList(selectItem.site_id, assetMgr.allMenu);
        	    			selectModel.set({"modelList" : getModelListObj});
                        	selectModel.url = selectModel.url + '/selectModelList';
                        	selectModel.save({},{
                        		success : function(model, response, options){
                        			 assetMgr.selectModelList(model);
								},
								error : function(model, xhr, options){
									console.log("Add Group Error");
								}
                        	});
        	    		}else{
        	    			selectModel.url = selectModel.url + '/getModelList';
        	    			selectModel.fetch({}, {});
                        	selectModel.listenTo(selectModel, "sync", assetMgr.setModelList);
        	    		}
					}
				},
			});
		},
		
		getCompanyList : function(type, action) {
			var companyList = new Model();
			companyList.url = companyList.url + '/getCompanyList';
			if(type == 'init') {
				that.listenTo(companyList, 'sync', that.setCompanyList);
			}
			companyList.fetch();
		},
		
		setCompanyList : function(method, model, options) {
			assetMgr.treeMenu = model.treeData.nodes;
			assetMgr.allMenu = model.allData;
			
			w2ui['companyTree'].insert('site', null, model.treeData.nodes);
		},
		
		getModelList : function(){
			var modelList = new Model();
			modelList.url = modelList.url + '/getModelList';
			assetMgr.listenTo(modelList, 'sync', assetMgr.setModelList);
			
			modelList.fetch();
		},
		
		setModelList : function(model){
			var modelList = model.attributes.data;			
        	w2ui['asset_list'].clear();
			w2ui['asset_list'].records = modelList;
			w2ui['asset_list'].refresh();
		},
				
		makeModelList : function(selectSite, allData) {
			var getCustomerListObj = [];
			getCustomerListObj.push(selectSite);
			
			for(var i = 0; i < allData.length; i++) {
				for(var j = 0; j < allData.length; j++) {
					if(getCustomerListObj[i] == allData[j].parent_site_id) {
						getCustomerListObj.push(allData[j].site_id);
					}
				}
			}
			
			return getCustomerListObj;
		},
		
		selectModelList : function(model){
			var array = model.toJSON();
        	var modelList = array.data.modelList;
			
			w2ui['asset_list'].records = modelList;
			w2ui['asset_list'].refresh();
		},
		
		exportData : function(){
        	assetMgr.validationCheck();
        	if($("#assetExportBtn").prop('disabled')){
        		return;
        	}
        	
        	var exporAC = w2ui["asset_list"].get(w2ui["asset_list"].getSelection());
        	
        	var bodyContents = "";
        	var body = "";
        	if(exporAC.length == 0){
        		bodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        	} else {
        		bodyContents = exporAC.length + BundleResource.getString('label.assetManager.exportConfirm');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="" id="exportConfirm" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
        		
        	}
        	
        	w2popup.open({
    			width: 385,
    			height: 180,
    			title : BundleResource.getString('title.assetManager.info'),
    			body: body,
    			opacity   : '0.5',
    			modal     : true,
    			showClose : true
    		});
        	
        	$("#exportConfirm").click(function(){
        		w2popup.close();
        		let csvContent = "data:application/octet-stream;charset=euc-kr,\ufeff";
        		
        		csvContent += assetMgr.exportFileFormat.join(",") + "\r\n"; // add Header;
        		
        		let rowHeader = w2ui["asset_list"].columns;
        		
        		exporAC.forEach(function(rowArray, idx){
        			let row = "";
        			row += rowArray.project_id; //
        			row += "," + (rowArray.asset_name !== null ? rowArray.asset_name : ""); //
        			row += "," + (rowArray.product_model !== null ? rowArray.product_model : ""); //
        			row += "," + (rowArray.serial_number !== null ? rowArray.serial_number : ""); //
        			row += "," + (rowArray.receipt_date !== null ? rowArray.receipt_date : ""); // 
        			row += "," + (rowArray.release_date !== null ? rowArray.release_date : ""); // 
        			row += "," + (rowArray.status !== null ? rowArray.status : ""); // 
        			row += "," + (rowArray.product_id !== null ? rowArray.product_id : ""); // 
        			row += "," + (rowArray.site_id !== null ? rowArray.site_id : ""); // 
        			
        			csvContent += row + "\r\n"; // add carriage return
        		}); 
        		
        		var encodedUri = encodeURI(csvContent); 
        		
        		var link = document.createElement("a");
        		if (link.download !== undefined) {
        			link.setAttribute("href", encodedUri);
        			link.setAttribute("target", "_blank");
        			link.setAttribute("download", assetMgr.todayFunc());
        			link.style.visibility = 'hidden';
        			document.body.appendChild(link);
        			link.click();
        			document.body.removeChild(link);
        		}
        		
        		w2ui["asset_list"].selectNone();
        	});
        },
		
        importDelete : function(evt){
        	var alertBodyContents = "";
        	var Body = "";
        	var deleteItem = w2ui["importAssetTable"].get(w2ui["importAssetTable"].getSelection());
        	
        	if(deleteItem.length == 0){
        		alertBodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		Body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : Body
        		});
        	}else{
        		w2ui["importAssetTable"].delete(deleteItem);
        	}
        },
		
		importPopup : function(){
        	var fields = [];
        	var record = {};
    		
    		var body = '<div class="w2ui-centered">'+
				    			'<div id="assetMgrImportWrap" style="height:33px;">'+
					    			'<div>'+
										'<div class="w2ui-field w2ui-span3">'+
										    '<label>File : </label>'+
										    '<div><input type="file" id="file" style="width: 93%" accept=".csv" ></div>'+
										'</div>'+
									'</div>'+
				    			'</div>'+
						    	
				    			'<div id="importAssetContents" style="width:100%; height:500px;"></div>'+ //height:100%;
				    		
				    			'<div id="assetMgrImportResultText" style="height:26px;color:#fff;position:relative; top:18px;"></div>'+
								'<div id="assetMgrPopupBottom" style="margin-top:34px;">'+
									'<button id="importPopupSaveBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
									'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
								'</div>'+
							'</div>';
    		
	    	w2popup.open({
				title : BundleResource.getString('title.assetManager.import'),
		        body: body,
		        width : 1400,
		        height : 728,
//		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
			    showClose : true,
			    style	  : "overflow-y:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["importAssetTable"].render();
	        			$("#grid_importAssetTable_records").css('overflow-y', 'hidden');
		        		$("#tb_importAssetTable_toolbar_right").append('<i id="assetMgrImportDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del" style="float:right;"></i>');

		        		$('#file').w2field('file', {
		        			max:1,
		        			onClick : function(event){
		        				console.log("onClick onClick");
		        			},
		        			onAdd : function(event){
		        				console.log("onAdd");
		        				that.importCsvData(event);
		        			},
		        			onRemove : function(event){
		        				console.log("onRemove");
		        				w2ui["importAssetTable"].clear();
		        				$(".file-input").val("");
//		        				$('#file').w2field('file', {});
		        			}
		        		});
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['importAssetTable'].destroy();
		        }
		        
		    });
	    	
	    	/* import grid render */
	    	$("#importAssetContents").w2grid({
        		name:'importAssetTable',
                show: { 
                    toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : true,
                    toolbarColumns : false,
                    selectColumn: true
                },
                
                recordHeight : (that.checkBrowser() == "firefox" ? 29 : 30),
        		multiSelect : true,
        		multiSearch: true,
//        		style:'width:100%;height:calc(100vh - 460px);', //530px;
                
        		searches: [
                	{ field: 'asset_name', caption: 'NAME', type: 'text' }
                ],
                
                columns: [  
                	{ field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
                	{ field: 'project_id', caption: 'PROJECT ID', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                	{ field: 'asset_name', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'product_model', caption: 'MODEL', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'serial_number', caption: 'S/N', size: '70%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'receipt_date', caption: 'RECEIPT DATE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'release_date', caption: 'RELEASE DATE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'status', caption: 'STATUS', size: '70px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'product_id', caption: 'PRODUCT ID', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'site_id', caption: 'SITE ID', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					]
            });
	    	w2ui['importAssetTable'].lock("Loading...", true);
	    	
        },
        
        importCsvData : function(evt) {
        	var alertBodyContents = "";
        	var Body = "";
        	if (!assetMgr.browserSupportFileUpload()) {
        		alert('The File APIs are not fully supported in this browser!');
        	} else {
        		var _this = assetMgr;
        		var data = null;
        		var file = evt.file.file;
//        		if(!file.name.includes('csv')){ // file 확장자가 csv가 아닌 경우
        		if(file.name.indexOf("csv") < 0){
        			alertBodyContents = BundleResource.getString('label.assetManager.noCSVFile');
            		Body = '<div class="w2ui-centered">'+
    					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
    					'<div class="assetMgr-popup-btnGroup">'+
    						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
//            		$('#file').w2field('file', {});
            		$(".file-input").val("");
                	
        		}else{
        			var reader = new FileReader();
        			reader.readAsText(file,"euc-kr");
        			reader.onload = function(event) {
        				var csvData = event.target.result;
        				data = $.csv.toArrays(csvData);
        				if (data && data.length > 0) {
        					that.csvFormatter(data);
        				} else {
//        					alert('No data to import!');
        					alertBodyContents = BundleResource.getString('button.assetManager.noDataImport'); //'No data to import!';
                    		Body = '<div class="w2ui-centered">'+
            					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
            					'<div class="assetMgr-popup-btnGroup">'+
            						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
            					'</div>'+
            				'</div>' ;
        				}
        			};
        			reader.onerror = function() {
//        				alert('Unable to read ' + file.fileName);
        				alertBodyContents = BundleResource.getString('button.assetManager.unableRead'); //'Unable to read' + file.fileName;
                		Body = '<div class="w2ui-centered">'+
        					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
        					'<div class="assetMgr-popup-btnGroup">'+
        						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
        					'</div>'+
        				'</div>' ;
        			};
        		}
        	}
        	
        	w2popup.message({ 
    	        width   : 400, 
    	        height  : 180,
    	        html    : Body
    	    });
        	
        	$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        },
        
        csvFormatter : function(data){
        	let dataProvider = [];
        	let fileFormat = assetMgr.importFileFormat;
        	var cnt = 0;
        	
        	var dayFormat = function(dd){
        		let result = "";
        		let reStr = dd.replace(/\-/gi, "."); // YYYY.MM.DD가 표준이라고 함.
        		let arr = reStr.split(".");
        		if(arr.length > 2){
        			arr.forEach(function(dd, idx){
        				if(idx !== 0){
        					let im = parseInt(arr[idx]);
        					arr[idx] = im < 10 ? "0"+im : im;
        				}
        			});
        			result = arr.join(".");
        		}else{
        			result = "Format Err";
        		}
        		
        		return result;
        	}
        	
        	data.forEach(function(d, i){
        		if(i !== 0 && d.length === fileFormat.length){
        			
        			var param = {}
    				for(var j=0; j < fileFormat.length; j++){
    					param[fileFormat[j]] = d[j];
    					if(j===0){
    						param["recid"] = i;
    					}
    				}
    				dataProvider.push(param);
        		}
        	});
        	
        	w2ui["importAssetTable"].records = dataProvider;
        	w2ui['importAssetTable'].refresh();
        },
        
        browserSupportFileUpload : function() {
            var isCompatible = false;
            if (window.File && window.FileReader && window.FileList && window.Blob) {
            	isCompatible = true;
            }
            return isCompatible;
        },
        
        setImportData : function(event){
        	var selectList = this.selectItem;
        	var alertBodyContents = "";
        	var Body = "";
        	var recordData = w2ui["importAssetTable"].records;
        	
        	if(recordData.length == 0){
        		alertBodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		Body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : Body
        		});
        		
        		$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        		/*$("#assetMgrImportResultText").html("선택된 항목이 없습니다.")*/
        	}else{
        		let type = "multiUpdate";
        		let param = {};
        		param.crudList = recordData;
        		
        		for(let i = 0; i< param.crudList.length; i++){
        			var uid = util.createUID();
        			param.crudList[i]['asset_id'] = uid;
        		}
        		
        		var model = new Model(param);
        		model.url = model.url+"/"+type+"/"+ 'csvUpdate';
        		
        		w2ui['importAssetTable'].lock("Loading...", true);
        		
        		model.save({}, {
        			success: function (model, respose, options) {		        				
        				w2ui['importAssetTable'].unlock();
        				alertBodyContents = BundleResource.getString('label.assetManager.importComplete'); //"Import가 완료되었습니다";
                		Body = '<div class="w2ui-centered">'+
        					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
        					'<div class="assetMgr-popup-btnGroup">'+
        						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
        					'</div>'+
        				'</div>' ;
                		w2popup.message({ 
                			width   : 400, 
                			height  : 180,
                			html    : Body
                		});
        				
                		$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
                		assetMgr.getModelList();
        			},
        			
        			error: function (model, xhr, options) {
//        				assetMgr.crudError(model, xhr, options);
        				w2ui['importAssetTable'].lock();
        			}
        		});
        	}
        	
        },
        
        todayFunc : function(){
        	let result = "";
        	let dt = new Date();
        	
        	let dayFormat = function(dd){
        		return String(dd <10 ? "0"+ dd : dd);
        	}
        	
        	let month = dayFormat(dt.getMonth()+1);
        	let day = dayFormat(dt.getDate());
        	let year = dayFormat(dt.getFullYear());
        	let hour = dayFormat(dt.getHours());
        	let minute = dayFormat(dt.getMinutes());
        	let second = dayFormat(dt.getSeconds());
        	
        	result =  year +""+  month + day + hour + minute + second;
        	return result+".csv";
        },
        
        editPopup : function(event){
        	var item = assetMgr.selectItem;
        	var selectItem = w2ui['asset_list'].get(w2ui['asset_list'].getSelection())[0];
        	
	    	var items = [];
	    	
	    	var receiptDate;
    		var releaseDate;
    		
    		if(!_.isNull(selectItem.receipt_date,selectItem.release_date)){
    			receiptDate = selectItem.receipt_date.split(" ")[0];
    			releaseDate = selectItem.release_date.split(" ")[0];
    		}else{
    			receiptDate = "";
    			releaseDate = "";
    		}
	    	
	    	var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	
	    		fields = [
					{name:'assetName', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
    				{name:'productModel', type: 'text', disabled:false, required:false, html:{caption:'PRODUCT MODEL'}},
					{name:'serialNumber', type: 'text', disabled:false, required:false, html:{caption:'SERIAL NUMBER'}},
					{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RECEIPT DATE'}},
					{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RELEASE DATE'}},
					{field:'status', type : 'text', disabled:false, required:false, html:{caption:'STATUS'}},

					// Fixed by Gihwan for SonarQube. 2018-07-09 
					// 'disabled:false', 'disabled:true'  -> disabled is duplicate. What is correct???
					
//					{field:'type', type: 'list', disabled:false, required:true, html:{caption:'TYPE'}, options: { items: items } }
    			];
	    		
        		record={
        				assetId : selectItem.asset_id,
	    				assetName : selectItem.asset_name,
	    				productModel:selectItem.product_model,
//	    				type:'',
	    				serialNumber:selectItem.serial_number,
	    				receiptDate:receiptDate,
	    				releaseDate:releaseDate,
//	    				status:selectItem.status
	    				status:'-'
					};
        		popupHeight = 412;
        		
        		body = '<div class="w2ui-centered">'+
				'<div id="assetMgrUPdatePopupContents" style="width:100%; height:100%" >'+
				
					'<div class="w2ui-page page-0">'+
				        '<div style="width: 100%;">'+       
				            '<div class="" style="height: 185px;">'+
				                
				            	'<div class="w2ui-field">'+
		                    		'<label style="width: 116px;">NAME</label>'+
		                    		'<div>'+
		                    			'<input name="assetName" type="text" maxlength="100" size="35">'+
		                    		'</div>'+
		                    	'</div>'+
				            		                    	
				            	'<div class="w2ui-field">'+
				                    '<label style="width: 116px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="35">'+
				                    '</div>'+
				                '</div>'+
				               
				                '<div class="w2ui-field">'+
				                    '<label style="width: 116px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="35">'+
				                    '</div>'+
				                '</div>'+
				                
				                '<div class="w2ui-field">'+
				                    '<label style="width: 116px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="35">'+
				                    '</div>'+
			                    '</div>'+
			                    
			                    '<div class="w2ui-field">'+
				                    '<label style="width: 116px;">RELEASE DATE</label>'+
				                    '<div>'+
				                    	'<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="35">'+
				                    	'</div>'+
			                    '</div>'+
			                    
			                    '<div class="w2ui-field">'+
			                    	'<label style="width: 116px;">STATUS</label>'+
			                    	'<div>'+
			                    		'<input name="status" type="text" maxlength="100" size="35">'+
			                    	'</div>'+
			                    '</div>'+
			                    
//			                    '<div class="w2ui-field">'+
//			                    	'<label style="width: 116px;">TYPE</label>'+
//			                    	'<div>'+
//			                        	'<input name="type" type="text" maxlength="100" size="35">'+
//			                        '</div>'+
//			                    '</div>'+
				                
				            '</div>'+
				        '</div>'+
				        
			        '<div style="clear: both; padding-top: 15px;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
				
			    
				'</div>'+
				'<div id="assetMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+
					'<div id="assetMgrUPdatePopupBottom">'+
						'<button id="assetMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
					'</div>'+
				'</div>';
    			
	    	
        	
	    	w2popup.open({
				title : BundleResource.getString('title.assetManager.editAsset'),
		        body: body,
		        width : 450,
		        height : popupHeight,
		        type : 'update',
		        opacity   : '0.5',
		        selectItem : selectItem,
	    		modal     : true,
			    showClose : true,
			    style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["assetMgr_popup_properties"].render();
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['assetMgr_popup_properties'].destroy();
		        }
		        
		    });
	    	
			$("#assetMgrUPdatePopupContents").w2form({
				name : 'assetMgr_popup_properties',
				style:"border:1px solid rgba(0,0,0,0)",
				focus : 1,
				fields : fields,
				record:record
			});		
        
        },
        
        checkProcess : function(event){
        	var item = w2popup.get();
        	
        	assetMgr.assetItemCheck(event, item.type);
        },
        
        assetItemCheck : function(event, type){//type : crud
        	var popupData = w2popup.get();
        	var arr = w2ui["assetMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var dataProvdier = w2ui["asset_list"].records;
            	var item = w2ui["assetMgr_popup_properties"].record;
            	
            	//공백 처리
            	item.assetId = $.trim(item.assetId);
            	item.assetName = $.trim(item.assetName);
            	item.productModel = $.trim(item.productModel);
            	if(item.serialNumber == ""){
            		item.serialNumber = item.productModel; // serialNumber 값 미입력 시  productModel 값으로 입력
            	}else{
            		item.serialNumber = $.trim(item.serialNumber);
            	}
            	if(item.receiptDate == ""){
            		item.receiptDate = null;
            	}else{
            		item.receiptDate = $.trim(item.receiptDate);
            	}
            	if(item.releaseDate == ""){
            		item.releaseDate = null;
            	}else{
            		item.releaseDate = $.trim(item.releaseDate);
            	}
//            	item.status = $.trim(item.status.id);
            	
            	var resultAC = null;
            	
            	if(popupData.type === "update"){
            		var selectItem = w2ui["asset_list"].get(w2ui["asset_list"].find({asset_id:item.assetId}));
            		
            		var dataA = "" ;
            		var dataB = "";

            		dataA = selectItem[0].asset_name+selectItem[0].product_model+selectItem[0].serial_number+selectItem[0].receipt_date+selectItem[0].release_date;
            		dataB = item.assetName+item.productModel+item.serialNumber+item.receiptDate+item.releaseDate;
        			
            		
            		if(dataA === dataB){
            			w2popup.message({ 
                	        width   : 360, 
                	        height  : 265, 
                	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.assetManager.noChangeedContents') + '</div>'+
                	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.assetManager.confirm') + '</button>'
                	    });
            			return;
            		}
            		
            	}
            	
            	if(resultAC !==null && resultAC.length > 0){
            		//중복된 내용이 있다.
            		w2popup.message({ 
            	        width   : 360, 
            	        height  : 220,
            	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.assetManager.aladyExistsID') + '</div>'+
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.assetManager.confirm') + '</button>'
            	    });
            	}else{
            		var model = new Model(item);
            		model.url = model.url+"/updateModel";
            		
            		model.save({}, {
            			success: function (model, respose, options) {
            				console.log("success");
            				assetMgr.getModelList();
            				w2popup.close();
            			},
            			
        			    error: function (model, xhr, options) {
        			    	console.log("error");
        			    	assetMgr.getModelList();
        			    	w2popup.close();
        			    }
            		});
            	}
        	}
        	
        },
        
		checkBrowser : function(){
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
		
		destroy : function(){
			if(w2ui['assetMgr_layout']){
				w2ui['assetMgr_layout'].destroy();
			}
			
			if(w2ui['asset_search_options']){
				w2ui['asset_search_options'].destroy();
			}
			
			if(w2ui['asset_list']){
				w2ui['asset_list'].destroy();
			}
			
			if(w2ui['companyTree']){
				w2ui['companyTree'].destroy();
			}
			
			if(w2ui['assetMgr_popup_properties']){
				w2ui['assetMgr_popup_properties'].destroy();
			}
			
			assetMgr = null;
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
		}
		
	});
	return Main;
});