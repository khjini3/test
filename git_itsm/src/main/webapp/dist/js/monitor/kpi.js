define([
    "jquery",
    "underscore",
    "backbone",
    "rx",
    "w2ui",
    "js/lib/component/BundleResource",
    "text!views/monitor/kpi",
    "css!cs/monitor/kpi",
    "widget"
],function(
    $,
    _,
    Backbone,
    Rx,
    W2ui,
    BundleResource,
    KpiJSP
){
	$(window.document).on("contextmenu", function(event){return false;});
	var KpiModel = Backbone.Model.extend({ 
        url: '/dashboard/kpiwidgets',
        parse: function(result) {
            return {data: result};
        }
    });
	
    var Kpi = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.elements = {
    			scene : null,
    			selectedBtn : null,
    			selectId : undefined,
    			pageEvent : false,
    			pageNum : 0,
    			rowCnt: 0,
    			firstVisit : true
    		};
    		this.$el.append(KpiJSP);
    		
    		this.init();
    		this.kpiModel = new KpiModel();
    		this.listenTo(this.kpiModel, "sync", this.getData);
    		this.kpiModel.url += '/limitList';
    		this.getList();
    		
//    		this.start();
        },
        
        events: {
        	'click #kpiAddBtn' : 'kpiAddPopup',
        	'click #kpiDelBtn' : 'setKpiDelete',
        	'dblclick #mainBottom .w2ui-grid-data' : 'kpiEditPopup'
        },
        
        init : function(){
        	kpi = this;
        	
        	$("#kpiContentsDiv").w2layout({
        		name : 'kpi_layout',
        		panels : [
        			{type:'main', size:'100%', content:'<div id="mainContents"</div>'}
        		]
        	});
        	
        	var mainContents = '<div id="mainTop"></div>'+
								    	'<div class="dashboard-panel" style="width:100%;">'+
								    		'<div class="dashboard-title">KPI List</div>'+
								    		'<div class="dashboard-contents">'+
									    		'<div id="mainBottom"></div>'+
										    		'<div id="kpiGrid-page" class="pager-table-area"></div>'+
								    		'</div>'+
								    	'</div>';
        	
        	$("#mainContents").html(mainContents);
        	
        	$("#mainBottom").w2grid({
        		name : 'kpi_table',
        		style : 'border-right: 0px solid rgba(255,255,255,0.1) !important',
        		show : {
        			footer : false,
					toolbarSearch : false,
					toolbarReload : false,
					searchAll : false,
					toolbarColumns : false,
					selectColumn: true
        		},
        		recordHeight : 30,
        		columns : [
        			{ field: 'recid', caption: 'NO', size: '50px', attr: "align=center" },
                    { field: 'kpiTitle', caption: 'TITLE', size: '250px', attr: "align=left", style : 'padding-left:5px' },
                    { field: 'polling', caption: 'POLLING', size: '80px', attr: "align=right", style : 'padding-right:5px'},
                    { field: 'chartType', caption: 'CHART TYPE', size: '100px', attr: "align=left", style : 'padding-left:5px'},
                    { field: 'threshold', caption: 'THRESHOLD', size: '80px', attr: "align=right", style : 'padding-right:5px'},
//                    { field: 'tableName', caption: 'TABLE', size: '200px', attr: "align=left", style : 'padding-left:5px'},
                    { field: 'kpiKeys', caption: 'KEYS', size: '250px', attr: "align=left", style : 'padding-left:5px'},
                    { field: 'kpiValues', caption: 'VALUES', size: '250px', attr: "align=left", style : 'padding-left:5px'},
//                    { field: 'kpiCondition', caption: 'CONDITION', size: '100%', attr: "align=left", style : 'padding-left:5px' },
                    { field: 'description', caption: 'DESCRIPTION', size: '100%', attr: "align=left", style : 'padding-left:5px' },
        		]
        	});
        	
//        	w2ui['kpi_table'].onDblClick = kpi.kpiEditPopup;
        	
        	w2ui["kpi_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		kpi.validationCheck();
        	});
        	
        	w2ui["kpi_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		kpi.validationCheck();
        	});
        	
        	w2ui["kpi_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		kpi.validationCheck();
        	});
        	
        	w2ui["kpi_table"].on('click', function (event) {
        		kpi.selectData = event.recid;
        	});
        	
        	var crudBtn = '<div id="kpiBtnGroup">'+
					    		'<i id="kpiAddBtn" class="icon link fas fa-plus fa-2x" aria-hidden="true" title="Add"></i>'+
					    		'<i id="kpiDelBtn" class="icon link fas fa-trash-alt fa-2x" aria-hidden="true" title="Del"></i>'+
					    	'</div>';
        	
        	$("#mainTop").html(crudBtn);
        	
        	$("#kpiDelBtn").prop("disabled", true);
			$("#kpiDelBtn").removeClass('link');
        	
        	kpi.eventListenerRegister();
        },
        
        eventListenerRegister : function(){
        	var that = this;
        	$(document).on('click', '#kpiAddPopupOkBtn', function(){
        		var arr = w2ui['kpi_popup_properties'].validate();
        		if(arr.length > 0){
        			return;
        		}else{
        			that.insert(that.getValues());
        		}
        	});
        	
        	$(document).on('click', '#kpiEditPopupOkBtn', function(){
        		var arr = w2ui['kpi_popup_properties'].validate();
        		if(arr.length > 0){
        			return;
        		}else{
        			that.update(that.getValues());
        		}
        	});
        	
        	$(document).on('click', '#kpiPopupDeleteOkBtn', this.delete);
        	
        	$(document).on('click', '#sqlStart', function(){
        		if($("#kpiQuery").val() == ""){
        			var alertBodyContents = "";
        			var Body = "";
        			
        			alertBodyContents = BundleResource.getString('label.kpi.query_msg');
            		Body = '<div class="w2ui-centered">'+
    					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
    					'<div class="kpi-popup-btnGroup">'+
    						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.kpi.confirm') + '</button>'+
    					'</div>'+
    				'</div>' ;
            		w2popup.message({ 
            			width   : 400, 
            			height  : 180,
            			html    : Body
            		});
    				
            		$(".w2ui-message").css({top:"252px", 'box-shadow':"0px 1px 8px rgba(1,1,1,0) !important", 'border-radius' : "6px"});
        		}else{
        			$("#tableBtn").trigger("click");
        			that.executeQuery();
//        			w2ui['kpi_popup_sidebar'].select('tableBtn');
        		}
        		
        	});
        	
        	$(document).on('click', '#tableBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").show();
        		$("#kpiChartSet").hide();
        		//$("#kpiThreshold").hide();
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		$("#kpiThreshold").val("");
        		that.elements.selectedBtn = 'table';
        		var len = $("#resultGrid table").length;
//        		if(len>0) $("#resultGrid").grid('resize');
//        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#lineBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		//$("#kpiThreshold").show();
        		that.setPreviewArea();
        		$("input[name=kpiThreshold]").attr("readonly",false);
        		that.elements.selectedBtn = 'line';
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Line");
//        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#mplineBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		that.setPreviewArea();
        		//$("#kpiThreshold").show();
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		that.elements.selectedBtn = 'mpline';
        		$("#kpiThreshold").val("");
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Markpoint Line");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#barBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		$("#kpiThreshold").show();
        		that.setPreviewArea();
        		$("input[name=kpiThreshold]").attr("readonly",false);
        		that.elements.selectedBtn = 'bar';
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Bar");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#hbarBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		that.setPreviewArea();
        		//$("#kpiThreshold").show();
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		$("#kpiThreshold").val("");
        		that.elements.selectedBtn = 'hbar';
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Horizon Bar");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#stklineBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		that.setPreviewArea();
        		that.elements.selectedBtn = 'stkline';
        		$("#kpiThreshold").val("");
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Stack Line");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#stkareaBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		that.setPreviewArea();
        		that.elements.selectedBtn = 'stkarea';
        		$("#kpiThreshold").val("");
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("StackArea Line");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#stkbarBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		that.setPreviewArea();
        		that.elements.selectedBtn = 'stkbar';
        		$("#kpiThreshold").val("");
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Stack Bar");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#pieBtn', function(ev){
        		var id = ev.target.id;
        		$("#kpiResult").hide();
        		$("#kpiChartSet").show();
        		that.setPreviewArea();
        		//$("#kpiThreshold").hide();
        		$("input[name=kpiThreshold]").attr("readonly",true);
        		$("#kpiThreshold").val("");
        		that.elements.selectedBtn = 'pie';
        		$(".kpi-droparea").empty();
        		$("#kpiType").text("Pie");
        		that.setKpiBtnColor(this, id);
        	});
        	
        	$(document).on('click', '#kpiPreBtn', function(ev){
        		w2ui['kpi_popup_layout'].toggle('left', window.instant);
      	    	w2ui['kpi_popup_layout'].toggle('bottom', window.instant);
      	    	
      	    	
      	    	var valObj = that.getValues();
      	    	var keysStr = valObj.kpiKeys.trim();
      	    	var valuesStr = valObj.kpiValues.trim();
      	    	var selectBtn = that.elements.selectedBtn;
      	    	var chartData = {keys: keysStr, values: valuesStr, data: {data: undefined}};
      	    	
      	    	if(valuesStr == "" || keysStr == "") return;
      	    	
      	    	var keyArr = valObj.kpiKeys.split(",");
      	    	var valueArr = valObj.kpiValues.split(",");
      	    	var colArr = valueArr.concat(keyArr);
      	    	var result = {};
      	    	
      	    	if(selectBtn == 'pie') {
      	    		result = [];
          	    	that.data.data.forEach(function(val, index) {
          	    		var obj = {};
          	    		var key = keyArr[0];
          	    		var value = valueArr[0];
          	    		obj[key] = val[key];
          	    		obj[value] = val[value];
          	    		result.push(obj);
          	    	});
      	    	} else {
      	    		that.data.data.forEach(function(val, index) {
          	    		colArr.forEach(function(column, idx) {
          	    			if(result[column] == undefined) {
          	    				result[column] = [];
          	    			}
          	    			result[column].push(val[column]);
          	    		});
          	    	});
      	    	}
      	    	
      	    	chartData.data.data = result;
      	    	
      	    	$("#kpiPreview").component();
      	    	$("#kpiPreview").component('drawChart', that.elements.selectedBtn, "kpiPreview", chartData);
      	    	var callback = $("#kpiPreview").attr('callback');
      	    	/*
      	    	w2ui['kpi_popup_layout'].on('resize', function(event) {
      	    		$("#kpiPreview")[callback]('resize');
      	    	});
      	    	*/
      	    	setTimeout(function() {
      	    		$("#kpiPreview")[callback]('resize');
      	    	}, 500);
        	});
        	
        },
        
        removeEventListener : function(){
        	$(document).off('click', '#kpiAddPopupOkBtn');
        	$(document).off('click', '#kpiEditPopupOkBtn');
        	$(document).off('click', '#kpiPopupDeleteOkBtn');
        	$(document).off('click', '#sqlStart');
        	$(document).off('click', '#tableBtn');
        	$(document).off('click', '#lineBtn');
        	$(document).off('click', '#mplineBtn');
        	$(document).off('click', '#barBtn');
        	$(document).off('click', '#hbarBtn');
        	$(document).off('click', '#stklineBtn');
        	$(document).off('click', '#stkareaBtn');
        	$(document).off('click', '#stkbarBtn');
        	$(document).off('click', '#pieBtn');
        	$(document).off('click', '#kpiPreBtn');
        },
        
        validationCheck : function(){
        	if(w2ui['kpi_table'].getSelection().length > 0){
				$("#kpiDelBtn").prop('disabled', false);
				$("#kpiDelBtn").addClass('link');
			}else{
				$("#kpiDelBtn").prop('disabled', true);
				$("#kpiDelBtn").removeClass('link');
			}
        },
        
        initPager: function(totalRow) { 
			var _this = this;
        	var pagination = null;
        	var currentPage = null;
        	if($('#kpiGrid-page').data("twbs-pagination")){
                $('#kpiGrid-page').pager('destroy');
            }
        	$('#kpiGrid-page').pager({
            	"totalCount" : totalRow, "pagePerRow" : 25
            }).bind("click", function (event, page) {
            	var that = _this;
            	var endRow = 25;
            	pagination = $('#kpiGrid-page').data('twbsPagination');
            	currentPage = pagination.getCurrentPage();
            	that.kpiModel.set({"startRow" : currentPage, "endRow" : endRow});
            	that.kpiModel.save();
            	that.listenTo(that.kpiModel, "sync", that.getData);
            	that.pagerTableCSS(".kpiGrid-page .pagination", totalRow, currentPage);
            });
            
        	pagination = $('#kpiGrid-page').data('twbsPagination');
        	currentPage = pagination.getCurrentPage();
            
            _this.pagerTableCSS("#kpiGrid-page .pagination", totalRow, currentPage);
		},
		
		updatePager: function(totalRow) { 
			var _this = this;
        	var pagination = null;
        	var currentPage = null;
        	
        	$('#kpiGrid-page').unbind();

        	if($('#kpiGrid-page').data("twbs-pagination")){
                $('#kpiGrid-page').pager('destroy');
            }
        	
            $('#kpiGrid-page').pager('open',{
            	"totalCount" : totalRow, "pagePerRow" : 25
            }).bind("click", function (event, page) {
            	var evtClass = $(event.target).attr('class');
            	if(evtClass != 'page-link') return;
            	
            	var that = _this;
            	var endRow = 25;
            	
            	pagination = $('#kpiGrid-page').data('twbsPagination');
            	currentPage = pagination.getCurrentPage();
            	that.kpiModel.set({"startRow" : currentPage, "endRow" : endRow});
            	that.kpiModel.save();
            	that.listenTo(that.kpiModel, "sync", that.getData);
            	that.pagerTableCSS("#kpiGrid-page .pagination", totalRow, currentPage);
            });
            
            if(this.elements.pageNum > 0) {
            	$($('#kpiGrid-page').find('li')[this.elements.pageNum+2]).trigger('click');
            	this.elements.pageNum = 0;
            }
            
        	pagination = $('#kpiGrid-page').data('twbsPagination');
        	currentPage = pagination.getCurrentPage();
            
        	_this.pagerTableCSS(".kpiGrid-page .pagination", totalRow, currentPage);
		},
		
		getPage : function() {
			var pagination = $('#kpiGrid-page').data('twbsPagination');
        	return pagination.getCurrentPage();
		},
		
        getData : function(model) {
        	var data = model.toJSON().data;
        	
        	w2ui['kpi_table'].records = data.data.data;
        	w2ui['kpi_table'].refresh();
        	
        	this.elements.rowCnt = data.data.data.length;

    		if(this.elements.pageEvent) {
    			this.updatePager(data.noOffsetRecord);
    			this.elements.pageEvent = false;
    		}
    		
    		if(this.elements.firstVisit){
    			this.initPager(data.noOffsetRecord);
    			this.elements.firstVisit = false;
    		}
    		
        },
        
        start: function(data) {
        	$('.grid-buttons').tooltip();
        },
        
        kpiAddPopup : function(event){
        	var that = this;
			var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	
        	popupHeight = 864;
        	
			fields = [
				 {name:'kpiTitle', type:'text', required:true, html:{caption:'TITLE'}},
				 {name:'kpiQuery', type:'text', required:true, html:{caption:'QUERY'}},
				 {name:'kpiPolling', type:'int', required:true, html:{caption:'POLLING'}},
				 {name:'kpiThreshold', type:'text', html:{caption:'THRESHOLD'}},
				 {name:'kpiDescription', type:'text', html:{caption:'DESCRIPTION'}}
			];
			
			record = {
					kpiTitle : '',
					kpiQuery : '',
					kpiPolling : '',
					kpiThreshold : '',
					kpiDescription : ''
			}
			
			body = '<div >'+ //class="w2ui-centered"
						'<div id="kpiMgrPopupContents" style="width:100%; height:784px;" >'+
						
							' <div class="w2ui-page page-0">'+
						       
							'<div style="width:720px; height:308px;" class="">'+ //class="dashboard-panel"
							
								'<div style="width: 520px; float: left; margin-right: 0px;">'+
								
							       '<div class="w2ui-field w2ui-span4">'+
								       '<label style="width: 115px;">TITLE</label>'+
								       '<div><input name="kpiTitle" type="text" style="width: 352px;" /></div>'+
							       '</div>'+
							       
							       '<div class="w2ui-field w2ui-span4" style="color:#fff;">'+
								       '<label style="width: 115px;">QUERY <i class="far fa-play-circle fa-lg icon link" style="margin-left: 5px;" id="sqlStart"></i></label>'+
								       '<div><textarea name="kpiQuery" type="text" style="width:352px; height:200px; resize:none;" ></textarea></div>'+
							       '</div>'+
							       
							       '<div class="w2ui-field w2ui-span4" style="width:250px; float:left;">'+
						                '<label style="width: 115px;">POLLING</label>'+
						                '<div><input name="kpiPolling" style="width:101px;"></div>'+
						            '</div>'+
						            
						            '<div class="w2ui-field w2ui-span4" style="width:235px; float:left;">'+
						                '<label style="width: 115px;">THRESHOLD</label>'+
						                '<div><input name="kpiThreshold" style="width:101px;"></div>'+
						            '</div>'+
						            
						            '<div class="w2ui-field w2ui-span4" style="color:#fff;">'+
								       '<label style="width: 115px;">DESCRIPTION</label>'+
								       '<div><input name="kpiDescription" style="width:352px;" /></div>'+
							       '</div>'+
							       
						       '</div>'+ // float left
						       
						       '<div style="width: 200px; float: right; margin-left: 0px;">'+
							       '<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-contents">'+
								    		'<div id="popupMainBottom" style="height:290px;"></div>'+
							    		'</div>'+
							    	'</div>'+
						       '</div>'+  // float right
						       
						       '<div style="clear: both; padding-top: 15px;"></div>'+
						       
					       '</div>'+ // popupTop
						       
						      '<div id="kpiChartShowArea" class="popupBottom" style="width:100%; height:428px; margin-top:20px;">'+ //height:calc(100vh - 540px)
						      		
							      '<div style="width:714px; height:418px;">'+
						    		'<div class="dashboard-contents">'+
						    			'<div id="popupLeftBottom" style="height: 414px;">'+
						    			
						    				'<div id="kpiResult" style="height: 414px;">'+
						    					'<div id="table" style="height: 414px;">'+
						    						'<label class="kpi-popup-setting">Result </label>'+
						    						'<div id="resultGrid" class="kpi-grid kpi-popup-setting"></div>'+
						    					'</div>'+ // table
						    				'</div>'+ // kpiResult
						    				
						    				
						    				'<div id="kpiChartSet" style="height: 414px; display:none;">'+
						    					'<div style="height: 65px;">'+
						    						'<label class="kpi-popup-setting">All fields</label>'+
						    						'<div id="kpiPopupField" style="height: 48px; width:540px; float:right;"></div>'+
						    					'</div>'+
						    					'<div id="kpiChartArea"></div>'+
						    				'</div>'+ // kpiChartSet
						    				
						    			'</div>'+ // popupLeftBottom
					    			'</div>'+ // dashboard-contents
						    	'</div>'+ // dashboard-panel
						      
						      '</div>'+ // kpiChartShowArea
						      
						    '</div>'+ //w2ui-page page-0
						
						'</div>'+ //kpiMgrPopupContents
						
			
						/*'<div id="tickerMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+*/
						'<div id="kpiPopupBottom" style="text-align:center;">'+
							'<button id="kpiAddPopupOkBtn" class="darkButton">' + BundleResource.getString('button.kpi.save') + '</button>'+
							'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.kpi.close') + '</button>'+
						'</div>'+
						
					'</div>'; //w2ui-centered
			

			w2popup.open({
				title : BundleResource.getString('title.kpi.addKpi'),
		        body: body,
		        width : 770,
		        height : popupHeight,
		        type : 'create',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		that.elements.selectedBtn = 'table';
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['kpi_popup_properties'].destroy();
		        	w2ui['kpi_popup_sidebar'].destroy();
		        	if(w2ui['kpi_popup_layout']){
		        		w2ui['kpi_popup_layout'].destroy();
		        	}
		        	if(w2ui['resultGrid']){
		        		w2ui['resultGrid'].destroy();
		        	}
		        }
		        
		    });
    		
    		$("#kpiMgrPopupContents").w2form({
    			name : 'kpi_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			
    			fields : fields,
    		
    			record: record,
    			
    			onRender : function(event){
					event.onComplete = function(event){
						$("#popupMainBottom").w2sidebar({
		    				name: 'kpi_popup_sidebar',
		    				nodes: [
		    						{ id: 'table-1', text: 'Grid', img: 'icon-folder', expanded: true, group: true,
		    	              		  nodes: [ 
		    	              			  			{ id: 'tableBtn', text: '<i class="icon link fas fa-table kpiBtns" id="tableBtn"></i> Table'},
		    	              				 ]
		    	              		},
		    	              		{ id: 'line-1', text: 'Line', img: 'icon-folder', expanded: true, group: true,
		    	            		  nodes: [ 
		    	            			  	   { id: 'lineBtn', text: '<i class="icon link fas fa-chart-line kpiBtns" id="lineBtn"></i> Simple Line'},
		    	            			  	   { id: 'stklineBtn', text: '<i class="icon link fab fa-chart_line3 kpiBtns" id="stklineBtn"></i> Stacked Line'},
		    	            			  	   { id: 'stkareaBtn', text: '<i class="icon link fab fa-chart_line4 kpiBtns" id="stkareaBtn"></i> Stacked Area'},
		    	            				 ]
		    	            		},
		    	            		{ id: 'bar-1', text: 'Bar', img: 'icon-folder', expanded: true, group: true,
		    	              		  nodes: [ 
		    	              			  	   { id: 'barBtn', text: '<i class="icon link fas fa-chart-bar kpiBtns" id="barBtn"></i> Simple Bar'},
		    	              			  	   { id: 'stkbarBtn', text: '<i class="icon link fab fa-chart_line3 kpiBtns" id="stkbarBtn"></i> Stacked Bar'},
		    	              			  	   { id: 'hbarBtn', text: '<i class="icon link fab fa-chart_bar_h kpiBtns" id="hbarBtn"></i> Horizon Bar'},
		    	              				 ]
		    	              		},
		    	              		{ id: 'pie-1', text: 'Pie', img: 'icon-folder', expanded: true, group: true,
		    	              		  nodes: [ 
		    	            			  	   { id: 'pieBtn', text: '<i class="icon link fas fa-chart-pie kpiBtns" id="pieBtn"></i> Simple Pie'},
		    	            			  	 ]
		    	                	},
		    				],
		    				
		    				onClick : function(event){
		    					if(event.originalEvent.isTrusted){
		    						$("#"+event.target).trigger('click');
		    					}
		    				}
		    			});
						
						$('#kpiChartArea').css({"height":"324px", "width":"704px"});
			        	var pstyle = 'border: 1px solid #dfdfdf; padding: 5px; text-align: left; overflow: hidden;';
			      	    $('#kpiChartArea').w2layout({
			      	        name: 'kpi_popup_layout',
			      	        panels: [
			      	            { type: 'top', size: 50, resizable: false, hidden: true, style: pstyle, content: 'top' },
			      	            { type: 'left', size: 180, resizable: false, style: pstyle, content: 
			      	            	'<div style="width:80%; height:22px; float:left;">Values</div>' + 
			      	            	'<div id="valuesDrop" class="kpi-droparea "></div>'
			      	            },
			      	            { 
			      	            	type: 'main', style: pstyle, content: 
			      	            	'<div class="kpi-chart-main">' + 
			      	            	'<div id="kpiType" style="width:calc(100% - 22px); height:22px; float:left;"></div>' + 
			      	            	'<i id="kpiPreBtn" class="fas fa-search-plus kpi-pre-btn"></i>'+
			      	            	'<div id="kpiPreview"></div></div>' 
			      	            },
			      	            { type: 'right', size: 100, resizable: false, hidden: true, style: pstyle, content: 'right' },
			      	            { type: 'bottom', size: 60, resizable: false, style: pstyle, content: 'Keys<div id="keysDrop" class="kpi-droparea "></div>' }
			      	        ]
			      	    });
					}
				}
    		});
    		
    		$('#keysDrop')
            .on('dragover', false) 
            .on('drop', function (ev) {
            	that.keysDropEvent(ev);
            });
        	
        	$('#valuesDrop')
            .on('dragover', false) 
            .on('drop', function (ev) {
                that.valuesDropEvent(ev);
            });
		},
        
        setKpiDelete : function() {
        	kpi.validationCheck();
        	
        	if($("#kpiDelBtn").prop('disabled')){
        		return;
        	}
        	
        	var that = this;
        	var data = w2ui['kpi_table'].get(w2ui['kpi_table'].getSelection());
        	
        	var bodyContents = "";
			var body = "";
        	if(data.length > 0){
        		//bodyContents = "선택된 "+ data.length+"개의 항목을 삭제 하시겠습니까?";
        		bodyContents = BundleResource.getString('label.kpi.selected') + data.length + BundleResource.getString('label.kpi.selectedItemDelete');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="kpi-popup-btnGroup">'+
						'<button id="kpiPopupDeleteOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.kpi.confirm') + '</button>'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.kpi.cancel') + '</button>'+
					'</div>'+
				'</div>' ;
        	}else{
        		//bodyContents = "선택된 항목이 없습니다.";
        		bodyContents = BundleResource.getString('label.kpi.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
					'<div class="kpi-popup-btnGroup">'+
						'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.kpi.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
        	}
        	
        	w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.kpi.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        },
        
        kpiEditPopup : function(evt) {
        	var that = this;
        	var data = w2ui['kpi_table'].get(w2ui['kpi_table'].getSelection());
        	
        	var popupHeight = 0;
        	var fields = [];
        	var record = {};
        	var body = "";
        	
        	kpi.elements.selectId = data[0].id;
        	var kpiTitle = data[0].kpiTitle;
//        	var kpiQuery = kpi.buildQuery(data[0].kpiColumns, data[0].tableName, data[0].kpiCondition);
        	var kpiQuery = data[0].query;
        	var kpiPolling = data[0].polling;
        	var kpiThreshold = data[0].threshold;
        	var kpiDescription = data[0].description;
        	
        	/*if(data[0].chartType != null) {
        		$("#"+data[0].chartType+"Btn").trigger("click");
        	}*/
        	
        	popupHeight = 864;
        	
			fields = [
				 {name:'kpiTitle', type:'text', required:true, html:{caption:'TITLE'}},
				 {name:'kpiQuery', type:'text', required:true, html:{caption:'QUERY'}},
				 {name:'kpiPolling', type:'int', required:true, html:{caption:'POLLING'}},
				 {name:'kpiThreshold', type:'text', html:{caption:'THRESHOLD'}},
				 {name:'kpiDescription', type:'text', html:{caption:'DESCRIPTION'}}
			];
			
			record = {
					kpiTitle : kpiTitle,
					kpiQuery : kpiQuery,
					kpiPolling : kpiPolling,
					kpiThreshold : kpiThreshold,
					kpiDescription : kpiDescription
			}
			
			body = '<div >'+
						'<div id="kpiMgrPopupContents" style="width:100%; height:784px;" >'+
						
							' <div class="w2ui-page page-0">'+
						       
							'<div style="width:720px; height:308px;" class="">'+ //class="dashboard-panel"
							
								'<div style="width: 520px; float: left; margin-right: 0px;">'+
								
							       '<div class="w2ui-field w2ui-span4">'+
								       '<label style="width: 115px;">TITLE</label>'+
								       '<div><input name="kpiTitle" type="text" style="width: 352px;" /></div>'+
							       '</div>'+
							       
							       '<div class="w2ui-field w2ui-span4" style="color:#fff;">'+
								       '<label style="width: 115px;">QUERY <i class="far fa-play-circle fa-lg icon link" style="margin-left: 5px;" id="sqlStart"></i></label>'+
								       '<div><textarea name="kpiQuery" type="text" style="width:352px; height:200px; resize:none;" ></textarea></div>'+
							       '</div>'+
							       
							       '<div class="w2ui-field w2ui-span4" style="width:250px; float:left;">'+
						                '<label style="width: 115px;">POLLING</label>'+
						                '<div><input name="kpiPolling" style="width:101px;"></div>'+
						            '</div>'+
						            
						            '<div class="w2ui-field w2ui-span4" style="width:235px; float:left;">'+
						                '<label style="width: 115px;">THRESHOLD</label>'+
						                '<div><input name="kpiThreshold" style="width:101px;"></div>'+
						            '</div>'+
						            
						            '<div class="w2ui-field w2ui-span4" style="color:#fff;">'+
								       '<label style="width: 115px;">DESCRIPTION</label>'+
								       '<div><input name="kpiDescription" style="width:352px;" /></div>'+
							       '</div>'+
							       
						       '</div>'+ // float left
						       
						       '<div style="width: 200px; float: right; margin-left: 0px;">'+
							       '<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-contents">'+
								    		'<div id="popupMainBottom" style="height:290px;"></div>'+
							    		'</div>'+
							    	'</div>'+
						       '</div>'+  // float right
						       
						       '<div style="clear: both; padding-top: 15px;"></div>'+
						       
					       '</div>'+ // popupTop
						       
						      '<div id="kpiChartShowArea" class="popupBottom" style="width:100%; height:428px; margin-top:20px;">'+
						      		
							      '<div style="width:714px; height:418px;">'+
						    		'<div class="dashboard-contents">'+
						    			'<div id="popupLeftBottom" style="height: 414px;">'+
						    			
						    				'<div id="kpiResult" style="height: 414px;">'+
						    					'<div id="table" style="height: 414px;">'+
						    						'<label class="kpi-popup-setting">Result </label>'+
						    						'<div id="resultGrid" class="kpi-grid kpi-popup-setting"></div>'+
						    					'</div>'+ // table
						    				'</div>'+ // kpiResult
						    				
						    				
						    				'<div id="kpiChartSet" style="height: 414px; display:none;">'+
						    					'<div style="height: 65px;">'+
						    						'<label class="kpi-popup-setting">All fields</label>'+
						    						'<div id="kpiPopupField" style="height: 48px; width:540px; float:right;"></div>'+
						    					'</div>'+
						    					'<div id="kpiChartArea"></div>'+
						    				'</div>'+ // kpiChartSet
						    				
						    			'</div>'+ // popupLeftBottom
					    			'</div>'+ // dashboard-contents
						    	'</div>'+ // dashboard-panel
						      
						      '</div>'+ // kpiChartShowArea
						      
						    '</div>'+ //w2ui-page page-0
						
						'</div>'+ //kpiMgrPopupContents
						
			
						/*'<div id="tickerMgrResultText" style="height:20px;color:#fff;position:relative; top:-10px;"></div>'+*/
						'<div id="kpiPopupBottom" style="text-align:center;">'+
							'<button id="kpiEditPopupOkBtn" class="darkButton">' + BundleResource.getString('button.kpi.save') + '</button>'+
							'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.kpi.close') + '</button>'+
						'</div>'+
						
					'</div>'; //w2ui-centered
			

			w2popup.open({
				title : BundleResource.getString('title.kpi.editKpi'),
		        body: body,
		        width : 770,
		        height : popupHeight,
		        type : 'update',
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
			     	
		        onOpen    : function(event){
		        	event.onComplete = function () {
		        		if(data[0].chartType != null) {
		            		$("#"+data[0].chartType+"Btn").trigger("click");
		            	}
		        		kpi.elements.selectedBtn = data[0].chartType;
		        		kpi.executeQuery();
		            	var keys = [];
		            	var values = [];
		            	if(data[0].kpiKeys != null) {
		            		keys = data[0].kpiKeys.split(",");
		            		if(keys[0] == "") keys = [];
		            		keys.forEach(function(val) {
		                		kpi.drawKeys($('#keysDrop'), val);
		                	});
		            	}
		            	if(data[0].kpiKeys != null) {
		            		values = data[0].kpiValues.split(",");
		            		if(values[0] == "") values = [];
		            		values.forEach(function(val) {
		            			kpi.drawValues($('#valuesDrop'), val);
		                	});
		            	}
		            	
		            	var field = keys.concat(values);
//		            	var field = data[0].kpiColumns.split(',');
		            	if(field.length > 0) kpi.drawField(field);
		        	}
		        },
		        
		        onClose   : function(event){
		        	w2ui['kpi_popup_properties'].destroy();
		        	w2ui['kpi_popup_sidebar'].destroy();
		        	if(w2ui['kpi_popup_layout']){
		        		w2ui['kpi_popup_layout'].destroy();
		        	}
		        	if(w2ui['resultGrid']){
		        		w2ui['resultGrid'].destroy();
		        	}
		        }
		        
		    });
    		
    		$("#kpiMgrPopupContents").w2form({
    			name : 'kpi_popup_properties',
    			style:"border:1px solid rgba(0,0,0,0)",
    			
    			fields : fields,
    		
    			record: record,
    			
    			onRender : function(event){
					event.onComplete = function(event){
						$("#popupMainBottom").w2sidebar({
		    				name: 'kpi_popup_sidebar',
		    				nodes: [
		    						{ id: 'table-1', text: 'Grid', img: 'icon-folder', expanded: true, group: true,
		    	              		  nodes: [ 
		    	              			  			{ id: 'tableBtn', text: '<i class="icon link fas fa-table kpiBtns" id="tableBtn"></i> Table'},
		    	              				 ]
		    	              		},
		    	              		{ id: 'line-1', text: 'Line', img: 'icon-folder', expanded: true, group: true,
		    	            		  nodes: [ 
		    	            			  	   { id: 'lineBtn', text: '<i class="icon link fas fa-chart-line kpiBtns" id="lineBtn"></i> Simple Line'},
		    	            			  	   { id: 'stklineBtn', text: '<i class="icon link fab fa-chart_line3 kpiBtns" id="stklineBtn"></i> Stacked Line'},
		    	            			  	   { id: 'stkareaBtn', text: '<i class="icon link fab fa-chart_line4 kpiBtns" id="stkareaBtn"></i> Stacked Area'},
		    	            				 ]
		    	            		},
		    	            		{ id: 'bar-1', text: 'Bar', img: 'icon-folder', expanded: true, group: true,
		    	              		  nodes: [ 
		    	              			  	   { id: 'barBtn', text: '<i class="icon link fas fa-chart-bar kpiBtns" id="barBtn"></i> Simple Bar'},
		    	              			  	   { id: 'stkbarBtn', text: '<i class="icon link fab fa-chart_line3 kpiBtns" id="stkbarBtn"></i> Stacked Bar'},
		    	              			  	   { id: 'hbarBtn', text: '<i class="icon link fab fa-chart_bar_h kpiBtns" id="hbarBtn"></i> Horizon Bar'},
		    	              				 ]
		    	              		},
		    	              		{ id: 'pie-1', text: 'Pie', img: 'icon-folder', expanded: true, group: true,
		    	              		  nodes: [ 
		    	            			  	   { id: 'pieBtn', text: '<i class="icon link fas fa-chart-pie kpiBtns" id="pieBtn"></i> Simple Pie'},
		    	            			  	 ]
		    	                	},
		    				],
		    				
		    				onClick : function(event){
		    					if(event.originalEvent.isTrusted){
		    						$("#"+event.target).trigger('click');
		    					}
		    				}
		    			});
						
						$('#kpiChartArea').css({"height":"324px", "width":"704px"});
			        	var pstyle = 'border: 1px solid #dfdfdf; padding: 5px; text-align: left; overflow: hidden;';
			      	    $('#kpiChartArea').w2layout({
			      	        name: 'kpi_popup_layout',
			      	        panels: [
			      	            { type: 'top', size: 50, resizable: false, hidden: true, style: pstyle, content: 'top' },
			      	            { type: 'left', size: 180, resizable: false, style: pstyle, content: 
			      	            	'<div style="width:80%; height:22px; float:left;">Values</div>' + 
			      	            	'<div id="valuesDrop" class="kpi-droparea "></div>'
			      	            },
			      	            { 
			      	            	type: 'main', style: pstyle, content: 
			      	            	'<div class="kpi-chart-main">' + 
			      	            	'<div id="kpiType" style="width:calc(100% - 22px); height:22px; float:left;"></div>' + 
			      	            	'<i id="kpiPreBtn" class="fas fa-search-plus kpi-pre-btn"></i>'+
			      	            	'<div id="kpiPreview"></div></div>' 
			      	            },
			      	            { type: 'right', size: 100, resizable: false, hidden: true, style: pstyle, content: 'right' },
			      	            { type: 'bottom', size: 60, resizable: false, style: pstyle, content: 'Keys<div id="keysDrop" class="kpi-droparea "></div>' }
			      	        ]
			      	    });
					}
				}
    		});
    		
    		$('#keysDrop')
            .on('dragover', false) 
            .on('drop', function (ev) {
            	that.keysDropEvent(ev);
            });
        	
        	$('#valuesDrop')
            .on('dragover', false) 
            .on('drop', function (ev) {
                that.valuesDropEvent(ev);
            });
        	
        },
        
        buildQuery: function(columns, table ,condition) {
        	var getStr = function (arr) {
        		var result = "";
        		console.log(arr);
        		arr.forEach(function(val, idx) {
        			result += val.replace(/^\s*/, '');
        			if(idx+1 != arr.length) {
        				result += ',';
        			}
        			result += ' \n'; 
        		});
        				 
        		return result;
        	}
        	
        	var _columns = (function() {
        		var result = "";
        		if(columns != null || columns != undefined) {
        			result = getStr(columns.trim().split(","));
        		}
        		return result;
        	})();
        		
        	var _tables = getStr(table.trim().split(","));
        	
        	var query = 'SELECT ' + '\n' +
        				  _columns +
	 					  'FROM \n' +
	 					  _tables;
        	
        	if(condition != "") {
        		query += "WHERE \n" + condition.replace(/^\s*/, '');
        	}
        	/*
        	var query = "SELECT "+ columns + " from " + table;
        	if(condition != "") query += " where " + condition;
        	*/
        	return query;
        },
       
        setKpiBtnColor: function(el, id) {
//        	$(".kpiBtns").css("background-color", "");
//        	$(el).css("background-color", "#cfcfcf");
//        	
//    		var offset = $("#node_" + id)[0].offsetTop;
//            $('.w2ui-sidebar .w2ui-sidebar-div').animate({scrollTop : offset}, 100);
            
        },
        
        setPreviewArea : function() {
        	var dis = $('#layout_kpi_popup_layout_panel_bottom').css('display');
        	if(dis == 'none') {
        		w2ui['kpi_popup_layout'].show('left');
            	w2ui['kpi_popup_layout'].show('bottom');
        	}
        	
        	$("#kpiPreview").remove();
        	$(".kpi-chart-main").append('<div id="kpiPreview"></div>');
        },
        
        getQuery: function() {
        	var data = {};
        	var query = $("#kpiQuery").val(); // kpi-query
        	var sel = query.toUpperCase().indexOf("SELECT")+6;
        	var fro = query.toUpperCase().indexOf("FROM");
        	var whe = query.toUpperCase().indexOf("WHERE");
        	data.columns = query.slice(sel, fro);
        	//data.tableCondition = query.slice(fro+5);
        	
        	if(whe == -1) {
        		data.tableName = query.slice(fro+5);
            	data.condition = "";
        	} else {
        		data.tableName = query.slice(fro+5, whe);
            	data.condition = query.slice(whe+5);
        	}
        	
        	return data;
        },
        
        executeQuery: function() {
        	var data = {};
        	data.query = $("#kpiQuery").val();
        	var that = this;
        	var selbtn = that.elements.selectedBtn;
        	$.ajax({
                type: "POST",
                url: "/dashboard/kpiwidgets/query",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data), 
                success: function(data, textStatus, xhr) {
                	//console.log(data);
                	if(data.result == true) {
                		that.data = data.data;
                		if(selbtn == "table") {
                			that.drawGrid(data.data);
                            that.drawField(data.data.field);
                		}
                		
                	}
                	
                },
                error: function(data, textStatus, xhr) {
                	
                }
            }).done(function(){
                
            });
        },
        
        drawGrid: function(data) {
        	if($('#resultGrid').find('div').length > 0) {
        		w2ui['resultGrid'].destroy();
        	}
        	$('.kpi-droparea').empty();
        	if(this.elements.selectedBtn != 'table'){
        		$("#tableBtn").trigger("click");
        	}
        	var columns = [];
        	data.field.forEach(function(val) {
        		columns.push({field: val, caption: val, size: '10%'});
        	});
        	$("#resultGrid").w2grid({
        		name : 'resultGrid',
        		columns : columns
//        		data : data.data
        	});
        	w2ui['resultGrid'].records = data.data;
        	w2ui['resultGrid'].refresh();
        },
        
        drawField: function(array) {
        	$('#kpiPopupField').empty();
        	//$('.kpi-droparea').empty();
        	array.forEach(function(val) {
            	$('#kpiPopupField').append('<div id="'+val+'-column" class="kpiField" draggable="true">'+val+'</div>');
            });
            
            $(".kpiField").on("dragstart", function (ev) {
        		var kpiData = $(ev.target).text();
        		ev.originalEvent.dataTransfer.setData("Text", kpiData);
        	});
        },
        
        getValues: function() {
        	var result = {};
        	var keys = "";
        	//var values = {};
        	var values = "";
        	var keysArr = $(".keyDrop-kpiData").toArray();
        	var valsArr = $(".valueDrop-kpiData").toArray();
        	var columnsArr = "";
        	
        	if(w2ui['resultGrid'] == undefined){
        		columnsArr = kpi.data.field;
        	}else{
        		columnsArr = _.pluck(w2ui['resultGrid'].columns, 'caption');
        	}
        	var columnsStr = columnsArr.toString();
        	
        	keysArr.forEach(function(val, idx) {
        		//keys.push($(val).text());
        		keys += $(val).text();
        		if(idx != keysArr.length-1) keys += ",";
        	});
        	
        	valsArr.forEach(function(val, idx) {
        		values += $(val).text();
        		if(idx != valsArr.length-1) values += ",";
        	});
        	
        	result["kpiTitle"] = $("#kpiTitle").val();
        	result["polling"] = $("#kpiPolling").val();
        	result["query"] = $("#kpiQuery").val();
//        	result["kpiCondition"] = this.getQuery().condition;
//        	result["tableName"] = this.getQuery().tableName;
        	result["kpiColumns"] = columnsStr;
        	result["kpiKeys"] = keys;
        	result["kpiValues"] = values;
        	result["chartType"] = this.elements.selectedBtn;
        	result["threshold"] = $("#kpiThreshold").val();
        	result["description"] = $("#kpiDescription").val();
        	if(keys == "" && values == "") result["kpiKeys"] = columnsStr;
        	
        	console.log(result);
        	return result;
        },
        
        keysDropEvent: function(ev) {
        	var target = ev.currentTarget;
            var kpiData = ev.originalEvent.dataTransfer.getData("text");
            var alCount = $(target).find(".drop-kpiBox").length;
            var elCount = $(target).find("#"+kpiData+"-key").length;
            if(elCount > 0) return;
            if(alCount > 5) return;
            
            this.drawKeys(target, kpiData);
        },
        
        drawKeys: function(el, kpiData) {
        	var closeBtn = "<div class='kpiCloseBtn'>X</div>"
                var html = "<div id='"+kpiData+"-key'class='drop-kpiBox'>" +
                				"<div class='keyDrop-kpiData'>"+kpiData+"</div>" +
                				closeBtn +
                		   "</div>"
                $(el).append(html);
                
                this.setDropCloseEvent(el);
        },
        
        valuesDropEvent: function(ev) {
        	var target = ev.currentTarget;
            var kpiData = ev.originalEvent.dataTransfer.getData("text").trim();
            var alCount = $(target).find(".drop-kpiBox").length;
            var elCount = $(target).find("#"+kpiData+"-val").length;
            if(elCount > 0) return;
            if(alCount > 5) return;
            
            this.drawValues(target, kpiData);
        },
        
        drawValues: function(el, kpiData) {
            var currentBtn = this.elements.selectedBtn; 
            
            var select = "<div><select name='"+kpiData+"'>" +
							"<option value='sum'>SUM</option>" +
							"<option value='cnt'>COUNT</option>" +
							"<option value='avg'>AVERAGE</option>" +
						 "</select></div>";
            var closeBtn = "<div class='kpiCloseBtn'>X</div>"
            var html = (function() {
            	var view = "<div id='"+kpiData+"-val'class='drop-kpiBox'>" +
						   "<div class='valueDrop-kpiData'>"+kpiData+"</div>";
            	if(currentBtn == 'pie') {
            		//view += select + closeBtn + "</div>"
            		view += closeBtn + "</div>"
            	} else {
            		view += closeBtn + "</div>"
            	}
            	return view;
            })();
            
            $(el).append(html);
            
            this.setDropCloseEvent(el);
        },
        
        setDropCloseEvent: function(target) {
        	$(target).find($('.kpiCloseBtn')).on('click', function(ev) {
            	$(this.parentElement).remove();
        	});
        },
        
        getList: function(current, end) {
        	var currentPage = current || 1;
        	var endRow = end || 25;
        	this.kpiModel.set({"startRow" : currentPage, "endRow" : endRow});
        	this.kpiModel.save();
        },
        
        insert: function(obj) {
        	var that = this;
        	var model = new KpiModel();
        	model.set(obj);
        	model.save({}, {
        		success: function (model, response) {
                    console.log("insert success");
                    var rowCnt = that.elements.rowCnt
                    that.elements.pageEvent = true;
                    that.elements.pageNum = 0;
                    that.getList();
                    w2popup.close();
                },
                error: function (model, response) {
                    console.log("error");
                }
        	});
        },
        
        update: function(obj) {
        	var that = this;
        	var model = new KpiModel();
        	var id = kpi.elements.selectId;
        	model.url += "/" + id;
        	model.set('id', id);
        	model.set(obj);
        	model.save({}, {
        		success: function (model, response) {
        			console.log("update success");
        			var current = that.getPage();
                    that.elements.pageEvent = true;
                    that.elements.pageNum = current;
                    that.getList(current);
                    w2popup.close();
                },
                error: function (model, response) {
                    console.log("error");
                }
        	});
        },
        
        delete: function() {
        	var that = this;
        	var data = w2ui["kpi_table"].get(w2ui["kpi_table"].getSelection());
        	var id = [];
        	
        	var bodyContents = "";
			var body = "";
        	
        	for(var i=0; i<data.length; i++){
        		id.push(data[i].id);
        	}
        	
        	var model = new KpiModel();
        	model.url += "/multiDelete/" + id;
        	model.set('id', id);
        	model.destroy({
        	    success : function(data,xhr) {
        	    	if(xhr != 1) {
        	    		//"Dashboard에 값이 존재합니다."
        	    		bodyContents = BundleResource.getString('label.kpi.alreadyExistDashboard');
    	    			var current = kpi.getPage();
        	    		var rowCnt = kpi.elements.rowCnt;
        	    		kpi.elements.pageEvent = true;
        	    		
        	    		if(rowCnt == 25) {
        	    			current -= 1;
        	    		}
        	    		
        	    		if(w2ui['kpi_table'].records.length == 1){
        	    			current = current - 1;
        	    		}
        	    		
        	    		kpi.elements.pageNum = current;
        	    		kpi.getList(current);
        	    	} else {
        	    		var deleteList = data.attributes.id;
        	    		bodyContents = deleteList.length + BundleResource.getString('label.kpi.itemDelete');
        	    		var current = kpi.getPage();
        	    		var rowCnt = kpi.elements.rowCnt;
        	    		kpi.elements.pageEvent = true;
        	    		
        	    		if(rowCnt == 25) {
        	    			current -= 1;
        	    		}
        	    		
        	    		if(w2ui['kpi_table'].records.length == 1){
        	    			current = current - 1;
        	    		}
        	    		
        	    		kpi.elements.pageNum = current;
        	    		kpi.getList(current);
        	    	}
        	    	
        	    	body = '<div class="w2ui-centered">'+
				    				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
				    				'<div class="kpi-popup-btnGroup">'+
				    					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.kpi.confirm') + '</button>'+
				    				'</div>'+
				    			'</div>' ;
        	    	
        	    	w2popup.open({
        	    		width: 385,
        	    		height: 180,
        	    		title : BundleResource.getString('title.kpi.info'),
        	    		body: body,
        	    		opacity   : '0.5',
        	    		modal     : true,
        	    		showClose : true
        	    	});
        	    },
                error : function() {
                	console.log("error");
        	    }, 
        	});
        },
        
       	pagerTableCSS: function(selector, totalRow, currentPage) {
       		var pagePerRow = 25;
       		var totalPages = Math.ceil(totalRow / pagePerRow);
       		
       		if((totalPages > 1) && (currentPage != totalPages)) {
    			$(selector + " .page-item.next .page-link").hover(function(){
    			    $(this).css({"background": "url(dist/img/user/btn_next_on.png)",'background-repeat': 'no-repeat'});
    			    }, function(){
    			    $(this).css({"background": "url(dist/img/user/btn_next_off.png)",'background-repeat': 'no-repeat'});
    			});
    			
    			$(selector + " .page-item.last .page-link").hover(function(){
    			    $(this).css({"background": "url(dist/img/user/btn_last_on.png)",'background-repeat': 'no-repeat'});
    			    }, function(){
    			    $(this).css({"background": "url(dist/img/user/btn_last_off.png)",'background-repeat': 'no-repeat'});
    			});
       		} else if(currentPage != 1) {
    			$(selector + " .page-item.prev .page-link").hover(function(){
    			    $(this).css({"background": "url(dist/img/user/btn_prev_on.png)",'background-repeat': 'no-repeat'});
    			    }, function(){
    			    $(this).css({"background": "url(dist/img/user/btn_prev_off.png)",'background-repeat': 'no-repeat'});
    			});
    			
    			$(selector + " .page-item.first .page-link").hover(function(){
    			    $(this).css({"background": "url(dist/img/user/btn_first_on.png)",'background-repeat': 'no-repeat'});
    			    }, function(){
    			    $(this).css({"background": "url(dist/img/user/btn_first_off.png)",'background-repeat': 'no-repeat'});
    			});
       		}
       	},
       	
        destroy : function() {
        	console.log("kpi destroy");
        	
        	if(w2ui['kpi_layout']){
        		w2ui['kpi_layout'].destroy();
        	}
        	
        	if(w2ui['kpi_table']){
        		w2ui['kpi_table'].destroy();
        	}
        	
        	if(w2ui['kpi_popup_properties']){
        		w2ui['kpi_popup_properties'].destroy();
        	}
        	
        	if(w2ui['kpi_popup_sidebar']){
        		w2ui['kpi_popup_sidebar'].destroy();
        	}
        	
        	this.removeEventListener();
        	
        	kpi = null;
        	
        	that = null;
        	
        	this.undelegateEvents();
        }
    })

    return Kpi;
});