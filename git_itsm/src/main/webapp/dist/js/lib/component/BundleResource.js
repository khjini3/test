define([
   "jquery",
   "underscore",
   "backbone",
   "i18next",
   "jquery-i18next",
   "i18nextXHRBackend"
], function(
	$,
	_,
	Backbone,
	i18next,
	jqueryI18next,
	XHR
){
	
	var BundleResource = Backbone.View.extend({
		initialize : function(){
			var lang = null;
			lang = sessionStorage.LOCALE;
        	this.lang = lang;
		},
			
		loadResource : function(){
			var dfd = new $.Deferred();
			var that = this;
			
			i18next.use(XHR);
			i18next.init({
				lng: this.lang,
		        debug: true,
		        useLocalStorage: false,
	            fallbackLng: false,
	            backend: {
	                loadPath: 'locales/{{lng}}/{{ns}}.json'
	            }
	        }, function() {
	            jqueryI18next.init(i18next, $,{
	            	 tName: 't', // --> appends $.t = i18next.t
	            	 i18nName: 'i18n', // --> appends $.i18n = i18next
	            	 handleName: 'localize', // --> appends $(selector).localize(opts);
	            	 selectorAttr: 'data-i18n', // selector for translating elements
	            	 targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
	            	 optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
	            	 useOptionsAttr: false, // see optionsAttr
	            	 parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
	            });
	            $('.wrapper').localize();
	        });
	        /*
			$.i18n.properties({
        		name : ["common-message","common-button","menu"],
        		path :  "properties/",
        		mode :"map",
        		language : this.lang,
        		callback : function(){
        			console.log("bundle load complete");
        			dfd.resolve();
        		},
        		error : function(){
        			dfd.reject();
        		}
        	});
			*/
			return dfd.promise();
		},
		
		getString : function(label){
			var str = i18next.t(label)
			return str;
		},
		
		getLocale : function (){
			//구현 필요.
			//쿠키를 이용할 것인지 아니면 SET을 사용할 것인지.
			//우선은 setLocale()을 사용하도록 한다.
			
			return this.lang;
		},
		
		setLocale : function (locale){
			this.lang = locale;
			/*
			if(this.lang == "ko"){
				this.lang = "en";
			}else{
				this.lang = "ko";
			}
			*/
			i18next.changeLanguage(this.lang, function() {
		           $('.wrapper').localize();
		        });
		}
	});
	
	return new BundleResource();
})