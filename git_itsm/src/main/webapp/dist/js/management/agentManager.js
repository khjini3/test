define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/management/agentManager",
    "js/lib/component/BundleResource",
    "css!cs/management/agentManager"
],function(
    $,
    _,
    Backbone,
    JSP,
    BundleResource
){
	//agent xml collect model
	var XmlCollectionModel = Backbone.Model.extend({
		url: "agent/condition",
		parse: function(result) {
			return {data:result};
		}
	});
	//agent collect model
	var Model = Backbone.Model.extend({
		url: "agent/collect",
		parse: function(result) {
			return {data:result};
		}
	});
	//db info model
	var DbModel = Backbone.Model.extend({
		url: "agent/dbinfo",
		parse: function(result) {
			return {data:result};
		}
	});
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.elements = {
    			scene : null	
    		};
    		this.$el.append(JSP);
    		
    		$("#collectContentList").append("<div id='collectContentArea' style='height: 100%'></div>");
			$('#collectContentList').append("<div id='popup'></div>");
			$('#collectContentList').append("<div id='confirmDialog'></div>");
			$('#collectContentList').append("<div id='loading'></div>");
			$("#dbinfoContentList").append("<div id='dbinfoContentArea' style='height: 100%'></div>");
			this.xmlmodel = new XmlCollectionModel();
			this.xmlmodel.fetch();
			this.listenTo(this.xmlmodel, "sync", this.startGrid);
			
        },
        startGrid: function(response){
        	this.collectConditions = response.toJSON().collect;
        	
        	this.dbmodel = new DbModel();
        	this.dbmodel.fetch();
        	this.listenTo(this.dbmodel, "sync", this.renderDbinfoGrid);
        },
        renderDbinfoGrid: function(response){
        	var data = response.toJSON().data;
        	var _this = this;
        	
            var columns = [
                { field: 'name', caption: 'Name', size: '80px', attr: 'align=left', style : 'padding-left:5px'},
                { field: 'driver', caption: 'Driver', size: '245px', attr: 'align=left', style : 'padding-left:5px' },
                { field: 'hostname', caption: 'Host Name', size: '130px', attr: 'align=left', style : 'padding-left:5px'},
                { field: 'id', caption: 'ID', size: '90px', attr: 'align=left', style : 'padding-left:5px'},	
                { field: 'password', caption: 'Password', size: '90px', attr: 'align=left', style : 'padding-left:5px'},
                { field: 'port', caption: 'Port', size: '50px', attr: 'align=right', style : 'padding-right:5px'},
                { field: 'schema', caption: 'Schema', size: '80px', attr: 'align=left', style : 'padding-left:5px'},
                { field: 'description', caption: 'Description', size: '100%', attr: 'align=left', style : 'padding-left:5px'}
            ];   

            $("#dbinfoContentArea").grid({
    			columns: columns, 
    			data: data, 
    			recid : 'idx',
    			show: { selectColumn: false, recordTitles: false },
                multiSelect: false,
                recordHeight: 40,
            });

        	this.model = new Model();
			this.model.fetch();
			this.listenTo(this.model, "sync", this.renderCollectGrid);
			
        },
        renderCollectGrid : function(response){
        	
        	var data = response.toJSON().data;
        	var columns = [
       	                   { field: 'protocol', caption: 'Protocol', size: '80px', attr: 'align=left', style : 'padding-left:5px',  
       	                	   render: function(data){
       	                		   if(data.protocol == 0){
       	                			   return "Jdbc";
       	                		   }else if(data.protocol == 1){
       	                			   return "ssh+jdbc";
       	                		   }else if(data.protocol == 2){
       	                			   return "ftp/sftp";
       	                		   }
       	                	   }
       	                   },
       	                   { field: 'period', caption: 'Period', size: '50px', attr: 'align=center'},
       	                   { field: 'connect_jdbc', caption: 'connectDB', size: '80px', attr: 'align=left', style : 'padding-left:5px',
       	                	   render: function(data){
       	                		   /*if(data.connect_jdbc == 0){
       	                			   return "bookDB";
       	                		   }else if(data.connect_jdbc == 1){
       	                			   return "bookDB2";
       	                		   }else if(data.connect_jdbc == 2){
       	                			   return "bookDB3";
       	                		   }else if(data.connect_jdbc  == -1){
       	                			   return "";
       	                		   }*/
       	                		   var str = "";
	   	                	 	   if(data.connect_jdbc != null){
	   	                			   
	   	                			   $(w2ui['dbinfoContentAreaGrid'].records).each(function(idx, val){
	   	                				   if(val.idx == data.connect_jdbc){
	   	                					   str = val.name;
	   	                				   }
	   	                			   })
	   	                		   }
	   	                	 	 return  str;   
       	                	   }},
       	                   { field: 'remote_url', caption: 'Remote_url', size: '100px', attr: 'align=left', style : 'padding-left:5px'},
       	                   { field: 'remote_id', caption: 'Remote_id', size: '100px', attr: 'align=left', style : 'padding-left:5px'},
       	                   { field: 'remote_pwd', caption: 'Remote_pwd', size: '100px' , hidden:true},
       	                   { field: 'query_id', caption: 'Query(File)', size: '100%', attr: 'align=left', style : 'padding-left:5px'}
       	                	   ];   
        	
        	$("#collectContentArea").grid({
    			columns: columns, 
    			data: data, 
    			recid : 'idx',
                multiSelect: false,
                show : {recordTitles: false},
                recordHeight: 40,
            });
        	
        	$('.grid-buttons').tooltip();
        },
        getCollectinfo : function(){
        	
        	this.model = new Model();
        	this.model.fetch();
        	this.listenTo(this.model, "sync", this.changeCollectData);
        	
        },
        changeCollectData : function(response){
        	var data = response.toJSON().data;
        	$("#collectContentArea").grid('empty');
        	$("#collectContentArea").grid('update', data);
        	
        },
        getDbinfo : function(){
        	
        	this.dbmodel = new DbModel();
        	this.dbmodel.fetch();
        	this.listenTo(this.dbmodel, "sync", this.changeDbData);
        	
        },
        changeDbData : function(response){
        	var data = response.toJSON().data;
        	$("#dbinfoContentArea").grid('empty');
        	$("#dbinfoContentArea").grid('update', data);
        	
        },
        events: {
        	'click #collectAddBtn' : 'addCollectInfo',
        	'click #collectDeleteBtn' : 'deleteCollectInfo',
        	'click #dbinfoAddBtn' : 'addDbInfo',
        	'click #dbinfoDeleteBtn' : 'deleteDbInfo',
        	'dblclick #collectContentArea .w2ui-grid-data'  : 'editCollectInfo',
        	'dblclick #dbinfoContentArea .w2ui-grid-data'  : 'editDbInfo',
        },
        addCollectInfo : function(evt){
        	this.makeCollectInfoPopup();
        },
        editCollectInfo : function(evt){
        	if($(evt.target).parent().hasClass('w2ui-empty-record')){
        		return;
        	}
        	var edit_id = $("#collectContentArea").grid('getRecid');
        	var data = $("#collectContentArea").grid('getRow', edit_id);
        	this.makeCollectInfoPopup(data);
        },
        deleteCollectInfo : function(evt){
        	var _this = this;
        	var bodyContents = "";
        	var body = "";
        	
        	if(w2ui.collectContentAreaGrid.getSelection().length == 0){
        		bodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
				'<div class="assetMgr-popup-btnGroup">'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
				'</div>'+
				'</div>' ;
            	w2popup.open({
            		width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.assetManager.info'),
    		        body: body,
                    opacity   : '0.5',
             		modal     : true,
        		    showClose : true
    		    });
        		
        		//this.alertPopup('label.report.row_noselected', "Information");
        		return;
        	}
        	var collect_id = $("#collectContentArea").grid('getRecid');
          	this.model = new Model();
          	this.model.url = this.model.url+"/"+collect_id; 
          	this.model.set("id", collect_id);
          	this.model.destroy({
                success: function(model, response) {
                  	_this.getCollectinfo();
                }
            });
        	
        },
        addDbInfo : function(evt){
        	this.makeDbInfoPopup();
        },
        editDbInfo : function(evt){
        	if($(evt.target).parent().hasClass('w2ui-empty-record')){
        		return;
        	}
        	
        	var db_id = $("#dbinfoContentArea").grid('getRecid');
          	var data = $("#dbinfoContentArea").grid('getRow', db_id);
          	this.makeDbInfoPopup(data);
        },
        deleteDbInfo : function(evt){
        	var _this = this;
        	if(w2ui.dbinfoContentAreaGrid.getSelection().length == 0){
        		//this.alertPopup('label.report.row_noselected', "Information");
        		bodyContents = BundleResource.getString('label.assetManager.noSelectedItem');
        		body = '<div class="w2ui-centered">'+
				'<div class="popup-contents" style="padding:0px 10px 35px 10px; text-align: center; color:#ffffff;">'+bodyContents+'</div>'+
				'<div class="assetMgr-popup-btnGroup">'+
					'<button onclick="w2popup.close();" class="darkButton">' + BundleResource.getString('button.assetManager.confirm') + '</button>'+
				'</div>'+
				'</div>' ;
            	w2popup.open({
            		width: 385,
     		        height: 180,
    		        title : BundleResource.getString('title.assetManager.info'),
    		        body: body,
                    opacity   : '0.5',
             		modal     : true,
        		    showClose : true
    		    });
        		return;
        	}
        	var collect_id = $("#dbinfoContentArea").grid('getRecid');
        	this.dbmodel = new DbModel();
        	this.dbmodel.url = this.dbmodel.url+"/"+collect_id; 
          	this.dbmodel.set("id", collect_id);
          	this.dbmodel.destroy({
                success: function(model, response) {
                  	_this.getDbinfo();
                }
            });
        },
        makeCollectInfoPopup : function(data){
        	var _this = this;
        	
        	/*var dbArr = [{
        		text: 'com.mysql.jdbc.Driver',
        		value: 'com.mysql.jdbc.Driver'
        	},{
        		text: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
        		value: 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
        	}];*/
        	var dbArr = [];
        	$(w2ui['dbinfoContentAreaGrid'].records).each(function(idx, val){
        		var obj = {};
        		obj.text = val.name;
        		obj.value = val.idx;
        		dbArr.push(obj);
        	});
        	var options = {
    				buttons: {
    			    	  Save: function() {
    			    		  _this.collectPopupSaveAction($(this).popup("getValues"), data);
    			    		  $(this).popup("close");
    			          },
    			          Cancel: function() {
    			        	  $(this).popup("close");
      			          }
    		        },
    		        showClose : true,
    		        width: 450,
    		        minWidth: 450,
    				title: 'Collect INFO',
    				form: [
    				       {id: 'protocolCombo', type: 'combo', label: 'Protocol', 
    				    	   value: [{text: 'jdbc', value: '0', check: true}, 
    				    	           {text: 'ssh+jdbc', value: '1'}, 
    				    	           {text: 'ftp/sftp', value: '2'}]
    				       },
    				       {id: 'period', type: 'combo', label: 'Period', value: [{text: 'Hour', value: 0}, {text: 'Day', value: 1}]},
    				       {id: 'connectDBCombo', type: 'combo', label: 'Connect DB', value: dbArr},
    				       {id: 'remoteURL', type: 'text', label: 'remoteURL', value: ''},
    				       {id: 'remoteID', type: 'text', label: 'remoteID', value: ''},
    				       {id: 'remotePWD', type: 'password', label: 'remotePWD', value: ''},
    				       {id: 'query', type: 'text', label: 'query', value: ''},
    				       
    			    ],
        	}
        	
        	$('#popup').popup(options);
        	
        	_this.protocolChange(0);
        	$('#protocolCombo').change(function(){
        		_this.protocolChange(this.selectedIndex);
        	});
        	$("#query").after($("<div class='grid-buttons start-btn'/>"));
        	$('.start-btn').on('click', function(e) {
        		$('#div-tooltip').show();
        	});
        	_this.queryAction();
        	$('.stop-btn').on('click', function(e) {
        		$('#div-tooltip').hide();
        	});
        	
        	if(data != null){
        		this.setCollectData(data);
        		this.protocolChange(data.protocol);
        	}
        	$('#popup').popup('open');
        },
        setCollectData: function(data){
        	$("#protocolCombo").val(data.protocol);
        	$("#period").val(data.period);
        	$("#connectDBCombo").val(data.connect_jdbc);
        	$("#remoteURL").val(data.remote_url);
        	$("#remoteID").val(data.remote_id);
        	$("#remotePWD").val(data.remote_pwd);
        	$("#query").val(data.query_id);
        	$("#queryta").val(data.query_ins);
        },
        protocolChange: function(idx){
        	$('.popup-form').attr('disabled', false);
        	if(idx == 0){
        		$("#remoteURL").attr('disabled', true);
        		$("#remoteID").attr('disabled', true);
        		$("#remotePWD").attr('disabled', true);
        	}else if(idx == 1){
        		
        	}else if(idx == 2){
        		$("#connectDBCombo").attr('disabled', true);
        	}
        },
        queryAction: function(){
        	$('#popup').parent().append("<div id='div-tooltip' class='query-div'>" +
        			"<div class='title-div'><div class='grid-buttons stop-btn'></div></div>" +
		        	"<div class='label-div'><label class='query-label'>query</label></div>" +
		        	"<div><textarea id='queryta' readonly='readonly'></textarea></div></div>");
        	$('#div-tooltip').hide();
        },
        makeDbInfoPopup : function(data){
        	var _this = this;
        	var driverArr = [];
        	$(w2ui['dbinfoContentAreaGrid'].records).each(function(idx, val){
        		var obj = {};
        		obj.text = val.driver;
        		obj.value = val.driver;
        		driverArr.push(obj);
        	});
        	 
        	var options = {
    				buttons: {
    			    	  Save: function() {
    			    		  _this.dbPopupSaveAction($(this).popup("getValues"), data);
    			    		  $(this).popup("close");
    			          },
    			          Cancel: function() {
    			        	  $(this).popup("close");
      			          }
    		        },
    		        width: 450,
    		        minWidth: 450,
    				title: 'DBINFO',
    				form: [
    				       {id: 'name', type: 'text', label: 'Connect Name', value: ''},
    				       {id: 'driver', type: 'combo', label: 'Driver', value: driverArr },
    				       {id: 'hostname', type: 'text', label: 'Host Name', value: ''},
    				       {id: 'dbId', type: 'text', label: 'DB ID', value: ''},
    				       {id: 'dbPwd', type: 'password', label: 'DB PWD', value: ''},
    				       {id: 'port', type: 'text', label: 'PORT', value: ''},
    				       {id: 'description', type: 'text', label: 'Description', value: ''},
    				       {id: 'schema', type: 'text', label: 'Default Schema', value: ''},
    				       
    			    ],
        	}
        	
        	$('#popup').popup(options);
        	if(data != null){
        		this.settingDBInfo(data);
        	}
        	$('#popup').popup('open');
        },
        settingDBInfo: function(data){
        	$('#name').val(data.name);
        	$('#driver').val(data.driver);
        	$('#hostname').val(data.hostname);
        	$('#dbId').val(data.id);
        	$("#dbPwd").val(data.password);
        	$("#port").val(data.port);
        	$("#description").val(data.description);
        	$("#schema").val(data.schema);
        },
        dbPopupSaveAction: function(data, griddata){
        	var _this = this;
        	
        	this.dbmodel = new DbModel();
    		this.dbmodel.set({
    			name: data.name,
        		driver : data.driver,
        		hostname : data.hostname,
        		db_id: data.dbId,
        		password : data.dbPwd,
        		port: data.port,
        		description: data.description,
        		schema: data.schema
    		});
    		if(griddata != null){
    			this.dbmodel.set({
    				id: griddata.idx,
    				idx: griddata.idx
    			});
    		}
    		this.dbmodel.save(null, {
              success: function(model, response) {
            	_this.getDbinfo();
              },
              error: function(model, response) {
            	  
              }
    		});
        },
        collectPopupSaveAction: function(data, griddata){
        	var _this = this;
        	
        	_this.model = new Model();
    		_this.model.set({
    			protocol: data.protocolCombo,
        		period : data.period,
        		unit: "m",
        		connect_jdbc : (data.protocolCombo == 2? -1 : data.connectDBCombo),
        		remote_url : (data.protocolCombo == 0? "" : data.remoteURL),
        		remote_id : (data.protocolCombo == 0? "" : data.remoteID),
        		remote_pwd : (data.protocolCombo == 0? "" : data.remotePWD),
        		query : data.query
    		});
    		if(griddata != null){
    			_this.model.set({
    				id: griddata.idx,
    				idx: griddata.idx
    			});
    		}
    		_this.model.save(null, {
	              success: function(model, response) {
	            	_this.getCollectinfo();
	            	//$('#popup').popup('close');
	              },
	              error: function(model, response) {
	            	//$('#popup').popup('close');
	              }
	          });
        },
        
       	alertPopup : function(markup, title){
       		var options = {
    				buttons: {
    			    	  OK: function() {
    			    		 $(this).confirm("close");
    			          }
    		        },
    		        width: 400,
    				title: title,
    				form: [
    				       {id: 'warning', type: 'label', label: BundleResource.getString(markup)},
    				],
        	}
        	$('#confirmDialog').confirm(options);
    		$('#confirmDialog').confirm('open');
       	},
        destroy : function() {
        	this.undelegateEvents();
        },
        
    })

    return Main;
});