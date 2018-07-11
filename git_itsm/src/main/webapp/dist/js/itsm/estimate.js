define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/itsm/estimate",
    "w2ui",
    "js/lib/component/BundleResource",
    "text!views/itsm/estimateSvg",
    "css!cs/itsm/estimate"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource,
	estimateSvg
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var that;
	var Model = Backbone.Model.extend({
		model : Model,
		url : 'estimate',
		parse : function(result){
			return { data : result };
		}
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.getYearList = []; //연도 리스트
			this.getPeriodTypeList = []; //기간 타입 리스트
			this.getMailStatusList = []; //메일 상태(발송/미발송) 리스트
			this.getValidityList = []; //유효기간 리스트
			this.codeList = []; //자산 타입 리스트
			
			this.estimateId = null; //등록 견적 아이디
			this.projectId = null; //등록 프로젝트 아이디
			this.mailSendEstimateId = null; //팝업에서 메일 보낸 견적 아이디
			this.selectAddItem = null;
			this.previewBtnPress = false; //미리보기 버튼 눌렀는지 여부
			this.sendMail = false; //팝업에서 메일 보냈는지 여부
			this.currentEstimate = null; //현재 팝업의 정보
			this.getSelectEstimate = null; //더블 클릭한 견적 정보
			this.requestParam = null;
			this.daysAgo = util.daysAgo(30);
			
			this.getEstimateParameters();
			
			this.selectItem = null;
			this.elements = {
					leftMap : {},
					leftRecordMap : [],
					rightMap : {},
					rightRecordMap : []
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
        	}
		},
		
		events: {
        	'click #estMgrSearchBtn' : 'getEstimateData', //조회 버튼
			'click #estMgrRegisterBtn' : 'estimateRegisterPopup', //견적 등록
			'click #estMgrDelBtn' : 'estimateDelete', //견적 삭제
			'click #estMgrEditBtn' : 'estimateEdit', //견적 수정
//			'dblclick .estimate-preview-btn' : 'estimatePreview', //미리보기 버튼
//			'click #estimateUnSendStatusBtn' : 'estimateMailPopup' //메일 전송 버튼
        },
		
		eventListenerRegister : function(){
			document.addEventListener("mailSuccess", this.estimateMailSuccessHanlder);
			$(document).on('click', "#getSiteList", this.settingSite); //업체 선택
			$(document).on('click', "#productAddBtn", this.productAdd); //제품 추가
			
			//제품 삭제
			$(document).on('click', "#productDelBtn", function(e){
				
				let selectItems = w2ui["estMgr_product_list_grid"].get(w2ui["estMgr_product_list_grid"].getSelection());
				
				for(var i=0; i < selectItems.length; i++){
					let item = selectItems[i];
					estMgr.elements.leftMap[item.product_id] = item;
					delete estMgr.elements.rightMap[item.product_id];
				}
				w2ui['estMgr_product_list_grid'].delete(selectItems);
				
				estMgr.productChangeAction();
			});
			
			$(document).on('click', "#estMgrDeleteOKBtn", this.estimateDeleteOK); //견적 삭제 OK
			$(document).on('click', "#estMgrEstimatePreviewBtn", this.estimatePreviewPopup); //저장확인 및 프리뷰 생성확인
			$(document).on('click', ".estMgrEstimatePreviewOKBtn", this.estimatePreviewPopupOK); //저장확인 및 프리뷰 생성확인 OK 
			$(document).on('click', "#estMgrRegisterSaveBtn", this.checkProcess); //중간 저장(insert/update)
			$(document).on('click', "#estMgrRegisterMailBtn", this.estimateMailPopup); //팝업에서 메일 발송확인
			$(document).on('click', ".estMgrRegisterMailBtnOK", this.estimateMailPopupOK); //팝업에서 메일 발송확인 OK
			$(document).on('click', "#estMgrAddEstimateBtn", this.estimateAddPopup); //팝업에서 견적 추가
			$(document).on('click', ".estMgrEstimateAddOKBtn", function(e){
				setTimeout(function(data){
					estMgr.estMgrEstimateAddOK(); //견적 추가 OK
				}, 300);
			});
			
			//제품 타입 ComboBox
        	$(document).on('change', '#productModelType', function(e){
        		var selectItem = e.currentTarget.value;
        		that.refreshProductTable(selectItem);
        	});
        	
        	//제품 선택
        	$(document).on('click', '#proRightBtn', function(e){
        		estMgr.productValidation();
        		if($("#proRightBtn").prop('disabled')){
            		return;
            	}
        		var selectArr = w2ui['estMgr_product_available'].getSelection();
        		
        		if(selectArr.length > 0){
        			//선택한 항목이 있으면
        			var leftMap = estMgr.elements.leftMap;
        			var rightMap = estMgr.elements.rightMap;
        			
        			for(var i=0; i<selectArr.length; i++){
        				var item = w2ui['estMgr_product_available'].get(selectArr[i]);
        				rightMap[item.product_id] = item;
        				estMgr.elements.rightMap[item.product_id] = rightMap[item.product_id];
        				delete leftMap[item.product_id];
        			}
        			
        			var leftDataProvider = [];
        			var rightDataProvider = [];
        			
        			for(var name in leftMap){
        				leftDataProvider.push(leftMap[name]);
        			}
        			
        			for(var name in rightMap){
        				rightDataProvider.push(rightMap[name]);
        			}
        			
        			var rightImAC = _.sortBy(rightDataProvider, "product_id");
        			for(var m=0; m<rightImAC.length; m++){
        				var item = rightImAC[m];
        				item.recid = m+1;
        			}
        			
        			estMgr.elements.rightRecordMap = rightImAC;
        			w2ui['estMgr_product_selected'].records = rightImAC;
        			w2ui['estMgr_product_selected'].refresh();
        			w2ui['estMgr_product_selected'].selectNone();
        			
        			var leftImAC = _.sortBy(leftDataProvider, "product_id");
        			for(var m=0; m<leftImAC.length; m++){
        				var item = leftImAC[m];
        				item.recid = m+1;
        			}
        			
        			estMgr.elements.leftRecordMap = leftImAC;
        			w2ui['estMgr_product_available'].records = leftImAC;
        			w2ui['estMgr_product_available'].refresh();
        			w2ui['estMgr_product_available'].selectNone();
        		}
        	});
        	
        	//제품 선택 해제
        	$(document).on('click', '#selectedDelBtn', function(e){
        		var selectArr = w2ui['estMgr_product_selected'].getSelection();
        		
        		if(selectArr.length > 0){
        			//선택한 항목이 있으면
        			var leftMap = estMgr.elements.leftMap;
        			var rightMap = estMgr.elements.rightMap;
        			
        			for(var i=0; i<selectArr.length; i++){
        				var item = w2ui['estMgr_product_selected'].get(selectArr[i]);
        				leftMap[item.product_id] = item;
        				estMgr.elements.leftMap[item.product_id] = leftMap[item.product_id];
        				delete rightMap[item.product_id];
        			}
        			
        			var leftDataProvider = [];
        			var rightDataProvider = [];
        			
        			for(var name in leftMap){
        				leftDataProvider.push(leftMap[name]);
        			}
        			
        			for(var name in rightMap){
        				rightDataProvider.push(rightMap[name]);
        			}
        			
        			var rightImAC = _.sortBy(rightDataProvider, "product_id");
        			for(var m=0; m<rightImAC.length; m++){
        				var item = rightImAC[m];
        				item.recid = m+1;
        			}
        			
        			estMgr.elements.rightRecordMap = rightImAC;
        			w2ui['estMgr_product_selected'].records = rightImAC;
        			w2ui['estMgr_product_selected'].refresh();
        			w2ui['estMgr_product_selected'].selectNone();
        			
        			var leftImAC = _.sortBy(leftDataProvider, "product_id");
        			for(var m=0; m<leftImAC.length; m++){
        				var item = leftImAC[m];
        				item.recid = m+1;
        			}
        			
        			estMgr.elements.leftRecordMap = leftImAC;
        			w2ui['estMgr_product_available'].records = leftImAC;
        			w2ui['estMgr_product_available'].refresh();
        			w2ui['estMgr_product_available'].selectNone();
        		}
        	});
        	
        	$(document).on("dblclick", ".svgGroup", function(event){
				console.log(event);
				if(w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0].status == 2){
					estMgr.estimateMailPopup();
				}else{
					estMgr.estimateEdit();
				}
			});
			
		},
		
		removeEventListener : function(){
			$(document).off('click', "#getSiteList");
			$(document).off('click', "#productAddBtn");
			$(document).off('click', "#productDelBtn");
			$(document).off('click', "#estMgrDeleteOKBtn");
			$(document).off('click', "#estMgrEstimatePreviewBtn");
			$(document).off('click', ".estMgrEstimatePreviewOKBtn");
			$(document).off('click', "#estMgrRegisterSaveBtn");
			$(document).off('click', "#estMgrRegisterMailBtn");
			$(document).off('click', ".estMgrRegisterMailBtnOK");
			$(document).off('click', "#estMgrAddEstimateBtn");
			$(document).off('click', ".estMgrEstimateAddOKBtn");
			
			$(document).off('change', "#productModelType");
			$(document).off('click', "#proRightBtn");
			$(document).off('click', "#selectedDelBtn");
			document.removeEventListener("mailSuccess", this.estimateMailSuccessHanlder);
			$(document).off("dblclick", ".svgGroup");
		},
		
		getEstimateParameters : function(){
			var model = new Model();
			model.url = '/estimate/getEstimateParameters';
			model.fetch();
			this.listenTo(model, 'sync', this.setEstimateParameters);
		},
		
		setEstimateParameters : function(method, model, options){
			this.getYearList = model[0].year;
			this.getPeriodTypeList = model[0].period;
			this.getMailStatusList = model[0].mailStatus;
			this.getValidityList = model[0].validity;
			this.getYearData(this.getYearList[0].text);
			
			this.init();
			this.getEstimateData();
		},
		
		getYearData : function(year){
			var model = new Model();
			model.url = '/estimate/getYearData/'+year;
			model.fetch();
			this.listenTo(model, 'sync', this.setYearData);
		},
		
		setYearData : function(method, model, options){
			$("#send").val(model.send);
			$("#unsend").val(model.unsend);
		},
		
		getEstimateData : function(){
			var startRow = 0;
    		var endRow = 9; 
			var item = w2ui['estimate_search_options'].record;
			var selectedDayMonth = $("#searchDayMonth").val();
			var selectedFromDate = $("#searchFromPeriod").val();
			var selectedToDate = $("#searchToPeriod").val();
			var siteName = item.siteName;
			var manager = item.manager;
			var delEmpty = null;
			var splitSite = [];
			var splitManager = [];
			
			if(selectedDayMonth == "" && selectedFromDate == "" && selectedToDate == ""){
				w2popup.open({
            		width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.estimate.info'),
    		        body: '<div class="w2ui-centered">'+BundleResource.getString('label.estimate.noSelectDate')+'</div>',
                    opacity   : '0.5',
             		modal     : true,
        		    showClose : true
    		    });
			}else{
				if(siteName != "" && siteName != null){
					delEmpty = siteName.replace(/ /gi, "");
					splitSite = delEmpty.split(',');
				}else if(manager != "" && manager != null){
					delEmpty = manager.replace(/ /gi, "");
					splitManager = delEmpty.split(',');
				}
				
				this.requestParam = {
						siteName : splitSite,
						manager : splitManager,
						status : item.status.value,
						searchType : item.searchType.id,
						searchFromPeriod : selectedFromDate,
						searchToPeriod : selectedToDate,
						searchDayMonth : selectedDayMonth,
						startRow : startRow,
						endRow : endRow
				};
				
				var model = new Model(this.requestParam);
				model.url = '/estimate/searchEstimate';
				model.save(null, {
					success : function(model, response){
						console.log("Search Action Here");
						if($('#estMgrPager').data("twbs-pagination")){
							$('#estMgrPager').pager("destroy").off("click");
							var pageGroup = '<div class="estimate-pager" id="estMgrPager" data-paging="true"></div></div>';
							$("#estMgrPagerTable").html(pageGroup);
						}
						
						$('#estMgrPager').pager({
							"totalCount" : model.attributes.data.totalCount,
							"pagePerRow" : 9
						}).on("click", function (event, page) {
							var evtClass = $(event.target).attr('class');
							if(evtClass != 'page-link') return;
							
							var pagination = $('#estMgrPager').data('twbsPagination');
							
							var currentPage = pagination.getCurrentPage();
							
							var requestParam = estMgr.requestParam;
							
							var endRow = 9;
							var startRow = (currentPage*endRow) - endRow;
							
							var model = new Model();
							model.url = "/estimate/searchEstimate";
							model.set({"status" : requestParam.status, "siteName" : requestParam.siteName, "manager" : requestParam.manager, "searchType" : requestParam.searchType, 
								"searchDayMonth" : requestParam.searchDayMonth, "searchFromPeriod" : requestParam.searchFromPeriod, "searchToPeriod" : requestParam.searchToPeriod, 
								"startRow" : startRow, "endRow" : endRow});
							model.save();
							that.listenTo(model, "sync", that.refreshView);
							
						});
						
						var pagination = $('#estMgrPager').data('twbsPagination');
						var currentPage = pagination.getCurrentPage();
						
						$('#estMgrPager').pager('pagerTableCSS', ".estimate-pager .pagination", model.attributes.data.totalCount, currentPage);
						
						w2ui['estimate_list'].clear();
						w2ui['estimate_list'].records = model.attributes.data.result;
						w2ui['estimate_list'].refresh();
						itsmUtil.setEstimateStatus(w2ui['estimate_list'].records);
					},
					error : function(model, xhr, options){
						console.log("Error Get Estimate Data");
					}
				});
			}
		},
		
		refreshView : function(method, model, options){
			w2ui['estimate_list'].clear();
			w2ui['estimate_list'].records = model.result;
			w2ui['estimate_list'].refresh();
			itsmUtil.setEstimateStatus(w2ui['estimate_list'].records);
		},
		
		init : function(){
			estMgr = this;
			
			var cnvtDay = util.getDate("Day");
			var cnvtMonth = util.getDate("Month");
			var cnvtYear = util.getDate("Year");
			
			$("#estimateContentsDiv").w2layout({
				name : 'estMgr_layout',
				panels : [
					{type:'top', size:'11.5%', resizable:false, content:'<div id="searchContents"></div>'},
        			{type:'main', size:'100%', resizable:false, content:'<div id="mainContents"></div>'}
				]
			});
			
			var searchContents = '<div class="dashboard-panel" id="searchTop" style="width:100%;">'+
											'<div id="searchBottom">'+
												'<div class="w2ui-page page-0">'+
													 '<div class="search-options border" style="width:414px;">'+
											            '<div>'+
												            '<div class="w2ui-field">'+
													            '<label>연도</label>'+
										        				'<div>'+
																	'<input name="searchYear" type="list" size="15" />'+
										    					'</div>'+
										        			'</div>'+
										        			'<div class="w2ui-field email">'+
										        				'<label>발송</label>'+
																'<div>'+
																	'<i class="icon link far fa-envelope fa-2x" style="padding:2px; margin:-5px 20px -6px -51px;"></i>'+
																	'<input name="send" type="text" readonly="readonly" style="width:75px;" />'+
																'</div>'+
																'<label>미발송</label>'+
																'<div>'+
																	'<i class="icon link far fa-envelope fa-2x" style="padding:2px; margin:-5px 21px -6px -24px;"></i>'+
																	'<input name="unsend" type="text" readonly="readonly" style="width:75px;" />'+
																'</div>'+
										        			'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		'<div class="search-options border" style="width:324px;">'+
											            '<div>'+
												            '<div class="w2ui-field">'+
													            '<label>타입</label>'+
										        				'<div>'+
																	'<input name="searchType" type="list" size="15" />'+
										    					'</div>'+
										        			'</div>'+
										        			'<div class="w2ui-field">'+
										        				'<label>견적등록일</label>'+
										        				'<div id="dailyMonthly" class="w2ui-field" style="padding-right:0px;">'+
																	'<input name="searchDayMonth" type="searchDayMonth" size="15" />'+
																'</div>'+
										    					'<div class="periodic w2ui-field" style="padding-right:0px; color: #fff;">'+
										    						'<input name="searchFromPeriod" type="searchFromPeriod" size="15" /> ~ <input name="searchToPeriod" type="searchToPeriod" size="15" />'+
										    					'</div>'+
										        			'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		'<div class="search-options border" style="width:352px;">'+
											            '<div>'+
															'<div class="w2ui-field">'+
																'<label>업체명</label>'+
																'<div><input name="siteName" type="text" size="40" style="width:258px;" /></div>'+
															'</div>'+
															'<div class="w2ui-field">'+
										            			'<label>고객명</label>'+
										            			'<div><input name="manager" type="text" size="40"  style="width:258px;" /></div>'+
										            		'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		'<div class="search-options border" style="width:210px;">'+
											            '<div>'+
										            		'<div class="w2ui-field">'+
																'<label>STATUS</label>'+
																'<div><input name="status" type="list" size="15" /></div>'+
										            		'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		'<div style="float:left; margin-left:0px;">'+
											            '<div style="text-align: center; padding-top: 18px; float: right;">'+
											            	'<div><button id="estMgrSearchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.estimate.search') + '</button></div>'+
									            		'</div>'+
								            		'</div>'+//search-options
							            		'</div>'+//w2ui-page page-0
											'</div>'+//searchBottom
										'</div>';//dashboard-panel
			
			var mainContents = '<div id="mainTop">'+
										'<div class="align-left-btn">'+
											
										'</div>'+
									'</div>'+//mainTop
									'<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title">'+
							    			'<div class="estimateListTitle" style="float:left; padding:0px;">'+
							    				'<span>Estimate List</span>'+
							    			'</div>'+
							    			'<div class="align-right-btn">'+
												'<i id="estMgrRegisterBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
												'<i id="estMgrDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
												'<i id="estMgrEditBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
											'</div>'+
							    		'</div>'+
							    		
							    		'<div class="dashboard-contents">'+
							    			'<div id="mainBottom"></div>'+
							    			'<div class="pager-table-area" id="estMgrPagerTable">'+
												'<div class="estimate-pager" id="estMgrPager" data-paging="true"></div>'+
											'</div>'+
							    		'</div>'+
							    	'</div>';//dashboard-panel
			
			$("#searchContents").html(searchContents);
			$("#mainContents").html(mainContents);
			
			$("#searchBottom").w2form({
				name : 'estimate_search_options',
				focus : -1,
				fields : [
					{name : 'status', type : 'list', options : {items : estMgr.getMailStatusList}},
					{name : 'siteName', type : 'text'},
					{name : 'manager', type : 'text'},
					{name : 'send', type : 'text'},
					{name : 'unsend', type : 'text'},
					{name : 'searchType', type : 'list', options : {items : estMgr.getPeriodTypeList}},
					{name : 'searchYear', type : 'list', options : {items : estMgr.getYearList}},
					{name : 'searchDayMonth', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					status : estMgr.getMailStatusList[0],
					siteName : '',
					manager : '',
					send : '',
					unsend : '',
					searchYear : estMgr.getYearList[0],
					searchType : estMgr.getPeriodTypeList[2],
					searchDayMonth : cnvtDay,
					searchFromPeriod : estMgr.daysAgo,
					searchToPeriod : cnvtDay
				},
				onChange : function(event){
					var eventTarget = event.target;
					if("searchType" == eventTarget){
						console.log("Change Search Type");
						if(3 == event.value_new.id){ // 기간
							$(".periodic").show();
							$("#dailyMonthly").hide();
							
							$("#searchDayMonth").val('');
							$("#searchFromPeriod").val('');
							$("#searchToPeriod").val('');
							
							$("#searchFromPeriod").attr("placeholder", "yyyy-mm-dd");
							$("#searchToPeriod").attr("placeholder", "yyyy-mm-dd");
							
							$("#searchFromPeriod").val(estMgr.daysAgo);
							$("#searchToPeriod").val(cnvtDay);
							
						}else if(2 == event.value_new.id){ // 월간
							
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
					}else if("searchYear" == eventTarget){
						var parameter = event.value_new.text;
						estMgr.getYearData(parameter);
					}
				},
				onClick : function(event){
					event.onComplete = function(){
						console.log(event);
					}
				}
			});
			
			$("#dailyMonthly").hide();
			$('input[type=searchFromPeriod').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=searchToPeriod]')});
			$('input[type=searchToPeriod').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=searchFromPeriod]')});
			$("#searchYear").attr("placeholder", "YYYY");
			
			$("#mainBottom").w2grid({
				name : 'estimate_list',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false,
					selectColumn:false
				},
				multiSelect : false,
				recordHeight : 70,
				blankSymbol : "-",
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'projectName', caption: 'PROJECT', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'siteName', caption: 'COMPANY', size : '200px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'customerName', caption: 'MANAGER', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //고객명
         			{ field: 'totalAmount', caption: 'AMOUNT', size : '200px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render:'int'}, //견적금액
         			{ field: 'registrationDate', caption: 'REGISTRATION DATE', size : '200px', sortable: true, attr: 'align=center'}, //요청일자
         			{ field: 'comfirmedDate', caption: 'COMFIRMED DATE', size : '200px', sortable: true, attr: 'align=center'}, //견적일자
         			{ field: 'edition', caption: 'EDITION', size : '100px', sortable: true, attr: 'align=center'}, //Edition
         			{ field: 'status', caption: 'STATUS', size : '100px', sortable: true, attr: 'align=center',
 						render : function(record){
 							let tt = '<div id="divContainer'+record.recid+'" style="width:91px;height:70px;">'+
 							estimateSvg + 
	     					'</div>';
	     					return tt;
 						}
         			}, //메일 상태
         			{ field: 'previewId', caption: 'PREVIEW', size : '150px', sortable: true, attr: 'align=center',
         				render : function(record){
         					var html;
                		    if(record.previewId != undefined){//pdf
                			   	html = '<div><i class="icon link fab fa-preview fa-2x estimate-preview-btn" historyid='+record.previewId+'></i></div>';	   			   	
                		    }else{
                			   	html = '<div><i class="icon fab fa-preview fa-2x" historyid='+record.previewId+' ></i></div>';
                		    }
                		    return html;
         				}
         			}, //프리뷰
         			{ field: 'projectId', caption: 'PROJECT ID', hidden: true, sortable: true}, //프로젝트 아이디
         			{ field: 'estimateId', caption: 'ESTIMATE ID', hidden: true, sortable: true}, //견적 아이디
         			{ field: 'siteId', caption: 'SITE ID', hidden: true, sortable: true}, //업체 아이디
         			{ field: 'customerId', caption: 'CUSTOMER ID', hidden: true, sortable: true}, //고객 아아디
         			{ field: 'phone', caption: 'PHONE', hidden: true, sortable: true}, //고객 핸드폰
         			{ field: 'email', caption: 'EMAIL', hidden: true, sortable: true}, //고객 메일주소
         			{ field: 'payment', caption: 'PAYMENT', hidden: true, sortable: true}, //지불조건
         			{ field: 'warranty', caption: 'WARRANTY', hidden: true, sortable: true}, //보증기간
         			{ field: 'estimateTitle', caption: 'ESTIMATE ', hidden: true, sortable: true}, //견적제목
         			{ field: 'note', caption: 'NOTE', hidden: true, sortable: true}, //비고
				],
				onClick : function(event){
					event.onComplete = function(){
						estMgr.estimateGridValidation();
					}
				},
				onSelect : function(event){
					estMgr.estimateGridValidation();
				},
				onDblClick : function(event){
					event.onComplete = function(event){
						estMgr.estimateGridValidation();
						if(event.column != 8){
							estMgr.estimateEdit();
						}
						estMgr.select_grid_estimateId = w2ui['estimate_list'].get(w2ui["estimate_list"].getSelection())[0].estimateId;
					}
				},
				onSort : function(event){
					setTimeout(function(){
        				itsmUtil.setEstimateStatus(w2ui["estimate_list"].records);
        			}, 2);
				}
			});
			
			$("#estMgrDelBtn").prop('disabled', true);
			$("#estMgrDelBtn").removeClass('link');
			$("#estMgrEditBtn").prop('disabled', true);
			$("#estMgrEditBtn").removeClass('link');
			
			this.eventListenerRegister();
		},
		
		listNotifiCation : function(cmd){
			switch(cmd){
				case "getValidityList" :
					this.getValidityData(cmd); //유효기간
					break;
				case "getSiteList" : 
	    			this.getSiteData(cmd); //업체 리스트
	    			break;
				case "getModelList" :
					this.getModelData(cmd); //모델 리스트
					break;
				case "getModelTypeList" :
					this.getModelTypeData(cmd); //모델 타입 리스트
					break;
				case "getMailStatusList" :
					this.getMailStatusData(cmd); //메일 상태 리스트
					break;
			}
		},
		
		getValidityData : function(cmd){
			var model = new Model();
			model.url = 'estimate/'+cmd;
			model.fetch();
			this.listenTo(model, 'sync', this.setValidityData);
		},
		
		setValidityData : function(method, model, options){
			if(model.length > 0){
				for(var i in model){
					estMgr.getValidityList.push({text : model[i].codeName, value : model[i].col1});
				}
			}
		},
		
		getModelData : function(cmd){
			var model = new Model();
			model.url = 'estimate/'+cmd;
			model.fetch();
			this.listenTo(model, 'sync', this.setModelData);
		},
		
		setModelData : function(method, model, options){
			estMgr.elements.leftMap = [];
			
			if(model.length > 0){
				let datProvider = [];
				for(var i=0; i<model.length; i++){
					var item = model[i];
					let xFlug = true;
					for(let name in estMgr.elements.rightMap){
						if(item.product_id == name){
							xFlug = false;
						}
					}
					
					if(xFlug){
						estMgr.elements.leftMap[item.product_id] = item;
						datProvider.push(item);
					}
				}
				w2ui['estMgr_product_available'].records = datProvider;
				w2ui['estMgr_product_available'].refresh();
				
				
			}else{
				estMgr.elements.leftMap = [];
			}
		},
		
		getModelTypeData : function(cmd){
			var model = new Model();
			model.url = 'estimate/'+cmd;
			model.fetch();
			this.listenTo(model, 'sync', this.setModelTypeData);
		},
		
		setModelTypeData : function(method, model, options){
			estMgr.codeList = ["All"];
			
			if(model.length > 0){
				for(var i in model){
					estMgr.codeList.push(model[i].codeName);
				}
			}
		},
		
		renderModelTypeData : function(){
			var modelType = '<div id="productTypeBtnGrp" style="width:116px;height:50px;position:absolute;right:0px;top:4px;">'+
			'<div class="w2ui-field w2ui-span3">'+
			'<div><input type="list" id="productModelType" text="All" style="width:108px;" /></div>'+
			'</div>'+
			'</div>';
			
			$("#tb_estMgr_product_available_toolbar_right").append(modelType);
			
			$("#productModelType").w2field('list', {
				items : estMgr.codeList,
				selected : ['All']
			});
			
			$("#productModelType").data('selected', {text:'All'}).data('w2field').refresh();
		},
		
		getMailStatusData : function(cmd){
			var model = new Model();
			model.url = 'estimate/'+cmd;
			model.fetch();
			this.listenTo(model, 'sync', this.setMailStatusData);
		},
		
		setMailStatusData : function(method, model, options){
			if(model.length > 0){
				for(var i in model){
					estMgr.getMailStatusList.push({text : model[i].codeName, value : model[i].col1});
				}
			}
		},
		
		getEstimateProductData : function(){
			var selectEstId = null;
			if(w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0] == undefined){
				selectEstId = estMgr.mailSendEstimateId;
			}else{
				selectEstId = w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0].estimateId;
			}
			var model = new Model();
			model.url = 'estimate/getEstimateProductList/'+selectEstId;
			model.fetch();
			this.listenTo(model, 'sync', this.setEstimateProductData);
		},
		
		setEstimateProductData : function(method, model, options){
			var estimateTotal = null;
			if(w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0] == undefined){
				estimateTotal = _.where(w2ui['estimate_list'].records, {estimateId : estMgr.mailSendEstimateId})[0].totalAmount;
			}else{
				estimateTotal = w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0].totalAmount;
			}
			
			for(var i=0; i<model.length; i++){
				var estQty = model[i].quantity;
				var estUpr = model[i].u_price;
				var estAmt = estQty * estUpr;
				model[i].amount = estAmt;
			}
			w2ui['estMgr_product_list_grid'].summary[0].amount = estimateTotal;
			w2ui['estMgr_product_list_grid'].records = model;
			w2ui['estMgr_product_list_grid'].refresh();
			
			estMgr.elements.rightMap = [];
			
			for(var i=0; i< model.length; i++){
				let item = model[i];
				estMgr.elements.rightMap[item.product_id] = item;
			}
			
		},
		
		estimateRegisterPopup : function(){
			estMgr.estimateGridValidation();
			if($("#estMgrRegisterBtn").prop('disabled')){
				return;
			}
			
			if(w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection()).length == 0){
				estMgr.estimateRegister();
			}else{
				//해당 프로젝트에 견적을 추가 하시겠습니까?
				var bodyContents = BundleResource.getString('label.estimate.addEstimateConfirm');
				var	body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">'+ bodyContents +'</div>'+
				'<div class="btnGroup">'+
				'<button class="estMgrEstimateAddOKBtn darkButton" onclick="w2popup.close();">'+BundleResource.getString('button.estimate.confirm')+'</button>'+
				'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.estimate.cancel')+'</button>'+
				'</div>'+
				'</div>';
				
				w2popup.open({
					width: 385,
					height: 180,
					title : BundleResource.getString('title.estimate.info'),
					body: body,
					opacity   : '0.5',
					modal     : true,
					showClose : true
				});
			}
		},
		
		estimateRegister : function(){
			var cnvtDay = util.getDate("Day");
			var fields = [];
			var record = {};
			var body = "";
			
			estMgr.estimateId = util.createUID();
			estMgr.projectId = util.createUID();
			
			estMgr.elements.rightMap = [];
			
			fields = [
				{name:'edition', type: 'text', disabled:true, html:{caption:'EDITION'}},
				{name:'project_name', type: 'text', disabled:false, required:true, html:{caption:'프로젝트'}},
				{name:'site_name', type: 'text', disabled:true, required:true, html:{caption:'주문처'}},
				{name:'phone', type: 'text', disabled:true, required:false, html:{caption:'연락처'}},
				{name:'manager', type: 'text', disabled:true, required:false, html:{caption:'고객명'}},
				{name:'email', type: 'text', disabled:true, required:false, html:{caption:'메일 주소'}},
				{name:'registration_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:true, html:{caption:'요청 일자'}},
				{name:'comfirmed_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'확정 일자'}},
				{name:'validity', type : 'list', options : {items : estMgr.getValidityList}, disabled:false, required:true, html:{caption:'유효 기간'}},
				{name:'payment', type: 'text', disabled:false, required:true, html:{caption:'지불 조건'}},
				{name:'warranty', type: 'text', disabled:false, required:true, html:{caption:'보증 기간'}},
				{name:'status', type: 'text', disabled:true, required:false, html:{caption:'STATUS'}},
				{name:'estimate_title', type: 'text', disabled:false, required:true, html:{caption:'제목'}},
				{name:'note', type: 'text', disabled:false, required:false, html:{caption:'비고'}},
				{name:'file_name', type: 'text', disabled:false, required:false, html:{caption:'파일명'}}
			];
			
			record = {
					edition : 1,
					project_name : '',
					site_name : '',
					phone : '',
					manager : '',
					email : '',
					registration_date : cnvtDay,
					comfirmed_date : '',
					validity : estMgr.getValidityList[0],
					payment : '',
					warranty : '',
					status : estMgr.getMailStatusList[2].text,
					estimate_title : '',
					note : '',
					file_name : ''
			}
			
			body = '<div class="">'+
			'<div id="estMgrPopupContents" style="width:100%; height:610px;" >'+
			
				'<div class="w2ui-page page-0">'+
					
					'<div style="width: 100%; float: left; margin-right: 0px;">'+       
			            '<div class="" style="height: 70px;">'+
			                '<div class="w2ui-field w2ui-span4" style="margin-left:832px;">'+
			                    '<label>EDITION</label>'+
			                    '<div>'+
			                        '<input name="edition" type="text" maxlength="100" size="2" style="text-align:right; border:none; background:none;" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>PROJECT</label>'+
			                    '<div>'+
			                        '<input name="project_name" type="text" maxlength="100" class="input-one-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+
				
			        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+       
			            '<div class="" style="height: 135px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>주문처</label>'+
			                    '<div id="getSiteList">'+
				                    '<div style="position:relative;">'+
				                        '<input placeholder="주문처 선택" name="site_name" type="text" readonly="readonly" maxlength="100" class="input-three-area" />'+
				                        '<div style="position:absolute; right:0px; top:7px; color:#fff; width:22px;">'+
				                        	'<i class="site-name-list fas fa-external-link-alt" aria-hidden="true"></i>'+
			                        	'</div>'+
				                    '</div>'+
			                    '</div>'+//getSiteList
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>고객명</label>'+
			                    '<div>'+
			                        '<input name="manager" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>보증 기간</label>'+
			                    '<div>'+
			                        '<input name="warranty" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>지불 조건</label>'+
			                    '<div>'+
			                        '<input name="payment" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+//left
			        
			        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+
			            '<div class="" style="height: 135px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>연락처</label>'+
			                    '<div>'+
			                    	'<input name="phone" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>메일 주소</label>'+
			                    '<div>'+
			                    	'<input name="email" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>유효 기간</label>'+
			                    '<div>'+
			                        '<input name="validity" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
		            
		            '<div style="width: 31.2%; float: right; margin-right: 0px;">'+
			            '<div class="" style="height: 135px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>요청 일자</label>'+
			                    '<div>'+
			                        '<input placeholder="YYYY-MM-DD" name="registration_date" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>확정 일자</label>'+
			                    '<div>'+
			                        '<input placeholder="메일 발송 시 자동 입력" name="comfirmed_date" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>STATUS</label>'+
			                    '<div>'+
			                    	'<input name="status" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
		            
		            '<div style="width: 100%; float: left; margin-right: 0px;">'+       
			            '<div class="" style="height: 320px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>TITLE</label>'+
			                    '<div>'+
			                        '<input name="estimate_title" type="text" maxlength="100" class="input-one-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div id="productListResult">'+
				                '<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
						    			'<div id="productTitle" style="float:left; padding:8px;">'+
						    				'<span>Model List</span>'+
						    			'</div>'+//productTitle
						    			'<div class="product-btn">'+
							                '<i id="productAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
											'<i id="productDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
						                '</div>'+//product-btn
						    		'</div>'+
						    		'<div class="dashboard-contents"><div id="productListResultBottom"></div></div>'+
						    	'</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>비고</label>'+
			                    '<div>'+
			                        '<input name="note" type="text" maxlength="100" class="input-one-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>파일명</label>'+
			                    '<div>'+
			                        '<input name="file_name" type="text" maxlength="100" style="width:800px;" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+
			            
			        '<div style="clear: both; padding-top: 15px;"></div>'+
			        '<div class="disableClass" style="display:none;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
			
			'</div>'+ //estMgrPopupContents
			
				'<div id="estMgrPopupBottom" style="float:right; margin-right:15px; position: relative; bottom: 15px;">'+
					'<button id="estMgrEstimatePreviewBtn" class="darkButton">' + BundleResource.getString('button.estimate.preview') + '</button>'+
					'<button id="estMgrRegisterSaveBtn" class="darkButton">' + BundleResource.getString('button.estimate.save') + '</button>'+
					'<button id="estMgrRegisterMailBtn" class="darkButton">' + BundleResource.getString('button.estimate.email') + '</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.estimate.registerEstimate'),
		        body: body,
		        width : 990,
		        height : 676,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		estMgr.listNotifiCation("getModelTypeList"); //모델 타입 리스트
		        	}
		        },
		        onClose   : function(event){
		        	w2ui['estMgr_popup_properties'].destroy();
		        	w2ui["estMgr_product_list_grid"].destroy();
		        	estMgr.estimateId = null;
					estMgr.projectId = null;
					estMgr.estimateGridValidation();
//					estMgr.getEstimateData();
		        }
		    });
    		
    		$("#estMgrPopupContents").w2form({
    			name : 'estMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : fields,
    			record: record,
    			onRender : function(event){
    				event.onComplete = function(event){
    					$("#productListResultBottom").w2grid({
    						name : 'estMgr_product_list_grid',
    						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
    						show: { 
    							toolbar: false,
    							footer:false,
    							toolbarSearch:false,
    							toolbarReload  : false,
    							searchAll : false,
    							toolbarColumns : false,
    							selectColumn: true
    						},
							recordHeight : 30,
//							blankSymbol : "-",
							columns : [
								{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
								{ field: 'product_name', caption: 'MODEL', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'spec', caption: 'SPEC', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'quantity', caption: 'QUANTITY', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }},
								{ field: 'u_price', caption: 'U/PRICE', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }},
								{ field: 'amount', caption: 'AMOUNT', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int'},
								{ field: 'product_id', caption: 'PRODUCT ID', hidden: true}
							],
							records : [
								{ w2ui: { summary: true },
									recid: ' ', product_name: '<span style="float: right;">Total</span>', spec: ' ', quantity: '', u_price: '', amount: 0
								}
							],
							onClick : function(event){
								event.onComplete = function(event){
									if(w2ui['estMgr_product_list_grid'].getSelection().length > 0){
										$("#productDelBtn").prop('disabled', false);
										$("#productDelBtn").addClass('link');
									}else{
										$("#productDelBtn").prop('disabled', true);
										$("#productDelBtn").removeClass('link');
									}
								}
							},
							onSelect : function(event){
								if(w2ui['estMgr_product_list_grid'].getSelection().length > 0){
									$("#productDelBtn").prop('disabled', false);
									$("#productDelBtn").addClass('link');
								}else{
									$("#productDelBtn").prop('disabled', true);
									$("#productDelBtn").removeClass('link');
								}
							},
							onChange : function(event){ //입력 완료했을 때
								event.onComplete = function(event){
									estMgr.productChangeAction();
								}
							}
    					});
    					w2ui['estMgr_product_list_grid'].summary[0].quantity = '';
    					w2ui['estMgr_product_list_grid'].summary[0].u_price = '';
    					w2ui['estMgr_product_list_grid'].refresh();
    				}
    			},
    			onChange : function(event){
    				console.log(event);
    			}
    		});
    		estMgr.selectAddItem = w2ui['estMgr_popup_properties'].record;
    		$("#productDelBtn").prop('disabled', true);
			$("#productDelBtn").removeClass('link');
		},
		
		estimateDelete : function(){
			estMgr.estimateGridValidation();
			if($("#estMgrDelBtn").prop('disabled')){
				return;
			}
			
			var dataProvider = w2ui["estimate_list"].get(w2ui["estimate_list"].getSelection());
        	
        	var bodyContents = "";
        	var body = "";
        	if(dataProvider.length > 0){
        		bodyContents = BundleResource.getString('label.estimate.selectedItemDelete');
        		//선택된 항목을 삭제 하시겠습니까?
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="roleMgr-popup-btnGroup">'+
						'<button id="estMgrDeleteOKBtn" onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.estimate.confirm')+'</button>'+
						'<button onclick="w2popup.close();" class="darkButton">'+BundleResource.getString('button.estimate.cancel')+'</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.estimate.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		estimateDeleteOK : function(){
			var selectedItem = w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection());
			var estimateId = selectedItem[0].estimateId;
			var model = new Model();
			model.url = 'estimate/deleteEstimate/'+estimateId;
			model.save(null, {
				success : function(model, response){
					w2ui['estimate_list'].selectNone();
					estMgr.getEstimateData();
					estMgr.estimateGridValidation();
				},
				error : function(model, xhr, options){
					console.log("Delete Estimate Error");
				}
			});
		},
		
		estimateEdit : function(){
			estMgr.getSelectEstimate = w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0];
			
			var fields = [];
			var record = {};
			var body = "";
			var status = null;
			var edition = null;
			var project_name = null;
			var site_name = null;
			var phone = null;
			var manager = null;
			var email = null;
			var registration_date = null;
			var comfirmed_date = null;
			var validity = null;
			var payment = null;
			var warranty = null;
			var popupStatus = null;
			var estimate_title = null;
			var note = null;
			
			if(estMgr.getSelectEstimate == undefined){ //Estimate List 선택 X
				status = 1;
				edition = estMgr.currentEstimate.edition;
				project_name = estMgr.currentEstimate.projectName;
				site_name = estMgr.currentEstimate.siteName;
				phone = estMgr.currentEstimate.phone;
				manager = estMgr.currentEstimate.customerName;
				email = estMgr.currentEstimate.email;
				registration_date = estMgr.currentEstimate.registrationDate;
				comfirmed_date = estMgr.currentEstimate.comfirmedDate;
				validity = _.where(estMgr.getValidityList, {id : parseInt(estMgr.currentEstimate.validity)})[0].text;
				payment = estMgr.currentEstimate.payment;
				warranty = estMgr.currentEstimate.warranty;
				popupStatus = _.where(estMgr.getMailStatusList, {value : estMgr.currentEstimate.status})[0].text;
				estimate_title = estMgr.currentEstimate.estimateTitle;
				note = estMgr.currentEstimate.note;
			}else{ //Estimate List 선택 O
				status = estMgr.getSelectEstimate.status;
				edition = estMgr.getSelectEstimate.edition;
				project_name = estMgr.getSelectEstimate.projectName;
				site_name = estMgr.getSelectEstimate.siteName;
				phone = estMgr.getSelectEstimate.phone;
				manager = estMgr.getSelectEstimate.customerName;
				email = estMgr.getSelectEstimate.email;
				registration_date = estMgr.getSelectEstimate.registrationDate;
				comfirmed_date = estMgr.getSelectEstimate.comfirmedDate;
				validity = _.where(estMgr.getValidityList, {id : parseInt(estMgr.getSelectEstimate.validity)})[0].text;
				payment = estMgr.getSelectEstimate.payment;
				warranty = estMgr.getSelectEstimate.warranty;
				popupStatus = _.where(estMgr.getMailStatusList, {value : estMgr.getSelectEstimate.status})[0].text;
				estimate_title = estMgr.getSelectEstimate.estimateTitle;
				note = estMgr.getSelectEstimate.note;
			}
			
			if(status == 1){ //발송
				
				fields = [
					{name:'edition', type: 'text', disabled:true, html:{caption:'EDITION'}},
					{name:'project_name', type: 'text', disabled:true, required:false, html:{caption:'프로젝트'}},
					{name:'site_name', type: 'text', disabled:true, required:false, html:{caption:'주문처'}},
					{name:'phone', type: 'text', disabled:true, required:false, html:{caption:'연락처'}},
					{name:'manager', type: 'text', disabled:true, required:false, html:{caption:'고객명'}},
					{name:'email', type: 'text', disabled:true, required:false, html:{caption:'메일 주소'}},
					{name:'registration_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'요청 일자'}},
					{name:'comfirmed_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'확정 일자'}},
					{name:'validity', type : 'text', disabled:true, required:false, html:{caption:'유효 기간'}},
					{name:'payment', type: 'text', disabled:true, required:false, html:{caption:'지불 조건'}},
					{name:'warranty', type: 'text', disabled:true, required:false, html:{caption:'보증 기간'}},
					{name:'status', type: 'text', disabled:true, required:false, html:{caption:'STATUS'}},
					{name:'estimate_title', type: 'text', disabled:true, required:false, html:{caption:'제목'}},
					{name:'note', type: 'text', disabled:true, required:false, html:{caption:'비고'}}
				];
				
				record = {
						edition : edition,
						project_name : project_name,
						site_name : site_name,
						phone : phone,
						manager : manager,
						email : email,
						registration_date : registration_date,
						comfirmed_date : comfirmed_date,
						validity : validity,
						payment : payment,
						warranty : warranty,
						status : popupStatus,
						estimate_title : estimate_title,
						note : note
				}
				
				body = '<div class="">'+
				'<div id="estMgrPopupContents" style="width:100%; height:580px;" >'+
				
					'<div class="w2ui-page page-0">'+
						
						'<div style="width: 100%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 70px;">'+
				                '<div class="w2ui-field w2ui-span4" style="margin-left:832px;">'+
				                    '<label>EDITION</label>'+
				                    '<div>'+
				                        '<input name="edition" type="text" maxlength="100" size="2" style="text-align:right; border:none; background:none;" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>PROJECT</label>'+
				                    '<div>'+
				                        '<input name="project_name" type="text" maxlength="100" class="input-one-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
					
				        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+       
				            '<div class="" style="height: 135px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>주문처</label>'+
				                    '<div>'+
			                        	'<input name="site_name" type="text" readonly="readonly" maxlength="100" class="input-three-area" style="cursor: default; background-color: rgba(255, 255, 255, 0.2);" />'+
			                        '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>고객명</label>'+
				                    '<div>'+
				                        '<input name="manager" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>보증 기간</label>'+
				                    '<div>'+
				                        '<input name="warranty" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>지불 조건</label>'+
				                    '<div>'+
				                        '<input name="payment" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+//left
				        
				        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+
				            '<div class="" style="height: 135px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label>연락처</label>'+
				                    '<div>'+
				                    	'<input name="phone" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>메일 주소</label>'+
				                    '<div>'+
				                    	'<input name="email" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>유효 기간</label>'+
				                    '<div>'+
				                        '<input name="validity" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
			            '</div>'+//middle
			            
			            '<div style="width: 31.2%; float: right; margin-right: 0px;">'+
				            '<div class="" style="height: 135px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label>요청 일자</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="registration_date" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>확정 일자</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="comfirmed_date" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
			            '</div>'+//middle
			            
			            '<div style="width: 100%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 320px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>TITLE</label>'+
				                    '<div>'+
				                        '<input name="estimate_title" type="text" maxlength="100" class="input-one-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div id="productListResult">'+
					                '<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
							    			'<div id="productTitle" style="float:left; padding:8px;">'+
							    				'<span>Model List</span>'+
							    			'</div>'+//productTitle
							    			'<div class="product-btn">'+
								                '<i id="productAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
												'<i id="productDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
							                '</div>'+//product-btn
							    		'</div>'+
							    		'<div class="dashboard-contents"><div id="productListResultBottom"></div></div>'+
							    	'</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>비고</label>'+
				                    '<div>'+
				                        '<input name="note" type="text" maxlength="100" class="input-one-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				            
				        '<div style="clear: both; padding-top: 15px;"></div>'+
				        '<div class="disableClass"></div>'+
				        
				    '</div>'+ //w2ui-page page-0
				
				'</div>'+ //estMgrPopupContents
				
					'<div id="estMgrPopupBottom" style="float:right; margin-right:15px; position: relative; bottom: 15px;">'+
						'<button id="estMgrEstimatePreviewBtn" class="darkButton">' + BundleResource.getString('button.estimate.preview') + '</button>'+
						'<button id="estMgrAddEstimateBtn" class="darkButton">' + BundleResource.getString('button.estimate.estimateAdd') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.estimate.confirm') + '</button>'+
					'</div>'+
				'</div>';
				
				w2popup.open({
					title : BundleResource.getString('title.estimate.estimate'),
			        body: body,
			        width : 990,
			        height : 646,
			        type : 'update',
			        opacity   : '0.5',
		    		modal     : true,
			     	showClose : true,
			     	style	  : "overflow:hidden;",
			        onOpen    : function(event){
			        	event.onComplete = function () {
			        		estMgr.listNotifiCation("getModelTypeList"); //모델 타입 리스트
			        	}
			        },
			        onClose   : function(event){
			        	w2ui['estMgr_popup_properties'].destroy();
			        	w2ui["estMgr_product_list_grid"].destroy();
			        	estMgr.mailSendEstimateId = null;
			        	estMgr.estimateGridValidation();
			        }
			    });
				
				$("#estMgrPopupContents").w2form({
	    			name : 'estMgr_popup_properties',
	    			style:"border:1px solid rgba(0,0,0,0)",
	    			fields : fields,
	    			record: record,
	    			onRender : function(event){
	    				event.onComplete = function(event){
	    					$("#productListResultBottom").w2grid({
	    						name : 'estMgr_product_list_grid',
	    						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
	    						show: { 
	    							toolbar: false,
	    							footer:false,
	    							toolbarSearch:false,
	    							toolbarReload  : false,
	    							searchAll : false,
	    							toolbarColumns : false,
	    							selectColumn: true
	    						},
								recordHeight : 30,
//								blankSymbol : "-",
								columns : [
									{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
									{ field: 'product_name', caption: 'MODEL', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
									{ field: 'spec', caption: 'SPEC', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
									{ field: 'quantity', caption: 'QUANTITY', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int'},
									{ field: 'u_price', caption: 'U/PRICE', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int'},
									{ field: 'amount', caption: 'AMOUNT', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int'},
									{ field: 'product_id', caption: 'PRODUCT ID', hidden: true}
								],
								records : [
									{ w2ui: { summary: true },
										recid: ' ', product_name: '<span style="float: right;">Total</span>', spec: ' ', quantity: '', u_price: '', amount: 0
									}
								],
	    					});
	    					w2ui['estMgr_product_list_grid'].summary[0].quantity = '';
	    					w2ui['estMgr_product_list_grid'].summary[0].u_price = '';
	    					w2ui['estMgr_product_list_grid'].refresh();
	    				}
	    				estMgr.getEstimateProductData();
	    			}
	    		});
				$("#productAddBtn").prop('disabled', true);
				$("#productAddBtn").removeClass('link');
				$("#productDelBtn").prop('disabled', true);
				$("#productDelBtn").removeClass('link');
			}else{ //미발송
				fields = [
					{name:'edition', type: 'text', disabled:true, html:{caption:'EDITION'}},
					{name:'project_name', type: 'text', disabled:false, required:true, html:{caption:'프로젝트'}},
					{name:'site_name', type: 'text', disabled:true, required:true, html:{caption:'주문처'}},
					{name:'phone', type: 'text', disabled:true, required:false, html:{caption:'연락처'}},
					{name:'manager', type: 'text', disabled:true, required:false, html:{caption:'고객명'}},
					{name:'email', type: 'text', disabled:true, required:false, html:{caption:'메일 주소'}},
					{name:'registration_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:true, html:{caption:'요청 일자'}},
					{name:'comfirmed_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'확정 일자'}},
					{name:'validity', type : 'list', options : {items : estMgr.getValidityList}, disabled:false, required:true, html:{caption:'유효 기간'}},
					{name:'payment', type: 'text', disabled:false, required:true, html:{caption:'지불 조건'}},
					{name:'warranty', type: 'text', disabled:false, required:true, html:{caption:'보증 기간'}},
					{name:'status', type: 'text', disabled:true, required:false, html:{caption:'STATUS'}},
					{name:'estimate_title', type: 'text', disabled:false, required:true, html:{caption:'제목'}},
					{name:'note', type: 'text', disabled:false, required:false, html:{caption:'비고'}},
					{name:'file_name', type: 'text', disabled:false, required:false, html:{caption:'파일명'}}
				];
				
				record = {
						edition : edition,
						project_name : project_name,
						site_name : site_name,
						phone : phone,
						manager : manager,
						email : email,
						registration_date : registration_date,
						comfirmed_date : comfirmed_date,
						validity : _.where(estMgr.getValidityList, {id : parseInt(estMgr.getSelectEstimate.validity)})[0],
						payment : payment,
						warranty : warranty,
						status : popupStatus,
						estimate_title : estimate_title,
						note : note,
						file_name : file_name
				}
				
				body = '<div class="">'+
				'<div id="estMgrPopupContents" style="width:100%; height:580px;" >'+
				
					'<div class="w2ui-page page-0">'+
						
						'<div style="width: 100%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 70px;">'+
				                '<div class="w2ui-field w2ui-span4" style="margin-left:832px;">'+
				                    '<label>EDITION</label>'+
				                    '<div>'+
				                        '<input name="edition" type="text" maxlength="100" size="2" style="text-align:right; border:none; background:none;" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>PROJECT</label>'+
				                    '<div>'+
				                        '<input name="project_name" type="text" maxlength="100" class="input-one-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
					
				        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+       
				            '<div class="" style="height: 135px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>주문처</label>'+
				                    '<div id="getSiteList">'+
				                    	'<div style="position:relative;">'+
				                        	'<input name="site_name" type="text" readonly="readonly" maxlength="100" class="input-three-area" style="cursor: pointer; background-color: rgba(255, 255, 255, 0.1);" />'+
				                        	'<div style="position:absolute; right:0px; top:7px; color:#fff; width:22px;">'+
	  				                        	'<i class="site-name-list fas fa-external-link-alt" aria-hidden="true"></i>'+
	  			                        	'</div>'+
				                        '</div>'+
			                        '</div>'+//getSiteList
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>고객명</label>'+
				                    '<div>'+
				                        '<input name="manager" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>보증 기간</label>'+
				                    '<div>'+
				                        '<input name="warranty" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>지불 조건</label>'+
				                    '<div>'+
				                        '<input name="payment" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+//left
				        
				        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+
				            '<div class="" style="height: 135px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label>연락처</label>'+
				                    '<div>'+
				                    	'<input name="phone" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>메일 주소</label>'+
				                    '<div>'+
				                    	'<input name="email" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>유효 기간</label>'+
				                    '<div>'+
				                        '<input name="validity" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
			            '</div>'+//middle
			            
			            '<div style="width: 31.2%; float: right; margin-right: 0px;">'+
				            '<div class="" style="height: 135px;">'+
					            '<div class="w2ui-field w2ui-span4">'+
				                    '<label>요청 일자</label>'+
				                    '<div>'+
				                        '<input placeholder="YYYY-MM-DD" name="registration_date" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>확정 일자</label>'+
				                    '<div>'+
				                        '<input placeholder="메일 발송 시 자동 입력" name="comfirmed_date" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>STATUS</label>'+
				                    '<div>'+
				                    	'<input name="status" type="text" maxlength="100" class="input-three-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
			            '</div>'+//right
			            
			            '<div style="width: 100%; float: left; margin-right: 0px;">'+       
				            '<div class="" style="height: 320px;">'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>TITLE</label>'+
				                    '<div>'+
				                        '<input name="estimate_title" type="text" maxlength="100" class="input-one-area" />'+
				                    '</div>'+
				                '</div>'+
				                '<div id="productListResult">'+
					                '<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
							    			'<div id="productTitle" style="float:left; padding:8px;">'+
							    				'<span>Model List</span>'+
							    			'</div>'+//productTitle
							    			'<div class="product-btn">'+
								                '<i id="productAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
												'<i id="productDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
							                '</div>'+//product-btn
							    		'</div>'+
							    		'<div class="dashboard-contents"><div id="productListResultBottom"></div></div>'+
							    	'</div>'+
				                '</div>'+
				                '<div class="w2ui-field w2ui-span4">'+
				                    '<label>비고</label>'+
				                    '<div>'+
				                        '<input name="note" type="text" maxlength="100" class="input-one-area" />'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				            
				        '<div style="clear: both; padding-top: 15px;"></div>'+
				        '<div class="disableClass" style="display:none;"></div>'+
				        
				    '</div>'+ //w2ui-page page-0
				
				'</div>'+ //estMgrPopupContents
				
					'<div id="estMgrPopupBottom" style="float:right; margin-right:15px; position: relative; bottom: 15px;">'+
						'<button id="estMgrEstimatePreviewBtn" class="darkButton">' + BundleResource.getString('button.estimate.preview') + '</button>'+
						'<button id="estMgrRegisterSaveBtn" class="darkButton">' + BundleResource.getString('button.estimate.save') + '</button>'+
						'<button id="estMgrRegisterMailBtn" class="darkButton">' + BundleResource.getString('button.estimate.email') + '</button>'+
					'</div>'+
				'</div>';
				
				w2popup.open({
					title : BundleResource.getString('title.estimate.editEstimate'),
			        body: body,
			        width : 990,
			        height : 646,
			        type : 'update',
			        opacity   : '0.5',
		    		modal     : true,
			     	showClose : true,
			     	style	  : "overflow:hidden;",
			        onOpen    : function(event){
			        	event.onComplete = function () {
			        		estMgr.listNotifiCation("getModelTypeList"); //모델 타입 리스트
			        	}
			        },
			        onClose   : function(event){
			        	w2ui['estMgr_popup_properties'].destroy();
			        	w2ui["estMgr_product_list_grid"].destroy();
			        	estMgr.getSelectEstimate = null;
			        	estMgr.estimateGridValidation();
			        }
			    });
				
				$("#estMgrPopupContents").w2form({
	    			name : 'estMgr_popup_properties',
	    			style:"border:1px solid rgba(0,0,0,0)",
	    			fields : fields,
	    			record: record,
	    			onRender : function(event){
	    				event.onComplete = function(event){
	    					$("#productListResultBottom").w2grid({
	    						name : 'estMgr_product_list_grid',
	    						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
	    						show: { 
	    							toolbar: false,
	    							footer:false,
	    							toolbarSearch:false,
	    							toolbarReload  : false,
	    							searchAll : false,
	    							toolbarColumns : false,
	    							selectColumn: true
	    						},
								recordHeight : 30,
//								blankSymbol : "-",
								columns : [
									{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
									{ field: 'product_name', caption: 'MODEL', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
									{ field: 'spec', caption: 'SPEC', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
									{ field: 'quantity', caption: 'QUANTITY', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }},
									{ field: 'u_price', caption: 'U/PRICE', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }},
									{ field: 'amount', caption: 'AMOUNT', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int'},
									{ field: 'product_id', caption: 'PRODUCT ID', hidden: true}
								],
								records : [
									{ w2ui: { summary: true },
										recid: ' ', product_name: '<span style="float: right;">Total</span>', spec: ' ', quantity: '', u_price: '', amount: 0
									}
								],
								onClick : function(event){
									event.onComplete = function(event){
										if(w2ui['estMgr_product_list_grid'].getSelection().length > 0){
											$("#productDelBtn").prop('disabled', false);
											$("#productDelBtn").addClass('link');
										}else{
											$("#productDelBtn").prop('disabled', true);
											$("#productDelBtn").removeClass('link');
										}
									}
								},
								onSelect : function(event){
									if(w2ui['estMgr_product_list_grid'].getSelection().length > 0){
										$("#productDelBtn").prop('disabled', false);
										$("#productDelBtn").addClass('link');
									}else{
										$("#productDelBtn").prop('disabled', true);
										$("#productDelBtn").removeClass('link');
									}
								},
								onChange : function(event){ //입력 완료했을 때
									event.onComplete = function(event){
										estMgr.productChangeAction();
									}
								}
	    					});
	    					w2ui['estMgr_product_list_grid'].summary[0].quantity = '';
	    					w2ui['estMgr_product_list_grid'].summary[0].u_price = '';
	    					w2ui['estMgr_product_list_grid'].refresh();
	    					
	    					estMgr.selectAddItem = w2ui['estMgr_popup_properties'].record;
	    				}
	    				estMgr.getEstimateProductData();
	    				
	    			}
	    		});
				$("#productDelBtn").prop('disabled', true);
				$("#productDelBtn").removeClass('link');
				if(estMgr.getSelectEstimate.edition != 1){
					$("#project_name").prop('disabled', true);
					$("#registration_date").prop('disabled', true);
				}
			}
		},
		
		settingSite : function(){
			if($('body').find("#doublePopup").size() == 0 ){
				$('body').append("<div id='doublePopup'></div>");
			}
			$("#doublePopup").dialog({
				title : BundleResource.getString('title.estimate.siteList'),
				width : 945,
				height : 600,
				modal : true,
				resizable: false,
				show: { effect: "fade", duration: 300 },
			    hide: { effect: "fade", duration: 100 },
				buttons : {
					"확인" : function(){
						var siteInfo = w2ui['estMgr_site_popup'].get(w2ui['estMgr_site_popup'].getSelection())[0];
						var estMgrAddRecord = w2ui['estMgr_popup_properties'].record;
						if(siteInfo != undefined){
							w2ui['estMgr_popup_properties'].record = {
									edition : estMgrAddRecord.edition,
									project_name : estMgrAddRecord.project_name,
									site_name : siteInfo.site_name,
									manager : siteInfo.customer_name,
									customer_id : siteInfo.customer_id,
									phone : siteInfo.phone,
									email : siteInfo.email,
									validity :  estMgrAddRecord.validity,
									registration_date : estMgrAddRecord.registration_date,
									comfirmed_date : estMgrAddRecord.comfirmed_date,
									payment : estMgrAddRecord.payment,
									warranty : estMgrAddRecord.warranty,
									status : estMgrAddRecord.status,
									estimate_title : estMgrAddRecord.estimate_title,
									note : estMgrAddRecord.note
							}
							w2ui['estMgr_popup_properties'].refresh();
							$(this).dialog("close");
						}else{
							$(this).dialog("close");
						}
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#doublePopup").append('<div id="siteAddArea"></div>');
					var siteAddArea = '<div id="siteContents">'+
													'<div id="siteLeftContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title">Site List</div>'+
												    		'<div class="dashboard-contents"><div id="siteLeftBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//siteLeftContents
													'<div id="siteRightContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title">Manager List</div>'+
												    		'<div class="dashboard-contents"><div id="siteRightBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//siteRightContents
												'</div>';
					$("#siteAddArea").html(siteAddArea);
					
					estMgr.listNotifiCation("getSiteList"); //업체 리스트
					
					$("#siteRightBottom").w2grid({
						name : 'estMgr_site_popup',
						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
						show: { 
							toolbar: false,
							footer:false,
							toolbarSearch:false,
							toolbarReload  : false,
							searchAll : false,
							toolbarColumns : false,
							selectColumn: false,
						},
						multiSelect : false,
						recordHeight : 30,
						blankSymbol : "-",
						columns : [
							{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
							{ field: 'customer_id', caption: 'ID', hidden: true, sortable: true, attr: 'align=center'}, //고객아이디
							{ field: 'customer_name', caption: 'NAME', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //고객명
							{ field: 'phone', caption: 'PHONE', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //연락처
							{ field: 'mobile_phone', caption: 'M.P', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //핸드폰연락처
							{ field: 'email', caption: 'EMAIL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //이메일
							{ field: 'rank', caption: 'RANK', size: '50px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //직급
							{ field: 'department', caption: 'DEPT.', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //부서
							{ field: 'task', caption: 'TASK', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //담당업무
							{ field: 'site_name', caption: 'SITE', hidden: true, sortable: true, attr: 'align=left', style:'padding-left:5px;'} //주문처
						]
					});
				},
				close : function(){
					$("#doublePopup").remove();
					if(w2ui['siteTree']){
						w2ui['siteTree'].destroy();
					}
					w2ui['estMgr_site_popup'].destroy();
				}
			});
		},
		
		getSiteData : function(cmd){
			var model = new Model();
			model.url = 'estimate/'+cmd;
			model.fetch();
			this.listenTo(model, 'sync', this.setSiteData);
		},
		
		setSiteData : function(method, model, options){
			this.setSiteList(model);
		},
		
		setSiteList : function(model){
			estMgr.treeMenu = model.treeData.nodes;
			estMgr.allMenu = model.allData;
			
			estMgr.createSiteTree();
			w2ui['siteTree'].insert('-1', null, model.treeData.nodes);
			
			if(!estMgr.selectItem){
				estMgr.selectItem = w2ui['siteTree'].get(w2ui['siteTree'].nodes[0].nodes[0].nodes[0].id);
				w2ui['siteTree'].select(w2ui['siteTree'].nodes[0].nodes[0].nodes[0].id);
			}else{
				w2ui['siteTree'].select(estMgr.selectItem.id);
			}
			
			estMgr.selectedItem(estMgr.selectItem);
		},
		
		selectedItem : function(item){
			var model = new Model();
			model.url = 'estimate/selectItemList';
			if(item.nodes.length > 0){ //노드가 있을경우
				model.set({"parent_site_id" : item.site_id});
			}else{ //노드가 없는경우
				model.set({"site_id" : item.site_id});
			}
			model.save({}, {
				success : function(model, response, options){
					estMgr.setData(model);
				},
				error : function(model, xhr, options){
					
				}
			});
			estMgr.listenTo(model, 'sync', estMgr.setData);
		},
		
		setData : function(model){
			w2ui['estMgr_site_popup'].records = model.attributes.data;
			w2ui['estMgr_site_popup'].refresh();
		},
		
		createSiteTree : function(){
			$("#siteLeftBottom").w2sidebar({
				name : 'siteTree',
				nodes : [
					{id: 'Site', text: 'SITE LIST', expanded: true, group: true,
					nodes: [{id:'-1', text: 'SITE',	expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					event.onComplete = function(){
						var selectId = event.target;
						if(selectId === "-1"){ //SITE Click
							
						}else{
							
						}
						
						w2ui["estMgr_site_popup"].selectNone();
						
						estMgr.selectItem = w2ui['siteTree'].get(selectId);
						estMgr.selectedItem(estMgr.selectItem);
					}
				}
			});
		},
		
		productAdd : function(){
			if($('body').find("#doublePopup").size() == 0 ){
				$('body').append("<div id='doublePopup'></div>");
			}
			$("#doublePopup").dialog({
				title : BundleResource.getString('title.estimate.productList'),
				width : 945,
				height : 600,
				modal : true,
				resizable: false,
				show: { effect: "fade", duration: 300 },
			    hide: { effect: "fade", duration: 100 },
				buttons : {
					"확인" : function(){
						var productSelected = w2ui['estMgr_product_selected'].records;
						var totalAmount = 0;
						for(var i=0; i<productSelected.length; i++){
							if(w2ui['estMgr_product_selected'].records[i].amount == undefined){
								w2ui['estMgr_product_selected'].records[i] = {
										recid : productSelected[i].recid,
										product_name : productSelected[i].product_name,
										spec : productSelected[i].spec,
										quantity : 0,
										u_price : 0,
										amount : 0,
										product_type : productSelected[i].product_type,
										product_id : productSelected[i].product_id
								}
							}else{
								totalAmount += w2ui['estMgr_product_selected'].records[i].amount;
							}
						}
						w2ui['estMgr_product_list_grid'].records = w2ui['estMgr_product_selected'].records;
						w2ui['estMgr_product_list_grid'].summary[0].amount = totalAmount;
						w2ui['estMgr_product_list_grid'].refresh();
						
						$(this).dialog("close");
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#doublePopup").append('<div id="productAddArea"></div>');
					var productAddArea = '<div id="productContents">'+
													'<div id="proLeftContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title">Available List</div>'+
												    		'<div class="dashboard-contents"><div id="proLeftBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//proLeftContents
													'<div id="proMiddleContents">'+
														'<div>'+
												 		    /*'<button class="darkButton" style="margin-bottom: 20px;" id="proLeftBtn"> < </button>'+*/
												 		    '<button class="darkButton" id="proRightBtn"> > </button>'+
													    '</div>'+
													'</div>'+//proMiddleContents
													'<div id="proRightContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title" style="padding:0px;">'+
													    		'<div id="selectedListTitle" style="float:left; padding:8px;">'+
													    			'<span>Selected List</span>'+
													    		'</div>'+//selectedListTitle
													    		'<div class="selected-list-btn">'+
													    			'<i id="selectedDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
												    	        '</div>'+//selected-list-btn
													    	'</div>'+
												    		'<div class="dashboard-contents"><div id="proRightBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//proRightContents
												'</div>';
					$("#productAddArea").html(productAddArea);
					
					$("#proLeftBottom").w2grid({
						name : 'estMgr_product_available',
						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
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
						multiSelect: true,
						recordHeight : 30,
						blankSymbol : "-",
						searches: [
		                	{ field: 'product_name', caption: 'MODEL ', type: 'text' }
		                ],
						columns : [
//							{ field: 'recid', caption: 'NO', size : '20px', sortable: true, attr: 'align=center'},
							{ field: 'product_name', caption: 'MODEL', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							{ field: 'spec', caption: 'SPEC', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							{ field: 'product_type', caption: 'TYPE', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}
						],
						onClick : function(event){
							event.onComplete = function(){
								estMgr.productValidation();
							}
						},
						onSelect : function(event){
							estMgr.productValidation();
						},
						onDblClick : function(event){
							if(event && event.target){
								$("#proRightBtn").trigger("click");
							}
							event.onComplete = function(){
								w2ui['estMgr_product_available'].selectNone();
							}
						}
					});
					
					$("#proRightBottom").w2grid({
						name : 'estMgr_product_selected',
						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
						show: { 
							toolbar: false,
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
						columns : [
//							{ field: 'recid', caption: 'NO', size : '20px', sortable: true, attr: 'align=center'},
							{ field: 'product_name', caption: 'MODEL', size: '100px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							{ field: 'spec', caption: 'SPEC', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							{ field: 'product_type', caption: 'TYPE', size: '80px', sortable: true, attr: 'align=left', style:'padding-left:5px;'}
						],
						onDblClick : function(event){
							if(event && event.target){
								$("#selectedDelBtn").trigger("click");
							}
							event.onComplete = function(){
								w2ui['estMgr_product_selected'].selectNone();
							}
						}
					});
					
					$("#proRightBtn").prop('disabled', true);
	        		$("#proRightBtn").css('opacity', 0.4);
	        		document.getElementById("proRightBtn").className = "darkButtonDisable";
					
					estMgr.listNotifiCation("getModelList"); //모델 리스트
					estMgr.renderModelTypeData(); //모델 타입 리스트
					
					let dataProvider = [];
					for(let name in estMgr.elements.rightMap){
						let item = estMgr.elements.rightMap[name];
						dataProvider.push(item);
					}
					
					w2ui['estMgr_product_selected'].records = dataProvider;
					w2ui['estMgr_product_selected'].refresh();
				},
				close : function(){
					$("#doublePopup").remove();
					w2ui['estMgr_product_available'].destroy();
					w2ui['estMgr_product_selected'].destroy();
				}
			});
		},
		
		productChangeAction : function(){
			w2ui['estMgr_product_list_grid'].save();
			
			var amoTotal = 0.0;
			var amount = 0.0;
			var proGridRecord = w2ui['estMgr_product_list_grid'].records;
			
			if(proGridRecord.length > 0){
				for(var m=0; m<proGridRecord.length; m++){ //amount
					amount = proGridRecord[m].quantity * proGridRecord[m].u_price;
					w2ui['estMgr_product_list_grid'].records[m].amount = amount;
				}
				
				for(var k=0; k<proGridRecord.length; k++){ //amount sum
					amoTotal += proGridRecord[k].amount;
					w2ui['estMgr_product_list_grid'].summary[0].amount = amoTotal;
				}
			}else{
				w2ui['estMgr_product_list_grid'].summary[0].amount = amoTotal;
			}
			
			w2ui['estMgr_product_list_grid'].refresh();
		},
		
		estimatePreviewPopup : function(){
			var arr = w2ui['estMgr_popup_properties'].validate();
			var productRecords = w2ui['estMgr_product_list_grid'].records;
			var btnType = "";
			var previewStatus = "";
			var result = estMgr.updateInvalidate();
			
			if(w2ui['estMgr_popup_properties'].record.status == "미발송"){ //미발송
				if(arr.length > 0){
					return;
				}else if(productRecords.length == 0){
					btnType = "doNotProduct";
					estMgr.dialogAlertPopup(btnType);
				}else if(!result){
					//변경된 사항이 없으면
					estMgr.estimatePreviewPopupOK();
				}else{
					btnType = "preview";
					estMgr.dialogAlertPopup(btnType);
				}
			}else{ //발송
				previewStatus = "skip";
				estMgr.previewAction(previewStatus);
			}
		},
		
		estimatePreviewPopupOK : function(){
			estMgr.previewBtnPress = true;
			
			var previewStatus = "";
			var result = estMgr.updateInvalidate();
			
			if(!result){
				//변경된 사항이 없으면 바로 preview 실행
				previewStatus = "skip";
				estMgr.previewAction(previewStatus);
			}else{
				estMgr.checkProcess(); //저장하는 프로세스
			}
		},
		
		previewAction : function(downloadAction){ //프리뷰 실행
			var download = new Model();
       		
			download.url = "itsmUtil/download";
			console.log("Preview Action Here");
       		download.fetch({
    			data : {
    				title: w2ui['estMgr_popup_properties'].record.project_name,
            		parent_id: 0,
            		report_type : 4,
            		report_sub_type: "Estimate.jrxml",
            		query: "selectEstimate",
            		condition : estMgr.select_grid_estimateId,
            		destination_name : "none",
            		export_type: "0",
            		select_menu: "estimate",
            		downloadAction : downloadAction,
            		actionType : "estimate",
            		fileName : ""
    			},
        		success: function (response) {
        			if(response.toJSON() != null ){
        				if(response.toJSON().data.message == null){
	        				w2popup.message({ 
	        					width   : 360, 
	        					height  : 200,
	        					html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.nodata') + '</div>'+
	        					'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
	        				});
	        				return;
        				}
        				if(estMgr.previewBtnPress){
        					that.estimatePreview( response.toJSON().data ); //pdf 파일 띄움
        					estMgr.previewBtnPress = false;
        				}
					}
        		}
        	});
		},
		
		estimatePreview : function( request ){
        	var selectedPreEstimateId = request.previewId;
			 
        	var strWinStyle   = "width=800 height=940 toolbar=no menubar=no location=no scrollbars=no resizable=no fullscreen=no ";
        	var popup = window.open("itsmUtil/preview/"+selectedPreEstimateId, 'popup', strWinStyle);        	
        },		
		
		checkProcess : function(event){
			var item = w2popup.get();
			estMgr.estimateRegisterSavePopup(event, item.type);
		},
		
		estimateRegisterSavePopup : function(event, type){ //중간 저장(insert/update)
			var result = estMgr.updateInvalidate();
			var btnType = "";
			var previewStatus = "";
			if(result){ //저장
				var estimateRecords = w2ui['estMgr_popup_properties'].record;
				var productRecords = w2ui['estMgr_product_list_grid'].records;
				
				var requestParam = {};
				var estimateInfo = {};
				var productQuantity = [];
				var projectInfo = {};
				
				var estimateId = null;
				var projectId = null;
				var customerSite = null;
				var customerId = null;
				var status = null; //발송, 미발송
				var comfirmedDate = null;
				
				if($("#site_name").val() == ''){ //주문처 선택하지 않았을 경우
					customerSite = null;
					customerId = null;
				}else{
					if(estMgr.allMenu == undefined){
						customerSite = estMgr.getSelectEstimate.siteId;
					}else{
						customerSite = _.where(estMgr.allMenu, {site_name:$("#site_name").val()})[0].site_id;
					}
					if(estimateRecords.customer_id == undefined){
						customerId = estMgr.getSelectEstimate.customerId;
					}else{
						customerId = estimateRecords.customer_id;
					}
				}
				
				var quantity = null;
				var u_price = null;
				
				
				if(type === "create"){
					estimateId = estMgr.estimateId;
					projectId = estMgr.projectId;
				}else if(type === "update"){
					estimateId = estMgr.getSelectEstimate.estimateId;
					projectId = estMgr.getSelectEstimate.projectId;
				}
				
				if(status == 1){
					comfirmedDate = estimateRecords.comfirmed_date
				}else{
					comfirmedDate = null;
				}
				
				if(estMgr.sendMail){
					status = 1;
					comfirmedDate = util.getDate("Day");
					estMgr.mailSendEstimateId = estimateId;
				}else{
					status = parseInt(_.where(estMgr.getMailStatusList, {text:estMgr.selectAddItem.status})[0].value);
				}
				
				estimateInfo = {
						edition : estimateRecords.edition,
						estimate_id : estimateId,
						project_id : projectId,
						customer_site : customerSite,
						customer_id : customerId,
						validity : estimateRecords.validity.id,
						warranty : estimateRecords.warranty,
						payment : estimateRecords.payment,
						estimate_title : estimateRecords.estimate_title,
						note : estimateRecords.note,
						registration_date : estimateRecords.registration_date,
						comfirmed_date : comfirmedDate,
						status : status,
						user_id : sessionStorage.getItem("LOGIN_ID"),
						total_amount : w2ui['estMgr_product_list_grid'].summary[0].amount
				}
				
				w2ui['estMgr_product_list_grid'].save();
				if(productRecords.length > 0){ //선택한 제품이 있는 경우
					for(var i=0; i<productRecords.length; i++){
						productQuantity.push({
							estimate_id : estimateId,
							quantity : productRecords[i].quantity.toString(),
							u_price :  productRecords[i].u_price,
							product_id : productRecords[i].product_id,
							amount : productRecords[i].amount
						});
					}
				}
				
				projectInfo = {
						project_id : projectId,
						project_name : estimateRecords.project_name,
						registration_date : estimateRecords.registration_date,
						estimate_id : estimateId,
						status : 1 //1:견적을 의미함
				}
				
				requestParam = {
						"estimateInfo" : estimateInfo,
						"productQuantity" : productQuantity,
						"projectInfo" : projectInfo
				}
				
				var model = new Model(requestParam);
				model.url = 'estimate/insertEstimate';
				model.save(null, {
					success : function(model, response){
						if(response == 100){
							var arr = w2ui['estMgr_popup_properties'].validate();
							var estimateRecords = w2ui['estMgr_popup_properties'].record;
							var productRecords = w2ui['estMgr_product_list_grid'].records;
							if(arr.length == 0 || productRecords.length != 0){ 
								//파일명 생성
								var customerName = estimateRecords.manager;
								var productName = w2ui['estMgr_product_list_grid'].records[0].product_name;
								var siteName = estimateRecords.site_name;
								var estimateTitle = estimateRecords.estimate_title;
								var registrationDate = estimateRecords.registration_date;
								var edition = null;
								
								if(estimateRecords.edition < 10){
									edition = "0" + estimateRecords.edition;
								}
								
								var fileName = customerName+"_"+productName+"_"+siteName+"_"+estimateTitle+"_"+registrationDate+"_"+edition;
								estimateRecords.file_name = fileName;
								w2ui['estMgr_popup_properties'].refresh();
								
								//저장버튼 눌렀을 때 필수 항목 입력 완료 && 선택한 제품이 있을 경우에만 pdf 생성
								previewStatus = "edit";
								estMgr.previewAction(previewStatus);
							}
							btnType = "save";
							estMgr.getEstimateData();
							estMgr.dialogAlertPopup(btnType);
							
						}
					},
					error : function(model, xhr, options){
						console.log("Insert Estimate Error");
					}
				});
				
			}else{
				if(estMgr.previewBtnPress){
					previewStatus = "skip";
					estMgr.previewAction(previewStatus);
				}else{
					//변경된 사항 없음
					btnType = "noChangeedContents";
					estMgr.dialogAlertPopup(btnType);
				}
			}
		},
		
		estimateMailPopup : function(){
			if(w2ui['estMgr_popup_properties'] != undefined){
				var arr = w2ui['estMgr_popup_properties'].validate();
				var productRecords = w2ui['estMgr_product_list_grid'].records;
				if(arr.length > 0){
					return;
				}else if(productRecords.length == 0){
					btnType = "doNotProduct";
					estMgr.dialogAlertPopup(btnType);
				}else{
					btnType = "sendMail";
					estMgr.dialogAlertPopup(btnType);
				}
//				estMgr.sendMail = true;
//				estMgr.checkProcess(); //저장
//				itsmUtil.sendMailFunc("estimate", "estimate01", "c:\welcmoe\to\jiniworld.pdf");
			}else{
				itsmUtil.sendMailFunc("estimate", "estimate01", "c:\welcmoe\to\jiniworld.pdf");
				
			}
		},
		
		estimateMailPopupOK : function(){
			estMgr.sendMail = true;
			estMgr.checkProcess(); //저장
//			itsmUtil.sendMailFunc("estimate", "estimate01", "c:\welcmoe\to\jiniworld.pdf");
		},
		
		estimateMailSuccessHanlder : function(event){
//			event.detail.resultParRam.param.mailSendTime
			
			var result = event.type;
//			estMgr.sendMail = event.detail.resultParRam.param.result;
			if(result == "mailSuccess"){ //보내기 성공
				w2popup.close();
				setTimeout(function(data){
					estMgr.currentEstimate = _.where(w2ui['estimate_list'].records, {estimateId : estMgr.mailSendEstimateId})[0];
					estMgr.estimateEdit();
					estMgr.sendMail = false;
				}, 1000);
			}
		},
		
		estimateAddPopup : function(){
			var btnType = "addEstimate";
			estMgr.dialogAlertPopup(btnType);
		},
		
		estMgrEstimateAddOK : function(){
			if(w2popup.get() != undefined){ //팝업에서 견적추가
				console.log("Add estimate in popup");
				w2popup.close();
				setTimeout(function(data){
					estMgr.estimateAddPopupOpen();
				}, 300);
			}else{
				console.log("Add estimate in estimate list");
				estMgr.estimateAddPopupOpen();
			}
		},
		
		estimateAddPopupOpen : function(){
			var fields = [];
			var record = {};
			var body = "";
			
			estMgr.elements.rightMap = [];
			
			estMgr.getSelectEstimate = w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0];
			estMgr.estimateId = util.createUID();
			estMgr.projectId = estMgr.getSelectEstimate.projectId;
			
			var sameProject = _.where(w2ui['estimate_list'].records, {projectId : estMgr.getSelectEstimate.projectId})
			var edition = _.max(_.pluck(sameProject, "edition"));
			
			fields = [
				{name:'edition', type: 'text', disabled:true, html:{caption:'EDITION'}},
				{name:'project_name', type: 'text', disabled:true, required:true, html:{caption:'프로젝트'}},
				{name:'site_name', type: 'text', disabled:true, required:true, html:{caption:'주문처'}},
				{name:'phone', type: 'text', disabled:true, required:false, html:{caption:'연락처'}},
				{name:'manager', type: 'text', disabled:true, required:false, html:{caption:'고객명'}},
				{name:'email', type: 'text', disabled:true, required:false, html:{caption:'메일 주소'}},
				{name:'registration_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:false, required:true, html:{caption:'요청 일자'}},
				{name:'comfirmed_date', type : 'date', options : {format : 'yyyy-mm-dd'}, disabled:true, required:false, html:{caption:'확정 일자'}},
				{name:'validity', type : 'list', options : {items : estMgr.getValidityList}, disabled:false, required:true, html:{caption:'유효 기간'}},
				{name:'payment', type: 'text', disabled:false, required:true, html:{caption:'지불 조건'}},
				{name:'warranty', type: 'text', disabled:false, required:true, html:{caption:'보증 기간'}},
				{name:'status', type: 'text', disabled:true, required:false, html:{caption:'STATUS'}},
				{name:'estimate_title', type: 'text', disabled:false, required:true, html:{caption:'제목'}},
				{name:'note', type: 'text', disabled:false, required:false, html:{caption:'비고'}}
			];
			
			record = {
					edition : edition+1,
					project_name : estMgr.getSelectEstimate.projectName,
					site_name : estMgr.getSelectEstimate.siteName,
					phone : estMgr.getSelectEstimate.phone,
					manager : estMgr.getSelectEstimate.customerName,
					email : estMgr.getSelectEstimate.email,
					registration_date : util.getDate("Day"),
					comfirmed_date : '',
					validity : estMgr.getValidityList[0],
					payment : '',
					warranty : '',
					status : estMgr.getMailStatusList[2].text,
					estimate_title : '',
					note : ''
			}
			
			body = '<div class="">'+
			'<div id="estMgrPopupContents" style="width:100%; height:580px;" >'+
			
				'<div class="w2ui-page page-0">'+
					
					'<div style="width: 100%; float: left; margin-right: 0px;">'+       
			            '<div class="" style="height: 70px;">'+
			                '<div class="w2ui-field w2ui-span4" style="margin-left:832px;">'+
			                    '<label>EDITION</label>'+
			                    '<div>'+
			                        '<input name="edition" type="text" maxlength="100" size="2" style="text-align:right; border:none; background:none;" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>PROJECT</label>'+
			                    '<div>'+
			                        '<input name="project_name" type="text" maxlength="100" class="input-one-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+
				
			        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+       
			            '<div class="" style="height: 135px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>주문처</label>'+
			                    '<div id="getSiteList">'+
			                    	'<div style="position:relative;">'+
			                        	'<input name="site_name" type="text" readonly="readonly" maxlength="100" class="input-three-area" style="cursor: pointer; background-color: rgba(255, 255, 255, 0.1);" />'+
			                        	'<div style="position:absolute; right:0px; top:7px; color:#fff; width:22px;">'+
  				                        	'<i class="site-name-list fas fa-external-link-alt" aria-hidden="true"></i>'+
  			                        	'</div>'+
			                        '</div>'+
		                        '</div>'+//getSiteList
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>고객명</label>'+
			                    '<div>'+
			                        '<input name="manager" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>보증 기간</label>'+
			                    '<div>'+
			                        '<input name="warranty" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>지불 조건</label>'+
			                    '<div>'+
			                        '<input name="payment" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+//left
			        
			        '<div style="width: 31.2%; float: left; margin-right: 30px;">'+
			            '<div class="" style="height: 135px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>연락처</label>'+
			                    '<div>'+
			                    	'<input name="phone" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>메일 주소</label>'+
			                    '<div>'+
			                    	'<input name="email" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>유효 기간</label>'+
			                    '<div>'+
			                        '<input name="validity" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//middle
		            
		            '<div style="width: 31.2%; float: right; margin-right: 0px;">'+
			            '<div class="" style="height: 135px;">'+
				            '<div class="w2ui-field w2ui-span4">'+
			                    '<label>요청 일자</label>'+
			                    '<div>'+
			                        '<input placeholder="YYYY-MM-DD" name="registration_date" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>확정 일자</label>'+
			                    '<div>'+
			                        '<input placeholder="메일 발송 시 자동 입력" name="comfirmed_date" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>STATUS</label>'+
			                    '<div>'+
			                    	'<input name="status" type="text" maxlength="100" class="input-three-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
		            '</div>'+//right
		            
		            '<div style="width: 100%; float: left; margin-right: 0px;">'+       
			            '<div class="" style="height: 320px;">'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>TITLE</label>'+
			                    '<div>'+
			                        '<input name="estimate_title" type="text" maxlength="100" class="input-one-area" />'+
			                    '</div>'+
			                '</div>'+
			                '<div id="productListResult">'+
				                '<div class="dashboard-panel" style="width:100%;">'+
						    		'<div class="dashboard-title" style="padding:0px; height:30px;">'+
						    			'<div id="productTitle" style="float:left; padding:8px;">'+
						    				'<span>Model List</span>'+
						    			'</div>'+//productTitle
						    			'<div class="product-btn">'+
							                '<i id="productAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
											'<i id="productDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
						                '</div>'+//product-btn
						    		'</div>'+
						    		'<div class="dashboard-contents"><div id="productListResultBottom"></div></div>'+
						    	'</div>'+
			                '</div>'+
			                '<div class="w2ui-field w2ui-span4">'+
			                    '<label>비고</label>'+
			                    '<div>'+
			                        '<input name="note" type="text" maxlength="100" class="input-one-area" />'+
			                    '</div>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+
			            
			        '<div style="clear: both; padding-top: 15px;"></div>'+
			        '<div class="disableClass" style="display:none;"></div>'+
			        
			    '</div>'+ //w2ui-page page-0
			
			'</div>'+ //estMgrPopupContents
			
				'<div id="estMgrPopupBottom" style="float:right; margin-right:15px; position: relative; bottom: 15px;">'+
					'<button id="estMgrEstimatePreviewBtn" class="darkButton">' + BundleResource.getString('button.estimate.preview') + '</button>'+
					'<button id="estMgrRegisterSaveBtn" class="darkButton">' + BundleResource.getString('button.estimate.save') + '</button>'+
					'<button id="estMgrRegisterMailBtn" class="darkButton">' + BundleResource.getString('button.estimate.email') + '</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
				title : BundleResource.getString('title.estimate.addEstimate'),
		        body: body,
		        width : 990,
		        height : 646,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		estMgr.listNotifiCation("getModelTypeList"); //모델 타입 리스트
		        	}
		        },
		        onClose   : function(event){
		        	w2ui['estMgr_popup_properties'].destroy();
		        	w2ui["estMgr_product_list_grid"].destroy();
		        	estMgr.estimateId = null;
		        	estMgr.projectId = null;
		        	estMgr.getSelectEstimate = null;
		        	estMgr.estimateGridValidation();
		        }
		    });
			
			$("#estMgrPopupContents").w2form({
    			name : 'estMgr_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			fields : fields,
    			record: record,
    			onRender : function(event){
    				event.onComplete = function(event){
    					$("#productListResultBottom").w2grid({
    						name : 'estMgr_product_list_grid',
    						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
    						show: { 
    							toolbar: false,
    							footer:false,
    							toolbarSearch:false,
    							toolbarReload  : false,
    							searchAll : false,
    							toolbarColumns : false,
    							selectColumn: true
    						},
							recordHeight : 30,
//							blankSymbol : "-",
							columns : [
								{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
								{ field: 'product_name', caption: 'MODEL', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'spec', caption: 'SPEC', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'},
								{ field: 'quantity', caption: 'QUANTITY', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }},
								{ field: 'u_price', caption: 'U/PRICE', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }},
								{ field: 'amount', caption: 'AMOUNT', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int'},
								{ field: 'product_id', caption: 'PRODUCT ID', hidden: true}
							],
							records : [
								{ w2ui: { summary: true },
									recid: ' ', product_name: '<span style="float: right;">Total</span>', spec: ' ', quantity: '', u_price: '', amount: 0
								}
							],
							onClick : function(event){
								event.onComplete = function(event){
									if(w2ui['estMgr_product_list_grid'].getSelection().length > 0){
										$("#productDelBtn").prop('disabled', false);
										$("#productDelBtn").addClass('link');
									}else{
										$("#productDelBtn").prop('disabled', true);
										$("#productDelBtn").removeClass('link');
									}
								}
							},
							onSelect : function(event){
								if(w2ui['estMgr_product_list_grid'].getSelection().length > 0){
									$("#productDelBtn").prop('disabled', false);
									$("#productDelBtn").addClass('link');
								}else{
									$("#productDelBtn").prop('disabled', true);
									$("#productDelBtn").removeClass('link');
								}
							},
							onChange : function(event){ //입력 완료했을 때
								event.onComplete = function(event){
									estMgr.productChangeAction();
								}
							}
    					});
    					w2ui['estMgr_product_list_grid'].summary[0].quantity = '';
    					w2ui['estMgr_product_list_grid'].summary[0].u_price = '';
    					w2ui['estMgr_product_list_grid'].refresh();
    				}
    			}
    		});
			estMgr.selectAddItem = w2ui['estMgr_popup_properties'].record;
			$("#productDelBtn").prop('disabled', true);
			$("#productDelBtn").removeClass('link');
		},
		
		refreshProductTable : function(item){
			w2ui['estMgr_product_available'].selectNone();
			
			var dataProvider = [];
			var leftMap = estMgr.elements.leftMap;
			for(var name in leftMap){
				dataProvider.push(leftMap[name]);
			}
			var leftImAC = null;
			
			if(item === "All"){
				var result = _.filter(dataProvider, function(obj){
					for(var i in dataProvider){
						return obj;
					}
				});
				
				leftImAC = _.sortBy(result, 'product_name');
			}else{
				leftImAC = _.sortBy(_.filter(dataProvider, function(obj){
					return obj.product_type === item;
				}), 'product_name');
			}
			
			for(var j in leftImAC){
				var item = leftImAC[j];
				item.recid = j+1;
			}
			
			w2ui['estMgr_product_available'].records = leftImAC;
			w2ui['estMgr_product_available'].refresh();
			
		},
		
		productValidation : function(){
			var proLeftGrid = w2ui['estMgr_product_available'].get(w2ui['estMgr_product_available'].getSelection());
			if(proLeftGrid.length > 0){
				//선택한 항목이 있을때
				$("#proRightBtn").prop('disabled', false);
        		$("#proRightBtn").css('opacity', 1);
        		document.getElementById("proRightBtn").className = "darkButton";
			}else{
				//선택한 항목이 없을때
				$("#proRightBtn").prop('disabled', true);
        		$("#proRightBtn").css('opacity', 0.4);
        		document.getElementById("proRightBtn").className = "darkButtonDisable";
			}
		},
		
		estimateGridValidation : function(){
			if(w2ui['estimate_list'].getSelection().length > 0){
				if(w2ui['estimate_list'].get(w2ui['estimate_list'].getSelection())[0].status == 1){ //발송
					$("#estMgrRegisterBtn").prop('disabled', false);
					$("#estMgrRegisterBtn").addClass('link');
					$("#estMgrDelBtn").prop('disabled', true);
					$("#estMgrDelBtn").removeClass('link');
				}else{ //미발송
					$("#estMgrRegisterBtn").prop('disabled', true);
					$("#estMgrRegisterBtn").removeClass('link');
					$("#estMgrDelBtn").prop('disabled', false);
					$("#estMgrDelBtn").addClass('link');
				}
				$("#estMgrEditBtn").prop('disabled', false);
				$("#estMgrEditBtn").addClass('link');
			}else{
				$("#estMgrRegisterBtn").prop('disabled', false);
				$("#estMgrRegisterBtn").addClass('link');
				$("#estMgrDelBtn").prop('disabled', true);
				$("#estMgrDelBtn").removeClass('link');
				$("#estMgrEditBtn").prop('disabled', true);
				$("#estMgrEditBtn").removeClass('link');
			}
		},
		
		updateInvalidate : function(){
			var validateFlag = false;
			var popupType = w2popup.get().type;
			var orgData = null;
			var newData = w2ui['estMgr_popup_properties'].record;
			
			if(popupType === "create"){
				orgData = _.where(w2ui['estimate_list'].records, {estimateId : estMgr.estimateId})[0];
				if(orgData == undefined || orgData.length == 0){
					return validateFlag = true;
				}
			}else if(popupType === "update"){
				orgData = _.where(w2ui['estimate_list'].records, {estimateId : estMgr.getSelectEstimate.estimateId})[0];
			}
			
			if(newData.project_name != orgData.projectName){
				validateFlag = true;
			}
			if(newData.site_name != orgData.siteName){
				validateFlag = true;
			}
			if(newData.phone != orgData.phone){
				validateFlag = true;
			}
			if(newData.manager != orgData.customerName){
				validateFlag = true;
			}
			if(newData.email != orgData.email){
				validateFlag = true;
			}
			if(newData.validity.id != orgData.validity){
				validateFlag = true;
			}
			if(newData.registration_date != orgData.registrationDate){
				validateFlag = true;
			}
			if(newData.warranty != orgData.warranty){
				validateFlag = true;
			}
			if(newData.payment != orgData.payment){
				validateFlag = true;
			}
			if(newData.estimate_title != orgData.estimateTitle){
				validateFlag = true;
			}
			if(newData.note != orgData.note){
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
		
		dialogAlertPopup : function(btnType){
			var bodyContents = ""; //알림 내용이 들어갈 변수
			
			if($('body').find("#doublePopup").size() == 0 ){
				$('body').append("<div id='doublePopup'></div>");
			}
			$("#doublePopup").dialog({
				title : BundleResource.getString('title.estimate.info'),
				width : 385,
				height : 180,
				style : 'top:298px',
				modal : true,
				resizable: false,
				dialogClass : "customAlertPopup",
				show: { effect: "fade", duration: 300 },
			    hide: { effect: "fade", duration: 100 },
				buttons : {
					"확인" : function(){
						$(this).dialog("close");
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					if(btnType === "preview"){
						//"자동 저장 후 미리보기가 실행됩니다. 계속하시겠습니까?"
						bodyContents = BundleResource.getString('label.estimate.savePreview');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(0)").addClass("estMgrEstimatePreviewOKBtn");
					}else if(btnType === "addEstimate"){
						//"해당 프로젝트에 견적을 추가 하시겠습니까?"
						bodyContents = BundleResource.getString('label.estimate.addEstimateConfirm');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(0)").addClass("estMgrEstimateAddOKBtn");
					}else if(btnType === "save"){
						//"데이터가 정상적으로 저장 되었습니다."
						bodyContents = BundleResource.getString('label.estimate.successSave');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(1)").remove();
					}else if(btnType === "doNotProduct"){
						//"제품을 선택해 주세요."
						bodyContents = BundleResource.getString('label.estimate.noProduct');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(1)").remove();
					}else if(btnType === "noChangeedContents"){
						//"변경된 내용이 없습니다."
						bodyContents = BundleResource.getString('label.estimate.noChangeedContents');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(1)").remove();
					}else if(btnType === "sendMail"){
						//"자동 저장 후 메일 보내기가 실행됩니다. 계속하시겠습니까?"
						bodyContents = BundleResource.getString('label.estimate.sendMailConfirm');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(0)").addClass("estMgrRegisterMailBtnOK");
					}
					
					$("#doublePopup").append('<div id="dialogAlertPopupArea"></div>');
					var dialogAlertPopupArea = '<div id="dialogAlertPopupContents">'+	bodyContents +	'</div>';
					$("#dialogAlertPopupArea").html(dialogAlertPopupArea);
					
				},
				close : function(){
					$("#doublePopup").remove();
					
				}
			});
		},
		
		destroy : function(){
			if(w2ui['estMgr_layout']){
				w2ui['estMgr_layout'].destroy();
			}
			
			if(w2ui['estimate_search_options']){
				w2ui['estimate_search_options'].destroy();
			}
			
			if(w2ui['estimate_list']){
				w2ui['estimate_list'].destroy();
			}
			
			if(w2ui['estMgr_popup_properties']){
				w2ui['estMgr_popup_properties'].destroy();
			}
			
			if(w2ui["estMgr_product_list_grid"]){
				w2ui["estMgr_product_list_grid"].destroy();
			}
			
			if(w2ui['siteTree']){
				w2ui['siteTree'].destroy();
			}
			
			if(w2ui['estMgr_site_popup']){
				w2ui['estMgr_site_popup'].destroy();
			}
			
			if(w2ui['estMgr_product_available']){
				w2ui['estMgr_product_available'].destroy();
			}
			
			if(w2ui['estMgr_product_selected']){
				w2ui['estMgr_product_selected'].destroy();
			}
			
			estMgr = null;
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
		}
		
	});
	return Main;
});