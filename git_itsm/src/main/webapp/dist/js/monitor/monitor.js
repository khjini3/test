define([
    "jquery",
    "underscore",
    "backbone",
    "w2ui",
    "text!views/monitor/test1",
    "model"
],function(
    $,
    _,
    Backbone,
    W2ui,
    JSP
){
	
    var Main = Backbone.View.extend({
        el: '.content .wrap',
    	initialize : function() {
    		var _this = this;
    		this.elements = {
    			scene : null	
    		};
    		this.$el.append(JSP);
    		this.start();
    		
        },
        events: {
        	'click #popup-btn' : 'gridPopup',
        },
        gridPopup : function() {
        	var gridName = 'grid';
    		var popupBody = '<div class="w2ui-centered" id="grid-test" style="height: 100%"></div>'
    		w2popup.open({
    			 title     : 'Popup Title',
    		     body      : popupBody,
    		     buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button> ',
    		     width     : 900,
    		     height    : 600,
    		     overflow  : 'hidden',
    		     color     : '#333',
    		     speed     : '0.3',
    		     opacity   : '0.8',
    		     modal     : true,
    		     showClose : true,
    		     showMax   : true,
    		     onMax     : function (event) {  },
    		     onMin     : function (event) {  },
    		     onKeydown : function (event) {  },
    		     onClose   : function (event) {
    		    	 var obj = window.w2ui[gridName];
    		    	 if(obj != undefined) obj.destroy(); 
    		     }
            });
    		
    		$("#grid-test").w2grid({ 
		        name: gridName,
		        url: 'widget',
		        recid : 'widgetId',
		        columns: [
		            { field: 'widgetId', caption: 'ID', size: '33%', sortable: true, searchable: true },
		            { field: 'title', caption: 'Title', size: '33%' },
		            { field: 'widgetName', caption: 'WidgetName', size: '33%', sortable: true, searchable: true },
		            { field: 'url', caption: 'URL', size: '33%' },
		            { field: 'widgetGroup', caption: 'Group Name', size: '33%' },
		            { field: 'chartType', caption: 'Chart Type', size: '33%' },
		            { field: 'description', caption: 'Description', size: '33%' },
		        ],
		        onClick: function(evt) { console.log(window.w2ui.grid.get(evt.recid)); }
    		});
    		
        },
        start: function() {
        	//this.w2crud();
        	//this.bbcrud();
        	this.crud();
        },
        crud : function() {
        	var model0 = new Model({urlRoot: "widget"});
        	model0.setData({"widgetName":"Test", "title":"Title"});
        	model0.post(); // model
        	model0.get();
        	
        	var model1 = new Model({urlRoot: "widget"});
        	model1.setId(1);
        	model1.setData({"widgetId":"1", "id":"1", "widgetName":"Test","title":"Title"});
        	model1.put();
        	model1.get(this.setData);
        },
        setData : function(model) {
			var data = model.data;
			$("#grid-popup").w2grid({ 
		        name: 'gridName',
		        recid: 'widgetId',
				columns: [
		            { field: 'widgetId', caption: 'ID', size: '33%', sortable: true, searchable: true },
		            { field: 'title', caption: 'Title', size: '33%' },
		            { field: 'widgetName', caption: 'WidgetName', size: '33%', sortable: true, searchable: true },
		            { field: 'url', caption: 'URL', size: '33%' },
		            { field: 'widgetGroup', caption: 'Group Name', size: '33%' },
		            { field: 'chartType', caption: 'Chart Type', size: '33%' },
		            { field: 'description', caption: 'Description', size: '33%' },
		        ],
				records: [data],
		        onClick: function(evt) { 
		        	//console.log(window.w2ui[gridName].get(evt.recid));
		        	_this.formPopup(window.w2ui[gridName].get(evt.recid));
		        }
    		})
		},
        bbcrud : function() {
        	var Model = Backbone.Model.extend({
        		urlRoot: "widget",
        		url: function() {
        			var url = this.urlRoot;
        			var obj = this.toJSON();
        			if(obj.widgetId != undefined) url += "/" + obj.widgetId;
        			return url;
        		}
        	});
        	var Collection = Backbone.Model.extend({
                model: Model,
                url: 'widget',
                parse: function(result) {
                    return {data: result};
                }
            });
        	
        	var model0 = new Model(); 
        	model0.set("widgetName","Test");
        	model0.set("title","Title");
        	model0.save(); // model
        	model0.fetch();
        	
        	var model1 = new Model();
        	model1.set("widgetId", "1");
        	model1.set("id", "1");
        	model1.set("widgetName","Test");
        	model1.set("title","Title");
        	model1.save();
        	model1.fetch();
        	
        	this.collection = new Collection();
    		this.collection.fetch();
    		this.listenTo(this.collection, "sync", function() {
    			console.log(this.collection);
    			var array = this.collection.toJSON().data;
    			$("#grid-popup").w2grid({ 
    		        name: 'gridName',
    		        recid: 'widgetId',
    				columns: [
    		            { field: 'widgetId', caption: 'ID', size: '33%', sortable: true, searchable: true },
    		            { field: 'title', caption: 'Title', size: '33%' },
    		            { field: 'widgetName', caption: 'WidgetName', size: '33%', sortable: true, searchable: true },
    		            { field: 'url', caption: 'URL', size: '33%' },
    		            { field: 'widgetGroup', caption: 'Group Name', size: '33%' },
    		            { field: 'chartType', caption: 'Chart Type', size: '33%' },
    		            { field: 'description', caption: 'Description', size: '33%' },
    		        ],
    				records: array,
    		        onClick: function(evt) { 
    		        	//console.log(window.w2ui[gridName].get(evt.recid));
    		        	_this.formPopup(window.w2ui[gridName].get(evt.recid));
    		        }
        		});
    			w2ui.gridName.clear();
    			setTimeout(function() {
    				w2ui.gridName.records = array;
    				w2ui.gridName.render();
    			}, 1000)
    		});
        },
        w2crud : function() {
        	window.w2utils.settings.dataType = "RESTFULL";
        	var _this = this;
        	var gridName = 'newGrid';
        	$("#grid-popup").w2grid({ 
		        name: gridName,
		        url: 'widget',
		        columns: [
		            { field: 'widgetId', caption: 'ID', size: '33%', sortable: true, searchable: true },
		            { field: 'title', caption: 'Title', size: '33%' },
		            { field: 'widgetName', caption: 'WidgetName', size: '33%', sortable: true, searchable: true },
		            { field: 'url', caption: 'URL', size: '33%' },
		            { field: 'widgetGroup', caption: 'Group Name', size: '33%' },
		            { field: 'chartType', caption: 'Chart Type', size: '33%' },
		            { field: 'description', caption: 'Description', size: '33%' },
		        ],
		        onClick: function(evt) { 
		        	//console.log(window.w2ui[gridName].get(evt.recid));
		        	_this.formPopup(window.w2ui[gridName].get(evt.recid));
		        }
    		});
        },
        formPopup: function(data) {
        	w2popup.open({
   			 title     : 'Popup Title',
   		     body      : '<div class="w2ui-centered" id="form-test" style="height: 100%"></div>',
   		     buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button> ',
   		     width     : 900,
   		     height    : 600,
   		     overflow  : 'hidden',
   		     color     : '#333',
   		     speed     : '0.3',
   		     opacity   : '0.8',
   		     modal     : true,
   		     showClose : true,
   		     showMax   : true,
           });
        	
        	$('#form-test').w2form({ 
                name  : 'form',
                fields: [
                	{ field: 'widgetId', type: 'Integer', required: false },
                	{ field: 'widgetName', type: 'text', required: true },
                	{ field: 'widgetGroup', type: 'text', required: true },
                    { field: 'chartType', type: 'text', required: true },
                    { field: 'title',  type: 'text', required: true },
                    { field: 'url',   type: 'text', required: true},
                    { field: 'description',   type: 'text'}
                ],
                actions: {
                    reset: function () {
                        this.clear();
                    },
                    save: function () {
                    	this.postData = this.record;
                    	var urlRoot = "widget";
                    	var id = this.postData.widgetId
                    	if(id == undefined) {
                    		this.url = urlRoot;
                    	} else {
                    		this.recid = id;
                    		this.url = urlRoot + '/' + id; 
                    	}
                        this.save();
                    },
                }
            });
        }
    })

    return Main;
});