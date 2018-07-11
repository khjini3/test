define([
	"sockjs",
	"rx"
],function(
	SockJS,
	Rx
){
	function ItamObserver(url, sendData, callback){
		yesSendMsg = this;
		this.ws = new SockJS(url);
		this.data = sendData;
		this.subject = {};
		this.subscription = {};
		this.subject.main = new Rx.Subject();
		this.subscription.main = this.subject.main.subscribe(
			function(x){
				return callback(x);
			},
			function(e){
				//console.error("Error : %s", e);
			},
			function(){
				//console.info("ITAM Socket Closed");
			}
		);
		this.init();
	}
	
	ItamObserver.prototype = {
		init : function(){
			var _this = this;
			var timeout;
			this.ws.onopen = function(){
				var that = this;
				console.log("Info : ITAM Websocket connection opened");
				$(".fa-yes-connection").show();
				$(".fa-yes-disconnection").hide();
//				$(".connection").attr("src", "dist/img/on.png");
				/*timeout = setTimeout(function(){
					_this.ws.send(JSON.stringify(_this.data));
					clearTimeout(timeout);
				}, 2000);*/
			};
			
			this.ws.onmessage = function(event){
				var that = _this;
				//if(event.data == "PING")return;
				_this.publish(event.data);
				
				/*timeout = setTimeout(function(){
					that.ws.send(JSON.stringify(that.data));
					clearTimeout(timeout);
				}, 10000);*/
			};
			
			this.ws.onclose = function(){
				console.log("Info : ITAM WebSocket connection closed");
				$(".fa-yes-connection").hide();
				$(".fa-yes-disconnection").show();
//				$(".connection").attr("src", "dist/img/off2.png");
			}
			
		},
		
		addObserver : function(key, callback, error){
			this.subject[key] = new Rx.Subject();
			this.subscription[key] = this.subject[key].subscribe(
				function(x){
					return callback(x);
				},
				function(e){
					console.error("Error : %s", e);
				},
				function(){
					console.info("Socket Closed");
				}
			);
		},
		
		publish : function(data){
			var _data = data;
			for(var key in this.subject){
				this.subject[key].next(_data);
			}
		},
		
		destroy : function(key){
			this.subscription[key].unsubscribe();
			this.subject[key].unsubscribe();
			delete this.subscription[key];
			delete this.subject[key];
		},
		
		sendMessage : function(str){
			yesSendMsg.ws.send(JSON.stringify(str));
		},
		
		pushEventHandler : function(param){
			console.log(param);
		}
	}
	
	return ItamObserver;
})