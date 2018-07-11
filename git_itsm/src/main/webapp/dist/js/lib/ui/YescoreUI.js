/*
 * 
 * JAYG
 * CIR213
 * HKYOO
 * 
 * 2017.4
 * */


$.widget("yescore.grid", {
	options: {
		
	},
	el: {
		_id : null,
		_class : null,
	},
	_create: function() {
		this.init();
	},
	_destroy: function() {
		w2ui[this.options.name].destroy();
		$.removeData(this.element.get(0));
	}
});

$.extend( $.yescore.grid.prototype, {
	init: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		
		$(window).on('resize', function(evt) { 
			for(var grid in w2ui) {
				if(grid.indexOf('_') == -1) w2ui[grid].resize();
			}
		});
		
		this.render();
	},
	render : function() {
		this.options.recid = this.options.recid || "id";
		this.options.name = this.el._id.replace(/[^a-zA-Z0-9]/gi, "") + "Grid";
		this.options.recordHeight = 30;
		$(this.element).w2grid(this.options);
		if(this.options.data != undefined) this.update(this.options.data);
	},
	update : function(data) {
		w2ui[this.options.name].records = data;
		w2ui[this.options.name].render();
	},
	refresh : function(){
		 w2ui[this.options.name].refresh();
	},
	getRecid : function() {
		//return $(".w2ui-selected").attr("recid");
		return $("#"+this.element.attr("id")).find(".w2ui-selected").attr("recid");
	},
	addRow : function(data) {
		w2ui[this.options.name].add(data);
	},
	getRow : function(recid) {
		return w2ui[this.options.name].get(recid);
	},
	updateRow : function(recid, data) {
		this.deleteRow(recid);
		this.addRow(data);
	},
	deleteRow : function(recid) {
		w2ui[this.options.name].remove(recid);
	},
	empty : function() {
		w2ui[this.options.name].clear();
	},
	unselect : function(recid) {
		w2ui[this.options.name].unselect(recid);
		this.element.enableSelection();
	},
	resize : function() {
		var name = this.element.attr("id").replace(/[^a-zA-Z0-9]/gi, "") + "Grid";
		w2ui[name].resize();
	},
	destroy : function() {
		w2ui[this.options.name].destroy();
		$.removeData(this.element.get(0));
	}
});

