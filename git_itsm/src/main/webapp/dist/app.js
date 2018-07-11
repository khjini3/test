requirejs([
	"config"
], function(config) {
	requirejs([
		"jquery",
		"yescoreui",
		"mapEditor",
    	"echartWrapper",
	], function($) {
		$(document).ready(function() {
			requirejs([
				"js/main"
			], function(
				Main
			){
				main = new Main();
				main.start();
			});
		});
	});
});
