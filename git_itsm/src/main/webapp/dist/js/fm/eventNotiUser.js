define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/fm/eventNotiUser",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/fm/eventNotiUser"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	var evtNotiUser;
	var that;
	var Model = Backbone.Model.extend({
		
	});
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.getGradeList = [{"id" : 1, "text" : "Critical"},
								{"id" : 2, "text" : "Major"},
								{"id" : 3, "text" : "Minor"}];
			this.init();
			this.configMode = "normalMode";
			this.selectedData = null;
			this.selectedModifyItem = null;
			this.grade = null;
			
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
			evtNotiUser = this;
			
			$("#contentsDiv").w2layout({
				name : 'event_noti_user_layout',
				panels : [
					{type:'left', size:'50%', resizable: true, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'50%', content:'<div id="rightContents"></div>'}
				]
			});
			
			var leftContents = '<div id="leftTop">'+
				'<div class="userBtn">'+
					'<i id="notiUserAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					//'<i id="notiUserModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Modify"></i>'+
					'<i id="notiUserDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Delete"></i>'+
				'</div>'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">User List<span class="stepCls">Step.1</span></div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom"></div>'+
	    		'</div>'+
	    	'</div>';
			
			var rightContents = '<div id="rightTop">'+
				'<div class="userTargetSubButtons">'+
					'<i id="notiUserTargetAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					'<i id="notiUserTargetDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
				'</div>'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title"><span class="chgContisionsTitle">Target List</span><span class="stepCls">Step.2</span></div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="rightBottom"></div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#rightContents").html(rightContents);
			
			$("#leftBottom").w2grid({
				name : 'event_noti_userList',
				show : {
					footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true
				},
				recordHeight : 35,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'userId', caption: 'USER ID', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'userName', caption: 'USER NAME', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'emailStatus', size: '70px',
         				render : function(record){
         					if(record.emailStatus == 1){ // ON
         						return '<img src="dist/img/idc/ticker/ti_on.png" id="userEmailOnOffBtn" class="onOff"  statusId="'+record.recid+'">';
         					}else{ // OFF
         						return '<img src="dist/img/idc/ticker/ti_off.png" id="userEmailOnOffBtn" class="onOff"  statusId="'+record.recid+'">';
         					}
         				}
         			},
         			{ field: 'email', caption: 'E-MAIL', size : '100%', sortable: true, attr: 'align=left', editable: {type : 'text'}},
         			{ field: 'phoneStatus', size: '70px',
         				render : function(record){
         					if(record.phoneStatus == 1){ // ON
         						return '<img src="dist/img/idc/ticker/ti_on.png" id="userPhoneOnOffBtn" class="onOff" statusId="'+record.recid+'">';
         					}else{ // OFF
         						return '<img src="dist/img/idc/ticker/ti_off.png" id="userPhoneOnOffBtn" class="onOff" statusId="'+record.recid+'">';
         					}
         				}
         			},
         			{ field: 'phone', caption: 'PHONE', size : '200px', sortable: true, attr: 'align=left', editable: {type : 'text'}},
         			{ field: 'recid', hidden: true}
				],
				onClick : function(event){
					event.onComplete = function(){
						that.getTargetList();
					}
				},
				onChange : function(event){
					event.onComplete = function(){
						w2ui['event_noti_userList'].save();
						that.userUpdateInfo();
					}
				}
			});
			
			$("#rightBottom").w2grid({
				name : 'event_noti_targetList',
				show : {
					footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true
				},
				recordHeight : 35,
				columns : [
					{ field: 'grade', caption: 'GRADE', size : '200px', editable: {type: 'list', customDisable: true, items: that.getGradeList, showAll : true},
						render : function(record, index, col_index){
							var html = this.getCellValue(index, col_index);
							if(isNaN(html)){
								switch(html){
								case '1' :
									return 'Critical';
									break;
								case '2' :
									return 'Major';
									break;
								case '3' :
									return 'Minor';
									break;
								}
								return html;
							}else{
								return record.grade;
							}
						}
					},
					{ field: 'codeName', caption: 'TYPE', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
					{ field: 'assetName', caption: 'TARGET NAME', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
					{ field: 'recid', hidden : true},
					{ field: 'assetId', hidden : true},
					{ field: 'codeId', hidden : true},
					{ field: 'inOutStatus', hidden : true},
					{ field: 'serialNumber', hidden : true},
					{ field: 'uId', hidden: true}
				],
				onChange : function(event){
					var selectedData = w2ui['event_noti_targetList'].get(w2ui['event_noti_targetList'].getSelection());
					evtNotiUser.grade = selectedData[0].grade;
					event.onComplete = function(){
						var changedData = w2ui['event_noti_targetList'].getChanges()[0];
						var recId = w2ui['event_noti_targetList'].getChanges()[0].recid;
						w2ui['event_noti_targetList'].save();
						if(changedData.grade == ""){
							w2ui['event_noti_targetList'].records[recId-1].grade = evtNotiUser.grade;
							w2ui['event_noti_targetList'].getChanges()[0] = {recid : recId, grade : {id : 1, text : "Crtical"}}
						}
						w2ui['event_noti_targetList'].refresh();
						that.targetUpdateInfo();
					}
				}
			});
			
			w2ui["event_noti_userList"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
				that.validationCheck();
        		var selectedDataLen = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection()).length;
        		if(selectedDataLen == 1){
        			evtNotiUser.selectedData = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection());
        		}
        	});
        	
        	w2ui["event_noti_userList"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		evtNotiUser.selectedData = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection());
        		that.validationCheck();
        		
    			var userId = null;
    			var conditionTitle = "Target List";
    			if(undefined == evtNotiUser.selectedData || 0 == evtNotiUser.selectedData.length){
    				$(".chgContisionsTitle").text(conditionTitle);
    			}else{
    				userId = evtNotiUser.selectedData[0].userId;
    				$(".chgContisionsTitle").text(conditionTitle+' [ '+userId+' ]');
    			}
        	});
        	
        	w2ui["event_noti_userList"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_targetList"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_targetList"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_targetList"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
			
			this.buttonSetting();
		},
		
		start : function(){
			this.eventListenerRegister();
			this.getNotiUserInitList();
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#notiUserAddBtn", this.addUserPopup);
			$(document).on("click", "#addUserPopupOkBtn", this.addUserPopupOk);
			
			$(document).on("click", "#notiUserDelBtn", this.deleteUser);
			$(document).on("click", "#deleteUserOkBtn", this.deleteUserOk);
			
			$(document).on("click", "#notiUserTargetAddBtn", this.targetAddPopup);
			$(document).on("click", "#addTargetPopupOkBtn", this.targetAddPopupOk);
			
			$(document).on("click", "#notiUserTargetDelBtn", this.targetDelete);
			$(document).on("click", "#deleteTargetOkBtn", this.targetDeleteOk);
			
			$(document).on("click", "#userEmailOnOffBtn", this.changeEmailStatus);
			$(document).on("click", "#userPhoneOnOffBtn", this.changePhoneStatus);
		},
		
		getNotiUserInitList : function(){
			var getUserInitUserList = new Model();
			getUserInitUserList.url = 'eventNotification/getNotiUserInitList';
			that.listenTo(getUserInitUserList, 'sync', that.setUserInitUserList);
			getUserInitUserList.fetch();
		},
		
		setUserInitUserList : function(method, model, options){
			var result = model.allUser;
			if(result != "NODATA"){
				w2ui['event_noti_userList'].clear();
				w2ui['event_noti_targetList'].clear();
				w2ui['event_noti_userList'].records = model.allUser;
				w2ui['event_noti_targetList'].records = model.target;
				w2ui['event_noti_userList'].refresh();
				w2ui['event_noti_targetList'].refresh();
				w2ui['event_noti_userList'].select(1);
			}else{
				w2ui['event_noti_userList'].clear();
				w2ui['event_noti_targetList'].clear();
				$(".chgContisionsTitle").text("Target List");
			}
			that.validationCheck();
		},
		
		buttonSetting : function(){
			$("#notiUserDelBtn").prop("disabled", true);
			$("#notiUserTargetAddBtn").prop("disabled", true);
			$("#notiUserTargetDelBtn").prop("disabled", true);
			
        	$("#notiUserDelBtn").removeClass('link');
        	$("#notiUserTargetAddBtn").removeClass('link');
        	$("#notiUserTargetDelBtn").removeClass('link');
		},
		
		validationCheck : function(){
			var userDataLen = w2ui['event_noti_userList'].records.length;
			var selectedUserDataLen = w2ui['event_noti_userList'].getSelection().length;
			
			var targetDataLen = w2ui["event_noti_targetList"].records.length;
			var selectedTargetDataLen = w2ui["event_noti_targetList"].getSelection().length;
			
			if(selectedUserDataLen > 0){
				if(selectedUserDataLen == 1){
					$("#notiUserTargetAddBtn").prop("disabled", false);
					$("#notiUserTargetAddBtn").addClass('link');
				}else{
					$("#notiUserTargetAddBtn").prop("disabled", true);
					$("#notiUserTargetAddBtn").removeClass('link');
				}
				$("#notiUserDelBtn").prop("disabled", false);
	        	$("#notiUserDelBtn").addClass('link');
			}else{
				$("#notiUserDelBtn").prop("disabled", true);
	        	$("#notiUserDelBtn").removeClass('link');
	        	$("#notiUserTargetAddBtn").prop("disabled", true);
				$("#notiUserTargetAddBtn").removeClass('link');
			}
			if(selectedTargetDataLen > 0){
				$("#notiUserTargetDelBtn").prop("disabled", false);
	        	$("#notiUserTargetDelBtn").addClass('link');
			}else{
				$("#notiUserTargetDelBtn").prop("disabled", true);
	        	$("#notiUserTargetDelBtn").removeClass('link');
			}
		},
		
		addUserPopup : function(){
			var bodyHTML = ''+
			'<div class="w2ui-centered content-idc">'+
				'<div id="addUserPopupContents" style="width:100%; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
				'<div id="addUserPopupBottom">'+
					'<button id="addUserPopupOkBtn" class="darkButton">' + BundleResource.getString('button.userNotification.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.userNotification.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : BundleResource.getString('title.userNotification.addUser'),
				width : 800,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$("#addUserPopupContents").w2grid({
							name : 'addUser_propterits',
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
								{ field: 'userId', caption: 'USER ID', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
								{ field: 'userName', caption: 'USER NAME', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
								{ field: 'email', caption: 'E-MAIL', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
								{ field: 'phone', caption: 'PHONE', size : '300px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							],
						});
						that.getAllUserList();
					}
				},
				onClose: function () {
					w2ui['addUser_propterits'].destroy();
				}
			});
			bodyHTML = null;
		},
		
		getAllUserList : function(){
			var userList = new Model();
			userList.url = 'eventNotification/getAllUserList';
			that.listenTo(userList, 'sync', that.setAllUserList);
			userList.fetch();
		},
		
		setAllUserList : function(method, model, options){
			w2ui['addUser_propterits'].records = model;
			w2ui['addUser_propterits'].refresh();
		},
		
		addUserPopupOk : function(){
			if(w2ui['addUser_propterits'] == undefined){
				return;
			}
			var selectedData = w2ui['addUser_propterits'].get(w2ui['addUser_propterits'].getSelection());
			if(selectedData != 0){
				for(var i = 0; i < selectedData.length; i++){
					if(selectedData[i].email == ""){
						selectedData[i].emailStatus = 0;
					}else{
						selectedData[i].emailStatus = 1;
					}
					if(selectedData[i].phone == ""){
						selectedData[i].phoneStatus = 0;
					}else{
						selectedData[i].phoneStatus = 1;
					}
				}
				var userListTblData = w2ui['event_noti_userList'].records;
				var combineData = userListTblData.concat(selectedData); // Table Data + Selected Data
				var resultData = _.uniq(combineData, "userId");  // Prevent duplicate items through unique "User ID".

				_.each(resultData, function(val, idx){
					val.recid = idx+1;
				});
				
				w2ui['event_noti_userList'].clear();
				w2ui['event_noti_userList'].records = resultData;
				w2ui['event_noti_userList'].refresh();
				w2popup.close();
				that.validationCheck();
				that.saveUserData();
				var selectedRecId = w2ui['event_noti_userList'].records[0].recid;
				w2ui['event_noti_userList'].select(selectedRecId);
			}
		},
		
		saveInfo : function(){
			var bodyContents = BundleResource.getString('label.userNotification.confirmRegistration'); //"등록 하시겠습니까?";
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="saveUserPopupOk" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.userNotification.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.userNotification.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.userNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		saveUserData : function(){
			var user = null;
			user = w2ui['event_noti_userList'].records;

			var userInfo = {
				"user" : user
			};
			
			var model = new Model(userInfo);
			var	bodyContents = "";
			
			bodyContents = BundleResource.getString('label.userNotification.addComplete'); //"등록 되었습니다.";
			model.url = "eventNotification/userSaveInfo";
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						console.log("User Notification - Add User Success");
						that.configMode = "normalMode";
					}else{
						console.log("User Notification - Add User Fail");
					}
				},
				error : function(model, response){
					
				}
			});
		},
		
		saveTragetData : function(){
			var target = null;
			target = w2ui['event_noti_targetList'].records;

			var targetInfo = {
				"target" : target
			};
			
			var model = new Model(targetInfo);
			var	bodyContents = "";
			
			bodyContents = BundleResource.getString('label.userNotification.addComplete'); //"등록 되었습니다.";
			model.url = "eventNotification/targetSaveInfo";
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						console.log("User Notification - Add Target Success");
					}else{
						console.log("User Notification - Add Target Fail");
					}
				},
				error : function(model, response){
					
				}
			});
		},
		
		deleteUser : function(){
			that.validationCheck();
			if($("#notiUserDelBtn").prop("disabled")){
				return;
			}
			var selectedItem = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection());
			var selectedItemLen = selectedItem.length;
			
			//"개의 항목을 삭제 하시겠습니까?";
			var bodyContents = selectedItemLen+BundleResource.getString('label.userNotification.selectedItemDelete');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="deleteUserOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.userNotification.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.userNotification.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.userNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		deleteUserOk : function(){
			var selectedItem = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection());
			var selectedUserId = _.pluck(selectedItem, "userId");
			
			var model = new Model();
			model.set({
				userId : selectedUserId
			});
			model.url = 'eventNotification/deleteUser';
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						var	bodyContents = "";
						if(response == 100){
							bodyContents = BundleResource.getString('label.userNotification.Delete'); //"삭제 되었습니다.";
						}else{
							bodyContents = BundleResource.getString('label.userNotification.errorContents');
						}
						var body = '<div class="w2ui-centered">'+
	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
	      				'<div class="popup-btnGroup">'+
	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.userNotification.confirm') + '</button>'+
	      					'</div>'+
	      				'</div>' ;
						
						w2popup.open({
		            		width: 385,
		      		        height: 180,
	          		        title : BundleResource.getString('title.userNotification.info'),
	          		        body: body,
	      	                opacity   : '0.5',
	      	         		modal     : true,
	      	    		    showClose : true,
	      	    		    onClose : function(){
	      	    		    	evtNotiUser.getNotiUserInitList();
	      	    		    }
	    		      	});
					}
				},
				error : function(model, response){
					
				}
			})
		},
		
		targetAddPopup : function(){
			that.validationCheck();
			if($("#notiUserTargetAddBtn").prop('disabled')){
				return;
			}
			var bodyHTML = ''+
			'<div class="w2ui-centered content-idc">'+
				'<div id="addTargetPopupContents" style="height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
				'<div id="addTargetPopupBottom">'+
					'<button id="addTargetPopupOkBtn" class="darkButton">' + BundleResource.getString('button.userNotification.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.userNotification.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : BundleResource.getString('title.userNotification.addTarget'),
				width : 300,
				height : 500,
				showMax : false,
				modal : true,
				opacity : '0.5',
				style : 'overflow:hidden;',
				body : bodyHTML,
				onOpen : function (event) {
					event.onComplete = function () {
						$("#addTargetPopupContents").w2grid({
							name : 'add_userTarget_properties',
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
								{ field: 'codeName', caption: 'TYPE', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
								{ field: 'assetName', caption: 'TARGET NAME', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
								{ field: 'recid', hidden : true},
								{ field: 'codeId', hidden : true},
								{ field: 'inOutStatus', hidden : true},
								{ field: 'serialNumber', hidden : true}
							],
							searches : [
								{ field : 'codeName', caption: 'TYPE', type: 'text'},
								{ field : 'assetName', caption: 'TARGET', type: 'text'}
							]
						});
						that.getNotiAllTargetList();
					}
				},
				onClose: function () {
					w2ui['add_userTarget_properties'].destroy();
				}
			});
			bodyHTML = null;
		},
		
		getNotiAllTargetList : function(){
			var targetList = new Model();
			targetList.url = 'eventNotification/getNotiAllTargetList';
			that.listenTo(targetList, 'sync', that.setNotiAllTargetList);
			targetList.fetch();
		},
		
		setNotiAllTargetList : function(method, model, options){
			w2ui['add_userTarget_properties'].records = model;
			w2ui['add_userTarget_properties'].refresh();
		},
		
		targetAddPopupOk : function(){
			if(w2ui['add_userTarget_properties'] == undefined){
				return;
			}
			var selectedTargetData = w2ui['add_userTarget_properties'].get(w2ui['add_userTarget_properties'].getSelection());
			var selectedUserData = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection());
			var selectedUserId = selectedUserData[0].userId;
			if(selectedTargetData != 0){
				for(var i = 0; i < selectedTargetData.length; i++){
					selectedTargetData[i].grade = 'Critical';
					selectedTargetData[i].userId = selectedUserId;
				}
				var targetListTblData = w2ui['event_noti_targetList'].records;
				var combineData = targetListTblData.concat(selectedTargetData); // Table Data + Selected Data
				var resultData = _.uniq(combineData, "assetId"); // Prevent duplicate items through unique "Asset ID".

				_.each(resultData, function(val, idx){
					val.recid = idx+1;
				});
				
				w2ui['event_noti_targetList'].clear();
				w2ui['event_noti_targetList'].records = resultData;
				w2ui['event_noti_targetList'].refresh();
				w2popup.close();
				that.validationCheck();
				that.saveTragetData();
			}
		},
		
		getTargetList : function(){
			var selectedData, uerId = null;
			selectedData = w2ui['event_noti_userList'].get(w2ui['event_noti_userList'].getSelection());
			if(selectedData.length != 1){
				return;
			}
			var userId = selectedData[0].userId;
			
			var getTargetList = new Model();
			getTargetList.url = 'eventNotification/getTargetList/'+userId;
			that.listenTo(getTargetList, 'sync', that.setTargetList);
			getTargetList.fetch();
		},
		
		setTargetList : function(method, model, options){
			var result = model;
			w2ui['event_noti_targetList'].clear();
			w2ui['event_noti_targetList'].records = result;
			w2ui['event_noti_targetList'].refresh();
		},
		
		userUpdateInfo : function(){
			var selectedData, userId, emailStatus, phoneStatus, email, phone = null;
			
			selectedData = evtNotiUser.selectedData[0];
			userId = selectedData.userId;
			emailStatus = selectedData.emailStatus;
			phoneStatus = selectedData.phoneStatus;
			email = selectedData.email;
			phone = selectedData.phone;
			
			var model = new Model();
			model.set({
				"userId" : userId,
				"emailStatus" : emailStatus,
				"phoneStatus" : phoneStatus,
				"email" : email,
				"phone" : phone
			});
			model.url = 'eventNotification/userUpdateInfo';
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						console.log("User Notification - Update User Success");
					}else{
						console.log("User Notification - Update User Fail");
					}
				},
				error : function(model, responsd){
					
				}
			});
		},
			
		targetUpdateInfo : function(){
			var selectedData, userId, assetId, grade = null;
			
			selectedData = w2ui['event_noti_targetList'].get(w2ui['event_noti_targetList'].getSelection());
			userId = selectedData[0].userId;
			assetId = selectedData[0].assetId;
			grade = selectedData[0].grade;
			
			var model = new Model();
			model.set({
				"userId" : userId,
				"assetId" : assetId,
				"grade" : grade
			});
			model.url = 'eventNotification/targetUpdateInfo';
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						console.log("User Notification - Update Target Success");
					}else{
						console.log("User Notification - Update Target Fail");
					}
				},
				error : function(model, responsd){
					
				}
			});
		},
		
		targetDelete : function(){
			that.validationCheck();
			if($("#notiUserTargetDelBtn").prop('disabled')){
				return;
			}
			
			var selectedItem = w2ui['event_noti_targetList'].get(w2ui['event_noti_targetList'].getSelection());
			var selectedItemLen = selectedItem.length;
			
			var bodyContents = selectedItemLen+BundleResource.getString('label.userNotification.selectedItemDelete');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="deleteTargetOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.userNotification.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.userNotification.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.userNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},

		targetDeleteOk : function(){
			var selectedItem = w2ui['event_noti_targetList'].get(w2ui['event_noti_targetList'].getSelection());
			var userId = null;
			userId = selectedItem[0].userId;
			var model = new Model();
			model.set({
				"target" : selectedItem,
				"userId" : userId
			});
			model.url = 'eventNotification/deleteTarget';
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						var	bodyContents = "";
						if(response == 100){
							bodyContents = BundleResource.getString('label.userNotification.Delete'); //"삭제 되었습니다.";
						}else{
							bodyContents = BundleResource.getString('label.userNotification.errorContents');
						}
						var body = '<div class="w2ui-centered">'+
	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
	      				'<div class="popup-btnGroup">'+
	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.userNotification.confirm') + '</button>'+
	      					'</div>'+
	      				'</div>' ;
						
						w2popup.open({
		            		width: 385,
		      		        height: 180,
	          		        title : BundleResource.getString('title.userNotification.info'),
	          		        body: body,
	      	                opacity   : '0.5',
	      	         		modal     : true,
	      	    		    showClose : true,
	      	    		    onClose : function(){
	      	    		    	evtNotiUser.getNotiUserInitList();
	      	    		    }
	    		      	});
					}
				},
				error : function(model, response){
					
				}
			})	
		},
		
		changeEmailStatus : function(){
			if(w2ui['event_noti_userList'] == undefined){
				return;
			}
			
			var records = w2ui['event_noti_userList'].records;
			var recordsLen = records.length;
			var selectedDataRecid = evtNotiUser.selectedData[0].recid;
			
			for(var i = 0; i < recordsLen; i++){
				if(records[i].recid == selectedDataRecid){
					var emailStatus = records[i].emailStatus;
					var phoneStatus = records[i].phoneStatus;
					if(emailStatus == 0){
						w2ui['event_noti_userList'].records[i].emailStatus = 1;
					}else{
						w2ui['event_noti_userList'].records[i].emailStatus = 0;
					}
				}
			}
			w2ui['event_noti_userList'].refresh();
			that.userUpdateInfo();
		},
		
		changePhoneStatus : function(){
			if(w2ui['event_noti_userList'] == undefined){
				return;
			}
			
			var records = w2ui['event_noti_userList'].records;
			var recordsLen = records.length;
			var selectedDataRecid = evtNotiUser.selectedData[0].recid;
			
			for(var i = 0; i < recordsLen; i++){
				if(records[i].recid == selectedDataRecid){
					var emailStatus = records[i].emailStatus;
					var phoneStatus = records[i].phoneStatus;
					if(phoneStatus == 0){
						w2ui['event_noti_userList'].records[i].phoneStatus = 1;
					}else{
						w2ui['event_noti_userList'].records[i].phoneStatus = 0;
					}
				}
			}
			w2ui['event_noti_userList'].refresh();
			that.userUpdateInfo();
		},
		
		removeEventListener : function(){
			$(document).off("click", "#notiUserAddBtn");
			$(document).off("click", "#addUserPopupOkBtn");
			
			$(document).off("click", "#notiUserDelBtn");
			$(document).off("click", "#deleteUserOkBtn");
			
			$(document).off("click", "#addTargetPopupOkBtn");
			$(document).off("click", "#notiUserTargetAddBtn");

			$(document).off("click", "#notiUserTargetDelBtn");
			$(document).off("click", "#deleteTargetOkBtn");
			
			$(document).off("click", "#userEmailOnOffBtn");
			$(document).off("click", "#userPhoneOnOffBtn");
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
			if(w2ui['event_noti_user_layout']){
				w2ui['event_noti_user_layout'].destroy();
			}
			if(w2ui['event_noti_userList']){
				w2ui['event_noti_userList'].destroy();
			}
			if(w2ui['event_noti_targetList']){
				w2ui['event_noti_targetList'].destroy();
			}
			if(w2ui['addUser_propterits']){
				w2ui['addUser_propterits'].destroy();
			}
			if(w2ui['add_userTarget_properties']){
				w2ui['add_userTarget_properties'].destroy();
			}
			this.removeEventListener();
			that = null;
			evtNotiUser = null;
			
			this.undelegateEvents();
		}
	});	
	return Main;
});
