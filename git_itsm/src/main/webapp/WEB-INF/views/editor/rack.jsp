<div id='rackEditor' class="rackEditor content-idc no-padding">
	<div id="RACK-EDITOR-MAIN" class='content-area'>
		<div class="ui-layout-west">
			<div id="westContents">
				<div class="module-container">
		        	<div class="module-heading">Location</div>
		        	
		        	<div class="module-content">
		        		<div id="rackSeartchLocationBtn" class="rackSearchBtn" style="height: 30px">
		        			<div id="racklocationResultBoard" class="text" style="display: inline-block; width: calc(100% - 20px); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"></div>
							<i class="fas fa-external-link-alt" aria-hidden="true" style="float: right;font-size: 14px; top:-2px;position: relative;"></i>
						</div>
		        		<!-- <button id="rackSeartchLocationBtn" class="rackSearchBtn"></button> -->
		        	</div>
		        	<div class="module-heading">Objects</div>
		        	<div id="objectList" class="obj-content" style="margin:10px;"></div>
	        	</div>
			</div>
		</div>
		
		<div class="ui-layout-center">
			<div id="centerContents"></div>
		</div>
		
		<div class="ui-layout-east">
			<div id="eastContents">
			
				<div class="module-heading">
					Rack Properties
					<div id="rackEditorPropertiesIcons">
						<i id="rackEditorSaveBtn" class="icon link far fa-save fa-2x" aria-hidden="true" title="Save" style="display:none;"></i>
						<i id="rackEditorCancelBtn" class="icon link fas fa-times fa-2x" aria-hidden="true" title="Cancel"></i>
						<i id="rackEditorModifyBtn" class="icon link fas fa-edit fa-2x" aria-hidden="true" title="Modify" style="display:none;"></i>
					</div>
				</div>
				<div id="rackPropertiesInfo" class="obj-content"></div>
				
				<div class="module-heading">Server Properties</div>
				<div id="serverPropertiesInfo" class="obj-content"></div>
				<div class="module-heading">Options</div>
				<div class="module-content">
					<table class="field-list left-fix" id="parameterContents" style="overflow-y: auto; table-layout: fixed;">
						<tbody>
							<tr>
								<td class="field-item" style="height: 37px;">
									<div class="field-label" title="Opacity">
										<label class="parameter_Opacity" >Opacity</label>
									</div>
									<div class="field-form" style="height: 16px;">
										<input type="range" id="parameter_Opacity" class="field-inputrange" min="0" max="1" step="0.1" value="1" style="padding: 0;" disabled>
									</div>
								</td>
							</tr>
							
							<tr>
								<td class="field-item">
									<div class="optionCls">
										<input type="checkbox" id="showGrid"  checked>
										<label class="optionTxt" for="showGrid">Show Grid</label>
									</div>
									<div class="optionCls">
										<input type="checkbox" id="showName" disabled>
										<label class="optionTxt" for="showName">Show Name</label>
									</div>
									<!-- <div class="optionCls">
										<label class="optionTxt" for="parameter_Opacity">Opacity</label>
									</div>
									<div class="optionCls">
										<input type="range" id="parameter_Opacity" class="field-inputrange" min="0" max="1" step="0.1" value="1">
									</div> -->
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		
		<div class="ui-layout-south">
			<div id="southContents" >
			</div>
		</div>
	</div>
</div>