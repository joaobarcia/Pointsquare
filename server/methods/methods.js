//math functions

sigmoid = function(x) {
    return 1. / (1 + Math.exp(-x));
}

inverseSigmoid = function(x) {
    return -Math.log(x / (1 - x));
}

box = function(x) {
    return x>1?1:(x<0?0:x);
}

//server variables

MINIMUM_EASY = sigmoid(2);
MINIMUM_MEDIUM = sigmoid(-2);
MAXIMUM_HARD = sigmoid(-4);
WIDTH = 6;

var RATE = 0.1;
var MAX_STEPS = 10000;
var MIN_STEPS = 10;
var TOLERANCE = 0.005;

//server functions

buildSet = function(list) {
    var set = {};
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        set[key] = WIDTH;
    }
    set["bias"] = -WIDTH * (list.length - 1);
    return set;
}

removeOcurrences = function(item, list) {
    for (var i = list.length; i--;) {
        if (list[i] === item) {
            list.splice(i, 1);
        }
    }
}

//getState should only be used for content or concepts!
getState = function(nodeID,userID){
    var node = Nodes.findOne({ _id: nodeID });
    var edge = Edges.findOne({
        from: userID,
        to: nodeID
    });
    return edge? (edge.state? edge.state : 0) : 0;
}

//updates the database value of the state
setState = function(state,nodeID,userID){
    var edge = Edges.findOne({
        from: userID,
        to: nodeID
    });
    if( edge ){
        Edges.update({ _id: edge._id },{
            $set: { state: state }
        })
    }
    else{
        Edges.insert({
            from: userID,
            to: nodeID,
            state: state
        })
    }
}

//returns the state of a requirement set
computeSetState = function(setID,userID){
    var set = Sets.findOne(setID).set;
    var arg = 0.;
    for( var concept in set ){
        var state = (concept == "bias")? 1 : getState(concept,userID);
        var weight = set[concept];
        arg += state*weight;
    }
    return sigmoid(arg);
}

//computes the state but does not write into the database
computeState = function(nodeID,userID){
    var node = Nodes.findOne(nodeID);
    var setIDs = node.from.need;
    //if it's a microconcept, do not update
    if( setIDs.length == 0 ){
        if( node.type == "concept" ){
            return getState(nodeID,userID);
        }
        else if( node.type == "content" ){
            return 1;
        }
    }
    //if not pick the highest state of its requirements
    var max = 0.;
    for( var i = 0 ; i < setIDs.length ; i++ ){
        var setID = setIDs[i];
        var state = computeSetState(setID,userID);
        max = state > max ? state : max;
    }
    return state;
}

//computes the state of the node and saves it to the database
updateState = function(nodeID,userID){
    var state = computeState(nodeID,userID);
    setState(state,nodeID,userID);
    return state;
    /*var node = Nodes.findOne(nodeID);
    var setIDs = node.from.need;
    //if it's a microconcept, do not update
    if( setIDs.length == 0 ){
        if( node.type == "concept" ){
            return getState(nodeID,userID);
        }
        else if( node.type == "content" ){
            setState(1,nodeID,userID);
            return 1;
        }
    }
    //if not pick the highest state of its requirements
    var max = 0.;
    for( var i = 0 ; i < setIDs.length ; i++ ){
        var setID = setIDs[i];
        var state = computeSetState(setID,userID);
        max = state > max ? state : max;
    }
    setState(max,nodeID,userID);
    return state;*/
}

//finds all units that do not require anything
setZerothLevel = function(){
    return Nodes.update({
        type: "content",
        "from.need": []
    },{
        $set: { level: 0 }
    },{
        multi: true
    });
}

findZerothLevel = function(){
    return Nodes.find({
        type: "content",
        "from.need": []
    }).fetch();
}

updateZerothLevel = function(userID){
    var zerothLevel = Nodes.find({
        type: "content",
        "from.need": []
    }).fetch();
    for( var i in zerothLevel ){
        var node = zerothLevel[i];
        updateState(node._id,userID);
    }
}

