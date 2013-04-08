/*
* Modules entity
*/
modules["Parser-book"] = (function(){

	//global


	var _left = $("#rawtext .left-twin");
	var _right = $("#rawtext .right-twin");
	var _context_left = $("#js-context-left");
	var _context_right = $("#js-context-right");
	var _json_ = $("#alignments");

	_json_ = JSON.parse(_json_.html());

	var pre = function(_section, _context, _sent_class, _id_prefix){
		//_context.html(_left.html());
		//console.log(_section);
		$(_section).find("p").each(function (i, p) {
		    var _new_p = $("<p></p>").appendTo(_context);
		    $(p).find(".sentence").each(function (i, sent) {
		    	_new_p.append('<span class="' + _sent_class + '" id="' + _id_prefix + '-' +
		    		$(sent).attr("id") + '">' +
		    		$(sent).html() + '</span>');
		    });
		})

	}

	var action = function(sentence, left_or_right){
		var current_opened = null;

		sentence.bind("click", function(){
			var self = $(this);
			var _top_el = self.offset().top;
			//Caculate the height
			window.current_selected = {
				top : _top_el,
				id : self.attr("id")
			}
			//end
			var id = left_or_right == 0 ? (/left-(.+)/g).exec(self.attr("id"))[1] :
				id = (/right-(.+)/g).exec(self.attr("id"))[1];
			var find = null;
			for(var i = 0; i < _json_.length; i++){
				var _object = _json_[i];
				if((left_or_right == 0 ? _object["BookmarkId1"] : _object["BookmarkId2"]) == id){
					find = _object;
					break;
				}
			}
			if(find){
				//when another tooltip is opened close it!
				if(current_opened) current_opened.tooltip("hide");
				//end
				var tr = (left_or_right == 0 ? find["BookmarkId2"] : find["BookmarkId1"]);
				self.attr("title", $("#" + tr).html());

				addingT(self, left_or_right, tr);
				self.attr("data-trigger", "manual").tooltip("show");
				//timer
				var tootip_timer = setTimeout(function(){
					self.tooltip("hide");
				}, 4000);
				//end
				self.addClass("light-sentence");
				self.bind("mouseleave", function(){
					$(this).removeClass("light-sentence");
				});
				current_opened = self;
			}
			else{
				//throw new Exception("Some error");
			}
		});
	}

	var addingT = function(_object_, left_or_right, tr){
		if(!_object_) return false;
		_object_.on("shown", function(){
			//trigger when tooltip start work
			var _tooltip = $(".tooltip-inner");
			if(!_tooltip.attr("changed")){
				_tooltip.attr("changed", true);
				var id = left_or_right == 0 ? (/left-(.+)/g).exec(_object_.attr("id"))[1] :
					id = (/right-(.+)/g).exec(_object_.attr("id"))[1];
				console.log(id);
				var _html = "<div class=tooltip-control-button><a href=# data-to=" + tr +
				 		        " class=change-language>Switch Language</a> <a href=# data-to="
				 		        + tr +" class=edit-mark>Align</a></div>"
			    //_tooltip.after(_html);                
				_tooltip.parent().append(toStaticHTML(_html));
			}

			//wait
			setTimeout(function(){
				_bind_actions(left_or_right);
			}, 100);
		});

		var _bind_actions = function(left_or_right){
			$(".change-language").on("click", function(){
				var _id = $(this).attr("data-to");

				var _finder = null;
				if(left_or_right == 0) {
					_finder = $("#right-" + _id);

				} else {
					_finder = $("#left-" + _id);
				}
				console.log(_finder);
				//saving the coordinates of current sentence
				var _current_top = $(this).offset().top;
				//end
				window.action(1 - left_or_right, _finder);
				return false;
			});
			$(".edit-mark").on("click", function(){
				var _id = $(this).attr("data-to");

				var _finder = $("#sent-" + _id);

				window.action(2, _finder);
				
				return false;
			});
		}
	}

	pre(_left, _context_left, "left-sent", "left");	
	pre(_right, _context_right, "right-sent", "right");
	action($(".left-sent"), 0);
	action($(".right-sent"), 1);

});

modules["Change-Editor-Mode"] = (function(mode, arg){

	window.mode = 3;

	var to_mode = function(to_mode, sent){
		if(window.mode == to_mode)
			return false;
		//global
		window.namespace.scroll[window.mode] = window.scrollY;
		$(".mode").hide();

		switch (window.mode) {
			case 0: break;
			case 1: break;
			case 2: break;
			case 3: $("#twin-pages-menu").hide(); break;
			default: break;
		}

		switch (to_mode) {
			case 0: $("#read-mode-left").show(); break;
			case 1: $("#read-mode-right").show(); break;
			case 2: $("#table-mode").show(); break;
			case 3:
				$("#twin-pages-mode").show();
				$("#twin-pages-menu").show();
				break;
			default: $("#read-mode-left").show(); break;
		}
//		console.log(sent.scrollTop());
		if (sent && (sent instanceof jQuery && sent.length > 0)) {
		    var _top_value = sent.offset().top - 200;
		    console.log(_top_value);
			_top_value = _top_value > 0 ? _top_value:0;
			window.scrollTo(0, _top_value);

			if (to_mode < 2) {
			    //change background color of finder element
			    //sent.css("background-color", "rgb(73, 202, 73)");
				sent.animate({ backgroundColor: "rgb(73, 202, 73)" }, 200)
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);
			}

			if (to_mode == 2) {
			    //change background color of finder element
			    sent.css("background-color", "rgb(73, 202, 73)");
				/*sent.parents(".mark").find(".twins")
					.animate({ backgroundColor: "rgb(73, 202, 73)" }, 200)
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);*/
			}
		}
		else{
			//window.namespace;
			if(window.namespace.scroll[to_mode])
				window.scrollTo(0, window.namespace.scroll[to_mode]);
		}

		window.mode = to_mode;

	}

	window.action = to_mode;
	
});

modules["tooltip-twin"] = (function(){
	$(document).ready(function(){
		_reminder();
	});

	var _reminder = function(){
		var _active = $(".twin-sent");
		var _last = null;
		_active.bind("click", function(){
			//hide the tooltip that was showed
			if(_last) _last.tooltip("hide");
			//end
			var _id = $(this).attr("id");
			$(this).attr("title", " ");
			$(this).attr("data-trigger", "manual");
			if(/US/.test(_id)){
				//show tooltip on right of app
				$(this).attr("data-placement", "right");
				$(this).tooltip("show");
			}
			else{
				//show tooltip on left of app
				$(this).attr("data-placement", "left");
				$(this).tooltip("show");
			}
			_last = $(this);
		});
	}
	var _show_t = function(){

	}
});