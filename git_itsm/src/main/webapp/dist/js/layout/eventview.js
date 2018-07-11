define([
    "jquery",
    "underscore",
    "backbone",
	"text!views/main/footer",
	'js/lib/component/BundleResource',
	"observer",
],function(
    $,
    _,
    Backbone,
    FootViewJSP,
    BundleResource,
    Observer
){
	var Model = Backbone.Model.extend({});
	
	var AlarmModel = Backbone.Model.extend({
		urlRoot : "alarmModel",
		idAttribute : "seqNo"
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
    		var _this = this;
			this.$el.find('#foot').append(FootViewJSP);
    		this.elements = {
    		};
    		this.render();
    		this.initAlarmManager().then(function(seq){
    			_this.wsConnect(seq);
    		});
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
					var evtStr = (function() {
						var model = collection.at(collection.length-1);
						var result = "";
						if(model != undefined) {
							model.attributes.alarmId +" | "+ _that.getGrade(model.attributes.severity) + " | " + model.attributes.probcauseStr + " | " + model.attributes.alarmTime;
						}
						                           
						return result;
								  
					})();
					//$(".eventViewerBtn").text(evtStr);
				},
				error : function(){
					console.error("Failed to Get Alarm List ", arguments);
					dfd.reject();
				}
			});
			
			return dfd.promise();
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
			var alarmKey = model.get("alarmKeyString")
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
        	//"click .eventViewerBtn" : "gridShow",
        	"click .event-viewer" : "gridShow",
            "click .evt-btn" : "clickEvtBtn",
            "click .fil-btn" : "clickFilBtn"
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
        wsConnect : function(seq) {
        	var sendData = {
        			/*
        			"loginIp": sessionStorage.IP_ADDRESS, 
        			//"resState": "", 
        			"loginId": sessionStorage.LOGIN_ID,
        			*/
        			loginId : null,
					loginIp : null,
        			"clientId": seq.clientId, 
        			//"dn": "", 
        			"seqNo": seq.seqNo || "", 
        			//"data": ""
        		}
        	var url = window.location.pathname.replace("main", "")+ 'pollingEvent' + "?LOGIN_ID="+sessionStorage.LOGIN_ID;
        	window.eventPolling = new Observer(url, sendData);
        	window.eventPolling.add("evtPoll", this.addData);
        },
        getGrade : function(sv) {
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
			case 0 :
				return 'CLEARED';
				break;
			default :
				return 'NORMAL';
				break;
        	}
        },
        addData : function(data) {
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
	    			case 0 :
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
        	
        	$("#bottom-evtBtn").text(evtStr);
        },
        render: function() {
        	var _this = this;
        	this.renderGrid();
        },
        setData : function(dataObj) {
        	
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
        clickEvtBtn: function(evt) {
        	var target = evt.target;
        	var severity = $(target).attr('severity');
        	if(severity == 'all') {
        		w2ui['eventViewerGridGrid'].search();
        	} else {
        		w2ui['eventViewerGridGrid'].search('severity', severity);
        	}
        },
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
        		{ field: 'id', caption: 'id', size: '5%', attr : "align=center", hidden: true},
                { field: 'severity', caption: 'Grade', size: '10%', attr: "align=center", resizable: false, 
        		  /*render : function(data) {
            		if(data.severity == 1) {
    						return "Critical";
    					} else if(data.state == 2) {
    						return "Major";
            			} else if(data.state == 3) {
    						return "Minor";
            			}
            		} */
            	},
                { field: 'alarmId', caption: 'Alarm ID', size: '10%' , attr: "align=center", resizable: false},
                { field: 'locationAlias', caption: 'Location', size: '20%', attr: "align=left", resizable: false},
                { field: 'probcauseStr', caption: 'Probable Cause', size: '20%', resizable: false},
                { field: 'alarmTime', caption: 'Time', size: '20%', attr: "align=center", resizable: false},
                { field: 'ackType', caption: 'AckType', size: '10%', attr: "align=center", resizable: false},
            ];
        	var data = [
        		
        	]
        	var showOpt = {
        		selectColumn: false, 
        		recordTitles: false, 
        		toolbar: false,
        		header: true
        	}
        	var header = '<div><span><b>Event Viewer</b></span><button class="eventViewerBtn" style="float: right">X</button></div>'
            this.$el.find('#eventViewerGrid').grid({columns: columns, show: showOpt, header: header, data: data});
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
        	target.toggle();
        	target.grid('refresh');
        }
    })

    return Footer;
});