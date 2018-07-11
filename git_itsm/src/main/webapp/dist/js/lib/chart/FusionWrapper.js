function Chart(obj) {
    this.init();
    if(obj != undefined) this.setDefaultOption(obj)
}

Chart.prototype = {
    defaultOption: {
        width: "260",
        height: "260",
        dataFormat: "json",
        theme : "fint"
    },
    init: function() {
        
    },
    setDefaultOption: function(obj) {
        for(var key in obj) {
            this.defaultOption[key] = obj[key];
        }
    },
    setDefault: function(el) {
        el.options.width = Chart.prototype.defaultOption.width;
        el.options.height= Chart.prototype.defaultOption.height;
        el.options.dataFormat= Chart.prototype.defaultOption.dataFormat;
        el.options.dataSource.chart.theme = Chart.prototype.defaultOption.theme;
    },
}

Chart.prototype.column = {
    options: {
        "type": "column2d",
        "renderAt": "",
        "width": '',
        "height": '',
        "dataFormat": '',
        "dataSource": {
            "chart": {
                animation: 0,
                "theme": ''
            },
            "data": []
        }
    },
    setOptions: function(optionObj) {
        this.options = optionObj;
    },
    setDefault: function() {
        var def = Chart.prototype.defaultOption;
        this.options.width = def.width;
        this.options.height= def.height;
        this.options.dataFormat= def.dataFormat;
        //this.options.dataSource.chart.theme = def.theme;
    },
    create: function(selector, dataArr, threeD) {
        var _this = this;
        //Chart.prototype.setDefault(this);
        this.setDefault();
        this.options.renderAt = selector;
        this.selector = selector;
        this.options.dataSource.data = dataArr;
        if(threeD == true) this.options.type = 'column3d';
        $("#"+selector).insertFusionCharts(this.options);
        
        return this;
    },
    updateChart: function(dataObj) {
        if(dataObj == undefined) return;
        this.options.dataSource.data.shift;
        this.push(dataObj);
        this.shift();
        this.update();
    },
    update: function() {
        $('#'+this.selector).updateFusionCharts(this.options);
    },
    push: function(dataObj) {
        this.options.dataSource.data.push(dataObj);
    },
    shift: function() {
        this.options.dataSource.data.shift;
    },
    remove: function() {
        $("#"+this.selector).disposeFusionCharts();
    }
}

Chart.prototype.line = {
    options: {
        "type": "line",
        "renderAt": "",
        "width": Chart.prototype.defaultOption.width,
        "height": Chart.prototype.defaultOption.height,
        "dataFormat": Chart.prototype.defaultOption.dataFormat,
        "dataSource": {
            "chart": {
                animation: 0,
                "theme": ''
            },
            "data": []
        }
    },
    setOptions: function(optionObj) {
        this.options = optionObj;
    },
    setDefault: function() {
        var def = Chart.prototype.defaultOption;
        this.options.width = def.width;
        this.options.height= def.height;
        this.options.dataFormat= def.dataFormat;
        this.options.dataSource.chart.theme = def.theme;
    },
    create: function(selector, dataArr) {
        var _this = this;
        Chart.prototype.setDefault(this);
        this.options.renderAt = selector;
        this.selector = selector;
        this.options.dataSource.data = dataArr;
        $("#"+selector).insertFusionCharts(this.options);
        
        return this;
    },
    updateChart: function(dataObj) {
        if(dataObj == undefined) return;
        this.options.dataSource.data.shift;
        this.push(dataObj);
        this.shift();
        this.update();
    },
    update: function() {
        $('#'+this.selector).updateFusionCharts(this.options);
    },
    push: function(dataObj) {
        this.options.dataSource.data.push(dataObj);
    },
    shift: function() {
        this.options.dataSource.data.shift;
    },
    remove: function() {
        $("#"+this.selector).disposeFusionCharts();
    }
}

Chart.prototype.pie = {
    options: {
        type: 'pie2d',
        renderAt: '',
        "width": '',
        "height": '',
        "dataFormat": '',
        dataSource: {
            "chart": {
                animation: 0,
                "startingAngle": "120",
                "showLabels": "0",
                "showLegend": "1",
                "enableMultiSlicing": "0",
                "slicingDistance": "15",
                //To show the values in percentage
                "showPercentValues": "1",
                "showPercentInTooltip": "0",
                "plotTooltext": "Age group : $label<br>Total visit : $datavalue",
                "theme": "fint"
            },
            "data": []
        }
    },
    setOptions: function(optionObj) {
        this.options = optionObj;
    },
    setDefault: function() {
        var def = Chart.prototype.defaultOption;
        this.options.width = def.width;
        this.options.height= def.height;
        this.options.dataFormat= def.dataFormat;
        this.options.dataSource.chart.theme = def.theme;
    },
    create: function(selector, dataArr, threeD) {
        var _this = this;
        Chart.prototype.setDefault(this);
        this.options.renderAt = selector;
        this.selector = selector;
        this.options.dataSource.data = dataArr;
        if(threeD == true) this.options.type = 'pie3d';
        $("#"+selector).insertFusionCharts(this.options);
        
        return this;
    },
    updateChart: function(dataObj) {
        if(dataObj == undefined) return;
        this.options.dataSource.data.shift;
        this.push(dataObj);
        this.shift();
        this.update();
    },
    update: function() {
        $('#'+this.selector).updateFusionCharts(this.options);
    },
    push: function(dataObj) {
        this.options.dataSource.data.push(dataObj);
    },
    shift: function() {
        this.options.dataSource.data.shift;
    },
    remove: function() {
        $("#"+this.selector).disposeFusionCharts();
    }
}

Chart.prototype.area = {
    options: {
        "type": "area2d",
        "renderAt": "",
        "width": Chart.prototype.defaultOption.width,
        "height": Chart.prototype.defaultOption.height,
        "dataFormat": Chart.prototype.defaultOption.dataFormat,
        "dataSource": {
            "chart": {
                animation: 0,
                "bgColor": "#ffffff",
                "showBorder": "0",
                "showCanvasBorder": "0",
                "plotBorderAlpha": "10",
                "usePlotGradientColor": "0",
                "plotFillAlpha": "50",
                "showXAxisLine": "1",
                "axisLineAlpha": "25",
                "divLineAlpha": "10",
                "showValues": "1",
                "showAlternateHGridColor": "0",
                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "theme": ''
            },
            "data": []
        }
    },
    setOptions: function(optionObj) {
        this.options = optionObj;
    },
    setDefault: function() {
        var def = Chart.prototype.defaultOption;
        this.options.width = def.width;
        this.options.height= def.height;
        this.options.dataFormat= def.dataFormat;
        this.options.dataSource.chart.theme = def.theme;
    },
    create: function(selector, dataArr) {
        var _this = this;
        Chart.prototype.setDefault(this);
        this.options.renderAt = selector;
        this.selector = selector;
        this.options.dataSource.data = dataArr;
        $("#"+selector).insertFusionCharts(this.options);
        
        return this;
    },
    updateChart: function(dataObj) {
        if(dataObj == undefined) return;
        this.options.dataSource.data.shift;
        this.push(dataObj);
        this.shift();
        this.update();
    },
    update: function() {
        $('#'+this.selector).updateFusionCharts(this.options);
    },
    push: function(dataObj) {
        this.options.dataSource.data.push(dataObj);
    },
    shift: function() {
        this.options.dataSource.data.shift;
    },
    remove: function() {
        $("#"+this.selector).disposeFusionCharts();
    }
}