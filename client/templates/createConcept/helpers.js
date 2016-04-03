Template.createConcept.helpers({
    createConceptSchema: function() {
        return Schema.Concept;
    },
    concepts: function() {
        return Nodes.find({}).fetch();
    },
});
