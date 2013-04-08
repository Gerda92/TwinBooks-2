modules["One-Language-Mode"] = (function(){

	var _left = $("#rawtext .left-twin");
	var _right = $("#rawtext .right-twin");
	var _context_left = $("#js-context-left");
	var _context_right = $("#js-context-right");

	window.bindings = JSON.parse($("#alignments").html());

	var pre = function(_section, _context, _sent_class, _id_prefix){

		$(_section).find("p").each(function (i, p) {
		    var _new_p = $("<p></p>").appendTo(_context);
		    $(p).find(".sentence").each(function (i, sent) {
		    	_new_p.append('<span class="' + _sent_class + '" id="' + _id_prefix + '-' +
		    		$(sent).attr("id") + '">' +
		    		$(sent).html() + '</span>');
		    });
		})

	}

	var bind_tooltips = function (sentence, left_or_right) {

	    window.current_tooptip = null;

	    sentence.bind("click", function () {

	        //when another tooltip is opened close it!
	        if (window.current_tooptip) window.current_tooptip.tooltip("hide");
	        //end

            window.show_tooltip($(this), left_or_right);
	    });

	    $(document).mousedown(function (event) {
	        if (event.which == 3) {
	            if (window.current_tooptip)
	                window.current_tooptip.tooltip("hide");
	            window.current_tooptip = null;
	        }
	    });

	}

	window.show_tooltip = function (subject, left_or_right) {

	    var id = left_or_right == 0 ? (/left-(.+)/g).exec(subject.attr("id"))[1] :
            (/right-(.+)/g).exec(subject.attr("id"))[1];

	    var find = null;
	    for (var i = 0; i < window.bindings.length; i++) {
	        var mark = window.bindings[i];
	        if ((left_or_right == 0 ? mark["BookmarkId1"] : mark["BookmarkId2"]) == id) {
	            find = mark;
	            break;
	        }
	    }

	    if (find) {

	        var target = (left_or_right == 0 ? find["BookmarkId2"] : find["BookmarkId1"]);
	        subject.attr("title", $("#" + target).html());
	        subject.attr("data-original-title", $("#" + target).html());

	        window.add_tooltip_buttons(subject, left_or_right, target);
	        subject.attr("data-trigger", "manual").tooltip("show");
	        
	        //timer
	        var tootip_timer = setTimeout(function () {
	            subject.tooltip("hide");
	        }, 4000);
	        //end
	        
	        subject.addClass("light-sentence");
	        subject.bind("mouseleave", function () {
	            $(this).removeClass("light-sentence");
	        });
	        window.current_tooptip = subject;
	    }
	    else {
	        //throw new Exception("Some error");
	    }
	}

	window.add_tooltip_buttons = function (_object_, left_or_right, target, from_twin) {

		if(!_object_) return false;
		_object_.on("shown", function(){
			//trigger when tooltip start work
			var _tooltip = $(".tooltip-inner");
			var buttons = "<a href=# data-to=" + target +
				 		        " class=change-language></a><a href=# data-to="
				 		        + target + " class=edit-mark></a>";
            if (!from_twin) buttons += "<a href=# data-to=" + target + " class=change-twin></a>";
			if (!_tooltip.attr("changed")) {

			    _tooltip.attr("changed", true);

			    var _html = "<div class=tooltip-control-button>" + buttons + "</div>"
			    //_tooltip.parent().append(toStaticHTML(_html));
			    if (from_twin) {
			    	_tooltip.html(buttons);
			    } else {
				    _tooltip.parent().append(_html);
				}
			} else {
				if (from_twin) {
			    	_tooltip.html(buttons);
			    } else {
			    	_tooltip.parent().find(".tooltip-control-button").html(buttons);
			    }
			}

			_bind_actions(left_or_right);
		    /*
            //wait
            setTimeout(function(){
				_bind_actions(left_or_right);
			}, 100);
            */
		});

		var _bind_actions = function(left_or_right){
		    $(".change-language").on("click", function(){
		        var _id = $(this).attr("data-to");

		        var _finder = null;
		        if(left_or_right == 0) {
		            _finder = "#right-" + _id;
		        } else {
		            _finder = "#left-" + _id;
		        }

		        //end
		        window.action(1 - left_or_right, _finder);
				return false;
			});
			$(".edit-mark").on("click", function(){
				var _id = $(this).attr("data-to");

				var _finder = "#sent-" + _id;

				window.action(2,  _finder);
				
				return false;
			});
			$(".change-twin").on("click", function () {
			    var _id = $(this).attr("data-to");

			    _finder = "#twin-" + _id;
			    window.action(3, _finder);
			    return false;
			});
		}
	}

	pre(_left, _context_left, "left-sent", "left");	
	pre(_right, _context_right, "right-sent", "right");
	bind_tooltips($(".left-sent"), 0);
	bind_tooltips($(".right-sent"), 1);

});

