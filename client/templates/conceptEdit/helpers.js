Template.conceptEdit.helpers({
    conceptEditPage: function() {
        var conceptId = FlowRouter.getParam('nodeId');
        var concept = Nodes.findOne({
            _id: conceptId
        }) || {};
        return concept;
    },

    conceptEditSchema: function() {
        return Schema.Concept;
    },
    needs: function() {
        return Session.get('needsObject');
    }
});
