modules["Twin-Mode"] = (function(){

	var _left = $("#rawtext .left-twin");
	var _right = $("#rawtext .right-twin");
	var _context = $("#twin-table");

	var _json_ = $("#alignments");

	var _bindings = JSON.parse(_json_.html());


	var pre = function(_bindings, _table){

		var page_num = 1;

		var tr = $('<tr id="twin-page-1" class="twin-page"></tr>').appendTo(_table);
		var tdl = $('<td class="two-left"></td>').appendTo(tr);
		var tdr = $('<td class="two-right"></td>').appendTo(tr);

		var pl = $("<p></p>").appendTo(tdl);
		var pr = $("<p></p>").appendTo(tdr);

		for (var i = 0; i < _bindings.length - 1; i++) {

			var bm1 = $('#' + _bindings[i].BookmarkId1)
				.nextUntil('#' + _bindings[i + 1].BookmarkId1, ".sentence").andSelf();

			bm1.each(function (j, sent) {

		    	var span = $(stringSentence(sent, i)).appendTo(pl);

		    	if ($(sent).next().length == 0)
					pl = $("<p></p>").appendTo(tdl);
		    });

		    var bm2 = $('#' + _bindings[i].BookmarkId2)
				.nextUntil('#' + _bindings[i + 1].BookmarkId2, ".sentence").andSelf();

			bm2.each(function (j, sent) {

		    	var span = $(stringSentence(sent, i)).appendTo(pr);

		    	if ($(sent).next().length == 0)
					pr = $("<p></p>").appendTo(tdr);
		    });	

		    if (tr.height() + 175 > $(window).height()) {

		    	page_num++;

		    	tr = $('<tr id="twin-page-' + page_num +
		    		'" class="twin-page" style="display:none;" ></tr>').appendTo(_table);
				tdl = $('<td class="two-left"></td>').appendTo(tr);
				tdr = $('<td class="two-right"></td>').appendTo(tr);

				pl = $("<p></p>").appendTo(tdl);
				pr = $("<p></p>").appendTo(tdr);
		    }
		}

	}

	var bind_nav = function() {
		$("#js-to-twin-back").click(function(){
			if (twin_page == 1) return false;
			window.to_page(--window.twin_page);
			return false;
		});
		$("#js-to-twin-for").click(function(){
			if (window.twin_page == window.twin_pages_count) return false;
			window.to_page(++window.twin_page);
			return false;
		});
	}

	var bind_sents = function() {
		$(".twin-sent").hover(function(){
			var i = parseInt($(this).attr('data-mark'));
			$('#twin-' + _bindings[i].BookmarkId1)
				.nextUntil('#twin-' + _bindings[i + 1].BookmarkId1, ".twin-sent")
				.andSelf().css("background-color", "rgb(209, 237, 245)");
			$('#twin-' + _bindings[i].BookmarkId2)
				.nextUntil('#twin-' + _bindings[i + 1].BookmarkId2, ".twin-sent")
				.andSelf().css("background-color", "rgb(209, 237, 245)");
		},
		function() {
			$(".twin-sent").css("background-color", "");
		});

		window.twin_page = 1;

		window.twin_pages_count = $(".twin-page").length;

		$("#twin-pages-menu .page-info").html(window.twin_page
			+ '/' + window.twin_pages_count);

	}


	var stringSentence = function(sent, data_mark) {
        return '<span class="twin-sent" id="twin-' + sent.id +
            '" data-mark="' + data_mark + '">' + $(sent).html() + '</span>'
    }


    var calculate_height = function(){
    	var table = $("#twin-table");
    	var arr = table.find("tr") || [];
    	var _max_h = 0;
    	for(var i = 0; i < arr.length; i++){
    		$(arr[i]).find("p").last().css("margin-bottom", 0)
    		.parent().parent().css("overflow-y", "hidden");
    		_max_h = Math.max(_max_h, $(arr[i]).height());
    	}
    	$("#twin-table tr").height(_max_h - 20);
    }

	pre(_bindings, _context);
	calculate_height.call();
	bind_nav.call();
	bind_sents.call();

});

modules["Twin-Mode-Pagination"] = (function(){

	var action = function(page) {
		$(".twin-page").hide();
		$("#twin-page-" + page).show();
		$("#twin-pages-menu .page-info").html(window.twin_page
			+ '/' + window.twin_pages_count);
	}

	window.to_page = action;

});