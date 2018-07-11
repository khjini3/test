var defineList = ["jquery",
	"underscore",
	"backbone",
	"text!views/main/header",
	'js/lib/component/BundleResource',
	"js/lib/capture/html2canvas",
	"smoothDivScroll",
	"kinetic",
	"bootstrap",
	"css!cs/main/main",
	"css!plugins/jQuery-ticker/smoothDivScroll"
	];

if(sessionStorage.NAVI_DIRECTION === "side"){
	defineList.push("css!cs/main/leftMenu");
	defineList.push("adminLTE");
}else if(sessionStorage.NAVI_DIRECTION === "top"){
	defineList.push("css!cs/main/topMenu");
}else{
	defineList.push("css!cs/main/topSideMenu");
	defineList.push("itsmUtil");
}

define(defineList,function(
	$,
	_,
	Backbone,
	HeadViewJSP,
	BundleResource,
	Capture
){
	var Model = Backbone.Model.extend({});
	var tickerModel = Backbone.Model.extend({
		url : 'tickerManager',
		parse : function(result){
			return {data : result};
		}
	});
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
			this.timer = null;
			this.flag = true;
			this.currentText = 0;
			this.currentPage = "";
			this.menuTree = [];
			this.childFindFuc = null;
			this.firstMenuName = "";
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
			this.brandLogoMenu = null;
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
						if (t.tagName != "INPUT" && t.tagName != "TEXTAREA") {
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
			
			this.getTickerScrollingMessage();
			
			menuMgr = this;
			
			_this.getPrivilegeList();
			_this.getGroupList();
        },
        
		events : {
			"click .nav-btn" : "setMain",
			"click .navbar a.dropdown-toggle" : "setNavEvent",
			"click .main_lang": "setLanguage",
			"click #signOutBtn": "setLogout",
			"click .user-menu" : "getLanguage",
			"click #userInfo" : "getUserInfo",
			"click .brand-logo" : "setBrandLogo",
			"click #tickerShowHide" : "changeTickerIcon",
			"click #captureBtn" : "captureScreen",
			"click #navbar-userId" : "userInfoTooltip", // 내 정보 관리
			"click #userInfoConfirmBtn" : "userInfoModifyAction",
			"click #togleArea" : "toggleSideMenu",
			"click #foldIcon" : "foldeSideMenu"
				
		},
		
		userInfoTooltip : function(){
			var _this = this;
			$("#navbar-userId").w2menu({
				name : 'userInfoTootipMenu',
				align : 'none',
				style : 'position: absolute; right: -60px;', //background-color:rgba(56, 65, 83, 0.27058823529411763);
				items : [
					{ id: 1, text: '<i class="fab fa-yes-mysetting fa-lg user-info-svg" title="Mysetting"></i>' + '내 정보 관리' } //user-info-svg
				],
				onSelect : function(event){
					_this.getUserInfo();
				}
			});
//			$("#w2ui-overlay-userInfoTootipMenu div").css("background-color","rgba(56, 65, 83, 0.27058823529411763)");
			$("#w2ui-overlay-userInfoTootipMenu div").css("width", "96px");
			$("#w2ui-overlay-userInfoTootipMenu div").css("height", "36px");
		},
		
		captureScreen : function(){
			var _this = this;
			Capture(document.querySelector("#captureScreen")).then(function(canvas) {
	            _this.saveAs(canvas.toDataURL(), 'Dashboard.png');
	         })();
		},
		
		saveAs : function(uri, filename){
			var link = document.createElement('a');
		    if (typeof link.download === 'string') {
		      link.href = uri;
		      link.download = filename;

		      //Firefox requires the link to be in the body
		      document.body.appendChild(link);

		      //simulate click
		      link.click();

		      //remove the link when done
		      document.body.removeChild(link);
		    } else {
		      window.open(uri);
		    }
		},
		
		getTickerScrollingMessage : function(){
			this.model = new tickerModel();
			this.model.url = this.model.url+"/getTickerScrollingList";
			this.model.fetch();
			this.listenTo(this.model, "sync", this.setTickerScrollingMessage);
		},
		
		setTickerScrollingMessage : function(method, model, options){
			if(model.length > 0){
//				console.log(model);
				if($("#tickerShowHide").hasClass('fa-eye')){ // ticker show
					$("#tickerShowHide").removeClass('fa-eye');
					$("#tickerShowHide").addClass('fa-eye-slash');
					$("#tickerCls").css("visibility", "visible");
					$("#tickerShowHide").attr('title', 'Hide');
				}
				clearTimeout(this.timer);
				$("#tickerCls p").empty();
				main.menu.currentText = 0;
				if($("#tickerCls p").length == 1){ // $("#tickerCls")에 p태그가 있을 경우
					$("#tickerCls p").html(model[0].tickerText);
				}else{
					$("#tickerCls").append('<p style="color:#efee91;" id="tickerScroll">'+ model[0].tickerText +'</p>'); // $("#tickerCls")에 p태그가 없을 경우
				}
				$("#tickerCls").fadeOut().fadeIn(3000, function(){ // 처음 ticker text animation
					main.menu.currentText++;
					main.menu.initStartTicker(main.menu.currentText);
				});
				//console.log("*********Ticker Success*********");
			}else if(model.length == 0 || model == undefined){ // ticker data가 없을 경우
				clearTimeout(this.timer);
				$("#tickerShowHide").trigger('click'); // ticker hide
			}
		},
		
		initStartTicker : function(currentText){
			var tickerData = this.model.attributes.data;
			
			if(currentText >= tickerData.length || tickerData == undefined){
				main.menu.currentText = 0;
				currentText = 0;
			}
			
			if($('.scrollableArea').width() < 1618){
				this.flag = false;
			}
			
			if(tickerData.length == 1 && this.flag){ // ticker length가 1개이면서 ticker text 길이가 짧을 경우에는 애니메이션 X 하기 위함
				return false;
			} else{
				this.scrollTimeAni(tickerData[currentText].tickerText);
			}
		},
		
		scrollTimeAni : function(msg){
			$("#tickerCls").smoothDivScroll({
				//Reference - 'http://www.maaki.com/'
				autoScrollingMode : "always",
				autoScrollingDirection : "right", //endlessLoopRight or right
				autoScrollingInterval : 50, 		     //Rolling Speed
				autoScrollingStep : 1,
				autoScrollingRightLimitReached : function(){
					//This function called when scroll reach to end of right.
					//'autoScrollingDirection' option must be 'right'.
					
//					console.log("Right Limit Reached");
					this.timer = setTimeout(function(){
						$('#tickerCls p').hide();
						$('#tickerCls p').html(msg).fadeIn(1000);
						main.menu.currentText++;
						main.menu.initStartTicker(main.menu.currentText);
					},10000);
					main.menu.flag = false;
					this.flag = false;
				}
			
			//touchScrolling : true, 				 //Moving text - dragging.
			//manualContinuousScrolling : true,
			//mousewheelScrolling : "allDirections", //Moving text - wheel.
			//hiddenOnStart : false
			});
			
			$("#tickerCls").smoothDivScroll("startAutoScrolling");
			$('#tickerCls p').addClass("noselect");
			if($('.scrollableArea').width() < $('.scrollWrapper').width()){ // ticker 문자 길이가 짧으면
				this.timer = setTimeout(function(){
					$('#tickerCls p').hide();
					$('#tickerCls p').html(msg).fadeIn(1000);
					main.menu.currentText++;
					main.menu.initStartTicker(main.menu.currentText);
				},10000);
				main.menu.flag = true;
				this.flag = true;
			}
			
			$("#tickerCls").bind("mouseover", function(){
				$("#tickerCls").smoothDivScroll("stopAutoScrolling");
				$("#tickerCls").css('cursor', 'default');
			});
			
			$("#tickerCls").bind("mouseout", function(){
				$("#tickerCls").smoothDivScroll("startAutoScrolling");
			});
		},
		
		changeTickerIcon : function(){
			var nowClass = $("#tickerShowHide").attr('class');
			if(nowClass.match("slash") != null){ //Hide
				$("#tickerShowHide").removeClass('fas fa-eye-slash');
				$("#tickerShowHide").addClass('fas fa-eye');
				$("#tickerCls").css("visibility", "hidden");
				$("#tickerShowHide").attr('title', 'Show');
			}else{ //Show
				$("#tickerShowHide").removeClass('fas fa-eye');
				$("#tickerShowHide").addClass('fas fa-eye-slash');
				$("#tickerCls").css("visibility", "visible");
				$("#tickerShowHide").attr('title', 'Hide');
			}
		},
		
		/* Brand Logo Click */
		setBrandLogo : function(){
			var _this = this;
			if(_this.firstMenuName === ""){
				_this.childFindFuc = function(item){
					if(item.child.length > 0){
						_this.childFindFuc(item.child[0]);
					}else{
						_this.firstMenuName = item.menuName;
					}
				}
				_this.childFindFuc(_this.menuTree[0]);
			}
			
			var startMenu = _this.firstMenuName.toLowerCase().replace(" ","-"); 
			
			$('#'+startMenu).trigger('click');
		},
		
		setDefaultView : function(startPage, menuTree, menuList){
			
			$("#navbar-userId").html(sessionStorage.getItem("LOGIN_ID"));
			
			var _this = this;
			var startMenuName = "";
			
			var pid = sessionStorage.getItem("PRIVILEGE_ID");
			var userId = sessionStorage.getItem("LOGIN_ID");
			
			if(pid === null || userId === null ){
				_this.forceLogout();
			}
			
			/**
			 * 개발자용 구간 시작
			 */
			/*$('#dashboard').trigger('click');
			
			return;*/
			
			/*
			 * 개발자용 구간 종료
			 */
			
			if(startPage[0] != null && startPage[0] != undefined){
			/* 스타트 페이지가 null이 아닐때 */
				var namePK = _.pluck(startPage, 'menuName');
				var nameArr = _.intersection(menuList, namePK);
				
				if(nameArr.length > 0){
				/* menuList에 startPage가 있는 경우 */
					startMenuName = nameArr.toString().toLowerCase().replace(" ", "-");
					$("#"+startMenuName).trigger('click');
				}else{
					if(menuTree[0] == undefined){
						/* menuList에 startPage가 없는 경우 && 보여줄 페이지가 없으면 디폴트 페이지 보여줌 */
						_this.defaultPage();
					}else{
						/* menuList에 startPage가 없는 경우 && 보여줄 페이지가 있는 경우 */
						_this.childNode = function(item){
							if(item.child.length > 0){
								_this.childNode(item.child[0]);
							}else{
								startMenuName = item.menuName.toLowerCase().replace(" ", "-");
								$("#"+startMenuName).trigger('click');
							}
						}
						_this.childNode(menuTree[0]);
					}
				}
				
			}else{
			/* 스타트 페이지가 null일때 */
				_this.childNode = function(item){
					if(item.child.length > 0){
						_this.childNode(item.child[0]);
					}else{
						startMenuName = item.menuName.toLowerCase().replace(" ","-");
						$("#"+startMenuName).trigger('click');
					}
				}
				if(menuTree[0] == undefined){
				/* 스타트 페이지가 null이고 보여줄 페이지가 없으면 디폴트 페이지 보여줌 */
					_this.defaultPage();
				}else{
				/* 스타트 페이지가 null이고 보여줄 페이지가 있으면 첫번째 페이지 보여줌 */
					_this.childNode(menuTree[0]);
				}
			}
			
			
			/*
			 * 다비스 기존 스타트 페이지 설정
			 * 
			var pid = sessionStorage.getItem("PRIVILEGE_ID");
			//todo User's favorite page add
			if(pid == 1) {
				$('#role-manager').trigger('click');
				//$('#itam-dashboard').trigger('click');
			} else if(pid === null ){
				_this.forceLogout()
			} else if(pid == 2){
				$('#dashboard').trigger('click');
			}else{
				$('#user-manager').trigger('click');
			}*/
			
		},
		
		defaultPage : function(){
			var target = this.elements.target
			$('body').loading('show');
			var _this = this;
			var view = this.elements.view;
			var url = null;
			
			if(sessionStorage.NAVI_DIRECTION === "side"){
				this.setIcons(evt.target);
			}
			if(view != null) view.destroy();
			if(url == null){
				url = "default/defaultPage"; //Added by GiHwan for "Default Page" 20180403
			}
			if (url.indexOf('monitor/dashboard') === 0) {
				$('#foot').css('display', 'block');
			} else {
				$('#foot').css('display', 'none');
			}
			
			requirejs([
				'js/' + url
			], function(View) {
				_this.$el.find('.content .wrap').empty();
				var view = new View();
				_this.elements.view = view;
				$(".content .content-title>div>span").html(_this.currentPage);
				$(view).ready(function(){
					$('body').loading('hide');
				})
			});
			
			if(sessionStorage.NAVI_DIRECTION === "side"){
				this.sideToggle();
			}
		},
		
		setIcons : function(target) {
			/*if($(target).attr('data') !== 'undefined'){
				return console.log("Menu Undefined");
			}*/
			
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
			
			if(sessionStorage.NAVI_DIRECTION === "topSide"){
				var checkSideClass = $(evt.target).attr('class');
				var checkSideClick = checkSideClass.match("topSide2nd"); //Click Side Menu
				if(checkSideClick == null){ //Click Top Menu. No Child Only 1st depth Menu
					$(".wrap").css("margin-left","0px");
					$(".main-sidebar").css("display","none");
					$("#togleAreaBack").css("display","none");
					$("#foldIcon").css("display","none");
				}
			}
			
			var target = this.elements.target
			/*if(target == evt.target) return;*/
			$('body').loading('show');
			this.elements.target = evt.target;
			var _this = this;
			_this.currentPage =  $(evt.target).text();
			//_this.currentPage =  $(evt.target).html();
			var view = this.elements.view;
			
			if(sessionStorage.NAVI_DIRECTION === "side"){
				this.setIcons(evt.target);
			}
			
			if(view != null) view.destroy();
			var url = this.elements.url[$(evt.target).attr('id')];
			
			
			if(url == null){
				url = "default/defaultPage"; //Added by GiHwan for "Default Page" 20180403
			}
			
			if (url.indexOf('monitor/dashboard') === 0) {
				$('#foot').css('display', 'block');
			} else {
				$('#foot').css('display', 'none');
			}
			
			requirejs([
				'js/' + url
			], function(View) {
				_this.$el.find('.content .wrap').empty();
				var view = new View();
				_this.elements.view = view;
				$(".content .content-title>div>span").html(_this.currentPage);
				$(view).ready(function(){
					$('body').loading('hide');
				})
			}, function(err){
				if("scripterror" == err.requireType){
					requirejs([
						'js/default/defaultPage'
					], function(View) {
						_this.$el.find('.content .wrap').empty();
						var view = new View();
						_this.elements.view = view;
						$(".content .content-title>div>span").html(_this.currentPage);
						$(view).ready(function(){
							$('body').loading('hide');
						})
					});
				}
			});
			
			if(sessionStorage.NAVI_DIRECTION === "side"){
				this.sideToggle();
			}
		},
		
		sideToggle: function() {
			var cnt = $('body').attr('class').indexOf('collapse');
			if(cnt == -1) {
				$('.treeview.active a').trigger("click");
				$(".sidebar-toggle").trigger("click");
			}
		},

		setNavEvent : function(evt) {
			var _this = this;
			if(sessionStorage.NAVI_DIRECTION === "topSide"){
				$(".main-sidebar").css("display","block");
				$(".wrap").css("margin-left","230px");
				$("#togleAreaBack").css("display","block");
				$("#togleAreaBack").css("left","226px");
				
				$("#foldIcon").css("display","block");
				$("#foldIcon").css("left","226px");
				
				var clickedMenu = $(evt.target).text(); //Service Desk, Settings ............
				var cnvtMenuName = clickedMenu.replace(/ /g, '-').toLowerCase(); // service-desk, settings
				
				/*var allMenuLen = $("#captureScreen div.wrapper div aside section ul li").length;
				for(var i = 0; i < allMenuLen; i++){
					var menuId = $("#captureScreen div.wrapper div aside section ul li")[i].id;
					if(menuId != "" && menuId == cnvtMenuName){
						$("#"+menuId).css("display", "block");
						$("#"+menuId+" ul li a span")[0].click();
					}else if(menuId != "" && menuId != cnvtMenuName){
						$("#"+menuId).css("display", "none");
					}
				}*/
				
				var allMenuLen = $(".treeview").length;
				for(var i = 0; i < allMenuLen; i++){
					var menuId = $(".treeview")[i].id;
					if(menuId == cnvtMenuName){
						$("#"+menuId).css("display", "block");
						$("#"+menuId+" ul li")[0].click();
					}else{
						$("#"+menuId).css("display", "none");
					}
				}
				
				return false;
			}else{
				var el = $(evt.target);
				var parent = el.offsetParent(".dropdown-menu");
				el.parent("li").toggleClass('open');
				if(!parent.parent().hasClass('nav')) {
					el.next().css({"top": el[0].offsetTop, "left": parent.outerWidth() - 4});
				}
				$('.nav li.open').not(el.parents("li")).removeClass("open");
				return false;
			}
		},
		
		setData : function(collection) {
			var data = collection.toJSON();
			
			if(sessionStorage.NAVI_DIRECTION == "side"){
				this.renderSide(data.menu.tree);
			}else if(sessionStorage.NAVI_DIRECTION == "top"){
				this.renderTop(data.menu.tree);
			}else{
				this.renderTopSide(data.menu.tree);
			}
			this.setDefaultView(data.menu.startPage, data.menu.tree, data.menu.menuList);
		},
		
		start: function(aside) {
			this.elements.aside = aside;
		},
		
		renderTop: function(array) {
			var _this = this;
			_this.menuTree = array;
			
			var TopView = (function() {
				var html = '';
				var that = _this;
				that.menuTree.forEach(function(obj) {
					var view = that;
					if(obj.child.length == 0) {
						//1detph subMenu가 없음
						var key = obj.menuName.replace(' ', '-').toLowerCase();
						html += '<li><a href="#" class="main-nav-btn"><span class="nav-btn noselect" id="'+key+'" data="'+obj.menuName+'">'+ obj.menuName +'</span></a></li>';
						view.elements.url[key] = obj.url;
					} else {
						//1detph subMenu가 있음 dropdown-menu
						html += '<li class="dropdown">'+
										'<a href="#" class="dropdown-toggle main-nav-btn noselect" data-toggle="dropdown">'+ obj.menuName + '<span class="caret"></span></a>'+
										'<ul class="dropdown-menu" role="menu">';
						obj.child.forEach(function(child) {
							if(child.child.length == 0) {
								//2depth 서브 메뉴가 없음.
								var key = child.menuName.replace(' ', '-').toLowerCase();
								html += '<li><a href="#" class="nav-btn" id="'+key+'" data="'+obj.menuName+'"><span id="'+key+'" class="noselect" data="'+obj.menuName+'">'+ child.menuName +'</span></a></li>';
								view.elements.url[key] = child.url;
							}else{
								//2depth 서브 메뉴가 있음 dropdown-submenu
								html += '<li class="dropdown-submenu"><a href="#"><span>'+ child.menuName +'</span></a>'+ //자식이 있는것은 클릭해도 반응없게 
											'<ul class="dropdown-menu">';
								child.child.forEach(function(child_child){
									var key = child_child.menuName.replace(' ', '-').toLowerCase();
									html += '<li><a href="#" class="nav-btn" id="'+key+'" data="'+child.menuName+'"><span id="'+key+' " data="'+child.menuName+'">'+ child_child.menuName +'</span></a></li>';
									view.elements.url[key] = child_child.url;
								});
								html += "</ul></li>";
							}
							
						});
						
						html += '</ul>';
					}
				});
				return html;
			})();
			
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
		
		renderTopSide : function(array){
			var _this = this;
			_this.menuTree = array;
			
			var TopView = (function() {
				var html = '';
				var that = _this;
				that.menuTree.forEach(function(obj) {
					var view = that;
					if(obj.child.length == 0) {
						//1detph subMenu가 없음
						var key = obj.menuName.replace(' ', '-').toLowerCase();
						html += '<li><a href="#" class="main-nav-btn"><span class="nav-btn noselect" id="'+key+'" data="'+obj.menuName+'">'+ obj.menuName +'</span></a></li>';
						view.elements.url[key] = obj.url;
					} else {
						//1detph subMenu가 있음 dropdown-menu
						html += '<li class="dropdown">'+
										'<a href="#" class="dropdown-toggle main-nav-btn noselect" data-toggle="dropdown">'+ obj.menuName +
										'<ul class="dropdown-menu" role="menu">';
						obj.child.forEach(function(child) {
							if(child.child.length == 0) {
								//2depth 서브 메뉴가 없음.
								var key = child.menuName.replace(' ', '-').toLowerCase();
								html += '<li><a href="#" class="nav-btn" id="'+key+'" data="'+obj.menuName+'"><span id="'+key+'" class="noselect" data="'+obj.menuName+'">'+ child.menuName +'</span></a></li>';
								view.elements.url[key] = child.url;
							}else{
								//2depth 서브 메뉴가 있음 dropdown-submenu
								html += '<li class="dropdown-submenu"><a href="#"><span>'+ child.menuName +'</span></a>'+ //자식이 있는것은 클릭해도 반응없게 
											'<ul class="dropdown-menu">';
								child.child.forEach(function(child_child){
									var key = child_child.menuName.replace(' ', '-').toLowerCase();
									html += '<li><a href="#" class="nav-btn" id="'+key+'" data="'+child.menuName+'"><span id="'+key+' " data="'+child.menuName+'">'+ child_child.menuName +'</span></a></li>';
									view.elements.url[key] = child_child.url;
								});
								html += "</ul></li>";
							}
							
						});
						
						html += '</ul>';
					}
				});
				return html;
			})();
			
			this.$el.find("#navView").append(TopView);
			
			var SideView = (function() {
				var html = '';
				var that = _this;
				that.menuTree.forEach(function(obj) {
					var view = that;
					/*var icon = (function() {
						var ic = view.elements.icons[obj.menuName.toLowerCase()];
						if(ic==undefined) ic = "fa-circle-o";
						return ic;
					})();*/
					
					/*if(obj.child.length == 0) {
					 	//1detph subMenu가 없음
						var key = obj.menuName.replace(/ /g, '-').toLowerCase();
						//html += '<li><a href="#"><i class="fa fa-link"></i><span class="nav-btn" id="'+key+'">'+ obj.menuName +'</span></a></li>';
						html += '<li><a href="#"><i class="fa '+ icon +'">' +
								'</i><span class="nav-btn" id="'+key+'" data="'+obj.menuName+'">'+ obj.menuName +'</span></a></li>';
						view.elements.url[key] = obj.url;
					}else{*/
					if(obj.child.length != 0) {
						//1detph subMenu가 있음 dropdown-menu
						var cnvtMenuName = obj.menuName.replace(/ /g, '-').toLowerCase();
						//html += '<li class="treeview" id="'+cnvtMenuName+'" data="'+obj.menuName+'"><span class="noselect"><i class="fa '+ icon +'"></i><span>'+ obj.menuName +'</span></span>' +
						html += '<li class="treeview" id="'+cnvtMenuName+'" data="'+obj.menuName+'"><span class="noselect"><span>'+ obj.menuName +'</span></span>' +
								'<span class="pull-right-container"></span>' +
								'<ul class="treeview-menu">';
						obj.child.forEach(function(child) {
							if(child.child.length == 0) {
								//2depth 서브 메뉴가 없음.
								var key = child.menuName.replace(/ /g, '-').toLowerCase();
								html += '<li class="nav-btn topSide2nd" id="'+key+'" data="'+obj.menuName+'"><i class="fas fa-angle-right topSide2nd" id="'+key+'" data="'+obj.menuName+'" style="color:white;"></i><span class="noselect topSide2nd" id="'+key+'" data="'+obj.menuName+'">'+ child.menuName +'</span></li>';
								view.elements.url[key] = child.url;
							} else {
								//2depth 서브 메뉴가 있음 dropdown-submenu
								//html += '<li class="treeview"><a href="#"><i class="fa '+ icon +'"></i><span class="noselect">'+ child.menuName +'</span>' +
								html += '<li class="treeview"><a href="#"></i><span class="noselect">'+ child.menuName +'</span>' +
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
		
		/*render: function(array) {
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
		
		},*/

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
			if($('body').find("#logoutPopupDialog").size() == 0 ){
				$('body').append("<div id='logoutPopupDialog'></div>");
			}
			
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
						},
					},
					open: function(){

					},
					close: function(){
						$("#logoutPopupDialog").remove();
					},
					width : 400,
					title : "Confirm",
					form : [
						{type: 'label', label: markup},
					],
				}
				$('#logoutPopupDialog').confirm(options);
				$('#logoutPopupDialog').confirm('open');
			} else {
				markup = BundleResource.getString("label.user.notSelect_logout");
				_this.warningPopup(markup);
				return false;
			}
		},
		
		getPrivilegeList : function(){
			var _this = this;
			var getPrivilegeList = new Model();
			getPrivilegeList.url = 'settings/user/getPrivilegeList';
			_this.listenTo(getPrivilegeList, 'sync', _this.setPrivilegeList);
			getPrivilegeList.fetch();
		},
		
		setPrivilegeList : function(method, model, options){
			var result = [];
			var _this = this;
			model.forEach(function(item, idx){
				var newItem = $.extend({}, item);
				newItem.id = item.id;
				newItem.text = item.name;
				result.push(newItem);
			});
			menuMgr.getPrivilegeData = result;
		},
		
		getGroupList : function(){
			var _this = this;
			var getGroupList = new Model();
			getGroupList.url = 'settings/user/getGroupList';
			_this.listenTo(getGroupList, 'sync', _this.setGroupList);
			getGroupList.fetch();
		},
		
		setGroupList : function(method, model, options){
			var result = [];
			var _this = this;
			model.forEach(function(item, idx){
				var newItem = $.extend({}, item);
				newItem.id = idx;
				newItem.text = item.groupName;
				newItem.groupId = item.groupId;
				result.push(newItem);
			});
			menuMgr.getGroupData = result;
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
		
		toggleSideMenu : function(){ //gihwan Fold, Unfold Side Menu
			var sideStatus = $(".main-sidebar").css("display");
			if(sideStatus == "block"){
				$(".main-sidebar").css("display","none");
				$("#togleAreaBack").css("left","0px");
				$(".wrap").css("margin-left","5px");
			}else{
				$(".main-sidebar").css("display","block");
				$("#togleAreaBack").css("left","226px");
				$(".wrap").css("margin-left","230px");
			}
			var findLayout = _.keys(w2ui);
			for(var i = 0; i<findLayout.length; i++){
				var key = findLayout[i];
			/*	var result = key.match("layout");
				if(result != null){*/
					w2ui[key].resize();
				//}
			}
			
			var customEvent = new CustomEvent("resizeEvent");
			window.dispatchEvent(customEvent);
		},
		
		foldeSideMenu : function(){
			var sideStatus = $(".main-sidebar").css("display");
			if(sideStatus == "block"){
				$(".main-sidebar").css("display","none");
				$("#foldIcon").css("left","14px");
				$(".wrap").css("margin-left","5px");
			}else{
				$(".main-sidebar").css("display","block");
				$("#foldIcon").css("left","232px");
				$(".wrap").css("margin-left","230px");
			}
			var findLayout = _.keys(w2ui);
			for(var i = 0; i<findLayout.length; i++){
				var key = findLayout[i];
			/*	var result = key.match("layout");
				if(result != null){*/
					w2ui[key].resize();
				//}
			}
		},
		
		viewUserInfo : function(array) {
			var _this = this;
			menuMgr.userIdx = array.attributes[0].id;
			var privilegeArr = null;
			var statusArr = null;
			var groupArr = null;
			var privilegeId = array.attributes[0].privilegeId;
			var groupId = array.attributes[0].group_id;
			var statusTxt = array.attributes[0].status;
			var userId = array.attributes[0].userId;
			var userName = array.attributes[0].userName;
			var eMail = array.attributes[0].email;
			var phone = array.attributes[0].phone;
			var executeBtn = "userInfoConfirmBtn";
			var getStatus = [{"text" : BundleResource.getString('label.user.enabled_status'), "id" : "1"},
								{"text" : BundleResource.getString('label.user.disabled_status'), "id" : "2"}];
			
			for(var i = 0; i < menuMgr.getPrivilegeData.length; i++){
				if(menuMgr.getPrivilegeData[i].id == privilegeId){
					menuMgr.privilegeArr = menuMgr.getPrivilegeData[i];
				}
			}
			for(var i = 0; i < menuMgr.getGroupData.length; i++){
				if(menuMgr.getGroupData[i].groupId == groupId){
					menuMgr.groupArr = menuMgr.getGroupData[i];
				}
			}
			for(var i = 0; i<getStatus.length; i++){
				if(getStatus[i].id == statusTxt){
					menuMgr.statusArr = getStatus[i];
				}
			}
			
			popupTitle = BundleResource.getString('title.user.editUser'); //"User Edit"; 
			propertyRecord = {
					userId : userId,
					password : '',
					rePassword : '',
					status : menuMgr.statusArr.text,
					privilege : menuMgr.privilegeArr.name,
					group : menuMgr.groupArr.groupName,
					userName : userName,
					eMail : eMail,
					phone : phone
				};
			
			var body = '<div class="w2ui-centered">'+
				'<div id="userInfoPopupContents" style="width:100%; height:305px;" >'+
					'<div class="w2ui-page page-0">'+
		    			'<div class="w2ui-field">'+
		        			'<label>USER ID</label>'+
		        			'<div>'+
		        				'<input name="userId" type="text" style="width:258px;" size="40" min="4", max="20"/>'+
		        			'</div>'+
		        		'</div>'+
		    			'<div class="w2ui-field">'+
		        			'<label>PASSWORD</label>'+
		        			'<div>'+
		        				'<input name="password" type="password" style="width:258px; size="40" min="9", max="16"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>RE-PASSWORD</label>'+
		        			'<div>'+
		        				'<input name="rePassword" type="password" style="width:258px; size="40" min="9", max="16"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div id="statusListArea" class="w2ui-field">'+
		        			'<label>STATUS</label>'+
		        			'<div>'+
		        				'<input name="status" type="list" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>PRIVILEGE</label>'+
		        			'<div>'+
		        				'<input name="privilege" type="list" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>GROUP</label>'+
		        			'<div>'+
		        				'<input name="group" type="list" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>USER NAME</label>'+
		        			'<div>'+
		        				'<input name="userName" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>E-MAIL</label>'+
		        			'<div>'+
		        				'<input name="eMail" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
		        		'<div class="w2ui-field">'+
		        			'<label>PHONE</label>'+
		        			'<div>'+
		        				'<input name="phone" type="text" style="width:258px; size="40"/>'+
		        			'</div>'+
		        		'</div>'+
					'</div>'+
				'</div>'+
				'<div id="userInfoBottom" style="height:30px;text-align: center">'+
					'<button id='+executeBtn+' class="darkButton">' + BundleResource.getString('button.user.save') + '</button>'+
					'<button onclick="w2popup.close();"  class="darkButton">' + BundleResource.getString('button.user.close') + '</button>'+
				'</div>'+
			'</div>';
		
			w2popup.open({
				title : popupTitle,
		        body: body,
		        width : 480,
		        height : 400,
		        opacity   : '0.5',
	    		modal     : true,
		     	showClose : true,
		     	style	  : "overflow:hidden;",
		     	onOpen    : function(event){
		     		event.onComplete = function (event) {
		     			$("#userInfoBottom").html();
		     		}
		        },
		        onClose   : function(event){
		        	w2ui['user_info_popup_properties'].destroy();
		        }
			});
			
			$("#userInfoPopupContents").w2form({
				name : 'user_info_popup_properties',
				style:"border:1px solid rgba(0,0,0,0);",
				focus : 0,
				fields : [
					{name:'userId', type: 'text', disabled:false, required:true, html:{caption:'USER ID'}},
					{name:'password', type: 'password', required:true, html:{caption:'PASSWORD'}},
					{name:'rePassword', type: 'password', required:true, html:{caption:'RE-PASSWORD'}},
					{name:'status', type: 'text', hidden:false, required:false, html:{caption:'STATUS'}},
					{name:'privilege', type: 'text', required:false, html:{caption:'PRIVILEGE'}},
					{name:'group', type: 'text', required:false, html:{caption:'GROUP'}},
					{name:'userName', type: 'text', required:false, html:{caption:'USER NAME'}},
					{name:'eMail', type: 'text', required:false, html:{caption:'E-MAIL'}},
					{name:'phone', type: 'text', required:false, html:{caption:'PHONE'}}
				],
				
				record: propertyRecord,
				onRender : function(event){
					event.onComplete = function(event){
						w2ui['user_info_popup_properties'].fields[5].disabled = true;
						w2ui['user_info_popup_properties'].fields[4].disabled = true;
						w2ui['user_info_popup_properties'].fields[3].disabled = true;
						w2ui['user_info_popup_properties'].fields[0].disabled = true;
						w2ui['user_info_popup_properties'].fields[0].required = false;
					}
				}
			});
		},
		
		checkPassword : function(password, rePassword){
			var _data = password;
			//"비밀번호를 입력해 주세요.";
			if(_data == '') return BundleResource.getString('label.user.no_input_password');
			
			var pwStrChk = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
			var pwRepeatChk = /(\w)\1\1/;
			//"비밀번호는 영문 대소문자,숫자,특수문자 조합의 8자부터 15자까지 입력 가능합니다.";
			if(!pwStrChk.test(_data)) return BundleResource.getString('label.user.valid_password');
			//"비밀번호가 일치하지 않습니다.";
			if(password != rePassword) return BundleResource.getString('label.user.no_match_password');
			return null;
		},
		
		userInfoModifyAction : function() {
			var _that = this;
			var requestParam, alarm_on_off, alarm_type, createTime, email, password, phone, 
			startRow, endRow, privilegeId, userId, userName, groupId, status, rePassword = null;
			var userInfo_editModel = new Model();
			var urlRoot = "settings/user";
			var id = 0;
			var startRow = 1;
			var endRow = 22;
			var loginId = sessionStorage.getItem("LOGIN_ID");
			var tempPassword = $("#pwAddEditBox").val();
			var requestParam = w2ui['user_info_popup_properties'].record;

			userId = requestParam.userId;
			password = requestParam.password;
			rePassword = requestParam.rePassword;
			privilegeId = menuMgr.privilegeArr.id;
			groupId = menuMgr.groupArr.groupId;
			status = menuMgr.statusArr.id;
			userName = requestParam.userName;
			email = requestParam.eMail;
			phone = requestParam.phone;
			alarm_on_off = "off";
			createTime = util.getDate("now");
			window.w2utils.settings.dataType = "RESTFULLJSON";

			/*let alarmOnOff = $('input[name=userInfoAlarmModifySelectBox]:checked').val();
			if (alarmOnOff == undefined || alarmOnOff == null) {
				alarmOnOff = "off";
			}*/
			$('body').loading();
//			$('body').loading('show');

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
			/*let alarmBox_size = $('input[name=userInfoGroupModifySelectBox]:checked').length;
			let alarmArray = [];
			for (var i = 0; i < alarmBox_size; i++) {
				alarmArray[i] = $('input[name=userInfoGroupModifySelectBox]:checked')[i].value;
			}
			let alarmString = alarmArray.join();*/

			// $('body').loading('show');
			
			var checkPwdResult = menuMgr.checkPassword(password, rePassword);
			
			if(checkPwdResult != null){
				var alertBodyContents = checkPwdResult;
				body = '<div class="w2ui-centered">'+
					'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+alertBodyContents+'</div>'+
					'<div class="menuMgr-popup-btnGroup">'+
						'<button onclick="w2popup.message();" class="darkButton">' + BundleResource.getString('button.user.confirm') + '</button>'+
					'</div>'+
				'</div>' ;
	    		w2popup.message({ 
	    			width   : 480, 
	    			height  : 180,
	    			html    : body
	    		});
			}else{
				userInfo_editModel.url = urlRoot + '/' + menuMgr.userIdx;
				userInfo_editModel.set("id", menuMgr.userIdx);
				userInfo_editModel.set({
					"userId" : userId,
					"password" : password,
					"privilegeId" : privilegeId,
					"group_id" : groupId,
					"userName" : userName,
					"status" : status,
					"email" : email,
					"phone" : phone,
					"alarm_on_off" : alarm_on_off,
					"startRow" : startRow,
					"endRow" : endRow
				});
				
				userInfo_editModel.save(null, {
					success : function(userModel, response) {
						w2popup.close();
						var bodyContents = BundleResource.getString('label.user.changedContents');
						//"변경 되었습니다.";
						body = '<div class="w2ui-centered">'+
						'<div class="popup-contents">'+ bodyContents +'</div>'+
						'<div class="popup-btnGroup">'+
						'<button class="darkButton" onclick="w2popup.close();">' + BundleResource.getString('button.user.confirm') + '</button>'+
						'</div>'+
						'</div>' ;
						
						w2popup.open({
							width: 385,
							height: 180,
							title : BundleResource.getString('title.user.info'),
							body: body,
							opacity   : '0.5',
							modal     : true,
							showClose : true,
							onClose   : function(event){
								
							}
						});
					},
					error : function(userModel, response) {
						
					}
				});
			}
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
		}
	})

	return Menu;
});