$.widget("yescore.table", {
    options: {
    	_captions : [], 
    	_field : [], 
    	columns: [],
    	data: []
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

$.extend( $.yescore.table.prototype, {
    init : function() {
        this.el._id = this.element.attr("id");
        this.el._class = this.element.attr("class");
        
        this.render();
    },
    initOptions : function() {
    	this.options = {
	    	_captions : [], 
	    	_field : [], 
	    	columns: [],
	    	data: []
	    }
    },
    clearTable : function() {
    	this.element.find("table tr:not(tr:first-child)").remove();
    },
    removeTable : function() {
    	this.element.find("table").remove();
    },
    setTable : function() {
		var _this = this;
    	var header = "";
		var table = ""
		var row = "";
		
		this.setColumns();
		
		this.options._captions.forEach(function(val) {
			header += "<th>"+val+"</th>";
		});
		
		row = this.setRows(this.options.data);
		 
		
		table = "<table id='"+this.el._id+"-tbl'>" + header + row + "</table>";
		
		return table;
	},
	setColumns : function() {
		var _this = this;
		_this.options._captions = [];
		_this.options._field = [];
		this.options.columns.forEach(function(val) {
			_this.options._captions.push(val.caption);
			_this.options._field.push(val.field);
		});
	},
	setRows : function(data) {
		var _this = this;
		var rows = ""
		var data = data || [];
		if(data.length !=0) {
			data.forEach(function(val) {
				var td = ""
				_this.options._field.forEach(function(v) {
					var text = val[v] || "";
					td += "<td>" + text + "</td>";
					
				})
				rows += "<tr>" + td + "</tr>";
			});
		}
		
		return rows;
	},
    render : function(options) {
    	var target = this.element;
    	target.append(this.setTable());
    },
    resize : function() {

    },
    update : function(data) {
    	var columns = data.columns || [];
        var data = data.data || [];
        
        if(columns.length != 0) {
        	this.initOptions();
        	this.options.columns = columns;
        	this.options.data = data;
        	this.removeTable();
        	this.render();
        } else {
        	this.clearTable();
        	this.setRows(data);
        	this.element.find("table").append(this.setRows(data));
        }
        
    },
});

$.widget("yescore.popup", {
	options: {
		open: function() {
			var zIdx=2000;
			$(".ui-widget-overlay").css("z-index", zIdx);
			$(".ui-dialog").css("z-index", zIdx+1);
		},
		close: function() {
			$('.ui-dialog').empty();
			//$(this.element).remove();
		},
		minWidth: 400,
        minHeight: 'auto',
        resizable: false,
        autoOpen: false,
        dialogClass: 'ui-widget-shadow',
        modal: true
	},
	el: {
		_id : null,
		_class : null,
	},
	_create: function() {
		this.init();
	},
	_destroy: function() {
		this.options = {};
		$.removeData(this.element.get(0));
	}
});


$.extend( $.yescore.popup.prototype, {
	init: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		var form = this.options.form;
		var body = this.options.body;
		if(form == undefined) {
			$(this.element).dialog(this.options);
		} else {
			this.render();
		}
		$(window).on('resize', function(evt) { 
			$(".ui-dialog").css("top", Math.max(0, (($(window).height() - $('.ui-dialog').outerHeight()) / 2) + $(window).scrollTop()) + "px");
			$(".ui-dialog").css("left", Math.max(0, (($(window).width() - $('.ui-dialog').outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		});
		/*
		
		*/
	},
	destroy: function() {
		$.removeData(this.element.get(0)); 
	},
	render : function() {
		var _this = this;
		var title = this.options.title || '';
		var formArr = this.options.form;
		var bodyHtml = '<div id="'+ this.el._id +'-popup" class="yescore-popup-body">' +
        			   '<form><fieldset><ul>';
		formArr.forEach(function(form) {
			bodyHtml +=  '<li>' + _this[form.type](form) + '</li>';
		});
		
		bodyHtml += '</ul></fieldset></form></div>';
		
		$(this.element).empty();
		$(this.element).hide();
		$(this.element).attr('title', title);
		$(this.element).append(bodyHtml);
		if(!this.options.main) {
			$(this.element).find(".popup-date").datepicker();
//			$(this.element).find(".popup-datetime").datetimepicker({format: 'Y-m-d H:i', formatDate: 'Y-m-d'});
		}
		$(this.element).dialog(this.options);
		
		//$(".ui-dialog-titlebar-close").append("<i class='fas fa-times' id='closeBtn' aria-hidden='true' title='close'></i>");
	},
	open : function() {
		var zIdx=2000;
		$(".ui-widget-overlay").css("z-index", zIdx);
		$(".ui-dialog").css("z-index", zIdx+1);
		$('.popup-form.text').keypress(function (e) {
			if(e.which == 13) {
				e.preventDefault();
			}
		});
		$(this.element).dialog('open');
	},
	close : function() {
		$(this.element).dialog('close');
		$('.ui-dialog').empty();
	},
	set: function(options) {
		for(opt in options) {
			this.options[opt] = options[opt];
		}
	},
	getValues : function() {
		var result = {};
		var array = [];
		if(this.options.form == undefined) return {};
		this.options.form.forEach(function(obj) {
			var id = obj.id;
			var type = obj.type;
			
			if(type == 'radio') {
				result[id] = $("input[name="+id+"]:checked").val();
			} else if (type == 'checkbox') {
				$("input[name="+id+"]:checked").each(function() {
					array.push($(this).val());
				});
				result[id] = array;
			} else {
				result[id] = $('#'+id).val();
			}
			
		});
		return result;
	},
	text : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _placeholder = option.placeholder || "";
		var _value = option.value || "";
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<div><label for="'+_name+'-text">'+_label+'</label></div>' +
				   '<div><input type="text" class="popup-form text " id="'+_id+'" ' + 
				   'placeholder="'+_placeholder+'" value="'+_value+'" autocomplete="off"></div>';
		return html;
	},
	email : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _placeholder = option.placeholder || "";
		var _value = option.value || "";
		var name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<div><label for="'+name+'-email">'+_label+'</label></div>' +
				   '<div class=""><input type="email" class="popup-form text " id="'+_id+'" ' +
				   'placeholder="'+_placeholder+'" value="'+_value +'"></div>';
		return html;
	},
	password : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _placeholder = option.placeholder || "";
		var _value = option.value || "";
		var _class_col = this.options.main ? '-main' : '';
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<div class="first-div'+_class_col+'"><label for="'+_name+'-password">'+_label+'</label></div>' +
				   '<div class="last-div'+_class_col+'"><input type="password" class="popup-form text " id="'+_id+'" ' + 
				   'placeholder="'+_placeholder+'" value="'+_value+'"></div>';
		return html;
	},
	combo : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _value = option.value || {};
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		
		var html = '<div><label for="'+_name+'-combo">'+_label+'</label></div>' +
			       '<div><select name="'+_name+'" value="'+_name+'-select" class="popup-form " id="'+_id+'">';
		_value.forEach(function(obj) {
			var text = obj.text;
			var value = obj.value;
			var select = obj.select;
			html += '<option value="'+value+'"';
			if(select==true) html += ' selected'
			html += '>'+text+'</option>'
		});
		html += '</select></div>';
		return html;
	},
	date : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _value = option.value || {};
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		
		var html = '<div><label for="'+_name+'-date">'+_label+'</label></div>' +
				   '<div><input type=text name="'+_name+'" value=""' + 
			       'class="popup-form popup-date text ui-widget-content' + 
			       '  ui-corner-all" id="'+_id+'"></div>';
		return html;
	},
	datetime : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _value = option.value || {};
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		
		var html = '<div><label for="'+_name+'-datetime">'+_label+'</label></div>' +
			       '<div><input type=text name="'+_name+'" value=""' + 
			       'class="popup-datetime text"' + 
			       ' id="'+_id+'"></div>';
		return html;
	},
	radio: function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _value = option.value || {};
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		
		var html = '<div><label for="'+_name+'-radio">'+_label+'</label></div>' +
				   '<div class="popup-form" id="'+_id+'">';
		_value.forEach(function(obj) {
			var text = obj.text;
			var value = obj.value;
			var check = obj.check;
			html += '<div class="radioBtn"><input type="radio" name="'+ _name +'" value="'+value+'"';
			if(check==true) html += ' checked="checked"'
			html += '>'+text+'</div>';
		});
		html += '</div>';
		return html;
	},
	checkbox: function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _value = option.value || {};
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		
		var html = '<div><label for="'+_name+'-check">'+_label+'</label></div>' +
				   '<div class="popup-form" id="'+_id+'">';
		_value.forEach(function(obj) {
			var text = obj.text;
			var value = obj.value;
			var check = obj.check;
			html += '<div class="checkBtn"><input type="checkbox" name="'+ _name +'" value="'+value+'"';
			if(check==true) html += ' checked="checked"'
			html += '>'+text+'</div>';
		});
		html += '</div>';
		return html;
	},
	emptydiv: function(option){
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var html = '<div><label>'+_label+'</label></div>' +
	       '<div><div id='+_id+'></div></div>';
	    
	    return html;   
	},
	button : function(id) {
		
	}
});

