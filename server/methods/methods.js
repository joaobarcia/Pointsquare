//math functions

sigmoid = function(x) {
    return 1. / (1 + Math.exp(-x));
}

inverseSigmoid = function(x) {
    return -Math.log(x / (1 - x));
}

//server variables

MINIMUM_EASY = sigmoid(2);
MINIMUM_MEDIUM = sigmoid(-2);
MAXIMUM_HARD = sigmoid(-4);
WIDTH = 4;

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

//computes the state of the node and saves it to the database
updateState = function(nodeID,userID){
    var node = Nodes.findOne(nodeID);
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
    return state;
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

//find forward tree
findForwardTree = function(nodeID){
    //
}

//find backward tree
findBackwardTree = function(nodeID){
    //
}

//update forward tree
updateForwardTree = function(newStates,userID){
    //
}

backOneStep = function(set, states, errors) {
    //
}

backpropagate = function() {
    //
}

propagate = function() {
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
        /*Nodes.update({
                _id: { $in: list }
            },
            {
                $push: { "to.include": setID }
        });*/
        for( var i = 0 ; i < list.length ; i++ ){
            Nodes.update({_id: list[i]},{ $push: {"to.include": setID} });
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
            console.log("include: "+include);
        	for( var i = 0 ; i < include.length ; i++ ){
        		var setID = include[i];
        		var set = Sets.findOne({ _id: setID }).set;
        		delete set[nodeID];
        		var ids = Object.keys(set);
        		set = buildSet(ids);
        		Sets.update({ _id: setID },{
        			$set: { set: set }  //É giro, não é?
        		});
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
        //console.log("dentro "+Sets.findOne({ _id: setID }).to.need);
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
    }

});
