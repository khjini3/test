define([
    "jquery",
    "underscore",
    "backbone",
    "rx",
    "js/lib/component/BundleResource",
    "text!views/project/project",
    "css!cs/project/project",
],function(
    $,
    _,
    Backbone,
    Rx,
    BundleResource,
    ProjectJSP
){
	var ProjectModel = Backbone.Model.extend({ 
        url: '/project/project',
        parse: function(result) {
            return {data: result};
        }
    });
	
    var Project = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.elements = {
    			scene : null,
    			selectedBtn : null,
    			selectId : undefined
    		};
    		this.$el.append(ProjectJSP);
    		
    		this.ProjectModel = new ProjectModel();
    		this.listenTo(this.ProjectModel, "sync", this.getData);
    		
    		this.start();
        },
        events: {
        	/*
        	'click #kpi-add-btn' : 'setKpiAddPopup',
        	'click #kpi-edit-btn' : 'setKpiEditPopup',
        	'click #kpi-del-btn' : 'setKpiDelete',
        	*/
        	'click #kpi-ref-btn' : function() {
        		this.ProjectModel.fetch();
        	},
        	/*'dblclick .w2ui-grid-data'  : 'setKpiEditPopup',*/
        	'click .report-state': 'changeState'
        },
        getData : function(model) {
        	var data = model.toJSON().data;
        	//console.log(data);
        	var grid = this.$el.find('#projectGrid-table');
        	if(grid.find('table').length != 0) {
        		this.$el.find(grid).grid('update', data.data.data);
        	} else {
        		this.renderGrid(data);
        	}
        	
        },
        start: function() {
        	//this.ProjectModel.fetch();
        	this.renderGrid();
        },
        renderGrid: function(data) {
        	var columns = [                
                { field: 'projectTitle', caption: BundleResource.getString('label.projectManager.title'), size: '40%', attr : "align=center", },
                { field: 'scheduleStart', caption: BundleResource.getString('label.projectManager.scheduleStart'), size: '25%', attr : "align=center", },
                { field: 'scheduleEnd', caption: BundleResource.getString('label.projectManager.scheduleEnd'), size: '25%', attr : "align=center", },
                { 
                	field: 'state', caption: BundleResource.getString('label.projectManager.state'), size: '10%', attr : "align=center",
                	render : function(data){
                		if(data.state == -1){//scheduling == None(-1)
                			return "-";
                		}
                		if(data.state == 1){//ing
                			return '<div class="report-running report-state" state='+data.state+'></div>';//'<div class="report-state-label">Running</div><div class="grid-buttons stop-btn report-state" title="Stop" reportid='+data.report_id+'></div>';
                		}else if(data.state == 0){//stop
                			return '<div class="report-stop report-state" state='+data.state+'></div>';//'<div class="report-state-label">Stop</div><div class="grid-buttons running-btn report-state" title="Running" reportid='+data.report_id+'></div>';	
                		}
            			return "-";
                	}
                }
            ];
        	
        	var testData = [
        		{id: 1, projectTitle: 'test', scheduleStart: '2017-08-18 00:00:00', scheduleEnd: '2017-08-18 00:01:00', state: 1},
        	]
        	
        	this.$el.find('#projectGrid-table').grid({columns: columns, show: { selectColumn: false, recordTitles: false }, data: testData});
        	
        },
        changeState: function(evt){
       		var _this = this;
       		var stateId = $(evt.target).attr('state');
       		
       		var data = $("#projectGrid-table").grid('getRow',stateId);
       		var report_view = "";
       		if(data.report_view == 0){//stop(0)->running(1)
       			data.report_view = 1;
       		}else{//running -> stop
       			data.report_view = 0;
       		}
       		this.model = new Model();
       		this.model.set({
    			id : data.report_id,
    			parent_id : data.parent_id,
    			report_title : data.report_title,
        		report_id : data.report_id,
        		report_view : data.report_view,
        		report_type : data.report_type,
        		report_sub_type : data.report_sub_type,
        		mybatis_id : data.mybatis_id,
        		scheduling : data.scheduling,
        		schedule_start : data.schedule_start,
        		schedule_end : data.schedule_end,
        		conditions : data.conditions,
        		ui_setting : data.ui_setting,
        		ui_value : data.ui_value,
        		cron_expression : data.cron_expression 
    		});
    		
    		this.model.save(null, {
	              success: function(response) {
	            	  //w2ui["reportContentAreaGrid"].refresh();
	            	  $("#reportContentArea").grid('refresh');
	              },
	              error: function(response) {
	            	_this.alertPopup('label.report.state_change_fail', "Information"); 
	              }
	          });
       	},
        destroy : function() {
        	this.undelegateEvents();
        }
    })

    return Project;
});