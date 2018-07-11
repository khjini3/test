define([
    "jquery",
    "underscore",
    "backbone",
    "js/lib/component/BundleResource",
    "js/layout/footer",
    "text!views/monitor/dashboard",
	"gridster",
	"widget",
    "w2ui",
	"css!cs/monitor/dashboard",
	"plugins/jqTree/tree.jquery",
	"css!plugins/jqTree/jqtree"
],function(
    $,
    _,
    Backbone,
    BundleResource,
    Footer,
    JSP,
    W2ui
){	
	var KpiModel = Backbone.Model.extend({ 
        url: '/dashboard/kpiwidgets',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var CustomModel = Backbone.Model.extend({ 
        url: '/dashboard/customwidgets',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var SlaModel = Backbone.Model.extend({ 
        url: '/dashboard/slawidgets',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var SlaDisplayModel = Backbone.Model.extend({ 
        url: '/settings/sla',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var PanelModel = Backbone.Model.extend({ 
        url: '/dashboard/panels',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var RoleModel = Backbone.Model.extend({ 
        url: '/role',
        parse: function(result) {
            return {data: result};
        }
    });
	
	var panelMgr;
	var playList = null;
	var panelCheck = false;
	var panelMgrSelect = null;
	var StartStop = false;
    var Dash = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		panelMgr = this;
    		this.elements = {
    			scene : null,
    			data : null,
    			currentPanelId : 0,
    			seq : 0,
    			panels: {},
    			orgWH:{},
    			fullscreen: false
    		};
    		this.$el.append(JSP);
    		$('.content-area').tooltip();
    		
    		this.panelList = new PanelModel();
    		this.panelModel = new PanelModel();
    		this.kpiModel = new KpiModel();
    		this.customModel = new CustomModel(); 
    		this.slaModel = new SlaModel(); 
    		this.listenTo(this.kpiModel, "sync", this.openKpiWidgetList);
    		this.listenTo(this.customModel, "sync", this.openCustomWidgetList);
    		this.listenTo(this.slaModel, "sync", this.openSlaWidgetList);
    		this.listenTo(this.panelList, "sync", this.getPanelList);
    		this.listenTo(this.panelModel, "sync", this.getPanel);
    		
    		this.elements.userId = sessionStorage.USER_IDX; 
    		this.elements.groupId = sessionStorage.GROUP_ID;
    		this.elements.privilege = sessionStorage.PRIVILEGE_ID;
    		this.panelList.set("userId", this.elements.userId);
    		this.panelList.set("groupId", this.elements.groupId);
    		
    		this.panelList.url += "/" +this.elements.groupId;
    		this.panelList.fetch();
    		this.listenTo(this.panelList, "sync", this.setList);
    		    		
    		$('.widget-cont-btn').tooltip();
    		
    		$('#playP').hide();
    		$('#stopP').hide();
    		
    		this.setAddValidation();
    		var screenAttr = BundleResource.getString("label.dashboard.screenAtt");
    		if(screen.width  < 1920 || screen.height < 1080) {
    			$("#screenAtt").text(screenAttr);
    		}
    		
    		this.pollingList = [];
    		
    		if(this.elements.privilege == 2){    			
    			$(".widget-buttons").css("display", "none");
    			$("#pollingCombo").attr("readonly", "readonly");
//    			$("#pollingBtn").hide();
    		}
    		this.eventListenerRegister();
    		window.onresize = function(event) {
//    			_this.openWidgetList();
    		};
			this.footer = new Footer();
        },
        events: {
            "click #add-btn" : "addPanel",
            "click #del-btn" : "delPanel",
            "click #canc-btn" : "cancPanel",
            "click #fs-start-btn" : "fullScreenStart",
            "click #currentPanelItem" : "togglePanelList",
            "click .panelItem" : "selectPanel",
            "click #playP" : "pollingPanel",
            "click #stopP" : "pollingPanel" 
        },
        eventListenerRegister : function(){
			$(document).on("click", "#panelDelPopupOkBtn", this.deletePopupOkAction);
		},
		removeEventListener : function(){
			$(document).off("click", "#panelDelPopupOkBtn");
		},
		setData : function(model){
			this.pollingList = [
 			   	   {"text" : "None", "id" : "-1"},
 			   	   {"text" : "10초", "id" : "100"},
 			   	   {"text" : "30초", "id" : "300"},
 			   	   {"text" : "1분", "id" : "1"},
				   {"text" : "5분", "id" : "5"},
				   {"text" : "10분", "id" : "10"},
				   {"text" : "20분", "id" : "20"},
				   {"text" : "30분", "id" : "30"}];
			
			var dashBoardItem = model.attributes.data.polling;
			var polling = null;
			if(dashBoardItem != null){	
				polling = dashBoardItem;
				var select = this.pollingList.filter(function (item) { return item.id == polling });
				$('input[type=list]').w2field('list', { items: this.pollingList , selected:select[0]});
				this.pollingPanel(null, polling);
			}else{
				$('input[type=list]').w2field('list', { items: this.pollingList , selected:this.pollingList[0]});
			}
			
			if(polling == -1 || $('#pollingCombo').w2field().get().id == -1){
        		$('#playP').show();
				$('#stopP').hide();
			}else{
				$('#playP').hide();
				$('#stopP').show();
			}
		},
		setList : function(model){
			var dashBoardList = model.attributes.data.data.list;
			//
			this.roleList = new RoleModel();
    		this.roleList.set("groupId", this.elements.groupId);
    		this.roleList.url += "/" +this.elements.groupId;
    		this.roleList.fetch();
    		this.listenTo(this.roleList, "sync", this.setData);
			
		},
        togglePanelList: function() {
        	var dis = $("#dashPanelList").css('display');
        	if(dis == 'block') {
        		//$(".list-btn").css('transform', 'rotate(180deg)');
        	} else {
        		$(".list-btn").css('transform', 'rotate(90deg)');
        	}
        	$("#dashPanelList").toggle();
        	
        	setTimeout(function() {
        		var hide = function(evt) { 
            		$("#dashPanelList").hide(); 
            		$("*:not(#currentPanelItem)").unbind('click', hide);
            		$("*:not(.mouse-evt):not(.panelItem.mouse-evt):not(.panelItem.mouse-evt div)").unbind('mouseenter', hide);
            		$(".list-btn").css('transform', 'rotate(180deg)');
            	};
            	
            	if($("#dashPanelList").css('display') != 'none') { 
            		//$("*:not(.panelItem):not(.title)").on('click', hide);
            		$("*").on('click', hide);
            		//$("header, aside").mouseenter(hide);
            		$("*:not(.mouse-evt):not(.panelItem.mouse-evt):not(.panelItem.mouse-evt div)").mouseenter(hide);
            	}
        	},200); 
        	
        },
        cancPanel: function() {
        	console.log("Cancel");
        	this.editMode(false);
        	//this.panelList.fetch(); //////////////////////////////
        	this.panelModel.fetch();
        },
        alertPopup : function(markup, title, btn){
        	var that = this;
       		var options = {
    				buttons: {
    			    	  OK: function() {
    			    		 $(this).confirm("close");
    			          }
    		        },
    		        width: 400,
    				title: title,
    				form: [
    				       {id: 'warning', type: 'label', label: markup},
    				],
        	}
       		if(btn != undefined) options.buttons = btn;
        	$('#delPanel-popup').confirm(options);
    		$('#delPanel-popup').confirm('open');
       	},
       	delPanel: function() {
        	var that = this;
        	var bodyContents = BundleResource.getString("label.dashboard.panel_delete");
			var body = '<div class="w2ui-centered">'+
			'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
			'<div class="assetMgr-popup-btnGroup">'+
			'<button id="panelDelPopupOkBtn" onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
			'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.cancel') + '</button>'+
			'</div>'+
			'</div>' ;

        	w2popup.open({
        		width: 380,
 		        height: 180,
		        title : BundleResource.getString('title.assetManager.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
        	
        },
        deletePopupOkAction : function(){
        	panelMgr.setDelPanel();
        	panelMgr.stopPolling();
        },
        setDelPanel: function(param) {
        	var that = this;
        	var list = this.panelList.toJSON().data.data.list;
        	if(list.length == 1){
        		var bodyContents = BundleResource.getString("label.dashboard.panel_no_delete");
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
        	}else{        		
        		this.panelModel.destroy({
        			success : function() {
        				that.editMode(false);
        				//$(".widget-controll").remove();
        				that.elements.currentPanelId = -1;
        				that.elements.panels = {};
        				that.panelList.fetch();
        			},
        			error : function() {
        				that.editMode(false);
        				
        			}, 
        		});
        	}
        },
		getFSWindow: function() {
			if(document.fullscreenElement) {
				return document.fullscreenElement;
			}
			else if(document.msFullscreenElement) {
				return document.msFullscreenElement;
			}
			else if(document.mozFullScreenElement) {
				return document.mozFullScreenElement;
			}
			else if(document.webkitFullscreenElement) {
				return document.webkitFullscreenElement;
			}
		},
        fullScreenStart: function(element) {
        	if(!($('#fs-start-btn').attr("data") == 'button.dashboard.full_screen_start')){
        		this.fullScreenStop();
        	}else{
	        	//element = this.el;
        		element = this.el.parentElement
	        	if(element.requestFullScreen) {
	    			element.requestFullScreen();
	    		} else if(element.webkitRequestFullScreen ) {
	    			element.webkitRequestFullScreen();
	    		} else if(element.mozRequestFullScreen) {
	    			element.mozRequestFullScreen();
	    		} else if (element.msRequestFullscreen) {
	    			element.msRequestFullscreen(); // IE
	    		}
        		
	        	$('#fs-start-btn').attr("data",'button.dashboard.full_screen_stop');
	        	$('#fs-start-btn').localize();
	        	$('#fs-start-btn').removeClass('fs-start-btn');
	        	$('#fs-start-btn').addClass('fs-stop-btn');
	        	$('#edit-btn').hide();
	        	$('#add-btn').hide();
	        	//$('#panelList').hide();
	        	$('#currentPanelItem').hide();
	    		
        	}
        },
        fullScreenStop: function(element) {
        	if(document.exitFullscreen){
        		document.exitFullscreen();
        	}else if(document.mozCancelFullScreen){
        		document.mozCancelFullScreen();
        	}else if(document.webkitExitFullscreen){
        		document.webkitExitFullscreen();
        	}else if(document.msExitFullscreen){
        		document.msExitFullscreen();
        	}
        	$('#fs-start-btn').attr("data",'button.dashboard.full_screen_start');
        	$('#fs-start-btn').localize();
        	$('#fs-start-btn').removeClass('fs-stop-btn');
        	$('#fs-start-btn').addClass('fs-start-btn');
        	$('#edit-btn').show();
        	$('#add-btn').show();
        	$('#currentPanelItem').show();
        },
        addPanel: function() {
        	var that = this;
        	panelCheck = true;
        	$('input[type=list]').w2field().set({ id: -1, text: 'None'});
        	var options = {
				buttons: {
		    	  Ok: function() {
		    		if(that.elements.addPanel.valid().invalidCount != 0) return;
		    		that.setAddPanel($(this).popup("getValues"));
		            $(this).popup("close");
		          },
		          Cancel: function() {
		            $(this).popup("close");
		          }
		        },
				title: 'Add Panel',
				width: '500px',
				form: [
					{id: 'panelNamePop', type: 'text', label: 'Panel Name',placeholder: '', value: ''},
				],
        	}
        	
        	$('#addPanel-popup').popup(options);
        	$('#addPanel-popup').popup('open');
        },
        setAddPanel: function(param) {
        	var that = this;
        	console.log(param);
        	var userId = this.elements.userId; 
        	var groupId = this.elements.groupId;
        	var panel = new PanelModel();
        	panel.set("userId", userId);
        	panel.set("groupId", groupId);
        	panel.set("panelName", param.panelNamePop);
        	panel.set("widgetData", []);
        	panel.save({}, {
        	    success: function (model, response) {
        	        that.panelList.fetch();
        	    },
        	    error: function (model, response) {
        	        that.panelList.fetch();
        	    }
        	});
        	
        	
        },
        selectPanel: function(evt) {
        	var select = $(evt.target).children().attr('data') || $(evt.target).attr('data');
        	var count = this.panelList.toJSON().data;
        	
        	if(select != this.elements.currentPanelId) {
        		console.log("click : ",  select);
        		
        		this.elements.currentPanelId = select;
        		this.panelModel.url = this.panelList.url + "/" + select;
        		
            	this.panelModel.fetch();
            	//$("#dashPanelList").hide();
            	this.togglePanelList();
    		}
        	
        	if(evt.isTrigger == undefined){
        		panelMgrSelect = select;
        	}
        	
        	$("#dashPanelList").hide();
        },
       
        pollingPanel : function(evt, polling){
        	var that = this;
        	$('.pollingBtn').val();

        	if(evt != null){        		
        		if(evt.type == "click"){
        			panelCheck = false;
        		}
        	}

        	var list = this.panelList.toJSON().data.data.list;

        	var markup = "";
        	if(list.length < 2 && evt != null) {
        		markup = "Panel이 2개 이상이여야 합니다.";
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+markup+'</div>'+
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
            	$('input[type=list]').w2field().set({ id: -1, text: 'None'});
        		return;

        	}
        	
        	var idList = [];
        	list.forEach(function(item, index){
        		idList.push(list[index].id);
        	});

        	var pollingTime = null;
        	var index = 0;
        	var next = 0;

        	var clickItem = function(evt){		
        		if($('#pollingCombo').w2field() != undefined){        			
        			if($('#pollingCombo').w2field().get().id == -1 || panelCheck == true){
        				$('input[type=list]').w2field().set({ id: -1, text: 'None'});
        				clearInterval(playList);
        			}else{           			
        				if(panelMgrSelect != null){
        					index = Number(panelMgrSelect);
        					next = $.inArray(index, idList);
        					panelMgrSelect = null;
        					if(next == idList.length -1){
        						index = idList[0];
        						$("#dash-panel-"+ index).trigger("click");	
        					}else{
        						index = idList[next + 1];
        						$("#dash-panel-"+ index).trigger("click");
        					}
        				}else if(that.elements.currentPanelId != 0 && panelMgrSelect == null){
        					index = Number(that.elements.currentPanelId);
        					next = $.inArray(index, idList);
        					panelMgrSelect = null;
        					if(next == idList.length -1){
        						index = idList[0];
        						$("#dash-panel-"+ index).trigger("click");	
        					}else{
        						index = idList[next + 1];
        						$("#dash-panel-"+ index).trigger("click");
        					}
        				}else{            				
        					if(next < idList.length){
        						index = idList[next];
        						next++;
        					}else{
        						next = 0;
        						index = idList[next];
        					}
        					$("#dash-panel-"+ index).trigger("click");
        				}
        			}
        		}
        	}

        	//db add
        	if(this.elements.privilege == 1){            		
        		if(polling == null || polling == undefined){            		
        			that.panelModel.url = '/role/change';
        			that.panelModel.set({
        				groupId : that.elements.groupId,
        				polling : $('#pollingCombo').w2field().get().id
        			});
        			
        			that.panelModel.save();
        		}
        	}


        	if($('#pollingCombo').w2field().get().id != -1 || panelCheck != true){
        		if(polling != undefined){
        			if(parseInt(polling) == 100){
        				pollingTime = 10000;
        			}else if(parseInt(polling) == 300){
        				pollingTime = 30000;
        			}else{        				
        				pollingTime = polling * 60000;
        			}
        		}else{       
        			if(parseInt($('#pollingCombo').w2field().get().id) == 100){
        				pollingTime = 10000;
        			}else if(parseInt($('#pollingCombo').w2field().get().id) == 300){
        				pollingTime = 30000;
        			}else{        				
        				pollingTime = $('#pollingCombo').w2field().get().id * 60000;
        			}
        		}
        		if(evt != null){        		
        			if(evt.currentTarget.id == 'stopP'){
        				clearInterval(playList);
        				$('#stopP').hide();
        				$('#playP').show();

        				markup = "Polling Stop.";
        				body = '<div class="w2ui-centered">'+
        				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+markup+'</div>'+
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
        			}else{
            			playList = setInterval(clickItem, pollingTime);
            			$('#playP').hide();
            			$('#stopP').show();

            			markup = "Polling Start.";
            			body = '<div class="w2ui-centered">'+
            			'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+markup+'</div>'+
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
            	}else{
            		playList = setInterval(clickItem, pollingTime);
            	}
        	}
        },
                
        getPanelList: function(model) {
        	var data = model.toJSON().data.data;
        	var list = data.list;
        	var panelIndex = data.index;
        	
        	if(panelIndex != null) {
        		if(this.elements.currentPanelId != -1) this.elements.currentPanelId = panelIndex;
        		//this.elements.currentPanelId = panelIndex;
        	} 
        	        	
        	if(this.elements.currentPanelId == 0 || this.elements.currentPanelId == -1) {
        		if(list != undefined && list.length > 0) {
            		this.panelModel.url = this.panelList.url + "/" +list[0].id;
            		this.panelModel.fetch();
            	}
            	
				//$('#fs-start-btn').localize();
				
				
        	} else {
        		this.panelModel.url = this.panelList.url + "/" +panelIndex;
        		this.panelModel.fetch();
        	}
        	$('#fs-start-btn').localize();
        	this.setPanelCombo();
        },
        
        setPanelCombo: function() {
        	var that = this;
        	var list = this.panelList.toJSON().data.data.list;
        	var currentId = this.elements.currentPanelId 
        	var data = [];
        	
        	var html = "";
        	var titleHtml = '<div id="currentPanelItem" class="mouse-evt" style="color: white;"><span class="title mouse-evt">Title</span>' +
							'<div class="list-btn mouse-evt"></div></div><div id="dashPanelList" class="mouse-evt">' + 
							'<ul id="panelList" class="mouse-evt"></ul></div>';
        	list.forEach(function(val, idx) {
        		html += "<li class='panelItem mouse-evt'><div class='mouse-evt' id='dash-panel-"+val.id+"' data='"+val.id+"'>"+val.panelName+"</div></li>";
        		that.elements.panels[val.id] = val.panelName;
        	});
        	
    		$("#dashSelBox").empty();
        	$("#dashSelBox").append(titleHtml);
        	$("#panelList").append(html);
        	
        	//[TODO current panel save]
        	
        	if(currentId == 0) {
        		if(list.length > 0){        			
        			$("#currentPanelItem .title").text(list[0].panelName);
        			this.elements.currentPanelId = list[0].id;
        		}
        	} else {
        		$("#currentPanelItem .title").text(that.elements.panels[currentId]);
        	}
        	
        },
        getPanel: function(model) {
        	this.elements.seq = 0;
        	if(model != undefined) {
        		var obj = model.toJSON().data;
            	//console.log(obj);
        		if(obj == undefined) return;
            	this.elements.data = obj.widgetData;
            	var panelName = this.elements.panels[this.elements.currentPanelId] || obj.panelName;
            	$("#currentPanelItem .title").text(panelName);
        	}
        	
        	this.panelModel.set("id", this.elements.currentPanelId);
        	this.render();
        },
        getWidgets: function() {
        	var that = this;
        	var widgetList = that.elements.data;
        	var widgetHtml = '';
        	if(widgetList != undefined){        		
        		if(widgetList.length > 0) {
        			widgetHtml = (function(){
        				that.elements.seq = Number(widgetList[widgetList.length-1].widgetId.replace(/[^0-9]/gi,''))+1;
//        				console.log("seq : "+that.elements.seq)
        				var html = '';
        				widgetList.forEach(function(widget) {
        					var line = '<li data-row="'+widget.dataRow+'" data-col="'+widget.dataCol+'" data-sizex="'+widget.dataSizex+'" data-sizey="'+widget.dataSizey+'" '+
        					'data-chart="'+ widget.chart +'" data-id="'+ widget.widgetId +'" data-url="'+ widget.url +'"'+ '" data-title="'+ widget.title +'"'+
        					'" data-kpi-id="'+ widget.kpiId +'"'+'" data-threshold="'+ widget.threshold +'"'+'" data-polling="'+ widget.polling +'"'+
        					'" data-sla-id="'+ widget.slaId +'"'+ '" data-sla-column="'+ widget.slaColumn +'"'+ '" data-sla-unit="'+ widget.slaUnit +'"'+ 
        					'" data-sla-slaLegend="'+ widget.slaLegend + '"'+ '" data-sla-param-severity="'+ widget.slaSeverity + '"'+'class="task-card"><div id="'+widget.widgetId+'" class="widget-component"></div></li>';
        					html += line;
        				});
        				return html;
        			})();
        		} 
        	}
        	
        	this.drawPanel(widgetHtml);
        },
        drawPanel: function(widgetHtml) {
        	var html = '<div class="gridster fxs-theme-blue " >' +
					   //'<div class="fxs-flowlayout-resolutionguide fxs-flowlayout-resolutionguide-3840x2160 fxs-hide-in-normal" style="left: 0px; top: 0px;"></div>' +
					   '<div class="fxs-flowlayout-resolutionguide fxs-flowlayout-resolutionguide-1920x1080 fxs-hide-in-normal" style="left: 0px; top: 0px;"></div>' +
//					   '<div class="fxs-flowlayout-resolutionguide fxs-flowlayout-resolutionguide-1440x900 fxs-hide-in-normal" style="left: 0px; top: 0px;"></div>' +
//					   '<div class="fxs-flowlayout-resolutionguide fxs-flowlayout-resolutionguide-1366x768 fxs-hide-in-normal" style="left: 0px; top: 0px;"></div>' +
//					   '<div class="fxs-flowlayout-resolutionguide fxs-flowlayout-resolutionguide-1024x768 fxs-hide-in-normal" style="left: 0px; top: 0px;"></div>' +
					   '<ul class="task-card-list">' + widgetHtml +'</ul></div>';
			this.$el.find('.content-area').append(html);
			if(sessionStorage.getItem("NAVI_DIRECTION") == "top"){
				//$('.content').css('height', 'calc(100% - 100px)');
//				$('.fxs-flowlayout-resolutionguide-1920x1080').css('height', '853px');
//				$('.fxs-flowlayout-resolutionguide-1440x900').css('height', '773px');
//				$('.fxs-flowlayout-resolutionguide-1366x768').css('height', '541px');
//				$('.fxs-flowlayout-resolutionguide-1024x768').css('height', '541px');
				$('.task-card-list').css({height:"calc(100% - 35px)", 'min-height':"calc(100% - 35px)"});
				$('.task-card-list').fadeOut(0).fadeIn('slow');
			}

			this.start();
        },
        render: function() {
        	if(this.$el.find('.content-area .gridster').length > 0) {
        		this.stopPolling();
        		this.$el.find('.content-area .gridster').remove();
        	}
        	
        	this.getWidgets();
        },
        setComponent: function() {
        	this.elements.data.forEach(function(widget) {
        		var option = {chartType: widget.chart, url: widget.url, width: widget.width, height: widget.height, loading: true, title: widget.title};
        		if(widget.chart == 'custom') {
        			$("#"+widget.widgetId).custom(option);
        		} else if(widget.chart == 'video') {
        			$("#"+widget.widgetId).video(option);
        		} else if(widget.chart == 'sla'){
        			$("#"+widget.widgetId).sla(option);
        		} else {
            		$("#"+widget.widgetId).component(option);
        		}
        	})
        	
        },
        start: function() {
        	var that = this;
        	var widgetWidth = 440;
        	var widgetHeight = 260
        	gridster = $(".gridster ul").gridster({  ///
                widget_base_dimensions: [widgetWidth, widgetHeight],
                widget_margins: [16,16],
                shift_widgets_up: false,
                shift_larger_widgets_down: false,
                min_cols: 1,
                max_cols: 4,
                extra_cols:4,
                max_rows: 3,
                collision: {
                	wait_for_mouseup: true,
                },
                avoid_overlapped_widgets: false,
                helper: 'clone',
                resize: {
                    enabled: true,
                    start: function(e, ui, $widget) {
                    	var orgW = parseInt($("#"+$widget.attr("id")).attr("data-sizex")); //target width
                		var orgH = parseInt($("#"+$widget.attr("id")).attr("data-sizey")); //target height
                    	that.elements.orgWH = {originW:orgW, originH:orgH};
                    	console.log(e);
                    },
                    resize: function(e, ui, $widget) {
                    	//console.log(ui);
                    },
                    stop : function (e, ui, $widget) {
                        $( "#"+$widget.attr("id")+" .gs-resize-handle" ).trigger("click");
                        
                        var targetX = parseInt($("#"+$widget.attr("id")).attr("data-col"));	//x	
                        var targetY = parseInt($("#"+$widget.attr("id")).attr("data-row"));	//y
                		var targetW = parseInt($("#"+$widget.attr("id")).attr("data-sizex")); //width
                		var targetH = parseInt($("#"+$widget.attr("id")).attr("data-sizey")); //height
                        
                		
                        var widgetArr = $(".task-card-list").children("li.task-card").toArray();
                		var arr = []
                    	widgetArr.forEach(function(wid, idx) { 
                    		
                    		if( $(wid).attr("id")!== $widget.attr("id")){
                    			
                    			var dataX = parseInt($(wid).attr("data-col"));
	                    		var dataY = parseInt($(wid).attr("data-row"));			//	
	                    		var dataW = parseInt($(wid).attr("data-sizex"));
	                    		var dataH = parseInt($(wid).attr("data-sizey"));
	                    		
	                    		var alert = 0;
	                    		
	                    		//X축 확인
	                    		if( targetX > dataX ){
	                    			if( (dataX + dataW) > targetX ){
	                    				alert++;
	                    			}
	                    		}else{
	                    			if( (targetX + targetW) > dataX ){
	                    				alert++;
	                    			}
	                    		}
	                    		
	                    		//Y축 확인
	                    		if( targetY > dataY ){
	        						if((dataY+dataH)>targetY){
	        							alert++;
	        						}
	        					}else{
	        						if((targetY+targetH)>dataY){
	        							alert++;
	        						}
	        					}
	                    		
	                    		console.log( "alert > " + alert );
	                    		
	                    		if( alert == 2 ){
	                    			
	                    			if( targetX != dataX ){
	                    				gridster.resize_widget($widget,(dataX-targetX),0);
	                    			}
	                    			
	                    			if( targetY != dataY ){
	                    				gridster.resize_widget($widget,0,(dataY-targetY));
	                    			}
	                    			
	                    			var wh = that.elements.orgWH;
                    				gridster.resize_widget($widget,wh.originW,wh.originH);
	                    			
	                    			setTimeout(function(){
	                    				$( "#"+$widget.attr("id")+" .gs-resize-handle" ).trigger("click");
	                    				
	                    				// trigger event
	                    				//$("#widget5-parent")
	                    				gridster.init();
	                    			}, 300);
	                    		}
	                    		
                    		}
                    		
                    	});
                        
                    }
                },
                draggable: {
                  start: function(event, ui){ 
                	  
              	  },
              	  drag: function(event, ui){
              		  
                  },
              	  stop: function(event, ui){
              	      
              	  }
                }
              }).data('gridster');
        	  
        	  $(".gridster ul")
        	  .on('dragover', false) 
        	  .on('drop', function(ev){
        		   //var col = Math.ceil(ev.offsetX/265);
        		  var col = Math.ceil(ev.offsetX/widgetWidth);
        		   var row = Math.ceil(ev.offsetY/widgetHeight);
        		   //
        		   var evData = ev.originalEvent.dataTransfer.getData("text").replace(/\^/g, " ").split("|");
        		   if(evData[1] == undefined) return;
        		   if(evData[0] == "custom") {
        			   that.addCustomWidget(evData, col, row);
        		   } else if(evData[0] == "video"){
        			   that.addVideoWidget(evData, col, row);
        		   } else if(evData[0] == "sla") {
        			   that.addSlaWidget(evData, col, row);
        		   } else {
        			   that.addKpiWidget(evData, col, row);
        		   }
        	  });
			  this.setComponent();
			  $("#save-btn").unbind("click");
			  $("#edit-btn").unbind("click");
			  $("#save-btn").on("click", function() {
				  that.startPolling();
				  that.save();
			  });
			  $("#edit-btn").on("click", function() {
				  that.stopPolling();
				  that.edit();
			  });
			  this.editMode(false); 
			  this.startPolling(true);
			  
			  
			  if(this.elements.currentPanelId == '1') { ////////////////  default panel edit X 
				  $("#edit-btn").hide();
			  } else {
				  $("#edit-btn").show();
			  }
			  $('.task-card-list').css('padding-left', 0);
        },
        addKpiWidget: function(evData, col, row) {
        	var that = this;
        	var seq = that.elements.seq;
 		    var widgetId = "widget"+seq;
 		    var widget =  gridster.add_widget("<li class=\"task-card\"><div id='"+widgetId+"' class='widget-component'></div></li>",1,1, col, row);
 		    $(widget[0]).attr("data-chart", evData[0]);
 		    //$(widget[0]).attr("data-url",evData[1]);
 		    $(widget[0]).attr("data-kpi-id",evData[1]);
 		    $(widget[0]).attr("data-threshold",evData[4]);
 		    widget[0].draggable	= true;
 		    //
 		    //console.log("widget id = " + widgetId);
 		    $("#"+widgetId).component({chartType:evData[0], url: evData[1], title: evData[3]});
 		   
 		   that.elements.seq += 1;
        },
        addVideoWidget: function(evData, col, row) {
        	var that = this;
        	var seq = that.elements.seq;
 		    var widgetId = "widget"+seq;
 		    var widget =  gridster.add_widget("<li class=\"task-card\"><div id='"+widgetId+"' class='widget-component'></div></li>",1,1, col, row);
 		    $(widget[0]).attr("data-chart", evData[0]);
 		    //$(widget[0]).attr("data-url",evData[1]);
 		    $(widget[0]).attr("data-kpi-id",evData[1]);
 		    widget[0].draggable	= true;
 		    //
 		    //console.log("widget id = " + widgetId);
 		    $("#"+widgetId).video({chartType:evData[0], url: evData[1], title: evData[3]});
 		   
 		    that.elements.seq += 1;
        },
        addCustomWidget: function(evData, col, row) {
        	var that = this;
        	var seq = this.elements.seq;
        	var widgetId = "widget"+seq;
        	
 		    var widget =  gridster.add_widget("<li class=\"task-card\"><div id='"+widgetId+"' class='widget-component'></div></li>",evData[2],evData[3], col, row);
 		    $(widget[0]).attr("data-chart", evData[0]);
		    $(widget[0]).attr("data-url",evData[1]);
 		    widget[0].draggable	= true;
		    //
		    //console.log("widget id = " + widgetId);
 		 //var custWidgetData = "custom|/monitor/widget/gm|2|2";
 		    $("#"+widgetId).custom({chartType:evData[0], url: evData[1], title: evData[4]});
		   
		    this.elements.seq += 1;
        },
        addSlaWidget: function(evData, col, row) {
        	var that = this;
        	var seq = this.elements.seq;
        	var widgetId = "widget"+seq;
        	
 		    var widget =  gridster.add_widget("<li class=\"task-card\"><div id='"+widgetId+"' class='widget-component'></div></li>",evData[2],evData[3], col, row);
 		    $(widget[0]).attr("data-chart", evData[0]);
		    $(widget[0]).attr("data-url",evData[1]);
		    $(widget[0]).attr("data-sla-id",evData[5]);
		    $(widget[0]).attr("data-sla-column",evData[6]);
		    $(widget[0]).attr("data-sla-unit",evData[7]);
		    $(widget[0]).attr("data-sla-legend",evData[8]);
		    $(widget[0]).attr("data-sla-param-severity",evData[9]);
 		    widget[0].draggable	= true;

 		    $("#"+widgetId).sla({chartType:evData[0], url: evData[1], title: evData[4], alarmCode: evData[5], dataColumn: evData[6], unit: evData[7], legend: evData[8], severity: evData[9]});
		   
		    this.elements.seq += 1;
        },
        startPolling: function(first) {
        	var widgets = gridster.$widgets.toArray();
//        	console.log("startPolling");
        	this.setPolling(widgets, 'start', first);
        },
        stopPolling: function() {
        	var widgets = gridster.$widgets.toArray();
//        	console.log("stopPolling");
        	this.setPolling(widgets, 'stop');
        },
        setPolling: function(array, flag, first) {
        	array.forEach(function(parent) {
        		var chart = $(parent).attr("data-chart");
        		var child = $(parent).children()[0];
        		var polling = $(parent).attr('data-polling');
        		var threshold = $(parent).attr('data-threshold');
        		if(chart == 'custom') {
        			if(!first) $(child).custom(flag);
        		} else if(chart == 'video') {
        			$(child).video(flag);
        		} else if(chart == 'sla') {
        			if(!first) $(child).sla(flag);
        		} else {
        			$(child).component(flag, polling, threshold);
        		}
        	})
        },
        edit: function() {
        	panelMgr = this;
        	this.kpiModel.fetch();
        	//this.customModel.fetch();
        	this.editMode(true);
        },
        openWidgetList: function() {
        	var title =  BundleResource.getString("title.dashboard.widgetList");
        	var options = {
    			open: function() {
  		        	var zIdx=2000;
  					$(".ui-widget-overlay").css("z-index", zIdx);
  					$(".ui-dialog").css("z-index", zIdx+1);
  					setTimeout(function() {
  						//$("#widgetList").accordion();
  					}, 100);
  					
  		        },
  		        close: function() {
  					
  				},
  				//position: {at: "right top"},
  				position: {my: "left+124% top-60%"}, // yypark  (original - "left+130%")
  		        width: 300,
  		        height: 640,
  				title: title,
  				resizable: true,
  				modal: false
        	}
        	$('#widgetList').popup(options);
        	$('#widgetList').popup('open');
        	$(".ui-dialog-titlebar-close").css("display","none");
        },
        editMode: function(bool, value) {
        	var pname = $("#currentPanelItem .title").text();
        	if(bool) {
        		//this.kpiModel.fetch();
        		//this.customModel.fetch();
        		$(".gridster .gs-w").css("cursor", "pointer");
        		$("#edit-btn").hide();
        		$(".w2ui-field").css("display", "none");
        		$("#fs-start-btn").hide();
            	$("#save-btn").show();
            	$("#canc-btn").show();
            	//$("#widgetList").show(); /////////////////////////
            	this.openWidgetList();
            	$(".fxs-flowlayout-resolutionguide").show();
            	$(".gridster").addClass("fxs-theme-blue");
            	
            	$(".kpi-widget .gs-resize-handle.gs-resize-handle-both").show();
            	$(".video-widget .gs-resize-handle.gs-resize-handle-both").show();
            	
//            	$("#del-btn").show();
            	$("#del-btn").hide();
            	$("#add-btn").hide();
        		$("#dashSelBox").hide();
        		$("#panelName").show();
        		$("#panelName input").val(pname);
        		$(".close-btn").show();
            	$(".close-btn").on( "click", function() {
        			var parent = $(this).attr("id").replace("btn", "parent")
        			gridster.remove_widget($("#"+parent));
        		});
            	gridster.enable();
            	gridster.resize_api.enable();
            	this.setValidation();
            	this.editModeGrid();
            	panelCheck = true;
            	$('input[type=list]').w2field().set({ id: -1, text: 'None'});
        	} else {
        		$(window).unbind('resize', this.setGridScroll);
        		$('.gridster').css({'overflow': 'hidden'});
        		$(".fxs-flowlayout-resolutionguide").hide();
            	$(".gridster").removeClass("fxs-theme-blue");
        		
            	$(".gs-resize-handle.gs-resize-handle-both").hide();
            	
        		$(".gridster .gs-w").css("cursor", "default");
//        		$("#del-btn").hide();
        		$("#del-btn").show();
        		$("#add-btn").show();
        		$("#fs-start-btn").show();
        		//$("#save-btn").hide();
        		$("#dashSelBox").show();
        		$("#panelName").hide();
        		//$("#panelName input").val();
        		$(".close-btn").hide();
        		$(".close-btn").unbind("click");
        		if(value != 0){
        			gridster.resize_api.disable();
            		gridster.disable();
        		}
        		$("#edit-btn").show();
        		$(".w2ui-field").css("display", "");
        		
            	$("#save-btn").hide();
            	$("#canc-btn").hide();
            	$(".chartItem").unbind("dragstart");
            	$("#kpiWidgetList").empty();
            	$("#customWidgetList").empty();
            	$("#slaWidgetList").empty();
            	//$("#widgetList").hide(); /////////////////////////
            	if($('.ui-dialog').length > 0) $('#widgetList').popup('close');
            	//this.resetListPosition();
            	var validate = this.elements.validate;
            	if(validate != undefined) validate.init();
            	panelCheck = false;
            	$("#slaWidgetList").tree('destroy');
        	}
        	
        },
        editModeGrid: function() {
        	var _this = this;
        	this.setGridScroll();
        	$(window).on('resize', _this.setGridScroll);
        },
        setGridScroll: function() {
        	//var gridHeight = Number($('.content-area').css('height').replace('px','')) - 20;
        	var gridHeight = Number($('.content-area').css('height').replace('px','')) - 4;
        	var gridWidth = Number($('.content-area').css('width').replace('px',''));
        	$('.gridster').css({
        		'overflow-y': 'auto',
        		'height': gridHeight,
        		'width': gridWidth
        	});
        },
        openKpiWidgetList: function(model) {
        	var widgetArr = model.toJSON().data;
        	$("#kpiWidgetList").empty();
        	widgetArr.forEach(function(widget) {
        		//if(widget.chartType == 'table') return;
        		var widgetData = widget.chartType + '|' + widget.id + '|' + widget.polling + '|' + widget.kpiTitle + '|' + widget.threshold + '|';
        		widgetData = widgetData.replace(/ /g, "^");
        		console.log(widgetData);
        		if(widget.chartType == "table"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fas fa-table'></i></div></div>");
        		} else if(widget.chartType == "pie"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fas fa-chart-pie'></i></div></div>");
        		} else if(widget.chartType == "bar"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fas fa-chart-bar'></i></div></div>");
        		} else if(widget.chartType == "line"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fas fa-chart-line'></i></div></div>");
        		} else if(widget.chartType == "//video"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fab fa-video'></i></div></div>");
        		} else if(widget.chartType == "stkline"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fab fa-chart_line3'></i></div></div>");
        		} else if(widget.chartType == "stkarea"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fab fa-chart_line4'></i></div></div>");
        		} else if(widget.chartType == "stkbar"){
        			$("#kpiWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'><i class='icon link fab fa-chart_line3'></i></div></div>");
        		}
        		
//        		$("#kpiWidgetList").append("<div style=color:white; ><span draggable='true' class='chartItem' widget-data="+widgetData+">"+widget.kpiTitle+"</span><div class='"+widget.chartType+"-item'></div></div>");
        	});
        	$("#kpiWidgetList .chartItem").unbind("dragstart");
        	$("#kpiWidgetList .chartItem").on("dragstart", function (ev) {
        		var widgetData = $(ev.target).attr('widget-data');
        		//ev.originalEvent.dataTransfer.setData("text/plain", widgetData);
        		
        		ev.originalEvent.dataTransfer.setData("Text", widgetData);
        	});
        	this.customModel.fetch();
        },
        openCustomWidgetList: function(model) {
        	var widgetArr = model.toJSON().data;
        	$("#customWidgetList").empty();
        	/*
        	var custWidgetData = "custom|js/monitor/widget/GmWidget|2|2";
        	$("#widgetList").append("<div><span draggable='true' class='chartItem' widget-data="+custWidgetData+">"+"test1"+"</span><div>");
        	*/
        	widgetArr.forEach(function(widget) {
        		var widgetData = widget.chartType + '|' + widget.url + '|' + widget.width + '|' + widget.height + '|' + widget.customTitle;
        		widgetData = widgetData.replace(/ /g, "^");
        		$("#customWidgetList").append("<div style=color:white; draggable='true' class='chartItem' widget-data="+widgetData+"><span>"+widget.customTitle+"</span><div class='custom-item'><i class='icon link fab fa-user_setting'></i></div></div>");
        	});
        	$("#customWidgetList .chartItem").unbind("dragstart");
        	$("#customWidgetList .chartItem").on("dragstart", function (ev) {
        		var widgetData = $(ev.target).attr('widget-data');
        		ev.originalEvent.dataTransfer.setData("Text", widgetData);
        	});
        	$("#widgetList").accordion({collapsible: true});
        	this.slaModel.fetch();
        },
        openSlaWidgetList: function(model) {
        	var _this = this;
        	var slaWidget_model = new SlaModel();
        	
        	slaWidget_model.url = "/dashboard/slawidgets/categoryList";
        	slaWidget_model.save(null, {
	              success: function(xml, response) {
						var that = _this;  
			        	var widgetArr = model.toJSON().data;
			    		var categoryInfo = new Object();
			    		var typeInfo = new Object();
			    		var piInfo = new Object();
			    		var categoryArray = new Array();
			    		var typeArray = new Array();
			    		var piArray = new Array();
			    		var categoryChildNode = new Array();
			    		var data = xml.toJSON().data.data;
			    		
			    		$("#slaWidgetList").empty();
			    		
			    		if(data.slaWidgetList.length > 0) {
			    			for(var i = 0; i < data.slaWidgetList.length; i++) {
			    				if(data.slaWidgetList[i].display == 'on') {
	        						categoryInfo.name = data.slaWidgetList[i].name;
	        						categoryInfo.id = data.slaWidgetList[i].value;
	        						for(var j = 0; j < data.slaWidgetList[i].typeList.length; j++) {
	        							if(data.slaWidgetList[i].typeList[j].display == 'on') {
	        								typeInfo.name = data.slaWidgetList[i].typeList[j].name;
	        								typeInfo.id = data.slaWidgetList[i].typeList[j].value;
	        								for(var k = 0; k < data.slaWidgetList[i].typeList[j].piList.length; k++) {
	        									if(data.slaWidgetList[i].typeList[j].piList[k].display == 'on') {
	        										var alarmCode = data.slaWidgetList[i].typeList[j].piList[k].value;
	        										var name = data.slaWidgetList[i].typeList[j].piList[k].name;
	        										var id = data.slaWidgetList[i].typeList[j].piList[k].value;
		        									widgetArr.forEach(function(widget) {
			        									if(alarmCode == widget.displayCode) {
			    							        		var widgetData = widget.chartType + '|' + widget.url + '|' + widget.width + '|' + widget.height + '|' + widget.slaTitle + '|' + widget.alarmCode + '|' + widget.dataColumn + '|' + widget.unit + '|' + widget.legend + '|' + widget.displayCode;
			    							        		widgetData = widgetData.replace(/ /g, "^");

			    							        		piInfo.name = name;
			    							        		piInfo.id = id;
			    							        		piInfo.widgetData = widgetData;
			    							        		piArray.push(piInfo);
			    							        		
			    							        		piInfo = new Object();
			    						        		}
		        						        	});
	        									}
	        								}
	        								typeInfo.children = piArray;
	        								if(typeInfo.children.length > 0){
		        								typeArray.push(typeInfo);
	        								}
	        								piArray = new Array();
			        						typeInfo = new Object();
	        							}
	        						}
			        				categoryInfo.children = typeArray;
	        						if(categoryInfo.children.length > 0){
				        				categoryArray.push(categoryInfo);
	        						}
			        				typeArray = new Array();
			        				categoryInfo = new Object();	        						
			    				}
			    			};
			    		}
			        	$('#slaWidgetList').tree({
			        	    data: categoryArray,
			        	    slide: false,
			        	    autoOpen: 0,
			        	    openedIcon: '-',
			        	    closedIcon: '+'
			        	});
			        	
			        	$("#slaWidgetList .chartItem").unbind("dragstart");
			        	$("#slaWidgetList .chartItem").on("dragstart", function (ev) {
			        		var widgetData = $(ev.target).attr('widget-data');
			        		ev.originalEvent.dataTransfer.setData("Text", widgetData);
			        	});
			        	$("#widgetList").accordion({collapsible: true});			    		
	              },
	              error: function(userModel, response) {
	            	  
	              }
	          });
        },
        closeWidgetList: function() {
        	$("#edit-btn").show();
        	$("#save-btn").hide();
        	$(".chartItem").unbind("dragstart");
        	$("#kpiWidgetList").empty();
        	$("#customWidgetList").empty();
        	$("#slaWidgetList").empty();
        	$("#widgetList").hide();
        },
        save: function() {
        	if(this.elements.validate.valid().invalidCount != 0) return;
        	var that = this;
        	var old = this.elements.data.length;
        	this.elements.data = (function() {
        		var widgetArr = $(".task-card-list").children("li.task-card").toArray();
        		var arr = []
            	widgetArr.forEach(function(wid, idx) { 
            		var dataRow = $(wid).attr("data-row");
            		var dataCol = $(wid).attr("data-col");
            		var dataSizex = $(wid).attr("data-sizex");
            		var dataSizey = $(wid).attr("data-sizey");
            		var chart = $(wid).attr("data-chart");
            		var url = $(wid).attr("data-url");
            		var kpiId = $(wid).attr("data-kpi-id");
            		var slaId = $(wid).attr("data-sla-id");
            		var slaColumn = $(wid).attr("data-sla-column"); 
            		var slaUnit = $(wid).attr("data-sla-unit");    
            		var slaLegend = $(wid).attr("data-sla-legend");  
            		var slaSeverity = $(wid).attr("data-sla-param-severity");
            		
            		if(kpiId == 'null' || kpiId == '') {
            			kpiId =  0;
            		}
            		if(slaId == 'null' || slaId == '') {
            			slaId =  0;
            		}
            		
            		if(slaColumn == 'null' || slaColumn == '') {
            			slaColumn =  0;
            		}    
            		
            		if(slaUnit == 'null' || slaUnit == '') {
            			slaUnit =  0;
            		} 
            		
            		if(slaLegend == 'null' || slaLegend == '') {
            			slaLegend =  0;
            		}
            		
            		if(slaSeverity == 'null' || slaSeverity == '') {
            			slaSeverity =  0;
            		}
            		
            		var title = $(wid).find('.widget-title').text();
            		
            		var widgetId = (function() {
            			//var id = $(wid+" .widget-component").attr("data-id");
            			var id = $(wid).find('.widget-component').attr("id");
            			if(id != undefined) {
            				return id;
            			} else {
            				var seq = that.elements.seq;
            				console.log("seq : " + seq);
            				that.elements.seq +=1;
            				return 'widget'+seq;
            			}
            		})();
            		arr.push({dataRow:dataRow, dataCol:dataCol, dataSizex:dataSizex, dataSizey:dataSizey, widgetId:widgetId, chart:chart, url:url, kpiId: kpiId, title: title, slaId: slaId, slaColumn: slaColumn, slaUnit: slaUnit, slaLegend: slaLegend, slaSeverity: slaSeverity});
            	});
        		return arr;
        	})();
        	//this.closeWidgetList();
        	this.elements.data.forEach(function(val) {
        		console.log("=============================");
        		console.log(val.widgetId);
        		console.log(val.chart);
        		console.log(val.url);
        	});
        	console.log(new Date()+ " old ==> " + old + " new ==> " + this.elements.data.length);
        	//console.log(this.panelModel);
        	
        	var pname = $("#panelName input").val();
        	
        	$("#currentPanelItem .title").text(pname);
        	$("#dash-panel-"+this.elements.currentPanelId).text(pname);
        	
        	this.panelModel.set("data", undefined);
        	this.panelModel.set("panelName", pname);
        	this.panelModel.set("userId",this.elements.userId);
        	this.panelModel.set("widgetData", this.elements.data);
        	this.panelModel.save();
        	
        	this.editMode(false);
        },
        setValidation: function() {
        	var rules = {
    			'dashboard-panel-name': {require: true, max:50},
        	}
        	var messages = {
        		'dashboard-panel-name': '패널명이 입력되지 않았습니다.',
        	}
        	this.elements.validate = new Validate(rules, messages, 'bottom');
        },
        setAddValidation: function() {
        	var rules = {
        		'panelNamePop': {require: true, max:16},
            }
            var messages = {
            	'panelNamePop': '패널명이 입력되지 않았습니다.',
            }
        	this.elements.addPanel = new Validate(rules, messages, 'bottom');
        },
        destroy: function() {
        	console.log('Dashboard destroy');
        	
        	// -------------Destory Event Viewer -----------
        	if(w2ui['eventViewerGridGrid']){
        		w2ui['eventViewerGridGrid'].destroy();
        	}
        	$("#btnTop").css('display','block');
			$("#btnDown").css('display','none');        			
			$("#foot").animate({bottom:38}, 500, function(){$('#eventViewerGrid').css('display','none')});   
        	this.footer.$el.find('#foot').empty();
        	this.footer.destroy();
        	//------------------------------------------------
        	
        	this.editMode(false,0);
        	this.removeEventListener();
        	this.undelegateEvents();
        	//$(this.el).off("click", "#fs-start-btn");
        	//clearTimeout(this.elements.timer);
        }
    })

    return Dash;
});