Template.createUnit.helpers({
    createUnitSchema: function() {
        return Schema.createUnit;
    },
    /*    requiredConcepts: function() {
            return knowledge.find({
                'class': 'Concept'
            }).fetch();
        },*/
});
Template.createUnitContent.helpers({
    tempContent: function() {
        console.log('entered helper');
        return Session.get('tempContent');
    },
});
