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

    needs: function() {
        var nodeId = FlowRouter.getParam('contentId');
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
    }
    
});
