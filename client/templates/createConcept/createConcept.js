AutoForm.hooks({
    createConcept: {
        onSubmit: function(doc) {
            var properties = {};
            properties.name = "'" + doc.name + "'"; // fetch autoform input as necessary by createUnit method(properties, necessary, granted)
            properties.description = "''"; // create empty string with extra quotes for OrientDB parsing
            if (typeof doc.description != "undefined") { // in case description has not been filled, leave blank
                properties.description = "'" + doc.description + "'";
            };

            var childConcepts = {};
            _.forEach(doc.childConcepts, function(n) {
                childConcepts[n] = 1
            });

            var childConceptsArray = [];
            childConceptsArray.push(childConcepts);

            Meteor.call('createConcept', properties, childConceptsArray);

            this.done();
            return false;
        }
    }
});
