define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/assetManager",
    "w2ui",
    "js/lib/component/BundleResource",
    "jquery-csv",
    "css!cs/asset/itamReport"
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
	
	var importModel = Backbone.Model.extend({
		model:Model,
		url:'assetManager/setData',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		that = this;
    		this.elements = {
    			scene : null,
    			assetList : null
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
        		/* The line-height is bigger than other browsers. */
        		$("#leftContents").css("height", "calc(100% - 100px)");
        		$("#mainContents").css("height", "calc(100% - 100px)");
        	} else if(this.checkBrowser() == "opera") {
        		console.log("Opera");
        	} else {
        		console.log("IE");
        	} 
        },
        
     /*   events: {
        	
        	//추가 팝업 확인 버튼
        	'click #assetMgrPopupOkBtn' : 'checkProcess',
        	'click #assetMgrPopupDeleteOkBtn' : 'deleteExcute',
        	'click #assetMgrDelBtn' : 'deleteData',
        	'click #assetMgrAddBtn' : 'addData',
        	'click #assetMgrImportBtn' : 'importPopup',
        	'click #assetMgrExportBtn' : 'exportData',
        	
        	//import popup에 있는 click event
        	'click #assetMgrImportDelBtn' : 'importDelete',
        	'change #txtFileUpload' : 'importData',
        	'click #importPopupSaveBtn' : 'setImportData',
        },*/
        
        //이벤트 등록
        eventListenerRegister : function(){
        	//추가 팝업 확인 버튼
        	$(document).on("click", "#assetMgrPopupOkBtn", this.checkProcess);
        	$(document).on("click", "#assetMgrPopupDeleteOkBtn", this.deleteExcute);
        	$(document).on("click", "#assetMgrDelBtn", this.deleteData);
        	$(document).on("click", "#assetMgrAddBtn", this.addData);
        	$(document).on("click", "#assetMgrImportBtn", this.importPopup);
        	$(document).on("click", "#assetMgrExportBtn", this.exportData);
        	
        	//import popup에 있는 click event
        	$(document).on("click", "#assetMgrImportDelBtn", this.importDelete);
        	$(document).on("change", "#txtFileUpload", this.importData);
        	$(document).on("click", "#importPopupSaveBtn", this.setImportData);
        	
        },
        
        //이벤트 해제
        removeEventListener : function(){
        	$(document).off("click", "#assetMgrPopupOkBtn");
        	$(document).off("click", "#assetMgrPopupDeleteOkBtn");
        	$(document).off("click", "#assetMgrDelBtn");
        	$(document).off("click", "#assetMgrAddBtn");
        	$(document).off("click", "#assetMgrImportBtn");
        	$(document).off("click", "#assetMgrExportBtn");
        	
        	$(document).off("click", "#assetMgrImportDelBtn");
        	$(document).off("change", "txtFileUpload");
        	$(document).off("click", "#importPopupSaveBtn");
        },
        
        checkProcess : function(event){
        	var item = w2popup.get();
        	
        	assetMgr.assetItemCheck(event, item.type);
        },
        
        /* Asset Type Information, Location Information */
        getAddData : function(){
        	var item = {
        			'assetType' : null,
        			'location' : null,
        			'result' : false
        	};
        	
        	$.ajax({	
        		type:'GET',
        		url: "/assetManager",
        		contentType: "application/json; charset=utf-8",
        		async: false,
        		success: function(data){
        			console.log("success to get assetType");
        			item.assetType = data;
        		},
        		error: function(){
        			console.log("fail");
        		},
        	});
        	
        	$.ajax({	
        		type:'GET',
        		url: "/locationManager/location",
        		contentType: "application/json; charset=utf-8",
        		async: false,
        		success: function(data){
        			console.log("success to get location");
        			item.location = data;
        		},
        		error: function(){
        			console.log("fail");
        		},
        	});
        	
        	if(item.assetType != null && item.location != null){
        		item.result = true;
        	}
        	
        	return (function(){
        		if(item.result == true){
        			return item;
        		}
        	})(item);
        },
        
        exportData : function(){
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
        		let csvContent = "data:application/octet-stream;charset=utf-8,"; //\uFEFF
        		
        		csvContent += assetMgr.exportFileFormat.join(",") + "\r\n"; // add Header;
        		
        		let rowHeader = w2ui["assetMgrAssetTable"].columns;
        		
        		exporAC.forEach(function(rowArray, idx){
        			let rowData = _.clone(rowArray);
        			delete rowData.recid; //recid 제거
        			let row = "";
        			rowHeader.forEach(function(ac, index){
        				if(index !==0){
        					if(index ===1){
        						row += rowData[ac.field];
        					}else{
        						row += ","+rowData[ac.field];
        					}
        				}
        			});
        			
        			csvContent += row + "\r\n"; // add carriage return
        			
        			//let row = rowData.join(",");
        			//csvContent += row + "\r\n"; // add carriage return
        		}); 
        		
        		var encodedUri = encodeURI(csvContent);
        		window.open(encodedUri);
        		
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
//        		deleteItem = w2ui["importAssetTable"].get(w2ui["importAssetTable"].getSelection());
        		w2ui["importAssetTable"].delete(deleteItem);
        	}
        },
        
        importPopup : function(){
        	var fields = [];
        	var record = {};
    		
    		var body = '<div class="w2ui-centered">'+
				    			'<div id="assetMgrImportWrap" style="height:34px;">'+
					    			'<div>'+
										'<div class="w2ui-field w2ui-span3">'+
										    '<label>File : </label>'+
										    '<div><input type="file" id="file" style="width: 93%" accept=".csv" ></div>'+
										'</div>'+
									'</div>'+
				    			'</div>'+
						    	
				    			'<div id="importAssetContents" style="width:100%; height:100%" ></div>'+
				    		
				    			'<div id="assetMgrImportResultText" style="height:26px;color:#fff;position:relative; top:18px;"></div>'+
								'<div id="assetMgrPopupBottom" style="margin-top:34px;">'+
									'<button id="importPopupSaveBtn" class="darkButton">' + BundleResource.getString('button.assetManager.save') + '</button>'+
									'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.close') + '</button>'+
								'</div>'+
							'</div>';
    		
    	
	    	w2popup.open({
				title : 'Import Data',
		        body: body,
		        width : 1400,
		        height : 728,
//		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
			    showClose : true,
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		w2ui["importAssetTable"].render();
		        		$("#tb_importAssetTable_toolbar_right").append('<i id="assetMgrImportDelBtn" class="icon link fa fa-trash-o fa-2x" aria-hidden="true" title="Del" style="float:right;"></i>');
		        		$('#file').w2field('file', {
		        			max:1,
		        			onClick : function(event){
		        				console.log("onClick onClick");
		        			},
		        			onAdd : function(event){
		        				console.log("onAdd");
		        				$(event.target).change(that.importCsvData(event));
//		        				that.importCsvData(event);
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
                
                recordHeight : 30,
        		multiSelect : true,
        		multiSearch: true,
        		style:'width:100%;height:530px;',
                
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
		            { field: 'recid', caption: 'NO', size: '30%', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'productModel', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REVISION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VERSION', size: '100%%', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VERSION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 출고일
					{ field: 'status', caption: 'STATUS', size: '100%', sortable: true, attr: 'align=left'/*, style:'padding-right:10px;'*/ },
					{ field: 'locId', caption: 'LOCATION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:10px;' },
					{ field: 'unitSize', caption: 'UNIT SIZE', size: '70%', sortable: true, attr: 'align=right', style:'padding-right:10px;' }
					]
            });
        },
        
        setImportData : function(model){
        	var alertBodyContents = "";
        	var Body = "";
        	var recordData = w2ui["importAssetTable"].records;
        	var data = assetMgr.getAddData();
        	var getStatusList = [{"text" : "InStock", "id" : "1"},
        		{"text" : "Keep", "id" : "2"},
        		{"text" : "Active", "id" : "3"},
        		{"text" : "Repair", "id" : "4"},
        		{"text" : "Closed", "id" : "5"}];
        	
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
        	}else{
        		
        		/* Status 염운 -> 한글로 변환해주는 작업 */
        		for(var i in recordData){
        			var text = recordData[i].status;
        			var statusValue = _.where(getStatusList, {text:text})[0].id;
        			recordData[i].status = statusValue;
        		}
        		
        		/* Location 풀 경로 -> room name으로 변환해주는 작업 */
        		var locations = [];
        		var target = [];
        		for(var i in recordData){
        			var location = recordData[i].locId; // full 경로
            		var locs = location.split("/@/"); // /@/ 기준으로 split한 것
            		locations.push(locs);
            		var LocationName = _.last(locations[i]);
        			if(LocationName == null){continue;}
            		target.push(_.where(data['location'], {loc_name : LocationName}));
            		recordData[i].locId = target[i][0].loc_id;
        		}
        		
        		for(var i in recordData){
        			if(recordData[i].codeName == "SERVER"){
        				recordData.push({startPosition:1, unitIndex:1});
        			}
        		}
        		
        		w2ui['importAssetTable'].lock();
        		
        		let type = "multiUpdate";
        		let param = {};
        		param.crudList = recordData;
        		
        		var model = new Model(param);
        		model.url = model.url+"/"+type+"/"+ 'csvUpdate';
        		
        		model.save({}, {
        			success: function (model, respose, options) {
        				assetMgr.crudSuccess(model, respose, options);
        				w2ui['importAssetTable'].unlock();
        				
        				alertBodyContents = "Import가 완료되었습니다";
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
        				
        				/*alertBodyContents = "Import가 완료되었습니다";
            			
            			Body = '<div class="w2ui-centered">'+
            			'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
            			'<div class="assetMgr-popup-btnGroup">'+
            			'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
            			'</div>'+
            			'</div>' ;
            			
            			w2popup.open({
            				width: 385,
            				height: 180,
            				title : BundleResource.getString('title.assetManager.info'),
            				body: Body,
            				opacity   : '0.5',
            				modal     : true,
            				showClose : true
            			});
            			*/
//        				w2ui['importAssetTable'].destroy();
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
        		if(!file.name.includes('csv') /*&& !file.name.includes('txt')*/){ // file 확장자가 csv가 아닌 경우
        			alertBodyContents = BundleResource.getString('label.assetManager.noCSVFile');
            		Body = '<div class="w2ui-centered">'+
    					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
    					'<div class="assetMgr-popup-btnGroup">'+
    						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
            		$(that).w2field('clear'); 
                	
        		}else{
        			var reader = new FileReader();
        			reader.readAsText(file);
        			reader.onload = function(event) {
        				var csvData = event.target.result;
        				data = $.csv.toArrays(csvData);
        				if (data && data.length > 0) {
        					that.csvFormatter(data);
        				} else {
//        					alert('No data to import!');
        					alertBodyContents = 'No data to import!';
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
        				alertBodyContents = 'Unable to read' + file.fileName;
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
    					
    					if(fileFormat[j] === "receiptDate" || fileFormat[j] === "releaseDate"){
    						param[fileFormat[j]] = dayFormat(d[j]);
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
        	
        	/* import grid에 있는 location string 가져옴 */
        	var importRecord = w2ui["importAssetTable"].records;
        	var locations = [];
        	for(var i in importRecord){
        		var location = importRecord[i].locId;
        		var locs = location.split("/@/");
        		locations.push(locs);
        	}
        	
        	/* assetType, location information */
        	var data = assetMgr.getAddData();
        	
        	/* current selected asset type */
        	var item = assetMgr.selectItem;
        	
        	/* 최상위 부모 */
        	
        	var result = [];
        	for(var i in locations){ // locations = target array  
        		var L1 = _.last(locations[i]); // room
        		if(L1 == null){continue;}
        		var target = _.where(data['location'], {loc_name : L1}); // target
        	
        		var check = that.checkLoc(locations[i]);
	        	for(var i in target){
	    			if(that.getChild(data['location'], target[i].loc_id, check)){// data = total array
	    				result.push({id : target[i].loc_id, name : target[i].loc_name}); //Asset List의 Location 컬럼에 들어갈 값
	    			} 
	        	}
        	}
//        	for(var i in dataProvider){
//        		dataProvider[i].locId = result[i];
//        	}
        	w2ui["importAssetTable"].records = dataProvider;
        	w2ui['importAssetTable'].refresh();
        },
        
        checkLoc : function(data) {
    		var isExist = false;
    		
    		return function(compare, i){
    			if(data[i] == compare){
    				isExist = true;
    			}
    			return isExist; 
    		}
    	},
        
        getChild : function(_children, _id, check){
        	
        	var result = false;
        	var count = 3;
        	searchNode(_children, _id);
        	
        	function searchNode(_children, _id){
	        	
        		for(var i=0, child; child = _children[i]; i++){
	        		if(child.loc_id == _id){
	        			var parentId = child.parent_loc_id;
	        			if(check(child.loc_name, count)){
	        				if(parentId == -1){
	        					result = true;
//	        					console.log(result);
	        					break;
		        			}
//	        				console.log(parentId);
	        				count--;
	        				searchNode(_children, parentId);
	        			}
	        			else{
	        				// 가짜판정
	        				console.log(result);
	        			}
	        		}else{
        				continue;
        			}
	        	}
        	};
        	
        	return result;
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
        	
    		if(item.text === "SERVER"){
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
    				status:'',
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
				                    '<label style="width: 115px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4" id="server">'+
				                    '<label style="width: 115px;">START POSITION</label>'+
				                    '<div>'+
				                    	'<input name="startPosition" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4" id="server">'+
				                    '<label style="width: 115px;">UNIT INDEX</label>'+
				                    '<div>'+
				                        '<input name="unitIndex" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">TYPE</label>'+
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
					{name:'unitSize', type: 'int', disabled:false, required:false, html:{caption:'UNIT SIZE'}},
					{name:'type', type: 'text', disabled:true, required:false, html:{caption:'TYPE'}}
    			];
    			
    			record = {
    				assetId:'',
    				assetName:'',
    				productModel:'',
    				type:item.text,
    				unitSize:(item.text==="RACK"?'':1),
    				parentId:item.id,
    				serialNumber:'',
    				revision:'',
    				hwVersion:'',
    				fwVersion:'',
    				receiptDate:'',
    				releaseDate:'',
    				status:'',
//    				locId:''
				}
    			
    			popupHeight = 412;
    			
    			body = '<div class="w2ui-centered">'+
				'<div id="assetMgrPopupContents" style="width:100%; height:100%" >'+
				
				
					'<div class="w2ui-page page-0">'+
				        '<div style="width: 50%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 185px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">TYPE</label>'+
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
				title : 'Add',
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
        	var popupData = w2popup.get();
        	var arr = w2ui["assetMgr_popup_properties"].validate();
        	if(arr.length > 0){
        		return;
        	}else{
        		var dataProvdier = w2ui["assetMgrAssetTable"].records;
            	var item = w2ui["assetMgr_popup_properties"].record;
            	
            	//공백 처리
            	item.assetId = $.trim(item.assetId);
//            	item.assetName = $.trim(item.assetName);
            	item.productModel = $.trim(item.productModel);
            	item.unitSize = $.trim(item.unitSize);
            	if(item.serialNumber == ""){
            		item.serialNumber = item.productModel;
            	}else{
            		item.serialNumber = $.trim(item.serialNumber);
            	}
            	item.revision = $.trim(item.revision);
            	item.hwVersion = $.trim(item.hwVersion);
            	item.fwVersion = $.trim(item.fwVersion);
            	item.receiptDate = $.trim(item.receiptDate);
            	item.releaseDate = $.trim(item.releaseDate);
            	item.status = $.trim(item.status.id);
//            	item.locId = $.trim(item.locId);
            	
            	if(item.type === "SERVER"){
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
            		if(item.type ==="SERVER"){
//            			dataA = selectItem[0].assetName+selectItem[0].codeName+selectItem[0].unitSize+selectItem[0].unitIndex+selectItem[0].startPosition;
//            			dataB = item.assetName+item.type+item.unitSize+item.unitIndex+item.startPosition;
            			dataA = selectItem[0].productModel+selectItem[0].codeName+selectItem[0].unitSize+selectItem[0].serialNumber+selectItem[0].revision+selectItem[0].hwVersion
            					+selectItem[0].fwVersion+selectItem[0].receiptDate+selectItem[0].releaseDate+selectItem[0].status+selectItem[0].unitIndex+selectItem[0].startPosition;
            			dataB = item.productModel+item.type.text+item.unitSize+item.serialNumber+item.revision+item.hwVersion+item.fwVersion+item.receiptDate+item.releaseDate+item.status
            					+item.unitIndex+item.startPosition;
            		}else{
//            			dataA = selectItem[0].assetName+selectItem[0].codeName+selectItem[0].unitSize;
//            			dataB = item.assetName+item.type.text+item.unitSize;
            			dataA = selectItem[0].productModel+selectItem[0].codeName+selectItem[0].unitSize+selectItem[0].serialNumber+selectItem[0].revision+selectItem[0].hwVersion
            					+selectItem[0].fwVersion+selectItem[0].receiptDate+selectItem[0].releaseDate+selectItem[0].status;
            			dataB = item.productModel+item.type.text+item.unitSize+item.serialNumber+item.revision+item.hwVersion+item.fwVersion+item.receiptDate+item.releaseDate+item.status;
            		}
            		
            		if(dataA === dataB){
            			w2popup.message({ 
                	        width   : 360, 
                	        height  : (item.type ==="SERVER"?320:265),
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
			        	
        	var groupId = "";
        	for(var i=0; i < dataProvider.length; i++){
        		if(i===0){
        			groupId += dataProvider[i].assetId;
        		}else{
        			groupId += "_" + dataProvider[i].assetId;
        		}
        	}
        	
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
            		item.status = "";
            		item.unitSize = "";
            		
            		if(item.type ==="RACK"){
            			item.unitSize = "";
            		}else if(item.type ==="SERVER"){
            			item.unitSize = 1;
            			item.startPosition = "";
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
			    
        	}else if(respose.type === "update"){
        		if(respose.status === 300){
        			$("#assetMgrResultText").html(BundleResource.getString('label.assetManager.editFinished'));
                	$("#assetMgrResultText").animate({left:0}, 2000, function(e){$("#assetMgrResultText").html("");});
                	
                	w2ui["assetMgrAssetTable"].selectNone();
                	
                	w2ui["assetMgrAssetTable"].select(w2ui["assetMgrAssetTable"].find({assetId:param.assetId})[0]);
        		}else{
        			
        		}
        	}else if(respose.type === "multiUpdate"){ //import
        		if(respose.status === 400){
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
        	
        	this.model.fetch();
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
	    	var assetList = assetMgr.elements.assetList;
	    	for(var i=0; i < assetList.length; i++){
	    		if(assetList[i].name !== "SERVER"){
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
        	
        	if(item.name ==="SERVER"){
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
				                    '<label style="width: 115px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4" id="server">'+
				                    '<label style="width: 115px;">START POSITION</label>'+
				                    '<div>'+
				                    	'<input name="startPosition" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4" id="server">'+
			                    '<label style="width: 115px;">UNIT INDEX</label>'+
				                    '<div>'+
				                        '<input name="unitIndex" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">TYPE</label>'+
				                    '<div>'+
				                        '<input name="type" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                /*'<div class="w2ui-field w2ui-span4">'+
				                    '<label>F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+*/
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
	    			{name:'assetId', type: 'text', disabled:false, required:true, html:{caption:'ID'}},
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
					{name:'unitSize', type: 'int', disabled:false, required:false, html:{caption:'UNIT SIZE'}},
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
				                    '<label style="width: 115px;">ID</label>'+
				                    '<div>'+
				                        '<input name="assetId" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">PRODUCT MODEL</label>'+
				                    '<div>'+
				                        '<input name="productModel" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">SERIAL NUMBER</label>'+
				                    '<div>'+
				                    	'<input name="serialNumber" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">REVISION</label>'+
				                    '<div>'+
				                        '<input name="revision" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">H/W VERSION</label>'+
				                    '<div>'+
				                        '<input name="hwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">F/W VERSION</label>'+
				                    '<div>'+
				                    	'<input name="fwVersion" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				        
				        '<div style="width: 50%; float: right; margin-left: 0px;">'+
				            '<div class="" style="height: 185px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">NAME</label>'+
				                    '<div>'+
				                    	'<input name="assetName" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RECEIPT DATE</label>'+
				                    '<div>'+
				                        '<input name="receiptDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">RELEASE DATE</label>'+
				                    '<div>'+
				                        '<input name="releaseDate" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">UNIT SIZE</label>'+
				                    '<div>'+
				                        '<input name="unitSize" type="text" maxlength="100" size="20">'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label style="width: 115px;">TYPE</label>'+
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
				title : 'Modify',
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
			
			if(item.name !=="SERVER"){
				if(selectItem.codeName !== null){
					w2ui["assetMgr_popup_properties"].record.type = {id:selectItem.codeId, text:selectItem.codeName};
					w2ui["assetMgr_popup_properties"].refresh();
				}
			}
			
        },
        
        init : function(){
        	
        	this.importFileFormat = [
        		"codeName"
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
        	
        	this.exportFileFormat = [
        		"ProductName"
        		,"Model"
        		,"Serial_Number"
        		,"Revision"
        		,"H/W Version"
        		,"F/W Version"
        		,"ReceiptDate"
        		,"ReleaseDate"
        		,"Status"
        		,"Location"
        		,"UnitSize"
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
	    		'<div class="dashboard-contents"><div id="mainBottom"></div></div>'+
	    	'</div>';
        	
        	$("#mainContents").html(mainSub);
        	
        	$("#mainBottom").w2grid({
        		name:'assetMgrAssetTable',
                show: { 
                    toolbar: true,
                    footer:false,
                    toolbarSearch:false,
                    toolbarReload  : false,
                    searchAll : true,
                    toolbarColumns : false,
                    selectColumn: true
                },
                recordHeight : 30,
        		multiSelect : true,
        		multiSearch: true,
        		//style:'padding:5px;margin:0px 5px 5px 5px;width:100%;height:calc(100% - 30px);',
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
                	{ field: 'recid', caption: 'NO', size: '50%', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'productModel', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REVISION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VERSION', size: '100%%', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VERSION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 출고일
					{ field: 'codeDesc', caption: 'STATUS', size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ },
					{ field: 'locName', caption: 'LOCATION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:10px;' },
					{ field: 'unitSize', caption: 'UNIT SIZE', size: '50%', sortable: true, attr: 'align=right', style:'padding-right:10px;' }
					]
                
            });
        	
        	//DoubClick Event
        	w2ui["assetMgrAssetTable"].onDblClick = this.updateData;
        	
        	var crudBtn = /*'<div id="assetMgrTitle" style="float:left;font-weight: bold;">● ASSET LIST</div>'+ */
        		'<div style="height:50px;position:absolute;right:5px;top:7px;" id="assetMgrBtnGroup">'+
        		/*'<i id="assetMgrImportBtn" class="icon link fa fa-download fa-2x" aria-hidden="true" title="Import"></i>'+*/
        		'<i id="assetMgrImportBtn" class="icon link fa fa-reply fa-2x" aria-hidden="true" title="Import"></i>'+
        		/*'<i id="assetMgrExportBtn" class="icon link fa fa-upload fa-2x" aria-hidden="true" title="Export"></i>'+*/
        		'<i id="assetMgrAddBtn" class="icon link fa fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
        		'<i id="assetMgrDelBtn" class="icon link fa fa-trash-o fa-2x" aria-hidden="true" title="Del"></i>'+
        		'<i id="assetMgrExportBtn" class="icon link fa fa-share fa-2x" aria-hidden="true" title="Export"></i>'+
	        	/*'<button id="assetMgrAddBtn">추가</button>'+
	        	'<button id="assetMgrDelBtn">삭제</button>'+*/
        	'</div>';
        	
        	$("#mainTop").html(crudBtn);
        	
        	var pageBtn = 
        		'<div class="pager-table-area" id="operationPagerTable">'+
        			'<div class="operation-pager" id="operationPager" data-paging="true"></div>'+
        		'</div>';
        	
        	$("#mainPager").html(pageBtn);
        	
        	/*var saveBtn = '<div id="saveBtn" style="float: right; margin-top: 1%;">'+
			'<button style="width:60px; height:25px; color:#000; border-radius: 5px;float:right;">저장</button>'+
			'<fieldset><input type="file" name="FileUpload" id="txtFileUpload" accept=".csv" style="float:right;width:250px;"/></fieldset>'+
		'</div>';*/
        	
        },
        
        changeColumn : function(type){
        	if(type === "SERVER"){
        		w2ui["assetMgrAssetTable"].columns = [                
                    { field: 'recid', caption: 'NO', size: '50%', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'productModel', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REVISION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VERSION', size: '100%%', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VERSION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 출고일
					{ field: 'codeDesc', caption: 'STATUS', size: '70%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ },
					{ field: 'locName', caption: 'LOCATION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:10px;' },
					{ field: 'unitSize', caption: 'UNIT SIZE', size: '80%', sortable: true, attr: 'align=right', style:'padding-right:10px;' },
					{ field: 'startPosition', caption: 'START POSITION', size: '90%', sortable: true, attr: 'align=right', style:'padding-right:10px;' },
                    { field: 'unitIndex', caption: 'UNIT INDEX', size: '80%', sortable: true, attr: 'align=right', style:'padding-right:10px;' }
                ];
        		
        	}else{
        		w2ui["assetMgrAssetTable"].columns = [                
                    { field: 'recid', caption: 'NO', size: '50%', sortable: true, attr: 'align=center'},
					{ field: 'codeName', caption: 'TYPE', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, // asset type
					{ field: 'productModel', caption: 'MODEL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // 모델명
					{ field: 'serialNumber', caption: 'S/N', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'revision', caption: 'REVISION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' }, // h/w version의 상위 개념 
					{ field: 'hwVersion', caption: 'H/W VERSION', size: '100%%', sortable: true, attr: 'align=left' , style:'padding-left:5px;'  },
					{ field: 'fwVersion', caption: 'F/W VERSION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
					{ field: 'receiptDate', caption: 'RECEIPT DATE', options : {format : 'yyyy-mm-dd'}, size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 입고일
					{ field: 'releaseDate', caption: 'RELEASE DATE', options : {format : 'yyyy-mm-dd'}, size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ }, // 출고일
					{ field: 'codeDesc', caption: 'STATUS', size: '100%', sortable: true, attr: 'align=center'/*, style:'padding-right:10px;'*/ },
					{ field: 'locName', caption: 'LOCATION', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:10px;' },
					{ field: 'unitSize', caption: 'UNIT SIZE', size: '50%', sortable: true, attr: 'align=right', style:'padding-right:10px;' }
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
                		$("i#assetMgrAddBtn").hide();
                	}else{
                		$("i#assetMgrAddBtn").show();
                	}
                	
                	w2ui["assetMgrAssetTable"].selectNone();
                	
                	assetMgr.selectItem = w2ui["assetMgrAssetTree"].get(selectId);
                	assetMgr.selectedItem(assetMgr.selectItem);
                }
        	});
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
			
			if(this.elements.assetList){
				orgData = _.pluck(this.elements.assetList, 'id');
			}
			 
			if(util.compare(dataProvider, orgData)){
				console.log("같음");
			}else{
				console.log("다름");
				
				if(w2ui["assetMgrAssetTree"]){
					w2ui["assetMgrAssetTree"].destroy();
				}
				
				this.createAssetTree();
				
				let Length = [];
				for(var i=0; i < result.length; i++){
					var item = result[i];
					$.ajax({	
						type:'GET',
						url: "/assetManager"+"/"+item.text+"/"+item.id,
						contentType: "application/json; charset=utf-8",
						async: false,
						success: function(data){
							var len = data.length;
							Length.push({ length : len });
						},
						error: function(){
							console.log("fail");
						},
					});
					item.text = item.name;
//					item.assetLen = item.name + " [ " + Length[i].length + " ] ";
//					item.count = Length[i].length;
					item.icon = 'fa fa-cube';
				}
				
				var searchItem = {text:'All', icon:'fa fa-search', id:'All'};
				w2ui["assetMgrAssetTree"].insert('Asset', null, searchItem);
				w2ui["assetMgrAssetTree"].insert('Asset', null, result);
				
				if(!this.selectItem){
					this.selectItem = w2ui["assetMgrAssetTree"].get(w2ui["assetMgrAssetTree"].nodes[0].nodes[1].id);
					w2ui["assetMgrAssetTree"].select(w2ui["assetMgrAssetTree"].nodes[0].nodes[1].id);
				}else{
					w2ui["assetMgrAssetTree"].select(this.selectItem.id);
				}
				
				this.elements.assetList = result; 
			}
			
			this.selectedItem(this.selectItem);
		},
        
		selectedItem : function(item){
			if(item.text === "SERVER" || item.text === "All"){
				this.changeColumn("SERVER");
			}else{
				this.changeColumn();
			}
			var model = new Model();
			model.url = model.url+"/"+item.text+"/"+item.id;
			model.fetch();
			this.listenTo(model, "sync", this.setData);
		},
		
		setData : function(method, model, options){
			w2ui['assetMgrAssetTable'].records = model;
			w2ui['assetMgrAssetTable'].refresh();
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