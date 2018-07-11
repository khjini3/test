define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/assetMapping",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/asset/assetMapping"
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
		url:'assetMapping',
		parse: function(result) {
            return {data: result};
        }
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		that = this;
    		this.elements = {
    			orgLeftMap : {},
    			orgRightMap : {},
    			leftMap:{},
    			rightMap:{},
    			locationRoom : [], //Room정보만 따로 담아놓음.
    			mode : 'asset',	
    			leftFlug : false, 
    			rightFlug : false,
    			codeList : {}
    		};
    		this.$el.append(JSP);
    		this.init();
    		this.start();
    		this.selectItem = null;
        },
        
        init : function(){
        	
        	this.eventListenerRegister();
        	
        	$("#contentsDiv").w2layout({
        		name:'assetMapLayout',
        		panels:[
        			{type:'left', size:450, resizable: false, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
        		]
        	});
        	
        	var leftContent = '<div id="leftTop" style="height:35px">'+
        	'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Location List</div>'+
	    		'<div class="dashboard-contents"><div id="leftBottom"></div></div>'+
	    	'</div>';
        	
        	$("#leftContents").html(leftContent);
        	
        	this.createLocationTree();
        	
        	var mainSub = '<div id="mainLeftContents">'+
						    		'<div id="mainLeftTop">'+
						    			'<div id="mainLeftTopToolbar" style="float: right;width: 220px;"></div>'+
						    		'</div>'+
						    		'<div id="mainLeft"></div>'+
							'</div>'+
								
							'<div id="mainMiddleContents">'+
								'<div id="mainMiddleTop"></div>'+
								'<div id="mainMiddle"></div>'+
							'</div>'+
								
							'<div id="mainRightContents">'+
								
								'<div id="mainRightTop">'+
						    		'<div id="assetMapBtnGroup">'+
							    		'<i id="assetMapSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save" style="display:none;"></i>'+
							        	'<i id="assetMapCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel" style="display:none;"></i>'+
						        		'<i id="assetMapEditBtn" style="visibility:hidden;" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Edit"></i>'+
						    		'</div>'+
								'</div>'+
								
								'<div id="mainRight"></div>'+
							'</div>';
        	
        	$("#mainContents").html(mainSub);
        	
        	var mainLeft = '<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title">Assigned Asset List</div>'+
						    		'<div class="dashboard-contents"><div id="mainLeftBottom"></div></div>'+
						    	'</div>';
        	
        	 var mainMiddle = '<div style="display: table-cell;vertical-align: middle;">'+
							 		    '<button class="darkButton" style="margin-bottom: 20px;" id="assetMapLeftBtn"> < </button>'+
							 		    '<button class="darkButton" id="assetMapRightBtn"> > </button>'+
								    '</div>';
        	 
        	 var mainRight = '<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title">Available Asset List</div>'+
						    		'<div class="dashboard-contents"><div id="mainRightBottom"></div></div>'+
						    	'</div>';
        	 
        	
        	$("#mainLeft").html(mainLeft);
        	$("#mainMiddle").html(mainMiddle);
        	$("#mainRight").html(mainRight);
        	
    		$('#mainMiddle div:first-child').css('width', '100%');
    		$('#mainMiddle div:first-child').css('height', '100%');
        	//this.createRightContents("ROOM"); //초기 ROOM 모드
        	
        },
        
        /*이벤트 등록*/
        eventListenerRegister : function(){
        	
        	//자산 ComboBox
        	$(document).on('change', '#assetMapCodeType', function(e){
        		
        		var selectItem = e.currentTarget.value;
        		
        		that.refreshAssetTable(selectItem);
        		
        	});
        	
        	//편집
        	$(document).on('click', '#assetMapEditBtn', function(e){
        		
        		that.leftRightBtnStatus(true);
        		
        		that.editorModeStatus(true);
        		
        		w2ui['assetLeftTable'].unlock();
        		
        		that.locationEnableFunc(false);
        		
        		var selectItem = that.selectItem;
        		
        		if(selectItem.codeName === "ROOM"){
        			w2ui["assetMapToolbar"].disable('item2');
        		}
        		
        	});
        	
        	
        	$(document).on('click', '#assetMapCancerBtn', function(e){
        		//취소 결정
        		that.leftRightBtnStatus(false);
        		that.editorModeStatus(false);
        		
        		var orgLeftMap = that.elements.orgLeftMap;
    			var orgRightMap = that.elements.orgRightMap;
    			
    			//데이터 초기화
    			that.elements.leftMap = {};
    			that.elements.rightMap = {};
    			
    			var leftDataProvider = [];
    			var rightDataProvider = [];
    			
    			for(var name in orgLeftMap){
    				that.elements.leftMap[name] = _.clone(orgLeftMap[name]);
    				leftDataProvider.push(_.clone(that.elements.leftMap[name]));
    			}
    			
    			for(var name in orgRightMap){
    				that.elements.rightMap[name] = _.clone(orgRightMap[name]);
    				rightDataProvider.push(_.clone(that.elements.rightMap[name]));
    			}
    			
    			if(that.selectItem.codeName === "ROOM"){
    				
    				var selectCode = $('#assetMapCodeType').data('selected').text;
        			
        			if(selectCode === "All"){
        				
        				var intersectionData = that.outStatusFunc(rightDataProvider);
        				
    					var result = _.filter(rightDataProvider, function(obj){
    						for(var i in intersectionData){
    							if(obj.codeName == intersectionData[i]){
    								return obj;
    							}
    						}
    					});
        				
        				w2ui['assetRightTable'].records = result;
        				
            			/*w2ui['assetRightTable'].records = _.filter(rightDataProvider, function(obj){
            				return obj.codeName !== "SERVER";
            			});*/
            			
            		}else{
            			var dc = _.filter(rightDataProvider, function(obj){
            				return obj.codeName === selectCode;
            			});
            			
            			w2ui['assetRightTable'].records = that.setRecidNumAlign(dc);
            		}
        			
        			w2ui["assetMapToolbar"].enable('item2'); //툴바 활성화
        			
    			}else{
        			w2ui['assetRightTable'].records = that.setRecidNumAlign(_.sortBy(rightDataProvider, 'assetName'));
    			}
    			
    			w2ui["assetRightTable"].refresh();
    			w2ui["assetRightTable"].selectNone();
    			
    			w2ui["assetLeftTable"].records = that.setRecidNumAlign(_.sortBy(leftDataProvider, "assetName"));
    			
    			if(w2ui["assetLeftTable"].records.length ===0){
    				
    				w2ui["assetLeftTable"].lock();
    			}else{
    				w2ui["assetLeftTable"].unlock();
    			}
    			
    			w2ui["assetLeftTable"].refresh();
    			w2ui["assetLeftTable"].selectNone();
    			
    			//LocationTree enable
        		that.locationEnableFunc(true);
        		
        	});
        	
        	//취소
        	$(document).on('click', '#assetMapCancelBtn', function(e){
        		
        		var bodyContents = BundleResource.getString('label.assetMapping.notChanedWhenCanceled'); //"취소 시 내용이 변경 되지 않습니다.";
        		
	        	var	body = '<div class="w2ui-centered">'+
	        	'<div class="popup-contents">'+ bodyContents +'</div>'+
					'<div class="btnGroup">'+
						'<button id="assetMapCancerBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.assetMapping.confirm')+'</button>'+
						'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.assetMapping.cancel')+'</button>'+
					'</div>'+
				'</div>';
        		
	        	w2popup.open({
	        		width: 385,
	 		        height: 180,
			        title : BundleResource.getString('title.assetMapping.info'),
			        body: body,
	                opacity   : '0.5',
	         		modal     : true,
	    		    showClose : true
			    });
        		
        	});
        	
        	//저장
        	$(document).on('click', '#assetMapSaveBtn', function(e){
        		
        		var leftMap = that.elements.leftMap;
        		var rightMap = that.elements.rightMap;
        		
        		var changeFlug = false; //변경여부 체크
        		
        		var item = null;
        		
        		for(var name in leftMap){
        			item = leftMap[name];
        			if(item.temp === "right"){
        				changeFlug = true;
        				break;
        			}
        		}
        		
        		for(var name in rightMap){
        			item = rightMap[name];
        			if(item.temp === "left"){
        				changeFlug = true;
        				break;
        			}
        		}
        		
        		if(changeFlug){
        			that.saveFunc();
        		}else{
        			w2alert(BundleResource.getString('label.assetMapping.noChangeedContents'), BundleResource.getString('title.assetMapping.info'));
        		}
        		
        		
        	});
        	
        	//자산 Room에 할당
        	$(document).on('click', '#assetMapLeftBtn', function(e){
        		
        		var selectArr = w2ui["assetRightTable"].getSelection();
        		
        		if(selectArr.length === 0){
        			//선택한 항목이 없다면
        			var bodyContents = BundleResource.getString('label.assetMapping.noSelectedItem'); // "선택된 항목이 없습니다.";
            		
            		var body = '<div class="w2ui-centered">'+
    				'<div class="popup-contents">'+ bodyContents +'</div>'+
    					'<div class="popup-btnGroup">'+
    						'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.assetMapping.confirm')+'</button>'+
    					'</div>'+
    				'</div>';
            		
        			w2popup.open({
            			width: 385,
          		        height: 180,
        		        title : BundleResource.getString('title.assetMapping.info'),
        		        body: body,
    	                opacity   : '0.5',
    	         		modal     : true,
    	    		    showClose : true
        		    });
        			
        		}else{
        			//선택한 항목이 있다면
        			var leftMap = that.elements.leftMap;
        			var rightMap = that.elements.rightMap;
        			
        			for(var i =0; i < selectArr.length; i++){
        				var item = w2ui["assetRightTable"].get(selectArr[i]);
        				item.locName = that.selectItem.locName;
        				leftMap[item.assetId] = item;
        				delete rightMap[item.assetId];
        			}
        			
        			var leftDataProvider = [];
        			var rightDataProvider = [];
        			
        			for(var name in leftMap){
        				leftDataProvider.push(leftMap[name]);
        			}
        			
        			for(var name in rightMap){
        				rightDataProvider.push(rightMap[name]);
        			}
        			
        			if(that.selectItem.codeName === "ROOM"){
        				that.refreshAssetTable($('#assetMapCodeType').data('selected').text);
        			}else{
        				var rightImAC = _.sortBy(rightDataProvider, "assetName");
            			
            			for(var m=0; m < rightImAC.length; m++){
            				var item = rightImAC[m];
            				item.recid = m+1;
            			}
            			
            			w2ui["assetRightTable"].records = rightImAC;
            			w2ui["assetRightTable"].refresh();
            			w2ui["assetRightTable"].selectNone();
        			}
        			
        			var leftImAC = _.sortBy(leftDataProvider, "assetName");
        			
        			for(var m=0; m < leftImAC.length; m++){
        				var item = leftImAC[m];
        				item.recid = m+1;
        			}
        			
        			w2ui["assetLeftTable"].records = leftImAC;
        			w2ui["assetLeftTable"].refresh();
        			w2ui["assetLeftTable"].selectNone();
        			
        		}
        		
        	});
        	
        	//자산 비할당
        	$(document).on('click', '#assetMapRightBtn', function(e){
        		
        		var selectArr = w2ui["assetLeftTable"].getSelection();
        		
        		
        		if(selectArr.length === 0){
        			//선택한 항목이 없다면
        			var bodyContents = BundleResource.getString('label.assetMapping.noSelectedItem'); //"선택된 항목이 없습니다.";
        			
        			var body = '<div class="w2ui-centered">'+
        			'<div class="popup-contents">'+ bodyContents +'</div>'+
        			'<div class="popup-btnGroup">'+
        			'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.assetMapping.confirm')+'</button>'+
        			'</div>'+
        			'</div>' ;
        			
        			w2popup.open({
        				width: 385,
        				height: 180,
        				title : BundleResource.getString('title.assetMapping.info'),
        				body: body,
        				opacity   : '0.5',
        				modal     : true,
        				showClose : true
        			});
        		}else{
        			//선택한 항목이 있다면
        			var leftMap = that.elements.leftMap;
        			var rightMap = that.elements.rightMap;
        			
        			for(var i =0; i < selectArr.length; i++){
        				var item = w2ui["assetLeftTable"].get(selectArr[i]);
        				item.locName = that.selectItem.locName;
        				rightMap[item.assetId] = item;
        				delete leftMap[item.assetId];
        			}
        			
        			var leftDataProvider = [];
        			var rightDataProvider = [];
        			
        			for(var name in leftMap){
        				leftDataProvider.push(leftMap[name]);
        			}
        			
        			for(var name in rightMap){
        				rightDataProvider.push(rightMap[name]);
        			}
        			
        			if(that.selectItem.codeName ==="ROOM"){
        				that.refreshAssetTable($('#assetMapCodeType').data('selected').text);
        			}else{
        				
        				var rightImAC = _.sortBy(rightDataProvider, "assetName");
        				
        				for(var m=0; m < rightImAC.length; m++){
            				var item = rightImAC[m];
            				item.recid = m+1;
            			}
            			
            			w2ui["assetRightTable"].records = rightImAC;
            			w2ui["assetRightTable"].refresh();
            			w2ui["assetRightTable"].selectNone();
        				
        			}
        			
        			
        			var leftImAC = _.sortBy(leftDataProvider, "assetName");
        			
        			for(var m=0; m < leftImAC.length; m++){
        				var item = leftImAC[m];
        				item.recid = m+1;
        			}
        			
        			w2ui["assetLeftTable"].records = leftImAC;
        			w2ui["assetLeftTable"].refresh();
        			w2ui["assetLeftTable"].selectNone();
        		}
        		
        	});
        	
        	
        },
        
        /*이벤트 해제*/
        removeEventListener : function(){
        	$(document).off('change', '#assetMapCodeType');
        	$(document).off('click', '#assetMapEditBtn');
        	$(document).off('click', '#assetMapCancerBtn');
        	$(document).off('click', '#assetMapSaveBtn');
        	$(document).off('click', '#assetMapLeftBtn');
        	$(document).off('click', '#assetMapRightBtn');
        },
        
      //우측 자산리스트
        refreshAssetTable : function(item){
        	w2ui['assetRightTable'].selectNone();
    		
    		var dataProvdier = [];
    		var rightMap = that.elements.rightMap;
    		for(var name in rightMap){
    			dataProvdier.push(rightMap[name]);
    		}
    		
    		var rightImAC = null;
    			
    		if(item === "All"){
    			var intersectionData = that.outStatusFunc(dataProvdier);
				
				var result = _.filter(dataProvdier, function(obj){
					for(var i in intersectionData){
						if(obj.codeName == intersectionData[i]){
							return obj;
						}
					}
				});
				
				rightImAC = _.sortBy(result, 'assetName');
				
    			/*rightImAC = _.sortBy(_.filter(dataProvdier, function(obj){
    				return obj.codeName !== "SERVER";
    			}), 'assetName');*/
    		}else{
    			rightImAC = _.sortBy(_.filter(dataProvdier, function(obj){
    				return obj.codeName === item;
    			}), 'assetName');
    		}
    		
    		for(var m=0; m < rightImAC.length; m++){
    			var item = rightImAC[m];
    			item.recid = m+1;
    		}
    		
    		w2ui['assetRightTable'].records = rightImAC;
    		w2ui['assetRightTable'].refresh();
        },
        
        //In Out Status 중 Out Status만 가져옴 (즉, 실장 장비 제외)
        outStatusFunc : function(data){
        	  var outStatus = _.filter(that.elements.codeList, function(obj){
        		  return obj.inOutStatus !== "1"; // 실장 장비 제외
        	  });

        	  var outData = _(outStatus).pluck('name'); // 실장 장비 제외한 Array의 name 추출
        	  var compareData = _.uniq(_(data).pluck('codeName')); // data Array의 codeName 추출 (중복제거)

        	  var result = _.intersection(outData, compareData); // outData, compareData 두 배열의 교집합

        	  return result;
    	},
        
        //Edit Mode Enable/Disable
        editorModeStatus : function(value){
        	if(value === true){
        		//Ediotor Mode
        		$("#assetMapEditBtn").css("display", "none");
        		
        		$("#assetMapSaveBtn").css("display", "");
        		$("#assetMapCancelBtn").css("display", "");
        	}else{
        		//Read Mode
        		$("#assetMapEditBtn").css("visibility", "visible");
        		$("#assetMapEditBtn").css("display", "");
        		
        		$("#assetMapSaveBtn").css("display", "none");
        		$("#assetMapCancelBtn").css("display", "none");
        	}
        	
        },
        
        locationEnableFunc : function(value){
        	
        	var selectItem = that.selectItem;
    		var roomAC = that.elements.locationRoom;
    		
        	if(value === true){
        		
        		for(var i=0; i < roomAC.length; i++){
        			var item = roomAC[i];
        			if(item.id !== selectItem.id){
        				w2ui["locationTree"].enable(item.id);
        			}
        		}
        	}else{
        		
        		for(var i=0; i < roomAC.length; i++){
        			var item = roomAC[i];
        			if(item.id !== selectItem.id){
        				w2ui["locationTree"].disable(item.id);
        			}
        		}
        	}
        	
        },
        
        //Room 자산 | Rack 자산 보는 toolbar
        toolbarEnableFunc : function(value){
        	if(value === true){
        		w2ui["assetMapToolbar"].enable('item1');
        		w2ui["assetMapToolbar"].enable('item2');
        	}else{
        		w2ui["assetMapToolbar"].disable('item1');
        		w2ui["assetMapToolbar"].disable('item2');
        	}
        },
        
        //Location Tree
        createLocationTree : function(){
        	$("#leftBottom").w2sidebar({
        		name : 'locationTree',
        		nodes: [
                    { id: 'Location', text: 'LOCATION', expanded: true, group: true}
                ],
                
                onClick: function(event) {
                	
                	if(event.target === that.selectItem.id){
                		return ;
                	}
                	
                	$("#assetMapEditBtn").css("visibility", "hidden");
                	
                	var selectItem = this.get(event.target);
                	that.selectItem = selectItem;
                	if(selectItem.codeName === "ROOM"){
                		$("#assetMapLeftTitle").html("● ASSIGNED ASSET LIST");
                		that.createRoom();
                	}else if(selectItem.codeName === "RACK"){
                		var titleInfo = "● "+selectItem.locName+" [ "+selectItem.unitSize+" ] SERVER LIST";
                		$("#assetMapLeftTitle").html(titleInfo);
                		that.createRackIn();
                	}
                	
                },
                
                onDblClick: function(event) {
                	//console.log("onDblClick : " + event);
                },
                
        	});
        	
//        	w2ui["locationTree"].lock("Loading...", true);
        },
        
        //Toolbar를 눌렀을 때
        changeMode : function(value){
        	
        	var columns = [];
    		
        	if(value ==="server"){
        		columns = [  
                    { field: 'assetId', caption: 'ID', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                    { field: 'assetName', caption: 'NAME', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'unitSize', caption: 'U-SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' },
                    { field: 'unitIndex', caption: 'U-INDEX', size: '60px', sortable: true, attr: 'align=right', style:'padding-right:5px;' },
                    { field: 'startPosition', caption: 'SP', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ]
        		
        		//Select Column 체크박스 숨기기
        		w2ui["assetLeftTable"].show.selectColumn =false;
        		w2ui["assetRightTable"].show.selectColumn =false;
        		
        		w2ui["assetLeftTable"].multiSelect = false;
        		w2ui["assetRightTable"].multiSelect = false;
        		//해당 데이터가 로딩되기 전에 클릭하는걸 방지
        		this.toolbarEnableFunc(false); 
        		
        		//w2ui["assetLeftTable"].lock("Loading...", true);
        		w2ui["assetRightTable"].lock("Loading...", true);
        		
        		w2ui["assetLeftTable"].records = [];
        		w2ui["assetLeftTable"].columns = columns;
            	w2ui["assetLeftTable"].selectNone();
            	w2ui["assetLeftTable"].refresh();
            	
            	w2ui["assetRightTable"].records = [];
            	w2ui["assetRightTable"].columns = columns;
            	w2ui["assetRightTable"].refresh();
            	w2ui["assetRightTable"].selectNone();
            	
        		this.getRackInList(); 
        		this.getAvailabilityList();
        		
        	}else{
        		
        		columns = [  
                    { field: 'assetId', caption: 'ID', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                    { field: 'assetName', caption: 'NAME', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'unitSize', caption: 'U-SIZE', size: '70px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ]
        		
        		w2ui["assetLeftTable"].multiSelect = true;
        		w2ui["assetRightTable"].multiSelect = true;
        		
        		w2ui["assetLeftTable"].show.selectColumn =true;
        		w2ui["assetRightTable"].show.selectColumn =true;
        		
        		w2ui["assetLeftTable"].records = [];
        		w2ui["assetLeftTable"].columns = columns;
            	w2ui["assetLeftTable"].selectNone();
            	w2ui["assetLeftTable"].refresh();
            	
            	w2ui["assetRightTable"].records = [];
            	w2ui["assetRightTable"].columns = columns;
            	w2ui["assetRightTable"].refresh();
            	w2ui["assetRightTable"].selectNone();
            	
        		//최신데이터로 갱신하기 위해 Room 정보를 새롭게 불러옴. 한번 로딩된 데이터가지고 할경우 아래 부분 주석처리. 
        		this.createRoom();
        	}
        	
        },
        
        //비등록 서버 리스트
        getAvailabilityList : function(){
        	var model = new Model();
    		model.url += "/getAvailabilityList";
    		model.fetch();
    		this.listenTo(model, "sync", this.setAvailabilityList);
        },
        
        setAvailabilityList : function(method, model, options) { 
        	if(model.length > 0){
        		w2ui['assetRightTable'].records = model;
        		w2ui['assetRightTable'].refresh();
    			w2ui["assetRightTable"].unlock();
        	}else{
        		w2ui["assetRightTable"].lock();
        	}
        },
        
        //해당 Room의 Rack별 실장장비 리스트 가져오기
        getRackInList : function(){
        	var model = new Model();
    		model.url += "/getRackInList/"+this.selectItem.locId;
    		model.fetch();
    		this.listenTo(model, "sync", this.setRackIndata);
        },
        
        setRackIndata : function(method, model, options) { 
        	if(model.length > 0){
        		w2ui["assetLeftTable"].records = _.sortBy(model, 'assetName') ;
            	
            	for(var i=0; i < model.length; i++){
            		var item = model[i];
            		
            		if(item.w2ui){
            			w2ui["assetLeftTable"].expand(item.recid);
            			
            		}
            	}
            	
            	
            	w2ui["assetLeftTable"].refresh();
            	w2ui["assetLeftTable"].selectNone();
            	w2ui["assetLeftTable"].unlock();
        	}else{
        		w2ui["assetLeftTable"].lock();
        	}
        	
        	this.toolbarEnableFunc(true);
        	
        },
        
        createRightContents : function(type){
        	//ToolBar
        	if(type === "ROOM"){
        		 $('#mainLeftTopToolbar').w2toolbar({
         	        name: 'assetMapToolbar',
         	        tooltip: 'top',
         	        items: [
         	            { type: 'radio',  id: 'item1',  group: '1', text: 'ASSET LIST', icon: 'fal fa-cubes', checked: true, disabled:true
         	            	/*, tooltip: '룸에 해당 하는 자산 편집' */},
         	            { type: 'break',  id: 'break0' },
         	            { type: 'radio',  id: 'item2',  group: '1', text: 'SERVER LIST', icon: 'fal fa-building', disabled:true
         	                /*, tooltip: function (item) {
         	                    return 'Can also be result of a function: ' + item.text;
         	                }*/
         	            },
         	        ],
         	        //style:'width: calc(100%- 180px);',
         	        onClick: function (event) {
         	        	if(event.target === "item1"){
         	        		that.elements.mode = "asset";
         	        		$("#assetMapEditBtn").css("visibility", "visible");
         	        		$('#assetMapCodeType').css("visibility", "visible");
         	        	}else{
         	        		that.elements.mode = "server";
         	        		$("#assetMapEditBtn").css("visibility", "hidden");
         	        		$('#assetMapCodeType').css("visibility", "hidden");
         	        	}
         	            
         	            that.changeMode(that.elements.mode);
         	        }
        		 });
        	}
        	
        	
        	$("#mainLeftBottom").w2grid({
        		name:'assetLeftTable',
                show: { 
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
                blankSymbol : "-",
        		style:'padding:5px;margin:0px 5px 0px 0px;width:100%;height:calc(100vh - 176px);',
                
        		searches: [
                	{ field: 'assetId', caption: 'ID ', type: 'text' },
                	{ field: 'assetName', caption: 'NAME ', type: 'text' }
                ],
                
                columns: [  
                    { field: 'assetId', caption: 'ID', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                    { field: 'assetName', caption: 'NAME', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'unitSize', caption: 'U-SIZE', size: '70px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ]
                
            });
        	
        	w2ui['assetLeftTable'].lock("Loading...", true);
        	
        	$("#mainRightBottom").w2grid({
        		name:'assetRightTable',
        		show: {
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
        		blankSymbol : "-",
        		multiSelect : true,
        		style:'padding:5px;margin:0px 0px 0px 5px;width:100%;height:calc(100vh - 176px);',
        		
        		searches: [
        			{ field: 'assetId', caption: 'ID ', type: 'text' },
        			{ field: 'assetName', caption: 'NAME ', type: 'text' }
        			],
        			
    			columns: [  
        				{ field: 'assetId', caption: 'ID', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
        				{ field: 'assetName', caption: 'NAME', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
        				{ field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
        				{ field: 'unitSize', caption: 'U-SIZE', size: '70px', sortable: true, attr: 'align=center'/*, style:'padding-right:5px;'*/ }
    				],
    				
    			onClick : function(event){
    				console.log(event);
    			},
    			
    			onSelect: function(event) {
    		        console.log(this.getSelection());
    		    }    
        		
        	});
        	
        	w2ui['assetRightTable'].lock("Loading...", true);
        	
        },
        
        start: function() {
        	this.createRoom("start");
        },
        
        //w2ui Component 초기화
        removeW2uiComponent : function(type){
        	
        	if(w2ui["assetMapToolbar"]){
        		w2ui["assetMapToolbar"].destroy();
        	}
        	
        	if(w2ui["assetLeftTable"]){
        		w2ui["assetLeftTable"].destroy();
        	}
        	
        	if(w2ui["assetRightTable"]){
        		w2ui["assetRightTable"].destroy();
        	}
        	
        	if(!type){
        		if(w2ui["locationTree"]){
            		w2ui["locationTree"].destroy();
            	}
        	}
        	
        	
        },
        
        //변수 초기화
        resetValue : function(type){
        	this.elements.leftMap = {};
    		this.elements.orgLeftMap = {};
    		this.elements.rightMap = {};
    		this.elements.orgRightMap = {};
    		
    		if(!type){
    			this.elements.locationRoom = [];
    		}
    		
    		this.elements.mode = "asset";
        },
        
        createRoom : function(type){
        	
        	this.resetValue();
        	
        	if(type === "start"){
        		this.removeW2uiComponent();
        		this.createLocationTree();
        		this.getLocationList(); //Location 정보
        	}else{
        		this.removeW2uiComponent("tree");
        		this.getRoomAssetList();
        	}
        	
        	this.createRightContents("ROOM");
        	this.changeColumn("ROOM");
        	this.leftRightBtnStatus(false);//자산 이동 버튼 비 활성화
        	this.getAssetList(); //비할당된 자산
        	this.getCodeList(); //콤보박스 리스트
        },
        
        createRackIn : function(){
        	this.removeW2uiComponent("tree");
        	this.resetValue("RACK");
        	
        	this.createRightContents("RACK");
        	this.changeColumn("RACK");
        	this.leftRightBtnStatus(false); //자산 이동 버튼 비 활성화
        	
        	/*
        	 * this.createLocationTree();
        	 * this.getLocationList();*/ //룸을 눌렀을때는 트리 새로 그리지 않도록 변경함.
        	
        	this.getRackServerList(); //새로고침할거면 제거
        	this.getServerList(); //우측 서버 리스트
        },
        
        changeColumn : function(type){
        	var columns = [];
        	
        	if(type ==="ROOM"){
        		
        		columns = [  
                    { field: 'assetId', caption: 'ID', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                    { field: 'assetName', caption: 'NAME', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'unitSize', caption: 'U-SIZE', size: '70px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ]
        		
        	}else{
        		
        		columns = [  
                    { field: 'assetId', caption: 'ID', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
                    { field: 'assetName', caption: 'NAME', size: '200px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'codeName', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;' },
                    { field: 'unitSize', caption: 'U-SIZE', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' },
                    { field: 'unitIndex', caption: 'U-INDEX', size: '60px', sortable: true, attr: 'align=right', style:'padding-right:5px;' },
                    { field: 'startPosition', caption: 'SP', size: '50px', sortable: true, attr: 'align=right', style:'padding-right:5px;' }
                ]
        		
        	}
        	
        	w2ui["assetLeftTable"].show.selectColumn =true;
    		w2ui["assetRightTable"].show.selectColumn =true;
    		
    		w2ui["assetLeftTable"].columns = columns;
        	w2ui["assetLeftTable"].selectNone();
        	w2ui["assetLeftTable"].refresh();
        	
        	w2ui["assetRightTable"].columns = columns;
        	w2ui["assetRightTable"].refresh();
        	w2ui["assetRightTable"].selectNone();
        },
        
        //좌측 해당 RACK 실장 장비 서버 리스트
        getRackServerList : function(){
        	var selectItem = that.selectItem;
        	var model = new Model();
        	model.url += "/getRackServerList/"+selectItem.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.getRackServerData);
        },
        
        getRackServerData : function(method, model, options) { 
        	
        	if(model.length > 0){
        		that.elements.leftMap = {};
        		var leftMap = that.elements.leftMap;
        		var orgLeftMap = that.elements.orgLeftMap;
        		
        		for(var i=0; i < model.length; i++){
        			var item = _.clone(model[i]);
        			leftMap[item.assetId] = item;
        			orgLeftMap[item.assetId] = item;
        		}
        		
				w2ui['assetLeftTable'].records = model;
				
				w2ui['assetLeftTable'].refresh();
				w2ui['assetLeftTable'].unlock();
					
        	}else{
        		w2ui['assetLeftTable'].lock();
        	}
        	
        	that.elements.leftFlug = true;
        	
        	that.loadingCheck();
        },
        
        //우측 서버 리스트
        getServerList : function(){
        	var model = new Model();
        	model.url += "/getServerList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setServerData);
        },
        
        setServerData : function(method, model, options) { 
        	
        	if(model.length > 0){
        		w2ui['assetRightTable'].records = model;
        		w2ui['assetRightTable'].refresh();
    			w2ui["assetRightTable"].unlock();
    			
    			that.elements.rightMap = [];
        		var rightMap = that.elements.rightMap;
        		
        		for(var i=0; i<model.length; i++){
        			var item = _.clone(model[i]);
        			rightMap[item.assetId] = item;
        			that.elements.orgRightMap[item.assetId] = _.clone(item);
        		}
    			
        	}else{
        		
        		w2ui["assetRightTable"].lock();
        		
        	}
			 
        	that.elements.rightFlug = true;
        	
        	that.loadingCheck();
        	
        },
        
        //자산 할당 비할당 버튼 보여주기 관리
        leftRightBtnStatus : function(value){
        	if(value === false){
        		$("#assetMapLeftBtn, #assetMapRightBtn").attr('disabled', true);
        		$("#assetMapLeftBtn, #assetMapRightBtn").css('opacity', 0.4);
        		
        		document.getElementById("assetMapLeftBtn").className = "darkButtonDisable";
        		document.getElementById("assetMapRightBtn").className = "darkButtonDisable";
        	}else{
        		$("#assetMapLeftBtn, #assetMapRightBtn").attr('disabled', false);
        		$("#assetMapLeftBtn, #assetMapRightBtn").css('opacity', 1);
        		
        		document.getElementById("assetMapLeftBtn").className = "darkButton";
        		document.getElementById("assetMapRightBtn").className = "darkButton";
        	}
        },
        
        //자산 콤보 박스 리스트
        getCodeList : function(){
        	var model = new Model();
        	model.url += "/codeList";
        	model.fetch();
        	this.listenTo(model, "sync", this.setCodeData);
        },
        
        setCodeData : function(method, model, options) { 
        	var assetType = '<div id="assetMapBtnGrp" style="height:50px;position:absolute;right:0px;top:4px;">'+
        	'<div class="w2ui-field w2ui-span3">'+
    		'<div> <input type="list" id="assetMapCodeType" text="All" style="width:128px;"></div>'+
    		'</div>'+
        	'</div>';
        	
        	$("#tb_assetRightTable_toolbar_right").append(assetType);
        	
        	var items = ["All"];
        	
        	if(model.length > 0){
        		for(var i =0; i < model.length; i++){
        			if(model[i].inOutStatus !== "1"){ // model[i].name != "SERVER"
        				items.push(model[i].name);
        			}
        		}
        	}
        	
        	$('#assetMapCodeType').w2field('list', { 
    			items: items,
    			selected : ['All']
    		});
        	
        	$('#assetMapCodeType').data('selected', {text:'All'}).data('w2field').refresh();
        	
        	that.elements.codeList = model;
        },
        
        //Location 정보
        getLocationList : function(){
        	var model = new Model();
        	model.fetch();
        	this.listenTo(model, "sync", this.initSetData);
        },
        
        //선택된 해당 Room 자산 정보
        getRoomAssetList : function(){
        	var item = this.selectItem;
        	var model = new Model();
        	model.url = model.url+"/getRoomAssetList/"+item.id;
        	model.fetch();
        	this.listenTo(model, "sync", this.setRoomAssetData);
        },
        
        setRoomAssetData : function(method, model, options) { 
        	if(model.length > 0){
        		that.elements.leftMap = {};
				var leftMap = that.elements.leftMap;
        		var orgLeftMap = that.elements.orgLeftMap;
        		
        		for(var i=0; i < model.length; i++){
        			var item = model[i];
        			leftMap[item.assetId] = item;
        			orgLeftMap[item.assetId] = item;
        		}
        		
        		var intersectionData = that.outStatusFunc(model);
				
				var result = _.filter(model, function(obj){
					for(var i in intersectionData){
						if(obj.codeName == intersectionData[i]){
							return obj;
						}
					}
				});
				
				w2ui['assetLeftTable'].records = result;
        		
				/*w2ui['assetLeftTable'].records = _.filter(model, function(obj){
    				return obj.codeName !== "SERVER";
    			});*/
				
				w2ui['assetLeftTable'].refresh();
				w2ui['assetLeftTable'].unlock();
				
			}else{
				w2ui['assetLeftTable'].lock();
			}
			
			that.elements.leftFlug = true;
			
			that.loadingCheck(); //toolbar 활성화
			
        },
        
        loadingCheck : function(){
        	
        	if(this.elements.leftFlug && this.elements.rightFlug){
        		
        		this.elements.leftFlug = false;
        		this.elements.rightFlug = false;
        		
        		that.editorModeStatus(false);
        		
        		if(this.selectItem.codeName === "ROOM"){
        			this.toolbarEnableFunc(true);
        		}
        		
        	}
        },
        
        //비할당된 자산 정보
        getAssetList : function(){
        	var model = new Model();
        	model.url = model.url+"/"+"assetList";
        	model.fetch();
        	this.listenTo(model, "sync", this.assetData);
        },
        
        setRecidNumAlign : function(dataProvider){
        	for(var i=0; i < dataProvider.length; i++){
        		var item = dataProvider[i];
        		item.recid = i+1;
        	}
        	
        	return dataProvider;
        },
        
        assetData: function(method, model, options) { 
			if(model.length > 0){
			    
				that.elements.rightMap = {};
        		var rightMap = that.elements.rightMap;
        		
        		for(var i=0; i<model.length; i++){
        			var item = _.clone(model[i]);
        			rightMap[item.assetId] = item;
        			that.elements.orgRightMap[item.assetId] = _.clone(item);
        		}
        		
        		var intersectionData = that.outStatusFunc(model);
				
				var result = _.filter(model, function(obj){
					for(var i in intersectionData){
						if(obj.codeName == intersectionData[i]){
							return obj;
						}
					}
				});
        		
        		/*var dataProvdier = _.filter(model, function(obj){
    				return obj.codeName !== "SERVER";
    			});*/
        		
        		w2ui['assetRightTable'].records = that.setRecidNumAlign(result); //dataProvdier
        		
    			w2ui['assetRightTable'].refresh();
    			w2ui["assetRightTable"].unlock();
        	}else{
        		w2ui["assetRightTable"].lock();
        	}
			        	
        	that.elements.rightFlug = true;
			
			that.loadingCheck(); //toolbar 활성화
        },
        
        initSetData: function(method, model, options) { 
        	this.render(model);
		},
		
		treeDisableCheckFunc : function(nodes){
			
			for(var i=0;i < nodes.length; i++){
				var item = nodes[i];
				if(item.codeName !== "ROOM" && item.codeName !== "RACK" ){
					w2ui['locationTree'].disable(item.id);
				}else{
					if(!this.selectItem){
						//선택된 정보가 없다면
						this.selectItem = item;
					}
					
					this.elements.locationRoom.push(item);
				}
				
				if(item.nodes !== null && item.nodes.length > 0 ){
					this.treeDisableCheckFunc(item.nodes);
				}
			}
		},
		
		render : function(result){
			w2ui['locationTree'].insert("Location", null, result.nodes);
			
			this.treeDisableCheckFunc(result.nodes);
			
			if(this.selectItem){
				w2ui["locationTree"].select(this.selectItem.id);
				
				//SeletedItem을 먼저생성후 호출
				if(this.selectItem.codeName === "ROOM"){
					this.getRoomAssetList();
				}else{
					//this.getRackServerList(); //Rack을 클릭할때마다 tree 새로 고침 하려면 주석 해제
				}
				
			}
			
			w2ui["locationTree"].unlock();
		},
		
		saveFunc : function(){

    		that.leftRightBtnStatus(false);
    		
    		that.editorModeStatus(false);
    		
    		if(w2ui['assetLeftTable'].records.length > 0){
    			w2ui['assetLeftTable'].unlock();
    		}else{
    			w2ui['assetLeftTable'].lock();
    		}
    		
    		if(w2ui['assetRightTable'].records.length > 0){
    			w2ui['assetRightTable'].unlock();
    		}else{
    			w2ui['assetRightTable'].lock();
    		}
    		
    		//org파일과 동기화 작업
    		that.elements.orgLeftMap = {};
    		that.elements.orgRightMap = {};
    		
    		var leftMap = that.elements.leftMap;
    		var rightMap = that.elements.rightMap;
    		
    		var leftDataAC = [];
    		var rightDataAC = [];
    		
    		for(var name in leftMap){
    			//변경된 내용만 담는 작업
    			var item = leftMap[name];
    			if(item.temp === "right"){
    				leftDataAC.push(_.clone(item));
    			}
    			
    			//동기화 작업
    			item.temp = "left";
    			
    			if(that.selectItem.codeName ==="ROOM"){
    				item.locId = that.selectItem.locId;
    			}else{
    				item.parentId = that.selectItem.id;
    			}
    			
    			that.elements.orgLeftMap[item.assetId] = _.clone(item);
    		}
    		
    		for(var name in rightMap){
    			//변경된 내용만 담는 작업
    			var item = rightMap[name];
    			if(item.temp === "left"){
    				rightDataAC.push(_.clone(item));
    			}
    			
    			//동기화 작업
    			item.temp = "right";
    			
    			if(that.selectItem.codeName ==="ROOM"){
    				item.locId = null;
    			}else{
    				item.parentId = null;
    			}
    			
    			that.elements.orgRightMap[item.assetId] = _.clone(item);
    		}
    		
    		//LocationTree enable
    		that.locationEnableFunc(true);
    		
    		//DB 저장
    		
    		var param = {leftAC : null, rightAC:null};
    		
    		if(leftDataAC.length > 0){
    			param.leftAC = leftDataAC;
    		}
    		
    		if(rightDataAC.length > 0){
    			//locId Update
    			param.rightAC = rightDataAC;
    		}
    		
    		if(that.selectItem.codeName ==="ROOM"){
    			w2ui["assetMapToolbar"].enable('item2');
    		}
    		
    		var model = new Model(param);
    		if(that.selectItem.codeName ==="ROOM"){
    			model.url += "/updateLocationInfo/"+that.selectItem.locId;
    		}else{
    			model.url += "/updateServerInfo/"+that.selectItem.locId;
    		}
    		
    		model.save({}, {
    			success: function (model, respose, options) {
    				
    				var history = respose.history;
    				var status = 100;
    				for(var i=0; i < history.length ; i++){
    					if(history[i] !== 100){
    						status = -100;
    						break;
    					}
    				}
    				
    				if(status === 100){
    					//정상처리 메세지
        				w2alert(BundleResource.getString('label.assetMapping.successSave'), BundleResource.getString('title.assetMapping.info'));
        				//that.createRoom("start");
        				w2ui['locationTree'].destroy();
        				that.createLocationTree();
                		that.getLocationList();
    				}else{
    					w2alert(BundleResource.getString('label.assetMapping.errorContents'), BundleResource.getString('title.assetMapping.info'), function(event){
    						that.createRoom();
    					});
    				}
    				
    			},
    			
			    error: function (model, xhr, options) {
			    	w2alert(BundleResource.getString('label.assetMapping.errorContents'), BundleResource.getString('title.assetMapping.info'), function(event){
						that.createRoom();
					});
			    }
    			
    			
    			
    		});
		},
		
        destroy: function() {
        	
        	console.log('assetMapping destroy');
        	
        	this.removeEventListener();
        	this.removeW2uiComponent();
        	
        	if(w2ui['assetLeftTable']){
        		w2ui['assetLeftTable'].destroy();
        	}
        	
        	if(w2ui['assetRightTable']){
        		w2ui['assetRightTable'].destroy();
        	}
        	
        	if(w2ui['assetMapLayoutSub']){
        		w2ui['assetMapLayoutSub'].destroy();
        	}
        	
        	if(w2ui['assetMapToolbar']){
        		w2ui['assetMapToolbar'].destroy();
        	}
        	
        	if(w2ui['locationTree']){
        		w2ui['locationTree'].destroy();
        	}
        	
        	if(w2ui['assetMapLayout']){
        		w2ui['assetMapLayout'].destroy();
        	}
        	
        	this.resetValue();
        	
        	that = null;
        }
    })

    return Main;
});