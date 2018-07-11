define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/userManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/management/userManager",
    "css!plugins/font-awesome/css/font-awesome.min",
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

	var UserModel = Backbone.Model.extend({
        userModel: UserModel,
        url: 'settings/user',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var LoginModel = Backbone.Model.extend({
        loginModel: LoginModel,
        url: 'settings/loginhistory',
        parse: function(result) {
            return {data: result};
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
			this.userIdMin = 4;
			this.userIdMax = 20;
			this.userPwdMin = 9;
			this.userPwdMax = 16;
			
			this.today = null;
			this.time = null;
			this.popupType = null;
			this.searchUserId = null;
			this.searchType = null;
			
			this.privilegeData = null;
			this.groupData = null;
			
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
		
		eventListenerRegister : function(){
			$(document).on("click", "#userAddBtn", function(){
				that.popupType = "add";
				userMgr.userAddEditPopup();
			});
			$(document).on("click", "#userEditBtn", function(){
				that.popupType = "edit";
				userMgr.userAddEditPopup();
			});
			$(document).on("click", "#userRegistConfirmBtn", this.userRegistAction);
			$(document).on("click", "#userEditConfirmBtn", this.userEditAction);
			$(document).on("click", "#userDeleteBtn", this.userDelete);
			$(document).on("click", "#deleteConfirmBtn", this.deleteConfirmAction);
			$(document).on("click", "#userSearchBtn", this.userSearch);
			$(document).on("click", "#historySearchBtn", function(){
				userMgr.searchType = "periodSearch";
				userMgr.getLoginHistoryList(1, 22);
			});
			/*$(document).on("click", "#userAllHistoryBtn", function(){
				userMgr.searchType = "allSearch";
				userMgr.getLoginHistoryList(1, 22, null);
			});*/
			$(document).on("click", "#userList", this.setUserList);
			$(document).on("click", "#loginHistoryUserID_PopupDone", function(event){
				userMgr.setUserIDFromPopup();
			})
		},
		
		init : function(){
			userMgr = this;
			
			this.today = util.getDate("Day") + " 00:00:00";
    		this.time = util.getDate("Day") + " 23:59:59";
    		
			$("#contentsDiv").w2layout({
				name : 'user_layout',
				panels : [
					{type:'left', size:'50%', resizable: true, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'50%', content:'<div id="rightContents"></div>'}
				]
			});
			
			var leftContents = '<div id="leftTop" style="height:35px">'+
				'<div id="userLeftBtnGroup">'+
					'<i id="userAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					'<i id="userDeleteBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Delete"></i>'+
					'<i id="userEditBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Edit"></i>'+
				'</div>'+
			'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">User List</div>'+
	    		'<div id="userIdTextArea">'+
	    			'<div class="w2ui-field">'+
	    				'<input name="userIdTextBox" type="text" size="25" style="float:left; width:168px;" placeholder="Input User ID"/>'+
	    			'</div>'+
	    			'<i id="userSearchBtn" class="icon link fas fa-search fa-2x" aria-hidden="true" title="Search"></i>'+
	    		'</div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom"></div>'+
	    			'<div class="pager-table-area" id="userListPagerTable">'+
						'<div class="user-list-pager" id="userListPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
			
			var rightContents = '<div id="rightTop" style="height:35px"></div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Login History List</div>'+
	    		
				
	    		'<div id="rightDateBox">'+
		    		'<div class="w2ui-field">'+
		    			'<div id="userList" style="height:30px;cursor: default;float:left;margin-left: 0px; padding-top: 0px; padding-left: 0px;width:226px;    margin-bottom: 0px;padding-bottom: 0px;">'+
		    				'<div style="float:left;width: 231px;">'+
								'<input name="userId" type="text" value="All" readonly="readonly" size="40"  style="width:220px;margin-right:6px;cursor: pointer;background-color: rgba(255, 255, 255, 0.1);" />'+ //258px
							'</div>'+
							'<i class="userId_list fas fa-external-link-alt" aria-hidden="true"'+
							'style="position: relative; float:right;top: -17px; right:9px;color: white;"></i>'+
						'</div>'+
					'</div>'+
					
	    			'<div class="w2ui-field">'+
	    				'<input name="rightFromDateBox" size="20" style="float:left;margin-right:6px;width:138px;"/>'+
	    			'</div>'+
	    			'<div class="w2ui-field">'+
	    				'<input name="rightToDateBox" size="20" style="float:left;width:138px;"/>'+
	    			'</div>'+
	    			'<i id="historySearchBtn" class="icon link fas fa-search fa-2x" aria-hidden="true" title="Search"></i>'+
	    			//'<i id="userAllHistoryBtn" class="icon link fab fa-all_history fa-2x" aria-hidden="true" title="All History" style="float:right;"></i>'+
	    		'</div>'+
	    		
	    		
	    		'<div class="dashboard-contents">'+
	    			'<div id="rightBottom"></div>'+
	    			'<div class="pager-table-area" id="loginHistPagerTable">'+
						'<div class="login-history-pager" id="loginHistPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#rightContents").html(rightContents);
			
			$("#userDeleteBtn").prop("disabled", true);
			$("#userDeleteBtn").removeClass('link');

			$("#userEditBtn").prop("disabled", true);
			$("#userEditBtn").removeClass('link');
			
			$("#leftBottom").w2grid({
				name : 'user_list_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false,
					selectColumn: true
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '40px', sortable: true, attr: 'align=center'},
					{ field: 'userId', caption: 'USER ID', size : '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'privilegeId', caption: 'PRIVILEGE', size : '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;',
         				render : function(record){
         					var result = null;
         					var id = record.privilegeId;
         					_.each(userMgr.getPrivilegeData, function(val, idx){
         						if(id == val.id){
         							result = val.text;
         						}
         					});
         					return result;
     				}},
     				{ field: 'group_id', caption: 'GROUP', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;',
         				render : function(record){
         					var result = null;
         					var id = record.group_id;
         					_.each(userMgr.getGroupData, function(val, idx){
         						if(id == val.groupId){
         							result = val.groupName;
         						}
         					});
         					return result;
     				}},
         			{ field: 'status', caption: 'STATUS', size : '100px', sortable: true, attr: 'align=center',
     					render : function(record){
     						switch (record.status) {
     						case 1 : 
     								return record.status = BundleResource.getString("label.user.enabled_status");
		                            break;
		                    case 2 : 
		                    		return record.status = BundleResource.getString("label.user.disabled_status");
		                    			break;
		                    case 3 :
		                    		return record.status = BundleResource.getString("label.user.lock_status");	                    	
		                            break;
		                    default :
		                    		return record.status = BundleResource.getString("label.user.enabled_status");
		                            break;
	    	                };
         				}},
         			{ field: 'createTime', caption: 'CREATE TIME', size : '130px', sortable: true, attr: 'align=center'},
         			{ field: 'loginStatus', caption: 'LOGIN STATUS', size : '100px', sortable: true, attr: 'align=center',
         				render : function(record){
         					switch (record.loginStatus) {
	     						case 1 : 
	     								return record.loginStatus = BundleResource.getString("label.user.login_status");
			                            break;
			                    case 2 : 
			                    		return record.loginStatus = BundleResource.getString("label.user.logout_status");
			                    			break;
			                    default :
			                    		return record.loginStatus = BundleResource.getString("label.user.logout_status");	                    	
			                            break;
		    	                };
         				}},
         			{ field: 'lastLoginTime', caption: 'LAST LOGIN TIME', size : '130px', sortable: true, attr: 'align=center'},
         			{ field: 'lastLoginIp', caption: 'IP', size : '100%', sortable: true, attr: 'padding-left:5px;'},
         			{ field: 'groupId', hidden: true}
				],
				onDblClick : function(event){
					event.onComplete = function(){
						userMgr.popupType = "edit";
						that.userAddEditPopup();
					}
				}
			});
			
			w2ui["user_list_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["user_list_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["user_list_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
			$("#userIdTextArea").w2form({
				name : 'user_left_text',
				focus : -1,
				fields : [
					{name : 'userIdTextBox', type : 'text'},
				],
				record : {
					userIdTextBox : '',
				},
			});
			
			$("#rightBottom").w2grid({
				name : 'login_history_list_table',
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
					{ field: 'loginId', caption: 'LOGIN ID', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'ipAddress', caption: 'IP', size : '110px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'loginTime', caption: 'LOGIN TIME', size : '130px', sortable: true, attr: 'align=center'},
         			{ field: 'logoutTime', caption: 'LOGOUT TIME', size : '130px', sortable: true, attr: 'align=center'},
         			{ field: 'result', caption: 'RESULT', size : '70px', sortable: true, attr: 'align=center',
         				render : function(record){
         					switch (record.result) {
	     	                    case 1 :
	     	                    		return record.result = BundleResource.getString("label.user.result_success");
	     	                            break;
	     	                    case 2 :
	     	                    		return record.result= BundleResource.getString("label.user.result_fail");	                    	
	     	                            break;
	     	                    default :
	     	                    		return record.result = BundleResource.getString("label.user.result_success");
	     	                            break;
	     	                };
         				}},
         			{ field: 'failReason', caption: 'FAIL REASON', size : '100%', sortable: true, attr: 'padding-left:5px;',
         				render : function(record){
         					switch (record.failReason) {
	    		                case null : 
	    	            				return record.failReason = "";
	    	            				break;
	    	                    case "letter.message.password" : 
	    	                    		return record.failReason = BundleResource.getString("label.user.password_discrepancy_failReason");
	    	                            break;
	    	                    case "letter.message.same.session.logged" : 
	    	                    		return record.failReason = BundleResource.getString("label.user.same_sessionlogged");
	    	                            break;
	    	                    case "letter.message.notexists.loginid" : 
	    	                    		return record.failReason = BundleResource.getString("label.user.notexists_loginid");
	    	                			break;
	    	                    case "letter.message.notexists.loginip" : 
	    	                    		return record.failReason = BundleResource.getString("label.user.notexists_loginip");
	                        			break;
	    	                    case "letter.message.denyed.ipaddr" : 
	    	                    		return record.failReason = BundleResource.getString("label.user.denyed_ipaddr");
	                        			break; 
	    	                    case "letter.message.denyed.userid" : 
	    	                    		return record.failReason = BundleResource.getString("label.user.denyed_userid");
	                        			break;                            
	    	                    default :
	    	                    		return record.failReason = BundleResource.getString("label.user.information_discrepancy");
	    	                            break;
	    	                    
         					};
         				}},
         			{ field: 'logoutReason', caption: 'LOGOUT REASON', size : '150px', sortable: true, attr: 'padding-left:5px;',
         				render : function(record){
         					switch (record.logoutReason) {
	    		                case null : 
	    	            				return record.logoutReason = "";
	    	            				break;
	    	                    case "reason.logout.useraction" : 
	    	                    		return record.logoutReason = BundleResource.getString("label.user.logout_useraction");
	    	                            break;
	    	                    case "reason.logout.adminaction" : 
	                        			return record.logoutReason = BundleResource.getString("label.user.logout_adminaction");
	                        			break;
	    	                    case "reason.logout.timeout" :
	    	                    		return record.logoutReason = BundleResource.getString("label.user.logout_timeout");
	    	                            break;                       
	    	                    default :
	    	                    		return record.logoutReason = BundleResource.getString("label.user.logout_timeout");
	    	                            break;
	    	                };	
         				}},
				]
			});
			
			$("#rightDateBox").w2form({
				name : 'user_right_date_box',
				focus : -1,
				fields : [
					{name : 'userId', type : 'text'},
					{name : 'rightFromDateBox', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}},
					{name : 'rightToDateBox', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}}
				],
				record : {
					userId : 'All',
					rightFromDateBox : this.today,
					rightToDateBox : this.time
				},
			});
			this.eventListenerRegister();
		},
		
		
		start : function(){
			var startRow = 1;
    		var endRow = 22;  
    		
    		this.getUserList(startRow, endRow);
    		this.getLoginHistoryList(startRow, endRow);
    		this.getPrivilegeList();
			this.getGroupList();
		},

		setUserList : function(){
			var bodyHTML = ''+
			'<div class="w2ui-centered content-idc">'+
				'<div id="loginHistoryUserID_PopupContents" style="width:258px; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
				'<div id="loginHistoryUserID_PopupPopupBottom">'+
					'<button id="loginHistoryUserID_PopupDone" class="darkButton">'+BundleResource.getString('button.user.done')+'</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : BundleResource.getString('title.user.user_id'),
				width : 280,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$("#loginHistoryUserID_PopupContents").w2grid({
							name : 'loginHistoryUserID_Popup',
							style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
							show : {
								footer : false,
								toolbarSearch : false,
								toolbarReload : false,
								searchAll : false,
								toolbarColumns : false,
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
					w2ui['loginHistoryUserID_Popup'].destroy();
				}
			});
			bodyHTML = null;
		},
		
		getUserIDPopupList : function(){
			var userList = new LoginModel();
			userList.url += '/getUserList';
			that.listenTo(userList, 'sync', that.setUserIDPopupList);
			userList.fetch();
		},
		
		setUserIDPopupList : function(method, model, options){
			var allArr = {
					recid : 0,
					userId : "All"
			}
			model.unshift(allArr);
			w2ui['loginHistoryUserID_Popup'].records = model;
			w2ui['loginHistoryUserID_Popup'].refresh();
			allArr = null;
		},
		
		setUserIDFromPopup : function(){
			var getSelection = w2ui['loginHistoryUserID_Popup'].get(w2ui['loginHistoryUserID_Popup'].getSelection());
			if(getSelection.length > 1){
				return;
			}
			var selectedId = _.pluck(getSelection, "userId");
			var checkAll = _.contains(selectedId, "All");
			
			if(checkAll || selectedId.length == 0){
				$("#userId").val("All");
			}else{
				$("#userId").val(selectedId.toString());
			}
			$("#userId").attr("readonly", "readonly");
			$("#userId").css("color", "white");
			w2popup.close();
		},
		
		getUserList : function(startRow, endRow){
			this.userModel = new UserModel();
    		this.userModel.set({"startRow" : startRow, "endRow" : endRow});
    		this.userModel.url = this.userModel.url + "/limitList"; 
    		this.userModel.save();
    		this.listenTo(this.userModel, "sync", this.userSetData);
		},
		
		getLoginHistoryList : function(startRow, endRow){
			var sTime = this.today;
			var eTime = this.time;
			
			var userIdValue = $("#userId").val();
			/*var userList = [];
			if("All" != userIdValue){
				userList = userIdValue.split(',');
			}*/
			
			if(sTime == null || eTime == null){
				sTime = w2ui['user_right_date_box'].record.rightFromDateBox;
				eTime = w2ui['user_right_date_box'].record.rightToDateBox;
			}
			this.loginModel = new LoginModel();
			if(userMgr.searchType == "allSearch"){
				this.loginModel.set({"startRow" : startRow, "endRow" : endRow});
			}else{
				if(userIdValue != undefined || userIdValue != null || userIdValue != ""){
					this.loginModel.set({"startRow" : startRow, "endRow" : endRow, "loginTime" : sTime, "logoutTime" : eTime, "loginId" : userIdValue});
				}else{
					this.loginModel.set({"startRow" : startRow, "endRow" : endRow, "loginTime" : sTime, "logoutTime" : eTime});
				}
			}
    		this.loginModel.url = this.loginModel.url + "/limitList"; 
    		this.loginModel.save();
    		this.listenTo(this.loginModel, "sync", this.loginSetData);
		},
		
		userSetData : function(userModel){
			var userData = userModel.attributes.data.data.data;
			var totalCnt = userModel.attributes.data.noOffsetRecord;
			this.userPageInitFunc(userData, totalCnt);
		},
		
		loginSetData : function(loginModel){
			var loginListData = loginModel.attributes.data.data.data;
			var totalCnt = loginModel.attributes.data.noOffsetRecord;
			this.loginListPageInitFunc(loginListData, totalCnt);
		},
		
		userPageInitFunc : function(resultData, totalCnt){
			var dataLen = resultData.length;
        	if(dataLen == 0){
        		w2ui['user_list_table'].clear();
        	}else{
        		if($('#userListPager').data("twbs-pagination")){
					$('#userListPager').pager("destroy").off("click");
					var pageGroup = '<div class="user-list-pager" id="userListPager" data-paging="true"></div></div>';
					$("#userListPagerTable").html(pageGroup);
	            }
				
				$('#userListPager').pager({
	            	"totalCount" : totalCnt,
	            	"pagePerRow" : 22
	            }).on("click", function (event, page) {
	            	var evtClass = $(event.target).attr('class');
	            	if(evtClass != 'page-link') return;
	            	
	            	var pagination = $('#userListPager').data('twbsPagination');
	            	var currentPage = pagination.getCurrentPage();
	            	var endRow = 22;
	            	
	            	that.UserModel = new UserModel();
	            	that.UserModel.url = that.UserModel.url + "/limitList"; 
	            	that.UserModel.set({"startRow" : currentPage, "endRow" : endRow});
	            	that.UserModel.save();
	            	that.listenTo(that.UserModel, "sync", that.userRefershViewAll);
	            });
				var pagination = $('#userListPager').data('twbsPagination');
				var currentPage = pagination.getCurrentPage();
				
				$('#userListPager').pager('pagerTableCSS', ".user-list-pager .pagination", totalCnt, currentPage);
				
				w2ui['user_list_table'].clear();
				w2ui['user_list_table'].records = resultData;
				w2ui['user_list_table'].refresh();
        	}
		},
		
		userRefershViewAll : function(responseData){
			var resultData = responseData.attributes.data.data.data;
			w2ui['user_list_table'].clear();
			w2ui['user_list_table'].records = resultData;
			w2ui['user_list_table'].refresh();
			that.validationCheck();
		},
		
		loginListPageInitFunc : function(resultData, totalCnt){
			var dataLen = resultData.length;
        	if(dataLen == 0){
        		w2ui['login_history_list_table'].clear();
        		$('#loginHistPager').pager('pagerTableCSS', ".login-history-pager .pagination", 0, 1);
        	}else{
        		if($('#loginHistPager').data("twbs-pagination")){
					$('#loginHistPager').pager("destroy").off("click");
					var pageGroup = '<div class="login-history-pager" id="loginHistPager" data-paging="true"></div></div>';
					$("#loginHistPagerTable").html(pageGroup);
	            }
				
				$('#loginHistPager').pager({
	            	"totalCount" : totalCnt,
	            	"pagePerRow" : 22
	            }).on("click", function (event, page) {
	            	var evtClass = $(event.target).attr('class');
	            	if(evtClass != 'page-link') return;
	            	
	            	var pagination = $('#loginHistPager').data('twbsPagination');
	            	var currentPage = pagination.getCurrentPage();
	            	var endRow = 22;
	            	var sTime = w2ui['user_right_date_box'].record.rightFromDateBox;
	            	var eTime = w2ui['user_right_date_box'].record.rightToDateBox;
	            	
	            	that.loginModel = new LoginModel();
	            	that.loginModel.url = that.loginModel.url + "/limitList";
	            	if(userMgr.searchType == "allSearch"){
	            		that.loginModel.set({"startRow" : currentPage, "endRow" : endRow});
	            	}else{
		            	if(userMgr.searchUserId != undefined && userMgr.searchUserId != null && userMgr.searchUserId != ""){
		            		that.loginModel.set({"startRow" : currentPage, "endRow" : endRow, "loginTime" : sTime, "logoutTime" : eTime, "loginId" : userMgr.searchUserId});	
		            	}else{
		            		that.loginModel.set({"startRow" : currentPage, "endRow" : endRow, "loginTime" : sTime, "logoutTime" : eTime});
		            	}
	            	}
	            	that.loginModel.save();
	            	that.listenTo(that.loginModel, "sync", that.loginRefershViewAll);
	            });
				var pagination = $('#loginHistPager').data('twbsPagination');
				var currentPage = pagination.getCurrentPage();
				
				$('#loginHistPager').pager('pagerTableCSS', ".login-history-pager .pagination", totalCnt, currentPage);
				
				w2ui['login_history_list_table'].clear();
				w2ui['login_history_list_table'].records = resultData;
				w2ui['login_history_list_table'].refresh();
        	}
		},
		
		loginRefershViewAll : function(responseData){
			var resultData = responseData.attributes.data.data.data;
			w2ui['login_history_list_table'].clear();
			w2ui['login_history_list_table'].records = resultData;
			w2ui['login_history_list_table'].refresh();
		},
		
		getPrivilegeList : function(){
			var getPrivilegeList = new Model();
			getPrivilegeList.url = 'settings/user/getPrivilegeList';
			that.listenTo(getPrivilegeList, 'sync', that.setPrivilegeList);
			getPrivilegeList.fetch();
		},
		
		setPrivilegeList : function(method, model, options){
			var result = [];
			model.forEach(function(item, idx){
				var newItem = $.extend({}, item);
				newItem.id = item.id;
				newItem.text = item.name;
				result.push(newItem);
			});
			userMgr.getPrivilegeData = result;
		},
		
		getGroupList : function(){
			var getGroupList = new Model();
			getGroupList.url = 'settings/user/getGroupList';
			that.listenTo(getGroupList, 'sync', that.setGroupList);
			getGroupList.fetch();
		},
		
		setGroupList : function(method, model, options){
			var result = [];
			model.forEach(function(item, idx){
				var newItem = $.extend({}, item);
				newItem.id = idx;
				newItem.text = item.groupName;
				newItem.groupId = item.groupId;
				result.push(newItem);
			});
			userMgr.getGroupData = result;
		},
		
		userAddEditPopup : function(){
			that.validationCheck();
			
			var getStatus = [{"text" : BundleResource.getString('label.user.enabled_status'), "id" : "1"},
							 {"text" : BundleResource.getString('label.user.disabled_status'), "id" : "2"}];
			
			var popupTitle = null;
			var propertyRecord = null;
			var executeBtn = null;
			
			if("add" == this.popupType){
				executeBtn = "userRegistConfirmBtn";
				popupTitle = BundleResource.getString('title.user.addUser'); //"User Registration";
				propertyRecord = {
						userId : '',
						password : '',
						rePassword : '',
						privilege : userMgr.getPrivilegeData[2],
						group : userMgr.getGroupData[0],
						userName : '',
						userName_eng : '',
						eMail : '',
						phone : ''
					};
			}else{
				if($("#userEditBtn").prop('disabled')){
					return;
				}
				var selectedData = w2ui["user_list_table"].get(w2ui["user_list_table"].getSelection())[0];

				executeBtn = "userEditConfirmBtn";
				var privilegeArr = null;
				var statusArr = null;
				var groupArr = null;
				var privilegeId = selectedData.privilegeId;
				var groupId = selectedData.group_id;
				var statusTxt = selectedData.status;
				var userId = selectedData.userId;
				var userName = selectedData.userName;
				var userName_eng = selectedData.userName_eng;
				var eMail = selectedData.email;
				var phone = selectedData.phone;
				//var alarmOnOff = selectedData.alarm_on_off;
				
				for(var i = 0; i < userMgr.getPrivilegeData.length; i++){
					if(userMgr.getPrivilegeData[i].id == privilegeId){
						privilegeArr = userMgr.getPrivilegeData[i];
					}
				}
				for(var i = 0; i < userMgr.getGroupData.length; i++){
					if(userMgr.getGroupData[i].groupId == groupId){
						groupArr = userMgr.getGroupData[i];
					}
				}
				for(var i = 0; i<getStatus.length; i++){
					if(getStatus[i].text == statusTxt){
						statusArr = getStatus[i];
					}
				}
				popupTitle = BundleResource.getString('title.user.editUser'); //"User Edit"; 
				propertyRecord = {
						userId : userId,
						password : '',
						rePassword : '',
						status : statusArr,
						privilege : privilegeArr,
						group : groupArr,
						userName : userName,
						userName_eng : userName_eng,
						eMail : eMail,
						phone : phone
					};
			}
			
			var body = '<div class="w2ui-centered">'+
				'<div id="userRegistPopupContents" style="width:100%; height:100%" >'+
					'<div class="w2ui-page page-0">'+
		    			'<div class="w2ui-field">'+
		        			'<label>USER ID</label>'+
		        			'<div>'+
		        				'<input name="userId" type="text" style="width:258px;" size="40" min="4", max="20"/>'+
		        			'</div>'+
		        		'</div>'+
		    			'<div class="w2ui-field">'+
		        			'<label>PASSWORD</label>'+
		        			'<div>'+
		        				'<input name="password" type="password" style="width:258px; size="40" min="9", max="16"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>RE-PASSWORD</label>'+
		        			'<div>'+
		        				'<input name="rePassword" type="password" style="width:258px; size="40" min="9", max="16"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div id="statusListArea" class="w2ui-field">'+
		        			'<label>STATUS</label>'+
		        			'<div>'+
		        				'<input name="status" type="list" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>PRIVILEGE</label>'+
		        			'<div>'+
		        				'<input name="privilege" type="list" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>GROUP</label>'+
		        			'<div>'+
		        				'<input name="group" type="list" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>USER NAME</label>'+
		        			'<div>'+
		        				'<input name="userName" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>USER NAME (Eng)</label>'+
		        			'<div>'+
		        				'<input name="userName_eng" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>E-MAIL</label>'+
		        			'<div>'+
		        				'<input name="eMail" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>PHONE</label>'+
		        			'<div>'+
		        				'<input name="phone" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		/*'<div id="alarmOnOffArea" class="w2ui-field radioCheck">'+
		        			'<label>ALARM</label>'+
		        			'<div class="w2ui-field" style="width:195px; position:relative; left:15px">'+
		    					'<label><input type="radio" name="alarmOnOff" value="on"/><label>ON</label></label>'+
		    					'<label><input type="radio" name="alarmOnOff" value="off" checked="checked"/><label>OFF</label></label>'+
		    				'</div>'+
		        		'</div>'+
		        		
		        		'<div id="severityGroup" class="w2ui-field" style="display:none">'+
		        			'<label>GROUP</label>'+
		        			'<div class="w2ui-field" style="width:276px; position:relative; left:15px">'+
			        			'<label><input name="alarmGroup" type="checkbox" value="critical"/><label>CRITICAL</label></label>'+
		        				'<label style="width:78px"><input name="alarmGroup" type="checkbox" value="major"/><label>MAJOR</label></label>'+
		        				'<label><input name="alarmGroup" type="checkbox" value="minor"/><label>MINOR</label></label>'+
		        			'</div>'+
		        		'</div>'+*/
					'</div>'+
				'</div>'+
				'<div id="userRegistBottom" style="height:20px;text-align: center">'+
					'<button id='+executeBtn+' class="darkButton">' + BundleResource.getString('button.user.save') + '</button>'+
					'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.user.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : popupTitle,
		        body: body,
		        width : 480,
		        height : 470,
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		     	onOpen    : function(event){
		     		event.onComplete = function (event) {
		     			$("#userRegistBottom").html();
		     			/*$("input:radio[name=alarmOnOff]").on('click', function(event){
		    				if($(event.target).attr("value") == "on"){ // Check ON
		    					$("#severityGroup").css("display","block");
		    					if(!w2ui['user_regist_popup_properties'].fields[3].hidden){ //Edit
		    						$("#w2ui-popup").css("height","465px");
		    						$("#userRegistPopupContents").css("height","365px");
			    					$("#userRegistPopupContents > div").css("height","361px");
		    					}else{ // Add
		    						$("#w2ui-popup").css("height","430px");
		    						$("#userRegistPopupContents").css("height","330px");
			    					$("#userRegistPopupContents > div").css("height","361px");
		    					}
		    				}else{ // Check OFF
		    					$("#severityGroup").css("display","none");
		    					if(!w2ui['user_regist_popup_properties'].fields[3].hidden){ //Edit
		    						$("#w2ui-popup").css("height","430px");
			     					$("#userRegistPopupContents").css("height","332px");
			    					$("#userRegistPopupContents > div").css("height","330px");
		    					}else{ // Add
		    						$("#w2ui-popup").css("height","430px");
									$("#userRegistPopupContents").css("height","313px");
			    					$("#userRegistPopupContents > div").css("height","330px");
		    					}
		    				}
		    			});*/
		     		}
		        },
		        onClose   : function(event){
		        	w2ui['user_regist_popup_properties'].destroy();
		        	w2ui['user_list_table'].selectNone();
		        }
			});
			
			$("#userRegistPopupContents").w2form({
				name : 'user_regist_popup_properties',
				style:"border:1px solid rgba(0,0,0,0);",
				focus : 0,
				fields : [
					{name:'userId', type: 'text', disabled:false, required:true, html:{caption:'USER ID'}},
					{name:'password', type: 'password', required:true, html:{caption:'PASSWORD'}},
					{name:'rePassword', type: 'password', required:true, html:{caption:'RE-PASSWORD'}},
					{name:'status', type: 'list', hidden:true, required:false, options : {items : getStatus}, html:{caption:'STATUS'}},
					{name:'privilege', type: 'list', required:false, options : {items : userMgr.getPrivilegeData}, html:{caption:'PRIVILEGE'}},
					{name:'group', type: 'list', required:false, options : {items : userMgr.getGroupData}, html:{caption:'GROUP'}},
					{name:'userName', type: 'text', required:true, html:{caption:'USER NAME'}},
					{name:'userName_eng', type:'text', required:true, html:{caption:'USER NAME (Eng)'}},
					{name:'eMail', type: 'text', required:true, html:{caption:'E-MAIL'}},
					{name:'phone', type: 'text', required:false, html:{caption:'PHONE'}}
				],
				
				record: propertyRecord,
				onRender : function(event){
					event.onComplete = function(event){
						var selectedData = w2ui["user_list_table"].get(w2ui["user_list_table"].getSelection())[0];
						if("edit" == userMgr.popupType){ //Edit Popup
							w2ui['user_regist_popup_properties'].fields[3].hidden = false;
							w2ui['user_regist_popup_properties'].fields[0].disabled = true;
							w2ui['user_regist_popup_properties'].fields[0].required = false;
							
		     				/*if("on" == selectedData.alarm_on_off){
		     					$("#w2ui-popup").css("height","465px");
	    						$("#userRegistPopupContents").css("height","365px");
		    					$("#userRegistPopupContents > div").css("height","361px");
		     					var alarmType = (selectedData.alarm_type).split(",");
		     					$("#severityGroup").css("display","block");
		     					$("input:radio[name=alarmOnOff]:radio[value=on]").prop("checked", true);
		     					if(selectedData.alarm_type != ""){
			     					for(var idx in alarmType){
			     						$("input:checkbox[name=alarmGroup]:checkbox[value="+alarmType[idx]+"]").attr("checked", true);
			     					}
		     					}
		     				}else{
		     					$("#w2ui-popup").css("height","430px");
		     					$("#userRegistPopupContents").css("height","332px");
		    					$("#userRegistPopupContents > div").css("height","330px");
		     				}*/
						}else{ // Add Popup
							/*$("#w2ui-popup").css("height","430px");
							$("#userRegistPopupContents").css("height","313px");
	    					$("#userRegistPopupContents > div").css("height","330px");*/
							w2ui['user_regist_popup_properties'].fields[3].hidden = true;
							w2ui['user_regist_popup_properties'].fields[0].disabled = false;
							w2ui['user_regist_popup_properties'].fields[0].required = true;
						}
						//userMgr.popupType = null;
					}
				}
			});
		},
		
		checkUserId : function(userId){
			var hanChk = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
			var check = /^[a-zA-Z]+[a-zA-Z0-9]+$/;/*영문으로 시작하는 영문 숫자*/
			var spaceCheck = /\s/g;
			var userData = w2ui['user_list_table'].records;
			var userIdList = _.pluck(userData, "userId");
			if(userId == undefined || userId == '') {
				//"아이디를 입력해 주세요.";
				return BundleResource.getString('label.user.no_input_userId');
			} else {

				if(hanChk.test(userId)) {
					//"아이디는 영문 숫자 조합, 4자부터 20자까지 입력 가능합니다.";
					return BundleResource.getString('label.user.valid_userid');
				}

				if((check.test(userId)) && (!spaceCheck.test(userId))) {
					var userIdLen = userId.length;
					if(userIdLen < this.userIdMin || userIdLen > this.userIdMax){
						//"아이디는 영문 숫자 조합, 4자부터 20자까지 입력 가능합니다.";
						return BundleResource.getString('label.user.valid_userid');
					}
				} else {
					//"아이디는 영문 숫자 조합, 4자부터 20자까지 입력 가능합니다.";
					return BundleResource.getString('label.user.valid_userid');
				}
				for(var i = 0; i<userIdList.length; i++){
					if(userId == userIdList[i]){
						//"동일한 ID가 존재합니다. 다시 입력해 주세요.",
						return BundleResource.getString('label.user.duplicate_userid');
					}
				}
			}
			return null;
		},
		
		checkPassword : function(password, rePassword){
			var _data = password;
			//"비밀번호를 입력해 주세요.";
			if(_data == '') return BundleResource.getString('label.user.no_input_password');
			
			var pwStrChk = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
			var pwRepeatChk = /(\w)\1\1/;
			//"비밀번호는 영문 대소문자,숫자,특수문자 조합의 8자부터 15자까지 입력 가능합니다.";
			if(!pwStrChk.test(_data)) return BundleResource.getString('label.user.valid_password');
			//"비밀번호가 일치하지 않습니다.";
			if(password != rePassword) return BundleResource.getString('label.user.no_match_password');
			return null;
		},
		
		userSearch : function(){
			var startRow = 1;
    		var endRow = 22;
			var userId = w2ui['user_left_text'].record.userIdTextBox;
			that.searchUserId = userId;
			that.searchType = "userIdSearch";
			
			var userModel = new UserModel();
			
			userModel.url = userModel.url + "/limitList";
    		
			if(userId == null) {
				userModel.set({"startRow" : startRow, "endRow" : endRow});
			} else {
				userModel.set({"userId":userId, "startRow" : startRow, "endRow" : endRow});
			}

			userModel.save();
			that.listenTo(userModel, "sync",
				function() {
					that.userReloadData(userModel);
					//that.getLoginHistoryList(1, 22, userId);
				}
    		);	
		},
		
		userRegistAction : function(){
			var alertBodyContents = "";
			var body = "";
    		
			var requestParam, alarm_on_off, alarm_type, createTime, email, password, phone, 
			rePassword, startRow, endRow, privilegeId, userId, userName, userName_eng, groupId = null;

			var alarmBox_size = $("input[name=alarmGroup]:checked").length;
        	/*var alarmArray = [];
        	for(var i=0; i<alarmBox_size; i++){
        		alarmArray[i] = $("input[name=alarmGroup]:checked")[i].value;
        	}
        	var alarmString = alarmArray.join();*/
        	
			startRow = 1;
			endRow = 22;
			requestParam = w2ui['user_regist_popup_properties'].record;
			//alarm_on_off = $("input:radio[name=alarmOnOff]:checked").val();
			alarm_on_off = "off";
			//alarm_type = alarmString;
			createTime = util.getDate("now");
			email = requestParam.eMail;
			password = requestParam.password;
			phone = requestParam.phone;
			privilegeId = requestParam.privilege.id;
			userId = requestParam.userId;
			userName = requestParam.userName;
			userName_eng = requestParam.userName_eng;
			rePassword = requestParam.rePassword;
			groupId = requestParam.group.groupId;
			
			var checkUserResult = userMgr.checkUserId(userId);
			var checkPwdResult = userMgr.checkPassword(password, rePassword);
			
			if(checkUserResult != null){
				alertBodyContents = checkUserResult;
				body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
	    		w2popup.message({ 
	    			width   : 480, 
	    			height  : 180,
	    			html    : body
	    		});
			}else if(checkPwdResult != null){
				alertBodyContents = checkPwdResult;
				body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
	    		w2popup.message({ 
	    			width   : 480, 
	    			height  : 180,
	    			html    : body
	    		});
			}else{
				var add_userModel = new UserModel();
				add_userModel.set({
					"userId":userId, 
					"password":password, 
					"privilegeId":privilegeId, 
					"group_id": groupId, 
					"status": 1, 
					"userName":userName,
					"userName_eng":userName_eng,
					"email":email, 
					"createTime":createTime, 
					"phone":phone, 
					"loginStatus": 2, 
					"startRow": startRow, 
					"endRow": endRow,
					"alarm_on_off" : alarm_on_off
					//"alarm_type": alarm_type
				});
				add_userModel.save(null, {
		              success: function(userModel, response) {
		            	  that.userModel = new UserModel();
		            	  that.userModel.set({"startRow" : startRow, "endRow" : endRow});
		            	  that.userModel.url = that.userModel.url + "/limitList"; 
		            	  that.userModel.save();
		            	  that.listenTo(that.userModel, "sync",
		      					function() {
		            		  		that.userReloadData(that.userModel, null, "alldata");
		      					}
		          		  );
		              },
		              error: function(userModel, response) {
		            	  
		              }
				});
			}
		},
		
		userEditAction : function(){
			var requestParam, alarm_on_off, alarm_type, createTime, email, password, phone, 
			startRow, endRow, privilegeId, userId, userName, userName_eng, groupId, status, rePassword = null;
			var edit_userModel = new UserModel();
        	var urlRoot = "settings/user";
        	var recId = 0;
        	
			var alarmBox_size = $("input[name=alarmGroup]:checked").length;
			
	    	/*var alarmArray = [];
	    	for(var i=0; i<alarmBox_size; i++){
	    		alarmArray[i] = $("input[name=alarmGroup]:checked")[i].value;
	    	}
	    	var alarmString = alarmArray.join();*/
	    	
			startRow = 1;
			endRow = 22;
			requestParam = w2ui['user_regist_popup_properties'].record;
			//alarm_on_off = $("input:radio[name=alarmOnOff]:checked").val();
			alarm_on_off = "off";
			//alarm_type = alarmString;
			createTime = util.getDate("now");
			email = requestParam.eMail;
			password = requestParam.password;
			rePassword = requestParam.rePassword;
			phone = requestParam.phone;
			privilegeId = requestParam.privilege.id;
			userId = requestParam.userId;
			userName = requestParam.userName;
			userName_eng = requestParam.userName_eng;
			recId = w2ui['user_list_table'].get(w2ui['user_list_table'].getSelection())[0].recid;
			groupId = requestParam.group.groupId;
			status = requestParam.status.id;
        	
			var checkPwdResult = userMgr.checkPassword(password, rePassword);
			
			if(checkPwdResult != null){
				var alertBodyContents = checkPwdResult;
				var body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
	    		w2popup.message({ 
	    			width   : 480, 
	    			height  : 180,
	    			html    : body
	    		});
			}else{
				
	        	if(recId == undefined) {
	        		edit_userModel.url = urlRoot;
	        	} else {
	        		edit_userModel.recid = recId;
	        		edit_userModel.url = urlRoot + '/' + recId; 
	        	}	
	        	edit_userModel.set("id", recId);
				edit_userModel.set({ 
					"userId":userId, 
					"password":password, 
					"privilegeId":privilegeId, 
					"group_id":groupId, 
					"userName":userName,
					"userName_eng":userName_eng,
					"status":status, 
					"email":email, 
					"phone":phone, 
					"startRow": startRow, 
					"endRow": endRow,
					"alarm_on_off" : alarm_on_off 
					//"alarm_type": alarmString
				});
				edit_userModel.save(null, {
		              success: function(userModel, response) {
		                  var userModel = new UserModel();
		                  userModel.set({"startRow" : startRow, "endRow" : endRow});
		                  userModel.url = userModel.url + "/limitList"; 
		                  userModel.save();
		                  that.listenTo(userModel, "sync",
		    					function() {
		                	  		that.userReloadData(userModel);
		    					}
		        		  );        	
		              },
		              error: function(userModel, response) {
		            	  
		              }
				});
			}
		},
		
		userReloadData : function(responseData){
			var resultData = responseData.attributes.data.data.data;
			var totalCnt = responseData.attributes.data.noOffsetRecord;
			this.userPageInitFunc(resultData, totalCnt);
			w2popup.close();
		},
		
		validationCheck : function(){
			if(w2ui['user_list_table'].getSelection().length > 0){
				if(w2ui['user_list_table'].getSelection().length > 1){ // 다중 선택
					$("#userEditBtn").prop('disabled', true);
					$("#userEditBtn").removeClass('link');
				}else{ // 단일 선택
					$("#userEditBtn").prop('disabled', false);
					$("#userEditBtn").addClass('link');
				}
				$("#userDeleteBtn").prop('disabled', false);
				$("#userDeleteBtn").addClass('link');
			}else{
				$("#userDeleteBtn").prop('disabled', true);
				$("#userDeleteBtn").removeClass('link');
				$("#userEditBtn").prop('disabled', true);
				$("#userEditBtn").removeClass('link');
			}
		},
		
		userDelete : function(){
			that.validationCheck();
			if($("#userDeleteBtn").prop('disabled')){
				return;
			}
			var body = "";
			var selectedData = w2ui["user_list_table"].get(w2ui["user_list_table"].getSelection());
			var selectedDataLen = selectedData.length;
			
			body = '<div class="w2ui-centered">'+
						'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+selectedDataLen+BundleResource.getString('label.user.selectedItemDelete')+'</div>'+
							'<div class="assetMgr-popup-btnGroup">'+
								'<button onclick="" id="deleteConfirmBtn" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
								'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.user.cancel') + '</button>'+
							'</div>'+
						'</div>' ;
			
			w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.user.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
			selectedData = null;
			selectedDataLen = null;
		},
		
		deleteConfirmAction : function(){
			var selectedData = w2ui["user_list_table"].get(w2ui["user_list_table"].getSelection());
			var selectedId = _.pluck(selectedData, "id");
			
			var del_userModel = new UserModel();
  			del_userModel.set("id", selectedId);
  			del_userModel.url = del_userModel.url + '/multiDelete/' + selectedId;
			del_userModel.destroy({
                success: function(userModel, response) {
                  	that.refreshView();
                  	w2popup.close();
                }
             });
		},
		
		refreshView : function(){
			var endRow = 22;
        	var pagination = $('#userListPager').data('twbsPagination');
        	var currentPage = pagination.getCurrentPage();
        	
        	that.UserModel = new UserModel();
        	that.UserModel.url = that.UserModel.url + "/limitList"; 
        	that.UserModel.set({"startRow" : currentPage, "endRow" : endRow});
        	that.UserModel.save();
        	that.listenTo(that.UserModel, "sync", that.userRefershViewAll);
		},
		
		userEdit : function(){
			that.validationCheck();
			if($("#userEditBtn").prop('disabled')){
				return;
			}
			console.log("test");
		},
		
		removeEventListener : function(){
			$(document).off("click", "#userAddBtn");
			$(document).off("click", "#userEditBtn");
			$(document).off("click", "#userRegistConfirmBtn");
			$(document).off("click", "#userEditConfirmBtn");
			$(document).off("click", "#userDeleteBtn");
			$(document).off("click", "#deleteConfirmBtn");
			$(document).off("click", "#userSearchBtn");
			$(document).off("click", "#historySearchBtn");
			//$(document).off("click", "#userAllHistoryBtn");
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
			if(w2ui['user_layout']){
				w2ui['user_layout'].destroy();
			}
			if(w2ui['user_list_table']){
				w2ui['user_list_table'].destroy();
			}
			if(w2ui['user_left_text']){
				w2ui['user_left_text'].destroy();
			}
			if(w2ui['login_history_list_table']){
				w2ui['login_history_list_table'].destroy();
			}
			if(w2ui['user_right_date_box']){
				w2ui['user_right_date_box'].destroy();
			}
			if(w2ui['user_regist_popup_properties']){
				w2ui['user_regist_popup_properties'].destroy();
			}
			if(w2ui['loginHistoryUserID_Popup']){
				w2ui['loginHistoryUserID_Popup'].destroy();
			}
			
			userMgr = null;
			that = null;
			
			this.removeEventListener();
			this.undelegateEvents();
		}
	});
	
	return Main;
});