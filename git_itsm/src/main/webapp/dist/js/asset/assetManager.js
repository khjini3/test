define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/assetManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "jquery-csv",
    "css!cs/asset/assetManager"
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
		model:Model,
		url:'assetManager',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		that = this;
    		this.exportFileFormat = [];
    		this.importFileFormat = [];
    		this.assetList = [];
    		this.productEncoding = null;
    		this.productDecoding = null;
    		this.locationMap = null;
    		this.locationEncoding = null;
    		this.locationDecoding = null;
    		this.elements = {
    			scene : null
    		};
    		this.$el.append(JSP);
    		this.init();
    		this.selectItem = null;
    		
        	if(this.checkBrowser() == "chrome") {
        		console.log("Chrome");
        	} else if(this.checkBrowser() == "safari") {
        		console.log("Safari");
        	} else if(this.checkBrowser() == "firefox") {
        		console.log("Firefox");
        		/* The line-height is bigger than other browsers. */
        		/*$("#leftContents .dashboard-contents").css("height", "calc(100vh - 200px)");
        		$("#mainContents .dashboard-contents").css("height", "calc(100vh - 200px)");*/
        	} else if(this.checkBrowser() == "opera") {
        		console.log("Opera");
        	} else {
        		console.log("IE");
        	} 
        },
       
      events: {
        	'click #assetMgrDelBtn' : 'deleteData',
        	'click #assetMgrAddBtn' : 'addData',
        	'click #assetMgrImportBtn' : 'importPopup',
        	'click #assetMgrExportBtn' : 'exportData'
        },
        
        //이벤트 등록
        eventListenerRegister : function(){
        	//추가 팝업 확인 버튼
        	$(document).on("click", "#assetMgrPopupOkBtn", this.checkProcess);
        	$(document).on("click", "#assetMgrPopupDeleteOkBtn", this.deleteExcute);
        	
        	//import popup에 있는 click event
        	$(document).on("click", "#assetMgrImportDelBtn", this.importDelete);
        	$(document).on("click", "#importPopupSaveBtn", this.setImportData);
        },
        
        //이벤트 해제
        removeEventListener : function(){
        	$(document).off("click", "#assetMgrPopupOkBtn");
        	$(document).off("click", "#assetMgrPopupDeleteOkBtn");
        	
        	$(document).off("click", "#assetMgrImportDelBtn");
        	$(document).off("click", "#importPopupSaveBtn");
        },
        
        checkProcess : function(event){
        	var item = w2popup.get();
        	
        	assetMgr.assetItemCheck(event, item.type);
        },
        
        exportData : function(){
        	that.validationCheck();
        	if($("#assetMgrExportBtn").prop('disabled')){
        		return;
        	}
        	
        	var exporAC = w2ui["assetMgrAssetTable"].get(w2ui["assetMgrAssetTable"].getSelection());
        	
        	var bodyContents = "";
        	var body = "";
        	if(exporAC.length == 0){
        		bodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        	} else {
        		bodyContents = exporAC.length + BundleResource.getString('label.assetManager.exportConfirm');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="" id="exportConfirm" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
        		
        	}
        	
        	w2popup.open({
    			width: 385,
    			height: 180,
    			title : BundleResource.getString('title.assetManager.info'),
    			body: body,
    			opacity   : '0.5',
    			modal     : true,
    			showClose : true
    		});
        	
        	$("#exportConfirm").click(function(){
        		w2popup.close();
//        		let csvContent = "data:text/csv;charset=utf-8,";
        		let csvContent = "data:application/octet-stream;charset=utf-8,";
        		
        		csvContent += assetMgr.exportFileFormat.join(",") + "\r\n"; // add Header;
        		
        		let rowHeader = w2ui["assetMgrAssetTable"].columns;
        		
        		exporAC.forEach(function(rowArray, idx){
        			let row = "";
        			row += rowArray.assetId; //id
        			row += "," + rowArray.codeName; //productName
        			row += "," + (rowArray.productModel !== null ? rowArray.productModel : ""); //model
        			row += "," + (rowArray.serialNumber !== null ? rowArray.serialNumber : ""); //serialNumber
        			row += "," + (rowArray.revision !== null ? rowArray.revision : ""); //revision
        			row += "," + (rowArray.hwVersion !== null ? rowArray.hwVersion : ""); //hw version
        			row += "," + (rowArray.fwVersion !== null ? rowArray.fwVersion : ""); //fw version
        			row += "," + (rowArray.receiptDate !== null ? rowArray.receiptDate : ""); //ReceiptDate
        			row += "," + (rowArray.releaseDate !== null ? rowArray.releaseDate : ""); //ReleaseDate
        			let encodingStatus = assetMgr.productDecoding[rowArray.status]; //Status
        			row += "," + (encodingStatus !== undefined ? encodingStatus : "");
        			let endcodingLocation = assetMgr.locationEncoding[rowArray.locId]; 
        			row += "," + (endcodingLocation !== undefined ? endcodingLocation : ""); //Location
        			row += "," + rowArray.unitSize; //Unit Size
        			
        			csvContent += row + "\r\n"; // add carriage return
        		}); 
        		
        		var encodedUri = encodeURI(csvContent); 
//        		window.open(encodedUri);
        		
        		var link = document.createElement("a");
        		if (link.download !== undefined) {
        			link.setAttribute("href", encodedUri);
        			link.setAttribute("target", "_blank");
        			link.setAttribute("download", assetMgr.todayFunc());
        			link.style.visibility = 'hidden';
        			document.body.appendChild(link);
        			link.click();
        			document.body.removeChild(link);
        		}
        		
        		w2ui["assetMgrAssetTable"].selectNone();
        	});
        },
        
        todayFunc : function(){
        	let result = "";
        	let dt = new Date();
        	
        	let dayFormat = function(dd){
        		return String(dd <10 ? "0"+ dd : dd);
        	}
        	
        	let month = dayFormat(dt.getMonth()+1);
        	let day = dayFormat(dt.getDate());
        	let year = dayFormat(dt.getFullYear());
        	let hour = dayFormat(dt.getHours());
        	let minute = dayFormat(dt.getMinutes());
        	let second = dayFormat(dt.getSeconds());
        	
        	result =  year +""+  month + day + hour + minute + second;
        	return result+".csv";
        },
        
        importDelete : function(evt){
        	var alertBodyContents = "";
        	var Body = "";
        	var deleteItem = w2ui["importAssetTable"].get(w2ui["importAssetTable"].getSelection());
        	
        	if(deleteItem.length == 0){
        		alertBodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		Body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : Body
        		});
        	}else{
        		w2ui["importAssetTable"].delete(deleteItem);
        	}
        },
        
        importPopup : function(){
        	var fields = [];
        	var record = {};
    		
    		var body = '<div class="w2ui-centered">'+
				    			'<div id="assetMgrImportWrap" style="height:33px;">'+
					    			'<div>'+
										'<div class="w2ui-field w2ui-span3">'+
										    '<label>File : </label>'+
										    '<div><input type="file" id="file" style="width: 93%" accept=".csv" ></div>'+
										'</div>'+
									'</div>'+
				    			'</div>'+
						    	
				    			'<div id="importAssetContents" style="width:100%; height:500px;"></div>'+ //height:100%;
				    		
				    			'<div id="assetMgrImportResultText" style="height:26px;color:#fff;position:relative; top:18px;"></div>'+
								'<div id="assetMgrPopupBottom" style="margin-top:34px;">'+
									'<button id="importPopupSaveBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
									'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
								'</div>'+
							'</div>';
    		
	    	w2popup.open({
				title : BundleResource.getString('title.assetManager.import'),
		        body: body,
		        width : 1400,
		        height : 728,
//		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
			    showClose : true,
			    style	  : "overflow-y:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["importAssetTable"].render();
	        			$("#grid_importAssetTable_records").css('overflow-y', 'hidden');
		        		$("#tb_importAssetTable_toolbar_right").append('<i id="assetMgrImportDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del" style="float:right;"></i>');

		        		$('#file').w2field('file', {
		        			max:1,
		        			onClick : function(event){
		        				console.log("onClick onClick");
		        			},
		        			onAdd : function(event){
		        				console.log("onAdd");
		        				that.importCsvData(event);
		        			},
		        			onRemove : function(event){
		        				console.log("onRemove");
		        				w2ui["importAssetTable"].clear();
		        				$(".file-input").val("");
//		        				$('#file').w2field('file', {});
		        			}
		        		});
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['importAssetTable'].destroy();
		        }
		        
		    });
	    	
	    	/* import grid render */
	    	$("#importAssetContents").w2grid({
        		name:'importAssetTable',
                show: { 
                    toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : true,
                    toolbarColumns : false,
                    selectColumn: true
                },
                
                recordHeight : (that.checkBrowser() == "firefox" ? 29 : 30),
        		multiSelect : true,
        		multiSearch: true,
//        		style:'width:100%;height:calc(100vh - 460px);', //530px;
                
        		searches: [
        			{ field: 'codeName', caption: 'TYPE', type: 'text' },
                	{ field: 'productModel', caption: 'MODEL', type: 'text' },
                	{ field: 'revision', caption: 'REVISION', type: 'text' },
                	{ field: 'hwVersion', caption: 'H/W VERSION', type: 'text' },
                	{ field: 'fwVersion', caption: 'F/W VERSION', type: 'text' },
                	{ field: 'codeDesc', caption: 'STATUS', type: 'text' },
                	{ field: 'locName', caption: 'LOCATION', type: 'text' },
                	{ field: 'unitSize', caption: 'UNIT SIZE', type: 'text' }
                ],
                
                columns: [                
		            { field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
//					{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset name
					{ field: 'productModel', caption: 'MODEL', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REV.', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VER.', size: '150px', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VER.', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', size: '90px', sortable: true, attr: 'align=center' }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', size: '90px', sortable: true, attr: 'align=center' }, // 출고일
					{ field: 'statusName', caption: 'STATUS', size: '60px', sortable: true, attr: 'align=left' },
					{ field: 'locName', caption: 'LOC', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'unitSize', caption: 'U-SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
					]
            });
	    	w2ui['importAssetTable'].lock("Loading...", true);
	    	
        },
        
        setImportData : function(event){
        	var selectList = this.selectItem;
        	var alertBodyContents = "";
        	var Body = "";
        	var recordData = w2ui["importAssetTable"].records;
        	
        	if(recordData.length == 0){
        		alertBodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		Body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        		w2popup.message({ 
        			width   : 400, 
        			height  : 180,
        			html    : Body
        		});
        		
        		$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        		/*$("#assetMgrImportResultText").html("선택된 항목이 없습니다.")*/
        	}else{
        		
        		let type = "multiUpdate";
        		let param = {};
        		param.crudList = recordData;
        		
        		var model = new Model(param);
        		model.url = model.url+"/"+type+"/"+ 'csvUpdate';
        		
        		w2ui['importAssetTable'].lock("Loading...", true);
        		
        		model.save({}, {
        			success: function (model, respose, options) {
        				assetMgr.crudSuccess(model, respose, options);
        				w2ui['importAssetTable'].unlock();
        				alertBodyContents = BundleResource.getString('label.assetManager.importComplete'); //"Import가 완료되었습니다";
                		Body = '<div class="w2ui-centered">'+
        					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
        					'<div class="assetMgr-popup-btnGroup">'+
        						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
        					'</div>'+
        				'</div>' ;
                		w2popup.message({ 
                			width   : 400, 
                			height  : 180,
                			html    : Body
                		});
        				
                		$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        			},
        			
        			error: function (model, xhr, options) {
        				assetMgr.crudError(model, xhr, options);
        				w2ui['importAssetTable'].lock();
        			}
        		});
        	}
        	
        },
        
        importCsvData : function(evt) {
        	var alertBodyContents = "";
        	var Body = "";
        	if (!assetMgr.browserSupportFileUpload()) {
        		alert('The File APIs are not fully supported in this browser!');
        	} else {
        		var _this = assetMgr;
        		var data = null;
        		var file = evt.file.file;
//        		if(!file.name.includes('csv')){ // file 확장자가 csv가 아닌 경우
        		if(file.name.indexOf("csv") < 0){
        			alertBodyContents = BundleResource.getString('label.assetManager.noCSVFile');
            		Body = '<div class="w2ui-centered">'+
    					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
    					'<div class="assetMgr-popup-btnGroup">'+
    						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
//            		$('#file').w2field('file', {});
            		$(".file-input").val("");
                	
        		}else{
        			var reader = new FileReader();
        			reader.readAsText(file,"euc-kr");
        			reader.onload = function(event) {
        				var csvData = event.target.result;
        				data = $.csv.toArrays(csvData);
        				if (data && data.length > 0) {
        					that.csvFormatter(data);
        				} else {
//        					alert('No data to import!');
        					alertBodyContents = BundleResource.getString('button.assetManager.noDataImport'); //'No data to import!';
                    		Body = '<div class="w2ui-centered">'+
            					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
            					'<div class="assetMgr-popup-btnGroup">'+
            						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
            					'</div>'+
            				'</div>' ;
        				}
        			};
        			reader.onerror = function() {
//        				alert('Unable to read ' + file.fileName);
        				alertBodyContents = BundleResource.getString('button.assetManager.unableRead'); //'Unable to read' + file.fileName;
                		Body = '<div class="w2ui-centered">'+
        					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
        					'<div class="assetMgr-popup-btnGroup">'+
        						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
        					'</div>'+
        				'</div>' ;
        			};
        		}
        	}
        	
        	w2popup.message({ 
    	        width   : 400, 
    	        height  : 180,
    	        html    : Body
    	    });
        	
        	$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        },
        
        csvFormatter : function(data){
        	let dataProvider = [];
        	let fileFormat = assetMgr.importFileFormat;
        	var cnt = 0;
        	
        	var dayFormat = function(dd){
        		let result = "";
        		let reStr = dd.replace(/\-/gi, "."); // YYYY.MM.DD가 표준이라고 함.
        		let arr = reStr.split(".");
        		if(arr.length > 2){
        			arr.forEach(function(dd, idx){
        				if(idx !== 0){
        					let im = parseInt(arr[idx]);
        					arr[idx] = im < 10 ? "0"+im : im;
        				}
        			});
        			result = arr.join(".");
        		}else{
        			result = "Format Err";
        		}
        		
        		return result;
        	}
        	
        	data.forEach(function(d, i){
        		if(i !== 0 && d.length === fileFormat.length){
        			
        			var param = {}
    				for(var j=0; j < fileFormat.length; j++){
    					
    					if(fileFormat[j] === "assetId"){
    						if(d[j].trim() ===""  || d[j] === undefined  || d[j].toUpperCase() ==="N/A" ){
    							param[fileFormat[j]] = util.createUID();
    						}else{
    							param[fileFormat[j]] = d[j];
    						}
    					}else if(fileFormat[j] === "receiptDate" || fileFormat[j] === "releaseDate"){
//    						param[fileFormat[j]] = dayFormat(d[j]);
    						if(dayFormat(d[j]) === "" || dayFormat(d[j]) === undefined || dayFormat(d[j]) === "Format Err"){
    							param[fileFormat[j]] = null;
    						}else{
    							param[fileFormat[j]] = dayFormat(d[j]);
    						}
    					}else if(fileFormat[j] === "locId"){
    						if(assetMgr.locationDecoding[d[j]] === "" || assetMgr.locationDecoding[d[j]] === undefined){
    							param[fileFormat[j]] = null;
    						}else{
    							param[fileFormat[j]] = assetMgr.locationDecoding[d[j]];
    							param["locName"] = assetMgr.locationMap[assetMgr.locationDecoding[d[j]]].loc_name;
    						}
    					}else if(fileFormat[j] === "status"){
    						if(assetMgr.productEncoding[d[j]] === "" || assetMgr.productEncoding[d[j]] === undefined){
    							param[fileFormat[j]] = null;
    						}else{
    							param[fileFormat[j]] = assetMgr.productEncoding[d[j]];
    							param["statusName"] = d[j];
    						}
    					}else if(fileFormat[j] === "unitSize"){
    						if(d[j].trim() === "" || d[j] === undefined  || d[j].toUpperCase() ==="N/A"){
    							param[fileFormat[j]] = 1;
    						}else{
    							param[fileFormat[j]] = d[j];
    						}
    					}else{
    						param[fileFormat[j]] = d[j];
    					}
    					
    					if(j===0){
    						param["recid"] = i;
    					}
    				}
    				
    				dataProvider.push(param);
        		}
        	});
        	
        	w2ui["importAssetTable"].records = dataProvider;
        	w2ui['importAssetTable'].refresh();
        },
        
        browserSupportFileUpload : function() {
            var isCompatible = false;
            if (window.File && window.FileReader && window.FileList && window.Blob) {
            	isCompatible = true;
            }
            return isCompatible;
        },
        
        addData : function(event){
        	
        	var item = assetMgr.selectItem;
        	
        	var getStatusList = [{"text" : "입고", "id" : "1"},
							   {"text" : "재고", "id" : "2"},
							   {"text" : "출고", "id" : "3"},
							   {"text" : "수리", "id" : "4"},
							   {"text" : "폐기", "id" : "5"}];
        	
        	var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	
    		if(item.inOutStatus === "1"){
    			fields = [
    				{name:'assetId', type: 'text', disabled:false, required:true, html:{caption:'ID'}},
					{name:'assetName', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
					{name:'productModel', type: 'text', disabled:false, required:false, html:{caption:'PRODUCT MODEL'}},
					{name:'serialNumber', type: 'text', disabled:false, required:false, html:{caption:'SERIAL NUMBER'}},
					{name:'revision', type: 'text', disabled:false, required:false, html:{caption:'REVISION'}},
					{name:'hwVersion', type: 'text', disabled:false, required:false, html:{caption:'H/W VERSION'}},
					{name:'fwVersion', type: 'text', disabled:false, required:false, html:{caption:'F/W VERSION'}},
					{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RECEIPT DATE'}},
					{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RELEASE DATE'}},
					{name:'status', type : 'list', options : {items : getStatusList}, disabled:false, required:false, html:{caption:'STATUS'}},
					{name:'startPosition', type: 'int', disabled:false, required:true, html:{caption:'START POSITION'}},
					{name:'unitIndex', type: 'int', disabled:false, required:true, html:{caption:'UNIT INDEX'}},
					{name:'unitSize', type: 'int', disabled:false, required:true, html:{caption:'UNIT SIZE'}},
					{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}}
    			];
    			
    			record = {
    				assetId:'',
    				assetName:'',
    				productModel:'',
    				serialNumber:'',
    				revision:'',
    				hwVersion:'',
    				fwVersion:'',
    				receiptDate:'',
    				releaseDate:'',
    				status:getStatusList[0].id,
    				type:item.text,
    				unitSize:1,
    				startPosition:1,
    				unitIndex:1,
    				parentId:item.id
				}
    			
    			popupHeight = 412;
    			
    			body = '<div class="w2ui-centered">'+
				'<div id="assetMgrPopupContents" style="width:100%; height:100%" >'+
				
					'<div class="w2ui-page page-0">'+
				        '<div style="width: 50%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 185px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">START POSITION</label>'+
				                    '<div>'+
				                    	'<input name="startPosition" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">UNIT INDEX</label>'+
				                    '<div>'+
				                        '<input name="unitIndex" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">TYPE</label>'+
				                    '<div>'+
				                        '<input name="type" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				            
			            '</div>'+
				            
				        '<div style="clear: both; padding-top: 15px;"></div>'+
				        
				    '</div>'+ //w2ui-page page-0
				
				
				'</div>'+ //assetMgrPopupContents
				
				'<div id="assetMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+
					'<div id="assetMgrPopupBottom">'+
						'<button id="assetMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
					'</div>'+
				'</div>';
    			
    		}else{
    			fields = [
    				{name:'assetId', type: 'text', disabled:false, required:true, html:{caption:'ID'}},
					{name:'assetName', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
    				{name:'productModel', type: 'text', disabled:false, required:false, html:{caption:'PRODUCT MODEL'}},
					{name:'serialNumber', type: 'text', disabled:false, required:false, html:{caption:'SERIAL NUMBER'}},
					{name:'revision', type: 'text', disabled:false, required:false, html:{caption:'REVISION'}},
					{name:'hwVersion', type: 'text', disabled:false, required:false, html:{caption:'H/W VERSION'}},
					{name:'fwVersion', type: 'text', disabled:false, required:false, html:{caption:'F/W VERSION'}},
					{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RECEIPT DATE'}},
					{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RELEASE DATE'}},
					{name:'status', type : 'list', options : {items : getStatusList}, disabled:false, required:false, html:{caption:'STATUS'}},
//					{name:'locId', type: 'int', disabled:false, required:false, html:{caption:'Location'}},
					{name:'unitSize', type: 'int', disabled:false, required:true, html:{caption:'UNIT SIZE'}},
					{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}}
    			];
    			
    			record = {
    				assetId:'',
    				assetName:'',
    				productModel:'',
    				type:item.text,
    				unitSize:1, // unitSize:(item.text==="RACK"?'':1),
    				parentId:item.id,
    				serialNumber:'',
    				revision:'',
    				hwVersion:'',
    				fwVersion:'',
    				receiptDate:'',
    				releaseDate:'',
    				status:getStatusList[0].id,
//    				locId:''
				}
    			
    			popupHeight = 412;
    			
    			body = '<div class="w2ui-centered">'+
				'<div id="assetMgrPopupContents" style="width:100%; height:100%" >'+
				
				
					'<div class="w2ui-page page-0">'+
				        '<div style="width: 50%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 185px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">TYPE</label>'+
				                    '<div>'+
				                        '<input name="type" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				            
			            '</div>'+
				            
				        '<div style="clear: both; padding-top: 15px;"></div>'+
				        
				    '</div>'+ //w2ui-page page-0
				
				
				'</div>'+ //assetMgrPopupContents
				
				'<div id="assetMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+
					'<div id="assetMgrPopupBottom">'+
						'<button id="assetMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
					'</div>'+
				'</div>';
    			
    		}
    		
	    	w2popup.open({
				title : BundleResource.getString('title.assetManager.addAsset'),
		        body: body,
		        width : 628,
		        height : popupHeight,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["assetMgr_popup_properties"].render();
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['assetMgr_popup_properties'].destroy();
		        }
		        
		    });
    		
    		$("#assetMgrPopupContents").w2form({
    			name : 'assetMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : fields,
    			record: record
    		});
    		
    		
        },
        
        assetItemCheck : function(event, type){//type : crud
        	var selectList = this.selectItem;
        	
        	var popupData = w2popup.get();
        	var arr = w2ui["assetMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var dataProvdier = w2ui["assetMgrAssetTable"].records;
            	var item = w2ui["assetMgr_popup_properties"].record;
            	
            	//공백 처리
            	item.assetId = $.trim(item.assetId);
            	item.assetName = $.trim(item.assetName);
            	item.productModel = $.trim(item.productModel);
            	item.unitSize = $.trim(item.unitSize);
            	if(item.serialNumber == ""){
            		item.serialNumber = item.productModel; // serialNumber 값 미입력 시  productModel 값으로 입력
            	}else{
            		item.serialNumber = $.trim(item.serialNumber);
            	}
            	item.revision = $.trim(item.revision);
            	item.hwVersion = $.trim(item.hwVersion);
            	item.fwVersion = $.trim(item.fwVersion);
            	if(item.receiptDate == ""){
            		item.receiptDate = null;
            	}else{
            		item.receiptDate = $.trim(item.receiptDate);
            	}
            	if(item.releaseDate == ""){
            		item.releaseDate = null;
            	}else{
            		item.releaseDate = $.trim(item.releaseDate);
            	}
            	item.status = $.trim(item.status.id);
//            	item.locId = $.trim(item.locId);
            	
            	if(selectList.inOutStatus == "1"){ // item.type === "SERVER"
            		item.startPosition = $.trim(item.startPosition);
            		item.unitIndex = $.trim(item.unitIndex);
            	}
            	
            	var resultAC = null;
            	
            	if(popupData.type === "create"){
            		resultAC = _.filter(dataProvdier, function(obj){
                		return obj.assetId === item.assetId;
                	});
            	}else if(popupData.type === "update"){
            		var selectItem = w2ui["assetMgrAssetTable"].get(w2ui["assetMgrAssetTable"].find({assetId:item.assetId}));
            		
            		var dataA = "" ;
            		var dataB = "";

            		if(selectList.inOutStatus == "1"){ //item.type ==="SERVER"
        				dataA = selectItem[0].assetName+selectItem[0].productModel+selectItem[0].codeName+selectItem[0].unitSize+selectItem[0].serialNumber+selectItem[0].revision+selectItem[0].hwVersion
        						+selectItem[0].fwVersion+selectItem[0].receiptDate+selectItem[0].releaseDate+selectItem[0].status+selectItem[0].unitIndex+selectItem[0].startPosition;
        				dataB = item.assetName+item.productModel+item.type.text+item.unitSize+item.serialNumber+item.revision+item.hwVersion+item.fwVersion+item.receiptDate+item.releaseDate+item.status
        						+item.unitIndex+item.startPosition;
        			}else{
            			dataA = selectItem[0].assetName+selectItem[0].productModel+selectItem[0].codeName+selectItem[0].unitSize+selectItem[0].serialNumber+selectItem[0].revision+selectItem[0].hwVersion
            					+selectItem[0].fwVersion+selectItem[0].receiptDate+selectItem[0].releaseDate+selectItem[0].status;
            			dataB = item.assetName+item.productModel+item.type.text+item.unitSize+item.serialNumber+item.revision+item.hwVersion+item.fwVersion+item.receiptDate+item.releaseDate+item.status;
        			}
            		
            		if(dataA === dataB){
            			w2popup.message({ 
                	        width   : 360, 
                	        height  : (selectList.inOutStatus == "1"?320:265), //item.type ==="SERVER"
                	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.assetManager.noChangeedContents') + '</div>'+
                	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.assetManager.confirm') + '</button>'
                	    });
            			return;
            		}
            		
            	}
            	
            	if(resultAC !==null && resultAC.length > 0){
            		//중복된 내용이 있다.
            		w2popup.message({ 
            	        width   : 360, 
            	        height  : 220,
            	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.assetManager.aladyExistsID') + '</div>'+
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.assetManager.confirm') + '</button>'
            	    });
            	}else{
            		var model = new Model(item);
            		//model.url = model.url+"/"+item.text+"/"+item.id;
            		model.url = model.url+"/"+type+"/"+ item.assetId ;
            		
            		model.save({}, {
            			success: function (model, respose, options) {
            				assetMgr.crudSuccess(model, respose, options);
            			},
            			
        			    error: function (model, xhr, options) {
        			    	assetMgr.crudError(model, xhr, options);
        			    }
            		});
            	}
        	}
        	
        },
        
        deleteData : function(event){
        	that.validationCheck();
        	if($("#assetMgrDelBtn").prop('disabled')){
        		return;
        	}
        	
        	var dataProvider = w2ui["assetMgrAssetTable"].get(w2ui["assetMgrAssetTable"].getSelection());
        	
        	var bodyContents = "";
        	var body = "";
        	if(dataProvider.length > 0){
        		//bodyContents = "선택된 "+ dataProvider.length+"개의 항목을 삭제 하시겠습니까?";
        		bodyContents = BundleResource.getString('label.assetManager.selected') + dataProvider.length + BundleResource.getString('label.assetManager.selectedItemDelete');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button id="assetMgrPopupDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
        	}else{
        		//bodyContents = "선택된 항목이 없습니다.";
        		bodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.assetManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        },
        
        deleteExcute : function(){
        	
			var dataProvider = w2ui["assetMgrAssetTable"].get(w2ui["assetMgrAssetTable"].getSelection());
			        	
        	var model = new Model(dataProvider);
        	model.url = model.url +"/delete/"+assetMgr.selectItem.text;
        	
        	model.save({}, {
        		success: function (model, respose, options) {
    				assetMgr.crudSuccess(model, respose, options);
    			},
    			
			    error: function (model, xhr, options) {
			    	assetMgr.crudError(model, xhr, options);
			    }
    		});
        },
        
        crudSuccess : function(model, respose, options){
        	var param = respose.param;
        	var selectList = this.selectItem;
        	var bodyContents = "";
        	var getStatusList = [{"text" : "입고", "id" : "1"},
				   {"text" : "재고", "id" : "2"},
				   {"text" : "출고", "id" : "3"},
				   {"text" : "수리", "id" : "4"},
				   {"text" : "폐기", "id" : "5"}];
        	
        	if(respose.type === "create"){ //생성
        		if(respose.status === 100){
        			var item = w2ui["assetMgr_popup_properties"].record;
        			w2ui["assetMgrAssetTable"].selectNone();
        			
            		$("#assetMgrResultText").html(item.assetId + BundleResource.getString('label.assetManager.itemAdded'));
                	$("#assetMgrResultText").animate({left:0}, 2000, function(e){$("#assetMgrResultText").html("");});
                	
            		item.assetId = "";
            		item.assetName = "";
            		item.productModel = "";
            		item.serialNumber = "";
            		item.revision = "";
            		item.hwVersion = "";
            		item.fwVersion = "";
            		item.receiptDate = "";
            		item.releaseDate = "";
            		item.status = getStatusList[0].id;
            		item.unitSize = 1;
            		
            		if(selectList.inOutStatus == "1"){//item.type ==="SERVER"
            			item.unitSize = 1;
            			item.startPosition = 1;
            			item.unitIndex = 1;
            		}
            		
            		w2ui["assetMgr_popup_properties"].refresh();
        		}else if(respose.status === -110){
        			//중복 오류
        			var resultObj = respose.result[0];
        			
        			w2popup.message({ 
            	        width   : 360, 
            	        height  : 220,
            	        html    : '<div style="padding:60px 10px 60px 10px; text-align: center; color:#ffffff;">'+ resultObj.ASSET_ID + 
            	        			BundleResource.getString('label.assetManager.id') + resultObj.CODE_NAME + BundleResource.getString('label.assetManager.inUse') + '</div>'+
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.assetManager.confirm') + '</button>'
            	    });
        		}else{
        			//삽입 오류
        			w2popup.message({ 
            	        width   : 360, 
            	        height  : 220,
            	        html    : '<div style="padding:60px 10px 60px 10px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.assetManager.errorData') + 
            	        		  '</br>' + BundleResource.getString('label.assetManager.contactAdministrator') + '</div>' +
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.assetManager.confirm') + '</button>'
            	    });
        		}
        		
            	
        	}else if(respose.type === "delete"){
        		if(respose.status === 200){
        			//정상
        			w2ui["assetMgrAssetTable"].selectNone();
        			
        			var deleteList = respose.deleteList;
        			//bodyContents = deleteList.length + "개의 항목이 삭제 되었습니다.";
        			bodyContents = deleteList.length + BundleResource.getString('label.assetManager.itemDelete');
            		
        		}else{
        			//오류
        			//bodyContents = "일시적인 현상으로 오류가 발생 했습니다.";
        			bodyContents = BundleResource.getString('label.assetManager.errorContents');
        		}
        		
        		var body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="assetMgr-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
	
	
			    w2popup.open({
			            		width: 385,
			     		        height: 180,
			    		        title : BundleResource.getString('title.assetManager.info'),
			    		        body: body,
			                    opacity   : '0.5',
			             		modal     : true,
			        		    showClose : true
			    		    });
			    
        	}else if(respose.type === "update"){
        		if(respose.status === 300){
        			$("#assetMgrResultText").html(BundleResource.getString('label.assetManager.editFinished'));
                	$("#assetMgrResultText").animate({left:0}, 2000, function(e){$("#assetMgrResultText").html("");});
                	
                	w2ui["assetMgrAssetTable"].selectNone();
                	
                	w2ui["assetMgrAssetTable"].select(w2ui["assetMgrAssetTable"].find({assetId:param.assetId})[0]);
        		}else{
        			
        		}
        	}else if(respose.type === "multiUpdate"){ //import
        		if(respose.status > 0){
        			$("#assetMgrImportResultText").html(BundleResource.getString('label.assetManager.itemAdded'));
                	$("#assetMgrImportResultText").animate({left:0}, 2000, function(e){$("#assetMgrImportResultText").html("");});
                	
        		}else{
        			//오류
        			//bodyContents = "일시적인 현상으로 오류가 발생 했습니다.";
        			bodyContents = BundleResource.getString('label.assetManager.errorContents');
        			
        			body = '<div class="w2ui-centered">'+
        			'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
        			'<div class="assetMgr-popup-btnGroup">'+
        			'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
        			'</div>'+
        			'</div>' ;
        			
        			w2popup.open({
        				width: 385,
        				height: 180,
        				title : BundleResource.getString('title.assetManager.info'),
        				body: body,
        				opacity   : '0.5',
        				modal     : true,
        				showClose : true
        			});
        		}
        		
        	}
        	
        	switch(respose.type){
        		case "create" :
        		case "multiUpdate" :
        			this.model.fetch();
        			break;
        		case "update" :
        		case "delete" :
        			this.refreshProcess();
        			break;
        	}
        	
        },
        
        crudError : function(model, xhr, options){
        	console.log("crudError");
        },
        
        updateData : function(event){
        	var getStatusList = [{"text" : "입고", "id" : "1"},
							   {"text" : "재고", "id" : "2"},
							   {"text" : "출고", "id" : "3"},
							   {"text" : "수리", "id" : "4"},
							   {"text" : "폐기", "id" : "5"}];
        	var item = assetMgr.selectItem;
        	var selectItem = w2ui["assetMgrAssetTable"].get(event.recid);
        	
	    	var items = [];
	    	var assetList = assetMgr.assetList;
	    	for(var i=0; i < assetList.length; i++){
	    		if(assetList[i].inOutStatus !== "1"){ //assetList[i].name !== "SERVER"
	    			items.push({id:assetList[i].id, text:assetList[i].name});
	    		}
	    	}
	    	
	    	var receiptDate;
    		var releaseDate;
    		
    		if(!_.isNull(selectItem.receiptDate,selectItem.receiptDate)){
    			receiptDate = selectItem.receiptDate.split(" ")[0];
    			releaseDate = selectItem.receiptDate.split(" ")[0];
    		}else{
    			receiptDate = "";
    			releaseDate = "";
    		}
	    	
	    	var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	
        	if(item.inOutStatus ==="1"){//item.name ==="SERVER"
	    		fields = [
					{name:'assetId', type: 'text', disabled:true, required:true, html:{caption:'ID'}},
					{name:'assetName', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
					{name:'productModel', type: 'text', disabled:false, required:false, html:{caption:'PRODUCT MODEL'}},
					{name:'serialNumber', type: 'text', disabled:false, required:false, html:{caption:'SERIAL NUMBER'}},
					{name:'revision', type: 'text', disabled:false, required:false, html:{caption:'REVISION'}},
					{name:'hwVersion', type: 'text', disabled:false, required:false, html:{caption:'H/W VERSION'}},
					{name:'fwVersion', type: 'text', disabled:false, required:false, html:{caption:'F/W VERSION'}},
					{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RECEIPT DATE'}},
					{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RELEASE DATE'}},
					{name:'status', type : 'list', options : {items : getStatusList}, disabled:false, required:false, html:{caption:'STATUS'}},
					{name:'startPosition', type: 'int', disabled:false, required:true, html:{caption:'START POSITION'}},
					{name:'unitIndex', type: 'int', disabled:false, required:true, html:{caption:'UNIT INDEX'}},
					{name:'unitSize', type: 'int', disabled:false, required:true, html:{caption:'UNIT SIZE'}},
					{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}}
				];
	    		
	    		record={
						assetId:selectItem.assetId,
	    				assetName : selectItem.assetName,
	    				productModel:selectItem.productModel,
	    				type:item.name,
	    				unitSize : selectItem.unitSize,
	    				parentId:item.id,
	    				serialNumber:selectItem.serialNumber,
	    				revision:selectItem.revision,
	    				hwVersion:selectItem.hwVersion,
	    				fwVersion:selectItem.fwVersion,
	    				receiptDate:receiptDate,
	    				releaseDate:releaseDate,
	    				status:selectItem.status,
	    				startPosition : selectItem.startPosition,
						unitIndex : selectItem.unitIndex,
					};
	    		popupHeight = 412;
	    		
	    		body = '<div class="w2ui-centered">'+
				'<div id="assetMgrUPdatePopupContents" style="width:100%; height:100%" >'+
				
					'<div class="w2ui-page page-0">'+
				        '<div style="width: 50%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 185px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">START POSITION</label>'+
				                    '<div>'+
				                    	'<input name="startPosition" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
			                    '<label style="width: 116px;">UNIT INDEX</label>'+
				                    '<div>'+
				                        '<input name="unitIndex" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">TYPE</label>'+
				                    '<div>'+
				                        '<input name="type" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
			            
			            '</div>'+
			            
			        '<div style="clear: both; padding-top: 15px;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
				
			    
				'</div>'+
				'<div id="assetMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+
					'<div id="assetMgrUPdatePopupBottom">'+
						'<button id="assetMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
					'</div>'+
				'</div>';
		
	    	}else{
	    		fields = [
	    			{name:'assetId', type: 'text', disabled:true, required:true, html:{caption:'ID'}},
					{name:'assetName', type: 'text', disabled:false, required:true, html:{caption:'NAME'}},
    				{name:'productModel', type: 'text', disabled:false, required:false, html:{caption:'PRODUCT MODEL'}},
					{name:'serialNumber', type: 'text', disabled:false, required:false, html:{caption:'SERIAL NUMBER'}},
					{name:'revision', type: 'text', disabled:false, required:false, html:{caption:'REVISION'}},
					{name:'hwVersion', type: 'text', disabled:false, required:false, html:{caption:'H/W VERSION'}},
					{name:'fwVersion', type: 'text', disabled:false, required:false, html:{caption:'F/W VERSION'}},
					{name:'receiptDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RECEIPT DATE'}},
					{name:'releaseDate', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:false, html:{caption:'RELEASE DATE'}},
					{field:'status', type : 'list', options : {items : getStatusList}, disabled:false, required:false, html:{caption:'STATUS'}},
//					{name:'locId', type: 'int', disabled:false, required:false, html:{caption:'Location'}},
					{name:'unitSize', type: 'int', disabled:false, required:true, html:{caption:'UNIT SIZE'}},
					{field:'type', type: 'list', disabled:false, required:true, html:{caption:'TYPE'}, options: { items: items } }
    			];
	    		
        		record={
						assetId:selectItem.assetId,
	    				assetName : selectItem.assetName,
	    				productModel:selectItem.productModel,
	    				type:item.name,
	    				unitSize : selectItem.unitSize,
	    				parentId:item.id,
	    				serialNumber:selectItem.serialNumber,
	    				revision:selectItem.revision,
	    				hwVersion:selectItem.hwVersion,
	    				fwVersion:selectItem.fwVersion,
	    				receiptDate:receiptDate,
	    				releaseDate:releaseDate,
	    				status:selectItem.status
//	    				locId:''
					};
        		popupHeight = 412;
        		
        		body = '<div class="w2ui-centered">'+
				'<div id="assetMgrUPdatePopupContents" style="width:100%; height:100%" >'+
				
					'<div class="w2ui-page page-0">'+
				        '<div style="width: 50%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 185px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 116px;">TYPE</label>'+
				                    '<div>'+
				                        '<input name="type" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
			            
			            '</div>'+
			            
			        '<div style="clear: both; padding-top: 15px;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
				
			    
				'</div>'+
				'<div id="assetMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+
					'<div id="assetMgrUPdatePopupBottom">'+
						'<button id="assetMgrPopupOkBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
					'</div>'+
				'</div>';
    			
	    	}
        	
	    	w2popup.open({
				title : BundleResource.getString('title.assetManager.editAsset'),
		        body: body,
		        width : 628,
		        height : popupHeight,
		        type : 'update',
		        opacity   : '0.5',
		        selectItem : selectItem,
	    		modal     : true,
			    showClose : true,
			    style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["assetMgr_popup_properties"].render();
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['assetMgr_popup_properties'].destroy();
		        }
		        
		    });
	    	
			$("#assetMgrUPdatePopupContents").w2form({
				name : 'assetMgr_popup_properties',
				style:"border:1px solid rgba(0,0,0,0)",
				focus : 1,
				fields : fields,
				record:record
			});
			
			if(item.inOutStatus !=="1"){//item.name !=="SERVER"
				if(selectItem.codeName !== null){
					w2ui["assetMgr_popup_properties"].record.type = {id:selectItem.codeId, text:selectItem.codeName};
					w2ui["assetMgr_popup_properties"].refresh();
				}
			}
			
        },
        
        init : function(){
        	
        	this.importFileFormat = [
        		"assetId"
        		,"codeName"
        		,"productModel"
        		,"serialNumber"
        		,"revision"
        		,"hwVersion" 
        		,"fwVersion"
        		,"receiptDate"
        		,"releaseDate"
        		,"status"
        		,"locId"
        		,"unitSize"
        	]
        	
        	assetMgr = this;
        	
        	$("#contentsDiv").w2layout({
        		name:'assetMgrLayout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
        	});
        	
        	var leftContent = '<div id="leftTop" style="height:35px">'+
        	'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Asset Type</div>'+
	    		'<div class="dashboard-contents"><div id="leftBottom"></div></div>'+
	    	'</div>';
        	
        	$("#leftContents").html(leftContent);
        	
        	this.createAssetTree();
        	
        	var mainSub = '<div id="mainTop"></div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Asset List</div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainBottom"></div>'+
		    		'<div class="pager-table-area" id="assetMgrPagerTable">'+
						'<div class="asset-manager-pager" id="assetMgrPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
        	
        	$("#mainContents").html(mainSub);
        	
        	$("#mainBottom").w2grid({
        		name:'assetMgrAssetTable',
                show: { 
                    toolbar: false,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : false,
                    toolbarColumns : false,
                    selectColumn: true
                },
                recordHeight : (that.checkBrowser() == "firefox" ? 29 : 30),
                blankSymbol : "-",
        		multiSelect : true,
        		multiSearch: true,
        		//style:'padding:5px;margin:0px 5px 5px 5px;width:100%;height:calc(100% - 30px);',
        		/*searches: [
        			{ field: 'codeName', caption: 'TYPE', type: 'text' },
                	{ field: 'productModel', caption: 'MODEL', type: 'text' },
                	{ field: 'revision', caption: 'REVISION', type: 'text' },
                	{ field: 'hwVersion', caption: 'H/W VERSION', type: 'text' },
                	{ field: 'fwVersion', caption: 'F/W VERSION', type: 'text' },
                	{ field: 'codeDesc', caption: 'STATUS', type: 'text' },
                	{ field: 'locName', caption: 'LOCATION', type: 'text' },
                	{ field: 'unitSize', caption: 'UNIT SIZE', type: 'text' }
                ],*/
                
                columns: [                
                	{ field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset name
					{ field: 'productModel', caption: 'MODEL', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REV.', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VER.', size: '150px', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VER.', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '90px', sortable: true, attr: 'align=center' }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '90px', sortable: true, attr: 'align=center' }, // 출고일
					{ field: 'codeDesc', caption: 'STATUS', size: '60px', sortable: true, attr: 'align=center' },
					{ field: 'locName', caption: 'LOC', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'unitSize', caption: 'U-SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
					]
                
            });
        	
        	w2ui["assetMgrAssetTable"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["assetMgrAssetTable"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["assetMgrAssetTable"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	//DoubClick Event
        	w2ui["assetMgrAssetTable"].onDblClick = this.updateData;
        	
        	var crudBtn = '<div id="assetMgrBtnGroup">'+
				        		'<i id="assetMgrImportBtn" class="icon link fab fa-yes-import fa-2x" aria-hidden="true" title="Import"></i>'+
				        		'<i id="assetMgrAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
				        		'<i id="assetMgrDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del"></i>'+
				        		'<i id="assetMgrExportBtn" class="icon link fab fa-yes-export fa-2x" aria-hidden="true" title="Export"></i>'+
				        	'</div>';
        	
        	$("#mainTop").html(crudBtn);
        	
        	$("#assetMgrDelBtn").prop('disabled', true);
			$("#assetMgrDelBtn").css('color', '#8e8c8c');
			$("#assetMgrDelBtn").removeClass('link');
			
			$("#assetMgrExportBtn").prop('disabled', true);
			$("#assetMgrExportBtn").css('color', '#8e8c8c');
			$("#assetMgrExportBtn").removeClass('link');
        	
        	this.getData();
        	
        	this.start();
        },
        
        getData : function(){
        	this.listNotifiCation("getExportFileFormat"); //export csv format
        	this.listNotifiCation("getLocationList");
        	this.listNotifiCation("getProductStatus");
        },
        
        getProductStatus : function(cmd){
        	var model = new Model();
        	model.url += '/'+cmd;
        	model.fetch();
        	this.listenTo(model, "sync", this.setProductStatus);
        },
        
        setProductStatus : function(method, model, options){
        	if(model.length > 0){
        		
        		this.productEncoding = {};
        		
        		for(var i=0; i < model.length ; i++){
        			var item = model[i];
        			this.productEncoding[item.name] = item.column1;
        		};
        		
        		this.productDecoding = _.invert(assetMgr.productEncoding);
        		
        	}else{
        		w2alert('Product Status Error', "알림");
        	}
        },
        
        //CSV File Export Formatter
        getExportFileFormat : function(cmd){
        	var model = new Model();
        	model.url += '/'+cmd;
        	model.fetch();
        	this.listenTo(model, "sync", this.setExportFileFormat);
        },
        
        setExportFileFormat : function(method, model, options){
        	if(model.length > 0){
        		this.exportFileFormat = [];
        		for(var i=0; i < model.length; i++){
        			var item = model[i];
        			this.exportFileFormat.push(item.code_name);
        		}
        	}else{
        		w2alert('CSV File Format Error', "알림");
        	}
        },
        
        /*Location List*/
        getLocationList : function(cmd){
        	var model = new Model();
        	model.url += '/'+cmd;
        	model.fetch();
        	this.listenTo(model, "sync", this.setLocationList);
        },
        
        setLocationList : function(method, model, options){
        	if(model.length > 0){
        		this.locationMap = {};
        		
        		for(var i=0; i < model.length; i++){
        			var loc = model[i];
        			this.locationMap[loc.loc_id] = loc;
        		}
        		
        		//Room 정보만 필터링
        		var roomList =  _.where(model, {code_id : '86de14ba-5ea3-43c7-e264-7a06cb550336'});
        		
        		this.locationEncoding = {};
        		
        		for(var i =0; i < roomList.length; i++){
        			var item = roomList[i];
        			this.locationEncoding[item.loc_id] = [];
        			this.locationEncoding[item.loc_id].push(item.loc_name);
        			this.parentLocFind(item, item.loc_id);
        		}
        		
        		assetMgr.locationDecoding = _.invert(assetMgr.locationEncoding);
        		
        	}else{
        		w2alert('Location List Error', "알림");
        	}
        },
        
        parentLocFind : function(item, loc_id){
        	var parentItem = assetMgr.locationMap[item.parent_loc_id];
			
			if(parentItem !== undefined){
				assetMgr.locationEncoding[loc_id].push(parentItem.loc_name);
				assetMgr.parentLocFind(parentItem, loc_id);
			}else{
				assetMgr.locationEncoding[loc_id].reverse();
				assetMgr.locationEncoding[loc_id] = assetMgr.locationEncoding[loc_id].join("/@/");
			}
        },
        
        listNotifiCation : function(cmd, param){
        	switch(cmd){
        		case "getExportFileFormat" :
        			this.getExportFileFormat(cmd);
        		break;
        		case "getLocationList" :
        			this.getLocationList(cmd);
        			break;
        		case "getProductStatus" :
        			this.getProductStatus(cmd);
        			break;
        	}
        },
        
        changeColumn : function(type){
        	if(type === "1"){
        		w2ui["assetMgrAssetTable"].columns = [                
                    { field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset name
					{ field: 'productModel', caption: 'MODEL', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REV.', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VER.', size: '150px', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VER.', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '90px', sortable: true, attr: 'align=center' }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '90px', sortable: true, attr: 'align=center' }, // 출고일
					{ field: 'codeDesc', caption: 'STATUS', size: '60px', sortable: true, attr: 'align=center' },
					{ field: 'locName', caption: 'LOC', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:10px;' },
					{ field: 'unitSize', caption: 'U-SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' },
					{ field: 'startPosition', caption: 'S-POS', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' },
                    { field: 'unitIndex', caption: 'U-INDEX', size: '60px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ];
        		
        	}else{
        		w2ui["assetMgrAssetTable"].columns = [                
                    { field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset name
					{ field: 'productModel', caption: 'MODEL', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REV.', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VER.', size: '150px', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VER.', size: '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '90px', sortable: true, attr: 'align=center' }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '90px', sortable: true, attr: 'align=center' }, // 출고일
					{ field: 'codeDesc', caption: 'STATUS', size: '60px', sortable: true, attr: 'align=center' },
					{ field: 'locName', caption: 'LOC', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'unitSize', caption: 'U-SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ];
        	}
        	
        	w2ui["assetMgrAssetTable"].refresh();
        },
        
        createAssetTree : function(){
        	$("#leftBottom").w2sidebar({
        		name : 'assetMgrAssetTree',
        		nodes: [
                    { id: 'Asset', text: 'ASSET LIST', expanded: true, group: true}
                ],
                
                onClick: function(event) {
                	var selectId = event.target;
                	if(selectId === "All"){
                		that.disabledAllCheckFuc(true);
                		
                		$("#assetMgrDelBtn").prop('disabled', true);
        				$("#assetMgrDelBtn").css('color', '#8e8c8c');
        				$("#assetMgrDelBtn").removeClass('link');
        				
        				$("#assetMgrExportBtn").prop('disabled', true);
        				$("#assetMgrExportBtn").css('color', '#8e8c8c');
        				$("#assetMgrExportBtn").removeClass('link');
                	}else{
                		if($("#assetMgrAddBtn").hasClass('link')){
                			$("#assetMgrAddBtn").prop('disabled', true);
            				$("#assetMgrAddBtn").css('color', '#8e8c8c');
            				$("#assetMgrAddBtn").removeClass('link');
                		}
                		$("#assetMgrAddBtn").prop('disabled', false);
                		$("#assetMgrAddBtn").css('color', '#fff');
        				$("#assetMgrAddBtn").addClass('link');
                		
                		$("#assetMgrDelBtn").prop('disabled', true);
        				$("#assetMgrDelBtn").css('color', '#8e8c8c');
        				$("#assetMgrDelBtn").removeClass('link');
        				
        				$("#assetMgrExportBtn").prop('disabled', true);
        				$("#assetMgrExportBtn").css('color', '#8e8c8c');
        				$("#assetMgrExportBtn").removeClass('link');
                	}
                	
                	w2ui["assetMgrAssetTable"].selectNone();
                	
                	assetMgr.selectItem = w2ui["assetMgrAssetTree"].get(selectId);
                	assetMgr.selectedItem(assetMgr.selectItem);
                }
        	});
        },
        
        validationCheck : function(){
        	if(w2ui["assetMgrAssetTable"].getSelection().length > 0 ){
        		$("#assetMgrDelBtn").prop('disabled', false);
				$("#assetMgrDelBtn").css('color', '#fff');
				$("#assetMgrDelBtn").addClass('link');
				
				$("#assetMgrExportBtn").prop('disabled', false);
				$("#assetMgrExportBtn").css('color', '#fff');
				$("#assetMgrExportBtn").addClass('link');
        	}else{
        		$("#assetMgrDelBtn").prop('disabled', true);
				$("#assetMgrDelBtn").css('color', '#8e8c8c');
				$("#assetMgrDelBtn").removeClass('link');
				
				$("#assetMgrExportBtn").prop('disabled', true);
				$("#assetMgrExportBtn").css('color', '#8e8c8c');
				$("#assetMgrExportBtn").removeClass('link');
        	}
        },
        
        start : function() {
        	this.model = new Model();
        	this.model.fetch();
        	this.listenTo(this.model, "sync", this.initSetData);
        	
        	this.eventListenerRegister();
        },
        
        initSetData: function(method, model, options) { 
        	this.render(model);
		},
		
		render : function(result){
			
			var dataProvider = _.pluck(result, 'id');
			
			var orgData = null;
			
			if(this.assetList){
				orgData = _.pluck(this.assetList, 'id');
			}
			 
			if(util.compare(dataProvider, orgData)){
				console.log("같음");
			}else{
				console.log("다름");
				
				if(w2ui["assetMgrAssetTree"]){
					w2ui["assetMgrAssetTree"].destroy();
				}
				
				this.createAssetTree();
				
				for(var i=0; i < result.length; i++){
					var item = result[i];
					item.text = item.name;
					item.icon = 'fas fa-cube fa-lg';
				}
				
				var searchItem = {text:'All', icon:'fas fa-search fa-lg', id:'All'};
				w2ui["assetMgrAssetTree"].insert('Asset', null, searchItem);
				w2ui["assetMgrAssetTree"].insert('Asset', null, result);
				
				if(!this.selectItem){
					this.selectItem = w2ui["assetMgrAssetTree"].get(w2ui["assetMgrAssetTree"].nodes[0].nodes[1].id);
					w2ui["assetMgrAssetTree"].select(w2ui["assetMgrAssetTree"].nodes[0].nodes[1].id);
				}else{
					w2ui["assetMgrAssetTree"].select(this.selectItem.id);
				}
				
				this.assetList = result;
				//this.createAssetMap();
			}
			
			this.selectedItem(this.selectItem);
		},
		
		createAssetMap : function(){
			this.assetMap = {};
			
			for(var i=0; i < this.assetList.length; i++){
				var item = this.assetList[i];
				this.assetMap[item.id] = item;
			}
		},
        
		selectedItem : function(item){
			if(item.inOutStatus === "1" || item.text === "All"){ //item.text === "SERVER"
				this.changeColumn("1");
			}else{
				this.changeColumn();
			}
			var param = {};
			param.id = item.id;
			param.startRow = 0;
			param.endRow = 25;
			var model = new Model(param);
			model.url = model.url+"/"+item.text;
			model.save();
			this.listenTo(model, "sync", this.setData);
		},
		
		setData : function(method, model, options){
			var assetType = method.attributes.id;
			
			if($('#assetMgrPager').data("twbs-pagination")){
				$('#assetMgrPager').pager("destroy").off("cllick");
				var pageGroup = '<div class="asset-manager-pager" id="assetMgrPager" data-paging="true"></div></div>';
				$("#assetMgrPagerTable").html(pageGroup);
            }
			
			 $('#assetMgrPager').pager({
	            	"totalCount" : model.totalCount,
	            	"pagePerRow" : 25
	            }).on("click", function (event, page) {
	            	var evtClass = $(event.target).attr('class');
	            	if(evtClass != 'page-link') return;
	            	
	            	that.refreshProcess();
	         });
			 
			var pagination = $('#assetMgrPager').data('twbsPagination');
			var currentPage = pagination.getCurrentPage();
			
			
			$('#assetMgrPager').pager('pagerTableCSS', ".asset-manager-pager .pagination", model.totalCount, currentPage);
			
			w2ui['assetMgrAssetTable'].records = model.result;
			w2ui['assetMgrAssetTable'].refresh();
			
			that.disabledCheckFuc(false);
				
			if(assetType === "All"){
				that.disabledAllCheckFuc(true);
			}else{
				that.disabledAllCheckFuc(false);
			}
		},
		
		disabledCheckFuc : function(flag){
			if(flag){
				$("#assetMgrDelBtn").prop('disabled', false);
				$("#assetMgrDelBtn").css('color', '#fff');
				$("#assetMgrDelBtn").addClass('link');
				
	    		$("#assetMgrExportBtn").prop('disabled', false);
	    		$("#assetMgrExportBtn").css('color', '#fff');
				$("#assetMgrExportBtn").addClass('link');
			}else{
				$("#assetMgrDelBtn").prop('disabled', true);
				$("#assetMgrDelBtn").css('color', '#8e8c8c');
				$("#assetMgrDelBtn").removeClass('link');
				
				$("#assetMgrExportBtn").prop('disabled', true);
				$("#assetMgrExportBtn").css('color', '#8e8c8c');
				$("#assetMgrExportBtn").removeClass('link');
			}
		},
		
		disabledAllCheckFuc : function(flag){
			if(flag){
				$("#assetMgrAddBtn").prop('disabled', true);
				$("#assetMgrAddBtn").css('color', '#8e8c8c');
				$("#assetMgrAddBtn").removeClass('link');
			}else{
				$("#assetMgrAddBtn").prop('disabled', false);
				$("#assetMgrAddBtn").css('color', '#fff');
				$("#assetMgrAddBtn").addClass('link');
			}

		},
		
		refreshProcess : function(){
			var item = assetMgr.selectItem; 
        	
        	var pagination = $('#assetMgrPager').data('twbsPagination');
        	
        	var currentPage = pagination.getCurrentPage();
        	
        	var param = {};
			param.id = item.id;
			param.endRow = 25;
			param.startRow = (currentPage*param.endRow) - param.endRow;
        	
        	var model = new Model(param);
        	model.url = model.url + "/" + item.text;
        	model.save();
        	that.listenTo(model, "sync", that.refreshView);
		},
		
		refreshView : function(method, model, options){
			if(model.startRow == 25 && model.result.length == 0){
				this.model.fetch();
			}else{
				w2ui['assetMgrAssetTable'].records = model.result;
				w2ui['assetMgrAssetTable'].refresh();
			}
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
        	console.log('assetManager destroy');
        	
        	if(w2ui['assetMgrAssetTable']){
    			w2ui['assetMgrAssetTable'].destroy();
    		}
        	
        	if(w2ui['assetMgrAssetTree']){
        		w2ui['assetMgrAssetTree'].destroy();
        	}
        	
        	if(w2ui['assetMgr_popup_properties']){
        		w2ui['assetMgr_popup_properties'].destroy();
        	}
        	
        	if(w2ui['assetMgrLayout']){
        		w2ui['assetMgrLayout'].destroy();
        	}
        	
        	if(w2ui['importAssetTable']){
        		w2ui['importAssetTable'].destroy();
        	}
        	
        	this.removeEventListener();
        	
        	assetMgr = null;
        	
        	that = null;
        	
        	this.undelegateEvents();
        }
    })

    return Main;
});