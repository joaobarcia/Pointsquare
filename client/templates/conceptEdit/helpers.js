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
    conceptEditDoc: function() {
        // load stored concept values and pass them with necessary modif to autoform doc 'conceptEditDoc'
        var conceptEditDoc = {};
        conceptEditDoc.name = Template.currentData().name;
        conceptEditDoc.description = Template.currentData().description;


        conceptEditDoc.childConcepts = _.pluck(Template.currentData().contains, 'rid');

        return conceptEditDoc;
    },
    needs: function() {
        var id = FlowRouter.getParam('conceptId');
        var requirements = Requirements.find({node: id});
        var json = [];
        for(var i = 0; i < requirements.length; i++){
            var requirement = requirements[i];
            var requirementId = requirement._id;
            var info = Personal.findOne({node:requirementId});
            var state = info? info.state : 0;
            var contains = [];
            var subconcepts = requirement.weights;
            for(var subconceptId in subconcepts){
                var subObj = {};
                var subconcept = Nodes.findOne(subconceptId);
                subObj["_id"] = subconceptId;
                subObj["name"] = subconcept.name;
                subObj["description"] = subconcept.description;
                var subinfo = Personal.findOne({node:subconceptId,user:Meteor.userId()});
                var substate = subinfo? subinfo.state : 0;
                contains.push(subObj);
            }
            var obj = {};
            obj["_id"] = requirementId;
            obj["state"] = state;
            obj["contains"] = contains;
            json.push(obj);
        }
        return json;
    }
});
