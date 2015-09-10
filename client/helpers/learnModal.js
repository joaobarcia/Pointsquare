Template.learnModal.helpers({

	'waiting': function(){
		if( Session.get('callStatus') == 'learning' ){ return true; }
		else{ return false; }
	},

    'learnedConcept': function() {
    	var newConcepts = Session.get('newConcepts');
    	console.log( knowledge.find({ 'rid':{$in:newConcepts} }).fetch() );
        return knowledge.find({ 'rid':{$in:newConcepts} }, {limit: 3});
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },

	'activatedUnit': function() {
    	var newConcepts = Session.get('newUnits');
        return knowledge.find({ 'rid':{$in:newUnits} }, {limit: 3});
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },

    'unlearnedConcept': function() {
    	var lostConcepts = Session.get('lostConcepts');
        return knowledge.find({ 'rid':{$in:lostConcepts} }, {limit: 3});
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },

    'deactivatedUnit': function() {
    	var newConcepts = Session.get('newConcepts');
        return knowledge.find({ 'rid':{$in:newConcepts} }, {limit: 3});
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    }

});
