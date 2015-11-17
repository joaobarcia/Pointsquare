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
    set["bias"] = WIDTH * (list.length - 1);
    return set;
}

removeOcurrences = function(item, list) {
    for (var i = list.length; i--;) {
        if (list[i] === item) {
            list.splice(i, 1);
        }
    }
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
    /*
    updateNode = function(nodeID,userID){
    	var state = Edges.findOne({
    		from: userID,
    		to: nodeID
    	}).state;
    	var requirements = Nodes.findOne({ _id: nodeID }).from.need;
    	for( var i = 0 ; i < requirements.length ; i++ ){
    		var setID = requirements[i];
    		var set = Nodes.findOne({ _id: setID }).set;
    		//DEPRECATED!!!!!
    	}
    }

    //getState should only be used for content or concepts!
    getState = function(nodeID,userID){
    	var node = Nodes.findOne({ _id: nodeID });
    	if( node.type == "concept" || node.type == "content" ){
    		var edge = Edges.findOne({
    			from: userID,
    			to: nodeID
    		});
    		if( edge ){ return edge.state; }
    		else{ return 0; }
    	}
    	//if it's content or a concept, compute the activations of its sets and return their maximum activation
    	else if( node.type == "set" ){
    		return computeState(nodeID,userID);
    	}
    }

    //returns the new state of a node
    computeState = function(nodeID,userID){
    	//if it's a set compute it's activation function
    	var node = Nodes.findOne({ _id: nodeID });
    	if( node.type == "set" ){
    		var set = node.set;
    		var arg = 0;
    		for( var id in set ){
    			var weight = set[id];
    			var state = getState(id,userID);
    			arg += weight*state;
    		}
    		return sigmoid(arg);
    	}
    	//if it's content or a concept, compute the activations of its sets and return their maximum activation
    	else if( node.type == "concept" || node.type == "content" ){
    		var requirements = node.from.need;
    		var max = 0;
    		for( var i = 0 ; i < requirements.length ; i++ ){
    			var id = requirements[i];
    			var state = computeState(nodeID,userID);
    			max = state > max ? state : max;
    		}
    		return max;
    	}
    }
    */
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
        Nodes.update({
            _id: id
        }, {
            $set: parameters
        });
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
            Nodes.update({
                _id: id
            }, {
                $set: parameters
            });
            return id;
        }
        /*,

        	"addSet": function(nodeID,list){
        		var set = buildSet(list);
        		var id = Nodes.insert({
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
        				$push: { from.need: setID }
        			}
        		);
        		return id;
        	}

        	"editNode": function(nodeID,parameters){
        		Nodes.update({
        			_id: nodeID
        		},{
        			$set: parameters
        		});
        	},

        	"editSet": function(setID,list){
        		var set = buildSet(list);
        		Nodes.update({
        			_id: setID
        		},{
        			$set: { set: set }
        		});
        		for( var id in set ){
        			Nodes.update({
        				_id: id
        			},{
        				$push: { to.include: setID },

        			});
        		}
        	},

        	"removeNode": function(nodeID){
        		var node = Nodes.find({ _id: nodeID });
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
        					$set: { from.grant: grantedBy }
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
        					$set: { to.grant: grants }
        				});
        			}
        			//remove references in sets that require this concept
        			var include = node.to.include;
        			for( var i = 0 ; i < include.length ; i++ ){
        				var setID = include[i];
        				var set = Nodes.findOne({ _id: setID }).set;
        				delete set[nodeID];
        				var ids = Object.keys(set);
        				set = buildSet(ids);
        				Nodes.update({ _id: setID },{
        					$set: { set: set }  //É giro, não é?
        				});
        			}
        		}
        		//remove all requirement sets from this node
        		var setIDs = node.from.need;
        		for( var i = 0 ; i < setIDs.length ; i++ ){
        			var setID = setIDs[i];
        			var set = Nodes.findOne({ _id: setID }).set;
        			//before removing the set remove all references to this set in subconcepts
        			for( var id in set ){
        				var include = Nodes.findOne({ _id: id }).to.include;
        				removeOcurrences(setID,include);
        				Nodes.update({ _id: id }),{ to.include: include });
        			}
        			//then remove the set
        			Nodes.remove({ _id: setID });
        		}
        		//and finally dump the node
        		Nodes.remove({ _id: nodeID });
        	},

        	"removeSet": function(setID){
        		//remove all references to this set in nodes that need it
        		var nodeID = Nodes.findOne({ _id: setID }).to.need[0];
        		var need = Nodes.findOne({ _id: nodeID }).from.need;
        		removeOcurrences(setID,need);
        		Nodes.update({
        			_id: setID
        		},{
        			$set: { from.need: need }
        		});
        		//remove all references to this set in nodes that were included in it
        		var nodeIDs = Object.keys(Nodes.findOne({ _id: setID }).set);
        		for( var i = 0 ; i < nodeIDs.length ; i++ ){
        			var id = nodeIDs[i];
        			var include = Nodes.findOne({ _id: id }).to.include;
        			removeOcurrences(setID,include);
        			Nodes.update({
        				_id: id
        			},{
        				$set: { to.include: include }
        			});
        		}
        		//at last, remove the set
        		Nodes.remove({ _id: setID });
        	},

        	"updateState": function(nodeID,userID){
        		var state = Edges.findOne({
        			from: userID,
        			to: nodeID
        		}).state;
        		var requirements = Nodes.findOne({ _id: nodeID }).from.need;
        		for( var i = 0 ; i < requirements.length ; i++ ){
        			var setID = requirements[i];
        			var set = Nodes.findOne({ _id: setID }).set;

        		}
        	}
        */
});
