define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/assetStatus",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/asset/assetStatus"
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
	
	var AssetStatusModel = Backbone.Collection.extend({
		url : 'assetStatus/searchAssetStatus',
		model : Model,
		parse : function(result){
			cnosole.log("Parse Result = "+result);
		}
	});
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.collection = null;
			this.locationList = null; 
			this.productList = null; 
			this.exportFileFormat = [];
			this.locationEncoding = null;
    		this.locationDecoding = null;
			this.productEncoding = null;
			this.productDecoding = null;
			this.locationMap = null;
			this.requestParam = null;
			//Location 정보를 불러온뒤 그리기 위한 플러그
			this.flugA = false;
			this.flugB = false;
			this.flugC = false;
			this.flugD = false;
			this.elements = {
    		};
			this.$el.append(JSP);
			this.init();
			
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
	
		addData : function(evtIn){
			console.log("Polling Event in AssetStatus "+evtIn);
		},
		
		init : function(){
			assetSts = this;
			var cnvtDay = util.getDate("Day");
			var cnvtMonth = util.getDate("Month");
			
			var getStatusList = [/*{"text" : "All", "value" : "0"},*/
								   {"text" : "입고일", "value" : "1"},
								   {"text" : "재고일", "value" : "2"},
								   {"text" : "출고일", "value" : "3"}];
								   /*{"text" : "수리", "value" : "4"},
								   {"text" : "폐기", "value" : "5"},];*/
			
			var getSearchTypeList = [{"text" : "일간", "value" : "1"},
									 {"text" : "월간", "value" : "2"},
									 {"text" : "기간", "value" : "3"}];
			
			$("#contentsDiv").w2layout({
				name:'assetStatus_layout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
			});
			
			var leftContents = '<div id="leftTop" style="height:35px">'+
        	'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Conditions</div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom">'+
	    			'<div class="w2ui-page page-0">'+
		            		'<div class="w2ui-field">'+
		            			'<label>LOCATION</label>'+
		            			'<div>'+
		            				'<input class="" name="location" type="list" size="40" style="width:258px;" />'+
		            			'</div>'+
		            		'</div>'+
		            		'<div class="w2ui-field">'+
		        				'<label>PRODUCT NAME</label>'+
		        				'<div>'+
		        					'<input name="productName" type="list" size="40" style="width:258px;" />'+
		        				'</div>'+
		        			'</div>'+
		        			'<div class="w2ui-field">'+
		            			'<label>MODEL</label>'+
		            			'<div>'+
		            				'<input name="model" type="text" size="40" style="width:258px;" />'+
		            			'</div>'+
		            		'</div>'+
		            		'<div class="w2ui-field">'+
		        				'<label>TYPE</label>'+
		        				'<div>'+
									'<input name="status" type="list" size="40" style="width:258px;" />'+
								'</div>'+
		        			'</div>'+
		        			'<div class="w2ui-field">'+
		        				'<label>조회타입</label>'+
		        				'<div>'+
									'<input name="searchType" type="list" size="40" style="width:258px;" />'+
		    					'</div>'+
		        			'</div>'+
		        			'<div class="w2ui-field">'+
		        				'<label>조회기간</label>'+
		        				'<div id="dailyMonthly" class="w2ui-field" style="padding-right:0px;">'+
									'<label class="fromTotime">To</label><input name="searchDayMonth" type="searchDayMonth" size="33" />'+
								'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">From</label><input name="searchFromPeriod" type="searchFromPeriod" size="33" />'+
		    					'</div>'+
		    					'<div class="periodic w2ui-field" style="padding-right:0px;">'+
		    						'<label class="fromTotime">To</label><input name="searchToPeriod" type="searchToPeriod" size="33" />'+
		    					'</div>'+
		        			'</div>'+
		        			'<div style="padding-top:25px; text-align:right;"><button id="searchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.assetStatus.search') + '</button></div>'+
		    			'</div>'+
	    			'</div>'+
	    		'</div>'+
	    	'</div>';
			
			var mainContents = '<div id="mainTop"></div>'+
					        	'<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title">Status Result</div>'+
						    		'<div class="dashboard-contents">'+
							    		'<div id="mainSubBottom"></div>'+
								    	'<div class="pager-table-area" id="assetStsPagerTable">'+
											'<div class="asset-status-pager" id="assetStsPager" data-paging="true"></div>'+
										'</div>'+
						    		'</div>'+
						    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#mainContents").html(mainContents);
			
			$(".periodic").hide();
			
			$("#leftBottom").w2form({
				name : 'assetStatus_options',
				focus : -1,
				fields : [
					{name : 'location', type : 'list' },
					{name : 'productName', type : 'list'},
					{name : 'model', type : 'text'},
					{name : 'status', type : 'list', options : {items : getStatusList}},
					{name : 'searchType', type : 'list', options : {items : getSearchTypeList}},
					{name : 'searchDayMonth', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					location : this.getLocationList[0],
					productName : 'All',
					model : '',
					status : getStatusList[0],
					searchType : getSearchTypeList[0],
					searchDayMonth : cnvtDay,
					searchFromPeriod : '',
					searchToPeriod : ''
				},
				onChange : function(event){
					var eventTarget = event.target;
					if("searchType" == eventTarget){
						console.log("Change Search Type");
						if(3 == event.value_new.value){ // 기간
							$(".periodic").show();
							$("#dailyMonthly").hide();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							
							$("#searchFromPeriod").attr("placeholder", "yyyy-mm-dd");
							$("#searchToPeriod").attr("placeholder", "yyyy-mm-dd");
							
							$("#searchFromPeriod").val(cnvtDay);
							$("#searchToPeriod").val(cnvtDay);
							
						}else if(2 == event.value_new.value){ // 월간
							
							$(".periodic").hide();
							$("#dailyMonthly").show();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							$("#searchDayMonth").attr("placeholder", "yyyy-mm");
							$("#searchDayMonth").val(cnvtMonth);
							//$("#searchDayMonth").attr("readonly", true);
							
						}else{ // Default = 일간
							$(".periodic").hide();
							$("#dailyMonthly").show();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							$("#searchDayMonth").attr("placeholder", "yyyy-mm-dd");
							$("#searchDayMonth").val(cnvtDay);
							//$("#searchDayMonth").attr("readonly", true);
						}
					}
				}
			});
			
			$('input[type=searchFromPeriod').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=searchToPeriod]')});
			$('input[type=searchToPeriod').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=searchFromPeriod]')});
			
			/*var getRowList = ['50', '70', '100', '150', '200'];
			$("#mainTop").w2form({
				name : 'assetStatus_rows',
				focus : -1,
				fields : [
					{name : 'rows', type : 'list', options : {items : getRowList}}
				],
				record : {
					rows : getRowList[0]
				},
				onChange : function(event){
					alert(event.value_new.id);
				}
			});*/
			
			$("#mainSubBottom").w2grid({
				name : 'assetStatus_table',
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
         			{ field: 'code_name', caption: 'PRODUCT NAME', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'product_model', caption: 'MODEL', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'serial_number', caption: 'S/N', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'revision', caption: 'REVISION', size : '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'hw_version', caption: 'H/W VERSION', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'fw_version', caption: 'F/W VERSION', size : '150px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
         			{ field: 'receipt_date', caption: 'RECEIPT DATE', size : '90px', sortable: true, attr: 'align=center' },
         			{ field: 'release_date', caption: 'RELEASE DATE', size : '90px', sortable: true, attr: 'align=center' },
         			{ field: 'status', caption: 'STATUS', size : '60px', sortable: true, attr: 'align=center',
         				render : function (record){
         					var status = ['','입고','재고','출고'];
         					return status[record.status];
         				}
         			},
         			{ field: 'loc_name', caption: 'LOCATION', size : '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;' }
				]
			});
			
			w2ui["assetStatus_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["assetStatus_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["assetStatus_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	var btnGroup = '<div id="assetStsBtnGroup">'+ 
        						'<i id="exportBtn" class="icon link fab fa-yes-export fa-2x" aria-hidden="true" title="Export"></i>'+
        				'</div>';
        	$("#mainTop").html(btnGroup);
        	
        	$("#exportBtn").prop("disabled", true);
			$("#exportBtn").removeClass('link');
			
			this.getData();
			//this.getProductList(); // Get Product List
		},
		
		start : function(){
			this.searchAction();
		},
	
		events : {
			'click #searchBtn' : 'searchAction',
			'click #exportBtn' : 'exportAction'
		},
		
		getData : function(){
				this.listNotifiCation("getExportFileFormat"); //export csv format
				this.listNotifiCation("getLocationList");
				this.listNotifiCation("getProductList");
	        	this.listNotifiCation("getProductStatus");
        	//this.listNotifiCation("searchAction");
        	//assetSts.start();
		},
		
		listNotifiCation : function(cmd, param){
        	switch(cmd){
        		case "getExportFileFormat" :
        			this.getExportFileFormat(cmd);
        		break;
        		case "getLocationList" :
        			this.getLocationFormatList(cmd);
        			this.getLocationList();
        			break;
        		case "getProductStatus" :
        			this.getProductStatus(cmd);
        			break;
        		case "getProductList" :
        			this.getProductList();
        			break;
        		/*case "searchAction" :
        			this.searchAction();
        			break;*/
        	}
        },
        
        //CSV File Export Formatter
        getExportFileFormat : function(cmd){
        	var model = new Model();
        	model.url = 'assetManager/'+cmd;
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
        getLocationFormatList : function(cmd){
        	var model = new Model();
        	model.url = 'assetManager/'+cmd;
        	model.fetch();
        	this.listenTo(model, "sync", this.setLocationFormatList);
        },
        
        setLocationFormatList : function(method, model, options){
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
        		
        		assetSts.locationDecoding = _.invert(assetSts.locationEncoding);
        		
        		that.flugA = true;
        		
        		that.searchAction();
        		
        	}else{
        		w2alert('Location List Error', "알림");
        	}
        },
        
        getProductStatus : function(cmd){
        	var model = new Model();
        	model.url = 'assetManager/'+cmd;
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
        		
        		this.productDecoding = _.invert(assetSts.productEncoding);
        		
        		that.flugD = true;
				that.searchAction();
				
        	}else{
        		w2alert('Product Status Error', "알림");
        	}
        },
        
        parentLocFind : function(item, loc_id){
        	var parentItem = assetSts.locationMap[item.parent_loc_id];
			
			if(parentItem !== undefined){
				assetSts.locationEncoding[loc_id].push(parentItem.loc_name);
				assetSts.parentLocFind(parentItem, loc_id);
			}else{
				assetSts.locationEncoding[loc_id].reverse();
				assetSts.locationEncoding[loc_id] = assetSts.locationEncoding[loc_id].join("/@/");
			}
        },
        
		searchAction : function(){
			 if(this.flugA && this.flugB && this.flugC && this.flugD){
				 var delEmpty = null;
					var splitModel = [];
					var item = w2ui["assetStatus_options"].record;
					var selectedDayMonth = $("#searchDayMonth").val();
					var selectedFromDate = $("#searchFromPeriod").val();
					var selectedToDate = $("#searchToPeriod").val();
					
					if(selectedDayMonth == "" && selectedFromDate == "" && selectedToDate == ""){
						w2popup.open({
		            		width: 385,
		     		        height: 180,
		    		        title : BundleResource.getString('title.assetStatus.info'),
		    		        body: '<div class="w2ui-centered">'+BundleResource.getString('label.assetStatus.noSelectDate')+'</div>',
		                    opacity   : '0.5',
		             		modal     : true,
		        		    showClose : true
		    		    });
					}else{
						w2ui['assetStatus_table'].lock("Loading...", true);
						var model = item.model;
						if(model != "" && model != null){
							delEmpty = model.replace(/ /gi, "");
							splitModel = delEmpty.split(',');
						}
						this.requestParam = {
								status : item.status.value,
								location : item.location.loc_id,
								model : splitModel,
								productName : item.productName.id,
								searchType : item.searchType.value,
								searchDayMonth : selectedDayMonth,
								searchFromPeriod : selectedFromDate,
								searchToPeriod : selectedToDate,
								startRow : 0,
								endRow : 25
						};
						
						Backbone.ajax({
							dataType : 'json',
							contentType : 'application/json',
							url : '/assetStatus/searchAssetStatus',
							method : 'post',
							data : JSON.stringify(this.requestParam),
							success : function(val){
								// Check exist data 
								//w2ui['assetStatus_table'].lock("Loading...", true);
								var dataCnt = val.result.length;
								if(dataCnt == 0){
									w2ui['assetStatus_table'].clear();
								}else{
									if($('#assetStsPager').data("twbs-pagination")){
										$('#assetStsPager').pager("destroy").off("click");
										var pageGroup = '<div class="asset-status-pager" id="assetStsPager" data-paging="true"></div></div>';
										$("#assetStsPagerTable").html(pageGroup);
						            }
									
									$('#assetStsPager').pager({
						            	"totalCount" : val.totalCount,
						            	"pagePerRow" : 25
						            }).on("click", function (event, page) {
						            	var evtClass = $(event.target).attr('class');
						            	if(evtClass != 'page-link') return;
						            	
						            	var pagination = $('#assetStsPager').data('twbsPagination');
						            	
						            	var currentPage = pagination.getCurrentPage();
						            	
						            	var requestParam = that.requestParam;
						            	
						            	var endRow = 25;
						            	var startRow = (currentPage*endRow) - endRow;
						            	
						            	var model = new Model();
						            	model.url = "assetStatus/searchAssetStatus";
						            	model.set({"status" : requestParam.status, "location" : requestParam.location, "model" : requestParam.model, "productName" : requestParam.productName, "searchType" : requestParam.searchType, 
						            		"searchDayMonth" : requestParam.searchDayMonth, "searchFromPeriod" : requestParam.searchFromPeriod, "searchToPeriod" : requestParam.searchToPeriod, "startRow" : startRow, "endRow" : endRow});
						            	model.save();
						            	that.listenTo(model, "sync", that.refreshView);
						            	
						            });
									
									var pagination = $('#assetStsPager').data('twbsPagination');
									var currentPage = pagination.getCurrentPage();
									
									
									$('#assetStsPager').pager('pagerTableCSS', ".asset-status-pager .pagination", val.totalCount, currentPage);
									
									w2ui['assetStatus_table'].clear();
									w2ui['assetStatus_table'].records = val.result;
									w2ui['assetStatus_table'].refresh();
								}
								w2ui['assetStatus_table'].unlock();
							},
							error : function(val){
								w2alert('Failed', 'Error');
							}
						});
					}
			 }
			
		},
		
		refreshView : function(method, model, options){
			w2ui['assetStatus_table'].clear();
			w2ui['assetStatus_table'].records = model.result;
			w2ui['assetStatus_table'].refresh();
		},
				
		validationCheck : function(){
			if(w2ui['assetStatus_table'].getSelection().length > 0){
				$("#exportBtn").prop('disabled', false);
				$("#exportBtn").addClass('link');
			}else{
				$("#exportBtn").prop('disabled', true);
				$("#exportBtn").removeClass('link');
			}
		},
		
		exportAction : function(){
			that.validationCheck();
			if($("#exportBtn").prop('disabled')){
				return;
			}
			let body = "";
			let exporAC = w2ui["assetStatus_table"].get(w2ui["assetStatus_table"].getSelection());
			let selectedDataLen = exporAC.length;
			
			body = '<div class="w2ui-centered">'+
						'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+selectedDataLen + BundleResource.getString('label.assetStatus.exportConfirm')+'</div>'+
							'<div class="assetMgr-popup-btnGroup">'+
								'<button onclick="" id="exportConfirmAction" class="darkButton">' + BundleResource.getString('button.assetStatus.confirm') + '</button>'+
								'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetStatus.cancel') + '</button>'+
							'</div>'+
						'</div>' ;
			
			w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.assetStatus.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
			
			$("#exportConfirmAction").click(function(){
				w2popup.close();
				let csvContent = "data:application/octet-stream;charset=utf-8,";
	        	
	        	csvContent += assetSts.exportFileFormat.join(",") + "\r\n"; // add Header;
	        	let rowHeader = w2ui["assetStatus_table"].columns;
	        	
	        	exporAC.forEach(function(rowArray, idx){
	        		let row = "";
        			row += rowArray.asset_id; //id
        			row += "," + rowArray.code_name; //productName
        			row += "," + rowArray.product_model; //model
        			row += "," + rowArray.serial_number; //serialNumber
        			row += "," + rowArray.revision; //revision
        			row += "," + rowArray.hw_version; //hw version
        			row += "," + rowArray.fw_version; //fw version
        			row += "," + rowArray.receipt_date; //ReceiptDate
        			row += "," + rowArray.release_date; //ReleaseDate
        			let encodingStatus = assetSts.productDecoding[rowArray.status]; //Status
        			row += "," + (encodingStatus !== undefined ? encodingStatus : "");
        			let endcodingLocation = assetSts.locationEncoding[rowArray.loc_id]; 
        			row += "," + (endcodingLocation !== undefined ? endcodingLocation : ""); //Location
        			row += "," + rowArray.unit_size; //Unit Size
	        		
	        		csvContent += row + "\r\n"; // add carriage return
	        	}); 
	        	
	        	var encodedUri = encodeURI(csvContent);
	        	//window.open(encodedUri);
	        	
	        	var link = document.createElement("a");
	        	 if (link.download !== undefined) {
	        		link.setAttribute("href", encodedUri);
	        		link.setAttribute("target", "_blank");
	             	link.setAttribute("download", assetSts.todayFunc());
	             	link.style.visibility = 'hidden';
	             	document.body.appendChild(link);
	             	link.click();
	             	document.body.removeChild(link);
	        	 }
	        	 w2ui["assetStatus_table"].selectNone();
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
		
		getLocationList : function(){
			var locationList = new Model();
			locationList.url = 'assetStatus/getLocationList';
			that.listenTo(locationList, 'sync', that.setLocationList);
			locationList.fetch();
		},
		
		setLocationList : function(method, model, options){
			try{
				that.locationList = [];
				that.locationList.push({
					id:0, 
					text:'All',
					loc_name:'All',
					loc_id:''
				});
				
				for(var i=0; i < model.length; i++){
					var item = model[i];
					item.text = item.loc_name;
					that.locationList.push(item);
				}
				w2ui.assetStatus_options.set('location', {options:{items:that.locationList}});
				
				that.flugB = true;
				that.searchAction();
			}catch(e){
				console.log(e);
			}
		},
		
		getProductList : function(){
			var productList = new Model();
			productList.url = 'assetStatus/getProductList';
			that.listenTo(productList, 'sync', that.setProductList);
			productList.fetch();
		},

		setProductList : function(method, model, options){
			try{
				that.productList = [];
				that.productList.push('All');
				model.forEach(function(item,idx){
					var newItem = $.extend({}, item);
					that.productList.push(newItem.name);
				});
				w2ui.assetStatus_options.set('productName', {options:{items:that.productList}});
				
				that.flugC = true;
				that.searchAction();
				
			}catch(e){
				console.log(e);
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
        
		destroy : function(){
			/*if(w2ui['assetStatus_chart']){
				w2ui['assetStatus_chart'].destroy();
			}*/
			if(w2ui['assetStatus_rows']){
				w2ui['assetStatus_rows'].destroy();
			}
			if(w2ui['assetStatus_options']){
				w2ui['assetStatus_options'].destroy();
			}
			if(w2ui['assetStatus_table']){
				w2ui['assetStatus_table'].destroy();
			}
			if(w2ui['assetStatus_layout']){
				w2ui['assetStatus_layout'].destroy();
			}
			
			//this.removeEventListener();
			
			assetSts = null;
		}
	})
	return Main;
});