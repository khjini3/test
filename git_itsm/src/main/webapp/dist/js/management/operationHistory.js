define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/operationHistory",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/management/operationHistory"
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
        model: Model,
        url: 'settings/operationhistory',
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
			this.selectedUserList = null;
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
			operationHist = this;
			
			var today = util.getDate("Day") + " 00:00:00";
    		var time = util.getDate("Day") + " 23:59:59";
    		
			var selectCategory = [
	     		   {"text" : "All", "id" : "1"},
	     		   {"text" : "General", "id" : "2"},
				   {"text" : "Dashbaord", "id" : "3"},
				   {"text" : "Report", "id" : "4"},
				   {"text" : "Settings", "id" : "5"}];   
			
			var selectType = [
	     		   {"text" : "All", "id" : "1"},
	     		   {"text" : "GET", "id" : "2"},
				   {"text" : "POST", "id" : "3"},
				   {"text" : "PUT", "id" : "4"},
				   {"text" : "DLT", "id" : "5"}];
			
			$("#contentsDiv").w2layout({
				name : 'operationHistory_layout',
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
		            			'<label>USER ID</label>'+
		            			'<div id="getUserList">'+
		            				'<div style="float:left; width: 231px;">'+
		            					'<input name="userId" type="text" value="All" readonly="readonly" size="40" style="width:258px;"/>'+
		            				'</div>'+
		            				'<i class="userId_list fas fa-external-link-alt" aria-hidden="true"></i>'+
		            			'</div>'+
		            		'</div>'+
		            		'<div class="w2ui-field">'+
		            			'<label>CATEGORY</label>'+
		            			'<div>'+
		            				'<input name="category" type="list" size="40" style="width:258px;"/>'+
		            			'</div>'+
		            		'</div>'+
		            		'<div class="w2ui-field">'+
		        				'<label>TYPE</label>'+
		        				'<div>'+
									'<input name="methodType" type="list" size="40" style="width:258px;"/>'+
		    					'</div>'+
		        			'</div>'+
		    				/*'<div class="w2ui-field">'+
		        				'<label>조회기간</label>'+
		        				'<div id="historyDailyMonthly" class="w2ui-field" style="padding-right:0px;">'+
									'<input name="historySearchDayMonth" type="historySearchDayMonth" size="40"/>'+
								'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">From</label><input name="historySearchFromPeriod" type="historySearchFromPeriod" size="33" />'+
		    					'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">To</label><input name="historySearchToPeriod" type="historySearchToPeriod" size="33" />'+
		    					'</div>'+
		        			'</div>'+*/
		        			'<div class="w2ui-field">'+
		        				'<label>FROM</label>'+
		        				'<div>'+
		        					'<input name="historyFromPeriod" type="historySearchFromPeriod" size="40" style="width:258px;"/>'+
		    					'</div>'+
		        			'</div>'+
		        			'<div class="w2ui-field">'+
		        				'<label>TO</label>'+
		        				'<div>'+
		        					'<input name="historyToPeriod" type="historySearchToPeriod" size="40" style="width:258px;"/>'+
		    					'</div>'+
		        			'</div>'+
		        			'<div style="padding-top:25px; text-align:right;"><button id="operationHistorySearchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.operationhistory.search') + '</button></div>'+
		    			'</div>'+
	    			'</div>'+
	    		'</div>'+
	    	'</div>';
			
			var mainContents = '<div id="mainTop">'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">History Result</div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubBottom"></div>'+
		    		'<div class="pager-table-area" id="operationHistPagerTable">'+
						'<div class="operation-history-pager" id="operationHistPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#mainContents").html(mainContents);
			
			$("#leftBottom").w2form({
				name : 'operationHistory_options',
				focus : -1,
				fields : [
					{name : 'userId', type : 'text'},
					{name : 'category', type : 'list', options : {items : selectCategory}},
					{name : 'methodType', type : 'list', options : {items : selectType}},
					{name : 'historyFromPeriod', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}},
					{name : 'historyToPeriod', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}}
				],
				record : {
					userId : 'All',
					category : selectCategory[0],
					methodType : selectType[0],
					historyFromPeriod : today,
					historyToPeriod : time
				},
			});
			
			$("#mainSubBottom").w2grid({
				name : 'operationHistory_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
					{ field: 'loginId', caption: 'USER ID', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'ipAddress', caption: 'IP ADDRESS', size : '100px', sortable: true, attr: 'align=center'/*, style:'padding-left:5px;' */},
         			{ field: 'category', caption: 'CATEGORY', size : '100px', sortable: true, attr: 'align=center' },
         			{ field: 'actionType', caption: 'TYPE', size : '50px', sortable: true, attr: 'align=center' },
         			{ field: 'command', caption: 'COMMAND', size : '100%', sortable: true, /*attr: 'align=center'*/attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'requestTime', caption: 'REQUEST TIME', size : '200px', sortable: true, attr: 'align=center'},
         			{ field: 'responseTime', caption: 'RESPONSE TIME', size : '200px', sortable: true, attr: 'align=center'},
         			{ field: 'result', caption: 'RESULT', size : '100px', sortable: true, attr: 'align=center', 
         				render : function(record){
         					var result = record.result;
         					if(result == 0){
         						return "Fail";
         					}else{
         						return "Succcess";
         					}
         				}},
         			{ field: 'failReason', caption: 'FAIL REASON', size : '200px', sortable: true, attr: 'align=center' },
				]
			});
			this.eventListenerRegister();
		},
		
		start : function(){
			this.searchAction();
		},
		
		events : {
			'click #getUserList' : 'settingUserID',
			'click #operationHistorySearchBtn' : 'searchAction'
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#operationHistoryUserID_PopupDone", function(event){
				that.setUserIdFromPupup();
			});
		},
		
		settingUserID : function(){
			var bodyHTML = ''+
				'<div class="w2ui-centered content-idc">'+
					'<div id="operationHistoryUserID_PopupContents" style="width:258px; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
					'<div id="operationHistoryUserID_PopupPopupBottom">'+
						'<button id="operationHistoryUserID_PopupDone" class="darkButton">'+BundleResource.getString('button.operationhistory.done')+'</button>'+
					'</div>'+
				'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.operationhistory.userId'),
				width : 280,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$("#operationHistoryUserID_PopupContents").w2grid({
							name : 'operationHistory_userIdTable',
							style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
							show : {
								footer : false,
								toolbarSearch : false,
								toolbarReload : false,
								searchAll : false,
								toolbarColumns : false,
								selectColumn: true,
							},
							recordHeight : 30,
							columns : [
								{ field: 'userId', caption: 'USER ID LIST', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							],
						});
						that.getUserIDPopupList();
					}
				},
				onClose: function () {
					w2ui['operationHistory_userIdTable'].destroy();
				}
			});
			
			bodyHTML = null;
		},
		
		setUserIdFromPupup : function(){
			var getSelection = w2ui['operationHistory_userIdTable'].get(w2ui['operationHistory_userIdTable'].getSelection());
			var selectedId = _.pluck(getSelection, "userId");
			operationHist.selectedUserList = getSelection;
			var checkAll = _.contains(selectedId, "All");
			
			if(checkAll || selectedId.length == 0){
				$("#userId").val("All");
			}else{
				var selectedLen = getSelection.length - 1;
				if(selectedLen == 0){
					$("#userId").val(selectedId.toString());
				}else{
					selectedId = getSelection[0].userId
					$("#userId").val(selectedId.toString()+' 외 '+Number(selectedLen)+'명');
				}
			}
			$("#userId").attr("readonly", "readonly");
			$("#userId").css("color", "white");
			w2popup.close();
		},
		
		getUserIDPopupList : function(){
			var userList = new Model();
			userList.url = 'assetHistory/getUserList';
			that.listenTo(userList, 'sync', that.setUserIDPopupList);
			userList.fetch();
		},
		
		setUserIDPopupList : function(mtehod, model, options){
			var allArr = {
					recid : 0,
					userId : "All"
			}
			model.unshift(allArr);
			w2ui['operationHistory_userIdTable'].records = model;
			w2ui['operationHistory_userIdTable'].refresh();
			var selectedRecId = _.pluck(operationHist.selectedUserList, "recid");
			if(operationHist.selectedUserList != null){
				var firstID = operationHist.selectedUserList[0].userId;
				if(firstID != 'All' && selectedRecId.length != 0){
					for(var i = 0; i<selectedRecId.length; i++){
						w2ui['operationHistory_userIdTable'].select(selectedRecId[i]);
					}
				}
			}
			allArr = null;
		},
		
		searchAction : function(){
			var model = new Model();
			var startRow = 0;
    		var endRow = 25; 
			var options = w2ui['operationHistory_options'].record;
			var userIdValue = $("#userId").val();
			var userList = [];
			var userId = "";
			if("All" == userIdValue){
				userId = "All";
			}else{
				var selectedId = _.pluck(operationHist.selectedUserList, "userId");
				userList = selectedId;
			}
			var category = options.category.text;
			var actionType = options.methodType.text;
			var sTime = options.historyFromPeriod;
			var eTime = options.historyToPeriod;
			
			model.set({
				"loginId" : userId,
				"userList" : userList,
				"category": category,
				"actionType": actionType,
				"requestTime" : sTime, 
				"responseTime" : eTime,
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
						w2ui['operationHistory_table'].clear();
					}else{
						if($('#operationHistPager').data("twbs-pagination")){
							$('#operationHistPager').pager("destroy").off("click");
							var pageGroup = '<div class="operation-history-pager" id="operationHistPager" data-paging="true"></div></div>';
							$("#operationHistPagerTable").html(pageGroup);
			            }
						
						$('#operationHistPager').pager({
			            	"totalCount" : totalCount,
			            	"pagePerRow" : 25
			            }).on("click", function (event, page) {
			            	var evtClass = $(event.target).attr('class');
			            	if(evtClass != 'page-link') return;
			            	
			            	var pagination = $('#operationHistPager').data('twbsPagination');
			            	var currentPage = pagination.getCurrentPage();
			            	var requestParam = that.requestParam;
			            	
			            	var endRow = 25;
			            	var startRow = (currentPage*endRow) - endRow;
			            	
			            	var model = new Model();
			            	model.set({
			    				"loginId" : requestParam.loginId,
			    				"userList" : requestParam.userList,
			    				"category": requestParam.category,
			    				"actionType": requestParam.actionType,
			    				"requestTime" : requestParam.requestTime, 
			    				"responseTime" : requestParam.responseTime,
			    				"startRow" : startRow, 
			    				"endRow" : endRow
			    			});
			            	
			            	model.url += "/limitList";
			            	model.save();
			            	that.listenTo(model, "sync", that.refreshView);
			            });
						
						var pagination = $('#operationHistPager').data('twbsPagination');
						var currentPage = pagination.getCurrentPage();
						
						$('#operationHistPager').pager('pagerTableCSS', ".operation-history-pager .pagination", totalCount, currentPage);
						
						w2ui['operationHistory_table'].clear();
						w2ui['operationHistory_table'].records = resultData;
						w2ui['operationHistory_table'].refresh();
						
					}
				},
				error : function(model, response){
					
				}
			});
		},
		
		refreshView : function(method, model, options){
			w2ui['operationHistory_table'].clear();
			w2ui['operationHistory_table'].records = model.data.data;
			w2ui['operationHistory_table'].refresh();
		},
		
		setHistoryData : function(method, model, options){
			console.log("TEST");
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
			$(document).off("click", "#operationHistoryUserID_PopupDone");
		},
		
		destroy : function(){
			if(w2ui['operationHistory_layout']){
				w2ui['operationHistory_layout'].destroy();
			}
			if(w2ui['operationHistory_options']){
				w2ui['operationHistory_options'].destroy();
			}
			if(w2ui['operationHistory_table']){
				w2ui['operationHistory_table'].destroy();
			}
			if(w2ui['operationHistoryUserID_Popup']){
				w2ui['operationHistoryUserID_Popup'].destroy();
			}
			
			if(w2ui['operationHistory_userIdTable']){
				w2ui['operationHistory_userIdTable'].destroy();
			}
			this.removeEventListener();
			operationHist = null;
			this.undelegateEvents();
		}
		
	});
	
	return Main;
});