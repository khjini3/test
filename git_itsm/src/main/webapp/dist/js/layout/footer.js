define([
    "jquery",
    "underscore",
    "backbone",
	"text!views/main/footer",
	'js/lib/component/BundleResource',
	"observer",
    "css!cs/idc/idc"
],function(
    $,
    _,
    Backbone,
    FootViewJSP,
    BundleResource,
    Observer
){
	var _this;
	var pollingTimeout;
	
	var Model = Backbone.Model.extend({});
	
	var AlarmModel = Backbone.Model.extend({
		urlRoot : "alarmModel",
		idAttribute : "seqNo"
    });
	
	var CurrentAlarmModel = Backbone.Model.extend({ 
		url: '/currentAlarm',
		parse: function(result) {
			return {data: result};
		}
	});
	
	var AlarmCollection = Backbone.Collection.extend({
		model : AlarmModel ,
		url : "alarmModel",
		parse : function(result){
			return result.data["EVENT.DATA"];
		}
    });
	
    var Footer = Backbone.View.extend({
        el: 'body',
    	initialize : function () {
    		//var _this = this;
    		_this = this;
			this.$el.find('#foot').append(FootViewJSP);
			this.soundFlag = true;
			this.pollingFlag = true;
    		this.elements = {
    		};
    		this.render();
    		this.getCurrentAlarm();
    		this.eventListenerRegister();
			this.start();
			
    		/*this.initAlarmManager().then(function(seq){
    			_this.wsConnect(seq);
    		});*/
        },
        initAlarmManager : function(){
			var dfd = new $.Deferred();
			var that = this;
			
			this.alarmCollection = new AlarmCollection();
			this.alarmCollection.fetch({
				success : function(collection, res, req){
					var _that = that;
					// Set Node Alarm Map
					console.log("alarmCollection", arguments);
					var updatedNEs = [];
					//var events = [];
					for(var i=0, len = collection.length; i<len; i++){
						var model = collection.at(i);
						var dn = that._putNeAlarm(model)
						if(!_.isUndefined(dn)){
							updatedNEs.push(dn);
						}
					}
					//console.log("Alarm Map", that.NODES_MAP)
					dfd.resolve({
						seqNo :res.data["SEQ.NO"],
						clientId : res.data["CLIENT.ID"]
					});
					/*
					var evtStr = (function() {
						var model = collection.at(collection.length-1);
						var result = "";
						if(model != undefined) {
							model.attributes.alarmId +" | "+                      
							_that.getGrade(model.attributes.severity) + " | " +   
							model.attributes.probcauseStr + " | " +               
							model.attributes.alarmTime;
						}
						                           
						return result;
								  
					})();
					*/
					//$(".eventViewerBtn").text(evtStr);
				},
				error : function(){
					console.error("Failed to Get Alarm List ", arguments);
					dfd.reject();
				}
			});
			
			return dfd.promise();
		},
		
		start : function(){
			this.startPolling();
		},
		
		startPolling : function(){
			this.pollingTimeout = setInterval(function(){
				_this.getList();
			}, 10000); // 10 Seconds
		},
		
		stopPolling : function(){
			clearInterval(this.pollingTimeout);
		},
		
		getCurrentAlarm : function(){
			this.currentAlarmModel = new CurrentAlarmModel();
			this.currentAlarmModel.url += '/selectCurrentAlarm';
			this.listenTo(this.currentAlarmModel, 'sync', this.addData);
			this.getList();
		},
		
		getList : function(){
			this.currentAlarmModel.set({'severity' : "-1"});
			this.currentAlarmModel.save();
		},
		
		_putNeAlarm : function(model, level){
			var dn = "";
			for(var i=0; i<10; i++){
				var key = "lvl"+ (i+1) + "Id";
				if(level == true){
					key = "level"+ (i+1) + "_id";
				}
				var id = model.get(key);
				
				if(id != -1 && i == 0){
					dn += id;
				}else if(id != -1){
					dn += "." + id;
				}
			}
			
			if(dn == ""){
				return;
			}
			
			var severity = model.get("severity");
			var alarmKey = model.get("alarmKeyString");
			var result = [];
			result.push(dn);
			
			if(_.isUndefined(this.NODES_MAP[dn])){
				console.error("dn", dn)
			}else{
				if(severity > 10){
					severity -= 10;
					this.NODES_MAP[dn].list[severity] = _.reject(this.NODES_MAP[dn].list[severity], alarmKey);
					for(var curDn = dn ;_.lastIndexOf(curDn, ".") > -1; ){
						curDn = curDn.slice(0,_.lastIndexOf(curDn, "."))
						this.NODES_MAP[dn].list[severity] = _.reject(this.NODES_MAP[curDn].list[severity], alarmKey);
						result.push(curDn);
					}
				}else{
					this.NODES_MAP[dn].list[severity].push(alarmKey);
					for(var curDn = dn ;_.lastIndexOf(curDn, ".") > -1; ){
						curDn = curDn.slice(0,_.lastIndexOf(curDn, "."))
						this.NODES_MAP[curDn].list[severity].push(alarmKey);
						result.push(curDn);
					}
				}
			}
			
			return result;
		},
        events : {
        	"click .event-viewer" : "gridShow",
        	"click #soundEventBtn" : "soundEventHandler",
            "click .fil-btn" : "clickFilBtn"
        },
        
        eventListenerRegister : function(){
			$(document).on("click", "#allCnt, #criCnt, #maCnt, #miCnt", function(e){

				var severityRank = e.currentTarget.id;
				
        		var rack = 0;
        		switch(severityRank){
	        		case "criCnt":
	        			rack = 1;
	        			break;
	        		case "maCnt":
	        			rack = 2;
	        			break;
	        		case "miCnt":
	        			rack = 3;
	        			break;
	        		case "allCnt":
	        			rack = '';
	        			break;
        		}
        		w2ui["eventViewerGridGrid"].search('severity', rack);
        		
        		if($('#eventViewerGrid').css('display') == "none"){
        			$("#btnTop").css('display','none');
        			$("#btnDown").css('display','block');
        			$("#foot").animate({bottom:350}, 500, this.gridShow);
        			$('#eventViewerGrid').css('display','block');
        			$("#eventDiv").hide();
        		}
			});
		},
		
		soundEventHandler : function(event){
			if($("#soundEventBtn").hasClass('fa-sound_on')){
        		$("#alarmAudio").trigger('pause');
        		$("#soundEventBtn").removeClass('fa-sound_on');
        		$("#soundEventBtn").addClass('fa-sound_off');
        	}else{
        		$("#soundEventBtn").removeClass('fa-sound_off');
        		$("#soundEventBtn").addClass('fa-sound_on');
        		if(this.soundFlag){
            		$("#alarmAudio").trigger('play');
            	}
        	}
		},
		
        _updateNodeMap : function(dnArr){
			dnArr = _.union.apply(_,dnArr);
			for(var i=0, len = dnArr.length; i<len;i++){
				var dn = dnArr[i];
				if(!_.isUndefined(this.NODES_MAP[dn])){
					var severity = 0;
					for(var j=0; j<4; j++){
						var severityArrLength =this.NODES_MAP[dn].list[j+1].length; 
						if(severityArrLength > 0){
							severity = j+1;
							break;
						} 
					}
					
					this.NODES_MAP[dn].severity = severity;
				}
			}
			
			_.each(this.observers, function(observer, key) {
				if (_.isFunction(observer)) {
					observer.call(this, dnArr);
				}
			});
		},
        /*wsConnect : function(seq) {
        	var sendData = {
        			
        			"loginIp": sessionStorage.IP_ADDRESS, 
        			//"resState": "", 
        			"loginId": sessionStorage.LOGIN_ID,
        			
        			loginId : null,
					loginIp : null,
        			"clientId": seq.clientId, 
        			//"dn": "", 
        			"seqNo": seq.seqNo || "1", 
        			//"data": ""
        		}
        	//var url = window.location.pathname.replace("main", "")+ 'pushEvent' + "?LOGIN_ID="+sessionStorage.LOGIN_ID;
        	var url = window.location.pathname.replace("main", "")+ 'pollingEvent' + "?LOGIN_ID="+sessionStorage.LOGIN_ID;
        	window.eventPolling = new Observer(url, sendData);
        	//window.eventPolling.add("evtPoll", this.pushData);
        	window.eventPolling.add("evtPoll", this.addData);
        },*/
        /*getGrade : function(sv) {
        	switch(Number(sv)) {
	        	case 1 :
					return 'CRITICAL';
					break;
				case 2 :
					return 'MAJOR';
					break;
				case 3 :
					return 'MINOR';
					break;
				case 4 :
					return 'WARNING';
					break;
				case 5 :
					return 'INDETERMINATE';
					break;
				case 11 :
				case 12 :
				case 13 :
					return 'CLEARED';
					break;
				default :
					return 'NORMAL';
					break;
        	}
        },*/
       addData : function(data) {
        	var that = this;
        	var result = data.toJSON().data.data.data;
        	
        	w2ui['eventViewerGridGrid'].records = result;
        	w2ui['eventViewerGridGrid'].refresh();
        	this.setEventCount();
//        	this.setPreviewEvent();
        },
        
        setEventCount : function(){
        	var curCriCnt = w2ui['eventViewerGridGrid'].find({severity:1}).length;
			var curMaCnt = w2ui['eventViewerGridGrid'].find({severity:2}).length;
			var curMiCnt = w2ui['eventViewerGridGrid'].find({severity:3}).length;
			var curAllCnt = w2ui["eventViewerGridGrid"].records.length;

			$("#criCnt").animateNumber({number :curCriCnt});
			$("#maCnt").animateNumber({number: curMaCnt});
			$("#miCnt").animateNumber({number: curMiCnt});
			$("#allCnt").animateNumber({number: curAllCnt});
			
			if(curCriCnt > 0){
				this.soundFlag = true;
				/*$("#btnTop").css('display','none');
    			$("#btnDown").css('display','');*/
    			
				if($("#soundEventBtn").hasClass('fa-sound_off')){
					$("#alarmAudio").trigger('pause');
				}else{
					$("#alarmAudio").trigger('play'); // alarm play
				}
    			
    			//$("#eventViewerGrid").animate({bottom:0}, 500);
			}else{
				this.soundFlag = false;
				$("#alarmAudio").trigger('pause'); // alarm pause
			}
        },
        
       /* setPreviewEvent : function(){
        	var firstData = w2ui['eventViewerGridGrid'].records[0];
        	$("#eventDiv").text("");
        	if(firstData == undefined || firstData == null) return;
        	var grade, ackType, code, location, probCause, time, result, imgName = null;
        	//grade = '<div class="div-icon Critical" style="background : #ea1c22; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Critical</div>';
        	ackType = firstData.ack_type;
        	code = firstData.alarm_id;
        	location = firstData.location_alias;
        	probCause = firstData.probcause_str;
        	time = firstData.alarm_time;
        	
        	switch(firstData.severity){
				case 1:
					imgName = "CRITICAL";
					break;
				case 2:
					imgName = "MAJOR";
					break;
				case 3:
					imgName = "MINOR";
					break;
				case 4:
					imgName = "WARNING";
					break;
				case 5:
					imgName = "Indeterminate";
					break;
				default :
					return "";
					break;
			}
        	grade =  util.getDivIcon(imgName);
		
        	switch(firstData.ack_type){
				case 2:
					ackType = "Ack";
					break;
				default : 
					ackType = "Unack";
					break;
			}
        	
        	result = "<div>&nbsp;|&nbsp;"+ackType+"&nbsp;|&nbsp;"+code+" | "+location+" | "+probCause+" | "+time+"</div>";
        	$("#eventDiv").append(grade).append(result);
        	$(".div-icon").css("float","left");
        	$(".div-icon").css("text-align","center");
        },*/
        
        pushData : function(data) {
        	var that = this;
        	console.log(data);
        	
        	var arr = data.replace("[","").replace("]","").split("/");
        	//var cnt = w2ui.eventViewerGridGrid.records.length + 1;
        	
        	var grade = (function() {
        		
        		var sv = arr[3].replace(/\s$/gi, "");
        		switch(Number(sv)) {
	        		case 1 :
	    				return 'CRITICAL';
	    				break;
	    			case 2 :
	    				return 'MAJOR';
	    				break;
	    			case 3 :
	    				return 'MINOR';
	    				break;
	    			case 4 :
	    				return 'WARNING';
	    				break;
	    			case 5 :
	    				return 'INDETERMINATE';
	    				break;
	    			case 11 :
	    			case 12 :
	    			case 13 :
	    				return 'CLEARED';
	    				break;
	    			default :
	    				return 'NORMAL';
	    				break;
        		}
        		
        	})();
        	
        	var alarmTime = arr[1].replace(/\s$/gi, "");
        	var displayType = arr[2].replace(/\s$/gi, "");
        	var clearType = arr[4].replace(/\s$/gi, "");
        	var ackType = arr[5].replace(/\s$/gi, "");
        	var alarmId = arr[6].replace(/\s$/gi, "");
        	var probcauseStr = arr[7].replace(/\s$/gi, "");
        	var locationAlias = arr[8].replace(/\s$/gi, "");
        	
        	var evtObj = {
        		id: arr[0].trim(),
        		alarmTime :  alarmTime,                                                           
        		displayType : displayType,                                                          
        		severity : grade,                                                      
        		clearType : clearType,                                                          
        		ackType : ackType,                                                            
        		alarmId : alarmId,                                                            
        		probcauseStr : probcauseStr,                                                        
        		locationAlias : locationAlias                                                      
        	};
        	var evtStr =  alarmId +" | "+ grade +" | "+ probcauseStr + " | " + alarmTime
        	console.log(evtObj);
        	
        	w2ui.eventViewerGridGrid.add(evtObj);
        	
        	//$("#bottom-evtBtn").text(evtStr);
        },
        render: function() {
        	var _this = this;
        	this.renderGrid();
        },
        setData : function(dataObj) {
        	console.log("Test");
        },
        getData : function(model) {
        	var data = model.toJSON().data;
        	var grid = this.$el.find('#eventViewerGrid');
        	if(grid.find('table').length != 0) {
        		this.$el.find(grid).grid('update', data.data.data);
        	} else {
        		this.renderGrid(data);
        	}
        },
        /*clickEvtBtn: function(evt) {
        	var target = evt.target;
        	var severity = $(target).attr('severity');
        	if(severity == 'all') {
        		w2ui['eventViewerGridGrid'].search();
        	} else {
        		w2ui['eventViewerGridGrid'].search('severity', severity);
        	}
        },*/
        clickFilBtn: function(evt) {
        	var target = evt.target;
        	var severity = $(target).attr('severity');
        	if(severity == 'all') {
        		w2ui['eventViewerGridGrid'].search();
        	} else {
        		w2ui['eventViewerGridGrid'].search('severity', severity);
        	}
        },
        renderGrid: function(data) {
        	
        	var buttonTop = $('<img />', {
        		id:'btnTop',
        		src : 'dist/img/idc/btn/event_up_btn.png',
        		click: function(e){
        			$("#btnTop").css('display','none');
        			$("#btnDown").css('display','block');
        			$("#foot").animate({bottom:350}, 500, this.gridShow);
        			$('#eventViewerGrid').css('display','block');
        			w2ui["eventViewerGridGrid"].search('severity', '');
        			$("#eventDiv").hide();
        		}
        	});
        	
        	var buttonDown = $('<img />', {
        		id:'btnDown',
        		src : 'dist/img/idc/btn/event_down_btn.png',
        		click: function(e){
        			$("#btnTop").css('display','block');
        			$("#btnDown").css('display','none');        			
        			$("#foot").animate({bottom:38}, 500, function(){$('#eventViewerGrid').css('display','none')});
        			$("#eventDiv").show();
        		},
        		style : 'display:none;'
        	});
        	
        	$("#topDownDiv").append(buttonTop, buttonDown);
        	
        	var eventBrowerContents = 
	   			/* Alarm Audio Setting */
	   			'<audio id="alarmAudio" controls loop style="display:none;">'+
	   		    '<source src="dist/sounds/alarm.mp3" type="audio/mpeg">'+
	   			'</audio>'+
	   			/* Alarm Button */
    	   		'<div class="severityBtnCls" style="text-align:center;padding:5px;width:50px;">'+
    	   		/*'<button class="severityBtn" id="soundBtn" type="button" style="width: 82px;height: 100%;background-color: #000;border: none;">sound off</button>'+*/
    	   		'<i class="severityBtn fab fa-sound_on" id="soundEventBtn"></i>'+
	        	'</div>'+
	        	'<div class="severityBtnCls">'+
	        	'<img src="dist/img/idc/btn/ack_btn_img.png" class="severityBtn" id="ackBtn">'+
	        	'</div>'+
	        	'<div class="severityBtnCls">'+
	        	'<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">'+
	        	'<div class="severityTxt" id="allCnt">0</div>'+
	        	'</div>'+
	        	'<div class="severityBtnCls">'+
	        	'<img src="dist/img/idc/btn/alarm_cr.png" class="severityBtn">'+
	        	'<div class="severityTxt" id="criCnt">0</div>'+
	        	'</div>'+
	        	'<div class="severityBtnCls">'+
	        	'<img src="dist/img/idc/btn/alarm_ma.png" class="severityBtn">'+
	        	'<div class="severityTxt" id="maCnt">0</div>'+
	        	'</div>'+
	        	'<div class="severityBtnCls">'+
	        	'<img src="dist/img/idc/btn/alarm_mi.png" class="severityBtn">'+
	        	'<div class="severityTxt" id="miCnt">0</div>'+
	        	'</div>';
        	
        	$("#severityDiv").append(eventBrowerContents);
        	
        	var header = '<div class="evtGridTop"><span><b>Event Viewer</b></span><button class="eventViewerBtn" style="float: right">X</button></div>'
        	var btnHtml = "<div id='evtBtns' class='evtGridTop'>" + 
        				"<button class='evt-btn' severity='all' id='btn-all'>All</button>" +
        				"<button class='evt-btn' severity='critical' id='btn-cri'>Critical</button>" +
        				"<button class='evt-btn' severity='major' id='btn-maj'>Major</button>" +
        				"<button class='evt-btn' severity='minor' id='btn-min'>Minor</button>" +
        				"<button class='evt-btn' severity='warning' id='btn-nor'>Warning</button>" +
        				"<button class='evt-btn' severity='indeterminate' id='btn-ind'>Indeterminate</button>" +
        				"<button class='evt-btn' severity='cleared' id='btn-clr'>Cleared</button>" +
        				"</div>";
        	var filbtnHtml = "<div id='evtfilterBtns' class='evtGridTop'>" + 
						"<button class='fil-btn' severity='all' id='fil-all'>All</button>" +
						"<button class='fil-btn' severity='critical' id='fil-cri'>Critical</button>" +
						"<button class='fil-btn' severity='major' id='fil-maj'>Major</button>" +
						"<button class='fil-btn' severity='minor' id='fil-min'>Minor</button>" +
						"<button class='fil-btn' severity='warning' id='fil-nor'>Warning</button>" +
						"<button class='fil-btn' severity='indeterminate' id='fil-ind'>Indeterminate</button>" +
						"<button class='fil-btn' severity='cleared' id='fil-clr'>Cleared</button>" +
						"</div>"
        	//this.$el.find(".event-viewer").append("<div id='evtGrid'>"+header+btnHtml+filbtnHtml+"<div id='eventViewerGrid'></div></div>");
			this.$el.find(".event-viewer").append("<div id='eventViewerGrid'></div>");
        	var columns = [
        		{ field: 'recid', caption: 'id', size: '10px', attr : "align=center", hidden: true},
                { field: 'severity', caption: 'GRADE', size: '120px', attr: "align=center", resizable: false, style:'padding-left:5px;', 
                	render : function(record){
						var imgName = "";
						switch(record.severity){
							case 1:
								imgName = "CRITICAL";
								break;
							case 2:
								imgName = "MAJOR";
								break;
							case 3:
								imgName = "MINOR";
								break;
							case 4:
								imgName = "WARNING";
								break;
							case 5:
								imgName = "Indeterminate";
								break;
							default :
								return "";
								break;
						}
						return util.getDivIcon(imgName);
					}
            	},
            	{ field: 'ack_type', caption: 'ACK TYPE', size: '100px', attr: "align=center", resizable: false, style:'padding-left:5px;',
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
 					}
            	},
                { field: 'alarm_id', caption: 'CODE', size: '120px' , attr: "align=center", resizable: false, style:'padding-left:5px;'},
                { field: 'location_alias', caption: 'LOCATION', size: '50%', attr: "align=left", resizable: false, style:'padding-left:5px;'},
                { field: 'probcause_str', caption: 'PROBABLE CAUSE', size: '50%', resizable: false, style:'padding-left:5px;'},
                { field: 'alarm_time', caption: 'ALARM TIME', size: '200px', attr: "align=center", resizable: false, style:'padding-left:5px;'},
                
            ];
        	var data = [
        		
        	]
        	var showOpt = {
        		selectColumn: false, 
        		recordTitles: false, 
        		toolbar: false,
        		header: false
        	}
        	//var header = '<div><span><b>Event Viewer</b></span><button class="eventViewerBtn" style="float: right">X</button></div>'
            this.$el.find('#eventViewerGrid').grid({columns: columns, show: showOpt, data: data, recordHeight : 25});
        	/*
        	this.$el.find('#eventViewerGrid').grid({
        		columns: columns, 
        		show: showOpt, 
        		header: header, 
        		data: data
        	});
        	*/
        },
        gridShow: function() {
        	//this.$el.find('#evtGrid').toggle(); //filter
        	var target = this.$el.find('#eventViewerGrid'); 
        	//target.toggle();
        	target.grid('refresh');

        },
        
        destroy : function(){
			$(document).off("click", "#allCnt, #criCnt, #maCnt, #miCnt");
			this.stopPolling();
			this.undelegateEvents();
			_this = null;
		},
    })

    return Footer;
});