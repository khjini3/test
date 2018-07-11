<div class="ip-popup-container" id="ipEditPopup"> 
	<form class="w2ui-im-modify-popup" id="imModifyPopup">
		<div class="ip-modify-popup-top">
		
			<div class="ip-addr-container"> 
				<div class="ip-addr-label">IP Address</div>
				<div class="ip-addr-input-field-area">
					<div class="ip-addr-input-area">
						<input class="ip-addr-input-field" id="ipModifyEditBox" name="ipAddrValue">
					</div>
				</div>
			</div>
			
			<div class="ip-allowance-container"> 
				<div class="ip-allowance-label">Allowance</div>
				<div class="ip-allowance-select-field-area">
					<div id="allowanceSelectBox" class="ip-allowance-select-area">
						<select name="allowanceSelect" class="ip-allowance-select-field" id="allowanceModifySelectBox">
							<option value="Allow">Allow</option>
							<option value="Deny">Deny</option>
						</select>
					</div>
				</div>
			</div>
			
			<div class="ip-description-container">
				<div class="ip-description-label">Description</div>
				<div class="ip-description-input-field-area">
					<div class="ip-description-input-area">
						<input class="ip-description-input-field" id="descriptionModifyEditBox" name="descriptionValue">
					</div>
				</div>
			</div>
		</div>
		
		<div class="modify-popup-bottom">
			<div id="ipAcceptBtn" class="ip-modify-popup-ok-btn">
				<button class="inner" id="modifyPopupOkBtn" style="width: 100px;">OK</button>
			</div>
			
			<div id="ipCloseBtn" class="ip-modify-popup-close-btn">
				<button class="inner" id="modifyPopupCloseBtn" style="width: 100px;">Close</button>
			</div>
		</div>
	</form>		
</div>