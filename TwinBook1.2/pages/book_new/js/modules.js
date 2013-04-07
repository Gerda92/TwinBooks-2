/*
* Modules entity
*/
modules["Parser-book"] = (function(){

	var _left = $("#rawtext .left-twin");
	var _right = $("#rawtext .right-twin");
	var _context = $("#js-context");
	var _json_ = $("#alignments");

	var pre = function(){
		//_context.html(_left.html());
		_json_ = JSON.parse(_json_.html());

		$(_left).find("p").each(function (i, p) {
		    _context.append("<p>");
		    $(p).find(".sentence").each(function (i, sent) {
		    	_context.append('<span class="left-sent" id="left-' +
		    		$(sent).attr("id") + '">' +
		    		$(sent).html() + '</span>');
		    });
		    _context.append("</p>");
		})

	}

	var action = function(){
		var sentence = $(".left-sent");
		var current_opened = null;

		sentence.bind("click", function(){
			var self = $(this);
			var id = (/left-(.+)/g).exec(self.attr("id"))[1];
			var find = null;
			for(var i = 0; i < _json_.length; i++){
				var _object = _json_[i];
				if(_object["BookmarkId1"] == id){
					find = _object;
					break;
				}
			}
			if(find){
				//when another tooltip is opened close it!
				if(current_opened) current_opened.tooltip("hide");
				//end
				var tr = find["BookmarkId2"];
				self.attr("title", $("#" + tr).html());
				addingT(self);
				self.attr("data-trigger", "manual").tooltip("show");
				self.addClass("light-sentence");
				self.bind("mouseleave", function(){
					$(this).removeClass("light-sentence");
				});
				current_opened = self;
			}
			else{
				throw new Exception("Some error");
			}
		});
	}

	var addingT = function(_object_){
		if(!_object_) return false;
		_object_.on("shown", function(){
			//trigger when tooltip start work
			var _tooltip = $(".tooltip-inner");
			if(!_tooltip.attr("changed")){
				_tooltip.attr("changed", true);
				var id = (/left-(.+)/g).exec(_object_.attr("id"))[1];
				var _html = "<div class=tooltip-control-button><a href=# to=" + id +
				 		        " class=change-language>Switch Language</a> <a href=# to="
				 		        + id +" class=edit-mark>Align</a></div>"
				//_tooltip.after(_html);
			}

			//wait
			setTimeout(_bind_actions, 100);
		});

		var _bind_actions = function(){
			$(".change-language").on("click", function(){
				return false;
			});
			$(".edit-mark").on("click", function(){
				var _id = $(this).attr("to");
				window.action();
				var _finder = $("#sent-" + _id);
				//change background color of finder element
				_finder.parents(".mark").find(".twins")
					.animate({ backgroundColor: "rgb(73, 202, 73)" }, 200)
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);
				//end
				var _top_value = _finder.offset().top - 200;
				_top_value = _top_value > 0 ? _top_value:0;
				window.scrollTo(0, _top_value);
				return false;
			});
		}
	}

	pre.call();
	action.call();
	addingT.call();
});

modules["Change-Editor-Mode"] = (function(){


	var some_action = function(){
		$("#read-mode").toggle();
		$("#table-mode").toggle();
	}
	window.action = some_action;
	
});