<div>
	<!-- <div id="setting_edit" style="height: 150px;"></div> -->
	<div id="scheduling_edit" class="report-setting-2" style="height: 200px;">
		<!-- <div id="scheduling_div_edit" style="padding : 5px 0 5px 0;">
			<input type="checkbox" id="scheduleDisableBtn_edit" value="no period" checked="true"/>
			<label class='report-dynamic-label'>No period</label>
		</div> -->
		<!-- <div>
			<label class="report-label">Start time</label>
			<input class="dateText" type="text" id="fromDate">
			<input class="timeSpinner" style="font : 12px NanumGothic; " id="fromTime">
		</div>
		<div>	
			<label class="report-label">End time</label>
			<input class="dateText" type="text" id="toDate">
			<input class="timeSpinner" style="font : 12px NanumGothic; " id="toTime">
		</div>-->	 
		<!-- <div id="repeatDiv_edit">	
			<label class="report-label">Repeat</label>
			<input type="radio" name="repeat_period" value="-1" label="" checked="checked"><label class='report-dynamic-label'> None</label>
			<input type="radio" name="repeat_period" value="0" label="hour(s)"><label class='report-dynamic-label'> Hours</label>
			<input type="radio" name="repeat_period" value="1" label="day(s)"><label class='report-dynamic-label'> Days</label>
			<input type="radio" name="repeat_period" value="2" label=""><label class='report-dynamic-label'> Weeks</label>
			<input type="radio" name="repeat_period" value="3" label="month(s)"><label class='report-dynamic-label'> Month</label>
		</div> -->
		<!-- <li id="repeatDetailDiv_edit"> -->
			<li id="repeatPeriodDiv_edit" style="display:none;" class="report-detail-row">
				<div>
					<label class="report-label"></label>
				</div>
				<div>
					<label class="report-period-label monthLabel" style="display:none;" >Day</label>
					<input class="report-period-label monthLabel" type="text" id="repeatDayText_edit" style="display:none;" maxlength=2>  
					<label class="report-period-label monthLabel" style="display:none;">of</label>
					<label class='report-period-label'>Every</label>
					<input class='report-period-label' type="text" id="repeatDetailText_edit" maxlength=2>
					<label class='report-period-label' id="repeatDetailLabel_edit">hour(s)</label>
				</div>
			</li>
			<li id="weekDiv_edit" class="report-week-div" style="display:none;">
				<div class="weekDiv">
					<input type="checkbox" value="MON" />
					<label class='report-period-label'>Mon</label>
				</div>
				<div class="weekDiv">
					<input type="checkbox" value="TUE" />
					<label class='report-period-label'>Tue</label>
				</div>
				<div class="weekDiv">
					<input type="checkbox" value="WED" />
					<label class='report-period-label'>Wed</label>
				</div>
				<div class="weekDiv">
					<input type="checkbox" value="THU" />
					<label class='report-period-label'>Thu</label>
				</div>
				<div class="weekDiv">
					<input type="checkbox" value="FRI" />
					<label class='report-period-label'>Fri</label>
				</div>
				<div class="weekDiv">
					<input type="checkbox" value="SAT" />
					<label class='report-period-label'>Sat</label>
				</div>
				<div class="weekDiv">
					<input type="checkbox" value="SUN" />
					<label class='report-period-label'>Sun</label>
				</div>
			</li>
			<li id="startDiv_edit" class="report-detail-row">
				<div>
					<label class="report-label" style="margin-top : 5px;">Start At</label>
				</div>
				<div id="startTime_edit" class="start-time-div">
					<!-- <input class="timeSpinner" style="font : 12px NanumGothic; " id="startTimeHour_edit">
					<input class="timeSpinner" style="font : 12px NanumGothic; " id="startTimeMin_edit"> -->
				</div>
			</li>
			<li class="report-detail-row">
				<div>
					<label for="repeatStorageText_edit">Storage Cycle</label>
				</div>
				<div>
					<input class='report-period-label' type="text" id="repeatStorageText_edit" maxlength=2>
					<label class='report-period-label' >days</label>
				</div>
			</li>
			<li class="report-detail-row">
				<div>
					<label>Export Type</label>
				</div>
				<div class="popup-form">
					<div class="radioBtn">
						<input type="radio" name="exportType" value="0" checked="checked">pdf
					</div>
					<div class="radioBtn">
						<input type="radio" name="exportType" value="1">excel
					</div>
				</div>
			</li>
		<!-- </li> -->
	</div>
</div>