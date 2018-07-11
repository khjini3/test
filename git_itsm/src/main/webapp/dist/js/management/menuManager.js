define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/menuManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/management/menuManager"
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
	
	/*var Collection = Backbone.Collection.extend({
		url : 'menu/getMenuStatus',
		model : Model
	});*/
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.collection = null;
			this.xFlug = true;
			this.$el.append(JSP);
			this.selectItem = null;
			this.allMenu = null;
			this.treeMenu = null;
			this.privilegeList = null;
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
        		$("#leftContents").css("height", "100%");
        		$("#leftContents").find(".dashboard-panel").css("height", "calc(100% - 40px)");
        		$("#leftContents").find(".dashboard-contents").css("height", "calc(100% - 40px)");
        		$("#leftContents").find(".dashboard-contents > .w2ui-reset w2ui-sidebar").css("height", "100%");
        		$("#leftBottom").css("height", "100%");
//        		$("#mainBottom").css("height", "calc(100% - 40px)");
        		$("#openCloseStatus > div > label > label").css("width","0px");
        	}
		},
		
		init : function(){
			menuMgr = this;
			
			$("#menuContentsDiv").w2layout({
        		name:'menuMgrlayout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
        	});
			
			var leftContent = '<div id="leftTop" style="height:35px">'+
			'<i id="menuMgrAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
			'<i id="menuMgrDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
			'<i id="menuMgrModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Modify"></i>'+
			'</div>'+
    		'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Menu List</div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom"></div>'+
	    		'</div>'+
	    	'</div>';
        	
        	$("#leftContents").html(leftContent);
        	
        	var mainContents = '<div id="mainTop"></div>'+
        	'<div id="mainBottom">'+
        		'<div class="dashboard-panel" style="width:100%">'+
	    			'<div class="dashboard-title">Detailed Menu Information</div>'+
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
					            '<div id="openCloseStatus" class="w2ui-field">'+
					                '<label>STATUS</label>'+
						            '<div class="w2ui-field">'+
				    					'<label><input type="radio" id="openedMenu" name="menuStatus" readonly="readonly" value="1" /><label>OPENED</label></label>'+
				    					'<label><input type="radio" id="closedMenu" name="menuStatus" readonly="readonly" value="0" /><label>CLOSED</label></label>'+
				    				'</div>'+
					            '</div>'+
					        '</div>'+
				       '</div>'+
				       "<div class='disableClass'></div>"+
			       '</div>'+
	    		'</div>'+
    		'</div>'
        	
        	$("#mainContents").html(mainContents);
        	
        	var rightContent = '<div id="rightTop" style="width:100%;height:100%;visibility:hidden; ">'+
        	'<i id="menuMgrSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save"></i>'+
    		'<i id="menuMgrCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel"></i>'+
        	'</div>';
        	
        	$("#mainTop").html(rightContent);
        	
        	$('#menuDetailInfo').w2form({ 
        		name : 'menuDetailProperties',
    			focus : -1,
    			fields : [
    				//{name:'parentName', type: 'text', disabled:true, required:false, html:{caption:'PARENT NAME'}},
    				{name:'parent', type: 'text', disabled:true, required:false, html:{caption:'PARENT ID'}},
    				{name:'menuName', type: 'text', disabled:true, required:true, html:{caption:'MENU NAME'}},
					{name:'menuId', type: 'text', disabled:true, required:true, html:{caption:'MENU ID'}},
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
        	$("#menuMgrModifyBtn").prop("disabled", true);
        	$("#menuMgrModifyBtn").removeClass('link');
        	$("#menuMgrDelBtn").prop("disabled", true);
        	$("#menuMgrDelBtn").removeClass('link');
        	//$("#menuDetailInfo.w2ui-field-helper").addClass('readonlyEffect');
		},
		
		start : function(){
			this.createMenuTree();
			this.getMenuStatus();
			this.getPrivilegeList();
			this.eventListenerRegister();
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#menuMgrAddBtn", this.addMenu);
			$(document).on("click", "#menuMgrDelBtn", this.deleteMenuConfirm);
			$(document).on("click", "#menuMgrDeleteOkBtn", this.deleteMenu);
			$(document).on("click", "#menuMgrModifyBtn", this.modifyMenu);
			$(document).on("click", "#menuMgrSaveBtn", this.saveModifyMenu);
			$(document).on("click", "#menuMgrPopupOkBtn", this.validateCheckFunc);
			$(document).on("click", "#menuMgrCancelBtn", this.cancelConfirm);
			$(document).on("click", "#menuMgrCancelOKBtn", this.cancelModifyMenu);
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
			menuMgr.treeMenu = model.treeData.nodes;
			menuMgr.allMenu = model.allData;
			
			w2ui['menuTree'].insert('-1', null, model.treeData.nodes);
			if(menuMgr.selectItem){
				w2ui["menuTree"].select(menuMgr.selectItem.menuId);
			}
			$(".w2ui-field-helper").addClass('readonlyEffect');
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
				var openStatus = $('input:radio[name=openStatus]:checked').val();
				var menuIdList = _.pluck(menuMgr.allMenu, "menuId");
				var menuId = Number(item.menuId);
				var url = item.url;
				if(url == ""){
					url = null;
				}
				var checkMenuId = _.intersection(menuIdList, [menuId]).length;
				
				if(checkMenuId != 0){
					bodyContents = "동일한 Menu ID가 존재 합니다.";
					body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">'+ bodyContents +'</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
        	  
					w2popup.open({
	            		width: 385,
	      		        height: 180,
	    		        title : BundleResource.getString('title.codeManager.info'),
	    		        body: body,
		                opacity   : '0.5',
		         		modal     : true,
		    		    showClose : true,
	      	    		onClose   : function(event){
	      	    			w2ui['menuMgr_popup_properties'].destroy();
	      	    		}
			      	});
				}else{
					var model = new Model();
					model.set({
						menuId : menuId,
						parent :item.parent,
						menuName :item.menuName,
						url : url,
						privilegeId : item.privilegeId.id-1,
						sortOrder : item.sortOrder,
						description : item.description,
						usingMenu : Number(openStatus)
					});
					model.url = "/menu/insertMenu";
					model.save(null,{
						success : function(model, response){
							if(response == 100){
								console.log(model);
								
								//bodyContents = "변경 되었습니다.";
      	            		  	//bodyContents = BundleResource.getString('label.codeManager.changedContents');
								bodyContents = "추가 되었습니다.";
								//nextFlow = menuMgr.setNewData();
							}else{
								//bodyContents = "일시적인 오류가 발생 했습니다.";
      	            		  	bodyContents = BundleResource.getString('label.codeManager.errorContents');
							}
							body = '<div class="w2ui-centered">'+
		    				'<div class="popup-contents">'+ bodyContents +'</div>'+
		    				'<div class="popup-btnGroup">'+
		    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
		    					'</div>'+
		    				'</div>' ;
		        	  
							w2popup.open({
			            		width: 385,
			      		        height: 180,
			    		        title : BundleResource.getString('title.codeManager.info'),
			    		        body: body,
				                opacity   : '0.5',
				         		modal     : true,
				    		    showClose : true,
			      	    		onClose   : function(event){
			      	    			w2ui['menuMgr_popup_properties'].destroy();
			      	    			menuMgr.setNewData();
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
		
		validationCheck : function(){
			if(w2ui['menuTree'].selected != "-1" && w2ui['menuTree'].selected != null){ //Activate
				$("#menuMgrModifyBtn").prop("disabled", false);
	        	$("#menuMgrModifyBtn").addClass('link');
	        	$("#menuMgrDelBtn").prop("disabled", false);
	        	$("#menuMgrDelBtn").addClass('link');
			}else{ //Deactivate -> click 'MENU' or no select.
				$("#menuMgrModifyBtn").prop("disabled", true);
	        	$("#menuMgrModifyBtn").removeClass('link');
	        	$("#menuMgrDelBtn").prop("disabled", true);
	        	$("#menuMgrDelBtn").removeClass('link');
			}
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
		
		createMenuTree : function(){
			$("#leftBottom").w2sidebar({
				name : 'menuTree',
				nodes : [
					{id: 'Menu', text: 'MENU LIST', expanded: true, group: true,
					nodes: [{id:'-1', text: 'MENU', expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					
					event.onComplete = function(){
						menuMgr.validationCheck();
						if(menuMgr.xFlug){
							var privilege = null;
							var selectId = event.target;
							var selectItem = this.get(selectId);
							var description = selectItem.description;
							var url = selectItem.url;
							var parent = selectItem.parent.id; 
							var status = selectItem.usingMenu;

							var privilegeId = menuMgr.privilegeList;
							
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
	
							if(status == 0){
								$("#closedMenu").prop('checked', true);
								$("#openedMenu").prop('checked', false);
							}else{
								$("#closedMenu").prop('checked', false);
								$("#openedMenu").prop('checked', true);
							}
							
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
								$("#openedMenu").prop('checked', false);
								$("#closedMenu").prop('checked', false);
							}
							w2ui['menuDetailProperties'].refresh();
							$(".w2ui-field-helper").addClass('readonlyEffect');
							menuMgr.selectItem = selectItem;
						}
					}
				},
			});
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
			var selectedItem = menuMgr.selectItem;
			var body = "";
    		if(selectedItem.nodes.length > 0){
    			body = '<div class="w2ui-centered">'+
        				'<div class="popup-contents">선택된 메뉴에 하위 메뉴가 존재 합니다.</br>' + BundleResource.getString('label.codeManager.deleteAll') + '</div>'+
        				'<div>'+
        					'<button id="menuMgrDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
        					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
        				'</div>'+
    				'</div>' ;
    			
    		}else{
    			body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">' + BundleResource.getString('label.codeManager.delete') + '</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button id="menuMgrDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
    				'</div>'+
				'</div>' ;
    			
    		}
    	
			w2popup.open({
				width: 385,
		        height: 180,
		        title : BundleResource.getString('title.codeManager.info'),
		        body: body,
		        opacity   : '0.5',
		 		modal     : true,
			    showClose : true
		    });
		},
		
		deleteMenu : function(){
			menuMgr.validationCheck();
			if($("#menuMgrDelBtn").prop('disabled')){
				return;
			}
			var model = new Model();
			var selectedItem = menuMgr.selectItem;
			var menuId = that.checkChildNodes(selectedItem);
			
			model.set({id:menuId});
			model.url = "menu/deleteMenu/"+menuId;
			model.destroy({
				success : function(model, response){
					var	bodyContents = "";
					if(response == 100){
						console.log(model);
						
						//bodyContents = "변경 되었습니다.";
	            		  	bodyContents = "삭제 되었습니다.";
					}else{
						//bodyContents = "일시적인 오류가 발생 했습니다.";
	            		  	bodyContents = BundleResource.getString('label.codeManager.errorContents');
					}
					
					body = '<div class="w2ui-centered">'+
	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
	      				'<div class="popup-btnGroup">'+
	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
	      					'</div>'+
	      				'</div>' ;
            	  
					w2popup.open({
	            		width: 385,
	      		        height: 180,
          		        title : BundleResource.getString('title.codeManager.info'),
          		        body: body,
      	                opacity   : '0.5',
      	         		modal     : true,
      	    		    showClose : true,
  	      	    		onClose   : function(event){
  	      	    			menuMgr.updateData();
	  	      	    		$("#menuMgrModifyBtn").prop("disabled", true);
		  	              	$("#menuMgrModifyBtn").removeClass('link');
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
  	      	    		}
    		      	});
				},
				error : function(model, response){
					console.log("Error");
				}
			})
		},
		
		addMenu : function(){
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
		        		'<div class="w2ui-field">'+
		    				'<label>MENU ID</label>'+
		    				'<div>'+
								'<input name="menuId" type="text" style="width:138px;"/>'+
							'</div>'+
		    			'</div>'+
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
		    			'<div id="statusPopup" class="w2ui-field">'+
		    				'<label>STATUS</label>'+
		    				'<div class="w2ui-field">'+
		    					'<label><input name="openStatus" value="1" type="radio"/><label>OPEN</label></label>'+
		    					'<label><input name="openStatus" value="0" checked="checked" type="radio"/><label>CLOSE</label></label>'+
		    				'</div>'+
		    			'</div>'+
					'</div>'+
				'</div>'+
				'<div id="menuMgrPopupBottom">'+
	    			'<button id="menuMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
    			title : 'Create New Menu',
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
					{name:'menuId', type: 'text', disabled:false, required:true, html:{caption:'MENU ID'}},
					{name:'url', type: 'text', disabled:false, required:false, html:{caption:'URL'}},
					{name:'privilegeId', type: 'list', required:true, html:{caption:'PRIVILEGE'}, options : {items : that.privilegeList}},
					{name:'sortOrder', type: 'text', disabled:false, required:true, html:{caption:'SORT ORDER'}},
					{name:'description', type: 'text', disabled:false, required:false, html:{caption:'DESCRIPTION'}}
    			],
    			
    			record:{
    				parentName:parentName,
    				parent:menuId,
    				menuName:'',
    				menuId:'',
    				url:'',
    				privilegeId:'',
    				sortOrder:0,
    				description:''
				}
				
    		});
		},
		
		modifyMenu : function (event){
			menuMgr.validationCheck();
			if($("#menuMgrModifyBtn").prop('disabled')){
				return;
			}
			
			_.each(w2ui['menuDetailProperties'].fields, function(field){
    			field.disabled = false;	
    		});
			
			menuMgr.xFlug = false;
			menuMgr.disableTree();
	
			w2ui['menuDetailProperties'].refresh();
			
			$(".disableClass").css("display", "none");
			$("#menuMgrModifyBtn").css({visibility:"hidden"});
			$("#menuMgrAddBtn").css({visibility:"hidden"});
			$("#menuMgrDelBtn").css({visibility:"hidden"});
			$("#rightTop").css("visibility", "visible");
		},
		
		saveModifyMenu : function(){
			var arr = w2ui['menuDetailProperties'].validate();
			if(arr.length > 0){
				return;
			}else{
				var result = menuMgr.updateInvalidate();
				if(result){
					var model = new Model();
					var selectedItem = menuMgr.selectItem;
					var param = {};
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
					param.usingMenu = $('input[name="menuStatus"]:checked').val();	
					
					model.set({
						menuId : param.menuId,
						parent : param.parent,
						menuName : param.menuName,
						url : param.url,
						privilegeId : param.privilegeId-1,
						sortOrder : param.sortOrder,
						description : param.description,
						usingMenu : param.usingMenu
					});
					
					model.url = "menu/updateMenu"
					model.save(null, {
						success : function(model, response){
							var	bodyContents = "";
							if(response == 100){
								console.log(model);
								
								//bodyContents = "변경 되었습니다.";
      	            		  	bodyContents = BundleResource.getString('label.codeManager.changedContents');
							}else{
								//bodyContents = "일시적인 오류가 발생 했습니다.";
      	            		  	bodyContents = BundleResource.getString('label.codeManager.errorContents');
							}
							
							body = '<div class="w2ui-centered">'+
      	      				'<div class="popup-contents">'+ bodyContents +'</div>'+
      	      				'<div class="popup-btnGroup">'+
      	      					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
      	      					'</div>'+
      	      				'</div>' ;
    	            	  
							w2popup.open({
	    	            		width: 385,
	    	      		        height: 180,
	  	          		        title : BundleResource.getString('title.codeManager.info'),
	  	          		        body: body,
	  	      	                opacity   : '0.5',
	  	      	         		modal     : true,
	  	      	    		    showClose : true,
	      	      	    		onClose   : function(event){
	      	      	    			menuMgr.updateData();
		      	      	    		
	      	      	    		}
  	          		      	});
						},
						error : function(model, response){
							console.log("Error");
						}
					})
						
				}else{
					//var	bodyContents = "변경된 내용이 없습니다.";
        			var	bodyContents = BundleResource.getString('label.codeManager.noChangeedContents');
            		
            		body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">'+ bodyContents +'</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
            		
            		w2popup.open({
            			width: 385,
         		        height: 180,
        		        title : BundleResource.getString('title.codeManager.info'),
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
			menuMgr.createMenuTree();
			menuMgr.getMenuStatus();
			
			w2ui['menuDetailProperties'].refresh();
		},
		
		updateData : function(event){
			menuMgr.xFlug = true;
			menuMgr.enableTree();
			
			w2ui['menuTree'].destroy();
			menuMgr.createMenuTree();
			menuMgr.getMenuStatus();
			
			_.each(w2ui['menuDetailProperties'].fields, function(field){
        		if(field.name != "privilegeId"){
        			field.disabled = true;
        		}
    		});
			
			w2ui['menuDetailProperties'].refresh();
			
			$(".disableClass").css("display", "block");
			$("#menuMgrModifyBtn").css({visibility:"visible"});
			$("#menuMgrAddBtn").css({visibility:"visible"});
			$("#menuMgrDelBtn").css({visibility:"visible"});
			$("#rightTop").css("visibility", "hidden");
		},
		
		cancelConfirm : function(){
			var bodyContents = BundleResource.getString('label.codeManager.notChanedWhenCanceled');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="menuMgrCancelOKBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.codeManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		cancelModifyMenu : function(){
			menuMgr.xFlug = true;
        	menuMgr.enableTree();
        	
        	_.each(w2ui['menuDetailProperties'].fields, function(field){
        		if(field.name != "privilegeId"){
        			field.disabled = true;
        		}
    		});
        	
        	var selectedItem = menuMgr.selectItem;
			var description = selectedItem.description;
			var parent = selectedItem.parent.id; 
			var status = selectedItem.usingMenu;
			
			if(description == undefined){
				description = "";
			}
			if(status == 0){
				$("#closedMenu").prop('checked', true);
				$("#openedMenu").prop('checked', false);
			}else{
				$("#closedMenu").prop('checked', false);
				$("#openedMenu").prop('checked', true);
			}
			
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
        	
        	$(".w2ui-field-helper").addClass('readonlyEffect');
        	
        	$(".disableClass").css("display", "block");
        	$("#menuMgrModifyBtn").css({visibility:"visible"});
        	$("#menuMgrAddBtn").css({visibility:"visible"});
        	$("#menuMgrDelBtn").css({visibility:"visible"});
			$("#rightTop").css("visibility", "hidden");
		},
		
		disableTree : function(){
			w2ui['menuTree'].disable("Menu");
			var allMenu = menuMgr.allMenu;
			var selectedId = menuMgr.selectItem.id;
			
			for(var i = 0; i<allMenu.length; i++){
				var otherData = allMenu[i].id;
				if(otherData != selectedId){
					w2ui['menuTree'].disable(otherData);
				}
			}
		},
		
		enableTree : function(){
			w2ui['menuTree'].enable("Menu");
			var allMenu = menuMgr.allMenu;
			var selectedId = menuMgr.selectItem.id;
			
			for(var i = 0; i<allMenu.length; i++){
				var otherData = allMenu[i].id;
				if(otherData != selectedId){
					w2ui['menuTree'].enable(otherData);
				}
			}
		},
		
		updateInvalidate : function(){
			var validateFlag = false;
			var selectedItem = menuMgr.selectItem;
			
			if(w2ui['menuDetailProperties'].record.menuName != selectedItem.menuName){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.menuId != selectedItem.menuId){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.parent != selectedItem.parent.id){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.url != selectedItem.url){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.privilegeId != selectedItem.privilegeId){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.sortOrder != selectedItem.sortOrder){
				validateFlag = true;
			}
			if(w2ui['menuDetailProperties'].record.description != selectedItem.description){
				validateFlag = true;
			}
			if($('input[name="menuStatus"]:checked').val() != selectedItem.usingMenu){
				validateFlag = true;
			}
			return validateFlag;
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
			$(document).off("click", "#menuMgrAddBtn");
			$(document).off("click", "#menuMgrModifyBtn");
			$(document).off("click", "#menuMgrDelBtn");
			$(document).off("click", "#menuMgrDeleteOkBtn");
			$(document).off("click", "#menuMgrSaveBtn");
			$(document).off("click", "#menuMgrPopupOkBtn");
			$(document).off("click", "#menuMgrCancelBtn");
			$(document).off("click", "#menuMgrCancelOKBtn");
		},
		
		destroy : function(){
			
			if(w2ui['menuMgrlayout']){
				w2ui['menuMgrlayout'].destroy();
			}
			
			if(w2ui['menuTree']){
				w2ui['menuTree'].destroy();
			}
			
			if(w2ui['menuMgr_popup_properties']){
				w2ui['menuMgr_popup_properties'].destroy();
			}
			
			if(w2ui['menuDetailProperties']){
				w2ui['menuDetailProperties'].destroy();
			}
			
			this.removeEventListener();
			
			menuMgr = null;
			
			this.undelegateEvents();
		}
		
	});
	return Main;
});