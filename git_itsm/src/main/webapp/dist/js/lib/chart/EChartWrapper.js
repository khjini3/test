define([
    "jquery",
    "underscore",
    "echart",
    "ecStat"
],function(
    $,
    _,
    echarts,
    ecStats
){

function Wrapper() {
	//console.log(ecStats);
    var COLOERS_LINE = [
        'rgb(0,153,203)','rgb(252,177,80)','rgb(230,76,101)','rgb(79,196,246)',
        'rgb(255,68,69)','rgb(125,175,0)','rgb(239,211,85)','rgb(48,141,244)',
        'rgb(230,87,172)','rgb(93,159,246)','rgb(213,143,11)','rgb(82,215,38)',
        'rgb(45,203,117)','rgb(38,215,174)','rgb(124,221,221)','rgb(95,183,212)',
        'rgb(151,217,255)'
    ];

    var COLOERS_BAR = [
        'rgb(255,68,69)','rgb(125,175,0)','rgb(239,211,85)','rgb(48,141,244)',
        'rgb(0,153,203)','rgb(252,177,80)','rgb(230,76,101)','rgb(79,196,246)',
        'rgb(230,87,172)','rgb(93,159,246)','rgb(213,143,11)','rgb(82,215,38)',
        'rgb(45,203,117)','rgb(38,215,174)','rgb(124,221,221)','rgb(95,183,212)',
        'rgb(151,217,255)'
    ];

    var COLOERS_PIE = [
        'rgb(230,87,172)','rgb(93,159,246)','rgb(213,143,11)','rgb(82,215,38)',
        'rgb(0,153,203)','rgb(252,177,80)','rgb(230,76,101)','rgb(79,196,246)',
        'rgb(255,68,69)','rgb(125,175,0)','rgb(239,211,85)','rgb(48,141,244)',
        'rgb(45,203,117)','rgb(38,215,174)','rgb(124,221,221)','rgb(95,183,212)',
        'rgb(151,217,255)'
    ];

    var COLOERS_DONUT = [
        'rgb(151,217,255)','rgb(252,177,80)','rgb(45,203,117)','rgb(95,183,212)','rgb(124,221,221)','rgb(38,215,174)',
        'rgb(0,153,203)','rgb(252,177,80)','rgb(230,76,101)','rgb(79,196,246)',
        'rgb(255,68,69)','rgb(125,175,0)','rgb(239,211,85)','rgb(48,141,244)',
        'rgb(230,87,172)','rgb(93,159,246)','rgb(213,143,11)','rgb(82,215,38)',
        
    ];

    $.widget("echart.realtime", {
        options: {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
                backgroundColor : 'rgba(255,255,255,.05)',
                show : true
            },
            legend: {
                y: 'top',
                icon : "circle",
                padding: 20,
                data: [],
                textStyle: {
                    color: '#fff',
                    fontSize: 10
                }
            },
            color: COLOERS_LINE,
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: {
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            series: [],
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            
        }
    });
    
    $.extend( $.echart.realtime.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            var len = this.options.dataLength || 10;
            var count = this.options.count || 1;
            var name = this.options.name || [];
            var type = this.options.type || 'line';
            var area = this.options.area;
            this.options.series = [];
            
            areaOption = area ? {normal: {}} : '';

            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    areaStyle: areaOption,
                    data: [],
                    smooth: true
                });
                this.options.legend.data.push(name[i]);
            }
            
            if(type != 'line') this.options.xAxis.boundaryGap = true;
            
            if(len != undefined) {
                var temp = function(len) {
                    var array = [];
                    while(len > 0) {
                        array.push('');
                        len--;
                    }
                    return array;
                };
                
                this.options.xAxis.data = temp(len);
                this.options.series.forEach(function(val) {
                    val.data = temp(len);
                });
            }
            
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(dataObjArr) {
            var series = this.options.series; 
            series.forEach(function(val, idx) {
                val.data.push(dataObjArr[idx].value);
                val.data.shift();
            });
            this.options.xAxis.data.shift();
            this.options.xAxis.data.push(dataObjArr[0].label);
            this.chart.setOption({
                xAxis: this.options.xAxis,
                series: this.options.series
            });
        },
        
    });
    
        $.widget("echart.multi", {
            options: {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                color: ['#ff4b4c', '#86b600', '#f1d75d', '#3d98f0' ],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
    		        backgroundColor : 'rgba(255,255,255,.05)',
    		        show : true
                },
                legend: {
                	padding: 20,
                    data:[],
     		        textStyle : {
     		        	color : "#fff"
     		        },
     		        icon : "circle"
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLabel : {
     		        	textStyle : {color : "#fff"}
    				}
                },
                yAxis: {
                    axisLabel : {
     		        	textStyle : {color : "#fff"}
    				}
                },
                series: []
            },
            
            el: {
                _id : null,
                _class : null,
            },
            _create: function() {
                this.init();
            },
            _destroy: function() {
                $(this.element).empty();
            }
        });

        $.extend( $.echart.multi.prototype, {
            init : function() {
                this.el._id = this.element.attr("id");
                this.el._class = this.element.attr("class");
                var name = this.options.name || [];
                var type = this.options.type;
                var types = this.options.types || [];
                var threshold = this.options.threshold;
                var mark = this.options.mark;
                var count = this.options.count || 1;
                
                this.options.series = [];
                
                for(var i = 0; i<count; i++) {
                    this.options.series.push({
                        name: name[i] || '',
                        type: type || types[i] || 'line',
                        data: [],
                    });
                    if(name.length !=0) this.options.legend.data = name;
                }
                if(threshold != undefined) {
                	var startpoint = 0;
                	var endpoint = 100;
                	if(!mark) {
                		startpoint = threshold;
                		endpoint = threshold;
                	} else {
                		this.options.yAxis.max = 100;
                	}
                	
                	var markLineOpt = {
                        animation: false,
                        lineStyle: {
                            normal: {
                                type: 'solid'
                            }
                        },
                        data: [[{
                            coord: [0, startpoint],
                            symbol: 'none'
                        }, {
                            coord: [10, endpoint],
                            symbol: 'none'
                        }]]
                    };
                	
                    this.options.series[0].markLine = markLineOpt;
                    if(mark) {
                		this.options.series[0].markLine.lineStyle.normal.color = '#000'
                	}
                }
                if(type != 'line') this.options.xAxis.boundaryGap = true;
                this.render(this.options);
            },
            render : function(options) {
            	if(this.chart){
            		this.chart.clear();
            	}
                this.chart = echarts.init($(this.element)[0]);
                this.chart.setOption(this.options);
            },
            resize : function() {
                this.chart.resize();
            },
            update : function(data) {
                this.options.xAxis.data = data.label; //gihwan simple line
                var mark = this.options.series[0].markLine;
                if(mark != undefined) {
                	mark.data[0][1].coord[0] = data.value[0].length -1
                }
                
                this.options.series = [];
                this.options.legend.data = [];
                this.options.name = [];
                var count = data.value.length;
            	
                for(var i = 0; i < count; i++){
                	this.options.series.push({
                		name : data.name[i],
                		type : data.type,
                		data : data.value[i]
                	});
                	
                }
                this.options.legend.data = data.name;
                this.options.name = data.name;
                this.render(this.options);
            },
        });
    
    $.widget("echart.line", {
        options: {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            color: COLOERS_LINE,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            }],
            yAxis: {
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            series: [],
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.line.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            this.el._name = this.el._id + 'line'
            var len = this.options.dataLength;
            var count = this.options.count || 1;
            this.options.series = [];

            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: '',
                    type: 'line',
                    data: []
                });
            }
            
            if(len != undefined) {
                var temp = function(len) {
                    var array = [];
                    while(len > 0) {
                        array.push('');
                        len--;
                    }
                    return array;
                };
                this.options.xAxis[0].data = temp(10);
                this.options.series.forEach(function(val) {
                    val.data = temp(10);
                });
            }
            
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(dataObjArr) {
            var series = this.options.series; 
            series.forEach(function(val, idx) {
                val.data.push(dataObjArr[idx].value);
                val.data.shift();
            });
            this.options.xAxis[0].data.shift();
            this.options.xAxis[0].data.push(dataObjArr[0].label);
            this.chart.setOption({
                xAxis: this.options.xAxis,
                series: this.options.series
            });
        },
        
    });

    $.widget("echart.bar", {
        options: {
            title: {
                text: ''
            },
		    grid: {
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
		    },
            tooltip: {},
            legend: {
                data:[],
                textStyle : {color : "#fff"}
            },
            color: COLOERS_BAR,
            xAxis: {
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: {
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            series: []
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.bar.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            this.el._name = this.el._id + 'bar'
            
            var count = this.options.count || 1;
            
            this.options.series = [];
            
            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: '',
                    type: 'bar',
                    data: []
                });
            }
            
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            this.options.xAxis.data = data.xAxis;
            //this.options.series[0].data = data.series;
            this.options.series.forEach(function(val, idx) {
                    val.data = data.series[idx];
            });
            
            this.chart.setOption({
                xAxis: this.options.xAxis,
                series: this.options.series
            });
        },
        
    });

    $.widget("echart.dbbar", {
        options: {
            title: {
                text: ''
            },
            tooltip: {},
            legend: {
                data:[],
 		        textStyle : {
 		        	color : "#fff"
 		        },
 		        icon : "circle"
            },
		    grid: {
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
		    },
            color: COLOERS_BAR,
            xAxis: {
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: {
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            series: []
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });
    
    $.extend( $.echart.dbbar.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            this.el._name = this.el._id + 'bar'
            
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            this.options.xAxis.data = data.xAxis;
            //this.options.series[0].data = data.series;
            this.options.series.forEach(function(val, idx) {
                    val.data = data.series[idx];
            });
            
            this.chart.setOption({
                xAxis: this.options.xAxis,
                series: this.options.series
            });
        },
        
    });
    
    $.widget("echart.pie", {
        	options: {
        		
        		legend: {
        			/*padding: 5,
        			x : 'center',
        	        y : 'bottom',*/
        			orient: 'vertical',
        			left: 'left',
        			textStyle : {color : "#fff"},
        	        data:[]
        	    },
        	    
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/> {c} ({d}%)"
                },
        		series : [
			        {
			            name: '',
			            type: 'pie',
			            radius: '80%', 
			            //rose type
			            //radius : ['35%', '80%'],
			            //center : ['50%', '45%'],
			            //roseType : 'radius',
			            label: {
			                normal: {
			                    show: false
			                }
			            },
			            data: [{value:0, name:''}]
			        }
			    ],
                color: COLOERS_DONUT,
			},
			
			el: {
				_id : null,
				_class : null,
			},
			_create: function() {
				this.init();
			},
			_destroy: function() {
				
			}
		});
		
		$.extend( $.echart.pie.prototype, {
			init : function() {
				var _this = this;
				this.el._id = this.element.attr("id");
				this.el._class = this.element.attr("class");
				this.el._name = this.el._id + 'pie'
				var data = this.options.data;
				var count = this.options.count || 1;
				
				if(data != undefined) {
					this.options.series[0].data = data;
//					this.options.data = undefined;
					
					data.forEach(function(val) {
						_this.options.legend.data.push(val.name);
					});
					
				}
				this.render(this.options);
			},
			render : function(options) {
				this.chart = echarts.init($(this.element)[0]);
				this.chart.setOption(this.options);
			},
			resize : function() {
                this.chart.resize();
            },  
			update : function(data) {
				var _this = this;
				this.options.series[0].data = data;
				data.forEach(function(val) {
					_this.options.legend.data.push(val.name);
				});
				
				this.chart.setOption({
	                series: this.options.series
				});
			},
			
		});

    $.widget("echart.donut", {
        options: {
             tooltip: {
                trigger: 'item',
                formatter: "{b}<br/> {c} ({d}%)"
            },
            color: COLOERS_DONUT,
            legend: {
                y: 'bottom',
                data: [],
                textStyle: {
                    color: '#fff',
                    fontSize: 10
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    legendHoverLink:false,
                    radius : ['50%', '80%'],
                    label: {
                         normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                       
                    },
                    data: []
                }
            ]
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.donut.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            this.el._name = this.el._id + 'donut'
            var data = this.options.data;
            if(data != undefined) {
                this.options.series[0].data = data;
                this.options.data = undefined;
            }
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            this.options.series[0].data = data;
            
            this.chart.setOption({
                series: this.options.series
            });
        },
        
    });
    
    
    /**
     * treeMap
     */
    $.widget("echart.treemap", {
        options: {
        	title: {
	            text: '',
	            left: 'center'
	        },
	        tooltip: {},
            series : [
                {
                	name:'',
	                type:'treemap',
	                visibleMin: 300,
	                leafDepth: 1,
	                width:'80%',
	                height:'80%',
	                
	                label: {
	                    show: true,
	                    formatter: '{b}'
	                },
	                itemStyle: {
	                    normal: {
	                        borderColor: '#fff'
	                    }
	                },
	                data: null
                },
            ]
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.treemap.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            this.el._name = this.el._id + 'treemap'
            var data = [{}];
            if(data != undefined) {
                this.options.series[0].data = data;
                this.options.data = undefined;
            }
            var name = this.options.name;
            if(name != undefined) {
            	this.options.series[0].name = name;
            }
            
            this.options.tooltip = {
	            formatter: function (info) {
	                var value = info.value;
	                var treePathInfo = info.treePathInfo;
	                var treePath = [];

	                for (var i = 1; i < treePathInfo.length; i++) {
	                    treePath.push(treePathInfo[i].name);
	                }

	                return [
	                    '<div class="tooltip-title">' + echarts.format.encodeHTML(treePath.join('/')) + '</div>',
	                    name +': ' + echarts.format.addCommas(value) + ' KB',
	                ].join('');
	            }
	        }
            
            this.options.series[0].levels = this.getLevelOption();
            
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            this.options.series[0].data = data;
            
            this.chart.setOption({
                series: this.options.series
            });
        },
        
        getLevelOption : function () {
            return [
                {
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            gapWidth: 5
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            gapWidth: 1
                        }
                    }
                },
                {
                    colorSaturation: [0.35, 0.5],
                    itemStyle: {
                        normal: {
                            gapWidth: 1,
                            borderColorSaturation: 0.6
                        }
                    }
                }
            ];
        }
        
    });
	$.widget("echart.stacked", {
    	options: {
   			title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            color: ['#ff4b4c', '#86b600', '#f1d75d', '#3d98f0' ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            legend: {
            	padding: 20,
            	data: [],
            	textStyle : {
            		color : "#fff"
            	},
            	icon : "circle"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: [
                {
                    type : 'value',
                    axisLabel : {
     		        	textStyle : {color : "#fff"}
    				}
                }
            ],
            series: [],
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.stacked.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_statck'
			var name = this.options.name || [];
            var type = this.options.type || 'line';
			var count = this.options.count || 1;
			var area = this.options.area;
			this.options.series = [];
			
			var areaOption = area ? {normal: {opacity : 0.3}} : '';
			
			for(var i = 0; i<count; i++) {
				this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    data: [],
                    stack: ' ',
                    areaStyle: areaOption,
                    smooth: true
                });
			}
			if(type != 'line') this.options.xAxis.boundaryGap = true;
			if(name.length !=0) this.options.legend.data = name;
			this.render(this.options);
		},
		render : function(options) {
			if(this.chart){
				this.chart.clear();
			}
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		update : function(data) {
			var area = this.options.area;
			this.chart.data = data.label;
			
			this.options.series = [];
            this.options.legend.data = [];
            this.options.name = [];
            var areaOption = area ? {normal: {opacity : 0.3}} : '';
            var count = data.value.length;
        	
            for(var i = 0; i < count; i++){
            	this.options.series.push({
            		name : data.name[i],
            		type : data.type || 'line',
            		data : data.value[i],
            		stack: ' ',
            		areaStyle: areaOption,
                    smooth: true
            	});
            	
            }
            this.options.legend.data = data.name;
            this.options.name = data.name;
            this.render(this.options);
            
			/*this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});*/
			
			/*this.chart.setOption({
				xAxis: this.options.xAxis,
                series: this.options.series
			});*/
			
		},
		resize : function() {
            this.chart.resize();
        },
	});
	
	$.widget("echart.stepline", {
    	options: {
   			title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: [
                {
                    type : 'value',
                    axisLabel : {
     		        	textStyle : {color : "#fff"}
    				}
                }
            ],
            series: [],
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.stepline.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_step'
			var name = this.options.name || [];
            var type = 'line';
			var count = this.options.count || 1;
			var step = this.options.step || 'middle';
			this.options.series = [];
			
			for(var i = 0; i<count; i++) {
				this.options.series.push({
                    name: name[i] || i+1,
                    type: type,
                    data: [],
                    step: step
                });
			}
			
			this.render(this.options);
		},
		render : function(options) {
			this[this.el._name] = echarts.init($(this.element)[0]);
			this[this.el._name].setOption(this.options);
		},
		update : function(data) {
			this.options.xAxis.data = data.label;
			
			this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});
			
			this[this.el._name].setOption({
				xAxis: this.options.xAxis,
                series: this.options.series
			});
		},
		
	});
	$.widget("echart.anibar", {
    	options: {
   			title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            xAxis: {
                data: [],
                silent: false,
                splitLine: {
                    show: false
                },
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: {
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            series: [],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function () {
                return 100;
            }
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.anibar.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_anibar'
			var name = this.options.name || [];
            var type = 'bar';
			var count = this.options.count || 1;
			this.options.series = [];
			
			for(var i = 0; i<count; i++) {
				var idx = i;
				console.log(idx);
				this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    data: [],
                });
				this.options.series[i].animationDelay = function(idx) {
                    return idx * 50;
                }
			}
			
			this.render(this.options);
		},
		render : function(options) {
			this[this.el._name] = echarts.init($(this.element)[0]);
			this[this.el._name].setOption(this.options);
		},
		update : function(data) {
			this.options.xAxis.data = data.label;
			
			this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});
			
			this.render(this.options);
		},
		resize : function() {
            this.chart.resize();
        },
	});
	$.widget("echart.hbar", {
    	options: {
   			title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            color: ['#ff4b4c', '#86b600', '#f1d75d', '#3d98f0' ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            legend: {
            	padding: 20,
                data:[],
 		        textStyle : {
 		        	color : "#fff"
 		        },
 		        icon : "circle"
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: {
                type: 'category',
                data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            series: [],
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.hbar.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_bar'
			var name = this.options.name || [];
            var type = 'bar';
			var count = this.options.count || 1;
			var stack = this.options.stack ? ' ' : '';
			
			this.options.series = [];
			
			for(var i = 0; i<count; i++) {
				this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    stack: stack,
                    data: [],
                });
			}
			
			this.render(this.options);
		},
		render : function(options) {
			if(this.chart){
				this.chart.clear();
			}
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		update : function(data) {
			var stack = this.options.stack ? ' ' : '';
			this.options.yAxis.data = data.label;
			/*this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});*/
			/*
			this[this.el._name].setOption({
				yAxis: this.options.yAxis,
                series: this.options.series
			});
			*/
			this.options.series = [];
            this.options.legend.data = [];
            this.options.name = [];
            var count = data.value.length;
        	
            for(var i = 0; i < count; i++){
            	this.options.series.push({
            		 name: data.name[i],
                     type: data.type,
                     stack: stack,
                     data: data.value[i],
            	});
            	
            }
			this.options.legend.data = data.name;
            this.options.name = data.name;
			this.render(this.options);
		},
		resize : function() {
            this.chart.resize();
        },
	});
	
	$.widget("echart.histogram", {
    	options: {
   			title: {
                text: ''
            },
            color: ['rgb(25, 183, 207)'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            xAxis: [{
                type: 'value',
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            }],
            yAxis: [{
                type: 'value',
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            }],
            series: [],
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.histogram.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_bar'
			var name = this.options.name || '';
			
			this.options.series = [{
		        name: name,
		        type: 'custom',
		        label: {
		            normal: {
		                show: true,
		                position: 'insideTop'
		            }
		        },
		        renderItem: function renderItem(params, api) {
				    var yValue = api.value(2);
				    var start = api.coord([api.value(0), yValue]);
				    var size = api.size([api.value(1) - api.value(0), yValue]);
				    var style = api.style();

				    return {
				        type: 'rect',
				        shape: {
				            x: start[0] ,
				            y: start[1],
				            width: size[0] ,
				            height: size[1]
				        },
				        style: style
				    };
				},
		        data: []
		    }]			
			
			this.render(this.options);
		},
		render : function(options) {
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		update : function(data) {
			var bins = ecStats.histogram(data.value);
			var interval;
			var min = Infinity;
			var max = -Infinity;
			var data = echarts.util.map(bins.data, function (item, index) {
			    var x0 = bins.bins[index].x0;
			    var x1 = bins.bins[index].x1;
			    interval = x1 - x0;
			    min = Math.min(min, x0);
			    max = Math.max(max, x1);
			    return [x0, x1, item[1]];
			});
			this.options.xAxis[0].min = min;
			this.options.xAxis[0].max = max;
			this.options.xAxis[0].interval = interval; 
			this.options.xAxis[0].encode = {
	            x: [0, 1],
	            y: 2,
	            tooltip: 2,
	            label: 2
	        }
			this.options.series[0].data = data;
			
			this.render(this.options);
		},
		resize : function() {
            this.chart.resize();
        },
	});
	
	$.widget("echart.beijingaqi", {
    	options: {
   			title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
            	boundaryGap: false,
            	data: [],
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            yAxis: {
            	splitLine: {
                    show: false
                },
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            },
            grid: {
                left: '10',
                right: '130',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            visualMap: {
                top: '20%',
                right: '30',
                textStyle : {color : "#fff"},
                pieces: [{
                    gt: 0,
                    lte: 50,
                    color: '#294b9b'
                }, {
                    gt: 50,
                    lte: 100,
                    color: '#3b7b63'
                }, {
                    gt: 100,
                    lte: 150,
                    color: '#97cc34'
                }, {
                    gt: 150,
                    lte: 200,
                    color: '#51cace'
                }, {
                    gt: 200,
                    lte: 300,
                    color: '#616bb2'
                }, {
                    gt: 300,
                    color: '#7954b3'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            series: [],
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.beijingaqi.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_beijingaqi'
			var name = this.options.name || [];
            var type = this.options.type || 'line';
			var count = this.options.count || 1;
			var colors = this.options.colors || [];
			if(colors.length != 0){
				this.options.visualMap.pieces.forEach(function(val, idx){
					val.color = colors[idx];	
				});
			}
			
			this.options.series = [];
			
			for(var i = 0; i<count; i++) {
				this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    data: []
                });
			}
			if(type != 'line') this.options.xAxis.boundaryGap = true;
			this.render(this.options);
		},
		render : function(options) {
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		update : function(data) {
			this.options.xAxis.data = data.label;
			
			this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});
			this.render(this.options);
		},
		resize : function() {
            this.chart.resize();
        },
	});
	$.widget("echart.multiplexaxis", {
    	options: {
   			title: {
                text: ''
            },
            tooltip: {
            	trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
		    grid: {
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
		    },
            xAxis: [{
                axisLabel : {
 		        	textStyle : {color : "#fff"}
				}
            }            	
            ],
            yAxis: [{
                     type: 'value',
                     axisLabel : {
      		        	textStyle : {color : "#fff"}
     				}
                 }
            ],
            series: [],
            legend:{
            	data:[]
            },
            color: COLOERS_LINE
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.multiplexaxis.prototype, {
		init : function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_multiplexaxis'
			var name = this.options.name || [];
            var type = this.options.type || 'line';
			var count = this.options.count || 1;
			var colors = this.options.color || COLOERS_LINE;
			this.options.series = [];
			this.options.xAxis = [];
			for(var i = 0; i<count; i++) {
				this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    data: [],
                    smooth: true,
                    xAxisIndex: i
                });
				
				this.options.xAxis.push({
                    type: 'category',
                    data: [],
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[i]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    }, 
                });
				this.options.legend.data.push(name[i]);
			}
			
			this.render(this.options);
		},
		render : function(options) {
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		update : function(data) {
			this.options.xAxis.forEach(function(val, idx) {
				 val.data = data.label[idx];
			});
			
			this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});
			
			this.render(this.options);
		},
		resize : function() {
            this.chart.resize();
        },
	});
	$.widget("echart.funnel", {
    	options: {
    		title:{
    			text:''
    		},
    		/*legend: {
    	        data:[]
    	    },*/
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}%"
            },
            calculable: true,
    		series : [
		        {
		            name: '',
		            type: 'funnel',
		            left: '10%',
		            top: 50,
		            bottom: 30,
		            width: '80%',
		            min: 0,
		            max: 100,
		            minSize: '0%',
		            maxSize: '100%',
		            sort: 'descending',
		            gap: 1,
		            label: {
		                normal: {
		                    show: false,
		                    position: 'inside'
		                },
		                emphasis: {
		                    textStyle: {
		                        fontSize: 20
		                    },
		                    show: false
		                }
		            },
		            labelLine: {
		                normal: {
		                    length: 10,
		                    lineStyle: {
		                        width: 1,
		                        type: 'solid'
		                    }
		                }
		            },
		            itemStyle: {
		                normal: {
		                    borderColor: '#fff',
		                    borderWidth: 1
		                }
		            },
		            data: [{value:0, name:''}]
		        }
		    ],
            color: COLOERS_BAR,
		},
		
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.funnel.prototype, {
		init : function() {
			var _this = this;
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_funnel'
			var data = this.options.data;
			if(data != undefined) {
				this.options.series[0].data = data;
				this.options.data = undefined;
				/*data.forEach(function(val) {
					_this.options.legend.data.push(val.name);
				});*/
			}
			this.render(this.options);
		},
		render : function(options) {
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		resize : function() {
            this.chart.resize();
        },  
		update : function(data) {
			var _this = this;
			this.options.series[0].data = data;
			/*data.forEach(function(val) {
				_this.options.legend.data.push(val.name);
			});*/
			this.render(this.options);
			
		},
		resize : function() {
            this.chart.resize();
        },
	});
	
	$.widget("echart.gauge", {
    	options: {
    		title:{
    			text:''
    		},
    		series : [
		        {
		            name: '',
		            type: 'gauge',
		            top: 20,
		            radius: '90%',
		            detail: {
		            	formatter:'{value}%',
		            	offsetCenter:[0,'70%'],
		            	textStyle: {
		            		fontSize: 15
		            	}
		            },
		            axisLine :{
		            	lineStyle :{
				        	width: 20,
				        	color: [[0.2, COLOERS_DONUT[3]], [0.7, COLOERS_DONUT[1]], [1, COLOERS_DONUT[2]]],
				        } 
				    },
		            data: [{value:0, name: ''}],
		            splitLine :{
		                show: true,
		                length: 20
		            },
		            title: {
		                 offsetCenter:[0,'40%'],
		                 show: false,
		                 text:'',
		                 textStyle: {
			            	fontSize: 16,
			            	color: '#5793f3'
			            }
		            }, 
		        }
		     ],
		    
    	},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			
		}
	});
	
	$.extend( $.echart.gauge.prototype, {
		init : function() {
			var _this = this;
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			this.el._name = this.el._id + '_gauge'
			var colors = this.options.colors;
			this.options.series[0].axisLine.lineStyle.color = colors;

			var data = this.options.data;
			if(data != undefined) {
				this.options.series[0].data = data;
				this.options.data = undefined;
			}
			this.render(this.options);
		},
		render : function(options) {
			this.chart = echarts.init($(this.element)[0]);
			this.chart.setOption(this.options);
		},
		resize : function() {
            this.chart.resize();
        },  
		update : function(data) {
			var _this = this;
			this.options.series[0].data = data;
			this.render(this.options);
			
		},
		
	});

	$.widget("echart.lineArea", {
	    options: {
	        title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	        	 trigger: 'axis',
	        	 textStyle: {
			        	fontSize: 8,
			        	color : "#fff"
			        }
	        },
	        legend: {
	            data:[],
	            icon : "circle",
 		        textStyle : {
 		        	color : "#fff"
 		        }
	        },
	        grid: {
				bottom: '3%',
				left: '3%',
				right: '4%',
				containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
	        },
	        color: COLOERS_BAR,
	        xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: [],
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
 		        }
	        },
	        yAxis: {
		        type: 'value',
		        boundaryGap: [0, '100%'],
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
 		        }
	        },
	        series: []
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.lineArea.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var count = this.options.count || 1;
	        var colors = this.options.colors || [['#ff4746', '#ffe27f', '#ff8585']];
	        
	        this.options.series = [];
            
            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: name[i] || '',
                    type:'line',
	                smooth:true,
	                symbol: 'none',
	                sampling: 'average',
	                itemStyle: {
	                    normal: {
	                        color: colors[i][0]
	                    }
	                },
	                areaStyle: {
	                    normal: {
	                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                            offset: 0,
	                            color: colors[i][1]
	                        }, {
	                            offset: 1,
	                            color: colors[i][2]
	                        }])
	                    }
	                },
	                data: []
                });
                if(name.length !=0) this.options.legend.data = name;
            }
	        
	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.xAxis.data = data.label;
	        /*
	        for(var i = 0; i < data.value.length; i++) {
	        	if(data.value[i].name != undefined || data.value[i].name != null)
	        		this.options.series.name = data.value[i].name;
	        	if(data.value[i].data != undefined || data.value[i].data != null)
	        		this.options.series.data = data.value[i].data;
	        }
	        */
	        this.options.series.forEach(function(val, idx) {
                val.data = data.value[idx];
            });
	        this.render(this.options);
	    },
	    
	});	

	$.widget("echart.lineTemperature", {
	    options: {
	        title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	        	 trigger: 'axis',
	        	 textStyle: {
			        	fontSize: 8
			        }
	        },
	        legend: {
	            data:[]
	        },
	        grid: {
	        	top: '25%',
				bottom: '3%',
				left: '3%',
				right: '13%',
				containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
	        },
	        color: ['#ff5332', '#7daf00'],
	        xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: [],
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
	        },
	        yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} °C',
		            textStyle : {color : "#fff"}
		        }
	        },
	        series: [
		        {
		            name:'',
		            type:'line',
		            data:[],
		            markPoint: {
		                data: []
		            },
                    axisPointer: {
                        type: 'cross'
                    },
		            markLine: {
		                data: []
		            }
		        },
		        {
		            name:'',
		            type:'line',
		            data:[],
		            markPoint: {
		                data: []
		            },
                    axisPointer: {
                        type: 'cross'
                    },
		            markLine: {
		                data: []
		            }
		        }
		    ]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.lineTemperature.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var series = this.options.series || [];
	        var count = this.options.count || 1;
	        this.options.series = [];
	        
	        for(var i = 0; i<count; i++) {
	            this.options.series.push({
	                name: name[i] || '',
	                type: type || types[i] || 'line',
	                data: []
	            });
	            if(name.length !=0) this.options.legend.data = name;
	        }
	        
