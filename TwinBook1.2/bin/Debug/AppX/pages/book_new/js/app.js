var core = {
	init : function(){
		//this function is main it will be replaced
	}
}
/*
* Core initilizing
*/
core.init = function(){
	//create global namespace 
	window.namespace = {
		scroll : []
	}
	//starting all modules
	modules.init.call();
}
/*
* Modules definition and realizition
*/
var modules = {}
var sandbox = {}
modules["init"] = (function(){
	var _self = modules;
	var _system_loading = ["init"];
	for(var i in _self){
		var _state = true;
		for(var j = 0; j < _system_loading.length; j++){
			if(_system_loading[j] == i){
				_state = false;
				break;
			}
		}
		if(_state){
			_self[i].call();
			console.log("Function => {" + i + "} loaded")
		}
	}
});


//when all ready
$(document).ready(function(){
	core.init.call();
});
