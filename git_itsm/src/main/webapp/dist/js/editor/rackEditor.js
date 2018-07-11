define([
    "jquery",
    "underscore",
    "backbone",
    "rackEditor",
    "text!views/editor/rack",
    "w2ui",
    "jqueryuiLayout",
    "css!cs/editor/rackEditor"
],function(
    $,
    _,
    Backbone,
    RackLoader,
    JSP,
    W2ui
){
	var that;
	var Model = Backbone.Model.extend({
		model:Model,
		url:'rackEditor',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		this.rackAlign = null,
    		this.elements = {
    			sceneComp : null,
    			rackArr : []
    		};
    		
    		//objectTree에서 선택한 값을 가지고 있는 변수
    		this.selectItem = null; //왼쪽 트리에서 선택한 정보
    		this.selectRackItem = null; //트리에서 선택한 Rack asset 정보(DB 조회)
    		this.$el.append(JSP);
    		this.init();
    		this.start();
        },
        
        events : {
        	'change #parameter_Opacity' : 'onParameter_Opacity'
        },
        
        init: function() {
        	
        	this.listNotifiCation("getConfig");
        	
        	that = this;
        	
        	this.eventListenerRegister();
        	
        	$("#racklocationResultBoard").text("Select a Location");
        	
        	/*
        	 * 좌측 Layout
        	 * */
        	this.createLeftTree();
        	
        	/*
        	 * 중앙 Layout
        	 * */
        	var layoutSettings = {
    				
        			applyDefaultStyles: false, 
    				
    				defaults: {
    					spacing_open: 4, 
    					spacing_closed: 4,
    					resizable: false
    				}, 
    				
    				west : {
    					size : 300
    				},
    				
    				center: {
    					onresize: function() {
    						w2ui["rackLayout"].resize();
    						that.elements.sceneComp.engine.resize();
    					}
    				},
    				
    				east : {
    					size : 300
    				},
    				
    				south: {
    					togglerLength_open: 0,
    					togglerLength_closed: 0,
    					spacing_open: 3,
    					spacing_closed: 3,
    				}
    				
    			}
        	
        	$('#RACK-EDITOR-MAIN').layout(layoutSettings);
        	
        	$('#centerContents').w2layout({
                name: 'rackLayout',
                padding: 4,
                panels: [
                    { type: 'left', size: '45%', resizable: true, content: '<div id="leftMain"></div>' },
                    { type: 'main', size: '55%', content: '<div id="rightMain" style="height: 100%;"><canvas id="rackCanvas" class="canvas-3d"></canvas></div>' }
                ],
                
                onResize: function(event) {
                	if(that.elements.sceneComp){
                		
                		var func = function(){
                			that.elements.sceneComp.engine.resize();
                		}
                		
                		setTimeout(func, 10);
                	}
                }
                
            });
        	
        	$("#rackCanvas").ready(function(){
        		that.start();
        	});
        	
        	var leftMainContents = '<div class="dashboard-panel" >'+
						    		'<div class="dashboard-title">Rack In Server List</div>'+
						    		'<div class="dashboard-contents">'+
							    		'<div id="leftMainMiddle"></div>'+
							        	'<div id="leftMainBottom">'+
							        		'<button id="generateBtn" class="darkButtonDisable" disabled>Generate</button>'+
							        		'<button id="resultSaveBtn" class="darkButtonDisable" disabled>Save</button>'+
							        	'</div>'+
						    		'</div>'+
						    	'</div>';
        	
        	$("#leftMain").html(leftMainContents);
        	
        	this.createMainTable();
        	
        	/*
        	 * 우측 Layout
        	 * */
        	this.createRackProperties();
        	this.createServerProperties();
        	this.racEditBtnStatus("disable");
        },
        
        lockCheckFunc : function(status){
        	if(status ==="lock"){
        		w2ui['objectList'].lock();
        		w2ui['rackInGrid'].lock();
        		
        		$("#rackSeartchLocationBtn").attr('disabled', true);
        		document.getElementById("rackSeartchLocationBtn").className = "rackSearchDisableBtn";
        		
        	}else{
        		w2ui['objectList'].unlock();
        		
        		var arr = w2ui['rackInGrid'].records;
        		
        		if(arr.length > 0){
        			w2ui['rackInGrid'].unlock();
        		}
        		
        		$("#rackSeartchLocationBtn").attr('disabled', false);
        		document.getElementById("rackSeartchLocationBtn").className = "rackSearchBtn";
        	}
        },
        
        racEditBtnStatus : function(status){
        	switch(status){
	        	case "disable":
	        		$("#rackEditorSaveBtn").css("display", "none");
	        		$("#rackEditorCancelBtn").css("display", "none");
	        		$("#rackEditorModifyBtn").css("display", "none");
	        		break;
	        	case "edit":
	        		
	        		$("#rackEditorPropertiesIcons").css("top", "10px"); //2px
	        		
	        		$("#rackEditorSaveBtn").css("display", "");
	        		$("#rackEditorCancelBtn").css("display", "");
	        		$("#rackEditorModifyBtn").css("display", "none");
	        		
	        		_.each(w2ui['rackEditor_rack_properties'].fields, function(field){
	        			if(field.name === "unitSize"  ){
	        				field.disabled = false;
	        			}else{
	        				field.disabled = true;	
	        			}
	        		});
	        		
	        		$("#unitSize").focus();
	        		
	        		w2ui['rackEditor_rack_properties'].refresh();
	        		
	        		this.lockCheckFunc("lock");
	        		break;
	        	case "normal":
	        		
	        		$("#rackEditorPropertiesIcons").css("top", "10px"); //5px
	        		
	        		$("#rackEditorSaveBtn").css("display", "none");
	        		$("#rackEditorCancelBtn").css("display", "none");
	        		$("#rackEditorModifyBtn").css("display", "");
	        		
	        		_.each(w2ui['rackEditor_rack_properties'].fields, function(field){
	        			field.disabled = true;	
	        		});
	        		
	        		w2ui['rackEditor_rack_properties'].refresh();
	        		
	        		this.lockCheckFunc("unlock");
	        		break;
        	}
        },
        
        createRackProperties : function(){
        	
        	var rackProperty = '<div class="w2ui-page page-0">'+
					            '<div class="w2ui-field">'+
					            '<label>ID</label>'+
					            '<div>'+
					                '<input name="id" type="text" maxlength="100" size="17" style="width:120px;"/>'+
					            '</div>'+
					        '</div>'+
					        '<div class="w2ui-field">'+
					            '<label>NAME</label>'+
					            '<div>'+
					                '<input name="name" type="text" maxlength="100" size="17" style="width:120px;"/>'+
					            '</div>'+
					        '</div>'+
					        '<div class="w2ui-field">'+
					            '<label>MODEL</label>'+
					            '<div>'+
					            	'<input name="model" type="text" maxlength="100" size="17" style="width:120px;"/>'+
					            '</div>'+
					        '</div>'+
					        '<div class="w2ui-field">'+
					            '<label>RACK SIZE</label>'+
					            '<div>'+
					            	'<input name="unitSize"  maxlength="100" size="17" style="width:120px;"/>'+
					            '</div>'+
					        '</div>'+
					      '</div>';
        	
        	$("#rackPropertiesInfo").html(rackProperty);
        	
        	$("#rackPropertiesInfo").w2form({
        		name : 'rackEditor_rack_properties',
    			focus : -1,
    			fields : [
    				{name:'id', type: 'text', disabled:true, required:false, html:{caption:'ID'}},
					{name:'name', type: 'text', disabled:true, required:false, html:{caption:'NAME'}},
					{name:'model', type: 'text', disabled:true, required:false, html:{caption:'MODEL'}},
					{name:'unitSize', type: 'int', disabled:true, required:false, html:{caption:'RACK SIZE'}}
    			],
    			record:{
    				id:'',
    				name:'',
    				model:'',
    				unitSize:''
				},
        	});
        },
        
        createServerProperties : function(){
        	
        	var serverProperty = '<div class="w2ui-page page-0">'+
						            '<div class="w2ui-field">'+
							            '<label>ID</label>'+
							            '<div>'+
							                '<input name="id" type="text" maxlength="100" size="17" style="width:120px;"/>'+
							            '</div>'+
						            '</div>'+
						            '<div class="w2ui-field">'+
							            '<label>NAME</label>'+
							            '<div>'+
							            	'<input name="name" type="text" maxlength="100" size="17" style="width:120px;"/>'+
							            '</div>'+
						            '</div>'+
							        '<div class="w2ui-field">'+
							            '<label>MODEL</label>'+
							            '<div>'+
							            	'<input name="model" type="text" maxlength="100" size="17" style="width:120px;"/>'+
							            '</div>'+
							        '</div>'+
							        '<div class="w2ui-field">'+
							            '<label>UNIT SIZE</label>'+
							            '<div>'+
							            	'<input name="unitSize" type="text" maxlength="100" size="17" style="width:120px;"/>'+
							            '</div>'+
							        '</div>'+
							        '<div class="w2ui-field">'+
								        '<label>UNIT INDEX</label>'+
								        '<div>'+
								        	'<input name="unitIndex" type="text" maxlength="100" size="17" style="width:120px;"/>'+
								        '</div>'+
							        '</div>'+
							        '<div class="w2ui-field">'+
								        '<label>START POSITION</label>'+
								        '<div>'+
								        	'<input name="startPosition" type="text" maxlength="100" size="17" style="width:120px;"/>'+
								        '</div>'+
							        '</div>'+
							      '</div>';
						
			$("#serverPropertiesInfo").html(serverProperty);

        	$("#serverPropertiesInfo").w2form({
        		name : 'rackEditor_server_properties',
    			focus : -1,
    			fields : [
    				{name:'id', type: 'text', disabled:true, required:false, html:{caption:'ID'}},
    				{name:'name', type: 'text', disabled:true, required:false, html:{caption:'NAME'}},
					{name:'model', type: 'text', disabled:true, required:false, html:{caption:'MODEL'}},
					{name:'unitSize', type: 'int', disabled:true, required:false, html:{caption:'UNIT SIZE'}},
					{name:'unitIndex', type: 'int', disabled:true, required:false, html:{caption:'UNIT INDEX'}},
					{name:'startPosition', type: 'int', disabled:true, required:false, html:{caption:'START POSITION'}}
    			],
    			
    			record:{
    				id:'',
    				name:'',
    				model:'',
    				unitSize:'',
    				unitIndex:'',
    				startPosition:''
				},
        	});
        },
        
        createLeftTree : function(){
        	
        	if(w2ui["objectList"]){
        		w2ui["objectList"].destroy();
        	}
        	
        	$("#objectList").w2sidebar({
        		name : 'objectList',
        		style:'height:calc(100% - 148px);border-radius: .28571429rem;box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.06) !important;',
        		nodes: [
        			{ id: 'Asset', text: 'ASSET LIST', expanded: true, group: true}
                ],
                
                onClick: function(event) {
                	
                	if(that.selectItem){
                		if(event.target === that.selectItem.id){
                    		return ;
                    	}
                	}
                	
                	var selectItem = this.get(event.target);
                	that.selectItem = selectItem;
                	
                	that.refreshRackInfo(that.selectItem);
                	
                	$("#parameter_Opacity").attr('disabled', false);
                }
        	});
        	
        },
        
        refreshRackInfo : function(selectItem, type){
        	w2ui["rackInGrid"].selectNone();
        	
        	if(!type){
        		w2ui['rackEditor_rack_properties'].clear();
            	w2ui['rackEditor_rack_properties'].refresh();
            	
            	w2ui['rackEditor_server_properties'].clear();
            	w2ui['rackEditor_server_properties'].refresh();
        	}
        	
        	document.getElementById("resultSaveBtn").className = "darkButtonDisable";
    		$("#resultSaveBtn").attr('disabled', true);
    		
        	//실장장비 리스트
        	that.listNotifiCation("getRackInList", selectItem);
        	
        	//rack Info
        	if(!type){
        		that.listNotifiCation("getRackInfo", selectItem);
        	}
        	
        },
        
        createMainTable : function(){
        	
        	if(w2ui["rackInGrid"]){
        		w2ui["rackInGrid"].destroy();
        	}
        	
        	$("#leftMainMiddle").w2grid({
        		name:'rackInGrid',
        		show:{
        			toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true,
                    lineNumbers: true
				},
				
				recordHeight : 30,
				
				style:'padding:5px;width:100%;height:calc(100vh - 200px);',
				
				searches:[
					{ field: 'assetId', caption: 'ID ', type: 'text' }
				],
				
				columns: [
					{ field: 'assetId', caption: 'ID', size: '100%', sortable: true, attr: 'align=center'},
					{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'mappingYN', caption: 'MOD-MAP', size: '70px', sortable: true, attr: 'align=center'},
                    { field: 'unitSize', caption: 'SIZE', size: '70px', tooltip:'UNIT SIZE', sortable: true, 
                    	attr: 'align=center', editable:{type:'int', min:1}},
                    { field: 'unitIndex', caption: 'INDEX', size: '50px', tooltip:'UNIT INDEX', sortable: true, 
                    	attr: 'align=center', editable:{type:'int', min:0, max:10} },
                    { field: 'startPosition', caption: 'SP', size: '50px', tooltip:'Start Position', sortable: true, 
                    	attr: 'align=center', editable:{type:'int', min:1}}
				]      
			    
        	});
        	
        	w2ui["rackInGrid"].on({phase: 'before', execute:'after', type : 'restore'}, function(event){
        		that.changeCheck();
        	});
        	
        	w2ui["rackInGrid"].on({phase: 'before', execute:'after', type : 'change'}, function(event){
        		console.log("change");
        		that.changeCheck();
        	});
        	
        	/*w2ui["rackInGrid"].on({phase: 'before', execute:'before', type : 'change'}, function(event){
        		that.changeCheck();
        	});*/
        	
        	w2ui["rackInGrid"].lock();
        	
        	var icon = '<i id="rackEditorAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add" style="margin-right: 5px;"></i>'+ //padding-right:10px;
        	'<i id="rackEditorDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del"></i>';
        	
        	$("#tb_rackInGrid_toolbar_right").append(icon);
        },
        
        changeCheck : function(event){
        	
        	var changeAC = w2ui["rackInGrid"].getChanges();
	    	
	    	if(changeAC.length > 0){
	    		document.getElementById("resultSaveBtn").className = "darkButton";
	    		$("#resultSaveBtn").attr('disabled', false);
	    	}else{
	    		document.getElementById("resultSaveBtn").className = "darkButtonDisable";
	    		$("#resultSaveBtn").attr('disabled', true);
	    	}
        },
        
        createServerListPOPUP : function(dataProvider){
        	var dataProvider = dataProvider;
        	var body = '<div class="w2ui-centered">'+
				'<div id="rackEditorServerContents" ></div>'+
				'<div id="rackEditorServerBottom" style="padding-top:8px;">'+
				'</div>'+
			'</div>';
        	
        	w2popup.open({
				title : 'Available Server List',
		        body: body,
		        height : 500,
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		$("#rackEditorServerBottom").html('<button id="rackEditorServerOkBtn" class="darkButton">Done</button>');
		        		$("#rackEditorServerContents").w2grid({
		            		name:'AvailableGrid',
		            		show:{
		            			toolbar: true,
		                        footer:false,
		                        toolbarSearch:false,
		                        toolbarReload  : false,
		                        searchAll : false,
		                        toolbarColumns : false,
		                        selectColumn: true,
		                        lineNumbers: true
		    				},
		    				
		    				recordHeight : 30,
		    				
		    				style:'width:100%; height:414px;',
		    				
		    				searches:[
		    					{ field: 'assetId', caption: 'ID ', type: 'text' }
		    				],
		    				
		    				columns: [
		    					{ field: 'assetId', caption: 'ID', size: '100%', sortable: true, attr: 'align=center'},
		    					{ field: 'assetName', caption: 'NAME', size: '70px', sortable: true, attr: 'align=center'},
		                        { field: 'mappingYN', caption: 'MOD-MAP', size: '70px', sortable: true, attr: 'align=center', style:'padding-left:10px;'},
		                        { field: 'unitSize', caption: 'SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:10px;' },
		                        { field: 'unitIndex', caption: 'INDEX', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:10px;' },
		                        { field: 'startPosition', caption: 'SP', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:10px;' }
		    				],
		    				
		            	});
		        		
		        		if(dataProvider.length > 0){
		        			w2ui['AvailableGrid'].unlock();
		        		}else{
		        			w2ui['AvailableGrid'].lock();
		        		}
		        		
		        		w2ui['AvailableGrid'].records = dataProvider;
		        		w2ui['AvailableGrid'].refresh();
		        		
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['AvailableGrid'].destroy();
		        }
		        
		    });
        	
        	
        },
        
        resetForm : function(){
        	this.createLeftTree();
        	this.createMainTable();
        	
        	w2ui['rackEditor_rack_properties'].clear();
        	w2ui['rackEditor_rack_properties'].refresh();
        	
        	w2ui['rackEditor_server_properties'].clear();
        	w2ui['rackEditor_server_properties'].refresh();
        	
        	this.selectItem = null; //왼쪽 트리에서 선택한 정보
    		this.selectRackItem = null; //트리에서 선택한 Rack asset 정보(DB 조회)
        },
        
        /*Event Listener Start*/
        eventListenerRegister : function(){
        	
        	$(document).on("contextmenu", function(event){
        		event.preventDefault();
        		if(event.target.id === "rackCanvas"){
        			$("div.custom-menu").remove();
            		$("<div class='custom-menu'>Camera 초기화</div>").appendTo(".content")
            			.css({
            				top:event.pageY+"px",
            				left:event.pageX+"px"
            			});
            		
        		}else{
        			$("div.custom-menu").remove();
        		}
        	});
        	
        	$(document).on("click", "body", function(event){
        		if(event.target.className === "custom-menu"){
        			that.elements.sceneComp.resetCamera();
        		}
        		
        		$("div.custom-menu").remove();
        		
        	});
        	
        	$(document).on('click', '#rackSeartchLocationBtn', function(event){
        		that.listNotifiCation("getLocationList");
        	});
        	
        	$(document).on('click', '#rackEditorPopupOkBtn', function(event){
        		
        		if(w2ui['locPOPUPTree'].selected){
        			var item = w2ui['locPOPUPTree'].get(w2ui['locPOPUPTree'].selected);
        			
        			that.resetForm();
        			
        			$("#racklocationResultBoard").text(item.locName);
        			
        			w2ui["objectList"].lock();
        			
        			that.elements.sceneComp.rackInit();
        			
        			that.listNotifiCation("getSelectLocationList", item);
        			
        			w2popup.close();
        		}else{
        			w2popup.message({ 
            	        width   : 360, 
            	        height  : 500,
            	        html    : '<div style="padding-top: 174px;padding-bottom: 30px; text-align: center; color:#ffffff;">Location 항목을 선택해 주세요.</div>'+
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">확인</button>'
            	    });
        		}
        		 
        	});
        	
        	//서버 추가
        	$(document).on('click', '#rackEditorAddBtn', function(event){ 
        		that.listNotifiCation("getAvailableAssetList");
        	});
        	
        	//서버 삭제
        	$(document).on('click', '#rackEditorDelBtn', function(event){ 
        		
        		var arr = w2ui["rackInGrid"].getSelection();
        		
        		if(arr.length > 0){
        			var dataAC = [];
        			
        			for(var i=0; i< arr.length; i++){
        				dataAC.push(w2ui["rackInGrid"].get(arr[i]));
        			}
        			
        			//잉여 서버 자산으로 분리
        			that.listNotifiCation("updateServerOutList", dataAC);
        			
        		}else{
        			w2alert('선택한 항목이 없습니다.', "알림");
        		}
        		
        	});
        	
        	//서버리스트 팝업에서 Done 버튼
        	$(document).on('click', '#rackEditorServerOkBtn', function(event){ 
        		
        		var dataArr = [];
        		var arr = w2ui['AvailableGrid'].getSelection();
        		
        		if(arr.length > 0){
        			
        			for(var i=0; i < arr.length; i++){
            			dataArr.push(w2ui['AvailableGrid'].get(arr[i]));
            		}
        			
        			that.listNotifiCation("updateServerInList", dataArr);
        			
        			w2popup.close();
        			
        		}else{
        			w2popup.message({ 
            	        width   : 450, 
            	        height  : 500,
            	        html    : '<div style="padding-top: 174px;padding-bottom: 30px; text-align: center; color:#ffffff;line-height: 22px">선택된 항목이 없습니다.</br>추가 하고자 하는 서버를 선택해 주세요.</div>'+
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">확인</button>'
            	    });
        		}
        		
        	});
        	
        	//Rack Properties 수정
        	$(document).on('click', '#rackEditorModifyBtn', function(event){ 
        		that.racEditBtnStatus("edit");
        		
        		document.getElementById("generateBtn").className = "darkButtonDisable";
        		$("#generateBtn").attr('disabled', true);
        		document.getElementById("resultSaveBtn").className = "darkButtonDisable";
        		$("#resultSaveBtn").attr('disabled', true);
        		
        	});
        	
        	//Rack Properties 저장
        	$(document).on('click', '#rackEditorSaveBtn', function(event){ 
        		
        		var item = w2ui["rackEditor_rack_properties"].record;
        		
        		if(item.unitSize === that.selectRackItem.unitSize){
        			
        			w2alert('변경된 내용이 없습니다.', "알림");
        			
        		}else{
        			that.racEditBtnStatus("normal");
            		
            		that.listNotifiCation("updateRackInfo", item);
        		}
        		
        	});
        	
        	//Rack Properties 취소
        	$(document).on('click', '#rackEditorCancelBtn', function(event){ 
        		that.cancelConfirm();
        	});
        	
        	//Rack Properties 취소 확인
        	$(document).on('click', '#rackEditorCancelOKBtn', function(event){ 
        		that.buttonStatusCheck();
        		that.updateRackProperties();
        	});
        	
        	//Generate 3D View 취소 확인
        	$(document).on('click', '#generateBtn', function(event){ 
        		that.elements.sceneComp.generateServer();
        	});
        	
        	//Save
        	$(document).on('click', '#resultSaveBtn', function(event){ 
        		var changeDataAC = w2ui["rackInGrid"].getChanges();
        		var dataAC = [];
        		
        		for(var i=0; i < changeDataAC.length; i++){
        			var item = _.clone(w2ui["rackInGrid"].get(changeDataAC[i].recid));
        			
        			item.unitFlug = false;
        			
        			for(var name in item.w2ui.changes){
        				
        				if(name ==="unitSize"){
        					item.unitFlug = true;
        				}
        				
        				item[name] = item.w2ui.changes[name];
        			}
        			
        			dataAC.push(item);
        		}
        		
        		that.listNotifiCation("updateServerInfo", dataAC);
        		
        	});
        	
        	//Show Grid Display
        	$("#showGrid").on("click", function(event){
        		var status = $("#showGrid").prop("checked");
        		that.elements.sceneComp.showHideGrid(status);
        	});
        	
        	//Server Name Display
        	$("#showName").on("click", function(event){
        		var status = $("#showName").prop("checked");
        		that.elements.sceneComp.showHideName(status);
        	});
        	
        },
        
        onParameter_Opacity: function(evt){
        	this.elements.sceneComp.lineAlphaProc(evt.target.value);
        },
        
        removeEventListener : function(){
        	$(document).off("contextmenu");
        	$(document).off("click","body");
        	
        	$(document).off('click', '#rackSeartchLocationBtn');
        	$(document).off('click', '#rackEditorPopupOkBtn');
			$(document).off('click', '#rackEditorAddBtn');
			$(document).off('click', '#rackEditorDelBtn');
			$(document).off('click', '#rackEditorServerOkBtn');
			$(document).off('click', '#rackEditorModifyBtn');
			$(document).off('click', '#rackEditorSaveBtn');
			$(document).off('click', '#rackEditorCancelBtn');
			$(document).off('click', '#rackEditorCancelOKBtn');
			$(document).off('click', '#generateBtn');
			$(document).off('click', '#resultSaveBtn');
			$(document).off('click', '#showGrid');
			$(document).off('click', '#showName');
        },
        
        /*
         * Event NotifiCation 관리
         * */
        
        listNotifiCation : function(cmd, param){
        	
        	switch(cmd){
	        	case "getConfig": //Rack 정렬 정보 가져오기
	        		this.getConfig();
	        		break;
        		case "getLocationList": //Site 정보 가져오기
        			this.getLocationList(cmd);
        			break;
        		case "getSelectLocationList": //선택한 사이트 하위 Depth 가져오기
        			this.getSelectLocationList(cmd, param);
        			break;
        		case "getRackInList": //선택한 사이트 하위 Rack In 정보 가져오기
        			this.getRackInList(cmd, param);
        			break;
        		case "getAvailableAssetList": //비 할당된 서버 리스트
        			this.getAvailableAssetList();
        			break;
        		case "getRackInfo": //선택한 사이트 하위 Rack In 정보 가져오기
        			this.getRackInfo(cmd, param);
        			break;
        		case "updateServerInList": //비할당된 서버리스트 업데이트
        			this.updateServerInList(cmd, param);
        			break;
        		case "updateServerOutList": //잉여 서버 자산으로 변경
        			this.updateServerOutList(cmd, param);
        			break;
        		case "updateRackInfo": //Rack Size 변경
        			this.updateRackInfo(cmd, param);
        			break;
        		case "updateServerInfo": //Server Size, index, SP 변경
        			this.updateServerInfo(cmd, param);
        			break;
        	}
        	
        },
        
        updateServerInfo : function(cmd, param){
        	var model = new Model(param);
        	model.url += "/updateServerInfo";
        	model.save({}, {
        		success: function (model, respose, options) {
        			w2alert('변경 되었습니다.', "알림", function(event){
        				that.refreshRackInfo(that.selectItem, "sucess");
        			});
        		},
        		
        		error: function (model, xhr, options) {
        			w2alert('오류가 발생했습니다.', "알림", function(event){
        				that.refreshRackInfo(that.selectItem);
					});
        		}
        	});
        },
        
        updateRackInfo : function(cmd, param){
        	var model = new Model(param);
        	model.url += "/updateRackInfo";
        	model.save({}, {
        		success: function (model, respose, options) {
        			
        			if(respose.status === 100){
        				//console.log("updateRackInfo success");
        			}else{
        				console.log("updateRackInfo fail");
        			}
        			
        			w2alert('변경 되었습니다.', "알림", function(event){
        				that.refreshRackInfo(that.selectItem);
        			});
        			
        		},
        		
        		error: function (model, xhr, options) {
        			
        			w2alert('오류가 발생했습니다.', "알림", function(event){
        				that.refreshRackInfo(that.selectItem);
					});
        			
        		}
        	});
        },
        
        updateServerOutList : function(cmd, param){
        	var obj = {};
        	obj.parentId = this.selectItem.id;
        	obj.list = param;
        	var model = new Model(obj);
        	model.url += "/updateServerOutList";
        	model.save({}, {
        		success: function (model, respose, options) {
        			
        			if(respose.status === 100){
        				//console.log("updateServerOutList success");
        			}else{
        				console.log("updateServerOutList fail");
        			}
        			
        			that.refreshRackInfo(that.selectItem);
        			
        		},
        		
        		error: function (model, xhr, options) {
        			
        			w2alert('오류가 발생했습니다.', "알림", function(event){
        				that.refreshRackInfo(that.selectItem);
					});
        			
        		}
        	});
        },
        
        updateServerInList : function(cmd, param){
        	var obj = {};
        	obj.parentId = this.selectItem.id;
        	obj.list = param;
        	var model = new Model(obj);
        	model.url += "/updateServerInList";
        	model.save({}, {
        		success: function (model, respose, options) {
        			
        			if(respose.status === 100){
        				//console.log("updateServerInList success");
        			}else{
        				console.log("updateServerInList fail");
        			}
        			
        			that.refreshRackInfo(that.selectItem);
        			
        		},
        		
        		error: function (model, xhr, options) {
        			
        			w2alert('오류가 발생했습니다.', "알림", function(event){
        				that.refreshRackInfo(that.selectItem);
					});
        			
        		}
        	});
        },
        
        
        getRackInfo : function(cmd, param){
        	var model = new Model();
        	model.url += "/"+ cmd + "/"+param.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setRackInfo);
        },
        
        setRackInfo : function(method, model, options){
        	
        	if(model.length > 0){
        		var item = model[0];
        		that.selectRackItem = item;
        		that.updateRackProperties();
        		$("#parameter_Opacity").val(1);
        		that.elements.sceneComp.createRackInLine(item);
        	}else{
        		that.racEditBtnStatus("disable");
        	}
        	
        },
        
        updateRackProperties : function(){
        	var item = that.selectRackItem;
        	
        	w2ui['rackEditor_rack_properties'].record = {
            		id:item.assetId,
    				name:item.assetName,
    				model:item.modelName.toUpperCase(),
    				unitSize:item.unitSize
    		};
    		
    		w2ui['rackEditor_rack_properties'].refresh();
    		
    		that.racEditBtnStatus("normal");
        },
        
        getAvailableAssetList : function(){
        	var model = new Model();
        	model.url += "/getAvailableAssetList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setAvailableAssetList);
        },
        
        setAvailableAssetList : function(method, model, options){
        	that.createServerListPOPUP(model);
        },
        
        getConfig : function(){
        	var model = new Model();
        	model.fetch();
        	this.listenTo(model, "sync", this.setConfig);
        },
        
        setConfig : function(method, model, options){
        	if(model){
        		this.rackAlign = model[0];
        	}
        },
        
        getRackInList : function(cmd, param){
        	var model = new Model();
        	model.url += "/"+ cmd + "/"+param.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setRackInList);
        },
        
        setRackInList : function(method, model, options){
        	if(model.length > 0){
        		document.getElementById("generateBtn").className = "darkButton";
        		$("#generateBtn").attr('disabled', false);
        		//w2ui["rackInGrid"].unlock();
        	}else{
        		document.getElementById("generateBtn").className = "darkButtonDisable";
        		$("#generateBtn").attr('disabled', true);
        		//w2ui["rackInGrid"].lock();
        	}
        	
        	w2ui["rackInGrid"].unlock();
        	
        	w2ui["rackInGrid"].records = model;
    		w2ui["rackInGrid"].refresh();
        },
        
        /*Location을 선택했을 때*/
        getSelectLocationList : function(cmd, param){
        	var model = new Model();
        	model.url += "/"+ cmd + "/"+param.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setSelectLocationList);
        },
        
        setSelectLocationList : function(method, model, options){
        	if(model){
        		var parentId = method.url.split("/")[2];
        		
        		var sites = model[0].nodes;
        		var currentItem = null;
        		for(var i=0; i < sites.length; i++){
        			var item = sites[i];
        			if(parentId === item.id){
        				w2ui['objectList'].insert("Asset", null, item.nodes);
        				w2ui["objectList"].unlock();
        				currentItem = item;
        				break;
        			}
        		}
        		
        		this.objectTreeDisableCheckFunc(currentItem.nodes);
        	}
        },
        
        objectTreeDisableCheckFunc : function(nodes){
			
			for(var i=0;i < nodes.length; i++){
				var item = nodes[i];
				if(item.codeName !== "RACK"){
					w2ui['objectList'].disable(item.id);
				}else{
					that.elements.rackArr.push(item);
				}
				
				if(item.nodes !== null && item.nodes.length > 0 ){
					this.objectTreeDisableCheckFunc(item.nodes);
				}
			}
		},
		
        getLocationList : function(cmd){
        	var model = new Model();
        	model.url += "/"+ cmd;
        	model.fetch();
        	this.listenTo(model, "sync", this.setLocationList);
        },
        
        setLocationList : function(method, model, options){
        	if(model){
        		
        		var locationVo = model[0];
        		
        		var body = '<div class="w2ui-centered">'+
					'<div id="rackEditorPopupContents" style="width:338px; height:415px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px;"></div>'+
					'<div id="rackEditorPopupBottom">'+
						'<button id="rackEditorPopupOkBtn" class="darkButton">Done</button>'+
					'</div>'+
				'</div>';
        		
	        	w2popup.open({
					title : 'Location',
			        body: body,
			        width : 360,
			        height : 500,
			        type : 'create',
			        opacity   : '0.5',
		    		modal     : true,
				     	showClose : true,
				     	style	  : "overflow:hidden;",
				     	
			        onOpen    : function(event){
			        	event.onComplete = function () {
			        		
			        		$("#rackEditorPopupContents").w2sidebar({
		            			name : 'locPOPUPTree',
		            			style:'width:100%, height:200px',
		                		nodes: [
		                            { id: 'Location', text: 'LOCATION', expanded: true, group: true}
		                        ]
		            		});
			        		
			        		w2ui['locPOPUPTree'].insert("Location", null, locationVo.nodes);
			        	}
			        },
			        
			        onClose   : function(event){
			        	w2ui['locPOPUPTree'].destroy();
			        }
			        
			    });
        	}
        },
        
        /*
         * Event Listener End
         * */
        
        start : function(){
        	that.elements.sceneComp = new Rack3DLoader('#rackCanvas');
    		that.elements.sceneComp.initRackEditor();
        },
        
        removeW2uiComponent : function(){
        	
        	if(w2ui['locPOPUPTree']){
        		w2ui["locPOPUPTree"].destroy();
        	}
        	
        	if(w2ui['objectList']){
        		w2ui["objectList"].destroy();
        	}
        	
        	if(w2ui['rackInGrid']){
        		w2ui['rackInGrid'].off('*');
        		w2ui["rackInGrid"].destroy();
        	}
        	
        	if(w2ui['rackLayout']){
        		w2ui["rackLayout"].destroy();
        	}
        	
        	if(w2ui['rackEditor_rack_properties']){
        		w2ui["rackEditor_rack_properties"].destroy();
        	}
        	
        	if(w2ui['rackEditor_server_properties']){
        		w2ui["rackEditor_server_properties"].destroy();
        	}
        	
        },
        
        buttonStatusCheck : function(){
        	if(w2ui["rackInGrid"].records.length > 0){
        		document.getElementById("generateBtn").className = "darkButton";
        		$("#generateBtn").attr('disabled', false);
        	}
        	
        	if(w2ui["rackInGrid"].getChanges().length > 0 ){
        		document.getElementById("resultSaveBtn").className = "darkButton";
        		$("#resultSaveBtn").attr('disabled', false);
        	}
        },
        
        cancelConfirm : function(){
        	
			var bodyContents = "취소 시 내용이 변경 되지 않습니다.";
			    		
        	var	body = '<div class="w2ui-centered">'+
        	'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
					'<button id="rackEditorCancelOKBtn" onclick="w2popup.close();" class="darkButton">확인</button>'+
					'<button onclick="w2popup.close();" class="darkButton">취소</button>'+
				'</div>'+
			'</div>';
    		
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : '알림',
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        },
        
        generateServer : function(){
        	var dataAC = w2ui["rackInGrid"].records;
        	
        },

        destroy: function() {
        	
        	console.log('Rack Editor destroy');
        	
        	$("div.custom-menu").remove();
        	
        	this.removeEventListener();
        	this.removeW2uiComponent();
        	that = null;
        	
        	this.undelegateEvents();
        }
    })

    return Main;
});