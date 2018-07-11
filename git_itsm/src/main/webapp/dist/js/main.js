define([
    "jquery",
    "underscore",
    "backbone",
    "js/layout/menu",
    /*"js/layout/footer",*/
    "js/lib/component/BundleResource",
    //"observer",
    "itamObserver",
    "queryloader",
    "fontawesome-all",
    "jqueryNumAni",
    "mapEditor",
    "yesUtil"
],function(
    $,
    _,
    Backbone,
    Menu,
    //Footer,
    BundleResource,
    ItamObserver,
    PushManager,
    map
){
	$("body").queryLoader2({ 
				barColor: "#6e6d73", 
				backgroundColor: "#222b32", 
				percentage: true, 
				barHeight: 12,
				completeAnimation: "grow",  // Options: "grow" or "fade". Default: "fade"
				minimumTime: 500,
				fadeOutTime: 500
	});
	
    $(".wrapper").show();

    var Model = Backbone.Model.extend({
		model:Model,
		url:'notifiCation',
		parse: function(result) {
            return {data: result};
        }
	});
    
    var Main = Backbone.View.extend({
        el: 'body',
    	initialize : function() {
    		util = new util(); //공통 유틸리티
    		itsmUtil = new itsmUtil(); //itsm
    		var _this = this;
    		this.menu = null;
    		this.elements = {
    				
    		};
    		
    		if(sessionStorage.NAVI_DIRECTION === "top" || sessionStorage.NAVI_DIRECTION === "topSide"){
    			this.createTime();
    		}
    		
    		this.sessionExtend();
    		
    		$.ajaxSetup({ cache: false });
    		_this.websocketConnect();
        },
        start: function() {
        	BundleResource.loadResource().then(function(){
        		
        	}, function(){
            		console.error("Load Resource  : fail");
            });
        	
        	this.menu = new Menu();
        	//var footer = new Footer();
        	
        	//window.observer = new Observer('/pushEvent');
        	//observer.add("logout", this.logout);
         },
         
         websocketConnect : function(){
        	 var _this = this;
        	 var sendData = {
         			loginId : null,
         			loginIp : null
         	}
        	 
         	var url = window.location.pathname.replace("main", "")+ 'websocketEvent' + "?LOGIN_ID="+sessionStorage.LOGIN_ID;
        	window.ItamObserver = new ItamObserver("/websocketEvent", sendData);
         	window.ItamObserver.addObserver("main", _this.listNotification);
         },
         
         listNotification : function(msg){
        	switch(msg.replace(/"/gi, "")){
        		case "getTickerScrollingMessage":
        			main.menu.getTickerScrollingMessage();
        			break;
        		case "sendNotification":
        			main.sendNotification();
        			break;
        		case "getTickerList":
        			main.getTickerList();
        			break;
        	}
         },
         
         /**
          * Start NotifiCation
          * **/
         getTickerMessage : function(){
        	 var model = new Model();
        	 model.url += "/getTickerList";
        	 model.fetch();
        	 this.listenTo(model, "sync", this.setTickerMessage);
         },
         
         setTickerMessage : function(method, model, options){
        	 console.log(model);
        	 
        	 if(model.length > 0){
        		 
        	 }
         },
         
         sendNotification : function(){
        	 var customEvent = new CustomEvent("jiniworld", {
        		 detail : {
        			type : 'jini',
        			value : 'world'
        		} 
        	 });
        	 
        	 window.dispatchEvent(customEvent);
         },
         
         getTickerList : function(){
        	 var tickerEvent = new CustomEvent("tickerMgr", {
        		 detail : {
        			 type : 'tickerManager',
        			 value : 'getTickerList'
        		 } 
        	 });
        	 
        	 window.dispatchEvent(tickerEvent);
         },
         
         /**
          * End NotifiCation
          * */
         
         createTime : function(){
        	 $(document).ready(function() {

 				setInterval( function() {
 					var seconds = new Date().getSeconds();
 					$("#sec").html(( seconds < 10 ? "0" : "" ) + seconds);
 					},1000);
 					
 				setInterval( function() {
 					var minutes = new Date().getMinutes();
 					$("#min").html(( minutes < 10 ? "0" : "" ) + minutes);
 				    },1000);
 					
 				setInterval( function() {
 					var hours = new Date().getHours();
 					$("#hours").html(( hours < 10 ? "0" : "" ) + hours);
 				    }, 1000);	
 				
 					if(hours <= 12){
 						$("#am_pm").html("AM");
 					}else{
 						$("#am_pm").html("PM");
 					}
 				}); 
         },
         
         sessionExtend : function(){
        	this.sessionTimeout = setInterval(function(){
        		var rtimeStr = new Date().getTime();
        		Backbone.ajax({
        			dataType : "text",
    				//contentType : "text/html",
    				url : "/session/check?time="+rtimeStr,
    				method : "GET",
        		    success: function(val){ 
        		    	/*  -- Websocket Readystate --
	    		    		0 - CONNECTING
	    		    		1 - OPEN
	    		    		2 - CLOSING
	    		    		3 - CLOSED*/
        		    	var wsReadyState = window.ItamObserver.ws.readyState;
        		    	if(wsReadyState != 1){
        		    		console.log("Reconnect Websocket.....");
        		    		main.websocketConnect();
        		    	}
        		    },
        		    error : function(val){
        		    	console.log("Disconnected Websocket");
        		    }
        		});
        	}, 20000);
        },
        
        close : function(){
        	window.clearTimeout(this.sessionTimeout);
        },
        
        logout : function(data) {
        	if(data == "reason.logout.adminaction") {
        		$('body').append("<div id='logoutPopupDialog'></div>");
        		var title = BundleResource.getString("title.user.information");
        		var markup = BundleResource.getString("label.user.admin_logout_action");
           		var options = {
        				buttons: {
        			    	  OK: function() {
        			    		 $('#logoutPopupDialog').confirm("close");
        			    		 window.location.href="/";
        			          }
        		        },
        		        width: 400,
        				title: title,
        				form: [
        				       {type: 'label', label: markup},
        				]
            	}
           		$('#logoutPopupDialog').confirm(options);
    			$('#logoutPopupDialog').confirm('open');
           		
        	}
        }
    })

    
    $(document ).ajaxError(function(e, jqxhr, settings, exception) {
    	if(jqxhr.status == 302){
    		window.location.href="/";
    	}
	});
    return Main;
});