modules["Change-Mode"] = (function(){

	window.mode = 3;

	var to_mode = function(to_mode, sentence_id){
		if(window.mode == to_mode)
		    return false;

		//global
		window.namespace.scroll[window.mode] = $(window).scrollTop();

		$(".mode").hide();

		switch (window.mode) {
		    case 0:
		        if (window.current_tooptip)
		            window.current_tooptip.tooltip("hide");
		        window.current_tooptip = null;
		        break;
		    case 1:
		        if (window.current_tooptip)
		            window.current_tooptip.tooltip("hide");
		        window.current_tooptip = null;
		        break;
			case 2: break;
			case 3: $(".twin-pages-menu").hide(); break;
			default: break;
		}

		switch (to_mode) {
			case 0: $("#read-mode-left").show(); break;
			case 1: $("#read-mode-right").show(); break;
			case 2: $("#table-mode").show(); break;
		    case 3:
		        $("#twin-pages-mode").show();
		        $(".twin-pages-menu").show();
		        if (window.bindings_changed) {
		            window.reload_twin_mode.call();
		            window.bindings_changed = false;
		            window.to_page(window.twin_page);
		        }
				break;
			default: $("#read-mode-left").show(); break;
		}

		var sent = $(sentence_id);
        
        // if sentence passed, scroll to sentence; otherwise where I left it
        if (sentence_id) {

            // scroll to sentence
		    var _top_value = sent.offset().top - 200;
			_top_value = _top_value > 0 ? _top_value:0;
			window.scrollTo(0, _top_value);

            // if one language view
			if (to_mode < 2) {
				if (window.current_tooptip) window.current_tooptip.tooltip("hide");
			    window.show_tooltip(sent, to_mode);
			}

            // if aligner mode
			if (to_mode == 2) {
			    //change background color of finder element
				sent.parents(".mark").find(".twins")
					.animate({ backgroundColor: "rgb(73, 202, 73)" }, 200)
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);
			}

			if (to_mode == 3) {
			    //change background color of finder element

			    var page = (/twin-page-(.+)/g).exec(sent.parents(".twin-page").attr('id'))[1];

			    window.twin_page = page;
			    window.to_page(page);
			    /*
				sent.animate({ backgroundColor: "rgb(73, 202, 73)" }, 200)
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);*/

				var i = parseInt($(sent).attr('data-mark'));
				$('#twin-' + window.bindings[i].BookmarkId1)
					.nextUntil('#twin-' + window.bindings[i + 1].BookmarkId1, ".twin-sent")
					.andSelf().css("background-color", "rgb(73, 202, 73)")
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);
			    $('#twin-' + window.bindings[i].BookmarkId2)
					.nextUntil('#twin-' + window.bindings[i + 1].BookmarkId2, ".twin-sent")
					.andSelf().css("background-color", "rgb(73, 202, 73)")
					.animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);
			}
		}
		else{
			if(window.namespace.scroll[to_mode])
				window.scrollTo(0, window.namespace.scroll[to_mode]);
		}

		window.mode = to_mode;

	}

	window.action = to_mode;
	
});

modules["Twin-Mode-Tooltips"] = (function () {

	$(document).ready(function(){
		window.bind_wtin_tooltips();
	});

	window.bind_wtin_tooltips = function () {
		var sentences = $(".twin-sent");

		sentences.bind("click", function(){
			//hide the tooltip that was shown
	        if (window.current_tooptip)
	            window.current_tooptip.tooltip("hide");
			//end
			var _id = $(this).attr("id");

			var pure_id = (/twin-(.+)/g).exec(_id)[1];

			$(this).attr("title", " ");
			$(this).attr("data-trigger", "manual");
			if ($(this).parents(".two-left").length > 0) {
			    window.add_tooltip_buttons($(this), 1, pure_id, true);
				$(this).attr("data-placement", "bottom");
				$(this).tooltip("show");
			}
			else{
			    window.add_tooltip_buttons($(this), 0, pure_id, true);
				$(this).attr("data-placement", "bottom");
				$(this).tooltip("show");
			}
			window.current_tooptip = $(this);
		});
	}

});