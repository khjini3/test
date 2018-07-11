<div id='idcEditor' class="idcEditor content-idc no-padding">
	<div id="IDC-EDITOR-MAIN" class="content-area">
		<div id="idcEditor_Layout_Center" class="ui-layout-center">
			<canvas id="idcEditor_RenderCanvas" class="canvas-3d"></canvas>
			<span id="idcEditor_FpsLabel" class="label fps-label">FPS</span>
		</div>
		<div id="idcEditor_Layout_West" class="ui-layout-west">
			<div class="module-container">
				<div class="module-heading">
					<div class="title">Location</div>
				</div>
				<div class="module-content">
					<div id="idcEditor_Location" class="result-board" style="height: 30px; padding-right: 10px">
						<div id="idcEditor_LocationResultBoard" class="text" style="display: inline-block; width: calc(100% - 20px); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"></div>
						<i class="fas fa-external-link-alt" aria-hidden="true" style="float: right; position: relative; top:-1px; font-size: 14px;"></i>
					</div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title" style="display: inline-block; margin-top: 0;">Objects</div>
					<div class="" style="float: right; margin-right: 5px; margin-top: 1px;">
						<i id="idcEditor_BtnAddObject" class="icon link fas fa-plus" aria-hidden="true" title="Add Object" style="vertical-align: middle; margin: 3px; padding: 0; cursor: pointer;"></i>
						<i id="idcEditor_BtnDeleteObject" class="icon link fas fa-trash-alt" aria-hidden="true" title="Delete Object" style="vertical-align: middle; margin: 3px; padding: 0; cursor: pointer;"></i>
					</div>
				</div>
				<div class="module-content">
					<div id="idcEditor_ObjectsTree" style="height: 300px; border-radius: .28571429rem; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.06) !important;" class="tree-layout-container">
					</div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">Editor Options</div>
				</div>
				<div class="module-content" style="padding: 0;">
					<div id="idcEditor_EditorOptions"></div>
				</div>
			</div>
		</div><!-- Layout_West End -->
		<div id="idcEditor_Layout_East" class="ui-layout-east">
			<div class="module-container">
				<div class="module-heading">
					<div class="title">Toolbar</div>
				</div>
				<div class="module-content" style="padding: 0;">
					<div id="idcEditor_Toolbar" style="height:35px;"></div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">Properties</div>
				</div>
				<div class="module-content" style="padding: 0;">
					<div id="idcEditor_Properties"></div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">Transforms</div>
				</div>
				<div class="module-content" style="padding: 5px;">
					<div id="idcEditor_Transforms" style="margin-top: 6px;">
					</div>
				</div>
			</div>
			<div class="module-container">
				<div class="module-heading">
					<div class="title">Options</div>
				</div>
				<div class="module-content" style="padding: 0;">
					<div id="idcEditor_Options"></div>
				</div>
			</div>
		</div><!-- Layout_East End -->
		<div  id="idcEditor_Layout_South" class="ui-layout-south">
		</div>
	</div><!-- IDC-EDITOR-MAIN End -->
</div>