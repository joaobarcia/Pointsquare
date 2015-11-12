Meteor.methods[{

	"createContent": function(parameters){
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
		Nodes.update({_id: id},{
			$set: parameters
		});
		return id;
	},

	"createConcept": function(parameters){
		var id = Nodes.insert({
			type: "concept",
			createdOn: Date.now(),
			name: "Untitled content",
			description: "no description",
			from: {
				need: [],
				grant: []
			},
			to: {
				include: []
			}
		});
		Nodes.update({_id: id},{
			$set: parameters
		});
		return id;
	},

	"addSet": function(nodeID,list){
		var set = buildSet(list);
		var id = Nodes.insert({
			type: "set",
			from: {
				include: []
			},
			to: {
				need: [nodeID]
			},
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
			set = set
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
	}

}]