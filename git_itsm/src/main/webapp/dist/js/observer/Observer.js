define([
    "sockjs",
    "rx"
],function(
    SockJS,
    Rx
){
	function Observer(url, sendData, callback) {
		this.ws = new SockJS(url);
		this.data = sendData;
		this.subject = {};
		this.subscription = {};
		this.subject.main = new Rx.Subject();
		
		this.subscription.main = this.subject.main.subscribe( 
//			x => callback, //|| console.log('next: ' + x), 
//			e => console.log('error: ' + e.message), 
//			() => console.log('completed')
			function(x) {
				if (!_.isFunction(x)) { // Fixed by gihwan. 2018/02/09 for callback Error.
	                console.log('callback is not function');
	                return;
	            }
				/*console.log('next: ' + x);
				return callback(x);*/
			},
			function(e) {
				// errors and "unclean" closes land here
				console.error('error: %s', e);
			},
			function() {
				// the socket has been closed
				console.info('socket closed');
			}
	 	);
		
		this.init();
	}
	
	Observer.prototype = {
		init : function(){
			var _this = this;
			var timeout;
			this.ws.onopen = function () {
				var that = _this;
				console.log('Info: WebSocket connection opened.');
				
				timeout = setTimeout(function() {
					that.ws.send(JSON.stringify(that.data));
					clearTimeout(timeout);
				}, 2000);
		    };
		    this.ws.onmessage = function (event) {
		    	var that = _this;
		        
		    	if(event.data == "PING") return;
		        _this.publish(event.data);
		        
		        //console.log('receive message : ', res);
		        
		        /*
	        	var res = event.data;
	        	that.data.seqNo = "";
		        that.data.loginId = sessionStorage.LOGIN_ID;
		        that.data.loginIp = sessionStorage.IP_ADDRESS;
		        */
		        
		        that.data.seqNo = JSON.parse(event.data).seqNo;
		        
		        timeout = setTimeout(function() {
		        	that.ws.send(JSON.stringify(that.data));
					clearTimeout(timeout);
				}, 10000);
		    };
		    this.ws.onclose = function () {
		        console.log('Info: WebSocket connection closed.');
		    };
		},
		add : function(key, callback, error) {
			this.subject[key] = new Rx.Subject();
			this.subscription[key] = this.subject[key].subscribe( 
//				x => callback(x), //|| console.log('next: ' + x), 
//				e => error(x) || console.log('error: ' + e.message), 
//				() => console.log('completed')
				function(x) {
					return callback(x);
				},
				function(e) {
					// errors and "unclean" closes land here
					console.error('error: %s', e);
				},
				function() {
					// the socket has been closed
					console.info('socket closed');
				}
		 	);
		},
		publish : function(data) {
			var _data = data
			for(var key in this.subject) {
				this.subject[key].next(_data);
			}
		},
		destroy : function(key) {
			this.subscription[key].unsubscribe();
			this.subject[key].unsubscribe()
			delete this.subscription[key];
			delete this.subject[key];
		}
	}
	
	return Observer;
});