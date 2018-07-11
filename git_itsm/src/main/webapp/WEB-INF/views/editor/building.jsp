<div id="building" class="editor-3d">
	<div class="content-title">
		<span>BUILDING EDITOR</span>
		<div class="toolbar">
			<!-- <i id="btnDebugCamera" class="icon link fa fa-plus fa-lg" aria-hidden="true" title="DebugCamera"></i> -->
			<i id="btnSave" class="icon link fa fa-floppy-o fa-lg" aria-hidden="true" title="Save"></i>
			<i id="btnReload" class="icon link fa fa-refresh fa-lg" aria-hidden="true" title="Reload"></i>
			<div class="split" style="display: inline-block;">&nbsp;</div>
			<!-- <i id="btnPointer" class="icon link fa fa-mouse-pointer fa-lg" aria-hidden="true" title=""></i> -->
			<i id="btnPosition" class="icon link fa fa-arrows fa-lg" aria-hidden="true" title="Position"></i>
			<i id="btnRotation" class="icon link fa fa-repeat fa-lg" aria-hidden="true" title="Rotation"></i>
			<!-- <i id="btnScaling" class="icon link fa fa-arrows-alt fa-lg" aria-hidden="true" title="Scaling"></i> -->
			<i id="btnScaling" class="icon link fa fa-expand fa-lg" aria-hidden="true" title="Scaling"></i>
			<div class="split" style="display: inline-block;">&nbsp;</div>
			<!-- <i id="btnFocus" class="icon link fa fa-magnet fa-lg" aria-hidden="true" title="Focus object"></i> -->
			<i id="btnFocus" class="icon link fa fa-eye fa-lg" aria-hidden="true" title="Focus object"></i>
			<!-- 
			<i id="btnZoomin" class="icon link fa fa-search-plus fa-lg" aria-hidden="true" title="Zoom In"></i>
			<i id="btnZoomout" class="icon link fa fa-search-minus fa-lg" aria-hidden="true" title="Zoom Out"></i>
			 -->
		</div>
	</div>
	<div id="BUILDING-EDITOR-MAIN" class="content-area">
		<div class="ui-layout-center">
				<!-- 
				<div class="toolbar">
					<div style="float: right;">
						<i id="" class="icon link fa fa-floppy-o fa-lg" aria-hidden="true"></i>
						<i id="" class="icon link fa fa-mouse-pointer fa-lg" aria-hidden="true"></i>
						<i id="btnPosition" class="icon link fa fa-arrows fa-lg" aria-hidden="true"></i>
						<i id="btnRotation" class="icon link fa fa-refresh fa-lg" aria-hidden="true"></i>
						<i id="btnScaling" class="icon link fa fa-arrows-alt fa-lg" aria-hidden="true"></i>
						<i id="" class="icon link fa fa-search-plus fa-lg" aria-hidden="true"></i>
						<i id="" class="icon link fa fa-search-minus fa-lg" aria-hidden="true"></i>
					</div>
				</div>
				-->
				<!-- 
				<div id="canvasDiv">
					<canvas id="renderCanvas" class="canvas-3d"></canvas>
				</div>
				 -->
				<canvas id="renderCanvas" class="canvas-3d"></canvas>
				<span class="label" id="fpsLabel">FPS</span>
		</div>
		<div class="ui-layout-west">
			<div class="module-container">
				<div class="module-heading">
					<div class="title">LOCATION</div>
				</div>
				<div class="module-content">
					<div id="buildingEditorLocationTree" class="editor button" style="height: 30px">
						<div id="locationResultBoard" class="text" style="display: inline-block; width: calc(100% - 20px); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"></div>
						<i class="fa fa-external-link fa-lg" aria-hidden="true" style="float: right;"></i>
					</div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title" style="display: inline-block; margin-top: 0;">OBJECTS</div>
					<div class="" style=" float: right; margin-right: 5px; margin-top: 1px;">
						<i id="btnAddObject" class="icon fa fa-plus" aria-hidden="true" title="Add Object" style="vertical-align: middle; margin: 3px; padding: 0; cursor: pointer;"></i>
						<i id="btnDeleteObject" class="icon fa fa-trash" aria-hidden="true" title="Delete Object" style="vertical-align: middle; margin: 3px; padding: 0; cursor: pointer;"></i>
					</div>
				</div>
				<div class="module-content">
					<div id="buildingEditorObjectsTree"  style="/* margin-top: 6px; */height: 300px;border-radius: .28571429rem;box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.06) !important;" class="tree-layout-container">
					</div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">CONFIGURATION</div>
				</div>
				<div class="module-content" style="/* padding: 15px; */">
					<table class="field-list left-fix" id="parameterContents" style="overflow-y: auto; table-layout: fixed;">
						<tbody>
							<tr>
								<td class="field-item">
									<input type="checkbox" id="display_GRID" checked="checked">
									<span style="font-size: 12px; height: 24px;">Show Grid</span>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<input type="checkbox" id="display_WIREFRAME">
									<span style="font-size: 12px; height: 24px;">Show Wireframe</span>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<input type="checkbox" id="display_BoundingBoxes">
									<span style="font-size: 12px; height: 24px;">Show Bounding boxes</span>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<input type="checkbox" id="enable_LocalMode" checked="checked">
									<span style="font-size: 12px; height: 24px;">Enable Local Axes</span>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<input type="checkbox" id="display_Label">
									<span style="font-size: 12px; height: 24px;">Show Label</span>
								</td>
							</tr>
							
							<!-- 
							<tr>
								<td class="field-item">
									<input type="checkbox" id="enable_Snap">
									<span style="font-size: 12px; height: 24px;">Enable Snap</span>
								</td>
							</tr>
							 -->
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="ui-layout-east">
			<div class="module-container">
				<div class="module-heading">
					<div class="title">PROPERTIES</div>
				</div>
				<div class="module-content" style="/* padding: 15px; */">
					<table class="field-list left-fix" id="parameterContents" style="overflow-y: auto; table-layout: fixed;">
						<tbody>
							<!-- 
							<tr>
								<td class="field-item">
									<div class="ui inverted mini fluid labeled input input-transform right">
										<div class="ui black label fixed noselect" style="width: 50%;">
										Name
										</div>
										<input type="text" title="Name" value="building1">
									</div>
								</td>
							</tr>
							 -->
							<tr>
								<td class="field-item">
									<div class="field-label" style="width: calc(30%);" title="Name">
										<span class="icon"></span>
										Name
									</div>
									<div class="field-form" style="margin-left: calc(30%); width: -36px; margin-right: 3px;">
										<input type="text" id="parameter_Name" class="field-inputtext" placeholder="" readonly>
									</div>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<div class="field-label" style="width: calc(30%);" title="Model">
										<span class="icon"></span>
										Model
									</div>
									<div class="field-form" style="margin-left: calc(30%); width: -36px; margin-right: 3px;">
										<input type="text" id="parameter_Model" class="field-inputtext" placeholder="" readonly>
									</div>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<div class="field-label" style="width: calc(30%);" title="Type">
										<span class="icon"></span>
										Type
									</div>
									<div class="field-form" style="margin-left: calc(30%); width: -36px; margin-right: 3px;">
										<input type="text" id="parameter_Type" class="field-inputtext" placeholder="" readonly>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">TRANSFORMS</div>
				</div>
				<div class="module-content" style="padding: 5px;">
					<div id="buildingEditorProperties" style="margin-top: 6px;" class="tree-layout-container">
					</div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">OPTIONS</div>
				</div>
				<div class="module-content" style="/* padding: 15px; */">
					<table class="field-list left-fix" id="parameterContents" style="overflow-y: auto; table-layout: fixed;">
						<tbody>
							<tr>
								<td class="field-item">
									<div class="field-label" style="width: calc(30%);" title="Visible">
										<span class="icon"></span>
										Visible
									</div>
									<div class="field-form" style="margin-left: calc(30%); width: -36px; margin-right: 3px;">
										<input type="checkbox" id="parameter_Visible" checked="checked">
									</div>
								</td>
							</tr>
							<tr>
								<td class="field-item">
									<div class="field-label" style="width: calc(30%);" title="Opacity">
										<span class="icon"></span>
										Opacity
									</div>
									<div class="field-form" style="margin-left: calc(30%); width: -36px; margin-right: 3px;">
										<!-- <input type="number" id="parameter_Opacity" class="field-inputtext" placeholder="" min="0" max="1" step="0.1"> -->
										<input type="range" id="parameter_Opacity" class="field-inputrange" min="0" max="1" step="0.1" value="1">
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="ui-layout-south">
		</div>
	</div>
	
	<!-- 
	<div id="locationPOPUP" style="display: none; width: 650px; height: 400px; overflow: auto;">
		<div rel="title">
			Popup #1 Title
		</div>
		<div rel="body">
			<div style="padding: 10; font-size: 11px; line-height: 150%;">
				<div style="float:left; background-color:white; width:150px; height:80px; border: 1px solid silver; margin:5px;">
				</div>
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
				This is body of popup #1. You can put any text or HTML inside the body (as well as title and buttons).
			</div>
		</div>
		<div rel="buttons">
			<button class="btn" onclick="$('#popup2').w2popup()">Switch to Popup 2</button>
		</div>
	</div>
	 -->
</div>
