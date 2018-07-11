<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html>
<head>
<title>DAVIS</title>
<meta name="description" content="New Style Login website template">
<meta name="author" content="new-digital-craft">
<meta name="keywords" content="login">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" style="cursor:default" href="<%=request.getContextPath()%>/dist/img/favicon.ico">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/dist/css/main/login.css">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/dist/plugins/bootstrap/css/bootstrap.css" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/dist/plugins/jQueryUI/jquery-ui.min.css" />	
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/dist/js/lib/ui/YescoreUI.css" />		
<script
	src="<%=request.getContextPath()%>/dist/plugins/jQuery/jquery.min.js">
</script>
<script
	src="<%=request.getContextPath()%>/dist/plugins/jQueryUI/jquery-ui.min.js">
</script>
<script
	src="<%=request.getContextPath()%>/dist/plugins/bootstrap/js/bootstrap.js">
</script>
<script
	src="<%=request.getContextPath()%>/dist/js/lib/ui/YescoreUI.js">
</script>	

<script>
	$(document).ready(function(){
		$("#user").focus();
		changeLanguage();
	});
	
	function changeLanguage(){
		
		var language = document.getElementById("language");
		var changedLanguage = language.options[language.selectedIndex].value;
		if("en" == changedLanguage){
			$("#user").attr("placeholder", "ID");
			$("#pass").attr("placeholder", "Password");
			$("#login-btn").val("Login");
		}else{
			$("#user").attr("placeholder", "아이디");
			$("#pass").attr("placeholder", "비밀번호");
			$("#login-btn").val("로그인");
		}
	}
	
	$(function() {
		$(window.document).on("contextmenu", function(event){return false;});
		
		$("#warningPopup").hide();
		$("#setRootPW").hide();
		$("#changePW").hide();
		//$(".error-img").hide();
		
		$("#user,#pass").click(function (e) {
			if($("#error-msg").text() != "") {
				$("#user,#pass").val("");
				$('.error-msg-field').removeClass('show-error');
				$('#error-msg').text('');
			}
		});		
		
		$("#user,#pass").keypress(function (e) {
			if(e.which == 13) {
				actionLogin();
			}
		});
		
		$("#login-btn").on("click", function() {
			actionLogin();
		});
		
		// Language select. Checkbox
		$("#koBtn").on("click", function(){
			if($("#koBtn").prop("checked")){
				$("#enBtn").prop("checked", false);
				$("#user").attr("placeholder", "아이디");
				$("#pass").attr("placeholder", "비밀번호");
				$("#login-btn").val("로그인");
			}else{
				$("#enBtn").prop("checked", true);
				$("#user").attr("placeholder", "ID");
				$("#pass").attr("placeholder", "Password");
				$("#login-btn").val("Login");
			}
		});
		
		$("#enBtn").on("click", function(){
			if($("#enBtn").prop("checked")){
				$("#koBtn").prop("checked", false);
				$("#user").attr("placeholder", "ID");
				$("#pass").attr("placeholder", "Password");
				$("#login-btn").val("Login");
			}else{
				$("#koBtn").prop("checked", true);
				$("#user").attr("placeholder", "아이디");
				$("#pass").attr("placeholder", "비밀번호");
				$("#login-btn").val("로그인");
			}
		});
		//------------------------------------------------
		function setRootPassword(errmsg) {
			$('.error-msg-field').removeClass('show-error');
			$('#error-msg').text('')
			var _this = this;
			var title = "Root Registration";
			//var title = BundleResource.getString("title.login.rootAdd_popup");
			var markup = "";
        	var options = {
    				main: true,
        			modal: true,
        			buttons: {
    			    	  Ok: function() {
    			    		  var that = _this;
    			    		  if($("#pwAddEditBox").val() != $("#rePwAddEditBox").val()) {
    			    			  markup = "PASSWORD와 RE-PASSWORD가 일치하지 않습니다.";
    			    			  //markup = BundleResource.getString("label.user.password_discrepancy");
    			    			  alertPopup(markup, 'Information');
    			    			  return false;
    			    		  }  else if(that.validate.valid().invalidCount == 0) {
    			    			  	var userId = $("#user").val();
    			    		  		var password = $("#pwAddEditBox").val();
    			    		  		var privilegeId = 0;
    			    		  		var groupId = 1;
    			    		  		var status = 1;
    			    		  		var loginStatus = 2;
    			    		  		var createTime = getTimeStamp();
    			    		  		
    			    		  		data = JSON.stringify({
    			    		  			"id":0, 
    			    		  			"userId":userId, 
    			    		  			"password":password, 
    			    		  			"privilegeId":privilegeId, 
    			    		  			"groupId":groupId, 
    			    		  			"status":status, 
    			    		  			"createTime":createTime, 
    			    		  			"loginStatus":loginStatus, 
    			    		  			"alarm_on_off" : "off"
    			    		  		});
    			    		  		
    			    		  		if(errmsg == "letter.message.notexists.root") {
        			    		  		//data = JSON.stringify({"userId":userId, "password":password, "privilegeId":privilegeId, "groupId":groupId, "status":status, "createTime":createTime, "loginStatus":loginStatus});
    	    				            $.ajax({
    	    				                url: "/settings/user",
    	    				                type: "POST",
    	    				                dataType: "json",
    	    				                contentType: "application/json;charset=UTF-8",
    	    				                data: data,
    	    				                success : function(data){
    	    				                	alertPopup("저장 되었습니다.", 'Information');
    						                },
    						                error : function(data) {
    	
    						                }
    						            });
    			    		  		} else {
        			    		  		//data = JSON.stringify({"userId":userId, "password":password});
    	    				            $.ajax({
    	    				                url: "settings/user/0",
    	    				                type: "PUT",
    	    				                dataType: "json",
    	    				                contentType: "application/json;charset=UTF-8",
    	    				                data: data,
    	    				                success : function(data){
    	    				                	
    						                },
    						                error : function(data) {
    	
    						                }
    						            });
    			    		  		}	
        			    	  		$(this).popup("close");
    			    	  		}
    			          },
    			          Cancel: function() {
    			            $(this).popup("close");
    			          }
    		        },
      		        open: function() {
      		        	setUserAddValidation();
      		        },
    				title: title,
    				width: 550,
    				form: [
    					{id: 'pwAddEditBox', type: 'password', label: 'Password',placeholder: '', value: ''},
    					{id: 'rePwAddEditBox', type: 'password', label: 'Re-Password',placeholder: '', value: ''}
    				],
        	}
        	
        	$('#setRootPW').popup(options);
        	$('#setRootPW').popup('open');
		}

		function changePassowrd(errmsg) {
			$('.error-msg-field').removeClass('show-error');
			$('#error-msg').text('')
			var _this = this;
			var userId = $("#user").val();
			var data = "search" + "=" + userId;
			var tempPassword = null;
			
            $.ajax({
                url: "/settings/user",
                type: "GET",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                data: data,
                success : function(data){
        			var title = "Change Passowrd";
        			//var title = BundleResource.getString("title.login.rootAdd_popup");
        			var markup = "";
                	var options = {
            				main: true,
                			modal: true,
                			buttons: {
            			    	  Ok: function() {
            			    		  var that = _this;
            			    		  if($("#pwAddEditBox").val() != $("#rePwAddEditBox").val()) {
            			    			  markup = "PASSWORD와 RE-PASSWORD가 일치하지 않습니다.";
            			    			  //markup = BundleResource.getString("label.user.password_discrepancy");
            			    			  alertPopup(markup, 'Information');
            			    			  return false;
            			    		  } else if(that.validate.valid().invalidCount == 0) {
            			    		  		var password = $("#pwAddEditBox").val();
            			    		  		
            			    		  		info = JSON.stringify({
            			    		  			"id":data[0].id, 
            			    		  			"userId":data[0].userId, 
            			    		  			"password":password, 
            			    		  			"privilegeId":data[0].privilegeId, 
            			    		  			"groupId":data[0].groupId, 
            			    		  			"status":data[0].status, 
            			    		  			"createTime":data[0].createTime, 
            			    		  			"loginStatus":data[0].loginStatus, 
            			    		  			"alarm_on_off" : data[0].alarm_on_off,
            			    		  			"alarm_type" : data[0].alarm_type,
            			    		  			"firstLoginCheck" : 1,
            			    		  			"tempPassword": tempPassword
            			    		  		});

        	    				            $.ajax({
        	    				                url: "/settings/user/update",
        	    				                type: "PUT",
        	    				                dataType: "json",
        	    				                contentType: "application/json;charset=UTF-8",
        	    				                data: info,
        	    				                success : function(data){
        	    				                	alertPopup("비밀번호가 변경 되었습니다.", 'Information');
        						                },
        						                error : function(data) {
        	
        						                }
        						            });	
                			    	  		$(this).popup("close");
            			    	  		}
            			          },
            			          Cancel: function() {
            			            $(this).popup("close");
            			          }
            		        },
              		        open: function() {
              		        	setUserAddValidation();
              		        },
            				title: title,
            				width: 550,
            				form: [
            					{id: 'pwAddEditBox', type: 'password', label: 'Password',placeholder: '', value: ''},
            					{id: 'rePwAddEditBox', type: 'password', label: 'Re-Password',placeholder: '', value: ''}
            				],
                	}
                	
                	$('#changePW').popup(options);
                	$('#changePW').popup('open');
                },
                error : function(data) {

                }
            });
		}		
		
		function setUserAddValidation() {
        	var rules = {
    			'pwAddEditBox': {require: 'checkPw', min:8, max:16},
    			'rePwAddEditBox': {require: 'checkPw', min:8, max:16},
        	}
        	var messages = {
        		'pwAddEditBox': "영문 대소문자,숫자,특수문자 조합의 8자부터 15자까지 입력 가능합니다.",
        		'rePwAddEditBox': "영문 대소문자,숫자,특수문자 조합의 8자부터 15자까지 입력 가능합니다."
        	}
        	this.validate = new Validate(rules, messages);
        }
		
		function alertPopup(markup, title) {
			var _this = this;
       		/* var options = {
    				buttons: {
    			    	  OK: function() {
    			    		 $(this).confirm("close");
    			          }
    		        },
    		        width: 400,
    				title: title,
    				form: [
    				       {id: 'warning', type: 'label', label: markup},
    				],
        	}
        	$('#warningPopup').confirm(options);
    		$('#warningPopup').confirm('open');	 */
    		//$('.error-img').show();
    		$('.error-msg-field').addClass('show-error');
    		$("#error-msg").text(markup);
    		
		}
		
		function getTimeStamp() {
			var d = new Date();
			var s =
				leadingZeros(d.getFullYear(), 4) + '-' +
				leadingZeros(d.getMonth() + 1, 2) + '-' +
				leadingZeros(d.getDate(), 2) + ' ' +
				
				leadingZeros(d.getHours(), 2) + ':' +
				leadingZeros(d.getMinutes(), 2) + ':' +
				leadingZeros(d.getSeconds(), 2);
			
			return s;
		}
		
		function leadingZeros(n, digits) {
			var zero = '';
			n = n.toString();
			
			if (n.length < digits) {
				for (i = 0; i < digits - n.length; i++)
					zero += '0';
			}
			return zero + n;
		}
		
		function actionLogin() {
            var userID = $("#user").val();
            var userPW = $("#pass").val();
            var userInfoMsg = "사용자의 정보가 일치하지 않습니다. 사용자 정보를 확인해 주세요.";
            var serverErrMsg = "서버와 연결할수 없습니다. 서버의 상태를 확인해 주세요.";
            var denyedIpMsg = "거부된 IP로 로그인을 시도 하였습니다.";
            var denyedUserMsg = "거부된 계정으로 로그인을 시도 하였습니다.";
            var language = document.getElementById("language");
    		var changedLanguage = language.options[language.selectedIndex].value;

    		if(userID == null || userID == "" || $("#user").val().length == 0) { 
            	markup = userInfoMsg;
            	//markup = BundleResource.getString("label.login.information_discrepancy");
        		alertPopup(markup, 'Information');
            } else if(userID != "root" && ($("#pass").val() == null || $("#pass").val() == "" || $("#pass").val().length == 0)) {
            	markup = userInfoMsg;
            	//markup = BundleResource.getString("label.login.information_discrepancy");
        		alertPopup(markup, 'Information');
            } else {
	            $.ajax({
	                url: "/login",
	                type: "POST",
	                dataType: "json",
	                contentType: "application/json;charset=UTF-8",
	                data: JSON.stringify({
	                    "LOGIN_ID": userID,
	                    "USER.ID": userID,
	                    "userId": userID,
	                    "USER.PASSWORD": userPW,
	                    "language": changedLanguage
	                }),
	                success : function(data){
	                    if(data.result) {         
	                        var response = data.data;  
	                          //window.location.replace("main.do" + "?" + "srcId=" + userID); // standalone
	                        if (response.RESULT == "OK") {
	                        	sessionStorage.setItem("LOCALE", response.LOCALE);
	                        	sessionStorage.setItem("USER_IDX", response.USER_IDX);
	                        	sessionStorage.setItem("LOGIN_ID", response.LOGIN_ID);
	                        	sessionStorage.setItem("IP_ADDRESS", response.SRC_IP);
	                        	sessionStorage.setItem("SESSION_ID", response.SESSION_ID);
	                        	sessionStorage.setItem("PRIVILEGE_ID", response.PRIVILEGE_ID);
	                        	sessionStorage.setItem("GROUP_ID", response.GROUP_ID);
	                        	sessionStorage.setItem("EMAIL", response.EMAIL);
	                        	window.location.replace("/main");
	                        } else if(response.RESULT == "letter.message.notexists.root") {
	                			setRootPassword(response.RESULT);
                        	} else if(response.RESULT == "letter.message.password.empty") {
                        		setRootPassword(response.RESULT);
                        	} else if(response.RESULT == "letter.message.firstLogin.changePassword") {
                        		changePassowrd(response.RESULT);
                        	} else if(response.RESULT == "letter.message.same.session.logged") {
	                			markup = "접속 상태의 ID로 로그인을 시도 하였습니다.";
	                			//markup = BundleResource.getString("label.login.same_session_logged");
	                			alertPopup(markup, 'Information');
                        	} else if(response.RESULT == "letter.message.password" || response.RESULT == "letter.message.notexists.loginid" ||
                        			  response.RESULT == "letter.message.notexists.loginip") {
                        		markup = userInfoMsg;
                        		//markup = BundleResource.getString("label.login.information_discrepancy");
	                			alertPopup(markup, 'Information');
                        	} else if(response.RESULT == "letter.message.denyed.userid") {
	                			markup = denyedUserMsg;
	                			//markup = BundleResource.getString("label.login.same_session_logged");
	                			alertPopup(markup, 'Information');
                        	} else if(response.RESULT == "letter.message.denyed.ipaddr") {
	                			markup = denyedIpMsg;
	                			//markup = BundleResource.getString("label.login.same_session_logged");
	                			alertPopup(markup, 'Information');
                        	}  
                        	//else if(response.RESULT == "letter.message.notexists.loginid") {
                        	//	markup = userInfoMsg;
                        		//markup = BundleResource.getString("label.login.information_discrepancy");
	                		//	alertPopup(markup, 'Information');
                        	//} else if(response.RESULT == "letter.message.notexists.loginip") {
                        	//	markup = userInfoMsg;
                        		//markup = BundleResource.getString("label.login.information_discrepancy");
	                		//	alertPopup(markup, 'Information');
                        	//} else if(response.RESULT == "letter.message.denyed.userid") {
                        	//	markup = userInfoMsg;
                        		//markup = BundleResource.getString("label.login.information_discrepancy");
	                		//	alertPopup(markup, 'Information');
                        	//} 
                        	else if(response.RESULT == "NOK") {
	                			markup = serverErrMsg;
	                			//markup = BundleResource.getString("label.login.disconnect_server");
	                			alertPopup(markup, 'Information');
                        	} else {
                        		alertPopup(response.RESULT, 'Information');
	                    	}
	                    } else {
                			markup = serverErrMsg;
                			//markup = BundleResource.getString("label.login.disconnect_server");
                			alertPopup(markup, 'Information');
	                    }
	                },
	                error : function(data) {
            			markup = serverErrMsg;
            			//markup = BundleResource.getString("label.login.disconnect_server");
            			alertPopup(markup, 'Information');
	                }
	            });
			}
		}
	});
