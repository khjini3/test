<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
	<head>
		<title>Yes Core</title>
		<meta http-equiv="Cache-Control" content="no-cache"/>
		<meta http-equiv="Expires" content="0"/>
		<meta http-equiv="Pragma" content="no-cache"/>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
		<script data-main="dist/app" src="<%=request.getContextPath()%>/dist/plugins/requirejs/require.js"></script>
		<style>
			body { background-color: rgb(34, 43, 50); }
		</style>
		
		<script>
			sessionStorage.setItem("NAVI_DIRECTION", "top");
		</script>
	</head>
	
	<body class="hold-transition skin-blue layout-top-nav">
		<div class="wrapper" style="display: none;">
		<header class="main-header">
			<nav class="navbar navbar-static-top">
				<div class="container">
					<div class="navbar-header">
						<a href="" class="navbar-brand" data-i18n="title.main.normal"><b></b></a>
						<!-- <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
							<i class="fa fa-bars"></i>
						</button> -->
					</div>

					<!-- Collect the nav links, forms, and other content for toggling -->
					<!-- Main Menu -->
					<div class="collapse navbar-collapse pull-left" id="navbar-collapse">
						<ul class="nav navbar-nav" id="navView">
						</ul>
					</div>
					
					<div class="navbar-custom-menu">
						<ul class="nav navbar-nav">
							<!-- Messages: style can be found in dropdown.less-->
							<li class="dropdown messages-menu">
								<!-- Menu toggle button -->
								<a href="#" class="dropdown-toggle" data-toggle="dropdown">
									<i class="fa fa-envelope-o"></i>
								</a>
								<ul class="dropdown-menu">
									<li class="header">You have 4 messages</li>
									<li>
										<!-- inner menu: contains the messages -->
										<ul class="menu">
											<li><!-- start message -->
												<a href="#">
													<div class="pull-left">
													</div>
													<!-- Message title and timestamp -->

													<!-- The message -->
													<p>Why not buy a new awesome theme?</p>
												</a>
											</li>
											<!-- end message -->
										</ul>
										<!-- /.menu -->
									</li>
									<li class="footer"><a href="#">See All Messages</a></li>
								</ul>
							</li>
							<!-- /.messages-menu -->
							
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
				</div>
			</nav>
		</header>
		<div class='content'>
			<div class='wrap'></div>
		</div>
		<footer id='foot'></footer>
		</div>
	</body>
</html>