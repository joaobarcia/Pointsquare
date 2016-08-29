AutoForm.hooks({
    createExam: {
        onSubmit: function(doc) {

            var examDefinitions = {}
            examDefinitions.type = 'exam';
            examDefinitions.parameters = doc;
            examDefinitions.contains = doc.exercises;//exercisesMappedAsObject;

            console.log(examDefinitions);

            Meteor.call('create', examDefinitions, function(error, result) {
                nodeId = result;
                FlowRouter.go('/exam/' + nodeId);
                //FlowRouter.go('search');
            });
            this.done();
            return false;
        }
    }
});
