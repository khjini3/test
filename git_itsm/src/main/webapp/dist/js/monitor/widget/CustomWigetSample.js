define([
    "jquery",
    "underscore",
    "text!views/monitor/gmWidget",
],function(
    $,
    _,
    Backbone,
    JSP
){
	function CustomWidget() {
		this.init();
	}
	
	CustomWidget.prototype = {
		init : function() {
			console.log("Custom Widget Init");
		},
		render : function() {
			
		},
		start : function() {
			
		},
		stop : function() {
			
		},
		getData : function() {
			
		},
		setData : function() {
			
		}
	}
	
    return CustomWidget;
});