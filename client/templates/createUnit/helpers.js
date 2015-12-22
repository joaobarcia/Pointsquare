Template.createUnit.helpers({
    createUnitSchema: function() {
        return Schema.Unit;
    },
    // Test
    concepts: function() {
        return Nodes.find({}).fetch();
    },
    /*conceptsMappedToSelectize: function() {
        function nameAndRID(n) {
            var newObject = {};
            newObject.label = n.name;
            newObject.value = n._id;
            return newObject;
        };

        var conceptsMappedToSelectize = lodash.map(Nodes.find({
            type: 'concept'
        }).fetch(), nameAndRID);
        console.log(conceptsMappedToSelectize);
        return conceptsMappedToSelectize;
    },*/
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