findForwardLayer = function(nodes){
    var layer = {};
    for( var i in nodes ){
        var nodeID = nodes[i];
        var node = Nodes.findOne(nodeID);
        if( node.type == "content" ){ continue; }
        var include = node.to.include;
        for( var j in include ){
            var setID = include[j];
            var set = Sets.findOne(setID);
            var nextNode = set.to.need;
            layer[nextNode] = true;
        }
    }
    return Object.keys(layer);
}

findBackwardLayer = function(nodes){
    var layer = {};
    for( var i in nodes ){
        var nodeID = nodes[i];
        var node = Nodes.findOne(nodeID);
        var requirements = node.from.need;
        //return requirements;
        for( var j in requirements ){
            var setID = requirements[j];
            var set = Sets.findOne(setID).set;
            //return subnodeIDs;
            for( var subnodeID in set ){
                if( subnodeID != "bias" ){ layer[subnodeID] = true; }
            }
        }
    }
    return Object.keys(layer);
}

//find forward tree (all nodes that are within reach of outgoing activation links)
findForwardTree = function(nodeIDs){
    var tree = [];
    var currentLayer = nodeIDs;
    tree.push(currentLayer);
    while(1){
        var nextLayer = findForwardLayer(currentLayer);
        if( nextLayer.length == 0 ){ break; }
        tree.push(nextLayer);
        currentLayer = nextLayer;
    }
    return tree;
}

//find backward tree (all nodes that are within reach of incoming activation links)
findBackwardTree = function(nodeIDs){
    var tree = [];
    var currentLayer = nodeIDs;
    tree.push(currentLayer);
    while(1){
        var nextLayer = findBackwardLayer(currentLayer);
        if( nextLayer.length == 0 ){ break; }
        tree.push(nextLayer);
        currentLayer = nextLayer;
    }
    return tree;
}

//update forward tree
forwardUpdate = function(node_ids,userID){
    var currentLayer = node_ids;
    while(1){
        var nextLayer = findForwardLayer(currentLayer);
        if( nextLayer.length == 0 ){ break; }
        for( var i in nextLayer ){
            var nodeID = nextLayer[i];
            updateState(nodeID,userID);
        }
        currentLayer = nextLayer;
    }
}
//FAZER UMA VERSÃO DESTA FUNÇÃO QUE DEVOLVA APENAS OS NOVOS ESTADOS SEM ESCREVER

