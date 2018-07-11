define([ 
         'jquery',
         'underscore',
         'backbone',
         'sockjs'
         //'stomp'
		 //"js/main/MenuView",
		 //"js/lib/tree/AlarmManager",
		 //"js/lib/tree/NeManager"
		 ,
], function(
		$, 
		_, 
		Backbone, 
		SockJS 
		//Stomp
		//MenuView,
		//AlarmManager,
		//NeManager
) {
	var PollingManager = Backbone.View.extend({
		initialize : function() {
			this.observers = {};
		},

		//connect : function(seq) {
		connect : function() {
			var dfd = new $.Deferred();
			var _view = this;
			var url = window.location.href;


			if (url.indexOf("/popup") < 0) {
				var sendPollingData = {
					loginId : null,
					loginIp : null,
					/*loginIp : null,
					clientId : seq.clientId,
					seqNo : seq.seqNo*/
				};
				var timeout;
				var socket = new SockJS(window.location.pathname.replace("main", "")+ 'pollingEvent' + "?LOGIN_ID="+sessionStorage.LOGIN_ID); 

				socket.onopen = function(message) {
					console.log('websocket opened');
					timeout = setTimeout(function() {
						socket.send(JSON.stringify(sendPollingData));
						clearTimeout(timeout);
					}, 2000);
					
					dfd.resolve();
				};

				socket.onmessage = function(message) {
//					console.log(message);
//					console.log('receive message : ' + message.data);
					
					if (message.data == "PING") {
						return;
					}

					var res = JSON.parse(message.data);
					
					//console.log('receive message : ', res);
					
					_view.publish(res.data, true);
					
					//sendPollingData.seqNo = res.seqNo;
					sendPollingData.loginId = res.loginId;
					sendPollingData.loginIp = res.loginIp;
					//sendPollingData.clientId = res.clientId;

					timeout = setTimeout(function() {
						socket.send(JSON.stringify(sendPollingData));
						clearTimeout(timeout);
					}, 10000);

				};
				
				socket.onclose = function(event) {
					console.log(event);
					console.log('websocket closed');
				};

			} else {
				console.log('Event Observer : set FM Event Listener');
				window.addEventListener('message', function(event) {
					var origin = event.origin || event.originalEvent.origin;
					if (origin !== window.location.protocol + "//" + window.location.host)
						return;

					var data = event.data;
					_view.publish(data);
				});
				
				dfd.resolve();
			}
			return dfd.promise();
		},
		
		publish : function(events, isMain){
			if(_.isArray(events)){
				var that = this;
				//NeManager.observer(events);
				//AlarmManager.observer(events);

				_.each(this.observers, function(observer, key) {
					if (_.isFunction(observer)) {
						try{
							observer.call(this, events);
						}catch(e){
							console.error(e);
						}
					}
				});
				
				/*if(isMain == true){
					var windows = MenuView.getOpenedWindow();
					_.each(windows, function(win, key) {
						win.postMessage(events, window.location.protocol + "//" + window.location.host);
					});
				}*/
			}
			
		},
		
		addObserver : function(key, callback) {
			if (!_.isUndefined(this.observers[key])) {
				console.error('conflict observer key[' + key + ']');
				this.observers[key] = _.noop();
			}

			if (!_.isFunction(callback)) {
				console.error('observer callback is not function', key);
				return;
			}

			this.observers[key] = callback;
		},

		destoryObserver : function(key) {
			if (!_.isUndefined(this.observers[key])) {
				this.observers[key] = _.noop();
			}
		}

	});

	return new PollingManager();
})
