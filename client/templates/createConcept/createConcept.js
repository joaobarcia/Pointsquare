AutoForm.hooks({
    createConcept: {
        onSubmit: function(doc) {
            var properties = {};
            properties.name = escape(doc.name); // fetch autoform input as necessary by createUnit method(properties, necessary, granted)
            properties.description = "";
            if (typeof doc.description != "undefined") { // in case description has not been filled, leave blank
                properties.description = escape(doc.description);
            };

            var childConcepts = {};
            _.forEach(doc.childConcepts, function(n) {
                childConcepts[n] = 1
            });

            var childConceptsArray = [];
            childConceptsArray.push(childConcepts);

            Session.set("callStatus", "submitting concept");
            Meteor.call('createConcept', properties, childConceptsArray, function(error, result) {
                console.log(result);
                Session.set("callStatus", "submitted");
                Router.go('/concept/' + encodeURIComponent(result));
            });

            this.done();
            return false;
        }
    }
});
