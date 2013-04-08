modules["sticky-header"] = (function(){

	var _header = $("#js-sticky-header");
	//css params
	var _header_before_width = _header.css("width");
	var _header_before_height = _header.css("height");

	$(window).bind("scroll", function(ev){
		var scrollY = window.scrollY;
		if(scrollY > 5){
			_header.addClass("sticky-header");
			_header.css("width", _header_before_width);
		}
		else if(scrollY <= 5 && _header.hasClass("sticky-header"))
			_header.removeClass("sticky-header");
	});

});

modules["another-mode"] = (function(){
	var btn = $(".side-options a");
	btn.bind("click", function(){
		switch ($(this).attr('id')) {
			case "js-to-left": window.action(0); break;
			case "js-to-right": window.action(1); break;
			case "js-to-align": window.action(2); break;
			case "js-to-twin-pages": window.action(3); break;
			default: break;
		}
		return false;
	});

});