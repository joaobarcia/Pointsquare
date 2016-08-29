Template.conceptEdit.helpers({

    conceptEditPage: function() {
        var conceptId = FlowRouter.getParam('conceptId');
        var concept = Nodes.findOne({
            _id: conceptId
        }) || {};
        return concept;
    },

    conceptEditSchema: function() {
        return Schema.Concept;
    },

    neededConcepts: function() {
        var nodeId = FlowRouter.getParam('conceptId');
        console.log(nodeId);
        var needs = {};
        Meteor.call("getNeeds", nodeId, function(e, r) {
            if (typeof r !== "undefined") {
                console.log(r);
                Session.set("needs", r.sets)
            };
        });
        needs = Session.get("needs");
        var neededSetsOfConceptsArray = Object.keys(needs);
        return neededSetsOfConceptsArray;
    },
    subConceptsOf: function(setOfConceptsID) {
        var setId = setOfConceptsID;
        var subConcepts = {};
        var needs = Session.get("needs");
        if (typeof needs !== "undefined") {
            var subConceptIds = Object.keys(needs[setId]);
            var subConcepts = Nodes.find({
                "_id": {
                    "$in": subConceptIds
                }
            }).fetch();
        }
        return subConcepts;
    },

});
