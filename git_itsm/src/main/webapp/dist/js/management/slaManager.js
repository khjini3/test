define([
    "jquery",
    "underscore",
    "backbone",
    "js/lib/component/BundleResource",
    "text!views/management/slaManager",
    "w2ui",
    "css!cs/management/slaManager",
    "bootstrap_toggle",
],function(
    $,
    _,
    Backbone,
    BundleResource,
    JSP,
	W2ui
){	
	$(window.document).on("contextmenu", function(event){return false;});
	var that;
	var checkExpand = false;
	var Model = Backbone.Model.extend({
        model: Model,
        url: 'settings/sla',
        parse: function(result) {
            return {data: result};
        }
    });
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.selectData = null;
    		this.elements = {
    			scene : null	
    		};
    		var startRow = 1;
    		var endRow = 23;    
    		this.$el.append(JSP);

    		this.init();
			this.start();
        },
        		
        init: function(){
        	that = this;
        	
        	$("#contentsDiv").w2layout({
				name : 'slaManager_layout',
				panels : [
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
				]
			});
        	
        	var mainContents = '<div id="mainTop">'+
        	'<div id="slaBtnGroup" sytle="visibility:visible;">'+
	        	'<i class="icon link fas fa-plus fa-2x" id="slaAddBtn" aria-hidden="true" title="Add"></i>'+
				'<i class="icon link fas fa-trash-alt fa-2x" id="slaDelBtn" aria-hidden="true" title="Delete"></i>'+
	    		'<i class="icon link fas fa-edit fa-2x" id="slaEditBtn" aria-hidden="true" title="Edit"></i>'+
				'<i class="icon link far fa-save fa-2x" id="sla_SaveBtn" aria-hidden="true" title="Save" style="display:none;"></i>'+
				'<i class="icon link fas fa-times fa-2x" id="sla_CancelBtn" aria-hidden="true" title="Cancel" style="display:none;"></i>'+
    		'</div>'+    		
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">SLA Info</div>'+
	    					
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubBottom"></div>'+
		    		
		    		'</div>'+
	    		'</div>'+
	    	'</div>';
        	
        	$("#mainContents").html(mainContents);
        	
        	$("#slaDelBtn").prop("disabled", true);
			$("#slaDelBtn").removeClass('link');
			$("#slaEditBtn").prop("disabled", true);
			$("#slaEditBtn").removeClass('link');
        	
        	$("#mainSubBottom").w2grid({
        		name : 'slaManager_table',
        		style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
        		show: { selectColumn: false, 
        			recordTitles: false,
        			expandColumn: false
        		},
        		multiSelect: true,
        		recordHeight : 33,
        		columns :[
        			{ field: 'category_name', caption: 'Category', size: '100%' },
        			{ field: 'critical', caption: 'Critical', size: '100px', attr : "align=center" , editable:{type:'int', min:0} },
        			{ field: 'major', caption: 'Major', size: '100px', attr : "align=center" , editable:{type:'int', min:0} },
        			{ field: 'minor', caption: 'Minor', size: '100px', attr : "align=center" , editable:{type:'int', min:0} },
        			{ field: 'alarm_on_off', caption: 'On/Off', size: '100px', attr : "align=center",
        				render: function(record) {
        					if(record.alarm_on_off == 0) {
        						return '<img src="dist/img/idc/ticker/ti_off.png" id="alarm-on-off" class="alarm-on-off alarm-off" slaid="'+record.recid+'">';               	
        					} else if(record.alarm_on_off == 1) {
        						return '<img src="dist/img/idc/ticker/ti_on.png" id="alarm-on-off" class="alarm-on-off alarm-on" slaid="'+record.recid+'">';   
        					}
        				}
        			}
        			]
        	});
        	
        	w2ui["slaManager_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.checkBtnValidate();
        	});
//        	
        	w2ui["slaManager_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.checkBtnValidate();
        	});
