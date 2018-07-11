/*
 * 메소드 추가시 주석 꼭 달아주세요
 * itsmUtil = new itsmUtil(); //main.js 50 line 
 * */

function itsmUtil(){
	this.init();
}

itsmUtil.prototype = {
	init : function(){
		
	},
	/*
	 * 견적 상태 SVG
	 */
	setEstimateStatus : function(items){
		this.setEstimateStatusCheck(items);
		
		for(var i=0; i < items.length; i++){
			let item =items[i];
			//1:발송, 2:미발송
			d3.selectAll("#divContainer"+item.recid+" #estimateStatus-svg").selectAll("#step1").attr("fill", "#2EA18B"); //선
			d3.selectAll("#divContainer"+item.recid+" #estimateStatus-svg").selectAll("#step1_border").attr("fill", "#49ffde"); //테두리
			d3.selectAll("#divContainer"+item.recid+" #estimateStatus-svg").selectAll("#step1_group").classed("svgGroup", true); //클래스 추가
			
			if(item.status === 1){
				//발송
				roundId ="url(#step1_complete)";
				d3.selectAll("#divContainer"+item.recid+" #estimateStatus-svg").selectAll("#step2").attr("fill", "#2EA18B"); //선
			}else{
				roundId ="url(#step1_ing)";
				d3.selectAll("#divContainer"+item.recid+" #estimateStatus-svg").selectAll("#step1_group").selectAll("#step1_round").classed("itsmSeverity", true);
			}
			d3.selectAll("#divContainer"+item.recid+" #estimateStatus-svg").selectAll("#step1_round").attr("fill", roundId); //면
		}
		
	},
	setEstimateStatusCheck : function(items){
		d3.selectAll("#estimateStatus-svg").selectAll("#step1_txt").html("견적");
	},
	/*
	 * 발주 상태 SVG
	 */
	setOrderStatus : function(items){
		this.setOrderStatusCheck(items);
		
		for(var i=0; i < items.length; i++){
			let item =items[i];
			
			for(var j=1; j < item.status; j++ ){
				d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step"+j).attr("fill", "#2EA18B"); //선
				d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step"+j+"_border").attr("fill", "#49ffde"); //테두리
				d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step"+j+"_group").classed("svgGroup", true); //클래스 추가
				
				let roundId ="";
				let status = ""
				if(j ===item.status-1){
					roundId ="url(#step"+j+"_ing)";
					status = "ing";
				}else{
					roundId ="url(#step"+j+"_complete)";
					status = "complete";
				}
				
				if(j+1 === 6 && item.d_complete ===1){
					roundId ="url(#step5_complete)";
					d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step6").attr("fill", "#2EA18B"); //선
					status = "complete";
				}
				if(status === 'ing'){
					d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step"+j+"_group").selectAll("#step"+j+"_round").classed("itsmSeverity", true);
				}
				
				d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step"+j+"_round").attr("fill", roundId); //면
				
				let toolTipContents ='';
				
				switch(j.toString()){
					case "1":
						toolTipContents +="ECS4810-12M :" + 24 + 
											'<br>'+
											'ECS4810-12M :'+ 25;
						break;
					case "2":
						toolTipContents +="Date :" + '2018-12-12' + 
						'<br>'+
						'Time :'+ '18:16:14';
						break;
					case "3":
						toolTipContents +="Date :" + '2018-12-12' + 
						'<br>'+
						'Time :'+ '18:16:14';
						break;
					case "4":
						toolTipContents +="Date :" + '2018-12-12' + 
						'<br>'+
						'Time :'+ '18:16:14';
						break;
					case "5":
						toolTipContents +="Date :" + '2018-12-12' + 
						'<br>'+
						'Time :'+ '18:16:14';
						break;
				}
				/*
				 * 차후 툴팁 사용 시 union all로 처리
				 */
				//d3.selectAll("#divContainer"+item.recid+" #orderStatus-svg").selectAll("#step"+j+"_title").html(toolTipContents);
				
			}
			
		}
	},
	
	setOrderStatusCheck : function(items){
		d3.selectAll("#orderStatus-svg").selectAll("#step1_txt").html("발주");
		d3.selectAll("#orderStatus-svg").selectAll("#step2_txt").html("선적");
		d3.selectAll("#orderStatus-svg").selectAll("#step3_txt").html("입항");
		d3.selectAll("#orderStatus-svg").selectAll("#step4_txt").html("통관");
		d3.selectAll("#orderStatus-svg").selectAll("#step5_txt").html("배송");
	},
	/*
	 * 첨부파일 조회
	 */
	getFileList : function(id){
		let param = null;
		$.ajax({
            url: "itsmUtil/getDownLoadList/"+id,
            type: "get",
            dataType: "json",
            async:false,
            contentType: "application/json;charset=UTF-8",
            success : function(data){
            	param = data;
            },
            error : function(data) {
            	console.log(data);
            }
    	});
		
		return param;
	},
	
	/*
	 * 파일 다운로드
	 */
	fileDownloadFunc : function(items){
		
		for(var i=0; i < items.length; i++){
			let item = items[i];
			let orgName =item.orgFileName;
			let compileName = item.fileName;
			let request = item.fileName;
			let fr = 'fr'+i
			let form = $("<form></form>").attr({
       			"action" : "itsmUtil/FileManager/download",
       			"method" : "POST",
       			"target" : fr,
       			"contentType" : "application/json; charset=UTF-8"
       		}).appendTo("body");
       		
			let fileName = $("<input/>").css("display","none").attr({
       			"name" : "fileName",
       			"type" : "hidden"
       		}).appendTo(form).val(item.fileName);
			
			let orgFileName = $("<input/>").css("display","none").attr({
				"name" : "orgFileName",
				"type" : "hidden"
			}).appendTo(form).val(item.orgFileName);
       		
			let iframe = $("<iframe></iframe>").css("display","none").appendTo("body");
       		iframe.attr("name" , fr).appendTo(form);       	
       		
	       	form.submit(function (event){
	       		event.preventDefault();
	       		try{
	       			this.submit();
	       		}catch(e){
	       			
	       		}
	       		
	       		setTimeout(function(){
       				iframe.empty();
	   				iframe.remove();
	   				iframe = null;
	   				
	   				form.empty();
	   				form.remove();
	   				form = null;
       			}, 5000);
	       	});
	       	
	       	form.submit();
		}
   		
	},
	/*
	 * ITSM Mail관련 
	 */
	sendMailFunc : function(cmdId, cmdType){ //견적or발주, 견적or발주아이디, 첨부 파일 경로 
		
		let mailUserAddr = sessionStorage.getItem("EMAIL");
		
		if($('body').find("#email_popup").size() == 0 ){
			$('body').append("<div id='email_popup'></div>");
		}
		
		if(mailUserAddr.trim() === "" || mailUserAddr.split("@").length < 2 ){
			$("#email_popup").html(sessionStorage.getItem("LOGIN_ID") + "님의 Email 주소가 올바르지 않습니다.<br>사용자 정보에서 Email 정보를 확인 하시기 바랍니다.");
			
			$("#email_popup").dialog({
    			show: { effect: "fade", duration: 300 },
			    hide: { effect: "fade", duration: 100 },
			    modal : true,
			    buttons : {
			    	"확인" : function(){
			    		$(this).dialog("close");
			    	}
			    },
			    
    			close : function(){
    				$("#email_popup").remove();
    			}
    		});
			
		}else{
			
			let attachFile = null;
			$.ajax({
	            url: "itsmUtil/getDownLoadList/"+cmdId,
	            type: "get",
	            dataType: "json",
	            async:false,
	            contentType: "application/json;charset=UTF-8",
	            success : function(data){
	            	if(data.length >0){
	            		attachFile = data[0];
	            	}else{
	            		//첨부파일이 없다는 경고창
	            	}
	            },
	            error : function(data) {
	            	console.log(data);
	            }
	    	});
			
			var mailParam = {};
			
			$("#email_popup").dialog({
				title : "메일 쓰기",
				width : 800,
				height : 620,
				modal : true,
				resizable:true,
				show: { effect: "fade", duration: 300 },
			    hide: { effect: "fade", duration: 100 },
			    buttons : {
			    	"보내기" : function(event){
			    		let arr = w2ui["emailContents_props"].validate();
			    		if(arr.length > 0){
			    			let z_Idx = $("#email_popup").parent(".ui-dialog").css("z-index");
			    			for(var i =0; i < arr.length; i++){
			    				let item = arr[i].field;
			    				//Validate Message z-index 설정
			    				$("#w2ui-tag-"+ item.name).css("z-index", parseInt(z_Idx));
			    			}
			    			
			    			return;
			    		}else{
			    			//필수 입력이 완료 Send Mail
			    			let mailField = w2ui["emailContents_props"].record;
			    			let mailParam = w2ui["emailContents_props"].mailParam;
			    			let param = {};
			    			param.fromMail = sessionStorage.getItem("EMAIL"); //작성자
			    			param.title = mailField.mailTitle; //제목
			    			param.body = mailField.mailBody.split("\n").join("<br>"); //메일 내용
			    			param.toUserList = mailParam.toUserList; 
			    			//EmailVO 값
			    			param.cmdId = cmdId;
			    			param.cmdType = cmdType;
			    			param.toTraget = w2ui["emailContents_props"].record.toMail1; //받는사람
			    			param.appendTarget = w2ui["emailContents_props"].record.toMail2; //참조
			    			param.fileName = attachFile.fileName;
			    			param.orgFileName = attachFile.orgFileName;
			    			if(mailParam.hasOwnProperty("addUserList")){
			    				param.addUserList = mailParam.addUserList;
			    			}
			    			
			    			
			    			/*
			    			 * Mail보내기
			    			 */
			    			let sendMail = function(){
			    				
			    				$.ajax({
					                url: "itsmUtil/sendMail",
					                type: "put",
					                dataType: "json",
					                data : JSON.stringify(param),
					                contentType: "application/json;charset=UTF-8",
					                success : function(data){
					                	$('body').loading('hide');
					                	
					                	if($('body').find("#email_popup").size() == 0 ){
					        				$('body').append("<div id='email_popup' title='알림' style='color:#fff;'></div>");
					        			}
					        			
					        			
					                	if(data.result){
					                		$("#email_popup").html("mail 전송이 완료 되었습니다.");
					                		
					                		$("#email_popup").dialog({
					                			show: { effect: "fade", duration: 300 },
					            			    hide: { effect: "fade", duration: 100 },
					            			    modal : true,
					            			    buttons : {
					            			    	"확인" : function(){
					            			    		$(this).dialog("close");
					            			    	}
					            			    },
					            			    
					                			close : function(){
					                				let customEvent = new CustomEvent("mailSuccess", {
										    	    	detail :{
										    	    		currentEvent : event,
										    	    		resultParRam : {
										    	    			param : data
										    	    		}
										    	    	}
							                		});
							                		
							                		document.dispatchEvent(customEvent);
							                		
							                		$("#email_popup").remove();
					                			}
					                		});
					                		
					                		
					                	}else{
					                		
					                		$("#email_popup").html("mail 전송이 실패 되었습니다.<br>관리자에게 문의 하시기 바랍니다.");
					                		
					                		$("#email_popup").dialog({
					                			show: { effect: "fade", duration: 300 },
					            			    hide: { effect: "fade", duration: 100 },
					            			    modal : true,
					            			    buttons : {
					            			    	"확인" : function(){
					            			    		$(this).dialog("close");
					            			    	}
					            			    },
					            			    
					                			close : function(){
					                				$("#email_popup").remove();
					                			}
					                		});
					                		
					                	}
					                },
					                error : function(data) {
					                	console.log("error");
					                }
						    	});
			    				
			    			}
			    			
			    			/*
			    			 * 첨부 파일 업로드
			    			 */
			    			let attachFiles = $("#file").data('selected');
			    			$('body').loading('show');
			    			if(attachFiles.length > 0){
			    				//첨부파일이 있다면
			    				let formData  = new FormData();
			    				let attachArr = [];
			    				for(var i=0; i<attachFiles.length ; i++){
									formData.append('file'+i, attachFiles[i].file);
									attachArr.push(attachFiles[i].file.name);
								}
			    				
			    				param.attachFiles = attachArr;
			    				let uploadUrl = "itsmUtil/mail/fileupload";
			    				$.ajax({
			    					url : uploadUrl,
									data: formData,
									processData: false,
				    				async:false,
				    				contentType: false,
				                    type: 'POST',
				                    success : function(data){
				                    	sendMail();
				                    },
				                    error: function(xhr,textStatus,error){
				                    	console.log(error);
				                    }
				    				
				    			});
			    			}else{
			    				//첨부파일이 없다면 
			    				//Send Mail
			    				sendMail();
			    			}
			    		}
			    		$(this).dialog("close");
			    		
			    	},
			    	"취소" : function(){
						$(this).dialog("close");
					}
			    },
			    open : function(){
			    	$("#email_popup").append('<div id="emailContents"></div>');
			    	let popupContents = '<div class="w2ui-page page-0">'+
										         '<div class="w2ui-field">'+
										            '<label>보내는 사람</label>'+
										            '<div >'+
										                '<input name="fromMail" type="text" maxlength="150" size="17" style="width:100%;"/>'+
										            '</div>'+
										        '</div>'+
										        '<div class="w2ui-field">'+
											        '<label>제 목</label>'+
											        '<div >'+
											        	'<input name="mailTitle" type="text" maxlength="100" size="17" style="width:100%;"/>'+
											        '</div>'+
										        '</div>'+
										        '<div class="w2ui-field">'+
										            '<label>받는 사람</label>'+
										            '<div style="position: relative;">'+
											            '<input name="toMail1" type="text" size="17" style="width:100%;cursor: pointer;"/>'+
										                '<div style="position:absolute;right:7px;top:9px;"><i id="userList1" class="fas fa-external-link-alt" aria-hidden="true" style="color:#ffffff";></i></div>'+
										            '</div>'+
										        '</div>'+
										        '<div class="w2ui-field">'+
										            '<label>참조</label>'+
										            '<div style="position: relative;">'+
										            '<input name="toMail2" type="text" size="17" style="width:100%;cursor: pointer;"/>'+
									            	'<div style="position:absolute;right:7px;top:9px;"><i id="userList2" class="fas fa-external-link-alt" aria-hidden="true" style="color:#ffffff";></i></div>'+
										            '</div>'+
										        '</div>'+
										        '<div class="w2ui-field">'+
										            '<label>본문</label>'+
										            '<div>'+
										            	'<textarea name="mailBody"  size="17" style="width:100%;height:225px;resize: none;IME-MODE:active;"/>'+
										            '</div>'+
										        '</div>'+
										        '<div class="w2ui-field">'+
										            '<label>첨부된 문서</label>'+
										            '<div style="position: relative;">'+
										            	'<input name="attachFile" type="text" size="17" style="width:100%;"/>'+
										            '</div>'+
										        '</div>'+
									            '<div class="w2ui-field">'+
											    	'<label>파일 첨부 </label>'+
											    	'<div ><input name="file" style="width:100%;height:50px;" ></div>'+
											    '</div>'+
										  '</div>';
			    	$("#emailContents").html(popupContents);
			    	
			    	$("#emailContents").w2form({
		        		name : 'emailContents_props',
		        		mailParam : mailParam,
		    			focus : -1,
		    			style:'width:100%;height:100%;',
		    			fields : [
		    				{name:'fromMail', type: 'text', disabled:true, required:false, html:{caption:'보내는 사람'}},
		    				{name:'mailTitle', type: 'text', disabled:false, required:true, html:{caption:'제목'}},
							{name:'toMail1', type: 'text', disabled:true, required:true, html:{caption:'받는 사람'}},
							{name:'toMail2', type: 'text', disabled:true, required:false, html:{caption:'참조'}},
							{name:'mailBody', type: 'text', disabled:false, required:true, html:{caption:'본문'}},
							{name:'attachFile', type: 'text', disabled:true, required:false, html:{caption:'첨부된 문서'}},
							{name:'file', type: 'file', disabled:false, required:false, html:{caption:'첨부 파일'}}
		    			],
		    			record:{
		    				fromMail:sessionStorage.getItem("EMAIL"),
		    				mailTitle:'',
		    				toMail1:'',
		    				toMail2:'',
		    				mailBody:'',
		    				attachFile:attachFile.orgFileName
						}
		        	});
			    	
			    	$('#file').w2field('file', {
	        			/*max:1,*/
	        			onClick : function(event){
	        				console.log("onClick onClick");
	        			},
	        			onAdd : function(event){
	        				console.log("onAdd");
	        			},
	        			onRemove : function(event){
	        				console.log("onRemove");
	        				$(".file-input").val("");
	        			}
	        		});
			    	
			    	$(document).on("click", "#toMail1, #userList1, #toMail2, #userList2", function(event){
			    		if($('body').find("#email_detail_popup").size() == 0 ){
							$('body').append("<div id='email_detail_popup'></div>");
						}
			    		
			    		var detailPopTitle = "";
			    		if(event.target.id === "toMail1"){
			    			detailPopTitle = "받는 사람";
			    		}else{
			    			detailPopTitle = "참조";
			    		}
			    		
			    		$("#email_detail_popup").dialog({
			    			title : detailPopTitle,
			    			width : 950,
			    			height : 600,
							modal : true,
							resizable: false,
							show: { effect: "fade", duration: 300 },
						    hide: { effect: "fade", duration: 100 },
						    buttons : {
						    	"확인" : function(){
						    		let param = w2ui["emailContents_props"].mailParam;
						    		let xFlug = true; //수신 참조 여부
						    		if($(this).dialog("option","title") === "참조"){
						    			param.addUserList = [];
						    			xFlug = false;
						    		}else{
						    			param.toUserList = [];
						    			xFlug = true;
						    		}
						    		
						    		let userListNum = w2ui["email_user_list"].getSelection();
						    		let txt = "";
						    		for(var i=0; i < userListNum.length; i++){
						    			let currentNum = userListNum[i];
						    			let item = w2ui["email_user_list"].get(currentNum);
						    			
						    			if(item.email === "" || item.email === null) continue;
						    			
						    			if($(this).dialog("option","title") === "참조"){
						    				param.addUserList.push(item);
						    			}else{
						    				param.toUserList.push(item);
						    			}
						    			
						    			if(i ===0){
					    					txt = item.customer_name + " <"+item.email+">";
					    				}else{
					    					txt += ", " + item.customer_name + " <"+item.email+">";
					    				}
						    		}
						    		
						    		if(xFlug){
						    			//받는사람
						    			xFlug = false;
						    			w2ui["emailContents_props"].record.toMail1 = txt;
						    		}else{
						    			//참조
						    			w2ui["emailContents_props"].record.toMail2 = txt;
						    		}
						    		
						    		w2ui["emailContents_props"].refresh();
						    		
						    		//w2ui["emailContents_props"].validate();
						    		
						    		$(this).dialog("close");
						    	},
						    	"취소" : function(){
									$(this).dialog("close");
								}
						    },
						    
						    open : function(){
						    	var mailValue = {};
						    	$("#email_detail_popup").append('<div id="emailSiteAddArea"></div>');
						    	let siteAddArea = '<div id="emailSiteContents">'+
															'<div id="emailSiteLeftContents">'+
																'<div class="dashboard-panel" style="width:100%;">'+
														    		'<div class="dashboard-title">Site List</div>'+
														    		'<div class="dashboard-contents"><div id="emailSiteLeftBottom"></div></div>'+
														    	'</div>'+
															'</div>'+//siteLeftContents
															'<div id="emailSiteRightContents">'+
																'<div class="dashboard-panel" style="width:100%;">'+
														    		'<div class="dashboard-title">Manager List</div>'+
														    		'<div class="dashboard-contents"><div id="emailSiteRightBottom"></div></div>'+
														    	'</div>'+
															'</div>'+//siteRightContents
														'</div>';
						    	
						    	$("#email_detail_popup").html(siteAddArea);
						    	
						    	//업체 정보 가져오기
						    	var getSiteList = function(){
						    		$.ajax({
						                url: "itsmUtil/getSiteList",
						                type: "get",
						                dataType: "json",
						                contentType: "application/json;charset=UTF-8",
						                success : function(data){
						                	w2ui['emailSiteTree'].insert('-1', null, data.treeData.nodes);
						                	
						                	let initItem = w2ui["emailSiteTree"].get(-1).nodes[0];
									    	
									    	let param = {};
				    						
				    						if(initItem.nodes.length >0){
				    							param.parent_site_id = initItem.site_id;
				    						}else{
				    							param.site_id = initItem.site_id;
				    						}
				    						
									    	getUserList(param);
						                },
						                error : function(data) {

						                }
							    	});
						    	}
						    	
						    	//고객 정보 가져오기
						    	var getUserList = function(param){
						    		$.ajax({
	    				                url: "itsmUtil/selectItemList",
	    				                type: "put",
	    				                dataType: "json",
	    				                data : JSON.stringify(param),
	    				                contentType: "application/json;charset=UTF-8",
	    				                success : function(data){
	    				                	w2ui['email_user_list'].records = data;
    				                		w2ui['email_user_list'].refresh();
    				                		
	    				                	if(data.length >0 ){
	    				                		w2ui["email_user_list"].unlock()
	    				                		
	    				                	}else{
	    				                		w2ui["email_user_list"].lock();
	    				                	}
	    				                },
	    				                error : function(data) {

	    				                }
	    					    	});
						    	};
						    	
						    	getSiteList();
						    	
						    	/*
						    	 * Site List Tree 
						    	 */
						    	$("#emailSiteLeftBottom").w2sidebar({
			        				name : 'emailSiteTree',
			        				style : 'widht:100%;height:400px',
			        				selectItem : null,
			        				nodes : [
			        					{id: 'Site', text: 'SITE LIST', expanded: true, group: true,
			        					nodes: [{id:'-1', text: 'SITE',	expanded: true, img: 'fa icon-folder'}]}
			        				],
			        				
			        				onClick : function(event){
			        					event.onComplete = function(){
			        						var selectId = event.target;
			        						if(selectId === "-1"){ //SITE Click
			        							return;
			        						}else{
			        							
			        						}
			        						
			        						w2ui["email_user_list"].selectNone();
			        						
			        						let selectItem = w2ui['emailSiteTree'].get(selectId);
			        						
			        						let param = {};
			        						
			        						if(selectItem.nodes.length >0){
			        							param.parent_site_id = selectItem.site_id;
			        						}else{
			        							param.site_id = selectItem.site_id;
			        						}
			        						
			        						getUserList(param);
			        						
			        					}
			        				}
			        			
			        			});
						    	
						    	w2ui["emailSiteTree"].disable(-1);
						    	
						    	/*
						    	 * 고객 리스트
						    	 */
						    	$("#emailSiteRightBottom").w2grid({
									name : 'email_user_list',
									style : 'border-right: 0px solid rgba(255,255,255,0.1) !important;widht:100%;height:400px',
									show: { 
										toolbar: false,
										footer:false,
										toolbarSearch:false,
										toolbarReload  : false,
										searchAll : false,
										toolbarColumns : false,
										selectColumn: true,
									},
									multiSelect : true,
									recordHeight : 30,
									blankSymbol : "-",
									columns : [
										{ field: 'recid', caption: 'NO', size : '20px', sortable: true, attr: 'align=center'},
										{ field: 'customer_name', caption: 'NAME', size: '100%', sortable: true, attr: 'align=center'}, //고객명
										{ field: 'phone', caption: 'PHONE', size: '100%', sortable: true, attr: 'align=left', style:'padding-right:5px;'}, //연락처
										{ field: 'email', caption: 'EMAIL', size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'}, //이메일
										{ field: 'site_name', caption: 'SITE', hidden: true, size: '100%', sortable: true, attr: 'align=left', style:'padding-left:5px;'} //주문처
									]
								});
						    	
						    },
						    close : function(){
						    	if(w2ui["emailSiteTree"]){
						    		w2ui["emailSiteTree"].destroy();
						    	}
						    	if(w2ui["email_user_list"]){
						    		w2ui["email_user_list"].destroy();
						    	}
						    	
						    	$("#email_detail_popup").remove();
						    	
						    }
			    		});
			    		
					});
			    	
			    },
			    close : function(){
			    	w2ui["emailContents_props"].destroy();
			    	$(document).off("click", "#toMail1, #userList1, #toMail2, #userList2")
			    	$("#email_popup").remove();
			    }
			})
		}
		
		
	},
	
	attachFileFunc : function(cmdId){//id 
		let _this = this;
		if($('body').find("#attachFile").size() == 0 ){
			$('body').append("<div id='attachFile'></div>");
		}
		
		let title = '';
		let attchContents =  '<div>'+
									'<div id="attachFileContents" style="height:33px;">'+
						    			'<div>'+
											'<div class="w2ui-field w2ui-span3">'+
											    '<label>File : </label>'+
											    '<div style="float:left"><input type="file" id="attachFileBtn" style="width: 93%" ></div>'+
											    '<div style="float:right"><button id="fileUploadBtn" class="darkButton">등록</button></div>'+
											'</div>'+
										'</div>'+
					    			'</div>'+
									'<div id="iconGroup">'+
										'<i id="fileDownBtn" class="itsm fas fa-download" aria-hidden="true" title="download"></i>'+
										'<i id="fileDelBtn" class="itsm fas fa-trash-alt" aria-hidden="true" title="Delete"></i>'+
									'</div>'+
									'<div id="attachGridContents" ></div>'+
							    '</div>';
							title = "File Upload";
		
		let selectGridFunc = function(){
			$.ajax({
                url: "itsmUtil/getDownLoadList/"+cmdId,
                type: "get",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success : function(data){
                	w2ui["attachFileGrid"].records = data;
                	w2ui["attachFileGrid"].refresh();
                },
                error : function(data) {

                }
	    	});
		}
		
		$("#attachFile").dialog({
			show: { effect: "fade", duration: 300 },
		    hide: { effect: "fade", duration: 100 },
		    modal : true,
		    resizable: false,
		    width: 700,
		    height: 500,
			title: title,
			open : function(){
				$("#attachFile").html(attchContents);
				
				$("#attachGridContents").w2grid({
            		name : 'attachFileGrid',
            		style : 'width:100%;height:250px;',
            		show: { 
						toolbar: false,
						footer:false,
						toolbarSearch:false,
						toolbarReload  : false,
						searchAll : false,
						toolbarColumns : false,
						selectColumn: true,
					},
					multiSelect : true,
					recordHeight : 30,
					blankSymbol : "-",
					columns : [
						{ field: 'recid', caption: 'NO', size : '20px', sortable: true, attr: 'align=center'},
						{ field: 'orgFileName', caption: 'FILE NAME', size: '100%', sortable: true, attr: 'align=left'},
						{ field: 'createTime', caption: 'TIME', size: '100%', sortable: true, attr: 'align=center'}
					]
            	});
				
				w2ui["attachFileGrid"].on({phase: 'before', execute:'after', type : 'click'}, function(event){
					let lens = w2ui["attachFileGrid"].getSelection().length;
					if(lens > 0){
						$("#fileDownBtn, #fileDelBtn").addClass('link');
					}else{
						$("#fileDownBtn, #fileDelBtn").removeClass('link');
					}
	        	});
				
				selectGridFunc();
				
				$('#attachFileBtn').w2field('file', {
        			onClick : function(event){
        				console.log("onClick onClick");
        			},
        			onAdd : function(event){
        				console.log("onAdd");
        			},
        			onRemove : function(event){
        				console.log("onRemove");
        			}
        		});
				
				/*
				 * 파일 업로드 
				 */
				$(document).on('click', "#fileUploadBtn", function(event){
					let files = $("#attachFileBtn").data('selected');
					
					if(files.length === 0) return;
					$('body').loading('show');
					var formData  = new FormData();
					let uploadUrl = "itsmUtil/FileManager/upload/"+cmdId;
					
					for(var i=0; i<files.length ; i++){
						formData.append('file'+i, files[i].file);
					}
					
					$.ajax({
						url : uploadUrl,
						data: formData,
						processData: false,
	                    contentType: false,
	                    type: 'POST',
	                    success : function(data){
	                    	$('body').loading('hide');
	                    	selectGridFunc();
	                    	$('#attachFileBtn').w2field('file', {});
	                    },
	                    error: function(xhr,textStatus,error){
	                    	$('body').loading('hide');
	                    	console.log(error);
	                    }
					});
				});
				
				/*
				 * 파일 다운로드
				 */
				$(document).on('click', "#fileDownBtn", function(event){
					let selectItems = w2ui["attachFileGrid"].get(w2ui["attachFileGrid"].getSelection());
					if(selectItems.length === 0 ){
						return;
					}else{
						_this.fileDownloadFunc(selectItems);
		       		}
			       		
				});
				
				/*
				 * 파일 삭제
				 */
				$(document).on('click', "#fileDelBtn", function(event){
					let selectItems = w2ui["attachFileGrid"].get(w2ui["attachFileGrid"].getSelection());
					if(selectItems.length === 0 ){
						return;
					}else{
						$('body').loading('show');
						$.ajax({
							url : "itsmUtil/FileManager/delete",
							type:"put",
							dataType: "json",
			                contentType: "application/json;charset=UTF-8",
			                data : JSON.stringify(selectItems),
			                success : function(data){
			                	$('body').loading('hide');
			                	selectGridFunc();
			                },
			                error : function(data) {
			                	$('body').loading('hide');
			                	console.log(data);
			                }
			                
						});
					}
				})
				
				
			},
		    buttons : {
		    	"확인" : function(){
		    		let customEvent = new CustomEvent("attachFileSuccess", {
		    	    	detail :{
		    	    		currentEvent : event
		    	    	}
            		});
            		
            		document.dispatchEvent(customEvent);
		    		$(this).dialog("close");
		    	}
		    },
		    
			close : function(){
				$("#attachFile").remove();
				w2ui["attachFileGrid"].destroy();
				$(document).off('click', "#fileDelBtn");
				$(document).off('click', "#fileUploadBtn");
				$(document).off('click', "#fileDownBtn");
			}
		});
	}

}