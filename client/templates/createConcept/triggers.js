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
            }
            console.log(needsMappedAsArrayofObjects);
            delete doc.needs;

            var conceptDefinitions = {};
            conceptDefinitions.type = 'concept';
            conceptDefinitions.parameters = doc;
            conceptDefinitions.needs = {};
            conceptDefinitions.needs.concepts = needsMappedAsArrayofObjects;

            var nodeId;
            console.log(conceptDefinitions);
             Meteor.call('create', conceptDefinitions, function(error, result) {
                 nodeId = result;
                 FlowRouter.go('/concept/' + nodeId);
                 //FlowRouter.go('search');
             });
            this.done();
            return false;
        }
    }
});
