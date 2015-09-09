Template.suggestedContent.helpers({

	unit: function(){
		var user_rid = Session.get('currentUserRID');
		var query = { "class" : "Unit"};
		query['user_dependent_info.' + user_rid + '.state'] = {$gt: 0.8};
		query['user_dependent_info.' + user_rid + '.prospect'] = {$gt: 0.3};
		var sort = {};
		sort['user_dependent_info.' + user_rid + '.prospect'] = -1;
      	return knowledge.find(query,sort);
	}

});

Template.acquiredConcepts.helpers({

	// concept: function () {
	// 	var user_rid = Session.get('currentUserRID');
	// 	console.log(people.findOne({rid:user_rid}).mind);
 //      	var temp = _.chain( people.findOne({rid:user_rid}).mind )
 //        	.sortBy(function(c){ return -c.state; })  // sort the concepts by ascending state
 //        	.map(function(c) {
 //          		var concept_rid = c.rid; //RID of the concept
 //          		var name = knowledge.findOne({rid:concept_rid}).name; //name of the concept
 //          		return {name: name, state: c.state};
 //        	})
 //        	.value();
 //        console.log(temp);
 //      	return temp;
 //    }

    concept: function () {
		var user_rid = Session.get('currentUserRID');
		var query = { "class" : "Concept"};
		query['user_dependent_info.' + user_rid + '.state'] = {$gt: 0.8};
		var sort = { name : 1 };
      	return knowledge.find(query,sort);
    }

});