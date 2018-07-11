define([
	"jquery",
	"underscore",
	"backbone",
	"text!views/main/header",
	'js/lib/component/BundleResource',
	"bootstrap",
	"css!cs/main/main",
	"adminLTE"
],function(
	$,
	_,
	Backbone,
	HeadViewJSP,
	BundleResource
){
	var Model = Backbone.Model.extend({});
	var Collection = Backbone.Model.extend({
		model: Model,
		url: 'menu',
		parse: function(result) {
			return {menu: result};
		}
	});

    var Menu = Backbone.View.extend({
		el: 'body',
		initialize : function () {
			var _this = this;
			this.$el.find('#navi').append(HeadViewJSP);
			this.elements = {
				url : {},
				view : null,
				icons : {
				dashboard : "m-dashboard",
				settings : "m-settings",
				report : "m-report"
				}
			};
			this.collection = new Collection();
			this.collection.fetch();
			this.listenTo(this.collection, "sync", this.setData);

//			$(document).keydown(function (e) {
//				if(e.which === 116) {
//					if(typeof event == "object") {
//						_this.refresh = true;
//						e.keyCode = 0;
//						_this.forceLogout();
//						return false;
//					}
//					//return false;
//				} else if(e.which === 82 && e.ctrlKey) {
//					_this.refresh = true;
//					_this.forceLogout();
//					return false;
//				}
//			});

			$(document).keydown(function(e) {
				key = (e) ? e.keyCode : event.keyCode;

				var t = document.activeElement;

				if (key == 8 || key == 116 || key == 17) {
					if (key == 8) {
						if (t.tagName != "INPUT") {
							if (e) {
								e.preventDefault();
							} else {
								event.keyCode = 0;
								event.returnValue = false;
							}
						}
					} else {
						if (e) {
							e.preventDefault();
						} else {
							event.keyCode = 0;
							event.returnValue = false;
						}
					}
				}
			});

//			var agent = navigator.userAgent.toLowerCase();
//
//			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
//				console.log("인터넷 익스플로러 브라우저 입니다.");
//			}

			window.onbeforeunload = function() {
				if(_this.userLogout == false || _this.userLogout == undefined) {
					_this.userLogout = true;
					_this.forceLogout();
				}
			};
        },
		events : {
			"click .nav-btn" : "setMain",
			"click .navbar a.dropdown-toggle" : "setNavEvent",
			"click .main_lang": "setLanguage",
			"click #signOutBtn": "setLogout",
			"click .user-menu" : "getLanguage",
			"click #userInfo" : "getUserInfo",
		},
		setDefaultView : function(){
			$("#navbar-userId").html(sessionStorage.getItem("LOGIN_ID"));
			
			var pid = sessionStorage.getItem("PRIVILEGE_ID");
			//todo User's favorite page add
			if(pid > 0) {
				//$('#dashboard').trigger('click');
				//$('#itam-dashboard1').trigger('click');
				//$('#code-manager').trigger('click');
				//$('#location-manager').trigger('click');
				$('#code-manager').trigger('click');
			} else {
				$('#user-manager').trigger('click');
			}
		},
		setIcons : function(target) {
			if($(target).attr('data') !== 'undefined') return;
			
			var parent = $(target).attr('data').toLowerCase();
			var oldParent = this.elements.parent;
			var parentClass = this.elements.icons[parent];
			
			if(parentClass == oldParent) return;
			if(!oldParent) return;
			var parentCss = $("."+parentClass).css('background').replace('_off', '_on');
			$("."+parentClass).css('background', parentCss);
			
			
			if(oldParent!=undefined) {
				var olodParentCss = $("."+oldParent).css('background').replace('_on', '_off');
				$("."+oldParent).css('background', olodParentCss);
			}
			this.elements.parent = parentClass;
		} ,
		setMain : function(evt) {
			var target = this.elements.target
			if(target == evt.target) return;
			this.elements.target = evt.target;
			var _this = this;
			var view = this.elements.view;
			this.setIcons(evt.target);
			if(view != null) view.destroy();
			var url = this.elements.url[$(evt.target).attr('id')];
			
			if (url.indexOf('idc/') === 0 || url.indexOf('editor/') === 0 || url.indexOf('asset/') === 0) {
				$('#foot').css('display', 'none');
			} else {
				$('#foot').css('display', 'block');
			}
			
			requirejs([
				'js/' + url
			], function(View) {
				_this.$el.find('.content .wrap').empty();
				var view = new View();
				_this.elements.view = view;
			});
			this.sideToggle();
		},
		sideToggle: function() {
			var cnt = $('body').attr('class').indexOf('collapse');
			if(cnt == -1) {
				$('.treeview.active a').trigger("click");
				$(".sidebar-toggle").trigger("click");
			}
		},
		setNavEvent : function(evt) {
			var el = $(evt.target);
			var parent = el.offsetParent(".dropdown-menu");
			el.parent("li").toggleClass('open');
			if(!parent.parent().hasClass('nav')) {
				el.next().css({"top": el[0].offsetTop, "left": parent.outerWidth() - 4});
			}
			$('.nav li.open').not(el.parents("li")).removeClass("open");
			return false;
		},
		setData : function(collection) {
			var data = collection.toJSON();
			
			if(this.$el.find("aside").length==0) {
				this.renderTop(data.menu);
			} else {
				this.renderSide(data.menu);
			}
			this.setDefaultView();
		},
		start: function(aside) {
			this.elements.aside = aside;
		},
		renderTop: function(array) {
			var _this = this;
			var menuTree = array;
			
			var TopView = (function() {
				var html = '';
				var that = _this;
				menuTree.forEach(function(obj) {
					var view = that;
					if(obj.child.length == 0) {
						var key = obj.menuName.replace(' ', '-').toLowerCase();
						html += '<li><a href="#"><span class="nav-btn" id="'+key+'">'+ obj.menuName +'</span></a></li>';
						view.elements.url[key] = obj.url;
					} else {
						html += '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">'+ obj.menuName +
								'<span class="caret"></span></a><ul class="dropdown-menu" role="menu">';
						obj.child.forEach(function(child) {
							var key = child.menuName.replace(' ', '-').toLowerCase();
							html += '<li><a href="#"><span class="nav-btn" id="'+key+'">'+ child.menuName +'</span></a></li>';
							view.elements.url[key] = child.url;
						});
						html += '</ul>';
					}
				});
				return html;
			});
			this.$el.find("#navView").append(TopView);
		},
		renderSide: function(array) {
			var _this = this;
			var menuTree = array;
			
			var SideView = (function() {
				var html = '';
				var that = _this;
				menuTree.forEach(function(obj) {
					var view = that;
					var icon = (function() {
						var ic = view.elements.icons[obj.menuName.toLowerCase()];
						if(ic==undefined) ic = "fa-circle-o";
						return ic;
					})();
					
					if(obj.child.length == 0) {
						var key = obj.menuName.replace(/ /g, '-').toLowerCase();
						//html += '<li><a href="#"><i class="fa fa-link"></i><span class="nav-btn" id="'+key+'">'+ obj.menuName +'</span></a></li>';
						html += '<li><a href="#"><i class="fa '+ icon +'">' +
								'</i><span class="nav-btn" id="'+key+'" data="'+obj.menuName+'">'+ obj.menuName +'</span></a></li>';
						view.elements.url[key] = obj.url;
					} else {
						html += '<li class="treeview"><a href="#"><i class="fa '+ icon +'"></i><span>'+ obj.menuName +'</span>' +
								'<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>' +
								'<ul class="treeview-menu">';
						obj.child.forEach(function(child) {
							if(child.child.length == 0) {
								var key = child.menuName.replace(/ /g, '-').toLowerCase();
								html += '<li><a href="#"><span class="nav-btn" id="'+key+'" data="'+obj.menuName+'">'+ child.menuName +'</span></a></li>';
								view.elements.url[key] = child.url;
							} else {
								html += '<li class="treeview"><a href="#"><i class="fa '+ icon +'"></i><span>'+ child.menuName +'</span>' +
										'<span class="nav-btn"><i class="fa fa-angle-left pull-right"></i></span></a>' +
										'<ul class="treeview-menu">';
						
								child.child.forEach(function(child_child) {
									var key = child_child.menuName.replace(/ /g, '-').toLowerCase();
									html += '<li><a href="#"><span class="nav-btn" id="'+key+'" data="'+child.menuName+'">'+ child_child.menuName +'</span></a></li>';
									view.elements.url[key] = child_child.url;
								});
								html += '</ul>';
							}
						});
						html += '</ul>';
						}
				});
				return html;
			})();
			
			this.$el.find('.sidebar-menu').append(SideView);
		},
		render: function(array) {
			var _this = this;
			var menuTree = array;
			
			var dropHtml = 'class="dropdown-toggle" data-toggle="dropdown"';
			var caretHtml = '<span class="caret"></span></a><ul class="dropdown-menu">';
			var navBtnHtml = 'class="nav-btn" id="';
			var HeadViews = (function() {
				var html = '';
			
				menuTree.forEach(function(obj) {
					var that = _this;
					html += '<ul class="nav navbar-nav"><li class="dropdown"><a href="#" ' + dropHtml +
							'role="button" aria-haspopup="true" aria-expanded="false">';
					
					if(obj.child.length != 0) {
						html += obj.menuName + caretHtml;
						var _that = that;
						obj.child.forEach(function(val) {
							var view = _that;
							html += '<li><a href="#" ';
							if(val.child.length != 0) {
								html += dropHtml + '>'+ val.menuName + caretHtml;
								val.child.forEach(function(val) {
									var _view = view;
									var key = val.menuName.replace(' ', '-').toLowerCase();
									html += '<li><a href="#" <span ' + navBtnHtml + key +'">'+val.menuName+'</span>';
									view.elements.url[key] = val.url;
								});
								html += '</ul></a></li>';
							} else {
								var key = val.menuName.replace(' ', '-').toLowerCase();
								html += navBtnHtml + key +'">'+val.menuName+'</a></li>';
								view.elements.url[key] = val.url;
							}
						
						});
					} else {
						var key = obj.menuName.replace(' ', '-').toLowerCase();
						html += '<span ' + navBtnHtml + key +'">'+obj.menuName+'</span>';
						that.elements.url[key] = obj.url;
					}
					
					html += '</ul></li></ul>';
				});
					
				return html;
			})();
			this.$el.find('#headView').append(HeadViews);
		
		},

		setLanguage : function(event){
			BundleResource.setLocale(event.currentTarget.name);
		},
		getLanguage : function(event) {
			var lang = BundleResource.getLocale();
			var buttons = $('.user-footer .info-box-component');
			var len = buttons.length;
			for (var i = 0; i < len; i++) {
				var button = $(buttons[i]).find('a');
				var name = $(button).attr('name');
				button.removeClass(name + '-on');
				button.addClass(name + '-off');
			}
			var select = $('.' + lang + '-btn').find('a');
			select.removeClass(lang + '-off');
			select.addClass(lang + '-on');
		},
		setLogout : function() {
			var model = new Model();
			var userId = sessionStorage.getItem("LOGIN_ID");

			model.set({
				"userId" : userId
			});

			model.url = 'settings/user/?search=' + userId;
			model.fetch();
			this.listenTo(model, "sync", function() {
				this.logoutAction(model)
			});
		},
		logoutAction : function(data) {
			var _this = this;
			var markup = "";
			var urlRoot = "login/logout";
			var loginStatus = 2;
			var logout_model = new Model();

			var sessionId = sessionStorage.getItem("SESSION_ID");
			var userId = sessionStorage.getItem("LOGIN_ID");
			var ipAddress = sessionStorage.getItem("IP_ADDRESS");

			window.w2utils.settings.dataType = "RESTFULLJSON";

			// if((data.changed[0].userId != null) &&
			// (data.changed[0].loginStatus == 1)) {
			if (data.changed[0].userId != null) {
				markup = BundleResource.getString("label.user.logout");
				var options = {
					buttons : {
						OK : function() {
							if (data.id == undefined) {
								logout_model.url = urlRoot;
							} else {
								logout_model.recid = data.id;
								logout_model.url = urlRoot;
							}

							logout_model.set({ "srcId": userId, "LOGIN_ID": userId, "IP.ADDRESS": ipAddress, "LOGOUT.REASON": "" });

							logout_model.save(null, {
								success : function(model, response) {
									sessionStorage.removeItem("LOGIN_ID");
									sessionStorage.removeItem("IP_ADDRESS");
									sessionStorage.removeItem("SESSION_ID");
									sessionStorage.removeItem("USER_IDX");
									sessionStorage.removeItem("PRIVILEGE_ID");
									var url = window.location.origin;
									window.location.href = url;
									_this.userLogout = true;
								},
								error : function(model, response) {
									$(this).confirm("close");
								}
							});
							$(this).confirm("close");
						},
						Cancel : function() {
							$(this).confirm("close");
						}
					},
					width : 400,
					title : "Confirm",
					form : [
						{type: 'label', label: markup},
					],
				}

				$('#foot').confirm(options);
				$('#foot').confirm('open');
				$(".ui-dialog-titlebar-close").css("display", "none");

			} else {
				markup = BundleResource.getString("label.user.notSelect_logout");
				_this.warningPopup(markup);
				return false;
			}
		},
		getUserInfo : function() {
			var startRow = 1;
			var endRow = 25;
			var userId = sessionStorage.getItem("LOGIN_ID");
			var userInfoModel = new Model();

			$('.navbar-custom-menu').append("<div id='userInfoPopup'></div>");

			userInfoModel.url = "settings/user/?search=" + userId;
			userInfoModel.set({"userId" : userId});
			userInfoModel.fetch();

			this.listenTo(userInfoModel, "sync", function() {
				this.viewUserInfo(userInfoModel);
			});
		},
		viewUserInfo : function(array) {
			var _this = this;
			var markup = "";
			var selectUser = false;
			var selectAdmin = false;
			var selectSecurity = false;
			var selectEnabled = false;
			var selectDisabled = false;
			var selectLookout = false;
			var emailArray = "";
			var data = array.toJSON();
			var userIdx = data[0].id;
			var alarmOnOff = data[0].alarm_on_off;

			if (data.userId == null) {
				markup = BundleResource.getString("label.user.notSelect_editItem");
				_this.alertPopup(markup, BundleResource.getString("title.user.information"));

				return false;
			} else {
				switch (data[0].privilegeId) {
				case 0:
					selectSecurity = true;
					selectAdmin = false;
					selectUser = false;
					break;
				case 1:
					selectSecurity = false;
					selectAdmin = true;
					selectUser = false;
					break;
				case 2:
					selectSecurity = false;
					selectAdmin = false;
					selectUser = true;
					break;
				default:
					selectSecurity = false;
					selectAdmin = false;
					selectUser = true;
					break;
				};

				switch (data[0].status) {
				case 1:
					selectEnabled = true;
					selectDisabled = false;
					selectLookout = false;
					break;
				case 2:
					selectEnabled = false;
					selectDisabled = true;
					selectLookout = false;
					break;
				case 3:
					selectEnabled = false;
					selectDisabled = false;
					selectLookout = true;
					break;
				default:
					selectEnabled = true;
					selectDisabled = false;
					selectLookout = false;
					break;
				};

				var title = data.userId + "'s property";
				var options = {
					buttons : {
						Ok : function() {
							if (($("#userInfoPasswordBox").val()) != ($("#userInfoRePasswordBox").val())) {
								markup = BundleResource.getString("label.user.password_discrepancy");
								_this.alertPopup(markup, BundleResource.getString("title.user.information"));
								return false;
							} else if (($('input:checkbox[name="userInfoGroupModifySelectBox"]:checked').length == 0)
									&& ($('input:radio[name="userInfoAlarmModifySelectBox"]:checked').val() == "on")) {
								markup = BundleResource.getString("label.user.select_alarm_severity");
								_this.alertPopup(markup, BundleResource.getString("title.user.information"));
							} else if (_this.elements.validate.valid().invalidCount == 0) {
								_this.userInfoModifyAction($(this).popup("getValues"), userIdx);
								$('#userInfoPopup').popup("close");
								$('#userInfoPopup').remove();
							}
						},
						Cancel : function() {
							$('#userInfoPopup').popup("close");
							$('#userInfoPopup').remove();
						}
					},
					open : function() {
						_this.setUserModifyValidation();
					},
					title : title,
					width : 550,
					form : [
						{id: 'userInfoIdBox', type: 'text', label: BundleResource.getString('title.user.user_id')/*'User ID'*/,placeholder: '', value: data.userId},
						{id: 'userInfoPasswordBox', type: 'password', label: BundleResource.getString('label.user.add_popup_password')/*'Password'*/,placeholder: '', value: data[0].password},
						{id: 'userInfoRePasswordBox', type: 'password', label: BundleResource.getString('label.user.add_popup_repassword')/*'Re-Password'*/,placeholder: '', value: data[0].password},
						{id: 'userInfoStatusBox', type: 'combo', label: BundleResource.getString('title.user.status')/*'Status'*/, value: [{text: BundleResource.getString("label.user.enabled_status")/*'Enabled'*/, value: '1', select: selectEnabled}, {text: BundleResource.getString("label.user.disabled_status")/*'Disabled'*/, value: '2', select: selectDisabled}, {text: BundleResource.getString("label.user.lock_status")/*'Lockout'*/, value: '3', select: selectLookout}]},
						{id: 'userInfoRoleBox', type: 'combo', label: BundleResource.getString('label.user.add_popup_privilege')/*'Role'*/, value: [{text: BundleResource.getString("label.user.security")/*'Security'*/, value: '0', select: selectSecurity}, {text: BundleResource.getString("label.user.admin")/*'Admin'*/, value: '1', select: selectAdmin}, {text: BundleResource.getString("label.user.user")/*'User'*/, value: '2', select: selectUser}]},
						{id: 'userInfoUserNameBox', type: 'text', label: BundleResource.getString('label.user.add_popup_username')/*'User Name'*/,placeholder: '', value: data[0].userName},
						{id: 'userInfoEmailBox', type: 'email', label: BundleResource.getString('label.user.add_popup_email')/*'E-mail'*/, placeholder: '', value: data[0].email},
						{id: 'userInfoPhoneBox', type: 'text', label: BundleResource.getString('label.user.add_popup_phone')/*'Phone'*/, placeholder: '', value: data[0].phone},
						{id: 'userInfoAlarmModifySelectBox', type: 'radio', label: BundleResource.getString('label.user.add_popup_alarm')/*'Alarm'*/, value: [{text: BundleResource.getString("label.user.alarm_on")/*'Alarm-On'*/, value: 'on'}, {text: BundleResource.getString("label.user.alarm_off")/*'Alarm-Off'*/, value: 'off', check:true}]},
						{id: 'userInfoGroupModifySelectBox', type: 'checkbox', label: BundleResource.getString('label.user.add_popup_group')/*'Group'*/, value: [{text: BundleResource.getString("label.user.state_critical")/*'Critical'*/, value: 'critical'}, {text: BundleResource.getString("label.user.state_major")/*'Major'*/, value: 'major'},{text: BundleResource.getString("label.user.state_minor")/*'Major'*/, value: 'minor'}]}
					],
				}

				$('#userInfoPopup').popup(options);
				_this.setAlarmForm(data[0]); // sla alarm  form event
				var alarmModifySelectBoxVal = $("#userInfoPopup li:last-child").index();

				$('#userInfoPopup').popup('open');
				$("#userInfoIdBox").attr("disabled", true);
				$("#userInfoStatusBox, #userInfoRoleBox").css("appearance", "none");
				$("#userInfoStatusBox").attr("disabled", true);
				$("#userInfoRoleBox").attr("disabled", true);

				$('#userInfoAlarmModifySelectBox').unbind('click').bind('click', function(event) {
					let value = event.target.value;
					if (value == "on") {
						$('#userInfoGroupModifySelectBox').parent('li').css('display', 'block');
						$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom', '');
						$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-right-radius', '');
						$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-left-radius', '');
					} else if (value == "off") {
						$('#userInfoGroupModifySelectBox').parent('li').css('display', 'none');
						$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom', '1px solid #dae7ef');
						$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-right-radius', '5px');
						$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-left-radius', '5px');
					}
				});

				if ($('input[name=userInfoAlarmModifySelectBox]:checked').val() == "on") {
					$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom', '');
					$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-right-radius', '');
					$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-left-radius', '');
				} else {
					$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom', '1px solid #dae7ef');
					$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-right-radius', '5px');
					$("#userInfoPopup li:nth-child(" + alarmModifySelectBoxVal + ")").css('border-bottom-left-radius', '5px');
				}
			}
		},
		userInfoModifyAction : function(_this, userIdx) {
			var _that = this;
			var userInfo_editModel = new Model();
			var urlRoot = "settings/user";
			var id = 0;
			var startRow = 1;
			var endRow = 25;
			var loginId = sessionStorage.getItem("LOGIN_ID");
			var tempPassword = $("#pwAddEditBox").val();

			userId = $("#userInfoIdBox").val();
			password = $("#userInfoPasswordBox").val();
			privilegeId = $("#userInfoRoleBox").val();
			groupId = 1;
			status = $("#userInfoStatusBox").val();
			userName = $("#userInfoUserNameBox").val();
			email = $("#userInfoEmailBox").val();
			phone = $("#userInfoPhoneBox").val();
			window.w2utils.settings.dataType = "RESTFULLJSON";

			let alarmOnOff = $('input[name=userInfoAlarmModifySelectBox]:checked').val();
			if (alarmOnOff == undefined || alarmOnOff == null) {
				alarmOnOff = "off";
			}
			$('body').loading();
			$('body').loading('show');

			if (userId == loginId) {
				firstLoginCheck = 1;
				tempPassword = null;
			} else {
				firstLoginCheck = 0;
			}

			/*
			 * alarm type what the user agree to send mail it
			 * will be saved into DB as String separated
			 * comma(",");
			 */
			let alarmBox_size = $('input[name=userInfoGroupModifySelectBox]:checked').length;
			let alarmArray = [];
			for (var i = 0; i < alarmBox_size; i++) {
				alarmArray[i] = $('input[name=userInfoGroupModifySelectBox]:checked')[i].value;
			}
			let alarmString = alarmArray.join();

			// $('body').loading('show');

			userInfo_editModel.url = urlRoot + '/' + userIdx;
			userInfo_editModel.set("id", userIdx);
			userInfo_editModel.set({
				"userId" : userId,
				"password" : password,
				"privilegeId" : privilegeId,
				"groupId" : groupId,
				"userName" : userName,
				"status" : status,
				"email" : email,
				"phone" : phone,
				"tempPassword" : tempPassword,
				"alarm_on_off" : alarmOnOff,
				"alarm_type" : alarmString,
				"startRow" : startRow,
				"endRow" : endRow
			});

			userInfo_editModel.save(null, {
				success : function(userModel, response) {
					$('body').loading('hide')
				},
				error : function(userModel, response) {

				}
			});
		},
        setUserModifyValidation: function() {
        	var rules = {
    			'userInfoPasswordBox': {require: 'checkPw', min:9, max:15},
    			'userInfoRePasswordBox': {require: 'checkPw', min:9, max:15},
        	}
        	var messages = {
        		'userInfoPasswordBox': BundleResource.getString("label.user.valid_password"),
        		'userInfoRePasswordBox': BundleResource.getString("label.user.valid_repassword"),
        	}
        	this.elements.validate = new Validate(rules, messages);
        },
		alertPopup : function(markup, title){
			$('.navbar-custom-menu').append("<div id='userInfoDialog'></div>");
			var options = {
				buttons: {
					OK: function() {
						$(this).confirm("close");
						$('#userInfoDialog').remove();
					}
				},
				width: 400,
				title: title,
				form: [
					{id: 'warning', type: 'label', label: markup},
				],
			}
			$('#userInfoDialog').confirm(options);
			$('#userInfoDialog').confirm('open');
		},
		forceLogout : function() {
			var logout_model = new Model();
			var sessionId = sessionStorage.getItem("SESSION_ID");
			var userId = sessionStorage.getItem("LOGIN_ID");
			var ipAddress = sessionStorage.getItem("IP_ADDRESS");

			window.w2utils.settings.dataType = "RESTFULLJSON";

			logout_model.url = "login/logout";

			logout_model.set({
				"srcId" : userId,
				"LOGIN_ID" : userId,
				"IP.ADDRESS" : ipAddress,
				"LOGOUT.REASON" : "",
				"FORCE_LOGOUT" : true
			});

			logout_model.save(null, {
				success : function(model, response) {
					sessionStorage.removeItem("LOGIN_ID");
					sessionStorage.removeItem("IP_ADDRESS");
					sessionStorage.removeItem("SESSION_ID");
					sessionStorage.removeItem("USER_IDX");
					sessionStorage.removeItem("PRIVILEGE_ID");
					window.location.href = "/";
				},
				error : function(model, response) {

				}
			});
		},
		setAlarmForm : function(data) {
			if (data.alarm_on_off == "on") {
				$('input[value="on"]').prop("checked", "true");
				$('#userInfoGroupModifySelectBox').parent('li').css('display', 'block');
			} else {
				$('#userInfoGroupModifySelectBox').parent('li').css('display', 'none');
			}
			$('#userInfoGroupModifySelectBox>div').css('float', 'left');
			$('input[name=userInfoGroupModifySelectBox]').css('margin-right', '4px');
			$('input[name=userInfoGroupModifySelectBox]').css({
				verticalAlign : 'bottom',
				marginRight : '4px'
			});
			$("#userInfoIdBox").attr("disabled", true);
		},
	})

	return Menu;
});