oneLayerLearning = function(target,userID){
    var outputLayer = Object.keys(target);
    var inputLayer = findBackwardLayer(outputLayer);
    //fill in state object
    var state = {};
    for( var i in inputLayer ){
        var nodeID = inputLayer[i];
        state[nodeID] = getState(nodeID,userID);
    }
    for( var i in outputLayer ){
        var nodeID = outputLayer[i];
        state[nodeID] = getState(nodeID,userID);
    }
    //compute maximum and minimum activations
    var maxStates = {};
    var minStates = {};
    for( var nodeID in target ){
        var node = Nodes.findOne(nodeID);
        var requirements = node.from.need;
        var maxMaxActivation = 0.;
        var maxMinActivation = 0.;
        for( var j in requirements ){
            var setID = requirements[j];
            var requirement = Sets.findOne(setID);
            var set = requirement.set;
            var maxArg = 0.;
            var arg = 0.;
            for( var subnodeID in set ){
                maxArg += set[subnodeID];
                arg += set[subnodeID]*(subnodeID=="bias"?1:state[subnodeID]);
            }
            var maxActivation = sigmoid(maxArg);
            maxMaxActivation = (maxActivation>maxMaxActivation)? maxActivation : maxMaxActivation;
            var minActivation = sigmoid(set.bias);
            maxMinActivation = (minActivation>maxMinActivation)? minActivation : maxMinActivation;
            state[setID] = sigmoid(arg);
        }
        if( requirements.length == 0 ){
            maxMaxActivation = 1;
            maxMinActivation = 0;
        }
        maxStates[nodeID] = maxMaxActivation;
        minStates[nodeID] = maxMinActivation;
    }
    //update the target to realistic values
    for( var nodeID in target ){
        target[nodeID]? maxStates[nodeID] : minStates[nodeID];
    }
    //define maxmimum and minimum variations
    var maxDist = 0;
    for( var nodeID in target ){
        var dist = Math.abs( target[nodeID] - state[nodeID] );
        maxDist = maxDist < dist ? dist : maxDist;
    }
    var MAX_VAR = maxDist/MIN_STEPS;
    var MIN_VAR = maxDist/MAX_STEPS;
    //define target layer errors, save current output states and compute total error
    var saved_output = {};
    var error = {};
    var max_error = 0;
    for( var nodeID in target ){
        saved_output[nodeID] = state[nodeID];
        error[nodeID] = state[nodeID]*( 1 - state[nodeID] )*( target[nodeID] - state[nodeID] );
        max_error = Math.abs( target[nodeID] - state[nodeID] ) > max_error? Math.abs( target[nodeID] - state[nodeID] ) : max_error;
    }
    //initialize all error entries
    for( var i in inputLayer){
        var nodeID = inputLayer[i];
        error[nodeID] = 0;
    }
    //save current input states
    saved_input = {};
    for( var i in inputLayer ){
        nodeID = inputLayer[i];
        saved_input[nodeID] = state[nodeID];
    }
    //begin subnetwork update
    while(max_error > TOLERANCE){
        //reset bounds
        var is_top_set = false;
        var is_bottom_set = false;
        var upper_bound = Math.pow(10,10);
        var lower_bound = 0;
        //backpropagation
        for(var nodeID in target){
            var node = Nodes.findOne(nodeID);
            var setIDs = node.from.need;
            var max = 0;
            var activeSet = setIDs[0];
            for(var i in setIDs){
                var setID = setIDs[i];
                max = state[setID]>max? state[setID] : max;
                activeSet = state[setID]>max? setID : activeSet;
            }
            var set = Sets.findOne(activeSet).set;
            for(var subnodeID in set){
                if( subnodeID != "bias" ){
                    var weight = set[subnodeID];
                    error[subnodeID] += error[nodeID]*weight;
                }
            }
        }
        //forward propagation
        while(true){
            //increment input states
            for(var i in inputLayer){
                var nodeID = inputLayer[i];
                state[nodeID] = box( state[nodeID] + RATE*error[nodeID] );
            }
            //recompute output states
            for(var nodeID in target){
                var node = Nodes.findOne(nodeID);
                var setIDs = node.from.need;
                var max = 0;
                for(var i in setIDs){
                    var setID = setIDs[i];
                    var arg = 0;
                    for(subnodeID in set){
                        arg += set[subnodeID]*(subnodeID=="bias"?1:state[subnodeID]);
                    }
                    state[setID] = sigmoid(arg);
                    max = state[setID]>max? state[setID] : max;
                }
                state[nodeID] = max;
            }
            //compute maximum variations of output states
            var max_variation = 0;
            for(var i in outputLayer){
                var node_id = outputLayer[i];
                var variation = Math.abs( state[node_id] - saved_output[node_id] );
                max_variation = variation > max_variation ? variation : max_variation ;
            }
            //compute step quality
            var high = max_variation > MAX_VAR;
            var low = max_variation < MIN_VAR;
            //if it's OK, carry on
            if(!high&&!low){
                break;
            }
            //if it's not OK, enhance step size and repeat
            else if(high){
                var max = RATE;
                is_top_set = true;
                RATE = is_bottom_set? (upper_bound + lower_bound)/2 : RATE/2;
                //reset input
                for(var i in inputLayer){
                    var node_id = inputLayer[i];
                    state[node_id] = saved_input[node_id];
                }
                //continue;
            }
            else if(low){
                var min = RATE;
                is_bottom_set = true;
                RATE = is_top_set? (upper_bound+lower_bound)/2. : RATE*2;
                //reset input
                for(var i in inputLayer){
                    var node_id = inputLayer[i];
                    state[node_id] = saved_input[node_id];
                }
                //continue;
            }
        }
        //end of forward propagation
        //define target layer errors, save output states and compute total error
        max_error = 0;
        for(var node_id in target){
            saved_output[node_id] = state[node_id];
            error[node_id] = state[node_id]*(1-state[node_id])*(target[node_id]-state[node_id]);
            max_error = Math.abs( target[node_id] - state[node_id] ) > max_error? Math.abs( target[node_id] - state[node_id] ) : max_error;
        }
        //save current input
        for(var i in inputLayer){
            var node_id = inputLayer[i];
            saved_input[node_id] = state[node_id];
        }
    }
    //end of subnetwork update
    for(var node_id in state){
        setState(state[node_id],node_id,userID);
    }
    forwardUpdate(inputLayer,userID);
}