//	        var setLegend = {
//	        	data:['최고온도','최저온도'],
//	    	    x: 'center'         		
//	        };
//	        this.options.legend = setLegend;      
	        
	        if(series != undefined) {
	        	var setSeries = [
			        {
			            name:'최고온도',
			            type:'line',
			            data:[],
			            markPoint: {
			                data: [
			                    {type: 'max', name: '최고'},
			                    {type: 'min', name: '최저'}
			                ]
			            },
	                    axisPointer: {
	                        type: 'cross'
	                    },
			            markLine: {
			                data: [
			                    {type: 'average', name: '평균'}
			                ]
			            }
			        },
			        {
			            name:'최저온도',
			            type:'line',
			            data:[],
			            markPoint: {
			                data: [
			                    {name: '낮은주', value: -2, xAxis: 1, yAxis: -1.5}
			                ]
			            },
	                    axisPointer: {
	                        type: 'cross'
	                    },
			            markLine: {
			                data: [
			                    {type: 'average', name: '평균'},
			                    [{
			                        symbol: 'none',
			                        x: '90%',
			                        yAxis: 'max'
			                    }, {
			                        symbol: 'circle',
			                        label: {
			                            normal: {
			                                position: 'start',
			                                formatter: '최고'
			                            }
			                        },
			                        type: 'max',
			                        name: '최고점'
			                    }]
			                ]
			            }
			        }
			    ];
	            this.options.series = setSeries;
	        }
	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.xAxis.data = data.label;
	        this.options.series.forEach(function(val, idx) {
	            val.data = data.value[idx];
	        });
	        this.render(this.options);
	    },
	});

	$.widget("echart.lineRainfall", {
	    options: {
	        grid: [
		        	{
		        	    left: '4%',
		        	    right: '4%',
		        	    top: '15%',
		        	    height: '35%',
					    containLabel: true,
        		        backgroundColor : 'rgba(255,255,255,.05)',
        		        show : true
		        	},
		        	{
		    	        left: '5%',
		    	        right: '4%',
		    	        top: '51%',
		    	        height: '35%',
		    	        containLabel: true,
        		        backgroundColor : 'rgba(255,255,255,.05)',
        		        show : true
		        	}
	        ],
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	            trigger: 'axis',
	   	 		textStyle: {
	        	    fontSize: 8
	   	 		},                
	            axisPointer: {
	                animation: false
	            }
	        },
	        legend: {
	            data:[]
	        },
	        color: COLOERS_BAR,
	        xAxis: [
			        {
			            type : 'category',
			            boundaryGap : false,
			            axisLine: {onZero: true},
			            data: [],
		 		        axisLabel : {
		 		        	textStyle : {color : "#fff"}
		                }
			        },
			        {
			            gridIndex: 1,
			            type : 'category',
			            boundaryGap : false,
			            axisLine: {onZero: true},
			            data: [],
			            position: 'top',
		 		        axisLabel : {
		 		        	textStyle : {color : "#fff"}
		                }
			        }
	        ],
	        yAxis: [
			        {
			            name : '',
			            type : 'value',
			            max : 500
			        },
			        {
			            gridIndex: 1,
			            name : '',
			            type : 'value',
			            inverse: true
			        }
	        ],
	        axisPointer: {
		            link: {xAxisIndex: 'all'}       		
		    },
	        series: [
        		{
    	            name:'',
    	            type:'line',
    	            symbolSize: 8,
    	            hoverAnimation: false,
    	            data: []
        		},
        		{
        			name:'',
     	            type:'line',
     	            xAxisIndex: 1,
     	            yAxisIndex: 1,
     	            symbolSize: 8,
     	            hoverAnimation: false,
     	            data: []
        		}
        	]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.lineRainfall.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;
	        
	        var setyAxis = [
		        {
		            name : name[0],
		            nameTextStyle : {
	 		        	color : "#fff"
	                },
		            type : 'value',
		            max : 500,
	 		        axisLabel : {
	 		        	textStyle : {color : "#fff"}
	                }
		        },
		        {
		            gridIndex: 1,
		            name : name[1],
		            nameTextStyle : {
	 		        	color : "#fff"
	                },
		            type : 'value',
		            inverse: true,
	 		        axisLabel : {
	 		        	textStyle : {color : "#fff"}
	                }
		        }
	        ];
	        this.options.yAxis = setyAxis;   

	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.xAxis.forEach(function(val, idx) {
	            val.data = data.label[idx];
	        });
	        
	        this.options.series.forEach(function(val, idx) {
				 val.data = data.value[idx];
			});

	        this.render(this.options);
	    },
	});    

	$.widget("echart.barGradient", {
	    options: {
	        grid: {
		    	top: '5%',
		    	bottom: '3%',
		    	left: '3%',
		    	right: '3%',
		    	containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
    	    },
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	       	 	trigger: 'axis',
	       	 	textStyle: {
		        	fontSize: 8
	       	 	}
	        },
	        legend: {
	            data:[]
	        },
	        color: COLOERS_BAR,
	        xAxis: {
	    	        data: [],
	    	        axisLabel: {
	    	            inside: false,
	    	            textStyle : {color : "#fff"}
	    	        },
	    	        axisTick: {
	    	            show: false
	    	        },
	    	        axisLine: {
	    	            show: false
	    	        },
	    	        z: 10
	        },
	        yAxis: {
    	        axisLine: {
    	            show: false
    	        },
    	        axisTick: {
    	            show: false
    	        },
    	        axisLabel: {
    	            textStyle : {color : "#fff"}
    	        },
	        },
	        series: [
    	        { 
    	            type: 'bar',
    	            itemStyle: {
    	                normal: {color: 'rgba(0,0,0,0.05)'}
    	            },
    	            barGap:'-100%',
    	            barCategoryGap:'40%',
    	            data: [],
    	            animation: false
    	        },
    	        {
    	            type: 'bar',
    	            itemStyle: {
    	                normal: {
    	                    color: new echarts.graphic.LinearGradient(
    	                        0, 0, 0, 1,
    	                        [
    	                            {offset: 0, color: '#bbdc8e'},
    	                            /*{offset: 0.5, color: '#90c642'},*/
    	                            {offset: 1, color: '#90c642'}
    	                        ]
    	                    )
    	                },
    	                emphasis: {
    	                    color: '#42c69f'/*new echarts.graphic.LinearGradient(
    	                        0, 0, 0, 1,
    	                        [
    	                            {offset: 0, color: '#048998'},
    	                            {offset: 0.7, color: '#3bb4c1'},
    	                            {offset: 1, color: '#f6f5f5'}
    	                        ]
    	                    )*/
    	                }
    	            },
    	            data: []
    	        }
        	]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.barGradient.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;

	        if(type != 'line') this.options.xAxis.boundaryGap = true;

	        var colors = this.options.colors || ['#bbdc8e', '#90c642', '#42c69f'];//bar gradient 1 2 , hover bar
	        this.options.series[1].itemStyle.normal.color = new echarts.graphic.LinearGradient( 0, 0, 0, 1,
                    [
                        {offset: 0, color: colors[0]},
                        /*{offset: 0.5, color: colors[1]},*/
                        {offset: 1, color: colors[1]}
                    ]);
	        this.options.series[1].itemStyle.emphasis.color = colors[2];
	        
	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.xAxis.data = data.label;

	        this.options.series.forEach(function(val, idx) {
	            val.data = data.value[idx];
	        });
	        this.render(this.options);
	    },
	});        

	$.widget("echart.barTicks", {
	    options: {
	    	grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
		        trigger: 'axis',
		        axisPointer : {  
		            type : 'shadow'
		        },
	           	textStyle: {
	           		fontSize: 8
	           	}	
	    	},
	        legend: {
	            data:[]
	        },
	        xAxis: {
	            type : 'category',
	            data : [],
	            axisTick: {
	                alignWithLabel: true
	            },
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
	    	},
	        yAxis: {
			    type: 'value',
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
		    },
	        series: []
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.barTicks.prototype, {
	    init : function() {
	        var _this = this;
	    	this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;
	        
	        this.options.series = [];
	        //this.options.color = ['#3398DB'];
	        for(var i=0; i<count; i++) {
	        	this.options.series.push({
	        		name: name[i] || '',
		            type:'bar',
		            data:[]	
		        })
	        }
	        
	        
	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.xAxis.data = data.label;
	        /*
	        for(var i = 0; i < this.options.series.length; i++) {
	        	if(data.value[i].name != undefined || data.value[i].name != null)
	        		this.options.series[i].name = data.value[i].name;
	        	if(data.value[i].data != undefined || data.value[i].data != null)
	        		this.options.series[i].data = data.value[i].data;
	        }
	        */
	        this.options.series.forEach(function(val, idx) {
                val.data = data.value[idx];
            });
	        
	        this.render(this.options);
	    },
	});    

	$.widget("echart.barMultipleYAxis", {
	    options: {
	        grid: {
			    left: '3%',
	        	right: '5%',
	        	top: '15%',
	        	bottom:'5%',
			    containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
	    	},
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        },
	       	 	textStyle: {
		        	fontSize: 8
	       	 	}	
	    	},
	        legend: {
	            data:[]
	        },
	        color: ['#e89722','#1ba997','#648225'],
	        xAxis: [{
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            data: [],
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
	    	}],
	        yAxis: [],
	        series: []
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.barMultipleYAxis.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;
	        var axisLabel = this.options.axisLabel || [];
	        
	        this.options.series = [];
	        this.options.yAxis = [];
	        
	        for(var i=0; i<count; i++) {
	        	var split = false;
	        	var pos = (function() {
	        		var result = 'right'; 
        			if(i==0) {
    	        		split = true;
    	        		result = 'left';
    	        	}
        			return result;
	        	})();
	        	var offset = (function() {
	        		var result;
	        		if(i>1) {
	        			result = 60;
		        	} else {
		        		result = 0;
		        	}
	        		return result;
	        	})();
	        	var label = axisLabel[i] || '';
	        	
	        	this.options.yAxis.push({
		            type: 'value',
		            name: name[i] || '',
		            splitLine: {
		            	show: split
		            },
		            position: pos,
		            offset: offset,
		            axisLine: {
		                lineStyle: {
		                    color: this.options.color[i]
		                }
		            },
		            axisLabel: {
		                formatter: '{value} '+ label
		            }
		        });
	        	this.options.series.push({
	        		name: name[i] || '',
	        		type: type || types[i] || 'bar',
	        		yAxisIndex: i,
	        		data: []
	        	});
	        }
	        
	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.xAxis[0].data = data.label;
	        
	        this.options.series.forEach(function(val, idx) {
                val.data = data.value[idx];
            });
	        this.render(this.options);
	    },
	});
	
	$.widget("echart.bubble", {
        options: {
            title: {
                text: ''
            },
            /*
            backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                offset: 0,
                color: '#f7f8fa'
            }, {
                offset: 1,
                color: '#cdd0d5'
            }]),
            */
            legend: {
                right: 10,
                data: [],
 		        textStyle : {
 		        	color : "#fff"
 		        }
            },
            xAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true,
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
            },
            series: []
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.bubble.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            var name = this.options.name || [];
            var threshold = this.options.threshold;
            var count = this.options.count || 1;
            var colors = this.options.colors || [['rgba(120, 36, 50, 0.5)', 'rgb(251, 118, 123)','rgb(204, 46, 72)'],
                                                 ['rgba(25, 100, 150, 0.5)', 'rgb(129, 227, 238)', 'rgb(25, 183, 207)']];
            this.options.series = [];
            
            
            
            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: name[i] || '',
                    type: 'scatter',
                    data: [],
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 20,
                            shadowColor: colors[i][0],
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.3, 0.4, 0.5, [{
                                offset: 0,
                                color: colors[i][1]
                            }, {
                                offset: 1,
                                color: colors[i][2]
                            }])
                        }
                    }
                });
                if(name.length !=0) this.options.legend.data = name;
            }
           
            this.render();
        },
        render : function() {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            this.options.xAxis.data = data.label || [];
            //this.options.series[0].data = data.series;
           
            this.options.series.forEach(function(val, idx) {
                val.data = data.value[idx];
            });
            
            this.render();
        },
    });
	
    $.widget("echart.linear", {
        options: {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
            },
            yAxis: {
                type: 'value',
                min: 1.5,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
            },
            series: []
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.linear.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            var name = this.options.name || [];
            var threshold = this.options.threshold;
            var count = this.options.count || 1;
            
            this.options.series = [];
            
            this.options.series = [{
                name: 'scatter',
                type: 'scatter',
                label: {
                    emphasis: {
                        show: true,
                        position: 'left',
                        textStyle: {
                            color: 'blue',
                            fontSize: 16
                        }
                    }
                },
                data: []
            }, {
                name: 'line',
                type: 'line',
                showSymbol: false,
                data: undefined,
                markPoint: {
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'left',
                            formatter: undefined,
                            textStyle: {
                                color: '#333',
                                fontSize: 14
                            }
                        }
                    },
                    data: []
                }
            }];
            
            this.render();
        },
        render : function() {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            this.options.xAxis.data = data.label || [];
            
            var myRegression = ecStats.regression('linear', data.value);
            myRegression.points.sort(function(a, b) {
                return a[0] - b[0];
            });
            
            this.options.series[0].data = data.value;
            this.options.series[1].data = myRegression.points;
            this.options.series[1].markPoint.label.normal.formatter = myRegression.expression;
            this.render();
        },
    });
	
	$.widget("echart.basicRadar", {
	    options: {
	    	title: {
	            text: ''
	        },
	        tooltip: {
	   	 		textStyle: {
	        	    fontSize: 8
	   	 		}
	        },
	        legend: {
	            data:[]
	        },
	        radar: {
            	radius: 70,
            	indicator: []
            },
	        series: [{
	            name: '',
	            type: 'radar',
	            data : []
	        }]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.basicRadar.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var count = this.options.count || 1;
	        
	        this.options.radar.indicator = [];
	        this.options.series[0].data = [];
	        
	        for(var i=0; i<count; i++) {
	        	this.options.series[0].data.push(
	        		{
	        			value: [],
	        			name: name[i] || ''
	        		}
	        	);
	        }
	        
	        
	        //this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        var _this = this;
	    	/*
	    	for(var i = 0; i < data.label.length; i++) {
	        	this.options.radar.indicator[i] = data.label[i];
	        }
	        */
	        var count = data.value.length;
	        
	    	
	    	data.label.forEach(function(val, idx) {
	    		var arr = [];
	    		
	    		for(var i=0; i<count; i++) {
	    			arr.push(data.value[i][idx]);
	    		}
	    		
	    		var maxVal = (function() {
	    			return Math.max.apply(null, arr)*1.2;
	    		})();
	    		
	    		
	        	var obj = {name: val, max: maxVal}
	        	_this.options.radar.indicator.push(obj);
	        })
	        /*
	        for(var i = 0; i < data.value.length; i++) {
	        	if(data.value[i].name != undefined || data.value[i].name != null)
	        		this.options.series[i].name = data.value[i].name;
	        	if(data.value[i].data != undefined || data.value[i].data != null)
	        		this.options.series[i].data = data.value[i].data;
	        }
	    	*/
	        /*
	        this.options.series.forEach(function(val, idx) {
                val.data[idx].value = data.value[idx];
            });
	        */
	    	for(var j=0; j<count; j++) {
	    		this.options.series[0].data[j].value = data.value[j];
	    	}
	    	
	        this.render(this.options);
	    },
	}); 	
	
	$.widget("echart.multipleRadar", {
	    options: {
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	        	trigger: 'axis',	        		
	   	 		textStyle: {
	        	    fontSize: 8
	   	 		}
	        },
	        legend: {},
	        radar: {
	        	indicator: []
	        },
	        series: [{
	        	data: []
	        }]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.multipleRadar.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var series = this.options.series || [];
	        var count = this.options.count || 1;
	        
	        this.options.series = [];
	        
	        for(var i = 0; i<count; i++) {
	            this.options.series.push({
	                name: name[i] || '',
	                type: type || types[i] || 'radar',
	                data: [],
	            });
	            if(name.length !=0) this.options.legend.data = name;
	        }
	        
//	        var setLegend = {
//        		x: 'center',
//        		data:['소프트웨어','전화','휴대전화','강수량','증발량']
//	        };
//	        this.options.legend = setLegend;           
	        
	        var setRadar = [
	            {
	                indicator: [],
	                center: ['25%','40%'],
	                radius: 80
	            },
	            {
	                indicator: [],
	                radius: 80,
	                center: ['50%','75%'],
	            },
	            {
	                indicator: [],
	                center: ['75%','40%'],
	                radius: 80
	            }
	        ];
		    this.options.radar = setRadar;
	        
	        if(series != undefined) {
	        	var setSeries = [
	                {
	                    type: 'radar',
	                     tooltip: {
	                        trigger: 'item'
	                    },
	                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
	                    data: []
	                },
	                {
	                    type: 'radar',
	                    radarIndex: 1,
	                    data: []
	                },
	                {
	                    type: 'radar',
	                    radarIndex: 2,
	                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
	                    data: []
	                }
	            ];
	        	this.options.series = setSeries;
	        }

	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        this.options.radar.forEach(function(val, idx) {
	            val.indicator = data.label[idx];
	        });	        
	        
	        this.options.series.forEach(function(val, idx) {
	            val.data = data.value[idx];
	        });
	        
	        this.render(this.options);
	    },
	});	    
	
	$.widget("echart.squareRadar", {
	    options: {
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	        	trigger: 'axis',	        		
	   	 		textStyle: {
	        	    fontSize: 8
	   	 		}
	        },
	        legend: {},
	        radar: {
                indicator: [],
                radius: 70
            },
	        series: [{
                type: 'radar',
                tooltip: {
                   trigger: 'item'
               },
               itemStyle: {normal: {areaStyle: {type: 'default'}}},
               data: []
           }]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.squareRadar.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;
	        
//	        var setLegend = {
//        		x: 'center',
//        		data:['소프트웨어','전화','휴대전화','강수량','증발량']
//	        };
//	        this.options.legend = setLegend;

	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        for(var i = 0; i < data.label.length; i++) {
	        	this.options.radar.indicator[i] = data.label[i];
	        }
	        
	        for(var i = 0; i < data.value.length; i++) {
	        	this.options.series[0].data[i] = data.value[i];
	        }
	        
	        this.render(this.options);
	    },
	});	    	
	
	$.widget("echart.pentagonRadar", {
	    options: {
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	   	 		textStyle: {
	        	    fontSize: 8
	   	 		}
	        },
	        legend: {
	            data:[]
	        },
	        radar: {
            	radius: 70,
            	indicator: []
            },
	        series: [{
                type: 'radar',
                data : []
            }]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.pentagonRadar.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;
	        
//	        var setLegend = {
//	    	    data:['Allocated Budget', 'Actual Spending'],
//	    	    x: 'center'         		
//	        };
//	        this.options.legend = setLegend;

	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        for(var i = 0; i < data.label.length; i++) {
	        	this.options.radar.indicator[i] = data.label[i];
	        }
	        
	        for(var i = 0; i < data.value.length; i++) {
	        	this.options.series[0].data[i] = data.value[i];
	        }

	        this.render(this.options);
	    },
	});	
	
	$.widget("echart.dodecagonRadar", {
	    options: {
	    	title: {
	            text: '',
	            subtext: ''
	        },
	        tooltip: {
	   	 		textStyle: {
	        	    fontSize: 8
	   	 		}
	        },
	        legend: {
	            data:[]
	        },
	        radar: {
            	radius: 70,
            	indicator: []
            },
	        series: [{
                type: 'radar',
                tooltip: {
                   trigger: 'item'
               },
               itemStyle: {normal: {areaStyle: {type: 'default'}}},
               data: []
           }]
	    },
	    
	    el: {
	        _id : null,
	        _class : null,
	    },
	    _create: function() {
	        this.init();
	    },
	    _destroy: function() {
	        $(this.element).empty();
	    }
	});

	$.extend( $.echart.dodecagonRadar.prototype, {
	    init : function() {
	        this.el._id = this.element.attr("id");
	        this.el._class = this.element.attr("class");
	        var name = this.options.name || [];
	        var type = this.options.type;
	        var types = this.options.types || [];
	        var count = this.options.count || 1;
	        
//	        var setLegend = {
//	    	    data:['Allocated Budget', 'Actual Spending'],
//	    	    x: 'center'         		
//	        };
//	        this.options.legend = setLegend;

	        this.render(this.options);
	    },
	    render : function(options) {
	        this.chart = echarts.init($(this.element)[0]);
	        this.chart.setOption(this.options);
	    },
	    resize : function() {
	        this.chart.resize();
	    },
	    update : function(data) {
	        for(var i = 0; i < data.label.length; i++) {
	        	this.options.radar.indicator[i] = data.label[i];
	        }
	        
	        for(var i = 0; i < data.value.length; i++) {
	        	this.options.series[0].data[i] = data.value[i];
	        }
	        
//	        this.options.series.forEach(function(val, idx) {
//	            val.data = data.value[idx];
//	        });
	        this.render(this.options);
	    },
	});	
	
	
	$.widget("echart.markline", {
        options: {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            color: ['#ff4b4c', '#86b600', '#f1d75d', '#3d98f0' ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
            	padding: 20,
                data:[]
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {},
            series: []
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.markline.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            var name = this.options.name || [];
            var type = this.options.type;
            var types = this.options.types || [];
            var threshold = this.options.threshold;
            var mark = this.options.mark;
            var count = this.options.count || 1;
            
            this.options.series = [];
            
            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: name[i] || '',
                    type: type || types[i] || 'line',
                    data: [],
                    areaStyle: {normal: {opacity : 0.3}}
                });
                if(name.length !=0) this.options.legend.data = name;
            }
            
            	var startpoint = 0;
            	var endpoint = 100;
            	
            	var markLineOpt = {
                    animation: false,
                    lineStyle: {
                        normal: {
                            type: 'solid'
                        }
                    },
                    data: [[{
                        coord: [0, startpoint],
                        symbol: 'none'
                    }, {
                        coord: [10, endpoint],
                        symbol: 'none'
                    }]]
                };
            	
                this.options.series[0].markLine = markLineOpt;
            	this.options.series[0].markLine.lineStyle.normal.color = '#000'
          
            if(type != 'line') this.options.xAxis.boundaryGap = true;
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
            //this.options.series[0].data = data.series;
            
            var dataArr = data;
            var mark = this.options.series[0].markLine;
            var values = dataArr.value[0];
            var startPoint = values[0];
            var endPoint = values[values.length-1];
            
            mark.data[0][0].coord[1] = startPoint;
            mark.data[0][1].coord[1] = endPoint;
            
           	var labels = dataArr.label;
           	labels.shift();
           	labels.pop();
           	
           	if(labels.length == 0) return;
           	var firstDate = labels[0].split("-");
           	var lastStr = labels[labels.length-1];
           	var lastDate = lastStr.split("-");
           	
           	var firstDateObj = new Date(firstDate[0], Number(firstDate[1])-1, firstDate[2]);  
           	var lastDateObj = new Date(lastDate[0], Number(lastDate[1])-1, lastDate[2]);    
           	var between = (lastDateObj.getTime() - firstDateObj.getTime())/1000/60/60/24;
			
           	labels.pop();
           	var daycnt = between - (labels.length - 1); 
           	           
            values.shift();
            values.pop();
            var lastData = values[values.length-1]
            values.pop();
            for(var i=0; i<daycnt; i++) {
           		labels.push("");
           		values.push(null);
           	}
           	labels.push(lastStr);
           	values.push(null);
           	dataArr.label = labels;
           	this.options.yAxis.max = lastData;
            dataArr.value[0] = values;
            mark.data[0][1].coord[0] = dataArr.value[0].length -1
            this.options.yAxis.max = 2600;
            this.options.xAxis.data = dataArr.label;
            this.options.series.forEach(function(val, idx) {
                val.data = dataArr.value[idx];
            });
            
            this.render(this.options);
        },
    });
	
    $.widget("echart.calendar", {
        options: {
        	title: {},
            tooltip : {
                trigger: 'item'
            },
            calendar: [{
            	bottom: 'auto',
            	width: '70%',
            	height: '70%',
                left: 'center',
                orient: 'vertical',
                range: [],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#5a5b5d',
                        width: 1,
                        type: 'solid'
                    }
                },
                dayLabel: {
                	show: true,
                	firstDay: 0,
                	margin: 3,
                	nameMap: ['일','월','화','수','목','금','토'],
                	textStyle: {
                		fontSize: 13,
                        color: '#fff'
                    }
                },
                monthLabel: {
                	show: true,
                	align: 'center',
                	margin: 3,
                	position: 'start',
                	nameMap: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
                	textStyle: {
                		fontSize: 15,
                        color: '#fff'
                    }
                },
                /* 
                yearLabel: {
                    formatter: '{start}  1st',
                    textStyle: {
                        color: '#fff'
                    }
                },
                 */
                itemStyle: {
                    normal: {
                        borderWidth: 0.5,
                        borderColor: '#5a5b5d',
                        color:'#eee'
                    }
                }
            }],
            series : []
        },
        
        el: {
            _id : null,
            _class : null,
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {
            $(this.element).empty();
        }
    });

    $.extend( $.echart.calendar.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            var name = this.options.name || [];
            var year = this.options.year;
            var month = this.options.month;
            this.options.colors = this.options.colors || ['#014fa7', '#cecece', '#5a5b5d', '#eee'];//scatter splitLine(out in) background
            
            this.options.series = [];
            
            this.options.series = this.getSeries(year, month);
            
            this.options.calendar[0].splitLine.lineStyle.color = this.options.colors[2];
            this.options.calendar[0].itemStyle.normal = {
                    borderWidth: 0.5,
                    borderColor: this.options.colors[1],
                    color: this.options.colors[3]
                };
            this.render();
        },
        getSeries : function(year, month, dataArr) {
        	var data = dataArr || this.getData(year, month);
        	this.options.calendar[0].range = this.getRange(year, month);
    		data.sort(function (a, b) {
                return b[1] - a[1];
            }).slice(0, 12);
            var colors = this.options.colors;
            return [
                {
                    name: name,
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    data: data,
                    symbolSize: function (val) {
                        return val[1] / 350;
                    },
                    itemStyle: {
                        normal: {
                            color: colors[0],
                            opacity: 1
                        }
                    }
                },
                {
                    name: '',
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    calendarIndex: 1,
                    data: undefined,
                    symbolSize: function (val) {
                        return val[1] / 250;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: colors[0],
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                },
            ]
        },
        getRange : function(year, month) {
        	var now = new Date();
			var yy = year || now.getFullYear();
            var mm = month || now.getMonth() + 1;
            /* 
            var start = year+'-'+month+'-'+'1';
            var last = year+'-'+month+'-'+ (new Date(year, month, 0)).getDate();
            return [start, last];
             */
            return yy+'-'+mm;
        },
        getData : function(year, month) {
        	//return Array --> 30 or 31
        	var now = new Date();
			var yy = year || now.getFullYear();
            var mm = month || now.getMonth() + 1;
            var last = yy+'-'+(mm+1)+'-01';
            
            var date = +echarts.number.parseDate(yy + '-' + mm +'-01');
            var end = +echarts.number.parseDate(last);
            var dayTime = 3600 * 24 * 1000;
            var data = [];
            
            for (var time = date; time < end; time += dayTime) {
                data.push([
                    echarts.format.formatTime('yyyy-MM-dd', time),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            
            return data;
        },
        render : function() {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(data) {
        	var year;
        	var month;
        	
        	if(data != undefined) {
        		year = data.year;
        		month = data.month;
        	}
        	
            this.options.series = this.getSeries(year, month, data.data);
            
            this.render();
        },
    });
    
    $.widget("echart.slaRealtime", {
        options: {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '8%',
                bottom: '3%',
                containLabel: true,
		        backgroundColor : 'rgba(255,255,255,.05)',
		        show : true
            },
            legend: {
                y: 'top',
                padding: 20,
                data: [],
                textStyle: {
                    color: '#000',
                    fontSize: 10
                }
            },
            color: COLOERS_LINE,
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
            },
            yAxis: {
 		        axisLabel : {
 		        	textStyle : {color : "#fff"}
                }
            },
            visualMap: {
            	orient:'horizontal',
            	top: 15,
            	right: 10,
            	pieces: [],
                outOfRange: {
                    color: '#4BBB38'
                },
                textStyle : {color : "#fff"},
            },
            series: [],
        },
        
        el: {
            _id : null,
            _class : null
        },
        _create: function() {
            this.init();
        },
        _destroy: function() {

        }
    });
    
    $.extend( $.echart.slaRealtime.prototype, {
        init : function() {
            this.el._id = this.element.attr("id");
            this.el._class = this.element.attr("class");
            var len = this.options.dataLength || 10;
            var count = this.options.count || 1;
            var name = this.options.name || [];
            var type = this.options.type || 'line';
            var area = this.options.area;
            var pieces = this.options.pieces;
            var markData = this.options.markData;
            this.options.series = [];
            
            areaOption = area ? {normal: {}} : '';

            for(var i = 0; i<count; i++) {
                this.options.series.push({
                    name: name[i] || '',
                    type: type,
                    areaStyle: areaOption,
                    data: [],
                    smooth: true,
                    markLine: {
                    	silent: true,
                    	data: markData
                    },
                    
                });
                this.options.legend.data.push(name[i]);
            }
            
            if(type != 'line') this.options.xAxis.boundaryGap = true;
            
            if(len != undefined) {
                var temp = function(len) {
                    var array = [];
                    while(len > 0) {
                        array.push('');
                        len--;
                    }
                    return array;
                };
                
                this.options.xAxis.data = temp(len);
                this.options.series.forEach(function(val) {
                    val.data = temp(len);
                });
            }
            
            if(pieces != undefined) {
            	this.options.visualMap.pieces = pieces;
            }
            
            this.render(this.options);
        },
        render : function(options) {
            this.chart = echarts.init($(this.element)[0]);
            this.chart.setOption(this.options);
        },
        resize : function() {
            this.chart.resize();
        },
        update : function(dataObjArr) {
            var series = this.options.series; 
            series.forEach(function(val, idx) {
                val.data.push(dataObjArr[idx].value);
                val.data.shift();
            });
            this.options.xAxis.data.shift();
            this.options.xAxis.data.push(dataObjArr[0].label);
            this.chart.setOption({
                xAxis: this.options.xAxis,
                series: this.options.series,
                visualMap: this.options.visualMap
            });
        },
        destory : function() {
        	
        }
    });    
}
/*
 * 

var waterMarkText = 'ECHARTS';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = canvas.height = 100;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.globalAlpha = 0.08;
ctx.font = '20px Microsoft Yahei';
ctx.translate(50, 50);
ctx.rotate(-Math.PI / 4);
ctx.fillText(waterMarkText, 0, 0);

options
----------------------
 backgroundColor: {
        type: 'pattern',
        image: canvas,
        repeat: 'repeat'
    },
----------------------
*/


return new Wrapper();
});