define([
    "jquery",
    "underscore",
    "backbone",
    "text!views/asset/assetInformation",
    "css!cs/asset/assetInformation"
],function(
    $,
    _,
    Backbone,
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
        start: function() {
        	
        },
        
        destroy: function() {
        	console.log('assetInformation destroy')
        }
    })

    return Main;
});