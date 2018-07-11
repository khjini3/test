define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/assetHistory",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/asset/assetHistory"
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
	var AssetHistoryModel = Backbone.Collection.extend({
		
	});
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.collection = null;
			this.userList = null;
			this.selectedUserList = null;
			this.requestParam = null;
			this.$el.append(JSP);
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
			assetHist = this;
			var cnvtDay = util.getDate("Day");
			var cnvtMonth = util.getDate("Month");
			
			var getStatusType = [{"text" : "All", "value" : "All"},
								  {"text" : "Create", "value" : "create"},
								  {"text" : "Update", "value" : "update"},
								  {"text" : "Delete", "value" : "delete"},
								  {"text" : "Assigned", "value" : "assigned"},
								  {"text" : "Unassigned", "value" : "unassigned"},
								  {"text" : "MultiUpdate", "value" : "multiUpdate"}];
			var getSearchTypeList = [{"text" : "일간", "value" : "1"},
									 {"text" : "월간", "value" : "2"},
									 {"text" : "기간", "value" : "3"}];

			$("#contentsDiv").w2layout({
				name : 'assetHistory_layout',
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
		            					'<input name="userId" type="text" value="All" readonly="readonly" size="40"  style="width:258px;" />'+
		            				'</div>'+
		            				'<i class="userId_list fas fa-external-link-alt" aria-hidden="true"></i>'+
		            			'</div>'+
		            		'</div>'+
		            		'<div class="w2ui-field">'+
		            			'<label>STATUS TYPE</label>'+
		            			'<div>'+
		            				'<input name="statusType" type="list" size="40" style="width:258px;" />'+
		            			'</div>'+
		            		'</div>'+
		            		'<div class="w2ui-field">'+
		        				'<label>조회타입</label>'+
		        				'<div>'+
									'<input name="searchType" type="list" size="40" style="width:258px;" />'+
		    					'</div>'+
		        			'</div>'+
		    				'<div class="w2ui-field">'+
		        				'<label>조회기간</label>'+
		        				'<div id="historyDailyMonthly" class="w2ui-field" style="padding-right:0px;">'+
									'<input name="historySearchDayMonth" type="historySearchDayMonth" size="40" style="width:258px;" />'+
								'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">From</label><input name="historySearchFromPeriod" type="historySearchFromPeriod" size="33" />'+
		    					'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">To</label><input name="historySearchToPeriod" type="historySearchToPeriod" size="33" />'+
		    					'</div>'+
		        			'</div>'+
		        			'<div style="padding-top:25px; text-align:right;"><button id="searchHistBtn" class="darkButton" type="button" >' + BundleResource.getString('button.assetHistory.search') + '</button></div>'+
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
		    		'<div class="pager-table-area" id="assetHistPagerTable">'+
						'<div class="asset-history-pager" id="assetHistPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#mainContents").html(mainContents);
			
			$(".periodic").hide();
			
			$("#leftBottom").w2form({
				name : 'assetHistory_options',
				focus : -1,
				fields : [
					//{name : 'userId', type : 'list'},
					{name : 'userId', type : 'text'},
					{name : 'statusType', type : 'list', options : {items : getStatusType}},
					{name : 'searchType', type : 'list', options : {items : getSearchTypeList}},
					{name : 'historySearchDayMonth', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'historySearchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'historySearchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					userId : 'All',
					statusType : getStatusType[0],
					searchType : getSearchTypeList[0],
					historySearchDayMonth : cnvtDay,
					historySearchFromPeriod : '',
					historySearchToPeriod : ''
				},
				onChange : function(event){
					var eventTarget = event.target;
					if("searchType" == eventTarget){
						if(3 == event.value_new.value){ // 기간
							$(".periodic").show();
							$("#historyDailyMonthly").hide();
							
							$("#historySearchDayMonth").val('');
							$("#historySearchFromPeriod").val('');
							$("#historySearchToPeriod").val('');
							
							$("#historySearchFromPeriod").attr("placeholder", "yyyy-mm-dd");
							$("#historySearchToPeriod").attr("placeholder", "yyyy-mm-dd");
							
							$("#historySearchFromPeriod").val(cnvtDay);
							$("#historySearchToPeriod").val(cnvtDay);
							
						}else if(2 == event.value_new.value){ // 월간
							$(".periodic").hide();
							$("#historyDailyMonthly").show();
							
							$("#historySearchDayMonth").val('');
							$("#historySearchFromPeriod").val('');
							$("#historySearchToPeriod").val('');
							$("#historySearchDayMonth").attr("placeholder", "yyyy-mm");
							$("#historySearchDayMonth").val(cnvtMonth);	
						}else{ // Default = 일간
							$(".periodic").hide();
							$("#historyDailyMonthly").show();
							
							$("#historySearchDayMonth").val('');
							$("#historySearchFromPeriod").val('');
							$("#historySearchToPeriod").val('');
							$("#historySearchDayMonth").attr("placeholder", "yyyy-mm-dd");
							$("#historySearchDayMonth").val(cnvtDay);	
						}
					}
				}
			});

			$("#mainSubBottom").w2grid({
				name : 'assetHistory_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false,
					expandColumn: true
				},
				recordHeight : 30,
				columns : [
					{ field: 'sequence_id', caption: 'SEQ_NO', hidden : true},
					{ field: 'recid', caption: 'NO', size : '100px', sortable: true, attr: 'align=center'},
					{ field: 'userId', caption: 'USER ID', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'cnt', caption: 'COUNT', size : '100px', sortable: true, attr: 'align=center'/*, style:'padding-left:5px;' */},
         			{ field: 'history_text', caption: 'HISTORY TEXT', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'status', caption: 'STATUS', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'date', caption: 'DATE', size : '200px', sortable: true, attr: 'align=center' },
         			{ field: 'asset_list', caption: 'ASSET_LIST', hidden : true}
				],
				onDblClick : function(event){
					console.log(event);
				},
				onExpand : function(event){
					var selectedItem = event.recid-1;
					var currentPage = pagination.getCurrentPage();
					var endRow = 25;
					var startRow = (currentPage*endRow) - endRow;
					if(currentPage > 1){
						selectedItem = selectedItem-startRow;
					}
					var assetList = w2ui['assetHistory_table'].records[selectedItem].asset_list;
					$("#"+event.box_id).html('<div style="padding: 10px; height: 50px;">'+assetList+'</div>');
				}
			});
			this.eventListenerRegister();
		},
		
		start : function(){
			that.searchHistoryAction();
		},
		
		events : {
			'click #searchHistBtn' : 'searchHistoryAction',
			'click #getUserList' : 'settingUserID'
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#assetHistoryUserID_PopupDone", function(event){
				assetHist.setUserIdFromPupup();
			});
		},
		
		removeEventListener : function(){
			$(document).off("click", "#assetHistoryUserID_PopupDone");
		},
		
		settingUserID : function(){
			var bodyHTML = ''+
				'<div class="w2ui-centered content-idc">'+
					'<div id="assetHistoryUserID_PopupContents" style="width:258px; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
					'<div id="assetHistoryUserID_PopupPopupBottom">'+
						'<button id="assetHistoryUserID_PopupDone" class="darkButton">'+BundleResource.getString('button.assetHistory.done')+'</button>'+
					'</div>'+
				'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.assetHistory.userId'),
				width : 280,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$("#assetHistoryUserID_PopupContents").w2grid({
							name : 'assetHistoryUserID_Popup',
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
					w2ui['assetHistoryUserID_Popup'].destroy();
				}
			});
			bodyHTML = null;
		},
		
		setUserIdFromPupup : function(){
			var getSelection = w2ui['assetHistoryUserID_Popup'].get(w2ui['assetHistoryUserID_Popup'].getSelection());
			var selectedId = _.pluck(getSelection, "userId");
			assetHist.selectedUserList = getSelection;
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
			w2ui['assetHistoryUserID_Popup'].records = model;
			w2ui['assetHistoryUserID_Popup'].refresh();
			var selectedRecId = _.pluck(assetHist.selectedUserList, "recid");
			if(assetHist.selectedUserList != null){
				var firstID = assetHist.selectedUserList[0].userId;
				if(firstID != 'All' && selectedRecId.length != 0){
					for(var i = 0; i<selectedRecId.length; i++){
						w2ui['assetHistoryUserID_Popup'].select(selectedRecId[i]);
					}
				}
			}
			allArr = null;
		},
		
		searchHistoryAction : function(){
			var item = w2ui['assetHistory_options'].record;
			var userIdValue = $("#userId").val();
			var userList = [];
			var userId = "";
			if("All" == userIdValue){
				userId = "All";
			}else{
				var selectedId = _.pluck(assetHist.selectedUserList, "userId");
				userList = selectedId;
			}
			var selectedDayMonth = $("#historySearchDayMonth").val();
			var selectedFromDate = $("#historySearchFromPeriod").val();
			var selectedToDate = $("#historySearchToPeriod").val();
			
			if(selectedDayMonth == "" && selectedFromDate == "" && selectedToDate == ""){
				w2popup.open({
            		width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.assetHistory.info'),
    		        body: '<div class="w2ui-centered">'+BundleResource.getString('label.assetHistory.noSelectDate')+'</div>',
                    opacity   : '0.5',
             		modal     : true,
        		    showClose : true
    		    });
			}else{
				w2ui['assetHistory_table'].lock("Loading...", true);
				
				this.requestParam = {
						userId : userId,
						userList :userList,
						historyType : item.statusType.value,
						searchType : item.searchType.value,
						searchDayMonth : selectedDayMonth,
						searchFromPeriod : selectedFromDate,
						searchToPeriod : selectedToDate,
						startRow : 0,
						endRow : 25
				}
				
				Backbone.ajax({
					dataType : 'json',
					contentType : 'application/json',
					url : '/assetHistory/searchHistory',
					method : 'post',
					data : JSON.stringify(this.requestParam),
					success : function(val){
						var dataCnt = val.result.length;
						if(dataCnt == 0){
							w2ui['assetHistory_table'].clear();
						}else{
							if($('#assetHistPager').data("twbs-pagination")){
								$('#assetHistPager').pager("destroy").off("click");
								var pageGroup = '<div class="asset-history-pager" id="assetHistPager" data-paging="true"></div></div>';
								$("#assetHistPagerTable").html(pageGroup);
				            }
							
							$('#assetHistPager').pager({
				            	"totalCount" : val.totalCount,
				            	"pagePerRow" : 25
				            }).on("click", function (event, page) {
				            	var evtClass = $(event.target).attr('class');
				            	if(evtClass != 'page-link') return;
				            	
				            	var pagination = $('#assetHistPager').data('twbsPagination');
				            	
				            	var currentPage = pagination.getCurrentPage();
				            	
				            	var requestParam = that.requestParam;
				            	
				            	endRow = 25,
				            	startRow = (currentPage*endRow) - endRow;
				            	
				            	var model = new Model();
				            	model.url = "assetHistory/searchHistory";
				            	model.set({"userId" : requestParam.userId, "userList" : requestParam.userList, "historyType" : requestParam.historyType, "searchType" : requestParam.searchType, "searchDayMonth" : requestParam.searchDayMonth, 
				            		"searchFromPeriod" : requestParam.searchFromPeriod, "searchToPeriod" : requestParam.searchToPeriod, "startRow" : startRow, "endRow" : endRow});
				            	model.save();
				            	that.listenTo(model, "sync", that.refreshView);
				            	
				            });
							
							var pagination = $('#assetHistPager').data('twbsPagination');
							var currentPage = pagination.getCurrentPage();
							
							
							$('#assetHistPager').pager('pagerTableCSS', ".asset-history-pager .pagination", val.totalCount, currentPage);
							
							w2ui['assetHistory_table'].clear();
							w2ui['assetHistory_table'].records = val.result;
							w2ui['assetHistory_table'].refresh();
							
						}
						w2ui['assetHistory_table'].unlock();
					},
					error : function(val){
						w2alert('Failed', 'Error');
					}
				});
			}
		},
		
		refreshView : function(method, model, options){
			w2ui['assetHistory_table'].clear();
			w2ui['assetHistory_table'].records = model.result;
			w2ui['assetHistory_table'].refresh();
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
			if(w2ui['assetHistoryUserID_Popup']){
				w2ui['assetHistoryUserID_Popup'].destroy();
			}
			if(w2ui['assetHistory_options']){
				w2ui['assetHistory_options'].destroy();
			}
			if(w2ui['assetHistory_table']){
				w2ui['assetHistory_table'].destroy();
			}
			if(w2ui['assetHistory_layout']){
				w2ui['assetHistory_layout'].destroy();
			}
			
			this.removeEventListener();
			assetHist = null;
			
			this.undelegateEvents();
		}
	});
	return Main;
});