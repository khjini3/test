define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/itsm/defect",
    "w2ui",
    "js/lib/component/BundleResource",
    "css!cs/itsm/defect"
],function(
	$,
	_,
	Backbone,
	JSP,
	W2ui,
	BundleResource
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
			this.init();
			this.start();
			this.elements = {
					
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
        	'click #defectMgrSearchBtn' : 'searchAction',
			'click #defectMgrAddBtn' : 'defectAdd',
			'click #defectMgrDelBtn' : 'defectDelete',
			'click #defectMgrEditBtn' : 'defectEdit'
        },
		
		eventListenerRegister : function(){
			
		},
		
		removeEventListener : function(){
			
		},
		
		init : function(){
			defMgr = this;
			
			var cnvtDay = util.getDate("Day");
			var cnvtMonth = util.getDate("Month");
			var getSearchTypeList = [{"text" : BundleResource.getString("defectManager.enum.searchType.daily"), "value" : "1"},
										 {"text" : BundleResource.getString("defectManager.enum.searchType.monthly"), "value" : "2"},
										 {"text" : BundleResource.getString("defectManager.enum.searchType.period"), "value" : "3"}];
			
			var getDefectStatusList = [{"text" : BundleResource.getString("defectManager.enum.defectStatus.all"), "value" : "1"},
				 					   {"text" : BundleResource.getString("defectManager.enum.defectStatus.receipt"), "value" : "2"},
				 					   {"text" : BundleResource.getString("defectManager.enum.defectStatus.measure"), "value" : "3"},
				 					   {"text" : BundleResource.getString("defectManager.enum.defectStatus.solution"), "value" : "4"}];
			
			var getCategoryList = [{"text" : BundleResource.getString("defectManager.enum.category.all"), "value" : "1"},
								   {"text" : BundleResource.getString("defectManager.enum.category.software"), "value" : "2"},
								   {"text" : BundleResource.getString("defectManager.enum.category.hardware"), "value" : "3"}];
			
			var getActionList = [{"text" : BundleResource.getString("defectManager.enum.action.all"), "value" : "1"},
				   				   {"text" : BundleResource.getString("defectManager.enum.action.technicalSupport"), "value" : "2"},
				   				   {"text" : BundleResource.getString("defectManager.enum.action.substitute"), "value" : "3"},
				   				   {"text" : BundleResource.getString("defectManager.enum.action.repair"), "value" : "4"},
				   				   {"text" : BundleResource.getString("defectManager.enum.action.rma"), "value" : "5"}];			
			
			$("#defectContentsDiv").w2layout({
				name : 'defecttMgr_layout',
				panels : [
					{type:'top', size:'11.5%', resizable:false, content:'<div id="searchContents"></div>'},
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
				]
			});
			
			var searchContents = '<div class="dashboard-panel" id="searchTop" style="width:100%;">'+
											'<div id="searchBottom">'+
												'<div class="w2ui-page page-0">'+
													 '<div class="search-options border">'+
											            '<div class="" style="height: 62px;">'+
												            '<div class="w2ui-field">'+
										        				'<label>' + BundleResource.getString("defectManager.searchType") + '</label>'+
										        				'<div>'+
																	'<input name="searchType" type="list" size="40" style="width:258px;" />'+
										    					'</div>'+
										        			'</div>'+
										        			'<div class="w2ui-field">'+
										        				'<label>' + BundleResource.getString("defectManager.searchPeriod") + '</label>'+
										        				'<div id="dailyMonthly" class="w2ui-field" style="padding-right:0px;">'+
																	'<input name="searchDayMonth" type="searchDayMonth" size="17" />'+
																'</div>'+
										    					'<div class="periodic w2ui-field" style="padding-right:0px; color: #fff;">'+
										    						'<input name="searchFromPeriod" type="searchFromPeriod" size="17" /> ~ <input name="searchToPeriod" type="searchToPeriod" size="17" />'+
										    					'</div>'+
										        			'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		
								            		'<div class="search-options border">'+
								            			'<div class="" style="height: 62px;">'+
								            				'<div class="w2ui-field">'+
								            					'<label>' + BundleResource.getString("defectManager.defectStatus") + '</label>'+
										        				'<div>'+
																	'<input name="status" type="list" size="40" style="width:258px;" />'+
										    					'</div>'+								            				
								            				'</div>'+
								            				'<div class="w2ui-field">'+
								            					'<label>' + BundleResource.getString("defectManager.action") + '</label>'+
										        				'<div>'+
																	'<input name="action" type="list" size="40" style="width:258px;" />'+
										    					'</div>'+								            				
								            				'</div>'+								            				
								            			'</div>'+
								            		'</div>'+//search-options
								            		
								            		'<div class="search-options border">'+
											            '<div class="" style="height: 62px;">'+
															'<div class="w2ui-field">'+
																'<label>' + BundleResource.getString("defectManager.manager") + '</label>'+
										            			'<div id="getUserList">'+
										            				'<div style="float:left; width: 231px;">'+
										            					'<input name="manager" type="text" value="All" readonly="readonly" size="40"  style="width:258px;" />'+
										            				'</div>'+
										            				'<i class="manager-list fas fa-external-link-alt" aria-hidden="true"></i>'+
										            			'</div>'+
															'</div>'+
															'<div class="w2ui-field">'+
																'<label>' + BundleResource.getString("defectManager.category") + '</label>'+
																'<div><input name="category" type="list" size="40" style="width:258px;" /></div>'+
										            		'</div>'+
									            		'</div>'+
								            		'</div>'+//search-options
								            		
								            		'<div style="float:left; margin-left:0px;">'+
											            '<div class="" style="height: 62px; text-align: center; padding-top: 18px; float: right;">'+
											            	'<div><button id="defectMgrSearchBtn" class="darkButton" type="button" >' + BundleResource.getString('button.assetStatus.search') + '</button></div>'+
									            		'</div>'+
								            		'</div>'+//search-options
												'</div>'+//w2ui-page page-0
											'</div>'+//searchBottom
										'</div>';//dashboard-panel
			
			var mainContents = '<div id="mainTop">'+
										'<div class="align-right-btn">'+
											'<i id="defectMgrAddBtn" class="icon link fas fa-plus fa-2x align-right" aria-hidden="true" title="Add"></i>'+
											'<i id="defectMgrDelBtn" class="icon link fas fa-trash-alt fa-2x align-right" aria-hidden="true" disabled="disabled" title="Delete"></i>'+
											'<i id="defectMgrEditBtn" class="icon link fas fa-edit fa-2x align-right" aria-hidden="true" disabled="disabled" title="Edit"></i>'+
										'</div>'+
									'</div>'+//mainTop
									'<div class="dashboard-panel" style="width:100%;">'+
							    		'<div class="dashboard-title">Defect List</div>'+
							    		'<div class="dashboard-contents">'+
							    			'<div id="mainBottom"></div>'+
							    		'</div>'+
							    	'</div>'+//dashboard-panel
							    	'<div id="estimateAddPopup"></div>';
			
			$("#searchContents").html(searchContents);
			$("#mainContents").html(mainContents);
			
			$("#searchBottom").w2form({
				name : 'defect_search_options',
				focus : -1,
				fields : [
					{name : 'classify', type : 'text'},
					{name : 'status', type : 'list', options : {items : getDefectStatusList}},
					{name : 'action', type : 'list', options : {items : getActionList}},
					{name : 'category', type : 'list', options : {items : getCategoryList}},
					{name : 'manager', type : 'text'},
					{name : 'searchType', type : 'list', options : {items : getSearchTypeList}},
					{name : 'searchDayMonth', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchFromPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}},
					{name : 'searchToPeriod', type : 'date', options : {format : 'yyyy-mm-dd'}}
				],
				record : {
					classify : '',
					status : getDefectStatusList[0],
					action : getActionList[0],
					category : getCategoryList[0],
					manager : '',
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
			
			$(".periodic").hide();
			$('input[type=searchFromPeriod').w2field('date', {format : 'yyyy-mm-dd', end : $('input[type=searchToPeriod]')});
			$('input[type=searchToPeriod').w2field('date', {format : 'yyyy-mm-dd', start : $('input[type=searchFromPeriod]')});
			
			$("#mainBottom").w2grid({
				name : 'defect_list',
				show : {
					footer:false,
					toolbarSearch:false,
					toolbarReload:false,
					searchAll:false,
					toolbarColumns:false,
					selectColumn:true
				},
				recordHeight : 30,
				columns : [
					{ field: 'recid', caption: 'NO', size : '100px', sortable: true, attr: 'align=center'},
         			{ field: 'project_id', caption: 'COMPANY', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //프로젝트
         			{ field: 'project_id', caption: 'MODEL NAME', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //업체
         			{ field: 'project_id', caption: 'S/N', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //요청일자
         			{ field: 'project_id', caption: 'DEFECT TYPE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //견적일자
         			{ field: 'project_id', caption: 'TYPE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //담당자
         			{ field: 'project_id', caption: 'DEFECT NAME', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //견적분류
         			{ field: 'project_id', caption: 'SEVERITY', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //등급
         			{ field: 'project_id', caption: 'STATUS', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //상태
         			{ field: 'project_id', caption: 'SUBMIT DATE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //등록 날자
         			{ field: 'project_id', caption: 'CLOSE DATE', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //종료 날자
         			{ field: 'project_id', caption: 'SUBMITTER', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;'}, //등록자
         			{ field: 'project_id', caption: 'DOWNLOAD', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;',
         				render : function(record){
         					return '<div style="padding:1px; margin-top: 2px; margin-bottom:3px;"><i class="icon link fab fa-download fa-lg grid-buttons download-btn estimate-down-btn" estimateId='+record.estimate_id+'></i></div>';
         				}
         			}, //다운로드
         			{ field: 'project_id', caption: 'PREVIEW', size : '100%', sortable: true, attr: 'align=left', style: 'padding-left:5px;',
         				render : function(record){
         					var html;
                		    if(record.reserve_str == 0){//pdf
                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon link fab fa-preview fa-2x preview-btn report-history-preview-btn" historyid='+record.estimate_id+'></i></div>';	   			   	
                		    }else{
                			   	html = '<div style="padding:1px; padding-right:20px; margin-top: 2px; margin-bottom:3px;"><i class="icon fab fa-preview fa-2x  preview-btn  disabled" style="cursor: default;" historyid='+record.estimate_id+' ></i></div>';
                		    }
                		    return html;
         				}
         			} //프리뷰
				],
				onClick : function(event){
					event.onComplete = function(){
						
					}
				}
			});			
			
			this.eventListenerRegister();
		},
		
		start : function(){
			
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
			if(w2ui['defecttMgr_layout']){
				w2ui['defecttMgr_layout'].destroy();
			}
			
			if(w2ui['defect_search_options']){
				w2ui['defect_search_options'].destroy();
			}
			
			if(w2ui['defect_list']){
				w2ui['defect_list'].destroy();
			}
			
			defMgr = null;
			
			this.removeEventListener();
			
			this.undelegateEvents();
			
		}
		
	});
	return Main;
});