learn(target,user_id){
    //
}


Meteor.methods({

    createContent: function(parameters) {
        var id = Nodes.insert({
            type: "content",
            createdOn: Date.now(),
            name: "Untitled content",
            description: "no description",
            content: {},
            from: {
                need: []
            },
            to: {
                grant: []
            },
            likes: 0,
            dislikes: 0,
            successes: 0,
            attempts: 0
        });
        if( !_.isEmpty(parameters) ){
            Nodes.update({
                _id: id
            }, {
                $set: parameters
            });
        }
        var users = Meteor.users.find().fetch();
        for( var i in users ){
            var userID = users[i];
            setState(1,id,userID);
        }
        return id;
    },

    createConcept: function(parameters) {
        var id = Nodes.insert({
            type: "concept",
            createdOn: Date.now(),
            name: "Untitled concept",
            description: "no description",
            from: {
                need: [],
                grant: []
            },
            to: {
                include: []
            }
        });
        if( !_.isEmpty(parameters) ){
            Nodes.update({
                _id: id
            }, {
                $set: parameters
            });
        }
        var users = Meteor.users.find().fetch();
        for( var i in users ){
            var userID = users[i];
            setState(0,id,userID);
        }
        return id;
    },

    addSet: function(nodeID,list){
    	var set = buildSet(list);
    	var setID = Sets.insert({
    		type: "set",
    		from: { include: [] },
    		to: { need: [nodeID] },
    		set: set
       	});
       	Nodes.update(
       		{
       			_id: nodeID
       		},
       		{
       			$push: { "from.need": setID }
       		}
       	);
        for( var i = 0 ; i < list.length ; i++ ){
            Nodes.update({_id: list[i]},{ $push: {"to.include": setID} });
        }
        var users = Meteor.users.find().fetch();
        for( var i in users ){
            var userID = users[i];
            updateState(nodeID,userID);
            forwardUpdate([nodeID],userID);
        }
        return setID;
    },

    editNode: function(nodeID,parameters){
        Nodes.update({
        	_id: nodeID
        },{
        	$set: parameters
        });
    },

    editSet: function(setID,list){
        var set = buildSet(list);
        Sets.update({
        	_id: setID
        },{
        	$set: { set: set }
        });
        for( var id in set ){
        	Nodes.update({
        		_id: id
        	},{
        		$push: { "to.include": setID },

			});
   		}
        var nodeID = Sets.findOne(setID).to.need[0];
        var users = Meteor.users.find().fetch();
        for( var i in users ){
            var userID = users[i];
            updateState(nodeID,userID);
            forwardUpdate([nodeID],userID);
        }
	},

    removeNode: function(nodeID){
        var node = Nodes.findOne({ _id: nodeID });
        //remove all external references to this node
        Edges.remove({
        		$or: [{ from: nodeID },{ to: nodeID }]
        	});
        if( node.type == "content" ){
        	//remove references in concepts that are granted by this content
        	var grant = node.to.grant;
        	for( var i = 0 ; i < grant.length ; i++ ){
        		var id = grant[i];
        		var grantedBy = Nodes.findOne({ _id: id }).from.grant;
        		removeOcurrences(nodeID,grantedBy);
        		Nodes.update({ _id: id },{
        			$set: { "from.grant": grantedBy }
        		});
        	}
        }
        else if( node.type == "concept" ){
        	//remove references in content that grant by this concept
        	var grant = node.from.grant;
        	for( var i = 0 ; i < grant.length ; i++ ){
        		var id = grant[i];
        		var grants = Nodes.findOne({ _id: id }).to.grant;
        		removeOcurrences(nodeID,grants);
        		Nodes.update({ _id: id },{
        			$set: { "to.grant": grants }
        		});
        	}
        	//remove references in sets that require this concept
        	var include = node.to.include;
            //console.log("include: "+include);
        	for( var i = 0 ; i < include.length ; i++ ){
        		var setID = include[i];
                //var record = Sets.findOne({ _id: setID });
        		var set = Sets.findOne({ _id: setID }).set;
        		delete set[nodeID];
        		var ids = Object.keys(set);
                Meteor.call("editSet",setID,ids);
        		/*set = buildSet(ids);
        		Sets.update({ _id: setID },{
        			$set: { set: set }  //É giro, não é?
        		});*/
        	}
        }
        //remove all requirement sets from this node
        var setIDs = node.from.need;
        for( var i = 0 ; i < setIDs.length ; i++ ){
        	var setID = setIDs[i];
            Meteor.call("removeSet",setID);/*
        	var set = Sets.findOne({ _id: setID }).set;
        	//before removing the set remove all references to this set in subconcepts
        	for( var id in set ){
        		var include = Nodes.findOne(id).to.include;
        		removeOcurrences(setID,include);
        		Nodes.update({
                    _id: id 
                },{ 
                    $push: { "to.include": include }
                });
        	}
        	//then remove the set
        	Sets.remove({ _id: setID });*/
        }
        //and finally dump the node
        Nodes.remove({ _id: nodeID });
    },

    removeSet: function(setID){
        //remove all references to this set in nodes that need it
        var nodeID = Sets.findOne({ _id: setID }).to.need[0];
        var users = Meteor.users.find().fetch();
        for( var i in users ){
            var userID = users[i]._id;
            //ADAPT NETWORK TO MAINTAIN STATE OF nodeID
        }
        var need = Nodes.findOne({ _id: nodeID }).from.need;
        removeOcurrences(setID,need);
        Nodes.update({
        	_id: nodeID
        },{
        	$set: { "from.need": need }
        });
        //remove all references to this set in nodes that were included in it
        var nodeIDs = Sets.findOne({ _id: setID }).set;
        for( var id in nodeIDs ){
            if( id == "bias" ){ continue; }
        	var include = Nodes.findOne({ _id: id }).to.include;
        	removeOcurrences(setID,include);
        	Nodes.update({
        		_id: id
        	},{
        		$set: { "to.include": include }
        	});
        }
        //at last, remove the set
        Sets.remove({ _id: setID });
    },

    getState: function(nodeID,userID){
        return getState(nodeID,userID);
    },

    setState: function(state,nodeID,userID){
        setState(state,nodeID,userID);
    },

    updateState: function(nodeID,userID){
    	return updateState(nodeID,userID);
    },

    setZerothLevel: function(){
        return setZerothLevel();
    },

    updateZerothLevel: function(userID){
        return updateZerothLevel(userID);
    },

    findForwardLayer: function(nodeIDs){
        return findForwardLayer(nodeIDs);
    },

    findBackwardLayer: function(nodeIDs){
        return findBackwardLayer(nodeIDs);
    },

    findForwardTree: function(nodeIDs){
        return findForwardTree(nodeIDs);
    },

    findBackwardTree: function(nodeIDs){
        return findBackwardTree(nodeIDs);
    },

    forwardUpdate: function(newStates,userID){
        return forwardUpdate(newStates,userID);
    },

    oneLayerLearning: function(target,userID){
        return oneLayerLearning(target,userID);
    }

});
