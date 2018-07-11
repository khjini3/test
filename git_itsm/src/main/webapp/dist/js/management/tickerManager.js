define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/tickerManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/management/tickerManager"
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
		url : 'tickerManager',
		parse : function(result){
			return {data : result};
		}
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.requestParam = null;
			this.xFlug = true;
			this.$el.append(JSP);
			this.selectItem = null;
			this.init();
			this.getData();
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
			
//			window.ItamObserver.addObserver("tickerMgr", tickerMgr.listNotification);
		},
		
		events: {
        	'click #tickerMgrDelBtn' : 'deleteTicker',
        	'click #tickerMgrAddBtn' : 'addTicker',
        	'click #tickerMgrUpdateBtn' : 'updateTicker',
        	'click #searchTickerBtn' : 'searchTicker',
        	'click #tickerStatusBtn' : 'changeStatus',
        	'click #tickerApplyBtn' : 'applyTicker'
        },
		
		eventListenerRegister : function(){
			window.addEventListener("tickerMgr", function(e){
        		tickerMgr.getTickerList(e.detail.value);
        	});
			
			$(document).on("click", "#tickerMgrPopupOkBtn", this.checkProcess);
			$(document).on("click", "#tickerMgrPopupDeleteOkBtn", this.deleteTickerOK);
		},
		removeEventListener : function(){
			$(document).off("click", "#tickerMgrPopupOkBtn");
			$(document).off("click", "#tickerMgrPopupDeleteOkBtn");
		},
		
		init : function(){
			tickerMgr = this;
			
			var cnvtDay = util.getDate("Day");
			
			$("#tickerContentsDiv").w2layout({
				name : 'tickerMgr_layout',
				panels : [
//					{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
				]
			});
			
			var leftContents = '<div id="leftTop" style="height:35px">'+
        	'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Conditions</div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom">'+
	    				'<div class="w2ui-page page-0">'+
		    				'<div class="w2ui-field">'+
		            			'<label>TICKER TEXT</label>'+
		            			'<div>'+
		            				'<input name="tickerText" type="text" size="40"/>'+
		            			'</div>'+
		            		'</div>'+
		    				/*'<div class="w2ui-field">'+
		        				'<label>조회기간</label>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">From</label><input name="tickerSearchFromPeriod" type="tickerSearchFromPeriod" size="34" />'+
		    					'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">To</label><input name="tickerSearchToPeriod" type="tickerSearchToPeriod" size="34" />'+
		    					'</div>'+
		        			'</div>'+*/
		        			'<div style="padding-top:25px; text-align:right;"><button id="searchTickerBtn" class="darkButton" type="button" >조회</button></div>'+
		    			'</div>'+ // w2ui-page page-0
	    			'</div>'+ // leftBottom
	    		'</div>'+ // dashboard-contents
	    	'</div>'; // dashboard-panel
			
			var mainContents = '<div id="mainTop">'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Ticker List</div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubBottom"></div>'+
		    		/*'<div class="pager-table-area" id="tickerMgrPagerTable">'+
						'<div class="ticker-manager-pager" id="tickerMgrPager" data-paging="true"></div>'+
					'</div>'+*/
	    		'</div>'+
	    	'</div>';
			
//			$("#leftContents").html(leftContents);
			$("#mainContents").html(mainContents);
			
			$("#leftBottom").w2form({
				name : 'tickerMgr_options',
				focus : -1,
				fields : [
					{name : 'tickerText', type : 'text'},
					{name : 'tickerSearchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'tickerSearchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					tickerText : "",
					tickerSearchFromPeriod : cnvtDay,
					tickerSearchToPeriod : cnvtDay
				},
				onChange : function(event){
					var eventTarget = event.target;
				}
			});
			
//			$('input[type=tickerSearchFromPeriod').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=tickerSearchFromPeriod]')});
//			$('input[type=tickerSearchToPeriod').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=tickerSearchToPeriod]')});
			
			$("#mainSubBottom").w2grid({
				name : 'tickerMgr_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false,
					selectColumn: true
				},
				recordHeight : 35,
				columns : [
					{ field: 'sequence_id', caption: 'SEQ_NO', hidden : true},
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
					{ field: 'tickerText', caption: 'TICKER TEXT', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
//					{ field: 'createDate', caption: 'CREATE DATE', options : {format : 'yyyy-mm-dd'}, size: '100px', sortable: true, attr: 'align=center' },
					{ field: 'startDate', caption: 'START DATE', options : {format : 'yyyy-mm-dd'}, size: '100px', sortable: true, attr: 'align=center' },
					{ field: 'endDate', caption: 'END DATE', options : {format : 'yyyy-mm-dd'}, size: '100px', sortable: true, attr: 'align=center' },
					{ field: 'tickerPriority', caption: 'PRIORITY', size: '80px', sortable: true, attr: 'align=center' },
					{ field: 'tickerStatus', caption: 'STATUS', size: '80px', sortable: true, attr: 'align=center',
						render : function(record){
							if(record.tickerStatus == 0){
								return '<img src="dist/img/idc/ticker/ti_off.png" id="tickerStatusBtn" tickerId="'+record.recid+'">';
//								return '<div id="tickerStatusBtn" class="alarm-on-off alarm-off grid-buttons" style="margin-left: 35px; text-align:center;" tickerId="'+record.recid+'"></div>';  
							}else if(record.tickerStatus == 1){
								return '<img src="dist/img/idc/ticker/ti_on.png" id="tickerStatusBtn" tickerId="'+record.recid+'">';
//								return '<div id="tickerStatusBtn" class="alarm-on-off alarm-on grid-buttons" style="margin-left: 35px; text-align:center;" tickerId="'+record.recid+'"></div>';
							}
						}
					}
				]
			});
			
			w2ui['tickerMgr_table'].onDblClick = this.updateTicker;
			
			w2ui["tickerMgr_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["tickerMgr_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["tickerMgr_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["tickerMgr_table"].on('click', function (event) {
        		that.selectData = event.recid;
        	});
			
			var crudBtn = '<div id="tickerMgrBtnGroup">'+
					    		'<i id="tickerMgrAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					    		'<i id="tickerMgrDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del"></i>'+
					    		'<i id="tickerApplyBtn" class="icon link fas fa-check fa-2x" aria-hidden="true" title="Apply"></i>'+
					    	'</div>';
			
			$("#mainTop").html(crudBtn);
			
			$("#tickerMgrDelBtn").prop('disabled', true);
			$("#tickerMgrDelBtn").removeClass('link');
			
			this.eventListenerRegister();
		},
		
		validationCheck : function(){
			if(w2ui['tickerMgr_table'].getSelection().length > 0){
				$("#tickerMgrDelBtn").prop('disabled', false);
				$("#tickerMgrDelBtn").addClass('link');
			}else{
				$("#tickerMgrDelBtn").prop('disabled', true);
				$("#tickerMgrDelBtn").removeClass('link');
			}
		},
		
		getData : function(){
			this.listNotification("getTickerList"); // Ticker List Table Data
//			this.listNotification("getTickerScrollingList"); // Ticker Scrolling List Data
		},
		
		listNotification : function(cmd){
			switch(cmd.replace(/"/gi, "")){
			case "getTickerList" :
				tickerMgr.getTickerList(cmd);
				break;
			}
		},
		
		getTickerList : function(cmd){
			this.model = new Model();
			this.model.url = this.model.url+"/"+cmd;
			this.model.fetch();
			this.listenTo(this.model, "sync", this.setTickerList);
		},
		
		setTickerList : function(method, model, options){
			if(model.length > 0){
				w2ui['tickerMgr_table'].unlock();
				w2ui['tickerMgr_table'].records = model;
				w2ui['tickerMgr_table'].refresh();
			}else{
				w2ui["tickerMgr_table"].lock();
			}
		},
		
		addTicker : function(event){
			var cnvtDay = util.getDate("Day");
			var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	
        	popupHeight = 335;
        	
			fields = [
				 {name:'tickerText', type:'text', required:true, html:{caption:'TICKER TEXT'}},
				 {name:'startDate', type:'date', options : {format : 'yyyy-mm-dd'}, html:{caption:'TICKER PERIOD'}},
				 {name:'endDate', type:'date', options : {format : 'yyyy-mm-dd'}, html:{caption:'TICKER PERIOD'}},
//				 {name:'tickerPriority', type:'int', html:{caption:'PRIORITY'}}
//				 {name:'tickerStatus', type:'radio', html:{caption:'DISPLAY'}}
			];
			
			record = {
					tickerText : '',
					createDate : cnvtDay,
					startDate : cnvtDay,
					endDate : cnvtDay,
					tickerPriority : 1,
					tickerStatus : 1
			}
			
			body = '<div class="w2ui-centered">'+
						'<div id="tickerMgrPopupContents" style="width:100%; height:100%" >'+
						
							' <div class="w2ui-page page-0">'+
						       
						       '<div class="w2ui-field w2ui-span4">'+
							       '<label style="width: 115px;">TICKER TEXT</label>'+
							       '<div>'+
							       '<textarea name="tickerText" type="text" style="width: 291px; height: 100px; resize: none"></textarea>'+
							       '</div>'+
						       '</div>'+
						       
						       '<div class="w2ui-field w2ui-span4" style="color:#fff;">'+
							       '<label style="width: 115px;">TICKER PERIOD</label>'+
							       '<div><input name="startDate" type="startDate" style="width:138px;" /> ~ <input name="endDate" type="endDate" style="width:138px;" /></div>'+
						       '</div>'+
						       
						       '<div id="tickerPriority" class="w2ui-field w2ui-span4">'+
					                '<label style="width: 115px;">PRIORITY</label>'+
					                '<div><input name="tickerPriority" id="priority" value="1"> </div>'+
					            '</div>'+
					            
					            '<div id="showHideStatus" class="w2ui-field w2ui-span4">'+
					                '<label style="width: 115px;">STATUS</label>'+
						            '<div class="w2ui-field w2ui-span4">'+
				    					'<label><input type="radio" name="tickerStatus" value="1" id="showTicker" checked="checked" /><label>SHOW</label></label>'+
				    					'<label><input type="radio" name="tickerStatus" value="0" id="hideTicker" /><label>HIDE</label></label>'+
				    				'</div>'+
					            '</div>'+
					            
						    '</div>'+ //w2ui-page page-0
						
						'</div>'+ //tickerMgrPopupContents
						
			
						/*'<div id="tickerMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+*/
						'<div id="tickerMgrPopupBottom">'+
							'<button id="tickerMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.tickerManager.save') + '</button>'+
							'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.close') + '</button>'+
						'</div>'+
						
					'</div>'; //w2ui-centered
			
			w2popup.open({
				title : BundleResource.getString('title.tickerManager.addTicker'),
		        body: body,
		        width : 535,
		        height : popupHeight,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["tickerMgr_popup_properties"].render();
		        		$("#priority").w2field('int', {min:1});
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['tickerMgr_popup_properties'].destroy();
		        }
		        
		    });
    		
    		$("#tickerMgrPopupContents").w2form({
    			name : 'tickerMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			
    			fields : fields,
    		
    			record: record
				
    		});
    		$("#priority").w2field('int', {min:1});
    		$('input[type=startDate]').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=startDate]')});
    		$('input[type=endDate]').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=endDate]')});
		},
		
		updateTicker : function(event){
			var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	var selectItem = w2ui["tickerMgr_table"].get(event.recid);
        	
        	popupHeight = 335;
        	
			fields = [
				 {name:'tickerText', type:'text', required:true, html:{caption:'TICKER TEXT'}},
				 {name:'startDate', type:'date', options : {format : 'yyyy-mm-dd'}, html:{caption:'TICKER PERIOD'}},
				 {name:'endDate', type:'date', options : {format : 'yyyy-mm-dd'}, html:{caption:'TICKER PERIOD'}}
//				 {name:'tickerStatus', type:'radio', html:{caption:'DISPLAY'}}
			];
			
			record = {
					sequenceId : selectItem.sequenceId,
					tickerText : selectItem.tickerText,
					createDate : selectItem.createDate,
					startDate : selectItem.startDate,
					endDate : selectItem.endDate,
					tickerPriority : selectItem.tickerPriority,
					tickerStatus : selectItem.tickerStatus
			}
			
			body = '<div class="w2ui-centered">'+
						'<div id="tickerMgrPopupContents" style="width:100%; height:100%" >'+
						
							' <div class="w2ui-page page-0">'+
						       
						       '<div class="w2ui-field w2ui-span4">'+
							       '<label style="width: 115px;">TICKER TEXT</label>'+
							       '<div>'+
							       '<textarea name="tickerText" type="text" style="width: 291px; height: 100px; resize: none"></textarea>'+
							       '</div>'+
						       '</div>'+
						       
						       '<div class="w2ui-field w2ui-span4" style="color:#fff;">'+
							       '<label style="width: 115px;">TICKER PERIOD</label>'+
							       '<div><input name="startDate" type="startDate" style="width:138px;" /> ~ <input name="endDate" type="endDate" style="width:138px;" /></div>'+
						       '</div>'+
						       
						       '<div id="tickerPriority" class="w2ui-field w2ui-span4">'+
					                '<label style="width: 115px;">PRIORITY</label>'+
					                '<div><input name="tickerPriority" id="priority"> </div>'+
					            '</div>'+
						       
						       '<div id="showHideStatus" class="w2ui-field w2ui-span4">'+
					                '<label style="width: 115px;">STATUS</label>'+
						            '<div class="w2ui-field w2ui-span4">'+
				    					'<label><input type="radio" name="tickerStatus" value="1" id="showTicker" /><label>SHOW</label></label>'+
				    					'<label><input type="radio" name="tickerStatus" value="0" id="hideTicker"  /><label>HIDE</label></label>'+
				    				'</div>'+
					            '</div>'+
					            
						    '</div>'+ //w2ui-page page-0
						
						'</div>'+ //tickerMgrPopupContents
						
			
						/*'<div id="tickerMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+*/
						'<div id="tickerMgrPopupBottom">'+
							'<button id="tickerMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.tickerManager.save') + '</button>'+
							'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.close') + '</button>'+
						'</div>'+
						
					'</div>'; //w2ui-centered
			
			w2popup.open({
				title : BundleResource.getString('title.tickerManager.editTicker'),
		        body: body,
		        width : 535,
		        height : popupHeight,
		        type : 'update',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["tickerMgr_popup_properties"].render();
		        		
		        		$("#priority").val(selectItem.tickerPriority);
		        		$("#priority").w2field('int', {min:1});
		        		
		        		
		        		switch(selectItem.tickerStatus){
		        			case 0 : // Status HIDE
		        				$("#hideTicker").prop('checked', true);
			    				$("#showTicker").prop('checked', false);
			    				break;
		        			case 1 : // Status SHOW
		        				$("#hideTicker").prop('checked', false);
			    				$("#showTicker").prop('checked', true);
			    				break;
			    			default : // Status SHOW
			    				$("#hideTicker").prop('checked', false);
		    					$("#showTicker").prop('checked', true);
		    					break;
		        		}
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['tickerMgr_popup_properties'].destroy();
		        }
		        
		    });
    		
    		$("#tickerMgrPopupContents").w2form({
    			name : 'tickerMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			
    			fields : fields,
    		
    			record: record
				
    		});
    		
    		$("#priority").w2field('int', {min:1});
    		$('input[type=startDate').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=startDate]')});
    		$('input[type=endDate').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=endDate]')});
		},
		
		deleteTicker : function(event){
			tickerMgr.validationCheck();
			
			if($("#tickerMgrDelBtn").prop('disabled')){
				return;
			}
			
			var data = w2ui["tickerMgr_table"].get(w2ui["tickerMgr_table"].getSelection());
			var bodyContents = "";
			var body = "";
        	if(data.length > 0){
        		//bodyContents = "선택된 "+ data.length+"개의 항목을 삭제 하시겠습니까?";
        		bodyContents = BundleResource.getString('label.tickerManager.selected') + data.length + BundleResource.getString('label.tickerManager.selectedItemDelete');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="tickerMgr-popup-btnGroup">'+
						'<button id="tickerMgrPopupDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
        	}else{
        		//bodyContents = "선택된 항목이 없습니다.";
        		bodyContents = BundleResource.getString('label.tickerManager.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="tickerMgr-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.tickerManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		deleteTickerOK : function(event){
			var data = w2ui["tickerMgr_table"].get(w2ui["tickerMgr_table"].getSelection());
			
			var model = new Model(data);
			model.url = model.url+"/delete"+"/deleteItem";
			
			model.save({}, {
				success:function(model, response, options){
					tickerMgr.crudSuccess(model, response, options);
					tickerMgr.refreshProcess();
					window.ItamObserver.sendMessage("getTickerScrollingMessage");
				},
				error:function(model, xhr, options){
					tickerMgr.crudError(model, xhr, options);
				}
			});
		},
		
		checkProcess : function(event){
			var item = w2popup.get();
			
			tickerMgr.tickerItemCheck(event, item.type);
		},
		
		tickerItemCheck : function(event, type){ //type:crud
			var popupData = w2popup.get();
			var arr = w2ui['tickerMgr_popup_properties'].validate();
			var tickerStatus = $('input:radio[name=tickerStatus]:checked').val();
			var tickerPriority = $('input[name=tickerPriority]').val();
			var cnvtDay = util.getDate("Day");
			var bodyContents = "";
			var body = "";
			
			if(arr.length > 0){
				return;
			}else if(eval($("#endDate").val().replace("-","").replace("-","") - $("#startDate").val().replace("-","").replace("-","")) < 0 || $("#endDate").val() < cnvtDay){
				bodyContents = BundleResource.getString('label.tickerManager.endDateConfirm'); // "END DATE CONFIRM";
				
				body = '<div class="w2ui-centered">'+
							'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
							'<div class="assetMgr-popup-btnGroup">'+
								'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.tickerManager.confirm') + '</button>'+
							'</div>'+
						'</div>' ;
				
				w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : body
        		});
				
				$(".w2ui-message").css({top:"74px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
				
			}else{
				var data = w2ui['tickerMgr_table'].records;
				var item = w2ui['tickerMgr_popup_properties'].record;
				
				item.tickerText = item.tickerText;
				item.createDate = cnvtDay;
				if(item.startDate == "" || null){ item.startDate = cnvtDay; } else{ $.trim(item.startDate); }
				if(item.endDate == "" || null){ item.endDate = cnvtDay; } else{ $.trim(item.endDate); }
				item.tickerStatus = $.trim(tickerStatus);
				item.tickerPriority = $.trim(tickerPriority);
				
				var resultAC = null;
				
				//중복체크
				if(popupData.type === "create"){ 
					
				}else if(popupData.type === "update"){
					
				}
				
				var model = new Model(item);
				model.url = model.url+"/"+type+"/"+"/"+item.sequenceId;
				model.save({}, {
					success : function(model, response, options){
						w2popup.close();
						tickerMgr.crudSuccess(model, response, options);
						switch(response.type){
							case "create" : 
								tickerMgr.listNotification("getTickerList");
//								window.ItamObserver.sendMessage("getTickerScrollingMessage");
								break;
							case "update" :
								tickerMgr.refreshProcess();
//								window.ItamObserver.sendMessage("getTickerScrollingMessage");
								break;
						}
					},
					error : function(model, xhr, options){
						tickerMgr.crudError(model, xhr, options);
					}
				});
				
			}
		},
		
		crudError : function(model, xhr, options){
        	console.log("crudError");
        },
		
		crudSuccess : function(model, response, options){
			var body = "";
			var bodyContents = "";
			
			if(response.type === "create"){
				if(response.status === 100){
					w2ui['tickerMgr_table'].selectNone();
					
				}else if(response.status === -100){ // 중복오류
					
				}else{ // 삽입오류
					w2popup.message({ 
            	        width   : 360, 
            	        height  : 220,
            	        html    : '<div style="padding:60px 10px 60px 10px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.tickerManager.errorData') + 
            	        		  '</br>' + BundleResource.getString('label.tickerManager.contactAdministrator') + '</div>' +
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.tickerManager.confirm') + '</button>'
            	    });
				}
			}else if(response.type === "delete"){
				if(response.status === 200){
					w2ui['tickerMgr_table'].selectNone();
					var deleteList = response.deleteList;
					//bodyContents = deleteList.length + "개의 항목이 삭제 되었습니다.";
					bodyContents = deleteList.length + BundleResource.getString('label.tickerManager.itemDelete');
					
				}else{
					//오류
        			//bodyContents = "일시적인 현상으로 오류가 발생 했습니다.";
        			bodyContents = BundleResource.getString('label.tickerManager.errorContents');
				}
				
				body = '<div class="w2ui-centered">'+
				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
				'<div class="tickerMgr-popup-btnGroup">'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.confirm') + '</button>'+
				'</div>'+
			'</div>' ;


				w2popup.open({
		            		width: 385,
		     		        height: 180,
		    		        title : BundleResource.getString('title.tickerManager.info'),
		    		        body: body,
		                    opacity   : '0.5',
		             		modal     : true,
		        		    showClose : true
		    		    });
				
			}else if(response.type === "update"){
				if(response.status === 300){
					w2ui['tickerMgr_table'].selectNone();
				}else{
					
				}
			}
		},
		
		refreshProcess : function(){
			var model = new Model();
			model.url = model.url+"/getTickerList";
			model.fetch();
			that.listenTo(model, "sync", that.refreshView);
		},
		
		refreshView : function(method, model, options){
			w2ui['tickerMgr_table'].records = model;
			w2ui['tickerMgr_table'].refresh();
		},
		
		searchTicker : function(){
			var item = w2ui['tickerMgr_options'].record;
			var tickerText = $("#tickerText").val();
			
			if(tickerText == "" ){
				w2popup.open({
            		width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.tickerManager.info'),
    		        body: '<div class="w2ui-centered">Please Input Data.</div>',
                    opacity   : '0.5',
             		modal     : true,
        		    showClose : true
    		    });
			}else{
				var requestParam = {
					tickerText : item.tickerText
				}
				
				var model = new Model(requestParam);
				model.url = model.url + "/searchTickerList";
				model.set({"tickerText" : requestParam.tickerText});
				model.save();
				this.listenTo(model, "sync", this.searchView);
			}
		},
		
		searchView : function(method, model, options){
			w2ui['tickerMgr_table'].records = model.result;
			w2ui['tickerMgr_table'].refresh();
		},
		
		changeStatus : function(event){
			var data = w2ui["tickerMgr_table"].get(w2ui["tickerMgr_table"].getSelection());
			var type = "update";
			var item = null;
			
			if(data.length == 0){
				if(that.selectData.tickerStatus == 0){
					that.selectData.tickerStatus = 1;
				}else{
					that.selectData.tickerStatus = 0;
				}
				item = that.selectData[0];
			}else{
				if(data[0].tickerStatus == 0){
					data[0].tickerStatus = 1;
				}else{
					data[0].tickerStatus = 0;
				}
				item = data[0];
			}
			
			item.tickerText = item.tickerText;
			item.createDate = item.createDate;
			item.startDate = item.startDate;
			item.endDate = item.endDate;
			item.tickerStatus = item.tickerStatus;
			item.tickerPriority = item.tickerPriority;
			
			var model = new Model(item);
			model.url = model.url+"/"+type+"/"+item.sequenceId;
			model.save({}, {
				success : function(model, response, options){
					tickerMgr.crudSuccess(model, response, options);
					tickerMgr.refreshProcess();
//					window.ItamObserver.sendMessage("getTickerScrollingMessage");
				},
				error : function(model, xhr, options){
					tickerMgr.crudError(model, xhr, options);
				}
			});
		},
		
		applyTicker : function(){
			var bodyContents = "";
			var body = "";
			
    		//bodyContents = "Ticker Apply Success.";
    		bodyContents = BundleResource.getString('label.tickerManager.applySuccess'); //"Ticker Apply Success.";
    		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
				'<div class="tickerMgr-popup-btnGroup">'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.tickerManager.confirm') + '</button>'+
				'</div>'+
			'</div>' ;
        	
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.tickerManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        	window.ItamObserver.sendMessage("getTickerScrollingMessage");
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
			if(w2ui['tickerMgr_layout']){
				w2ui['tickerMgr_layout'].destroy();
			}
			if(w2ui['tickerMgr_options']){
				w2ui['tickerMgr_options'].destroy();
			}
			if(w2ui['tickerMgr_table']){
				w2ui['tickerMgr_table'].destroy();
			}
			if(w2ui['tickerMgr_popup_properties']){
				w2ui['tickerMgr_popup_properties'].destroy();
			}
			
			tickerMgr = null;
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
//			window.ItamObserver.destroy("tickerMgr");
		}
		
	});
	return Main;
});