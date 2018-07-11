define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/symbolManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "d3",
    "obj-loader",
    "css!cs/asset/symbolManager"
], function(
    $,
    _,
    Backbone,
    JSP,
    W2ui,
    BundleResource,
    d3
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var Model = Backbone.Model.extend({
		model:Model,
		url:'symbolManager',
		parse: function(result) {
            return {data: result};
        }
	});
	
	var Main = Backbone.View.extend({
		el: '.content .wrap',
		initialize : function(){
			that = this;
			this.mapEditor = null;
			this.elements = {
					
			}
			this.$el.append(JSP);
			this.selectItem = null;
			this.selectedModel = null;
			this.selectedModelId = null;
			this.selectedSVG = null;
			this.copyText = null;
			this.configMode = "normalMode";
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
	
		events : {
			"click #svgTextEditor" : "svgTextEditorHandler"
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#symbolAddBtn", this.addSymbol);
			$(document).on("click", "#symbolModifyBtn", this.modifySymbol);
			$(document).on("click", "#symbolMgrPopupModifyOkBtn", this.modifySymbolOk);
			$(document).on("click", "#symbolApplyBtn", this.symbolApply);
			$(document).on("click", "#symbolDeleteBtn", this.symbolDelete);
			$(document).on("click", "#symbolDeleteOkBtn", this.symbolDeleteOk);
			$(document).on("click", "#svgPriviewBtn", this.showSvgPreview);
			$(document).on("click", "#symbolMgrPopupOkBtn", this.symbolMgrPopupOk);
			$(document).on("click", "#symbolPreviewPopupOkBtn", this.showSymbolEditBox);
			$(document).on("click", "#svgTextCopyBtn", this.textCpoy);
			$(document).on("click", "#svgDeleteBtn", this.svgDelete);
			$(document).on("click", "#assetSymbolDeleteBtn", this.assetSymbolDelete);
		},
		
		start : function(){
			this.eventListenerRegister();
			this.listNotifiCation("getAssetTypeList");
		},
		
		init : function(){
			symbolMgr = this;
			
			$("#contentsDiv").w2layout({
				name : 'symbolMgrLayout',
				panels : [
					{type : 'left', size : 450, resizable : false, content : '<div id="leftContents"></div>'},
					{type : 'main', size : '100%', content : '<div id="mainContents"></div>'}
				]
			});
			
			$("#leftContents").w2layout({
				name : 'symbolMgrLeftLayout',
				panels : [
					{type:'top', size:'35px', content:'<div id="leftTop"></div>'},
        			{type:'main', size:'50%', content:'<div id="leftMiddle"></div>'},
        			{type:'preview', size:'50%', content:'<div id="leftBottom"></div>'}
				]
			});
			
			var leftMiddle =  '<div class="dashboard-panel" style="width:100%;height:calc(50vh - 67px);">'+
					    		'<div class="dashboard-title">Model List</div>'+
					    		'<div class="dashboard-contents"><div id="leftMiddleContent"></div></div>'+
					    	'</div>';
			
			var leftBottom = '<div class="dashboard-panel" style="width:100%;height:calc(50vh - 67px);">'+
						'<div class="dashboard-title">Symbol Preview'+
							'<div id="previewGroupBtn">'+
					    		'<i id="svgDeleteBtn" class="icon fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
								'<i id="svgTextEditor" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Text Edit"></i>'+
							'</div>'+
						'</div>'+
			    		'<div class="dashboard-contents">'+
			    			'<div id="leftBottomContent">'+
			                    '<div id="symbolPreView">'+
			                    	'<div id="svgPreViewPanel"  style="height:97%; width:100%;"></div>'+
			                    '</div>'+
			                  '</div>'+
			    			'</div>'+
			    		'</div>'+
			    	'</div>';
			
			$("#leftMiddle").html(leftMiddle);
			$("#leftBottom").html(leftBottom);
			
			this.createLocationTree();
			
			var mainSub = '<div id="mainLeftContents">'+
				    		'<div id="mainLeftTop">'+
				    			//'<i id="assetSymbolDeleteBtn" class="icon fas fa-trash-alt fa-2x" aria-hidden="true" title="Delete" disabled="disabled"></i>'+
				    	'</div>'+
				    	'<div id="mainLeft"></div>'+
				    '</div>'+
				    '<div id="mainRightContents">'+
				    	'<div id="mainRightTop">'+
				    		'<div id="symbolMgrBtnGroup">'+
				    			'<i id="symbolAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
				    			'<i id="symbolModifyBtn" class="icon fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Modify"></i>'+
				    			'<i id="symbolDeleteBtn" class="icon fas fa-trash-alt fa-2x" aria-hidden="true" title="Delete" disabled="disabled"></i>'+
				    			'<i id="symbolApplyBtn" class="icon fas fa-check fa-2x" aria-hidden="true" title="Apply" disabled="disabled"></i>'+
				    		'</div>'+
				    	'</div>'+
				    	'<div id="mainRight"></div>'+
				    '</div>';
		
			$("#mainContents").html(mainSub);
			
			var mainLeft = '<div class="dashboard-panel" style="width:100%;">'+
								'<div class="dashboard-title">Asset List</div>'+
								'<div class="dashboard-contents"><div id="mainLeftBottom"></div></div>'+
							'</div>';
			
			var mainRight = '<div class="dashboard-panel" style="width:100%;">'+
								'<div class="dashboard-title">Available Symbol List</div>'+
								'<div class="dashboard-contents"><div id="mainRightBottom"></div></div>'+
							'</div>';
			
			$("#mainLeft").html(mainLeft);
			$("#mainRight").html(mainRight);
			
			this.createLeftTable();
	    	this.createRightTable();
		},
		
		createLeftTable : function(){
			$("#mainLeftBottom").w2grid({
        		name:'symbolMgrLeftTable',
                show: { 
                	toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    lineNumbers: true,
                    selectColumn: true,
                },
                
                recordHeight : 60,
        		style:'padding:5px;width:100%;height:calc(100vh - 176px);', //height:calc(100% - 92px);
                
        		searches: [
                	{ field: 'assetId', caption: 'ID ', type: 'text' },
                	{ field: 'assetName', caption: 'NAME ', type: 'text' },
                	{ field: 'locName', caption: 'LOCATION ', type: 'text' }
                ],
                
                columns: [  
                    { field: 'assetId', caption: 'ID', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
                    { field: 'unitSize', caption: 'U-SIZE', size: '70px', sortable: true, attr: 'align=right', style:'padding-right:10px;'},
                    { field: 'locName', caption: 'LOCATION', size: '100px', sortable: true, attr: 'align=right', style:'padding-right:10px;'},
                    { field: 'symbolName', caption: 'SYMBOL', size: '100%', sortable: true, attr: 'align=right', style:'padding-right:10px;', 
                    	render : function(record){
                    		if(record.symbolSvg){
                    			return '<div id="symbolRightTable"  style="width:100%;height:100%;text-align: center;">'+
									'<svg id=symbolRightTable viewBox="0 0 120 53" style="height:53px">'+record.symbolSvg+'</svg>'+
								'</div>';
                    		}
                    		return '<div style="width:100%;height:100%;text-align: center;"></div>';
                    	}
                    }
                ]
                
            });
        	
        	w2ui["symbolMgrLeftTable"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["symbolMgrLeftTable"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["symbolMgrLeftTable"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["symbolMgrLeftTable"].lock("Loading...", true);
		},
		
		createRightTable : function(){
			$("#mainRightBottom").w2grid({
        		name:'symbolMgrRightTable',
        		show: { 
                	toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    lineNumbers: true,
                    selectColumn: true,
                },
        		
        		recordHeight : 60,
        		style:'padding:5px;width:100%;height:calc(100vh - 176px);', //height:calc(100% - 92px);
        		searches: [
    				{ field: 'modelName', caption: 'NAME ', type: 'text' }
    			],
    			columns: [
				    { field: 'symbol_name', caption: 'NAME', size: '100px', sortable: true, attr: 'align=center'},
    				{ field: 'symbolSvg', caption: 'SYMBOL', size: '100%', sortable: true, attr: 'align=center', 
    					render : function(record){
    						if(record.symbolSvg){
                    			return '<div id="symbolRightTable" style="width:100%;height:100%;text-align: center;">'+
									'<svg id=symbolRightTable viewBox="0 0 120 53" style="height:53px">'+record.symbolSvg+'</svg>'+
								'</div>';
                    		}
                    		return '<div style="width:100%;height:100%;text-align: center;"></div>';
                    	}
    				},
    				{ field: 'symbol_desc', caption: 'DESC', size: '150px', sortable: true, attr: 'align=center' },
    				{ field: 'recid', hidden:true}
				],
    			
    			onDblClick : function(event){
    				var svgValue = null;
    				svgValue = this.get(event.recid).symbolSvg;
    				that.setSymbolTag("svgPreViewPanel", svgValue);
    				$("#svgDeleteBtn").prop("disabled", false);
    				$("#svgDeleteBtn").addClass("link");
    			}
        	});
			
			w2ui["symbolMgrRightTable"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["symbolMgrRightTable"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["symbolMgrRightTable"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["symbolMgrRightTable"].lock("Loading...", true);
		},
		
		validationCheck : function(){
			var selectedAssetListLen = w2ui["symbolMgrLeftTable"].getSelection().length;
			var selectedSymbolListLen = w2ui["symbolMgrRightTable"].getSelection().length;
        	if(selectedAssetListLen > 0 && selectedSymbolListLen > 0){
        		/*$("#assetSymbolDeleteBtn").prop("disable", false);
        		$("#assetSymbolDeleteBtn").addClass('link');*/
        		$("#symbolDeleteBtn").prop("disable", false);
        		$("#symbolDeleteBtn").addClass('link');
        		if(selectedAssetListLen > 0){
        			$("#assetSymbolDeleteBtn").prop("disable", false);
            		$("#assetSymbolDeleteBtn").addClass('link');
        		}else{
        			$("#assetSymbolDeleteBtn").prop("disable", true);
            		$("#assetSymbolDeleteBtn").removeClass('link');
        		}
        		if(selectedSymbolListLen == 1){
        			$("#symbolModifyBtn").prop("disable", false);
            		$("#symbolModifyBtn").addClass('link');
            		$("#symbolApplyBtn").prop("disable", false);
            		$("#symbolApplyBtn").addClass('link');
        		}else{
        			$("#symbolModifyBtn").prop("disable", true);
            		$("#symbolModifyBtn").removeClass('link');
            		$("#symbolApplyBtn").prop("disable", true);
            		$("#symbolApplyBtn").removeClass('link');
        		}
        	}else if(selectedSymbolListLen > 0){
        		if(selectedSymbolListLen == 1){
        			$("#symbolModifyBtn").prop("disable", false);
            		$("#symbolModifyBtn").addClass('link');
        		}else{
        			$("#symbolModifyBtn").prop("disable", true);
            		$("#symbolModifyBtn").removeClass('link');
        		}
        		if(selectedAssetListLen > 0){
        			$("#assetSymbolDeleteBtn").prop("disable", false);
            		$("#assetSymbolDeleteBtn").addClass('link');
        		}else{
        			$("#assetSymbolDeleteBtn").prop("disable", true);
            		$("#assetSymbolDeleteBtn").removeClass('link');
        		}
        		$("#symbolApplyBtn").prop("disable", true);
        		$("#symbolApplyBtn").removeClass('link');
        		$("#symbolDeleteBtn").prop("disable", false);
        		$("#symbolDeleteBtn").addClass('link');
        	}else if(selectedAssetListLen > 0){
        		$("#assetSymbolDeleteBtn").prop("disable", false);
        		$("#assetSymbolDeleteBtn").addClass('link');
        	}else{
        		$("#assetSymbolDeleteBtn").prop("disable", true);
        		$("#assetSymbolDeleteBtn").removeClass('link');
        		$("#symbolApplyBtn").prop("disable", true);
        		$("#symbolApplyBtn").removeClass('link');
        		$("#symbolDeleteBtn").prop("disable", true);
        		$("#symbolDeleteBtn").removeClass('link');
        		$("#symbolModifyBtn").prop("disable", true);
        		$("#symbolModifyBtn").removeClass('link');
        	}
        },
        
		addSymbol : function(){
			var record = null;
			var selectedSymbol = null;
			var selectedModel = null;
			var title = null;
			var okBtn = null;
			selectedModel = that.selectedModel;
			
			if(symbolMgr.configMode == "modifyMode"){
				title = BundleResource.getString('title.symbolManager.editSymbol'); //"Modify Symbol";
				okBtn = "symbolMgrPopupModifyOkBtn";
				selectedSymbol = w2ui["symbolMgrRightTable"].get(w2ui["symbolMgrRightTable"].getSelection())[0];
				record = {
    				model : selectedModel,
    				symbolName : selectedSymbol.symbol_name,
    				desc : selectedSymbol.symbol_desc,
    				svg : selectedSymbol.symbolSvg,
    				code_id : selectedSymbol.code_id,
    				seq_id : selectedSymbol.seq_id
				}
			}else{
				title = BundleResource.getString('title.symbolManager.addSymbol'); //"Add Symbol";
				okBtn = "symbolMgrPopupOkBtn";
				record = {
    				model : selectedModel,
    				symbolName : '',
    				desc : '',
    				svg : '',
    				code_id : '',
    				seq_id : ''
				}
			}

			var body = /*'<div class="w2ui-centered">'+*/
				'<div id="symbolMgrPopupContents" style="width:100%; height:92%;" >'+
	    			'<div class="w2ui-page page-0">'+
		    			'<div class="w2ui-field">'+
		        			'<label>MODEL</label>'+
		        			'<div>'+
		        				'<input name="model" type="text" size="51" style="width:324px;" />'+
		        			'</div>'+
		        		'</div>'+
		    			/*'<div class="w2ui-field">'+
		        			'<label>SYMBOL ID</label>'+
		        			'<div>'+
		        				'<input name="symbolId" type="text" size="51"/>'+
		        			'</div>'+
		        		'</div>'+*/
		        		'<div class="w2ui-field">'+
		        			'<label>SYMBOL NAME</label>'+
		        			'<div>'+
		        				'<input name="symbolName" type="text" size="51" style="width:324px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>DESC</label>'+
		        			'<div>'+
		        				'<input name="desc" type="text" size="51" style="width:324px;" />'+
		        			'</div>'+
		        		'</div>'+
		    			'<div class="w2ui-field">'+
		        			'<label>SVG</label>'+
		        			'<div>'+
		        				'<textarea name="svg" type="text" style="width:324px !important; height:150px; resize: none" />'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>CODE ID</label>'+
		        			'<div>'+
		        				'<input name="code_id" type="text" size="51" style="width:324px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>SEQUENCE ID</label>'+
		        			'<div>'+
		        				'<input name="seq_id" type="text" size="51" style="width:324px;" />'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>PREVIEW</label>'+
			        		'<div class="dashboard-panel" style="width:324px; height:188px; margin-top:5px; position: relative; left: 3px;">'+ //height:40%; //height:18vh
					    		'<div class="dashboard-contents">'+
					    			'<div id="leftBottomContent">'+
					                    '<div id="symbolPreView">'+
						                    '<div id="symbolMgrCanvas"  style="height:97%; width:100%;"></div>'+
					                    '</div>'+
				                    '</div>'+
			                    '</div>'+
		                    '</div>'+
	                    '</div>'+
					'</div>'+
				'</div>'+
				'<div id="symbolMgrPopupBottom" style="text-align: center;">'+
	    			'<button id='+okBtn+' class="darkButton">' + BundleResource.getString('button.symbolManager.save') + '</button>'+
	    			'<button id="svgPriviewBtn" class="darkButton">' + BundleResource.getString('button.symbolManager.preview') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.symbolManager.close') + '</button>'+
				/*'</div>'+*/
			'</div>';
			
			w2popup.open({
    			title : title,
    	        body: body,
    	        width : 500,
    	        height :550,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#symbolMgrPopupBottom").html();
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	symbolMgr.configMode = "normalMode";
    	        	w2ui['symbolMgr_popup_properties'].destroy();
    	        }
			});
			
			$("#symbolMgrPopupContents").w2form({
    			name : 'symbolMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0);",
    			focus : -1,
    			fields : [
    				{name:'model', type: 'text', disabled:true, required:false, html:{caption:'MODEL'}},
    				{name:'symbolName', type: 'text', required:true, html:{caption:'SYMBOL NAME'}},
    				{name:'desc', type: 'text', required:false, html:{caption:'DESC'}},
    				{name:'svg', type: 'text',  required:true, html:{caption:'SVG'}},
    				{name:'code_id', type: 'text',  hidden: true},
    				{name:'seq_id', type: 'text',  hidden: true}
    				
    			],
    			
    			record: record,
    			onRender : function(event){
    				event.onComplete = function(){
    					if(symbolMgr.configMode == "modifyMode"){
    						var selectedSymbolData, symbolSvg = null; 
    						selectedSymbolData = w2ui["symbolMgrRightTable"].get(w2ui["symbolMgrRightTable"].getSelection())[0];
    						symbolSvg = selectedSymbolData.symbolSvg;
    						that.setSymbolTag("symbolMgrCanvas", symbolSvg);
    					}
    				}
    			},
    			
				onChange : function(event){
					console.log(event);
				}
    		});
		},
		
		modifySymbol : function(){
			var selectedSymbol = w2ui["symbolMgrRightTable"].getSelection().length;
			if(selectedSymbol != 1){
				return
			}else{
				symbolMgr.configMode = "modifyMode";
				that.addSymbol();
			}
		},

		modifySymbolOk : function(){ // gihwan
			var changedData = w2ui['symbolMgr_popup_properties'].record;
			var param = {}
			param.symbol_name = changedData.symbolName;
			param.symbol_desc = changedData.desc;
        	param.symbol_svg = changedData.svg;
        	param.seq_id = changedData.seq_id;
        	param.code_id = changedData.code_id;
        	that.listNotifiCation("modifySymbolList", param);
		},
		
		symbolDelete : function(){
			var selectedSymbol = w2ui["symbolMgrRightTable"].getSelection().length;
			if(selectedSymbol == 0){
				return
			}else{
				var body = '<div class="w2ui-centered">'+
					'<div class="popup-contents">' + selectedSymbol + BundleResource.getString('label.symbolManager.selectedItemDelete') + '</div>'+
					'<div class="popup-btnGroup">'+
						'<button id="symbolDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.symbolManager.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.symbolManager.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
			
				w2popup.open({
					width: 385,
			        height: 180,
			        title : BundleResource.getString('title.symbolManager.info'),
			        body: body,
			        opacity   : '0.5',
			 		modal     : true,
				    showClose : true
			    });
			}
		},
		
		symbolDeleteOk : function(){
			var selectedSymbol, codeId, menuName = null;
			var symbolName = [];
			var symbolRecid = null;
			
			selectedSymbol = w2ui["symbolMgrRightTable"].get(w2ui["symbolMgrRightTable"].getSelection());
			codeId = w2ui['symbolMgrAssetTree'].selected;
			symbolName = _.pluck(selectedSymbol, 'symbol_name');
			symbolRecid = _.pluck(selectedSymbol, 'recid');
			
			var model = new Model();
			model.set({
				code_id : codeId,
				symbol_name : symbolName,
				symbolRecid : symbolRecid
			});
			model.url = "symbolManager/deleteSymbol";
			model.save(null, {
				success : function(model, response){
					/*var deletedList = model.attributes.symbolRecid;
					
					for(var i = 0; i < deletedList.length; i++){
						var recId = deletedList[i];
						w2ui["symbolMgrRightTable"].remove(recId);
					}*/
					that.getData();
				},
				error : function(model, response){
					
				}
			})
		},
		
		symbolApply : function(){
			var sourceRightSymbol = w2ui["symbolMgrRightTable"].get(w2ui["symbolMgrRightTable"].getSelection());
			var sourceLeftSymbol = w2ui["symbolMgrLeftTable"].get(w2ui["symbolMgrLeftTable"].getSelection());
        	if(sourceRightSymbol.length == 0 || sourceLeftSymbol.length == 0){
        		return;
        	}else if(sourceRightSymbol.length > 1){
        		var bodyContents = BundleResource.getString('label.symbolManager.oneSelectSymbol') //"하나의 심볼만 선택 해 주세요.";
				var body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="popup-btnGroup">'+
					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.symbolManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
    	  
				w2popup.open({
            		width: 385,
      		        height: 180,
    		        title : BundleResource.getString('title.symbolManager.info'),
    		        body: body,
	                opacity   : '0.5',
	         		modal     : true,
	    		    showClose : true,
      	    		/*onClose   : function(event){
      	    			w2ui['symbolMgr_popup_properties'].destroy();
      	    		}*/
		      	});
        	}else{
	        	var targetSymbol = [];
	        	for(var i=0; i < w2ui["symbolMgrLeftTable"].getSelection().length; i++){
	        		var item = w2ui["symbolMgrLeftTable"].get(w2ui["symbolMgrLeftTable"].getSelection()[i]);
	        		targetSymbol.push(item);
	        	}
	        	
	        	var param = {}
	        	param.symbolSvg = sourceRightSymbol[0].symbolSvg;
	        	param.targetModels = targetSymbol;
	        	param.symbol_name = sourceRightSymbol[0].symbol_name;
	        	param.code_id = sourceRightSymbol[0].code_id;
	        	that.listNotifiCation("updateSymbolList", param);
        	}
		},
		
		symbolMgrPopupOk  : function(){
			var arr = w2ui['symbolMgr_popup_properties'].validate();
			var	bodyContents = "";
			var body = "";
			if(arr.length > 0){
				return;
			}else{
				var newSymbol, modelId, item = null;
				var symbolData = [];
				var dataLen = w2ui['symbolMgrRightTable'].records.length;
				newSymbol = w2ui['symbolMgr_popup_properties'].record;
				item = w2ui["symbolMgrAssetTree"].get(w2ui['symbolMgrAssetTree'].selected);
				modelId = item.modelId;
				var menuName = _.pluck(w2ui['symbolMgrRightTable'].records, "symbol_name");
				var checkSymbolName = _.intersection(menuName, [newSymbol.symbolName]).length;
				
				if(checkSymbolName != 0){
					bodyContents = BundleResource.getString('label.symbolManager.alreadyExistSymbol') //"동일한 Symbol Name이 존재 합니다.";
					body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">'+ bodyContents +'</div>'+
    				'<div class="popup-btnGroup">'+
    					'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.symbolManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
        	  
					w2popup.open({
	            		width: 385,
	      		        height: 180,
	    		        title : BundleResource.getString('title.symbolManager.info'),
	    		        body: body,
		                opacity   : '0.5',
		         		modal     : true,
		    		    showClose : true,
	      	    		onClose   : function(event){
	      	    			w2ui['symbolMgr_popup_properties'].destroy();
	      	    		}
			      	});
				}else{
					symbolData.push({
						recid : dataLen+1,
						symbol_name : newSymbol.symbolName,
						symbolSvg : newSymbol.svg,
						symbol_desc : newSymbol.desc,
						code_id : that.selectedModelId,
					});
					
					var model = new Model();
					model.set(symbolData[0]);
					model.url = "symbolManager/addSymbol";
					model.save(null, {
						success : function(model, response){
							if(response == 100){
								w2ui['symbolMgrRightTable'].add(symbolData);
								w2ui['symbolMgrRightTable'].refresh();
								//'심볼이 추가 되었습니다.'
								w2alert(BundleResource.getString('label.symbolManager.addSymbol'), BundleResource.getString('title.symbolManager.info')); 
							}else{
								alert("Error");
							}
							//"일시적인 오류가 발생 했습니다." "다시 시도해 주시기 바랍니다."
							w2alert(BundleResource.getString('label.symbolManager.errorContents')+'\n'+BundleResource.getString('label.symbolManager.reTry'), BundleResource.getString('title.symbolManager.info'));
							w2popup.close();
						},
						error : function(model, response){
							//"일시적인 오류가 발생 했습니다." "다시 시도해 주시기 바랍니다."
							w2alert(BundleResource.getString('label.symbolManager.errorContents')+'\n'+BundleResource.getString('label.symbolManager.reTry'), BundleResource.getString('title.symbolManager.info'));
							w2popup.close();
						}
					});
				}
			}
		},
		
		showSvgPreview : function(){
			var svgValue = null;
			svgValue = w2ui['symbolMgr_popup_properties'].record.svg;
			that.setSymbolTag("symbolMgrCanvas", svgValue);
		},
		
		showSymbolEditBox : function(){
			var svgValue = null;
			svgValue = w2ui['symbolPreview_popup_properties'].record.svg;
			that.setSymbolTag("svgPreViewPanel", svgValue);
			$("#svgDeleteBtn").prop("disabled", false);
			$("#svgDeleteBtn").addClass("link");
			w2popup.close();
		},
		
		setSymbolTag : function(tagId, svgTag){
			/*var dataProvider = document.getElementsByClassName("yesMap");
			for(var i = 0; i < dataProvider.length; i++){
				var item = dataProvider[i];
				var itemName = item.id;
				if(tagId == itemName){
					//var svgContent = '<svg id='+tagId+'-svg viewBox="0 0'+item.>'+svgTag+'</svg>';
					$("#"+tagId).append(svgContent);
				}
			}*/
			
			var removeTarget = d3.select("#"+tagId+" svg")[0][0];
			
			if(removeTarget != null){
				$(removeTarget).remove();
			}
			var svgContent = '<svg id="svgPreView" style="width:100%;height:100%;opacity:1"><g id="svgContainer">'+svgTag+'</g></svg>';
			$("#"+tagId).append(svgContent);
			
			d3.select("#"+tagId +" svg#svgPreView").select("#svgContainer").attr("transform", function(d){
	             let container = {};
	             container.width = $("#"+tagId + " svg#svgPreView").width();
	             container.height = $("#"+tagId + " svg#svgPreView").height();
	             let bBox = this.getBBox();
	             let scale = {x:1, y:1};
	             let symbolMargin = {width:0, height:0};
	             if(container.width < bBox.width){
	                 scale.x = container.width / bBox.width;
	             }else{
	                symbolMargin.width = (container.width - bBox.width)/2;
	             }
	                
                if(container.height < bBox.height){
                   scale.y = container.height / bBox.height;
                }else{
                   symbolMargin.height = (container.height - bBox.height)/2;
                }
	                
	             $(this).attr("transform",  'translate('+ symbolMargin.width  +','+ symbolMargin.height  +') scale('+scale.x +" "+scale.y +')');
	             return $(this).attr("transform");
				//"translate(10,10)"
			});
			/*if(tagId == "svgPreView"){
				that.copyText = document.querySelector("#svg");
			}*/
		},
		
		svgTextEditorHandler : function(event){
			var body = '<div id="symbolPreviewPopupContents" style="width:100%; height:92%;" >'+
	    			'<div class="w2ui-page page-0">'+
		    			'<div class="w2ui-field">'+
		        			'<label>SVG</label>'+
		        			'<div>'+
		        				'<textarea name="svg" type="text" style="width:324px; height:300px; resize: none" />'+
		        			'</div>'+
		        		'</div>'+
					'</div>'+
				'</div>'+
				'<div id="symbolPreviewPopupBottom" style="text-align: center;">'+
	    			'<button id="symbolPreviewPopupOkBtn" class="darkButton">' + BundleResource.getString('button.symbolManager.save') + '</button>'+
	    			'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.symbolManager.close') + '</button>'+
	    		'</div>';
			
			w2popup.open({
    			title : BundleResource.getString('title.symbolManager.svgTextEditor'), // SVG Text Editor
    	        body: body,
    	        width : 500,
    	        height : 410,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#symbolPreviewPopupBottom").html();
    	        		w2ui["symbolPreview_popup_properties"].render();
    	        		//that.setSymbolTag("symbolMgrCanvas", "");
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	w2ui['symbolPreview_popup_properties'].destroy();
    	        }
			});
			
			$("#symbolPreviewPopupContents").w2form({
    			name : 'symbolPreview_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0);",
    			focus : 0,
    			fields : [
    				{name:'svg', type: 'text',  required:false, html:{caption:'SVG'}}
    			],
    			
    			record:{
    				svg : ''
				}
    		});
		},
		
		listNotifiCation : function(cmd, param){
			switch(cmd){
	        	case "getAssetTypeList": //자산 종류 가져오기
	        		this.getAssetTypeList();
	        		break;
	        	case "getAssetList": //선택된 자산 가져오기
	        		this.getAssetList();
	        		break;
	        	case "getSymbolList": //선택된 Symbol 가져오기
	        		this.getSymbolList();
	        		break;
	        	case "updateSymbolList": //선택된 자산 모델 업데이트
	        		this.updateSymbolList(param);
	        		break;
	        	case "modifySymbolList":
	        		this.modifySymbolList(param);
			}
		},
		
		getAssetTypeList : function(){
			var model = new Model();
        	model.url = "/modelMapping/getAssetTypeList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setAssetTypeList);
		},
		
		setAssetTypeList : function(method, model, options){
			if(model.length > 0){
        		
        		for(var i=0; i < model.length; i++){
					var item = model[i];
					item.text = item.name;
					item.icon = 'fas fa-cube fa-lg';
				}
        		
        		w2ui["symbolMgrAssetTree"].insert('Asset', null, model);
        		
        		//기본적으로 첫번째 아이템을 선택 아이템으로 지정
        		this.selectItem = w2ui["symbolMgrAssetTree"].get(w2ui["symbolMgrAssetTree"].nodes[0].nodes[0].id);
        		that.selectedModel = this.selectItem.codeDesc;
        		that.selectedModelId = this.selectItem.id;
        		
        		w2ui["symbolMgrAssetTree"].select(w2ui["symbolMgrAssetTree"].nodes[0].nodes[0].id);
        		
        		this.getData();
        		
        	}else{
        		
        	}
		},

		getAssetList : function(){
			var model = new Model();
        	model.url += "/getAssetList/"+this.selectItem.id;
			//model.url = "/modelMapping/getAssetList/"+this.selectItem.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setAssetList);
		},
		
		setAssetList : function(method, model, options){
			w2ui["symbolMgrLeftTable"].selectNone();
    		w2ui['symbolMgrLeftTable'].records = model;
    		w2ui['symbolMgrLeftTable'].refresh();
    		w2ui["symbolMgrLeftTable"].unlock();
    		this.changeAlign();
		},
		
		getSymbolList : function(){
			var model = new Model();
			model.url += "/getSymbolList/"+that.selectedModelId;
			model.fetch();
			this.listenTo(model, "sync", this.setSymbolList);
		},
		
		setSymbolList : function(method, model, options){
			w2ui["symbolMgrRightTable"].selectNone();
			w2ui["symbolMgrRightTable"].records = model;
			w2ui["symbolMgrRightTable"].refresh();
			w2ui["symbolMgrRightTable"].unlock();
			this.changeAlign();
		},
		
		changeAlign : function(){
			d3.selectAll("svg#symbolRightTable").selectAll("g").attr("transform", function(d){ 
                let container = {};
                container.width = $("svg#symbolRightTable").width();
                container.height = $("svg#symbolRightTable").height();
                let bBox = this.getBBox();
                let scale = {x:1, y:1};
             let symbolMargin = {width:0, height:0};
                if(container.width < bBox.width){
                   scale.x = container.width / bBox.width;
                }else{
                   symbolMargin.width = (container.width - bBox.width)/2;
                }
                
                if(container.height < bBox.height){
                   scale.y = container.height / bBox.height;
                }else{
                   symbolMargin.height = (container.height - bBox.height)/2;
                }
                
             $(this).attr("transform",  'translate('+ symbolMargin.width  +','+ symbolMargin.height  +') scale('+scale.x +" "+scale.y +')');
             return $(this).attr("transform");
            });
		},
		
		updateSymbolList : function(param){
			var model = new Model(param);
			model.url += "/updateSymbolList";
			model.save(null, {
				success : function(model, response){
					$("#symbolApplyBtn").prop("disable", true);
	        		$("#symbolApplyBtn").removeClass('link');
	        		that.getData();
	        		//'심볼이 적용 되었습니다.'
           		 	w2alert(BundleResource.getString('label.symbolManager.applySuccess'), BundleResource.getString('title.symbolManager.info'));
				},
				error : function(model, response){
					$("#symbolApplyBtn").prop("disable", true);
	        		$("#symbolApplyBtn").removeClass('link');
	        		that.getData();
	        		//"일시적인 오류가 발생 했습니다." "다시 시도해 주시기 바랍니다."
	            	w2alert(BundleResource.getString('label.symbolManager.errorContents')+'\n'+BundleResource.getString('label.symbolManager.reTry'), BundleResource.getString('title.symbolManager.info'));
				}
			});
		},
		
		modifySymbolList : function(param){ //gihwan
			var model = new Model(param);
			model.url += "/modifySymbol";
			model.save(null, {
				success : function(model, response){
					/*$("#symbolApplyBtn").prop("disable", true);
	        		$("#symbolApplyBtn").removeClass('link');*/
	        		that.getData();
					w2popup.close();
					//'심볼이 적용 되었습니다.'
           		 	w2alert(BundleResource.getString('label.symbolManager.applySuccess'), BundleResource.getString('title.symbolManager.info'));
				},
				error : function(model, response){
					/*$("#symbolApplyBtn").prop("disable", true);
	        		$("#symbolApplyBtn").removeClass('link');*/
	        		that.getData();
	        		//"일시적인 오류가 발생 했습니다." "다시 시도해 주시기 바랍니다."
	            	w2alert(BundleResource.getString('label.symbolManager.errorContents')+'\n'+BundleResource.getString('label.symbolManager.reTry'), BundleResource.getString('title.symbolManager.info'));
				}
			});
		},
		
		getData : function(){
			//선택된 타입의 자산 정보 호출
    		this.listNotifiCation("getAssetList");
    		this.listNotifiCation("getSymbolList");
		},
		
		textCpoy : function(){
			/*var copyText = that.copyText; 
			copyText.select();
			document.execCommand('copy');*/
		},
		
		svgDelete : function(){
			$("#svgPreView").remove();
			$("#svgDeleteBtn").prop("disabled", true);
			$("#svgDeleteBtn").removeClass("link");
		},
		
		createLocationTree : function(){
        	$("#leftMiddleContent").w2sidebar({
        		name : 'symbolMgrAssetTree',
        		//style : 'height:calc(100vh - 617px);',
        		style : 'height:calc(100% - 48px);',
        		nodes: [
                    { id: 'Asset', text: 'ASSET TYPE', expanded: true, group: true}
                ],
                onClick: function(event) {
                	var item = w2ui["symbolMgrAssetTree"].get(event.target);
                	that.selectedModel = item.codeDesc;
                	that.selectedModelId = item.id;
                	
                	var selectItem = that.selectItem;
                	
                	if(selectItem.id === item.id){
                		return;
                	}else{
                		that.selectItem = item;
                		that.getData();
                	}
                }
        	});
        },

        assetSymbolDelete : function(){ //gihwan
        	that.validationCheck();
        	if($("#assetSymbolDeleteBtn").prop("disable")){
        		return;
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
		
		removeEventListener : function(){
			$(document).off("click", "#symbolAddBtn");
			$(document).off("click", "#symbolModifyBtn");
			$(document).off("click", "#symbolApplyBtn");
			$(document).off("click", "#symbolMgrPopupModifyOkBtn");
			$(document).off("click", "#symbolDeleteBtn");
			$(document).off("click", "#symbolDeleteOkBtn");
			$(document).off("click", "#svgPriviewBtn");
			$(document).off("click", "#symbolMgrPopupOkBtn");
			$(document).off("click", "#symbolPreviewPopupOkBtn");
			$(document).off("click", "#svgTextCopyBtn");
			$(document).off("click", "#svgDeleteBtn");
			$(document).off("click", "#assetSymbolDeleteBtn");
		},
		
        destroy : function(){
			if(w2ui['symbolMgrAssetTree']){
				w2ui['symbolMgrAssetTree'].destroy();
			}
			if(w2ui['symbolMgrLeftLayout']){
				w2ui['symbolMgrLeftLayout'].destroy();
			}
			if(w2ui['symbolMgrLayout']){
				w2ui['symbolMgrLayout'].destroy();
			}
			if(w2ui['symbolMgrLeftTable']){
				w2ui['symbolMgrLeftTable'].destroy();
			}
			if(w2ui['symbolMgrRightTable']){
				w2ui['symbolMgrRightTable'].destroy();
			}
			if(w2ui['symbolMgr_popup_properties']){
				w2ui['symbolMgr_popup_properties'].destroy();
			}
			if(w2ui['symbolPreview_popup_properties']){
				w2ui['symbolPreview_popup_properties'].destroy();
			}
			symbolMgr = null;
			
			this.removeEventListener();
			this.undelegateEvents();
		}
	});
	
	return Main;
});