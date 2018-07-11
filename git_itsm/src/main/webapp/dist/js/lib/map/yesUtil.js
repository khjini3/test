/*
 * Utility Code 
 * 
 * 메소드 추가시 주석 꼭 달아주세요
 * */

function util(){
	this.init();
}

util.prototype = {
	init : function(){
		/*var _this = this;*/
		$('body').loading();
	},
	
	/*해당 월의 일자 수 를 제공*/
	fn_DayOfMonth : function(year, month){ 
	    //month 는 0 부터 시작해서..
	    return 32 - new Date(year, month-1, 32).getDate();
	},
	
	/*param 값에 따라서 오늘 년 월 일 반환*/
	getDate : function(param){
		var type = param.toLocaleLowerCase();
		
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var min = today.getMinutes();
		var sec = today.getSeconds();
		
		if(month < 10){
			month = "0"+month;
		}
		if(day < 10){
			day = "0"+day;
		}
		if(hour < 10){
			hour = "0"+hour;
		}
		if(min < 10){
			min = "0"+min;
		}
		if(sec < 10){
			sec = "0"+sec;
		}
		if("day" === type){
			return year+"-"+month+"-"+day; //return "2018-02-07"
		}else if("month" === type){
			return year+"-"+month //return "2018-02"
		}else if("year" === type){
			return year; //return "2018"
		}else if("now" === type){
			return year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec; //return "2018-03-30 11:19:58"
		}else if("time" === type){
			return hour+":"+min; //return "11:19"
		}else if("daynohyphen" === type){
			return year+month+day; //return "20180207"
		}else{
			console.log("Wrong Parameter.");
		}
	},
	
	/* 오늘날짜 기준으로 XX일 이전의 날짜를 Return. */
	daysAgo : function(param){
		var today = new Date();
		var days = param;
		var oldDay = new Date(today-(3600000*24*days));
		
		var year = oldDay.getFullYear();
		var month = oldDay.getMonth()+1;
		var day = oldDay.getDate();

		
		if(month < 10){
			month = "0"+month;
		}
		if(day < 10){
			day = "0"+day;
		}

		return year+"-"+month+"-"+day; //return "2018-02-07"
		
	},
	
	yesCompile : function(cmd){
		let param = {msg : cmd};
		$.ajax({url: "/yesUtil/compile",
			type: "put",
			dataType: "text",
			data : JSON.stringify(param),
			contentType: "application/json;charset=UTF-8",
			success: function(result){
				console.log(result);
			},
			error : function(request, status, error){
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
		});
	},
	
	yesDeCompile : function(cmd){
		let param = {msg : cmd};
		$.ajax({url: "/yesUtil/decompile",
			type: "put",
			dataType: "text",
			data : JSON.stringify(param),
			contentType: "application/json;charset=UTF-8",
			success: function(result){
				console.log(result);
			},
			error : function(request, status, error){
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
		});
	},
	
	/*UID 생성*/
	createUID : function(){
		function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return 'y-'+ s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
	},
	
	/*두 변수값의 일치 여부 확인후 일치하면 true 불일치 하면 false를 리턴*/
	compare : function(a, b){
		var i = 0, j;
		  if(typeof a == "object" && a){
		    if(Array.isArray(a)){
		      if(!Array.isArray(b) || a.length != b.length) return false;
		      for(j = a.length ; i < j ; i++){
		    	  if(!this.compare(a[i], b[i])) return false;
		      }
		      return true;
		    }else{
		      for(j in b){
		    	  if(b.hasOwnProperty(j)) i++;
		      }
		      
		      for(j in a) {
		    	  if(a.hasOwnProperty(j)){
				        if(!this.compare(a[j], b[j])) return false;
				        i--;
				      }
		      }
		      return !i;
		    }
		  }
		  return a === b;
	},
	
	/*차트 컬러*/
	getColors : function(type){
		var colorArr = null;
		
		switch(type.toLowerCase()){
			case 'line' : 
				colorArr = [
					'rgba(254,81,218,.8)', 'rgba(0,174,57,.8)', 'rgba(250,206,20,.8)', 'rgba(56,156,255,.8)', 'rgba(255,94,23,.8)',
					'rgba(255,35,102,.8)', 'rgba(104,89,235,.8)', 'rgba(134,227,32,.8)', 'rgba(144,111,80,.8)', 'rgba(255,145,65,.8)',  
					'rgba(94,207,217,.8)', 'rgba(141,77,232,.8)',  'rgba(0,162,237,.8)', 'rgba(69,119,164,.8)', 'rgba(24,200,250,.8)',  
					'rgba(0,107,87,.8)'
				];
				break;
			case 'bar' : 
			case 'pie' : 
			case 'donut' : 
				colorArr = [
					'rgba(254,81,218,1)', 'rgba(0,174,57,1)', 'rgba(250,206,20,1)', 'rgba(56,156,255,1)', 'rgba(255,94,23,1)',
					'rgba(255,35,102,1)', 'rgba(104,89,235,1)', 'rgba(134,227,32,1)', 'rgba(144,111,80,1)', 'rgba(255,145,65,1)',  
					'rgba(94,207,217,1)', 'rgba(141,77,232,1)',  'rgba(0,162,237,1)', 'rgba(69,119,164,1)', 'rgba(24,200,250,1)',  
					'rgba(0,107,87,1)'
				];
				break;
			default :
				colorArr = [
					'rgba(254,81,218,1)', 'rgba(0,174,57,1)', 'rgba(250,206,20,1)', 'rgba(56,156,255,1)', 'rgba(255,94,23,1)',
					'rgba(255,35,102,1)', 'rgba(104,89,235,1)', 'rgba(134,227,32,1)', 'rgba(144,111,80,1)', 'rgba(255,145,65,1)',  
					'rgba(94,207,217,1)', 'rgba(141,77,232,1)',  'rgba(0,162,237,1)', 'rgba(69,119,164,1)', 'rgba(24,200,250,1)',  
					'rgba(0,107,87,1)'
				];
				break;
		}
		
		return colorArr;
	},
	
	getDivIcon : function(title){
		var divIcon = null;
		switch(title.toLowerCase()){
			case 'none' : // gray
				divIcon = '<div class="div-icon None" style="background : gray; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">None</div>';
				break;
			case 'hour' : // red
				divIcon = '<div class="div-icon Hour" style="background : #ff6464; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Hour</div>';
				break;
			case 'day' : // skyblue
				divIcon = '<div class="div-icon Day" style="background : #87cefa; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Day</div>';
				break;
			case 'week' : // blue
				divIcon = '<div class="div-icon Week" style="background : #6495ed; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Week</div>';
				break;
			case 'month' : // mint
				divIcon = '<div class="div-icon Month" style="background : #40e0d0; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Month</div>';
				break;
			case 'critical' : 
				divIcon = '<div class="div-icon Critical" style="background : #ea1c22; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Critical</div>';
				break;
			case 'major' : 
				divIcon = '<div class="div-icon Major" style="background : #fe6600; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Major</div>';
				break;
			case 'minor' : 
				divIcon = '<div class="div-icon Minor" style="background : #c39c00; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Minor</div>';
				break;
			case 'warning' : 
				divIcon = '<div class="div-icon Warning" style="background : #198feb; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Warning</div>';
				break;
				
			case 'critical_clear' : 
				divIcon = '<div class="div-icon Critical" style="background : #2ab100; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Critical</div>';
				break;
			case 'major_clear' : 
				divIcon = '<div class="div-icon Major" style="background : #2ab100; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Major</div>';
				break;
			case 'minor_clear' : 
				divIcon = '<div class="div-icon Minor" style="background : #2ab100; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Minor</div>';
				break;
			case 'warning_clear' : 
				divIcon = '<div class="div-icon Warning" style="background : #2ab100; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Warning</div>';
				break;
				
			case 'normal' : 
				divIcon = '<div class="div-icon Normal" style="background : #36ae48; width: 60px; height: 18px; color: #fff; font-weight: bold; border-radius: 2px;">Normal</div>';
				break;
				
		}
		return divIcon;
	}
	

}