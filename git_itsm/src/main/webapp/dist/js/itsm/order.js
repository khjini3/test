define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/itsm/order",
    "w2ui",
    "js/lib/component/BundleResource",
    "text!views/itsm/orderSvg",
    "css!cs/itsm/order"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource,
	orderSvg
){
	$(window.document).on("contextmenu", function(event){return false;});
	
	var that;
	var Model = Backbone.Model.extend({
		
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.getPeriodTypeList = [];
			this.getOrderStatusList = [];
			this.getMailStatusList = [];
			this.getOrderYearList = [];
			
			this.selectedEstimate = null;
			this.selectedTab = null;
			this.selectedTabIdx = 0;
			this.popupMode = "addMode";
			this.cnvtDay = util.getDate("Day");
			this.cnvtMonth = util.getDate("Month");
			this.cnvtYear = util.getDate("Year");
			this.cnvtTime = util.getDate("Time");
			this.daysAgo = util.daysAgo(30);
			
			this.elements = {
					
    		};
			this.getOrderParameters();
			this.getYearList();
			
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
		
        getOrderParameters : function(){
        	var getParams = new Model();
			getParams.url = "/order/getOrderParameters";
			that.listenTo(getParams, 'sync', that.setOrderParameters);
			getParams.fetch();
        },
        
        setOrderParameters : function(method, model, options){
        	that.getMailStatusList = model[0].mailStatus;
        	that.getOrderStatusList = model[0].orderStatus;
        	that.getPeriodTypeList = model[0].period;
        	
    		that.init();
    		
    		that.getOrderData();
    		//that.getStatusCounts();
        },
        
        getYearList : function(){
        	var getYearList = new Model();
        	getYearList.url = "/order/getYearList";
			that.listenTo(getYearList, 'sync', that.setYearList);
			getYearList.fetch();
        },
        
        setYearList : function(model, response){
        	if(response.length == 0){
        		that.getOrderYearList = [{text : that.cnvtYear, id : 1}];
        	}else{
        		var yearData = response;
        		_.each(yearData, function(item, idx){
        			item.text = item.text;
        			item.id = idx+1;
        		})
        		that.getOrderYearList = yearData;
        	}
        },
        
        getStatusCounts : function(year){
			if(year == undefined){
				var year = w2ui['order_search_options'].record.selectYear.text;
			}
			var getStatusCounts = new Model();
			getStatusCounts.url = 'order/getStatusCounts/'+year;
			that.listenTo(getStatusCounts, 'sync', that.setStatusCounts);
			getStatusCounts.fetch();
		},
		
		setStatusCounts : function(model, response){
			var keys = _.keys(response);
			var values = _.values(response);
			for(var i = 0; i < keys.length; i++){
				var id = keys[i];
				var count = values[i];
				$("#"+id).text(count+"건");
			}
		},
		
        getOrderData : function(){
        	var params = w2ui['order_search_options'].record;
        	
        	if(params.orderSearchType.id != undefined){
        		params.orderSearchType = params.orderSearchType.id;
        	}
        	if(params.orderStatus.value != undefined){
        		params.orderStatus = params.orderStatus.value;
        	}
        	if(params.orderCompany == null){
        		params.orderCompany = "";
        	}
        	if(params.orderCompanyManager == null){
        		params.orderCompanyManager = "";
        	}
        	params.startRow = 0;
        	params.endRow = 9;
        	params.orderSearchDayMonth = $("#orderSearchDayMonth").val();
			var getOrderData = new Model(params);
			getOrderData.url = "/order/getOrderData";
			getOrderData.save(null, {
				success : function(model, response){
					if($('#ordMgrPager').data("twbs-pagination")){
						$('#ordMgrPager').pager("destroy").off("click");
						var pageGroup = '<div class="order-pager" id="ordMgrPager" data-paging="true"></div></div>';
						$("#ordMgrPagerTable").html(pageGroup);
					}
					
					$('#ordMgrPager').pager({
						"totalCount" : response.totalCount,
						"pagePerRow" : 9
					}).on("click", function (event, page) {
						var evtClass = $(event.target).attr('class');
						if(evtClass != 'page-link') return;
						
						var pagination = $('#ordMgrPager').data('twbsPagination');
						
						var currentPage = pagination.getCurrentPage();
						
						var requestParam = that.requestParam;
						
						var endRow = 9;
						var startRow = (currentPage*endRow) - endRow;
						
						var params = w2ui['order_search_options'].record;
			        	
			        	if(params.orderSearchType.id != undefined){
			        		params.orderSearchType = params.orderSearchType.id;
			        	}
			        	if(params.orderStatus.value != undefined){
			        		params.orderStatus = params.orderStatus.value;
			        	}
			        	if(params.orderCompany == null){
			        		params.orderCompany = "";
			        	}
			        	if(params.orderCompanyManager == null){
			        		params.orderCompanyManager = "";
			        	}
			        	params.startRow = startRow;
			        	params.endRow = endRow;
			        	params.orderSearchDayMonth = $("#orderSearchDayMonth").val();
						
						var model = new Model(params);
						model.url = "/order/getOrderData";
						model.save();
						that.listenTo(model, "sync", that.refreshView);
						
					});
					
					var pagination = $('#ordMgrPager').data('twbsPagination');
					var currentPage = pagination.getCurrentPage();
					
					
					$('#ordMgrPager').pager('pagerTableCSS', ".order-pager .pagination", response.totalCount, currentPage);
					
					/*w2ui['estimate_list'].clear();
					w2ui['estimate_list'].records = model.attributes.data.result;
					w2ui['estimate_list'].refresh();*/
					
					that.setOrderData(response);
				}
			});
        },
        
        setOrderData : function(response){
        	w2ui['order_list'].records = response.result;
        	w2ui['order_list'].refresh();
        	itsmUtil.setOrderStatus(response.result);
        	w2ui["order_list"].selectNone();
        	that.validationCheck();
        	that.getStatusCounts();
        },
        
        refreshView : function(model, method, optoins){
        	w2ui['order_list'].records = model.attributes.result;
        	w2ui['order_list'].refresh();
        	itsmUtil.setOrderStatus(model.attributes.result);
        	w2ui["order_list"].selectNone();
        	that.validationCheck();
        },
        
        
		eventListenerRegister : function(){
			$(document).on("click", "#orderSearchBtn", this.searchOrderListData);
			$(document).on("click", "#orderEstimateAddBtn", this.orderEstimateAddAction);
			$(document).on("click", "#searchEstimateConfirmBtn", this.popupCloseAction);
			$(document).on("click", "#estimateSearchBtnPopup", this.getEstimateList);
			$(document).on("click", "#searchOrderPreviewBtn", this.orderPreviewPopup);
			$(document).on("click", "#orderPreviewOkBtn", this.orderPreviewAction);
			$(document).on("click", "#searchOrderPrevBtn", this.changePrevTab);
			$(document).on("click", "#searchOrderNextBtn", this.changeNextTab);
			$(document).on("click", "#getSupplyCompany", this.getSupplyCompany);
			$(document).on("click", "#getUsingCompany", this.getSupplyCompany);
			$(document).on("click", "#getOrderCompany", this.getOrderCompany);
			$(document).on("click", "#shipAddBtn", this.addShipping);
			$(document).on("click", "#shipModifyBtn", this.modifyShipping);
			$(document).on("click", "#shipDelBtn", this.deleteShipping);
			$(document).on("click", "#shipAttachBtn", this.attachFiles);
			$(document).on("click", "#incomeAddBtn", this.addIncome);
			$(document).on("click", "#incomeModifyBtn", this.modifyIncome);
			$(document).on("click", "#incomeDelBtn", this.deleteIncome);
			$(document).on("click", "#portAttachBtn", this.attachFiles);
			$(document).on("click", "#customsDownloadBtn", this.customsDownload);
			$(document).on("click", "#customsAttachBtn", this.attachFiles);
			$(document).on("click", "#deliveryAttachBtn", this.attachFiles);
			$(document).on("click", "#searchOrderSaveBtn", this.orderSaveAction);
			$(document).on("click", "#orderSaveOk", this.orderSaveOkAction);
			$(document).on("click", "#orderModifyOk", this.orderSaveOkAction);
			$(document).on("click", "#orderEditBtn", this.orderEditAction);
			$(document).on("click", "#orderDelBtn", this.orderDeleteAction);
			$(document).on("click", "#orderDelOk", this.orderDeleteOkAction);
			$(document).on("click", "#orderEmailBtn", this.orderEmailAction);
			document.addEventListener("mailSuccess", this.orderMailSuccessHanlder);
			document.addEventListener("attachFileSuccess", this.fileAttachSuccess);
			$(document).on("dblclick", ".svgGroup", function(event){
				var statusCls = $(event.target).attr("class");
				ordMgr.clickStatus = null;
				if(statusCls.match("order")){
					ordMgr.clickStatus = "orderTab";
				}else if(statusCls.match("ship")){
					ordMgr.clickStatus = "shipTab";
				}else if(statusCls.match("port")){
					ordMgr.clickStatus = "incomeTab";
				}else if(statusCls.match("customs")){
					ordMgr.clickStatus = "customsTab";
				}else if(statusCls.match("delivery")){
					ordMgr.clickStatus = "deliveryTab";
				}else{ //null 
					return;
				}
				that.popupMode = "modifyMode";
				var selectedData = w2ui['order_list'].get(w2ui['order_list'].getSelection());
				var selectedOrderId = selectedData[0].order_id;
				that.getSelectedOrderData(selectedOrderId);
			});
			$(document).on("dblclick", ".report-history-preview-btn", function(event){
				console.log("test");
			})
		},
		
		removeEventListener : function(){
			$(document).off("click", "#orderSearchBtn");
			$(document).off("click", "#orderEstimateAddBtn");
			$(document).off("click", "#searchEstimateConfirmBtn");
			$(document).off("click", "#estimateSearchBtnPopup");
			$(document).off("click", "#searchOrderPreviewBtn");
			$(document).off("click", "#orderPreviewOkBtn");
			$(document).off("click", "#searchOrderPrevBtn");
			$(document).off("click", "#searchOrderNextBtn");
			$(document).off("click", "#getSupplyCompany");
			$(document).off("click", "#getUsingCompany");
			$(document).off("click", "#getOrderCompany");
			$(document).off("click", "#shipAddBtn");
			$(document).off("click", "#shipModifyBtn");
			$(document).off("click", "#shipDelBtn");
			$(document).off("click" ,"#shipAttachBtn");
			$(document).off("click", "#incomeAddBtn");
			$(document).off("click", "#incomeModifyBtn");
			$(document).off("click", "#incomeDelBtn");
			$(document).off("click", "#portAttachBtn");
			$(document).off("click", "#customsDownloadBtn");
			$(document).off("click", "#customsAttachBtn");
			$(document).off("click", "#deliveryAttachBtn");
			$(document).off("click", "#searchOrderSaveBtn");
			$(document).off("click", "#orderSaveOk");
			$(document).off("click", "#orderModifyOk");
			$(document).off("click", "#orderEditBtn");
			$(document).off("click", "#orderDelBtn");
			$(document).off("click", "#orderDelOk");
			$(document).off("click", "#orderEmailBtn");
			document.removeEventListener("mailSuccess", this.orderMailSuccessHanlder);
			document.removeEventListener("attachFileSuccess", this.fileAttachSuccess);
			$(document).off("dblclick", ".svgGroup");
			$(document).off("dblclick", ".report-history-preview-btn");
		},
		
		init : function(){
			ordMgr = this;
			
			$("#orderContentsDiv").w2layout({
				name : 'orderMgr_layout',
				panels : [
					{type:'top', size:'11.5%', resizable:false, content:'<div id="searchOrderContents"></div>'},
					{type:'main', size:'100%', resizable:false, content:'<div id="mainOrderContents"></div>'}
				]
			});
			
			var searchOrderContents = '<div class="dashboard-panel" id="searchOrderTop" style="width:100%;">'+
				'<div id="searchOrderBottom">'+
					'<div class="w2ui-page page-0">'+
					
						'<div class="search-options border summaryArea">'+
							'<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
						            '<label>연도</label>'+
			        				/*'<div class="inputArea" style="margin-left: 17px;">'+
										'<input name="selectYear" type="list" size="40" style="width:100px;" />'+
			    					'</div>'+*/
			    					
			        			'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label style="margin-left: 5px;margin-top: -4px;"><input name="selectYear" type="list" size="40" style="width:100px;" /></label>'+
			        			'</div>'+
				        	'</div>'+	
						'</div>'+
						
						'<div class="search-options border summaryArea">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label>발주</label>'+
			        			'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label id="orderCount"></label>'+
			        			'</div>'+
		            		'</div>'+
		        		'</div>'+//search-options
					
						'<div class="search-options border summaryArea">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label>선적</label>'+
		        				'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label id="shipCount"></label>'+
			        			'</div>'+
		            		'</div>'+
		        		'</div>'+//search-options
					
						'<div class="search-options border summaryArea">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label>입항</label>'+
		        				'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label id="portCount"></label>'+
			        			'</div>'+
		            		'</div>'+
		        		'</div>'+//search-options
		
						'<div class="search-options border summaryArea">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label>통관</label>'+
		        				'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label id="customsCount"></label>'+
			        			'</div>'+
			        		'</div>'+
			    		'</div>'+//search-options
		
					
						'<div class="search-options border summaryArea">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label>배송</label>'+
		        				'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label id="deliveryCount"></label>'+
			        			'</div>'+
		            		'</div>'+
						'</div>'+
				
						'<div class="search-options border">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label class="searchPopupText">타  입</label>'+
			        				'<div class="inputArea">'+
										'<input name="orderSearchType" type="list" size="40" style="width:171px;" />'+
			    					'</div>'+
			        			'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label class="searchPopupText">발주등록일</label>'+
			        				'<div id="orderDailyMonthly" class="w2ui-field inputArea" style="padding-right:0px;">'+
										'<input name="orderSearchDayMonth" type="searchDayMonth" class="noselect" size="10" style="width:171px;"/>'+
									'</div>'+
			    					'<div class="orderPeriodic w2ui-field inputArea" style="padding-right:0px; color: #fff;">'+
			    						'<input name="orderSearchFromPeriod" type="orderSearchFromPeriod" class="noselect" size="10" /> ~ <input name="orderSearchToPeriod" type="orderSearchToPeriod" size="10" />'+
			    					'</div>'+
			        			'</div>'+
			        		'</div>'+
			    		'</div>'+//search-options
			    		
			    		'<div class="search-options border">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label class="searchPopupText">업체명</label>'+
			        				'<div class="inputArea">'+
										'<input name="orderCompany" type="text" size="40" style="width:171px;" />'+
			    					'</div>'+
			        			'</div>'+
			        			'<div class="w2ui-field">'+
			        				'<label class="searchPopupText">고객 이름</label>'+
			        				'<div class="inputArea">'+
										'<input name="orderCompanyManager" type="text" size="40" style="width:171px;" />'+
			    					'</div>'+
			        			'</div>'+
			        		'</div>'+
			    		'</div>'+//search-options
			    		
			    		'<div class="search-options border">'+
				            '<div class="" style="height: 62px;">'+
					            '<div class="w2ui-field">'+
			        				'<label class="searchPopupText">STATUS</label>'+
			        				'<div class="inputArea">'+
										'<input name="orderStatus" type="list" size="40" style="width:171px;" />'+
			    					'</div>'+
			        			'</div>'+
			        		'</div>'+
			    		'</div>'+//search-options
			    		
			    		'<div style="float:left; margin-left:0px;">'+
				            '<div class="" style="height: 62px; text-align: center; float: right;">'+
				            	'<div><button id="orderSearchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.estimate.search') + '</button></div>'+
		            		'</div>'+
	            		'</div>'+
	            		
		    		'</div>'+//w2ui-page page-0
				'</div>'+//searchBottom
			'</div>';//dashboard-panel
	
			var mainOrderContents = '<div id="mainOrderTop">'+
					'<div class="align-left-btn"></div>'+
				'</div>'+//mainTop
				'<div class="dashboard-panel" style="width:100%;">'+
					'<div class="dashboard-title">'+
						'<div class="estimateListTitle" style="float:left; padding:0px;">'+
							'<span>Order List</span>'+
						'</div>'+
						'<div class="align-right-btn">'+
							'<i id="orderEstimateAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
							'<i id="orderDelBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
							'<i id="orderEditBtn" class="icon fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
						'</div>'+
					'</div>'+
					'<div class="dashboard-contents">'+
						'<div id="mainOrderBottom"></div>'+
						'<div class="pager-table-area" id="ordMgrPagerTable">'+
							'<div class="order-pager" id="ordMgrPager" data-paging="true"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+//dashboard-panel
			'<div id="estimateAddPopup"></div>'+
			'<div id="productAddPopup"></div>';
		
			$("#searchOrderContents").html(searchOrderContents);
			$("#mainOrderContents").html(mainOrderContents);

			$(".yearText").text(that.cnvtYear+" 발주 현황");
			
			$("#searchOrderBottom").w2form({
				name : 'order_search_options',
				focus : -1,
				fields : [
					{name : 'selectYear', type : 'list', options : {items : that.getOrderYearList}},
					{name : 'orderSearchType', type : 'list', options : {items : that.getPeriodTypeList}},
					{name : 'orderSearchDayMonth', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'orderSearchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'orderSearchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'orderCompany', type : 'text'},
					{name : 'orderCompanyManager', type : 'text'},
					{name : 'orderStatus', type : 'list', options : {items : that.getOrderStatusList}}
				],
				record : {
					selectYear : that.getOrderYearList[0],
					orderSearchType : that.getPeriodTypeList[2],
					orderSearchDayMonth : '',
					orderSearchFromPeriod : that.daysAgo,
					orderSearchToPeriod : that.cnvtDay,
					orderCompany : '',
					orderCompanyManager : '',
					orderStatus : that.getOrderStatusList[0]
				},
				onChange : function(event){
					var eventTarget = event.target;
					if("orderSearchType" == eventTarget){
						if(3 == event.value_new.id){ // 기간
							$(".orderPeriodic").show();
							$("#orderDailyMonthly").hide();
							
							$("#orderSearchDayMonth").val('');
							$("#orderSearchFromPeriod").val('');
							$("#orderSearchToPeriod").val('');
							
							$("#orderSearchFromPeriod").attr("placeholder", "yyyy-mm-dd");
							$("#orderSearchToPeriod").attr("placeholder", "yyyy-mm-dd");
							
							$("#orderSearchFromPeriod").val(that.daysAgo);
							$("#orderSearchToPeriod").val(that.cnvtDay);
							
						}else if(2 == event.value_new.id){ // 월간
							
							$(".orderPeriodic").hide();
							$("#orderDailyMonthly").show();
							
							$("#orderSearchDayMonth").val('');
							$("#orderSearchFromPeriod").val('');
							$("#orderSearchToPeriod").val('');
							$("#orderSearchDayMonth").attr("placeholder", "yyyy-mm");
							$("#orderSearchDayMonth").val(that.cnvtMonth);
							//$("#searchDayMonth").attr("readonly", true);
							
						}else{ // Default = 일간
							$(".orderPeriodic").hide();
							$("#orderDailyMonthly").show();
							
							$("#orderSearchDayMonth").val('');
							$("#orderSearchFromPeriod").val('');
							$("#orderSearchToPeriod").val('');
							$("#orderSearchDayMonth").attr("placeholder", "yyyy-mm-dd");
							$("#orderSearchDayMonth").val(that.cnvtDay);
							//$("#searchDayMonth").attr("readonly", true);
						}
					}else if("selectYear" == eventTarget){
						var selectedYear = event.value_new.text; //2017, 2018
						ordMgr.getStatusCounts(selectedYear);
					}
					
				}
			});
			
			//$(".orderPeriodic").hide();
			$("#orderDailyMonthly").hide();
			$('input[type=orderSearchFromPeriod').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=orderSearchToPeriod]')});
			$('input[type=orderSearchToPeriod').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=orderSearchFromPeriod]')});
			
			$("#mainOrderBottom").w2grid({
				name : 'order_list',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false,
					selectColumn: false,
				},
				recordHeight : 70,
				blankSymbol : "-",
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'project_name', caption: 'PROJECT', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'site_name', caption: '업체명', size : '200px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'customer_name', caption: '고객명', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'total_amount', caption: '발주금액', size : '200px', sortable: true, attr: 'align=right', style: 'padding-right:5px;',
         				render : function(record){
         					var totalAmount =  record.total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         					return totalAmount;
         				}
         			},
         			{ field: 'order_start_date', caption: '발주등록일', size : '200px', sortable: true, attr: 'align=center'},
         			{ field: 'status', caption: 'STATUS', size : '400px', sortable: true, attr: 'align=left', style: 'padding-left:5px;',
         				render : function(record){
         					let tt = '<div id="divContainer'+record.recid+'" style="width:400px;height:70px;">'+
         						orderSvg + 
         					'</div>';
         					return tt;
         				}
         			},
         			{ field: 'preview', caption: 'PREVIEW', size : '150px', sortable: true, attr: 'align=center',
         				render : function(record){
         					var html;
                		    if(record.reserve_str == 0){//pdf
                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon link fab fa-preview fa-2x preview-btn report-history-preview-btn" style="font-size: 2em !important;"historyid='+record.estimate_id+'></i></div>';	   			   	
                		    }else{
                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon fab fa-preview fa-2x  preview-btn  disabled" style="cursor: default;font-size: 2em !important;" historyid='+record.estimate_id+' ></i></div>';
                		    }
                		    return html;
         				}
         			}
         			
				],
				record : {
					recid : '',
					project_name : '',
					customer_name : '',
					orderAmount : '',
					order_start_date : '',
					site_name : '',
					status : '',
					down : '',
					preview : ''
				},
				onDblClick : function(event){
					var clickedColumn = event.column;
					if(clickedColumn == 6 || clickedColumn == 7){
						return;
					}else{
						event.onComplete = function(){
							that.popupMode = "modifyMode";
							var selectedData = w2ui['order_list'].get(w2ui['order_list'].getSelection());
							var selectedOrderId = selectedData[0].order_id;
							that.getSelectedOrderData(selectedOrderId);
						}
					}
				}
			});
			/*w2ui["order_list"].on({execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});*/
        	
        	w2ui["order_list"].on({execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["order_list"].on({execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["order_list"].on({phase:'after', type:'sort', execute:'after'}, function(event){
        		event.onComplete = function(){
        			setTimeout(function(){
        				itsmUtil.setOrderStatus(w2ui["order_list"].records);
        			}, 2);
        		}
        	})
			this.eventListenerRegister();
		},
		
		validationCheck : function(){ //gihwanvalid
			var selectedData = w2ui["order_list"].getSelection().length;
			
			if(selectedData == 0){
				$("#orderEditBtn").prop("disable", true);
				$("#orderEditBtn").removeClass('link');
				$("#orderDelBtn").prop("disable", true);
				$("#orderDelBtn").removeClass('link');
			}else if(selectedData == 1){
				$("#orderEditBtn").prop("disable", false);
				$("#orderEditBtn").addClass('link');
				$("#orderDelBtn").prop("disable", false);
				$("#orderDelBtn").addClass('link');
			}else{
				$("#orderEditBtn").prop("disable", true);
				$("#orderEditBtn").removeClass('link');
				$("#orderDelBtn").prop("disable", false);
				$("#orderDelBtn").addClass('link');
			}
			if(w2ui["ship_tab_options"] == undefined){
				return;
			}else{
				var selectedShippingData = w2ui["ship_tab_options"].getSelection().length;
				var shippingComplete = $("#shipCheckComp").prop("checked");
				if(shippingComplete == false){
					$("#shipAddBtn").prop("disable", false);
					$("#shipAddBtn").addClass('link');
					if(selectedShippingData == 0){//shipModifyBtn, shipDelBtn
						$("#shipModifyBtn").prop("disable", true);
						$("#shipModifyBtn").removeClass('link');
						$("#shipDelBtn").prop("disable", true);
						$("#shipDelBtn").removeClass('link');
					}else if(selectedShippingData == 1){
						$("#shipModifyBtn").prop("disable", false);
						$("#shipModifyBtn").addClass('link');
						$("#shipDelBtn").prop("disable", false);
						$("#shipDelBtn").addClass('link');
					}else{
						$("#shipModifyBtn").prop("disable", true);
						$("#shipModifyBtn").removeClass('link');
						$("#shipDelBtn").prop("disable", false);
						$("#shipDelBtn").addClass('link');
					}
				}else if(shippingComplete == true){
					$("#shipAddBtn").prop("disable", true);
					$("#shipAddBtn").removeClass('link');
					$("#shipModifyBtn").prop("disable", true);
					$("#shipModifyBtn").removeClass('link');
					$("#shipDelBtn").prop("disable", true);
					$("#shipDelBtn").removeClass('link');
				}
			}
			if(w2ui['income_tab_options'] == undefined){
				return;
			}else{
				var selectedIncomeData = w2ui['income_tab_options'].getSelection().length;
				var incomeComplete = $("#incomeCheckComp").prop("checked");
				if(incomeComplete == false){
					$("#incomeAddBtn").prop("disable", false);
					$("#incomeAddBtn").addClass('link');
					if(selectedIncomeData == 0){//shipModifyBtn, shipDelBtn
						$("#incomeModifyBtn").prop("disable", true);
						$("#incomeModifyBtn").removeClass('link');
						$("#incomeDelBtn").prop("disable", true);
						$("#incomeDelBtn").removeClass('link');
					}else if(selectedIncomeData == 1){
						$("#incomeModifyBtn").prop("disable", false);
						$("#incomeModifyBtn").addClass('link');
						$("#incomeDelBtn").prop("disable", false);
						$("#incomeDelBtn").addClass('link');
					}else{
						$("#incomeModifyBtn").prop("disable", true);
						$("#incomeModifyBtn").removeClass('link');
						$("#incomeDelBtn").prop("disable", false);
						$("#incomeDelBtn").addClass('link');
					}
				}else if(incomeComplete == true && that.popupMode == "modifyMode"){
					$("#incomeAddBtn").prop("disable", true);
					$("#incomeAddBtn").removeClass('link');
					$("#incomeModifyBtn").prop("disable", true);
					$("#incomeModifyBtn").removeClass('link');
					$("#incomeDelBtn").prop("disable", true);
					$("#incomeDelBtn").removeClass('link');
				}
			}
		},
		
		searchOrderListData : function(){
			that.getOrderData();
		},
		
		getSelectedOrderData: function(selectedOrderId){ //gihwanselectedorder
			var getSelectedOrderData = new Model();
			getSelectedOrderData.url = 'order/getSelectedOrderData/'+selectedOrderId;
			that.listenTo(getSelectedOrderData, 'sync', that.setSelectedOrderData);
			getSelectedOrderData.fetch();
		},
		
		setSelectedOrderData : function(method, model, options){
			ordMgr.getModifyOrderData = model.orderData[0];
			ordMgr.getModifyProductData = model.productData;
			ordMgr.getModifyShippingData = model.shippingData;
			ordMgr.getModifyPortData = model.portData;
			ordMgr.getModifyCustomsData = model.customsData;
			ordMgr.getModifyDeliveryData = model.deliveryData;
			ordMgr.searchEstimateConfirmAction();
		},
		
		getRefreshData : function(selectedOrderId){
			var getSelectedOrderData = new Model();
			getSelectedOrderData.url = 'order/getSelectedOrderData/'+selectedOrderId;
			that.listenTo(getSelectedOrderData, 'sync', that.setRefreshData);
			getSelectedOrderData.fetch();
		},
		
		setRefreshData : function(method, model, options){
			ordMgr.getModifyOrderData = model.orderData[0];
			ordMgr.getModifyProductData = model.productData;
			ordMgr.getModifyShippingData = model.shippingData;
			ordMgr.getModifyPortData = model.portData;
			ordMgr.getModifyCustomsData = model.customsData;
			ordMgr.getModifyDeliveryData = model.deliveryData;
			that.settingTab();
		},
		
		orderEstimateAddAction : function(){
			var body = '<div id="searchEstimatePopupContents" style="width:100%; height:85px" >'+
							'<div class="w2ui-page page-0">'+
								
								'<div class="popup-options">'+
						            '<div class="" style="height: 62px;">'+
							            '<div class="w2ui-field">'+
					        				'<label class="estimatePopupText">타  입</label>'+
					        				'<div>'+
												'<input name="estimateSearchTypePopup" type="list" size="40" style="width:194px;" />'+
					    					'</div>'+
					        			'</div>'+
					        			'<div class="w2ui-field">'+
					        				'<label class="estimatePopupText">요청기간</label>'+
					        				'<div id="estimateDailyMonthlyPopup" class="w2ui-field" style="padding-right:0px;">'+
												'<input name="estimateSearchDayMonthPopup" type="searchDayMonth" class="noselect" size="12" style="width:194px;"/>'+
											'</div>'+
					    					'<div class="estimatePeriodicPopup w2ui-field" style="padding-right:0px; color: #fff;">'+
					    						'<input name="estimateSearchFromPeriodPopup" type="estimateSearchFromPeriodPopup" class="noselect" size="12" /> ~ <input name="estimateSearchToPeriodPopup" type="estimateSearchToPeriodPopup" size="12" />'+
					    					'</div>'+
					        			'</div>'+
					        		'</div>'+
					    		'</div>'+//popup-options
					    		
					    		'<div class="popup-options">'+
						            '<div class="" style="height: 62px;">'+
							            '<div class="w2ui-field">'+
					        				'<label class="estimatePopupText">업체명</label>'+
					        				'<div>'+
												'<input name="estimateCompanyPopup" type="text" size="40" style="width:194px;" />'+
					    					'</div>'+
					        			'</div>'+
					        			/*'<div class="w2ui-field">'+
					        				'<label class="estimatePopupText">고객 이름</label>'+
					        				'<div>'+
												'<input name="estimateCompanyManagerPopup" type="text" size="40" style="width:194px;" />'+
					    					'</div>'+
					        			'</div>'+*/
					        		'</div>'+
					    		'</div>'+//popup-options
					    		
					    		'<div class="popup-options">'+
						            '<div class="" style="height: 62px;">'+
							            '<div class="w2ui-field">'+
					        				'<label class="estimatePopupText">고객 이름</label>'+
					        				'<div>'+
												'<input name="estimateCompanyManagerPopup" type="text" size="40" style="width:194px;" />'+
					    					'</div>'+
					        			'</div>'+
					        		'</div>'+
					    		'</div>'+//popup-options
					    		'<div style="margin-left:0px;">'+
						            '<div class="" style="height: 62px; text-align: center;">'+
						            	'<div><button id="estimateSearchBtnPopup" class="darkButton" type="button" >' + BundleResource.getString('button.order.search') + '</button></div>'+
					        		'</div>'+
					    		'</div>'+
							'</div>'+//w2ui-page page-0
						'</div>'+//searchBottom
						
						
						/*'<div id="searchEstimatePopupGridContents" style="width:100%; height:83%"></div>'+*/
						'<div class="dashboard-panel" style="width:100%;height:82%">'+
							'<div class="dashboard-title">'+
								'<div class="estimateListTitle" style="float:left; padding:0px;">'+
									'<span>Estimate List</span>'+
								'</div>'+
							'</div>'+
							'<div class="dashboard-contents">'+
								'<div id="searchEstimatePopupGridContents" style="width:100%; height:92%;"></div>'+
							'</div>'+
						'</div>'+//dashboard-panel

						
						'<div id="searchEstimatePopupConfirmContents" style="width:100%; height:30px; text-align:center; margin-top: 8px;">'+
							'<button id="searchEstimateConfirmBtn" class="darkButton" type="button">'+ BundleResource.getString('button.order.confirm') +'</button>'+
						'</div>';
			w2popup.open({
				title : "발주 Process",
				body: body,
    	        width : 1000,
    	        height : 720,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		/*w2ui["order_estimate_popup_options"].render();
    	        		w2ui["order_estimate_grid_popup_options"].render();*/
    	        		$("#searchEstimatePopupConfirmContents").html();
    	        		ordMgr.getEstimateList();
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	event.onComplete = function(){
    	        		w2ui['order_estimate_popup_options'].destroy();
    	        		w2ui["order_estimate_grid_popup_options"].destroy();
    	        	}
    	        }
			});
			
			$("#searchEstimatePopupContents").w2form({
				name : 'order_estimate_popup_options',
				focus : -1,
				fields : [
					{name : 'estimateSearchTypePopup', type : 'list', options : {items : that.getPeriodTypeList}},
					{name : 'estimateSearchDayMonthPopup', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'estimateSearchFromPeriodPopup', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'estimateSearchToPeriodPopup', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'estimateCompanyPopup', type : 'text'},
					{name : 'estimateCompanyManagerPopup', type : 'text'}
					//{name : 'estimateStatusPopup', type : 'list', options : {items : that.getOrderStatusList}}
					
				],
				record : {
					estimateSearchTypePopup : that.getPeriodTypeList[2],
					estimateSearchDayMonthPopup : '',
					estimateSearchFromPeriodPopup : that.daysAgo,
					estimateSearchToPeriodPopup : that.cnvtDay,
					estimateCompanyPopup : '',
					estimateCompanyManagerPopup : ''
					//estimateStatusPopup : that.getOrderStatusList[0]
				},
				onChange : function(event){
					var eventTarget = event.target;
					if("estimateSearchTypePopup" == eventTarget){
						console.log("Change Search Type");
						if(3 == event.value_new.id){ // 기간
							$(".estimatePeriodicPopup").show();
							$("#estimateDailyMonthlyPopup").hide();
							
							$("#estimateSearchDayMonthPopup").val('');
							$("#estimateSearchFromPeriodPopup").val('');
							$("#estimateSearchToPeriodPopup").val('');
							
							$("#estimateSearchFromPeriodPopup").attr("placeholder", "yyyy-mm-dd");
							$("#estimateSearchToPeriodPopup").attr("placeholder", "yyyy-mm-dd");
							
							$("#estimateSearchFromPeriodPopup").val(that.daysAgo);
							$("#estimateSearchToPeriodPopup").val(that.cnvtDay);
							
						}else if(2 == event.value_new.id){ // 월간
							
							$(".estimatePeriodicPopup").hide();
							$("#estimateDailyMonthlyPopup").show();
							
							$("#estimateSearchDayMonthPopup").val('');
							$("#estimateSearchFromPeriodPopup").val('');
							$("#estimateSearchToPeriodPopup").val('');
							$("#estimateSearchDayMonthPopup").attr("placeholder", "yyyy-mm");
							$("#estimateSearchDayMonthPopup").val(that.cnvtMonth);
							//$("#searchDayMonth").attr("readonly", true);
							
						}else{ // Default = 일간
							$(".estimatePeriodicPopup").hide();
							$("#estimateDailyMonthlyPopup").show();
							
							$("#estimateSearchDayMonthPopup").val('');
							$("#estimateSearchFromPeriodPopup").val('');
							$("#estimateSearchToPeriodPopup").val('');
							$("#estimateSearchDayMonthPopup").attr("placeholder", "yyyy-mm-dd");
							$("#estimateSearchDayMonthPopup").val(that.cnvtDay);
							//$("#searchDayMonth").attr("readonly", true);
						}
					}
				},
				onRender : function(event){
					event.onComplete = function(){
						$(".estimatePeriodicPopup").show();
						$("#estimateDailyMonthlyPopup").hide();
					}
				}
			});

			$('input[type=estimateSearchFromPeriodPopup').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=estimateSearchToPeriodPopup]')});
			$('input[type=estimateSearchToPeriodPopup').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=estimateSearchFromPeriodPopup]')});
			
			$("#searchEstimatePopupGridContents").w2grid({
				name : 'order_estimate_grid_popup_options',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '100px', sortable: true, attr: 'align=center'},
         			{ field: 'project_name', caption: 'PROJECT', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'site_name', caption: '업체명', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'registration_date', caption: 'REGISTRATION DATE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //요청일자
         			{ field: 'comfirmed_date', caption: 'COMFIRMED DATE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //견적일자
         			{ field: 'customer_name', caption: 'MANAGER', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'edition', caption: 'EDITION', size : '60px', sortable: true, attr: 'align=center'}, //담당자
         			{ field: 'reserve_str', caption: 'PREVIEW', size : '100%', sortable: true, attr: 'align=center',
         				render : function(record){
         					var html;
                		    if(record.reserve_str == 0){//pdf
                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon link fab fa-preview fa-2x preview-btn report-history-preview-btn" historyid='+record.estimate_id+'></i></div>';	   			   	
                		    }else{
                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon fab fa-preview fa-2x  preview-btn  disabled" style="cursor: default;" historyid='+record.estimate_id+' ></i></div>';
                		    }
                		    return html;
         				}
         			}, //프리뷰
         			{ field: 'project_id', hidden: true},
         			{ field: 'estimate_title', hidden: true},
         			{ field: 'site_id', hidden: true},
         			{ field: 'edition', hidden: true},
         			{ field: 'estimate_id', hidden: true},
         			{ field: 'mail_id', hidden: true},
         			{ field: 'note', hidden: true},
         			{ field: 'payment', hidden: true},
         			{ field: 'user_id', hidden: true},
         			
				],
				onSelect : function(){
					$("#searchEstimateConfirmBtn").attr("disabled",false);
		    		$("#searchEstimateConfirmBtn").removeClass('hoverDisable');
				},
				
				onUnselect : function(){
					$("#searchEstimateConfirmBtn").attr("disabled",true);
		    		$("#searchEstimateConfirmBtn").addClass('hoverDisable');
				}
			});
		},
		
		getEstimateList : function(){ //gihwansearchestimate
			var params = w2ui['order_estimate_popup_options'].record;
        	
        	if(params.estimateSearchTypePopup.id != undefined){
        		params.estimateSearchTypePopup = params.estimateSearchTypePopup.id;
        	}
        	/*if(params.estimateStatusPopup.value != undefined){
        		params.estimateStatusPopup = params.estimateStatusPopup.value;
        	}*/
        	if(params.estimateCompanyPopup == null){
        		params.estimateCompanyPopup = "";
        	}
        	if(params.estimateCompanyManagerPopup == null){
        		params.estimateCompanyManagerPopup = "";
        	}
        	params.estimateSearchDayMonthPopup = $("#estimateSearchDayMonthPopup").val();
			
			var getEstimate = new Model(params);
			getEstimate.url = 'order/getEstimateList';
			getEstimate.save(null, {
				success : function(model, response){
					that.setEstimateList(response);
				}
			});
		},
		
		setEstimateList : function(response){
			w2ui['order_estimate_grid_popup_options'].records = response;
			w2ui['order_estimate_grid_popup_options'].refresh();
			
			$("#searchEstimateConfirmBtn").attr("disabled",true);
    		$("#searchEstimateConfirmBtn").addClass('hoverDisable');
		},
		
		orderPreviewPopup : function(){
			var arr = w2ui['order_tabs_options'].validate();
			if(arr.length > 0){
				return;
			}else{
				var btnType = null;
				var orderStatus = w2ui['order_popup_options'].record.orderStatus;
				if(orderStatus == 2){
					btnType = "savePreview";
					ordMgr.dialogAlertPopup(btnType);
				}else{
					ordMgr.orderPreviewAction();
				}
			}
		},
		
		orderPreviewAction : function(){
			var orderStatus = w2ui['order_popup_options'].record.orderStatus;
			var orderId = w2ui['order_popup_options'].record.orderId;
			var downloadAction = null;
			if(orderStatus == 2){
				ordMgr.orderSaveAction();
				downloadAction = "edit";
			}else{
				downloadAction = "skip";
			}
			
			// Preview Action Start;
			
			var download = new Model();
       		
			download.url = "itsmUtil/download";
			console.log("Preview Action Here");
       		download.fetch({
    			data : {
    				title: w2ui['order_popup_options'].record.orderTitle,
            		parent_id: 0, 						// ???
            		report_type : 5, 					// report.xml의 order report 순서????
            		report_sub_type: "Order.jrxml",		// OK
            		query: "selectOrder", 				// OK
            		condition : orderId, 				// OK
            		destination_name : "none", 			// ?????
            		export_type: "0", 					// ?????
            		select_menu: "order", 				// OK
            		downloadAction : downloadAction,	// Skip, Edit, "" ?????
            		actionType : "order", 				// ????
            		fileName : "" 						// ?????
    			},
        		success: function (response) {
        			if(response.toJSON() != null ){
        				if(response.toJSON().message == null){
	        				w2popup.message({ 
	        					width   : 360, 
	        					height  : 200,
	        					html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.nodata') + '</div>'+
	        					'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
	        				});
	        				return;
        				}

    					that.estimatePreview( response.toJSON() ); //pdf 파일 띄움

					}
        		}
        	});
			
		},
		
		estimatePreview : function( request ){
        	var selectedPreEstimateId = request.previewId;
			 
        	var strWinStyle   = "width=800 height=940 toolbar=no menubar=no location=no scrollbars=no resizable=no fullscreen=no ";
        	var popup = window.open("itsmUtil/preview/"+selectedPreEstimateId, 'popup', strWinStyle);        	
        },
		
		dialogAlertPopup : function(btnType){
			var bodyContents = ""; //알림 내용이 들어갈 변수
			
			if($('body').find("#orderDoublePopup").size() == 0 ){
				$('body').append("<div id='orderDoublePopup'></div>");
			}
			$("#orderDoublePopup").dialog({
				title : BundleResource.getString('title.estimate.info'),
				width : 385,
				height : 180,
				style : 'top:298px',
				modal : true,
				resizable: false,
				dialogClass : "orderCustomAlertPopup",
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
					if(btnType === "savePreview"){
						//"자동 저장 후 미리보기가 실행됩니다. 계속하시겠습니까?"
						bodyContents = BundleResource.getString('label.estimate.savePreview');
						$(".customAlertPopup .ui-dialog-buttonset").find("button:eq(0)").addClass("orderPreviewOkBtn");
					}
					
					$("#orderDoublePopup").append('<div id="dialogAlertPopupArea"></div>');
					var dialogAlertPopupArea = '<div id="dialogAlertPopupContents">'+	bodyContents +	'</div>';
					$("#dialogAlertPopupArea").html(dialogAlertPopupArea);
					
				},
				close : function(){
					$("#orderDoublePopup").remove();
					
				}
			});
		},
		
		popupCloseAction : function(){
			that.selectedEstimate = w2ui['order_estimate_grid_popup_options'].get(w2ui['order_estimate_grid_popup_options'].getSelection());
			w2popup.close();

			setTimeout(function(selectedData){
				that.popupMode = "addMode";
				that.searchEstimateConfirmAction();
			}, 300);
		},
		
		searchEstimateConfirmAction : function(){
			var selectedData = that.selectedEstimate;
			var body = 
			'<div id="orderProcessPopup"><div class="disableClass"></div>'+
				'<div id="searchOrderPopupContents" style="width:100%; height:130px;">'+
					'<div class="w2ui-page page-0">'+
					
			            '<div class="w2ui-field" style="float:left">'+
	        				'<label class="orderPopupText">제목</label>'+
	        				'<div class="inputArea">'+
								'<input name="orderTitle" type="text" size="40" readonly="readonly" style="width:832px;" />'+
	    					'</div>'+
	        			'</div>'+
			    		
	        			'<div class="w2ui-field popup-options">'+
	        				'<label class="orderPopupText">주문처</label>'+
	        				'<div class="inputArea">'+
								'<input name="orderCompany" type="text" size="40" readonly="readonly" style="width:192px;"/>'+
	    					'</div>'+
	        			'</div>'+
        			
	        			'<div class="w2ui-field popup-options">'+
	        				'<label class="orderPopupText">공급처</label>'+
	        				'<div id="getSupplyCompany" class="inputArea">'+
								'<input name="customerSupplyCompany" type="text" size="40" readonly="readonly" style="width:192px;"/>'+
								'<i id="selectSupplyCompany" class="fas fa-external-link-alt" aria-hidden="true"></i>'+
	    					'</div>'+
	        			'</div>'+
        			
	        			'<div class="w2ui-field popup-options">'+
	        				'<label class="orderPopupText">운용처</label>'+
	        				'<div id="getUsingCompany" class="inputArea">'+
								'<input name="customerOperCompany" type="text" size="40" readonly="readonly" style="width:192px;"/>'+
								'<i id="selectUsingCompany" class="fas fa-external-link-alt" aria-hidden="true"></i>'+
	    					'</div>'+
	        			'</div>'+
        			
	        			'<div class="w2ui-field popup-options">'+
	        				'<label class="orderPopupText">고객명</label>'+
	        				'<div class="inputArea">'+
								'<input name="customerName" type="text" size="40" readonly="readonly" class="noselect" style="width:192px;"/>'+
	    					'</div>'+
	        			'</div>'+
        			
	        			'<div class="w2ui-field popup-options">'+
	        				'<label class="orderPopupText">발주등록일</label>'+
	        				'<div class="inputArea">'+
								'<input name="orderRegistDate" type="text" size="40" readonly="readonly" class="noselect" style="width:192px;"/>'+
	    					'</div>'+
	        			'</div>'+
		    		
			    		'<div class="w2ui-field popup-options">'+
	        				'<label class="orderPopupText">STATUS</label>'+
	        				'<div class="inputArea">'+
								'<input name="orderStatusText" type="text" size="40" readonly="readonly" style="width:192px;"/>'+
	    					'</div>'+
	        			'</div>'+
	        			
					'</div>'+
				'</div>'+
	
				'<div id="searchOrderPopupGridContents" style="width:100%; height:33%" ></div>'+
				'<div id="searchOrderPopupTabs" style="width:100%;"></div>'+
				'<div id="searchOrderPopupTabsContents" style="width:100%; height:39%">'+
				
				/*--------------------------- Order Tab Area ------------------------------*/
					'<div id="orderTab" class="orderTabContents" style="width:100%; height:100%; display:none" ><div class="orderDisableClass"></div>'+
						'<div class="w2ui-page page-0">'+
							
				            '<div class="w2ui-field" style="float:left">'+
								'<label class="orderPopupText">발주처</label>'+
								'<div id="getOrderCompany" class="inputArea">'+
									'<input name="orderTabsCompany" type="text" size="40" readonly="readonly" style="width:834px;" />'+
									'<i id="selectOrderSite" class="fas fa-external-link-alt" aria-hidden="true"></i>'+
								'</div>'+
							'</div>'+
						
							'<div class="w2ui-field popup-options">'+
				    			'<label class="orderPopupText">직원 이름</label>'+
				    			'<div class="inputArea">'+
				    				'<input name="employeeName" type="text" readonly="readonly" size="40" />'+
				    			'</div>'+
			    			'</div>'+
		    			
				    		'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">STATUS</label>'+
			    				'<div class="inputArea">'+
									'<input name="orderTabStatusText" type="text" readonly="readonly" size="40" />'+
								'</div>'+
			    			'</div>'+
			    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">PAYMENT</label>'+
			    				'<div class="inputArea">'+
									'<input name="payment" type="text" size="40"/>'+
								'</div>'+
			    			'</div>'+
					
			    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">DELIVERY TERM</label>'+
			    				'<div class="inputArea">'+
									'<input name="deliveryTerm" type="text" size="40" />'+
								'</div>'+
			    			'</div>'+
					
				    		'<div class="w2ui-field" style="float:left">'+
								'<label class="orderPopupText">NOTE</label>'+
								'<div class="inputArea">'+
									'<input name="note" type="text" size="40" style="width:834px;" />'+
								'</div>'+
							'</div>'+
							
							'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">발주완료일</label>'+
			    				'<div class="inputArea">'+
									'<input name="orderComplete" type="text" readonly="readonly" size="40"/>'+
								'</div>'+
			    			'</div>'+
					
			    			'<div class="w2ui-field" style="float:left">'+
								'<label class="orderPopupText">파일명</label>'+
								'<div class="inputArea">'+
									'<input name="orderFileName" type="text" size="40" style="width:834px;" />'+
								'</div>'+
							'</div>'+
						
						'</div>'+
					'</div>'+
					/*---------------------------------------------------------------------------------*/
					
					/*--------------------------- Ship Tab Area ------------------------------*/
					'<div class="shipTabContents" style="display:none">'+
						
						'<div class="dashboard-panel" style="width:100%;">'+
							'<div class="dashboard-title">'+
								'<div style="float:left; padding:0px;">'+
									'<span>Shipping</span>'+
								'</div>'+
								'<div class="popupBtnGroup">'+
									'<i id="shipAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
									'<i id="shipModifyBtn" class="icon fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
									'<i id="shipDelBtn" class="icon fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
								'</div>'+
							'</div>'+
							'<div class="dashboard-contents">'+
								'<div id="shipTab" style="width:100%; height:68%;"></div>'+
							'</div>'+
						'</div>'+
						'<div class="w2ui-field shipCheckBoxArea">'+
							'<input type="checkbox" name="shipCheckComp" id="shipCheckComp"/>'+
							'<label>선적완료</label>'+
						'</div>'+
						'<div class="attamentArea" style="width: 180px;">'+
							'<div class="w2ui-field">'+
								'<label style="width:70px;">첨부파일</label>'+
							'</div>'+
							'<div>'+
								'<input id="shippingAttachCnt" name="shippingAttachCnt" type="text" readonly="readonly"/>'+
							'</div>'+
							'<i id="shipAttachBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" title="Attach"></i>'+
							//'<i id="shipDownloadBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Download"></i>'+
						'</div>'+
					'</div>'+
					/*---------------------------------------------------------------------------------*/
					
					/*--------------------------- Income Tab Area ------------------------------*/
					/*'<div class="incomeTabContents" style="display:none">'+
						'<div class="w2ui-field incomeCheckBoxArea">'+
							'<input type="checkbox" name="incomeCheckComp"/>'+
							'<label>입항완료</label>'+
						'</div>'+
						'<div class="popupBtnGroup">'+
							'<i id="incomeAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
							'<i id="incomeModifyBtn" class="icon fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
							'<i id="incomeDelBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
						'</div>'+
						'<div id="incomeTab" style="width:100%; height:79%;"></div>'+
						'<div class="attamentArea" style="width: 120px;">'+
							'<div class="w2ui-field">'+
								'<label style="width:70px;">첨부파일</label>'+
							'</div>'+
							'<i id="shipModifyBtn" class="icon fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
							'<i id="shipDelBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
						'</div>'+
					'</div>'+*/
					
					'<div class="incomeTabContents" style="display:none">'+
					
						'<div class="dashboard-panel" style="width:100%;">'+
							'<div class="dashboard-title">'+
								'<div style="float:left; padding:0px;">'+
									'<span>Port</span>'+
								'</div>'+
								'<div class="popupBtnGroup">'+
									'<i id="incomeAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
									'<i id="incomeModifyBtn" class="icon fas fa-edit fa-2x" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
									'<i id="incomeDelBtn" class="icon fas fa-trash-alt fa-2x" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
								'</div>'+
							'</div>'+
							'<div class="dashboard-contents">'+
								'<div id="incomeTab" style="width:100%; height:68%;"></div>'+
							'</div>'+
						'</div>'+
						'<div class="w2ui-field shipCheckBoxArea">'+
							'<input type="checkbox" name="incomeCheckComp" id="incomeCheckComp"/>'+
							'<label>입항완료</label>'+
						'</div>'+
						'<div class="attamentArea" style="width: 180px;">'+
							'<div class="w2ui-field">'+
								'<label style="width:70px;">첨부파일</label>'+
							'</div>'+
							'<div>'+
								'<input id="portAttachCnt" name="portAttachCnt" type="text" readonly="readonly"/>'+
							'</div>'+
							'<i id="portAttachBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" title="Attach"></i>'+
							//'<i id="portDownloadBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Download"></i>'+
						'</div>'+
					'</div>'+
					/*---------------------------------------------------------------------------------*/
					
					/*--------------------------- Pass Tab Area Ver.1 ------------------------------*/
					/*'<div id="customsTab" class="customsTabContents" style="width:100%; height:100%; display:none" >'+
						'<div class="w2ui-page page-0">'+
							
				    		'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">승인</label>'+
			    				'<div class="inputArea">'+
									'<input name="passConfirm" type="list" size="40"/>'+
								'</div>'+
			    			'</div>'+
			    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">관세</label>'+
			    				'<div class="inputArea">'+
									'<input name="passTax" type="text" size="40" />'+
								'</div>'+
			    			'</div>'+
						
					
				    		'<div class="w2ui-field" style="float:left">'+
								'<label class="orderPopupText">File</label>'+
								'<div class="inputArea">'+
									'<input name="passFile" type="text" size="40" style="width:834px;" />'+
								'</div>'+
							'</div>'+
							
							'<div class="w2ui-field" style="float:left">'+
								'<label class="orderPopupText">첨부</label>'+
								'<div class="inputArea">'+
									'<input name="passAttachFile" type="text" size="40" style="width:834px;" />'+
								'</div>'+
							'</div>'+
					
						'</div>'+ //w2ui-page page-0 passAttachFile 첨부
					'</div>'+*/
					/*---------------------------------------------------------------------------------*/
					
					/*--------------------------- Pass Tab Area Ver.2 ------------------------------*/
					/*'<div class="customsTabContents" style="display:none">'+
						'<div class="w2ui-field passCheckBoxArea">'+
							'<input type="checkbox" name="customsCheckComp"/>'+
							'<label>통관완료</label>'+
						'</div>'+
						'<div class="popupBtnGroup">'+
							'<i id="customsAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
							'<i id="customsModifyBtn" class="icon fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
							'<i id="customsDelBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
						'</div>'+
						'<div id="customsTab" style="width:100%; height:79%;"></div>'+
						'<div id="dutyArea" class="w2ui-field" style="float:left;margin-left: 20px;">'+
							'<label style="width:40px;border-top-width: 0px;">관세</label>'+
							'<div style="margin-left: 52px;">'+
								'<input id="dutyPrice" name="dutyPrice" type="text"/>'+
							'</div>'+
						'</div>'+
						'<div class="attamentArea" style="width: 120px;">'+
							'<div class="w2ui-field">'+
								'<label style="width:70px;">첨부파일</label>'+
							'</div>'+
							'<i id="shipModifyBtn" class="icon fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
							'<i id="shipDelBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
						'</div>'+
					'</div>'+*/
					
					'<div class="customsTabContents" style="display:none">'+
					
						'<div class="dashboard-panel" style="width:100%;">'+
							'<div class="dashboard-title">'+
								'<div style="float:left; padding:0px;">'+
									'<span>Customs</span>'+
								'</div>'+
								'<div id ="productDownloadBtn" class="popupBtnGroup">'+
									'<i id="customsDownloadBtn" name="file_name" class="icon link fas fa-download fa-2x align-right" style="float: left; margin-left: 4px;" aria-hidden="true" title="download"></i>'+
//									'<div id ="productUploadBtn"><i name="file_name" class="icon link fas fa-upload fa-2x align-right" style="float: left; margin-left: 4px;" aria-hidden="true" title="upload"></i></div>'+
//			                        '<div id ="productDownloadBtn"><i name="file_name" class="icon link fas fa-download fa-2x align-right" style="float: left; margin-left: 4px;" aria-hidden="true" title="download"></i></div>'+
									
								'</div>'+
							'</div>'+
							'<div class="dashboard-contents">'+
								'<div id="customsTab" style="width:100%; height:68%;"></div>'+
							'</div>'+
						'</div>'+
						'<div class="w2ui-field customsCheckBoxArea">'+
							'<input type="checkbox" name="customsCheckComp" id="customsCheckComp"/>'+
							'<label>통관완료</label>'+
						'</div>'+
						'<div id="dutyArea" class="w2ui-field" style="float:left;margin-top: 2px;">'+
							'<label style="width:64px;border-top-width: 0px;">관세비용</label>'+
							'<div style="margin-left: 61px;">'+
								'<input id="dutyPrice" name="dutyPrice" type="text"/>'+
							'</div>'+
						'</div>'+
						'<div class="attamentArea" style="width:207px;;">'+
							'<div class="w2ui-field">'+
								'<label style="width:97px;">관부세 영수증</label>'+
							'</div>'+
							'<div>'+
								'<input id="customsAttachCnt" name="customsAttachCnt" type="text" readonly="readonly"/>'+
							'</div>'+
							'<i id="customsAttachBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" title="Attach"></i>'+
							//'<i id="customsDetatchDownloadBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Download"></i>'+
						'</div>'+
					'</div>'+
					
					
					
					/*---------------------------------------------------------------------------------*/
					
					/*--------------------------- Delivery Tab Area ------------------------------*/
					'<div id="deliveryTab" class="deliveryTabContents" style="width:100%; height:100%; display:none" >'+
						'<div class="w2ui-page page-0">'+
							
							'<div class="w2ui-field popup-options">'+
								'<label class="orderPopupText">송장번호</label>'+
								'<div class="inputArea">'+
									'<input name="d_id" type="text" size="40"/>'+
								'</div>'+
							'</div>'+
		    			
							'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">담당자</label>'+
			    				'<div class="inputArea">'+
									'<input name="d_user" type="text" size="40" />'+
								'</div>'+
			    			'</div>'+
		    			
			    			'<div class="w2ui-field" style="float:left">'+
			    				'<label class="orderPopupText">주소</label>'+
			    				'<div class="inputArea">'+
									'<input name="d_destination" type="text" size="40" style="width:834px;"/>'+
								'</div>'+
			    			'</div>'+
			    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">연락처</label>'+
			    				'<div class="inputArea">'+
									'<input name="d_phone" type="text" size="40"/>'+
								'</div>'+
			    			'</div>'+
		    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">배송비용</label>'+
			    				'<div class="inputArea">'+
									'<input name="d_cost" type="text" size="40"/>'+
								'</div>'+
			    			'</div>'+
		    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">요청 일자</label>'+
			    				'<div class="inputArea">'+
									'<input name="delivery_request_date" type="text" size="40" />'+
								'</div>'+
			    			'</div>'+
		    			
			    			'<div class="w2ui-field popup-options">'+
			    				'<label class="orderPopupText">완료 일자</label>'+
			    				'<div class="inputArea">'+
									'<input name="delivery_end_date" type="text" size="40" />'+
								'</div>'+
			    			'</div>'+
			    		
						'</div>'+ //w2ui-page page-0
						'<div style="width:980px; height:10%; position:absolute; top:230px; border-top: 1px solid silver;">'+
							'<div class="w2ui-field deliveryCheckBoxArea" style="margin-left:14px;">'+
								'<input type="checkbox" name="deliveryCheckComp" id="deliveryCheckComp" style="margin-top:6px;"/>'+
								'<label style="margin-top: 1px;">배송완료</label>'+
							'</div>'+
							'<div class="attamentArea" style="width: 179px; margin-top: 1px;">'+
								'<div class="w2ui-field">'+
									'<label style="width:70px;">첨부파일</label>'+
								'</div>'+
								'<div>'+
									'<input id="deliveryAttachCnt" name="deliveryAttachCnt" type="text" readonly="readonly" style="margin-top: 3px; font-size: 12px !important;"/>'+
								'</div>'+
								'<i id="deliveryAttachBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" title="Attach"></i>'+
								//'<i id="deliveryDownloadBtn" class="icon fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Download"></i>'+
							'</div>'+
						'</div>'+
					'</div>'+
					/*---------------------------------------------------------------------------------*/
					
				'</div>'+
				'<div id="searchOrderPopupConfirmContents" style="width:100%; height:30px; text-align:right; margin-top: 7px;">'+
					'<button id="searchOrderPrevBtn" class="darkButton" type="button">'+ BundleResource.getString('button.order.prev') +'</button>'+
					'<button id="searchOrderPreviewBtn" class="darkButton" type="button">'+ BundleResource.getString('button.order.preview') +'</button>'+
					'<button id="searchOrderSaveBtn" class="darkButton" type="button">'+ BundleResource.getString('button.order.save') +'</button>'+
					//'<button onclick="w2popup.close();" class="darkButton">'+ BundleResource.getString('button.order.cancel') +'</button>'+
					'<button id="searchOrderNextBtn" class="darkButton" type="button">'+ BundleResource.getString('button.order.next') +'</button>'+
					'<button id="orderEmailBtn" class="darkButton" type="button">'+ BundleResource.getString('button.order.email') +'</button>'+
				'</div>'+
			'</div>';
			
			w2popup.open({
				title : "발주 Process",
				body: body,
    	        width : 1000,
    	        height : 730,
    	        opacity   : '0.5',
        		modal     : true,
   		     	showClose : true,
   		     	style	  : "overflow:hidden;",
    	        onOpen    : function(event){
    	        	event.onComplete = function () {
    	        		$("#searchOrderPopupConfirmContents").html();
    	        		if(that.popupMode == "addMode"){
    	        			w2ui['order_model_tabs_popup_options'].click('orderTab');
    	        			
    	        			$(".disableClass").css("display","none");
    	        			$(".orderDisableClass").css("display","none");
    	        			w2ui['order_model_tabs_popup_options'].hide('shipTab');
    	        			w2ui['order_model_tabs_popup_options'].hide('incomeTab');
    	        			w2ui['order_model_tabs_popup_options'].hide('customsTab');
    	        			w2ui['order_model_tabs_popup_options'].hide('deliveryTab');
    	        			ordMgr.setEstimateToOrder();
    	        		}else{ // "modifyMode"
    	        			var status = w2ui['order_list'].get(w2ui['order_list'].getSelection())[0].status;
    	        			//var openTabId = w2ui['order_model_tabs_popup_options'].tabs[status - 2].id;
    	        			//w2ui['order_model_tabs_popup_options'].click(openTabId);
    	        			
    	        			for(var i = status-1; i < 5; i++){
    	        				var id = w2ui['order_model_tabs_popup_options'].tabs[i].id;
    	        				w2ui['order_model_tabs_popup_options'].hide(id);
    	        			}
    	        			ordMgr.setOrderDataPopup();
    	        		}
    	        	}
    	        },
    	        
    	        onClose   : function(event){
    	        	event.onComplete = function(){
    	        		w2ui['order_popup_options'].destroy();
    	        		w2ui["order_model_grid_popup_options"].destroy();
    	        		w2ui["order_model_tabs_popup_options"].destroy();
    	        		w2ui['order_tabs_options'].destroy();
    	        		w2ui['ship_tab_options'].destroy();
    	        		w2ui['income_tab_options'].destroy();
    	        		w2ui['customs_tabs_options'].destroy();
    	        		w2ui['delivery_tabs_options'].destroy();
    	        		ordMgr.getModifyOrderData = {};
    	    			ordMgr.getModifyProductData = [];
    	    			ordMgr.getModifyShippingData = [];
    	        	}
    	        }
			});
			
			$("#searchOrderPopupContents").w2form({
				name : 'order_popup_options',
				focus : -1,
				fields : [
					{name : 'orderTitle', type : 'text'},
					{name : 'orderCompany', type : 'text'},
					{name : 'orderRegistDate', type : 'text'},
					{name : 'orderStatusText', type : 'text'},
					{name : 'customerSupplyCompany', type : 'text'},
					{name : 'customerOperCompany', type : 'text'},
					{name : 'customerName', type : 'text'},
				],
				record : {
					orderTitle : '',
					orderCompany : '',
					orderRegistDate : '',
					orderStatus : '',
					orderStatusText : '',
					customerSupplyCompany : '',
					customerSupplyCompanyId : '',
					customerOperCompany : '',
					customerOperCompanyId : '',
					customerName : '',
					customerNameId : '',
					orderId : ''
				}
			});
			
			$("#searchOrderPopupGridContents").w2grid({
				name : 'order_model_grid_popup_options',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false
				},
				recordHeight : 30,
				columnGroups : [
					{ caption : 'NO', master:true},
					{ caption : 'MODEL NAME', master:true},
					{ caption : 'SPECIFICATIONS', master:true},
					{ caption : '견적', span : 3},
					{ caption : '발주', span : 3}
				],
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'product_name', caption: 'MODEL NAME', size : '100px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'spec', caption: 'SPECIFICATIONS', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'quantity', caption: 'QUANTITY', size : '100px', sortable: true, render: 'int', attr: 'align=right', style: 'padding-right:5px;'}, //요청일자
         			{ field: 'u_price', caption: 'U/PRICE', size : '100px', sortable: true, render: 'int', attr: 'align=right', style: 'padding-right:5px;'}, //견적일자
         			{ field: 'amount', caption: 'AMOUNT', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;'}, //담당자
         			{ field: 'orderQuantity', caption: 'QUANTITY', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;border-left: 1px solid #ffff !important;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }}, //요청일자
         			{ field: 'orderUprice', caption: 'U/PRICE', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;', render: 'int', editable: { type: 'int', min: 0, max: 100000000 }}, //견적일자
         			{ field: 'orderAmount', caption: 'AMOUNT', size : '100px', sortable: true, attr: 'align=right', style: 'padding-right:5px;'} //담당자
				],
				record : {
					recid : '',
					product_name : '',
					spec : '',
					quantity : '',
					u_price : '',
					amount : '',
					orderQuantity : '',
					orderUprice : '',
					orderAmount : ''
				},
				records : [
					{ w2ui: { summary: true },
						recid: '', product_name: '<span style="float: right;">Total</span>', amount : 0, orderAmount : 0
					}
				],
				onChange : function(event){
					event.onComplete = function(event){
						var amoTotal = 0.0;
						var amount = 0.0;
						var proGridRecord = w2ui['order_model_grid_popup_options'].records;
						
						for(var m=0; m<proGridRecord.length; m++){ //amount
							if(proGridRecord[m].w2ui != undefined){
								if(proGridRecord[m].w2ui.changes.orderQuantity == undefined){
									amount = proGridRecord[m].orderQuantity * proGridRecord[m].w2ui.changes.orderUprice;
								}else if(proGridRecord[m].w2ui.changes.orderUprice == undefined){
									amount = proGridRecord[m].w2ui.changes.orderQuantity * proGridRecord[m].orderUprice;
								}else{
									amount = proGridRecord[m].w2ui.changes.orderQuantity * proGridRecord[m].w2ui.changes.orderUprice;
								}
								w2ui['order_model_grid_popup_options'].records[m].orderAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //attach ','
							}
						}
						
						for(var k=0; k<proGridRecord.length; k++){ //amount sum
							var cnvtTotal = proGridRecord[k].orderAmount;
							amoTotal += Number(cnvtTotal.replace(/[^\d]+/g, '')); //detach ','
						}
						
						w2ui['order_model_grid_popup_options'].summary[0].orderAmount = amoTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						w2ui['order_model_grid_popup_options'].refresh(); //gihwansave
					}
				}
			});
			
			//--------------------TAB AREA--------------------------
			$("#searchOrderPopupTabs").w2tabs({
				name : 'order_model_tabs_popup_options',
				active : 'order',
				tabs : [
					{id : 'orderTab', caption : '발주'},
					{id : 'shipTab', caption : '선적'},
					{id : 'incomeTab', caption : '입항'},
					{id : 'customsTab', caption : '통관'},
					{id : 'deliveryTab', caption : '배송'}
				],
				onClick : function(event){ //gihwantabclick
					var orderStatus = w2ui['order_popup_options'].record.orderStatus; // 2=order, 3=ship, 4=income, 5=pass, 6=delivery
					var tabs = w2ui['order_model_tabs_popup_options'].get(); //['orderTab', 'shipTab', 'incomeTab', 'customsTab', 'deliveryTab']
					var fileCount = 0;
					var getOrderData = ordMgr.getModifyOrderData;
					var getProductData = ordMgr.getModifyProductData;
					var getShippingData = ordMgr.getModifyShippingData;
					var getPortData = ordMgr.getModifyPortData;
					var getCustomsData = ordMgr.getModifyCustomsData;
					var getDeliveryData = ordMgr.getModifyDeliveryData;
					var orderId = w2ui['order_popup_options'].record.orderId;
					
					if(getOrderData != undefined && Object.keys(getOrderData).length != 0){
						w2ui['order_popup_options'].record.orderStatusText = ordMgr.getOrderStatusList[getOrderData.status - 1].text;
						w2ui['order_popup_options'].record.orderStatus = getOrderData.status;
					}
						
						
					var selectedTab = event.target;
					$("."+that.selectedTab+"Contents").css("display","none");
					$("."+selectedTab+"Contents").css("display","block");
					that.selectedTab = event.target;
					w2ui['order_popup_options'].refresh();
					w2ui['ship_tab_options'].refresh();
					w2ui['income_tab_options'].refresh();
					w2ui['customs_tabs_options'].refresh();
					
					var checkNextBtn = that.checkTabAndStatus();
					if(checkNextBtn){
						$("#searchOrderNextBtn").hide();
						$("#searchOrderSaveBtn").attr("disabled",false);
			    		$("#searchOrderSaveBtn").removeClass('hoverDisable');
					}else{
						$("#searchOrderNextBtn").show();
						$("#searchOrderSaveBtn").attr("disabled",true);
			    		$("#searchOrderSaveBtn").addClass('hoverDisable');
					}
					
					if(selectedTab == "orderTab"){
						if(getOrderData != undefined &&  Object.keys(getOrderData).length != 0  && getOrderData.o_status == 2){
							$("#searchOrderPrevBtn").hide();
							$("#searchOrderPreviewBtn").show();
							$("#searchOrderNextBtn").show();
							$("#orderEmailBtn").hide();
							w2ui['order_tabs_options'].record.orderTabStatus = getOrderData.o_status; // 1 - send
							w2ui['order_tabs_options'].record.orderTabStatusText = ordMgr.getMailStatusList[getOrderData.o_status - 1].text;
							w2ui['order_tabs_options'].record.orderComplete = getOrderData.order_end_date;
							w2ui['order_tabs_options'].refresh();
						}else{
							$("#searchOrderPrevBtn").hide();
							$("#searchOrderPreviewBtn").show();
							$("#searchOrderNextBtn").show();
							$("#orderEmailBtn").show();
						}
					}else if(selectedTab == "shipTab"){ //gihwanshiptabop
						fileCount = ordMgr.checkAttachedFiles(orderId+"_3");
						$("#shippingAttachCnt").val(fileCount+"건");
						//ordMgr.validateDownloadBtn(fileCount, "shipDownloadBtn");
						//if(getShippingData != undefined && getShippingData.length != 0 && that.popupMode == "modifyMode" && getShippingData[0].s_complete == 1){
						if(getShippingData.length != 0 && that.popupMode == "modifyMode" && getShippingData[0].s_complete == 1){
							$("#shipAddBtn").prop("disable", true);
							$("#shipAddBtn").removeClass('link');
							$("#shipModifyBtn").prop("disable", true);
							$("#shipModifyBtn").removeClass('link');
							$("#shipDelBtn").prop("disable", true);
							$("#shipDelBtn").removeClass('link');
							$("#shipCheckComp").prop("checked", true);
							$("#shipCheckComp").prop("disabled", "disabled");
						//}else if(getShippingData == undefined && w2ui['ship_tab_options'] != undefined && w2ui['ship_tab_options'].records.length !=0){
						}else if(w2ui['ship_tab_options'] != undefined && w2ui['ship_tab_options'].records.length !=0){
							var shippingComplete = w2ui['ship_tab_options'].records[0].s_complete;
							if(shippingComplete == 1){
								$("#shipAddBtn").prop("disable", true);
								$("#shipAddBtn").removeClass('link');
								$("#shipModifyBtn").prop("disable", true);
								$("#shipModifyBtn").removeClass('link');
								$("#shipDelBtn").prop("disable", true);
								$("#shipDelBtn").removeClass('link');
								$("#shipCheckComp").prop("checked", true);
								$("#shipCheckComp").prop("disabled", "disabled");
							}
						}else{
							$("#shipAddBtn").prop("disable", false);
							$("#shipAddBtn").addClass('link');
							$("#shipCheckComp").prop("checked", false);
							$("#shipCheckComp").prop("disabled", "");
						}
						$("#searchOrderPreviewBtn").hide();
						$("#searchOrderPrevBtn").show();
						$("#orderEmailBtn").hide();
						$("#searchOrderNextBtn").show();
						
						w2ui['ship_tab_options'].records = ordMgr.getModifyShippingData;
						w2ui['ship_tab_options'].refresh();
					}else if(selectedTab == "incomeTab"){
						fileCount = ordMgr.checkAttachedFiles(orderId+"_4");
						$("#portAttachCnt").val(fileCount+"건");
						//ordMgr.validateDownloadBtn(fileCount, "portDownloadBtn");
						if(getPortData.length != 0 && that.popupMode == "modifyMode" && getPortData[0].p_complete == 1){
							$("#incomeAddBtn").prop("disable", true);
							$("#incomeAddBtn").removeClass('link');
							$("#incomeModifyBtn").prop("disable", true);
							$("#incomeModifyBtn").removeClass('link');
							$("#incomeDelBtn").prop("disable", true);
							$("#incomeDelBtn").removeClass('link');
							$("#incomeCheckComp").prop("checked", true);
							$("#incomeCheckComp").prop("disabled", "disabled");
						}else if(w2ui['income_tab_options'] != undefined && w2ui['income_tab_options'].records.length !=0){
							var portComplete = w2ui['income_tab_options'].records[0].p_complete;
							if(portComplete == 1){
								$("#incomeAddBtn").prop("disable", true);
								$("#incomeAddBtn").removeClass('link');
								$("#incomeModifyBtn").prop("disable", true);
								$("#incomeModifyBtn").removeClass('link');
								$("#incomeDelBtn").prop("disable", true);
								$("#incomeDelBtn").removeClass('link');
								$("#incomeCheckComp").prop("checked", true);
								$("#incomeCheckComp").prop("disabled", "disabled");
							}
						}else{
							$("#incomeAddBtn").prop("disable", false);
							$("#incomeAddBtn").addClass('link');
							$("#incomeCheckComp").prop("checked", false);
							$("#incomeCheckComp").prop("disabled", "");
						}
						
						$("#searchOrderPrevBtn").show();
						$("#orderEmailBtn").hide();
						$("#searchOrderNextBtn").show();
						$("#searchOrderPreviewBtn").hide();
						
						w2ui['income_tab_options'].records = ordMgr.getModifyPortData;
						w2ui['income_tab_options'].refresh();
					}else if(selectedTab == "customsTab"){
						fileCount = ordMgr.checkAttachedFiles(orderId+"_5");
						$("#customsAttachCnt").val(fileCount+"건");
						//ordMgr.validateDownloadBtn(fileCount, "customsDetatchDownloadBtn");
						if(getCustomsData.length != 0 && that.popupMode == "modifyMode" && getCustomsData[0].c_complete == 1){
							/*$("#customsAddBtn").prop("disable", true);
							$("#customsAddBtn").removeClass('link');
							$("#customsModifyBtn").prop("disable", true);
							$("#customsModifyBtn").removeClass('link');
							$("#customsDelBtn").prop("disable", true);
							$("#customsDelBtn").removeClass('link');*/
							w2ui['customs_tabs_options'].columns[4].editable = false;
							$("#customsCheckComp").prop("checked", true);
							$("#customsCheckComp").prop("disabled", "disabled");
							$("#dutyPrice").prop("readonly","readonly");
						}else if(w2ui['customs_tabs_options'] != undefined && w2ui['customs_tabs_options'].records.length !=0){
							var customsComplete = w2ui['customs_tabs_options'].records[0].c_complete;
							if(customsComplete == 1){
								/*$("#customsAddBtn").prop("disable", true);
								$("#customsAddBtn").removeClass('link');
								$("#customsModifyBtn").prop("disable", true);
								$("#customsModifyBtn").removeClass('link');
								$("#customsDelBtn").prop("disable", true);
								$("#customsDelBtn").removeClass('link');*/
								w2ui['customs_tabs_options'].columns[4].editable = false;
								$("#customsCheckComp").prop("checked", true);
								$("#customsCheckComp").prop("disabled", "disabled");
								$("#dutyPrice").prop("readonly","readonly");
							}
						}else{
							/*$("#customsAddBtn").prop("disable", false);
							$("#customsAddBtn").addClass('link');*/
							$("#customsCheckComp").prop("checked", false);
							$("#customsCheckComp").prop("disabled", "");
						}
						
						$("#searchOrderPrevBtn").show();
						$("#orderEmailBtn").hide();
						$("#searchOrderNextBtn").show();
						$("#searchOrderPreviewBtn").hide();
						
						if(ordMgr.getModifyCustomsData.length == 0){
							w2ui['customs_tabs_options'].records = ordMgr.getModifyProductData;
						}else{
							w2ui['customs_tabs_options'].records = ordMgr.getModifyCustomsData;
							var dutyPrice = ordMgr.getModifyCustomsData[0].c_cost;
							$("#dutyPrice").val(dutyPrice);
						}
						w2ui['customs_tabs_options'].refresh();
					}else if(selectedTab == "deliveryTab"){
						fileCount = ordMgr.checkAttachedFiles(orderId+"_6");
						//ordMgr.validateDownloadBtn(fileCount, "deliveryDownloadBtn");
						$("#deliveryAttachCnt").val(fileCount+"건");
						if(ordMgr.getModifyDeliveryData.d_complete == 1){
							$("#deliveryCheckComp").prop("checked", true);
							$("#deliveryCheckComp").prop("disabled", "disabled");
							
							$("#searchOrderSaveBtn").attr("disabled",true);
				    		$("#searchOrderSaveBtn").addClass('hoverDisable');
						}
						w2ui['delivery_tabs_options'].record = ordMgr.getModifyDeliveryData;
						w2ui['delivery_tabs_options'].refresh();
						
						$("#searchOrderPrevBtn").show();
						$("#searchOrderPreviewBtn").hide();
						//$("#searchOrderNextBtn").show();
						$("#orderEmailBtn").hide();
					}else{
						$("#searchOrderPrevBtn").show();
						$("#searchOrderPreviewBtn").hide();
						$("#searchOrderNextBtn").show();
						$("#orderEmailBtn").hide();
					}
					
				},
				onRender : function(event){
					console.log(event);
				}
				
			});
			
			$("#orderTab").w2form({
				name : 'order_tabs_options',
				focus : -1,
				fields : [
					{name : 'orderTabsCompany', type : 'text', required : true},
					{name : 'orderTabStatusText', type : 'text'},
					{name : 'payment', type : 'text', required : true},
					{name : 'employeeName', type : 'text'},
					{name : 'deliveryTerm', type : 'text', required : true},
					{name : 'note', type : 'text', required : true},
					{name : 'orderComplete', type : 'text'},
					{name : 'orderFileName', type : 'text'}
				],
				record : {
					orderTabsCompany : '',
					orderTabsCompanyId : '',
					orderTabStatus : '',
					orderTabStatusText : '',
					payment : '',
					employeeName : '',
					employeeNameId : '',
					deliveryTerm : '',
					note : '',
					orderComplete : '',
					orderFileName : ''
				}
			});
			
			$("#shipTab").w2grid({
				name : 'ship_tab_options',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'ITEM', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'pi', caption: 'PI', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'po', caption: 'PO', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'pk', caption: 'PK#', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //요청일자
         			{ field: 'invoice', caption: 'INVOICE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //견적일자
         			{ field: 'model', caption: 'MODEL', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'quantity', caption: 'QTY', size : '50px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'flight_no', caption: 'FLIGHT NO.', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'mawb', caption: 'MAWB', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'hawb', caption: 'HAWB', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'} //담당자
         			
				],
				record : {
					pi : '',
					po : '',
					pk : '',
					invoice : '',
					model : '',
					quantity : '',
					flight_no : '',
					mawb : '',
					hawb : '',
					shipping_id : '',
					order_id : ''
				},
				onDblClick : function(event){
					event.onComplete = function(){
						var curStatus = w2ui['order_popup_options'].record.orderStatus;
						if(curStatus > 3){ //입항 이후
							ordMgr.addShipping("view");
						}
					}
				}
			});
			w2ui["ship_tab_options"].on({execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["ship_tab_options"].on({execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["ship_tab_options"].on({execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
			
			$("#incomeTab").w2grid({
				name : 'income_tab_options',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'shipping_name', caption: 'SHIPPER NAME', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'mawb', caption: 'MBL', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'hawb', caption: 'HBL', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //요청일자
         			{ field: 'flight_no', caption: 'FLT NO', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //견적일자
         			{ field: 'eta_date', caption: 'ETA DATE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'eta_time', caption: 'ETA TIME', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'pol', caption: 'POL', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'pod', caption: 'POD', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'terms', caption: 'TERMS', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'inv_no', caption: 'INV NO', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'po_no', caption: 'PO NO', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'commodity', caption: 'COMMODITY', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'pkg_qty', caption: 'PKG QTY', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'gw', caption: 'GW', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'cw', caption: 'CW', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'remarks', caption: 'REMARKS', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'} //담당자
         			
				],
				record : {
					recid : '',
					shipping_name : '',
					mawb : '',
					hawb : '',
					flight_no : '',
					eta_date : '',
					eta_time : '',
					pol : '',
					pod : '',
					terms : '',
					inv_no : '',
					po_no : '',
					commodity : '',
					pkg_qty : '',
					gw : '',
					cw : '',
					remarks : ''
				},
				onDblClick : function(event){
					event.onComplete = function(){
						var curStatus = w2ui['order_popup_options'].record.orderStatus;
						if(curStatus > 4){ //통관 이후
							ordMgr.addIncome("view");
						}
					}
				}
			});
			
			w2ui["income_tab_options"].on({execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["income_tab_options"].on({execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
        	
        	w2ui["income_tab_options"].on({execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
			
			/*---------- Pass Tab Ver.1 ---------------*/
			/*$("#customsTab").w2form({
				name : 'customs_tabs_options',
				focus : -1,
				fields : [
					{name : 'passConfirm', type : 'list'},
					{name : 'passTax', type : 'text'},
					{name : 'passFile', type : 'text'},
					{name : 'passAttachFile', type : 'text'}
				],
				record : {
					passConfirm : '',
					passTax : '',
					passFile : '',
					passAttachFile : ''
				}
			});*/
			//------------------------------------------------
			
			/*---------- Pass Tab Ver.2 ---------------*/
			$("#customsTab").w2grid({
				name : 'customs_tabs_options',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'product_name', caption: 'MODEL', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'orderQuantity', caption: 'QTY', size : '150px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'approval', caption: '승인', size : '200px', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //요청일자
         			{ field: 'hs_code', caption: 'HS CODE', size : '300px', sortable: true, attr: 'align=left', style: 'padding-left:5px;', editable: { type: 'text'}}
				],
				record : {
					product_name : '',
					orderQuantity : '',
					approval : '',
					hs_code : ''
				}
			});
			//------------------------------------------------
			
			/*$("#dutyArea").w2form({
				name : 'pass_tabs_duty_options',
				focus : -1,
				fields : [
					{name : 'dutyPrice', type : 'text'}
					
				],
				record : {
					dutyPrice : ''
				}
			});*/
			
			$("#deliveryTab").w2form({
				name : 'delivery_tabs_options',
				focus : -1,
				fields : [
					{name : 'd_id', type : 'text'},
					{name : 'd_user', type : 'text'},
					{name : 'd_destination', type : 'text'},
					{name : 'd_cost', type : 'text'},
					{name : 'd_phone', type : 'text'},
					{name : 'delivery_request_date', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'delivery_end_date', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					d_id : '',
					d_user : '',
					d_destination : '',
					d_cost : '',
					d_phone : '',
					delivery_request_date : '',
					delivery_end_date : ''
				}
			});
		},
		
		checkAttachedFiles : function(param){
			var fileCount = itsmUtil.getFileList(param);
			return fileCount.length;
		},
		
		validateDownloadBtn : function(count, downBtn){
			if(count > 0){
				$("#"+downBtn).prop("disabled", false);
				$("#"+downBtn).addClass('link');
			}else{
				$("#"+downBtn).prop("disabled", true);
				$("#"+downBtn).removeClass('link');
			}
		},
		
		checkTabAndStatus : function(){
			var curStatus = w2ui['order_popup_options'].record.orderStatus; // 2-발주, 3-선적, 4-입항, 5-통관, 6-배송
			if(curStatus == ""){
				return true;
			}
			var selectedCurTab = ordMgr.selectedTab;
			var tabName = w2ui['order_model_tabs_popup_options'].tabs[curStatus - 2].id;
			if(selectedCurTab == tabName){
				return true;
			}else{
				return false;
			}
		},
		
		settingTab : function(){
			var getOrderData = ordMgr.getModifyOrderData;
			/*var getProductData = ordMgr.getModifyProductData;
			var getShippingData = ordMgr.getModifyShippingData;*/
			var mailStatus = getOrderData.o_status; //1->2 = Send, 2->3 = Not Send
			var status = getOrderData.status; //2 = 발주, 3 = 선적, 4 = 입한, 5  = 통관, 6 = 배송
			/*{id : 'orderTab', caption : '발주'},
			{id : 'shipTab', caption : '선적'},
			{id : 'incomeTab', caption : '입항'},
			{id : 'customsTab', caption : '통관'},
			{id : 'deliveryTab', caption : '배송'}*/
			
			if(mailStatus == 3 && status == 2){
				w2ui['order_model_tabs_popup_options'].click('orderTab');
			}else if(mailStatus == 2 && status == 3){
				w2ui['order_model_grid_popup_options'].selectNone();
				$(".disableClass").css("display","block");
				$(".orderDisableClass").css("display","block");
				w2ui['order_model_tabs_popup_options'].show('shipTab');
				w2ui['order_model_tabs_popup_options'].click('shipTab');
			}else if(mailStatus == 2 && status == 4){
				w2ui['order_model_tabs_popup_options'].show('incomeTab');
				w2ui['order_model_tabs_popup_options'].click('incomeTab');
			}else if(mailStatus == 2 && status == 5){
				w2ui['order_model_tabs_popup_options'].show('customsTab');
				w2ui['order_model_tabs_popup_options'].click('customsTab');
			}else if(mailStatus == 2 && status == 6){
				w2ui['order_model_tabs_popup_options'].show('deliveryTab');
				w2ui['order_model_tabs_popup_options'].click('deliveryTab');
			}
		},
		
		setEstimateToOrder : function(){ //gihwan
			var selectedEstimate = ordMgr.selectedEstimate;
			var selectedOrderStatus = selectedEstimate[0].status;
			var cnvtOrderStatusText = this.getOrderStatusList[selectedOrderStatus].text;
			var cnvtOrderStatus = this.getOrderStatusList[selectedOrderStatus].value;
			var estimateId = selectedEstimate[0].estimate_id;
			w2ui['order_popup_options'].record = {
				orderTitle : selectedEstimate[0].estimate_title,
				orderCompany : selectedEstimate[0].site_name,
				//orderRegistDate : selectedEstimate[0].registration_date,
				orderStatusText : cnvtOrderStatusText,
				orderStatus : cnvtOrderStatus,
				customerSupplyCompany : '',
				customerOperCompany : '',
				customerName : selectedEstimate[0].customer_name
			}
			w2ui['order_tabs_options'].record.payment = selectedEstimate[0].payment;
			w2ui['order_tabs_options'].record.note = selectedEstimate[0].note;
			w2ui['order_tabs_options'].refresh();
			w2ui['order_popup_options'].refresh();
			
			ordMgr.getProductInfo(estimateId);
		},
		
		getProductInfo : function(estimateId){
			var getProductInfo = new Model();
			getProductInfo.url = "/order/getProductInfo/"+estimateId;
			that.listenTo(getProductInfo, 'sync', that.setProductInfo);
			getProductInfo.fetch();
		},
		
		setProductInfo : function(method, model, options){ //gihwan
			var selectedEstimate = ordMgr.selectedEstimate;
			var estimateTotal = selectedEstimate[0].total_amount;
			for(var i = 0; i < model.length; i++){
				var orderQty = model[i].quantity;
				var orderUpr = model[i].u_price;
				model[i].orderUprice = orderUpr;
				model[i].orderQuantity = orderQty;
				
				var orderAmt = orderQty * orderUpr
				model[i].amount = orderAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				model[i].orderAmount = orderAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}

			w2ui['order_model_grid_popup_options'].summary[0].amount = estimateTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			w2ui['order_model_grid_popup_options'].summary[0].orderAmount = estimateTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			w2ui['order_model_grid_popup_options'].records = model;
			w2ui['order_model_grid_popup_options'].refresh();
			
			var date = util.getDate("daynohyphen");
			var esimateEdition = ordMgr.selectedEstimate[0].edition;
			if(esimateEdition < 10){
				esimateEdition = "0"+esimateEdition;
			}
			var modelName = w2ui['order_model_grid_popup_options'].records[0].product_name;
			var customerName = w2ui['order_popup_options'].record.customerName;
			var fileName = "YESCNC_"+customerName+"_"+modelName+"_PO_"+date+"_ED"+esimateEdition;
			w2ui['order_tabs_options'].record.orderFileName = fileName;
			w2ui['order_tabs_options'].refresh();
			
		},
		
		setOrderDataPopup : function(){ //gihwanmodify
			var modifyOrderData = ordMgr.getModifyOrderData;
			var modifyProductData = ordMgr.getModifyProductData;
			var modifyShippingData = ordMgr.getModifyShippingData;
			
			var status = modifyOrderData.status;
			//var openTabId = w2ui['order_model_tabs_popup_options'].tabs[status - 2].id;
			
			//that.changeTabEnableDisable(openTabId);
			
			var orderStatus = ordMgr.getOrderStatusList[modifyOrderData.status - 1];
			var orderMailStatus = ordMgr.getMailStatusList[modifyOrderData.o_status - 1];
			var estimateTotal = 0;
			var orderTotal = 0;
			
			w2ui['order_popup_options'].record = {
					orderCompany : modifyOrderData.customer_site,
					orderRegistDate : modifyOrderData.order_start_date,
					orderStatusText : orderStatus.text,
					orderStatus : orderStatus.value,
					orderTitle : modifyOrderData.estimate_title,
					customerName : modifyOrderData.customer_name,
					customerNameId : modifyOrderData.customer_id,
					customerSupplyCompany : modifyOrderData.supplier_site_name,
					customerSupplyCompanyId : modifyOrderData.supplier_site,
					customerOperCompany : modifyOrderData.operator_site_name,
					customerOperCompanyId : modifyOrderData.operator_site,
					orderId : modifyOrderData.order_id
			};
			
			for(var i = 0; i < modifyProductData.length; i++){
				var orderQty = modifyProductData[i].orderQuantity;
				var orderUpr = modifyProductData[i].orderUprice;
				var estimateQty = modifyProductData[i].quantity;
				var estimateUpr = modifyProductData[i].u_price;
				var orderAmount = orderQty * orderUpr;
				var estimateAmount = estimateQty * estimateUpr;
				
				estimateTotal += estimateAmount;
				orderTotal += orderAmount;
				modifyProductData[i].orderAmount = orderAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				modifyProductData[i].amount = estimateAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			w2ui['order_model_grid_popup_options'].summary[0].amount = estimateTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			w2ui['order_model_grid_popup_options'].summary[0].orderAmount = orderTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			w2ui['order_model_grid_popup_options'].records = modifyProductData;
			
			
			w2ui['order_tabs_options'].record = {
					deliveryTerm : modifyOrderData.o_delivery_term,
					employeeName : modifyOrderData.orderManager_name,
					employeeNameId : modifyOrderData.o_manager,
					note : modifyOrderData.o_note,
					orderTabStatusText : orderMailStatus.text,
					orderTabStatus : modifyOrderData.o_status,
					orderTabsCompany : modifyOrderData.o_site_name,
					orderTabsCompanyId : modifyOrderData.o_site_id,
					orderComplete : modifyOrderData.order_end_date,
					payment : modifyOrderData.o_payment
			};
			
			w2ui['ship_tab_options'].records = modifyShippingData;
			
			w2ui['order_popup_options'].refresh();
			w2ui['order_model_grid_popup_options'].refresh();
			w2ui['order_tabs_options'].refresh();
			w2ui['ship_tab_options'].refresh();
			
			var status = modifyOrderData.status;
			if(status > 2){
				$(".disableClass").css("display","block");
			}else{
				$(".disableClass").css("display","none");
			}
			var openTabId = w2ui['order_model_tabs_popup_options'].tabs[status - 2].id;
			
			
			if(ordMgr.clickStatus != null){ //Click Status;
				openTabId = ordMgr.clickStatus;
			}
			w2ui['order_model_tabs_popup_options'].click(openTabId);
			
			ordMgr.clickStatus = null;
		},
		
		changePrevTab : function(){
			var tabContents = w2ui['order_model_tabs_popup_options'].tabs;
			var getTabId = _.pluck(tabContents, "id");
			var findCurIdx = _.indexOf(getTabId, that.selectedTab);
			var changeTabName = getTabId[findCurIdx-1];
			w2ui['order_model_tabs_popup_options'].click(changeTabName);
			
			tabContents, getTabId, findCurIdx, changeTabName = null;
		},
		
		changeNextTab : function(){ //gihwan
			var orderContents = w2ui['order_tabs_options'].record;
			if((orderContents.orderTabsCompany == "" || orderContents.payment == "" || orderContents.deliveryTerm == "" || orderContents.note == "")
				|| (orderContents.payment == null || orderContents.deliveryTerm == null || orderContents.note == null)){
				return;
			}else{
				var tabs = w2ui['order_model_tabs_popup_options'].tabs;
				var tabText = _.pluck(tabs, "id");
				var tabIdx = _.indexOf(tabText, ordMgr.selectedTab);
				var checkHidden = tabs[tabIdx+1].hidden;
				if(checkHidden){
					return;
				}
				// =========================== Change Tab ========================
				var tabContents = w2ui['order_model_tabs_popup_options'].tabs;
				var getTabId = _.pluck(tabContents, "id");
				var findCurIdx = _.indexOf(getTabId, that.selectedTab);
				var changeTabName = getTabId[findCurIdx+1];
				w2ui['order_model_tabs_popup_options'].click(changeTabName);
				
				tabContents, getTabId, findCurIdx, changeTabName = null;
				//=================================================================
			}
		},
		
		getSupplyCompany : function(event){
			ordMgr.clickedItem =  $(event.target).attr("id");//customerSupplyCompany, customerOperCompany
			if($('body').find("#companyPopup").size() == 0 ){
				$('body').append("<div id='companyPopup'></div>");
			}
			$("#companyPopup").dialog({
				title : BundleResource.getString('title.estimate.siteList'),
				width : 300,
				height : 570,
				modal : true,
				resizable: false,
				show: { effect: "fade", duration: 300 },
 			    hide: { effect: "fade", duration: 100 },
				buttons : {//gihwan
					"확인" : function(event){
						if(ordMgr.clickedItem == "customerSupplyCompany"){
							if(ordMgr.selectSupplyItem.nodes.length == 0){
								w2ui['order_popup_options'].record.customerSupplyCompany = ordMgr.selectSupplyItem.text;
								w2ui['order_popup_options'].record.customerSupplyCompanyId = ordMgr.selectSupplyItem.site_id;
							}else{
								return;
							}
						}else{
							if(ordMgr.selectUsingItem.nodes.length == 0){
								w2ui['order_popup_options'].record.customerOperCompany = ordMgr.selectUsingItem.text;
								w2ui['order_popup_options'].record.customerOperCompanyId = ordMgr.selectUsingItem.site_id;
							}else{
								return;
							}
						}
						w2ui['order_popup_options'].refresh();
						$(this).dialog("close");
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#companyPopup").append('<div id="companyAddArea"></div>');
					var siteAddArea = '<div id="companyContents">'+
											'<div id="companyLeftContents">'+
										    	'<div class="dashboard-contents">'+
													'<div id="companyLeftBottom"></div>'+
										    	'</div>'+
										    '</div>'+
										'</div>';
					$("#companyAddArea").html(siteAddArea);
					ordMgr.getCompanyList();
				},
				close : function(){
					$("#companyPopup").remove();
					if(w2ui['company_tree']){
						w2ui['company_tree'].destroy();
					}
				}
			});
		},
		
		getOrderCompany : function(event){
			ordMgr.clickedItem =  $(event.target).attr("id");
			if($('body').find("#addOrderPopup").size() == 0 ){
				$('body').append("<div id='addOrderPopup'></div>");
			}
			$("#addOrderPopup").dialog({
				title : BundleResource.getString('title.estimate.siteList'),
				width : 700,
				height : 600,
				modal : true,
				resizable: false,
				buttons : {
					"확인" : function(){
						var selectedData = w2ui['order_site_popup'].get(w2ui['order_site_popup'].getSelection());
						if(selectedData==0){
							return;
						}else{
							var mailStatus = that.getMailStatusList[2];
							w2ui['order_tabs_options'].record.orderTabsCompany = selectedData[0].site_name;
							w2ui['order_tabs_options'].record.orderTabsCompanyId = selectedData[0].site_id;
							w2ui['order_tabs_options'].record.employeeName = selectedData[0].customer_name;
							w2ui['order_tabs_options'].record.employeeNameId = selectedData[0].customer_id;
							w2ui['order_tabs_options'].record.orderTabStatusText = mailStatus.text;
							w2ui['order_tabs_options'].record.orderTabStatus = mailStatus.value;
							w2ui['order_tabs_options'].refresh();
							//$("#orderTabStatusText").val(mailStatus);
							$(this).dialog("close");
						}
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#addOrderPopup").append('<div id="orderAddArea"></div>');
					var orderAddArea = '<div id="orderContents">'+
													'<div id="orderLeftContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title">Company List</div>'+
												    		'<div class="dashboard-contents"><div id="orderLeftBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//siteLeftContents
													'<div id="siteRightContents">'+
														'<div class="dashboard-panel" style="width:100%;">'+
												    		'<div class="dashboard-title">Manager List</div>'+
												    		'<div class="dashboard-contents"><div id="orderRightBottom"></div></div>'+
												    	'</div>'+
													'</div>'+//siteRightContents
												'</div>';
					$("#orderAddArea").html(orderAddArea);
					ordMgr.getCompanyList();
					//estMgr.listNotifiCation("getSiteList"); //업체 리스트
					
					$("#orderRightBottom").w2grid({
						name : 'order_site_popup',
						style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
						show: { 
							toolbar: false,
							footer:false,
							toolbarSearch:false,
							toolbarReload  : false,
							searchAll : false,
							toolbarColumns : false,
							selectColumn: true,
						},
						multiSelect : false,
						recordHeight : 30,
						blankSymbol : "-",
						columns : [
							{ field: 'recid', caption: 'NO', size : '20px', sortable: true, attr: 'align=center'},
							{ field: 'customer_name', caption: 'NAME', size: '100%', sortable: true, attr: 'align=center'},
							{ field: 'phone', caption: 'PHONE', size: '100%', sortable: true, attr: 'align=center'},
							{ field: 'email', caption: 'EMAIL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
							{ field: 'site_name', caption: 'SITE', hidden: true, size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}
						]
					});
				},
				close : function(){
					$("#addOrderPopup").remove();
					if(w2ui['company_order_tree']){
						w2ui['company_order_tree'].destroy();
					}
					w2ui['order_site_popup'].destroy();
				}
			});
		},
		
		addShipping : function(mode){
			if(typeof(mode) == "object"){
				mode = "add";
			}
			that.validationCheck();
        	if(mode != "view" && $("#shipAddBtn").prop("disable")){
        		return;
        	}
			if($('body').find("#addShipPopup").size() == 0 ){
				$('body').append("<div id='addShipPopup'></div>");
			}
			
			var selectedData = w2ui['ship_tab_options'].get(w2ui['ship_tab_options'].getSelection());

			
			var record = {};
			if(mode == "edit" || mode == "view"){
				record = {
						recid : selectedData[0].recid,
						pi : selectedData[0].pi,
						quantity : selectedData[0].quantity,
						po : selectedData[0].po,
						flight_no : selectedData[0].flight_no,
						pk : selectedData[0].pk,
						mawb : selectedData[0].mawb,
						invoice : selectedData[0].invoice,
						hawb : selectedData[0].hawb,
						model : selectedData[0].model
					}
			}else{
				/*record = {
					pi : '', 
					quantity : '', 
					po : '', 
					flight_no : '', 
					pk : '', 
					mawb : '', 
					invoice : '',  
					hawb : '', 
					model : ''
				}*/
				record = {
						pi : 'SR18051244Z', 
						quantity : '3', 
						po : 'PO_20180611', 
						flight_no : 'OZ970/14 JUN 2018', 
						pk : 'PK1860637J', 
						mawb : '988-28825744', 
						invoice : 'JIF8061305J',  
						hawb : 'HTNS249659', 
						model : 'ECS4120-28Fv2 EU'
					}
			}
			$("#addShipPopup").dialog({
				title : "선적",
				width : 700,
				height : 360,
				modal : true,
				resizable: false,
				show: { effect: "fade", duration: 300 },
 			    hide: { effect: "fade", duration: 100 },
				buttons : {
					"확인" : function(){
						if(mode == "edit"){
							var result = w2ui['add_ship_popup'].record;
							var recid = result.recid; 
							result.shipping_id = util.createUID();
							w2ui['ship_tab_options'].records[recid - 1] = result;
							w2ui['ship_tab_options'].refreshRow(recid);
						}else if(mode == "view"){
							console.log("Shipping Popup View");
						}else{
							var result = w2ui['add_ship_popup'].record;
							var recid = w2ui['ship_tab_options'].records.length; //기환선적
							var shippingId = util.createUID();
							result.recid = recid+1;
							result.shipping_id = shippingId;
							w2ui['ship_tab_options'].add(result);
							w2ui['ship_tab_options'].refresh();
						}
						w2ui['ship_tab_options'].selectNone();
						$(this).dialog("close");
					},
					"취소" : function(){
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#addShipPopup").append('<div id="addShipArea"></div>');
					var addShipArea = '<div id="addShipBottom" style="width:100%; height:100%;">'+
						    			'<div class="w2ui-page page-0">'+
								
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">PI</label>'+
							    				'<div class="inputArea">'+
													'<input name="pi" type="text" size="20"/>'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">QTY</label>'+
							    				'<div class="inputArea">'+
													'<input name="quantity" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">PO</label>'+
							    				'<div class="inputArea">'+
													'<input name="po" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">FLIGHT NO</label>'+
							    				'<div class="inputArea">'+
													'<input name="flight_no" type="text" size="20"/>'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">PK</label>'+
							    				'<div class="inputArea">'+
													'<input name="pk" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">Mawb</label>'+
							    				'<div class="inputArea">'+
													'<input name="mawb" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">INVOICE</label>'+
							    				'<div class="inputArea">'+
													'<input name="invoice" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">Hawb</label>'+
							    				'<div class="inputArea">'+
													'<input name="hawb" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">MODEL</label>'+
							    				'<div class="inputArea">'+
													'<input name="model" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			
							    		
										'</div>'+ //w2ui-page page-0
									'</div>';
					$("#addShipArea").html(addShipArea);
					
					$("#addShipBottom").w2form({
						name : 'add_ship_popup',
						focus : 0,
						fields : [
							{name : 'pi', type : 'text'},
							{name : 'quantity', type : 'text'},
							{name : 'po', type : 'text'},
							{name : 'flight_no', type : 'text'},
							{name : 'pk', type : 'text'},
							{name : 'mawb', type : 'text'},
							{name : 'invoice', type : 'text'},
							{name : 'hawb', type : 'text'},
							{name : 'model', type : 'text'}
							
						],
						record : record
					});
					
					if(mode == "view"){
						$("#pi").attr("readonly","readonly");
						$("#quantity").attr("readonly","readonly");
						$("#po").attr("readonly","readonly");
						$("#flight_no").attr("readonly","readonly");
						$("#pk").attr("readonly","readonly");
						$("#mawb").attr("readonly","readonly");
						$("#invoice").attr("readonly","readonly");
						$("#hawb").attr("readonly","readonly");
						$("#model").attr("readonly","readonly");
					}
				},
				close : function(){
					$("#addShipPopup").remove();
					if(w2ui['add_ship_popup']){
						w2ui['add_ship_popup'].destroy();
					}
				}
			});
		},
		
		modifyShipping : function(){
			that.validationCheck();
        	if($("#shipModifyBtn").prop("disable")){
        		return;
        	}
			that.addShipping("edit");
		},
		
		deleteShipping : function(){
			that.validationCheck();
        	if($("#shipDelBtn").prop("disable")){
        		return;
        	}
			
        	var curRecord = w2ui['ship_tab_options'].records;
        	var selectedData = w2ui['ship_tab_options'].get(w2ui['ship_tab_options'].getSelection());
        	for(var i = 0; i < selectedData.length; i++){
        		var recid = selectedData[i].recid;
        		w2ui['ship_tab_options'].remove(recid);
        	}
        	
        	var delAfter = w2ui['ship_tab_options'].records;
        	for(var i = 0; i < delAfter.length; i++){
        		delAfter[i].recid = i+1;
        	}
        	w2ui['ship_tab_options'].refresh();
        	w2ui['ship_tab_options'].selectNone();
		},
		
		/*shippingDeleteOkAction : function(){
        	var selectedData = w2ui['ship_tab_options'].get(w2ui['ship_tab_options'].getSelection());
        	var shippingId = _.pluck(selectedData, "shipping_id");
        	
        	var deleteShippingData = new Model();
        	deleteShippingData.set({
        		shipping_id : shippingId
        	});
        	deleteShippingData.url = 'order/deleteShippingData';
        	deleteShippingData.save(null, {
				success : function(model, response){
					//ordMgr.getOrderData();
				}
			})
		},*/
		
		attachFiles : function(){
			var clickedId = $(this).attr("id");
			if($("#"+clickedId).prop("disabled")){
				return;
			}
			var orderId = w2ui['order_popup_options'].record.orderId;
			var params = null;
			var inputArea = null;
			//var downloadBtn = null;
			
			if(clickedId.match("ship") != null){
				params = orderId+"_3";
				inputArea = "shippingAttachCnt";
				//downloadBtn = "shipDownloadBtn";
			}else if(clickedId.match("port") != null){
				params = orderId+"_4";
				inputArea = "portAttachCnt";
				//downloadBtn = "portDownloadBtn";
			}else if(clickedId.match("custom") != null){
				params = orderId+"_5";
				inputArea = "customsAttachCnt";
				//downloadBtn = "customsDetatchDownloadBtn";
			}else if(clickedId.match("delivery") != null){
				params = orderId+"_6";
				inputArea = "deliveryAttachCnt";
				//downloadBtn = "deliveryDownloadBtn";
			}
			ordMgr.attachParams = params;
			ordMgr.attachCountArea = inputArea;
			//ordMgr.attachDownloadBtn = downloadBtn;
			itsmUtil.attachFileFunc(params);
		},
		
		fileAttachSuccess : function(){
			var params = ordMgr.attachParams;
			var area = ordMgr.attachCountArea;
			//var downBtn = ordMgr.attachDownloadBtn;
			var fileArr = itsmUtil.getFileList(params);
			var totalCnt = fileArr.length;
			$("#"+area).val(totalCnt+"건");
			/*if(totalCtn > 0){
				$("#"+downBtn).prop("disable", false);
				$("#"+downBtn).addClass("link");
			}else{
				$("#"+downBtn).prop("disable", true);
				$("#"+downBtn).removeClass("link");
			}*/
			ordMgr.attachParams = null;
			ordMgr.attachCountArea = null;
		},
		
		addIncome : function(mode){
        	if(typeof(mode) == "object"){
				mode = "add";
			}
			that.validationCheck();
        	if(mode != "view" && $("#incomeAddBtn").prop("disable")){
        		return;
        	}
			if($('body').find("#addIncomePopup").size() == 0 ){
				$('body').append("<div id='addIncomePopup'></div>");
			}
			
			var selectedData = w2ui['income_tab_options'].get(w2ui['income_tab_options'].getSelection());
			var record = {};
			if(mode == "edit" || mode == "view"){
				record = {
					recid : selectedData[0].recid,
					shipping_name : selectedData[0].shipping_name,
					terms : selectedData[0].terms,
					mawb : selectedData[0].mawb,
					inv_no : selectedData[0].inv_no,
					hawb : selectedData[0].hawb,
					po_no : selectedData[0].po_no,
					flight_no : selectedData[0].flight_no,
					commodity : selectedData[0].commodity,
					eta_date : selectedData[0].eta_date,
					pkg_qty : selectedData[0].pkg_qty,
					eta_time : selectedData[0].eta_time,
					gw : selectedData[0].gw,
					pol : selectedData[0].pol,
					cw : selectedData[0].cw,
					pod : selectedData[0].pod,
					remarks : selectedData[0].remarks,
				};
			}else{
				record =  {
					shipping_name : '',
					terms : '',
					mawb : '',
					inv_no : '',
					hawb : '',
					po_no : '',
					flight_no : '',
					commodity : '',
					eta_date : that.cnvtDay,
					pkg_qty : '',
					eta_time : that.cnvtTime,
					gw : '',
					pol : '',
					cw : '',
					pod : '',
					remarks : ''
				};
			}
			
			$("#addIncomePopup").dialog({
				title : "입항",
				width : 700,
				height : 450,
				modal : true,
				resizable: false,
				show: { effect: "fade", duration: 300 },
 			    hide: { effect: "fade", duration: 100 },
				buttons : {
					"확인" : function(){
						if(mode == "edit"){
							var result = w2ui['add_income_popup'].record;
							var recid = result.recid; 
							//result.port_id = util.createUID();
							w2ui['income_tab_options'].records[recid - 1] = result;
							w2ui['income_tab_options'].refreshRow(recid);
							//w2ui['income_tab_options'].add(result);
							//w2ui['income_tab_options'].refresh();
							//w2ui['income_tab_options'].sort('recid','asc');
						}else if(mode == "view"){
							console.log("Shipping Popup View");
						}else{
							var result = w2ui['add_income_popup'].record;
							var recid = w2ui['income_tab_options'].records.length;
							var portId = util.createUID();
							result.recid = recid+1;
							//result.port_id = portId;
							w2ui['income_tab_options'].add(result);
							w2ui['income_tab_options'].refresh();
						}
						w2ui['income_tab_options'].selectNone();
						$(this).dialog("close");
						
					},
					"취소" : function(){
						w2ui['income_tab_options'].selectNone();
						$(this).dialog("close");
					}
				},
				open : function(){
					$("#addIncomePopup").append('<div id="addIncomeArea"></div>');
					var addIncomeArea = '<div id="addIncomeBottom" style="width:100%; height:100%;">'+
						    			'<div class="w2ui-page page-0">'+
								
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">SHIPPER NAME</label>'+
							    				'<div class="inputArea">'+
													'<input name="shipping_name" type="text" size="20"/>'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">TERMS</label>'+
							    				'<div class="inputArea">'+
													'<input name="terms" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">MBL NO</label>'+
							    				'<div class="inputArea">'+
													'<input name="mawb" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">INV NO</label>'+
							    				'<div class="inputArea">'+
													'<input name="inv_no" type="text" size="20"/>'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">HBL NO</label>'+
							    				'<div class="inputArea">'+
													'<input name="hawb" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">PO NO</label>'+
							    				'<div class="inputArea">'+
													'<input name="po_no" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">FLT NO</label>'+
							    				'<div class="inputArea">'+
													'<input name="flight_no" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">COMMODITY</label>'+
							    				'<div class="inputArea">'+
													'<input name="commodity" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
						    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">ETA DATE</label>'+
							    				'<div class="inputArea">'+
													'<input name="eta_date" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">PKG QTY</label>'+
							    				'<div class="inputArea">'+
													'<input name="pkg_qty" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    		
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">ETA TIME</label>'+
							    				'<div class="inputArea">'+
													'<input name="eta_time" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">GW</label>'+
							    				'<div class="inputArea">'+
													'<input name="gw" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">POL</label>'+
							    				'<div class="inputArea">'+
													'<input name="pol" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">CW</label>'+
							    				'<div class="inputArea">'+
													'<input name="cw" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">POD</label>'+
							    				'<div class="inputArea">'+
													'<input name="pod" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
							    			
							    			'<div class="w2ui-field popup-options">'+
							    				'<label class="orderPopupText">REMARKS</label>'+
							    				'<div class="inputArea">'+
													'<input name="remarks" type="text" size="20" />'+
												'</div>'+
							    			'</div>'+
										'</div>'+ //w2ui-page page-0
									'</div>';
					$("#addIncomeArea").html(addIncomeArea);
					
					
					$("#addIncomeBottom").w2form({
						name : 'add_income_popup',
						focus : 0,
						fields : [
							//{name : 'rec_id', type : 'text'},
							{name : 'shipping_name', type : 'text'},
							{name : 'terms', type : 'text'},
							{name : 'mawb', type : 'text'},
							{name : 'inv_no', type : 'text'},
							{name : 'hawb', type : 'text'},
							{name : 'po_no', type : 'text'},
							{name : 'flight_no', type : 'text'},
							{name : 'commodity', type : 'text'},
							{name : 'eta_date', type : 'date', options : {format : 'yyyy-mm-dd'}},
							{name : 'pkg_qty', type : 'text'},
							{name : 'eta_time', type : 'time', options : {format : 'h24'}},
							{name : 'gw', type : 'text'},
							{name : 'pol', type : 'text'},
							{name : 'cw', type : 'text'},
							{name : 'pod', type : 'text'},
							{name : 'remarks', type : 'text'}
							
						],
						record : record
					});
					if(mode == "view"){
						$("#shipping_name").attr("readonly","readonly");
						$("#terms").attr("readonly","readonly");
						$("#mawb").attr("readonly","readonly");
						$("#inv_no").attr("readonly","readonly");
						$("#hawb").attr("readonly","readonly");
						$("#po_no").attr("readonly","readonly");
						$("#flight_no").attr("readonly","readonly");
						$("#commodity").attr("readonly","readonly");
						$("#eta_date").attr("readonly","readonly");
						$("#pkg_qty").attr("readonly","readonly");
						$("#eta_time").attr("readonly","readonly");
						$("#gw").attr("readonly","readonly");
						$("#pol").attr("readonly","readonly");
						$("#cw").attr("readonly","readonly");
						$("#pod").attr("readonly","readonly");
						$("#remarks").attr("readonly","readonly");
					}
					
				},
				close : function(){
					$("#addIncomePopup").remove();
					if(w2ui['add_income_popup']){
						w2ui['add_income_popup'].destroy();
					}
				}
			});
		},
		
		modifyIncome : function(){
			that.validationCheck();
        	if($("#incomeModifyBtn").prop("disable")){
        		return;
        	}
			that.addIncome("edit");
		},
		
		deleteIncome : function(){
			that.validationCheck();
        	if($("#incomeDelBtn").prop("disable")){
        		return;
        	}
    			
        	var curRecord = w2ui['income_tab_options'].records;
        	var selectedData = w2ui['income_tab_options'].get(w2ui['income_tab_options'].getSelection());
        	for(var i = 0; i < selectedData.length; i++){
        		var recid = selectedData[i].recid;
        		w2ui['income_tab_options'].remove(recid);
        	}
        	
        	var delAfter = w2ui['income_tab_options'].records;
        	for(var i = 0; i < delAfter.length; i++){
        		delAfter[i].recid = i+1;
        	}
        	w2ui['income_tab_options'].refresh();
        	w2ui['income_tab_options'].selectNone();

		},
		
		customsDownload : function(){
			console.log("customsDownload");
		},
		
		getCompanyList : function(){
			var getCompany = new Model();
			getCompany.url = 'order/getCompanyList';
			that.listenTo(getCompany, 'sync', that.setCompanyList);
			getCompany.fetch();
		},
		
		setCompanyList : function(model, method, options){
			ordMgr.treeMenu = model.attributes.treeData.nodes;
			ordMgr.allMenu = model.attributes.allData;
			
			if(ordMgr.clickedItem == "customerSupplyCompany" || ordMgr.clickedItem == "customerOperCompany"){
				ordMgr.createCompanyTree(model);
				w2ui['company_tree'].insert('-1', null, model.attributes.treeData.nodes);
				w2ui['company_tree'].refresh();
			}else{
				ordMgr.createOrderTree(model);
				w2ui['company_order_tree'].insert('-1', null, model.attributes.treeData.nodes);
				w2ui['company_order_tree'].refresh();
				
				if(!ordMgr.selectOrderItem){
					ordMgr.selectOrderItem = w2ui['company_order_tree'].get(w2ui['company_order_tree'].nodes[0].nodes[0].nodes[0].id);
					w2ui['company_order_tree'].select(w2ui['company_order_tree'].nodes[0].nodes[0].nodes[0].id);
				}else{
					w2ui['company_order_tree'].select(ordMgr.selectOrderItem.id);
				}
				ordMgr.getCompanyManager(ordMgr.selectOrderItem);
			}
		},
		
		createCompanyTree : function(model){
			$("#companyLeftBottom").w2sidebar({
				name : 'company_tree',
				nodes : [
					{id: 'Site', text: 'SITE LIST', expanded: true, group: true,
					nodes: [{id:'-1', text: 'SITE',	expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					event.onComplete = function(){
						var selectId = event.target;
						if(ordMgr.clickedItem == "customerSupplyCompany"){
							ordMgr.selectSupplyItem = w2ui['company_tree'].get(selectId);
						}else{
							ordMgr.selectUsingItem = w2ui['company_tree'].get(selectId);
						}
					}
				}
			});
		},
		
		createOrderTree : function(model){
			$("#orderLeftBottom").w2sidebar({
				name : 'company_order_tree',
				nodes : [
					{id: 'Site', text: 'SITE LIST', expanded: true, group: true,
					nodes: [{id:'-1', text: 'SITE',	expanded: true, img: 'fa icon-folder'}]}
				],
				
				onClick : function(event){
					event.onComplete = function(){
						var selectId = event.target;
						w2ui["order_site_popup"].selectNone();
						
						ordMgr.selectOrderItem = w2ui['company_order_tree'].get(selectId);
						ordMgr.getCompanyManager(ordMgr.selectOrderItem);
					}
				}
			});
		},
		
		getCompanyManager : function(item){
			var id = null;
			if(item.siteId == undefined){
				id = item.id;
			}else{
				id = item.siteId;
			}
			var companyManager = new Model();
			companyManager.url = 'order/'+id;
			companyManager.save();
			that.listenTo(companyManager, 'sync', ordMgr.setCompanyManager);
		},
		
		setCompanyManager : function(method, model, options){
			w2ui['order_site_popup'].records = model;
			w2ui['order_site_popup'].refresh();
		},
		
		orderSaveAction : function(){ //gihwansaveaction
			//that.popupMode = "modifyMode";
			var arr = 0;
			var arrTopOptions = w2ui['order_popup_options'].validate();
			if(arrTopOptions.length > 0){
				return;
			}
			var currentMode = that.popupMode; //modifyMode or addMode
			var saveBtn = null;
			var textMessage = BundleResource.getString('label.estimate.saveConfirm');
			if(currentMode == "modifyMode"){
				saveBtn = "orderModifyOk";
			}else{ // addMode
				saveBtn = "orderSaveOk";
			}
			var currentTabId = that.selectedTab;
			if(currentTabId == "orderTab"){
				arr = w2ui['order_tabs_options'].validate();
				if(arr.length > 0){
					return
				}
			}else if(currentTabId == "shipTab"){
				if(w2ui['ship_tab_options'].records.length == 0){
					return;
				}
			}else if(currentTabId == "incomeTab"){
				if(w2ui['income_tab_options'].records.length == 0){
					return;
				}
			}else if(currentTabId == "customsTab"){
				
			}else{ // Delivery Tab
				
			}
			w2popup.message({ 
				width   : 360, 
				height  : 198,
				html    :  //저장 하시겠습니까?
					'<div style="padding: 60px; text-align: center; color:#ffffff;">'+textMessage+'</div>'+
					'<div style="text-align: center">'+
					'<button id='+saveBtn+' class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.estimate.confirm') + '</button>'+//id="estMgrAddSaveOKBtn" 
					'<button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.estimate.cancel') + '</button>'+
					'</div>'
			});
			$(".w2ui-message").css({top:"182px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
		
		},
		
		orderSaveOkAction : function(checkMail){ //gihwansave
        	var popupMode = ordMgr.popupMode;
        	var url = null;
			var bottomTabOptions = null;
			var status = null;
			var orderStatus = null;
			var orderId = null;
			var selectedData = [];
			w2ui['order_model_grid_popup_options'].save();
			var middleOptions = w2ui['order_model_grid_popup_options'].records;
			var topOptions = w2ui['order_popup_options'].record;
			var userId = sessionStorage.LOGIN_ID;
			
			if(popupMode == "modifyMode"){
				selectedData = w2ui['order_list'].get(w2ui['order_list'].getSelection());
				var supplyCompanyId = topOptions.customerSupplyCompanyId; //곡급 업체 아이디
				var operatorCompanyId = topOptions.customerOperCompanyId; //운용 업체 아이디
			}else{
				var selectedEstimate = ordMgr.selectedEstimate;
				var selectedSupply = ordMgr.selectSupplyItem;
				var selectedUsing = ordMgr.selectUsingItem;
				if(selectedSupply != undefined){
					var supplyCompanyId = selectedSupply.id; //곡급 업체 아이디
				}
				if(selectedUsing != undefined){
					var operatorCompanyId = selectedUsing.id; //운용 업체 아이디
				}
				var selectedOrder = ordMgr.selectOrderItem;
				var estimateId = selectedEstimate[0].estimate_id; //견적 아이디
				var projectId = selectedEstimate[0].project_id; //프로젝트 아이디
				var estimateCompany = selectedEstimate[0].site_name; //주문처
				var clientID = selectedEstimate[0].customer_id; //고객명 ID
				var orderSiteId = selectedOrder.id; //발주처
			}
			var params = {};
			var product = {};
			
			if(checkMail == "mailOk"){
				status = that.getOrderStatusList[2].value; // 상태 - 선적 (3)
				orderStatus = that.getMailStatusList[1].value; //메일 전송 상태 - 발송 (1)
				
			}else{
				status = that.getOrderStatusList[1].value; // 상태 - 발주 (2)
				orderStatus = that.getMailStatusList[2].value; //메일 전송 상태 - 미발송 (2)
			}
			
			var currentTabId = that.selectedTab;
			if(currentTabId == "orderTab"){ //----------------- 발주 탭 ---------------------
				var totalPrice = 0;
				var totalAmount = 0;
				if(popupMode == "modifyMode"){
					orderId = selectedData[0].order_id;
				}else{
					if(checkMail == "mailOk"){
						var curOrderId = w2ui['order_popup_options'].record.orderId;
						if(curOrderId != undefined){
							var orderList = w2ui['order_list'].records;
							var orderIdList = _.pluck(orderList, "order_id");
							var checkOrderId = _.indexOf(orderIdList, curOrderId);
							if(checkOrderId != -1){
								orderId = curOrderId;
							}
						}else{
							orderId = util.createUID();
						}
					}else{
						orderId = util.createUID();
					}
				}
				totalPrice = w2ui['order_model_grid_popup_options'].summary[0].orderAmount;
				totalAmount = Number(totalPrice.replace(/[^\d]+/g, '')); //detach ','
				
				w2ui['order_popup_options'].record.orderId = orderId;
				_.each(middleOptions, function(item){
					var amount = item.orderAmount;
					item.amount = Number(amount.replace(/[^\d]+/g, ''));
					item.order_id = orderId;
				});
				bottomTabOptions = w2ui['order_tabs_options'].record;
				var orderManager = bottomTabOptions.employeeNameId; //발주처 직원 ID
				var orderPayment = bottomTabOptions.payment; //지불 조건
				
				var deliveryTerm = bottomTabOptions.deliveryTerm;
				var note = bottomTabOptions.note;
				
				if(popupMode == "modifyMode"){
					var orderCompanyId = bottomTabOptions.orderTabsCompanyId;
					params = {
						order_id : orderId,
						supplier_site : supplyCompanyId,
						operator_site : operatorCompanyId,
						o_site_id : orderCompanyId,
						o_manager : orderManager,
						o_payment : orderPayment,
						o_delivery_term : deliveryTerm,
						status : status,
						o_status : orderStatus,
						o_note : note,
						user_id : userId,
						total_amount : totalAmount
					};
				}else{
					params = {
						order_id : orderId,
						supplier_site : supplyCompanyId,
						operator_site : operatorCompanyId,
						o_site_id : orderSiteId,
						o_manager : orderManager,
						o_payment : orderPayment,
						o_delivery_term : deliveryTerm,
						status : status,
						o_status : orderStatus,
						o_note : note,
						user_id : userId,
						total_amount : totalAmount,
						
						customer_site : estimateCompany,
						customer_id : clientID,
						estimate_id : estimateId,
						project_id : projectId
					};
				}
				orderManager, orderPayment, orderStatus, deliveryTerm, note = null;
				url = 'order/saveOrderData';
			}else if(currentTabId == "shipTab"){
				bottomTabOptions = w2ui['ship_tab_options'].records;
				var curOrderId = w2ui['order_popup_options'].record.orderId;
				var shippingComplete = $("#shipCheckComp").prop("checked");
				
				if(shippingComplete){
					shippingComplete = 1; // complete
					status = that.getOrderStatusList[3].value; // 상태 - 입항 (4)
				}else{
					shippingComplete = 2; // not complete
				}
				_.each(bottomTabOptions, function(item){
					item.order_id = curOrderId;
					item.s_complete = shippingComplete;
				});
				
				var compare = [];
				if(shippingComplete = 1){
					_.each(bottomTabOptions, function(item, idx){
						var obj = {};
						obj.order_id = curOrderId;
						obj.flight_no = item.flight_no.substring(0,item.flight_no.indexOf("/",0));
						obj.mawb = item.mawb.replace(/\-/g,'');
						obj.hawb = item.hawb;
						obj.key = obj.flight_no + obj.mawb + obj.hawb;
						compare[idx] = obj;
					});
					var compare = _.uniq(compare, "key");
				}
				
				middleOptions = {
						s_complete : shippingComplete,
						order_id : curOrderId,
						status : status,
						compare : compare
				};
				
				params = bottomTabOptions;
				url = 'order/saveShippingData';
			}else if(currentTabId == "incomeTab"){
				bottomTabOptions = w2ui['income_tab_options'].records;
				var orderId = w2ui['order_popup_options'].record.orderId;
				var incomeComplete = $("#incomeCheckComp").prop("checked");
				
				if(incomeComplete){
					incomeComplete = 1;
					status = that.getOrderStatusList[4].value; // 상태 - 통관
				}else{
					incomeComplete = 2;
				}
				_.each(bottomTabOptions, function(item){
					item.order_id = orderId;
					item.p_complete = incomeComplete;
					if(item.port_id == undefined){
						item.port_id = util.createUID();
					}
				});
				middleOptions = {
						p_complete : incomeComplete,
						order_id : orderId,
						status : status
				};
				params = bottomTabOptions;
				url = 'order/savePortData';
			}else if(currentTabId == "customsTab"){
				w2ui['customs_tabs_options'].save();
				bottomTabOptions = w2ui['customs_tabs_options'].records;
				var orderId = w2ui['order_popup_options'].record.orderId;
				var customsComplete = $("#customsCheckComp").prop("checked");
				var customsPrice = $("#dutyPrice").val();
				
				if(customsComplete){
					customsComplete = 1;
					status = that.getOrderStatusList[5].value; // 상태 - 배송
				}else{
					customsComplete = 2;
				}
				_.each(bottomTabOptions, function(item){
					item.order_id = orderId;
					item.c_complete = customsComplete;
					if(item.customs_id == undefined){
						item.customs_id = util.createUID();
					}
				});
				middleOptions = {
						c_complete : customsComplete,
						order_id : orderId,
						status : status,
						c_cost : customsPrice
				};
				params = bottomTabOptions;
				url = 'order/saveCustomsData';
			}else{
				bottomTabOptions = w2ui['delivery_tabs_options'].record;
				var orderId = w2ui['order_popup_options'].record.orderId;
				var deliveryComp = $("#deliveryCheckComp").prop("checked");
				if(deliveryComp){
					deliveryComp = 1;
				}else{
					deliveryComp = 2;
				}
				status = that.getOrderStatusList[5].value; // 상태 - 배송
				bottomTabOptions.status = status;
				bottomTabOptions.d_complete = deliveryComp;
				bottomTabOptions.order_id = orderId;
				params = bottomTabOptions;
				url = 'order/saveDeliveryData';
			}
			
			var saveOrderData = new Model();
			saveOrderData.set({
				params : params,
				product : middleOptions,
			});
			saveOrderData.url = url;
			saveOrderData.save(null, {
				success : function(model, response){
					var orderId = w2ui['order_popup_options'].record.orderId;
					ordMgr.getRefreshData(orderId); //Get All Popup Date
					ordMgr.getOrderData(); // Get All Order List Data
					ordMgr.getYearList();
					/*var checkMail = model.attributes.params.o_status;
					if(checkMail != undefined && checkMail == 1){ // Send Mail
						var changingParam = model.attributes.params;
						var status = changingParam.status;
						var mailStatus = changingParam.o_status;
						var status = that.getOrderStatusList[status - 1];
						var mailStatus = that.getMailStatusList[mailStatus - 1];
						w2ui['order_tabs_options'].record.orderTabStatusText = mailStatus.text;
						w2ui['order_tabs_options'].record.orderTabStatus = mailStatus.value;
						
						w2ui['order_tabs_options'].refresh();
						w2ui['order_popup_options'].refresh();
						w2ui['order_model_tabs_popup_options'].show('shipTab');
						w2ui['order_model_tabs_popup_options'].click("shipTab");
						$(".disableClass").css("display","block");
					}else{ //onlySave
						w2ui['order_model_tabs_popup_options'].click("orderTab");
					}else if(model.attributes.product != undefined){
						var shippingComplete = model.attributes.product.s_complete;
						if(shippingComplete == 1){
							w2ui['ship_tab_options'].refresh();
							w2ui['order_model_tabs_popup_options'].show('incomeTab');
							w2ui['order_model_tabs_popup_options'].click("incomeTab");
						}
					}
					if(ordMgr.selectedTab == "incomeTab"){
						orderId = model.attributes.params[0].order_id;
					}else{
						orderId = model.attributes.params.order_id; //order, ship
					}
					ordMgr.getRefreshData(orderId);*/
				}
			});
			
			bottomTabOptions, params, orderId, selectedEstimate, selectedSupply, selectedUsing, selectedOrder, 
			topOptions, estimateId, projectId, supplyCompanyId, operatorCompanyId, estimateCompany, clientID,
			status, orderSiteId, middleOptions, userId, currentTabId = null;
		},
		
		orderEditAction : function(){
			that.validationCheck();
        	if($("#orderEditBtn").prop("disable")){
        		return;
        	}
			that.popupMode = "modifyMode";
			var selectedData = w2ui['order_list'].get(w2ui['order_list'].getSelection());
			var selectedOrderId = selectedData[0].order_id;
			that.getSelectedOrderData(selectedOrderId);
		},
		
		orderDeleteAction : function(){
			that.validationCheck();
        	if($("#orderDelBtn").prop("disable")){
        		return;
        	}
			var selectedData = w2ui['order_list'].getSelection().length;
			var body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">' + selectedData + BundleResource.getString('label.symbolManager.selectedItemDelete') + '</div>'+
				'<div class="popup-btnGroup">'+
					'<button id="orderDelOk" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.symbolManager.confirm') + '</button>'+
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
		},
		
		orderDeleteOkAction : function(){
        	var selectedData = w2ui['order_list'].get(w2ui['order_list'].getSelection());
        	var orderId = _.pluck(selectedData, "order_id");
        	
        	var deleteOrderData = new Model();
        	deleteOrderData.set({
        		orderId : orderId
        	});
        	deleteOrderData.url = 'order/deleteOrderData';
        	deleteOrderData.save(null, {
				success : function(model, response){
					ordMgr.getOrderData();
					ordMgr.getYearList();
				}
			})
		},
		
		orderEmailAction : function(){
			var arr = w2ui['order_tabs_options'].validate();
			var arrTopOptions = w2ui['order_popup_options'].validate();
			if(arr.length > 0 || arrTopOptions.length > 0){
				return;
			}else{
		//		var param = {};
				that.orderSaveOkAction();
				var orderID = w2ui['order_popup_options'].record.orderId; 
			//	var mailUID = util.createUID();
			//	var fileName = w2ui['order_tabs_options'].record.orderFileName;
	//			param.orgName = fileName;
//				param.fileName = mailUID;
				itsmUtil.sendMailFunc(orderID, "발주");
			}
		},
		
		orderMailSuccessHanlder : function(event){ //gihwanmail
			var result = event.type;
			if(result == "mailSuccess"){
				that.orderSaveOkAction("mailOk");
			}
		},
		
		saveOrderResult : function(method, model, options){
			console.log(model);
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
		
		destroy : function(){
			
			ordMgr = null;
			
			if(w2ui['orderMgr_layout']){
				w2ui['orderMgr_layout'].destroy();
			}
			if(w2ui['order_search_options']){
				w2ui['order_search_options'].destroy();
			}
			if(w2ui['order_list']){
				w2ui['order_list'].destroy();
			}
			if(w2ui['order_estimate_popup_options']){
				w2ui['order_estimate_popup_options'].destroy();
			}
			if(w2ui["order_estimate_grid_popup_options"]){
				w2ui["order_estimate_grid_popup_options"].destroy();
			}
			if(w2ui["order_popup_options"]){
				w2ui["order_popup_options"].destroy();
			}
			if(w2ui["order_model_grid_popup_options"]){
				w2ui["order_model_grid_popup_options"].destroy();
			}
			if(w2ui["order_model_tabs_popup_options"]){
				w2ui["order_model_tabs_popup_options"].destroy();
			}
			if(w2ui['order_tabs_options']){
				w2ui['order_tabs_options'].destroy();
			}
			if(w2ui['ship_tab_options']){
				w2ui['ship_tab_options'].destroy();
			}
			if(w2ui['income_tab_options']){
				w2ui['income_tab_options'].destroy();
			}
			if(w2ui['customs_tabs_options']){
				w2ui['customs_tabs_options'].destroy();
			}
			if(w2ui['delivery_tabs_options']){
				w2ui['delivery_tabs_options'].destroy();
			}
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
			that = null;
		}
		
	});
	return Main;
});