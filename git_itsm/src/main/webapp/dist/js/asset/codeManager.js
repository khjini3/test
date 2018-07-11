define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/codeManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/asset/codeManager"
],function(
    $,
    _,
    Backbone,
    JSP,
    W2ui,
    BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var Model = Backbone.Model.extend({
	});
	
	var Collection = Backbone.Collection.extend({
		url:'codeManager/getCodeList',
		model:Model,
	})
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.collection = null;
    		//왼쪽 트리 잠금 상태 체크
    		this.xFlug = true; 
    		this.elements = {
    			scene : null
    		};
    		
    		this.$el.append(JSP);
    		this.init();
    		this.start();
    		this.selectItem = null;
    		
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
        
        events:{
        	/*'click #codeMgrDelBtn':'deleteData',
        	'click #codeMgrModifyBtn':'modifyData',
        	'click #codeMgrAddBtn':'addData',
        	'click #codeMgrSaveBtn' : 'saveData',
        	'click #codeMgrCancelBtn' : 'cancelData'*/
        },
        
        updateInValiDate : function(){
        	
        	var model = this.collection.get(w2ui["codeMgr_properties"].record.id).toJSON();
        	
        	var validateFlug = false;
        	
        	if(w2ui["codeMgr_properties"].record.name !== model.name){
        		validateFlug = true;
        	}
        	
        	if(w2ui["codeMgr_properties"].record.codeDesc !== model.codeDesc){
        		validateFlug = true;
        	}
        	
        	if(w2ui["codeMgr_properties"].record.inOutStatus != $('input:radio[name=inOutTableFieldsStatus]:checked').val()){
        		validateFlug = true;
        	}
        	
        	if(w2ui["codeMgr_properties"].record.column1 != model.column1){
        		validateFlug = true;
        	}
        	
        	if(w2ui["codeMgr_properties"].record.column2 != model.column2){ 
        		validateFlug = true;
        	}
        	
        	if(w2ui["codeMgr_properties"].record.sortOrder != model.sortOrder){ 
        		validateFlug = true;
        	}
        	
        	return validateFlug;
        	
        },
        
        codeMgrReset : function(){
        	this.xFlug = true;
    		
    		this.enableTree();
    		
    		_.each(w2ui['codeMgr_properties'].fields, function(field){
    			field.disabled = true;	
    		});
    		
    		w2ui['codeMgr_properties'].refresh();
		
    		/*$("#codeMgrAddBtn, #codeMgrDelBtn, #codeMgrModifyBtn").attr('disabled', false);*/
    		$("#codeMgrAddBtn, #codeMgrDelBtn, #codeMgrModifyBtn").css({visibility:"visible"});
        	
        	$("#rightTop").css("visibility", "hidden");
        },
        
        saveData : function(event){
        	var arr = w2ui["codeMgr_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var result = codeMgr.updateInValiDate();
        		var body = "";
        		if(result){
        			var model = codeMgr.collection.get(w2ui["codeMgr_properties"].record.id);
        			var param = {};
        			param.name = w2ui["codeMgr_properties"].record.name;
        			param.inOutStatus = parseInt($('input:radio[name=inOutTableFieldsStatus]:checked').val());
        			param.column1 = w2ui["codeMgr_properties"].record.column1;
        			param.column2 = w2ui["codeMgr_properties"].record.column2;
        			param.codeDesc = w2ui["codeMgr_properties"].record.codeDesc;
        			param.sortOrder = parseInt(w2ui["codeMgr_properties"].record.sortOrder);
        			
        			model.set({
        				name : param.name, 
        				inOutStatus : param.inOutStatus, 
        				column1 : param.column1, 
        				column2 : param.column2, 
        				codeDesc:param.codeDesc, 
        				sortOrder:param.sortOrder
        			});
        			
                	model.url = "codeManager/updateCode" 
                	model.save(null, {
        	              success: function(model, response) {
        	            	  var	bodyContents = "";
        	            	  if(response === 300){
        	            		  var resultParam = model.toJSON();
        	            		  var item = w2ui["codeMgrAssetTree"].get(w2ui["codeMgrAssetTree"].selected);
        	            		  item.name = resultParam.name;
        	            		  item.text = resultParam.name;
        	            		  item.inOutStatus = resultParam.inOutStatus;
        	            		  item.column1 = resultParam.column1;
        	            		  item.column2 = resultParam.column2;
        	            		  item.codeDesc = resultParam.codeDesc;
        	            		  item.sortOrder = resultParam.sortOrder;
        	            		  w2ui["codeMgrAssetTree"].refresh();
        	            		  
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
	      	      	    			codeMgr.cancelData();
	      	      	    		}
      	          		      });
        	              },
        	              
        	              error: function(model, response) {
        	            	  
        	              }
        	          });
                	
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
        
        cancelData : function(event){
        	codeMgr.xFlug = true;
    		
        	codeMgr.enableTree();
    		
    		_.each(w2ui['codeMgr_properties'].fields, function(field){
    			field.disabled = true;	
    		});
    		
    		var selectItem = codeMgr.selectItem;
    		
    		w2ui['codeMgr_properties'].record = {
            		id:selectItem.id,
    				name:selectItem.name,
    				//inOutStatus:selectItem.inOutStatus,
    				column1:selectItem.column1,
    				column2:selectItem.column2,
    				codeDesc:selectItem.codeDesc,
    				parentId:selectItem.parentId,
    				sortOrder:selectItem.sortOrder
    		};
    		
    		w2ui["codeMgr_properties"].validate();
    		
    		if(selectItem.inOutStatus == 1){
    			$("#inStatus").prop('checked', true);
            	$("#outStatus").prop('checked',false);
    		}else{
    			$("#inStatus").prop('checked', false);
            	$("#outStatus").prop('checked',true);
    		}
    		w2ui['codeMgr_properties'].refresh();

    		$(".disableClass").css("display", "block");
    		//$("#codeMgrAddBtn, #codeMgrDelBtn, #codeMgrModifyBtn").attr('disabled', false);
    		$("#codeMgrAddBtn, #codeMgrDelBtn, #codeMgrModifyBtn").css({visibility:"visible"});
        	
        	$("#rightTop").css("visibility", "hidden");
        },
        
        validateCheckFunc : function(event){
        	//var inOutSts = ['OUT', 'IN'];
        	var arr = w2ui["codeMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var item = w2ui["codeMgr_popup_properties"].record;
        		var inOutStatus = $('input:radio[name=inOutPopupStatus]:checked').val();
        		var model = new Model();
        		model.set({
        			id : item.id,
        			name : item.name,
        			inOutStatus : inOutStatus,
    				column1 : item.column1, 
    				column2 : item.column2, 
        			parentId : item.parentId,
        			codeDesc: item.codeDesc,
        			sortOrder: item.sortOrder
        		});
        		
        		codeMgr.collection.create(model);
        		w2popup.close();
        	}
        },
        
        addData : function(event){
    		var uid = util.createUID();
    		var codeId =  "";
    		var codeName = "";
    		var selectedCode = w2ui["codeMgrAssetTree"].selected;
    		var parentId = "";
    		var changeHeight = null;
    		
    		if(selectedCode === null || selectedCode === "root" ){
    			codeId = "root";
    			codeName = "ROOT";
        	}else{
        		parentId = w2ui["codeMgrAssetTree"].get(w2ui["codeMgrAssetTree"].selected).parent.id;
        		codeId = selectedCode;
        		codeName = w2ui["codeMgrAssetTree"].get(w2ui["codeMgrAssetTree"].selected).text;
        	}
    		if(parentId == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca" || selectedCode == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca"){
    			changeHeight = 350;
    		}else{
    			changeHeight = 300;
    		}

    		var body = '<div class="w2ui-centered">'+
    			'<div id="codeMgrPopupContents" style="width:100%; height:100%" >'+
	    			'<div class="w2ui-page page-0">'+
		        		'<div class="w2ui-field">'+
		        			'<label>NAME</label>'+
		        			'<div>'+
		        				'<input name="name" type="text" style="width:138px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		
		    			'<div class="w2ui-field">'+
		        			'<label>COLUMN1</label>'+
		        			'<div>'+
		        				'<input name="column1" type="text" style="width:138px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		    				'<label>COLUMN2</label>'+
		    				'<div>'+
								'<input name="column2" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>DESC</label>'+
		    				'<div>'+
								'<input name="codeDesc" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>ROW NUM</label>'+
		    				'<div>'+
								'<input name="sortOrder" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div class="w2ui-field">'+
		    				'<label>PARENT NAME</label>'+
		    				'<div>'+
								'<input name="parentName" type="text" style="width:138px;" />'+
							'</div>'+
		    			'</div>'+
		    			'<div id="inOutPopup" class="w2ui-field">'+
		    				'<label>IN OUT</label>'+
		    				'<div class="w2ui-field">'+
		    					'<label><input name="inOutPopupStatus" value="1" type="radio"/><label>IN</label></label>'+
		    					'<label><input name="inOutPopupStatus" value="0" checked="checked" type="radio"/><label>OUT</label></label>'+
		    				'</div>'+
		    			'</div>'+
					'</div>'+
				'</div>'+
    			'<div id="codeMgrPopupBottom">'+
	    			'<button id="codeMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.codeManager.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.codeManager.close') + '</button>'+
    			'</div>'+
    		'</div>';
    		
    		w2popup.open({
    			title : BundleResource.getString('title.codeManager.addCode'),
    	        body: body,
    	        width : 360,
    	        height : changeHeight,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#codeMgrPopupBottom").html();
    	        		w2ui["codeMgr_popup_properties"].render();
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	w2ui['codeMgr_popup_properties'].destroy();
    	        }
    	        
    	    });
    		
    		$("#codeMgrPopupContents").w2form({
    			name : 'codeMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0);",
    			fields : [
					{name:'name', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
					//{name:'inOutPopupStatus', type: 'text', disabled:false, required:false, html:{caption:'IN OUT'}},
					{name:'column1', type: 'text', disabled:false, required:false, html:{caption:'COLUMN1'}},
					{name:'column2', type: 'text', disabled:false, required:false, html:{caption:'COLUMN2'}},
					{name:'codeDesc', type: 'text', disabled:false, required:false, html:{caption:'DESC'}},
					{name:'sortOrder', type: 'text', disabled:false, required:false, html:{caption:'ROW NUM'}},
					/*{name:'id', type: 'text', disabled:true, required:true, html:{caption:'CODE ID'}},*/
					{name:'parentName', type: 'text', disabled:true, required:true, html:{caption:'PARENT NAME'}}
    			],
    			onRender : function(event){
    				event.onComplete = function(){
	    				if(parentId == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca" || selectedCode == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca"){
	    	    			$("#inOutPopup").show();
	    	    		}else{
	    	    			$("#inOutPopup").hide();
	    	    		}
    				}
    			},
    			record:{
    				id:uid,
    				name:'',
    				//inOutStatus:0,
    				column1:'',
    				column2:'',
    				codeDesc:'',
    				sortOrder:0,
    				parentId:codeId,
    				parentName:codeName
				}
				
    		});
    		
    		
        },
        
        modifyData : function(event){
        	codeMgr.btnValidationFunc();
        	
        	if(w2ui["codeMgrAssetTree"].selected === null || w2ui["codeMgrAssetTree"].selected === "root"  ){
        		var bodyContents = "";
        		
        		if(w2ui["codeMgrAssetTree"].selected === null){
        			//bodyContents = "선택된 항목이 없습니다.";
        			bodyContents = BundleResource.getString('label.codeManager.noSelectedItem');
        		}else{
        			//bodyContents = "수정 할 수 없는 항목 입니다.";
        			bodyContents = BundleResource.getString('label.codeManager.canNotEditedItem');
        		}
        		
        		var body = '<div class="w2ui-centered">'+
					'<div class="popup-contents">'+ bodyContents +'</div>'+
						'<div class="popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
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
        	}else{
        		
        		codeMgr.xFlug = false;
        		
        		$(".disableClass").css("display", "none");
        		codeMgr.disableTree();
        		
        		_.each(w2ui['codeMgr_properties'].fields, function(field){
        			if(field.name === "id" ){
        				field.disabled = true;
        			}else{
        				field.disabled = false;	
        			}
        			
        		});
        		
        		w2ui['codeMgr_properties'].refresh();
    		
        		//$("#codeMgrAddBtn, #codeMgrDelBtn, #codeMgrModifyBtn").attr('disabled', true);
        		$("#codeMgrAddBtn, #codeMgrDelBtn, #codeMgrModifyBtn").css({visibility:"hidden"});
            	
        		$(".w2ui-input#name").focus();
            	$("#rightTop").css("visibility", "visible");
        	}
        },
        
        btnDisabledFunc : function(flag){
        	if(flag){
        		$("#codeMgrDelBtn").prop('disabled', false);
        		$("#codeMgrDelBtn").addClass('link');
        		
        		$("#codeMgrModifyBtn").prop('disabled', false);
        		$("#codeMgrModifyBtn").addClass('link');
        	}else{
        		$("#codeMgrDelBtn").prop('disabled', true);
        		$("#codeMgrDelBtn").removeClass('link');
        		
        		$("#codeMgrModifyBtn").prop('disabled', true);
        		$("#codeMgrModifyBtn").removeClass('link');
        	}
        },
        btnValidationFunc : function(){
        	if(w2ui['codeMgrAssetTree'].selected !== null){
        		$("#codeMgrDelBtn").prop('disabled', false);
        		$("#codeMgrDelBtn").addClass('link');
        		
        		$("#codeMgrModifyBtn").prop('disabled', false);
        		$("#codeMgrModifyBtn").addClass('link');
        	}else{
        		$("#codeMgrDelBtn").prop('disabled', true);
        		$("#codeMgrDelBtn").removeClass('link');
        		
        		$("#codeMgrModifyBtn").prop('disabled', true);
        		$("#codeMgrModifyBtn").removeClass('link');
        	}
        },
        
        disableTree : function(){
        	w2ui["codeMgrAssetTree"].disable("root");
        	var models = codeMgr.collection.models;
        	for(var i=0; i < models.length; i++){
        		var currentModel = models[i];
        		
        		if(w2ui["codeMgrAssetTree"].selected !== currentModel.id){
        			w2ui["codeMgrAssetTree"].disable(currentModel.id);
        		}
        		
        	}
        },
        
        enableTree : function(){
        	w2ui["codeMgrAssetTree"].enable("root");
        	var models = codeMgr.collection.models;
        	for(var i=0; i < models.length; i++){
        		var currentModel = models[i];
        		
        		if(w2ui["codeMgrAssetTree"].selected !== currentModel.id){
        			w2ui["codeMgrAssetTree"].enable(currentModel.id);
        		}
        		
        	}
        },
        
        deleteData : function(event){
        	codeMgr.btnValidationFunc();
        	
        	var body = "";
        	
        	if(w2ui["codeMgrAssetTree"].selected === null || w2ui["codeMgrAssetTree"].selected === "root"  ){
        		//ROOT는 삭제 할 수 없습니다.
        		//선택이 안되어 있습니다.
        		
        		var bodyContents = "";
        		
        		if(w2ui["codeMgrAssetTree"].selected === null){
        			//bodyContents = "선택된 항목이 없습니다.";
        			bodyContents = BundleResource.getString('label.codeManager.noSelectedItem');
        		}else{
        			//bodyContents = "삭제할 수 없는 항목 입니다.";
        			bodyContents = BundleResource.getString('label.codeManager.canNotDeletedItem');
        		}
        		
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">'+ bodyContents +'</div>'+
					'<div class="btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		
        	}else{
        		var selectItem = w2ui['codeMgrAssetTree'].get(w2ui["codeMgrAssetTree"].selected);
        		if(selectItem.nodes.length > 0){
        			body = '<div class="w2ui-centered">'+
	        				'<div class="popup-contents">' + BundleResource.getString('label.codeManager.sublistExists') + '</br>' + BundleResource.getString('label.codeManager.deleteAll') + '</div>'+
	        				'<div>'+
	        					'<button id="codeMgrOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
	        					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
	        				'</div>'+
        				'</div>' ;
        			
        		}else{
        			body = '<div class="w2ui-centered">'+
	    				'<div class="popup-contents">' + BundleResource.getString('label.codeManager.delete') + '</div>'+
	    				'<div class="popup-btnGroup">'+
	    					'<button id="codeMgrOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
	    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.cancel') + '</button>'+
	    				'</div>'+
    				'</div>' ;
        			
        		}
        		
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
        
        deleteIDCheck : function(item){
        	var id = item.id;
        	
        	var childCheckFunc = function(dataAC){
        		for(var i=0; i<dataAC.length; i++){
        			id += "_"+dataAC[i].id;
        			var subItem = dataAC[i];
        			if(subItem.nodes.length > 0){
        				childCheckFunc(subItem.nodes);
        			}
        		}
        		
        		return id;
        	}
        	
        	if(item.nodes.length > 0){
        		return childCheckFunc(item.nodes);
        	}else{
        		return id;
        	}
        },
        
        deleteResult : function(model){
        	var cnt = model.id.split("_").length;
//        	$("#bottomTree").html(cnt + BundleResource.getString('label.codeManager.codeDelete'));
        	$("#bottomTree").animate({left:0}, 5000, function(e){$("#bottomTree").html("");});
        },
        
        addResult : function(){
//        	$("#bottomTree").html(BundleResource.getString('label.codeManager.add'));
        	$("#bottomTree").animate({left:0}, 5000, function(e){$("#bottomTree").html("");});
        },
        
        deleteExecute : function(){
        	var selectItem = w2ui['codeMgrAssetTree'].get(w2ui["codeMgrAssetTree"].selected);
        	var parentItem = w2ui['codeMgrAssetTree'].get(selectItem.parentId);
    		
        	if(parentItem.nodes.length < 2){
    			parentItem.img = "";
    			parentItem.icon = "fas fa-cube fa-lg";
    		}
    		
    		var idGroup = codeMgr.deleteIDCheck(selectItem);
    		
    		var deleteGroup = idGroup.split("_");
    		
    		var model = new Model();
    		model.set({id: idGroup});
    		model.url = "codeManager/getCodeList"+"/"+idGroup;
    		model.destroy({
                success: function(model, response) {
                	
                	var modelList = model.id.split("_");
                	
                	for(var i=0; i < modelList.length; i++){
                		var modelId = modelList[i];
                		codeMgr.collection.remove(modelId);
                	}
                	
					w2ui["codeMgrAssetTree"].remove(w2ui["codeMgrAssetTree"].selected);
		    		
		    		w2ui['codeMgr_properties'].record = {
		    				id:'',
		    				name:'',
		    				codeDesc:'',
		    				parentId:'',
		    				sortOrder:''
					}
		    		$("#inStatus").prop('checked', false);
		    		$("#outStatus").prop('checked', false);
		    		w2ui['codeMgr_properties'].refresh();
		    		
		    		codeMgr.deleteResult(model);
                }
            });
    		
        },
        
        init : function(){
        	
        	codeMgr = this;

        	$("#contentsDiv").w2layout({
        		name:'codeMgrlayout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
        	});
        	
        	var leftContent = '<div id="leftTop" style="height:35px">'+
        	'<i id="codeMgrAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
    		'<i id="codeMgrDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del"></i>'+
    		'<i id="codeMgrModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Modify"></i>'+
    		'</div>'+
    		'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Code List</div>'+
	    		'<div class="dashboard-contents"><div id="leftBottom"></div></div>'+
	    	'</div>';
        	
        	$("#leftContents").html(leftContent);
        	
        	this.createCodeTree();
        	
        	var mainSub = '<div id="mainTop"></div>'+
					        	'<div id="mainBottom">'+
						        	'<div class="dashboard-panel" style="width:100%">'+
							    		'<div class="dashboard-title">Detailed Asset Information</div>'+
							    		'<div class="dashboard-contents" style="position:relative;">'+
							    			'<div class="w2ui-contents" id="detailInfo">'+
									    		'<div class="w2ui-page page-0">'+
										            '<div class="w2ui-field">'+
										                '<label>CODE NAME</label>'+
										                '<div>'+
										                    '<input name="name" type="text" maxlength="100" size="60"/>'+
										                '</div>'+
										            '</div>'+
										            
										            '<div class="w2ui-field">'+
											            '<label>COLUMN 1</label>'+
											            '<div>'+
											            '<input name="column1" type="text" maxlength="100" size="60"/>'+
											            '</div>'+
										            '</div>'+
										            '<div class="w2ui-field">'+
											            '<label>COLUMN 2</label>'+
											            '<div>'+
											            	'<input name="column2" type="text" maxlength="100" size="60"/>'+
											            '</div>'+
										            '</div>'+
										            '<div class="w2ui-field">'+
										                '<label>DESC</label>'+
										                '<div>'+
										                	'<input name="codeDesc" type="text" maxlength="100" size="60"/>'+
										                '</div>'+
										            '</div>'+
										            '<div class="w2ui-field">'+
										                '<label>ROW NUM</label>'+
										                '<div>'+
										                	'<input name="sortOrder" type="text" maxlength="100" size="60"/>'+
										                '</div>'+
										            '</div>'+
										            '<div id="inOutTableFields" class="w2ui-field">'+
											            '<label>INOUT STATUS</label>'+
											            '<div class="w2ui-field">'+
									    					'<label><input type="radio" id="inStatus" name="inOutTableFieldsStatus" readonly="readonly" value="1" /><label>IN</label></label>'+
									    					'<label><input type="radio" id="outStatus" name="inOutTableFieldsStatus" readonly="readonly" value="0" /><label>OUT</label></label>'+
									    				'</div>'+
										            '</div>'+
										          '</div>'+
										       '</div>'+
										       "<div class='disableClass'></div>"+
									       '</div>'+
							    		'</div>'+
						    		'</div>'+
						    	'</div>';
        	
        	$("#mainContents").html(mainSub);
        	
        	var rightContent = '<div id="rightTop" style="width:100%;height:100%;visibility:hidden; ">'+
        	'<i id="codeMgrSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save"></i>'+
    		'<i id="codeMgrCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel"></i>'+
        	'</div>';
        	
        	$("#mainTop").html(rightContent);
        	
        	$('#detailInfo').w2form({ 
        		name : 'codeMgr_properties',
    			focus : 1,
    			fields : [
					{name:'name', type: 'text', disabled:true, required:true, html:{caption:'NAME'}},
					{name:'column1', type: 'text', disabled:true, required:false, html:{caption:'COLUMN1'}},
					{name:'column2', type: 'text', disabled:true, required:false, html:{caption:'COLUMN2'}},
					{name:'codeDesc', type: 'text', disabled:true, required:false, html:{caption:'DESC'}},
					{name:'sortOrder', type: 'int', disabled:true, required:false, html:{caption:'ROW NUM'}}
    			],
    			record:{
    				name:'',
    				column1:'',
    				column2:'',
    				codeDesc:'',
    				parentId:'',
    				sortOrder:''
				},
				
				onChange : function(event){
					//console.log("onChange");
				}
            });
        	
        	$("#inOutTableFields").hide();
        	$("#codeMgrDelBtn").prop('disabled', true);
			$("#codeMgrDelBtn").removeClass('link');
			$("#codeMgrModifyBtn").prop('disabled', true);
			$("#codeMgrModifyBtn").removeClass('link');
        },
        
        createCodeTree : function(){
        	
        	$("#leftBottom").w2sidebar({
        		name : 'codeMgrAssetTree',
                bottomHTML : '<div id="bottomTree"></div>',
        		nodes: [
                    { id: 'Code', text: 'CODE LIST', expanded: true, group: true, 
                     nodes: [{id: 'root', text: 'ROOT', expanded:true, img: 'fa icon-folder'}]
                    }
                ],
                
                onClick: function(event) {
                	if(codeMgr.xFlug){
                		var seletId = event.target;
                        var selectItem = this.get(seletId);
                        var inOutStatus = selectItem.inOutStatus;
                        
                        if(event.node.id == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca" || event.node.parentId == "9e4236ad-b2d9-2ed6-d158-4b3d0c8307ca"){
                        	$("#inOutTableFields").show();
        	    			if(inOutStatus == 1){
                            	$("#inStatus").prop('checked', true);
                            	$("#outStatus").prop('checked',false);
                            }else{
                            	$("#inStatus").prop('checked', false);
                            	$("#outStatus").prop('checked',true);
                            }
        	    		}else{
        	    			$("#inOutTableFields").hide();
        	    		}
                        
                        w2ui['codeMgr_properties'].record = {
                        		id:selectItem.id,
                        		name:selectItem.name,
                        		inOutStatus : inOutStatus,
                				column1 : selectItem.column1,
                				column2 : selectItem.column2,
                				codeDesc:selectItem.codeDesc,
                				parentId:selectItem.parentId,
                				sortOrder:selectItem.sortOrder
                		};
                        
                        _.each(w2ui['codeMgr_properties'].fields, function(field){
                			field.disabled = true;
                		});
                		
                		w2ui['codeMgr_properties'].refresh();
                		
                		codeMgr.selectItem = selectItem;
                		
                	}
                	
                },
                
                onRefresh : function(event){
                	
                }
        	});
        	
        	w2ui["codeMgrAssetTree"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		codeMgr.btnValidationFunc();
        	});
        	
        	w2ui["codeMgrAssetTree"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		codeMgr.btnValidationFunc();
        	});
        },
        
        start: function() {
        	this.collection = new Collection();
        	this.collection.fetch({reset:true});
        	this.listenTo(this.collection, "reset", this.resetData);
        	
        	this.eventListenerRegister();
        },
        
        /*이벤트 등록*/
        eventListenerRegister : function(){
        	//삭제 확인
        	$(document).on("click", "#codeMgrOkBtn", this.deleteExecute);
        	//추가 확인
        	$(document).on("click", "#codeMgrPopupOkBtn", this.validateCheckFunc);
        	
        	//추가
        	$(document).on("click", "#codeMgrAddBtn", this.addData);
        	//삭제
        	$(document).on("click", "#codeMgrDelBtn", this.deleteData);
        	//수정
        	$(document).on("click", "#codeMgrModifyBtn", this.modifyData);
        	//저장
        	$(document).on("click", "#codeMgrSaveBtn", this.saveData);
        	//취소
        	$(document).on("click", "#codeMgrCancelBtn", this.cancelConfirm);
        	//취소 확인 버튼
        	$(document).on("click", "#codeMgrCancelOKBtn", this.cancelData);
        	
        },
        
        cancelConfirm : function(){
        	
        	//var bodyContents = "취소 시 내용이 변경 되지 않습니다.";
        	var bodyContents = BundleResource.getString('label.codeManager.notChanedWhenCanceled');
    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="codeMgrCancelOKBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.codeManager.confirm') + '</button>'+
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
        
        
        /*이벤트 해제*/
        removeEventListener : function(){
        	$(document).off("click", "#codeMgrOkBtn");
        	$(document).off("click", "#codeMgrPopupOkBtn");
        	
        	$(document).off("click", "#codeMgrAddBtn");
        	$(document).off("click", "#codeMgrDelBtn");
        	$(document).off("click", "#codeMgrModifyBtn");
        	$(document).off("click", "#codeMgrSaveBtn");
        	$(document).off("click", "#codeMgrCancelBtn");
        	$(document).off("click", "#codeMgrCancelOKBtn");
        },
        
        resetData : function(method, model, options){
        	this.render(method.toJSON());
        	
        	this.listenTo(this.collection, "sync", this.setData);
        },
        
        setData : function(method, result, options){
        	if(options.xhr.statusText === "success"){
        		var item = method.toJSON();
        		var parentItem = null;
        		switch(result){
	        		case 100 :
	        			//insert
	        			item.text = item.name;
	        			item.icon = 'fas fa-cube fa-lg';
	        			if(w2ui["codeMgrAssetTree"].selected && w2ui["codeMgrAssetTree"].selected !== "root"){
	        				parentItem = w2ui["codeMgrAssetTree"].get(w2ui["codeMgrAssetTree"].selected);
	        				parentItem.img = "fa icon-folder";
	        				parentItem.icon = '';
	        				w2ui['codeMgrAssetTree'].expand(w2ui["codeMgrAssetTree"].selected);
	        			}
	        			
	        			w2ui['codeMgrAssetTree'].insert(item.parentId, null, [item]);
	        			
	        			if(parentItem){
	        				this.orderByDesc(parentItem.nodes);
	        			}
	        			
	        			w2ui['codeMgrAssetTree'].refresh();
	        			this.addResult();
	        			break;
	        		case -100 :
	        			//삽입 실패
	        			console.log("insert fail ##########");
	        			break;
	        		case 300 :
	        			//update
	        			console.log("update sucess ##########");
	        			parentItem = w2ui["codeMgrAssetTree"].get(w2ui["codeMgrAssetTree"].get(w2ui["codeMgrAssetTree"].selected).parentId);
	        			this.orderByDesc(parentItem.nodes);
	        			w2ui['codeMgrAssetTree'].refresh();
	        			break;
        		}
        		
        		codeMgr.btnDisabledFunc(false);
        	}
        },
        
        orderByDesc : function(nodes){
        	for(var i=0; i < nodes.length-1; i++){
				for(var j=i+1; j < nodes.length; j++){
					if(parseInt(nodes[i].sortOrder) > parseInt(nodes[j].sortOrder)){
						var temp = nodes[i];
						nodes[i] = nodes[j];
						nodes[j] = temp;
					}
				}
			}
        },
        
        createTree : function(arrayList, rootId){
        	var rootNodes = [];
			var traverse = function (nodes, item, index) {
				
				if (nodes instanceof Array) {
					return nodes.some(function (node) {
						if (node.id === item.parentId) {
							node.nodes = node.nodes || [];
							node.nodes.push(arrayList.splice(index, 1)[0]);
							
							if(node.nodes.length > 0){
								node.img = 'fa icon-folder';
								node.icon = '';
								codeMgr.orderByDesc(node.nodes);
							}
							
							node.expanded = true;
							return ;
						}

						return traverse(node.nodes, item, index);
						
					});
				}
			};
			
			while (arrayList.length > 0) {
				arrayList.some(function (item, index) {
					if (item.parentId === rootId) {
						return rootNodes.push(arrayList.splice(index, 1)[0]);
					}
					
					return traverse(rootNodes, item, index);
				});
			}
			
			return rootNodes;
        	
        },
        
        render : function(result){
        	
        	result.forEach(function(item,idx){
        		item.img = '';
        		item.icon = 'fas fa-cube fa-lg';
        	});
        	
        	var treeList = this.createTree(result, "root");
        	
        	for(var i=0; i < treeList.length; i++){
        		var item = treeList[i];
        		//1depth만 열거면 여기서
				w2ui['codeMgrAssetTree'].insert('root', null, item);
        	}
        	
			/*for(var i=0; i < groupList.length; i++){
				
				var item = groupList[i];
				
				item.text = item.name;
				
				item.expanded = true;
				
				item.img = 'fa icon-folder';
				
				var groupName = item.id;
				
				var dataList = _.filter(result, function(obj){
					return obj.parentId === groupName;
				});
				
				if(dataList.length > 0){
					item.img = 'fa icon-folder';
				}else{
					item.img = '';
				}
				
				w2ui['codeMgrAssetTree'].insert('root', null, item);
				
				for(var j=0; j < dataList.length; j++){
					var subItem = dataList[j];
					subItem.text = subItem.name;
				}
				
				w2ui['codeMgrAssetTree'].insert(groupName, null, dataList);
				
			}
			
			w2ui['codeMgrAssetTree'].refresh();*/
			
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
        
        destroy: function() {
        	console.log('codeManager destroy');
        	
        	if(w2ui['codeMgrAssetTree']){
    			w2ui['codeMgrAssetTree'].destroy();
    			//delete w2ui["codeMgrAssetTree"];
    		}
        	
        	if(w2ui['codeMgr_properties']){
        		w2ui['codeMgr_properties'].destroy();
        	}
        	
        	if(w2ui['codeMgr_popup_properties']){
        		w2ui['codeMgr_popup_properties'].destroy();
        	}
        	
        	if(w2ui['codeMgrlayout']){
        		w2ui['codeMgrlayout'].destroy();
        	}
        	
        	this.removeEventListener();
        	
        	codeMgr = null;
        	
        	this.undelegateEvents();
        }
    })

    return Main;
});