$.widget("yescore.confirm", {
	options: {
		open: function() {
			var zIdx=3000;
			$(".ui-widget-overlay").css("z-index", zIdx);
			$(".ui-dialog.inner-popup").css("z-index", zIdx+1);
		},
		close: function() {
			$('.ui-dialog.inner-popup').empty();
			//$(this.element).remove();
		},
		minWidth: 480,
        minHeight: 'auto',
        resizable: false,
        autoOpen: false,
        dialogClass: 'ui-widget-shadow inner-popup',
        modal: true,
	},
	el: {
		_id : null,
		_class : null,
	},
	_create: function() {
		this.init();
	},
	_destroy: function() {
		this.options = {};
		$.removeData(this.element.get(0));
	}
});


$.extend( $.yescore.confirm.prototype, {
	init: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.render();
	},
	destroy: function() {
		$.removeData(this.element.get(0));
	},
	render : function() {
		var _this = this;
		var title = this.options.title || '';
		var formArr = this.options.form;
		var bodyHtml = '<div id="'+ this.el._id +'-popup" class="yescore-confirm-body">' +
        			   '<form><fieldset><ul>';
		formArr.forEach(function(form) {
			bodyHtml +=  '<li>' + _this[form.type](form) + '</li>';
		});
		bodyHtml += '</ul></fieldset></form></div>';
				
		$(this.element).empty();
		$(this.element).hide();
		$(this.element).attr('title', title);
		$(this.element).append(bodyHtml);
		$(this.element).dialog(this.options);
		$(this.element).parent().find('.ui-widget-header').addClass('ui-widget-header-'+title.toLowerCase());
		$(this.element).parent().addClass('ui-widget-'+title.toLowerCase());
		
		//$(".ui-dialog-titlebar-close").append("<i class='fas fa-times' id='closeBtn' aria-hidden='true' title='close'></i>");
	},
	open : function() {
		$(this.element).dialog('open');
	},
	close : function() {
		$(this.element).dialog('close');
		$(".ui-widget-overlay").css("z-index", 2000);
		$('.ui-dialog.inner-popup').empty();
	},
	set: function(options) {
		for(opt in options) {
			this.options[opt] = options[opt];
		}
	},
	getValues : function() {
		if($('#pw').val() == undefined) return {};
		var result = {'password' : $('#pw').val()};
		return result;
	},
	password : function(option) {
		var _id = option.id || this.el._id;
		var _label = option.label || "";
		var _placeholder = option.placeholder || "";
		var _value = option.value || "";
		var _name = _id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<div class="popup-form-pw-1"><label></label></div>' +
				   '<div class="popup-form-pw-2"><input type="password" class="popup-form text" id="pw" ' + 
				   'placeholder="'+_placeholder+'" value="'+_value+'"></div>';
		return html;
	},
	label : function(option) {
		var _label = option.label || "";
		var html = '<div class="popup-form-div"><div class="icon-'+this.options.title.toLowerCase()+'"></div><label class="popup-form-label">'+_label+'</label></div>';
		return html;
	},
	button : function(id) {
		
	}
});