//        	
        	w2ui["slaManager_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.checkBtnValidate();
        	});
        	
        	w2ui["slaManager_table"].on({phase: 'before', execute:'after', type : 'change'}, function(event){
        		console.log("change");
        		that.changeCheck();
        	});
        	
        	w2ui["slaManager_table"].on('click', function (event) {
        		that.selectData = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection())[0];
        	});
        					
			if(this.checkBrowser() == "chrome") {
        		console.log("Chrome");
        	} else if(this.checkBrowser() == "safari") {
        		console.log("Safari");
        	} else if(this.checkBrowser() == "firefox") {
        		console.log("Firefox");
        		$(".module-container").css("height", "calc(100% - 75px)");
        	} else if(this.checkBrowser() == "opera") {
        		console.log("Opera");
        	} else {
        		console.log("IE");
        	}
        },
        
        eventListenerRegister : function(){ //add / edit / delete OKBtn
			$(document).on("click", "#slaMgrEditPopupOkBtn", this.modifyPopupOkAction);
			$(document).on("click", "#slaMgrDelPopupOkBtn", this.deletePopupOkAction);
			$(document).on("click", "#slaMgrAddPopupOkBtn", this.AddPopupOkAction);
			$(document).on("click", "#sla_SaveBtn", this.saveModifySla);
			$(document).on("click", "#sla_CancelBtn", this.cancelModifySla);
		},
		
		removeEventListener : function(){
			$(document).off("click", "#slaMgrEditPopupOkBtn");
			$(document).off("click", "#slaMgrDelPopupOkBtn");
			$(document).off("click", "#slaMgrAddPopupOkBtn");
			$(document).off("click", "#sla_SaveBtn");
			$(document).off("click", "#sla_CancelBtn");
		},
        
        start: function(){
        	this.allSlaInfo();
        	this.eventListenerRegister();
        },
        
        allSlaInfo: function(){
        	var startRow = 1;
    		var endRow = 22;   
    		this.model = new Model();
    		this.model.set({"startRow" : startRow, "endRow" : endRow});
    		this.model.url = this.model.url + "/limitList"; 
    		this.model.save();    		
    		this.listenTo(this.model, "sync", this.setData);
        },
        
        expandSlaAll: function(array){
			var data = this.dataChange(array);
			var len = data.length;
        	var totalLen = array.categoryList.length;
        	
        	for(var i = 0; i < len; i++) {
        		w2ui['slaManager_table'].expand(data[i].recid);
        		w2ui['slaManager_table'].set(data[i].recid, { w2ui: { editable: false } });
        		if(data[i].w2ui.children.length > 0){
        			for(var z = 0; z < data[i].w2ui.children.length; z++) {
        				w2ui.slaManager_table.expand(data[i].w2ui.children[z].recid);
        				w2ui['slaManager_table'].set(data[i].w2ui.children[z].recid, { w2ui: { editable: false } });
        			}
        		}
        	}
        },
        
        expandSla: function(array){
			var data = this.dataChange(array);
			var len = data.length;
        	var totalLen = array.categoryList.length;
        	
        	for(i = 0; i < len; i++) {
        		w2ui['slaManager_table'].expand(data[i].recid);
        		w2ui['slaManager_table'].set(data[i].recid, { w2ui: { editable: false } });
        	}
        },
        
        setData: function(model) { 
        	var data = model.toJSON().data.data;
        	w2ui['slaManager_table'].clear();
        	w2ui['slaManager_table'].add({ recid: -1, category_name: 'ROOT'});
        	w2ui['slaManager_table'].set(-1, { w2ui: { children: data.categorydata } });
        	w2ui['slaManager_table'].set(-1, { w2ui: { editable: false } });
        	if(checkExpand == false){        		
        		w2ui['slaManager_table'].expand(-1);
        		that.expandSlaAll(data);
        	}else{
        		w2ui['slaManager_table'].expand(-1);
        		that.expandSla(data);
        	}
        	
        	w2ui['slaManager_table'].refresh();
		},

		events: {
			'click #slaAddBtn' : 'addSlaPopup',
        	'click #slaEditBtn' : 'editSlaPopup',
			'click #slaDelBtn' : 'deleteSla',
        	'click #alarm-on-off' : 'changeState'
        },
        
        changeCheck : function(){
        	var changeAC = w2ui["slaManager_table"].getChanges();
        	if(changeAC.length > 0){
        		$("#slaAddBtn").css("display", "none");
        		$("#slaEditBtn").css("display", "none");
        		$("#slaDelBtn").css("display", "none");
    			$("#sla_SaveBtn").css("display", "");
    			$("#sla_CancelBtn").css("display", "");
        	}else{
        		$("#slaAddBtn").css("display", "");
        		$("#slaEditBtn").css("display", "");
        		$("#slaDelBtn").css("display", "none");
    			$("#sla_SaveBtn").css("display", "none");
    			$("#sla_CancelBtn").css("display", "none");
        	}
        },
        
        checkBtnValidate : function(){
        	if(w2ui['slaManager_table'].getSelection().length > 0){
				if(w2ui['slaManager_table'].getSelection()[0] == -1){
					$("#slaAddBtn").prop('disabled', false);
					$("#slaAddBtn").addClass('link');
					$("#slaEditBtn").prop('disabled', true);
					$("#slaEditBtn").removeClass('link');
					$("#slaDelBtn").prop('disabled', true);
					$("#slaDelBtn").removeClass('link');
				}else if(w2ui['slaManager_table'].getSelection()[0] > 10000){
					$("#slaAddBtn").prop('disabled', true);
					$("#slaAddBtn").removeClass('link');
					$("#slaEditBtn").prop('disabled', false);
					$("#slaEditBtn").addClass('link');
					$("#slaDelBtn").prop('disabled', false);
					$("#slaDelBtn").addClass('link');
				}else{					
					$("#slaAddBtn").prop('disabled', false);
					$("#slaAddBtn").addClass('link');
					$("#slaEditBtn").prop('disabled', false);
					$("#slaEditBtn").addClass('link');
					$("#slaDelBtn").prop('disabled', false);
					$("#slaDelBtn").addClass('link');
				}
			}else{
				$("#slaAddBtn").prop('disabled', false);
				$("#slaAddBtn").addClass('link');
				$("#slaEditBtn").prop('disabled', true);
				$("#slaEditBtn").removeClass('link');
				$("#slaDelBtn").prop('disabled', true);
				$("#slaDelBtn").removeClass('link');
			}
        },
        
		reloadData: function(data, ipAddr, action) {
			var array = data.toJSON();
        	var data = this.dataChange(array.data.data);

        	w2ui['slaManager_table'].clear();
        	w2ui['slaManager_table'].records = data;
        	
        	var len = data.length;
        	for (var i=1; i<len+1; i++) {
        		w2ui["slaContentAreaGrid"].expand(i);
        	}

		},
		
        dataChange: function(data) {
        	return data.categorydata;
        },
        
        
        /* set data from one given row on the screen.
         * will not refresh all changed rows,
         * but only specified one */
        changeData : function(model){        	
        	let recid = model.attributes.idx;
        	let record = model.attributes
        	w2ui["slaManager_table"].set(recid, record); //able to add option [noRefresh]
        },    
        changeState: function(evt) {
        	var _this = this;
        	var edit_model = new Model();
        	var urlRoot = "";
        	var idx = 0;
        	var startRow = 1;
        	var endRow = 23;
        	var alarm_on_off = 0;
        	var data = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection())[0];
        	var critical = "";
        	var major = "";
        	var minor = "";
        	var markup, body = "";
        	if(data == null || data == undefined) {
            	if((_this.selectData.critical == 0) && (_this.selectData.major == 0) && (_this.selectData.minor == 0)) {
            		markup = BundleResource.getString("label.sla.severityNotSet");
            		body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+markup+'</div>'+
    				'<div class="assetMgr-popup-btnGroup">'+
    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.sla.confirm') + '</button>'+
    				'</div>'+
    				'</div>' ;
                	w2popup.open({
                		width: 385,
         		        height: 180,
        		        title : BundleResource.getString('title.sla.info'),
        		        body: body,
                        opacity   : '0.5',
                 		modal     : true,
            		    showClose : true
        		    });
            		return;
    				
    				
            	} else {
        	   		if(_this.selectData.alarm_on_off == 0){
        				alarm_on_off = 1;
        			}else{
        				alarm_on_off = 0;
        			}
        	   		
        	   		idx =  _this.selectData.recid;
        	   		critical = _this.selectData.critical;
        	   		major = _this.selectData.major;
        	   		minor = _this.selectData.minor;
            	}
        	} else {
            	if((data.critical == 0) && (data.major == 0) && (data.minor == 0)) {
            		markup = BundleResource.getString("label.sla.severityNotSet");
            		body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+markup+'</div>'+
    				'<div class="assetMgr-popup-btnGroup">'+
    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.sla.confirm') + '</button>'+
    				'</div>'+
    				'</div>' ;
                	w2popup.open({
                		width: 385,
         		        height: 180,
        		        title : BundleResource.getString('title.sla.info'),
        		        body: body,
                        opacity   : '0.5',
                 		modal     : true,
            		    showClose : true
        		    });
            		return;
    				
            	} else {
        	   		if(data.alarm_on_off == 0){
        				alarm_on_off = 1;
        			}else{
        				alarm_on_off = 0;
        			}
        	   		
        	   		idx = data.recid;
        	   		critical = data.critical;
        	   		major = data.major;
        	   		minor = data.minor;
            	}
        	}
	   		
        	urlRoot = "settings/sla";
        	window.w2utils.settings.dataType = "RESTFULLJSON";
        	
        	if(idx == undefined) {
        		edit_model.url = urlRoot;
        	} else {
        		edit_model.recid = idx;
        		edit_model.url = urlRoot + '/' + idx; 
        	}	
        	edit_model.set("idx", idx);
			edit_model.set({ "critical":critical, "major":major, "minor":minor, "alarm_on_off":alarm_on_off });
			
			edit_model.save(null, {
	              success: function(model, response) {
	            	  var that = _this;
	                  var model = new Model();
	                  w2ui['slaManager_table'].selectNone();
	                  model.set({"startRow" : startRow, "endRow" : endRow});
	                  model.url = model.url + "/limitList"; 
	                  model.save();

	                  _.throttle(that.changeData(edit_model),1000);
	              },
	              error: function(model, response) {
	            	  console.log("Edit Error : " + response);
	            	  w2ui['slaManager_table'].selectNone();
	              }
	          });
        },

        //Add
        addSlaPopup : function(){
        	var _this = this;
        	_this.checkBtnValidate();
        	if($("#slaAddBtn").prop("disabled")){
        		return;
        	}
        	var selectRow = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection())[0];
        	var checkRow = null;
        	var parent = null;
        	var type = null;
        	var parentId = null;
        	
        	if(selectRow == undefined){
        		parent = 'ROOT';
        		parentId = -1;
        	}else if(selectRow.recid == -1){
        		parent = selectRow.category_name;
        		parentId = -1;
        	}else if(selectRow.w2ui.parent_recid == -1){
        		parent = selectRow.category_name;
        		parentId = selectRow.recid;
        	}else if(selectRow.w2ui.parent_recid < 1000){
        		parent = selectRow.category_name;
        		parentId = selectRow.recid;
        		type = "TYPE";
        	}       	
        	
        	var body = '<div class="w2ui-centered">'+
				'<div id="slaMgrAddPopupContents" style="width:100%; height:100%" >'+
					'<div class="w2ui-page page-0">'+

     				'<div class="w2ui-field">'+
     				'<label>PARENT NAME</label>'+
     				'<div>'+
     				'<input name="parentlSet" type="text" style="width:138px;" />'+
     				'</div>'+
     				'</div>'+

