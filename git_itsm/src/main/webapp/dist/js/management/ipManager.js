define([
    "jquery",
    "underscore",
    "backbone",
    "js/lib/component/BundleResource",
    "text!views/management/ipManager",
    "w2ui",
    "css!cs/management/ipManager",
],function(
    $,
    _,
    Backbone,
    BundleResource,
    JSP,
	W2ui,
    APPJSP,
    EPPJSP
){	
	$(window.document).on("contextmenu", function(event){return false;});
	var that;
	var Model = Backbone.Model.extend({
        model: Model,
        url: 'settings/ip',
        parse: function(result) {
            return {data: result};
        }
    });
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		that = this;
    		this.$el.append(JSP);
    		this.requestParam = null;
    		this.elements = {
    			scene : null	
    		};

    		this.init();
			this.start();
			
        },
        
        init : function(){
        	
        	ipMgr = this;
        	
        	$("#contentsDiv").w2layout({
				name : 'ipManager_layout',
				panels : [
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
				]
			});
        	
        	var mainContents = '<div id="mainTop">'+
        	'<div id="ipBtnGroup">'+
	        	'<i id="ipAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
	    		'<i id="ipDeleteBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del"></i>'+
	    		'<i id="ipEditBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Modify"></i>'+
    		'</div>'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">IP List</div>'+
	    		
	    		'<div id="searchIpArea">'+
					'<div class="w2ui-field">'+
						'<input name="ip" type="text" size="25" style="float: left; width:168px;" placeholder="Input IP Address">'+							
					'</div>'+
					'<i id="ipSearchBtn" class="icon link fas fa-search fa-2x" aria-hidden="true" title="Search"></i>'+
				'</div>'+
			
	    		'<div class="dashboard-contents" style="margin-top: -28px;">'+
		    		'<div id="mainSubBottom"></div>'+
		    		'<div class="pager-table-area" id="ipPagerTable">'+
						'<div class="ip-pager" id="ipPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
        	
        	$("#mainContents").html(mainContents);
			$('#ipContentList').append("<div id='ipAddPopup'></div>");
        	$("#mainSubBottom").w2grid({
        		name : 'ipManager_table',
        		style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
        		show : {
        			footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false,
					selectColumn: true
        		},
        		multiSelect: true,
        		recordHeight : 30,
        		columns :[
        			{ field: 'recid', caption: 'NO', size: '80px', attr: "align=center" },
                	{ field: 'ipAddress', caption: 'IP ADDRESS'/*'IP Address'*/, size: '150PX', style:'padding-left:5px;' },
                    { field: 'allowance', caption: 'ALLOW'/*'Allowance'*/, size: '100PX', attr : "align=center" },
                    { field: 'description', caption: 'DESCRIPTION'/*'Description'*/, size: '100%' , attr : "align=left" , style:'padding-left:5px;' },
        		]
        	});
        	
        	w2ui["ipManager_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.checkBtnValidate();
        	});
        	
        	w2ui["ipManager_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.checkBtnValidate();
        	});
        	
        	w2ui["ipManager_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.checkBtnValidate();
        	});
        	
        	$("#searchIpArea").w2form({
        		name : 'ip_search_text',
        		focus : -1,
        		fields : [
        			{name : 'ip', type : 'text'},
        		],
        		record : {
        			ip : '',
        		}
        	});
        	
        	$("#ipDeleteBtn").prop("disabled", true);
			$("#ipDeleteBtn").removeClass('link');

			$("#ipEditBtn").prop("disabled", true);
			$("#ipEditBtn").removeClass('link');
        },
        
        /*이벤트 등록*/
        eventListenerRegister : function(){
        	$(document).on("click", "#ipMgrPopupOkBtn", this.validateCheckFunc);
        	$(document).on("click", "#ipMgrUpdatePopupOkBtn", this.validateUpdateFunc);
        	$(document).on("click", "#ipMgrPopupDeleteOkBtn", this.deleteExcute);
        },
        
        /*이벤트 해제*/
        removeEventListener : function(){
        	$(document).off("click", "#ipMgrPopupOkBtn");
        	$(document).off("click", "#ipMgrUpdatePopupOkBtn");
        	$(document).off("click", "#ipMgrPopupDeleteOkBtn");
        },
        
        start : function(){
			this.searchAction();
			this.eventListenerRegister();
		},
        
		events: {
        	'click #ipAddBtn' : 'addIpPopup',
        	'click #ipEditBtn' : 'editIpPopup',
        	'dblclick .w2ui-grid-data'  : 'editIpPopup',
        	'click #ipSearchBtn' : 'searchAction',
        	'click #ipDeleteBtn' : 'deleteAction',
        },
		
        checkBtnValidate : function(){
        	if(w2ui['ipManager_table'].getSelection().length > 0){
        		if(w2ui['ipManager_table'].getSelection().length > 1){ // 다중 선택
        			$("#ipEditBtn").prop('disabled', true);
    				$("#ipEditBtn").removeClass('link');
        		}else{ // 단일 선택
        			$("#ipEditBtn").prop('disabled', false);
    				$("#ipEditBtn").addClass('link');
        		}
        		$("#ipDeleteBtn").prop('disabled', false);
        		$("#ipDeleteBtn").addClass('link');
			}else{
				$("#ipDeleteBtn").prop('disabled', true);
				$("#ipDeleteBtn").removeClass('link');
				$("#ipEditBtn").prop('disabled', true);
				$("#ipEditBtn").removeClass('link');
			}
        },
        
        dataChange: function(data) {
			var length = 0;
			var allowance = "";
			
			if(data != undefined) {
	            length = data.length;
	        }
			
			if(length > 0) {
				for (var i=0; i < length; i++) {
	                
	                switch (data[i].allowance) {
	                    case 0 : 
	                    		data[i].allowance = BundleResource.getString("label.user.allowance_deny");
	                            break;
	                    case 1 :
	                    		data[i].allowance = BundleResource.getString("label.user.allowance_allow");
	                            break;
	                    default :
	                    		data[i].allowance = BundleResource.getString("label.user.allowance_allow");
	                            break;
	                };
				}
			}
			return data;
        },
        
        searchAction: function() {
			var _this = this;
    		var startRow = 1;
    		var endRow = 22;    	
        	var ipAddress = w2ui['ip_search_text'].record.ip;
			var model = new Model();
						
			if(ipAddress == '') {
				model.set({"startRow" : startRow, "endRow" : endRow});
			} else {
				model.set({"ipAddress":ipAddress, "startRow" : startRow, "endRow" : endRow});
			}
			this.requestParam = model.attributes;
			
			model.url = model.url + "/limitList";
			model.save(null, {
				success: function(model, response) {
					var resultData = model.changed.data.data.data;
					var dataCnt = resultData.length;
					var totalCount = model.changed.data.noOffsetRecord;
					
					if(dataCnt == 0){
						w2ui['ipManager_table'].clear();
					}else{
						if($('#ipPager').data("twbs-pagination")){
							$('#ipPager').pager("destroy").off("click");
							var pageGroup = '<div class="ip-pager" id="ipPager" data-paging="true"></div></div>';
							$("#ipPagerTable").html(pageGroup);
			            }
						
						$('#ipPager').pager({
			            	"totalCount" : totalCount,
			            	"pagePerRow" : 22
			            }).on("click", function (event, page) {
			            	var evtClass = $(event.target).attr('class');
			            	if(evtClass != 'page-link') return;
			            	
			            	var pagination = $('#ipPager').data('twbsPagination');
			            	var currentPage = pagination.getCurrentPage();
			            	var requestParam = that.requestParam;
			            	
			            	var startRow = currentPage;
			            	var endRow = 22;
			            	
			            	var model = new Model();
			            	model.set({
			    				"ipAddress" : requestParam.ipAddress,
			    				"allowance" : requestParam.allowance,
			    				"description": requestParam.description,
			    				"startRow" : startRow, 
			    				"endRow" : endRow
			    			});
			            	
			            	model.url += "/limitList";
			            	model.save();
			            	that.listenTo(model, "sync", that.refreshView);
			            });
						
						var pagination = $('#ipPager').data('twbsPagination');
						var currentPage = pagination.getCurrentPage();
						
						$('#ipPager').pager('pagerTableCSS', ".ip-pager .pagination", totalCount, currentPage);
						
						w2ui['ipManager_table'].clear();
						w2ui['ipManager_table'].records = resultData;
						_this.dataChange(resultData);
						w2ui['ipManager_table'].refresh();
						
					}
					
				},
				error: function(model, response) {

				}
			});
        },
        
        refreshView : function(method, model, options){
			w2ui['ipManager_table'].clear();
			w2ui['ipManager_table'].records = model.data.data;
			this.dataChange(model.data.data);
			w2ui['ipManager_table'].refresh();
		},
		
		///////////////////////////////////////popup
		validateCheckFunc : function(event){
			var _this = this;
        	var startRow = 1;
        	var endRow = 22;
        	var arr = w2ui["ipMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["ipMgr_popup_properties"].record;
        		var allowance = item.allowance.id;
        		
        		var model = new Model();
        		model.set({"ipAddress":item.ip, "allowance":allowance, "description":item.description});
        		
        		model.save(null, {
        			success: function(model, response) {
        				var that = _this;
        				that.model = new Model();
        				that.model.set({"startRow" : startRow, "endRow" : endRow});
        				that.model.url = that.model.url + "/limitList"; 
        				that.model.save();

        				ipMgr.listenTo(that.model, "sync",
        						function() {
        					ipMgr.searchAction();
        				}
        				); 
        			},
        			error: function(model, response) {

        			}
        		});
        		w2popup.close();
        	}
        },

        validateUpdateFunc : function(event){
			var _this = this;
			var urlRoot = "settings/ip";
        	var startRow = 1;
        	var endRow = 22;
        	var arr = w2ui["ipMgr_upDatepopup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["ipMgr_upDatepopup_properties"].record;
        		var allowance = item.allowance.id;
        		
        		var model = new Model();
        		model.url = urlRoot + '/' + item.id; 
        		model.set("id", item.id);
        		model.set({"ipAddress":item.ip, "allowance":allowance, "description":item.description});
        		
        		model.save(null, {
        			success: function(model, response) {
        				var that = _this;
        				that.model = new Model();
        				that.model.set({"startRow" : startRow, "endRow" : endRow});
        				that.model.url = that.model.url + "/limitList"; 
        				that.model.save();

        				ipMgr.listenTo(that.model, "sync",
        						function() {
        					ipMgr.searchAction();
        				}
        				); 
        			},
        			error: function(model, response) {

        			}
        		});
        		w2popup.close();
        	}
        },
		addIpPopup : function(){
			var getIpList = [{"text" : BundleResource.getString('label.user.allowance_allow'), "id" : "1"},{"text" : BundleResource.getString('label.user.allowance_deny'), "id" : "0"}];
			
			var body = '<div class="w2ui-centered">'+
			'<div id="ipMgrPopupContents" style="width:100%; height:100%" >'+
    			'<div class="w2ui-page page-0">'+
	        		
    				'<div class="w2ui-field">'+
	        			'<label>IP ADDRESS</label>'+
	        			'<div>'+
	        				'<input name="ip" type="text" style="width:300px;" />'+
	        			'</div>'+
	        		'</div>'+
	        		
	        		'<div id="allowancePopup" class="w2ui-field">'+
	        			'<label>ALLOW</label>'+
	        			'<div>'+
	        			'<input name="allowance" type="text" style="width:300px;" />'+
	        			'</div>'+
	        		'</div>'+
	        		
	        		'<div class="w2ui-field">'+
	    				'<label>DESCRIPTION</label>'+
	    				'<div>'+
							'<input name="description" type="text" style="width:300px;" />'+
						'</div>'+
	    			'</div>'+
	    			
	    		'</div>'+
	    	'</div>'+
			'<div id="ipMgrPopupBottom">'+
    			'<button id="ipMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.user.save') + '</button>'+
    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.user.close') + '</button>'+
			'</div>'+
		'</div>';
		
		w2popup.open({
			title :  BundleResource.getString("title.user.ipAdd_popup"),
	        body: body,
	        width : 550,
	        height : 250,
	        opacity   : '0.5',
    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
	        onOpen    : function(event){
	        	event.onComplete = function () {
	        		$("#ipMgrPopupBottom").html();
	        		w2ui["ipMgr_popup_properties"].render();
	        	}
	        },
	        
	        onClose   : function(event){
	        	w2ui['ipMgr_popup_properties'].destroy();
	        }
	        
	    });
		
		$("#ipMgrPopupContents").w2form({
			name : 'ipMgr_popup_properties',
			style:"border:1px solid rgba(0,0,0,0);",
			fields : [
				{name:'ip', type: 'text', disabled:false, required:true, html:{caption:'IP ADDRESS'}},
				{name:'allowance', type : 'list', options : {items : getIpList , selected: {id: 1, text: BundleResource.getString('label.user.allowance_allow')}},  disabled:false, required:false, html:{caption:'ALLOW'}},
				{name:'description', type: 'text', disabled:false, required:false, html:{caption:'DESCRIPTION'}},
			],
			onRender : function(event){},
			record:{
				id:'',
				ip:'',
				allowance:'',
				description:'',
			}
			
		});
		},
		
		editIpPopup : function(event){
			that.checkBtnValidate();
			if($("#ipEditBtn").prop("disabled")){
				return;
			}
			var getIpList = [{"text" : BundleResource.getString('label.user.allowance_allow'), "id" : "1"},{"text" : BundleResource.getString('label.user.allowance_deny'), "id" : "0"}];
			var data = w2ui["ipManager_table"].get(w2ui["ipManager_table"].getSelection());
			var allowance;
        	if(data != null){
        		if(data[0].allowance == BundleResource.getString('label.user.allowance_allow')){
        			allowance = 1;
        		}else{
        			allowance = 0;
        		}
        	}
			
			fields = [
				{name:'ip', type: 'text', disabled:false, required:true, html:{caption:'IP ADDRESS'}},
				{name:'allowance', type : 'list', options : {items : getIpList },  disabled:false, required:false, html:{caption:'ALLOW'}},
				{name:'description', type: 'text', disabled:false, required:false, html:{caption:'DESCRIPTION'}}
			];
			
			record={
					id:data[0].id,
    				ip:data[0].ipAddress,
    				allowance:allowance,
    				description:data[0].description,
			};
        	var body = '<div class="w2ui-centered">'+
			'<div id="ipMgrUPdatePopupContents" style="width:100%; height:100%" >'+
    			'<div class="w2ui-page page-0">'+
	        		
    				'<div class="w2ui-field">'+
	        			'<label>IP ADDRESS</label>'+
	        			'<div>'+
	        				'<input name="ip" type="text" style="width:300px;" />'+
	        			'</div>'+
	        		'</div>'+
	        		
	        		'<div id="allowancePopup" class="w2ui-field">'+
	        			'<label>ALLOW</label>'+
	        			'<div>'+
	        			'<input name="allowance" type="text" style="width:300px;" />'+
	        			'</div>'+
	        		'</div>'+
	        		
	        		'<div class="w2ui-field">'+
	    				'<label>DESCRIPTION</label>'+
	    				'<div>'+
							'<input name="description" type="text" style="width:300px;" />'+
						'</div>'+
	    			'</div>'+
	    			
	    		'</div>'+
	    	'</div>'+
			'<div id="ipMgrMgrUPdatePopupBottom">'+
    			'<button id="ipMgrUpdatePopupOkBtn" class="darkButton">' + BundleResource.getString('button.user.save') + '</button>'+
    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.user.close') + '</button>'+
			'</div>'+
		'</div>';
        	
        
        	w2popup.open({
    			title : BundleResource.getString("title.user.ipEdit_popup"),
    	        body: body,
    	        width : 550,
    	        height : 250,
    	        opacity   : '0.5',
        		modal     : true,
    		     	showClose : true,
    		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#ipMgrPopupBottom").html();
    	        		w2ui["ipMgr_upDatepopup_properties"].render();
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	w2ui['ipMgr_upDatepopup_properties'].destroy();
    	        }
    	        
    	    });
    		
    		$("#ipMgrUPdatePopupContents").w2form({
    			name : 'ipMgr_upDatepopup_properties',
    			style:"border:1px solid rgba(0,0,0,0);",
    			fields : fields,
    			onRender : function(event){},
    			record: record
    			
    		});
        	
		},
		
		deleteAction : function() {
			that.checkBtnValidate();
			if($("#ipDeleteBtn").prop("disabled")){
				return;
			}
			var markup = "";
			var data = w2ui["ipManager_table"].get(w2ui["ipManager_table"].getSelection());
        	var arrayData = [];
        	
        	for(var i=0;i<data.length;i++){
    			arrayData.push(data[i].id);
    		}
			var bodyContents = "";
        	var body = "";
        	if(arrayData.length > 0){
        		//bodyContents = "선택된 "+ dataProvider.length+"개의 항목을 삭제 하시겠습니까?";
        		bodyContents = BundleResource.getString("label.user.delete_confirm");
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button id="ipMgrPopupDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
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
		
		deleteExcute : function(){      	
        	var model = new Model();
        	var data = w2ui["ipManager_table"].get(w2ui["ipManager_table"].getSelection());
        	var arrayData = [];
        	
        	for(var i=0;i<data.length;i++){
    			arrayData.push(data[i].id);
    		}
        	model.set("id", arrayData);
        	model.url = model.url + '/multiDelete/' + arrayData;
        	
        	model.destroy({
        		success: function (model, respose, options) {
    				ipMgr.refreshListView();
    			}
    		});
        },
		
        refreshListView: function() {
        	var that = this;
        	var endRow = 22;
        	var pagination = $('#ipPager').data('twbsPagination');
        	var currentPage = pagination.getCurrentPage();
        	that.model = new Model();
        	that.model.url = that.model.url + "/limitList"; 
        	that.model.set({"startRow" : currentPage, "endRow" : endRow});
        	that.model.save();
        	that.listenTo(that.model, "sync", that.refershViewAll);
        },
        
        refershViewAll: function(model) {
        	var array = model.toJSON();
        	var data = array.data.data.data;

        	w2ui['ipManager_table'].clear();
			w2ui['ipManager_table'].records = data;
			ipMgr.dataChange(data);
			w2ui['ipManager_table'].refresh();
        },
        
		destroy : function(){
			if(w2ui['ipManager_layout']){
				w2ui['ipManager_layout'].destroy();
			}
			if(w2ui['ipManager_table']){
				w2ui['ipManager_table'].destroy();
			}
			if(w2ui['ipMgr_popup_properties']){
        		w2ui['ipMgr_popup_properties'].destroy();
        	}
			if(w2ui['ip_search_text']){
				w2ui['ip_search_text'].destroy();
			}
			this.removeEventListener();
			this.undelegateEvents();
		}
		
    })

    return Main;
});