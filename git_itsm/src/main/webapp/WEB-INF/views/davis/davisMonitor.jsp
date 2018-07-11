<div id='davisMonitor' class="davisMonitor no-padding">
	<div class='content-area'>
		<div class="contentsCls" id="contentsDiv">
			<section>
				<div class="col-xs-6">
					<!-- <div style="height:35px;"></div> -->
					<section class="panel-type">
						<div class="dashboard-panel" >
							<div class="dashboard-title">
								<span>Davis Map Editor - List Type</span>
								<div class="tool-bar" draggable=true>
									<!-- <i class="fas fa-cog map-config" id="map00001-config" ></i> -->
								</div>
							</div>
							<div class="dashboard-contents">
								<div id="map00001" class="yesMap" type="list"></div>
							</div>
						</div>
					</section>
				</div>
				<div class="col-xs-6">
					<!-- <div style="height:35px;"></div> -->
					<section class="panel-type">
						<div class="dashboard-panel" >
							<div class="dashboard-title">
								<span>Davis Map Editor</span>
								<div class="tool-bar">
									<!-- <i class="fas fa-cog map-config" id="map00002-config"></i> -->
								</div>
							</div>
							<div class="dashboard-contents">
								<div id="map00002" class="yesMap" type="map"></div>
							</div>
						</div>
					</section>
					
				</div>
			</section>
			
			<section>
				<div class="col-xs-12" id="eventBrower">
					<div class="dashboard-panel" >
					<div class="dashboard-title" style="padding:0px;">
						<div id="topDownDiv" style="float:left; padding:7px;">
							<!-- <img id="btnTop" src="dist/img/idc/btn/event_up_btn.png">
							<img id="btnDown" src="dist/img/idc/btn/event_down_btn.png" style="display:none;"> -->
							<span>Event Viewer</span>
						</div>
						
						<div id="severityDiv">
							<div class="severityBtnCls">
	            				<img src="dist/img/idc/btn/ack_btn_img.png" class="severityBtn" id="ackBtn">
	            			</div>
							<div class="severityBtnCls">
			            		<img src="dist/img/idc/btn/all_btn_img.png" class="severityBtn">
			            		<div class="severityTxt" id="allCnt">0</div>
			            	</div>
		            		<div class="severityBtnCls">
		            			<img src="dist/img/idc/btn/alarm_cr.png" class="severityBtn">
		            		<div class="severityTxt" id="criCnt">0</div>
		            		</div>
		            		<div class="severityBtnCls">
			            		<img src="dist/img/idc/btn/alarm_ma.png" class="severityBtn">
			            		<div class="severityTxt" id="maCnt">0</div>
			            	</div>
			            	<div class="severityBtnCls">
			            		<img src="dist/img/idc/btn/alarm_mi.png" class="severityBtn">
			            		<div class="severityTxt" id="miCnt">0</div>
			            	</div>
			            	<!-- <div class="severityBtnCls">
			            		<img src="dist/img/idc/btn/alarm_wa.png" class="severityBtn">
			            		<div class="severityTxt" id="waCnt">0</div>
			            	</div>
			            	<div class="severityBtnCls">
			            		<img src="dist/img/idc/btn/alarm_no.png" class="severityBtn">
			            		<div class="severityTxt" id="noCnt">0</div>
			            	</div> -->
			            	
						</div>
					</div>
					<div class="dashboard-contents">
						<div id="eventViwer">
						</div>
					</div>
				</div>
				</div>
			</section>
		</div>
	</div>
</div>