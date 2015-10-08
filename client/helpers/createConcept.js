Template.createConcept.helpers({
    createConceptSchema: function() {
        return Schema.Concept;
    },
    submitting: function() {
        console.log(Session.get("callStatus"));
        return Session.get("callStatus") == "submitting concept";
    }
});