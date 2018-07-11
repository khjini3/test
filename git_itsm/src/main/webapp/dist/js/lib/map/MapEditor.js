/*
 * Map Editor Start V 1.0
 * 
 * 2018-02-26 Create by jini
 * 
 * 메소드 추가시 주석 꼭 달아주세요
 * 
 * image 기본 위치 "/dist/img/mapEditor/svgImg/server_label.png"
 * 
 * .selectSymbol symbol을 선택했을때 생기는 박스
 * 
 * #selectBox 심볼을 드래그 해서 선택 하는 드래그 박스
 * */

function mapEditor(xFlug){ //이벤트 브라우저가 있다면 false
	this.mapEditor = this;
	
	if(xFlug == undefined){
		xFlug = true;
	}else{
		xFlug = false;
	}
	
	this.init(xFlug);
}

mapEditor.prototype = {
		
		url:'mapEditor',
		
		init : function(xFlug){
			
			this.follingUseAble = xFlug; //직접 호출할건지 자동 호출 할건지 결정
			this.mapTag = null; //우클릭 CustomMenu에서 사용되는 Map Tag
			/*
			 * mapEditor List Type valiable
			 * */
			this.selectListItem = null; //Asset List에서 선택한 자산
			this.selectAddItem = []; //Selected List에 add한 리스트
			this.selectedItems = [];
			/*
			 * mapEditor valiable
			 * */
			this.pollingTime = 10000; //폴링 주기
			this.useColor = "color:red";
			this.selectBoxSize = {}; //마우스 드래그 선택 영역 박스 사이즈를 담는 변수
			this.selectBoxPosition = {}; //drag & Select에 사용되는 변수
			this.maxMinPosition = {}; //선택한 여러개의 심볼들 중에의 최대 xy 최소 xy 위치값을 담는 변수
			/*
			 *선택한 여러개의 심볼들이 이동할 수 있는 범위 값을 가지고 있는 변수
			 * */
			this.minimumX = 0;
			this.minimumY = 0;
			this.maximumX = 0;
			this.maximumY = 0;
			//Group Icon Symbol
			this.groupIcon = ""+
			'<g>'+
				'<image href="/dist/img/mapEditor/svgImg/yes_group.png"></image>'+
		        '<path fill="none" d="M34.341,68.181C15.681,68.181,0.5,53,0.5,34.341C0.5,15.681,15.681,0.5,34.341,0.5 c18.659,0,33.84,15.181,33.84,33.841C68.181,53,53,68.181,34.341,68.181z"></path>'+
				'<path fill="#fff"  d="M34.341,1c18.384,0,33.34,14.957,33.34,33.341c0,18.384-14.956,33.34-33.34,33.34 C15.957,67.681,1,52.725,1,34.341C1,15.957,15.957,1,34.341,1 M34.341,0C15.375,0,0,15.375,0,34.341    c0,18.965,15.375,34.34,34.341,34.34c18.965,0,34.34-15.375,34.34-34.34C68.681,15.375,53.306,0,34.341,0L34.341,0z"></path>'+
				'<text x="35" y="82"  font-size="12"></text>'+
			'</g>';
			
			this.mapAC = {}; //Map별 svg 정보
			this.statusMode = 'normal'; //MapEditor Mode
			this.currentMap = null; //현재 작업중인 맵 정보
			this.currentItem = null; //Toolbar에서 선택한 자산
			this.selectIcon = null; //Asset List에서 선택한 자산
			this.position = {}; //svg 좌표를 담는 변수
			this.selectItem = []; //select symbol 관리
			this._sceneClickAble = true; //symbol Control 할때는 svg event 안되게
			this._drawRectAble = false; //select Rect 사용 여부
			this.symbolClickAble = false; //심볼을 클릭했을 때 다른 이벤트 간섭을 막기위해 사용
			this.symbolTranslate = ""; //심볼의 현재 위치를 담는 변수
			this.mapPath = {}; //현재 Map Navi 위치를 담는 변수
			this.mapData = null; //map별 자산 정보와 이벤트 정보를 가지고 있는 Data
			this.severityColor = ['#ff0000', '#ff7e00', '#fcff00']; //critical, major, minor
			this.mapTimer = 0; //타이머
			let dataProvider = document.getElementsByClassName("yesMap"); //Map 편집 리스트를 가져옴.
			for(var i=0; i < dataProvider.length; i++){
				let item = dataProvider[i];
				if(item.getElementsByTagName("svg").length > 0){
					continue;
				}else{
					let svgContent = '<svg id="'+item.id + "-svg" + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"' +
					'viewBox="0 0 '+ item.offsetWidth + " " +  item.offsetHeight + '" style="width:100%;height:100%;opacity:1">'+
					'<g id="svgContainer" transform="scale(1)">'+
					'<defs>'+
					    '<filter id="mapBlur" x="0" y="0">'+
					      '<feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />'+
					    '</filter>'+
					  '</defs>'+
					'</g>'+
					'</svg>';
					
					let naviArea = '<div id="'+ item.id +"-navi" +'" class="yesMapNavi"><sapn class="mapNavi" mapDepth="0">Root</span></div>';
					
					$(item).append(naviArea, svgContent );
					
					this.mapAC[item.id] = item;
				}
			}
			
			//mapPath에 처음 시작 위치를 저장
			for(var name in this.mapAC){
				//Map 별 currentPath 배열형식으로 저장
				let arr = [];
				arr.push({
					mapId : name, 
					mapName : name,
					depth : 0
				});
				
				this.mapPath[name] = arr;
			}
			
			this.listNotifiCation("getMapInfo");
		},
		
		setPollingTime : function(number){
			if(typeof(number) === "number"){
				this.pollingTime = number;
				this.initTimer();
			}else{
				w2alert('지원하지 않는 형식 입니다.', "알림");
			}
		},
		 
		initTimer : function(){
			
			let _map = this;
			
			_map.intervalMethod();
			
			if(_map.mapTimer > 0){
				_map.removeMapTimer();
			}
			
			_map.mapTimer = setInterval(function(){
				_map.intervalMethod();
			}, _map.pollingTime);
			
		},
		
		intervalMethod : function(){
			let _map = this;
			
			let param = [];
			for(var name in _map.mapAC){
				let mapPath = _map.mapPath[name];
				param.push( {
					mapId : name,
					currentPosition : mapPath[mapPath.length-1].mapId
				});
			}
			
			_map.listNotifiCation("getMapData", param);
		},
		
		removeMapTimer : function(){
			if(this.mapTimer ===  null) return;
			clearTimeout(this.mapTimer);
		},
		
		makeSVG : function(tag, attrs, orgTag){
			let el= document.createElementNS('http://www.w3.org/2000/svg', tag);
			
			for (var i=0; i < attrs.length; i++){
				let item = attrs[i];
				el.setAttribute(item.name, item.value);
			}
            
			if(tag === "text"){
				el.innerHTML = orgTag.innerHTML;
			}
			
			return el;
		},
		
		/*
		 * get listNotification Method Start
		 * */
		getMapData : function(mapArr){
			let _map = this;
			 $.ajax({
	                url: this.url+"/getMapData",
	                type: "put",
	                dataType: "json",
	                data : JSON.stringify(mapArr),
	                contentType: "application/json;charset=UTF-8",
	                success : function(data){
	                	_map.setMapData(data[0]);
	                },
	                error : function(data) {

	                }
			 });
		},
		
		getMapList : function(id){
			let _map = this;
			$.ajax({
                url: this.url+"/getMapList/"+ id,
                type: "GET",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success : function(data){
                	_map.setMapList(data);
                },
                error : function(data) {

                }
			});
		},
		
		getAssetList : function(id){
			let _map = this; 
			$.ajax({
                url: this.url+"/getAssetList/"+ id,
                type: "GET",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success : function(data){
                	_map.setAssetList(data);
                },
                error : function(data) {

                }
			});
		},
		
		setSaveEditor : function(){
			var _map = this;
			let svgContainer = $(_map.currentMap).attr("id") + "-svg";
			let editorSymbols = d3.selectAll('#'+svgContainer + '  #svgContainer .yes-symbol')[0];
			let saveParam = [];
			let mapPath = _map.mapPath[$(_map.currentMap).attr("id")];
			
			/*
			 * Delete Data
			 * */
			let currentList = _map.mapData[$(_map.currentMap).attr("id")]["currentList"];
			let currentArr = []; 
			_.each(currentList, function(d){
				currentArr.push(d.compId);
			});
			
			/*
			 * Save Data
			 * */
			for(var i =0; i < editorSymbols.length; i++){
				let item = editorSymbols[i];
				let pathArr = _map.mapPath[$(this.currentMap).attr("id")];
				saveParam.push({
					compId : $(_map.currentMap).attr("id") + "_" +  $(item).attr("id"), //차후에 변경 parent id로
					assetId: ($(item).attr("symbol-type") == 'Group' ? null : $(item).attr("id")),
					groupId : ($(item).attr("symbol-type") == 'Group' ? $(item).attr("id") : null),
					groupName : ($(item).attr("symbol-type") == 'Group' ? d3.select(item).select(".symbol-text").html() : null),
					symbolType : $(item).attr("symbol-type"),
					transform : $(item).attr("transform"),
					loc : mapPath[mapPath.length-1].mapId,
					mapId : $(_map.currentMap).attr("id"),
					color : d3.select(item).select('.symbol-text').attr("fill")
				})
				
				for(var j=0; j < currentArr.length; j++){
					let compId = $(_map.currentMap).attr("id")+"_"+item.id;
				
					if(currentArr[j] === compId){ //해당 맵에 존재하는 것은 리스트에서 제거
						currentArr.splice(j,1);
						break;
					}
				}
				
			}
			/*
			 * currentArr에 자식 노드가 있는지 체크
			 * */
			//nodes를 가지고 있는 자산만 추출
			let nodesArr = _.filter(currentList, function(d){
				return d.nodes && d.nodes.length > 0
			})
			
			let delList = [];
			
			_.each(currentArr, function(d){
				delList.push(d);
				for(var m=0; m < nodesArr.length; m++){
					let item = nodesArr[m];
					if(d === item.compId){
						_map.nodesCheckProc(item, delList);
					}
				}
			})
			
			
			let deleteParam = [];
			
			_.each(delList, function(d){
				deleteParam.push({
					compId : d
				})
			})
			
			let param = {saveData:saveParam, deleteData : deleteParam};
			
			//Save
			$.ajax({
                url: this.url+"/setSaveEditor/"+ $(_map.currentMap).attr("id"),
                type: "put",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                data : JSON.stringify(param),
                success : function(data){
                	if(_map.currentItem.name === "Save"){
                		w2alert('저장되었습니다.', "알림", function(){
                			let svgContainer = $(_map.currentMap).attr("id") + "-svg";
                			d3.select("#"+svgContainer + ' #svgContainer').selectAll(".yes-symbol").attr("id", function(){
                				if(w2ui["mapAssetList"]){
                					let item = w2ui["mapAssetList"].get(this.id);
                    				if(item){
                    					item.nodeStyle = "";
                    				}
                				}
                				return this.id;
                			});
                			
                			if(w2ui["mapAssetList"]){
                				w2ui["mapAssetList"].refresh();
                			}
                			
                		});
                		setTimeout(function(){
                			w2popup.close();
                			
                		}, 1000);
                	}else if(_map.currentItem.name === "Exit"){
                		_map.closeMode();
                	}
                },
                error : function(data) {
                	w2alert('다시 저장해 주시기 바랍니다.', "알림");
                }
			});
			
		},
		
		nodesCheckProc : function(item, arr){
			let _map = this;
			let nodes = item.nodes;
			for(var i=0; i < nodes.length; i++){
				let node = nodes[i];
				arr.push(node.compId);
				if(node.nodes && node.nodes.length >0){
					_map.nodesCheckProc(node, arr);
				}
			}
		},
		
		/*
		 * get listNotification Method End
		 * */
		
		listNotifiCation : function(cmd, param){
			switch(cmd){
				case "getMapListType": //list Type
					this.getMapListType(param);
					break;
				case "getAvailableList": //list Type
					this.getAvailableList(param);
					break;
				case "getMapList": //Map Editor
					this.getMapList(param);
					break;
				case "getAssetList":
					this.getAssetList(param);
					break;
				case "getMapData":
					this.getMapData(param);
					break;
				case "setSaveEditor":
					this.setSaveEditor();
					break;
				case "getMapInfo":
					this.getMapInfo();
					break;
				case "setSaveMapInfo":
					this.setSaveMapInfo(param);
					break;
			}
		},
		
		/*
		 * Set ListNotification Start
		 * */
		
		setSaveMapInfo : function(param){
			let _map = this;
			
			$.ajax({
                url: this.url+"/setSaveMapInfo",
                type: "put",
                dataType: "json",
                data : JSON.stringify(param),
                contentType: "application/json;charset=UTF-8",
                success : function(data){
                	_map.sizeMapCheck();
                },
                error : function(data) {
                }
			});
		},
		
		sizeMapCheck : function(){
			
		},
		
		getMapInfo : function(){
			let _map = this;
			
			let arr = [];
			
			for(var name in _map.mapAC){
				arr.push({mapId : name});
			}
			
			if(arr.length > 0){
				$.ajax({
	                url: this.url+"/getMapInfo",
	                type: "put",
	                dataType: "json",
	                data : JSON.stringify(arr),
	                contentType: "application/json;charset=UTF-8",
	                success : function(data){
	                	_map.setMapInfo(data);
	                },
	                error : function(data) {
	                }
				});
			}
			 
		},
		
		setMapInfo : function(data){
			let _map = this;
			
			let mapList = [];
			for(var name in _map.mapAC){
				let svgAttr = d3.select("#"+name+"-svg").attr("viewBox").split(" ");
				mapList.push({
						mapId:name,
						width : parseInt(svgAttr[2]),
						height : parseInt(svgAttr[3]),
						pageName : main.menu.currentPage
					});
			}
			
			if(data.length > 0 ){
				let param = []; //svg 영역이 더 큰값을 담는 변수
				for(var i=0; i < mapList.length; i++){
					let mapItem = mapList[i];
					let svgScale = {x:1, y:1};
					let saveFlug = false; //저장 여부 판단
					let reasonAble = false; //db에 존재여부 판단
					let item = null;
					for(var j=0; j < data.length; j++){
						item = data[j];
						if(mapItem.mapId === item.mapId){
							reasonAble = true;
							if(item.width < mapItem.width){
								//현재 맵이 더 크다면
								item.width = mapItem.width;
								saveFlug = true;
							}
							
							if(item.height < mapItem.height){
								//현재 맵이 더 크다면
								item.height = mapItem.height;
								saveFlug = true;
							}
							
							svgScale.x = mapItem.width/item.width;
							svgScale.y = mapItem.height/item.height;
							
							let totalScale = svgScale.x;
							if(svgScale.x > svgScale.y){
								totalScale = svgScale.y;
							}
							
							d3.select("#"+mapItem.mapId+"-svg #svgContainer").attr("transform", "scale("+ totalScale+ ")");
							//d3.select("#"+mapItem.mapId+"-svg #svgContainer").attr("transform", "scale("+ svgScale.x +"," + svgScale.y + ")");
							continue;
						}
					}
					
					if(saveFlug){
						//db에 저장된 값보다 크다면
						param.push(item);
					}
					
					if(!reasonAble){
						//db에 맵에 정보가 없다면 저장
						param.push(mapItem);
					}
				}
				
				if(param.length > 0){
					_map.listNotifiCation("setSaveMapInfo", param);
				}
				
			}else{
				//DB에 Map 정보가 없다면
				_map.listNotifiCation("setSaveMapInfo", mapList);
			}
			
			/*
			 * follingUseAble true라면 외부에 의해 호출하지 않고 자동으로 호출 
			 */
			if(_map.follingUseAble){
				this.initTimer();
			}
			
		},
		
		getAvailableList : function(param){
			let _map = this;
			$.ajax({
                url: this.url+"/getAvailableList/"+ param.codeId + "/" + param.mapId,
                type: "GET",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success : function(data){
                	_map.setAvailableList(data);
                },
                error : function(data) {

                }
			});
		},
		
		setAvailableList : function(data){
			let _map = this;
			let availNewList = [];
			let selectedList = w2ui["selectedGrid"].records;
			
			for(var i=0; i < data.length; i++){
				let availItem = data[i];
				let xFlug = true;
				for(var j=0; j < selectedList.length; j++){
					let selectItem = selectedList[j];
					if(availItem.assetId === selectItem.assetId){
						xFlug = false;
					}
				}

				if(xFlug){
					availNewList.push(availItem);
				}
				
			}
			
			w2ui["availableGrid"].records = availNewList;
			w2ui["availableGrid"].selectNone();
			_map.refreshNumFunc();
		},
		
		getMapListType : function(mapId){
			let _map = this;
			$.ajax({
                url: this.url+"/getMapListType/"+ mapId,
                type: "GET",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success : function(data){
                	_map.setMapListType(data[0]);
                },
                error : function(data) {

                }
			});
			
		},
		
		setMapListType : function(data){
			
			let _map = this;
			
			let popupContents = '<div clase="mapPopup">'+
											'<div class="dashboard-panel" id="mapLeftPanel" style="background-color:rgba(0,0,0,0);">'+
												'<div class="dashboard-title">'+
													'Asset Type'+
												'</div>'+
												'<div id="leftPanelTree">'+
												'</div>'+
											'</div>'+
											'<div id="mapRightPanel">'+
												'<div class="dashboard-panel" style="background-color:rgba(0,0,0,0);width:330px;height:100%; margin-bottom: 5px;float:left;">'+
													'<div class="dashboard-title">'+
														'Available List'+
													'</div>'+
													'<div id="rightTopPanelGrid">'+
													'</div>'+
												'</div>'+
												'<div style="float:left;width:45px;height:100%;text-align:center;display: table;">'+
													'<div style="display: table-cell;vertical-align: middle;">'+
														'<button class="darkButtonDisable" style="margin:0;" id="mapMoveBtn" >></button>'+
													'</div>'+
												'</div>'+
												'<div class="dashboard-panel" style="background-color:rgba(0,0,0,0);width:330px;height:100%;float:right;">'+
													'<div class="dashboard-title">'+
														'<span>Selected List</span>'+
														'<div style="float:right;" class="mapBtnArea">'+
															'<i id="mapTopBtn" class="icon fab fa-yes-arrow_top" aria-hidden="true" title="Top" ></i>'+
															'<i id="mapUpBtn" class="icon fas fa-arrow-up" aria-hidden="true" title="UP" ></i>'+
															'<i id="mapDownBtn" class="icon fas fa-arrow-down" aria-hidden="true" title="Down" ></i>'+
															'<i id="mapBottomBtn" class="icon fab fa-yes-arrow_bottom" aria-hidden="true" title="Bottom" ></i>'+
															'<i id="mapDelBtn" class="icon fas fa-trash-alt" aria-hidden="true" title="Del"></i>'+
														'</div>'+
													'</div>'+
													'<div id="rightBottomPanelGrid">'+
													'</div>'+
												'</div>'+
											'</div>'+
									   '</div>' 
			
			w2popup.open({
				title : 'Map Editor List',
				body : popupContents,
				width : 900,
				map : _map,
				dataAC : data,
				height : 728,
				opacity   : '0.5',
	    		modal     : true,
			    showClose : true,
			    style	  : "overflow-y:hidden; padding:5px;",
			    buttons   : '<button class="w2ui-btn" id="mapApplyBtn">Apply</button> '+
                '<button class="w2ui-btn" onclick="w2popup.close();">Cancel</button>',
			    onOpen    : function(event){
			    	let pop = this;
			    	event.onComplete = function () {
			    		
			    		$("#leftPanelTree").w2sidebar({
			    			name : 'mapLeftTree',
			    			style : 'width:100%;height:calc(100% - 31px);background-color: rgba(0,0,0,0);',
			    			map : _map,
			    			nodes : [
			    				{ id: 'Asset', text: 'ASSET LIST', expanded: true, group: true}
			    			],
			    			onClick: function(event) {
			                	let selectId = event.target;
			                	if(this.map.selectListItem === selectId){
			                		return;
			                	}else{
			                		this.map.selectListItem = selectId;
			                	}
			                	
			                	let param = {codeId: selectId, mapId : $(this.map.currentMap).attr("id")};
			                	this.map.listNotifiCation("getAvailableList", param);
			    			}
			    		});
			    		
			    		$("#rightTopPanelGrid").w2grid({
			    			name : 'availableGrid',
			    			show: { 
			                    toolbar: true,
			                    footer:false,
			                    toolbarSearch:false,
			                    toolbarReload  : false,
			                    searchAll : true,
			                    toolbarColumns : false,
			                    selectColumn: true
			                },
			                style:'width:100%;height:calc(100% - 30px);',
			                recordHeight : 30,
			                multiSelect : true,
			                searches: [
			                	{ field: 'assetName', caption: 'NAME', type: 'text' }
			                ],
			                columns: [                
					            { field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
								{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, 
								{ field: 'symbolType', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, 
							],
							onScroll : function(event){
								console.log(event);
								getVisibleRows();
							}
			    		});
			    		
			    		w2ui["availableGrid"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
			    			_map.validationCheck();
			        	});
			    		
			    		w2ui["availableGrid"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
			    			_map.validationCheck();
			    		});
			    		
			    		$("#rightBottomPanelGrid").w2grid({
			    			name : 'selectedGrid',
			    			show: { 
			    				toolbar: true,
			    				footer:false,
			    				toolbarSearch:false,
			    				toolbarReload  : false,
			    				searchAll : true,
			    				toolbarColumns : false,
			    				selectColumn: true
			    			},
			    			style:'width:100%;height:calc(100% - 30px);',
			    			recordHeight : 30,
			    			multiSelect : true,
			    			searches: [
			                	{ field: 'assetName', caption: 'NAME', type: 'text' }
			                ],
			    			columns: [                
			    				{ field: 'recid', caption: 'NO', size: '50px', sortable: true, attr: 'align=center'},
			    				{ field: 'assetName', caption: 'NAME', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, 
			    				{ field: 'symbolType', caption: 'TYPE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, 
			    				]
			    		});
			    		
			    		w2ui["selectedGrid"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
			    			_map.validationCheck();
			        	});
			    		
			    		w2ui["selectedGrid"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
			    			_map.validationCheck();
			    		});
			    		
			    		w2ui["mapLeftTree"].insert('Asset', null, w2popup.get().dataAC.treeList);
			    		
			    		w2ui["mapLeftTree"].select(w2ui["mapLeftTree"].get('Asset').nodes[0].id);
			    		
			    		_map.selectListItem = w2ui["mapLeftTree"].selected;
			    		
			    		w2ui["availableGrid"].records = w2popup.get().dataAC.availableList;
			    		
			    		w2ui["selectedGrid"].records = w2popup.get().dataAC.useList;
			    		
			    		w2ui["availableGrid"].refresh();
			    		
			    		w2ui["selectedGrid"].refresh();
			    		
			    	}
			    },
			    
			    onClose : function(event){
			    	_map.closeMode();
			    	//차후에는 closeMode()호출
			    	/*w2ui["mapLeftTree"].destroy();
			    	w2ui["availableGrid"].destroy();
			    	w2ui["selectedGrid"].destroy();
			    	_map.statusMode = 'normal';
			    	_map.currentMap = null;*/
			    }
			});
		},
		
		validationCheck : function(){
			if(w2ui["selectedGrid"].getSelection().length > 0){
				$("#mapTopBtn").addClass('link');
				$("#mapUpBtn").addClass('link');
				$("#mapDownBtn").addClass('link');
				$("#mapBottomBtn").addClass('link');
				$("#mapDelBtn").addClass('link');
				
			}else{
				$("#mapTopBtn").removeClass('link');
				$("#mapUpBtn").removeClass('link');
				$("#mapDownBtn").removeClass('link');
				$("#mapBottomBtn").removeClass('link');
				$("#mapDelBtn").removeClass('link');
			}
			
			if(w2ui["availableGrid"].getSelection().length > 0){
				$("#mapMoveBtn").attr('disabled', false);
        		$("#mapMoveBtn").css('opacity', 1);
        		document.getElementById("mapMoveBtn").className = "darkButton";
			}else{
				$("#mapMoveBtn").attr('disabled', true);
        		$("#mapMoveBtn").css('opacity', 0.4);
        		document.getElementById("mapMoveBtn").className = "darkButtonDisable";
			}
			
		},
		
		//MapEditor 심볼 정보와 Event Severity 값을 동시에 가져옴.
		setMapData : function(data){
			
			let _map = this;
			
			if(_map.mapData === null){
				//처음 한번만 실행하기 위함.
				_map.mapData = {}
				this.initRegisterEvent();
			}
			
			for(var name in data){
				let newData = data[name]["currentList"];
				let currentData = null;
				if(_map.mapData[name] === undefined || _map.mapData[name] === null){
					//처음 시작
					_map.mapData[name] = data[name];
					_map.createSymbolFunc(newData, name);
				}else{
					currentData = _map.mapData[name]["currentList"];
					if(util.compare(currentData, newData)){
						//console.log("일치");
					}else{
						console.log("불일치");
						/*
						 * DB에서 삭제된 심볼 제거 Process
						 * */
						let currentArr = [];
						_.each(currentData, function(d){
							currentArr.push(d.assetId);
						});
						
						let newArr = [];
						_.each(newData, function(d){
							newArr.push(d.assetId);
						});
						
						let delArr = _.difference(currentArr, newArr);
						let addArr = _.difference(newArr, currentArr);
						
						if(delArr.length > 0){
							_.each(delArr, function(d){
								let svgContainer = name + "-svg";
								d3.select("#"+svgContainer+ ' #svgContainer').select("#"+d).remove();
								
								if(w2ui["mapAssetList"]){
									let useItem = w2ui["mapAssetList"].get(d);
                    				if(useItem){
                    					let useResult = _.filter(data[name]["useList"], function(d){
                    						return useItem.assetId == d.assetId;
                    					})
                    					
                    					if(useResult.length > 0){
                    						useItem.nodeStyle = _map.useColor;
                    					}else{
                    						useItem.nodeStyle = "";
                    					}
                    					
                    					w2ui["mapAssetList"].enable(d);
                    					useItem.draggable = true;
                    					
                    				}
								}
							});
							
							if(w2ui["mapAssetList"]){
                				w2ui["mapAssetList"].refresh();
                			}
							
						}
						
						
						for(var i=0; i < newData.length; i++){
							
							let item = newData[i];
							let addFlug = false;
							if(addArr.length > 0){
								//추가된 데이터는 심볼 추가로
								for(var j=0; j < addArr.length; j++){
									let assetId = addArr[j];
									
									if(item.assetId === assetId){//새롭게 추가된 데이터라면 심볼 추가
										/*
										 * Editor에서 저장시 추가된 심볼이라도 setMapData의 기존 데이터에는 없는 데이터로 추가하게됨
										 * 따라서 해당 심볼이 존재 하지 않을 경우에만 추가하도록 함.
										 * **/
										let reasonArr = []; //심볼이 존재하는지 여부
										d3.selectAll("#" + name + "-svg #svgContainer").selectAll(".yes-symbol").attr("id", function(){
											if(this.id === item.assetId){
												reasonArr.push(this);
											}
											return this.id;
										})
										
										if(reasonArr.length === 0){
											let paramArr = [item];
											_map.createSymbolFunc(paramArr, name);
										}
										
										if(w2ui["mapAssetList"]){
											let useItem = w2ui["mapAssetList"].get(assetId);
											if(useItem){
												useItem.nodeStyle = "";
		                    					w2ui["mapAssetList"].disable(useItem.assetId);
		                    					useItem.draggable = false;
											}
										}
										
										addFlug = true;
										break;
									}
								}
								
								if(w2ui["mapAssetList"]){
	                				w2ui["mapAssetList"].refresh();
	                			}
								
							}
							
							if(!addFlug){
								//추가된 데이터가 아니라면 심볼 정보 업데이트
								let currentItem = _.filter(currentData, function(d){
									return item.assetId == d.assetId;
								})[0];
								
								if(!util.compare(item, currentItem)){
									let svgContainer = name + "-svg";
									
									if(item.transform != currentItem.transform){
										//이동 좌표는 다를경우에만 적용
										d3.select("#"+svgContainer+' #svgContainer').select("#"+item.assetId).attr("transform", item.transform);
									}
									
									//텍스트 내용과 폰트 컬러는 항시 적용
									d3.select("#"+svgContainer + ' #svgContainer').select("#"+item.assetId).select(".symbol-text").attr("fill", item.color).html(item.assetName);
									
									if(_map.currentMap){
										let mapId = $(_map.currentMap).attr("id");
										if(mapId === name){
											//Editor 상태일 경우에는 컬러값 반영을 하지 않고 종료 한다.
											continue;
										}
									}
									
									let  color = "";
									
									d3.select("#"+svgContainer + ' #svgContainer').select("#"+item.assetId).select(".severity-bg").classed("severity-critical", false);
									
									switch(item.severity.toString()){
										case "1" : //Critical
											color = _map.severityColor[0];
											d3.select("#"+svgContainer+ ' #svgContainer').select("#"+item.assetId).select(".severity-bg").classed("severity-critical", true);
											break;
										case "2" :  //Major
											color =_map.severityColor[1];
											break;
										case "3" : //Minor
											color = _map.severityColor[2];
											break;
										default :
											color = "none";
											break;
									}
									
									d3.select("#"+svgContainer+ ' #svgContainer').select("#"+item.assetId).select(".severity-bg").attr("fill", color);
									
								}
							}
						}
						
						_map.mapData[name] = data[name];
						
					}
				}
				
			}
			
		},
		
		createSymbolFunc : function(dataProvider, mapName){
			
			let _map = this;
			
			for(var i=0; i < dataProvider.length ; i++){
				let item = dataProvider[i];
				let svgTag = "";
				
				switch(item.symbolType){
					case 'Group':
						svgTag = _map.groupIcon;
						break;
					default : 
						svgTag = item.symbolSvg;
						break;
				}
				
				let parseEl = jQuery.parseXML(svgTag);
				
				parseEl = parseEl.documentElement; //svg code만 추출
				
				$(parseEl).attr("class", "yes-symbol");
				
				$(parseEl).attr("symbol-type", item.symbolType);
				
				$(parseEl).attr("transform", item.transform);
				
				let symbol = _map.makeSVG(parseEl.tagName, parseEl.attributes); //SVG Tag로 감싸주는 역활
				
				$('#'+ mapName + '-svg #svgContainer').append(symbol);
				
				$(symbol).attr("id", item.assetId); //symbol ID 부여
				
				for(var j=0; j < parseEl.childElementCount; j++){
					let child = parseEl.children[j];
					switch(j.toString()){
						case "0" : //image
							$(child).attr("class", "symbol-img-bg");
							break;
						case "1" : //Severity bg
							$(child).attr("class", "severity-bg");
							break;
						case "2" : //border
							$(child).attr("class", "severity-border").attr("filter", "url(#mapBlur)").attr("fill", "#fff");
							break;
						case "3" : //text
							$(child).attr("fill", item.color).attr("class", "symbol-text");
							break;
					}
					
					let element = _map.makeSVG(child.tagName, child.attributes, child);
					
					if(child.tagName === "text"){
							element.innerHTML = item.text;
					}
					
					$(symbol).append(element);
					
					let  color = "";
					
					switch(item.severity.toString()){
						case "1" : //Critical
							color = _map.severityColor[0];
							d3.selectAll("#"+mapName +"-svg #svgContainer").select("#"+item.assetId).select(".severity-bg").classed("severity-critical", true);
							break;
						case "2" :  //Major
							color =_map.severityColor[1];
							break;
						case "3" : //Minor
							color = _map.severityColor[2];
							break;
						default :
							color = "none";
							break;
					}
					
					if(_map.currentMap && $(_map.currentMap).attr("id") === mapName){
						d3.selectAll("#"+mapName +"-svg #svgContainer").select("#"+item.assetId).select(".severity-bg").attr("fill", "none");
					}else{
						d3.selectAll("#"+mapName +"-svg #svgContainer").select("#"+item.assetId).select(".severity-bg").attr("fill", color);
					}
					
					
				}//for j
				
				if(item.symbolType === "Group"){
					$(symbol).attr('orgWidth',  symbol.getBBox().width);
					
					$(symbol).attr('orgHeight',  symbol.getBBox().height);
				}
				
				//ClickEvent 등록
				if(_map.currentMap && $(_map.currentMap).attr("id") === mapName){
					//Editor 상태에서 생성시 Drag 기능도 지원해야함.
					_map.dragEventRegister(symbol, true);
				}else{
					_map.symbolClickEventListener(symbol);
				}
				
			} //for i
		},
		
		symbolClickEventListener : function(symbol){
			
			let _map = this;
		
			d3.select(symbol).on("click", function(){
				//Editor Mode
				let parentId = event.currentTarget.parentElement.parentElement.parentElement.id;
				
				if(_map.statusMode === 'editor' && parentId === _map.currentMap.id){
					console.log("symbol click");
					event.stopPropagation();
					 if(_map.moveCheckHandler(this)){
						//움직이지 않았다면 
						 _map.selectItemCheck(this);
					 }else{
						 //움직였다면
						 //이동 했다면 선택한 본인만 Select
						 if(_map.selectItem.length > 1){
							 //MultiSelect
							 _map.maxminCheck();
							 
						 }else{
							 //Single Select
							 d3.selectAll(".selectSymbol").remove();
							 
							 _map.drawSelectBox(this);
							 
							 _map.selectItem = [];
							 
							 _map.selectItem.push(this);
						 }
						 
					 }
					 
					 _map.propertiesCheck();
					 
				}else{
					//normal Mode
					//console.log("symbol click");
					 
					 let el = event.target.parentElement;
					 
					 let currentMapId = $(el.parentElement).attr("id");
					 
					 let customEvent = new CustomEvent("mapSymbolClick", {
			    	    	detail :{
			    	    		currentEvent : event,
			    	    		value : el,
			    	    		mapName : currentMapId
			    	    	}
			    	 });
			    	    
					 document.dispatchEvent(customEvent);
					 
					 console.log($(el).attr("id"));
				}
				
			 });
		},
		
		refreshNumFunc : function(status){
			
			let _map = this;
			
			let availableList = w2ui["availableGrid"].records;
			if(availableList.length > 0 ){
				for(var i=0; i < availableList.length; i++){
					let item = availableList[i];
					item.recid = i+1;
				}
			}
			
			let selectedList = w2ui["selectedGrid"].records;
			if(selectedList.length > 0){
				for(var j=0; j < selectedList.length; j++){
					let item = selectedList[j];
					item.recid = j+1;
				}
			}
			
			w2ui["availableGrid"].refresh();
			w2ui["selectedGrid"].refresh();
			
			if(status !== undefined){
				switch(status){
					case "add":
						let selectAddItemList = _map.selectAddItem;
						let selectArea = [];
						for(var m=0; m < selectedList.length; m++){
							let item = selectedList[m];
							for(var n=0; n < selectAddItemList.length; n++){
								let addItem = selectAddItemList[n];
								if(item.assetId === addItem.assetId){
									selectArea.push(item.recid);
									w2ui["selectedGrid"].select( item.recid);
								}
							}//for n
						}//for m
						
						w2ui["selectedGrid"].refresh();
						$("#grid_selectedGrid_records")[0].scrollTop = w2ui["selectedGrid"].recordHeight * selectArea[0];
						break;
					case "top":
					case "up":
					case "down":
					case "bottom":
						let selectedItems = _map.selectedItems;
						let firstItem = selectedItems[0];
						_.each(w2ui["selectedGrid"].records, function(d){
							for(var i=0; i < selectedItems.length; i++){
								let item = selectedItems[i];
								if(d.assetId === item.assetId){
									w2ui["selectedGrid"].select(d.recid);
								}
							}
						})
						
						/*
						 * 스크롤이동까지 이동하고 싶다면 아래 주석 응용
						 */
						//$("#grid_selectedGrid_records")[0].scrollTop = w2ui["selectedGrid"].recordHeight * (firstItem.recid-1);
						if(status === "top") $("#grid_selectedGrid_records")[0].scrollTop = 0;
						if(status === "bottom") $("#grid_selectedGrid_records")[0].scrollTop = w2ui["selectedGrid"].recordHeight * (firstItem.recid-1);
						break;
						
				}
			} 
		},
		
		popupMsgFunc : function(){
			w2popup.message({
			    width  : 500,
			    height : 150,
			    hideOnClick : true,
			    style : 'top:260px!important;',
			    html   : '<div class="w2ui-centered">'+
			    		  	'<div style="padding: 10px;color:#ffffff;">'+
			    		  	'Selected List에 선택된 자산이 없습니다.<br>자산을 선택하세요. '+
			    		  	'</div>'+
			    		  	'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">Close</button>'+
			    		  '</div>',
			});
		},
		
		buttonDisableCheck : function(name, able){
			switch(name){
				case "mapUpBtn":
					if(able){
						$("#mapDelBtn").prop("disable", true);
	            		$("#mapDelBtn").removeClass('link');
					}else{
						
					}
					break;
				case "mapDownBtn":
					break;
				case "mapDelBtn":
					break;
				
			}
		},
		
		initRegisterEvent : function(){
			
			let _map = this;
			
			/*
			 * Custom Menu Start
			 */
			$(document).on("contextmenu", function(event){
				event.preventDefault();
				let privilege = sessionStorage.getItem("PRIVILEGE_ID");
				/*
				 * 실제로 사용할땐 아래 주석을 적용해야함. 
				 * 임시로 모니터도 수정할 수 있게 해놓음.
				 */
				//if(event.target.nodeName === "svg" && privilege !== "2"){
				if(event.target.nodeName === "svg"){
					$("div.custom-menu").remove();
					$("<div class='custom-menu'>Davis Map Editor</div>").appendTo("body")
					.css({
        				top:event.pageY+"px",
        				left:event.pageX+"px"
        			});
					
					_map.mapTag = event.target.parentElement.id;
				}
			});
			
			$(document).on("click", "body", function(event){
				if(event.target.className === "custom-menu"){
					_map.editMode(_map.mapTag);
				}
				_map.mapTag = null;
				$("div.custom-menu").remove();
			});
			
			/*
			 * Custom Menu End
			 */
			
			$(document).on("click", "#mapMoveBtn", function(event){
				if(w2ui["availableGrid"].getSelection().length > 0 ){
					
					//$("#grid_selectedGrid_records")[0].scrollTop = 60;
					
					let selectArr = w2ui["availableGrid"].getSelection();
					
					let availNewList = [];
					let availableList = w2ui["availableGrid"].records;
					let selectedList = w2ui["selectedGrid"].records;
					_map.selectAddItem = [];
					
					
					for(var m=0; m < availableList.length; m++){
						let availItem = availableList[m];
						let xFlug = true;
						for(var n=0; n < selectArr.length; n++ ){
							let selectItem = w2ui["availableGrid"].get(selectArr[n]);
							if(availItem.assetId === selectItem.assetId){
								selectedList.push(availItem);
								_map.selectAddItem.push(availItem);
								xFlug = false;
							}
						}
						
						if(xFlug){
							availNewList.push(availItem);
						}
					}
					
					w2ui["availableGrid"].records = availNewList;
					
					/* w2ui에서 제공하는 삽입 삭제 메소드 사용시 처리 시간이 오래걸림.
					for(var i=0; i < selectArr.length; i++){
						let item = w2ui["availableGrid"].get(selectArr[i]);
						w2ui["selectedGrid"].add($.extend({}, item, {selected:false}));
						w2ui["availableGrid"].remove(selectArr[i]);
					}*/
					
					w2ui["availableGrid"].selectNone();
					
					_map.refreshNumFunc('add');
				}else{
					//_map.popupMsgFunc();
					return;
				}
			});
			
			$(document).on("click", "svg#mapTopBtn", function(event){
				if(w2ui["selectedGrid"].getSelection().length > 0 ){
					let selectArr = w2ui["selectedGrid"].getSelection();
					_map.selectedItems = [];
					for(var i=0; i < selectArr.length ; i++){
						let selectItem = w2ui["selectedGrid"].get(selectArr[i]);
						_map.selectedItems.push(selectItem);
						w2ui["selectedGrid"].remove(selectItem.recid);
					}
					
					w2ui["selectedGrid"].selectNone();
					
					let selectedList = w2ui["selectedGrid"].records;
					let newSelectList = [];
					
					_.each(_map.selectedItems , function(d){
						newSelectList.push(d);
					})
					
					_.each(selectedList, function(d){
						newSelectList.push(d);
					});
					
					w2ui["selectedGrid"].records = newSelectList;
					
					_map.refreshNumFunc("top");
					
				}else{
					return;
				}
			});
			
			$(document).on("click", "svg#mapUpBtn", function(event){
				if(w2ui["selectedGrid"].getSelection().length > 0 ){
					let selectArr = w2ui["selectedGrid"].getSelection();
					_map.selectedItems = [];
					for(var i=0; i < selectArr.length ; i++){
						let selectItem = w2ui["selectedGrid"].get(selectArr[i]);
						_map.selectedItems.push(selectItem);
						w2ui["selectedGrid"].remove(selectItem.recid);
					}
					
					w2ui["selectedGrid"].selectNone();
					
					let selectedList = w2ui["selectedGrid"].records;
					let newSelectList = [];
					let firstItem = _map.selectedItems[0];
					
					if(firstItem.recid === 1){
						_.each(_map.selectedItems , function(d){
							newSelectList.push(d);
						})
						
						_.each(selectedList, function(d){
							newSelectList.push(d);
						});
						
					}else{
						for(var j=0; j < selectedList.length; j++){
							let item = selectedList[j];
							if(item.recid+1 === firstItem.recid){
								_.each(_map.selectedItems , function(d){
									newSelectList.push(d);
								})
							}
							newSelectList.push(item);
						}
					}
					
					w2ui["selectedGrid"].records = newSelectList;
					
					_map.refreshNumFunc("up");
					
				}else{
					return;
				}
			});
			
			
			$(document).on("click", "svg#mapDownBtn", function(event){
				if(w2ui["selectedGrid"].getSelection().length > 0 ){
					let selectArr = w2ui["selectedGrid"].getSelection();
					let gridSize = w2ui["selectedGrid"].records.length;
					_map.selectedItems = [];
					for(var i=0; i < selectArr.length ; i++){
						let selectItem = w2ui["selectedGrid"].get(selectArr[i]);
						_map.selectedItems.push(selectItem);
						w2ui["selectedGrid"].remove(selectItem.recid);
					}
					
					w2ui["selectedGrid"].selectNone();
					
					let selectedList = w2ui["selectedGrid"].records;
					let newSelectList = [];
					let lastItem = _map.selectedItems[_map.selectedItems.length-1];
					
					if(lastItem.recid === gridSize){
						_.each(selectedList, function(d){
							newSelectList.push(d);
						});
						
						_.each(_map.selectedItems , function(d){
							newSelectList.push(d);
						})
						
					}else{
						for(var j=0; j < selectedList.length; j++){
							let item = selectedList[j];
							newSelectList.push(item);
							if(item.recid === lastItem.recid+1){
								_.each(_map.selectedItems , function(d){
									newSelectList.push(d);
								})
							}
							
						}
					}
					
					w2ui["selectedGrid"].records = newSelectList;
					
					_map.refreshNumFunc("down");
				}else{
					return;
				}
			});
			$(document).on("click", "svg#mapBottomBtn", function(event){
				if(w2ui["selectedGrid"].getSelection().length > 0 ){
					let selectArr = w2ui["selectedGrid"].getSelection();
					_map.selectedItems = [];
					for(var i=0; i < selectArr.length ; i++){
						let selectItem = w2ui["selectedGrid"].get(selectArr[i]);
						_map.selectedItems.push(selectItem);
						w2ui["selectedGrid"].remove(selectItem.recid);
					}
					
					w2ui["selectedGrid"].selectNone();
					
					let selectedList = w2ui["selectedGrid"].records;
					let newSelectList = [];
					
					_.each(selectedList, function(d){
						newSelectList.push(d);
					});
					
					_.each(_map.selectedItems , function(d){
						newSelectList.push(d);
					})
					
					w2ui["selectedGrid"].records = newSelectList;
					
					_map.refreshNumFunc("bottom");
				}else{
					return;
				}
			});
			
			$(document).on("click", "svg#mapDelBtn", function(event){
				if(w2ui["selectedGrid"].getSelection().length > 0 ){
					
					let newSelectList = [];
					let selectList = w2ui["selectedGrid"].records;
					let deleteList = w2ui["selectedGrid"].getSelection();
					let notiCheckFlug = false; //삭제 리스트에 현재 선택한 자산이 속해있을 경우에만 불러오기
					
					for(var i=0; i < selectList.length; i++){
						let selectItem = selectList[i];
						let xFlug = true;
						for(var j=0; j < deleteList.length; j++){
							let deleteItem = w2ui["selectedGrid"].get(deleteList[j]);
							if(selectItem.assetId === deleteItem.assetId){
								xFlug = false;
								if(!notiCheckFlug){
									let assetType = w2ui["mapLeftTree"].get(_map.selectListItem);
									if(deleteItem.symbolType.toLowerCase() === assetType.text.toLowerCase()){
										notiCheckFlug = true;
									};
								}
							}
						}
						
						if(xFlug){
							newSelectList.push(selectItem);
						}
						
					}
					
					w2ui["selectedGrid"].records = newSelectList;
					w2ui["selectedGrid"].selectNone();
					
					_map.refreshNumFunc();
					
					if(notiCheckFlug){
						let param = {codeId: _map.selectListItem, mapId : $(_map.currentMap).attr("id")};
						_map.listNotifiCation("getAvailableList", param);
					}
                	
				}else{
					//_map.popupMsgFunc();
					return;
				}
			});
				
			$(document).on("click", "#mapApplyBtn", function(event){
				
				$('body').loading('show');
				
				let svgContainer = $(_map.currentMap).attr("id") + "-svg";
				d3.selectAll('#'+svgContainer + ' #svgContainer .yes-symbol').remove();
				
				let selectedArr = w2ui["selectedGrid"].records;
				if(selectedArr.length > 0){
					
					let addList = [];
					let containerWidth = $('#'+svgContainer).width();
					let containerHeight = $('#'+svgContainer).height();
					let totalWidth = 0;
					let totalHeight = 0;
					let maxHeight = 0;
					
					let gapH = 10;
					let gapV = 10;
					
					let position ={x:0, y:0};
					
					for(var s =0; s < selectedArr.length; s++){
						let item = selectedArr[s];
						let svgTag = item.symbolSvg;
						let parseEl = jQuery.parseXML(svgTag);
						
						parseEl = parseEl.documentElement; //svg code만 추출
						
						$(parseEl).attr("class", "yes-symbol");
						
						$(parseEl).attr("symbol-type", item.symbolType);
						
						let symbol = _map.mapEditor.makeSVG(parseEl.tagName, parseEl.attributes);
						
						$(symbol).attr("id", item.assetId);
						
						$('#'+svgContainer+" #svgContainer").append(symbol);
						
						for(var i=0; i < parseEl.children.length; i++){
							let childItem = parseEl.children[i];
							
							switch(i.toString()){
								case "0" : //image
									$(childItem).attr("class", "symbol-img-bg");
									break;
								case "1" : //Severity bg
									$(childItem).attr("class", "severity-bg");
									break;
								case "2" : //border
									$(childItem).attr("class", "severity-border").attr("filter", "url(#mapBlur)").attr("fill", "#fff");
									break;
								case "3" : //text
									$(childItem).attr("fill", "white").attr("class", "symbol-text");
									break;
							}
							
							let element = _map.makeSVG(childItem.tagName, childItem.attributes, childItem);
							
							if(childItem.tagName === "text"){
								element.innerHTML = item.assetName;
							}
							
							$(symbol).append(element);
							
						}
						
						//심볼 생성이 완료 위치 셋팅
						let symbolWidth = symbol.getBBox().width;
						let symbolHeight = symbol.getBBox().height;
						
						totalWidth = position.x + gapH + symbolWidth;
						
						if(totalWidth < containerWidth){
							$(symbol).attr('transform', 'translate('+ (position.x + gapH)  +','+ (position.y + gapV)  +') scale(1) rotate(0)');
							_map.symbolClickEventListener(symbol);
							item.transform = $(symbol).attr('transform');
							addList.push(item);
							if(maxHeight < symbolHeight + gapV){
								maxHeight = symbolHeight + gapV;
							}
							position.x = position.x + gapH + symbolWidth;
						}else{
							position.y += gapV + maxHeight; //한줄이 넘어갈경우 다음줄 Y Position 계산
							totalHeight = position.y + gapV + symbolHeight;
							if(totalHeight < containerHeight){
								position.x = 0;
								$(symbol).attr('transform', 'translate('+ (position.x + gapH)  +','+ (position.y + gapV)  +') scale(1) rotate(0)');
								item.transform = $(symbol).attr('transform');
								addList.push(item);
								_map.symbolClickEventListener(symbol);
								position.x = position.x + gapH + symbolWidth;
							}else{
								d3.select("#"+svgContainer+' #svgContainer').selectAll("#"+item.assetId).remove();
							}
							
						}
						
					}
					
					let param = {saveData:addList, deleteData : []};
					
					$.ajax({
		                url: _map.url+"/setSaveEditorList/" + $(_map.currentMap).attr("id"),
		                type: "put",
		                dataType: "json",
		                contentType: "application/json;charset=UTF-8",
		                data : JSON.stringify(param),
		                success : function(data){
		                	$('body').loading('hide');
		                	w2popup.close();
		                },
		                error : function(data) {
		                	$('body').loading('hide');
		                	w2alert('다시 저장해 주시기 바랍니다.', "알림");
		                }
					});
					
					//
				}else{
					$.ajax({
		                url: _map.url+"/deleteAllData/" + $(_map.currentMap).attr("id"),
		                type: "get",
		                dataType: "json",
		                contentType: "application/json;charset=UTF-8",
		                success : function(data){
		                	$('body').loading('hide');
		                	w2popup.close();
		                },
		                error : function(data) {
		                	$('body').loading('hide');
		                	w2alert('다시 저장해 주시기 바랍니다.', '알림', function(event){
		                		w2popup.close();
		                	});
		                }
					});
				}
				
			});
			
			$(document).on("click", ".mapNavi", function(event){
				let container = event.target.parentElement.parentElement.id;
				
				if(_map.statusMode === "editor" && _map.currentMap.id === container){
					//현재 Editor 상태의 맵은 이동 안되게
					return;
				}
				
				let pathArr = _map.mapPath[container];
				let pathNum = $(event.target).attr("mapDepth");
				let selectItem = pathArr[pathNum];
				
				if(pathArr.length -1 == pathNum){
					return;
				}
				
				let naviPath = '';
				let newPath = [];
				if(pathNum == 0){
					naviPath += '<span class="mapNavi selectNavi" mapDepth="'+ selectItem.depth +'">Root</span>';
					newPath.push(_.clone(selectItem));
					$("#"+container + "-navi").html(naviPath);
					$("#"+container + "-navi").css('display', 'none');
				}else{
					for(var i =0 ; i < pathArr.length; i++){
						let item = pathArr[i];
						
						if(item.depth <= selectItem.depth){
							
							if(i === 0){
								naviPath += '<span class="mapNavi" mapDepth="'+ item.depth +'">Root</span>';
							}else if(i == selectItem.depth){
								naviPath += ' > <span class="mapNavi selectNavi" mapDepth="'+ item.depth +'">'+ item.mapName +'</span>';
							}else{
								naviPath += ' > <span class="mapNavi" mapDepth="'+ item.depth +'">'+ item.mapName +'</span>';
							}
							
							newPath.push(_.clone(item));
						}
						
					}
					
					$("#"+container + "-navi").html(naviPath);
					$("#"+container + "-navi").css('display', 'block');
				}
				
				_map.mapPath[container] = newPath;
				_map.initTimer();
				
				//$("#map00002-navi").parent().attr('id');
				
			});
			
			$(document).on("mouseover", ".severity-bg, .symbol-img-bg, .symbol-text", function(event){
				 let el = event.target.parentElement;
				 d3.select(el).select('.severity-border').attr("class","severity-border-hover");
			 });
			 
			 $(document).on("mouseout", ".severity-bg, .symbol-img-bg, .symbol-text", function(event){
				 let el = event.target.parentElement;
				 d3.select(el).select('.severity-border-hover').attr("class","severity-border");
			 });
			 
			 //상세 정보
			 $(document).on("dblclick", ".severity-bg, .symbol-img-bg, .symbol-text", function(event){
				 
				 console.log("symbol dblclick");
				 
				 let el = event.target.parentElement;
				 
				 let currentMapId = $(el.parentElement).attr("id");
				 
				 let parentId = el.parentElement.parentElement.parentElement.id;
				 
				 if(_map.statusMode === "editor" && parentId === _map.currentMap.id){
					//Editor Mode Properties POPUP Open
					// _map.propertiesCheck(el);
					 $("#propsInfo").css("display", "block");
				 }else{
					 //Normal Mode
					 console.log("normal");
					 
					 if($(el).attr("symbol-type") === "Group"){
						console.log($(el).attr("id"));
						let container = el.parentElement.parentElement.parentElement.id;
						let pathArr = _map.mapPath[container];
						
						pathArr.push({
							mapId : el.id,
							mapName : d3.select(el).select('.symbol-text').html(),
							depth : pathArr.length
						})
						
						let naviPath = '';
						for(var i=0; i < pathArr.length; i++){
							let item = pathArr[i];
							if(i ===0){
								naviPath += '<span class="mapNavi" mapDepth="'+ item.depth +'">Root</span>';
							}else if(i === pathArr.length-1){
								naviPath += ' > <span class="mapNavi selectNavi" mapDepth="'+ item.depth +'">'+ item.mapName +'</span>';
							}else{
								naviPath += ' > <span class="mapNavi" mapDepth="'+ item.depth +'">'+  item.mapName +'</span>';
							}
						}
						
						$("#"+container + "-navi").html(naviPath);
						
						$("#"+container + "-navi").css('display', 'block');
						
						_map.initTimer();
						
					 }else{
						 let customEvent = new CustomEvent("mapSymbolDblClick", {
				    	    	detail :{
				    	    		currentEvent : event,
				    	    		value : el,
				    	    		mapName : currentMapId
				    	    	}
				    	    })
				    	    
						 document.dispatchEvent(customEvent);
					 }
					 
				 }
				 
			 });
		},
		
		//선택한 자산 리스트
		setAssetList : function(data){
			/*
			 * 사용 가능 여부 결정 이미 존재하는 심볼들은 배치 못하게
			 * */
			let _map = this;
			
			if(w2ui['mapAssetList']){
    			w2ui['mapAssetList'].destroy();
    		}
			
			$("#mapAssetList").css("display", "block");
			
			$("#mapAssetTitle").html(this.currentItem.text + " List");
			
			$('#mapAssetContents').w2sidebar({
		        name : 'mapAssetList',
		        flatButton: false,
		        map : this._this,
		        /*flatButton: true,*/
		        /*flat : false,*/
		        style: 'width:150px;height:400px;',
		        
		        nodes : [
		        	 {id: 'root', text: 'root', img: 'icon-folder', expanded: true, group: true, groupShowHide: true}
		        ],
		        
		        onDblClick : function(event) {
		    	    console.log(event);
		        },
		        
				onClick : function(event) {
					console.log(event);
				}
			
		    });
			
			w2ui["mapAssetList"].get("root").nodes = data;
			
			_map.mapAssetListValidataFunc();
		},
		
		
		mapAssetListValidataFunc : function(){
			
			let _map = this;
			
			if(w2ui["mapAssetList"]){
				
				let container = $(_map.currentMap).attr("id");
				let assetList = w2ui["mapAssetList"].get("root").nodes;
				let useList = _map.mapData[container]["useList"];
				let currentList = _map.mapData[container]["currentList"];
				for(var i =0; i < assetList.length; i++){
					let item = assetList[i];
					/*
					 *  초기화 Start
					 * */
					item.draggable = true;
					w2ui["mapAssetList"].enable(item.assetId);
					/*
					 * 초기화 End
					 * */
					
					let currentArr = _.filter(currentList, function(d){
						return item.assetId === d.assetId;
					});
					
					if(currentArr.length > 0){
						//해당 맵의 자산이라면 
						item.nodeStyle = "";
					}else{
						let useArr = _.filter(useList, function(d){
							return item.assetId === d.assetId;
						});
						
						if(useArr.length > 0){
							//해당맵의 자산이 아니면서 다른곳에서 사용중이라면
							item.nodeStyle = _map.useColor;
						}else{
							//해당맵의 자산이 아니면서 다른곳에서 사용중이지 않다면
							item.nodeStyle = "";
						}
						
					}
					
				}
				
				let svgContainer = $(_map.currentMap).attr("id") + "-svg";
				//맵에서 사용중인 심볼은 자산 리스트에서 사용방지 드래그 방지
				d3.select("#"+svgContainer).selectAll(".yes-symbol").attr("id", function(){
					w2ui["mapAssetList"].disable(this.id);
					let item = w2ui["mapAssetList"].get(this.id);
					if(item !== null){
						item.draggable = false;
					}
					return this.id;
				});
				
				w2ui["mapAssetList"].refresh();
			}
		},
		
		//ToolBox Asset Type List를 적용하는곳
		setMapList : function(data){
			let _map = this;
			
			$('#sideBar').w2sidebar({
		        name : 'sideBar',
		        flatButton: false,
		        map : this,
		        flat : true,
		        style: 'width:40px;',
		        
		        nodes : [
		        	 {id: 'root', text: 'root', img: 'icon-folder', expanded: true, group: true, groupShowHide: true}
		        ],
		        
		       onClick: function(event) {
		    	    
		            let item = w2ui["sideBar"].get(event.target);
		            
		            if(item.draggable) return;
		            
		            if(this.map.currentItem && this.map.currentItem.id === item.id ){
		            	//중복일경우 return Save, Clear, Properties 예외
		            	if(item.iconType !== "EditorIcon"){
		            		return ;
		            	}
		            	
		            }else{
		            	this.map.currentItem = item;
		            }
		            
		            switch(item.text){
			            case 'Group':
			            	//Group일때는 아무것도 하지 않음 Drag만 인정
			            	break;
			            case 'Save':
			            	this.map.listNotifiCation('setSaveEditor');
			            	break;
			            case 'Clear':
			            	w2confirm('해당 맵의 심볼을 전부 삭제 하시겠습니까?', '알림').yes(function(){
				    			let container = $(_map.currentMap).attr("id");
				    			
				    			let svgContainer = $(_map.currentMap).attr("id") + "-svg";
				    			d3.selectAll('#'+svgContainer + ' #svgContainer .yes-symbol').remove();
				    			
				    			_map.mapAssetListValidataFunc();
				    			
			            	}).no(function(){
			            		
			            	});
			            	
			            	break;
			            case 'Properties':
			            	$("#propsInfo").css("display", "block");
			            	break;
			            case 'Align':
			            	$("#alignsBox").css("display", "block");
			            	break;
			            case 'Exit':
			            	//차후 팝업 처리
			            	w2confirm('저장하고 끝내시겠습니까?', '알림').yes(function(){
			            		_map.setSaveEditor();
			            	}).no(function(){
			            		_map.closeMode();
			            	});
			            	break;
			            default : 
			            	this.map.listNotifiCation('getAssetList', item.id);
			            	$("#mapAssetList").addClass('stop');
			            	break;
			            	
		            }
		        }
			
		    });
			
			w2ui["sideBar"].get("root").nodes = data;
			w2ui["sideBar"].refresh();
			
			this.registerEventListener();
		},
		
		/*
		 * Set listNotifiCation End
		 * */
		
		addSymbol : function(eventFlug, event){ //eventFlug:한번만 수행하기 위한 변수
			let _map = this;
			
			let svgTag = "";
			
			//SVG Tag 정의
			switch(_map.selectIcon.name){
				case "Group":
					svgTag = _map.groupIcon;
					break;
				default :
					//해당 심볼 다시 드래그 못하게
					if(w2ui["mapAssetList"]){
						w2ui["mapAssetList"].disable(_map.mapEditor.selectIcon.assetId);
						let item = w2ui["mapAssetList"].get(_map.mapEditor.selectIcon.assetId);
						if(item !== null){
							item.draggable = false;
						}
						
						w2ui["mapAssetList"].refresh();
					}
					svgTag = _map.selectIcon.symbolSvg;
					break;
			}
				
	    	let parseEl = jQuery.parseXML(svgTag);
	    	
	    	parseEl = parseEl.documentElement; //svg code만 추출
	    	
	    	$(parseEl).attr("class", "yes-symbol");
	    	
	    	$(parseEl).attr("symbol-type", _map.currentItem.name);
	    	
			let symbol = _map.mapEditor.makeSVG(parseEl.tagName, parseEl.attributes); //SVG Tag로 감싸주는 역활
			
			switch(_map.selectIcon.name){
				case "Group":
					$(symbol).attr("id", util.createUID()); //Group Symbol UID 부여
					break;
				default : 
					$(symbol).attr("id", _map.mapEditor.selectIcon.assetId); //symbol ID 부여
					break;
			}
			
			$('#'+_map.currentMap.id + '-svg #svgContainer').append(symbol);
			
			for(var i=0; i < parseEl.children.length; i++){
				let item = parseEl.children[i];
				
				switch(i.toString()){
					case "0" : //image
						$(item).attr("class", "symbol-img-bg");
						break;
					case "1" : //Severity bg
						$(item).attr("class", "severity-bg");
						break;
					case "2" : //border
						$(item).attr("class", "severity-border").attr("filter", "url(#mapBlur)").attr("fill", "#fff");
						break;
					case "3" : //text
						$(item).attr("fill", "white").attr("class", "symbol-text");
						break;
				}
				
				let element = _map.makeSVG(item.tagName, item.attributes, item);
				
				if(item.tagName === "text"){
					switch(_map.selectIcon.name){
						case "Group":
							element.innerHTML = _.uniqueId('Group_');
							break;
						default : 
							element.innerHTML = _map.mapEditor.selectIcon.text;
							break;
					}
				}
				
				$(symbol).append(element);
			}
			
			let point = {};
			point.x = event.offsetX - symbol.getBBox().width/2;
			point.y = event.offsetY - symbol.getBBox().height/2;
			
			let svgContainer = $(_map.currentMap).attr("id") + "-svg";
			let svgContainerWidth = $('#'+svgContainer).width() - symbol.getBBox().width;
			let svgContainerHeight = $('#'+svgContainer).height() - symbol.getBBox().height;
			
			//심볼 텍스트에 의해 넓어진 너비 값을 담는 변수
			let resultX = _map.symbolTextSizeCheck(symbol);
			
			//심볼이 SVG 영역 밖으로 나갈경우 안으로 넣기
			if(point.x  < 5 + resultX) point.x  = 5 + resultX; //minX
			if(point.y  < 5) point.y  = 5; //minY
			if(point.x-resultX > svgContainerWidth) point.x = svgContainerWidth + resultX - 5 ; //maxX
		 	if(point.y > svgContainerHeight) point.y = svgContainerHeight - 5; //maxY
			
			$(symbol).attr('transform', 'translate('+ point.x  +','+ point.y +') scale(1) rotate(0)');
			
			$(symbol).attr('orgWidth',  symbol.getBBox().width);
			
			$(symbol).attr('orgHeight',  symbol.getBBox().height);
			
			_map.dragEventRegister(symbol, eventFlug);
			
			_map.mapEditor.selectIcon = null;
		},
		
		drawSelectBox : function(item){
			
			//테두리가 있다면 먼저 지우고 사이즈 측정
			d3.select(item).select('.selectSymbol').remove();
			
			let bBox = item.getBBox();
			
			let orgWidth = Math.round(parseFloat($(item).attr("orgWidth")));
			let currentWidth = parseInt(bBox.width);
			
			d3.select(item).append("rect")
			.attr("width", bBox.width+5)
			.attr("height", bBox.height+5)
			.classed("selectSymbol", true)
			.style("fill", "none")
			.style("stroke", "#00e7ff")
			.style("x", function(){
				let orgWidth = Math.round(parseFloat($(item).attr("orgWidth")));
				let currentWidth = parseInt(bBox.width);
				if(orgWidth < currentWidth ){
					return (currentWidth+5 - orgWidth) / 2 * -1 ;  
				}else{
					return -2.5;
				}
			})
			.style("y", "-2.5")
			.style("stroke-width", "1px");
		},
		
		selectItemCheck : function(item){
			//console.log("selectItemCheck");
			let items = _.filter(this.selectItem, function(data){
				return $(data).attr("id") == $(item).attr("id")
			});
			
			if(event.ctrlKey){
				//multi select
				if(items.length > 0){
					//중복 선택
					d3.select(item).select(".selectSymbol").remove();
					this.selectItem = _.without(this.selectItem, item); //중복 대상을 제외
				}else{
					//중복 선택이 아닐 경우
					this.drawSelectBox(item);
					this.selectItem.push(item);
					
				}
			}else{
				//single select
				if(items.length > 0){
					d3.selectAll(".selectSymbol").remove();
					this.selectItem = _.without(this.selectItem, item);
					this.drawSelectBox(item);
				}else{
					d3.selectAll(".selectSymbol").remove();
					this.drawSelectBox(item);
					this.selectItem = [];
					this.selectItem.push(item);
				}
				
			}
			
			if(this.selectItem.length > 1){
				this.maxminCheck();
			}
			
			/*
			 * Properties POPUP Check
			 * */
			this.propertiesCheck();
			
		},
		
		propertiesCheck : function(){
			
			let fields = [];
			let record = {};
			
			if(this.selectItem.length > 0){
				let lastNum = this.selectItem.length -1; 
				let item = this.selectItem[lastNum];
				let symbolType = $(item).attr("symbol-type");
				
				switch(symbolType){
					case "Group":
						fields = [
							{name : 'changeName', type : 'text', html:{caption:'Change Name'}, disabled:false, required:false}
						]
						break;
					default : 
						fields = [
							{name : 'changeName', type : 'text', html:{caption:'Change Name'}, disabled:true, required:false}
						]
						break;
				}
				
				record = {
						changeName : d3.select(item).select("text").html()
				}
				
				
			}else{
				fields = [
					{name : 'changeName', type : 'text', html:{caption:'Change Name'}, disabled:true, required:false}
				]
				
				record = {
						changeName : ""
				}
				
			}
			
			w2ui["propsInfoContents"].fields = fields
			w2ui["propsInfoContents"].record = record;
			
			w2ui["propsInfoContents"].refresh();
			
		},
		
		maxminCheck : function(){
			//최대값과 최소값을 구하는곳
			this.maxMinPosition = {}
			var tempArr = [];
			for(var i =0; i < this.selectItem.length; i++ ){
				 let temp = this.selectItem[i];
				 
				 let transformAttr = d3.select(temp).attr("transform").split(" ");
				 let symbolTranslate = _.find(transformAttr, function(d, i){
					 return d.indexOf("translate") > -1;
				 });
				 
				 let currentPos = symbolTranslate.replace("translate(", "").replace(")","").split(",");
				 
				 let obj = {x : parseFloat(currentPos[0]), y : parseFloat(currentPos[1])};
				 tempArr.push(obj);
				 
				 if(i ===0){
					 this.maxMinPosition.minX = obj.x;
					 this.maxMinPosition.itemMinX = temp;
					 this.maxMinPosition.maxX = obj.x + temp.getBBox().width;
					 this.maxMinPosition.itemMaxX = temp;
					 this.maxMinPosition.minY = obj.y;
					 this.maxMinPosition.itemMinY = temp;
					 this.maxMinPosition.maxY = obj.y + temp.getBBox().height;
					 this.maxMinPosition.itemMaxY = temp;
				 }else{
					 
					 //Max Min에 따른 심볼 사이즈가 필요해서 직접 구현
					 
					 //minX를 구하는데 같은 좌표라면 크기가 큰 심볼을 대상으로 함.
					 if(this.maxMinPosition.minX >= obj.x){
						 this.maxMinPosition.itemMinX = temp;
						 this.maxMinPosition.minX = obj.x;
					 }
					 //maxX를 구하는데 같은 좌표라면 크기가 큰 심볼을 대상으로 함.
					 if(this.maxMinPosition.maxX <= obj.x + temp.getBBox().width){
						 this.maxMinPosition.itemMaxX = temp;
						 this.maxMinPosition.maxX = obj.x + temp.getBBox().width;
					 }
					 
					 //minY를 구하는데 같은 좌표라면 크기가 큰 심볼을 대상으로 함.
					 if(this.maxMinPosition.minY >= obj.y){
						 this.maxMinPosition.itemMinY = temp;
						 this.maxMinPosition.minY = obj.y;
					 }
					 
					//maxY를 구하는데 같은 좌표라면 크기가 큰 심볼을 대상으로 함.
					 if(this.maxMinPosition.maxY <= obj.y + temp.getBBox().height){
						 this.maxMinPosition.itemMaxY = temp;
						 this.maxMinPosition.maxY = obj.y + temp.getBBox().height;
					 }
					 
				 }
				 
			}
			
		},
		
		deleteItemCheck : function(){
			let _map = this;
			let svgContainer = $(_map.currentMap).attr("id") + "-svg";
			for(var i=0; i < _map.selectItem.length; i++){
				let item = _map.selectItem[i];
				let itemId = $(item).attr("id");
				
				if(w2ui["mapAssetList"] && w2ui["mapAssetList"].get(itemId)){
					w2ui["mapAssetList"].enable(itemId);
					w2ui["mapAssetList"].get(itemId).draggable = true;
				}
				d3.select("#"+svgContainer).selectAll("#"+itemId).remove();
			}
			
			if(w2ui["mapAssetList"]){
				w2ui["mapAssetList"].refresh();
			}
			
		},
		
		//Text에 의해 길어진 너비의 값을 구하는 메소드
		symbolTextSizeCheck : function(item){
			 let bBox = item.getBBox();
			 let orgWidth = Math.round(parseFloat($(item).attr("orgWidth")));
			 let currentWidth = parseInt(bBox.width);
			 let result = 0
			 if(orgWidth < currentWidth ){
				 result = (currentWidth - orgWidth) / 2;
			 }
			return result; 
		},
		
		attrMakeHandler :  function(item){
			 var itemAttr = {};
			 var symbolAttrArr = d3.select(item).attr("transform").split(" ");
			 
			 itemAttr.id = d3.select(item).attr("id");
			 
			 //이동 좌표
			 itemAttr.symbolTranslate = _.find(symbolAttrArr, function(d, i){
				 return d.indexOf("translate") > -1;
			 });
			 
			 //스케일
			 itemAttr.symbolScale = _.find(symbolAttrArr, function(d, i){
				 return d.indexOf("scale") > -1;
			 });
		 	 
			 //회전
			 itemAttr.symbolRotate = _.find(symbolAttrArr, function(d, i){
				 return d.indexOf("rotate") > -1;
			 });
			 
			 let currentPosArr = itemAttr.symbolTranslate.replace("translate(", "").replace(")","").split(",");
			 
			 //좌표값을 Float 형태로 저장
			 itemAttr.currentPos = {x:parseFloat(currentPosArr[0]), y : parseFloat(currentPosArr[1])};
			 
			 itemAttr.x = parseFloat(currentPosArr[0]);
			 itemAttr.y = parseFloat(currentPosArr[1]);
			 
			 itemAttr.item = item;
			 
			 return itemAttr;
		 },
		
		dragEventRegister : function(symbol, eventFlug){ //eventFlug Map에 처음 등록할때만
			
			let _map = this;
			 
			//console.log("eventFlug : " +eventFlug);
			
			if(eventFlug !== undefined && eventFlug){
				//처음 add할때만 사용
				_map.symbolClickEventListener(symbol);
			}
			
			 d3.select(symbol)
			 .on("mousedown", function(){
				 console.log("symbol mousedown");
				 _map._sceneClickAble = false; //svg click event 방해
				 _map.symbolClickAble = true; //symbol click 여부 판단
				 let symbolAttrArr = d3.select(this).attr("transform").split(" ");
				 let symbolTranslate = _map.symbolTranslate = _.find(symbolAttrArr, function(d, i){
					 return d.indexOf("translate") > -1;
				 });
				 
				 //심볼의 기준점을 기억하는 변수
				 let currentPos = symbolTranslate.replace("translate(", "").replace(")","").split(",");
				 _map.position = {};
				 _map.position.x = event.offsetX - parseFloat(currentPos[0]);
				 _map.position.y = event.offsetY - parseFloat(currentPos[1]);
				 
				 /*console.log("x : "+ event.offsetX);
				 console.log("y : "+ event.offsetY);*/
				 
				 if(_map.selectItem.length > 1){
					 //선택된 심볼들의 움직일 수 있는 경계를 계산
					 let position = {};
					 position.x = event.offsetX - _map.position.x;
					 position.y = event.offsetY - _map.position.y;
					 
					 let svgContainer = $(_map.currentMap).attr("id") + "-svg";
					 //선택한 심볼이 움직일수 있는 영역을 계산(그룹화 영역을 계산)
					 
					 let resultMinX = _map.symbolTextSizeCheck(_map.maxMinPosition.itemMinX);
					 let resultMaxX = _map.symbolTextSizeCheck(_map.maxMinPosition.itemMaxX);
					 
					 _map.minimumX = position.x - _map.maxMinPosition.minX + resultMinX; //minX
					 _map.minimumY = position.y - _map.maxMinPosition.minY; //minY
					 _map.maximumX =  $('#'+svgContainer).width() -  _map.maxMinPosition.maxX + position.x + resultMaxX; //maxX
					 _map.maximumY = $('#'+svgContainer).height() - _map.maxMinPosition.maxY + position.y; //maxY
					 
					 //각 심볼별 처음 좌표값을 저장
					 for(var i = 0; i < _map.selectItem.length; i++){
						 let child = _map.selectItem[i];
						 if(this.id !== child.id){ //현재 클릭한 심볼이 아닌경우 위치값 계산
							 let tempArr = d3.select(child).attr("transform").split(" ");
							 let tempAttr = _.find(tempArr, function(d,i){
								 return d.indexOf("translate") > -1;
							 });
							 
							 let symbolScale = _.find(tempArr, function(d, i){
								 return d.indexOf("scale") > -1;
							 });
						 	 
						 	let symbolRotate = _.find(tempArr, function(d, i){
								 return d.indexOf("rotate") > -1;
							 });
							 
							let childTransform =  tempAttr.replace("translate(", "").replace(")", "").split(",");
							 console.log(childTransform);
							 _map.position[child.id] = {
									 x : parseFloat(childTransform[0]) - position.x, 
									 y : parseFloat(childTransform[1]) - position.y,
									 scale : symbolScale,
									 rotate : symbolRotate
							 };
						 }
						 
					 } //for i End
					 
				 }
			 })
			 .on("mouseup", function(d){
				// console.log("symbol mouseup");
				 _map._sceneClickAble = true;
				 _map.position = {};
				 
				 if(_map.symbolClickAble){
					 //drag 하지 않고 click만 했을 경우
					 _map.symbolClickAble = false;
				 }
				 
			 })
			 .on("keydown", function(){
				 /*
				  * 마우스 이동과 알고리즘이 다른점은 키 이동시에는 미리 이동할 값을 더한후 조건에 만족하면 실행하는 방식이기 때문에 
				  * 심볼이 경계로 넘어갔을때 예외 처리가 없음.
				  * */
				 
				 //console.log("keydown : " + event.keyCode);
				 var svgContainer = $(_map.currentMap).attr("id") + "-svg";
				 var svgContainerWidth = $('#'+svgContainer).width();
				 var svgContainerHeight = $('#'+svgContainer).height();
				 
				 //이동 간격
				 var singleMoveGap = 1;
				 var shiftMoveGap = 5;
				 // 총 이동 gap
				 var totalMove = 0; 
				 var boundaryLine = 5; //MapEditor 경계선 Padding
				 var resultX = 0; //심볼 Text에 의해 넓어진 너비를 담는 변수
				 //Single Select
				 if(_map.selectItem.length === 1){
					 var singleItem = _map.attrMakeHandler(this); //선택한 심볼의 속성값을 추출해서 object로 넘겨주는 메소드
					 //Text Size에 의해 너비가 길어졌을때 길이를 계산
					 resultX = _map.symbolTextSizeCheck(this);
				 }
				 
				//Multi Select
				 if(_map.selectItem.length > 1){
					 if(event.shiftKey){
						 totalMove = shiftMoveGap;
					 }else{
						 totalMove = singleMoveGap;
					 }
				 }
				 
				 if(event.keyCode === 46){
					 console.log("delete keydown");
					 _map.deleteItemCheck();
				 }else if(event.keyCode  === 38){ 
					 //up
					 if(_map.selectItem.length > 1){
						//MutiSelect Symbol Move
						 //moving값을 계산하여 움직여도 된다면 적용
						 if(_map.maxMinPosition.minY - totalMove > boundaryLine ){
							 
							 for(var i=0; i <_map.selectItem.length; i++ ){
								 let symbol = _map.selectItem[i];
								 var symbolAttr = _map.attrMakeHandler(symbol);
								 
								 if(event.shiftKey){
									 totalMove = symbolAttr.currentPos.y - shiftMoveGap;
								 }else{
									 totalMove = symbolAttr.currentPos.y - singleMoveGap;
								 }
								 
								 d3.select(symbol).attr({
									 transform: "translate(" + symbolAttr.currentPos.x  + "," + totalMove + ") " + symbolAttr.symbolScale +  " " + symbolAttr.symbolRotate
								 }); 
							 }
							 
							 _map.maxminCheck();
						 }
						 
					 }else{
						 //Single Select Symbol Move
						 if(event.shiftKey){
							 totalMove = singleItem.currentPos.y - shiftMoveGap;
						 }else{
							 totalMove = singleItem.currentPos.y - singleMoveGap;
						 }
						 
						 if(totalMove < boundaryLine ) {
							 d3.select(this).attr({
								 transform: "translate(" + singleItem.currentPos.x + "," + boundaryLine + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 }); 
						 }else{
							 d3.select(this).attr({
								 transform: "translate(" + singleItem.currentPos.x + "," + totalMove + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 });
						 }
						 
					 }
				 }else if(event.keyCode  === 40){ 
					 //down
					 if(_map.selectItem.length > 1){
						//MutiSelect Symbol Move
						//moving값을 계산하여 움직여도 된다면 적용
						 if(_map.maxMinPosition.maxY + totalMove < svgContainerHeight ){
							 
							 for(var i=0; i <_map.selectItem.length; i++ ){
								 let symbol = _map.selectItem[i];
								 var symbolAttr = _map.attrMakeHandler(symbol);
								 
								 if(event.shiftKey){
									 totalMove = symbolAttr.currentPos.y + shiftMoveGap;
								 }else{
									 totalMove = symbolAttr.currentPos.y + singleMoveGap;
								 }
								 
								 d3.select(symbol).attr({
									 transform: "translate(" + symbolAttr.currentPos.x  + "," + totalMove + ") " + symbolAttr.symbolScale +  " " + symbolAttr.symbolRotate
								 }); 
							 }
							 
							 _map.maxminCheck();
						 }
					 }else{
						 //Single Select Symbol Move
						 if(event.shiftKey){
							 totalMove = singleItem.currentPos.y + shiftMoveGap;
						 }else{
							 totalMove = singleItem.currentPos.y + singleMoveGap;
						 }
						 
						 if(totalMove > svgContainerHeight ) {
							 d3.select(this).attr({
								 transform: "translate(" + singleItem.currentPos.x + "," + svgContainerHeight + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 }); 
						 }else{
							 d3.select(this).attr({
								 transform: "translate(" + singleItem.currentPos.x + "," + totalMove + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 });
						 }
						 
					 }
				 }else if(event.keyCode  === 37){ 
					 //left
					 if(_map.selectItem.length > 1){
						 //minX에 위치한 Symbol Text에 의해 크기가 커졌을 경우 커진 값 계산 
						 resultX = _map.symbolTextSizeCheck(_map.maxMinPosition.itemMinX);
						 
						 if(_map.maxMinPosition.minX - totalMove - resultX > boundaryLine ){
							 
							 for(var i=0; i <_map.selectItem.length; i++ ){
								 let symbol = _map.selectItem[i];
								 var symbolAttr = _map.attrMakeHandler(symbol);
								 
								 if(event.shiftKey){
									 totalMove = symbolAttr.currentPos.x - shiftMoveGap;
								 }else{
									 totalMove = symbolAttr.currentPos.x - singleMoveGap;
								 }
								 
								 d3.select(symbol).attr({
									 transform: "translate(" + totalMove  + "," + symbolAttr.currentPos.y + ") " + symbolAttr.symbolScale +  " " + symbolAttr.symbolRotate
								 }); 
							 }
							 
							 _map.maxminCheck();
						 }
						 
					 }else{
						 
						 if(event.shiftKey){
							 totalMove = singleItem.currentPos.x - shiftMoveGap;
						 }else{
							 totalMove = singleItem.currentPos.x - singleMoveGap;
						 }
						 
						 if(totalMove < boundaryLine + resultX ) {
							 d3.select(this).attr({
								 transform: "translate(" + (boundaryLine + resultX) + "," + singleItem.currentPos.y + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 }); 
						 }else{
							 d3.select(this).attr({
								 transform: "translate(" + totalMove + "," + singleItem.currentPos.y + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 });
						 }
					 }
				 }else if(event.keyCode  === 39){ 
					 //right
					 if(_map.selectItem.length > 1){
						//minX에 위치한 Symbol Text에 의해 크기가 커졌을 경우 커진 값 계산 
						 resultX = _map.symbolTextSizeCheck(_map.maxMinPosition.itemMaxX);
						 
						 if(_map.maxMinPosition.maxX + totalMove + resultX < svgContainerWidth ){
							 
							 for(var i=0; i <_map.selectItem.length; i++ ){
								 let symbol = _map.selectItem[i];
								 var symbolAttr = _map.attrMakeHandler(symbol);
								 
								 if(event.shiftKey){
									 totalMove = symbolAttr.currentPos.x + shiftMoveGap;
								 }else{
									 totalMove = symbolAttr.currentPos.x + singleMoveGap;
								 }
								 
								 d3.select(symbol).attr({
									 transform: "translate(" + totalMove  + "," + symbolAttr.currentPos.y + ") " + symbolAttr.symbolScale +  " " + symbolAttr.symbolRotate
								 }); 
							 }
							 
							 _map.maxminCheck();
						 }
					 }else{
						 if(event.shiftKey){
							 totalMove = singleItem.currentPos.x + shiftMoveGap;
						 }else{
							 totalMove = singleItem.currentPos.x + singleMoveGap;
						 }
						 
						 if(totalMove - resultX > svgContainerWidth ) {
							 d3.select(this).attr({
								 transform: "translate(" + (svgContainerWidth + resultX) + "," + singleItem.currentPos.y + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 }); 
						 }else{
							 d3.select(this).attr({
								 transform: "translate(" + totalMove + "," + singleItem.currentPos.y + ") " + singleItem.symbolScale +  " " + singleItem.symbolRotate
							 });
						 }
					 }
				 }
				 
				 
			 })
			 .on("keyup", function(){
				 
			 })
			 .on("focus", function(){
				 //console.log("focus");
			 })
			 /*.on("click", function(){
				 console.log("symbol click");
				 event.stopPropagation();
				 if(_map.moveCheckHandler(this)){
					//움직이지 않았다면 
					 _map.selectItemCheck(this);
				 }else{
					 //움직였다면
					 //이동 했다면 선택한 본인만 Select
					 if(_map.selectItem.length > 1){
						 //MultiSelect
						 _map.maxminCheck();
						 
					 }else{
						 //Single Select
						 d3.selectAll(".selectSymbol").remove();
						 
						 _map.drawSelectBox(this);
						 
						 _map.selectItem = [];
						 
						 _map.selectItem.push(this); 
					 }
				 }
				 
			 })*/
			 .call(d3.behavior.drag().on("dragstart", function(){
				 d3.event.sourceEvent.stopPropagation();
			 })
			 .on("drag", function(){
				 
				 console.log("symbol drag");
				 
				 if(_map.symbolClickAble){
					 
					 let svgContainer = $(_map.currentMap).attr("id") + "-svg";
					 
					 let itemSize = {};
					 if(_map.selectItem.length > 1){
						 itemSize.width = _map.maxMinPosition.itemMaxX.getBBox().width;
						 itemSize.height = _map.maxMinPosition.itemMaxY.getBBox().height;
					 }else{
						 itemSize.width = this.getBBox().width;
						 itemSize.height = this.getBBox().height;
					 }
					 
					 let svgContainerWidth = $('#'+svgContainer).width() - itemSize.width;
					 let svgContainerHeight = $('#'+svgContainer).height() - itemSize.height;
					 
					 let symbolAttrArr = d3.select(this).attr("transform").split(" ");
					 
					 if(!_map.position.hasOwnProperty("x")){
							//기준점이 없다면 _map.position값이 없다면 생성
							 let symbolTranslate = _.find(symbolAttrArr, function(d, i){
								 return d.indexOf("translate") > -1;
							 });
							 
							 let currentPos = symbolTranslate.replace("translate(", "").replace(")","").split(",");
							 
							 _map.position.x = event.offsetX - parseFloat(currentPos[0]);
							 _map.position.y = event.offsetY - parseFloat(currentPos[1]);
					 }
					 
					 //심볼 drag시 0.0 중심축이동을 막기 위해 좌표를 이동 시켜줌 (선택한 곳 그대로 이동하기 위함)
					 let position = {};
					 /*console.log("x : "+ d3.event.x);
					 console.log("y : "+ d3.event.y);*/
					 position.x = d3.event.x - _map.position.x;
					 position.y = d3.event.y - _map.position.y;
					
					 let symbolScale = _.find(symbolAttrArr, function(d, i){
						 return d.indexOf("scale") > -1;
					 });
				 	 
				 	let symbolRotate = _.find(symbolAttrArr, function(d, i){
						 return d.indexOf("rotate") > -1;
					 });
				 	
				 	//Symbol font Width까지 체크 해야함.
					 if(_map.selectItem.length > 1){
						 
						 if(position.x < _map.minimumX - 5) position.x = _map.minimumX + 5; //minX
						 if(position.y < _map.minimumY - 5) position.y = _map.minimumY + 5; //minY
						 if(position.x > _map.maximumX) position.x  = _map.maximumX; //maxX
						 if(position.y > _map.maximumY) position.y  = _map.maximumY; //maxX
						 
						 for(var i=0; i <_map.selectItem.length; i++ ){
							 let symbol = _map.selectItem[i];
							 if(symbol.id === this.id){
								 d3.select(this).attr({
									 transform: "translate(" + position.x  + "," + position.y + ") " + symbolScale +  " " + symbolRotate
								 });
							 }else{
								let currentPos = _map.position[symbol.id];
								d3.select(symbol).attr({
									 transform: "translate(" + (position.x + currentPos.x) + "," + (position.y + currentPos.y)  + ") " + currentPos.scale +  " " + currentPos.rotate
								 });
							 }
							 
						 }
						
					 }else{
						 //텍스트에 의해 너비가 길어졌을 경우 이동할 수 있는 거리를 재조정함.
						 let resultX = _map.symbolTextSizeCheck(this);
						 
						 if(position.x  < 5 + resultX) position.x  = 5 + resultX; //minX
						 if(position.y  < 5) position.y  = 5; //minY
						 if(position.x-resultX > svgContainerWidth) position.x = svgContainerWidth + resultX - 5 ; //maxX
					 	 if(position.y > svgContainerHeight) position.y = svgContainerHeight - 5; //maxY
					 	 
					 	 d3.select(this).attr({
							 transform: "translate(" + position.x  + "," + position.y + ") " + symbolScale +  " " + symbolRotate
						 });
					 }
				 }
				 
			 }).on("dragend", function(d){
				console.log("dragend");
				if(!_map.moveCheckHandler(this)){ //drag를 했다면
					//Drag해서 화면 밖으로 나갔을때를 대비해서 여기서도 체크
					_map.symbolClickAble = false;
					_map._sceneClickAble = true; //drag out 
					_map.maxminCheck();
				}
				
				/* Mouse Out 시 드래그 종료하는 프로세스
				let svgContainer = $(_map.currentMap).attr("id") + "-svg";
				let svgContainerWidth = $('#'+svgContainer).width() - this.getBBox().width;
				let svgContainerHeight = $('#'+svgContainer).height() - this.getBBox().height;
				if(d3.event.x < 0 || d3.event.y < 0 || d3.event.x > $('#'+svgContainer).width() || d3.event.y > $('#'+svgContainer).height()){
					console.log("move Out 입니다.")
				}*/
				
			 }))
			
		},
		
		moveCheckHandler : function(symbol){
			let symbolAttrArr = d3.select(symbol).attr("transform").split(" ");
			 let symbolTranslate = _.find(symbolAttrArr, function(d, i){
				 return d.indexOf("translate") > -1;
			 });
			 
			 //좌표 비교로 이동 여부 체크
			 let orgArr = this.symbolTranslate.replace("translate(", "").replace(")", "").split(",");
			 let currentArr = symbolTranslate.replace("translate(", "").replace(")", "").split(",");
			 
			 if(parseInt(orgArr[0]) === parseInt(currentArr[0]) && parseInt(orgArr[1]) === parseInt(currentArr[1]) ){
				 return true;
			 }else{
				 return false;
			 }
		},
		
		clearSeverity : function(mapId){
			d3.selectAll("#"+mapId+"-svg #svgContainer").selectAll('.yes-symbol').selectAll('.severity-bg').classed("severity-critical", false);
			d3.selectAll("#"+mapId+"-svg #svgContainer").selectAll('.yes-symbol').selectAll('.severity-bg').attr("fill", "none");
		},
		
		editMode : function(id){
			
			if(this.statusMode === 'editor') return;
			
			let _map = this;
			
			this.statusMode = 'editor';
			
			this.currentMap = this.mapAC[id]; //현재 Map 저장
			
			let mapType = $('#'+id).attr('type');
			
			if(mapType === 'list'){
				this.listNotifiCation('getMapListType', id);
			}else if(mapType === 'map'){
				let svgContainer = $(_map.currentMap).attr("id") + "-svg";
				let transform = $("#"+svgContainer+ " #svgContainer").attr("transform").replace("scale(", "").replace(")","").split(",");
				
				if(transform >= 0.9){
					this.mapEditorFunc(id);
				}else{
					w2alert('해상도가 작아서 편집을 할 수 없습니다.<br>해상도를 조절 후 다시 시도해 주시기 바랍니다.', '알림', function(){
						_map.removeHandler(true);
					});
				}
				
			}else{
				w2alert('정의되지 않은 맵 타입 입니다.<br>맵 타입을 확인하세요.', '알림');
			}
		},
		
		mapEditorFunc : function(id){
			
			let _map = this;
			
			_map.clearSeverity(id);
			
			//툴박스 리스트 조회
			this.listNotifiCation("getMapList", id);
				
			$(this.currentMap).addClass('mapEditor'); //Editor Mode
			
			//MapEdit Tool Bar popup
			var dragDiv = '<div id="sideMenu" class="ui-widget-content" style="position:absolute;">'+
							  	'<div id="sideBar"></div>'+
							  '</div>';	
			
			//Asset List popup
			var assetDiv = '<div id="mapAssetList" style="position:absolute;">'+
								'<div id="mapAssetTitleArea">'+
									'<div id="mapAssetTitle" class="mapTitleArea"></div>'+
									'<div id="mapAssetTitleClose" class="mapCloseArea">'+
										'<i class="fas fa-times" id="assetCloseBtn"></i>'+
									'</div>'+
								'</div>'+
								'<div id="mapAssetContents"></div>'+
							  '</div>';
			
			//Properties popup
			var propsDiv = '<div id="propsInfo" style="position:absolute;">'+
									'<div id="propsTitleArea">'+
										'<div id="propsTitle" class="mapTitleArea">Symbol Properties</div>'+
										'<div id="propsTitleClose" class="mapCloseArea">'+
											'<i class="fas fa-times" id="propsCloseBtn"></i>'+
										'</div>'+
									'</div>'+
									
									'<div id="propsInfoContents">'+
										 '<div class="w2ui-page page-0">'+
									       /* '<div class="w2ui-field">'+
									            '<label>Org Name :</label>'+
									            '<div>'+
									                '<input name="originalName" type="text" maxlength="100" size="60" style="width:100px;"/>'+
									            '</div>'+
									        '</div>'+*/
									        '<div class="w2ui-field">'+
									            '<label>Change Name :</label>'+
									            '<div>'+
									                '<input name="changeName" type="text" maxlength="20" size="60" style="width:120px;"/>'+
									            '</div>'+
									        '</div>'+
									    '</div>'+
									'</div>'+
								'</div>';
			
			var alignsDiv = '<div id="alignsBox" style="position:absolute;">'+
									'<div id="alignsTitleArea">'+
										'<div id="alignsTitle" class="mapTitleArea"> Aligns</div>'+
										'<div id="alignsTitleClose" class="mapCloseArea">'+
											'<i class="fas fa-times" id="alignsCloseBtn"></i>'+
										'</div>'+
										
										'<div id="alignsBoxContents">'+
											'<i class="fab fa-yes-align_left mapAlign" title="Left" id="leftAlign"></i>'+
											'<i class="fab fa-yes-align_horizontal mapAlign" title="Horizontal Center" id="horizontalCenterAligin"></i>'+
											'<i class="fab fa-yes-align_right mapAlign" title="Right" id="rightAlign"></i>'+
											'<span class="partitionCls">|</span>'+
											'<i class="fab fa-yes-align_top mapAlign" title="Top" id="topAlign"></i>'+
											'<i class="fab fa-yes-align_vitical mapAlign" title="Vertical Center" id="verticalCenterAlign"></i>'+
											'<i class="fab fa-yes-align_bottom mapAlign" title="Bottom" id="bottomAlign"></i>'+
											'<span class="partitionCls">|</span>'+
											'<i class="fab fa-yes-distribute_h mapAlign" title="Vertical Distribute Align" id="verticalDisAlign"></i>'+
											'<i class="fab fa-yes-distribute_v mapAlign" title="Horizontal Distribute Align" id="horizontalDisAlign"></i>'+
										'</div>'+
									'</div>'+
							  '</div>';
			
			$(this.currentMap).append(dragDiv, assetDiv, propsDiv, alignsDiv);
			
			$("#propsInfoContents").w2form({
				name : 'propsInfoContents',
				map : _map,
				style:"border:1px solid rgba(0,0,0,0); width:262px;height:100px;",
				fields : [
					{name : 'changeName', type : 'text', html:{caption:'Change Name'}, disabled:true, required:false}
				],
				
				onChange : function(event){
					let map = w2ui["propsInfoContents"].map;
					if(map.selectItem.length > 0){
						let item = map.selectItem[map.selectItem.length -1];
						d3.select(item).select("text").html(event.value_new);
						map.drawSelectBox(item);
					}
				}
			});
			
			//현재 맵에 drag & drop Event를 활성화
			$(this.currentMap)
			.on("dragenter", function(event){
				console.log("onDragEnter");
				event.preventDefault();
			    $(_map.currentMap).addClass("dragover");
			    
			}).on("dragover", function(event){
				console.log("onDragOver");
				event.preventDefault(); 
			    if(!$(_map.currentMap).hasClass("dragover")){
			    	$(_map.currentMap).addClass("dragover");
			    }
			    
			}).on("dragleave", function(event){
				console.log("onDragLeave");
				event.preventDefault();
			    $(_map.currentMap).removeClass("dragover");
			    
			}).on("drop", function(event){
				console.log("onDrop");
				event.preventDefault();
			    $(_map.currentMap).removeClass("dragover");
			    
			    //MapEditor가 아닌 다른 element의 삽입을 막기 위해서 
			    if(_map.selectIcon){
			    	// drop Process 처리후 null 처리
			    	if(_map.selectIcon.name === "Group"){
			    		_map.addSymbol(true, event);
			    	}else{
			    		if(_map.selectIcon.nodeStyle !== ""){
			    			// "" 아니라는것은 다른곳에서 사용중이라는 뜻
							w2confirm('다른 그룹에서 사용 중인 자산 입니다.</br>여기에 배치 하시겠습니까?', '알림').yes(function(){
								_map.addSymbol(true, event);
							}).no(function(){
								return;
							});
						}else{
							_map.addSymbol(true, event);
						}
			    	}
			    	
			    }
			    
			});
			
			let gap = 5;
			
			$("#sideMenu").css({top: $(this.currentMap).position().top+gap, left : $(this.currentMap).position().left+gap}); //sideMenu Position
			
			$("#mapAssetList").css({top: $(this.currentMap).position().top+gap, left : $(this.currentMap).position().left+$("#sideMenu").width() + gap * 3}); //sideMenu Position
			
			let bottomPos =  $(this.currentMap).position().top + $(this.currentMap).height() - $("#propsInfo").height() - gap;
			
			$("#propsInfo").css({top: bottomPos, left : $(this.currentMap).position().left+gap}); //sideMenu Position
			
			let rightPos =  $(this.currentMap).position().left + $(this.currentMap).width() - $("#alignsBox").width() - gap;
			
			$("#alignsBox").css({top: $(this.currentMap).position().top+gap, left : rightPos }); //sideMenu Position
			
			$( "#sideMenu" ).draggable({
				containment : $('.content .wrap'),
				cancel: ".stop" //멈출때 사용하는 클래스 지정
			});
			
			$("#sideMenu").addClass('stop');
			
			$( "#mapAssetList" ).draggable({
				containment : $('.content .wrap'),
				cancel: ".stop" //멈출때 사용하는 클래스 지정
			});
			
			$( "#propsInfo" ).draggable({
				containment : $('.content .wrap'),
				cancel: ".stop" //멈출때 사용하는 클래스 지정
			});
			
			$( "#alignsBox" ).draggable({
				containment : $('.content .wrap'),
				cancel: ".stop" //멈출때 사용하는 클래스 지정
			});
			
			let svgContainer = $(this.currentMap).attr("id") + "-svg";
			
			d3.selectAll('#'+svgContainer + ' .yes-symbol').attr("id", function(){
				_map.dragEventRegister(this);
				return $(this).attr("id");
			});
		},
		
		registerEventListener : function(){
			
			let _map = this;
			
			let svgContainer = $(_map.currentMap).attr("id") + "-svg";
			
			/*
			 * Align Event Start
			 * */
			$(document).on("click", "svg.mapAlign", function(event){
				
				let targetName = event.currentTarget.id;
				
				if(_map.selectItem.length > 1){
					
					if(targetName === "verticalDisAlign" || targetName === "horizontalDisAlign" ){
						
						let alignArr = [];
						//선택된 심볼들의 너비와 높이의 총 합계
						let itemTotalWidth = 0; 
						let itemTotalHeight = 0;
						
						for(var j=0; j < _map.selectItem.length; j++){
							let item = _map.selectItem[j];
							let itemArr = _map.attrMakeHandler(item);
							alignArr.push(itemArr);
							
							//심볼 전체의 width height 구하기 제일 마지막 심볼은 빼기
							if(j < _map.selectItem.length-1){
								itemTotalWidth += item.getBBox().width;
								itemTotalHeight += item.getBBox().height;
							}
							
						}
						
						var resultArr = []; //정렬된 값을 가지고 있는 변수
						var symbolGap = 0; //symbol간의 간격 계산
						if(targetName === "horizontalDisAlign"){
							resultArr = _.sortBy(alignArr, 'x');
							symbolGap = (_map.maxMinPosition.maxX - _map.maxMinPosition.itemMaxY.getBBox().width - _map.maxMinPosition.minX - itemTotalWidth) / (resultArr.length-1);
						}else{
							resultArr = _.sortBy(alignArr, 'y');
							symbolGap = (_map.maxMinPosition.maxY - _map.maxMinPosition.itemMaxY.getBBox().height - _map.maxMinPosition.minY - itemTotalHeight) / (resultArr.length-1);
						}
						
						/*if(symbolGap < 0) return;*/
						
						//첫번째 아이템
						var totalSum = 0;
						for(var k=0; k < resultArr.length-1; k++){
							let itemAttr = resultArr[k];
							if(k !== 0){
								let prevItemAttr = _map.attrMakeHandler(resultArr[k-1].item); //이전 심볼 좌표가 변경되기 때문에 새로가져옴
								if(targetName === "horizontalDisAlign"){
									totalSum = prevItemAttr.x + prevItemAttr.item.getBBox().width + symbolGap;
									
									d3.select(itemAttr.item).attr({
										 transform: "translate(" + totalSum  + "," + itemAttr.y + ") " + itemAttr.symbolScale +  " " + itemAttr.symbolRotate
									 }); 
								}else{
									totalSum = prevItemAttr.y + prevItemAttr.item.getBBox().height + symbolGap;
									
									d3.select(itemAttr.item).attr({
										 transform: "translate(" + itemAttr.x  + "," + totalSum + ") " + itemAttr.symbolScale +  " " + itemAttr.symbolRotate
									 }); 
								}
								
							}
						}
						
					}else{
						//수평 가운데 중심점
						let horizontalAlignCenterValue = _map.maxMinPosition.minX + (_map.maxMinPosition.maxX -  _map.maxMinPosition.minX) / 2; 
						//수직 가운데 중심점
						let verticalAlignCenterValue = _map.maxMinPosition.minY + (_map.maxMinPosition.maxY -  _map.maxMinPosition.minY) / 2;
						
						for(var i=0; i < _map.selectItem.length; i++ ){
							let item = _map.selectItem[i];
							
							//symbol의 좌표, 크기, 회전 정보를 가지고 있는 변수
							let itemArr = _map.attrMakeHandler(item);
							 
							switch(targetName){
								case "leftAlign" :
									 d3.select(item).attr({
										 transform: "translate(" + _map.maxMinPosition.minX  + "," + itemArr.currentPos.y + ") " + itemArr.symbolScale +  " " + itemArr.symbolRotate
									 }); 
									break;
								case "horizontalCenterAligin" :
									if(_map.maxMinPosition.minX === _map.maxMinPosition.maxX) return;
									let itemHCenter = horizontalAlignCenterValue - item.getBBox().width/2;
									
									d3.select(item).attr({
										 transform: "translate(" + itemHCenter  + "," + itemArr.currentPos.y + ") " + itemArr.symbolScale +  " " + itemArr.symbolRotate
									 });
									
									if(horizontalAlignCenterValue !== (itemHCenter + item.getBBox().width/2)){
										
									}
									break;
								case "rightAlign" :
									d3.select(item).attr({
										 transform: "translate(" + (_map.maxMinPosition.maxX - item.getBBox().width)  + "," + itemArr.currentPos.y + ") " + itemArr.symbolScale +  " " + itemArr.symbolRotate
									 }); 
									break;
									
								case "topAlign" :
									d3.select(item).attr({
										 transform: "translate(" + itemArr.currentPos.x  + "," + _map.maxMinPosition.minY + ") " + itemArr.symbolScale +  " " + itemArr.symbolRotate
									 }); 
									break;
								case "verticalCenterAlign" :
									if(_map.maxMinPosition.minY === _map.maxMinPosition.maxY) return;
									let itemVCenter = verticalAlignCenterValue - item.getBBox().height/2 ;
									d3.select(item).attr({
										 transform: "translate(" + itemArr.currentPos.x   + "," + itemVCenter + ") " + itemArr.symbolScale +  " " + itemArr.symbolRotate
									 }); 
									break;
								case "bottomAlign" :
									d3.select(item).attr({
										 transform: "translate(" + itemArr.currentPos.x  + "," + (_map.maxMinPosition.maxY - item.getBBox().height) + ") " + itemArr.symbolScale +  " " + itemArr.symbolRotate
									 }); 
									break;
									
								default :
									console.log("등록이 안된 정렬 방식 입니다.");
									break;
							}
							
						}
						
					}
					
					_map.maxminCheck();
				}
			});
			
			/*
			 * SVG Container Event Start
			 * **/
			$(document).on("mousedown", "#" +svgContainer, function(event){
				if(_map._sceneClickAble){
					console.log("svg mousedown");
					_map._drawRectAble = true; 
					
					let svgContainer = $(_map.currentMap).attr("id") + "-svg";
					let containerTransform = $("#" + svgContainer+" #svgContainer").attr("transform");
					let currentScale = containerTransform.replace("scale(", "").replace(")","");
					_map.selectBoxPosition = {};
					
					/*_map.selectBoxPosition.x = event.offsetX + (event.offsetX * (1-currentScale));
					_map.selectBoxPosition.y = event.offsetY + (event.offsetY * (1-currentScale));*/
					
					_map.selectBoxPosition.x = event.offsetX;
					_map.selectBoxPosition.y = event.offsetY;
					
					let rectScale = "scale("+ (1 +  (1-currentScale)) +")";
					
					d3.select("#" + svgContainer+" #svgContainer").append('rect')
					.attr('id', 'selectBox')
					.attr('width', 0)
					.attr('height', 0)
					.attr('x', _map.selectBoxPosition.x)
					.attr('y', _map.selectBoxPosition.y)
					/*.attr("transform" , rectScale)*/
					.style('fill', 'rgba(134, 215, 231, 0.3)')
					.style('stroke', 'white')
					.style('stroke-width', '2px')
					.style('opacity', '0.5');
					
				}
			});
			
			$(document).on("keydown", "#" +svgContainer, function(event){
				//console.log("svg keydown");
			});
			
			$(document).on("mouseup", "#" +svgContainer, function(event){
				if(_map._sceneClickAble && _map._drawRectAble){
						//console.log("svg mouseup");
						var svgContainer = $(_map.currentMap).attr("id") + "-svg";
						_map.selectBoxSize = {};
						_map.selectBoxSize.minX = parseInt(d3.select("#selectBox").attr("x"));
						_map.selectBoxSize.maxX = _map.selectBoxSize.minX + $('#selectBox').width();
						_map.selectBoxSize.minY = parseInt(d3.select("#selectBox").attr("y"));
						_map.selectBoxSize.maxY = _map.selectBoxSize.minY + $('#selectBox').height();
						
						let minSize = 10; //select Box 최소값 이상만 인식하게
						
						if($('#selectBox').width() > minSize && $('#selectBox').height() > minSize){
							
							if(!event.ctrlKey){
								//Ctrl key를 누르지 않고 드래그 했다면 초기화
								_map.selectItem = [];
								d3.selectAll('#'+svgContainer + ' #svgContainer .selectSymbol').remove();
							}
						
							//선택 박스가 어느정도 클 경우에만
							d3.selectAll('#'+svgContainer + ' #svgContainer .yes-symbol').attr("symbol-type", function(d){
								let transformAttr = d3.select(this).attr("transform").split(" ");
								let symbolTranslate = _.find(transformAttr, function(d, i){
									 return d.indexOf("translate") > -1;
								});
								 
								let currentPos = symbolTranslate.replace("translate(", "").replace(")","").split(",");
								let obj = {minX : parseFloat(currentPos[0]), minY : parseFloat(currentPos[1])};
								obj.maxX = obj.minX + this.getBBox().width;
								obj.maxY = obj.minY +  this.getBBox().height;
								
								if(_map.selectBoxSize.minX <= obj.minX 
										&& _map.selectBoxSize.maxX >= obj.maxX  
										&& _map.selectBoxSize.minY <= obj.minY
										&& _map.selectBoxSize.maxY >= obj.maxY
										){
									
									if(event.ctrlKey){
										_map.selectItemCheck(this);
									}else{
										_map.selectItem.push(this);
										_map.drawSelectBox(this);
									}
									
								}
								
								return $(this).attr("symbol-type");
							});
						}else{
							
							if(event.ctrlKey){
								
							}else{
								_map.selectItem = [];
								d3.selectAll(".selectSymbol").remove();
							}
						}
						
						if(_map.selectItem.length > 0){
							//keyEvent를 주기 위해서 focus를 할당 함.
							_.each(_map.selectItem, function(d, i){
								$(d).focus();
								return d;
							});
						}
						
						if(_map.selectItem.length > 1){ //여러개가 선택되어있을 경우에만 multiBox 사용
							_map.maxminCheck();
						}
						
						_map.propertiesCheck();
						
						_map._drawRectAble = false;
						
						d3.select("#selectBox").remove();
				}
			});
			
			$(document).on("mousemove", "#" +svgContainer, function(event){
				if(_map._sceneClickAble && _map._drawRectAble){
					//console.log("svg mousemove");
					
					let symbol = {};
					
					if(event.offsetX > _map.selectBoxPosition.x){
						symbol.width = event.offsetX - _map.selectBoxPosition.x; //L > R Drag
						d3.select("#selectBox").attr('x', _map.selectBoxPosition.x).attr('width', symbol.width);
					}else if(event.offsetX < _map.selectBoxPosition.x){
						symbol.width = _map.selectBoxPosition.x - event.offsetX; //R > L Drag
						d3.select("#selectBox").attr('x', event.offsetX).attr('width', event.offsetX + symbol.width);
					}else{
						d3.select("#selectBox").attr('x', _map.selectBoxPosition.x).attr('width', 0);
					}
					
					if(event.offsetY > _map.selectBoxPosition.y){
						symbol.height = event.offsetY - _map.selectBoxPosition.y; //T > D Drag
						d3.select("#selectBox").attr('y', _map.selectBoxPosition.y).attr('height', symbol.height);
					}else if(event.offsetY < _map.selectBoxPosition.y){
						symbol.height = _map.selectBoxPosition.y - event.offsetY; //D > T Drag
						d3.select("#selectBox").attr('y', event.offsetY).attr('height', event.offsetY + symbol.height);
					}else{
						d3.select("#selectBox").attr('y', _map.selectBoxPosition.y).attr('height', 0);
					}
					
					d3.select("#selectBox").attr('width', symbol.width).attr('height', symbol.height);
					
				}
				
			});
			/*
			 * Tool Box Event Start
			 * */
			
			//툴박스 클릭시 
			 $(".mapEditor #sideMenu .w2ui-node-group").mousedown(function(event){
				 $("#sideMenu").removeClass('stop');
			 });
			 
			 $(".mapEditor #sideMenu .w2ui-node-group").mouseup(function(event){
				 $("#sideMenu").addClass('stop');
			 });
			 
			 $(".w2ui-node-data.w2ui-node-flat.Group").mousedown(function(event){
				 _map.currentItem = _map.selectIcon = w2ui["sideBar"].get($(event.target).attr("yesid"));
			 });
			 
			 /*
			  * Asset List Box Event Start
			  * */
			 $(".mapEditor #mapAssetTitleArea, .mapEditor #mapAssetTitle").mousedown(function(event){
				 $("#mapAssetList").removeClass('stop');
			 });
				
			$(".mapEditor #mapAssetTitleArea, .mapEditor #mapAssetTitle").mouseup(function(event){
				$("#mapAssetList").addClass('stop');
			});
				
			$(document).on('mousedown', '.mapEditor #mapAssetList .w2ui-node', function(event){
				$("#mapAssetList").addClass('stop');
				 _map.selectIcon = w2ui["mapAssetList"].get(event.target.id.split("_")[1]);
			});
			 
			//Asset List Close Btn Click
			$(document).on("click", ".mapEditor svg.fa-times", function(event){
				let selectId = event.currentTarget.id;
				switch(selectId){
					case "assetCloseBtn" :
						$("#mapAssetList").css("display", "none");
						_map.currentItem = null; //같은 자산을 다시 누를 경우를 대비해서
						break;
					case "propsCloseBtn" :
						$("#propsInfo").css("display", "none");
						break;
					case "alignsCloseBtn" :
						$("#alignsBox").css("display", "none");
						break;
					default : 
						w2alert(selectId + " : Service 등록이 안되어 있는 버튼 입니다.", "알림");
						break;
				}
				
			});
			
			 /*
			  * Properties Box Start
			  * */
			$('.mapEditor #propsInfoContents').mousedown(function(event){
				$("#propsInfo").addClass('stop');
			});
			
			$('.mapEditor #propsInfoContents').mouseup(function(event){
				//다시 이동가능하게
				$("#propsInfo").removeClass('stop');
			});
			
		},
		
		removeHandler : function(flug){
			
			let svgContainer = $(this.currentMap).attr("id") + "-svg";
			
			//closeBtn
			$(document).off("click", ".mapEditor svg.fa-times")
			
			//Align Event
			$(document).off("click", "svg.mapAlign");
			
			//SVG Container Event
			//$(document).off("click", "#" +svgContainer); 
			$(document).off("mousedown", "#" +svgContainer);
			$(document).off("mouseup", "#" +svgContainer);
			$(document).off("mousemove", "#" +svgContainer);
			
			//Toolbar Event
			$(".mapEditor #sideMenu .w2ui-node-group").off();
			$(".w2ui-node-data.w2ui-node-flat.Group").off();
			
			//Asset List Event
			$(".mapEditor #mapAssetTitleArea, .mapEditor #mapAssetTitle").off();
			$(document).off("mousedown", '.mapEditor #mapAssetList .w2ui-node');
			
			//Properties 
			$('.mapEditor #propsInfoContents').off();
			
			//svg Drag & drop out
			d3.selectAll(".yes-symbol").on("mouseup", null);
			d3.selectAll(".yes-symbol").on("mousedown", null);
			d3.selectAll(".yes-symbol").on("keyup", null);
			d3.selectAll(".yes-symbol").on("keydown", null);
			d3.selectAll(".yes-symbol").on("focus", null);
			/*d3.selectAll(".yes-symbol").on("click", null);*/
			d3.selectAll(".yes-symbol").on("mousedown.dragstart", null);
			d3.selectAll(".yes-symbol").on("mousedown.drag", null);
			d3.selectAll(".yes-symbol").on("mousedown.dragend", null);
			
			this.selectItem = []; //선택된 심볼 해제
			
			d3.selectAll(".selectSymbol").remove();
			
			$(this.currentMap).off();
			
			if(w2ui['sideBar']){
    			w2ui['sideBar'].destroy();
    		}
			
			if(w2ui['mapAssetList']){
    			w2ui['mapAssetList'].destroy();
    		}
			
			if(w2ui["propsInfoContents"]){
				w2ui["propsInfoContents"].destroy();
			}
			
			if(w2ui["mapLeftTree"]){
				w2ui["mapLeftTree"].destroy();
			}
			
			if(w2ui["availableGrid"]){
				w2ui["availableGrid"].destroy();
			}
			
			if(w2ui["selectedGrid"]){
				w2ui["selectedGrid"].destroy();
			}
			
			this.currentItem = null;
			
			this.selectIcon = null;
			
			this.statusMode = 'normal'; 
			
			if(document.getElementById("sideMenu")){
				$( "#sideMenu" ).draggable( "destroy" );
				$("#sideMenu").remove();
			}
			
			if(document.getElementById("mapAssetList")){
				$( "#mapAssetList" ).draggable( "destroy" );
				$("#mapAssetList").remove();
			}
			
			if(document.getElementById("propsInfo")){
				$( "#propsInfo" ).draggable( "destroy" );
				$("#propsInfo").remove();
			}
			
			if(document.getElementById("alignsBox")){
				$( "#alignsBox" ).draggable( "destroy" );
				$("#alignsBox").remove();
			}
			
			$(this.currentMap).removeClass('mapEditor');
			
			this.currentMap = null;
			
			this.mapTag = null;
			
			//SVG Mouse Over Out
			if(flug === undefined){
				$(document).off("mouseover", ".severity-bg, .symbol-img-bg, .symbol-text");
				$(document).off("mouseout", ".severity-bg .symbol-img-bg, .symbol-text");
				$(document).off("dblclick", ".severity-bg, .symbol-img-bg, .symbol-text");
				//경우에 따라서 click이 필요할것 같아서 살려둠.
				d3.selectAll(".yes-symbol").on("click", null);
				
				this.removeMapTimer(); //Timer 해제
				
				/*
				 * MapEditor List 할때 추가된것 또는 누락된것
				 * */
				$(document).off("click", "#mapMoveBtn");
				$(document).off("click", "svg#mapUpBtn");
				$(document).off("click", "svg#mapDownBtn");
				$(document).off("click", "svg#mapDelBtn");
					
				$(document).off("click", "#mapApplyBtn");
				$(document).off("click", ".mapNavi");
				$(document).off("contextmenu");
	        	$(document).off("click","body");
	        	
			}
		},
		
		closeMode : function(){
			let _map = this;
			
			let mapName = $(_map.currentMap).attr("id");
    		_map.mapData[mapName] = null;
    		
    		let svgContainer = mapName + "-svg";
			d3.selectAll('#'+svgContainer + ' #svgContainer .yes-symbol').remove();
			
			_map.removeHandler(true);
			_map.initTimer();
		}
}
