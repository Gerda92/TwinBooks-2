$(document).ready(function () {    
    processing();
	worker();
	update();
});


var worker = (function(){
	//Main controller
	var _config = {
		$content : $(".bb-bookblock"),
		$navPrev : $("#control-prev-action"),
		$navNext : $("#control-next-action"),
		$navPlay : $("#control-play-action"),
		$currPage : $("#js-current-page"),
		$totalPage : $("#js-total-page")
	}

	_config.$totalPage.html(self.T_PAGE);

	var ACT = _config.$content.bookblock({
		speed : 800,
		shadowSides : 0.8,
		shadowFlip : 0.7
	});
	
	var $slides = _config.$content.children(),
			totalSlides = $slides.length;
	var _act_reset = (function(){
		_config.$navPrev.bind("click", function(event){
			ACT.prev();
			
			var pg = _config.$currPage;
			var vl = parseInt(pg.html());
			if(vl > 1)
				vl--;
			pg.html(vl);

			return false;
		});
		_config.$navNext.bind("click", function(event){
			ACT.next();

			var pg = _config.$currPage;
			var vl = parseInt(pg.html());
			if(vl < parseInt(_config.$totalPage.html()))
				vl++;
			pg.html(vl);

			return false;
		});
		_config.$navPlay.bind("click", function(event){
			return false;
		});
	});

	//calling action
	_act_reset.call();
});


var processing = (function(){
	/*
	*Creating book doom and processing it!
	*/
	var container = $(".bb-bookblock"),
			memory    = $(".none"),
			sentence  = $(".left-twin").find(".sentence"),
			step      = 20,
			api 			= kit();

	if(!isEmpty(container) && !isEmpty(memory) && !isEmpty(sentence)){
		
		//global space {INT}
		self.T_PAGE = sentence.length / step | 0;

		for(var i = 0; i < sentence.length; i += step){
			var el = document.createElement("p");
					el.className = "text";
			for(var j = i; j < i + step; j++){
				$(sentence[j]).attr("data-trigger", "hover");
				$(sentence[j]).clone().appendTo($(el));
			}
			var item = document.createElement("div");
					item.className = "bb-item";
			item.appendChild(el);
			container.append(item);
		}

	}
	else{
		throw new Exception("Some object is null!");
	}

	/*
	*Private methods
	*/
	function isEmpty(jqueryObject){
		return jqueryObject.length == 0 ? true : false;
	}
});

var kit = (function(){
	//return false;?
	/*
	*Creating the template by using factory method
	*/
	var factory = {
		_create_Sentence : function(_text_){
			if(_text_ instanceof Array){
				var collection = [];
				for(var i in _text_){
					//collection.push(createSingleS(_text_[i]));
				}
				return collection;
			}
			throw new Exception("Need array input!");
		},
		_create_Page : function(_arr_){
			var mem = _arr_;
			var element = document.createElement("div");
			element.className = "bb-item";
			for(var i in mem){
				if(mem[i] !== undefined)
					element.appendChild(mem[i]);
			} 
			return element;
		}
	};
	/*
	*Private methods
	*/
	function createSingleS(_s_){
		var element = document.createElement("p");
		element.className = "text";
		element.innerHTML = _s_;
		return element;
	}
	/*
	*Return object with api
	*/
	return {
		_createSentence : factory._create_Sentence,
		_createPage : factory._create_Page
	}
});	

var update = (function(){
	/*
	*Processing the click event for senteces
	*/
	var _bind = function(){
		$(".sentence").bind("click", function(){
			//$(this).tooltip("show");
		});
		$(".sentence").bind("mousemove", function(){
			$(this).css("background", "rgb(220, 241, 230)");
		});
		$(".sentence").bind("mouseleave", function(){
			$(this).css("background", "white");
			var those = $(this);
			setTimeout(function(){
				//those.tooltip("hide");
			}, 900);
		});
	}

	var _parseJson = function(){
		/*
		*Parsing json object
		*/
		var jsonObject = JSON.parse($(".alignments").html());
		if(jsonObject instanceof Array){
			var markId1 = "BookmarkId1",
					markId2 = "BookmarkId2";
			self.CONNECTION = [];
			for(var i = 0; i < jsonObject.length; i++){
				var _current = jsonObject[i];
				self.CONNECTION[_current[markId1]] = _current[markId2] || "-1";
			}
		}
	}

	var _setTitles = function(){
		self.ERROR_T = 0;
		var _parent = $("#app-content-page");
		_parent.find(".sentence").each(function(){
			var _target = $(this).attr("id");
			//get from global storage
			var connector = self.CONNECTION[_target];
			var vl = $("#" + connector).html();
			vl = vl || "UNDEFINED, TRANS.TEXT NOT FINED!";
			$(this).attr("title", vl);
			//CALCULATING ERROR NUMBER
			if(vl === "UNDEFINED, TRANS.TEXT NOT FINED!")
				self.ERROR_T++;
		});
	}
	/*
	*Calling the queue of actions
	*/
	_parseJson.call();
	_setTitles.call();
	_bind.call();

	//adding tooltips
	$(".sentence").tooltip();
});