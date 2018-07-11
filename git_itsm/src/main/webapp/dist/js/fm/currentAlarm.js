define([
	'jquery',
	'underscore',
	'backbone',
	'text!views/fm/currentAlarm',
	"w2ui",
	'js/lib/component/BundleResource',
	'css!cs/fm/currentAlarm',
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
	var pollingFlag = true;
	var pollingTimeout;
	
	var CurrentAlarmModel = Backbone.Model.extend({ 
		url: '/currentAlarm',
		parse: function(result) {
			return {data: result};
		}
	});
	
	var Main = Backbone.View.extend({
		el : '.content .wrap',
		initialize : function(){
			that = this;
			this.$el.append(JSP);
			this.init();

			that.pollingFlag = true;
			
			this.currentAlarmModel = new CurrentAlarmModel();
			this.listenTo(this.currentAlarmModel, 'sync', this.getData);
			this.currentAlarmModel.url += '/selectCurrentAlarm';
			
			this.getList();
			this.start();
			
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
		
		init : function(){
			$("#contentsDiv").w2layout({
				name : 'currentAlarm_layout',
				panels : [
        			{type:'main', size:'100%', content:'<div id="mainContents"></div>'}
				]
			});
			
			var mainContents = '<div id="mainTop">'+
				'<div id="currentBtnGroup">'+
					'<i id="currentAckBtn" class="icon fab fa-yes-ack fa-2x" aria-hidden="true" disabled="disabled" title="Ack"></i>'+
					'<i id="currentUnackBtn" class="icon fab fa-yes-unack fa-2x" aria-hidden="true" disabled="disabled" title="Unack"></i>'+
				'</div>'+
			'</div>'+
	    	'<div class="dashboard-panel" style="width:100%;">'+
	    		'<div class="dashboard-title">Alarm List'+
	    			'<div id="severityDiv">'+
	    				'<div class="curSeverityBtnCls">'+
	    	        	'<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">'+
	    	        	'<div class="severityTxt" id="curAllCnt">0</div>'+
	    	        	'</div>'+
	    	        	'<div class="curSeverityBtnCls">'+
	    	        	'<img src="dist/img/idc/btn/alarm_cr.png" class="severityBtn">'+ //cr_btn_img
	    	        	'<div class="severityTxt" id="curCriCnt">0</div>'+
	    	        	'</div>'+
	    	        	'<div class="curSeverityBtnCls">'+
	    	        	'<img src="dist/img/idc/btn/alarm_ma.png" class="severityBtn">'+//ma_btn_img
	    	        	'<div class="severityTxt" id="curMaCnt">0</div>'+
	    	        	'</div>'+
	    	        	'<div class="curSeverityBtnCls">'+
	    	        	'<img src="dist/img/idc/btn/alarm_mi.png" class="severityBtn">'+//mi_btn_img
	    	        	'<div class="severityTxt" id="curMiCnt">0</div>'+
	    	        	'</div>'+
	            	'</div>'+ //severityDiv close
	            '</div>'+
	    		'<div class="dashboard-contents">'+
		    		'<div id="mainSubBottom"></div>'+
	    		'</div>'+
	    	'</div>';
			
			$("#mainContents").html(mainContents);
			
			$("#mainSubBottom").w2grid({
				name : 'currentAlarm_table',
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
					{ field: 'recid', caption: 'NO', size : '50px', attr: 'align=center', hidden: true},
					{ field: 'sevetiry', caption: 'GRADE', size : '150px', attr: 'align=center',
						render : function(record){
							var imgName = "";
							switch(record.severity){
								case 1:
									imgName = "Critical";
									break;
								case 2:
									imgName = "Major";
									break;
								case 3:
									imgName = "Minor";
									break;
								case 4:
									imgName = "Warning";
									break;
								case 5:
									imgName = "Indeterminate";
									break;
								default :
									return "";
									break;
							}
							return util.getDivIcon(imgName);
						}},
					{ field: 'ack_type', caption: 'ACK TYPE', size : '150px', sortable: true, attr: 'align=center',
							render : function(record){
         						switch(record.ack_type){
         							case 1:
         								return "Unack";
         								break;
         							case 2:
         								return "Ack";
         								break;
         							default : 
         								return "Unack";
         								break;
         						}
         					}},
					{ field: 'alarm_id', caption: 'CODE', size : '150px', sortable: true, attr: 'align=center'},
					{ field: 'location_alias', caption: 'LOCATION', size : '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'probcause_str', caption: 'PROBABLE CAUSE', size : '450px', sortable: true, attr: 'align=left', style:'padding-left:5px;'},
         			{ field: 'alarm_time', caption: 'ALARM TIME', size : '200px', sortable: true, attr: 'align=center' },
				]
			});
			
			w2ui["currentAlarm_table"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
        		that.validationCheck();
        	});
			
			w2ui["currentAlarm_table"].on({phase: 'before', execute:'after', type : 'select'}, function(event){
        		that.validationCheck();
        	});
			
			w2ui["currentAlarm_table"].on({phase: 'before', execute:'after', type : 'unselect'}, function(event){
        		that.validationCheck();
        	});
			
			this.eventListenerRegister();
			window.ItamObserver.addObserver("curAlarm", function(e){
				switch(e.replace(/"/gi, "")){
					case "changeAckType":
						this.getList();
						break;
				}
			});
		},
		
		validationCheck : function(){
			var selectedItem = w2ui["currentAlarm_table"].get(w2ui["currentAlarm_table"].getSelection()).length;
			if(selectedItem > 0){
				$("#currentAckBtn").prop('disabled', false);
				$("#currentAckBtn").addClass('link');
				$("#currentUnackBtn").prop('disabled', false);
				$("#currentUnackBtn").addClass('link');
			}else{
				$("#currentAckBtn").prop('disabled', true);
				$("#currentAckBtn").removeClass('link');
				$("#currentUnackBtn").prop('disabled', true);
				$("#currentUnackBtn").removeClass('link');
			}
		},
		
		eventListenerRegister : function(){
			$(document).on("click", "#curAllCnt, #curCriCnt, #curMaCnt, #curMiCnt", function(e){

				var severityRank = e.currentTarget.id;
				
        		var rack = 0;
        		switch(severityRank){
	        		case "curCriCnt":
	        			rack = 1;
	        			break;
	        		case "curMaCnt":
	        			rack = 2;
	        			break;
	        		case "curMiCnt":
	        			rack = 3;
	        			break;
	        		case "curAllCnt":
	        			rack = '';
	        			break;
        		}
        		w2ui["currentAlarm_table"].search('severity', rack);
			});
			
			$(document).on("click", "#currentAckBtn", function(){
				that.changeAckTypeConfirm("ackActionOkBtn");
			});
			
			$(document).on("click", "#currentUnackBtn", function(){
				that.changeAckTypeConfirm("unackActionOkBtn");
			});
			$(document).on("click", "#ackActionOkBtn", this.ackAction);
			$(document).on("click", "#unackActionOkBtn", this.unAckAction);
		},
		
		changeAckTypeConfirm : function(action){
			var body = '<div class="w2ui-centered">'+
				'<div class="popup-contents">' + BundleResource.getString('label.currentAlarm.ackTypeEdit') + '</div>'+
				'<div class="popup-btnGroup">'+
					'<button id='+action+' onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.currentAlarm.confirm') + '</button>'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.currentAlarm.cancel') + '</button>'+
				'</div>'+
			'</div>' ;
			w2popup.open({
        		width: 385,
 		        height: 180,
		        title : BundleResource.getString('title.currentAlarm.info'),
		        body: body,
                opacity   : '0.5',
         		modal     : true,
    		    showClose : true
		    });
		},
		
		ackAction : function(){
			that.validationCheck();
			if($("#currentAckBtn").prop('disabled')){
				return;
			}
			var ack_user = sessionStorage.getItem("LOGIN_ID");
			that.changeAckType(2, ack_user);
		},
		
		unAckAction : function(){
			that.validationCheck();
			if($("#currentUnackBtn").prop('disabled')){
				return;
			}
			var ack_user = "";
			that.changeAckType(1, ack_user);
		},
		
		changeAckType : function(ackType, ack_user){
			var that = this;
			var selectedItems = w2ui["currentAlarm_table"].get(w2ui['currentAlarm_table'].getSelection());
			var selectedSeqNo = _.pluck(selectedItems, "seq_no");
			
			var model = new CurrentAlarmModel();
			model.set({
				seq_no : selectedSeqNo,
				ack_type : ackType,
				ack_user : ack_user
			});
			model.url = "settings/eventhistory/changeAckType";
			model.save(null, {
				success : function(model, response){
	            	that.getList();
				},
				error : function(model, response){
					console.log(response);
				}
			});
			
			selectedItems = null;
			selectedSeqNo = null;
		},
		
		getData : function(model){
			var data = model.toJSON().data.data.data;
			//var orgSeq = _.pluck(w2ui['currentAlarm_table'].records, "seq_no");
			//var newSeq = _.pluck(data, "seq_no");
			
			//var compareResult = util.compare(orgSeq, newSeq);
			//if(!compareResult){
				w2ui['currentAlarm_table'].records = data;
				w2ui['currentAlarm_table'].refresh();
				that.setEventCount();
			//}
		},
		
		start: function() {
			that.startPolling();
		},
		
		startPolling: function() {
			that.pollingTimeout = setInterval(function() {
				that.getList();
			}, 10000);
		},
		
		stopPolling: function() {
			clearInterval(that.pollingTimeout);
		},
		
		getList: function() {
			this.currentAlarmModel.set({'severity' : "-1"});
			this.currentAlarmModel.save();
		},
		
		setEventCount : function(){
			var curCriCnt = w2ui['currentAlarm_table'].find({severity:1}).length;
			var curMaCnt = w2ui['currentAlarm_table'].find({severity:2}).length;
			var curMiCnt = w2ui['currentAlarm_table'].find({severity:3}).length;
			var curAllCnt = w2ui["currentAlarm_table"].records.length;
			
			$("#curCriCnt").animateNumber({number :curCriCnt});
			$("#curMaCnt").animateNumber({number: curMaCnt});
			$("#curMiCnt").animateNumber({number: curMiCnt});
			$("#curAllCnt").animateNumber({number: curAllCnt});
		},
		
		/*searchAction : function(){
			this.getList(true);
		},*/
		
		removeEventListener : function(){
			$(document).off("click", "#curAllCnt, #curCriCnt, #curMaCnt, #curMiCnt");
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
			if(w2ui['currentAlarm_layout']){
				w2ui['currentAlarm_layout'].destroy();
			}
			if(w2ui['currentAlarm_table']){
				w2ui['currentAlarm_table'].destroy();
			}
			
			this.stopPolling();
			this.removeEventListener();
			this.undelegateEvents();
		}
		
	});
	
	return Main;
});