define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/itsm/siteManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/itsm/siteManager"
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
		url : '/siteManager',
		parse : function(result){
			return {data : result};
		}
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.init();
			this.start();
			this.elements = {
					
    		};

    		this.selectItem = null;
			this.xFlug = true;
			
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
			'click #companyAddBtn' : 'companyAdd',
			'click #companyDelBtn' : 'companyDelete',
			'click #companyEditBtn' : 'companyEdit',
			'click #customerAddBtn' : 'customerAdd',
			'click #customerAddPopupDelBtn' : 'addPopupCustomerDelete',
			'click #customerEditBtn' : 'customerEdit'			
        },
		
		eventListenerRegister : function(){
        	// Company
        	$(document).on("click", "#companyPopupOkBtn", this.addCompanyOk);
        	$(document).on("click", "#companyEditPopupOkBtn", this.editCompanyOk);
        	$(document).on("click", "#companyPopupCloseBtn", this.addCompanyClose);
        	
        	// Add Popup
        	$(document).on("click", "#customAddPopupNewBtn", this.setAddPopupCustomerInfoDisplay);
        	$(document).on("click", "#customAddPopupAddBtn", this.customerAddPopupAddAction);
        	$(document).on("click", "#customAddPopupCancelBtn", this.cancelAddPopupCustomerInfoDisplay);        	
        	$(document).on('click', '#customerAddPopupDelBtn', function(e){
        		companyMgr.productValidation('add');
        		if($("#customerAddPopupDelBtn").prop('disabled')){
            		return;
            	}
        		
        		that.addPopupCustomerDelete();
        	});    
        	
        	$(document).on('click', '#customerListResultBottom', function(e){
        		if(w2ui["customer_product_list_grid"].get(w2ui["customer_product_list_grid"].getSelection()) != null) {
        			companyMgr.productValidation('add');
        		}
        	});  
        	
        	// Edit Popup
        	$(document).on("click", "#companyEditPopupCloseBtn", this.editCompanyClose);
        	
        	$(document).on("click", "#customEditPopupNewBtn", this.setEditPopupCustomerInfoDisplay);
        	$(document).on("click", "#customEditPopupAddBtn", this.customerEditPopupAddAction);
        	$(document).on("click", "#customEditPopupEditBtn", this.customerEditPopupEditAction);
        	$(document).on("click", "#customEditPopupCancelBtn", this.cancelEditPopupCustomerInfoDisplay);
        	$(document).on('click', '#customerEditPopupDelBtn', function(e){
        		companyMgr.productValidation('edit');
        		if($("#customerEditPopupDelBtn").prop('disabled')){
            		return;
            	}
        		
        		that.editPopupCustomerDelete();
        	});
        	
        	$(document).on('click', '#customerEditListResultBottom', function(e){
        		if(w2ui["customer_edit_product_list_grid"].get(w2ui["customer_edit_product_list_grid"].getSelection()) != null) {
        			companyMgr.productValidation('edit');
        		}
        	});
		},
		
		removeEventListener : function(){        	
        	// Company
        	$(document).off("click", "#companyPopupOkBtn");
        	$(document).off("click", "#companyEditPopupOkBtn");
        	$(document).off("click", "#companyPopupCloseBtn");
        	
        	// Add Popup
        	$(document).off("click", "#customAddPopupNewBtn");
        	$(document).off("click", "#customAddPopupAddBtn");
        	$(document).off("click", "#customAddPopupCancelBtn");        	
        	$(document).off('click', '#customerAddPopupDelBtn');    
        	
        	$(document).off('click', '#customerListResultBottom');  
        	
        	// Edit Popup
        	$(document).off("click", "#companyEditPopupCloseBtn");
        	
        	$(document).off("click", "#customEditPopupNewBtn");
        	$(document).off("click", "#customEditPopupAddBtn");
        	$(document).off("click", "#customEditPopupEditBtn");
        	$(document).off("click", "#customEditPopupCancelBtn");
        	$(document).off('click', '#customerEditPopupDelBtn');
        	
        	$(document).off('click', '#customerEditListResultBottom');
		},
		
		init : function(){
			companyMgr = this;
			requestParam = {};
			paramCustomerInfo = [];
			requestEditParam = {};
			editParamCustomerInfo = [];
			
			
        	$("#siteManagerContentsDiv").w2layout({
				name : 'siteMgr_layout',
				panels : [
					{type:'main', size:'35%', resizable: false, content:'<div id="companyMainContents"></div>'},
					{type:'right', size:'65%', content:'<div id="customerMainContents"></div>'}
				]
			});
        	
        	$("#customerMainContents").w2layout({
        		name : 'customer_layout',
        		panels : [
        			{type:'top', size:'25%', resizable: false, minSize:'25%', content:'<div id="rightTopContents"></div>'},
        			{type:'main', resizable: false, content:'<div id="rightBottomContents"></div>'}
        		]
        	});
        	
        	var companyMainContents = 	'<div id="companyMainTop">'+
										'</div>'+//companyMainTop
										'<div class="dashboard-panel" style="width:100%;">'+
								    		'<div class="dashboard-title">' + 
								    			'<label>Company List</label>' +
												'<div class="align-right-btn">'+
													'<i id="companyAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
													'<i id="companyDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
													'<i id="companyEditBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
												'</div>'+ 
								    		'</div>'+
								    		'<div class="dashboard-contents">'+
								    			'<div id="companyMainBottom"></div>'+
								    			'<div id="companyVirMainBottom"></div>'+
								    		'</div>'+
								    	'</div>';//dashboard-panel
        	
	    	var rightTopContents = 		'<div id="companyInfoTop" style="width:100%;">'+//height:100%;
										'</div>'+
										'<div id="companyInfoBottom">'+
									    	'<div class="dashboard-panel" style="width:100%;">'+
									    		'<div class="dashboard-title">' +
									    			'<label>Company Detail Info</label>' + 
									    		'</div>'+
									    		'<div class="dashboard-contents" style="position:relative;">'+
										    		'<div class="w2ui-contents" id="companyDetailInfo">'+	
										    			'<div class="w2ui-page page-0">'+
													        '<div style="width: 50%; float: left; margin-right: 0px;">'+       
													            '<div class="">'+
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="company_name">' + BundleResource.getString('label.siteManager.companyName') + '</label>'+
													                    '<div>'+
													                        '<input name="company_name" type="text" maxlength="100" size="25" id="company_name">'+
													                    '</div>'+
													                '</div>'+
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="company_registration_number">' + BundleResource.getString('label.siteManager.companyRegistrationNumber') + '</label>'+
													                    '<div>'+
													                        '<input name="company_registration_number" type="text" maxlength="100" size="25" id="company_registration_number">'+
													                    '</div>'+
													                '</div>'+
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="area">' + BundleResource.getString('label.siteManager.area') + '</label>'+
													                    '<div>'+
													                        '<input name="area" type="text" maxlength="100" size="25" id="area">'+
													                    '</div>'+
													                '</div>'+
													            '</div>'+
												            '</div>'+//left
												            
													        '<div style="width: 50%; float: left; margin-left: 0px;">'+
													            '<div class="">'+
														            '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="ceo_name">' + BundleResource.getString('label.siteManager.ceoName') + '</label>'+
													                    '<div>'+
													                    	'<input name="ceo_name" type="text" maxlength="100" size="25" id="ceo_name">'+
													                    '</div>'+
													                '</div>'+
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="phone">' + BundleResource.getString('label.siteManager.phone') + '</label>'+
													                    '<div>'+
													                    	'<input name="phone" type="text" maxlength="100" size="25" id="phone">'+
													                    '</div>'+
													                '</div>'+
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="fax">Fax</label>'+
													                    '<div>'+
													                    	'<input name="fax" type="text" maxlength="100" size="25" id="fax">'+
													                    '</div>'+
													                '</div>'+
													            '</div>'+
												            '</div>'+//right
												            
												            '<div style="width: 100%; float: left; margin-right: 0px;">'+ 
												            	'<div class="" style="height: 64px;">'+
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="address">' + BundleResource.getString('label.siteManager.address') + '</label>'+
													                    '<div>'+
													                        '<input name="address" type="text" maxlength="100" size="128" id="address">'+
													                    '</div>'+
												                    '</div>'+	
													                '<div class="w2ui-field w2ui-span4">'+
													                    '<label class="address">' + BundleResource.getString('label.siteManager.note') + '</label>'+
													                    '<div>'+
													                        '<input name="note" type="text" maxlength="100" size="128" id="note">'+
													                    '</div>'+
												                    '</div>'+												                    
												            	'</div>' +
												            '</div>' +
												            
												        '</div>'+
											       '</div>'+
											       "<div class='disableClass'></div>"+
											       '</div>'+
										    	'</div>'+
									    	'<div>' +
								    	'</div>';        	
        	
			var rightBottomContents = 	'<div id="customerMainTop">'+
										'</div>'+//customerMainTop
										'<div class="dashboard-panel" style="width:100%;">'+
								    		'<div class="dashboard-title">' + 
								    			'<label>Customer List</label>' +
								    		'</div>'+
								    		'<div class="dashboard-contents">'+
								    			'<div id="customerMainBottom"></div>'+
								    		'</div>'+
								    	'</div>';//dashboard-panel
			
			$("#companyMainContents").html(companyMainContents);
			$("#rightTopContents").html(rightTopContents);
			$("#rightBottomContents").html(rightBottomContents);
        	
			$("#customerMainBottom").w2grid({
				name : 'customer_list',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false,
					selectColumn:false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '100px', sortable: true, attr: 'align=center'},
         			{ field: 'customer_name', caption: '이름', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'phone', caption: '연락처', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'mobile_phone', caption: 'Mobile Phone', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'email', caption: 'E-Mail', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'rank', caption: '직급', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'department', caption: '부서', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'task', caption: '담당업무', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}
				],
				onClick : function(event){
					event.onComplete = function(){
						
					}
				}
			});	
			
			$('#companyDetailInfo').w2form({ 
        		name : 'companyDetailProperties',
    			focus : -1,
    			fields : [
    				{name:'company_name', type: 'text', disabled:true, required:false},
    				{name:'ceo_name', type: 'text', disabled:true, required:false},
    				{name:'company_registration_number', type: 'text', disabled:true, required:false},
    				{name:'phone', type: 'text', disabled:true, required:false},
    				{name:'area', type: 'text', disabled:true, required:false},
    				{name:'fax', type: 'text', disabled:true, required:false},
    				{name:'address', type: 'text', disabled:true, required:false},
    				{name:'note', type: 'text', disabled:true, required:false}
    			],
    			record:{
    				company_name:'',
    				ceo_name:'',
    				company_registration_number:'',
    				phone:'',
    				area:'',
    				fax:'',
    				address:''
				}
            });			
			
		},
		
		start : function(){
        	this.createMenuTree();
        	this.virCreateMenuTree();
        	this.getCompanyList('init', null);
        	this.eventListenerRegister();
		},
		
        createMenuTree : function(){
			$("#companyMainBottom").w2sidebar({
				name : 'companyTree',
				nodes : [
					{id: 'Company', text: 'COMPANY LIST', expanded: true, group: true,
					nodes: [{id:'site', text: 'SITE', expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					
					event.onComplete = function(){
						companyMgr.validationCheckMenu();
						if(companyMgr.xFlug){
							var useYES = _.where(companyMgr.allMenu, {useYN : true});
							for(var i = 0; i < useYES.length; i++){
								if(useYES[i].menuId == event.node.menuId){
									$("#startPage").show();
									if(event.node.nodes.length > 0){
										$("#startPage").hide();
									}else{
										$("#startPage").show();
									}
									break;
								}else{
									$("#startPage").hide();
								}
							}
							
							var selectId = event.target;
							var selectItem = this.get(selectId);
							
							if("SITE" != selectItem.text){
								var getCustomerListObj = [];
								var customerList = new Model();
								customerList.url = customerList.url + '/getCustomerList';
								
//								if(selectItem.parent_site_id == -1) {
//									customerList.set({
//										"parent_site_id" : selectItem.site_id
//									});
//								} else {
//									customerList.set({"site_id" : selectItem.site_id});
//								}
								
								getCustomerListObj = that.makeCustomerList(selectItem.site_id, companyMgr.allMenu);
								
								customerList.set({"customerList" : getCustomerListObj});
								
								customerList.save({}, {
									success : function(model, response, options){
										that.setCustomerList(model);
									},
									error : function(model, xhr, options){
										console.log("Add Group Error");
									}
								});	
								
								w2ui['companyDetailProperties'].record = {
										company_name : selectItem.site_name,
										ceo_name : selectItem.ceo_name,
										company_registration_number : selectItem.company_number, 
										phone : selectItem.main_phone,
										area : selectItem.area,
										fax : selectItem.fax,
										address : selectItem.address,
										note : selectItem.note
								}	
							}else{ // Click 'MENU'
								w2ui['companyDetailProperties'].record = {
									company_name : '',
									ceo_name : '',
									company_registration_number : '',
									phone : '',
									area : '',
									fax : '',
									address : '',
								}
								
								w2ui['customer_list'].records = [];
								w2ui['customer_list'].refresh();
							}
							w2ui['companyDetailProperties'].refresh();
							$(".w2ui-field-helper").addClass('readonlyEffect');
							companyMgr.selectItem = selectItem;
						}
					}
				},
			});
		},
		
		virCreateMenuTree : function(){
			$("#companyVirMainBottom").w2sidebar({
				name : 'companyVirMenuTree',
				nodes : [
					{id: 'Menu', text: 'MENU LIST', expanded: true, group: true,
					nodes: [{id:'-1',  selected : true, expanded: true/*, img: 'fa icon-folder'*/}]}
				]
			});
		},
		
		validationCheckMenu : function(){
			if(w2ui['companyTree'].selected != "site" && w2ui['companyTree'].selected != null){
			// companyTree 선택 O
				if(w2ui['companyTree'].selected.text == 'SITE'){
					$("#companyAddBtnDelBtn").prop("disabled", true);
				    $("#companyAddBtnDelBtn").removeClass('link');
				}else{
					$("#companyDelBtn").prop("disabled", false);
					$("#companyDelBtn").addClass('link');
				}
				$("#companyAddBtn").prop("disabled", false);
			    $("#companyAddBtn").addClass('link');
			    $("#companyEditBtn").prop("disabled", false);
			    $("#companyEditBtn").addClass('link');
			}else{
		   // companyTree 선택 X
				$("#companyAddBtn").prop("disabled", false);
			    $("#companyAddBtn").addClass('link');
			    $("#companyDelBtn").prop("disabled", true);
			    $("#companyDelBtn").removeClass('link');
			    $("#companyEditBtn").prop("disabled", true);
			    $("#companyEditBtn").removeClass('link');
			}
		},
		
		getCompanyList : function(type, action) {
			var companyList = new Model();
			companyList.url = companyList.url + '/getCompanyList';
			if(type == 'init') {
				that.listenTo(companyList, 'sync', that.setCompanyList);
			} else {
				if(action == 'delete') {
					that.listenTo(companyList, 'sync', that.deleteCompanyList);
					this.getCustomerList(companyMgr.selectItem.parent_site_id, action);
				} else {
					that.listenTo(companyList, 'sync', that.updateCompanyList);
					this.getCustomerList(companyMgr.selectItem.site_id, action);
				}
			}
			companyList.fetch();
		},
		
		setCompanyList : function(method, model, options) {
			companyMgr.treeMenu = model.treeData.nodes;
			companyMgr.allMenu = model.allData;
			
			w2ui['companyTree'].insert('site', null, model.treeData.nodes);

  			if(companyMgr.selectItem){
				w2ui["companyTree"].select(companyMgr.selectItem.site_id);
			} else {
				w2ui["companyTree"].select(model.treeData.nodes[0].site_id);
				companyMgr.selectItem = w2ui["companyTree"].get(model.treeData.nodes[0].site_id);
			}
  			
			$(".w2ui-field-helper").addClass('readonlyEffect');
			
			// Menu Checkbox Disabled
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
			
			w2ui['companyDetailProperties'].record = {
					company_name : model.treeData.nodes[0].site_name,
					ceo_name : model.treeData.nodes[0].ceo_name,
					company_registration_number : model.treeData.nodes[0].company_number, 
					phone : model.treeData.nodes[0].phone,
					area : model.treeData.nodes[0].area,
					fax : model.treeData.nodes[0].fax,
					address : model.treeData.nodes[0].address,
			};
			
			w2ui['companyDetailProperties'].refresh();
			
			this.getCustomerList(model.treeData.nodes[0].site_id, null);
		},
		
		updateCompanyList : function(method, model, options) {
			companyMgr.treeMenu = model.treeData.nodes;
			companyMgr.allMenu = model.allData;
			
			w2ui['companyTree'].insert('site', null, model.treeData.nodes);

//  		if(companyMgr.selectItem){
//				w2ui["companyTree"].select(companyMgr.selectItem.site_id);
//			} else {
//				w2ui["companyTree"].select(model.treeData.nodes[0].site_id);
//				companyMgr.selectItem = w2ui["companyTree"].get(model.treeData.nodes[0].site_id);
//			}
			
  			if(companyMgr.selectItem.text != 'SITE'){
				w2ui["companyTree"].select(companyMgr.selectItem.site_id);
			}
  			
			$(".w2ui-field-helper").addClass('readonlyEffect');
			
			// Menu Checkbox Disabled
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
			
//			if(companyMgr.selectItem.text == "SITE") {
//				w2ui["companyTree"].select(model.treeData.nodes[0].site_id);
//				w2ui['companyDetailProperties'].record = {
//						company_name : model.treeData.nodes[0].site_name,
//						ceo_name : model.treeData.nodes[0].ceo_name,
//						company_registration_number : model.treeData.nodes[0].company_number, 
//						phone : model.treeData.nodes[0].phone,
//						area : model.treeData.nodes[0].area,
//						fax : model.treeData.nodes[0].fax,
//						address : model.treeData.nodes[0].address,
//				};
//			} else {
//				w2ui['companyDetailProperties'].record = {
//						company_name : w2ui["companyTree"].get(companyMgr.selectItem.site_id).site_name,
//						ceo_name : w2ui["companyTree"].get(companyMgr.selectItem.site_id).ceo_name,
//						company_registration_number : w2ui["companyTree"].get(companyMgr.selectItem.site_id).company_number, 
//						phone : w2ui["companyTree"].get(companyMgr.selectItem.site_id).phone,
//						area : w2ui["companyTree"].get(companyMgr.selectItem.site_id).area,
//						fax : w2ui["companyTree"].get(companyMgr.selectItem.site_id).fax,
//						address : w2ui["companyTree"].get(companyMgr.selectItem.site_id).address,
//				};
//			}
			
			if(companyMgr.selectItem.text != "SITE") {
				w2ui['companyDetailProperties'].record = {
						company_name : w2ui["companyTree"].get(companyMgr.selectItem.site_id).site_name,
						ceo_name : w2ui["companyTree"].get(companyMgr.selectItem.site_id).ceo_name,
						company_registration_number : w2ui["companyTree"].get(companyMgr.selectItem.site_id).company_number, 
						phone : w2ui["companyTree"].get(companyMgr.selectItem.site_id).phone,
						area : w2ui["companyTree"].get(companyMgr.selectItem.site_id).area,
						fax : w2ui["companyTree"].get(companyMgr.selectItem.site_id).fax,
						address : w2ui["companyTree"].get(companyMgr.selectItem.site_id).address,
				};
			}		
			
			w2ui['companyDetailProperties'].refresh();
		},
		
		deleteCompanyList : function(method, model, options) {
			companyMgr.treeMenu = model.treeData.nodes;
			companyMgr.allMenu = model.allData;
			
			w2ui['companyTree'].insert('site', null, model.treeData.nodes);

  			if(companyMgr.selectItem){
				w2ui["companyTree"].select(companyMgr.selectItem.parent_site_id);
			} else {
				w2ui["companyTree"].select(model.treeData.nodes[0].site_id);
				companyMgr.selectItem = w2ui["companyTree"].get(model.treeData.nodes[0].site_id);
			}
  			
			$(".w2ui-field-helper").addClass('readonlyEffect');
			
			// Menu Checkbox Disabled
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
			
			if(companyMgr.selectItem.text == "SITE") {
				w2ui["companyTree"].select(model.treeData.nodes[0].site_id);
				w2ui['companyDetailProperties'].record = {
						company_name : model.treeData.nodes[0].site_name,
						ceo_name : model.treeData.nodes[0].ceo_name,
						company_registration_number : model.treeData.nodes[0].company_number, 
						phone : model.treeData.nodes[0].phone,
						area : model.treeData.nodes[0].area,
						fax : model.treeData.nodes[0].fax,
						address : model.treeData.nodes[0].address,
				};
			} else {
				w2ui['companyDetailProperties'].record = {
						company_name : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).site_name,
						ceo_name : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).ceo_name,
						company_registration_number : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).company_number, 
						phone : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).phone,
						area : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).area,
						fax : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).fax,
						address : w2ui["companyTree"].get(companyMgr.selectItem.parent_site_id).address,
				};
			}
			
			w2ui['companyDetailProperties'].refresh();
			
			companyMgr.selectItem = companyMgr.selectItem.parent;
		},
		
		getCustomerList : function(site_id, action) {
			var getCustomerListObj = []; 
			var customerList = new Model();
			customerList.url = customerList.url + '/getCustomerList';
//			if(action == 'update') {
//				customerList.set({"site_id" : site_id});
//			} else {
//				customerList.set({"parent_site_id" : site_id});
//			}
			
			getCustomerListObj = that.makeCustomerList(site_id, companyMgr.allMenu);
			
			customerList.set({"customerList" : getCustomerListObj});
			
			customerList.save({}, {
				success : function(model, response, options){
					that.setCustomerList(model);
				},
				error : function(model, xhr, options){
					console.log("Add Group Error");
				}
			});	
			
		},
		
		setCustomerList : function(model) {
        	var array = model.toJSON();
        	var companyData = array.data.companyData;
        	var customerData = array.data.customerData;
			
			w2ui['customer_list'].records = customerData;
			w2ui['customer_list'].refresh();
		},
		
		setCustomerGrid : function(model, type) {
        	var array = model.toJSON();
        	var companyData = array.data.companyData;
        	var customerData = array.data.customerData;
			
        	if(type == 'add') {
    			w2ui['customer_product_list_grid'].records = customerData;
    			w2ui['customer_product_list_grid'].refresh();
    			w2ui['customer_product_list_grid'].selectNone();
        	} else {
        		editParamCustomerInfo  = customerData;
    			w2ui['customer_edit_product_list_grid'].records = customerData;
    			w2ui['customer_edit_product_list_grid'].refresh();
    			w2ui['customer_edit_product_list_grid'].selectNone();
        	}
		},
		
		getCustomerGridList : function(type) {
			var getCustomerListObj = []; 
			var customerList = new Model();
			
//			if(companyMgr.selectItem.parent_site_id == -1) {
//				customerList.set({
//					"parent_site_id" : companyMgr.selectItem.site_id
//				});
//			} else {
//				customerList.set({
//					"site_id" : companyMgr.selectItem.site_id
//				});
//			}
			
			getCustomerListObj = that.makeCustomerList(companyMgr.selectItem.site_id, companyMgr.allMenu);
			customerList.set({"customerList" : getCustomerListObj});
			
			customerList.url = customerList.url + '/getCustomerList';
			customerList.save({}, {
				success : function(model, response, options){
					if(type == 'add') {
						companyMgr.site_id = util.createUID();
						that.displayAddPopup(model);
					} else {
						that.displayEditPopup(model);
					}
				},
				error : function(model, xhr, options){
					console.log("Add Group Error");
				}
			});	
		},
		
		companyAdd : function() {
			requestParam = {};
			paramCustomerInfo = [];
			if(companyMgr.selectItem == null) {
				that.displayAddPopup(null);
			} else {
				that.getCustomerGridList('add');
			}
		},
		
		companyEdit : function() {
			if(companyMgr.selectItem.text == 'SITE') {
				$('#companyEditBtn').prop('disabled', true);
				return;
			} else {
				$('#companyEditBtn').prop('disabled', false);
			}
			
			if(companyMgr.selectItem == null) {
				return;
			} else {
				that.getCustomerGridList('edit');
			}
		},
		
		displayAddPopup : function(data) {
			var cnvtDay = util.getDate("Day");
			var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
			
			if(w2ui['company_popup_properties']){
				w2ui['company_popup_properties'].destroy();
			}
			
			if(w2ui['customer_popup_properties']){
				w2ui['customer_popup_properties'].destroy();
			}
			
			if(w2ui['customer_product_list_grid']){
				w2ui['customer_product_list_grid'].destroy();
			}        	
        	
			company_fields = [
				{name:'company_name_addPopup', type: 'text', disabled:false, required:true, html:{caption:BundleResource.getString('label.siteManager.companyName')}},
				{name:'ceo_name_addPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.ceoName')}},
				{name:'company_registration_number_addPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.companyRegistrationNumber')}},
				{name:'main_phone_addPopup', type : 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.phone')}},
				{name:'area_addPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.area')}},
				{name:'fax_addPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.fax')}},
				{name:'address_addPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.address')}},
				{name:'note_addPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.note')}}
			];
			
			company_record = {
					company_name_addPopup : '',
					ceo_name_addPopup : '',
					company_registration_number_addPopup : '',
					main_phone_addPopup : '',
					area_addPopup : '',
					fax_addPopup : '',
					address_addPopup : '',
					note_addPopup : ''
			};
			
			customer_fields = [				
				{name:'customer_name_addPopup', type: 'text', disabled:true, required:true, html:{caption:BundleResource.getString('label.siteManager.customerName')}},
				{name:'rank_addPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.rank')}},
				{name:'department_addPopup', type : 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.department')}},
				{name:'phone_addPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.phone')}},
				{name:'mobile_phone_addPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.mobilePhone')}},
				{name:'email_addPopup', type: 'text', disabled:true, required:true, html:{caption:BundleResource.getString('label.siteManager.email')}},
				{name:'task_addPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.task')}}
			];
			
			customer_record = {					
					customer_name_addPopup : '',
					rank_addPopup : '',
					department_addPopup : '',
					phone_addPopup : '',
					mobile_phone_addPopup : '',
					email_addPopup : '',
					task_addPopup : '',
			}			
			
			popupHeight = 730;
			
			body = '<div class="w2ui-centered">'+
			'<div id="companyPopupContents" style="width:100%; height:100%" >'+
			
				'<div class="w2ui-page page-0">'+
				
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>' + BundleResource.getString('label.siteManager.companyInfo') + '</label>'+
			                '</div>'+	
			        	'</div>'+
			        '</div>'+
	        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+       
			            '<div class="" style="height: 64px; margin-bottom:3px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+ BundleResource.getString('label.siteManager.companyName') + '</label>'+
			                    '<div>'+
			                        '<input name="company_name_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.area')+'</label>'+
			                    '<div>'+
			                        '<input name="area_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+//left
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+ 
			        	'<div class="" style="height: 64px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.ceoName')+'</label>'+
			                    '<div>'+
			                    	'<input name="ceo_name_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.phone')+'</label>'+
			                    '<div>'+
			                    	'<input name="main_phone_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			        	'</div>'+
			        '</div>'+//center
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+
			            '<div class="" style="height: 64px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.companyRegistrationNumber')+'</label>'+
			                    '<div>'+
			                        '<input name="company_registration_number_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.fax')+'</label>'+
			                    '<div>'+
			                    	'<input name="fax_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
					
					'<div style="width: 100%;  margin-right: 0px; float: left;">'+       
			            '<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.address')+'</label>'+
			                    '<div style="float:left; margin-left:20px;">'+
			                        '<input name="address_addPopup" type="text" maxlength="100" size="74" style="width:453px;">'+
			                    '</div>'+
			                '</div>'+		                
			            '</div>'+
			        '</div>'+
			        
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.note')+'</label>'+
			                    '<div style="float:left; margin-left:20px;">'+
			                        '<input name="note_addPopup" type="text" maxlength="100" size="74" style="width:453px;">'+
			                    '</div>'+
			                '</div>'+	
			        	'</div>'+
			        '</div>'+
		            
		            '<div style="width:100%; float:left; margin:10px 0px; border:1px solid #737478;">'+ 
		            '</div>' +
		            
			        '<div style="clear: both;"></div>'+
			        
				    '</div>'+ //w2ui-page page-0
				
				
				'</div>'+ //companyPopupContents		            
		            
		            
		            
				'<div id="customerPopupContents" style="width:100%; height:100%" >'+
				
				'<div class="w2ui-page page-0">'+
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.managerInfo')+'</label>'+
			                '</div>'+	
			                
			                '<div class="w2ui-field w2ui-span4">'+
			                	'<button id="customAddPopupNewBtn" class="darkButton" style="float:right; margin-right:17px;">'+ BundleResource.getString('button.siteManager.new') + '</button>'+
			                	'<button id="customAddPopupCancelBtn" class="darkButton" style="float:right; margin-right:17px; width:70px; display:none;">'+ BundleResource.getString('button.siteManager.cancel') + '</button>'+
			                	//'<button id="customAddPopupEditBtn" class="darkButton" style="float:right; margin-right:3px; width:70px; display:none;">'+ BundleResource.getString('button.siteManager.modify') + '</button>'+
			                	'<button id="customAddPopupAddBtn" class="darkButton" style="float:right; margin-right:3px; width:70px; display:none;">'+ BundleResource.getString('button.siteManager.add') + '</button>'+
			                '</div>'+			                
			        	'</div>'+
			        '</div>'+	
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+ 
			        
			            '<div class="" style="height: 64px; margin-bottom:3px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.customerName')+'</label>'+
			                    '<div id="customerNameField">'+
			                        '<input name="customer_name_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.phone')+'</label>'+
			                    '<div id="customerPhoneField">'+
			                        '<input name="phone_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+//left
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+ 
			        	'<div class="" style="height: 64px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.rank')+'</label>'+
			                    '<div id="customerRankField">'+
			                    	'<input name="rank_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.mobilePhone')+'</label>'+
			                    '<div id="customerMobilePhoneField">'+
			                    	'<input name="mobile_phone_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			        	'</div>'+
			        '</div>'+//center
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+
			            '<div class="" style="height: 64px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.department')+'</label>'+
			                    '<div id="customerDepartmentField">'+
			                        '<input name="department_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.email')+'</label>'+
			                    '<div id="customerEmailField">'+
			                    	'<input name="email_addPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
					
					'<div style="width: 100%;  margin-right: 0px; float: left;">'+       
			            '<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.task')+'</label>'+
			                    '<div style="float:left; margin-left:20px;">'+
			                        '<input name="task_addPopup" type="text" maxlength="100" size="73" style="width:453px;">'+
			                    '</div>'+
			                '</div>'+		                
			            '</div>'+
			        '</div>'+
			        
			        
			        
			        
			        
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			    			'<div class="customer-btn">'+
								'<i id="customerAddPopupDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" title="Delete"></i>'+
			                '</div>'+//product-btn
			        	'</div>'+
			        '</div>'+
			        
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+ 
		                '<div id="customerListResult">'+
			                '<div class="dashboard-panel" style="width:100%;">'+
					    		'<div class="dashboard-contents">'+
			                		'<div id="customerListResultBottom"></div>'+
					    		'</div>'+
					    	'</div>'+
		                '</div>'+
			        '</div>'+
			        
		            
			        
			        '<div style="clear: both;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
			
			
			'</div>'+ //customerPopupContents
			
				'<div id="companyPopupBottom">'+
					'<button id="companyPopupOkBtn" class="darkButton">'+ BundleResource.getString('button.roleManager.save') + '</button>'+
					'<button id="companyPopupCloseBtn"  class="darkButton">'+ BundleResource.getString('button.roleManager.close') + '</button>'+
					//'<button onclick="w2popup.close();"  class="darkButton">'+ BundleResource.getString('button.roleManager.close') + '</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.siteManager.addCompanyInfo'),
		        body: body,
		        width : 900,
		        height : popupHeight,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		
		        	}
		        },
		        onClose   : function(event){
//		        	w2ui['company_popup_properties'].destroy();
//		        	w2ui['customer_popup_properties'].destroy();
//		        	w2ui['customer_product_list_grid'].destroy();
		        }
		    });
    		
    		$("#companyPopupContents").w2form({
    			name : 'company_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : company_fields,
    			record: company_record,
    			onRender : function(event){
    				event.onComplete = function(event){

    				}
    			}
    		});
    		
    		$("#customerPopupContents").w2form({
    			name : 'customer_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : customer_fields,
    			record: customer_record,
    			onRender : function(event){
    				event.onComplete = function(event){
    					$("#customerListResultBottom").w2grid({
    						name : 'customer_product_list_grid',
    						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
    						show: { 
    							toolbar: false,
    							footer:false,
    							toolbarSearch:false,
    							toolbarReload  : false,
    							searchAll : false,
    							toolbarColumns : false,
    							selectColumn: true
    						},
							recordHeight : 30,
							blankSymbol : "-",
							columns : [
								{ field: 'recid', caption: BundleResource.getString('label.siteManager.number'), size : '100px', sortable: true, attr: 'align=center'},
								{ field: 'customer_name', caption: BundleResource.getString('label.siteManager.name'), size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'rank', caption: BundleResource.getString('label.siteManager.rank'), size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'department', caption: BundleResource.getString('label.siteManager.department'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'phone', caption: BundleResource.getString('label.siteManager.phone'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'mobile_phone', caption: BundleResource.getString('label.siteManager.mobilePhone'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'email', caption: BundleResource.getString('label.siteManager.email'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'task', caption: BundleResource.getString('label.siteManager.task'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'}
							],
							records : [],
    						onClick: function(event) {

    						},
    						onRefresh: function(event) {

    						},
    						onDblClick: function(event) {
    							that.customerEdit(w2ui['customer_product_list_grid'].get(event.recid));
    						}  
    					});
    				}
    			}
    		});  

    		$("#customerAddPopupDelBtn").css('opacity', 0.5);
    		$("#customerAddPopupDelBtn").removeClass('link');
		},
		
		addCompanyOk : function() {
			var site_id = companyMgr.site_id;
			var site_name = $('#company_name_addPopup').val();
			var main_phone = $('#main_phone_addPopup').val();
			var fax = $('#fax_addPopup').val();
			var ceo_name = $('#ceo_name_addPopup').val();
			var company_number = $('#company_registration_number_addPopup').val();
			var area = $('#area_addPopup').val();
			var address = $('#address_addPopup').val();
			var note = $('#note_addPopup').val();
			var parent_site_id = null;
			var arr = w2ui['company_popup_properties'].validate();
			var bodyContents = "";
			
			if(arr.length > 0){
				return;
			}else{
				for(var i = 0; i < companyMgr.treeMenu.length; i++) {
					if(companyMgr.treeMenu[i].site_name == site_name && companyMgr.selectItem.text == "SITE") {
						that.popupMessage();
						return;
					}
				}
				
				if(companyMgr.selectItem == null || companyMgr.selectItem.text == 'SITE') {
					parent_site_id = -1;
				} else {
					parent_site_id = companyMgr.selectItem.site_id;
				}				
				
				var companyList = new Model();
				companyList.url = companyList.url + '/addCompanyInfo';
				companyList.set({
					"site_id" : site_id,
					"site_name" : site_name,
					"main_phone" : main_phone,
					"fax" : fax,
					"parent_site_id" : parent_site_id,
					"ceo_name" : ceo_name,
					"company_number" : company_number,
					"area" : area,
					"address" : address,
					"note" : note
				});
				companyList.save({}, {
					success : function(model, response, options){
						w2popup.close();
						
      	    			if(companyMgr.selectItem.parent_site_id == -1) {
	      	    			companyMgr.setNewData('add');
      	    			} else {
	      	    			companyMgr.setNewData('update');
      	    			}					      	    			
      	    			companyMgr.site_id = null;
						if(w2ui['customer_product_list_grid'].records.length > 0) {
							var customerList = new Model(requestParam);
							customerList.url = customerList.url + '/addCustomerInfo';
							customerList.save({}, {
								success : function(model, response, options){
									bodyContents = BundleResource.getString('label.roleManager.itemAdded'); //"추가 되었습니다.";
									body = '<div class="w2ui-centered">'+
				    				'<div class="popup-contents">'+ bodyContents +'</div>'+
				    				'<div class="popup-btnGroup">'+
				    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
				    					'</div>'+
				    				'</div>' ;
				        	  
									w2popup.open({
					            		width: 385,
					      		        height: 180,
					    		        title : BundleResource.getString('title.roleManager.info'),
					    		        body: body,
						                opacity   : '0.5',
						         		modal     : true,
						    		    showClose : true,
					      	    		onClose   : function(event){
					      	    			w2ui['company_popup_properties'].destroy();
					      	    			w2ui['customer_popup_properties'].destroy();
					      	    			w2ui['customer_product_list_grid'].destroy();
					      	    		}
							      	});			
									w2ui['customer_popup_properties'].clear();
									
									var getCustomerListObj = [];
									var customerList = new Model();
									customerList.url = customerList.url + '/getCustomerList';
									
//									if(companyMgr.selectItem.parent_site_id == -1) {
//										customerList.set({
//											"parent_site_id" : companyMgr.selectItem.site_id
//										});
//									} else {
//										customerList.set({
//											"site_id" : companyMgr.selectItem.site_id
//										});
//									}
									
									getCustomerListObj = that.makeCustomerList(companyMgr.selectItem.site_id, companyMgr.allMenu);
									customerList.set({"customerList" : getCustomerListObj});
									
									customerList.save({}, {
										success : function(model, response, options){
											that.setCustomerList(model);
											that.setCustomerGrid(model, 'add');
										},
										error : function(model, xhr, options){
											console.log("Add Group Error");
										}
									});	
								},
								error : function(model, xhr, options){
									console.log("Add Group Error");
									w2ui['customer_popup_properties'].clear();
								}
							});	
						} else {
							bodyContents = BundleResource.getString('label.roleManager.itemAdded'); //"추가 되었습니다.";
							body = '<div class="w2ui-centered">'+
		    				'<div class="popup-contents">'+ bodyContents +'</div>'+
		    				'<div class="popup-btnGroup">'+
		    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
		    					'</div>'+
		    				'</div>' ;
		        	  
							w2popup.open({
			            		width: 385,
			      		        height: 180,
			    		        title : BundleResource.getString('title.roleManager.info'),
			    		        body: body,
				                opacity   : '0.5',
				         		modal     : true,
				    		    showClose : true,
			      	    		onClose   : function(event){
			      	    			w2ui['company_popup_properties'].destroy();
			      	    			w2ui['customer_popup_properties'].destroy();
			      	    			w2ui['customer_product_list_grid'].destroy();
			      	    			companyMgr.setNewData(null);
			      	    			companyMgr.site_id = null;
			      	    		}
					      	});	
						}				
					},
					error : function(model, xhr, options){
						console.log("Add Group Error");
					}
				});
			}
		},
		
		companyDelete : function() {
			if(companyMgr.selectItem.text == 'SITE') {
				$('#companyDelBtn').prop('disabled', true);
				return;
			} else {
				$('#companyDelBtn').prop('disabled', false);
			}
			
			var bodyContents = BundleResource.getString('label.siteManager.deleteConfirm'); //"추가 되었습니다.";
			var body = '<div class="w2ui-centered">'+
			'<div class="popup-contents">'+ bodyContents +'</div>'+
			'<div class="popup-btnGroup">'+
				'<button class="darkButton" onclick="companyMgr.deleteAction();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
				'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.order.cancel') + '</button>'+
				//'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
				'</div>'+
			'</div>' ;
	  
			w2popup.open({
        		width: 385,
  		        height: 180,
		        title : BundleResource.getString('title.roleManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true,
  	    		onClose   : function(event){
  	    		}
	      	});	
		},
		
		deleteAction : function() {
			var deleteCompanyList = [];
			var deleteCompany = new Model();
			deleteCompany.url = deleteCompany.url + '/deleteCompanyInfo';
//			deleteCompany.set({"site_id" : companyMgr.selectItem.site_id});
			deleteCompanyList = that.makeCustomerList(companyMgr.selectItem.site_id, companyMgr.allMenu);
			deleteCompany.set({"deleteCompanyList" : deleteCompanyList});
			deleteCompany.save({}, {
				success : function(model, response, options){
					w2popup.close();
					
					if(companyMgr.selectItem.parent_site_id == -1) {
						companyMgr.selectItem = null;
	  	    			w2ui['companyTree'].destroy();
						companyMgr.createMenuTree();
						companyMgr.getCompanyList('init', null);
					} else {
						var getCustomerListObj = [];
						var customerList = new Model();
						customerList.url = customerList.url + '/getCustomerList';
//						customerList.set({
//							"parent_site_id" : companyMgr.selectItem.parent_site_id
//						});
						
						getCustomerListObj = that.makeCustomerList(companyMgr.selectItem.site_id, companyMgr.allMenu);
						customerList.set({"customerList" : getCustomerListObj});
						
						customerList.save({}, {
							success : function(model, response, options){
								companyMgr.setNewData('delete');
								companyMgr.site_id = null;	
								
								var bodyContents = BundleResource.getString('label.siteManager.deleteFinished'); //"추가 되었습니다.";
								var body = '<div class="w2ui-centered">'+
								'<div class="popup-contents">'+ bodyContents +'</div>'+
								'<div class="popup-btnGroup">'+
									'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.order.confirm') + '</button>'+
									//'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
									'</div>'+
								'</div>' ;
						  
								w2popup.open({
					        		width: 385,
					  		        height: 180,
							        title : BundleResource.getString('title.roleManager.info'),
							        body: body,
					                opacity   : '0.5',
					         		modal     : true,
					    		    showClose : true,
					  	    		onClose   : function(event){
					  	    		}
						      	});	
							},
							error : function(model, xhr, options){
								console.log("Add Group Error");
							}
						});
					}
				},
				error : function(model, xhr, options){
					console.log("Add Group Error");
				}
			});
		},
		
		addCompanyClose : function() {
			requestParam = {};
			paramCustomerInfo = [];

        	w2ui['company_popup_properties'].destroy();
        	w2ui['customer_popup_properties'].destroy();
        	w2ui['customer_product_list_grid'].destroy();			
			w2popup.close();
		},
		
		displayEditPopup : function(data) {
			var companyDatas = data.toJSON();
			var cnvtDay = util.getDate("Day");
			var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
			
			if(w2ui['company_edit_popup_properties']){
				w2ui['company_edit_popup_properties'].destroy();
			}
			
			if(w2ui['customer_edit_popup_properties']){
				w2ui['customer_edit_popup_properties'].destroy();
			}
			
			if(w2ui['customer_edit_product_list_grid']){
				w2ui['customer_edit_product_list_grid'].destroy();
			}	        	
        	
			company_fields = [
				{name:'company_name_editPopup', type: 'text', disabled:false, required:true, html:{caption:BundleResource.getString('label.siteManager.companyName')}},
				{name:'ceo_name_editPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.ceoName')}},
				{name:'company_registration_number_editPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.companyRegistrationNumber')}},
				{name:'main_phone_editPopup', type : 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.phone')}},
				{name:'area_editPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.area')}},
				{name:'fax_editPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.fax')}},
				{name:'address_editPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.address')}},
				{name:'note_editPopup', type: 'text', disabled:false, required:false, html:{caption:BundleResource.getString('label.siteManager.note')}}
			];
			
			company_record = {
//					company_name_editPopup : companyDatas.data.companyData[0].site_name,
//					ceo_name_editPopup : companyDatas.data.companyData[0].ceo_name,
//					company_registration_number_editPopup : companyDatas.data.companyData[0].company_number,
//					main_phone_editPopup : companyDatas.data.companyData[0].main_phone,
//					area_editPopup : companyDatas.data.companyData[0].area,
//					fax_editPopup : companyDatas.data.companyData[0].fax,
//					address_editPopup : companyDatas.data.companyData[0].address,
//					note_editPopup : companyDatas.data.companyData[0].note
					company_name_editPopup : companyMgr.selectItem.site_name,
					ceo_name_editPopup : companyMgr.selectItem.ceo_name,
					company_registration_number_editPopup : companyMgr.selectItem.company_number,
					main_phone_editPopup : companyMgr.selectItem.main_phone,
					area_editPopup : companyMgr.selectItem.area,
					fax_editPopup : companyMgr.selectItem.fax,
					address_editPopup : companyMgr.selectItem.address,
					note_editPopup : companyMgr.selectItem.note					
			};
			
			customer_fields = [				
				{name:'customer_name_editPopup', type: 'text', disabled:true, required:true, html:{caption:BundleResource.getString('label.siteManager.customerName')}},
				{name:'rank_editPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.rank')}},
				{name:'department_editPopup', type : 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.department')}},
				{name:'phone_editPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.phone')}},
				{name:'mobile_phone_editPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.mobilePhone')}},
				{name:'email_editPopup', type: 'text', disabled:true, required:true, html:{caption:BundleResource.getString('label.siteManager.email')}},
				{name:'task_editPopup', type: 'text', disabled:true, required:false, html:{caption:BundleResource.getString('label.siteManager.task')}}
			];
			
			customer_record = {					
					customer_name_editPopup : '',
					rank_editPopup : '',
					department_editPopup : '',
					phone_editPopup : '',
					mobile_phone_editPopup : '',
					email_editPopup : '',
					task_editPopup : '',
			}			
			
			popupHeight = 730;
			
			body = '<div class="w2ui-centered">'+
			'<div id="companyEditPopupContents" style="width:100%; height:100%" >'+
			
				'<div class="w2ui-page page-0">'+
				
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.companyInfo')+'</label>'+
			                '</div>'+	
			        	'</div>'+
			        '</div>'+
	        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+       
			            '<div class="" style="height: 64px; margin-bottom:3px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.companyName')+'</label>'+
			                    '<div>'+
			                        '<input name="company_name_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.area')+'</label>'+
			                    '<div>'+
			                        '<input name="area_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+//left
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+ 
			        	'<div class="" style="height: 64px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.ceoName')+'</label>'+
			                    '<div>'+
			                    	'<input name="ceo_name_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.phone')+'</label>'+
			                    '<div>'+
			                    	'<input name="main_phone_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			        	'</div>'+
			        '</div>'+//center
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+
			            '<div class="" style="height: 64px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.companyRegistrationNumber')+'</label>'+
			                    '<div>'+
			                        '<input name="company_registration_number_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.fax')+'</label>'+
			                    '<div>'+
			                    	'<input name="fax_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
					
					'<div style="width: 100%;  margin-right: 0px; float: left;">'+       
			            '<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.address')+'</label>'+
			                    '<div style="float:left; margin-left:20px;">'+
			                        '<input name="address_editPopup" type="text" maxlength="100" size="74" style="width:453px;">'+
			                    '</div>'+
			                '</div>'+		                
			            '</div>'+
			        '</div>'+
			        
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.note')+'</label>'+
			                    '<div style="float:left; margin-left:20px;">'+
			                        '<input name="note_editPopup" type="text" maxlength="100" size="74" style="width:453px;">'+
			                    '</div>'+
			                '</div>'+	
			        	'</div>'+
			        '</div>'+
		            
		            '<div style="width:100%; float:left; margin:10px 0px; border:1px solid #737478;">'+ 
		            '</div>' +
		            
			        '<div style="clear: both;"></div>'+
			        
				    '</div>'+ //w2ui-page page-0
				
				
				'</div>'+ //companyPopupContents		            
		            
		            
		            
				'<div id="customerEditPopupContents" style="width:100%; height:100%" >'+
				
				'<div class="w2ui-page page-0">'+
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.managerInfo')+'</label>'+
			                '</div>'+	
			                
			                '<div class="w2ui-field w2ui-span4">'+
			                	'<button id="customEditPopupNewBtn" class="darkButton" style="float:right; margin-right:17px;">'+ BundleResource.getString('button.siteManager.new') + '</button>'+
			                	'<button id="customEditPopupCancelBtn" class="darkButton" style="float:right; margin-right:17px; width:70px; display:none;">'+ BundleResource.getString('button.siteManager.cancel') + '</button>'+
			                	'<button id="customEditPopupEditBtn" class="darkButton" style="float:right; margin-right:3px; width:70px; display:none;">'+ BundleResource.getString('button.siteManager.modify') + '</button>'+
			                	'<button id="customEditPopupAddBtn" class="darkButton" style="float:right; margin-right:3px; width:70px; display:none;">'+ BundleResource.getString('button.siteManager.add') + '</button>'+
			                '</div>'+			                
			        	'</div>'+
			        '</div>'+	
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+ 
			        
			            '<div class="" style="height: 64px; margin-bottom:3px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.customerName')+'</label>'+
			                    '<div id="customerEditNameField">'+
			                        '<input name="customer_name_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.phone')+'</label>'+
			                    '<div id="customerEditPhoneField">'+
			                        '<input name="phone_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+//left
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+ 
			        	'<div class="" style="height: 64px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.rank')+'</label>'+
			                    '<div id="customerEditRankField">'+
			                    	'<input name="rank_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.mobilePhone')+'</label>'+
			                    '<div id="customerEditMobilePhoneField">'+
			                    	'<input name="mobile_phone_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			        	'</div>'+
			        '</div>'+//center
			        
			        '<div style="width: 33.3%; margin-right: 0px; float:left;">'+
			            '<div class="" style="height: 64px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.department')+'</label>'+
			                    '<div id="customerEditDepartmentField">'+
			                        '<input name="department_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.email')+'</label>'+
			                    '<div id="customerEditEmailField">'+
			                    	'<input name="email_editPopup" type="text" maxlength="100" size="25">'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
					
					'<div style="width: 100%;  margin-right: 0px; float: left;">'+       
			            '<div class="" style="height: 32px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>'+BundleResource.getString('label.siteManager.task')+'</label>'+
			                    '<div style="float:left; margin-left:20px;">'+
			                        '<input name="task_editPopup" type="text" maxlength="100" size="73" style="width:453px;">'+
			                    '</div>'+
			                '</div>'+		                
			            '</div>'+
			        '</div>'+
			        
			        
			        
			        
			        
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+
			        	'<div class="" style="height: 32px;">'+
			    			'<div class="customer-btn">'+
								'<i id="customerEditPopupDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" title="Delete"></i>'+
			                '</div>'+//product-btn
			        	'</div>'+
			        '</div>'+
			        
			        '<div style="width: 100%;  margin-right: 0px; float: left;">'+ 
		                '<div id="customerEditListResult">'+
			                '<div class="dashboard-panel" style="width:100%;">'+
					    		'<div class="dashboard-contents">'+
			                		'<div id="customerEditListResultBottom"></div>'+
					    		'</div>'+
					    	'</div>'+
		                '</div>'+
			        '</div>'+
			        
		            
			        
			        '<div style="clear: both;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
			
			
			'</div>'+ //customerPopupContents
			
				'<div id="companyEditPopupBottom">'+
					'<button id="companyEditPopupOkBtn" class="darkButton">'+ BundleResource.getString('button.roleManager.save') + '</button>'+
	    			'<button id="companyEditPopupCloseBtn" class="darkButton">'+ BundleResource.getString('button.roleManager.close') + '</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.siteManager.addCompanyInfo'),
		        body: body,
		        width : 900,
		        height : popupHeight,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		
		        	}
		        },
		        onClose   : function(event){
//		        	w2ui['company_edit_popup_properties'].destroy();
//		        	w2ui['customer_edit_popup_properties'].destroy();
//		        	w2ui['customer_edit_product_list_grid'].destroy();
		        }
		    });
    		
    		$("#companyEditPopupContents").w2form({
    			name : 'company_edit_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : company_fields,
    			record: company_record,
    			onRender : function(event){
    				event.onComplete = function(event){

    				}
    			}
    		});
    		
    		$("#customerEditPopupContents").w2form({
    			name : 'customer_edit_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : customer_fields,
    			record: customer_record,
    			onRender : function(event){
    				event.onComplete = function(event){
    					$("#customerEditListResultBottom").w2grid({
    						name : 'customer_edit_product_list_grid',
    						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
    						show: { 
    							toolbar: false,
    							footer:false,
    							toolbarSearch:false,
    							toolbarReload  : false,
    							searchAll : false,
    							toolbarColumns : false,
    							selectColumn: true
    						},
							recordHeight : 30,
							blankSymbol : "-",
							columns : [
								{ field: 'recid', caption: BundleResource.getString('label.siteManager.number'), size : '100px', sortable: true, attr: 'align=center'},
								{ field: 'customer_name', caption: BundleResource.getString('label.siteManager.name'), size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'rank', caption: BundleResource.getString('label.siteManager.rank'), size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'department', caption: BundleResource.getString('label.siteManager.department'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'phone', caption: BundleResource.getString('label.siteManager.phone'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'mobile_phone', caption: BundleResource.getString('label.siteManager.mobilePhone'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'email', caption: BundleResource.getString('label.siteManager.email'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'},
								{ field: 'task', caption: BundleResource.getString('label.siteManager.task'), size : '100%', sortable: true, attr: 'align=right', style: 'padding-right:5px;'}
							],
							records : [],
    						onClick: function(event) {

    						},
    						onRefresh: function(event) {

    						},
    						onDblClick: function(event) {
    							that.customerEdit(w2ui['customer_edit_product_list_grid'].get(event.recid));
    							companyMgr.editData = w2ui['customer_edit_product_list_grid'].get(event.recid);
    						}  
    					});
    				}
    			}
    		});    		
    		
    		if(companyMgr.selectItem == null || companyMgr.selectItem.text == "SITE") {
    			$('#customEditPopupNewBtn').prop('disabled', true);
    			$("#customEditPopupNewBtn").css('opacity', 0.5);
    		} else {
    			$('#customEditPopupNewBtn').prop('disabled', false);
    			$("#customEditPopupNewBtn").css('opacity', '');
    		}
    		
    		if(data != null) {
    			companyMgr.customer_data_length = data.attributes.data.customerData.length;
        		that.setCustomerGrid(data, 'edit');
    		}

    		$("#customerEditPopupDelBtn").css('opacity', 0.5);
    		$("#customerEditPopupDelBtn").removeClass('link');
		},
		
		editCompanyOk : function() {
			var site_name = $('#company_name_editPopup').val();
			var main_phone = $('#main_phone_editPopup').val();
			var fax = $('#fax_editPopup').val();
			var ceo_name = $('#ceo_name_editPopup').val();
			var company_number = $('#company_registration_number_editPopup').val();
			var area = $('#area_editPopup').val();
			var address = $('#address_editPopup').val();
			var note = $('#note_editPopup').val();
			var site_id = companyMgr.selectItem.site_id;
			var parent_site_id = null;
			var arr = w2ui['company_edit_popup_properties'].validate();
			var bodyContents = "";
			
			
			if(arr.length > 0){
				return;
			}else{
//				for(var i = 0; i < companyMgr.allMenu.length; i++) {
//					if(companyMgr.allMenu[i].site_name == site_name) {
//						that.popupMessage();
//						return;
//					}
//				}
				
				if(companyMgr.selectItem == null) {
					parent_site_id = -1;
				} else {
					parent_site_id = companyMgr.selectItem.parent_site_id;
				}				
				
				var companyList = new Model();
				companyList.url = companyList.url + '/updateCompanyInfo';
				companyList.set({
					"site_id" : site_id,
					"site_name" : site_name,
					"main_phone" : main_phone,
					"fax" : fax,
					"parent_site_id" : parent_site_id,
					"ceo_name" : ceo_name,
					"company_number" : company_number,
					"area" : area,
					"address" : address,
					"note" : note
				});
				companyList.save({}, {
					success : function(model, response, options){
						w2popup.close();
      	    			if(companyMgr.selectItem.parent_site_id == -1) {
	      	    			companyMgr.setNewData('add');
      	    			} else {
	      	    			companyMgr.setNewData('update');
      	    			}
						if(w2ui['customer_edit_product_list_grid'].records.length > 0 || 
						  (w2ui['customer_edit_product_list_grid'].records.length == 0 && companyMgr.customer_data_length > 0)) {
							var customerDelete = new Model();
							var customerDeleteList = [];
							customerDelete.url = customerDelete.url + '/deleteCustomerInfo';
//							if(companyMgr.selectItem.parent_site_id == -1) {
//								customerDelete.set({"parent_site_id" : site_id});
//							} else {
//								customerDelete.set({"site_id" : site_id});
//							}
							customerDeleteList = that.makeCustomerList(companyMgr.selectItem.site_id, companyMgr.allMenu);
							customerDelete.set({"customerDeleteList" : customerDeleteList});
							customerDelete.save({}, {
								success : function(model, response, options){
									if(w2ui['customer_edit_product_list_grid'].records.length > 0) {
										requestEditParam = {"paramCustomerInfo" : editParamCustomerInfo};
										var customerAddList = new Model(requestEditParam);
										customerAddList.url = customerAddList.url + '/addCustomerInfo';
										customerAddList.save({}, {
											success : function(model, response, options){
												var getCustomerListObj = [];
												var customerList = new Model();
												customerList.url = customerList.url + '/getCustomerList';
												
//												if(companyMgr.selectItem.parent_site_id == -1) {
//													customerList.set({
//														"parent_site_id" : companyMgr.selectItem.site_id
//													});
//												} else {
//													customerList.set({
//														"site_id" : companyMgr.selectItem.site_id
//													});
//												}
												
												getCustomerListObj = that.makeCustomerList(companyMgr.selectItem.site_id, companyMgr.allMenu);
												customerList.set({"customerList" : getCustomerListObj});
												
												customerList.save({}, {
													success : function(model, response, options){
														that.setCustomerList(model);
														that.setCustomerGrid(model, 'edit');
														//that.setEditPopupCustomerInfoDisplay();
													},
													error : function(model, xhr, options){
														console.log("Add Group Error");
													}
												});	
											},
											error : function(model, xhr, options){
												console.log("Add Group Error");
												w2ui['customer_edit_popup_properties'].clear();
											}
										});	
									}
								},
								error : function(model, xhr, options){
									console.log("Add Group Error");
								}
							});
						}
						
						bodyContents = BundleResource.getString('label.siteManager.editFinished'); //"추가 되었습니다.";
						body = '<div class="w2ui-centered">'+
	    				'<div class="popup-contents">'+ bodyContents +'</div>'+
	    				'<div class="popup-btnGroup">'+
	    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
	    					'</div>'+
	    				'</div>' ;
	        	  
						w2popup.open({
		            		width: 385,
		      		        height: 180,
		    		        title : BundleResource.getString('title.roleManager.info'),
		    		        body: body,
			                opacity   : '0.5',
			         		modal     : true,
			    		    showClose : true,
		      	    		onClose   : function(event){
		      	    			w2ui['company_edit_popup_properties'].destroy();
		      	    			w2ui['customer_edit_popup_properties'].destroy();
		      	    			w2ui['customer_edit_product_list_grid'].destroy();
		      	    		}
				      	});			
						w2ui['customer_edit_popup_properties'].clear();
					},
					error : function(model, xhr, options){
						console.log("Add Group Error");
					}
				});
			}
		},
		
		customerAddPopupAddAction : function() {
			var customer_name = $('#customer_name_addPopup').val();
			var phone = $('#phone_addPopup').val();
			var rank = $('#rank_addPopup').val();
			var mobile_phone = $('#mobile_phone_addPopup').val();
			var department = $('#department_addPopup').val();
			var email = $('#email_addPopup').val();
			var task = $('#task_addPopup').val();
			var site_id = null;
			var parent_site_id = null;
			var arr = w2ui['customer_popup_properties'].validate();
			var bodyContents = "";
			
			if(arr.length > 0){
				return;
			}else{
//				for(var i = 0; i < companyMgr.allMenu.length; i++) {
//					if(companyMgr.allMenu[i].site_name == site_name) {
//						that.popupMessage();
//						return;
//					}
//				}
				
				if(companyMgr.selectItem == null || companyMgr.selectItem.text == 'SITE') {
					site_id = companyMgr.site_id;
					parent_site_id = companyMgr.site_id;
				} else if(companyMgr.selectItem.parent_site_id == -1) {
					site_id = companyMgr.site_id;
					parent_site_id = companyMgr.selectItem.site_id;
				} else {
					site_id = companyMgr.site_id;
					parent_site_id = companyMgr.selectItem.parent_site_id;
				}	

				var param = {};
				var customerInfo = new Object();
				
				customerInfo.site_id = site_id;
				customerInfo.parent_site_id = parent_site_id;
				customerInfo.customer_name = customer_name;
				customerInfo.phone = phone;
				customerInfo.rank = rank;
				customerInfo.mobile_phone = mobile_phone;
				customerInfo.department = department;
				customerInfo.email = email;
				customerInfo.task = task;
				customerInfo.recid = w2ui['customer_product_list_grid'].records.length + 1;
				
				param = customerInfo;
				
				paramCustomerInfo.push(param);
				
				requestParam = {"paramCustomerInfo" : paramCustomerInfo};
				
    			w2ui['customer_product_list_grid'].records = paramCustomerInfo;
    			w2ui['customer_product_list_grid'].refresh();
    			w2ui['customer_product_list_grid'].selectNone();
    			w2ui['customer_popup_properties'].clear();
    			that.setAddPopupCustomerInfoDisplay();
			}
		},	
		
		addPopupCustomerDelete : function() {
			var selectId = w2ui["customer_product_list_grid"].getSelection();
			for(var i=0; i < w2ui["customer_product_list_grid"].getSelection().length; i++){
				w2ui["customer_product_list_grid"].select(selectId[i]);
				w2ui["customer_product_list_grid"].delete(true);
			}
		},
		
		customerEditPopupAddAction : function() {
			var customer_name = $('#customer_name_editPopup').val();
			var phone = $('#phone_editPopup').val();
			var rank = $('#rank_editPopup').val();
			var mobile_phone = $('#mobile_phone_editPopup').val();
			var department = $('#department_editPopup').val();
			var email = $('#email_editPopup').val();
			var task = $('#task_editPopup').val();
			var site_id = null;
			var parent_site_id = null;
			var arr = w2ui['customer_edit_popup_properties'].validate();
			var bodyContents = "";
			
			if(arr.length > 0){
				return;
			}else{
//				for(var i = 0; i < companyMgr.allMenu.length; i++) {
//					if(companyMgr.allMenu[i].site_name == site_name) {
//						that.popupMessage();
//						return;
//					}
//				}
				
				if(companyMgr.selectItem == null || companyMgr.selectItem.text == 'SITE') {
					site_id = companyMgr.selectItem.site_id;
					parent_site_id = companyMgr.selectItem.site_id;
				} else if(companyMgr.selectItem.parent_site_id == -1) {
					site_id = companyMgr.selectItem.site_id;
					parent_site_id = companyMgr.selectItem.site_id;
				} else {
					site_id = companyMgr.selectItem.site_id;
					parent_site_id = companyMgr.selectItem.parent_site_id;
				}	

				var param = {};
				var customerInfo = new Object();
				
				customerInfo.site_id = site_id;
				customerInfo.parent_site_id = parent_site_id;
				customerInfo.customer_name = customer_name;
				customerInfo.phone = phone;
				customerInfo.rank = rank;
				customerInfo.mobile_phone = mobile_phone;
				customerInfo.department = department;
				customerInfo.email = email;
				customerInfo.task = task;
				customerInfo.recid = w2ui['customer_edit_product_list_grid'].records.length + 1;
				
				param = customerInfo;
				
				editParamCustomerInfo.push(param);
				
//				requestEditParam = {"editParamCustomerInfo" : editParamCustomerInfo};
				requestEditParam = {"paramCustomerInfo" : editParamCustomerInfo};
				
    			w2ui['customer_edit_product_list_grid'].records = editParamCustomerInfo;
    			w2ui['customer_edit_product_list_grid'].refresh();
    			w2ui['customer_edit_product_list_grid'].selectNone();
    			w2ui['customer_edit_popup_properties'].clear();
    			that.setEditPopupCustomerInfoDisplay();
			}
		},
		
		customerEdit : function(data) {
			$('#customer_name_editPopup').val(data.customer_name);
			$('#phone_editPopup').val(data.phone);
			$('#rank_editPopup').val(data.rank);
			$('#mobile_phone_editPopup').val(data.mobile_phone);
			$('#department_editPopup').val(data.department);
			$('#email_editPopup').val(data.email);
			$('#task_editPopup').val(data.task);
			
			w2ui['customer_edit_popup_properties'].record.customer_name_editPopup = data.customer_name;
			w2ui['customer_edit_popup_properties'].record.phone_editPopup = data.phone;
			w2ui['customer_edit_popup_properties'].record.rank_editPopup = data.rank;
			w2ui['customer_edit_popup_properties'].record.mobile_phone_editPopup = data.mobile_phone;
			w2ui['customer_edit_popup_properties'].record.department_editPopup = data.department;
			w2ui['customer_edit_popup_properties'].record.email_editPopup = data.email;
			w2ui['customer_edit_popup_properties'].record.task_editPopup = data.task;
			
			$('#customEditPopupNewBtn').hide();
			$('#customEditPopupAddBtn').hide();
			
			$('#customEditPopupEditBtn').show();
			$('#customEditPopupCancelBtn').show();
			
			$('#customer_name_editPopup').prop('readonly', false);
			$('#rank_editPopup').prop('readonly', false);
			$('#department_editPopup').prop('readonly', false);
			$('#phone_editPopup').prop('readonly', false);
			$('#mobile_phone_editPopup').prop('readonly', false);
			$('#email_editPopup').prop('readonly', false);
			$('#task_editPopup').prop('readonly', false);
		},
		
		customerEditPopupEditAction : function() {
			var customer_name = $('#customer_name_editPopup').val();
			var phone = $('#phone_editPopup').val();
			var rank = $('#rank_editPopup').val();
			var mobile_phone = $('#mobile_phone_editPopup').val();
			var department = $('#department_editPopup').val();
			var email = $('#email_editPopup').val();
			var task = $('#task_editPopup').val();
			var site_id = null;
			var parent_site_id = null;
			var arr = w2ui['customer_edit_popup_properties'].validate();
			var bodyContents = "";
			
			if(arr.length > 0){
				return;
			}else{
//				for(var i = 0; i < companyMgr.allMenu.length; i++) {
//					if(companyMgr.allMenu[i].site_name == site_name) {
//						that.popupMessage();
//						return;
//					}
//				}
				
				if(companyMgr.selectItem == null || companyMgr.selectItem.text == 'SITE') {
					site_id = companyMgr.site_id;
					parent_site_id = companyMgr.site_id;
				} else if(companyMgr.selectItem.parent_site_id == -1) {
					site_id = companyMgr.site_id;
					parent_site_id = companyMgr.selectItem.site_id;
				} else {
					site_id = companyMgr.selectItem.site_id;
					parent_site_id = companyMgr.selectItem.parent_site_id;
				}	

				var param = {};
				var customerInfo = new Object();
				
				customerInfo.site_id = companyMgr.editData.site_id;
				customerInfo.parent_site_id = companyMgr.editData.parent_site_id;
				customerInfo.customer_name = customer_name;
				customerInfo.phone = phone;
				customerInfo.rank = rank;
				customerInfo.mobile_phone = mobile_phone;
				customerInfo.department = department;
				customerInfo.email = email;
				customerInfo.task = task;
				customerInfo.recid = companyMgr.editData.recid;
				
				param = customerInfo;
				
				editParamCustomerInfo.splice(companyMgr.editData.recid-1, 1);
				editParamCustomerInfo.splice(companyMgr.editData.recid-1, 0, param);				
				w2ui['customer_edit_product_list_grid'].clear();
				
				//editParamCustomerInfo.push(param);
				
//				requestEditParam = {"editParamCustomerInfo" : editParamCustomerInfo};
				requestEditParam = {"paramCustomerInfo" : editParamCustomerInfo};
				
				//w2ui["customer_edit_product_list_grid"].select(companyMgr.editData.recid);
				//w2ui["customer_edit_product_list_grid"].delete(true);
				
    			w2ui['customer_edit_product_list_grid'].records = editParamCustomerInfo;
    			w2ui['customer_edit_product_list_grid'].refresh();
    			w2ui['customer_edit_product_list_grid'].selectNone();
    			w2ui['customer_edit_popup_properties'].clear();
    			that.cancelEditPopupCustomerInfoDisplay();
			}
		},
		
		editPopupCustomerDelete : function() {
			var selectId = w2ui["customer_edit_product_list_grid"].getSelection();
			for(var i=0; i < w2ui["customer_edit_product_list_grid"].getSelection().length; i++){
				w2ui["customer_edit_product_list_grid"].select(selectId[i]);
				w2ui["customer_edit_product_list_grid"].delete(true);
			}
		},
		
		editCompanyClose : function() {
			requestEditParam = {};
			editParamCustomerInfo = [];

        	w2ui['company_edit_popup_properties'].destroy();
        	w2ui['customer_edit_popup_properties'].destroy();
        	w2ui['customer_edit_product_list_grid'].destroy();			
			w2popup.close();
		},
		
		setNewData : function(action){
			w2ui['companyTree'].destroy();
			companyMgr.createMenuTree();
			companyMgr.getCompanyList('update', action);
		},	
		
		updateData : function() {
			
		},
		
		popupMessage : function() {
    		w2popup.message({ 
    	        width   : 360, 
    	        height  : 180,
    	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">'+BundleResource.getString('label.roleManager.alreadyExistGroup')+'</div>'+
    	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.roleManager.confirm') + '</button>'
    	    });
    		
    		$(".w2ui-message").css({top:"70px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
		},
		
		setAddPopupCustomerInfoDisplay : function() {
			
			$('#customAddPopupNewBtn').hide();
			
			$('#customAddPopupAddBtn').show();
			$('#customAddPopupCancelBtn').show();
			
			$('#customer_name_addPopup').prop('readonly', false);
			$('#rank_addPopup').prop('readonly', false);
			$('#department_addPopup').prop('readonly', false);
			$('#phone_addPopup').prop('readonly', false);
			$('#mobile_phone_addPopup').prop('readonly', false);
			$('#email_addPopup').prop('readonly', false);
			$('#task_addPopup').prop('readonly', false);
		},
		
		cancelAddPopupCustomerInfoDisplay : function() {
			$('#customer_name_addPopup').prop('readonly', true);
			$('#rank_addPopup').prop('readonly', true);
			$('#department_addPopup').prop('readonly', true);
			$('#phone_addPopup').prop('readonly', true);
			$('#mobile_phone_addPopup').prop('readonly', true);
			$('#email_addPopup').prop('readonly', true);
			$('#task_addPopup').prop('readonly', true);
			
			$('#customAddPopupNewBtn').show();
			$('#customAddPopupAddBtn').hide();
			$('#customAddPopupCancelBtn').hide();
			
			w2ui['customer_popup_properties'].clear();
		},
		
		setEditPopupCustomerInfoDisplay : function() {
			
			$('#customEditPopupNewBtn').hide();
			$('#customEditopupEditBtn').hide();
			
			$('#customEditPopupAddBtn').show();
			$('#customEditPopupCancelBtn').show();
			
			$('#customer_name_editPopup').prop('readonly', false);
			$('#rank_editPopup').prop('readonly', false);
			$('#department_editPopup').prop('readonly', false);
			$('#phone_editPopup').prop('readonly', false);
			$('#mobile_phone_editPopup').prop('readonly', false);
			$('#email_editPopup').prop('readonly', false);
			$('#task_editPopup').prop('readonly', false);
		},
		
		cancelEditPopupCustomerInfoDisplay : function() {
			$('#customer_name_editPopup').prop('readonly', true);
			$('#rank_editPopup').prop('readonly', true);
			$('#department_editPopup').prop('readonly', true);
			$('#phone_editPopup').prop('readonly', true);
			$('#mobile_phone_editPopup').prop('readonly', true);
			$('#email_editPopup').prop('readonly', true);
			$('#task_editPopup').prop('readonly', true);
			
			$('#customEditPopupNewBtn').show();
			
			$('#customEditPopupCancelBtn').hide();
			$('#customEditPopupAddBtn').hide();
			$('#customEditPopupEditBtn').hide();
			
			w2ui['customer_edit_popup_properties'].clear();
		},
		
		productValidation : function(type){
			if(type == 'add') {
				var customerGrid = w2ui["customer_product_list_grid"].get(w2ui["customer_product_list_grid"].getSelection());
				if(customerGrid.length > 0){
					//선택한 항목이 있을때
					$("#customerAddPopupDelBtn").prop('disabled', false);
	        		$("#customerAddPopupDelBtn").css('opacity', 0.5);
	        		$("#customerAddPopupDelBtn").addClass('link');
				}else{
					//선택한 항목이 없을때
					$("#customerAddPopupDelBtn").prop('disabled', true);
	        		$("#customerAddPopupDelBtn").css('opacity', 0.5);
	        		$("#customerAddPopupDelBtn").removeClass('link');
				}
			} else {
				var customerGrid = w2ui["customer_edit_product_list_grid"].get(w2ui["customer_edit_product_list_grid"].getSelection());
				if(customerGrid.length > 0){
					//선택한 항목이 있을때
					$("#customerEditPopupDelBtn").prop('disabled', false);
	        		$("#customerEditPopupDelBtn").css('opacity', 0.5);
	        		$("#customerEditPopupDelBtn").addClass('link');
				}else{
					//선택한 항목이 없을때
					$("#customerEditPopupDelBtn").prop('disabled', true);
	        		$("#customerEditPopupDelBtn").css('opacity', 0.5);
	        		$("#customerEditPopupDelBtn").removeClass('link');
				}
			}
		},
		
		makeCustomerList : function(selectSite, allData) {
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
			
			if(w2ui['siteMgr_layout']){
				w2ui['siteMgr_layout'].destroy();
			}
			
			if(w2ui['customer_list']){
				w2ui['customer_list'].destroy();
			}
			
			if(w2ui['customer_layout']){
				w2ui['customer_layout'].destroy();
			}
			
			if(w2ui['companyDetailProperties']){
				w2ui['companyDetailProperties'].destroy();
			}
			
			if(w2ui['companyTree']){
				w2ui['companyTree'].destroy();
			}
			
			if(w2ui['companyVirMenuTree']){
				w2ui['companyVirMenuTree'].destroy();
			}
			
			if(w2ui['company_popup_properties']){
				w2ui['company_popup_properties'].destroy();
			}
			
			if(w2ui['customer_popup_properties']){
				w2ui['customer_popup_properties'].destroy();
			}
			
			if(w2ui['customer_product_list_grid']){
				w2ui['customer_product_list_grid'].destroy();
			}
			
			if(w2ui['company_edit_popup_properties']){
				w2ui['company_edit_popup_properties'].destroy();
			}
			
			if(w2ui['customer_edit_popup_properties']){
				w2ui['customer_edit_popup_properties'].destroy();
			}
			
			if(w2ui['customer_edit_product_list_grid']){
				w2ui['customer_edit_product_list_grid'].destroy();
			}		
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
			companyMgr = null;
			
			requestParam = null;
			
			paramCustomerInfo = null;
			
			requestEditParam = null;
			
			editParamCustomerInfo = null;
		}
		
	});
	return Main;
});