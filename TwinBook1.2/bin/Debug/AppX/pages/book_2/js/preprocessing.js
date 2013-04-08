modules["sticky-header"] = (function(){

	var _header = $("#js-sticky-header");
	//css params
	var _header_before_width = 803;//_header.width();
	var _header_before_height = 41;//_header.height();

	$(window).bind("scroll", function(ev){
	    var scrollY = $(window).scrollTop();

	    if (scrollY > 0) {
	        _header.addClass("sticky-header");
	        //_header.attr('style', "position:fixed;top : 0;width : auto;z-index : 100;")
	        _header.css("height", _header_before_height);
			_header.css("width", _header_before_width);
		}
		else if(scrollY <= 0 && _header.hasClass("sticky-header"))
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