define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/roleManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/management/roleManager"
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
		url : 'menu',
		parse : function(result){
			return {data : result};
		}
	});
	
/*	var roleModel = Backbone.Model.extend({
		url : 'role',
		parse : function(result){
			return {data : result};
		}
	});*/
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		that = this;
    		this.collection = null;
			this.xFlug = true;
    		this.$el.append(JSP);
    		this.selectItem = null;
			this.allMenu = null;
			this.treeMenu = null;
			this.privilegeList = null;
			this.select = null;
			this.firstVisit = true;
			this.menuCheckboxMode = false;
			this.use = {};
			this.use = [];
			this.menuparam = {};
			this.currentSP = null;
			this.checkList = null;
			this.groupSP = null;
			
    		this.init();
    		this.start();
    		this.elements = {
    				scene : null,
    				editorMode : false
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
        		$("#leftContents").css("height", "100%");
        		$("#leftContents").find(".dashboard-panel").css("height", "calc(100% - 40px)");
        		$("#leftContents").find(".dashboard-contents").css("height", "calc(100% - 40px)");
        		$("#leftContents").find(".dashboard-contents > .w2ui-reset w2ui-sidebar").css("height", "100%");
//        		$("#leftBottom").css("height", "100%");
//        		$("#mainBottom").css("height", "calc(100% - 40px)");
        		$("#openCloseStatus > div > label > label").css("width","0px");
        	} 
        },
        
        init : function(){
        	roleMgr = this;
        	
        	$("#roleContentsDiv").w2layout({
				name : 'roleMgr_layout',
				panels : [
					{type:'left', size:'35%', resizable: false, content:'<div id="leftContents"></div>'},
					{type:'main', size:'30%', resizable: false, content:'<div id="mainContents"></div>'},
					{type:'right', size:'35%', content:'<div id="rightContents"></div>'}
				]
			});
        	
        	$("#leftContents").w2layout({
        		name : 'roleMgr_left_layout',
        		panels : [
        			{type:'top', size:'50%', resizable: false, minSize:'50%', content:'<div id="leftTopContents"></div>'},
        			{type:'main', resizable: false, content:'<div id="leftBottomContents"></div>'}
        		]
        	});
        	
        	/* Group List */
        	var leftTopContents = '<div id="leftTop">'+
											'<i id="groupAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
											'<i id="groupDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
										'</div>'+
										'<div class="dashboard-panel" style="width:100%; height:88%;">'+
								    		'<div class="dashboard-title">Group List</div>'+
								    		'<div class="dashboard-contents">'+
								    			'<div id="leftGroup"></div>'+
								    		'</div>'+
								    	'</div>';
        	
        	/* Assigned User List */
        	var leftBottomContents = '<div id="leftBottom">'+
											'</div>'+
											'<div class="dashboard-panel" style="width:100%; height:99%;">'+
									    		'<div class="dashboard-title">Assigned User List'+
									    			'<div id="userGroupBtn">'+
											    		'<i id="userAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" disabled="disabled" title="Add"></i>'+
														'<i id="userDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
													'</div>'+
												'</div>'+
									    		'<div class="dashboard-contents">'+
									    			'<div id="leftUser"></div>'+
									    		'</div>'+
									    		/*'<div class="disableClass"></div>'+*/
									    	'</div>';
        	
        	/* Menu List */
			var mainContents = '<div id="mainTop">'+
										'<div class="menuButtons">'+
											'<i id="menuMgrAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
											'<i id="menuMgrDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
											'<i id="menuMgrModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Modify"></i>'+
											'<i id="menuMgrSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save" style="display:none;"></i>'+
		    					    		'<i id="menuMgrCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel" style="display:none;"></i>'+
										'</div>'+
									'</div>'+
							    	'<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title">Menu List</div>'+
							    		'<div class="dashboard-contents">'+
								    		'<div id="mainBottom"></div>'+
								    		'<div id="virMainBottom"></div>'+
								    	'</div>'+
							    	'</div>';
			
			/* Menu Detail Info */
	    	var rightContents = '<div id="rightTop" style="width:100%;">'+//height:100%;
	    								'<i id="menuDetailModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Modify"></i>'+
	    								'<i id="menuDetailSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save" style="display:none;"></i>'+
	    					    		'<i id="menuDetailCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel" style="display:none;"></i>'+
	    							'</div>'+
    								'<div id="rightBottom">'+
								    	'<div class="dashboard-panel" style="width:100%;">'+
								    		'<div class="dashboard-title">Menu Detail Info</div>'+
								    		'<div class="dashboard-contents" style="position:relative;">'+
									    		'<div class="w2ui-contents" id="menuDetailInfo">'+	
									    			'<div class="w2ui-page page-0">'+
											            '<div class="w2ui-field">'+
											            	'<label>PARENT ID</label>'+
												            '<div>'+
												            	'<input name="parent" type="text" maxlength="100" size="60"/>'+
												            '</div>'+
											            '</div>'+
											    		'<div class="w2ui-field">'+
												            '<label>MENU NAME</label>'+
												            '<div>'+
												            	'<input name="menuName" type="text" maxlength="100" size="60"/>'+
												            '</div>'+
											            '</div>'+
											            '<div class="w2ui-field">'+
											                '<label>MENU ID</label>'+
											                '<div>'+
											                    '<input name="menuId" type="text" maxlength="100" size="60"/>'+
											                '</div>'+
											            '</div>'+
											            '<div class="w2ui-field">'+
											                '<label>URL</label>'+
											                '<div>'+
											                	'<input name="url" type="text" maxlength="100" size="60"/>'+
											                '</div>'+
											            '</div>'+
											            '<div class="w2ui-field">'+
											                '<label>PRIVILEGE</label>'+
											                '<div>'+
											                	'<input name="privilegeId" type="text" maxlength="100" size="60"/>'+
											                '</div>'+
											            '</div>'+
											            '<div class="w2ui-field">'+
											                '<label>SORT ORDER</label>'+
											                '<div>'+
											                	'<input name="sortOrder" type="text" maxlength="100" size="60"/>'+
											                '</div>'+
											            '</div>'+
											            '<div class="w2ui-field">'+
											                '<label>DESCRIPTION</label>'+
											                '<div>'+
											                	'<input name="description" type="text" maxlength="100" size="60"/>'+
											                '</div>'+
											            '</div>'+
											           /* '<div id="openCloseStatus" class="w2ui-field">'+
											                '<label>STATUS</label>'+
												            '<div class="w2ui-field">'+
										    					'<label><input type="radio" id="openedMenu" name="menuStatus" readonly="readonly" value="1" /><label>OPENED</label></label>'+
										    					'<label><input type="radio" id="closedMenu" name="menuStatus" readonly="readonly" value="0" /><label>CLOSED</label></label>'+
										    				'</div>'+
											            '</div>'+*/
											            '<div id="startPage" class="w2ui-field">'+
											                '<label>START PAGE</label>'+
												            '<div class="w2ui-field">'+
										    					'<label><input type="checkbox" id="startPageCheck" name="startPage" readonly="readonly" /><label>CHOOSE</label></label>'+
										    				'</div>'+
											            '</div>'+
											        '</div>'+
										       '</div>'+
										       "<div class='disableClass'></div>"+
										       '</div>'+
									    	'</div>'+
								    	'</div>';
	    	
			$("#rightContents").html(rightContents);
			$("#mainContents").html(mainContents);
			$("#leftTopContents").html(leftTopContents);
			$("#leftBottomContents").html(leftBottomContents);
			
			$("#leftGroup").w2grid({
				name : 'roleGroupList',
				show : {
					footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '100px', sortable: true, attr: 'align=center'},
         			{ field: 'groupName', caption: 'GROUP NAME', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'startPage', caption: 'START PAGE', hidden : true}
				],
				onClick : function(event){
					event.onComplete = function(){
						roleMgr.validationCheckGrid();
						roleMgr.validationCheckMenu();
						roleMgr.getSelectedList();
						w2ui['menuTree'].unselect();
						$("#menuMgrDelBtn").prop("disabled", true);
						$("#menuMgrDelBtn").removeClass('link');
						$("#menuDetailModifyBtn").prop("disabled", true);
						$("#menuDetailModifyBtn").removeClass('link');
						//Menu Detail Info 내용 비워줌
						w2ui['menuDetailProperties'].clear();
						$("#startPage").hide();
					}
				},
				onSelect : function(event){
					that.validationCheckGrid();
	        		roleMgr.validationCheckMenu();
	        		that.getSelectedList();
				}
			});
			
			$("#leftUser").w2grid({
				name : 'roleAssignedUserList',
				show : {
					footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true
				},
				recordHeight : 30,
				blankSymbol : "-",
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'userId', caption: 'USER ID', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
         			{ field: 'userName', caption: 'USER NAME', size : '200px', sortable: true, attr: 'align=center'},
         			{ field: 'privilegeName', caption: 'PRIVILEGE', size : '200px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}
				]
			});
			
			$('#menuDetailInfo').w2form({ 
        		name : 'menuDetailProperties',
    			focus : -1,
    			fields : [
    				//{name:'parentName', type: 'text', disabled:true, required:false, html:{caption:'PARENT NAME'}},
    				{name:'parent', type: 'text', disabled:true, required:false, html:{caption:'PARENT ID'}},
    				{name:'menuName', type: 'text', disabled:true, required:true, html:{caption:'MENU NAME'}},
					{name:'menuId', type: 'text', disabled:true, html:{caption:'MENU ID'}},
					{name:'url', type: 'text', disabled:true, required:false, html:{caption:'URL'}},
					{name:'privilegeId', type: 'list', /*disabled:true, */required:true, 
						html:{caption:'PRIVILEGE'}}, 
						//options : {items:that.priviligeList}},
					{name:'sortOrder', type: 'text', disabled:true, required:true, html:{caption:'SORT ORDER'}},
					{name:'description', type: 'text', disabled:true, required:false, html:{caption:'DESCRIPTION'}}
					//{name:'usingMenu', type: 'text', disabled:true, required:false, html:{caption:'STATUS'}}
    			],
    			record:{
    				menuId:'',
    				parent:'',
    				menuName:'',
    				url:'',
    				privilegeId:'',
    				sortOrder:'',
    				description:''
				}
            });
			
			w2ui["roleGroupList"].onDblClick = this.editGroupPopup;
			
			that.select = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection());
			
			w2ui["roleGroupList"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
				that.validationCheckGrid();
				roleMgr.validationCheckMenu();
				/*if(startPage == undefined){
					w2ui['roleGroupList'].click(1);
				}*/
        	});
        	
        	w2ui["roleGroupList"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheckGrid();
        		roleMgr.validationCheckMenu();
//        		that.getSelectedList();
        	});
        	
        	w2ui["roleGroupList"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
				that.validationCheckGrid();
				roleMgr.validationCheckMenu();
        	});
        	
        	w2ui["roleAssignedUserList"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheckGrid();
        	});
        	
        	w2ui["roleAssignedUserList"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheckGrid();
        	});
        	
        	w2ui["roleAssignedUserList"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheckGrid();
        	});
			
			$("#groupDelBtn").prop("disabled", true);
			$("#groupDelBtn").removeClass('link');
			$("#userAddBtn").prop("disabled", true);
			$("#userAddBtn").removeClass('link');
			$("#userDelBtn").prop("disabled", true);
			$("#userDelBtn").removeClass('link');
			$("#menuMgrModifyBtn").prop("disabled", true);
			$("#menuMgrModifyBtn").removeClass('link');
			$("#menuMgrDelBtn").prop("disabled", true);
			$("#menuMgrDelBtn").removeClass('link');
        	$("#menuDetailModifyBtn").prop("disabled", true);
        	$("#menuDetailModifyBtn").removeClass('link');
        	
        	$("#startPage").hide();
        	//$("#menuDetailInfo.w2ui-field-helper").addClass('readonlyEffect');
        	
        },
        
        events: {
        	/* Group */
        	'click #groupAddBtn' : 'addGroupPopup',
        	'click #groupDelBtn' : 'deleteGroupPopup',
        	/* Assinged User */
        	'click #userAddBtn' : 'addUserPopup',
        	'click #userDelBtn' : 'deleteUserPopup',
    		/* Menu */
    		'click #menuMgrAddBtn' : 'addMenu',
    		'click #menuMgrDelBtn' : 'deleteMenuConfirm',
    		'click #menuMgrModifyBtn' : 'modifyMenuCheck',
    		/* Menu Detail Info */
    		'click #menuDetailModifyBtn' : 'modifyMenu'
        },
        
        eventListenerRegister : function(){
        	
        	// Menu List CheckBox Click
        	$(document).on("change", ".menu-tree-checkbox", function(event){
        		var targetRowNum = w2ui['virMenuTree'].get($(event.target).attr("rownum"));

        		if(targetRowNum.useYN){
        			targetRowNum.useYN = false;
        		}else{
        			targetRowNum.useYN = true;
        		}
        		
        		var childNodes = targetRowNum.nodes;
        		var childNodesId = [];
        		var resultNodesId = []; // Selected All Id
        		var resultNodes = []; // Selected All Data
        		
        		//------------------------------------------ Check Box -----------------------------------------------
        		var checkNodeFunc = function(targetNodes, target){
        			if(target != undefined && target.id != -1){
        				resultNodesId.push(target.id);
            			resultNodes.push(target);
        			}
        			
        			for(var i = 0; i<targetNodes.length; i++){
        				targetNodes[i].useYN = targetRowNum.useYN;
        				resultNodesId.push(targetNodes[i].id);
        				resultNodes.push(targetNodes[i]);
        				if(targetNodes[i].nodes.length > 0){
        					checkNodeFunc(targetNodes[i].nodes);
        				}
        			}
        			return resultNodesId;
        		}
        		
        		if(childNodes.length > 0){ // Child O
        			childNodesId = checkNodeFunc(targetRowNum.nodes, targetRowNum);
        		}else{ // Child X
        			resultNodesId.push(targetRowNum.id);
        			resultNodes.push(targetRowNum);
        		}
        		
        		if(childNodes.length > 0){
	        		if(targetRowNum.useYN){
	    				_.each(childNodesId, function(val){
	        				$("#node_"+val+" input").prop("checked",true);
	        			})
	    			}else{
	    				_.each(childNodesId, function(val){
	        				$("#node_"+val+" input").prop("checked",false);
	        			})
	    			}
        		}else{
        			var parentChecked = _.pluck(targetRowNum.parent.nodes, "useYN"); // Configure parent checked
        			var checkedData = _.intersection(parentChecked); //return [true], [false], [true, false], [false, true]
        			var parentId = 0;
        			var changeParentUseValue = 0;
        			
    				if(checkedData.length == 1){
    					if(checkedData[0]){ //[true] case
    						targetRowNum.parent.useYN = true;
        					parentId = targetRowNum.parent.id;
            				$("#node_"+parentId+" input").prop("checked",true);
    					}else{ //[false] case
    						targetRowNum.parent.useYN = false;
        					parentId = targetRowNum.parent.id;
            				$("#node_"+parentId+" input").prop("checked",false);
    					}
    				}else{ // [true, false], [false, true] case
    					targetRowNum.parent.useYN = true;
    					parentId = targetRowNum.parent.id;
        				$("#node_"+parentId+" input").prop("checked",true);
    				}
    				
    				changeParentUseValue = _.findIndex(roleMgr.use, {menuId : parentId});
					if(changeParentUseValue != -1){
						roleMgr.use[changeParentUseValue].useYN = targetRowNum.parent.useYN;
					}else{
						roleMgr.use.push({ menuId : targetRowNum.parent.id, useYN : targetRowNum.parent.useYN, privilegeId : targetRowNum.parent.privilegeId });
					}
        		}
        		//----------------------------------------------------------------------------------------------------------
        		
        		//------------------------------------ Setting Menu Using or Not using -------------------------------------
        		if(roleMgr.use.length > 0){
        			var menuId = _.pluck(roleMgr.use, "menuId");
        			var matchValue = _.intersection(menuId, resultNodesId); //Check duplicate
        			if(matchValue.length > 0){ // Duplicate O (Check Exist or Not exist)
        				_.each(resultNodesId, function(val,idx){
    						var index = _.findIndex(roleMgr.use, {menuId : val});
    						if(index != -1){ // Duplicate O (For example, There are five out of ten)
    							roleMgr.use[index].useYN = resultNodes[idx].useYN;
    						}else{ // Duplicate X
    							roleMgr.use.push({ menuId : resultNodes[idx].id, useYN : resultNodes[idx].useYN, privilegeId : resultNodes[idx].privilegeId });
    						}
    					})
        			}else{ // Duplicate X
        				_.each(resultNodesId, function(val, idx){
    						roleMgr.use.push({ menuId : resultNodes[idx].id, useYN : resultNodes[idx].useYN, privilegeId : resultNodes[idx].privilegeId });
    					})
        			}
        		}else{
        			_.each(resultNodesId, function(val, idx){
						roleMgr.use.push({ menuId : resultNodes[idx].id, useYN : resultNodes[idx].useYN, privilegeId : resultNodes[idx].privilegeId });
					})
        		}
        		//--------------------------------------------------------------------------------------------------------------------
        		// 다른 방법
        		//roleMgr.menuparam[targetRowNum.menuName] = { menuId : targetRowNum.menuId, useYN : targetRowNum.useYN, privilegeId : targetRowNum.privilegeId };
        	});

        	// Group
        	$(document).on("click", "#addGroupPopupOkBtn", this.addGroupOk);
        	$(document).on("click", "#deleteGroupOkBtn", this.deleteGroupOK);
        	$(document).on("click", "#editGroupPopupOkBtn", this.editGroupOK);
        	
        	// Assigned User
        	$(document).on("click", "#addAssignedUserPopupOkBtn", this.addUserOK);
        	$(document).on("click", "#deleteUserOkBtn", this.deleteUserOK);
        	
        	// Menu 
        	$(document).on("click", "#menuAddPopupOkBtn", this.validateCheckFunc);
			$(document).on("click", "#menuMgrDeleteOkBtn", this.deleteMenu);
			
			// Menu Checkbox
			$(document).on("click", "#menuMgrSaveBtn", this.saveMenuCheck);
			$(document).on("click", "#menuMgrCancelBtn", this.cancelMenuCheck);
			$(document).on("click", "#menuCheckCancelOKBtn", this.menuCheckCancelOK);
			
			// Menu Detail Info
			$(document).on("click", "#menuDetailSaveBtn", this.saveModifyMenu);
			$(document).on("click", "#menuDetailCancelBtn", this.cancelConfirm);
			$(document).on("click", "#menuDetailCancelOKBtn", this.cancelModifyMenu);
        },
        
        removeEventListener : function(){
        	
        	// Group
			$(document).off("click", "#addGroupPopupOkBtn");
			$(document).off("click", "#deleteGroupOkBtn");
			$(document).off("click", "#editGroupPopupOkBtn");
        	
			// Assigned User
			$(document).off("click", "#addAssignedUserPopupOkBtn");
			$(document).off("click", "#deleteUserOkBtn");
			
        	// Menu
			$(document).off("click", "#menuAddPopupOkBtn");
			$(document).off("click", "#menuMgrDeleteOkBtn");
			
			// Menu Checkbox
			$(document).off("change", ".menu-tree-checkbox");
			$(document).off("click", "#menuMgrSaveBtn");
			$(document).off("click", "#menuMgrCancelBtn");
			$(document).off("click", "#menuCheckCancelOKBtn");
			
			// Menu Detail Info
			$(document).off("click", "#menuDetailSaveBtn");
			$(document).off("click", "#menuDetailCancelBtn");
			$(document).off("click", "#menuDetailCancelOKBtn");
        },
        
        start : function() {
        	this.createMenuTree();
        	this.virCreateMenuTree();
			this.getMenuStatus();
			this.getPrivilegeList();
        	this.eventListenerRegister();
        	this.getData();
        },
        
        getData : function(){
//        	this.listNotifiCation("getGroupInfo");
        	this.listNotifiCation("getInitGroupInfo");
        	this.listNotifiCation("getSelectedList");
        },
        
        listNotifiCation : function(cmd){
			switch(cmd){
				/*case "getGroupInfo" : // 그룹 리스트
	    			this.getGroupInfo();
	    			break;*/
				case "getInitGroupInfo" :
					this.getInitGroupInfo();
					break;
				case "getUserAllList" : // 모든 사용자 리스트
	    			this.getUserAllList();
	    			break;
				case "getSelectedList" : // 선택한 그룹에 따른 사용자, 메뉴 리스트
					this.getSelectedList();
					break;
			}
		},
        
        getSelectedList : function(selectRecord){
        	var selectedGroupId = null;
        	if(roleMgr.firstVisit){
        		selectedGroupId = 'y-94efaa76-d301-2338-9b7a-d469fa449e73';
        		roleMgr.firstVisit = false;
        	}else{
        		var selectItem = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection());
        		if(selectItem.length != 1){
	    			return;
	    		}
        		if(selectItem == undefined){
        			selectedGroupId = that.select[0].groupId;
        		}else{
        			selectedGroupId = selectItem[0].groupId;
        		}
        	}
        	
        	
        	var selectedModel = new Model();
        	selectedModel.url = 'role/getSelectedList/' + selectedGroupId;
        	selectedModel.fetch();
        	that.listenTo(selectedModel, 'sync', that.setSelectedList);
        	
        	if(w2ui['virMenuTree']){
        		w2ui['virMenuTree'].destroy();
        	}
        	roleMgr.virCreateMenuTree();
        	roleMgr.getUseYNMenuStatus(selectedGroupId);
        },
        
        setSelectedList : function(method, model, options){
        	w2ui['roleAssignedUserList'].clear();
        	w2ui['roleAssignedUserList'].records = model.selectedUserList;
        	w2ui['roleAssignedUserList'].refresh();
        	
			
			roleMgr.startPageDisplay();
			
			// 전체 체크 해제
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.checked = false);
			// Menu Checkbox Disabled
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
			
			roleMgr.checkList = _.where(model.getSelectedMenuCheckList, {useYN : 1});
			roleMgr.use = [];
			for(var i in roleMgr.checkList){
				var item = roleMgr.checkList[i];
				var useYN = null;
				if(item.useYN == 1){ useYN = true; }
				else{ useYN = false; }
				roleMgr.use.push({ menuId : item.menuId.toString(), useYN : useYN, privilegeId : item.privilegeId });
			}
			roleMgr.use.push({ menuId : "-1", useYN : true, privilegeId : undefined });
			if(roleMgr.checkList.length > 0){ // if(roleMgr.checkList.length == model.getSelectedMenuCheckList.length){
				$("#node_-1 input").prop("checked", true);
			}
			for(var i = 0; i < roleMgr.checkList.length; i++){
				$("#node_"+roleMgr.checkList[i].menuId+" input").prop("checked", true);
			}
			
			var allMenuPK = _.pluck(roleMgr.allMenu, "menuId");
			var checkListPK = _.pluck(roleMgr.checkList, "menuId");
			var common = _.intersection(allMenuPK, checkListPK);
			
			_.each(allMenuPK, function(val, idx){
				var reset = _.findIndex(roleMgr.allMenu, {menuId : val});
				roleMgr.allMenu[reset].useYN = false;
			});
			
			_.each(common, function(val, idx){
				var apply = _.findIndex(roleMgr.allMenu, {menuId : val});
				roleMgr.allMenu[apply].useYN = true;
			});
        },
        
        startPageDisplay : function(){
        	let item = null;
        	if(w2ui["roleGroupList"] && w2ui["roleGroupList"].records.length > 0 ){
        		if(roleMgr.currentSP != undefined && roleMgr.currentSP != null){
        			roleMgr.clearSP(roleMgr.currentSP);
        		}
        		item = w2ui["roleGroupList"].get(w2ui["roleGroupList"].getSelection())[0];
        		if(item.startPage != undefined){
        			w2ui["menuTree"].get(item.startPage).count = 1;
        			w2ui["menuTree"].refresh();
        			$('.w2ui-node-count').html("");
        			roleMgr.currentSP = item.startPage; // 기존 Start Page
        		}
        	}
        },
        
        clearSP : function(currentSP){
        	w2ui["menuTree"].get(currentSP).count = null;
        	w2ui["menuTree"].refresh();
        },
        
        addGroupPopup : function(){
        	roleMgr.validationCheckMode(roleMgr.menuCheckboxMode);
        	if($("#groupAddBtn").prop('disabled')){
        		return;
        	}
			var body = '<div class="w2ui-centered">'+
				'<div id="addGroupPopupContents" style="width:100%; height:100%" >'+
	    			'<div class="w2ui-page page-0">'+
	    				'<div class="w2ui-field">'+
		        			'<label>GROUP NAME</label>'+
		        			'<div>'+
		        				'<input name="groupName" type="text" style="width:300px;" />'+
		        			'</div>'+
		        		'</div>'+
		    		'</div>'+
		    	'</div>'+
				'<div id="addGroupPopupBottom">'+
	    			'<button id="addGroupPopupOkBtn" class="darkButton">'+ BundleResource.getString('button.roleManager.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">'+ BundleResource.getString('button.roleManager.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title :  BundleResource.getString('title.roleManager.addGroup'),
		        body : body,
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
			var resultAC = null;
			var arr = w2ui['add_group_propterits'].validate();
			
			if(arr.length > 0){
				return;
			}else{
				var dataProvider = w2ui['roleGroupList'].records;
				var item = w2ui['add_group_propterits'].record;
				
				if(dataProvider.length > 0){
					// 중복 체크
					resultAC = _.filter(dataProvider, function(obj){
						return obj.groupId === item.groupId;
					});
				}
				
				if(resultAC !== null &&  resultAC.length > 0){
					// 중복된 내용이 있다.
	        		w2popup.message({ 
	        	        width   : 360, 
	        	        height  : 220,
	        	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">'+BundleResource.getString('label.roleManager.alreadyExistGroup')+'</div>'+
	        	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.roleManager.confirm') + '</button>'
	        	    });
				}else{
					var groupId = util.createUID();
					item = {
							groupId : groupId,
							groupName : item.groupName
					}
					var model = new Model(item);
					model.url = 'role/insertRoleGroup';
					model.save({}, {
						success : function(model, response, options){
							if(response == 100){
								roleMgr.listNotifiCation("getInitGroupInfo");
								w2popup.close();
							}
						},
						error : function(model, xhr, options){
							console.log("Add Group Error");
						}
					});
				}
			}
		},
		
		deleteGroupPopup : function(){
			roleMgr.validationCheckGrid();
        	if($("#groupDelBtn").prop('disabled')){
        		return;
        	}
        	
        	var dataProvider = w2ui["roleGroupList"].get(w2ui["roleGroupList"].getSelection());
        	
        	var bodyContents = "";
        	var body = "";
        	if(dataProvider.length > 0){
        		bodyContents = BundleResource.getString('label.roleManager.selected') + dataProvider.length + BundleResource.getString('label.roleManager.selectedItemDelete');
        		//"선택된 "+ dataProvider.length+"개의 항목을 삭제 하시겠습니까?";
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="roleMgr-popup-btnGroup">'+
						'<button id="deleteGroupOkBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.roleManager.confirm')+'</button>'+
						'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.roleManager.cancel')+'</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.roleManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		deleteGroupOK : function(){
			var selectedItem = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection());
			var selectedRecId = _.pluck(selectedItem, "groupId");
			var item = {
					recId : selectedRecId,
					baseId : 'y-94efaa76-d301-2338-9b7a-d469fa449e73'
			}
			var model = new Model(item);
			model.url = 'role/deleteRoleGroup';
			model.save(null, {
				success : function(model, response){
					if(response == 100){
						roleMgr.listNotifiCation("getInitGroupInfo");
					}
				},
				error : function(model, xhr, options){
					console.log("Delete Group Error");
				}
			});
		},
		
		editGroupPopup : function(event){
			var groupName = w2ui["roleGroupList"].get(event.recid).groupName;
			
			if(groupName == 'Base Group'){
				return;
			}
			var body = '<div class="w2ui-centered">'+
							'<div id="editGroupPopupContents" style="width:100%; height:100%" >'+
				    			'<div class="w2ui-page page-0">'+
				    				'<div class="w2ui-field">'+
					        			'<label>GROUP NAME</label>'+
					        			'<div>'+
					        				'<input name="groupName" type="text" style="width:300px;" />'+
					        			'</div>'+
					        		'</div>'+
					    		'</div>'+
					    	'</div>'+
							'<div id="editGroupPopupBottom">'+
				    			'<button id="editGroupPopupOkBtn" class="darkButton">'+ BundleResource.getString('button.roleManager.save') + '</button>'+
				    			'<button onclick="w2popup.close();"  class="darkButton">'+ BundleResource.getString('button.roleManager.close') + '</button>'+
							'</div>'+
						'</div>';
		
			w2popup.open({
				title :  BundleResource.getString('title.roleManager.editGroup'),
		        body : body,
		        width : 550,
		        height : 150,
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		$("#editGroupPopupBottom").html();
		        		w2ui["edit_group_propterits"].render();
		        	}
		        },
		        onClose   : function(event){
		        	w2ui['edit_group_propterits'].destroy();
		        }
			});
			
			$("#editGroupPopupContents").w2form({
				name : 'edit_group_propterits',
				fields : [
					{name : 'groupName', type : 'text', required : true, html:{caption:'GROUP NAME'}},
				],
				record : {
					groupName : groupName
				}
			});
		},
		
		editGroupOK : function(){
			var resultAC = null;
			var arr = w2ui['edit_group_propterits'].validate();
			
			if(arr.length > 0){
				return;
			}else{
				var dataProvider = w2ui['roleGroupList'].records;
				var item = w2ui['edit_group_propterits'].record;
				
				var selectItem = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection())[0];
				
				if(dataProvider.length > 0){
					// 중복 체크
					resultAC = _.filter(dataProvider, function(obj){
						return obj.groupId === item.groupId;
					});
				}
				
				if(resultAC !== null &&  resultAC.length > 0){
					// 중복된 내용이 있다.
	        		w2popup.message({ 
	        	        width   : 360, 
	        	        height  : 220,
	        	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">'+BundleResource.getString('label.roleManager.alreadyExistGroup')+'</div>'+
	        	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.roleManager.confirm') + '</button>'
	        	    });
				}else{
					var result = {
							groupId : selectItem.groupId,
							groupName : item.groupName
					}
					
					var model = new Model(result);
					model.url = 'role/updateRoleGroup';
					model.save({}, {
						success : function(model, response, options){
							if(response == 100){
								roleMgr.getInitGroupInfo();
//								roleMgr.listNotifiCation("getSelectedList");
								w2popup.close();
							}
						},
						error : function(model, xhr, options){
							console.log("Edit Group Error");
						}
					});
				}
			}
		},
		
		addUserPopup : function(){
			roleMgr.validationCheckGrid();
			if($("#userAddBtn").prop('disabled')){
        		return;
        	}
			
			var groupName = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection())[0].groupName;
			
			var body = '<div class="w2ui-centered">'+
							'<div id="addUserPopupContents" style="width:100%; height:100%;" >'+
				    			'<div class="w2ui-page page-0">'+
				    			
				    				'<div class="w2ui-field">'+
					        			'<label>GROUP NAME</label>'+
					        			'<div>'+
					        				'<input name="groupName" type="text" style="width:342px;" disabled="disabled" />'+
					        			'</div>'+
					        		'</div>'+
					        		
					        		'<div class="w2ui-field" style="height: 350px;">'+
					        			'<label>ASSIGNED USER</label>'+
					        			'<div id="userAllList">'+
					        			
					        			'</div>'+
					        		'</div>'+
					        		
					    		'</div>'+
					    	'</div>'+
							'<div id="addUserPopupBottom">'+
				    			'<button id="addAssignedUserPopupOkBtn" class="darkButton">'+ BundleResource.getString('button.roleManager.save') + '</button>'+
				    			'<button onclick="w2popup.close();"  class="darkButton">'+ BundleResource.getString('button.roleManager.close') + '</button>'+
							'</div>'+
						'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.roleManager.addAssignedUser'),
				body : body,
				width : 600,
		        height : 525,
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		$("#addUserPopupBottom").html();
		        		roleMgr.listNotifiCation("getUserAllList");
		        	}
		        },
		        onClose   : function(){
		        	w2ui['add_user_propterits'].destroy();
		        	w2ui['userAllList'].destroy();
		        }
			});
			
			$("#addUserPopupContents").w2form({
				name : 'add_user_propterits',
				fields : [
					{name : 'groupName', type : 'text', html:{caption:'GROUP NAME'}}
				],
				record : {
					groupName : groupName
				},
				onRender : function(event){
					event.onComplete = function(event){
						$("#userAllList").w2grid({
		        			name : 'userAllList',
		        			style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
		        			show : {
		        				footer:false,
		        				toolbarSearch:false,
		        				toolbarReload  : false,
		        				searchAll : false,
		        				toolbarColumns : false,
		        				selectColumn: true
		        			},
		        			recordHeight : 30,
		        			blankSymbol : "-",
		        			columns : [
		        				{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
		        				{ field: 'userId', caption: 'USER ID', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
		        				{ field: 'userName', caption: 'USER NAME', size : '90px', sortable: true, attr: 'align=center'},
		        				{ field: 'privilegeName', caption: 'PRIVILEGE', size : '90px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}
		        				]
		        		});
					}
				}
			});
		},
		
		addUserOK : function(){
			var groupId = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection())[0].groupId;
			var user = w2ui['userAllList'].get(w2ui['userAllList'].getSelection());
        	var Body = "";
        	
        	if(user.length == 0){
        		
        		Body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+ BundleResource.getString('label.roleManager.noSelectedItem') + '</div>'+
					'<div class="roleMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">'+BundleResource.getString('button.roleManager.confirm')+'</button>'+
					'</div>'+
				'</div>' ;
        		
        		w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : Body
        		});
        		
        		$(".w2ui-message").css({top:"170px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        	}else{
        		var dataProvider = _.pluck(w2ui['userAllList'].get(w2ui['userAllList'].getSelection()), "userId");
        		var orgData = _.pluck(w2ui['roleAssignedUserList'].get(w2ui['roleAssignedUserList'].getSelection()), "userId");
        		
        		if(util.compare(dataProvider, orgData)){
        			console.log("같음");
        		}
        		
        		for(var i in user){
        			user[i].groupId = groupId;
        		}
        		
        		var param = {
        				user : user
        		};
        		
        		var model = new Model(param);
        		model.url = "role/updateUserGroup";
        		model.save({}, {
        			success : function(model, response, options){
        				if(response == 100){
        					roleMgr.listNotifiCation("getSelectedList");
        					w2popup.close();
        				}
        			},
        			error : function(model, xhr, options){
        				console.log("Add Assigned User Error");
        			}
        		});
        	}
		},
		
		deleteUserPopup : function(){
			roleMgr.validationCheckGrid();
			if($("#userDelBtn").prop('disabled')){
        		return;
        	}
			var dataProvider = w2ui["roleAssignedUserList"].get(w2ui["roleAssignedUserList"].getSelection());
        	
        	var bodyContents = "";
        	var body = "";
        	if(dataProvider.length > 0){
        		bodyContents = BundleResource.getString('label.roleManager.selected')+dataProvider.length+BundleResource.getString('label.roleManager.selectedItemDelete');
        			//"선택된 "+ dataProvider.length+"개의 항목을 삭제 하시겠습니까?";
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="roleMgr-popup-btnGroup">'+
						'<button id="deleteUserOkBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.roleManager.confirm')+'</button>'+
						'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.roleManager.cancel')+'</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.roleManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
			
			
		},
		
		deleteUserOK : function(){
			var user = w2ui['roleAssignedUserList'].get(w2ui['roleAssignedUserList'].getSelection());
			for(var i in user){
    			user[i].groupId = 'y-94efaa76-d301-2338-9b7a-d469fa449e73';
    		}
    		
    		var param = {
    				user : user
    		};
    		
    		var model = new Model(param);
    		model.url = "role/updateUserGroup";
    		model.save({}, {
    			success : function(model, response, options){
    				if(response == 100){
    					roleMgr.listNotifiCation("getSelectedList");
    					w2popup.close();
    				}
    			},
    			error : function(model, xhr, options){
    				console.log("Add Assigned User Error");
    			}
    		});
		},
		
		getGroupInfo : function(){
			var groupList = new Model();
			groupList.url = 'role/getGroupInfo';
			groupList.fetch();
			roleMgr.listenTo(groupList, 'sync', roleMgr.setGroupInfo);
		},
		
		setGroupInfo : function(method, model, options){
			w2ui['roleGroupList'].records = model;
			w2ui['roleGroupList'].refresh();
		},
		
		getInitGroupInfo : function(){
			var getInitGroupInfo = new Model();
			getInitGroupInfo.url = 'role/getInitGroupInfo';
			getInitGroupInfo.fetch();
			that.listenTo(getInitGroupInfo, 'sync', that.setInitGroupInfo);
		},
		
		setInitGroupInfo : function(mtehod, model, options){
			var result = model.allGroup;
			if(result != "NODATA"){
				this.currentGroupList = model.allGroup;
				this.currentUserList = model.selectedUser;
				
				w2ui['roleGroupList'].records = model.allGroup;
				w2ui['roleAssignedUserList'].records = model.selectedUser;
				w2ui['roleGroupList'].refresh();
				w2ui['roleAssignedUserList'].refresh();
				if(w2ui['roleGroupList'].getSelection()[0] == undefined || w2ui['roleGroupList'].getSelection()[0] == null){
//					w2ui['roleGroupList'].click(1);
					w2ui['roleGroupList'].select(1);
				}else{
//					w2ui['roleGroupList'].click(w2ui['roleGroupList'].getSelection()[0]);
					w2ui['roleGroupList'].select(w2ui['roleGroupList'].getSelection()[0]);
				}
			}else{
				this.currentGroupList = null;
				this.currentUserList = null;
				
				w2ui['roleGroupList'].clear();
				w2ui['roleAssignedUserList'].clear();
				w2ui['roleGroupList'].refresh();
				w2ui['roleAssignedUserList'].refresh();
			}
		},
		
		getUserAllList : function(){
			var userList = new Model();
			userList.url = 'role/getUserList';
			userList.fetch();
			roleMgr.listenTo(userList, 'sync', roleMgr.setUserAllList);
		},
		
		setUserAllList : function(mtehod, model, options){
			w2ui['userAllList'].records = model;
			w2ui['userAllList'].refresh();
			
			var selectedUserList = [];
			var selectedUserId = _.pluck(w2ui['roleAssignedUserList'].records, 'userId');
			for(var i in selectedUserId){
				if(_.where(w2ui['userAllList'].records, {userId : selectedUserId[i]})[0].userId == selectedUserId[i]){
					selectedUserList.push(_.where(w2ui['userAllList'].records, {userId : selectedUserId[i]}));
				}
			}
			for(var i in selectedUserList){
				w2ui['userAllList'].select(selectedUserList[i][0].recid);
			}
		},
		
		modifyMenuCheck : function(){
			roleMgr.validationCheckGrid();
			roleMgr.validationCheckMenu();
			if($("#menuMgrModifyBtn").prop('disabled')){
        		return;
        	}
//			$('.w2ui-node-count').html("");
			$("input#menuTreeCheckbox.menu-tree-checkbox.check-x").removeClass('check-x');
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = false);
			
			roleMgr.menuCheckboxMode = true;
			roleMgr.validationCheckMode(roleMgr.menuCheckboxMode);
			
			$("#menuMgrAddBtn").css("display", "none");
			$("#menuMgrDelBtn").css("display", "none");
			$("#menuMgrModifyBtn").css("display", "none");
			$("#menuMgrSaveBtn").css("display", "");
			$("#menuMgrCancelBtn").css("display", "");
			
		},
		
		/*validationCheckMode : function(flag){
			if(flag){
				$("#groupAddBtn").prop('disabled', true);
				$("#groupAddBtn").removeClass('link');
				$("#groupDelBtn").prop('disabled', true);
				$("#groupDelBtn").removeClass('link');
				$("#userAddBtn").prop('disabled', true);
				$("#userAddBtn").removeClass('link');
				$("#menuDetailModifyBtn").prop('disabled', true);
				$("#menuDetailModifyBtn").removeClass('link');
				$("#leftBottomContents .disableClass").css("display", "block");
			}else{
				$("#groupAddBtn").prop('disabled', false);
				$("#groupAddBtn").addClass('link');
				$("#groupDelBtn").prop('disabled', false);
				$("#groupDelBtn").addClass('link');
				$("#userAddBtn").prop('disabled', false);
				$("#userAddBtn").addClass('link');
				$("#menuDetailModifyBtn").prop('disabled', false);
				$("#menuDetailModifyBtn").addClass('link');
				$("#leftBottomContents .disableClass").css("display", "none");
			}
		},*/
		
		checkboxInvalidate : function(){
			var validateFlag = false;
			var useTrue = _.without(_.pluck(_.where(roleMgr.use, {useYN : true}), 'menuId'), "-1");
			var temp = [];
			
    		for(var i in roleMgr.checkList){
    			temp.push(roleMgr.checkList[i].menuId.toString());
    		}
    		var diffLeft = _.difference(useTrue, temp); // useTrue.length > temp.length
    		var diffRight = _.difference(temp, useTrue); // useTrue.length < temp.length
    		if(diffLeft.length > 0 || diffRight.length > 0){
    			validateFlag = true;
    		}
			
			return validateFlag;
		},
		
		saveMenuCheck : function(){
			roleMgr.validationCheckMode(roleMgr.menuCheckboxMode);
			var validate = roleMgr.checkboxInvalidate(); // 변경된 사항 유무 체크
			if(validate){
				roleMgr.menuCheckboxMode = false;
				var groupId = w2ui["roleGroupList"].get(w2ui["roleGroupList"].getSelection())[0].groupId;
				var result = {};
				var param = [];
				var bodyContents = "";
				var body = "";
				for(var i in roleMgr.use){
					if(roleMgr.use[i].useYN){
						if(roleMgr.use[i].menuId == "-1"){
							continue;
						}else{
							param.push({ menuId : roleMgr.use[i].menuId, privilegeId : roleMgr.use[i].privilegeId, groupId : groupId });
						}
					}
				}
				
				result = {
						"param" : param,
						"groupId" : groupId
				}
				var model = new Model(result);
				model.url = 'role/insertGroupComponent';
				model.save({}, {
					success : function(model, response, options){
						bodyContents = BundleResource.getString('label.roleManager.changedContents');
						//"변경 되었습니다.";
						body = '<div class="w2ui-centered">'+
						'<div class="popup-contents">'+ bodyContents +'</div>'+
						'<div class="popup-btnGroup">'+
						'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
						'</div>'+
						'</div>' ;
						
						w2popup.open({
							width: 385,
							height: 180,
							title : BundleResource.getString('title.roleManager.info'),
							body: body,
							opacity   : '0.5',
							modal     : true,
							showClose : true,
							onClose   : function(event){
//		      	      	    			roleMgr.updateData();
								roleMgr.elements.editorMode = false;
								roleMgr.getInitGroupInfo();
							}
						});
					},
					error : function(model, xhr, options){
						console.log("Insert Check Menu Error");
					}
				});
				
				$("input#menuTreeCheckbox.menu-tree-checkbox").addClass('check-x');
				document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
				
				$("#menuMgrAddBtn").css("display", "");
				$("#menuMgrDelBtn").css("display", "");
				$("#menuMgrModifyBtn").css("display", "");
				$("#menuMgrSaveBtn").css("display", "none");
				$("#menuMgrCancelBtn").css("display", "none");
			}else{
				//var	bodyContents = "변경된 내용이 없습니다.";
    			var	bodyContents = BundleResource.getString('label.roleManager.noChangeedContents');
        		
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="popup-btnGroup">'+
					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		
        		w2popup.open({
        			width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.roleManager.info'),
    		        body: body,
	                opacity   : '0.5',
	         		modal     : true,
	    		    showClose : true
    		    });
			}
			
		},
		
		cancelMenuCheck : function(){
			var bodyContents = BundleResource.getString('label.roleManager.notChanedWhenCanceled');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="menuCheckCancelOKBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.roleManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		menuCheckCancelOK : function(){
			
			$("input#menuTreeCheckbox.menu-tree-checkbox").addClass('check-x');
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
			
			roleMgr.menuCheckboxMode = false;
			roleMgr.validationCheckMode(roleMgr.menuCheckboxMode);
			
			$("#menuMgrAddBtn").css("display", "");
			$("#menuMgrDelBtn").css("display", "");
			$("#menuMgrModifyBtn").css("display", "");
			$("#menuMgrSaveBtn").css("display", "none");
			$("#menuMgrCancelBtn").css("display", "none");
			
			// 전체 체크 해제
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.checked = false);
			
			for(var i = 0; i < roleMgr.checkList.length; i++){
				$("#node_"+roleMgr.checkList[i].menuId+" input").prop("checked", true);
			}
			if(roleMgr.checkList.length != 0){
				$("#node_-1 input").prop("checked", true);
			}
		},
		
		virCreateMenuTree : function(){
			$("#virMainBottom").w2sidebar({
				name : 'virMenuTree',
				nodes : [
					{id: 'Menu', text: 'MENU LIST', expanded: true, group: true,
					nodes: [{id:'-1',  selected : true, expanded: true/*, img: 'fa icon-folder'*/}]}
				]
			});
		},
        
        createMenuTree : function(){
			$("#mainBottom").w2sidebar({
				name : 'menuTree',
				nodes : [
					{id: 'Menu', text: 'MENU LIST', expanded: true, group: true,
					nodes: [{id:'-1', text: '<input id="menuTreeCheckbox" class="menu-tree-checkbox check-x" rownum="-1" name="menuTreeCheckbox" type="checkbox" />MENU', /*selected : true,*/
						expanded: true/*, img: 'fa icon-folder'*/}]}
				],
				
				onClick : function(event){
					
					event.onComplete = function(){
						roleMgr.validationCheckMenu();
						roleMgr.validationCheckGrid();
//						roleMgr.validationCheckMode(roleMgr.menuCheckboxMode);
						if(roleMgr.xFlug){
							var useYES = _.where(roleMgr.allMenu, {useYN : true});
							for(var i = 0; i < useYES.length; i++){
								if(useYES[i].menuId == event.node.menuId){
									$("#startPage").show();
									if(event.node.nodes.length > 0){
										$("#startPage").hide();
									}else{
										$("#startPage").show();
									}
									break;
								}else{
									$("#startPage").hide();
								}
							}
							var selectGroup = w2ui["roleGroupList"].get(w2ui["roleGroupList"].getSelection());
							var privilege = null;
							var selectId = event.target;
							var selectItem = this.get(selectId);
							var description = selectItem.description;
							var url = selectItem.url;
							var parent = selectItem.parent.id; 
//							var status = selectItem.usingMenu;
							var privilegeId = roleMgr.privilegeList;
							
							for(var i = 0; i<privilegeId.length; i++){
								if(selectItem.privilegeId == privilegeId[i].id-1){
									privilege = privilegeId[i];
									selectItem.privilegeObj = privilege;
								}
							}
							
							if(url == null){
								url = "";
								selectItem.url = "";
							}
							if(description == undefined){
								description = "";
							}
							
							if(w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection()).length == 0){
								$("#startPageCheck").prop('checked', false);
								
							}else{
								if(w2ui["roleGroupList"].get(w2ui["roleGroupList"].getSelection())[0].startPage == undefined || w2ui["roleGroupList"].get(w2ui["roleGroupList"].getSelection())[0].startPage != selectItem.menuId){
									$("#startPageCheck").prop('checked', false);
								}else{
									$("#startPageCheck").prop('checked', true);
								}
							}
	
							/*if(status == 0){
								$("#closedMenu").prop('checked', true);
								$("#openedMenu").prop('checked', false);
							}else{
								$("#closedMenu").prop('checked', false);
								$("#openedMenu").prop('checked', true);
							}*/
							
							roleMgr.groupSP = document.getElementById("startPageCheck").checked;
							
							if("MENU" != selectItem.text){
								w2ui['menuDetailProperties'].record = {
									menuName : selectItem.menuName,
									menuId : selectItem.menuId,
									parent : parent, 
				    				url : url,
				    				privilegeId : privilege,
				    				sortOrder : selectItem.sortOrder,
				    				description : description,
								}
							}else{ // Click 'MENU'
								w2ui['menuDetailProperties'].record = {
									menuName : '',
									menuId : '',
									parent : '',
				    				url : '',
				    				privilegeId : '',
				    				sortOrder : '',
				    				description : '',
								}
								/*$("#openedMenu").prop('checked', false);
								$("#closedMenu").prop('checked', false);*/
							}
							w2ui['menuDetailProperties'].refresh();
							$(".w2ui-field-helper").addClass('readonlyEffect');
							roleMgr.selectItem = selectItem;
						}
					}
//					document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
				},
				
				/*onExpand : function(event){
					document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
				}*/
			});
		},
		
		getUseYNMenuStatus : function(selectedGroupId){
			var useYN = new Model();
			useYN.url = 'menu/getMenuStatus/' + selectedGroupId;
			that.listenTo(useYN, 'sync', that.setUseYNMenuStatus);
			useYN.fetch();
		},
		
		setUseYNMenuStatus : function(method, model, options){
			w2ui['virMenuTree'].insert('-1', null, model.treeData.nodes);
		},
		
		getMenuStatus : function(){
			var menuStatus = new Model();
			menuStatus.url = 'menu/getMenuStatus';
			that.listenTo(menuStatus, 'sync', that.setMenuStatus);
			menuStatus.fetch();
		},
		
		setMenuStatus : function(method, model, options){
			this.setMenuList(model);
		},
		
		setMenuList : function(model){
			roleMgr.treeMenu = model.treeData.nodes;
			roleMgr.allMenu = model.allData;
			
			w2ui['menuTree'].insert('-1', null, model.treeData.nodes);
			if(roleMgr.selectItem){
				w2ui["menuTree"].select(roleMgr.selectItem.menuId);
			}
			$(".w2ui-field-helper").addClass('readonlyEffect');
			
			// Menu Checkbox Disabled
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
		},
		
		getPrivilegeList : function(){
			var privilegeList = new Model();
			privilegeList.url = 'privilege/listPrivilege';
			that.listenTo(privilegeList, 'sync', that.setPrivilegeList);
			privilegeList.fetch();
		},
		
		setPrivilegeList : function(method, model, options){
			console.log(model);
			that.privilegeList = [];
			var listLen = model.length;
			if(listLen > 0){
				/*for(var i = 0; i < listLen; i++){
					var item = model[i];
					item.text = item.name;
					that.privilegeList.push(item);
				}*/
				model.forEach(function(item,idx){
					var newItem = $.extend({}, item);
					newItem.id = that.privilegeList.length+1;
					newItem.text = newItem.name;
					that.privilegeList.push(newItem);
				});
				w2ui.menuDetailProperties.set('privilegeId', {options:{items:that.privilegeList}});
			}
		},
		
		validateCheckFunc : function(){
			var arr = w2ui['menuMgr_popup_properties'].validate();
			var	bodyContents = "";
			var body = "";
			var nextFlow = null;
			if(arr.length > 0){
				return;
			}else{
				var item = w2ui['menuMgr_popup_properties'].record;
//				var openStatus = $('input:radio[name=openStatus]:checked').val();
				var menuIdList = _.pluck(roleMgr.allMenu, "menuId");
				//var menuId = Number(item.menuId);
				var url = item.url;
				if(url == ""){
					url = null;
				}
				var checkMenuId = _.intersection(menuIdList, [menuId]).length;
				
				if(checkMenuId != 0){
					bodyContents = BundleResource.getString('label.roleManager.alreadyExistMenu');
					//"동일한 Menu ID가 존재 합니다.";
					body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">'+ bodyContents +'</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
        	  
					w2popup.open({
	            		width: 385,
	      		        height: 180,
	    		        title : BundleResource.getString('title.roleManager.info'),
	    		        body: body,
		                opacity   : '0.5',
		         		modal     : true,
		    		    showClose : true,
	      	    		onClose   : function(event){
	      	    			w2ui['menuMgr_popup_properties'].destroy();
	      	    		}
			      	});
				}else{
					var param = [];
					var menuInfo = {};
					var groupId = 'y-94efaa76-d301-2338-9b7a-d469fa449e73';
                  
					//roleMgr.use.push({ menuId:menuId.toString(), useYN:true, privilegeId:item.privilegeId.id-1 }); // 추가한 메뉴도 넣어줌
					/*for(var i in roleMgr.use){
						if(roleMgr.use[i].menuId == "-1"){
							continue;
						}else{
							param.push({ menuId : roleMgr.use[i].menuId, privilegeId : roleMgr.use[i].privilegeId, groupId : groupId }); // roleGroupComponent에 들어갈 param
						}
					}*/
					menuInfo = {
                     //menuId : menuId,
						parent :item.parent,
						menuName :item.menuName,
						url : url,
						privilegeId : item.privilegeId.id-1,
						sortOrder : item.sortOrder,
						description : item.description
					};
	                  
					var model = new Model();
					model.set({
						"menuInfo" : menuInfo
//						"param" : param
					});
					
					model.url = "/menu/insertMenu";
					model.save(null,{
						success : function(model, response){
							if(response == 100){
								console.log(model);
								
								//bodyContents = "변경 되었습니다.";
      	            		  	//bodyContents = BundleResource.getString('label.codeManager.changedContents');
								bodyContents = BundleResource.getString('label.roleManager.itemAdded'); //"추가 되었습니다.";
								//nextFlow = roleMgr.setNewData();
							}else{
								//bodyContents = "일시적인 오류가 발생 했습니다.";
      	            		  	bodyContents = BundleResource.getString('label.roleManager.errorContents');
							}
							body = '<div class="w2ui-centered">'+
		    				'<div class="popup-contents">'+ bodyContents +'</div>'+
		    				'<div class="popup-btnGroup">'+
		    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
		    					'</div>'+
		    				'</div>' ;
		        	  
							w2popup.open({
			            		width: 385,
			      		        height: 180,
			    		        title : BundleResource.getString('title.roleManager.info'),
			    		        body: body,
				                opacity   : '0.5',
				         		modal     : true,
				    		    showClose : true,
			      	    		onClose   : function(event){
			      	    			w2ui['menuMgr_popup_properties'].destroy();
			      	    			roleMgr.setNewData();
			      	    			roleMgr.elements.editorMode = false;
			      	    			roleMgr.getInitGroupInfo();
			      	    		}
					      	});
						},
						error : function(model, response){
							console.log("Error");
						}
					});
				}
			}
		},
		
		checkChildNodes : function(selectedItem){
			var menuId = selectedItem.id;  
			var checkNodes = selectedItem.nodes.length;
			
			var checkNodeFunc = function(dataAC){
				for(var i =0; i<dataAC.length; i++){
					menuId += "_"+dataAC[i].id;
					var subItem = dataAC[i];
					if(subItem.nodes.length > 0){
						checkNodeFunc(subItem.nodes);
					}
				}
				return menuId;
			}
			
			if(checkNodes > 0){
				return checkNodeFunc(selectedItem.nodes);
			}else{
				return menuId;
			}
		},
		
		deleteMenuConfirm : function(){
			roleMgr.validationCheckMenu();
			if($("#menuMgrDelBtn").prop('disabled')){
				return;
			}
			var body = "";
			var selectedItem = roleMgr.selectItem;
    		if(selectedItem.nodes.length > 0){
    			body = '<div class="w2ui-centered">'+
        				'<div class="popup-contents">'+BundleResource.getString('label.roleManager.subMenuExists')+'</br>' + BundleResource.getString('label.roleManager.deleteAll') + '</div>'+
        				'<div>'+
        					'<button id="menuMgrDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
        					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.cancel') + '</button>'+
        				'</div>'+
    				'</div>' ;
    			
    		}else{
    			body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">' + BundleResource.getString('label.roleManager.delete') + '</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button id="menuMgrDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.cancel') + '</button>'+
    				'</div>'+
				'</div>' ;
    			
    		}
    	
			w2popup.open({
				width: 385,
		        height: 180,
		        title : BundleResource.getString('title.roleManager.info'),
		        body: body,
		        opacity   : '0.5',
		 		modal     : true,
			    showClose : true
		    });
		},
		
		deleteMenu : function(){
			roleMgr.validationCheckMenu();
			if($("#menuMgrDelBtn").prop('disabled')){
				return;
			}
			var model = new Model();
			var selectedItem = roleMgr.selectItem;
			var menuId = that.checkChildNodes(selectedItem);
			
			model.set({id:menuId});
			model.url = "menu/deleteMenu/"+menuId;
			model.destroy({
				success : function(model, response){
					var	bodyContents = "";
					if(response == 100){
						console.log(model);
						
						//bodyContents = "변경 되었습니다.";
	            		  	bodyContents = BundleResource.getString('label.roleManager.menuDelete'); // "삭제 되었습니다.";
					}else{
						//bodyContents = "일시적인 오류가 발생 했습니다.";
	            		  	bodyContents = BundleResource.getString('label.roleManager.errorContents');
					}
					
					body = '<div class="w2ui-centered">'+
	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
	      				'<div class="popup-btnGroup">'+
	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
	      					'</div>'+
	      				'</div>' ;
            	  
					w2popup.open({
	            		width: 385,
	      		        height: 180,
          		        title : BundleResource.getString('title.roleManager.info'),
          		        body: body,
      	                opacity   : '0.5',
      	         		modal     : true,
      	    		    showClose : true,
  	      	    		onClose   : function(event){
  	      	    			roleMgr.updateData();
	  	      	    		$("#menuDetailModifyBtn").prop("disabled", true);
		  	              	$("#menuDetailModifyBtn").removeClass('link');
		  	              	$("#menuMgrDelBtn").prop("disabled", true);
		  	              	$("#menuMgrDelBtn").removeClass('link');
		  	              	w2ui['menuDetailProperties'].record = {
								menuName : '',
								menuId : '',
								parent : '',
			    				url : '',
			    				privilegeId : '',
			    				sortOrder : '',
			    				description : '',
							}
		  	              	w2ui['menuDetailProperties'].refresh();
		  	              	roleMgr.getInitGroupInfo();
  	      	    		}
    		      	});
				},
				error : function(model, response){
					console.log("Error");
				}
			})
		},
		
		addMenu : function(){
			roleMgr.validationCheckMenu();
			if($("#menuMgrAddBtn").prop('disabled')){
				return;
			}
			var selectedId = w2ui['menuTree'].selected;
			var selectedData = null;
			var parentId = null;
			var parentName = null;
			var menuId = null;
			
			if(selectedId == '-1' || selectedId == null){
				menuId = -1;
				parentName = "MENU";
			}else{
				selectedData = w2ui['menuDetailProperties'].record;
				parentId = selectedData.parent;
				menuId = selectedData.menuId;
				parentName = selectedData.menuName;
			}
			
			var body = '<div class="w2ui-centered">'+
				'<div id="menuMgrPopupContents" style="width:100%; height:100%" >'+
	    			'<div class="w2ui-page page-0">'+
		    			'<div class="w2ui-field">'+
		        			'<label>PARENT NAME</label>'+
		        			'<div>'+
		        				'<input name="parentName" type="text" style="width:138px;"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>PARENT ID</label>'+
		        			'<div>'+
		        				'<input name="parent" type="text" style="width:138px;"/>'+
		        			'</div>'+
		        		'</div>'+
		    			'<div class="w2ui-field">'+
		        			'<label>MENU NAME</label>'+
		        			'<div>'+
		        				'<input name="menuName" type="text" style="width:138px;"/>'+
		        			'</div>'+
		        		'</div>'+
		        		/*'<div class="w2ui-field">'+
		    				'<label>MENU ID</label>'+
		    				'<div>'+
								'<input name="menuId" type="text" style="width:138px;"/>'+
							'</div>'+
		    			'</div>'+*/
		    			'<div class="w2ui-field">'+
		    				'<label>URL</label>'+
		    				'<div>'+
								'<input name="url" type="text" style="width:138px;"/>'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>PRIVILEGE</label>'+
		    				'<div>'+
								'<input name="privilegeId" type="list" style="width:138px;"/>'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>SORT ORDER</label>'+
		    				'<div>'+
								'<input name="sortOrder" type="text" style="width:138px;"/>'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>DESCRIPTION</label>'+
		    				'<div>'+
								'<input name="description" type="text" style="width:138px;"/>'+
							'</div>'+
		    			'</div>'+
		    			/*'<div id="statusPopup" class="w2ui-field">'+
		    				'<label>STATUS</label>'+
		    				'<div class="w2ui-field">'+
		    					'<label><input name="openStatus" value="1" type="radio"/><label>OPEN</label></label>'+
		    					'<label><input name="openStatus" value="0" checked="checked" type="radio"/><label>CLOSE</label></label>'+
		    				'</div>'+
		    			'</div>'+*/
					'</div>'+
				'</div>'+
				'<div id="menuMgrPopupBottom">'+
	    			'<button id="menuAddPopupOkBtn" class="darkButton">' + BundleResource.getString('button.roleManager.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.roleManager.close') + '</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
    			title : BundleResource.getString('title.roleManager.createNewMenu'),
    	        body: body,
    	        width : 360,
    	        height : 390,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#menuMgrPopupBottom").html();
    	        		w2ui["menuMgr_popup_properties"].render();
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	w2ui['menuMgr_popup_properties'].destroy();
    	        }
			});
			
			$("#menuMgrPopupContents").w2form({
    			name : 'menuMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0);",
    			focus : 2,
    			fields : [
    				{name:'parentName', type: 'text', disabled:true, required:false, html:{caption:'PARENT NAME'}},
    				{name:'parent', type: 'text', disabled:true, required:false, html:{caption:'PARENT ID'}},
    				{name:'menuName', type: 'text', disabled:false, required:true, html:{caption:'MENU NAME'}},
//					{name:'menuId', type: 'text', disabled:false, required:true, html:{caption:'MENU ID'}},
					{name:'url', type: 'text', disabled:false, required:false, html:{caption:'URL'}},
					{name:'privilegeId', type: 'list', required:true, html:{caption:'PRIVILEGE'}, options : {items : that.privilegeList}},
					{name:'sortOrder', type: 'text', disabled:false, required:true, html:{caption:'SORT ORDER'}},
					{name:'description', type: 'text', disabled:false, required:false, html:{caption:'DESCRIPTION'}}
    			],
    			
    			record:{
    				parentName:parentName,
    				parent:menuId,
    				menuName:'',
//    				menuId:'',
    				url:'',
    				privilegeId:'',
    				sortOrder:0,
    				description:''
				}
				
    		});
		},
		
		modifyMenu : function (event){
			$('.w2ui-node-count').html("");
			roleMgr.elements.editorMode = true;
			roleMgr.validationCheckMenu();
			if($("#menuDetailModifyBtn").prop('disabled')){
				return;
			}
			
			_.each(w2ui['menuDetailProperties'].fields, function(field){
    			field.disabled = false;	
    		});
			
			w2ui['menuDetailProperties'].fields[2].disabled = true
			
			roleMgr.xFlug = false;
			roleMgr.disableTree();
	
			w2ui['menuDetailProperties'].refresh();
			
			$("#rightBottom .disableClass").css("display", "none");
			$("#menuDetailModifyBtn").css("display", "none");
			$("#menuDetailSaveBtn").css("display", "");
			$("#menuDetailCancelBtn").css("display", "");
			
			$("#menuMgrAddBtn").css("disabled", true);
			$("#menuMgrAddBtn").removeClass('link');
			$("#menuMgrDelBtn").css("disabled", true);
			$("#menuMgrDelBtn").removeClass('link');
			
			$("#node_-1 input").prop("checked", true);
			
//			$("#rightTop").css("visibility", "visible");
		},
		
		saveModifyMenu : function(){
			var arr = w2ui['menuDetailProperties'].validate();
			if(arr.length > 0){
				return;
			}else{
				if(w2ui['virMenuTree']){
	        		w2ui['virMenuTree'].destroy();
	        	}
				var result = roleMgr.updateInvalidate();
				if(result){
					var model = new Model();
					var selectedItem = roleMgr.selectItem;
					var param = {};
					var startPageCheck = document.getElementById("startPageCheck").checked;
					var groupCheck = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection());
					var body = "";
					param.menuId = w2ui['menuDetailProperties'].record.menuId;
					param.parent = w2ui['menuDetailProperties'].record.parent;
					param.menuName = w2ui['menuDetailProperties'].record.menuName;
					param.url = w2ui['menuDetailProperties'].record.url;
					if(param.url == ""){
						param.url = null;
					}
					param.privilegeId = w2ui['menuDetailProperties'].record.privilegeId.id;
					param.sortOrder = w2ui['menuDetailProperties'].record.sortOrder;
					param.description = w2ui['menuDetailProperties'].record.description;
//					param.usingMenu = $('input[name="menuStatus"]:checked').val();	
					
					if(groupCheck.length > 0){ // 그룹 선택 되어있을때
						var groupId, startPage = null;
						if(startPageCheck){ // START PAGE 체크 되었을때
							groupId = groupCheck[0].groupId;
							startPage = param.menuId;
						}else{
							groupId = groupCheck[0].groupId;
							startPage = null;
						}
						model.set({
							menuId : param.menuId,
							parent : param.parent,
							menuName : param.menuName,
							url : param.url,
							privilegeId : param.privilegeId-1,
							sortOrder : param.sortOrder,
							description : param.description,
//							usingMenu : param.usingMenu,
							groupId : groupId,
							startPage : startPage
						});
					}else{
						body = '<div class="w2ui-centered">'+
										'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+ BundleResource.getString('label.roleManager.noSelect_applyGroup') + '</div>'+
										'<div class="roleMgr-popup-btnGroup">'+
											'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.roleManager.confirm')+'</button>'+
										'</div>'+
									'</div>' ;
		        	
			        	w2popup.open({
			        		width: 385,
			 		        height: 180,
					        title : BundleResource.getString('title.roleManager.info'),
					        body: body,
			                opacity   : '0.5',
			         		modal     : true,
			    		    showClose : true
					    });
			        	
			        	return;
					}
					
					model.url = "menu/updateMenu"
					model.save(null, {
						success : function(model, response){
							var	bodyContents = "";
							if(response == 100){
								console.log(model);
								
								//bodyContents = "변경 되었습니다.";
      	            		  	bodyContents = BundleResource.getString('label.roleManager.changedContents');
							}else{
								//bodyContents = "일시적인 오류가 발생 했습니다.";
      	            		  	bodyContents = BundleResource.getString('label.roleManager.errorContents');
							}
							
							body = '<div class="w2ui-centered">'+
      	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
      	      				'<div class="popup-btnGroup">'+
      	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
      	      					'</div>'+
      	      				'</div>' ;
    	            	  
							w2popup.open({
	    	            		width: 385,
	    	      		        height: 180,
	  	          		        title : BundleResource.getString('title.roleManager.info'),
	  	          		        body: body,
	  	      	                opacity   : '0.5',
	  	      	         		modal     : true,
	  	      	    		    showClose : true,
	      	      	    		onClose   : function(event){
	      	      	    			roleMgr.updateData();
	      	      	    			roleMgr.elements.editorMode = false;
//	      	      	    			w2ui['roleGroupList'].selectNone();
		      	      	    		roleMgr.xFlug = true;
			      	      	    	roleMgr.enableTree();
			      	      	    	_.each(w2ui['menuDetailProperties'].fields, function(field){
      	      	    	        		if(field.name != "privilegeId"){
      	      	    	        			field.disabled = true;
      	      	    	        		}
      	      	    	    		});
	      	      	    				
      	      	    				w2ui['menuDetailProperties'].refresh();
      	      	    				
      	      	    				$("#rightBottom .disableClass").css("display", "block");
      	      	    				$("#menuDetailModifyBtn").css("display", "");
      	      	    				$("#menuDetailSaveBtn").css("display", "none");
      	      	    				$("#menuDetailCancelBtn").css("display", "none");
      	      	    				
      	      	    				$("#menuMgrAddBtn").addClass('link');
      	      	    				$("#menuMgrDelBtn").addClass('link');
      	      	    				
//      	      	    				var selectRecord = w2ui['roleGroupList'].getSelection()[0];
//      	      	    				w2ui['roleGroupList'].select(selectRecord);
      	      	    			roleMgr.getInitGroupInfo();
	      	      	    		}
  	          		      	});
							
							$("input#menuTreeCheckbox.menu-tree-checkbox").addClass('check-x');
							document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
						},
						error : function(model, response){
							console.log("Error");
						}
					})
						
				}else{
					//var	bodyContents = "변경된 내용이 없습니다.";
        			var	bodyContents = BundleResource.getString('label.roleManager.noChangeedContents');
            		
            		body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">'+ bodyContents +'</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
            		
            		w2popup.open({
            			width: 385,
         		        height: 180,
        		        title : BundleResource.getString('title.roleManager.info'),
        		        body: body,
    	                opacity   : '0.5',
    	         		modal     : true,
    	    		    showClose : true
        		    });
				}
			}
		},
		
		setNewData : function(event){
			w2ui['menuTree'].destroy();
			if(w2ui['virMenuTree']){
        		w2ui['virMenuTree'].destroy();
        	}
			roleMgr.createMenuTree();
			roleMgr.virCreateMenuTree();
//			roleMgr.getMenuStatus();
			roleMgr.getNewMenuStatus();
			
			w2ui['menuDetailProperties'].refresh();
			
		},
		
		getNewMenuStatus : function(){
			var menuStatus = new Model();
			menuStatus.url = 'menu/getMenuStatus';
			that.listenTo(menuStatus, 'sync', that.setNewMenuStatus);
			menuStatus.fetch();
		},
		
		setNewMenuStatus : function(method, model, options){
			this.setNewMenuList(model);
		},
		
		setNewMenuList : function(model){
			roleMgr.treeMenu = model.treeData.nodes;
			
			var result = {};
			var param = [];
			var groupId = 'y-94efaa76-d301-2338-9b7a-d469fa449e73';

			for(var i in model.allData){
				
				param.push({
					menuId : model.allData[i].menuId,
					privilegeId : model.allData[i].privilegeId,
					groupId : groupId
				});
			}

			result = {
					"param" : param
			}

			var compModel = new Model(result);
			compModel.url = 'role/insertGroupComponent';
			compModel.save({},{
				success : function(compModel, response, options){
			    
				},
				error : function(compModel, xhr, options){
					
				}
			});
			
			roleMgr.allMenu = model.allData;
			
			w2ui['menuTree'].insert('-1', null, model.treeData.nodes);
			if(roleMgr.selectItem){
				w2ui["menuTree"].select(roleMgr.selectItem.menuId);
			}
			$(".w2ui-field-helper").addClass('readonlyEffect');
			
			// Menu Checkbox Disabled
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
		},
		
		updateData : function(event){
			roleMgr.xFlug = true;
			roleMgr.enableTree();
			
			w2ui['menuTree'].destroy();
//			w2ui['virMenuTree'].destroy();
			if(w2ui['virMenuTree']){
        		w2ui['virMenuTree'].destroy();
        	}
			roleMgr.createMenuTree();
			roleMgr.virCreateMenuTree();
			roleMgr.getMenuStatus();
			
			_.each(w2ui['menuDetailProperties'].fields, function(field){
        		if(field.name != "privilegeId"){
        			field.disabled = true;
        		}
    		});
			
			w2ui['menuDetailProperties'].refresh();
			
			$("#rightBottom .disableClass").css("display", "block");
			$("#menuDetailModifyBtn").css("display", "");
			$("#menuDetailSaveBtn").css("display", "none");
			$("#menuDetailCancelBtn").css("display", "none");
			
			$("#menuMgrAddBtn").addClass('link');
			$("#menuMgrDelBtn").addClass('link');
			
//			$("#rightTop").css("visibility", "hidden");
		},
		
		cancelConfirm : function(){
			var bodyContents = BundleResource.getString('label.roleManager.notChanedWhenCanceled');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="menuDetailCancelOKBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.roleManager.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.roleManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		cancelModifyMenu : function(){
			roleMgr.xFlug = true;
        	roleMgr.enableTree();
        	
        	_.each(w2ui['menuDetailProperties'].fields, function(field){
        		if(field.name != "privilegeId"){
        			field.disabled = true;
        		}
    		});
        	
        	var selectedItem = roleMgr.selectItem;
			var description = selectedItem.description;
			var parent = selectedItem.parent.id; 
//			var status = selectedItem.usingMenu;
			
			if(description == undefined){
				description = "";
			}
			/*if(status == 0){
				$("#closedMenu").prop('checked', true);
				$("#openedMenu").prop('checked', false);
			}else{
				$("#closedMenu").prop('checked', false);
				$("#openedMenu").prop('checked', true);
			}*/
			
        	w2ui['menuDetailProperties'].record = {
					menuName : selectedItem.menuName,
					menuId : selectedItem.menuId,
					parent : parent, 
    				url : selectedItem.url,
    				privilegeId : selectedItem.privilegeObj,
    				sortOrder : selectedItem.sortOrder,
    				description : description
				};
        	
        	w2ui['menuDetailProperties'].validate();
        	w2ui['menuDetailProperties'].refresh();
        	
//        	$(".w2ui-field-helper").addClass('readonlyEffect');
        	
        	$("#rightBottom .disableClass").css("display", "block");
        	$("#menuDetailModifyBtn").css("display", "");
			$("#menuDetailSaveBtn").css("display", "none");
			$("#menuDetailCancelBtn").css("display", "none");
			
			roleMgr.elements.editorMode = false;
			
			roleMgr.validationCheckMenu();
			
			$("input#menuTreeCheckbox.menu-tree-checkbox").addClass('check-x');
			document.querySelectorAll('.menu-tree-checkbox').forEach(el => el.disabled = true);
			
			roleMgr.getInitGroupInfo();
//			$("#rightTop").css("visibility", "hidden");
		},
		
		disableTree : function(){
			w2ui['menuTree'].disable("Menu");
			var allMenu = roleMgr.allMenu;
			var selectedId = roleMgr.selectItem.id;
			
			for(var i = 0; i<allMenu.length; i++){
				var otherData = allMenu[i].id;
				if(otherData != selectedId){
					w2ui['menuTree'].disable(otherData);
				}
			}
			w2ui['menuTree'].disable("-1");
			$('.w2ui-node-count').html("");
			
			for(var i = 0; i < roleMgr.checkList.length; i++){
				$("#node_"+roleMgr.checkList[i].menuId+" input").prop("checked", true);
			}
		},
		
		enableTree : function(){
			w2ui['menuTree'].enable("Menu");
			var allMenu = roleMgr.allMenu;
			var selectedId = roleMgr.selectItem.id;
			
			for(var i = 0; i<allMenu.length; i++){
				var otherData = allMenu[i].id;
				if(otherData != selectedId){
					w2ui['menuTree'].enable(otherData);
				}
			}
			w2ui['menuTree'].enable("-1");
			$('.w2ui-node-count').html("");
		},
		
		updateInvalidate : function(){
			var validateFlag = false;
			var selectedItem = roleMgr.selectItem;
			
			if(w2ui['menuDetailProperties'].record.menuName != selectedItem.menuName){
				validateFlag = true;
			}
			/*if(w2ui['menuDetailProperties'].record.menuId != selectedItem.menuId){
				validateFlag = true;
			}*/
			if(w2ui['menuDetailProperties'].record.parent != selectedItem.parent.id){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.url != selectedItem.url){
				validateFlag = true;
			}
			if($("#privilegeId").val() != selectedItem.privilegeObj.name){ //w2ui['menuDetailProperties'].record.privilegeId != selectedItem.privilegeId
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.sortOrder != selectedItem.sortOrder){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.description != selectedItem.description){
				validateFlag = true;
			}
			/*if($('input[name="menuStatus"]:checked').val() != selectedItem.usingMenu){
				validateFlag = true;
			}*/
			if(roleMgr.groupSP != document.getElementById("startPageCheck").checked){
				validateFlag = true;
			}
			return validateFlag;
		},
		
		/** Grid Check
		* deleteGroupPopup
		* addUserPopup
		* deleteUserPopup
		* roleGroup, roleAssignedUser [click, select, unselect]
		**/
		validationCheckGrid : function(){
			var itemGroup = w2ui['roleGroupList'].get(w2ui['roleGroupList'].getSelection());
			var itemUser = w2ui['roleAssignedUserList'].get(w2ui['roleAssignedUserList'].getSelection());
	
			if(w2ui['roleGroupList'].getSelection().length > 0){
			// roleGroup 선택 O
				 if(itemGroup[0].groupName == 'Base Group'){
				   // roleGroup 선택 O && BaseGroup O
				    $("#groupDelBtn").prop('disabled', true);
				    $("#groupDelBtn").removeClass('link');
				    $("#userDelBtn").prop("disabled", true);	
				    $("#userDelBtn").removeClass('link');
				    $("#menuMgrModifyBtn").prop("disabled", true);
				    $("#menuMgrModifyBtn").removeClass('link');
				  }else{
			     // roleGroup 선택 O && BaseGroup X
					  if(w2ui['roleAssignedUserList'].getSelection().length > 0){
				        // roleGroup 선택 O && BaseGroup X && roleAssignedUser 선택 O
					      $("#userDelBtn").prop("disabled", false);
					      $("#userDelBtn").addClass('link');
					  }else{
					     // roleGroup 선택 O && BaseGroup X && roleAssignedUser 선택 X
					      $("#userDelBtn").prop("disabled", true);
					      $("#userDelBtn").removeClass('link');
					  }
					  $("#groupDelBtn").prop('disabled', false);
					  $("#groupDelBtn").addClass('link');
					  $("#menuMgrModifyBtn").prop("disabled", false);
					  $("#menuMgrModifyBtn").addClass('link');
				 }
				 $("#userAddBtn").prop("disabled", false);
				 $("#userAddBtn").addClass('link');
//				 w2ui['menuTree'].unselect();
			  }else{
			  // roleGroup 선택 X
				  $("#groupDelBtn").prop('disabled', true);
				  $("#groupDelBtn").removeClass('link');
				  $("#userAddBtn").prop("disabled", true);
				  $("#userAddBtn").removeClass('link');
				  $("#userDelBtn").prop("disabled", true);
				  $("#userDelBtn").removeClass('link');
				  $("#menuMgrModifyBtn").prop("disabled", true);
				  $("#menuMgrModifyBtn").removeClass('link');
//				  w2ui['menuTree'].unselect();
			  }
		},

		/** Menu Check
		* deleteMenuConfirm
		* deleteMenu
		* addMenu
		* modifyMenu
		* cancelModifyMenu
		* modifyMenuCheck
		* createMenuTree
		**/
		validationCheckMenu : function(){
			if(w2ui['menuTree'].selected != "-1" && w2ui['menuTree'].selected != null){
			// MenuTree 선택 O
				if(w2ui['menuTree'].selected == '18'){
					$("#menuMgrDelBtn").prop("disabled", true);
				    $("#menuMgrDelBtn").removeClass('link');
				}else{
					$("#menuMgrDelBtn").prop("disabled", false);
					$("#menuMgrDelBtn").addClass('link');
				}
				$("#menuMgrAddBtn").prop("disabled", false);
			    $("#menuMgrAddBtn").addClass('link');
			    $("#menuDetailModifyBtn").prop("disabled", false);
			    $("#menuDetailModifyBtn").addClass('link');
			}else{
		   // MenuTree 선택 X
				$("#menuMgrAddBtn").prop("disabled", false);
			    $("#menuMgrAddBtn").addClass('link');
			    $("#menuMgrDelBtn").prop("disabled", true);
			    $("#menuMgrDelBtn").removeClass('link');
			    $("#menuDetailModifyBtn").prop("disabled", true);
			    $("#menuDetailModifyBtn").removeClass('link');
			}
		},

		/** Edit Mode
		* saveMenuCheck
		* menuCheckCancelOK
		* createMenuTree
		* addGroupPopup
		* modifyMenuCheck
		**/
		validationCheckMode : function(flag){
			if(flag){
			// Edit Mode O
				$("#groupAddBtn").prop('disabled', true);
			    $("#groupAddBtn").removeClass('link');
			    $("#groupDelBtn").prop('disabled', true);
			    $("#groupDelBtn").removeClass('link');
			    $("#userAddBtn").prop("disabled", true);
				$("#userAddBtn").removeClass('link');
			    $("#userDelBtn").prop("disabled", true);
				$("#userDelBtn").removeClass('link');
			    $("#menuDetailModifyBtn").prop("disabled", true);
			    $("#menuDetailModifyBtn").removeClass('link');
			}else{
			// Edit Mode X
				$("#groupAddBtn").prop('disabled', false);
			    $("#groupAddBtn").addClass('link');
			    $("#groupDelBtn").prop('disabled', false);
			    $("#groupDelBtn").addClass('link');
			    $("#userAddBtn").prop("disabled", false);
			    $("#userAddBtn").addClass('link');
			    $("#userDelBtn").prop("disabled", false);
			    $("#userDelBtn").addClass('link');
			    $("#menuDetailModifyBtn").prop("disabled", false);
			    $("#menuDetailModifyBtn").addClass('link');
			}
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
		
        destroy : function() {
        	if(w2ui['roleMgr_layout']){
        		w2ui['roleMgr_layout'].destroy();
        	}
        	
        	if(w2ui['roleMgr_left_layout']){
        		w2ui['roleMgr_left_layout'].destroy();
        	}
        	
        	if(w2ui['roleGroupList']){
        		w2ui['roleGroupList'].destroy();
        	}
        	
        	if(w2ui['roleAssignedUserList']){
        		w2ui['roleAssignedUserList'].destroy();
        	}
        	
        	if(w2ui['menuTree']){
				w2ui['menuTree'].destroy();
			}
        	
        	if(w2ui['virMenuTree']){
        		w2ui['virMenuTree'].destroy();
        	}
			
			if(w2ui['menuMgr_popup_properties']){
				w2ui['menuMgr_popup_properties'].destroy();
			}
			
			if(w2ui['menuDetailProperties']){
				w2ui['menuDetailProperties'].destroy();
			}
			
			if(w2ui['add_group_propterits']){
				w2ui['add_group_propterits'].destroy();
			}
			
			if(w2ui['add_user_propterits']){
				w2ui['add_user_propterits'].destroy();
			}
			
			if(w2ui['userAllList']){
				w2ui['userAllList'].destroy();
			}
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
			roleMgr = null;
        }
    })

    return Main;
});