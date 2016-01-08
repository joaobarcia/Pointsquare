Template.createConcept.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('allConcepts');
    });
});

AutoForm.hooks({
    createConcept: {
        onSubmit: function(doc) {
            var needsMappedAsArrayofObjects = [];
            if (doc.needs != null) {
                for (var i = 0; i < doc.needs.length; i += 1) {
                    needsMappedAsArrayofObjects[i] = {};
                    for (var n = 0; n < doc.needs[i].length; n += 1) {
                        needsMappedAsArrayofObjects[i][doc.needs[i][n]] = true;
                    }
                }
            };
            delete doc.needs;

            var conceptDefinitions = {};
            conceptDefinitions.type = 'concept';
            conceptDefinitions.parameters = doc;
            conceptDefinitions.needs = needsMappedAsArrayofObjects;

            console.log(conceptDefinitions);

            var nodeId;
            Meteor.call('create', conceptDefinitions, function(error, result) {
                nodeId = result;
                FlowRouter.go('/concept/' + nodeId);
            });
            this.done();
            return false;
        }
    }
});