</script>
</head>

<body class="yes-alpha">
	<div class="total-content">
		<!-- <img src="dist/img/login/login_bg.jpg" class="background-img" > -->
		<div class='davisLogo'></div>
		<div class="davisChart"></div>
		<div class="davisEqulize"></div>
		<div class="davisDashboard"></div>
		<div class='box'>
		   <!-- <div class="box-top"><img src="dist/img/login/login_top.jpg"></div> -->
		  <div class='box-form'>
		    <div class='box-login'>
		      <div class='fieldset-body' id='login_form'>
		      	<input type='text' id='user' name='user' placeholder="ID" autocomplete="off"/>
				<input type='password' id='pass' name='pass' placeholder="Password"  autocomplete="off"/>
				<!-- <input type='password' id='pass' name='pass' placeholder="Password" autocomplete="new-password"/> -->
			
			<!-- Checkbox -->	
			<!-- <div class="selectLanguage">
					<span class="chgLanguage"><input type="checkbox", id="koBtn", name="chgLanguageBtn", value="ko">
						<span class="chgBtnText noselect">한국어</span>
					</span>
					<span class="chgLanguage"><input type="checkbox", id="enBtn", name="chgLanguageBtn", value="en", checked="checked">
						<span class="chgBtnText noselect" style="left: 108px;">English</span>
					</span>
				</div> -->
			
			<!-- Combobox -->
			<div style="height: 45px;">
				<img style="-webkit-user-select: none;height: 18px; position: absolute; top: 140px; left: 285px;" src="/dist/img/login/language.png">
				<select name = "language" id="language" class="selectLanguage" onchange="changeLanguage()">
					<option value="en" style="color:rgb(33, 42, 74);" >English</option>
					<option value="ko" style="color:rgb(33, 42, 74);" selected="selected">한국어</option>
				</select>
				</div>	
				
		        
				<div style="text-align: center;">
					<input type='submit' id='login-btn' value='Login' />
				</div>
				<p class='error-msg-field'>
		     	   <img src="dist/img/login/icon_warning_login.png" class="error-img" >
		        	<label id='error-msg'></label>
		        </p>
		      </div>
		    </div>
		    <div id="warningPopup" class="warning-dialog-popup"></div>
		    <div id="setRootPW" class="root-form-dialog">
		    <div id="changePW" class="changePW-form-dialog">
		    </div>
		  </div>
		</div>
		
	</div>
</body>
</html>