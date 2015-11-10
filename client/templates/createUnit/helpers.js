Template.createUnit.helpers({
    createUnitSchema: function() {
        return Schema.Unit;
    },
    /*
        submitting: function() {
            console.log(Session.get("callStatus"));
            return Session.get("callStatus") == "submitting unit";
        },*/
    /*    requiredConcepts: function() {
            return knowledge.find({
                'class': 'Concept'
            }).fetch();
        },*/
});
Template.createUnitContent.helpers({
    tempContent: function() {
        return Session.get('tempContent');
    },
});
