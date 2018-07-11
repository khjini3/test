define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/loginHistory",
    "css!cs/management/loginHistory",
    "jquery-datetimepicker"
],function(
    $,
    _,
    Backbone,
    JSP
){	
	$(window.document).on("contextmenu", function(event){return false;});
	
	var Model = Backbone.Model.extend({
        model: Model,
        url: 'settings/loginhistory',
        parse: function(result) {
            return {data: result};
        }
    });
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.elements = {
    			scene : null	
    		};
    		this.$el.append(JSP);
    		$("#listNotSelectPopup").hide();
    		this.model = new Model();
    		this.model.fetch();
    		this.listenTo(this.model, "sync", this.setData);
    		var now = new Date();
    		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    		var time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.setTime(23));
    		$("#fromSelect").datetimepicker({format: 'Y-m-d H:i', formatDate: 'Y-m-d', value: today});
    		$("#toSelect").datetimepicker({format: 'Y-m-d H:i', formatDate: 'Y-m-d', value: time});
        },
        setData: function(model) { 
        	var data = model.toJSON();
        	this.render(data);
		},
		render: function(array) {   
			var data = this.dataChange(array);
			
        	var option = {
                    recordHeight: 40,
            	};
            	
            var columns = [
            	//{ field: 'id', caption: 'No', size: '5%' },
                { field: 'loginId', caption: 'Login ID', size: '30%' },
                { field: 'ipAddress', caption: 'IP Address', size: '30%' },
                { field: 'loginTime', caption: 'Login Time', size: '30%' },
                { field: 'logoutTime', caption: 'Logout Time', size: '30%' },
                { field: 'result', caption: 'Result', size: '30%' },
                { field: 'failReason', caption: 'Fail Reason', size: '30%' },
                { field: 'logoutReason', caption: 'Logout Reason', size: '30%' },
            ]; 
                
        	if(array.data.length > 0) {
        		$('#loginHistoryContentList').grid({
        			columns: columns, 
        			data: data,
                    recordHeight: 40,}
        		);
        		
        	}
        	else {
        		$('#loginHistoryContentList').grid({
                    recordHeight: 40,
        		    columns: [
        		    	//{ field: 'id', caption: 'No', size: '5%' },
                        { field: 'loginId', caption: 'Login ID', size: '30%' },
                        { field: 'ipAddress', caption: 'IP Address', size: '30%' },
                        { field: 'loginTime', caption: 'Login Time', size: '30%' },
                        { field: 'logoutTime', caption: 'Logout Time', size: '30%' },
                        { field: 'result', caption: 'Result', size: '30%' },
                        { field: 'failReason', caption: 'Fail Reason', size: '30%' },
                        { field: 'logoutReason', caption: 'Logout Reason', size: '30%' },
                    ]
        		});
        	}
        	$(".loginhistory-select-area input").keydown(function(event){
        		event.preventDefault();
        		if(event.keycode == 8) {
        			return false
        		}
        		return;
        	});
		},
        events: {
        	'click #loginhistorySearchBtn' : 'searchAction'
        },
		searchAction: function() {
			var _this = this;
        	var loginId = $("#searchLoginHistory").val();
        	var sTime = $("#fromSelect").val();
        	var eTime = $("#toSelect").val();
			var model = new Model();
//    		var now = new Date();
//    		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//    		var time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.setTime(23));
//    		$("#fromSelect").datetimepicker({format: 'Y-m-d H:i', formatDate: 'Y-m-d', value: today});
//    		$("#toSelect").datetimepicker({format: 'Y-m-d H:i', formatDate: 'Y-m-d', value: time});
    		
			if(loginId == "" && sTime == "" && eTime == "") {
				$("#searchLoginHistory").val("");
				this.reloadData();
			} else {
				$("#loginHistoryContentList").grid('empty');
				model.set({"loginId":loginId, "loginTime" : sTime, "logoutTime" : eTime});
	        	
	        	model.url = model.url + '/search';
				model.save();
				this.listenTo(model, "sync",
						function() {
							this.refershView(model)
						}
				);
			}

        },
		reloadData: function() {
			$("#loginHistoryContentList").grid('empty');
    		this.model = new Model();
    		this.model.fetch();
    		this.listenTo(this.model, "sync", this.refershView);
		},
        refershView: function(model) {
        	var array = model.toJSON();
        	var data = this.dataChange(array);
        	
//			$("#searchLoginHistory").val("");
        	$("#loginHistoryContentList").grid('update', data);
        },
        addAction : function() {

        	var _this = this;
        	var now = null;
        	var ct = new Date();
        	var month = ct.getMonth() + 1;
        	var day = ct.getDate();
        	var hour = ct.getHours();
        	var minute = ct.getMinutes();
        	var second = ct.getSeconds();
        	if(month < 10) 
        		month = '0' + month;
        	if(day < 10)
        		day = '0' + day;
        	if(hour < 10)
        		hour = '0' + hour;
        	if(minute < 10)
        		minute = '0' + minute;
        	if(second < 10)
        		second = '0' + second;        	
        	
        	now = ct.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        	sessionId = this.model.changed.data.length + 1;
        	loginId = "test" + this.model.changed.data.length + 1;
        	privilege = 1;
        	ipAddress = "10.30.50.70";
        	loginTime = now;
        	lastCheckTime = now;
        	logoutTime = now;
        	var result = 1;
        	var failReason = null;
        	var logoutReason = null;
        	
       	
			_this.model.set({"sessionId":sessionId, "loginId":loginId, "privilege":privilege,"ipAddress":ipAddress, "loginTime":loginTime, "lastCheckTime":lastCheckTime,"logoutTime":logoutTime, "result":result, "failReason":failReason, "logoutReason":logoutReason});
			
			_this.model.save(null, {
	              success: function(model, response) {
	                  _this.reloadData();
	              },
	              error: function(model, response) {
	              }
	          });
        },
        dataChange: function(data) {
			var length = 0;
			
			if(data.data != undefined) {
	            length = data.data.length;
	        }
			
			if(length > 0) {
				for (var i=0; i < length; i++) {
	                
	                switch (data.data[i].result) {
	                    case 1 : 
	                    		data.data[i].result = "Success";
	                            break;
	                    case 2 : 
	                    		data.data[i].result = "Fail";
	                            break;
	                    default :
	                    		data.data[i].result = "Success";
	                            break;
	                };
				}
			}
			return data.data;
        },
        destroy : function() {
//        	$('.content .wrap').off();
        	$('.content .wrap').unbind();
        }
    })

    return Main;
});