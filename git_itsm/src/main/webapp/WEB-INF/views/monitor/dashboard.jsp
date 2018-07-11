
<div id='dashboard' class='dashboard content-idc no-padding'>
	<div class='content-area'>
		<div class="widget-controll">
			<div class="widget-cont-element mouse-evt" id="dashSelBox">
				<div id="panelList" class="mouse-evt"></div>
			</div>
			<div class="widget-cont-element" id="panelName"><input type="text" id='dashboard-panel-name'/></div>
			<div class="widget-buttons">
				<div class="widget-cont-element widget-cont-btn dash-svg-btn" title="Save" id="save-btn"><i class="far fa-save fa-lg"></i></div>
				<div class="widget-cont-element widget-cont-btn dash-svg-btn" title="Cancel" id="canc-btn"><i class="fas fa-times fa-lg"></i></div>
				<div class="widget-cont-element widget-cont-btn dash-svg-btn" title="Edit" id="edit-btn"><i class="fas fa-edit fa-lg"></i></div>
				<div class="widget-cont-element widget-cont-btn dash-svg-btn" title="Add" id="add-btn"><i class="fas fa-plus fa-lg"></i></div>
				<div class="widget-cont-element widget-cont-btn dash-svg-btn" title="Delete" id="del-btn"><i class="fas fa-trash-alt fa-lg"></i></div>
			</div>
			<div class="w2ui-field">
				<div id="RollingRight" style="margin:0px; padding:0px; min-height: 20px; padding-right: 26px;">
					<label id="Rolling">Rolling Time :</label>
					<input name="pollingCombo" id="pollingCombo" type="list" size="25"/>
					<i id="playP" class="icon link fas fa-lg fa-play"></i>
					<i id="stopP" class="icon link fas fa-lg fa-stop"></i>
					<!-- <button id="pollingBtn" type="button">OK</button> -->
				</div>
			</div>
			<div>
				<span id="screenAtt"></span>
			</div>
		</div>
		<div id="widgetList" style="user-select: none;">
			<!-- 
			<div id="widListHeader">
				<h4>Widget List</h4>
			</div>
			 -->
			<div class="listTitle" style="user-select: none; background: rgba(54, 69, 101,0.6); color: white;" data-i18n="title.dashboard.kpi">KPI</div><div id="kpiWidgetList"></div>     <!-- accodian i18n ?? -->
			<div class="listTitle" style="user-select: none; background: rgba(54, 69, 101,0.6); color: white;" data-i18n="title.dashboard.custom">CUSTOM</div><div id="customWidgetList"></div>
			<div class="listTitle" style="user-select: none; background: rgba(54, 69, 101,0.6); color: white;" data-i18n="title.dashboard.sla">SLA</div><div id="slaWidgetList"></div>
		</div>
		<div id='addPanel-popup'></div>
		<div id='delPanel-popup'></div>
	</div>
</div>