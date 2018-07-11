
requirejs.config({
    paths: {
        jquery : 'plugins/jQuery/jquery.min', // jQuery v2.2.3
        jqueryNumAni : 'plugins/jQuery/jquery.animateNumber',
        jqueryui : 'plugins/jQueryUI/juqery-ui-no-conflict', // jQuery UI - v1.11.4
        jqueryuiLayout : 'plugins/jQueryUILayout/jquery.layout.min', // jQuery UI Layout - v1.4.3
        "jquery-ui-src" : 'plugins/jQueryUI/jquery-ui.min',
        "jquery-valid" : "plugins/jquery-validate/jquery.validate.min",
        backbone : 'plugins/backbone/backbone-min',
        underscore : "plugins/underscore/underscore-min", // Underscore.js 1.8.3
        text : "plugins/requirejs/text",
        jqgrid : 'plugins/jqgrid/jquery.jqGrid.min', //
        jqgrid_locale : 'plugins/jqgrid/grid.locale-kr',
        bootstrap : 'plugins/bootstrap/js/bootstrap.min', // Bootstrap v3.3.6
        bootstrap_toggle : 'plugins/bootstrap/js/bootstrap-toggle.min',
        bootstrap_slider : 'plugins/bootstrap/js/bootstrap-slider.min',
        momentjs : 'plugins/moment/moment.min', // Moment js 2.14.1
        stomp : "plugins/stomp/stomp.min",
        sockjs : "plugins/sockjs/sockjs-1.1.1.min",
        //Gihwan-------------------------------------
        itamObserver : "js/observer/ItamObserver",
        //-------------------------------------------
        widget : "js/lib/widget/widget",
        yescoreui : "js/lib/ui/YescoreUI",
        mapEditor : "js/lib/map/MapEditor",
        yesUtil : "js/lib/map/yesUtil",
        itsmUtil : "js/lib/map/itsmUtil",
        gridster : "plugins/gridster/jquery.gridster.min",
        adminLTE : "plugins/adminLte/js/app.min",
        babylon : "plugins/babylon/babylon.custom_new",
        cannon : "plugins/babylon/cannon",
        hand : "plugins/babylon/hand-1.3.7",
        oimo : "plugins/babylon/Oimo",
        "obj-loader" : "plugins/babylon/loaders/babylon.objFileLoader",
        "bjs" : "js/lib/babylon/bjs",
        /*w2ui : 'plugins/w2ui/w2ui-1.5.rc1.min',*/
        w2ui : 'plugins/w2ui/w2ui-1.5.rc1',
        datgui : 'plugins/datgui/dat.gui.min',
        queryloader : "plugins/queryloader/queryloader2",
        fusioncharts : 'plugins/fusioncharts/fusioncharts',
        fusiontheme : 'plugins/fusioncharts/themes/fusioncharts.theme.fint',
        'fusioncharts-jquery' : 'plugins/fusioncharts/fusioncharts-jquery-plugin',
        chart : "js/lib/chart/Chart",  //3.0.0
        echart : "plugins/echarts/echarts.min",
        /*echart : "plugins/echarts/echarts",*/
        echartLiquid: 'plugins/echarts/echarts-liquidfill.min',
        ecStat: 'plugins/echarts/ecStat.min',
        echartWrapper: "js/lib/chart/EChartWrapper",
        rx : "plugins/rxjs/Rx.min",
        observer :  "js/observer/Observer",
        i18next: "plugins/i18n/i18next.min",
        "jquery-i18next" : "plugins/i18n/jquery-i18next.min",
        i18nextXHRBackend : "plugins/i18n/i18nextXHRBackend.min",
        "jquery-datetimepicker" : "plugins/jquery-datetimepicker/jquery.datetimepicker.full.min",
        "jquery-mousewheel" : "plugins/jquery-datetimepicker/jquery.mousewheel.min",
        "dashJs" : "plugins/dashjs/dash.all.min",
        "twbs-pagination" : "plugins/twbs-pagination/jquery.twbsPagination.min",
        "jstree" : "plugins/jstree/jstree.min",
        "jstreetable" : "plugins/jstree/jstreetable",
        views : "../views",
        idc : "js/idc/idcLoader",
        rackEditor : "js/editor/rackLoader",
        //"idcW2ui" : 'plugins/w2ui/w2ui-1.5.rc1.min',
        editControl : 'plugins/BabylonJS-EditControl/EditControl-2.4.2',
        cs : "css",
        loading : "plugins/loading/jquery.loadingModal",
        'jquery-csv' : "plugins/jQuery-csv/jquery.csv.min",
        "fontawesome-all" : "plugins/font-awesome/fontawesome-all",
        /*"fontawesome-all" : "plugins/font-awesome/fontawesome-all.min"*/
        kinetic : "plugins/jQuery-ticker/jquery.kinetic.min",
        mouseWheel : "plugins/jQuery-ticker/jquery.mousewheel.min",
        smoothDivScroll : "plugins/jQuery-ticker/jquery.smoothDivScroll.min",
        d3 : "plugins/d3js/d3.min"
    },

    shim :{
    	itsmUtil : {deps : ["css!js/lib/map/itsmUtil"] },
    	"jquery-ui-src" : {deps : ['jquery']},
        bootstrap : {deps : ['jquery',"jquery-ui-src","css!plugins/bootstrap/css/bootstrap.min"]},
        adminLTE : {deps : ['jquery',"jqueryui","bootstrap",
                            "css!plugins/adminLte/css/AdminLTE","css!plugins/adminLte/css/skins/skin-blue",
                            "css!plugins/font-awesome/css/font-awesome.min","css!plugins/ionicons/css/ionicons"]},
        backbone : {deps : ['underscore', 'jquery']},
        //w2ui : {deps : ['css!plugins/w2ui/w2ui-1.5.rc1.min']},
        jqgrid : {deps : ['jquery',"jqueryui"]},
        jqgrid_locale : {deps : ['jquery']},
        stomp : {exports : 'Stomp'},
        gridster : {deps : ['jquery','css!plugins/gridster/jquery.gridster.min','css!plugins/gridster/dashboard']},
        widget :  {deps : ['css!js/lib/widget/widget', 'dashJs']},
        loading : {deps : ['jquery',
                           'css!plugins/loading/jquery.loadingModal']},
        mapEditor : {deps : ['jquery',
            'css!js/lib/map/MapEditor',
            'w2ui',
            'loading', 'd3']},
        yescoreui : {deps : ['jquery',
                             'css!plugins/jQueryUI/jquery-ui.min',
                             'css!js/lib/ui/YescoreUI',
                             'jqueryui',
                             'jquery-valid',
                             'jquery-datetimepicker',
                             'twbs-pagination',
                             'w2ui',
                             'loading']},
        'fusioncharts': {deps:['jquery']},
        'fusiontheme': {deps:['fusioncharts']},
        'fusioncharts-jquery': {deps:['fusioncharts']},
        chart : {deps : ['fusiontheme', 'fusioncharts-jquery']},
        "twbs-pagination" : {deps : ['jquery'], exports: 'jQuery.fn.chosen'},
        echart : {exports : 'echarts'},
        echartWrapper : {deps : ['echart']},
        "jquery-i18next" : {deps : ['jquery']},
        // Fixed by Gihwan For SonarQube. 2018-07-09
        //"jquery-datetimepicker" : {deps : ['jquery-mousewheel', 'css!plugins/jquery-datetimepicker/jquery.datetimepicker.min']},
        "jstreetable" : {deps: ['jstree', 'css!plugins/jstree/themes/default/style.min.css']},
        "bootstrap_toggle" : {deps : ["css!plugins/bootstrap/css/bootstrap-toggle.min"]},
        "bootstrap_slider" : {deps : ["css!plugins/bootstrap/css/bootstrap-slider.min"]},
        "jquery-datetimepicker" : {deps : ['jquery-mousewheel', 'css!plugins/jquery-datetimepicker/jquery.datetimepicker.min']},
        "w2ui" : {deps : ['css!plugins/w2ui/idc-w2ui-dark','css!plugins/w2ui/custom-idc-w2ui-dark','jqueryNumAni']},
        "obj-loader" : {deps : ['babylon','cannon','hand','oimo']},
        "bjs" : {deps : ['obj-loader']},
        idc : {deps : ['obj-loader']},
        rackEditor : {deps : ['obj-loader']},
        editControl : {deps : ['babylon']},
        "jqueryNumAni" :  {deps : ['jquery']},
        "fontawesome-all" : {deps : ['css!plugins/font-awesome/css/fa-svg-with-js', "css!plugins/font-awesome/css/font-awesome.min"]}
    },
    map: {
        '*': {
            'css': 'plugins/requirejs/css.min', // or whatever the path to require-css is
        },
    	
    }
});
