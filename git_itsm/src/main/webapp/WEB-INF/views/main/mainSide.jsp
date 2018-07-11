<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html>
<head>
<title>Yes Core</title>
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	name="viewport">
<script data-main="dist/app"
	src="<%=request.getContextPath()%>/dist/plugins/requirejs/require.js"></script>
<style>
	body { background-color: rgb(34, 43, 50); }
</style>
<script>
	sessionStorage.setItem("NAVI_DIRECTION", "side");
</script>
</head>
<body class="skin-blue sidebar-mini sidebar-collapse">
	<div class="wrapper" style="display: none;">
		<header class="main-header">
			<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
				<span class="sr-only">Toggle navigation</span>
			</a>
			<nav class="navbar navbar-static-top" role="navigation">
				<div class="navbar-custom-menu">
					<ul class="nav navbar-nav">
						<li class="dropdown user user-menu dropdown-toggle">
							<a href="#" class="" data-toggle="dropdown">
								<div class="user-image" alt="User Image"></div>
								<div><span id='navbar-userId' class="">login-user</span></div>
								<div class="user-arrow" ></div>
								<!--
								<img src="dist/img/menu/login.png" class="user-image" alt="User Image">
								-->
							</a>
							<ul class="dropdown-menu">
								<!-- Menu Body -->
								<li class="user-body">
				             		<div class="user-info-btn info-box-component">
										<a href="#" class="" name="en" id="userInfo" data-i18n="label.user.info"></a> 
				                	</div>
				                	<div class="sign-out-btn info-box-component">
										<a href="#" class="btn btn-default btn-flat" id="signOutBtn" data-i18n="label.user.signout">Sign out</a>
							  		</div>
				                </li>
				                <li class="user-footer">
									<div class="en-btn info-box-component">
			             				<a href="#" class="btn btn-default btn-flat main_lang en-off" name="en" ></a>
			             			</div>
			             			<div class="ko-btn info-box-component">
			             				<a href="#" class="btn btn-default btn-flat main_lang ko-off" name="ko" ></a>
			             			</div>
								</li>
				          	</ul>
						</li>
					</ul>
				</div>
			</nav>
		</header>
		<aside class="main-sidebar">
			<section class="sidebar">
				<ul class="sidebar-menu">
				</ul>
			</section>
		</aside>
		<section class="content-wrapper">
			<div class='content'>
				<div class='wrap'></div>
			</div>
		</section>
		<footer id='foot'></footer>
		</div>
</body>
</html>