//     				'<div class="w2ui-field">'+
//     				'<label>TYPE</label>'+
//     				'<div>'+
//     				'<input name="typeSet" type="text" style="width:138px;" />'+
//     				'</div>'+
//     				'</div>'+

     				'<div class="w2ui-field">'+
     				'<label>NAME</label>'+
     				'<div>'+
     				'<input name="nameSet" type="text" style="width:138px;" />'+
     				'</div>'+
     				'</div>'+

     				'<div class="w2ui-field">'+
     				'<label>ALARM ID</label>'+
     				'<div>'+
     				'<input name="alarmIdSet" type="number" min="1" style="width:138px;" />'+
     				'</div>'+
     				'</div>'+

     				'<div class="w2ui-field">'+
     				'<label>ALARM COLUMN</label>'+
     				'<div>'+
     				'<input name="columnSet" type="number" min="1" style="width:138px;" />'+
     				'</div>'+
     				'</div>'+
     			'</div>'+
				'</div>'+
				'<div id="slaMgrMgrAddPopupBottom" style="margin-top: 35px;">'+
				'<button id="slaMgrAddPopupOkBtn" class="darkButton">' + BundleResource.getString('button.sla.save') + '</button>'+
				'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.sla.close') + '</button>'+
				'</div>'+
				'</div>';
			    	        	    	        	
	        	w2popup.open({
	    			title : BundleResource.getString('title.sla.addSla'),
	    	        body: body,
	    	        width : 360,
	    	        height : 350,
	    	        opacity   : '0.5',
	        		modal     : true,
	    		     	showClose : true,
	    		     	style	  : "overflow:hidden;",
	    	        onOpen    : function(event){
	    	        	event.onComplete = function () {
	    	        		$("#slaMgrPopupBottom").html();
	    	        		w2ui["slaMgr_Addpopup_properties"].render();
	    	        	}
	    	        },
	    	        
	    	        onClose   : function(event){
	    	        	w2ui['slaMgr_Addpopup_properties'].destroy();
	    	        }
	    	        
	    	    });
	        	
	        	var fields = [];
	        	if(type == 'TYPE'){     	        		
 	        		fields = [
 	        			{name:'parentId', type: 'int', html:{caption:'PARENT NAME'}, hidden : true},
     					{name:'parentlSet', type: 'text', disabled:true, html:{caption:'PARENT NAME'}},
//     					{name:'typeSet', type: 'text', disabled:true, html:{caption:'TYPE'}},
     					{name:'nameSet', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
     					{name:'alarmIdSet', type: 'number', min:0, disabled:false, required:true, html:{caption:'ALARM ID'}},
     					{name:'columnSet', type: 'int', min:1, max:100, disabled:false, required:true, html:{caption:'ALARM COLUMN'}},
     				];
 	        	}else{
 	        		fields = [
 	        			{name:'parentId', type: 'int', html:{caption:'PARENT NAME'}, hidden : true},
     					{name:'parentlSet', type: 'text', disabled:true, html:{caption:'PARENT NAME'}},
//     					{name:'typeSet', type: 'text', disabled:true, html:{caption:'TYPE'}},
     					{name:'nameSet', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
     					{name:'alarmIdSet', type: 'number', min:0, disabled:true, html:{caption:'ALARM ID'}},
     					{name:'columnSet', type: 'int', min:1, max:100, disabled:true, html:{caption:'ALARM COLUMN'}},
     				];
 	        	}
 	        	
 	    		$("#slaMgrAddPopupContents").w2form({
 	    			name : 'slaMgr_Addpopup_properties',
 	    			style:"border:1px solid rgba(0,0,0,0);",
 	    			fields : fields,
 	    			onRender : function(event){},
 	    			record: {
 	    				parentId: parentId,
 						parentlSet:parent,
 						nameSet:'',
 						alarmIdSet:'',
 						columnSet:'',
 				}	
 	    		});
        },
        
        AddPopupOkAction : function() {
        	var arr = w2ui['slaMgr_Addpopup_properties'].validate();
        	if(arr.length > 0){
				return;
			}else{
				var add_model = new Model();
				var item = w2ui['slaMgr_Addpopup_properties'].record;
				var parentId = item.parentId;
				var name = item.nameSet;
				var alarmId = item.alarmIdSet;
				var column = "p"+item.columnSet;
				
				add_model.url = "/settings/sla/addSla";
				add_model.set({ "name":name, "stat_id":alarmId, "stat_column":column, "check_pid":parentId});
				add_model.save(null,{
					success : function(model, response){
						w2ui['slaManager_table'].selectNone();
						checkExpand = true;
  	                  	that.allSlaInfo();
  	                  	w2popup.close();
					},
					error : function(model, response){
						console.log("Error");
					}
				});
				checkExpand = false;
			}
        },
        
        editSlaPopup : function(evt) {
        	var _this = this;
        	_this.checkBtnValidate();
        	if($("#slaEditBtn").prop("disabled")){
        		return;
        	}
        	if($(evt.target).parent().hasClass('w2ui-empty-record')){
        		return;
        	}
        	var selectRecid = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection())[0].recid;
        	
        	if(selectRecid) {
				var title = BundleResource.getString("title.sla.editSla");
				var data = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection())[0];
				
				if(data == null || data == undefined) {
					var markup = BundleResource.getString("label.sla.severityNotSet");
            		body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+markup+'</div>'+
    				'<div class="assetMgr-popup-btnGroup">'+
    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.sla.confirm') + '</button>'+
    				'</div>'+
    				'</div>' ;
                	w2popup.open({
                		width: 385,
         		        height: 260,
        		        title : title,
        		        body: body,
                        opacity   : '0.5',
                 		modal     : true,
            		    showClose : true
        		    });
            		return;
				} else {
					var body = '<div class="w2ui-centered">'+
 					'<div id="slaMgrEditPopupContents" style="width:100%; height:100%" >'+
 						'<div class="w2ui-page page-0">'+

		     				'<div class="w2ui-field">'+
		     				'<label>PARENT NAME</label>'+
		     				'<div>'+
		     				'<input name="parentlSet" type="text" style="width:138px;" />'+
		     				'</div>'+
		     				'</div>'+

//		     				'<div class="w2ui-field">'+
//		     				'<label>TYPE</label>'+
//		     				'<div>'+
//		     				'<input name="typeSet" type="text" style="width:138px;" />'+
//		     				'</div>'+
//		     				'</div>'+
		
		     				'<div class="w2ui-field">'+
		     				'<label>NAME</label>'+
		     				'<div>'+
		     				'<input name="nameSet" type="text" style="width:138px;" />'+
		     				'</div>'+
		     				'</div>'+
		
		     				'<div class="w2ui-field">'+
		     				'<label>ALARM ID</label>'+
		     				'<div>'+
		     				'<input name="alarmIdSet" type="number" min="1" style="width:138px;" />'+
		     				'</div>'+
		     				'</div>'+

		     				'<div class="w2ui-field">'+
		     				'<label>ALARM COLUMN</label>'+
		     				'<div>'+
		     				'<input name="columnSet" type="number" min="1" style="width:138px;" />'+
		     				'</div>'+
		     				'</div>'+
		     			'</div>'+
	 				'</div>'+
	 				'<div id="slaMgrMgrUPdatePopupBottom" style="margin-top: 35px;">'+
	 				'<button id="slaMgrEditPopupOkBtn" class="darkButton">' + BundleResource.getString('button.sla.save') + '</button>'+
	 				'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.sla.close') + '</button>'+
	 				'</div>'+
	 				'</div>';
					    	        	    	        	
     	        	w2popup.open({
     	    			title : title,
     	    	        body: body,
     	    	        width : 360,
     	    	        height : 350,
     	    	        opacity   : '0.5',
     	        		modal     : true,
     	    		     	showClose : true,
     	    		     	style	  : "overflow:hidden;",
     	    	        onOpen    : function(event){
     	    	        	event.onComplete = function () {
     	    	        		$("#slaMgrPopupBottom").html();
     	    	        		w2ui["slaMgr_Editpopup_properties"].render();
     	    	        	}
     	    	        },
     	    	        
     	    	        onClose   : function(event){
     	    	        	w2ui['slaMgr_Editpopup_properties'].destroy();
     	    	        }
     	    	        
     	    	    });
     	    		     				     	   
     	        	var parentNum = data.w2ui.parent_recid;
     	        	var ParentName = w2ui["slaManager_table"].get(parentNum).category_name;
     	        	var type = "";
     	        	if(data.recid > 10000){
     	        		type = "PARAM";
     	        	}else if(data.recid > 1000){
     	        		type = "TYPE"
     	        	}else{
     	        		type = "CATEGORY"
     	        	}
     	        	if(data.stat_id != undefined){     	        		
     	        		var statId = data.stat_id;
     	        		var statColumn = data.stat_column.slice(1);
     	        		fields = [
         					{name:'parentlSet', type: 'text', disabled:true, html:{caption:'PARENT NAME'}},
//         					{name:'typeSet', type: 'text', disabled:true, html:{caption:'TYPE'}},
         					{name:'nameSet', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
         					{name:'alarmIdSet', type: 'number', min:0, disabled:false, html:{caption:'ALARM ID'}},
         					{name:'columnSet', type: 'int', min:1, max:100, disabled:false, html:{caption:'ALARM COLUMN'}},
         				];
     	        	}else{
     	        		fields = [
         					{name:'parentlSet', type: 'text', disabled:true, html:{caption:'PARENT NAME'}},
//         					{name:'typeSet', type: 'text', disabled:true, html:{caption:'TYPE'}},
         					{name:'nameSet', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
         					{name:'alarmIdSet', type: 'number', min:0, disabled:true, html:{caption:'ALARM ID'}},
         					{name:'columnSet', type: 'int', min:1, max:100, disabled:true, html:{caption:'ALARM COLUMN'}},
         				];
     	        	}
     	        	
     	    		$("#slaMgrEditPopupContents").w2form({
     	    			name : 'slaMgr_Editpopup_properties',
     	    			style:"border:1px solid rgba(0,0,0,0);",
     	    			fields : fields,
     	    			onRender : function(event){},
     	    			record: {
     						parentlSet:ParentName,
//     						typeSet:type,
     						nameSet:data.category_name,
     						alarmIdSet:statId,
     						columnSet:statColumn,
     				}	
     	    		});
     	        	
				}
        	} else {
        		var bodyContents = BundleResource.getString("label.sla.notSelect_editItem");
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
				'<div class="assetMgr-popup-btnGroup">'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.sla.confirm') + '</button>'+
				'</div>'+
				'</div>' ;
            	w2popup.open({
            		width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.sla.info'),
    		        body: body,
                    opacity   : '0.5',
             		modal     : true,
        		    showClose : true
    		    });
        		return;
			}        	
        },
        
        modifyPopupOkAction : function() {
        	var _this = that;
        	var edit_model = new Model();
        	var parent = $("#parentlSet").val();
        	var type = $("#typeSet").val();
        	var name = $("#nameSet").val();
        	var alarmId = $("#alarmIdSet").val().toString();
        	var column = "p"+$("#columnSet").val().toString();
        	var urlRoot = "";
        	var idx = 0;	
        	var startRow = 1;
        	var endRow = 23;	
        	
        	var arr = w2ui["slaMgr_Editpopup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		urlRoot = "settings/sla";
            	idx = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection())[0].recid;
            	window.w2utils.settings.dataType = "RESTFULLJSON";
            	
            	if(idx == undefined) {
            		edit_model.url = urlRoot;
            	} else {
            		edit_model.recid = idx;
            		edit_model.url = urlRoot + '/edit/' + idx; 
            	}	
            	edit_model.set("idx", idx);
    			edit_model.set({ "name":name, "stat_id":alarmId, "stat_column":column});
    			
    			edit_model.save(null, {
    	              success: function(model, response) {
    	            	  var that = _this;
    	                  w2ui['slaManager_table'].selectNone();
    	                  checkExpand = true;
    	                  that.allSlaInfo();
    	                  w2popup.close();
    	              },
    	              error: function(model, response) {
    	            	  w2ui['slaManager_table'].selectNone();
    	              }
    	          });
    			checkExpand = false;
        	}	
        },

        //Delete => alarm_on_off on Popup!
        deleteSla : function(){
        	that.checkBtnValidate();
        	if($("#slaDelBtn").prop("disabled")){
        		return;
        	}
        	
        	var markup = "";
        	var bodyContents = BundleResource.getString("label.user.delete_confirm");

        	var selectItem = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection());
        	// for if alarm_on_off
        	if(selectItem.length != 0){
        		
        	}
        	
			var body = '<div class="w2ui-centered">'+
			'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
			'<div class="assetMgr-popup-btnGroup">'+
			'<button id="slaMgrDelPopupOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.sla.confirm') + '</button>'+
			'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.sla.cancel') + '</button>'+
			'</div>'+
			'</div>' ;

        	w2popup.open({
        		width: 380,
 		        height: 180,
		        title : BundleResource.getString('title.sla.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        },
        
        deletePopupOkAction : function(){
        	console.log("delete sla Info !");
        	var model = new Model();
        	var selectItem = w2ui["slaManager_table"].get(w2ui["slaManager_table"].getSelection());
        	var selectItems = [];

        	for(var i = 0; i < selectItem.length; i++){
        		selectItems.push(selectItem[i].recid);
        	}
        	
        	model.set("id", selectItems);
        	model.url = model.url + '/multiDelete/' + selectItems;
        	
        	model.destroy({
        		success: function (model, respose, options) {
        			checkExpand = true;
        			that.allSlaInfo();
                	w2ui["slaManager_table"].selectNone();
    			}
    		});
        	checkExpand = false;
        },
        
        saveModifySla : function(){
        	var changeAC = w2ui["slaManager_table"].getChanges();
        	var changeACRecid = _.pluck(changeAC, "recid");
        	        	
        	var changedValue = {};
        	var changedResult = [];
        	
        	var resultObj = {};
        	
        	var cRecid = null;
        	var critical = 0;
        	var major = 0;
        	var minor = 0;

        	_.each(changeACRecid, function(val, idx){
        		cRecid = _.findIndex(w2ui['slaManager_table'].records, {recid : val});
        		changedValue.critical = w2ui['slaManager_table'].records[cRecid].critical;
        		changedValue.major =w2ui['slaManager_table'].records[cRecid].major;
        		changedValue.minor = w2ui['slaManager_table'].records[cRecid].minor;
        		changedValue.recid = val;
        		
        		resultObj = $.extend({}, changedValue, changeAC[idx]);
        		
        		changedResult.push(resultObj);
        	});
        	        	
        	w2confirm('Are you sure to save this SLA Info?', 'Save')
			.yes(function () {
				that.saveModifySlaAction(changedResult);
			})
			.no(function () {
				console.log('NO');
			});
        },
                
        saveModifySlaAction : function(changedResult){    
        	Backbone.ajax({
				dataType: 'json',
				contentType: 'application/json',
				url: 'settings/sla/thresholds',
				method: 'put',
				data: JSON.stringify(changedResult),
				success: function(val) {
					that.cancelModifySla();
				},
				error: function(val) {
				}
			});
        },
        
        cancelModifySla : function(){
        	$("#slaAddBtn").css("display", "");
        	$("#slaEditBtn").css("display", "");
        	$("#slaDelBtn").css("display", "");
			$("#sla_SaveBtn").css("display", "none");
			$("#sla_CancelBtn").css("display", "none");
			w2ui['slaManager_table'].selectNone();
			$("#slaAddBtn").prop('disabled', false);
			$("#slaAddBtn").addClass('link');
			that.allSlaInfo();
        },
        
        checkBrowser : function() {
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
        destroy : function() {
        	if(w2ui['slaManager_layout']){
				w2ui['slaManager_layout'].destroy();
			}
        	if(w2ui['slaManager_table']){
				w2ui['slaManager_table'].destroy();
			}
        	if(w2ui['slaMgr_Editpopup_properties']){
        		w2ui['slaMgr_Editpopup_properties'].destroy();
        	}
        	if(w2ui['slaMgr_Addpopup_properties']){
        		w2ui['slaMgr_Addpopup_properties'].destroy();
        	}
        	this.removeEventListener();
        	this.undelegateEvents();
        }
    })

    return Main;
});