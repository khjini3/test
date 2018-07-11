define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/fm/eventHistory",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/fm/eventHistory"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	var eventHist;
	var that;
	var Model = Backbone.Model.extend({
        model: Model,
        url: 'settings/eventhistory',
        parse: function(result) {
            return {data: result};
        }
    });	
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.requestParam = null;
			this.elements = {
    		};
			this.init();
			this.start();
			
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
		
		init : function(){
			eventHist = this;
			
			var today = util.getDate("Day") + " 00:00:00";
    		var time = util.getDate("Day") + " 23:59:59";
    		
			var eventType = [
	     		   {"text" : "All", "id" : "0"},
	     		   {"text" : "Alarm", "id" : "1"},
				   {"text" : "Status", "id" : "2"},
				   {"text" : "Fault", "id" : "3"}];
			
			var severityList = [
	     		   {"text" : "All", "id" : "0"},
	     		   {"text" : "Critical", "id" : "1"},
				   {"text" : "Major", "id" : "2"},
				   {"text" : "Minor", "id" : "3"},
				   {"text" : "Warning", "id" : "4"},
				   {"text" : "Indeterminate", "id" : "5"}];  
			
			$("#contentsDiv").w2layout({
				name : 'eventHistory_layout',
				panels : [
					{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
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
		            			'<label>EVENT TYPE</label>'+
		            			'<div>'+
		            				'<input name="eventType" type="list" size="40" style="width:258px;"/>'+
		            			'</div>'+
		            		'</div>'+
		            		'<div id="gradeArea" class="w2ui-field">'+
		            			'<label>GRADE</label>'+
		            			'<div>'+
		            				'<input name="severity" type="list" size="40" style="width:258px;"/>'+
		            			'</div>'+
		            		'</div>'+
		        			'<div class="w2ui-field">'+
		        				'<label>FROM</label>'+
		        				'<div>'+
		        					'<input name="eventHistoryFromPeriod" type="historySearchFromPeriod" size="40" style="width:258px;"/>'+
		    					'</div>'+
		        			'</div>'+
		        			'<div class="w2ui-field">'+
		        				'<label>TO</label>'+
		        				'<div>'+
		        					'<input name="eventHistoryToPeriod" type="historySearchToPeriod" size="40" style="width:258px;"/>'+
		    					'</div>'+
		        			'</div>'+
		        			'<div style="padding-top:25px; text-align:right;"><button id="eventHistorySearchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.eventhistory.search') + '</button></div>'+
		    			'</div>'+
	    			'</div>'+
	    		'</div>'+
	    	'</div>';
			
			var mainContents = '<div id="mainTop">'+
				'<div id="eventHistBtnGroup">'+
					'<i id="eventhistoryAckBtn" class="icon fab fa-yes-ack fa-2x" aria-hidden="true" disabled="disabled" title="Ack"></i>'+
					'<i id="eventhistoryUnackBtn" class="icon fab fa-yes-unack fa-2x" aria-hidden="true" disabled="disabled" title="Unack"></i>'+
				'</div>'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">History Result</div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubBottom"></div>'+
		    		'<div class="pager-table-area" id="eventHistPagerTable">'+
						'<div class="event-history-pager" id="eventHistPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#mainContents").html(mainContents);
			
			$("#leftBottom").w2form({
				name : 'eventHistory_options',
				focus : -1,
				fields : [
					{name : 'eventType', type : 'list', options : {items : eventType}},
					{name : 'severity', type : 'list', options : {items : severityList}},
					{name : 'eventHistoryFromPeriod', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}},
					{name : 'eventHistoryToPeriod', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}}
				],
				record : {
					eventType : eventType[0],
					severity : severityList[0],
					eventHistoryFromPeriod : today,
					eventHistoryToPeriod : time
				},
				onChange : function(event){
					var target = event.target;
					var selectedType = event.value_new.text;
					if("eventType" == target){
						if("Alarm" == selectedType){
							$("#gradeArea").css("display","block");
						}else{
							$("#gradeArea").css("display","none");
							$("#severity").w2field().set({"text" : "All", "id" : "0"});
						}
					}
					target = null;
					selectedType = null;
				}
			});
			
			$("#mainSubBottom").w2grid({
				name : 'eventHistory_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false,
					selectColumn: true,
					expandColumn: true
				},
				recordHeight : 30,
				multiSelect : true,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
					{ field: 'event_type', caption: 'EVENT TYPE', size : '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;',
							render : function(record){
								switch(record.event_type){
									case 1:
										return "ALARM";
										break;
									case 2:
										return "STATUS";
										break;
									case 3:
										return "FAULT";
										break;
									default : 
										return "";
										break;
								}
							}},
					{ field: 'severity', caption: 'GRADE', size : '80px', sortable: true, attr: 'align=center',
							render : function(record){
								var imgName = "";
								switch(record.severity){
									case 1:
										imgName = "Critical";
										break;
									case 2:
										imgName = "Major";
										break;
									case 3:
										imgName = "Minor";
										break;
									case 4:
										imgName = "Warning";
										break;
									case 5:
										imgName = "Indeterminate";
										break;
									case 11:
										imgName = "Critical_Clear";
										break;
									case 12:
										imgName = "Major_Clear";
										break;
									case 13:
										imgName = "Minor_Clear";
										break;
									case 14:
										imgName = "Warning_Clear";
										break;
									case 15:
										imgName = "Indeterminate_Clear";
										break;
									default :
										return "";
										break;
								}
								return util.getDivIcon(imgName);
							}},
					{ field: 'alarm_id', caption: 'CODE', size : '80px', sortable: true, attr: 'align=center'},
         			{ field: 'location_alias', caption: 'LOCATION', size : '350px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'probcause_str', caption: 'PROBABLE CAUSE', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'alarm_time', caption: 'ALARM TIME', size : '150px', sortable: true, attr: 'align=center' },
         			{ field: 'clear_time', caption: 'CLEAR TIME', size : '150px', sortable: true, attr: 'align=center'},
         			{ field: 'clear_type', caption: 'CLEAR TYPE', size : '80px', sortable: true, attr: 'align=center',
         					render : function(record){
         						switch(record.clear_type){
         							case 2:
         								return "Auto";
         								break;
         							case 3:
         								return "Manual";
         								break;
         							case 4:
         								return "Audit";
         								break;
         							default : 
         								return "";
         								break;
         						}
         					}},
         			/*{ field: 'ack_type', caption: 'ACK TYPE', size : '80px', sortable: true, attr: 'align=center',
         					render : function(record){
         						switch(record.ack_type){
         							case 1:
         								return "Unack";
         								break;
         							case 2:
         								return "Ack";
         								break;
         							default : 
         								return "";
         								break;
         						}
         					}},
         			{ field: 'ack_user', caption: 'ACK USER', size : '100px', sortable: true, attr: 'align=center'}*/
				],
				onExpand : function(event){
					var selectedItem = event.recid-1;
					var currentPage = pagination.getCurrentPage();
					var endRow = 25;
					var startRow = (currentPage*endRow) - endRow;
					if(currentPage > 1){
						selectedItem = selectedItem-startRow;
					}
					var ackType = w2ui['eventHistory_table'].records[selectedItem].ack_type;
					if(ackType == 2){
						ackType = "Ack"
					}else{
						ackType = "Unack"
					}
					var ackUser = w2ui['eventHistory_table'].records[selectedItem].ack_user;
					$("#"+event.box_id).html('<div style="padding: 10px; height: 50px;">ACK TYPE  :  "'+ackType+'", ACK USER  :  "'+ackUser+'"</div>');
				}
			});
			
			w2ui["eventHistory_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
			
			w2ui["eventHistory_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
			
			w2ui["eventHistory_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
			
			$("#gradeArea").css("display","none");
			this.eventListenerRegister();
		},
		
		start : function(){
			this.searchAction();
		},
		
		events : {
			'click #eventHistorySearchBtn' : 'searchAction'
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#eventhistoryAckBtn", function(){
				that.changeAckTypeConfirm("ackActionOkBtn");
			});
			
			$(document).on("click", "#eventhistoryUnackBtn", function(){
				that.changeAckTypeConfirm("unAckActionOkBtn");
			});
			$(document).on("click", "#ackActionOkBtn", this.ackAction);
			$(document).on("click", "#unAckActionOkBtn", this.unAckAction);
		},
		
		changeAckTypeConfirm : function(action){
			var body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">' + BundleResource.getString('label.eventhistory.ackTypeEdit') + '</div>'+ //Ack Type을 변경 하시겠습니까?
				'<div class="popup-btnGroup">'+
					'<button id='+action+' onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.eventhistory.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.eventhistory.cancel') + '</button>'+
				'</div>'+
			'</div>' ;
			w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.eventhistory.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},

		ackAction : function(){
			that.validationCheck();
			if($("#eventhistoryAckBtn").prop('disabled')){
				return;
			}
			var ack_user = sessionStorage.getItem("LOGIN_ID");
			that.changeAckType(2, ack_user);
		},
		
		unAckAction : function(){
			that.validationCheck();
			if($("#eventhistoryUnackBtn").prop('disabled')){
				return;
			}
			var ack_user = "";
			that.changeAckType(1, ack_user);
		},
		
		changeAckType : function(ackType, ack_user){
			var selectedItems = w2ui["eventHistory_table"].get(w2ui['eventHistory_table'].getSelection());
			var selectedSeqNo = _.pluck(selectedItems, "seq_no");
			
			var model = new Model();
			model.set({
				seq_no : selectedSeqNo,
				ack_type : ackType,
				ack_user : ack_user
			});
			model.url += "/changeAckType";
			model.save(null, {
				success : function(model, response){
	            	var pagination = $('#eventHistPager').data('twbsPagination');
	            	var currentPage = pagination.getCurrentPage();
	            	var requestParam = that.requestParam;
	            	
	            	var endRow = 25;
	            	var startRow = (currentPage*endRow) - endRow;
	            	
	            	var model = new Model();
	            	model.set({ 
	    				"event_type": requestParam.event_type,
	    				"severity" : requestParam.severity,
	    				"ack_time" : requestParam.ack_time, 
	    				"clear_time" : requestParam.clear_time,
	    				"startRow" : startRow, 
	    				"endRow" : endRow
	    			});
	            	
	            	model.url += "/limitList";
	            	model.save();
	            	that.listenTo(model, "sync", that.refreshView);
				},
				error : function(model, response){
					console.log(response);
				}
			});
			
			selectedItems = null;
			selectedSeqNo = null;
		},
		
		searchAction : function(){
			var model = new Model();
			var startRow = 0;
    		var endRow = 25; 
			var options = w2ui['eventHistory_options'].record;
			var sTime = options.eventHistoryFromPeriod;
			var eTime = options.eventHistoryToPeriod;
			var eventType = options.eventType.id;
			var severity = options.severity.id;
			
			model.set({ 
				"event_type": eventType,
				"severity" : severity,
				"ack_time" : sTime, 
				"clear_time" : eTime,
				"startRow" : startRow, 
				"endRow" : endRow 
			});
			this.requestParam = model.attributes;
			model.url += "/limitList";
			model.save(null, {
				success : function(model, response){
					var resultData = model.changed.data.data.data;
					var dataCnt = resultData.length;
					var totalCount = model.changed.data.noOffsetRecord;
					
					if(dataCnt == 0){
						w2ui['eventHistory_table'].clear();
					}else{
						if($('#eventHistPager').data("twbs-pagination")){
							$('#eventHistPager').pager("destroy").off("click");
							var pageGroup = '<div class="event-history-pager" id="eventHistPager" data-paging="true"></div></div>';
							$("#eventHistPagerTable").html(pageGroup);
			            }
						
						$('#eventHistPager').pager({
			            	"totalCount" : totalCount,
			            	"pagePerRow" : 25
			            }).on("click", function (event, page) {
			            	var evtClass = $(event.target).attr('class');
			            	if(evtClass != 'page-link') return;
			            	
			            	var pagination = $('#eventHistPager').data('twbsPagination');
			            	var currentPage = pagination.getCurrentPage();
			            	var requestParam = that.requestParam;
			            	
			            	var endRow = 25;
			            	var startRow = (currentPage*endRow) - endRow;
			            	
			            	var model = new Model();
			            	model.set({ 
			    				"event_type": requestParam.event_type,
			    				"severity" : requestParam.severity,
			    				"ack_time" : requestParam.ack_time, 
			    				"clear_time" : requestParam.clear_time,
			    				"startRow" : startRow, 
			    				"endRow" : endRow
			    			});
			            	
			            	model.url += "/limitList";
			            	model.save();
			            	that.listenTo(model, "sync", that.refreshView);
			            });
						
						var pagination = $('#eventHistPager').data('twbsPagination');
						var currentPage = pagination.getCurrentPage();
						
						$('#eventHistPager').pager('pagerTableCSS', ".event-history-pager .pagination", totalCount, currentPage);
						
						w2ui['eventHistory_table'].clear();
						w2ui['eventHistory_table'].records = resultData;
						w2ui['eventHistory_table'].refresh();
						that.validationCheck();
					}
				},
				error : function(model, response){
					
				}
			});
		},
		
		validationCheck : function(){
			var selectedItems = w2ui["eventHistory_table"].get(w2ui['eventHistory_table'].getSelection());
			var typeCheckFlag = false;
			
			if(selectedItems.length > 0){
				for(var i = 0; i < selectedItems.length; i++){
					if(selectedItems[i].event_type != 1){ // Not Alarm
						typeCheckFlag = true;
						break;
					}
				}
				if(typeCheckFlag){ // include Status type
					$("#eventhistoryAckBtn").prop('disabled', true);
					$("#eventhistoryAckBtn").removeClass('link');
					$("#eventhistoryUnackBtn").prop('disabled', true);
					$("#eventhistoryUnackBtn").removeClass('link');
				}else{ // selected only Alarms.
					$("#eventhistoryAckBtn").prop('disabled', false);
					$("#eventhistoryAckBtn").addClass('link');
					$("#eventhistoryUnackBtn").prop('disabled', false);
					$("#eventhistoryUnackBtn").addClass('link');
				}
			}else{
				$("#eventhistoryAckBtn").prop('disabled', true);
				$("#eventhistoryAckBtn").removeClass('link');
				$("#eventhistoryUnackBtn").prop('disabled', true);
				$("#eventhistoryUnackBtn").removeClass('link');
			}
		},
		
		refreshView : function(method, model, options){
			w2ui['eventHistory_table'].clear();
			w2ui['eventHistory_table'].records = model.data.data;
			w2ui['eventHistory_table'].refresh();
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
		
		removeEventListener : function(){
			$(document).off("click", "#eventhistoryAckBtn");
			$(document).off("click", "#eventhistoryUnackBtn");
			$(document).off("click", "#ackActionOkBtn");
			$(document).off("click", "#unAckActionOkBtn");
		},
		
		destroy : function(){
			if(w2ui['eventHistory_layout']){
				w2ui['eventHistory_layout'].destroy();
			}
			if(w2ui['eventHistory_options']){
				w2ui['eventHistory_options'].destroy();
			}
			if(w2ui['eventHistory_table']){
				w2ui['eventHistory_table'].destroy();
			}
			this.removeEventListener();
			eventHist = null;
			this.undelegateEvents();
		}
		
	});
	
	return Main;
});