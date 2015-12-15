AutoForm.hooks({
    createConcept: {
        onSubmit: function(doc) {
            Meteor.call('createConcept', doc);

            this.done();
            return false;
        }
    }
});