$.widget("yescore.form", {
	options: {
		
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

$.extend( $.yescore.form.prototype, {
	init: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		
		this.render();
	},
	render: function() {
		$(this.element).append(this[this.options.type]());
	},
	destroy: function() {
		$.removeData(this.element.get(0));
	},
	email : function() {
		var _label = this.options.label || "";
		var _placeholder = this.options.placeholder || "";
		var name = this.el._id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<label for="'+name+'-email">'+_label+'</label>' +
				   '<input type="email" class="form-control ycui-form-email" id="'+name+'-email" ' + 
				   'placeholder="'+_placeholder+'" value="'+'">';
		
		return html;
	},
	text : function() {
		var _label = this.options.label || "";
		var _placeholder = this.options.placeholder || "";
		var name = this.el._id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<label for="'+name+'-text">'+_label+'</label>' +
				   '<input type="text" class="form-control ycui-form-text" id="'+name+'-text" ' + 
				   'placeholder="'+_placeholder+'" value="'+'" autocomplete="off">';
		
		//$(this.element).append(html);
		return html;
	},
	password : function() {
		var _label = this.options.label || "";
		var _placeholder = this.options.placeholder || "";
		var name = this.el._id.replace(/[^a-zA-Z0-9]/gi, "");
		var html = '<label for="'+name+'-password">'+_label+'</label>' +
				   '<input type="password" class="form-control ycui-form-password" id="'+name+'-password" ' + 
				   'placeholder="'+_placeholder+'" value="'+'">';
		
		return html;
	},
	progress : function(value) {
		var html = '<progress value="'+value+'" max="100">'+value+'" %</progress>';
		$(this.element).empty();
		$(this.element).append(html);
	},
	combo : function() {
		var _name = this.el._id.replace(/[^a-zA-Z0-9]/gi, "");
		
		var html = '<select name="'+_name+'" value="'+_name+'-select" id="'+_name+'-select">';
		this.options.data.forEach(function(obj, i) {
			var text = obj.text;
			var value = obj.value;
			var select = obj.select;
			html += '<option value="'+value+'"';
			if(select==true) html += ' selected'
			html += '>'+text+'</option>'
		});
		html += '</select>';
		
		return html;
	}
});

$.widget("yescore.pager", {
	options: {
		visiblePages : 1,
		totalPages : 1,
		pagePerRow : 23,
		first: '<<',
		prev: '<',
		next: '>',
		last: '>>'
	},
	el: {
		_id : null,
		_class : null,
	},
	_create: function() {
		this.init();
	},
	_destroy: function() {
		this.options = {};
		$.removeData(this.element.get(0));
	}
});

$.extend( $.yescore.pager.prototype, {
	init: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.render();
	},
	destroy: function() {
		$(this.element).twbsPagination('destroy');
	},
	render : function() {
		var _this = this;
		var totalPages = 1;
		var visiblePages = 1;
		var totalPages = this.options.totalCount / this.options.pagePerRow;
		
		if(this.options.totalCount % this.options.pagePerRow > 0) {
			totalPages += 1;
		}
		
		if(totalPages < 1) {
			totalPages = 1;
		} else if(totalPages < 6) {
			visiblePages = totalPages;
		} else {
			visiblePages = 5;
		}
		
		$(this.element).twbsPagination({
            totalPages: totalPages,
            visiblePages: visiblePages,
            pagePerRow : _this.options.pagePerRow,
    		first: ' ',
    		prev: ' ',
    		next: ' ',
    		last: ' '
        });
		
		$(this.element).css("text-align", "center");
	},
	update: function(visiblePages) {
		$(this.element).twbsPagination({
            visiblePages: visiblePages
        });
	},
	open : function(data) {
		var _this = this;
		var totalPages = 1;
		var visiblePages = 1;
		var totalPages = data.totalCount / this.options.pagePerRow;
		
		if(data.totalCount % this.options.pagePerRow > 0) {
			totalPages += 1;
		}
		
		if(totalPages < 1) {
			totalPages = 1;
		} else if(totalPages < 6) {
			visiblePages = totalPages;
		} else {
			visiblePages = 5;
		}
		
		$(this.element).twbsPagination({
            totalPages: totalPages,
            visiblePages: visiblePages,
            pagePerRow : _this.options.pagePerRow,
    		first: ' ',
    		prev: ' ',
    		next: ' ',
    		last: ' '
        });
		
		$(this.element).css("text-align", "center");
	},
	pagerTableCSS : function(selector, totalRow, currentPage) {
			$(selector + " .page-item.next .page-link").hover(function(){
			    $(this).css({"background": "url(dist/img/user/btn_next_on.png)",'background-repeat': 'no-repeat'});
			    }, function(){
			    $(this).css({"background": "url(dist/img/user/btn_next_off.png)",'background-repeat': 'no-repeat'});
			});
			
			$(selector + " .page-item.last .page-link").hover(function(){
			    $(this).css({"background": "url(dist/img/user/btn_last_on.png)",'background-repeat': 'no-repeat'});
			    }, function(){
			    $(this).css({"background": "url(dist/img/user/btn_last_off.png)",'background-repeat': 'no-repeat'});
			});


			$(selector + " .page-item.prev .page-link").hover(function(){
			    $(this).css({"background": "url(dist/img/user/btn_prev_on.png)",'background-repeat': 'no-repeat'});
			    }, function(){
			    $(this).css({"background": "url(dist/img/user/btn_prev_off.png)",'background-repeat': 'no-repeat'});
			});
			
			$(selector + " .page-item.first .page-link").hover(function(){
			    $(this).css({"background": "url(dist/img/user/btn_first_on.png)",'background-repeat': 'no-repeat'});
			    }, function(){
			    $(this).css({"background": "url(dist/img/user/btn_first_off.png)",'background-repeat': 'no-repeat'});
			});
   	},
   	reset : function() {
   		$(".pagination").find(".active").removeClass("active");
   		$($(".pagination > .page-item")[2]).addClass("active");
   	}
});
	$.widget("yescore.timespinner", {
		options: {
			
		},
		el: {
			_id : null,
			_class : null,
		},
		_create: function() {
			this.init();
		},
		_destroy: function() {
			$.removeData(this.element.get(0));
		}
	});
	
	$.extend( $.yescore.timespinner.prototype, {
		init: function() {
			this.el._id = this.element.attr("id");
			this.el._class = this.element.attr("class");
			
			this.render();
		},
		render: function() {
			var html = '<input id="spin-hours-'+this.el._id+'" class="spin-hh" name="value">' + 
					   '<input id="spin-mins-'+this.el._id+'" name="value">';
			$(this.element).append(html);
			$( "#spin-hours-"+this.el._id ).spinner({
				spin: function( event, ui ) {
			        if ( ui.value > 23 ) {
			          	$( this ).spinner( "value", 0 );
			          	return false;
			        } else if ( ui.value < 0 ) {
			          	$( this ).spinner( "value", 23 );
			          	return false;
			        }
		      	}
		    });
			$( "#spin-mins-"+this.el._id ).spinner({
				spin: function( event, ui ) {
			        if ( ui.value > 59 ) {
			          	$( this ).spinner( "value", 0 );
			          	return false;
			        } else if ( ui.value < 0 ) {
			          	$( this ).spinner( "value", 59 );
			          	return false;
			        }
		      	}
		    });
			
			$( "#spin-hours-"+this.el._id ).val(0);
			$( "#spin-mins-"+this.el._id ).val(0);
		},
		setValues: function(hour, min){
			$( "#spin-hours-"+this.el._id ).val(hour);
			$( "#spin-mins-"+this.el._id ).val(min);
		},
		getValues: function() {
			var id = this.element.attr("id");
			var hours = $( "#spin-hours-"+id ).val();
			var mins = $( "#spin-mins-"+id ).val();
			
			return {'hours':hours, 'mins':mins };
		}
	});
	function Validate(rules, messages, type) {
		$('.yes-core-validate').unbind('focusout');
		
		this.result = {};
		this.rules = rules;
		this.messages = messages;
		this.checkMajorCnt = 0;
		this.checkMinorCnt = 0;
		//$(".validate-wrap").remove();
		
		for(var id in rules) {
			var _this = this;
			var _type = type || false;
			this.result[id] = {};
			
			var _rule = rules[id];
			var _max = _rule.max;
			
			if(_max != undefined) $('#'+id).attr('maxlength', _max);
			$('#'+id).addClass('yes-core-validate');
			$('#'+id).removeClass('invalid');
			if(_type)$('#'+id).attr('data-placement', _type);
			$('#'+id).focusout(function(evt) {
				
				var _id = $(evt.target).attr('id');
				
				$('#'+_id).attr('data-original-title', '');
				var rule = rules[_id];
				var require = rule.require;
				var min = rule.min || 0;
				var max = rule.max;
				var data = $('#'+_id).val();
				var cnt = 0;
				
				var up = rule.up;
				var down = rule.down;
				if(!(require == 'checkPw' && data == '' && !((_id == 'pwAddEditBox') || (_id == 'rePwAddEditBox')))) {
					var result = _this.getResult(_id,require, min, max, data, up, down);
					for(var re in _this.result[_id]) {
						var bool = _this.result[_id][re];
						if(!bool) cnt += 1;
						
						if(cnt == 0) {
							$('#'+_id).attr('data-original-title', '');
						} else {
							var msg = '' 
							if(_this.messages != undefined) {
								msg = _this.messages[_id];
								$('#'+_id).attr('data-original-title', msg);
								$('#'+_id).tooltip();
							}
						}
					}
				}
				if(cnt == 0) {
					$('#'+_id).removeClass('invalid');
				} else {
					$('#'+_id).addClass('invalid');
					
				}
				
				if(require == "checkSlaSeverity") {
					var criticalVal = parseInt($('#criticalSet').val());
					var majorVal = parseInt($('#majorSet').val());
					var minorVal = parseInt($('#minorSet').val());
					var criticalValLen = parseInt($('#criticalSet').val().length);
					var majorValLen = parseInt($('#majorSet').val().length);
					var minorValLen = parseInt($('#minorSet').val().length);
					var msg = '' 
						
					if(_this.messages != undefined) {
						msg = _this.messages[_id];
					}
						
					if(_id == "criticalSet") {
						if(cnt == 0) {
							$('#'+_id).attr('data-original-title', '');
							$('#'+_id).removeClass('invalid');
							if(((majorValLen > 0) && (criticalVal <= majorVal)) || ((majorValLen == 0) && (_this.checkMajorCnt > 0))){
								$('#majorSet').attr('data-original-title', msg);
								$('#majorSet').tooltip();
								$('#majorSet').addClass('invalid');
							} else {
								_this.checkMajorCnt = 0;
								$('#majorSet').attr('data-original-title', '');
								$('#majorSet').removeClass('invalid');
								$('#majorSet').tooltip('destroy');
							}
							
							if((minorValLen > 0) && (criticalVal <= minorVal) || ((majorValLen > 0) && (minorValLen > 0) && (majorVal <= minorVal)) || ((minorValLen == 0) && (_this.checkMinorCnt > 0))) {
								$('#minorSet').attr('data-original-title', msg);
								$('#minorSet').tooltip();
								$('#minorSet').addClass('invalid');
							} else {
								_this.checkMinorCnt = 0;
								$('#minorSet').attr('data-original-title', '');
								$('#minorSet').removeClass('invalid');
								$('#minorSet').tooltip('destroy');
							}
						} else {
							$('#'+_id).attr('data-original-title', msg);
							$('#'+_id).tooltip();							
							$('#'+_id).addClass('invalid');
						}
					} else if(_id == "majorSet") {
						_this.checkMajorCnt += 1;
						if(cnt == 0) {
							$('#'+_id).attr('data-original-title', '');
							$('#'+_id).removeClass('invalid');
							
							if((criticalValLen > 0) && (criticalVal <= majorVal)){
								$('#majorSet').attr('data-original-title', msg);
								$('#majorSet').tooltip();
								$('#majorSet').addClass('invalid');
							} else {
								$('#majorSet').attr('data-original-title', '');
								$('#majorSet').removeClass('invalid');
								$('#majorSet').tooltip('destroy');
							}
							
							if((minorValLen > 0) && (majorVal <= minorVal) || ((criticalValLen > 0) && (minorValLen > 0) && (criticalVal <= minorVal)) || ((minorValLen == 0) && (_this.checkMinorCnt > 0))) {
								$('#minorSet').attr('data-original-title', msg);
								$('#minorSet').tooltip();
								$('#minorSet').addClass('invalid');
							} else {
								_this.checkMinorCnt = 0;
								$('#minorSet').attr('data-original-title', '');
								$('#minorSet').removeClass('invalid');
								$('#minorSet').tooltip('destroy');
							}
						} else {
							if((criticalValLen > 0) && (minorValLen > 0) && (criticalVal >= minorVal)) {
								_this.checkMinorCnt = 0;
								$('#minorSet').attr('data-original-title', '');
								$('#minorSet').removeClass('invalid');
								$('#minorSet').tooltip('destroy');
							} else {
								$('#'+_id).attr('data-original-title', msg);
								$('#'+_id).tooltip();							
								$('#'+_id).addClass('invalid');
							}
						}
					} else if(_id == "minorSet") {
						_this.checkMinorCnt += 1;
						if(((criticalValLen > 0) && (criticalVal <= minorVal)) || ((majorValLen > 0) && (majorVal <= minorVal)) || cnt > 0 ) {
							$('#'+_id).attr('data-original-title', msg);
							$('#'+_id).tooltip();
							$('#'+_id).addClass('invalid');
						} else {
							$('#'+_id).attr('data-original-title', '');
							$('#'+_id).removeClass('invalid');
						}
					}
				}				
				
			});
			
		}
		
	}
	
	Validate.prototype = {
		init: function() {
			$('.yes-core-validate').removeClass('invalid');
			$('.yes-core-validate').attr('data-original-title', '');
			$('.yes-core-validate').tooltip('destroy');
		},
		valid: function() {
			var invalidCount = 0; 
				
			for(var id in this.rules) {
				var _this = this;
				this.result[id] = {};
				
				var _rule = this.rules[id];
				var _require = _rule.require;
				var _min = _rule.min || 0;
				var _max = _rule.max;
				var _data = $('#'+id).val();
				var cnt = 0;

				var _up = _rule.up;
				var _down = _rule.down;
				if(!(_require == 'checkPw' && _data == '' && !((id == 'pwAddEditBox') || (id == 'rePwAddEditBox')))) {
					_this.getResult(id,_require, _min, _max, _data, _up, _down);
					for(var re in _this.result[id]) {
						//if(!_this.result[id][re]) cnt += 1;
						var bool = _this.result[id][re];
						if(!bool) cnt += 1;
						if(cnt == 0) {
							$('#'+id).attr('data-original-title', '');
						} else {
							var msg = '' 
							if(_this.messages != undefined) {
								msg = this.messages[id];
								$('#'+id).addClass('invalid');
								$('#'+id).attr('data-original-title', msg);
								$('#'+id).tooltip();
							}
						}
					}
				}
				
				if(_require == "checkSlaSeverity") {
					var criticalVal = parseInt($('#criticalSet').val());
					var majorVal = parseInt($('#majorSet').val());
					var minorVal = parseInt($('#minorSet').val());
					var criticalValLen = parseInt($('#criticalSet').val().length);
					var majorValLen = parseInt($('#majorSet').val().length);
					var minorValLen = parseInt($('#minorSet').val().length);
					var msg = '' 
						
					if(_this.messages != undefined) {
						msg = _this.messages[id];
					}
						
					if(id == "criticalSet") {
						if(cnt == 0) {
							$('#'+id).attr('data-original-title', '');
							$('#'+id).removeClass('invalid');
							if(((majorValLen > 0) && (criticalVal <= majorVal)) || ((majorValLen == 0) && (_this.checkMajorCnt > 0))){
								$('#majorSet').attr('data-original-title', msg);
								$('#majorSet').tooltip();
								$('#majorSet').addClass('invalid');
								cnt += 1;
							} else {
								_this.checkMajorCnt = 0;
								$('#majorSet').attr('data-original-title', '');
								$('#majorSet').removeClass('invalid');
								$('#majorSet').tooltip('destroy');
							}
							
							if((minorValLen > 0) && (criticalVal <= minorVal) || ((majorValLen > 0) && (minorValLen > 0) && (majorVal <= minorVal)) || ((minorValLen == 0) && (_this.checkMinorCnt > 0))) {
								$('#minorSet').attr('data-original-title', msg);
								$('#minorSet').tooltip();
								$('#minorSet').addClass('invalid');
								cnt += 1;
							} else {
								_this.checkMinorCnt = 0;
								$('#minorSet').attr('data-original-title', '');
								$('#minorSet').removeClass('invalid');
								$('#minorSet').tooltip('destroy');
							}
						} else {
							$('#'+id).attr('data-original-title', msg);
							$('#'+id).tooltip();							
							$('#'+id).addClass('invalid');
							cnt += 1;
						}
					} else if(id == "majorSet") {
						_this.checkMajorCnt += 1;
						if(cnt == 0) {
							$('#'+id).attr('data-original-title', '');
							$('#'+id).removeClass('invalid');
							
							if((criticalValLen > 0) && (criticalVal <= majorVal)){
								$('#majorSet').attr('data-original-title', msg);
								$('#majorSet').tooltip();
								$('#majorSet').addClass('invalid');
								cnt += 1;
							} else {
								$('#majorSet').attr('data-original-title', '');
								$('#majorSet').removeClass('invalid');
								$('#majorSet').tooltip('destroy');
							}
							
							if((minorValLen > 0) && (majorVal <= minorVal) || ((criticalValLen > 0) && (minorValLen > 0) && (criticalVal <= minorVal)) || ((minorValLen == 0) && (_this.checkMinorCnt > 0))) {
								$('#minorSet').attr('data-original-title', msg);
								$('#minorSet').tooltip();
								$('#minorSet').addClass('invalid');
								cnt += 1;
							} else {
								_this.checkMinorCnt = 0;
								$('#minorSet').attr('data-original-title', '');
								$('#minorSet').removeClass('invalid');
								$('#minorSet').tooltip('destroy');
							}
						} else {
							if((criticalValLen > 0) && (minorValLen > 0) && (criticalVal >= minorVal)) {
								_this.checkMinorCnt = 0;
								$('#minorSet').attr('data-original-title', '');
								$('#minorSet').removeClass('invalid');
								$('#minorSet').tooltip('destroy');
							} else {
								$('#'+id).attr('data-original-title', msg);
								$('#'+id).tooltip();							
								$('#'+id).addClass('invalid');
								cnt += 1;
							}
						}
					} else if(id == "minorSet") {
						_this.checkMinorCnt += 1;
						if(((criticalValLen > 0) && (criticalVal <= minorVal)) || ((majorValLen > 0) && (majorVal <= minorVal)) || cnt > 0 ) {
							$('#'+id).attr('data-original-title', msg);
							$('#'+id).tooltip();
							$('#'+id).addClass('invalid');
							cnt += 1;
						} else {
							$('#'+id).attr('data-original-title', '');
							$('#'+id).removeClass('invalid');
						}
					}
				}
				
				invalidCount += cnt;
			}
			this.result.invalidCount = invalidCount;
			this.checkMajorCnt = 0;
			this.checkMinorCnt = 0;
			return this.result;
		},
		getResult: function(id, require, min, max, data, up ,down) {
			if(require == true) { 
				this.result[id]['require'] = this.checkReq(data);
			} else if(require == 'num') {
				this.result[id][require] = this.checkNum(data);
			} else if(require == 'str') {
				this.result[id][require] = this.checkStr(data);
			} else if(require == 'ip4') {
				min = undefined;
				this.result[id][require] = this.checkIp4(data);
			} else if(require == 'ip6') {
				min = undefined;
				this.result[id][require] = this.checkIp6(data);
			} else if(require == 'ip') {
				min = undefined;
				this.result[id] = {};
				var ip4 = this.checkIp4(data);
				var ip6 = this.checkIp6(data);
				if(ip4) {
					this.result[id]['ip4'] = this.checkIp4(data);
				} else {
					this.result[id]['ip6'] = this.checkIp6(data);
				}
			} else if(require == 'userId') {
				this.result[id][require] = this.checkUserIdReq(data);
			} else if(require == 'checkPw') {
				this.result[id][require] = this.checkPw(data);
			} else if(require == 'checkSlaSeverity') {
				this.result[id][require] = this.checkSlaSeverity(data, id);
			}
			
			if(min != 0) {
				if(data.length < min) {
					this.result[id]['min'] = false;
				} else {
					this.result[id]['min'] = true;
				}
			}
			
			if(up){
				this.result[id]['up'] = this.compareUp(data, up);
			}else if(down){
				this.result[id]['down'] = this.compareDown(data, down);
			}
			
		},			
		
		compareUp: function(data, others){
			let result = false;
			let others_count = others.length;
			try{
				for(var i=0; i < others_count; i++){
					var target = others[i];
					if(data > target){ result = true; }
					else { result = false; }
				}
			}catch(e){
				console.log(e);
				result = false;
			}
			return result;
		},			
		
		compareDown : function(data, other){
			let result = false;
			let others_count = others.length;
			try{
				for(var i=0; i < others_count; i++){
					var target = others[i];
					if(data < target){ result = true; }
					else { result = false; }
				}
			}catch(e){
				console.log(e);
				result = false;
			}
			return result;
		},			
		
		checkUserIdReq: function(data) {
			var hanChk = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
			//var check = /^[a-zA-Z0-9]+$/;/*영문, 숫자*/
			var check = /^[a-zA-Z]+[a-zA-Z0-9]+$/;/*영문으로 시작하는 영문 숫자*/
			//var check = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/;/*영문+숫자 조합*/
			var spaceCheck = /\s/g;

			if(data == undefined || data == '') {
				return false;
			} else {

				if(hanChk.test(data)) {
					return false;
				}

				if((check.test(data)) && (!spaceCheck.test(data))) {
					return true;
				} else {
					return false;
				}
			}
		},			
		checkReq: function(data) {
			var _data = data.replace(/\s/g,'');
			if(_data == undefined || _data == '') {
				return false;
			} else {
				return true;
			}
		},
		checkNum: function(data) {
			var _data = data;
			if(_data == '') return false;
			var numChk = /^[0-9]*$/;
			return numChk.test(_data);
		},
		checkStr: function(data) {
			var _data = data;
			if(_data == '') return false;
			var strChk = /[a-zA-Z]/;
			return strChk.test(_data);
		},
		checkIp4: function(data) {
		    var _data = data;
		    if(_data == '') return false;
			var ip4 = /(^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$)|(^\*$)|(^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){0,2}\*$)$/;
		    return ip4.test(_data);
		},
		checkIp6: function(data) {
		    var _data = data;
		    if(_data == '') return false;
			var ip6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\*$)$/
		    return ip6.test(_data);
		},
		checkPw: function(data) {
			var bool = true;
			var _data = data;
			if(_data == '') return false;
//			var pwStrChk = /^.*(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
//			var pwRepeatChk = /(.)\1/;
//			if(!pwStrChk.test(_data)) bool = false;
//			if(!pwRepeatChk.test(_data)) bool = false;
			
			var pwStrChk = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{9,16}$/;
			var pwRepeatChk = /(\w)\1\1/;
			if(!pwStrChk.test(_data)) bool = false;
			if(pwRepeatChk.test(_data)) bool = false;
			return bool;
		},
		checkSlaSeverity: function(data, id) {
			var bool = true;
			var _data = data;
			
			if(_data == '') return false;
			var numChk = /^[0-9]*$/;
			if(!numChk.test(_data)) {
				bool = false;
			}
			return bool;
		}
	}
	
$.widget("yescore.loading", {
	options: {
		
	},
	el: {
		_id : null,
		_class : null,
	},
	_create: function() {
		this.init();
	},
	_destroy: function() {
		this.options = {};
		$.removeData(this.element.get(0));
	}
});

$.extend( $.yescore.loading.prototype, {
	init: function() {
		this.el._id = this.element.attr("id");
		this.el._class = this.element.attr("class");
		this.render();
	},
	destroy: function() {
		$(this.element).loadingModal('destroy');
	},
	render : function() {
		$(this.element).loadingModal({
			  position: 'auto',
			  text: 'Please Wait...',
			  color: '#fff',
			  opacity: '0.7',
			  backgroundColor: 'rgb(0,0,0)',
			  animation: 'circle'
			});
		//this.hide();
	},
	hide : function(){
		$(this.element).loadingModal('hide');

	},
	show: function(){
		$(this.element).loadingModal('show');
	}
	/*
	 * 
	 * $('body').loading()
	 * 
	 * 
	 * */
	 
});	