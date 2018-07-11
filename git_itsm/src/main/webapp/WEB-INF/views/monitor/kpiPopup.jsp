<form id="kpi-form">
	<div id="kpi-popup">
		
		
		
		<div class="kpi-options">
			<div class="row">
				<div>
					<label class='kpi-popup-setting' data-i18n="label.kpi.title">Title</label>
				</div>
				<div>
					<input type="text" id="kpi-title" name='kpi-title' class='kpi-popup-setting'>
				</div>
			</div>
			<div class="row">
				<div>
					<label class='kpi-popup-setting' data-i18n="label.kpi.query">Query</label>
				</div>
				<div>	
					<input class='kpi-popup-setting' type="text" name='kpi-query' id="kpi-query">
				</div>
				<button id="qlStart"></button>
			</div>
			<div class="row">
				<div>
					<label class='kpi-popup-setting' data-i18n="label.kpi.polling">Polling</label>
				</div>
				<div>
					<input type="text" id="kpi-polling" name='kpi-polling' class='kpi-popup-setting'>
				</div>
			</div>
			<div id="kpi-threshold" class="row">
				<div>
					<label class='kpi-popup-setting' data-i18n="label.kpi.threshold">Threshold</label>
					<input type="text" id="kpi-threshold-data" name='kpi-threshold-data' class='kpi-popup-setting'>
				</div>
			</div>
		</div>
		
		<div id="kpi-button" class="">
			<div id="sidebar" style="height: 100%; width: 100%;">
				<div>Table</div>
				<div><button class="kpiBtns" id="table-btn"></button></div>
				
				<div>Line</div>
				<div>
					<button class="kpiBtns" id="line-btn"></button>
					<button class="kpiBtns" id="mpline-btn"></button>
					<button class="kpiBtns" id="stkline-btn"></button>
					<button class="kpiBtns" id="stkarea-btn"></button>
				</div>
				
				<div>Bar</div>
				<div>
					<button class="kpiBtns" id="bar-btn"></button>
					<button class="kpiBtns" id="stkbar-btn"></button>
					<button class="kpiBtns" id="hbar-btn"></button>
				</div>
				
				<div>Pie</div>
				<div>
					<button class="kpiBtns" id="pie-btn"></button>
				</div>
			</div>
		</div>
		
		<div class="kpi-result">
			<div id="kpi-result" class="row">
				<div id="table">
					<label class='kpi-popup-setting' data-i18n="label.kpi.result">Result</label>
					<div id="resultGrid" class="kpi-grid kpi-popup-setting"></div>
				</div>
			</div>
			<div id="kpi-chart-set" class="row">
				<div>
					<label class='kpi-popup-setting' data-i18n="label.kpi.all_fields">All fields</label>
					<div id="kpi-popup-field" class=""></div>
				</div>
				<div id="kpi-chart-area"></div>
				<!-- 
				<div id="values">
					<label class='kpi-popup-setting' data-i18n="label.kpi.values">Values</label>
					<div id="valuesDrop" class="kpi-droparea "></div>
				</div>
				<div id="chart-preview"></div>
				<div id="keys">
					<label class='kpi-popup-setting' data-i18n="label.kpi.keys">Keys</label>
					<div id="keysDrop" class="kpi-droparea "></div>
				</div> -->
			</div>
			
		</div>
		<div class="kpi-desc">
			<div id="kpi-description" class="row">
				<label class='kpi-popup-setting' data-i18n="label.kpi.description">Description</label>
				<textarea id="kpi-description-data" class='kpi-popup-setting'></textarea>
			</div>
		</div>	
	</div>
</form>