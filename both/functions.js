//global variables

MINIMUM_EASY = sigmoid(2);
MINIMUM_MEDIUM = sigmoid(-2);
MAXIMUM_HARD = sigmoid(-4);
WIDTH = 4;


//global functions

sigmoid = function(x){
	return 1./(1+Math.exp(-x));
}

inverseSigmoid = function(x){
	return -Math.log(x/(1-x));
}

buildSet = function(list){
	var set = {};
	for( var i = 0 ; i < list.length ; i++ ){
		var key = list[i];
		set[key] = WIDTH;
	}
	set["bias"] = WIDTH*(list.length - 1);
	return set;
}

removeOcurrences = function(item,list){
      for(var i = list.length; i--;) {
          if(list[i] === item) {
              list.splice(i, 1);
          }
      }
  }
	
}