AutoForm.hooks({
    createExam: {
        onSubmit: function(doc) {

            var examDefinitions = {}
            examDefinitions.type = 'exam';
            examDefinitions.contains = doc.exercises;//exercisesMappedAsObject;
            delete doc.exercises;
            examDefinitions.parameters = doc;


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
