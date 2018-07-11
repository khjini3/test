define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/report/report",
    "text!views/report/reportAddPopup",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/report/report",
    "css!plugins/font-awesome/css/font-awesome.min",
],function(
	$,
	_,
	Backbone,
	JSP,
	AddPopup,
	W2ui,
	BundleResource
){
	$(window.document).on("contextmenu", function(event){return false;});
	var that;
	var startHourMin;
	var Model = Backbone.Model.extend({
        //model: Model,
        url: "report",
        parse: function(result) {
            return {data: result};
        }
    });	
	
	//report condition xml model
	var ReportConditionModel = Backbone.Model.extend({
		urlRoot : "report/condition"
	});
		
	//report history model
	var HistoryModel = Backbone.Model.extend({
		url: "report/history",
		parse: function(result) {
			return {data:result};
		}
	});
	//report history search model
	var HistorySearchModel = Backbone.Model.extend({
		url: "report/history",
		parse: function(result) {
			return {data:result};
		}
	});
	//report download model
	var ReporDownModel = Backbone.Model.extend({
		urlRoot : "report/reportdown"
	});
	var delay;	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.reportType = [];
			this.reportCombo = [];
			this.reportTimeList = [];
			this.reportCondition = null;
			this.reportParam = null;
			this.today = null;
			this.time = null;
			this.init();
			//this.start();
			
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
        	'click #reportAddBtn' : 'addPopup',
        	'click #reportEditBtn' : 'editPopup',
        	'dblclick #leftBottom .w2ui-grid-data'  : 'editPopup',
        	'click #reportDeleteBtn' : 'deleteReport',
        	'click #leftBottom .w2ui-grid-data'  : 'clickCheck',
        	'click #reportAllHistoryBtn' : 'searchAllHistory',
        	'click #reportHistoryRefreshBtn' : 'refreshHistory',
    		'click #reportSearchBtn' : 'searchHistory',
    		'click .report-history-down-btn' : 'downloadReport',
    		'click .report-state': 'changeState',
    		'click .report-history-preview-btn' : 'historyPopup'
        },
		
        checkBtnValidate : function(){
        	if(w2ui['report_list_table'].getSelection().length > 0){
        		if(w2ui['report_list_table'].getSelection().length > 1){ // 다중 선택
        			$("#reportEditBtn").prop('disabled', true);
    				$("#reportEditBtn").removeClass('link');
        		}else{ // 단일 선택
        			$("#reportEditBtn").prop('disabled', false);
    				$("#reportEditBtn").addClass('link');
        		}
				$("#reportDeleteBtn").prop('disabled', false);
				$("#reportDeleteBtn").addClass('link');
			}else{
				$("#reportDeleteBtn").prop('disabled', true);
				$("#reportDeleteBtn").removeClass('link');
				$("#reportEditBtn").prop('disabled', true);
				$("#reportEditBtn").removeClass('link');
			}
        },
        
		eventListenerRegister : function(){ //add / edit / delete OKBtn
			$(document).on("click", "#reportPopupSaveExecuteBtn", this.reportPopupSaveExecuteBtn);
			$(document).on("click", "#reportPopupDeleteOkBtn", this.deleteExcute);
		},
		
		init : function(){
			reportMgr = this;
			
			this.today = util.getDate("Day") + " 00:00:00";
    		this.time = util.getDate("Day") + " 23:59:59";
    		
			$("#contentsDiv").w2layout({
				name : 'report_layout',
				panels : [
					{type:'left', size:'50%', resizable: true, content:'<div id="leftContents"></div>'},
        			{type:'main', size:'50%', content:'<div id="rightContents"></div>'}
				]
			});
			
			var leftContents = '<div id="leftTop" style="height:35px">'+
				'<div id="reportLeftBtnGroup" style="padding-top:2px;">'+
					'<i id="reportAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					'<i id="reportDeleteBtn" class="icon fas fa-trash-alt fa-2x" aria-hidden="true" title="Delete" disabled="disabled"></i>'+
					'<i id="reportEditBtn" class="icon fas fa-edit fa-2x" aria-hidden="true" title="Edit" disabled="disabled"></i>'+
				'</div>'+
			'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Report List</div>'+
	    		'<div id="leftComboList">'+
	    			'<div class="w2ui-field">'+
	    				'<input name="leftCombo" type="list" size="25"/>'+
	    			'</div>'+
	    		'</div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="leftBottom">'+
	    			'</div>'+
	    		'</div>'+
	    	'</div>';
			
			var rightContents = '<div id="rightTop" style="height:35px">'+
				'<div id="reportRightBtnGroup">'+
					'<i id="reportAllHistoryBtn" class="icon link fab fa-all_history fa-2x" aria-hidden="true" title="All History"></i>'+
				'</div>'+
			'</div>'+
        	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">History List</div>'+
	    		'<div id="rightDateBox" >'+
	    			'<div class="w2ui-field">'+
	    				'<input name="rightFromDateBox" size="20" style="float:left;margin-right:6px"/>'+
	    			'</div>'+
	    			'<div class="w2ui-field">'+
	    				'<input name="rightToDateBox" size="20" style="float:left;"/>'+
	    			'</div>'+
	    			'<i id="reportSearchBtn" class="icon link fas fa-search fa-2x" aria-hidden="true" title="Search"></i>'+
	    		'</div>'+
	    		'<div class="dashboard-contents">'+
	    			'<div id="rightBottom"></div>'+
	    			'<div class="pager-table-area" id="reportHistPagerTable">'+
						'<div class="report-history-pager" id="reportHistPager" data-paging="true"></div>'+
					'</div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#leftContents").html(leftContents);
			$("#rightContents").html(rightContents);
			
			$("#leftBottom").w2grid({
				name : 'report_list_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
					{ field: 'report_type', caption: 'TYPE', size : '50%', sortable: true, attr: 'align=left', style:'padding-left:5px;',
						render : function(record){
							return reportMgr.reportType[parseInt(record.report_type)].text;
						}},
         			{ field: 'report_title', caption: 'TITLE', size : '50%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'schedule_start', caption: 'START TIME', size : '150px', sortable: true, attr: 'align=center',
         				render : function(record){
                    		if(record.schedule_start != null){
                    			return record.schedule_start.slice(0,-5);	
                    		}
                    		return "";
                    	}},
         			{ field: 'schedule_end', caption: 'END TIME', size : '150px', sortable: true, attr: 'align=center',
                		render : function(record){
                    		if(record.schedule_start != null){
                    			return record.schedule_end.slice(0,-5);	
                    		}
                    		return "";
                    	}},
         			{ field: 'scheduling', caption: 'SCHEDULING', size : '100px', sortable: true, attr: 'align=center' ,
                		render : function(record){
                    		var record = record.scheduling;
                    		
                    		if(record == -1){
//                    			return '<div class="report-none report-scheduling-icon">None</div>';
                    			return util.getDivIcon('None');
                    		}else if(record == 0){
//                    			return '<div class="report-hour report-scheduling-icon">Hour</div>';
                    			return util.getDivIcon('Hour');
                    		}else if(record == 1){
//                    			return '<div class="report-day report-scheduling-icon">Day</div>';
                    			return util.getDivIcon('Day');
                    		}else if(record == 2){
//                    			return '<div class="report-week report-scheduling-icon">Week</div>';
                    			return util.getDivIcon('Week');
                    		}else if(record == 3){
//                    			return '<div class="report-month report-scheduling-icon">Month</div>';
                    			return util.getDivIcon('Month');
                    		}
                    		return "";
                    	}},
         			{ field: 'report_view', caption: 'STATUS', size : '100px', sortable: true, attr: 'align=center',
                		render : function(record){
                    		if(record.scheduling == -1){//scheduling == None(-1)
                    			return "-";
                    		}
                    		if(record.report_view == 1){//ing
                    			return '<div style="padding:1px; margin-top: 4px; margin-bottom:3px;margin-left: 11px;"><i class="icon link fab fa-status_stop report-stop report-state" style="width:2.5em;" reportid='+record.report_id+'></i></div>';	
                    		}else if(record.report_view == 0){//stop
                    			return '<div style="padding:1px; margin-top: 4px; margin-bottom:3px;margin-left: 11px;"><i class="icon link fab fa-status_play fa-2x report-running report-state" style="width:2.5em;" reportid='+record.report_id+'></i></div>';
                    		}
                			return "-";
                    	}
         			}
				],
				onSelect : function(event){
					event.onComplete = function(){
						var selectedData = w2ui['report_list_table'].get(w2ui['report_list_table'].getSelection());
						var startRow = 1;
						var endRow = 22;
						if(selectedData != null){
							var reportId = selectedData[0].report_id;
						}
						reportMgr.reportParam = {"startRow" : startRow, "endRow" : endRow, "report_id" : reportId};
						this.historymodel = new HistoryModel();
			        	this.historymodel.set(reportMgr.reportParam);
			        	this.historymodel.url = this.historymodel.url + "/limitList"; 
						this.historymodel.save();
						reportMgr.listenTo(this.historymodel, "sync", reportMgr.changeHistoryData);
						selectedData = null;
						reportId = null;
					}
				}
			});
			
			$("#leftComboList").w2form({
				name : 'report_left_combo_list',
				focus : -1,
				fields : [
					{name : 'leftCombo', type : 'list', options : {items : reportMgr.reportCombo}},
				],
				record : {
					leftCombo : reportMgr.reportCombo[0],
				},
				onChange : function(event){
					var selectedData = event.value_new.id;
					
					this.model = new Model();
	        		this.model.url = this.model.url + "/"+ Number(selectedData-1);
	            	this.model.fetch();
	            	reportMgr.listenTo(this.model, "sync", reportMgr.setData);
				}
			});
			
			w2ui["report_list_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.checkBtnValidate();
        	});
        	
        	w2ui["report_list_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.checkBtnValidate();
        	});
        	
        	w2ui["report_list_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.checkBtnValidate();
        	});
			
			$("#rightBottom").w2grid({
				name : 'history_list_table',
				style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
				show : {
					footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '50px', sortable: true, attr: 'align=center'},
         			{ field: 'report_name', caption: 'TITLE', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'run_date', caption: 'RUN DATE', size : '150px', sortable: true, attr: 'align=center',
         				render: function(data){
                		   if(data.run_date != null){
                			   return data.run_date.slice(0,-3);
                		   }
                		   return "";
                	   }},
//         			{ field: 'message', caption: 'DOWNLOAD', size : '100px', sortable: true, attr: 'align=center',
//            		   render : function(data){
//  	            			return '<div style="padding:1px; margin-top: 2px; margin-bottom:3px;"><i class="icon link fab fa-download fa-lg grid-buttons download-btn report-history-down-btn" historyid='+data.history_id+'></i></div>';
//  	                	}},
         			{ field: 'message', caption: 'PREVIEW', size : '100px', sortable: true, attr: 'align=center',
                		render : function(data){
	                		   var html;
	                		   if(data.reserve_str == 0){//pdf
	                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon link fab fa-preview fa-2x preview-btn report-history-preview-btn" historyid='+data.history_id+'></i></div>';	   			   	
	                		   }else{
	                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon fab fa-preview fa-2x  preview-btn  disabled" style="cursor: default;" historyid='+data.history_id+' ></i></div>';
	                		   }
	                		return html;
	                	}}
				]
			});
			
			$("#rightDateBox").w2form({
				name : 'report_right_date_box',
				focus : -1,
				fields : [
					{name : 'rightFromDateBox', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}},
					{name : 'rightToDateBox', type : 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}}
				],
				record : {
					rightFromDateBox : this.today,
					rightToDateBox : this.time
				},
			});
			this.eventListenerRegister();
			this.searchCondition();
			this.searchAllHistory();
		},
		
		searchCondition : function(){
			this.conditionModel = new ReportConditionModel();
    		this.conditionModel.fetch();
    		this.listenTo(this.conditionModel, "sync", this.setCondition);
		},
		
		showRowHistory : function(evt){
			var data = w2ui['report_list_table'].get(w2ui['report_list_table'].getSelection())[0];
        	var reportid = null;
        	var startRow = 1;
        	var endRow = 22;
        	if(data != null){
        		reportid = data.report_id;  		
        	}
        	$(".report-history-on").removeClass('report-history-on');
        	
        	this.historymodel = new HistoryModel();
        	this.historymodel.set({"startRow" : startRow, "endRow" : endRow, "report_id" : reportid});
        	this.historymodel.url = this.historymodel.url + "/limitList"; 
			this.historymodel.save();
			this.listenTo(this.historymodel, "sync", this.changeHistoryData);
        },
		
		searchAllHistory : function(){
			var startRow = 1;
    		var endRow = 22;   
			this.historymodel = new HistoryModel();
			reportMgr.reportParam = {"startRow" : startRow, "endRow" : endRow}
			this.historymodel.set(reportMgr.reportParam);
			this.historymodel.url = this.historymodel.url + "/limitList"; //get all history
			this.historymodel.save();
			reportMgr.listenTo(this.historymodel, "sync", reportMgr.historyAllSetData);
		},
		
		setCondition : function(responseData){
			this.reportCondition = responseData.toJSON().report;
			this.reportCombo.push({text : "ALL", id : 0});
			
			$.each(this.reportCondition, function (idx, item) {
				that.reportType.push({text : item.label, id : idx+1});
				that.reportCombo.push({text : item.label, id : idx+1});
			});
			
			$.each(this.reportCondition[0].reportlist.data[0].data, function (idx, item){
				that.reportTimeList.push({text : item.name, id : idx+1, value : item.value});
			});
			w2ui['report_left_combo_list'].set('leftCombo', {options:{items:reportMgr.reportCombo}});
			
			this.model = new Model();
    		this.model.fetch();//get all report list
    		this.listenTo(this.model, "sync", this.setData);
		},
						
		setData: function(model){
        	var reportList = model.attributes.data;
        	w2ui['report_list_table'].clear();
			w2ui['report_list_table'].records = reportList;
			w2ui['report_list_table'].refresh();
        },
        
        getReport : function(report_id){
        	//get report with combobox value
        	this.model = new Model();
        	this.model.url = this.model.url+"/"+report_id;
        	this.model.fetch();
        	this.listenTo(this.model, "sync", this.setData);
        	
        },
        
        historyAllSetData : function(historyModel){
        	var historyAllData = historyModel.attributes.data.data.data;
        	var totalCnt = historyModel.attributes.data.noOffsetRecord;
        	this.pageInitFunc(historyAllData, totalCnt);
        },
        
		searchHistory : function(){
        	var startRow = 1;
        	var endRow = 22;
        	var time = w2ui['report_right_date_box'].record;
        	/*if($("#searchFromDate").val() == "" || $("#searchToDate").val() == "" || $("#searchFromDate").val() > $("#searchToDate").val()){
        		_this.alertPopup('label.report.period_error', 'Information');
        		return;
        	}*/
        	var reportid = null
        	var data = w2ui['report_list_table'].get(w2ui['report_list_table'].getSelection())[0];
        	if(data != null){
        		reportid = data.report_id;
        	}
        	reportMgr.reportParam = {
        		"schedule_start" : time.rightFromDateBox,
        		"schedule_end" : time.rightToDateBox,
        		"report_id" : reportid,
        		"startRow" : startRow,
        		"endRow" : endRow
    		};
        	this.historymodel = new HistoryModel();
        	this.historymodel.url = this.historymodel.url + "/limitList"; 
        	this.historymodel.set(reportMgr.reportParam);
        	this.historymodel.save();
        	reportMgr.listenTo(this.historymodel, "sync", reportMgr.changeHistoryData);
        },
        
        changeHistoryData : function(response){
        	var resultData = response.attributes.data.data.data;
        	var totalCnt = response.attributes.data.noOffsetRecord;
        	this.pageInitFunc(resultData, totalCnt);
        },
        
        clickCheck : function(event){
        	var _this = this;
        	var data = w2ui['report_list_table'].get(w2ui['report_list_table'].getSelection())[0];
        	if(data != null){        		
        		var check = util.compare(data.recid , delay);
        		if(check == false){
        			_this.showRowHistory(event);
        		} 
        		delay = data.recid;
        	}
        },
        
        pageInitFunc : function(historyData, totalCount){
        	var dataLen = historyData.length;

        	if($('#reportHistPager').data("twbs-pagination")){
        		$('#reportHistPager').pager("destroy").off("click");
        		var pageGroup = '<div class="report-history-pager" id="reportHistPager" data-paging="true"></div></div>';
        		$("#reportHistPagerTable").html(pageGroup);
        	}

        	$('#reportHistPager').pager({
        		"totalCount" : totalCount,
        		"pagePerRow" : 22
        	}).on("click", function (event, page) {
        		var evtClass = $(event.target).attr('class');
        		if(evtClass != 'page-link') return;

        		var pagination = $('#reportHistPager').data('twbsPagination');
        		var currentPage = pagination.getCurrentPage();
        		var requestParam = reportMgr.reportParam;

        		var report_id = requestParam.report_id;
        		var schedule_start = requestParam.schedule_start;
        		var schedule_end = requestParam.schedule_end;

        		if(report_id == undefined){
        			report_id = null;
        		}
        		if(schedule_start == undefined){
        			schedule_start = null;
        		}
        		if(schedule_end == undefined){
        			schedule_end = null;

        		}
        		var endRow = 22;
        		//var startRow = (currentPage*endRow) - endRow;

        		this.historymodel = new HistoryModel();
        		this.historymodel.url = this.historymodel.url + "/limitList"; 
        		this.historymodel.set({
        			"endRow" : endRow,
        			"startRow" : currentPage,
        			"report_id" : report_id,
        			"schedule_start" : schedule_start,
        			"schedule_end" : schedule_end
        		});
        		this.historymodel.save();
        		reportMgr.listenTo(this.historymodel, "sync", reportMgr.refreshView);
        	});
        	var pagination = $('#reportHistPager').data('twbsPagination');
        	var currentPage = pagination.getCurrentPage();

        	$('#reportHistPager').pager('pagerTableCSS', ".report-history-pager .pagination", totalCount, currentPage);


        	w2ui['history_list_table'].clear();
        	w2ui['history_list_table'].records = historyData;
        	w2ui['history_list_table'].refresh();

        },
        
        refreshView : function(responseData){
        	var historyData = responseData.attributes.data.data.data;
        	w2ui['history_list_table'].clear();
        	w2ui['history_list_table'].records = historyData;
        	w2ui['history_list_table'].refresh();
        },
        downloadReport : function(evt){
     		var historyid = $(evt.target).attr('historyid');
     		var selectedData = w2ui['history_list_table'].get(w2ui['history_list_table'].getSelection())[0];
     		var request = selectedData.message;
     		this.download(request);
        },
        download : function( request ){
        	w2ui['history_list_table'].selectNone();
        	
        	var cookie="fileDownload"+new Date().getTime();
       		
       		var form = $("<form></form>").attr({
       			"action" : "report/reportdown",
       			"method" : "POST",
       			"target" : "fr",
       			"contentType" : "application/json; charset=UTF-8"
       		}).appendTo("body");
			
       		var path = $("<input/>").css("display","none").attr({
       			"name" : "path",
       			"type" : "hidden"
//       		}).appendTo(form).val(selectedMessage);
       		}).appendTo(form).val(request);
       		
       		var cookieinput = $("<input/>").css("display","none").attr({
       			"name" : "cookie",
       			"type" : "hidden"
       		}).appendTo(form).val(cookie);
       		
       		var iframe = $("<iframe></iframe>").css("display","none").appendTo("body");
       		iframe.attr("name","fr").appendTo(form);       		
       		
       		form.submit(function (event){
       			event.preventDefault();
       			try{
       				this.submit();
       			}catch(e){
       				
       			}
       			setTimeout(function(){
       				iframe.empty();
	   				iframe.remove();
	   				iframe = null;
	   				
	   				form.empty();
	   				form.remove();
	   				form = null;
       			}, 5000);
       		});
       		form.submit();
        },
        
        historyPopup : function(){
        	var selectedPreData = w2ui['history_list_table'].get(w2ui['history_list_table'].getSelection())[0];
        	var selectedPreHistoryId = selectedPreData.history_id;
        	w2ui['history_list_table'].selectNone();
			 
            var strWinStyle   = "width=800 height=800 toolbar=no menubar=no location=no scrollbars=no resizable=no fullscreen=no ";
            var popup = window.open("report/previewReport/"+selectedPreHistoryId, 'popup', strWinStyle);
        },
        
        changeState : function(){
       		var data = w2ui['report_list_table'].get(w2ui['report_list_table'].getSelection())[0];
        	w2ui['report_list_table'].selectNone();
        	
       		var report_view = "";
       		if(data.report_view == 0){//stop(0)->running(1)
       			data.report_view = 1;
       		}else{//running -> stop
       			data.report_view = 0;
       		}
       		this.model = new Model();
       		this.model.url = this.model.url + "/change";
       		this.model.set({
    			id : data.report_id,
    			parent_id : data.parent_id,
    			report_title : data.report_title,
        		report_id : data.report_id,
        		report_view : data.report_view,
        		report_type : data.report_type,
        		report_sub_type : data.report_sub_type,
        		mybatis_id : data.mybatis_id,
        		scheduling : data.scheduling,
        		schedule_start : data.schedule_start,
        		schedule_end : data.schedule_end,
        		conditions : data.conditions,
        		ui_setting : data.ui_setting,
        		ui_value : data.ui_value,
        		cron_expression : data.cron_expression,
        		export_type: data.export_type
    		});
    		
    		this.model.save(null, {
	              success: function(response) {
	            	  
	            	  w2ui['report_list_table'].refresh();
	              },
	              error: function(response) {
	            	_this.alertPopup('label.report.state_change_fail', "Information"); 
	              }
	          });
        },
        
        reportPopupSaveExecuteBtn: function(){
        	var arr = 0;
        	var reportItem ='';
        	if($(this).attr('name') == 'editSave' || $(this).attr('name') == 'editExcute'){
        		arr = w2ui["report_edit_popup_properties"].validate();
        		reportItem = w2ui["report_edit_popup_properties"].record;
        	}else if($(this).attr('name') == 'save' || $(this).attr('name') == 'excute'){
        		arr = w2ui["report_add_popup_properties"].validate();
        		reportItem = w2ui["report_add_popup_properties"].record;
        	}
        	if(arr.length > 0){
        		return;
        	}else{        		
        		if(($("#storageCycle").val() == "" || $("#storageCycle").val() < 1 )){
            		w2popup.message({ 
            	        width   : 360, 
            	        height  : 200,
            	        html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + 'STORAGE CYCLE의 ' + BundleResource.getString('label.report.storage_range_error') + '</div>'+
            	                  '<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            	    });
        			return;
            	}
        		
        		var divs = '';
        		var conditionCount = '';
        		var conditionTexts = "";
        		var conditionText="";
        		var columnLabels = '';
        		var isValid = true;
        		var type = "";
        		var count = 0;
        		var timevalue = "";
        		var ui_setting = "";
        		var summary = "";
        		
        		if($(this).attr('name') == 'editSave' || $(this).attr('name') == 'editExcute'){
        			divs = $("#reportEditPopupContents").find(".report-setting-row");
        			conditionCount = divs.length;
        			columnLabels = $("#reportEditPopupContents").find("label.columnLabel");
        		}else if($(this).attr('name') == 'save' || $(this).attr('name') == 'excute'){
        			divs = $("#reportAddPopupContents").find(".report-setting-row");
        			conditionCount = divs.length;
        			columnLabels = $("#reportAddPopupContents").find("label.columnLabel");
				}
        		
        		var errorMsg = "";
        		for(var i=0; i<conditionCount;i++){
        			type = $(columnLabels[i]).attr('type');
        			if(i < conditionCount - 1){
        				conditionText += $(columnLabels[i]).attr('name');
        				if(type == "radio" || type == "checkbox"){
        					count = $(divs[i]).find('input[type='+type+']:checked').length;
        					if(count == 0){
        						isValid = false;
        						errorMsg = $(columnLabels[i]).text();
        						break;
        					}else if(count == 1){//selected 1
        						if($(columnLabels[i]).attr('columntype') == 'String'){
        							conditionText += "='"+$(divs[i]).find('input[type='+type+']:checked')[0].value+"'";
        						}else{
        							conditionText += "="+$(divs[i]).find('input[type='+type+']:checked')[0].value;	
        						}
        					}else{//selected more than 2
        						conditionText += " in (";
        						if($(columnLabels[i]).attr('columntype') == 'String'){
        							$(divs[i]).find('input[type='+type+']:checked').each(function(){
        								conditionText += "'"+this.value+"',"
        							});
        						}else{
        							$(divs[i]).find('input[type='+type+']:checked').each(function(){
        								conditionText += this.value+","
        							});
        						}	
        						
        						conditionText = conditionText.substring(0,conditionText.length-1);
        						conditionText +=")";
        					}
        					$(divs[i]).find('input[type='+type+']:not(:checked)').each(function(){
        						$(this).attr('checked',false);
        					});
        					$(divs[i]).find('input[type='+type+']:checked').attr('checked',true);
        				}else{ // list
        					var combo = $("#inputList"+conditionText);
        					if($(columnLabels[i]).attr('columntype') == 'int'){//string
        						conditionText += "="+combo[0].value;
        					}else if($(columnLabels[i]).attr('columntype') == 'time'){
//	        				timevalue = combo[0].value;
        						timevalue = $("#inputList"+conditionText).data('selected').value;
        						conditionText += " BETWEEN date_format(now()-interval " + timevalue + " hour, '%Y-%m-%d %H:00:00') and date_format(now(), '%Y-%m-%d %H:00:00')";
        						
        					}else {
        						conditionText += "='"+$("#inputList"+conditionText).data('selected').value+"'";
        					}	
        				}
        				if (conditionText && conditionText != '') {
    	        			conditionTexts += conditionText+" and ";
    	        		}
        				conditionText = "";
        			}else{
        				count = $(divs[i]).find('input[type='+type+']:checked').length;
        				if(count == 0){
        					isValid = false;
        					errorMsg = $(columnLabels[i]).text();
        					break;
        				}else if(count >= 1){//selected more than 1
        					summary = $(divs[i]).find('input[type='+type+']:checked')[0].value;
        				}
        				$(divs[i]).find('input[type='+type+']:not(:checked)').each(function(){
        					$(this).attr('checked',false);
        				});
        				$(divs[i]).find('input[type='+type+']:checked').attr('checked',true);
        			}
        			ui_setting += '<div class="w2ui-field settingItem report-setting-row">' + $(divs[i]).html() +'</div>';
        		}		
        		conditionTexts = conditionTexts.substring(0,conditionTexts.length-4);
        		
        		// scheduling
        		var schedulingValue = '';
        		if($(this).attr('name') == 'editSave' || $(this).attr('name') == 'editExcute'){
        			schedulingValue = $("#reportEditPopupContents").find('input[name=repeat]:checked').val();
        		}else if($(this).attr('name') == 'save' || $(this).attr('name') == 'excute'){
        			schedulingValue = $("#reportAddPopupContents").find('input[name=repeat]:checked').val();		
				}
        		var schedulingstartHM = reportItem.startAt;
        		var startHM = schedulingstartHM.split(':');
            	var cronString = "0 ";
            	var startHour = startHM[0];
            	var startMin = startHM[1];

            	cronString +=startMin+" "+startHour;
            	if(schedulingValue == 0 && ($("#repeatHoursArea").val() < 1 || $("#repeatHoursArea").val() >= 24)){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.hour_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
            		return false;
            	}
            	if(schedulingValue == 1 && ($("#repeatDaysArea").val() < 1 || $("#repeatDaysArea").val() > 31)){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.day_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
        			return false;
            	}
            	if(schedulingValue == 2 && $("#repeatWeeks").find("input[type=checkbox]:checked").length == 0){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.week_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
            		return false;
            	}
            	if(schedulingValue == 3 && ($("#repeatMonthsOfDay").val() < 1 || $("#repeatMonthsOfDay").val() > 31)){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.day_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
        			return false;
            	}
            	if(schedulingValue == 3 && ($("#repeatMonthsOfMonth").val() < 1 || $("#repeatMonthsOfMonth").val() > 12)){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.month_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
        			return false;
            	}
            	if(schedulingValue == 3 && $("#repeatDayText").val() == ''){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.day_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
        			return false;
            	}
            	if(schedulingValue == 0){//hour //(startHour == 0? "" :"-"+($("#startTimeHour").val()-1))
            		cronString += "/"+$("#repeatHoursArea").val()+" * * ? *";
            	}else if(schedulingValue == 1){//day 0 0 12 */3 * ? *
            		cronString += " */"+$("#repeatDaysArea").val()+" * ? *";
            	}else if(schedulingValue == 2){//week 0 0 12 ? * MON,FRI,SAT *
            		cronString += " ? * ";
            		$("#repeatWeeks").find("input[type=checkbox]:checked").each(function(){
            			cronString +=$(this).val()+",";
            		});
            		cronString = cronString.substring(0,cronString.length-1);
            		cronString += " *";
            	}else if(schedulingValue == 3){//month
            		cronString += " "+$("#repeatMonthsOfMonth").val()+" 1/"+$("#repeatMonthsOfDay").val()+" ? * ";
            	}
            	if($(this).attr('name') == 'save' && ($("#storageCycle").val() == "" || $("#storageCycle").val() < 1 )){
            		w2popup.message({ 
            			width   : 360, 
            			height  : 200,
            			html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.storage_range_error') + '</div>'+
            			'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
            		});
            		return false;
            	}

        		//check , radio value   noPeriod
        		var export_type = '';
        		if($(this).attr('name') == 'editSave' || $(this).attr('name') == 'editExcute'){
        			export_type = $("#reportEditPopupContents").find('input[name=exportType]:checked').val();
        		}else if($(this).attr('name') == 'save' || $(this).attr('name') == 'excute'){
        			export_type = $("#reportAddPopupContents").find('input[name=exportType]:checked').val();
        		}
        		var noPeriod = $("#noPeriod").prop("checked");
        		if(noPeriod){
        			reportItem.startTime = null;
            		reportItem.endTime = null;
            	}
        		
        		var report_id= "";
        		var report_type = $('#type').data('selected').id -1;
    			var report_sub_type = that.reportCondition[report_type].template;
    			var query = that.reportCondition[report_type].query;
        		var editData ='';
        		if($(this).attr('name') == 'editSave'){
        			editData = w2ui["report_list_table"].get(w2ui["report_list_table"].getSelection())[0];
        			report_id = editData.report_id;
        		}else{        			
        			report_id = "";
        		}
        		
        		if($(this).attr('name') == 'save' || $(this).attr('name') == 'editSave'){        			
        			that.model = new Model();
        			that.model.set({
        				report_title: reportItem.title,
        				parent_id : 0,
        				report_id : report_id,
        				report_type : report_type,
        				report_sub_type : report_sub_type,
        				report_view : reportItem.repeatDiv == -1 ? -1 : 1,
        						mybatis_id : query,
        						scheduling : schedulingValue,
        						schedule_start : reportItem.startTime,
        						schedule_end : reportItem.endTime,
        						conditions : conditionTexts,
        						ui_setting : ui_setting,
        						ui_value : timevalue,
        						cron_expression : cronString,
        						period_last : $("#storageCycle").val(),
        						destination_name : summary,
        						export_type: export_type
        			});
        			
        			if($(this).attr('name') == 'editSave'){
        				that.model.set({
            				id : editData.report_id
            			});
            		}
        			
        			that.model.save(null, {
        				success: function(model, response) {
        					that.getReport($('#leftCombo').w2field().get().id-1);
        					w2ui["report_list_table"].selectNone();
        					
        				},
        				error: function(model, response) {
        				}
        			});
        			w2popup.close();
        		}else{
        			var download = new ReporDownModel();
               		
               		download.fetch({
            			data : {
            				title: reportItem.title,
                    		parent_id: 0,
                    		report_type : report_type,
                    		report_sub_type: report_sub_type,
                    		query: query,
                    		condition : conditionTexts,
                    		destination_name : summary,
                    		export_type: export_type
            			},
                		success: function (response) {
                			if(response.toJSON() != null ){if(response.toJSON().message == null){
                				w2popup.message({ 
                					width   : 360, 
                					height  : 200,
                					html    : '<div style="padding: 60px; text-align: center; color:#ffffff;">' + BundleResource.getString('label.report.nodata') + '</div>'+
                					'<div style="text-align: center"><button class="darkButton" onclick="w2popup.message()">' + BundleResource.getString('button.report.confirm') + '</button>'
                				});
                				return;
                			}
        					that.download( response.toJSON().message );}
                			w2ui["report_list_table"].selectNone();
            				w2popup.close();
                		}
                	});
        		}
        		
        	}

        },
                
        makeSetting : function(event){
        	// type changne
        	if(event.target == 'type'){
        		var _this = this;

        		var reportData = that.conditionModel.toJSON().report[event.value_new.id -1];
        		if(reportData.reportlist == null){
        			$('#reportAddPopupContents').find('.settingItem').remove();
        			return;
        		}
        		var settingCount = reportData.reportlist.data.length;
        		var count = 0;
        		var settingData;
        		var w2Combo=[];
        		var html='';
        		var listcheck;
        		for(var i=0; i<settingCount; i++){
        			$('#reportAddPopupContents').find('.settingItem').remove();
        			settingData = reportData.reportlist.data[i];
        			count = settingData.data.length;
        			
        			var div = document.createElement("div");
        			$(div).attr("class","w2ui-field settingItem report-setting-row");
        			var columnLabel = document.createElement("label");
        			$(columnLabel).text(settingData.label)
        			.attr({ 
        				"class":"columnLabel",
        				"name":settingData.column,
        				"type":settingData.type,
        				"columntype":settingData.columntype
        			});
        			$(div).append(columnLabel);
        			var div2 = document.createElement("div");
        			$(div2).attr("class","w2ui-field");
        			if(settingData.type != "combo"){        				
        				$(div2).css("margin-left","144px");
        			}
        			$(div).append(div2);
        			
        			if(settingData.type == "combo"){
        				var input = document.createElement("input");
        				var hiddenDiv = document.createElement("div");
        				$(input).attr({"type" : 'list', "name" : settingData.column, "size" : '62', "columntype":"time", "id" : 'inputList'+settingData.column , "class" : 'w2ui-input'});
        				$(hiddenDiv).attr({"id" : 'hiddenDiv'});
        				$(div2).append(input);
        				listcheck = settingData.column;
        				$.each(settingData.data, function (idx, item) {
        					w2Combo.push({text : item.name, value : item.value});
        					$(hiddenDiv).append("<option value='" + item.value + "'>" + item.name + "</option>");
        				});
        				$(hiddenDiv).css("display","none");
        				$(div2).append(hiddenDiv);
        			}else if(settingData.type == "radio" || settingData.type == "checkbox"){
        				for(var j=0; j<count;j++){
        					var input = document.createElement("input");
        					if(j == 0){        					
        						$(input).attr({"type" : settingData.type, "checked" : "checked", "name" : settingData.column, "value" : settingData.data[j].value, "size" : '62', "class" : 'w2ui-input'});
        					}else{
        						$(input).attr({"type" : settingData.type, "name" : settingData.column, "value" : settingData.data[j].value, "size" : '62', "class" : 'w2ui-input'});
        					}
        					var label1 = document.createElement("label");
        					$(label1).attr("class","radioChecking");
        					var label2 = document.createElement("label");
        					$(label2).append(settingData.data[j].name);
        					
        					$(label1).append(input);
        					$(label1).append(label2);
        					$(div2).append(label1);
        				}	
        			}else if(settingData.type == "text"){
        				var input = document.createElement("input");
        				$(input).attr({"type" : settingData.type, "name" : settingData.column, "size" : '62', "class" : 'w2ui-input'});
        				
        				$(div2).append(input);
        			}
        			
        			html += $(div).clone().wrapAll("<div/>").parent().html();
        			$('#reportAddPopupContents').find('#afterItem').after(html); 
        			
        			$('#inputList'+listcheck+':input[type=list]').w2field('list', { 
        				items: w2Combo, 
        				selected:w2Combo[0]
        			});
        		}	        
        	}else{
        		return;
        	}
        },
                
        noPeriodChecked: function(noPeriod){
        	if(true == noPeriod){
				$('#startTime').prop('disabled', true);
				$('#endTime').prop('disabled', true);
			}else{
				$('#startTime').prop('disabled', false);
				$('#endTime').prop('disabled', false);
			}
        },
        
        popupCheck: function(){
        	var data = w2ui["report_list_table"].get(w2ui["report_list_table"].getSelection())[0];
        	var cron_arr = data.cron_expression.split(" ");
        	var scheduling = data.scheduling;
        	var startHour = cron_arr[2];
        	
        	$("#repeatDiv").find("input[type=radio][value="+data.scheduling+"]")[0].checked = true;
        	if(scheduling == -1){//none

        	}else if(scheduling == 0){//hour
        		$.each(startHour.split("/"),function(idx, item){
        			if(idx == 0){
        				startHour = item;
        			}else{
        				$("#repeatHoursArea").val(item);
        			}
        		})
        	}else if(scheduling == 1){//day
        		$("#repeatDaysArea").val(cron_arr[3].split("/")[1]);
        	}else if(scheduling == 2){//week
        		$.each(cron_arr[5].split(","),function(idx, item){
        			$("#repeatWeeks").find("input[type=checkbox][value="+item+"]")[0].checked = true;
        		});
        	}else if(scheduling == 3){//month
        		$("#repeatMonthsOfDay").val(cron_arr[4].split("/")[1]);
        		$("#repeatMonthsOfMonth").val(cron_arr[3]);
        	}
        	if(scheduling){
        		if(0 == scheduling){
        			$(".repeatCls").css("display", "none");
        			$("#repeatHours").css("display", "block");
        		}else if(1 == scheduling){
        			$(".repeatCls").css("display", "none");
        			$("#repeatDays").css("display", "block");
        		}else if(2 == scheduling){
        			$(".repeatCls").css("display", "none");
        			$("#repeatWeeks").css("display", "block");
        		}else if(3 == scheduling){
        			$(".repeatCls").css("display", "none");
        			$("#repeatMonth").css("display", "block");
        		}else{
        			$(".repeatCls").css("display", "none");
        		}
        	}
        	
        	$("#reportEditPopupContents").find("input[name=exportType][value="+data.export_type+"]")[0].checked = true;
        	var hiddenDiv = $('#reportEditPopupContents').find('#hiddenDiv');
        	if(hiddenDiv[0] != undefined){        		
        		var hiddenLength = hiddenDiv[0].childNodes.length
        		var hiddenArr = [];
        		for(var i=0;i<hiddenLength;i++){
        			hiddenArr.push({text : hiddenDiv[0].childNodes[i].label, value : hiddenDiv[0].childNodes[i].value});
        		}
        		var selectValue = data.ui_value;
        		var selectindex = hiddenArr.findIndex(x => x.value === selectValue);
        		
        		$('input[columntype=time]').w2field('list', { 
        			items: hiddenArr, 
        			selected:hiddenArr[selectindex]
        		});
        	}
        },
                
        popupSetting: function(data){
        	$("#reportEditPopupContents").find("report-setting-row").each(function(){
        		$(this).remove();
        	});
        	var editUI = '';
        	editUI =data.ui_setting.replace('combo','list');
        	$('#reportEditPopupContents').find('#afterItem').after(editUI); 
        
        	if(data.schedule_start == null){
        		$("#noPeriod")[0].checked = true;
    			$("#noPeriod").attr('checked','checked');
    			$('#reportEditPopupContents').find('#startTime').prop('disabled', true);
    			$('#reportEditPopupContents').find('#endTime').prop('disabled', true);
    		}else{
    			$("#startTime").w2field('datetime', {format : 'yyyy-mm-dd | hh24:mm:ss'});
    			$("#startTime").attr("placeholder", "yyyy-mm-dd hh:mm:ss");
    			$("#startTime").val(data.schedule_start.slice(0, 16));
    			
    			$("#endTime").w2field('datetime', {format : 'yyyy-mm-dd | hh24:mm:ss'});
    			$("#endTime").attr("placeholder", "yyyy-mm-dd hh:mm:ss");
    			$("#endTime").val(data.schedule_end.slice(0, 16));
    			
    			$("#noPeriod")[0].checked = false;
    			$('#startTime').prop('disabled', false);
                $('#endTime').prop('disabled', false);
    		}
        	
        	var cron_arr = data.cron_expression.split(" ");
        	var scheduling = data.scheduling;
        	var startHour = cron_arr[2];
        	var startMin = cron_arr[1];
        	
        	if(scheduling == 0 || scheduling == -1){//hour
        		$.each(startHour.split("/"),function(idx, item){
        			if(idx == 0){
        				startHour = item;
        			}else{
        				$("#repeatHoursArea").val(item);
        			}
        		})
        	}
        	startHourMin = startHour + ':' + startMin;
        },
        
        addPopup : function(){
        	var body = '<div class="w2ui-centered">'+
        	'<div id="reportAddPopupContents" style="width:100%; height:100%;" >'+
        	'<div class="w2ui-page page-0">'+
        	'<div class="w2ui-field">'+
        	'<label>TITLE</label>'+
        	'<div>'+
        	'<input name="title" type="text" size="62"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field" id="afterItem">'+
        	'<label>TYPE</label>'+
        	'<div>'+
        	'<input name="type" type="list" size="62"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field">'+
        	'<label>PERIOD</label>'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label class="radioChecking">'+
        	'<input id="noPeriod" name="noPeriod" type="checkbox" size="62"/><label>NO PERIOD</label>'+
        	'</label>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field">'+
        	'<label>START TIME</label>'+
        	'<div style="margin-left: 144px;">'+
        	'<input name="startTime" type="datetime" size="20" style="float: left;"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field">'+
        	'<label>END TIME</label>'+
        	'<div style="margin-left: 144px;">'+
        	'<input name="endTime" type="datetime" size="20" style="float: left;"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field radioCheck">'+
        	'<label>REPEAT</label>'+
        	'<div class="w2ui-field" id="repeatDiv" style="margin-left: 144px;">'+
        	'<label><input type="radio" name="repeat" value="-1" checked="checked" /><label>NONE</label></label>'+
        	'<label><input type="radio" name="repeat" value="0" /><label>HOURS</label></label>'+
        	'<label><input type="radio" name="repeat" value="1" /><label>DAYS</label></label>'+
        	'<label><input type="radio" name="repeat" value="2" /><label>WEEKS</label></label>'+
        	'<label><input type="radio" name="repeat" value="3" /><label>MONTH</label></label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatHours" class="w2ui-field repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label style="width:100%">Every&nbsp;&nbsp;'+
        	'<input name="repeatHoursArea" type="text" size="3"/>'+
        	'&nbsp;&nbsp;Hours</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatDays" class="w2ui-field repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label style="width:100%">Every&nbsp;&nbsp;'+
        	'<input name="repeatDaysArea" type="text" size="3"/>'+
        	'&nbsp;&nbsp;Days</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatWeeks" class="w2ui-field radioCheck repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="MON"/><label>MON</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="THE"/><label>THE</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="WED"/><label>WED</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="THU"/><label>THU</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="FRI"/><label>FRI</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="SAT"/><label>SAT</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="SUN"/><label>SUN</label></label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatMonth" class="w2ui-field repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label style="width:100%">Every&nbsp;&nbsp;'+
        	'<input name="repeatMonthsOfDay" type="text" size="3"/>'+
        	'&nbsp;&nbsp;of Every&nbsp;&nbsp;'+
        	'<input name="repeatMonthsOfMonth" type="text" size="3"/>'+
        	'&nbsp;&nbsp;Month</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="startAtArea" class="w2ui-field">'+
        	'<label>START AT</label>'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<input name="startAt" type="datetime" size="6" style="float: left;"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field" style="padding-top: 5px;">'+
        	'<label>STORAGE CYCLE</label>'+
        	'<div style="margin-left: 144px; left: -168px;">'+
        	'<input id="repeatStorageText" name="storageCycle" type="text" maxlength=2 size="3"/><label style="color:white;">&nbsp;&nbsp;days</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="exportTypeStatus" class="w2ui-field radioCheck">'+
        	'<label>EXPORT TYPE</label>'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label><input type="radio" name="exportType" value="0" checked="checked" /><label>PDF</label></label>'+
        	'<label><input type="radio" name="exportType" value="1" /><label>EXCEL</label></label>'+
        	'</div>'+
        	'</div>'+
        	'</div>'+
        	'</div>'+
        	'<div id="reportPopupBottom" style="text-align: center;">'+
        	'<button id="reportPopupSaveExecuteBtn" name="save" class="darkButton">' + BundleResource.getString('button.report.save') + '</button>'+
        	'<button id="reportPopupSaveExecuteBtn" name="excute" class="darkButton">' + BundleResource.getString('button.report.execute') + '</button>'+
        	'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.report.close') + '</button>'+
        	'</div>'+
        	'</div>';
        	
        	w2popup.open({
        		title : BundleResource.getString('title.report.create_popup'),
        		body: body,
        		width : 600,
        		height : 600,
        		opacity   : '0.5',
        		modal     : true,
        		showClose : true,
        		style	  : "overflow:hidden;",
        		onOpen    : function(event){
        			event.onComplete = function () {
        				$("#reportPopupBottom").html();
        				w2ui["report_add_popup_properties"].render();
        				var noPeriod = $("input:checkbox[name=noPeriod]").is(':checked');
        				that.noPeriodChecked(noPeriod);
        				$("input:radio[name=repeat]").on('click', function(e){
        					var selectedRepeat = $(e.target).attr("value");
        					if(0 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatHours").css("display", "block");
        					}else if(1 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatDays").css("display", "block");
        					}else if(2 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatWeeks").css("display", "block");
        					}else if(3 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatMonth").css("display", "block");
        					}else{
        						$(".repeatCls").css("display", "none");
        					}
        				});
        				
        				$("input:checkbox[name=noPeriod]").on('click', function(e){
        					var noPeriod = $(e.target).is(':checked');
        					that.noPeriodChecked(noPeriod);
        				});
        			}
        		},

        		onClose   : function(event){
        			w2ui['report_add_popup_properties'].destroy();
        		}
        	});
        	
        	$("#reportAddPopupContents").w2form({
        		name : 'report_add_popup_properties',
        		style:"border:1px solid rgba(0,0,0,0);",
        		focus : 0,
        		fields : [
        			{name:'title', type: 'text', disabled:false, required:true, html:{caption:'TITLE'}},
        			{name:'type', type: 'list', required:true, options : {items : reportMgr.reportType}, html:{caption:'TYPE'}},
        			{name:'noPeriod',  editable: { type: 'checkbox' }},
        			{name:'startTime', type: 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}, required:false, html:{caption:'START TIME'}},
        			{name:'endTime', type: 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}, required:false, html:{caption:'END TIME'}},
        			{name:'repeatHoursArea', type: 'text'},
        			{name:'repeatDaysArea', type: 'text'},
        			{name:'repeatMonthsOfDay', type: 'text'},
        			{name:'repeatMonthsOfMonth', type: 'text'},
        			{name:'startAt', type: 'time', options : {format : 'h24'}, html:{caption:'START AT'}},
        			{name:'storageCycle', type: 'int', required:true, html:{caption:'STORAGE CYCLE'}},
        			],
        			record:{
        				title : '',
        				type : '',
        				startTime : reportMgr.today,
        				endTime : reportMgr.time,
        				startAt : '0:00',
        			},
        			onChange: function (event) {
        				that.makeSetting(event);
        			},
        	});
        },
        
        editPopup : function(evt){
        	that.checkBtnValidate();
			if($("#reportEditBtn").prop("disabled")){
				return;
			}
        	if($(evt.target).parent().hasClass('w2ui-empty-record')){
        		return;
        	}
        	if(evt.recid == ""){
        		this.alertPopup('label.report.row_noselected', "Information");
        		return;
        	}
        	var data = w2ui["report_list_table"].get(w2ui["report_list_table"].getSelection())[0];
        	delay = data.report_id;
        	
        	var body = '<div class="w2ui-centered">'+
        	'<div id="reportEditPopupContents" style="width:100%; height:100%;" >'+
        	'<div class="w2ui-page page-0">'+
        	'<div class="w2ui-field">'+
        	'<label>TITLE</label>'+
        	'<div>'+
        	'<input name="title" type="text" size="62"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field" id="afterItem">'+
        	'<label>TYPE</label>'+
        	'<div>'+
        	'<input name="type" type="list" size="62"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field">'+
        	'<label>PERIOD</label>'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label class="radioChecking">'+
        	'<input id="noPeriod" name="noPeriod" type="checkbox" size="62"/><label>NO PERIOD</label>'+
        	'</label>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field">'+
        	'<label>START TIME</label>'+
        	'<div style="margin-left: 144px;">'+
        	'<input name="startTime" type="datetime" size="20" style="float: left;"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field">'+
        	'<label>END TIME</label>'+
        	'<div style="margin-left: 144px;">'+
        	'<input name="endTime" type="datetime" size="20" style="float: left;"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field radioCheck">'+
        	'<label>REPEAT</label>'+
        	'<div class="w2ui-field" id="repeatDiv" style="margin-left: 144px;">'+
        	'<label><input type="radio" name="repeat" value="-1" checked="checked" /><label>NONE</label></label>'+
        	'<label><input type="radio" name="repeat" value="0" /><label>HOURS</label></label>'+
        	'<label><input type="radio" name="repeat" value="1" /><label>DAYS</label></label>'+
        	'<label><input type="radio" name="repeat" value="2" /><label>WEEKS</label></label>'+
        	'<label><input type="radio" name="repeat" value="3" /><label>MONTH</label></label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatHours" class="w2ui-field repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label style="width:100%">Every&nbsp;&nbsp;'+
        	'<input name="repeatHoursArea" type="text" size="3"/>'+
        	'&nbsp;&nbsp;Hours</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatDays"id="repeatDays" class="w2ui-field repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label style="width:100%">Every&nbsp;&nbsp;'+
        	'<input name="repeatDaysArea" type="text" size="3"/>'+
        	'&nbsp;&nbsp;Days</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatWeeks" class="w2ui-field radioCheck repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="MON"/><label>MON</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="THE"/><label>THE</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="WED"/><label>WED</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="THU"/><label>THU</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="FRI"/><label>FRI</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="SAT"/><label>SAT</label></label>'+
        	'<label><input name="repeatWeeksType" type="checkbox" value="SUN"/><label>SUN</label></label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="repeatMonth" class="w2ui-field repeatCls" style="display:none;">'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label style="width:100%">Every&nbsp;&nbsp;'+
        	'<input name="repeatMonthsOfDay" type="text" size="3"/>'+
        	'&nbsp;&nbsp;of Every&nbsp;&nbsp;'+
        	'<input name="repeatMonthsOfMonth" type="text" size="3"/>'+
        	'&nbsp;&nbsp;Month</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="startAtArea" class="w2ui-field">'+
        	'<label>START AT</label>'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<input name="startAt" type="datetime" size="6" style="float: left;"/>'+
        	'</div>'+
        	'</div>'+
        	'<div class="w2ui-field" style="padding-top: 5px;">'+
        	'<label>STORAGE CYCLE</label>'+
        	'<div style="margin-left: 144px; left: -168px;">'+
        	'<input id="repeatStorageText" name="storageCycle" type="text" maxlength=2 size="3"/><label style="color:white;">&nbsp;&nbsp;days</label>'+
        	'</div>'+
        	'</div>'+
        	'<div id="exportTypeStatus" class="w2ui-field radioCheck">'+
        	'<label>EXPORT TYPE</label>'+
        	'<div class="w2ui-field" style="margin-left: 144px;">'+
        	'<label><input type="radio" name="exportType" value="0" checked="checked" /><label>PDF</label></label>'+
        	'<label><input type="radio" name="exportType" value="1" /><label>EXCEL</label></label>'+
        	'</div>'+
        	'</div>'+
        	'</div>'+
        	'</div>'+
        	'<div id="reportPopupBottom" style="text-align: center;">'+
        	'<button id="reportPopupSaveExecuteBtn" name="editSave" class="darkButton">' + BundleResource.getString('button.report.save') + '</button>'+
        	'<button id="reportPopupSaveExecuteBtn" name="editExcute" class="darkButton">' + BundleResource.getString('button.report.execute') + '</button>'+
        	'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.report.close') + '</button>'+
        	'</div>'+
        	'</div>';
        	
        	w2popup.open({
        		title : BundleResource.getString('title.report.edit_popup'),
        		body: body,
        		width : 600,
        		height : 600,
        		opacity   : '0.5',
        		modal     : true,
        		showClose : true,
        		style	  : "overflow:hidden;",
        		onOpen    : function(event){
        			event.onComplete = function () {
        				$("#reportPopupBottom").html();
        				w2ui["report_edit_popup_properties"].render();
        				var noPeriod = $("input:checkbox[name=noPeriod]").is(':checked');
        				that.noPeriodChecked(noPeriod);
        				
        				that.popupCheck();

        				$("input:radio[name=repeat]").on('click', function(e){
        					var selectedRepeat = $(e.target).attr("value");
        					if(0 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatHours").css("display", "block");
        					}else if(1 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatDays").css("display", "block");
        					}else if(2 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatWeeks").css("display", "block");
        					}else if(3 == selectedRepeat){
        						$(".repeatCls").css("display", "none");
        						$("#repeatMonth").css("display", "block");
        					}else{
        						$(".repeatCls").css("display", "none");
        					}
        				});
        				
        				$("input:checkbox[name=noPeriod]").on('click', function(e){
        					var noPeriod = $(e.target).is(':checked');
        					that.noPeriodChecked(noPeriod);
        				});
        			}
        		},

        		onClose   : function(event){
        			w2ui['report_edit_popup_properties'].destroy();
        		}
        	});
        	
        	that.popupSetting(data);
        	
        	$("#reportEditPopupContents").w2form({
        		name : 'report_edit_popup_properties',
        		style:"border:1px solid rgba(0,0,0,0);",
        		focus : 0,
        		fields : [
        			{name:'title', type: 'text', disabled:true, required:true, html:{caption:'TITLE'}},
        			{name:'type', type: 'list', disabled:true, required:true, html:{caption:'TYPE'}},
        			{name:'noPeriod',  editable: { type: 'checkbox' }},
        			{name:'startTime', type: 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}, required:false, html:{caption:'START TIME'}},
        			{name:'endTime', type: 'datetime', options : {format : 'yyyy-mm-dd | hh24:mm:ss'}, required:false, html:{caption:'END TIME'}},
        			{name:'repeatHoursArea', type: 'text'},
        			{name:'repeatDaysArea', type: 'text'},
        			{name:'repeatMonthsOfDay', type: 'text'},
        			{name:'repeatMonthsOfMonth', type: 'text'},
        			{name:'startAt', type: 'time', options : {format : 'h24'}, html:{caption:'START AT'}},
        			{name:'storageCycle', type: 'int', required:true, html:{caption:'STORAGE CYCLE'}},
        			],
        			record:{
        				title : data.report_title,
        				type : reportMgr.reportType[data.report_type],
        				startTime : reportMgr.today,
        				endTime : reportMgr.time,
        				startAt : startHourMin,
        				storageCycle: data.period_last,
        			},
        			onChange: function (event) {
        				that.makeSetting(event);
        			},
        			onRender : function(event){
        				
        			}
        	});
        
        },
        deleteReport : function(evt){
        	var _this = this;
        	that.checkBtnValidate();
			if($("#reportDeleteBtn").prop("disabled")){
				return;
			}
        	
			var markup = "";
			var data = w2ui["report_list_table"].get(w2ui["report_list_table"].getSelection());
			var bodyContents =  BundleResource.getString('label.report.delete_confirm');
			var body = '<div class="w2ui-centered">'+
			'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
			'<div class="assetMgr-popup-btnGroup">'+
			'<button id="reportPopupDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.report.confirm') + '</button>'+
			'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.report.cancel') + '</button>'+
			'</div>'+
			'</div>' ;

        	w2popup.open({
        		width: 380,
 		        height: 180,
		        title : BundleResource.getString('title.report.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        },
        
        deleteExcute : function(){      
        	var _this = this;
        	var model = new Model();
        	var data = w2ui["report_list_table"].get(w2ui["report_list_table"].getSelection());
        	var report_id = data[0].report_id;

        	model.set("id", report_id);
        	model.url = model.url + '/' + report_id;
        	
        	model.destroy({
        		success: function (model, respose, options) {
        			that.getReport($('#leftCombo').w2field().get().id-1); //list combo data
                	that.searchAllHistory();
                	w2ui["report_list_table"].selectNone();
    			}
    		});
        },
		
		/*settingParameter : function(){
			w2ui['report_add_popup_properties'].set('type', {options:{items:reportMgr.reportType}});
			w2ui['report_add_popup_properties'].record
		},*/
		
		removeEventListener : function(){
			$(document).off("click", "#reportPopupSaveExecuteBtn");
			$(document).off("click", "#reportPopupDeleteOkBtn");
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
			if(w2ui['report_layout']){
				w2ui['report_layout'].destroy();
			}
			if(w2ui['report_list_table']){
				w2ui['report_list_table'].destroy();
			}
			if(w2ui['history_list_table']){
				w2ui['history_list_table'].destroy();
			}
			if(w2ui['report_left_combo_list']){
				w2ui['report_left_combo_list'].destroy();
			}
			if(w2ui['report_right_date_box']){
				w2ui['report_right_date_box'].destroy();
			}
			if(w2ui['report_add_popup_properties']){
				w2ui['report_add_popup_properties'].destroy();
			}
			if(w2ui['report_edit_popup_properties']){
				w2ui['report_edit_popup_properties'].destroy();
			}
			this.removeEventListener();
			this.undelegateEvents();
		}
	});
	
	return Main;
});