define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/itsm/productManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "jquery-csv",
    "css!cs/itsm/productManager"
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
		
	});
	
	var listModel = Backbone.Model.extend({
		model : Model,
		url : '/productManager',
		parse : function(result){
			return {data : result};
		}
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : '/productManager/getProductList',
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.collection = null;
			this.$el.append(JSP);
			this.getTypeList = [];
			this.productEncoding = null;
			this.exportFileFormat = [];
			this.init();
			this.start();
			this.elements = {
					
    		};

    		this.selectItem = null;
			this.xFlug = true;
			
			var model = new listModel();
			model.url = 'productManager/getSiteList';
			model.fetch();
			this.listenTo(model, 'sync', this.getSiteAllData);
			
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
			'click #modelSearchBtn' : 'searchAction',
			'click #productAddBtn' : 'addData',
			'click #productEditBtn' : 'editData',
			'click #productDelBtn':'deleteData',
			//model events modelAddBtn
			'click #modelAddBtn':'addModel',
			'click #modelEditBtn':'editModel',
			'dblclick #modelMainBottom .w2ui-grid-data'  : 'editModel',
			'click #modelDelBtn':'deleteModel',
			//import // export
			'click #modelImportBtn' : 'importPopup',
			'click #modelExportBtn':'exportData',
			//Upload // Download
			'click .productUploadBtn' : 'productUpload',
        },
		
		eventListenerRegister : function(){
			document.addEventListener("attachFileSuccess", this.attachFileSuccessHanlder);
			//productPopupUploadBtn
			$(document).on("click", ".productAddPopupUploadBtn", this.productAddPopupUpload);
			$(document).on("click", ".productEditPopupUploadBtn", this.productEditPopupUpload);
			
			$(document).on("click", "#codeMgrPopupOkBtn", this.validateCheckFunc);
			$(document).on("click", "#codeMgrEditPopupOkBtn", this.validateUpdateFunc);
			
			$(document).on("click", "#modelMgrPopupOkBtn", this.validateDataFunc);
			$(document).on("click", "#modelMgrUpdatePopupOkBtn", this.updateDataFunc);
			$(document).on("click", "#modelMgrDeletePopupOkBtn", this.deleteDataFunc);
			$(document).on("click", "#codeMgrOkBtn", this.deleteExecute);
			$(document).on('click', "#getSiteList", this.settingSite);
			
			//import // export
        	$(document).on("click", "#assetMgrImportDelBtn", this.importDelete);
        	$(document).on("click", "#importPopupSaveBtn", this.setImportData);        	
		},
		
		removeEventListener : function(){
			document.removeEventListener("attachFileSuccess", this.attachFileSuccessHanlder);
			
			$(document).off("click", ".productAddPopupUploadBtn");
			$(document).off("click", ".productEditPopupUploadBtn");
			
			$(document).off("click", "#codeMgrPopupOkBtn");
			$(document).off("click", "#codeMgrEditPopupOkBtn");
			
			$(document).off("click", "#modelMgrPopupOkBtn");
			$(document).off("click", "#modelMgrUpdatePopupOkBtn");
			$(document).off("click", "#modelMgrDeletePopupOkBtn");
			$(document).off("click", "#codeMgrOkBtn");
			$(document).off("click", "#getSiteList");
			
			$(document).off("click", "#assetMgrImportDelBtn");
        	$(document).off("click", "#importPopupSaveBtn");
		},
		
		init : function(){
			
			this.importFileFormat = [
        		"product_name"
        		,"product_type"
        		,"spec"
        		,"site_id"
        		,"note"
        	];
			
			this.exportFileFormat = [
        		"product_name"
        		,"product_type"
        		,"spec"
        		,"site_id"
        		,"note"
        	]
			
			productMgr = this;
			
        	$("#productManagerContentsDiv").w2layout({
				name : 'productMgr_layout',
				panels : [
					{type:'left', size:450, resizable: false, content:'<div id="productMainContents"></div>'},
					{type:'main', size:'65%', content:'<div id="modelMainContents"></div>'}
				]
			});
        	
        	$("#modelMainContents").w2layout({
        		name : 'model_layout',
        		panels : [
        			{type:'main', resizable: false, content:'<div id="rightBottomContents"></div>'}
        		]
        	});
        	
        	var productMainContents = 	'<div id="productMainTop">'+
										'</div>'+//productMainTop
										'<div class="dashboard-panel" style="width:100%;">'+
								    		'<div class="dashboard-title">' + 
								    			'<label>Product List</label>' +
												'<div class="align-right-btn">'+
													'<i id="productAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
													'<i id="productDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
													'<i id="productEditBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
												'</div>'+ 
								    		'</div>'+
								    		'<div class="dashboard-contents">'+
								    			'<div id="productMainBottom"></div>'+
								    		'</div>'+
								    	'</div>';//dashboard-panel
        	
			var rightBottomContents = 	'<div id="modelMainTop">'+
											
											'</div>'+
										'</div>'+//modelMainTop
										'<div class="dashboard-panel" style="width:100%;">'+
								    		'<div class="dashboard-title">' + 
								    			'<label>Model List</label>' +
												'<div class="align-right-btn">'+
													'<i id="modelImportBtn" class="icon link fab fa-yes-import fa-2x" aria-hidden="true" title="Import"></i>'+
													'<i id="modelAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
													'<i id="modelDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
													'<i id="modelEditBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
													'<i id="modelExportBtn" class="icon link fab fa-yes-export fa-2x" aria-hidden="true" title="Export"></i>'+
												'</div>'+ 
								    		'</div>'+
								    		'<div id="searchModelArea">'+
											'<div class="w2ui-field">'+
												'<input class="w2ui-input" id="inputModel" name="model" type="text" size="25" style="margin-left: 6px; margin-top: 10px; float: left; width:168px;" placeholder="Input Model Name">'+							
											'</div>'+
											'<i id="modelSearchBtn" class="icon link fas fa-search fa-2x" aria-hidden="true" title="Search"></i>'+
											'</div>'+
								    		'<div class="dashboard-contents">'+
								    			'<div id="modelMainBottom"></div>'+
								    		'</div>'+
								    	'</div>';//dashboard-panel
			
			$("#productMainContents").html(productMainContents);
			this.createCodeTree();
			$("#rightBottomContents").html(rightBottomContents);
        	
			$("#modelMainBottom").w2grid({
				name : 'model_list',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false,
					selectColumn:true
				},
				recordHeight : 35,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
					{ field: 'product_id', caption: 'PRODUCT ID', hidden: true, sortable: true},
         			{ field: 'product_name', caption: 'Model', size : '150px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'spec', caption: 'Speck', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'file_name', caption: '승인', size : '100px', sortable: true, attr: 'align=center',
         				render :function(record){
         					if(record.cnt == 0){         
         						return '<img src="dist/img/off2.png" id="file_name" class="productUploadBtn" product_id="'+record.product_id+'">';         						
         					}else if(record.cnt > 0){
         						return '<img src="dist/img/on.png" id="file_name" class="productUploadBtn" product_id="'+record.product_id+'">';
         						
         					}
         				}},
         			{ field: 'site_id', caption: '제조사', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'note', caption: '비고', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}
				],
				onClick : function(event){
					event.onComplete = function(){
						
					}
				}
			});	
							
			
			w2ui["model_list"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
				productMgr.validationCheck();
        	});
        	
        	w2ui["model_list"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		productMgr.validationCheck();
        	});
        	
        	w2ui["model_list"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		productMgr.validationCheck();
        	});
			
        	$("#productEditBtn").prop('disabled', true);
			$("#productEditBtn").removeClass('link');
			$("#productDelBtn").prop('disabled', true);
			$("#productDelBtn").removeClass('link');
			
			//Model List edit edlete export btn
			$("#modelDelBtn").prop('disabled', true);
			$("#modelDelBtn").removeClass('link');
			$("#modelEditBtn").prop('disabled', true);
			$("#modelEditBtn").removeClass('link');
			$("#modelExportBtn").prop('disabled', true);
			$("#modelExportBtn").removeClass('link');
						
		},
		
		start : function(){
			this.collection = new Collection();
        	this.collection.fetch({reset:true});
			this.listenTo(this.collection, "reset", this.resetData);
			
			this.eventListenerRegister();
		},
		
		createCodeTree : function(){
        	
        	$("#productMainBottom").w2sidebar({
        		name : 'productAssetTree',
                bottomHTML : '<div id="bottomTree"></div>',
        		nodes: [
                    { id: 'Product', text: 'PRODUCT LIST', expanded: true, group: true, 
                     nodes: [{id: 'root', text: 'Product', expanded:true, img: 'fa icon-folder'}]
                    }
                ],
                onRender: function(event) {
                	var allSelect = '-1';
                    var modelList = new listModel();
                    modelList.url = modelList.url + '/getModelList/' + allSelect;
                	modelList.fetch({}, {});
                	modelList.listenTo(modelList, "sync", productMgr.setModelList);
                },
                onClick: function(event) {
                	if(productMgr.xFlug){
                		var seletId = event.target;
                        var selectItem = this.get(seletId);
                        var selectNmae = selectItem.name;
                        var inOutStatus = selectItem.inOutStatus;
                        var allSelect = '-1';
                        var modelList = new listModel();
                        
                        if(event.node.id != "root"){
//                        	var modelList = new listModel();
                        	modelList.url = modelList.url + '/getModelList/' + selectNmae;
                        	modelList.fetch({}, {});
                        	modelList.listenTo(modelList, "sync", productMgr.setModelList);
        	    		}else{
//        	    			var modelList = new listModel();
                        	modelList.url = modelList.url + '/getModelList/' + allSelect;
                        	modelList.fetch({}, {});
                        	modelList.listenTo(modelList, "sync", productMgr.setModelList);
        	    		}
                		
                        productMgr.selectItem = selectItem;
                		
                	}
                	
                },
                onRefresh : function(event){
                	
                }
        	});
        	
        	w2ui["productAssetTree"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		productMgr.btnValidationFunc();
        	});
        	
        	w2ui["productAssetTree"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		productMgr.btnValidationFunc();
        	});
        },
		
        setModelList : function(model){
        	var array = model.toJSON();
        	//model_list
        	w2ui['model_list'].records = array.data;
			w2ui['model_list'].refresh();
        },
		
        btnValidationFunc : function(){
        	if(w2ui['productAssetTree'].selected !== null){
        		if(w2ui['productAssetTree'].selected !== 'root'){
        			$("#productAddBtn").prop('disabled', true);
        			$("#productAddBtn").removeClass('link');
        			
        			$("#productEditBtn").prop('disabled', false);
            		$("#productEditBtn").addClass('link');      
        			$("#productDelBtn").prop('disabled', false);
            		$("#productDelBtn").addClass('link');            		
        		}else{
        			$("#productAddBtn").prop('disabled', false);
            		$("#productAddBtn").addClass('link');
            		
            		$("#productEditBtn").prop('disabled', true);
            		$("#productEditBtn").removeClass('link');
            		$("#productDelBtn").prop('disabled', true);
            		$("#productDelBtn").removeClass('link');
        		}
        	}else{
        		$("#productEditBtn").prop('disabled', true);
        		$("#productEditBtn").removeClass('link');
        		$("#productDelBtn").prop('disabled', true);
        		$("#productDelBtn").removeClass('link');
        	}
		},
		
		validationCheck : function(){
        	if(w2ui['model_list'].getSelection().length > 0){
				$("#modelDelBtn").prop('disabled', false);
				$("#modelDelBtn").addClass('link');
				
				$("#modelExportBtn").prop('disabled', false);
				$("#modelExportBtn").addClass('link');
				
				if(w2ui['model_list'].getSelection().length == 1){
					$("#modelEditBtn").prop('disabled', false);
					$("#modelEditBtn").addClass('link');
				}else{
					$("#modelEditBtn").prop('disabled', true);
					$("#modelEditBtn").removeClass('link');
				}
			}else{
				$("#modelDelBtn").prop('disabled', true);
				$("#modelDelBtn").removeClass('link');
				
				$("#modelEditBtn").prop('disabled', true);
				$("#modelEditBtn").removeClass('link');
				
				$("#modelExportBtn").prop('disabled', true);
				$("#modelExportBtn").removeClass('link');
			}
        },
				
		resetData : function(method, model, options){
        	this.render(method.toJSON());
        	
        	this.listenTo(this.collection, "sync", this.setData);
        },
		        
        addResult : function(){
        	$("#bottomTree").animate({left:0}, 5000, function(e){$("#bottomTree").html("");});
        },

        deleteResult : function(model){
        	var cnt = model.id.split("_").length;
        	$("#bottomTree").animate({left:0}, 5000, function(e){$("#bottomTree").html("");});
        },
        
        deleteIDCheck : function(item){
        	var id = item.id;
        	
        	var childCheckFunc = function(dataAC){
        		for(var i=0; i<dataAC.length; i++){
        			id += "_"+dataAC[i].id;
        			var subItem = dataAC[i];
        			if(subItem.nodes.length > 0){
        				childCheckFunc(subItem.nodes);
        			}
        		}
        		
        		return id;
        	}
        	
        	if(item.nodes.length > 0){
        		return childCheckFunc(item.nodes);
        	}else{
        		return id;
        	}
        },
        
        deleteExecute : function(){
        	var selectItem = w2ui['productAssetTree'].get(w2ui["productAssetTree"].selected);
        	var parentItem = parentItem = w2ui['productAssetTree'].nodes[0].nodes[0];
    		
        	if(parentItem.nodes.length < 2){
    			parentItem.img = "";
    			parentItem.icon = "fas fa-cube fa-lg";
    		}
    		
    		var idGroup = productMgr.deleteIDCheck(selectItem);
    		
    		var deleteGroup = idGroup.split("_");
    		
    		var model = new Model();
    		model.set({id: idGroup});
    		model.url = "productManager/getCodeList"+"/"+idGroup;
    		model.destroy({
                success: function(model, response) {
                	var modelList = model.id.split("_");
                	
                	for(var i=0; i < modelList.length; i++){
                		var modelId = modelList[i];
                		productMgr.collection.remove(modelId);
                	}
                	
					w2ui["productAssetTree"].remove(w2ui["productAssetTree"].selected);
		    		
		    		$("#inStatus").prop('checked', false);
		    		$("#outStatus").prop('checked', false);
		    		
		    		productMgr.deleteModelList(selectItem.name);
		    		productMgr.deleteResult(model);
                }
            });
    		
        },
        
        deleteModelList : function(treeName){
        	var model = new listModel();
        	model.set("id", treeName);
        	model.url = 'productManager/modelList/' + treeName;
        	model.destroy({
        		success: function (model, respose, options) {
        			productMgr.searchAction();
    			}
    		});
        },
        
        setData : function(method, result, options){
        	if(options.xhr.statusText === "success"){
        		var item = method.toJSON();
        		var parentItem = null;
        		switch(result){
	        		case 100 :
	        			//insert
	        			item.text = item.name;
	        			item.icon = 'fas fa-cube fa-lg';
	        				        			
	        			w2ui['productAssetTree'].insert('root', null, [item]);
	        			
	        			parentItem = w2ui['productAssetTree'].nodes[0].nodes[0];
	        			
	        			if(parentItem){
	        				this.orderByDesc(parentItem.nodes);
	        			}
	        			
	        			w2ui['productAssetTree'].refresh();
	        			this.addResult();
	        			break;
	        		case -100 :
	        			//삽입 실패
	        			console.log("insert fail ##########");
	        			break;
	        		
        		}
        	}
        },
             
        orderByDesc : function(nodes){
        	for(var i=0; i < nodes.length-1; i++){
				for(var j=i+1; j < nodes.length; j++){
					if(parseInt(nodes[i].sortOrder) > parseInt(nodes[j].sortOrder)){
						var temp = nodes[i];
						nodes[i] = nodes[j];
						nodes[j] = temp;
					}
				}
			}
        },
        
		render : function(result){

			result.forEach(function(item,idx){
				item.img = '';
				item.icon = 'fas fa-cube fa-lg';
			});

			for(var i=0; i < result.length; i++){
				var item = result[i];
				productMgr.getTypeList.push({text : result[i].name, id : i});
				//1depth만 열거면 여기서
				w2ui['productAssetTree'].insert('root', null, item);
			}
			
			parentItem = w2ui['productAssetTree'].nodes[0].nodes[0];
			
			if(parentItem){
				this.orderByDesc(parentItem.nodes);
			}
		},
		
		// BTN EVENT ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Product Tree List ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		addData : function(event){
			productMgr.btnValidationFunc();
			if($("#productAddBtn").prop("disabled")){
				return;
			}
			
    		var uid = util.createUID();
    		var codeId =  "";
    		var codeName = "";
    		var selectedCode = w2ui["productAssetTree"].selected;
    		var parentId = "";
    		var changeHeight = 350;
    		
    		if(selectedCode === null || selectedCode === "root" ){
    			codeId = "root";
    			codeName = "ROOT";
        	}else{
        		parentId = w2ui["productAssetTree"].get(w2ui["productAssetTree"].selected).parent.id;
        		codeId = selectedCode;
        		codeName = w2ui["productAssetTree"].get(w2ui["productAssetTree"].selected).text;
        	}

    		var body = '<div class="w2ui-centered">'+
    			'<div id="codeMgrPopupContents" style="width:100%; height:100%" >'+
	    			'<div class="w2ui-page page-0">'+
		        		'<div class="w2ui-field">'+
		        			'<label>NAME</label>'+
		        			'<div>'+
		        				'<input name="name" type="text" style="width:138px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		
		    			'<div class="w2ui-field">'+
		        			'<label>COLUMN1</label>'+
		        			'<div>'+
		        				'<input name="column1" type="text" style="width:138px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		    				'<label>COLUMN2</label>'+
		    				'<div>'+
								'<input name="column2" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>DESC</label>'+
		    				'<div>'+
								'<input name="codeDesc" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>ROW NUM</label>'+
		    				'<div>'+
								'<input name="sortOrder" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>PARENT NAME</label>'+
		    				'<div>'+
								'<input name="parentName" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
					'</div>'+
				'</div>'+
    			'<div id="codeMgrPopupBottom">'+
	    			'<button id="codeMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.codeManager.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.codeManager.close') + '</button>'+
    			'</div>'+
    		'</div>';
    		
    		w2popup.open({
    			title : BundleResource.getString('title.codeManager.addCode'),
    	        body: body,
    	        width : 360,
    	        height : changeHeight,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#codeMgrPopupBottom").html();
    	        		w2ui["productMgr_popup_properties"].render();
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	w2ui['productMgr_popup_properties'].destroy();
    	        }
    	        
    	    });
    		
    		$("#codeMgrPopupContents").w2form({
    			name : 'productMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0);",
    			fields : [
					{name:'name', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
					//{name:'inOutPopupStatus', type: 'text', disabled:false, required:false, html:{caption:'IN OUT'}},
					{name:'column1', type: 'text', disabled:false, required:false, html:{caption:'COLUMN1'}},
					{name:'column2', type: 'text', disabled:false, required:false, html:{caption:'COLUMN2'}},
					{name:'codeDesc', type: 'text', disabled:false, required:false, html:{caption:'DESC'}},
					{name:'sortOrder', type: 'text', disabled:false, required:false, html:{caption:'ROW NUM'}},
					/*{name:'id', type: 'text', disabled:true, required:true, html:{caption:'CODE ID'}},*/
					{name:'parentName', type: 'text', disabled:true, required:true, html:{caption:'PARENT NAME'}}
    			],
    			onRender : function(event){
    				event.onComplete = function(){
	    				if(parentId == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca" || selectedCode == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca"){
	    	    			$("#inOutPopup").show();
	    	    		}else{
	    	    			$("#inOutPopup").hide();
	    	    		}
    				}
    			},
    			record:{
    				id:uid,
    				name:'',
    				//inOutStatus:0,
    				column1:'',
    				column2:'',
    				codeDesc:'',
    				sortOrder:0,
    				parentId:codeId,
    				parentName:codeName
				}
				
    		});
    		
    		
        },
        
        editData : function(){
        	productMgr.btnValidationFunc();
        	if($("#productEditBtn").prop("disabled")){
				return;
			}
        	
        	var changeHeight = 350;
        	var selectItem = w2ui['productAssetTree'].get(w2ui["productAssetTree"].selected)
        	
        	var body = '<div class="w2ui-centered">'+
			'<div id="codeMgrEditPopupContents" style="width:100%; height:100%" >'+
    			'<div class="w2ui-page page-0">'+
	        		'<div class="w2ui-field">'+
	        			'<label>NAME</label>'+
	        			'<div>'+
	        				'<input name="name" type="text" style="width:138px;" />'+
	        			'</div>'+
	        		'</div>'+
	        		
	    			'<div class="w2ui-field">'+
	        			'<label>COLUMN1</label>'+
	        			'<div>'+
	        				'<input name="column1" type="text" style="width:138px;" />'+
	        			'</div>'+
	        		'</div>'+
	        		'<div class="w2ui-field">'+
	    				'<label>COLUMN2</label>'+
	    				'<div>'+
							'<input name="column2" type="text" style="width:138px;" />'+
						'</div>'+
	    			'</div>'+
	    			'<div class="w2ui-field">'+
	    				'<label>DESC</label>'+
	    				'<div>'+
							'<input name="codeDesc" type="text" style="width:138px;" />'+
						'</div>'+
	    			'</div>'+
	    			'<div class="w2ui-field">'+
	    				'<label>ROW NUM</label>'+
	    				'<div>'+
							'<input name="sortOrder" type="text" style="width:138px;" />'+
						'</div>'+
	    			'</div>'+
	    			'<div class="w2ui-field">'+
	    				'<label>PARENT NAME</label>'+
	    				'<div>'+
							'<input name="parentName" type="text" style="width:138px;" />'+
						'</div>'+
	    			'</div>'+
				'</div>'+
			'</div>'+
			'<div id="codeMgrPopupBottom">'+
    			'<button id="codeMgrEditPopupOkBtn" class="darkButton">' + BundleResource.getString('button.codeManager.save') + '</button>'+
    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.codeManager.close') + '</button>'+
			'</div>'+
		'</div>';
		
		w2popup.open({
			title : BundleResource.getString('title.codeManager.addCode'),
	        body: body,
	        width : 360,
	        height : changeHeight,
	        opacity   : '0.5',
    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
	        onOpen    : function(event){
	        	event.onComplete = function () {
	        		$("#codeMgrPopupBottom").html();
	        		w2ui["productMgr_edit_popup_properties"].render();
	        	}
	        },
	        
	        onClose   : function(event){
	        	w2ui['productMgr_edit_popup_properties'].destroy();
	        }
	        
	    });
		
		$("#codeMgrEditPopupContents").w2form({
			name : 'productMgr_edit_popup_properties',
			style:"border:1px solid rgba(0,0,0,0);",
			fields : [
				{name:'name', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
				//{name:'inOutPopupStatus', type: 'text', disabled:false, required:false, html:{caption:'IN OUT'}},
				{name:'column1', type: 'text', disabled:false, required:false, html:{caption:'COLUMN1'}},
				{name:'column2', type: 'text', disabled:false, required:false, html:{caption:'COLUMN2'}},
				{name:'codeDesc', type: 'text', disabled:false, required:false, html:{caption:'DESC'}},
				{name:'sortOrder', type: 'text', disabled:false, required:false, html:{caption:'ROW NUM'}},
				/*{name:'id', type: 'text', disabled:true, required:true, html:{caption:'CODE ID'}},*/
				{name:'parentName', type: 'text', disabled:true, required:true, html:{caption:'PARENT NAME'}}
			],
			onRender : function(event){
				event.onComplete = function(){
					
				}
			},
			record:{
				id:selectItem.id,
				name:selectItem.name,
				//inOutStatus:0,
				column1:selectItem.column1,
				column2:selectItem.column2,
				codeDesc:selectItem.codeDesc,
				sortOrder:0,
				parentId:selectItem.parentId,
				parentName:'Product'
			}
			
		});
        	
        },
        
        deleteData : function(event){
        	productMgr.btnValidationFunc();
			if($("#productDelBtn").prop("disabled")){
				return;
			}
        	
        	var body = "";
        	
        	if(w2ui["productAssetTree"].selected === null || w2ui["productAssetTree"].selected === "root"  ){
        		//ROOT는 삭제 할 수 없습니다.
        		//선택이 안되어 있습니다.
        		
        		var bodyContents = "";
        		
        		if(w2ui["productAssetTree"].selected === null){
        			//bodyContents = "선택된 항목이 없습니다.";
        			bodyContents = BundleResource.getString('label.codeManager.noSelectedItem');
        		}else{
        			//bodyContents = "삭제할 수 없는 항목 입니다.";
        			bodyContents = BundleResource.getString('label.codeManager.canNotDeletedItem');
        		}
        		
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">'+ bodyContents +'</div>'+
					'<div class="btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		
        	}else{
        		var selectItem = w2ui['productAssetTree'].get(w2ui["productAssetTree"].selected);
        		if(selectItem.nodes.length > 0){
        			body = '<div class="w2ui-centered">'+
	        				'<div class="popup-contents">' + BundleResource.getString('label.codeManager.sublistExists') + '</br>' + BundleResource.getString('label.codeManager.deleteAll') + '</div>'+
	        				'<div>'+
	        					'<button id="codeMgrOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
	        					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
	        				'</div>'+
        				'</div>' ;
        			
        		}else{
        			body = '<div class="w2ui-centered">'+
	    				'<div class="popup-contents">' + BundleResource.getString('label.codeManager.delete') + '</div>'+
	    				'<div class="popup-btnGroup">'+
	    					'<button id="codeMgrOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
	    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
	    				'</div>'+
    				'</div>' ;
        			
        		}
        		
        	}
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.codeManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        },
        
        validateCheckFunc : function(event){
        	//var inOutSts = ['OUT', 'IN'];
        	var arr = w2ui["productMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["productMgr_popup_properties"].record;
        		var inOutStatus = $('input:radio[name=inOutPopupStatus]:checked').val();
        		var model = new Model();
        		model.set({
        			id : item.id,
        			name : item.name,
        			inOutStatus : inOutStatus,
    				column1 : item.column1, 
    				column2 : item.column2, 
        			parentId : "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca",
        			codeDesc: item.codeDesc,
        			sortOrder: item.sortOrder
        		});
        		
        		productMgr.collection.create(model);
        		w2popup.close();
        	}
        },
        
        validateUpdateFunc : function(){
        	var arr = w2ui["productMgr_edit_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["productMgr_edit_popup_properties"].record;
        		var model = productMgr.collection.get(w2ui["productMgr_edit_popup_properties"].record.id);
        		        		
        		model.url = 'productManager/productEdit'; 
        		model.set("product_id", item.id);
        		model.set({
        			id : item.id,
        			name : item.name,
    				column1 : item.column1, 
    				column2 : item.column2, 
        			parentId : "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca",
        			codeDesc: item.codeDesc,
        			sortOrder: item.sortOrder
        		});
        		
        		model.save(null, {
        			success: function(model, response) {
        				console.log("success");
        				if(response === 300){
        					var resultParam = model.toJSON();
        					var item = w2ui["productAssetTree"].get(w2ui["productAssetTree"].selected);
        					item.name = resultParam.name;
        					item.text = resultParam.name;
        					item.column1 = resultParam.column1;
        					item.column2 = resultParam.column2;
        					item.codeDesc = resultParam.codeDesc;
        					item.sortOrder = resultParam.sortOrder;
        					w2ui['productAssetTree'].refresh();
        				}
        				var	bodyContents = "";
        				//bodyContents = "변경 되었습니다.";
        				bodyContents = BundleResource.getString('label.codeManager.changedContents');
        				body = '<div class="w2ui-centered">'+
        				'<div class="popup-contents">'+ bodyContents +'</div>'+
        				'<div class="popup-btnGroup">'+
        				'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
        				'</div>'+
        				'</div>' ;

        				w2popup.open({
        					width: 385,
        					height: 180,
        					title : BundleResource.getString('title.codeManager.info'),
        					body: body,
        					opacity   : '0.5',
        					modal     : true,
        					showClose : true
        				});
        			},
        			error: function(model, response) {
						console.log("error");
        			}
        		});
//        		w2popup.close();
        	}
        },
        
        searchAction: function() {
        	var modelText = $('#inputModel').val();
        	var model = new listModel();
        	if(modelText == ""){
        		modelText = '-1';
        	}
        	model.url = model.url + "/search/" + modelText;
        	model.fetch({}, {});
        	model.listenTo(model, "sync", productMgr.setModelList);
        },
        
        // Model List ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        addModel : function(){
        	var uid = util.createUID();
        	var body = '<div class="w2ui-centered">'+
			'<div id="modelMgrPopupContents" style="width:100%; height:100%" >'+
    			'<div class="w2ui-page page-0">'+
	        		
    				'<div style="width: 100%; float: left; margin-right: 0px;">'+   
    					'<div class="" style="height: 40px;">'+
	    					'<div class="w2ui-field w2ui-span4">'+
			        			'<label>Model Name</label>'+
			        			'<div>'+
			        				'<input name="product_name" type="text" size="70" />'+
			        			'</div>'+
			        		'</div>'+
		        		'</div>'+
		        	'</div>'+
	        		
		        	'<div style="width: 50%; float: left; margin-right: 0px;">'+   
		        		'<div class="" style="height: 40px;">'+
			        		'<div class="w2ui-field w2ui-span4">'+
			        			'<label>분류</label>'+
			        			'<div>'+
			        				'<input name="product_type" type="text" size="25"" />'+
			        			'</div>'+
			        		'</div>'+
		        		'</div>'+
		        	'</div>'+	//left
		        		
		        	 '<div style="width: 50%; float: right; margin-left: 0px;">'+
		        	 	'<div class="" style="height: 40px;">'+
			        	 	'<div class="w2ui-field w2ui-span4">'+
			    				'<label>업체</label>'+
			    				'<div id="getSiteList">'+
			                    '<div style="position:relative;">'+
			                        '<input placeholder="업체 선택" name="site_id" type="text" readonly="readonly" maxlength="100" size="25">'+
			                        '<div style="position:absolute; right:0px; top:7px; color:#fff; width:30px;">'+
			                        	'<i class="site-name-list fas fa-external-link-alt" aria-hidden="true"></i>'+
		                        	'</div>'+
			                    '</div>'+
			                    '</div>'+//getSiteList
			    				/*'<div>'+
									'<input name="site_id" type="text" size="25" />'+
								'</div>'+*/
			    			'</div>'+
		    			'</div>'+
		    		'</div>'+	//right
		    			
		    		'<div style="width: 100%; float: left; margin-right: 0px;">'+    
		    		 	'<div class="" style="height: 40px;">'+
							'<div class="w2ui-field w2ui-span4">'+
			    				'<label>비고</label>'+
			    				'<div>'+
									'<input name="note" type="text" size="70" />'+
								'</div>'+
			    			'</div>'+
		    			'</div>'+
	    			'</div>'+
	    			
	    			'<div style="width: 100%; float: left; margin-right: 0px;">'+    
	    		 	'<div class="" style="height: 40px;">'+
						'<div class="w2ui-field w2ui-span4">'+
		    				'<label>승인 문서</label>'+
		    				'<div>'+
		    					'<div class="productAddPopupUploadBtn"><i name="file_name" class="icon link fab fa-yes-upload_download fa-2x align-right" style="float: left; margin-left: 4px;" aria-hidden="true" title="upload"></i></div>'+
							'</div>'+
		    			'</div>'+
	    			'</div>'+
    			'</div>'+
	    			
	    			'<div style="width: 100%; float: left; margin-right: 0px;">'+   
	    			 	'<div class="" style="height: 40px;">'+
							'<div class="w2ui-field w2ui-span4">'+
			    				'<label>Specifications</label>'+
			    				'<div>'+
									'<textarea class="spec" name="spec" type="text" style="height:50px;width: 438px;" />'+
								'</div>'+
								'</div>'+
			    			'</div>'+
	    			'</div>'+

	    			'<div style="clear: both; padding-top: 15px;"></div>'+
	    			
				'</div>'+
			'</div>'+
			'<div id="codeMgrPopupBottom">'+
    			'<button id="modelMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.codeManager.save') + '</button>'+
    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.codeManager.close') + '</button>'+
			'</div>'+
		'</div>';
		
		w2popup.open({
			title : BundleResource.getString('title.productManager.addProductInfo'),
	        body: body,
	        width : 580,
	        height : 350,
	        opacity   : '0.5',
    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
	        onOpen    : function(event){
	        	event.onComplete = function () {
	        		$("#codeMgrPopupBottom").html();
	        		w2ui["modelMgr_popup_properties"].render();
	        	}
	        },
	        onClose   : function(event){
	        	w2ui['modelMgr_popup_properties'].destroy();
	        	w2ui["model_list"].selectNone();
	        }
	        
	    });
		
		$("#modelMgrPopupContents").w2form({
			name : 'modelMgr_popup_properties',
			style:"border:1px solid rgba(0,0,0,0);",
			fields : [
				{name:'product_name', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
				{name:'product_type', type: 'list', options : {items : productMgr.getTypeList}, disabled:false, required:false, html:{caption:'PRODUCT TYPE'}},
				{name:'site_id', type: 'text', disabled:true, required:false, html:{caption:'SITE ID'}},
				{name:'note', type: 'text', disabled:false, required:false, html:{caption:'NOTE'}},
				{name:'file_name', type: 'text', disabled:false, required:false, html:{caption:'FILE NAME'}},
				{name:'spec', type: 'text', disabled:false, required:false, html:{caption:'SPEC'}}
			],
			onRender : function(event){
				event.onComplete = function(){
					
				}
			},
			record:{
				id:uid,
				product_name:'',
				product_type:productMgr.getTypeList[0],
				site_id:'',
				note:'',
//				file_name:'',
				spec:''
			}
			
		});
        },
        
        validateDataFunc : function(){
        	var arr = w2ui["modelMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["modelMgr_popup_properties"].record;
        		var customerSite = $("#site_id").val();
        		
        		var model = new listModel();
        		model.set({
        			"product_id" : item.id,
        			"product_name" : item.product_name,
        			"product_type" : item.product_type.text,
        			"site_id" : customerSite, 
        			"note" : item.note,
        			"file_name" : item.file_name, 
        			"spec": item.spec
        		});
        		model.url = "productManager/modelAdd";
        		model.save(null, {
        			success: function(model, response) {
        				productMgr.searchAction();
        			},
        			error: function(model, response) {
        				console.log("error");
        			}
        		});
        		
        		w2popup.close();
        	}
        },
        
        updateDataFunc : function(){
        	var arr = w2ui["modelMgr_update_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["modelMgr_update_popup_properties"].record;
        		
        		var model = new listModel();
        		model.url = 'productManager/modelEdit'; 
        		model.set("product_id", item.id);
        		model.set({
        				"product_name": item.product_name,
        				"product_type": item.product_type.text,
        				"site_id": item.site_id,
        				"file_name": item.file_name,
        				"spec": item.spec,
        				"note": item.note
        		});
        		
        		model.save(null, {
        			success: function(model, response) {
        				console.log("success");
						productMgr.searchAction();
        			},
        			error: function(model, response) {
						console.log("error");
        			}
        		});
        		w2popup.close();
        	}
        },
        
        settingSite : function(){
			if($('body').find("#productDoublePopup").size() == 0 ){
				$('body').append("<div id='productDoublePopup'></div>");
			}
			$("#productDoublePopup").dialog({
				title : BundleResource.getString('title.estimate.siteList'),
				width : 400,
				height : 600,
				modal : true,
				resizable: false,
				show: { effect: "fade", duration: 300 },
			    hide: { effect: "fade", duration: 100 },
				buttons : {
					"확인" : function(){
						var treeSelectItem = w2ui['siteTree'].selected;
						var item = productMgr.allMenu.filter(function (treeMenu) { return treeMenu.site_id == treeSelectItem });
						$("#site_id").val(item[0].site_name);
						$(this).dialog("close");
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#productDoublePopup").append('<div id="siteAddArea"></div>');
					var siteAddArea = '<div id="siteContents">'+
													'<div id="siteLeftContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title">Site List</div>'+
												    		'<div class="dashboard-contents"><div id="siteLeftBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//siteLeftContents
												'</div>';
					$("#siteAddArea").html(siteAddArea);
					
					productMgr.getSiteData("getSiteList"); //업체 리스트
					
				},
				close : function(){
					$("#productDoublePopup").remove();
					if(w2ui['siteTree']){
						w2ui['siteTree'].destroy();
					}
				}
			});
		},
		
		getSiteData : function(cmd){
			var model = new listModel();
			model.url = 'productManager/'+cmd;
			model.fetch();
			this.listenTo(model, 'sync', this.setSiteData);
		},
		
		setSiteData : function(method, model, options){
			this.setSiteList(model);
		},
		
		getSiteAllData : function(method, model, options){
			this.getSiteAllList(model);
		},
		
		getSiteAllList: function(model){
			productMgr.getSiteAllList = model.allData;
		},
		
		setSiteList : function(model){
			productMgr.treeMenu = model.treeData.nodes;
			productMgr.allMenu = model.allData;
			
			productMgr.createSiteTree();
			w2ui['siteTree'].insert('-1', null, model.treeData.nodes);
			
			if(!productMgr.selectItem){
				productMgr.selectItem = w2ui['siteTree'].get(w2ui['siteTree'].nodes[0].nodes[0].nodes[0].id);
				w2ui['siteTree'].select(w2ui['siteTree'].nodes[0].nodes[0].nodes[0].id);
			}else{
				w2ui['siteTree'].select(productMgr.selectItem.id);
			}
		},
				
		createSiteTree : function(){
			$("#siteLeftBottom").w2sidebar({
				name : 'siteTree',
				nodes : [
					{id: 'Site', text: 'SITE LIST', expanded: true, group: true,
					nodes: [{id:'-1', text: 'SITE',	expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					
				}
			});
		},
		
		editModel : function(){
			productMgr.validationCheck();
			if($("#modelEditBtn").prop("disabled")){
				return;
			}
			
			var data = w2ui["model_list"].get(w2ui["model_list"].getSelection());
			

        	var body = '<div class="w2ui-centered">'+
			'<div id="modelMgrUpdatePopupContents" style="width:100%; height:100%" >'+
    			'<div class="w2ui-page page-0">'+
	        		
    				'<div style="width: 100%; float: left; margin-right: 0px;">'+   
    					'<div class="" style="height: 40px;">'+
	    					'<div class="w2ui-field w2ui-span4">'+
			        			'<label>Model Name</label>'+
			        			'<div>'+
			        				'<input name="product_name" type="text" size="70" />'+
			        			'</div>'+
			        		'</div>'+
		        		'</div>'+
		        	'</div>'+
	        		
		        	'<div style="width: 50%; float: left; margin-right: 0px;">'+   
		        		'<div class="" style="height: 40px;">'+
			        		'<div class="w2ui-field w2ui-span4">'+
			        			'<label>분류</label>'+
			        			'<div>'+
			        				'<input name="product_type" type="text" size="25"" />'+
			        			'</div>'+
			        		'</div>'+
		        		'</div>'+
		        	'</div>'+	//left
		        		
		        	 '<div style="width: 50%; float: right; margin-left: 0px;">'+
		        	 	'<div class="" style="height: 40px;">'+
			        	 	'<div class="w2ui-field w2ui-span4">'+
			    				'<label>업체</label>'+
			    				'<div id="getSiteList">'+
			                    '<div style="position:relative;">'+
			                        '<input placeholder="업체 선택" name="site_id" type="text" readonly="readonly" maxlength="100" size="25">'+
			                        '<div style="position:absolute; right:0px; top:7px; color:#fff; width:30px;">'+
			                        	'<i class="site-name-list fas fa-external-link-alt" aria-hidden="true"></i>'+
		                        	'</div>'+
			                    '</div>'+
			                    '</div>'+//getSiteList
			    				/*'<div>'+
									'<input name="site_id" type="text" size="25" />'+
								'</div>'+*/
			    			'</div>'+
		    			'</div>'+
		    		'</div>'+	//right
		    			
		    		'<div style="width: 100%; float: left; margin-right: 0px;">'+    
		    		 	'<div class="" style="height: 40px;">'+
							'<div class="w2ui-field w2ui-span4">'+
			    				'<label>비고</label>'+
			    				'<div>'+
									'<input name="note" type="text" size="70" />'+
								'</div>'+
			    			'</div>'+
		    			'</div>'+
	    			'</div>'+
	    			
	    			'<div style="width: 100%; float: left; margin-right: 0px;">'+    
	    		 	'<div class="" style="height: 40px;">'+
						'<div class="w2ui-field w2ui-span4">'+
		    				'<label>승인 문서</label>'+
		    				'<div>'+
		    					'<div class="productEditPopupUploadBtn"><i name="file_name" class="icon link fab fa-yes-upload_download fa-2x align-right" style="float: left; margin-left: 4px;" aria-hidden="true" title="upload"></i></div>'+
							'</div>'+
		    			'</div>'+
	    			'</div>'+
    			'</div>'+
	    			
	    			'<div style="width: 100%; float: left; margin-right: 0px;">'+   
	    			 	'<div class="" style="height: 40px;">'+
							'<div class="w2ui-field w2ui-span4">'+
			    				'<label>Specifications</label>'+
			    				'<div>'+
									'<textarea class="spec" name="spec" type="text" style="height:50px;width: 438px;" />'+
								'</div>'+
								'</div>'+
			    			'</div>'+
	    			'</div>'+

	    			'<div style="clear: both; padding-top: 15px;"></div>'+
	    			
				'</div>'+
			'</div>'+
			'<div id="codeMgrPopupBottom">'+
    			'<button id="modelMgrUpdatePopupOkBtn" class="darkButton">' + BundleResource.getString('button.codeManager.save') + '</button>'+
    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.codeManager.close') + '</button>'+
			'</div>'+
		'</div>';
		
		w2popup.open({
			title : BundleResource.getString('title.productManager.editProductInfo'),
	        body: body,
	        width : 580,
	        height : 350,
	        opacity   : '0.5',
    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
	        onOpen    : function(event){
	        	event.onComplete = function () {
	        		$("#codeMgrPopupBottom").html();
	        		w2ui["modelMgr_update_popup_properties"].render();
	        	}
	        },
	        
	        onClose   : function(event){
	        	w2ui['modelMgr_update_popup_properties'].destroy();
	        	w2ui["model_list"].selectNone();
	        }
	        
	    });
		
		var arrCheck = [];
		for(var i=0; i<productMgr.getTypeList.length;i++){
			arrCheck.push(  productMgr.getTypeList[i].text);
		}
		
		var indexCheck = arrCheck.indexOf(data[0].product_type);
		
		$("#modelMgrUpdatePopupContents").w2form({
			name : 'modelMgr_update_popup_properties',
			style:"border:1px solid rgba(0,0,0,0);",
			fields : [
				{name:'product_name', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
				{name:'product_type', type: 'list', options : {items : productMgr.getTypeList}, disabled:false, required:false, html:{caption:'PRODUCT TYPE'}},
				{name:'site_id', type: 'text', disabled:true, required:false, html:{caption:'SITE ID'}},
				{name:'note', type: 'text', disabled:false, required:false, html:{caption:'NOTE'}},
				{name:'file_name', type: 'text', disabled:false, required:false, html:{caption:'FILE NAME'}},
				{name:'spec', type: 'text', disabled:false, required:false, html:{caption:'SPEC'}}
			],
			onRender : function(event){
				event.onComplete = function(){
					
				}
			},
			record:{
				id:data[0].product_id,
				product_name:data[0].product_name,
				product_type:indexCheck,
				site_id:data[0].site_id,
				note:data[0].note,
//				file_name:data[0].file_name,
				spec:data[0].spec
			}
			
		});
        },
		
		deleteModel : function(){
			productMgr.validationCheck();
			if($("#modelDelBtn").prop("disabled")){
				return;
			}
			var markup = "";
			var data = w2ui["model_list"].get(w2ui["model_list"].getSelection());
        	var arrayData = [];
        	
        	for(var i=0;i<data.length;i++){
    			arrayData.push(data[i].product_id);
    		}
			var bodyContents = "";
        	var body = "";
        	if(arrayData.length > 0){
        		bodyContents = BundleResource.getString("label.user.delete_confirm");
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button id="modelMgrDeletePopupOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.user.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
        	}else{
        		//bodyContents = "선택된 항목이 없습니다.";
        		bodyContents = BundleResource.getString('label.user.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.user.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		deleteDataFunc : function(){
			var model = new listModel();
			var data = w2ui["model_list"].get(w2ui["model_list"].getSelection());
        	var arrayData = [];
        	
        	for(var i=0;i<data.length;i++){
    			arrayData.push(data[i].product_id);
    		}
        	model.set("id", arrayData);
        	model.url = 'productManager/multiDelete/' + arrayData;
        	
        	model.destroy({
        		success: function (model, respose, options) {
        			w2ui["model_list"].selectNone();
        			productMgr.searchAction();
    			}
    		});
		},
		
		// Import // Export ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        			{ field: 'product_name', caption: 'NAME', type: 'text' },
                	{ field: 'site_id', caption: 'SITE ID', type: 'text' }
                ],
                
                columns: [  
                	{ field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
                	{ field: 'product_name', caption: 'Model', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                	{ field: 'spec', caption: 'Speck', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'site_id', caption: '제조사', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                	{ field: 'note', caption: '비고', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					]
            });
	    	w2ui['importAssetTable'].lock("Loading...", true);
	    	
        },
        
        importCsvData : function(evt) {
        	var alertBodyContents = "";
        	var Body = "";
        	if (!productMgr.browserSupportFileUpload()) {
        		alert('The File APIs are not fully supported in this browser!');
        	} else {
        		var _this = productMgr;
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
        	let fileFormat = productMgr.importFileFormat;
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
    					//product_type
    					if(fileFormat[j] === "product_type"){
    						param[fileFormat[j]] = d[j];
    					}else if(fileFormat[j] === "site_id"){
    						var item = productMgr.getSiteAllList.filter(function (treeMenu) { 
    							return treeMenu.site_name == d[j] 
    						});
    						if(item.length > 0){    							
    							param[fileFormat[j]] =item[0].site_name;
    						}
    					}else{    						
    						param[fileFormat[j]] = d[j];
    					}
    					
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
        			param.crudList[i]['product_id'] = uid;
        		}
        		
        		var model = new listModel(param);
        		model.url = model.url+"/"+type+"/"+ 'csvUpdate';
        		
        		w2ui['importAssetTable'].lock("Loading...", true);
        		
        		model.save({}, {
        			success: function (model, respose, options) {
//        				productMgr.crudSuccess(model, respose, options);
        				var non_duplidated_data = _.uniq(respose.param.crudList, 'product_type');
        				var treeListData = [];
        				var treeData = [];
        				for(var i =0; i < productMgr.getTypeList.length; i++){
        					for(var j =0; j < non_duplidated_data.length; j++){
        						if(productMgr.getTypeList[i].text == non_duplidated_data[j].product_type){
        							
        						}else{
        							treeListData.push(non_duplidated_data[j].product_type);
        						}
        					}
        				}
        				$.each(treeListData,function(i,el){
        					if($.inArray(el,treeData) === -1){
        						treeData.push(el);
        					}
        				});
        				console.log("product_type : " +treeData);
        				for(var z=0; z < treeData.length;z++){        					
	        				var uid = util.createUID();
	        				var treeModel = new Model();
	                		treeModel.set({
	                			id : uid,
	                			name : treeData[z],
	                			parentId : "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca",
	                			sortOrder: 0
	                		});
	                		productMgr.collection.create(treeModel);
        				}
        				
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
                		productMgr.searchAction();
        			},
        			
        			error: function (model, xhr, options) {
//        				assetMgr.crudError(model, xhr, options);
        				w2ui['importAssetTable'].lock();
        			}
        		});
        	}
        	
        },
        
        exportData : function(){
        	productMgr.validationCheck();
        	if($("#modelExportBtn").prop('disabled')){
        		return;
        	}
        	
        	var exporAC = w2ui["model_list"].get(w2ui["model_list"].getSelection());
        	
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
//        		let csvContent = "data:text/csv;charset=utf-8,";
        		let csvContent = "data:application/octet-stream;charset=euc-kr,\ufeff";
        		
        		csvContent += productMgr.exportFileFormat.join(",") + "\r\n"; // add Header;
        		
        		let rowHeader = w2ui["model_list"].columns;
        		
        		exporAC.forEach(function(rowArray, idx){
        			let row = "";
        			row += rowArray.product_name; //
        			row += "," + (rowArray.product_type !== null ? rowArray.product_type : ""); //
        			row += "," + (rowArray.spec !== null ? rowArray.spec : ""); //
        			row += "," + (rowArray.site_id !== null ? rowArray.site_id : ""); //
        			row += "," + (rowArray.note !== null ? rowArray.note : ""); // 
        			
        			csvContent += row + "\r\n"; // add carriage return
        		}); 
        		
        		var encodedUri = encodeURI(csvContent); 
//        		window.open(encodedUri);
        		
        		var link = document.createElement("a");
        		if (link.download !== undefined) {
        			link.setAttribute("href", encodedUri);
        			link.setAttribute("target", "_blank");
        			link.setAttribute("download", productMgr.todayFunc());
        			link.style.visibility = 'hidden';
        			document.body.appendChild(link);
        			link.click();
        			document.body.removeChild(link);
        		}
        		
        		w2ui["model_list"].selectNone();
        	});
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
        
        productUpload : function(){
        	var data = w2ui["model_list"].get(w2ui["model_list"].getSelection());
        	var id = data[0].product_id;
        	
        	itsmUtil.attachFileFunc(id);
        	var te = itsmUtil.getFileList(id);
        	w2ui["model_list"].selectNone();
        },
        
        productAddPopupUpload : function(event){
        	var item = w2ui["modelMgr_popup_properties"].record;
        	var id = item.id;
        	
        	itsmUtil.attachFileFunc(id);
        	var te = itsmUtil.getFileList(id);
        },
        
        productEditPopupUpload : function(){
        	var item = w2ui["modelMgr_update_popup_properties"].record;
        	var id = item.id;
        	
        	itsmUtil.attachFileFunc(id);
        	var te = itsmUtil.getFileList(id);
        },
        
        attachFileSuccessHanlder :function(event){
        	w2ui["model_list"].selectNone();
        	productMgr.searchAction();
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
			console.log('product destroy');
			if(w2ui['productMgr_layout']){
				w2ui['productMgr_layout'].destroy();
			}
			
			if(w2ui['model_layout']){
				w2ui['model_layout'].destroy();
			}
			
			if(w2ui['productAssetTree']){
    			w2ui['productAssetTree'].destroy();
    		}
			
			if(w2ui['model_list']){
				w2ui['model_list'].destroy();
			}
			
			if(w2ui['siteTree']){
				w2ui['siteTree'].destroy();
			}
			
			if(w2ui['productMgr_popup_properties']){
				w2ui['productMgr_popup_properties'].destroy();
			}
			
			if(w2ui['productMgr_update_popup_properties']){
				w2ui['productMgr_update_popup_properties'].destroy();
			}
			
			if(w2ui['modelMgr_popup_properties']){
				w2ui['modelMgr_popup_properties'].destroy();
			}
			
			if(w2ui['modelMgr_update_popup_properties']){
				w2ui['modelMgr_update_popup_properties'].destroy();
			}
			
			this.removeEventListener();
			this.undelegateEvents();

			productMgr = null;
		}
		
	});
	return Main;
});