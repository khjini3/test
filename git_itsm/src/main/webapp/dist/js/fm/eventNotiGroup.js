define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/fm/eventNotiGroup",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/fm/eventNotiGroup"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	var evtNotiGroup;
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
			this.currentGroupList = null;
			this.currentTargetList = null;
			this.currentUserList = null;
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
			evtNotiGroup = this;
			$("#contentsDiv").w2layout({
				name : 'event_noti_group_layout',
				panels : [
					{type:'left', size:'20%', resizable: false, content:'<div id="leftContents"></div>'},
					{type:'main', size:'20%', resizable: false, content:'<div id="mainContents"></div>'},
					{type:'right', size:'60%', content:'<div id="rightContents"></div>'}
				]
			});
			
			var leftContents = '<div id="leftTop" style="padding-top: 10px;">'+
				'<div class="groupBtn">'+
					'<i id="notiGroupAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					'<i id="notiGroupModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Modify"></i>'+
					'<i id="notiGroupDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
				'</div>'+
				'<div class="editGroupBtn">'+
					'<i id="notiGtoupSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save"></i>'+
		        	'<i id="notiGroupCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel"></i>'+
				'</div>'+
			'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Group List<span class="stepCls">Step.1</span></div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom"></div>'+
	    		'</div>'+
	    	'</div>';
			
			var mainContents = '<div id="mainTop" style="padding-top: 10px;">'+
				'<div class="targetSubButtons">'+
					'<i id="notiTargetAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					'<i id="notiTargetDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
				'</div>'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title"><span class="chgTargetTitle">Target List</span><span class="stepCls">Step.2</span></div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubLeftBottom"></div>'+
		    	'</div>'+
	    	'</div>';
			
	    	var rightContents = '<div id="rightTop" style="padding-top: 10px;">'+
	    	'<div class="userSubButtons">'+
				'<i id="notiUserAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
				'<i id="notiUserDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
			'</div>'+
	    	'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title"><span class="chgUserTitle">User List</span><span class="stepCls">Step.3</span></div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubRightBottom"></div>'+
		    	'</div>'+
	    	'</div>';
    	
			$("#leftContents").html(leftContents);
			$("#rightContents").html(rightContents);
			$("#mainContents").html(mainContents);
			
			$("#leftBottom").w2grid({
				name : 'event_noti_group_list',
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
         			{ field: 'groupName', caption: 'GROUP NAME', size : '100%'},
         			{ field: 'onOffStatus', caption: 'ON/OFF', size : '100px', attr: 'align=center',
         				render : function(record){
         					if(record.onOffStatus == 1){
         						return '<img src="dist/img/idc/ticker/ti_on.png" id="groupOnOffBtn" class="onOff" statusId="'+record.recid+'">';
         					}else{
         						return '<img src="dist/img/idc/ticker/ti_off.png" id="groupOnOffBtn" class="onOff" statusId="'+record.recid+'">';
         					}
         				}
         			},
         			{ field: 'uId', hidden : true},
				],
				onChange : function(event){
					event.onComplete = function(){
						w2ui['event_noti_group_list'].save();
						var selectedData = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection());
						var changedGroupName = selectedData[0].groupName;
						
						var targetTitle = "Target List";
	        			var userTitle = "User List";
	        			$(".chgTargetTitle").text(targetTitle+' [ '+changedGroupName+' ]');
	        			$(".chgUserTitle").text(userTitle+' [ '+changedGroupName+' ]');
					}
				}
			});
			
			$("#mainSubLeftBottom").w2grid({
				name : 'event_noti_target_list',
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
					{ field: 'codeName', caption: 'TYPE', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
					{ field: 'assetName', caption: 'TARGET NAME', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
					{ field: 'recid', hidden : true},
					{ field: 'assetId', hidden : true},
					{ field: 'codeId', hidden : true},
					{ field: 'inOutStatus', hidden : true},
					{ field: 'serialNumber', hidden : true},
					{ field: 'uId', hidden: true}
				],
			});
			
			$("#mainSubRightBottom").w2grid({
				name : 'event_noti_user_list',
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
					{ field: 'recid', hidden : true},
					{ field: 'grade', caption: 'GRADE', size : '120px',
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
								//return evtNotiGroup.getGradeList[record.grade - 1].text;
								return record.grade;
							}
						}
					},
         			{ field: 'userId', caption: 'USER ID', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'userName', caption: 'USER NAME', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'emailStatus', size: '70px',
         				render : function(record){
         					if(record.emailStatus == 1){
         						return '<img src="dist/img/idc/ticker/ti_on.png" id="emailOnOffBtn" class="onOff"  statusId="'+record.recid+'">';
         					}else{
         						return '<img src="dist/img/idc/ticker/ti_off.png" id="emailOnOffBtn" class="onOff"  statusId="'+record.recid+'">';
         					}
         				}
         			},
         			{ field: 'email', caption: 'E-MAIL', size : '100%', sortable: true, attr: 'align=left'},
         			{ field: 'phoneStatus', size: '70px',
         				render : function(record){
         					if(record.phoneStatus == 1){
         						return '<img src="dist/img/idc/ticker/ti_on.png" id="phoneOnOffBtn" class="onOff" statusId="'+record.recid+'">';
         					}else{
         						return '<img src="dist/img/idc/ticker/ti_off.png" id="phoneOnOffBtn" class="onOff" statusId="'+record.recid+'">';
         					}
         				}
         			},
         			{ field: 'phone', caption: 'PHONE', size : '250px', sortable: true, attr: 'align=left'},
         			{ field: 'uId', hidden: true}
				],
				onChange : function(event){
					var selectedData = w2ui['event_noti_user_list'].get(w2ui['event_noti_user_list'].getSelection());
					evtNotiGroup.grade = selectedData[0].grade;
					event.onComplete = function(){
						var changedData = w2ui['event_noti_user_list'].getChanges()[0];
						var recId = w2ui['event_noti_user_list'].getChanges()[0].recid;
						w2ui['event_noti_user_list'].save();
						if(changedData.grade == ""){
							w2ui['event_noti_user_list'].records[recId-1].grade = evtNotiGroup.grade;
							w2ui['event_noti_user_list'].getChanges()[0] = {recid : recId, grade : {id : 1, text : "Crtical"}}
						}
						w2ui['event_noti_user_list'].refresh();
					}
				}
			});
			
			w2ui["event_noti_group_list"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        		var selectedDataLen = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection()).length;
        		if(selectedDataLen == 1){
        			evtNotiGroup.selectedData = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection());
        		}
        	});
        	
        	w2ui["event_noti_group_list"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		evtNotiGroup.selectedData = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection());
        		that.validationCheck();
        		if("normalMode" == that.configMode){
        			var groupName = null;
        			groupName = evtNotiGroup.selectedData[0].groupName;
        			var targetTitle = "Target List";
        			var userTitle = "User List";
        			$(".chgTargetTitle").text(targetTitle+' [ '+groupName+' ]');
        			$(".chgUserTitle").text(userTitle+' [ '+groupName+' ]');
        			that.getSelectedData();
        		}
        	});
        	
        	w2ui["event_noti_group_list"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_target_list"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_target_list"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_target_list"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_user_list"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        		var selectedDataLen = w2ui['event_noti_user_list'].get(w2ui['event_noti_user_list'].getSelection()).length;
        		if(selectedDataLen == 1){
        			evtNotiGroup.selectedData = w2ui['event_noti_user_list'].get(w2ui['event_noti_user_list'].getSelection());
        		}
        	});
        	
        	w2ui["event_noti_user_list"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["event_noti_user_list"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
			this.buttonSetting();
		},
		
		start : function(){
			this.eventListenerRegister();
			this.getNotiInitGroupList();
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#notiGroupAddBtn", this.addGroupPopup);
			$(document).on("click", "#addGroupPopupOkBtn", this.addGroupOk);
			
			$(document).on("click", "#notiGroupModifyBtn", this.modifyGroup);
			$(document).on("click", "#mdifyGroupOkBtn", this.modifyGroupOk);
			
			$(document).on("click", "#notiGroupDelBtn", this.deleteGroup);
			$(document).on("click", "#deleteGroupOkBtn", this.deleteGroupOk);

			$(document).on("click", "#notiTargetAddBtn", this.addTargetPopup);
			$(document).on("click", "#addTargetPopupOkBtn", this.addTargetOk);
			
			$(document).on("click", "#notiTargetDelBtn", this.deleteTarget);
			$(document).on("click", "#notiUserAddBtn", this.addUserPopup);
			$(document).on("click", "#addUserPopupOkBtn", this.addUserOk);
			
			$(document).on("click", "#notiUserDelBtn", this.deleteUser);
			
			$(document).on("click", "#notiGtoupSaveBtn", this.saveInfo);
			$(document).on("click", "#savePopupOkBtn", this.saveOk);
			
			$(document).on("click", "#notiGroupCancelBtn", this.cancelInfo);
			$(document).on("click", "#cancelPopupOkBtn", this.cancelOk);
			
			$(document).on("click", "#groupOnOffBtn", this.changeGroupStatus);
			$(document).on("click", "#emailOnOffBtn", this.changeEmailStatus);
			$(document).on("click", "#phoneOnOffBtn", this.changePhoneStatus);
		},
		
		getNotiInitGroupList : function(){
			var getNotiInitGroupList = new Model();
			getNotiInitGroupList.url = 'eventNotification/getNotiInitGroupList';
			that.listenTo(getNotiInitGroupList, 'sync', that.setNotiInitGroupList);
			getNotiInitGroupList.fetch();
		},
		
		setNotiInitGroupList : function(method, model, options){
			var result = model.allGroup;
			if(result != "NODATA"){
				this.currentGroupList = model.allGroup;
				this.currentTargetList = model.selectedTarget;
				this.currentUserList = model.selectedUser;
				
				w2ui["event_noti_group_list"].records = model.allGroup;
				w2ui["event_noti_target_list"].records = model.selectedTarget;
				w2ui["event_noti_user_list"].records = model.selectedUser;
				w2ui['event_noti_group_list'].refresh();
				w2ui['event_noti_target_list'].refresh();
				w2ui['event_noti_user_list'].refresh();
				w2ui["event_noti_group_list"].select(1);
			}else{
				this.currentGroupList = null;
				this.currentTargetList = null;
				this.currentUserList = null;
				
				w2ui['event_noti_group_list'].clear();
				w2ui['event_noti_target_list'].clear();
				w2ui['event_noti_user_list'].clear();
				w2ui['event_noti_group_list'].refresh();
				w2ui['event_noti_target_list'].refresh();
				w2ui['event_noti_user_list'].refresh();
    			$(".chgTargetTitle").text("Target List");
    			$(".chgUserTitle").text("User List");
			}
			that.validationCheck();
		},
		
		buttonSetting : function(){
			$("#notiGroupModifyBtn").prop("disabled", true);
			$("#notiGroupDelBtn").prop("disabled", true);
			$("#notiTargetAddBtn").prop("disabled", true);
			$("#notiTargetDelBtn").prop("disabled", true);
			$("#notiUserDelBtn").prop("disabled", true);
			$("#notiUserAddBtn, #notiUserDelBtn").prop("disabled", true);
			
			$("#notiGroupModifyBtn").removeClass('link');
			$("#notiGroupDelBtn").removeClass('link');
        	$("#notiTargetAddBtn").removeClass('link');
        	$("#notiTargetDelBtn").removeClass('link');
        	$("#notiUserDelBtn").removeClass('link');
        	$("#notiUserAddBtn, #notiUserDelBtn").removeClass('link');
		},
		
		getSelectedData : function(uId){
			var selectedGroup = evtNotiGroup.selectedData;
			var selectedUid = null;
			if(undefined == uId){
				if(selectedGroup.length == 0){
					return;
				}
				selectedUid = selectedGroup[0].uId;
			}else{
				selectedUid = uId;
			}
			
			var selectedList = new Model();
			selectedList.url = 'eventNotification/getNotiSelectedList/'+selectedUid;
			that.listenTo(selectedList, 'sync', that.setNotiSelectedList);
			selectedList.fetch();
		},
		
		setNotiSelectedList : function(method, model, options){
			w2ui['event_noti_target_list'].clear();
			w2ui['event_noti_user_list'].clear();
			
			w2ui['event_noti_target_list'].records = model.selectedTargetList;
			w2ui['event_noti_user_list'].records = model.selectedUserList;
			
			w2ui['event_noti_target_list'].refresh();
			w2ui['event_noti_user_list'].refresh();
		},
		
		validationCheck : function(){
			var groupDataLen = w2ui['event_noti_group_list'].records.length;
			var targetDataLen = w2ui["event_noti_target_list"].records.length;
			
			var selectedGroupDataLen = w2ui['event_noti_group_list'].getSelection().length;
			var selectedTargetDataLen = w2ui["event_noti_target_list"].getSelection().length;
			var selectedUserDataLen = w2ui['event_noti_user_list'].getSelection().length;
			
			if("normalMode" == that.configMode){
				$(".groupBtn").css("display","block");
				$(".editGroupBtn").css("display","none");
				$("#notiGroupModifyBtn").prop("disabled", true);
	        	$("#notiGroupModifyBtn").removeClass('link');
	        	$("#notiGroupDelBtn").prop("disabled", true);
	        	$("#notiGroupDelBtn").removeClass('link');
	        	$("#notiTargetAddBtn").prop("disabled", true);
	        	$("#notiTargetAddBtn").removeClass('link');
	        	$("#notiTargetDelBtn").prop("disabled", true);
	        	$("#notiTargetDelBtn").removeClass('link');
	        	$("#notiUserAddBtn").prop("disabled", true);
	        	$("#notiUserAddBtn").removeClass('link');
	        	$("#notiUserDelBtn").prop("disabled", true);
	        	$("#notiUserDelBtn").removeClass('link');
	        	if(selectedGroupDataLen > 0 ){
					if(selectedGroupDataLen == 1){
						$("#notiGroupModifyBtn").prop("disabled", false);
						$("#notiGroupModifyBtn").addClass('link');
					}else{
						$("#notiGroupModifyBtn").prop("disabled", true);
			        	$("#notiGroupModifyBtn").removeClass('link');
					}
		        	$("#notiGroupDelBtn").prop("disabled", false);
		        	$("#notiGroupDelBtn").addClass('link');
				}
			}else if("addMode" == that.configMode){
				$(".groupBtn").css("display","none");
				$(".editGroupBtn").css("display","block");
				if(groupDataLen > 0){
					$("#notiTargetAddBtn").prop("disabled", false);
		        	$("#notiTargetAddBtn").addClass('link');
		        	
		        	$("#notiUserAddBtn").prop("disabled", false);
		        	$("#notiUserAddBtn").addClass('link');
				}
				if(selectedTargetDataLen > 0){
					$("#notiTargetDelBtn").prop("disabled", false);
		        	$("#notiTargetDelBtn").addClass('link');
				}else{
					$("#notiTargetDelBtn").prop("disabled", true);
		        	$("#notiTargetDelBtn").removeClass('link');
				}
				if(selectedUserDataLen > 0){
					$("#notiUserDelBtn").prop("disabled", false);
		        	$("#notiUserDelBtn").addClass('link');
				}else{
					$("#notiUserDelBtn").prop("disabled", true);
		        	$("#notiUserDelBtn").removeClass('link');
				}
			}else if("modifyMode" == that.configMode){
				$(".groupBtn").css("display","none");
				$(".editGroupBtn").css("display","block");
				
				$("#notiTargetAddBtn").prop("disabled", false);
	        	$("#notiTargetAddBtn").addClass('link');
	        	
	        	$("#notiUserAddBtn").prop("disabled", false);
	        	$("#notiUserAddBtn").addClass('link');
	        	
	        	if(selectedTargetDataLen > 0){
					$("#notiTargetDelBtn").prop("disabled", false);
		        	$("#notiTargetDelBtn").addClass('link');
				}else{
					$("#notiTargetDelBtn").prop("disabled", true);
		        	$("#notiTargetDelBtn").removeClass('link');
				}
				if(selectedUserDataLen > 0){
					$("#notiUserDelBtn").prop("disabled", false);
		        	$("#notiUserDelBtn").addClass('link');
				}else{
					$("#notiUserDelBtn").prop("disabled", true);
		        	$("#notiUserDelBtn").removeClass('link');
				}
			}
		},
		
		addGroupPopup : function(){
			var body = '<div class="w2ui-centered">'+
				'<div id="addGroupPopupContents" style="width:100%; height:100%" >'+
	    			'<div class="w2ui-page page-0">'+
	    				'<div class="w2ui-field">'+
		        			'<label>GROUP NAME</label>'+
		        			'<div>'+
		        				'<input name="groupName" type="text" style="width:300px;" maxlength="15"/>'+
		        			'</div>'+
		        		'</div>'+
		    		'</div>'+
		    	'</div>'+
				'<div id="addGroupPopupBottom">'+
	    			'<button id="addGroupPopupOkBtn" class="darkButton">' + BundleResource.getString('button.groupNotification.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.groupNotification.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title :  BundleResource.getString('title.groupNotification.addGroup'),
		        body: body,
		        width : 550,
		        height : 150,
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		$("#addGroupPopupBottom").html();
		        		w2ui["add_group_propterits"].render();
		        	}
		        },
		        onClose   : function(event){
		        	w2ui['add_group_propterits'].destroy();
		        }
			});
			
			$("#addGroupPopupContents").w2form({
				name : 'add_group_propterits',
				fields : [
					{name : 'groupName', type : 'text', required : true, html:{caption:'GROUP NAME'}},
				],
				record : {
					groupName : ''
				}
			});
		},
		
		addGroupOk : function(){
			var arr = w2ui['add_group_propterits'].validate();
			if(arr.length > 0){
				return;
			}
			var result = true;
			var body = null;
			var recid = w2ui['event_noti_group_list'].records.length;
			if(w2ui['add_group_propterits'] == undefined){
				return;
			}
			var newGroupName = w2ui['add_group_propterits'].record.groupName;
			$(".chgTargetTitle").text('Target List [ '+newGroupName+' ]');
			$(".chgUserTitle").text('User List [ '+newGroupName+' ]');
			if(recid > 0){
				result = that.checkSameGroupName(recid, newGroupName);
			}
			if(result && newGroupName != ""){
				that.configMode = "addMode";
				w2ui['event_noti_group_list'].selectNone();
				w2ui['event_noti_target_list'].clear();
				w2ui['event_noti_user_list'].clear();
				var uId = util.createUID();
				var groupObj = {
						recid : recid + 1,
						groupName : newGroupName,
						onOffStatus : 1,
						uId : uId
				}
				w2ui['event_noti_group_list'].add(groupObj);
				w2ui['event_noti_group_list'].refresh();
				that.validationCheck();
				w2ui['event_noti_group_list'].select(groupObj.recid);
				w2ui['event_noti_group_list'].columns[1].editable = {type : 'text'};
				w2ui['event_noti_user_list'].columns[1].editable = {type: 'list', customDisable: true, items: that.getGradeList, showAll : true};
				w2ui['event_noti_user_list'].columns[5].editable = {type : 'text'};
				w2ui['event_noti_user_list'].columns[7].editable = {type : 'text'};
				w2popup.close();
			}else{
				//동일한 Group 이름이 존재 합니다.
				body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.groupNotification.alreadyExistGroup') + '</div>'+ 
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.groupNotification.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
    	  
				w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : body
        		});
			}
		},
		
		checkSameGroupName : function(recid, newGroupName){
			var groupList = w2ui['event_noti_group_list'].records;
			var oldGroupName = _.pluck(groupList, "groupName");
			for(var i = 0; i < oldGroupName.length; i++){
				if(newGroupName == oldGroupName[i]){
					return false;
				}
			}
			return true;
		},
		
		modifyGroup : function(){
			that.validationCheck();
			if($("#notiGroupModifyBtn").prop('disabled')){
				return;
			}
			that.selectedModifyItem = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection());
			var selectedGroupName = that.selectedModifyItem[0].groupName;
			//항목을 수정 하시겠습니까?
			var bodyContents = "'"+selectedGroupName+"' "+BundleResource.getString('label.groupNotification.editItem');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="mdifyGroupOkBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.groupNotification.confirm')+'</button>'+
					'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.groupNotification.cancel')+'</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.groupNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		modifyGroupOk : function(){
			that.configMode = "modifyMode";
			w2ui['event_noti_target_list'].selectNone();
			w2ui['event_noti_user_list'].selectNone();
			$(".onOff").css("cursor","pointer");
			w2ui['event_noti_group_list'].columns[1].editable = {type : 'text'};
			w2ui['event_noti_user_list'].columns[1].editable = {type: 'list', customDisable: true, items: that.getGradeList, showAll : true};
			w2ui['event_noti_user_list'].columns[5].editable = {type : 'text'};
			w2ui['event_noti_user_list'].columns[7].editable = {type : 'text'};
			that.validationCheck();
		},
		
		deleteGroup : function(){
			that.validationCheck();
			if($("#notiGroupDelBtn").prop('disabled')){
				return;
			}
			var selectedItem = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection());
			var selectedItemLen = selectedItem.length;
			//"개의 항목을 삭제 하시겠습니까?"
			var bodyContents = selectedItemLen+BundleResource.getString('label.groupNotification.selectedItemDelete');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="deleteGroupOkBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.groupNotification.confirm')+'</button>'+
					'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.groupNotification.cancel')+'</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.groupNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		deleteGroupOk : function(){
			var selectedItem = w2ui['event_noti_group_list'].get(w2ui['event_noti_group_list'].getSelection());
			var selectedRecId = _.pluck(selectedItem, "uId");
			
			var model = new Model();
			model.set({
				recId : selectedRecId
			});
			model.url = 'eventNotification/deleteNotiGroup';
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						var	bodyContents = "";
						if(response == 100){
							bodyContents = BundleResource.getString('label.groupNotification.groupDelete'); //"삭제 되었습니다.";
						}else{
							bodyContents = BundleResource.getString('label.groupNotification.errorContents'); //"일시적인 오류가 발생 했습니다.";
						}
						var body = '<div class="w2ui-centered">'+
	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
	      				'<div class="popup-btnGroup">'+
	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.groupNotification.confirm') + '</button>'+
	      					'</div>'+
	      				'</div>' ;
						
						w2popup.open({
		            		width: 385,
		      		        height: 180,
	          		        title : BundleResource.getString('title.groupNotification.info'),
	          		        body: body,
	      	                opacity   : '0.5',
	      	         		modal     : true,
	      	    		    showClose : true,
	      	    		    onClose : function(){
	      	    		    	evtNotiGroup.getNotiInitGroupList();
	    						w2ui['event_noti_group_list'].selectNone();
	    						w2ui['event_noti_group_list'].select(1);
	      	    		    }
	    		      	});
					}
				},
				error : function(model, response){
					
				}
			})
		},
		
		addTargetPopup : function(){
			that.validationCheck();
			if($("#notiTargetAddBtn").prop('disabled')){
				return;
			}
			var bodyHTML = ''+
			'<div class="w2ui-centered content-idc">'+
				'<div id="addTargetPopupContents" style="height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
				'<div id="addTargetPopupBottom">'+
					'<button id="addTargetPopupOkBtn" class="darkButton">' + BundleResource.getString('button.groupNotification.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.groupNotification.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : BundleResource.getString('title.groupNotification.addTarget'),
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
							name : 'add_target_propterits',
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
					w2ui['add_target_propterits'].destroy();
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
			w2ui['add_target_propterits'].records = model;
			w2ui['add_target_propterits'].refresh();
		},
		
		addTargetOk : function(){
			if(w2ui['add_target_propterits'] == undefined){
				return;
			}
			var selectedData = w2ui['add_target_propterits'].get(w2ui['add_target_propterits'].getSelection());
			if(selectedData == 0){
				
			}else{
				var targetListTblData = w2ui['event_noti_target_list'].records;
				var combineData = targetListTblData.concat(selectedData); // Table Data + Selected Data
				var resultData = _.uniq(combineData, "assetId"); // Prevent duplicate items through unique "Asset ID".
				var selectedRecId = null;
				for(var i = 0; i < resultData.length; i++){
					if(undefined == resultData[i].uId){
						if("addMode" == that.configMode){
							selectedRecId = _.findLastIndex( w2ui['event_noti_group_list'].records);
							resultData[i].uId = w2ui['event_noti_group_list'].records[selectedRecId].uId;
						}else{
							selectedRecId = that.selectedModifyItem[0].recid
							resultData[i].uId = w2ui['event_noti_group_list'].records[selectedRecId-1].uId;
						}
					}
				}
				_.each(resultData, function(val, idx){
					val.recid = idx+1;
				});
				
				w2ui['event_noti_target_list'].clear();
				w2ui['event_noti_target_list'].records = resultData;
				w2ui['event_noti_target_list'].refresh();
				w2popup.close();
				that.validationCheck();
			}
		},
		
		deleteTarget : function(){
			that.validationCheck();
			if($("#notiTargetDelBtn").prop('disabled')){
				return;
			}
			
			var selectedData = w2ui['event_noti_target_list'].getSelection();
			
			w2ui['event_noti_target_list'].remove.apply(w2ui['event_noti_target_list'], selectedData); // For multi delete. Need to fix maybe.....
			w2ui['event_noti_target_list'].refresh();
			w2ui['event_noti_target_list'].selectNone();
			
			that.validationCheck();
		},
		
		addUserPopup : function(){
			that.validationCheck();
			if($("#notiUserAddBtn").prop('disabled')){
				return;
			}
			var bodyHTML = ''+
			'<div class="w2ui-centered content-idc">'+
				'<div id="addUserPopupContents" style="width:100%; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
				'<div id="addUserPopupBottom">'+
					'<button id="addUserPopupOkBtn" class="darkButton">' + BundleResource.getString('button.groupNotification.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.groupNotification.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : BundleResource.getString('title.groupNotification.addUser'),
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
							name : 'add_user_propterits',
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
								{ field: 'phone', caption: 'PHONE', size : '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							],
						});
						that.getNotiAllUserList();
					}
				},
				onClose: function () {
					w2ui['add_user_propterits'].destroy();
				}
			});
			bodyHTML = null;
		},
		
		getNotiAllUserList : function(){
			var userList = new Model();
			userList.url = 'eventNotification/getNotiAllUserList';
			that.listenTo(userList, 'sync', that.setNotiAllUserList);
			userList.fetch();
		},
		
		setNotiAllUserList : function(method, model, options){
			w2ui['add_user_propterits'].records = model;
			w2ui['add_user_propterits'].refresh();
		},
		
		addUserOk : function(){
			if(w2ui['add_user_propterits'] == undefined){
				return;
			}
			var selectedData = w2ui['add_user_propterits'].get(w2ui['add_user_propterits'].getSelection());
			if(selectedData != 0){
				for(var i = 0; i < selectedData.length; i++){
					selectedData[i].grade = 'Critical';
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
				var userListTblData = w2ui['event_noti_user_list'].records;
				var combineData = userListTblData.concat(selectedData); // Table Data + Selected Data
				var resultData = _.uniq(combineData, "userId");  // Prevent duplicate items through unique "User ID".
				var selectedRecId = null;
				for(var i = 0; i < resultData.length; i++){
					if(undefined == resultData[i].uId){
						if("addMode" == that.configMode){
							selectedRecId = _.findLastIndex( w2ui['event_noti_group_list'].records);
							resultData[i].uId = w2ui['event_noti_group_list'].records[selectedRecId].uId;
						}else{
							selectedRecId = that.selectedModifyItem[0].recid
							resultData[i].uId = w2ui['event_noti_group_list'].records[selectedRecId-1].uId;
						}
					}
				}
				
				_.each(resultData, function(val, idx){
					val.recid = idx+1;
				});
				
				w2ui['event_noti_user_list'].clear();
				w2ui['event_noti_user_list'].records = resultData;
				w2ui['event_noti_user_list'].refresh();
				w2popup.close();
				that.validationCheck();
			}
		},
		
		deleteUser : function(){
			that.validationCheck();
			if($("#notiUserDelBtn").prop('disabled')){
				return;
			}
			var selectedData = w2ui['event_noti_user_list'].getSelection();
			w2ui['event_noti_user_list'].remove.apply(w2ui['event_noti_user_list'], selectedData); // For multi delete. Need to fix maybe.....
			w2ui['event_noti_user_list'].refresh();
			w2ui['event_noti_user_list'].selectNone();
			that.validationCheck();
		},

		saveInfo : function(){
			var bodyContents = BundleResource.getString('label.groupNotification.confirmRegistration'); //"등록 하시겠습니까?";
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="savePopupOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.groupNotification.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.groupNotification.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.groupNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		saveOk : function(){
			var target, user = null;
			var group = null;
			
			if("modifyMode" == that.configMode){
				$(".onOff").css("cursor","default")
				group = that.selectedModifyItem;
			}else{ // that.configMode is "addMode"
				var addItemLen = w2ui['event_noti_group_list'].records.length;
				group = [w2ui['event_noti_group_list'].records[addItemLen-1]];
			}
			
			w2ui['event_noti_group_list'].save();  //Editable fiels need 'save()'. For apply. 
			w2ui['event_noti_user_list'].save(); //Editable fiels need 'save()'. For apply. 
			
			target = w2ui['event_noti_target_list'].records;
			user = w2ui['event_noti_user_list'].records;
			
			var notiInfo = {
				"group" : group,
				"target" : target,
				"user" : user
			};
			var model = new Model(notiInfo);
			var	bodyContents = "";
			
			if("modifyMode" == that.configMode){
				bodyContents = BundleResource.getString('label.groupNotification.editComplete'); //"수정 되었습니다.";
				model.url = "eventNotification/updateNotiInfo";
			}else{ // that.configMode is "addMode"
				bodyContents = BundleResource.getString('label.groupNotification.addComplete'); //"등록 되었습니다.";
				model.url = "eventNotification/saveNotiInfo";
			}
			
			model.save(null, {
				success : function(model, response){
					if(response != 100){
						//"일시적인 오류가 발생 했습니다."
						bodyContents = BundleResource.getString('label.groupNotification.errorContents');
					}
					var body = '<div class="w2ui-centered">'+
      				'<div class="popup-contents">'+ bodyContents +'</div>'+
      				'<div class="popup-btnGroup">'+
      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.groupNotification.confirm') + '</button>'+
      					'</div>'+
      				'</div>' ;
					
					w2popup.open({
	            		width: 385,
	      		        height: 180,
          		        title : BundleResource.getString('title.groupNotification.info'),
          		        body: body,
      	                opacity   : '0.5',
      	         		modal     : true,
      	    		    showClose : true,
      	    		    onClose : function(){
      	    		    	that.configMode = "normalMode";
      						w2ui['event_noti_group_list'].selectNone();
      						w2ui['event_noti_target_list'].selectNone();
      						w2ui['event_noti_user_list'].selectNone();
      						that.validationCheck();
      						var selectedRecId = model._previousAttributes.group[0].recid;
      						w2ui['event_noti_group_list'].select(selectedRecId);
      	    		    }
    		      	});
				},
				error : function(model, response){
					
				}
			});
			w2ui['event_noti_group_list'].columns[1].editable = false;
			w2ui['event_noti_user_list'].columns[1].editable = false;
			w2ui['event_noti_user_list'].columns[5].editable = false;
			w2ui['event_noti_user_list'].columns[7].editable = false;
		},
		
		cancelInfo : function(){
			//"취소 시 내용이 변경 되지 않습니다.";
			var bodyContents = BundleResource.getString('label.groupNotification.notChanedWhenCanceled');
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="cancelPopupOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.groupNotification.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.groupNotification.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.groupNotification.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		cancelOk : function(){
			w2ui['event_noti_group_list'].selectNone();
			
			if("modifyMode" == that.configMode){
				w2ui['event_noti_group_list'].save();
				w2ui['event_noti_group_list'].columns[1].editable = false;
				w2ui['event_noti_user_list'].columns[1].editable = false;
				w2ui['event_noti_user_list'].columns[5].editable = false;
				w2ui['event_noti_user_list'].columns[7].editable = false;
				$(".onOff").css("cursor","default")
			}else{ // Config Mode is "addMode"
				$(".chgTargetTitle").text('Target List');
				$(".chgUserTitle").text('User List');
			}
			that.configMode = "normalMode";
			evtNotiGroup.getNotiInitGroupList();
			w2popup.close();
		},
		
		changeGroupStatus : function(){
			if(w2ui['event_noti_group_list'] == undefined){
				return;
			}
			var changedData = null;
			var records = w2ui['event_noti_group_list'].records;
			var recordsLen = records.length;
			var selectedDataRecid = evtNotiGroup.selectedData[0].recid;
			
			for(var i = 0; i < recordsLen; i++){
				if(records[i].recid == selectedDataRecid){
					var groupStatus = records[i].onOffStatus;
					if(groupStatus == 0){
						w2ui['event_noti_group_list'].records[i].onOffStatus = 1;
					}else{
						w2ui['event_noti_group_list'].records[i].onOffStatus = 0;
					}
					if("normalMode" == evtNotiGroup.configMode){
						changedData = w2ui['event_noti_group_list'].records[i];
						evtNotiGroup.updateGroupStatus(changedData);
					}
				}
			}
			w2ui['event_noti_group_list'].refresh();
		},
		
		updateGroupStatus : function(changedData){
			var model = new Model(changedData);
			
			model.url = "eventNotification/updateNotiGroupStatus";
			model.save(null, {
				success : function(model, response){
					
				},
				error : function(model, response){
					
				}
			});
		},
		
		changeEmailStatus : function(event){
			if(w2ui['event_noti_user_list'] == undefined || "normalMode" == evtNotiGroup.configMode){
				return;
			}
			
			var records = w2ui['event_noti_user_list'].records;
			var recordsLen = records.length;
			var selectedDataRecid = evtNotiGroup.selectedData[0].recid;
			
			for(var i = 0; i < recordsLen; i++){
				if(records[i].recid == selectedDataRecid){
					var emailStatus = records[i].emailStatus;
					var phoneStatus = records[i].phoneStatus;
					if(emailStatus == 0){
						w2ui['event_noti_user_list'].records[i].emailStatus = 1;
					}else{
						w2ui['event_noti_user_list'].records[i].emailStatus = 0;
					}
				}
			}
			w2ui['event_noti_user_list'].refresh();
		},
		
		changePhoneStatus : function(){
			if(w2ui['event_noti_user_list'] == undefined || "normalMode" == evtNotiGroup.configMode){
				return;
			}
			
			var records = w2ui['event_noti_user_list'].records;
			var recordsLen = records.length;
			var selectedDataRecid = evtNotiGroup.selectedData[0].recid;
			
			for(var i = 0; i < recordsLen; i++){
				if(records[i].recid == selectedDataRecid){
					var emailStatus = records[i].emailStatus;
					var phoneStatus = records[i].phoneStatus;
					if(phoneStatus == 0){
						w2ui['event_noti_user_list'].records[i].phoneStatus = 1;
					}else{
						w2ui['event_noti_user_list'].records[i].phoneStatus = 0;
					}
				}
			}
			w2ui['event_noti_user_list'].refresh();
		},
		
		removeEventListener : function(){
			$(document).off("click", "#notiGroupAddBtn");
			$(document).off("click", "#addGroupPopupOkBtn");
			$(document).off("click", "#notiGroupModifyBtn");
			$(document).off("click", "#mdifyGroupOkBtn");
			$(document).off("click", "#notiGroupDelBtn");
			$(document).off("click", "#deleteGroupOkBtn");
			$(document).off("click", "#notiTargetAddBtn");
			$(document).off("click", "#addTargetPopupOkBtn");
			$(document).off("click", "#notiTargetDelBtn");
			$(document).off("click", "#notiUserAddBtn");
			$(document).off("click", "#addUserPopupOkBtn");
			$(document).off("click", "#notiUserDelBtn");
			$(document).off("click", "#notiGtoupSaveBtn");
			$(document).off("click", "#savePopupOkBtn");
			$(document).off("click", "#notiGroupCancelBtn");
			$(document).off("click", "#cancelPopupOkBtn");
			$(document).off("click", "#groupOnOffBtn");
			$(document).off("click", "#emailOnOffBtn");
			$(document).off("click", "#phoneOnOffBtn");
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
			if(w2ui['event_noti_group_layout']){
				w2ui['event_noti_group_layout'].destroy();
			}
			if(w2ui['event_noti_target_list']){
				w2ui['event_noti_target_list'].destroy();
			}
			if(w2ui['event_noti_group_list']){
				w2ui['event_noti_group_list'].destroy();
			}
			if(w2ui['event_noti_user_list']){
				w2ui['event_noti_user_list'].destroy();
			}
			if(w2ui['add_target_propterits']){
				w2ui['add_target_propterits'].destroy();
			}
			if(w2ui['add_user_propterits']){
				w2ui['add_user_propterits'].destroy();
			}
			this.removeEventListener();
			that = null;
			evtNotiGroup = null;
			
			this.undelegateEvents();
		}
	});
	return Main;
});