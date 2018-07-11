<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
	<head>
		<title>DAVIS</title>
		<meta http-equiv="Cache-Control" content="no-cache"/>
		<meta http-equiv="Expires" content="0"/>
		<meta http-equiv="Pragma" content="no-cache"/>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<link rel="icon" style="cursor:default" href="<%=request.getContextPath()%>/dist/img/favicon.ico">
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
		<script data-main="dist/app" src="<%=request.getContextPath()%>/dist/plugins/requirejs/require.js"></script>
		<style>
			body { background-color: rgb(34, 43, 50); }
		</style>
		
		<script>
			sessionStorage.setItem("NAVI_DIRECTION", "topSide");
		</script>
	</head>
	<body id="captureScreen" class="hold-transition skin-blue layout-top-nav">
		<div class="wrapper" style="display: none;">
		<header class="main-header">
			<nav class="navbar navbar-static-top">
				<div class="container">
					<div class="brand-logo">
						<img class="logo_itam noselect" src="/dist/img/logo_itam.png" style="bottom: 8px; position: relative;">
						<!-- <a href="" class="navbar-brand" data-i18n="title.main.normal" style="font-weight: bold;"></a> -->
						<!-- YESCNC -->
					</div>

					<!-- Collect the nav links, forms, and other content for toggling -->
					<!-- Main Menu -->
					<div class="navbar-collapse pull-left" id="navbar-collapse">
						<ul class="nav navbar-nav" id="navView">
						</ul>
					</div>
					<div class="navbar-custom-menu">
						<!-- <div id="captureBtn" style="float:left;position:relative;top:18px;">
							<i class="fas fa-camera" title="Capture"></i>
						</div> -->
						<div class="clock">
						  <ul class="noselect">
						      <li id="hours" style="display: inline;"></li>
						      <li id="point" style="display: inline;">:</li>
						      <li id="min" style="display: inline;"></li>
						      <li id="point" style="display: inline;">:</li>
						      <li id="sec" style="display: inline;"></li>
						      <li id="am_pm" style="display: inline;"></li>
						  </ul>
						</div>
						<div class="noselect" style="float:left;position:relative;top:11px; right:7px; width:28px;">
							<i class="fab fa-yes-connection fa-2x noselect" id="connectStatus" title="Connection" style="color:#64ff4f; cursor:default; padding:2px;"></i>
							<i class="fab fa-yes-disconnection fa-2x noselect" id="connectStatus" title="Disconnection" style="color:#737373; cursor:default; padding:2px;"></i>
							<!-- <img src="dist/img/on.png" class="connection" id="connectStatus" title="Connected">
							<img src="dist/img/off2.png" class="disconnection" id="connectStatus" title="Disconnected"> -->
						</div>
						<div class="noselect" style="float:left;">
							<span id='navbar-userId' style="padding-right: 5px;position:relative;bottom:2px;">login-user</span>
						</div>
						<div style="float:right;padding-top: 18px;">
							<i id="signOutBtn" class="fa fa-sign-out-alt fa" aria-hidden="true" title="Logout"></i>
						</div>
						
					</div>
					
				</div>
			</nav>
		</header>
		
		<div class='content'>
			<div class='content-title'>
				<div style="float:left;width:230px;"><span class="noselect"></span></div>
				<div id="tickerCls" style="overflow:hidden;"></div>
				<div class="showHide">
					<i id="tickerShowHide" class="fas fa-eye-slash" aria-hidden="true" title="Hide" ></i>
				</div>
			</div>
			<aside class="main-sidebar">
				<section class="sidebar">
					<ul class="sidebar-menu">
					</ul>
				</section>
			</aside>
			<!-- <div id="togleAreaBack"><span id="togleArea"></span></div> --> <!-- Fold bar -->
			<!-- <i class="fas fa-align-justify" id="foldIcon"></i> -->
			<div class='wrap'></div>
			
		</div>
		<footer id='foot'></footer>
		</div>
		<div id="email_popup" class="email_popup"></div>
		<div id="email_detail_popup"></div>
		<div id="attachFile"></div>
	</body>
</html>