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
    /*    conceptEditDoc: function() {
            // load stored concept values and pass them with necessary modif to autoform doc 'conceptEditDoc'
            var conceptEditDoc = {};
            conceptEditDoc.name = Template.currentData().name;
            conceptEditDoc.description = Template.currentData().description;


            conceptEditDoc.childConcepts = _.pluck(Template.currentData().contains, 'rid');

            return conceptEditDoc;
        },*/
    needs: function() {
        return Session.get('needsObject');
    }
});
